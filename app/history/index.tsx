import React, { useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Heart, Wind, Download, Filter } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useHistory, HistoryItem } from '../../hooks/useHistory';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

type FilterKey = 'all' | 'be-pause' | 'habit-stack';

const FILTER_LABELS: Record<FilterKey, string> = {
    all: 'All',
    'be-pause': 'BE Pauses',
    'habit-stack': 'Habit Stack',
};

export default function HistoryScreen() {
    useProtectedRoute();
    const router = useRouter();
    const { items, loading } = useHistory(200);
    const [filter, setFilter] = useState<FilterKey>('all');

    const filtered = useMemo(
        () => filter === 'all' ? items : items.filter((i) => i.kind === filter),
        [items, filter]
    );

    // Group by date label ("Today", "Yesterday", or MM/DD).
    const grouped = useMemo(() => groupByDay(filtered), [filtered]);

    const handleExport = async () => {
        const lines: string[] = ['BE333 · Session History', ''];
        for (const [label, group] of grouped) {
            lines.push(`── ${label} ──`);
            for (const it of group) {
                const t = it.completedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                if (it.kind === 'be-pause') {
                    const mins = Math.round(it.durationSeconds / 60);
                    const bio = it.biofeedback
                        ? ` · HR ${it.biofeedback.startHR}→${it.biofeedback.endHR} (Δ ${it.biofeedback.hrChange > 0 ? '+' : ''}${it.biofeedback.hrChange.toFixed(1)})`
                        : '';
                    lines.push(`${t} · BE Pause · ${mins} min · Stage ${it.practiceStage || '333'}${bio}`);
                } else {
                    const mins = Math.round(it.durationSeconds / 60);
                    lines.push(`${t} · ${it.activity} · ${mins} min`);
                }
            }
            lines.push('');
        }
        try {
            await Share.share({ title: 'BE333 History', message: lines.join('\n') });
        } catch { /* cancelled */ }
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>History</Text>
                <TouchableOpacity
                    onPress={handleExport}
                    style={styles.exportBtn}
                    disabled={filtered.length === 0}
                >
                    <Download size={16} color={filtered.length === 0 ? 'rgba(255,255,255,0.3)' : Colors.secondary} />
                </TouchableOpacity>
            </View>

            {/* Filter chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterRow}
                contentContainerStyle={styles.filterScroll}
            >
                {(Object.keys(FILTER_LABELS) as FilterKey[]).map((k) => {
                    const active = filter === k;
                    const count = k === 'all' ? items.length : items.filter((i) => i.kind === k).length;
                    return (
                        <TouchableOpacity
                            key={k}
                            onPress={() => setFilter(k)}
                            style={[styles.chip, active && styles.chipActive]}
                        >
                            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                {FILTER_LABELS[k]}
                            </Text>
                            <Text style={[styles.chipCount, active && styles.chipCountActive]}>{count}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {loading ? (
                    <View style={styles.stateBox}>
                        <ActivityIndicator color={Colors.secondary} />
                    </View>
                ) : filtered.length === 0 ? (
                    <View style={styles.stateBox}>
                        <Text style={styles.emptyTitle}>No history yet</Text>
                        <Text style={styles.emptyBody}>
                            Your completed BE Pauses and habit-stack sessions show up here — reverse chronological, tap any row for detail.
                        </Text>
                    </View>
                ) : (
                    grouped.map(([label, group]) => (
                        <View key={label}>
                            <Text style={styles.dayHeader}>{label}</Text>
                            {group.map((it) => (
                                <HistoryRow
                                    key={it.id}
                                    item={it}
                                    onOpen={() => {
                                        if (it.kind === 'be-pause') {
                                            router.push({ pathname: '/history/[id]', params: { id: it.id } });
                                        }
                                    }}
                                />
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

function HistoryRow({ item, onOpen }: { item: HistoryItem; onOpen: () => void }) {
    const time = item.completedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const mins = Math.max(1, Math.round(item.durationSeconds / 60));
    const isPause = item.kind === 'be-pause';
    const hasBio = isPause && !!item.biofeedback;

    return (
        <TouchableOpacity onPress={onOpen} style={styles.row} activeOpacity={0.7}>
            <View style={[styles.rowIcon, isPause ? styles.rowIconPause : styles.rowIconHabit]}>
                {isPause
                    ? <Wind size={16} color={Colors.secondary} />
                    : <Text style={styles.rowIconEmoji}>{activityEmoji(item.activity)}</Text>}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>
                    {isPause ? `BE Pause · ${mins} min` : `${item.activity} · ${mins} min`}
                </Text>
                <Text style={styles.rowMeta}>
                    {time}{isPause && item.practiceStage ? ` · Stage ${item.practiceStage}` : ''}
                </Text>
                {hasBio && item.biofeedback && (
                    <View style={styles.bioRow}>
                        <Heart size={11} color="#FF6B6B" fill="#FF6B6B" />
                        <Text style={styles.bioText}>
                            {item.biofeedback.startHR}→{item.biofeedback.endHR} bpm
                            {' '}
                            <Text style={{ color: item.biofeedback.hrChange < 0 ? '#4A9977' : Colors.textSecondary }}>
                                (Δ {item.biofeedback.hrChange > 0 ? '+' : ''}{item.biofeedback.hrChange.toFixed(1)})
                            </Text>
                        </Text>
                        {item.biofeedback.avgHRV > 0 && (
                            <Text style={[styles.bioText, { marginLeft: 8 }]}>
                                HRV {item.biofeedback.avgHRV.toFixed(0)} ms
                            </Text>
                        )}
                    </View>
                )}
            </View>
            {isPause && <ChevronRight size={18} color={Colors.textSecondary} />}
        </TouchableOpacity>
    );
}

function activityEmoji(activity?: string): string {
    switch (activity) {
        case 'Yoga': return '🧘';
        case 'Chanting': return '🕉';
        case 'Singing': return '🎵';
        case 'Journaling': return '📓';
        case 'Stretching': return '🤸';
        case 'Gratitude': return '🌻';
        case 'Poetry': return '✒️';
        case 'Day Planning': return '📅';
        case 'Prayer': return '🙏';
        case 'Mantra': return '🪷';
        default: return '•';
    }
}

// Group history items by day-of-week label. Preserves reverse-chronological order.
function groupByDay(items: HistoryItem[]): Array<[string, HistoryItem[]]> {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

    const labelFor = (d: Date): string => {
        const day = new Date(d); day.setHours(0, 0, 0, 0);
        if (day.getTime() === today.getTime()) return 'Today';
        if (day.getTime() === yesterday.getTime()) return 'Yesterday';
        return day.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const buckets = new Map<string, HistoryItem[]>();
    for (const it of items) {
        const label = labelFor(it.completedAt);
        if (!buckets.has(label)) buckets.set(label, []);
        buckets.get(label)!.push(it);
    }
    return Array.from(buckets.entries());
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background, padding: 14 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    backBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingVertical: 6, paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    backText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
    headerTitle: { color: Colors.text, fontSize: 17, fontWeight: '700' },
    exportBtn: {
        padding: 8, borderRadius: 8,
        backgroundColor: 'rgba(225,183,37,0.1)',
        borderWidth: 1, borderColor: 'rgba(225,183,37,0.3)',
    },

    filterRow: { maxHeight: 44, marginBottom: 4 },
    filterScroll: { gap: 8, paddingVertical: 4 },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingVertical: 7, paddingHorizontal: 12,
        borderRadius: 16, borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.3)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    chipActive: {
        backgroundColor: 'rgba(225,183,37,0.2)',
        borderColor: Colors.secondary,
    },
    chipText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600' },
    chipTextActive: { color: '#FFF8DC' },
    chipCount: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
    chipCountActive: { color: '#FFF8DC' },

    dayHeader: {
        color: Colors.secondary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: 18,
        marginBottom: 6,
        paddingLeft: 4,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginBottom: 8,
    },
    rowIcon: {
        width: 34, height: 34, borderRadius: 17,
        alignItems: 'center', justifyContent: 'center',
    },
    rowIconPause: {
        backgroundColor: 'rgba(225,183,37,0.15)',
        borderWidth: 1, borderColor: 'rgba(225,183,37,0.35)',
    },
    rowIconHabit: {
        backgroundColor: 'rgba(74,153,119,0.15)',
        borderWidth: 1, borderColor: 'rgba(74,153,119,0.35)',
    },
    rowIconEmoji: { fontSize: 15 },
    rowTitle: { color: Colors.text, fontSize: 14, fontWeight: '600' },
    rowMeta: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
    bioRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    bioText: { color: Colors.textSecondary, fontSize: 11 },

    stateBox: { paddingVertical: 60, paddingHorizontal: 20, alignItems: 'center' },
    emptyTitle: {
        color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 6,
    },
    emptyBody: {
        color: Colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20,
    },
});
