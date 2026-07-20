import React, { useEffect, useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, Download } from 'lucide-react-native';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { Colors } from '../constants/Colors';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import {
    WORK_CATEGORIES,
    WORK_CATEGORY_HINTS,
    WORK_CATEGORY_LABELS,
    WorkCategory,
    defaultCategoryFor,
} from '../content/myWork';
import { HabitStackActivity } from '../content/habitStack';

interface WorkEntry {
    id: string;
    activity: HabitStackActivity;
    text: string;
    category: WorkCategory;
    createdAt: { toDate?: () => Date } | null;
    startedAt: number | null;
}

type FilterKey = 'all' | WorkCategory;

const FILTER_KEYS: FilterKey[] = ['all', ...WORK_CATEGORIES];

export default function MyWorkScreen() {
    useProtectedRoute();
    const router = useRouter();
    const { user } = useAuth();
    const [entries, setEntries] = useState<WorkEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterKey>('all');

    useEffect(() => {
        if (!user) {
            setEntries([]);
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'users', user.uid, 'reflections'),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const list: WorkEntry[] = [];
            snap.forEach((d) => {
                const data = d.data();
                list.push({
                    id: d.id,
                    activity: (data.activity as HabitStackActivity) || 'Journaling',
                    text: data.text || '',
                    category: (data.category as WorkCategory)
                        || defaultCategoryFor((data.activity as HabitStackActivity) || 'Journaling'),
                    createdAt: data.createdAt || null,
                    startedAt: typeof data.startedAt === 'number' ? data.startedAt : null,
                });
            });
            setEntries(list);
            setLoading(false);
        }, (err) => {
            console.warn('MyWork snapshot error:', err);
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    const filtered = useMemo(() => {
        if (filter === 'all') return entries;
        return entries.filter((e) => e.category === filter);
    }, [entries, filter]);

    const counts = useMemo(() => {
        const c: Record<FilterKey, number> = {
            all: entries.length,
            'insight-diary': 0,
            'insightful-notes': 0,
            'inspiring-messages': 0,
            'self-advice': 0,
        };
        for (const e of entries) c[e.category] = (c[e.category] || 0) + 1;
        return c;
    }, [entries]);

    const handleDelete = (entry: WorkEntry) => {
        if (!user) return;
        const confirmDelete = async () => {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'reflections', entry.id));
            } catch (e) {
                console.warn('Failed to delete entry:', e);
            }
        };
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && window.confirm('Delete this entry? This cannot be undone.')) {
                confirmDelete();
            }
        } else {
            Alert.alert('Delete this entry?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: confirmDelete },
            ]);
        }
    };

    const handleExport = async () => {
        const label = filter === 'all' ? 'All work' : WORK_CATEGORY_LABELS[filter];
        const body = filtered
            .map((e) => {
                const when = e.createdAt?.toDate ? e.createdAt.toDate().toLocaleString()
                    : e.startedAt ? new Date(e.startedAt).toLocaleString()
                        : '(no date)';
                return `${when}\n[${WORK_CATEGORY_LABELS[e.category]} · ${e.activity}]\n${e.text}\n`;
            })
            .join('\n---\n\n');
        const preface = `${label} · ${filtered.length} entries\n\n`;
        try {
            await Share.share({
                title: `My Work — ${label}`,
                message: preface + (body || '(No entries in this filter.)'),
            });
        } catch (e) {
            console.warn('Share failed:', e);
        }
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleGroup}>
                    <BookOpen size={16} color="#FFD700" />
                    <Text style={styles.headerTitle}>My Work</Text>
                </View>
                <TouchableOpacity onPress={handleExport} style={styles.exportBtn} disabled={filtered.length === 0}>
                    <Download size={16} color={filtered.length === 0 ? 'rgba(255,255,255,0.3)' : '#FFD700'} />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterRow}
                contentContainerStyle={styles.filterScroll}
            >
                {FILTER_KEYS.map((key) => {
                    const isActive = filter === key;
                    const label = key === 'all' ? 'All' : WORK_CATEGORY_LABELS[key];
                    return (
                        <TouchableOpacity
                            key={key}
                            onPress={() => setFilter(key)}
                            style={[styles.filterPill, isActive && styles.filterPillActive]}
                        >
                            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                {label}
                            </Text>
                            <Text style={[styles.filterCount, isActive && styles.filterTextActive]}>
                                {counts[key] ?? 0}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {filter !== 'all' && (
                <Text style={styles.filterHint}>
                    {WORK_CATEGORY_HINTS[filter as WorkCategory]}
                </Text>
            )}

            <ScrollView contentContainerStyle={styles.list}>
                {loading ? (
                    <View style={styles.stateBox}>
                        <ActivityIndicator color="#FFD700" />
                    </View>
                ) : filtered.length === 0 ? (
                    <View style={styles.stateBox}>
                        <Text style={styles.emptyTitle}>Nothing here yet</Text>
                        <Text style={styles.emptyBody}>
                            Your Journaling, Poetry, Gratitude, and Day Planning entries land here — sorted by the category you pick.
                        </Text>
                    </View>
                ) : (
                    filtered.map((e) => {
                        const when = e.createdAt?.toDate ? e.createdAt.toDate() : (e.startedAt ? new Date(e.startedAt) : null);
                        return (
                            <View key={e.id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{WORK_CATEGORY_LABELS[e.category]}</Text>
                                    </View>
                                    <Text style={styles.cardMeta}>
                                        {e.activity}{when ? ` · ${when.toLocaleDateString()}` : ''}
                                    </Text>
                                </View>
                                <Text style={styles.cardBody}>{e.text}</Text>
                                <TouchableOpacity onPress={() => handleDelete(e)} style={styles.deleteBtn}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerTitle: {
        color: Colors.text,
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    backText: {
        color: Colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
    exportBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,215,0,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
    },
    filterRow: {
        maxHeight: 44,
    },
    filterScroll: {
        gap: 8,
        paddingVertical: 4,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    filterPillActive: {
        backgroundColor: 'rgba(255,215,0,0.2)',
        borderColor: '#FFD700',
    },
    filterText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontWeight: '600',
    },
    filterCount: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
    },
    filterTextActive: {
        color: '#FFF8DC',
    },
    filterHint: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 8,
        marginBottom: 4,
    },
    list: {
        paddingTop: 12,
        paddingBottom: 40,
    },
    stateBox: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    emptyTitle: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    emptyBody: {
        color: Colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
    card: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.4)',
        backgroundColor: 'rgba(255,215,0,0.12)',
    },
    badgeText: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    cardMeta: {
        color: Colors.textSecondary,
        fontSize: 11,
    },
    cardBody: {
        color: Colors.text,
        fontSize: 14,
        lineHeight: 21,
    },
    deleteBtn: {
        marginTop: 10,
        alignSelf: 'flex-end',
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    deleteText: {
        color: '#E57373',
        fontSize: 12,
        fontWeight: '600',
    },
});
