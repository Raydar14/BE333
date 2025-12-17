import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { BiofeedbackReading } from '../services/BiofeedbackService';

interface BiofeedbackChartProps {
    data: BiofeedbackReading[];
    height?: number;
    width?: number | string; // Allow percentage
}

const COLORS = {
    hrGold: "#F2C94C",
    hrvGreen: "#4A9977",
    textSub: "#E0E7E3",
    gridLine: "rgba(255,255,255,0.1)"
};

export function BiofeedbackChart({ data, height = 200, width = '100%' }: BiofeedbackChartProps) {
    // 1. Process Data & Scales
    const processed = useMemo(() => {
        if (!data || data.length < 2) return null;

        const hrs = data.map(d => d.hr);
        const hrvs = data.map(d => d.hrv || 0).filter(v => v > 0);

        // HR Domain
        const minHr = Math.min(...hrs) - 5;
        const maxHr = Math.max(...hrs) + 5;
        const rangeHr = maxHr - minHr || 1;

        // HRV Domain (Fallback to 0-100 if empty)
        const minHrv = hrvs.length ? Math.min(...hrvs) - 5 : 0;
        const maxHrv = hrvs.length ? Math.max(...hrvs) + 5 : 100;
        const rangeHrv = maxHrv - minHrv || 1;

        return { minHr, maxHr, rangeHr, minHrv, maxHrv, rangeHrv };
    }, [data]);

    // 2. Generate Paths
    const { paths, ticks } = useMemo(() => {
        if (!processed || !data) return { paths: { hr: '', hrv: '', hrvArea: '' }, ticks: [] };

        // Fixed pixel width for calculation (assume typical screen width if % is passed, or measure)
        // For simplicity, we assume a render width of ~350px (mobile) inside container.
        // If exact precision needed, use onLayout. approximating 320 for now.
        const renderWidth = 320;
        const renderHeight = height - 40; // reserve space for text? No, SVG height.

        // Padding inside SVG
        const padTop = 10;
        const padBottom = 10;
        const effectiveHeight = renderHeight - padTop - padBottom;

        const { minHr, rangeHr, minHrv, rangeHrv } = processed;

        // HR Path
        const hrPoints = data.map((d, i) => {
            const x = (i / (data.length - 1)) * renderWidth;
            const y = padTop + effectiveHeight - ((d.hr - minHr) / rangeHr) * effectiveHeight;
            return `${x},${y}`;
        });
        const hrPathD = `M ${hrPoints[0]} ` + hrPoints.slice(1).map(p => `L ${p}`).join(' ');

        // HRV Path
        const hrvPoints = data.map((d, i) => {
            const val = d.hrv || minHrv;
            const x = (i / (data.length - 1)) * renderWidth;
            const y = padTop + effectiveHeight - ((val - minHrv) / rangeHrv) * effectiveHeight;
            return `${x},${y}`;
        });
        const hrvPathD = `M ${hrvPoints[0]} ` + hrvPoints.slice(1).map(p => `L ${p}`).join(' ');

        // HRV Area (Close loop to bottom)
        const hrvAreaD = `${hrvPathD} L ${renderWidth},${renderHeight} L 0,${renderHeight} Z`;

        return {
            paths: { hr: hrPathD, hrv: hrvPathD, hrvArea: hrvAreaD },
            ticks: Array.from({ length: 5 }).map((_, i) => ({
                y: padTop + (effectiveHeight * i) / 4,
                // We'll skip axis labels inside SVG for simplicity or add simple ones
            }))
        };

    }, [data, processed, height]);

    if (!processed) return (
        <View style={[styles.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: COLORS.textSub }}>Waiting for data...</Text>
        </View>
    );

    return (
        <View style={[styles.container, { height }]}>

            {/* Header / Legend */}
            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: COLORS.hrGold }]} />
                    <Text style={[styles.legendText, { color: COLORS.hrGold }]}>Heart Rate (BPM)</Text>
                </View>
                <View style={styles.legendItem}>
                    <Text style={[styles.legendText, { color: COLORS.hrvGreen }]}>HRV (ms)</Text>
                    <View style={[styles.dot, { backgroundColor: COLORS.hrvGreen }]} />
                </View>
            </View>

            {/* Chart Area */}
            <View style={{ flex: 1, overflow: 'hidden' }}>
                <Svg width="100%" height="100%" viewBox={`0 0 320 ${height}`}>
                    <Defs>
                        <LinearGradient id="gradHrv" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={COLORS.hrvGreen} stopOpacity="0.3" />
                            <Stop offset="1" stopColor={COLORS.hrvGreen} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Grid Lines */}
                    {ticks.map((t, i) => (
                        <SvgLine
                            key={i}
                            x1="0" y1={t.y} x2="320" y2={t.y}
                            stroke={COLORS.gridLine}
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* HRV Area */}
                    <Path
                        d={paths.hrvArea}
                        fill="url(#gradHrv)"
                        stroke="none"
                    />

                    {/* HRV Line */}
                    <Path
                        d={paths.hrv}
                        fill="none"
                        stroke={COLORS.hrvGreen}
                        strokeWidth="2"
                    />

                    {/* HR Line */}
                    <Path
                        d={paths.hr}
                        fill="none"
                        stroke={COLORS.hrGold}
                        strokeWidth="2"
                    />

                </Svg>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        padding: 12,
        // Backdrop blur not supported natively in View without Expo BlurView, 
        // but backgroundColor transparency gives Glassmorphism feel.
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 12,
        fontWeight: '600',
    }
});
