import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { useHistory, useRecentEma } from '../hooks/useHistory';

/**
 * TrendCards — long-arc trend visualization for the Dashboard.
 *
 * Draws three sparklines from the user's recent history:
 *   1. Average HR per BE Pause (last N sessions)
 *   2. Average HRV per BE Pause (last N sessions)
 *   3. EMA mood score over time (better = 1, same = 0, worse = -1)
 *
 * Each sparkline shows the last 12 data points. Cards degrade gracefully
 * to empty-state hints if there are fewer than 2 points to draw a line.
 */
export function TrendCards() {
    const { items } = useHistory(60);
    const { entries: emaEntries } = useRecentEma(30);

    const bePauses = useMemo(
        () => items.filter((i) => i.kind === 'be-pause' && i.biofeedback).slice(0, 12).reverse(),
        [items]
    );

    const hrPoints = bePauses.map((s) => s.biofeedback!.avgHR);
    const hrvPoints = bePauses.filter((s) => (s.biofeedback?.avgHRV || 0) > 0).map((s) => s.biofeedback!.avgHRV);

    const moodPoints = useMemo(() => {
        const map: Record<string, number> = { better: 1, same: 0, worse: -1 };
        return [...emaEntries]
            .reverse()
            .slice(-12)
            .map((e) => map[e.mood] ?? 0);
    }, [emaEntries]);

    return (
        <View style={styles.wrap}>
            <Text style={styles.header}>Trends</Text>

            <TrendCard
                title="Heart Rate"
                subtitle="Avg per session"
                unit="bpm"
                color="#F2C94C"
                points={hrPoints}
                lastLabel={hrPoints.length ? `${Math.round(hrPoints[hrPoints.length - 1])}` : null}
                improving={
                    hrPoints.length >= 2
                        ? hrPoints[hrPoints.length - 1] < hrPoints[0]
                        : null
                }
            />

            <TrendCard
                title="Heart Rate Variability"
                subtitle="Avg per session"
                unit="ms"
                color="#4A9977"
                points={hrvPoints}
                lastLabel={hrvPoints.length ? `${Math.round(hrvPoints[hrvPoints.length - 1])}` : null}
                improving={
                    hrvPoints.length >= 2
                        ? hrvPoints[hrvPoints.length - 1] > hrvPoints[0]
                        : null
                }
            />

            <TrendCard
                title="Mood"
                subtitle="EMA check-in"
                unit=""
                color="#DAA520"
                points={moodPoints}
                yRange={[-1, 1]}
                lastLabel={
                    emaEntries[0]
                        ? emaEntries[0].mood.charAt(0).toUpperCase() + emaEntries[0].mood.slice(1)
                        : null
                }
                improving={null}
            />
        </View>
    );
}

function TrendCard({
    title,
    subtitle,
    unit,
    color,
    points,
    lastLabel,
    improving,
    yRange,
}: {
    title: string;
    subtitle: string;
    unit: string;
    color: string;
    points: number[];
    lastLabel: string | null;
    improving: boolean | null;
    yRange?: [number, number];
}) {
    const hasData = points.length >= 2;

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardSubtitle}>{subtitle}</Text>
                </View>
                {lastLabel != null && (
                    <View style={styles.cardValueBox}>
                        <Text style={[styles.cardValue, { color }]}>{lastLabel}</Text>
                        {!!unit && <Text style={styles.cardUnit}>{unit}</Text>}
                        {improving != null && (
                            <Text
                                style={[
                                    styles.cardArrow,
                                    { color: improving ? '#4A9977' : 'rgba(255,255,255,0.5)' },
                                ]}
                            >
                                {improving ? '↓' : '→'}
                            </Text>
                        )}
                    </View>
                )}
            </View>

            {hasData ? (
                <Sparkline points={points} color={color} yRange={yRange} />
            ) : (
                <Text style={styles.empty}>
                    Not enough data yet — {points.length === 1 ? 'one point captured' : 'no readings'}.
                </Text>
            )}
        </View>
    );
}

// Small smoothed sparkline. Auto-scales y unless yRange is provided.
function Sparkline({
    points,
    color,
    yRange,
}: {
    points: number[];
    color: string;
    yRange?: [number, number];
}) {
    const W = 300, H = 60, PAD = 4;
    const [yMinRaw, yMaxRaw] = yRange || [Math.min(...points), Math.max(...points)];
    const range = Math.max(0.001, yMaxRaw - yMinRaw);
    const yMin = yMinRaw - range * 0.1;
    const yMax = yMaxRaw + range * 0.1;
    const effectiveRange = yMax - yMin;

    const toX = (i: number) => PAD + (i / Math.max(1, points.length - 1)) * (W - PAD * 2);
    const toY = (v: number) => PAD + (H - PAD * 2) - ((v - yMin) / effectiveRange) * (H - PAD * 2);

    const pts = points.map((v, i) => [toX(i), toY(v)] as [number, number]);

    // Smooth path with quadratic-midpoint smoothing.
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const [cx, cy] = pts[i];
        const [nx, ny] = pts[i + 1];
        d += ` Q ${cx},${cy} ${(cx + nx) / 2},${(cy + ny) / 2}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last[0]},${last[1]}`;

    // Filled area for depth.
    const areaD = `${d} L ${last[0]},${H - PAD} L ${pts[0][0]},${H - PAD} Z`;

    return (
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
            {/* Baseline */}
            <Line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <Path d={areaD} fill={color} fillOpacity={0.12} />
            <Path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {/* Endpoint dot */}
            <Circle cx={last[0]} cy={last[1]} r={2.8} fill={color} />
        </Svg>
    );
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
    card: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
    cardSubtitle: {
        color: Colors.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    cardValueBox: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    cardValue: {
        fontSize: 22,
        fontWeight: '800',
    },
    cardUnit: {
        color: Colors.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },
    cardArrow: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '700',
    },
    empty: {
        color: Colors.textSecondary,
        fontSize: 11,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 20,
    },
});
