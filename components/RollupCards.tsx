import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wind, Sparkles } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useHistory, HistoryItem } from '../hooks/useHistory';

/**
 * RollupCards — "This week / This month" numeric summaries for the Dashboard.
 * Complements TrendCards (which shows shape); rollups answer "how much."
 *
 * Metrics per period:
 *   - BE Pauses completed
 *   - Habit-stack sessions completed
 *   - Total minutes across both
 *   - Average per-session HR delta (if any Pause carried biofeedback)
 *
 * Week starts Sunday (local). Month starts on the 1st (local).
 */
export function RollupCards() {
    const { items, loading } = useHistory(200);

    const { week, month } = useMemo(() => bucketize(items), [items]);

    if (loading && items.length === 0) return null;

    return (
        <View style={styles.wrap}>
            <Text style={styles.header}>This Week & Month</Text>
            <View style={styles.row}>
                <RollupCard title="This Week" period={week} accent="#F2C94C" />
                <RollupCard title="This Month" period={month} accent="#B7E4C7" />
            </View>
        </View>
    );
}

function RollupCard({
    title,
    period,
    accent,
}: {
    title: string;
    period: RollupPeriod;
    accent: string;
}) {
    const totalMin = Math.round(period.totalSeconds / 60);
    const hrDeltaStr = period.hrDeltaCount > 0
        ? `${period.hrDeltaAvg > 0 ? '+' : ''}${period.hrDeltaAvg.toFixed(1)} bpm`
        : '—';
    const hrImproving = period.hrDeltaCount > 0 && period.hrDeltaAvg < 0;

    return (
        <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: accent }]}>{title}</Text>
            <View style={styles.metricRow}>
                <View style={styles.metricIcon}>
                    <Wind size={12} color={accent} />
                </View>
                <Text style={styles.metricValue}>{period.pauseCount}</Text>
                <Text style={styles.metricLabel}>BE Pause{period.pauseCount === 1 ? '' : 's'}</Text>
            </View>
            <View style={styles.metricRow}>
                <View style={styles.metricIcon}>
                    <Sparkles size={12} color={accent} />
                </View>
                <Text style={styles.metricValue}>{period.habitCount}</Text>
                <Text style={styles.metricLabel}>habit stack{period.habitCount === 1 ? '' : 's'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.footRow}>
                <Text style={styles.footLabel}>Total time</Text>
                <Text style={[styles.footValue, { color: accent }]}>{totalMin} min</Text>
            </View>
            <View style={styles.footRow}>
                <Text style={styles.footLabel}>Avg ΔHR</Text>
                <Text style={[
                    styles.footValue,
                    { color: hrImproving ? '#4A9977' : accent },
                ]}>{hrDeltaStr}</Text>
            </View>
        </View>
    );
}

interface RollupPeriod {
    pauseCount: number;
    habitCount: number;
    totalSeconds: number;
    hrDeltaAvg: number;
    hrDeltaCount: number;
}

function emptyPeriod(): RollupPeriod {
    return { pauseCount: 0, habitCount: 0, totalSeconds: 0, hrDeltaAvg: 0, hrDeltaCount: 0 };
}

// Bucket items into "this week" (since Sunday) and "this month" (since 1st).
function bucketize(items: HistoryItem[]): { week: RollupPeriod; month: RollupPeriod } {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const week = emptyPeriod();
    const month = emptyPeriod();
    let weekHrSum = 0, monthHrSum = 0;

    for (const it of items) {
        const t = it.completedAt.getTime();
        const inMonth = t >= monthStart.getTime();
        const inWeek = t >= weekStart.getTime();
        if (!inMonth) continue;

        const touchPeriod = (p: RollupPeriod, hrSumIncrement: (n: number) => void) => {
            if (it.kind === 'be-pause') p.pauseCount++;
            else p.habitCount++;
            p.totalSeconds += it.durationSeconds;
            if (it.kind === 'be-pause' && it.biofeedback && Number.isFinite(it.biofeedback.hrChange)) {
                hrSumIncrement(it.biofeedback.hrChange);
                p.hrDeltaCount++;
            }
        };

        touchPeriod(month, (n) => { monthHrSum += n; });
        if (inWeek) touchPeriod(week, (n) => { weekHrSum += n; });
    }

    if (week.hrDeltaCount > 0) week.hrDeltaAvg = weekHrSum / week.hrDeltaCount;
    if (month.hrDeltaCount > 0) month.hrDeltaAvg = monthHrSum / month.hrDeltaCount;
    return { week, month };
}

const styles = StyleSheet.create({
    wrap: { gap: 10 },
    header: {
        color: Colors.secondary,
        fontSize: 11,
        letterSpacing: 1.2,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4,
        paddingLeft: 4,
    },
    row: { flexDirection: 'row', gap: 10 },
    card: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    metricRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
        marginBottom: 6,
    },
    metricIcon: {
        width: 18, height: 18, borderRadius: 9,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
    },
    metricValue: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: '800',
    },
    metricLabel: {
        color: Colors.textSecondary,
        fontSize: 11,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginVertical: 8,
    },
    footRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 2,
    },
    footLabel: {
        color: Colors.textSecondary,
        fontSize: 11,
    },
    footValue: {
        fontSize: 13,
        fontWeight: '700',
    },
});
