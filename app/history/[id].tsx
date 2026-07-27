import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../constants/Colors';
import { useHistoryItem } from '../../hooks/useHistory';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

export default function HistoryDetail() {
    useProtectedRoute();
    const router = useRouter();
    const params = useLocalSearchParams();
    const id = typeof params.id === 'string' ? params.id : '';
    const { item, loading, notFound } = useHistoryItem(id);

    if (loading) {
        return (
            <View style={styles.wrapper}>
                <ActivityIndicator color={Colors.secondary} />
            </View>
        );
    }

    if (notFound || !item) {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.hint}>Session not found.</Text>
            </View>
        );
    }

    const bio = item.biofeedback;
    const dateStr = item.completedAt.toLocaleDateString(undefined, {
        weekday: 'long', month: 'short', day: 'numeric',
    });
    const timeStr = item.completedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const durationMin = Math.round(item.durationSeconds / 60);

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>History</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>BE Pause</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.metaCard}>
                    <Text style={styles.metaDate}>{dateStr}</Text>
                    <Text style={styles.metaTime}>{timeStr} · {durationMin} min · Stage {item.practiceStage || '333'}</Text>
                </View>

                {bio ? (
                    <>
                        <View style={styles.statsRow}>
                            <Stat label="Start HR" value={`${bio.startHR}`} unit="bpm" />
                            <Stat label="End HR" value={`${bio.endHR}`} unit="bpm" />
                            <Stat
                                label="Δ HR"
                                value={`${bio.hrChange > 0 ? '+' : ''}${bio.hrChange.toFixed(1)}`}
                                unit="bpm"
                                positive={bio.hrChange < 0}
                            />
                        </View>
                        {bio.avgHRV > 0 && (
                            <View style={styles.statsRow}>
                                <Stat label="Start HRV" value={`${bio.startHRV ?? '—'}`} unit="ms" />
                                <Stat label="End HRV" value={`${bio.endHRV ?? '—'}`} unit="ms" />
                                <Stat
                                    label="Δ HRV"
                                    value={`${bio.hrvChange > 0 ? '+' : ''}${bio.hrvChange.toFixed(1)}`}
                                    unit="ms"
                                    positive={bio.hrvChange > 0}
                                />
                            </View>
                        )}

                        {bio.hrSamples && bio.hrSamples.length > 2 ? (
                            <View style={styles.chartCard}>
                                <View style={styles.chartHeader}>
                                    <Heart size={12} color="#FF6B6B" fill="#FF6B6B" />
                                    <Text style={styles.chartTitle}>In-session HR</Text>
                                    <Text style={styles.chartSpec}>{bio.hrSamples.length} samples</Text>
                                </View>
                                <SamplesChart
                                    hrSamples={bio.hrSamples}
                                    hrvSamples={bio.hrvSamples}
                                    height={180}
                                />
                            </View>
                        ) : (
                            <Text style={styles.hintCentered}>
                                No per-second samples were captured for this session.
                            </Text>
                        )}
                    </>
                ) : (
                    <View style={styles.emptyBioCard}>
                        <Text style={styles.emptyBioTitle}>No biofeedback for this session</Text>
                        <Text style={styles.emptyBioBody}>
                            Pair a heart-rate device from the home screen (the ❤️ icon) before starting your next BE Pause to capture in-session HR and HRV.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function Stat({
    label, value, unit, positive,
}: {
    label: string;
    value: string;
    unit: string;
    positive?: boolean;
}) {
    return (
        <View style={styles.stat}>
            <Text style={[styles.statValue, positive && { color: '#4A9977' }]}>{value}</Text>
            <Text style={styles.statUnit}>{unit}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

// Line chart from stored sample arrays. Y auto-scaled to fit both series.
function SamplesChart({
    hrSamples,
    hrvSamples,
    height,
}: {
    hrSamples: number[];
    hrvSamples?: number[];
    height: number;
}) {
    const VB_W = 320;
    const PAD_L = 30, PAD_R = 8, PAD_T = 10, PAD_B = 22;
    const plotW = VB_W - PAD_L - PAD_R;
    const plotH = height - PAD_T - PAD_B;

    const hasHrv = !!(hrvSamples && hrvSamples.length > 2);
    const allVals = [...hrSamples, ...(hasHrv ? (hrvSamples || []) : [])];
    const rawMin = Math.min(...allVals);
    const rawMax = Math.max(...allVals);
    const pad = Math.max(5, (rawMax - rawMin) * 0.1);
    const yMin = Math.max(0, Math.floor((rawMin - pad) / 10) * 10);
    const yMax = Math.ceil((rawMax + pad) / 10) * 10;
    const yRange = Math.max(1, yMax - yMin);

    const toY = (v: number) => PAD_T + plotH - ((v - yMin) / yRange) * plotH;
    const toX = (i: number, n: number) => PAD_L + (i / Math.max(1, n - 1)) * plotW;

    const smoothPath = (samples: number[]): string => {
        if (samples.length < 2) return '';
        const pts = samples.map((v, i) => [toX(i, samples.length), toY(v)] as [number, number]);
        let d = `M ${pts[0][0]},${pts[0][1]}`;
        for (let i = 1; i < pts.length - 1; i++) {
            const [cx, cy] = pts[i];
            const [nx, ny] = pts[i + 1];
            d += ` Q ${cx},${cy} ${(cx + nx) / 2},${(cy + ny) / 2}`;
        }
        d += ` L ${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`;
        return d;
    };

    // 4 evenly spaced grid values.
    const gridValues = [0, 1, 2, 3].map((i) => yMin + (yRange * i) / 3);

    return (
        <Svg width="100%" height={height} viewBox={`0 0 ${VB_W} ${height}`}>
            {gridValues.map((v, i) => {
                const y = PAD_T + plotH - (i / 3) * plotH;
                return (
                    <React.Fragment key={i}>
                        <Line
                            x1={PAD_L} x2={VB_W - PAD_R} y1={y} y2={y}
                            stroke="rgba(255,255,255,0.08)"
                            strokeDasharray="3 4"
                        />
                        <SvgText
                            x={PAD_L - 4} y={y + 3}
                            fontSize="9"
                            fill="rgba(255,255,255,0.55)"
                            textAnchor="end"
                        >
                            {Math.round(v)}
                        </SvgText>
                    </React.Fragment>
                );
            })}
            {hasHrv && (
                <Path
                    d={smoothPath(hrvSamples || [])}
                    fill="none"
                    stroke="#4A9977"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            )}
            <Path
                d={smoothPath(hrSamples)}
                fill="none"
                stroke="#F2C94C"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </Svg>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background, padding: 14 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
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
    hint: {
        color: Colors.textSecondary, fontSize: 13, textAlign: 'center', padding: 20,
    },
    hintCentered: {
        color: Colors.textSecondary, fontSize: 12, fontStyle: 'italic',
        textAlign: 'center', paddingVertical: 16,
    },

    metaCard: {
        padding: 14, borderRadius: 12,
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.25)',
        backgroundColor: 'rgba(26,67,49,0.6)',
        marginBottom: 14,
    },
    metaDate: {
        color: '#FFD700', fontSize: 18, fontWeight: '700', letterSpacing: 0.3,
    },
    metaTime: {
        color: Colors.textSecondary, fontSize: 13, marginTop: 4,
    },

    statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    stat: {
        flex: 1, padding: 12, borderRadius: 10,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center',
    },
    statValue: {
        color: '#FFD700', fontSize: 22, fontWeight: '800',
    },
    statUnit: {
        color: Colors.textSecondary, fontSize: 10, marginTop: -2,
    },
    statLabel: {
        color: Colors.textSecondary, fontSize: 10,
        letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4,
    },

    chartCard: {
        padding: 14, borderRadius: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: 14,
    },
    chartHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8,
    },
    chartTitle: {
        color: Colors.text, fontSize: 13, fontWeight: '600', flex: 1,
    },
    chartSpec: {
        color: Colors.textSecondary, fontSize: 11, fontFamily: 'monospace',
    },

    emptyBioCard: {
        padding: 20, borderRadius: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center', marginTop: 10,
    },
    emptyBioTitle: {
        color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 6,
    },
    emptyBioBody: {
        color: Colors.textSecondary, fontSize: 12, textAlign: 'center', lineHeight: 18,
    },
});
