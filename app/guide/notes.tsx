import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, StickyNote, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useAllClientNotes, useUserRole } from '../../hooks/useBeGuide';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

// Guide-side: recent notes across the entire roster on one screen.
// Tap a row to jump to that client's detail page for full editing.
export default function GuideNotesList() {
    useProtectedRoute();
    const router = useRouter();
    const role = useUserRole();
    const isGuide = role === 'therapist';
    const { notes, loading } = useAllClientNotes(isGuide);

    if (role === 'loading') {
        return (
            <View style={styles.wrapper}>
                <ActivityIndicator color={Colors.secondary} />
            </View>
        );
    }

    if (!isGuide) {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyBody}>Guide-only area.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/guide')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Guide</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recent Notes</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator color={Colors.secondary} />
                    </View>
                ) : notes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <StickyNote size={32} color={Colors.textSecondary} />
                        <Text style={styles.emptyTitle}>No notes yet</Text>
                        <Text style={styles.emptyBody}>
                            Notes you write on any client's detail page will collect here.
                            Notes are private — only you can see them.
                        </Text>
                    </View>
                ) : (
                    notes.map((n) => {
                        const when = n.updatedAt
                            ? relativeWhen(n.updatedAt)
                            : '';
                        return (
                            <TouchableOpacity
                                key={n.clientUid}
                                style={styles.row}
                                onPress={() => router.push({ pathname: '/guide/[uid]', params: { uid: n.clientUid } })}
                                activeOpacity={0.75}
                            >
                                <View style={styles.iconWrap}>
                                    <StickyNote size={16} color={Colors.secondary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.rowHeader}>
                                        <Text style={styles.clientName} numberOfLines={1}>{n.clientDisplayName}</Text>
                                        <Text style={styles.when}>{when}</Text>
                                    </View>
                                    <Text style={styles.notePreview} numberOfLines={3}>{n.text}</Text>
                                </View>
                                <ChevronRight size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

// Compact "2h ago / 3d ago / Mar 5" formatter.
function relativeWhen(d: Date): string {
    const diffMs = Date.now() - d.getTime();
    const min = Math.round(diffMs / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.round(hr / 24);
    if (day < 7) return `${day}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background, padding: 14 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
    },
    backBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingVertical: 6, paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    backText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
    headerTitle: { color: Colors.text, fontSize: 17, fontWeight: '700' },
    centered: { paddingVertical: 40, alignItems: 'center' },

    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginBottom: 8,
    },
    iconWrap: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(225,183,37,0.15)',
        borderWidth: 1, borderColor: 'rgba(225,183,37,0.35)',
        marginTop: 2,
    },
    rowHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 4,
    },
    clientName: { color: Colors.text, fontSize: 14, fontWeight: '700', flex: 1, paddingRight: 8 },
    when: { color: Colors.textSecondary, fontSize: 11 },
    notePreview: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 18 },

    emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
    emptyTitle: {
        color: Colors.text, fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 6,
    },
    emptyBody: {
        color: Colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20,
    },
});
