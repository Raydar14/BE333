import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
    Path,
    Defs,
    LinearGradient,
    Stop,
    Line as SvgLine,
    Text as SvgText,
    Pattern,
    Rect,
    Circle,
} from 'react-native-svg';
import { BiofeedbackReading } from '../services/BiofeedbackService';

type PhaseType = 'arrive' | 'align' | 'bloom';

interface BiofeedbackChartProps {
    data: BiofeedbackReading[];
    height?: number;
    phase?: PhaseType;
    windowStartSec?: number; // Session second at left edge of plot
    windowEndSec?: number;   // Session second at right edge of plot
}

const COLORS = {
    hrGold: '#F2C94C',
    hrGoldSoft: 'rgba(242,201,76,0.35)',
    hrvGreen: '#4A9977',
    hrvGreenSoft: 'rgba(74,153,119,0.35)',
    textAxis: 'rgba(255,255,255,0.55)',
    textLegend: '#E0E7E3',
    gridLine: 'rgba(255,255,255,0.08)',
    circuit: 'rgba(74,153,119,0.10)',
    circuitDot: 'rgba(242,201,76,0.15)',
};

// SVG viewBox constants — everything scales proportionally to fit container width
const VB_W = 320;
const AXIS_LEFT = 32;   // reserved for y-axis labels
const AXIS_BOTTOM = 20; // reserved for x-axis labels
const PAD_TOP = 12;
const PAD_RIGHT = 12;

const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, '0')}`;
};

// Build a smooth path through points using quadratic-bezier midpoint smoothing.
function smoothPath(points: Array<[number, number]>): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`;
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length - 1; i++) {
        const [cx, cy] = points[i];
        const [nx, ny] = points[i + 1];
        const mx = (cx + nx) / 2;
        const my = (cy + ny) / 2;
        d += ` Q ${cx},${cy} ${mx},${my}`;
    }
    // Final segment
    const [lx, ly] = points[points.length - 1];
    d += ` L ${lx},${ly}`;
    return d;
}

export function BiofeedbackChart({
    data,
    height = 180,
    phase = 'arrive',
    windowStartSec,
    windowEndSec,
}: BiofeedbackChartProps) {
    const processed = useMemo(() => {
        if (!data || data.length < 2) return null;

        const hrValues: number[] = [];
        const hrvValues: number[] = [];
        for (const d of data) {
            if (typeof d.hr === 'number' && d.hr > 0) hrValues.push(d.hr);
            if (typeof d.hrv === 'number' && d.hrv > 0) hrvValues.push(d.hrv);
        }
        if (hrValues.length < 2) return null;

        // Unified y-axis — accommodate BOTH series so both are visible on one plot
        const allVals = [...hrValues, ...hrvValues];
        const rawMin = Math.min(...allVals);
        const rawMax = Math.max(...allVals);
        const pad = Math.max(5, (rawMax - rawMin) * 0.1);
        const yMin = Math.max(0, Math.floor((rawMin - pad) / 10) * 10);
        const yMax = Math.ceil((rawMax + pad) / 10) * 10;
        const yRange = Math.max(1, yMax - yMin);

        // In "bloom" HRV tends to dominate; use ms label. Otherwise bpm.
        const hrvAvg = hrvValues.length ? hrvValues.reduce((a, b) => a + b, 0) / hrvValues.length : 0;
        const hrAvg = hrValues.reduce((a, b) => a + b, 0) / hrValues.length;
        const unit = phase === 'bloom' && hrvAvg > hrAvg ? 'ms' : 'bpm';

        return { yMin, yMax, yRange, unit };
    }, [data, phase]);

    const geometry = useMemo(() => {
        if (!processed || !data) return null;
        const plotLeft = AXIS_LEFT;
        const plotRight = VB_W - PAD_RIGHT;
        const plotTop = PAD_TOP;
        const plotBottom = height - AXIS_BOTTOM;
        const plotW = plotRight - plotLeft;
        const plotH = plotBottom - plotTop;
        const { yMin, yRange } = processed;

        const toY = (v: number) => plotBottom - ((v - yMin) / yRange) * plotH;

        // If a session window is provided, map by timestamp; otherwise map by index.
        const useTimeWindow =
            typeof windowStartSec === 'number' &&
            typeof windowEndSec === 'number' &&
            windowEndSec > windowStartSec;

        let hrPoints: Array<[number, number]> = [];
        let hrvPoints: Array<[number, number]> = [];

        if (useTimeWindow) {
            const startMs = data[0]?.timestamp ?? 0;
            const windowSpan = (windowEndSec as number) - (windowStartSec as number);
            for (const d of data) {
                const t = (d.timestamp - startMs) / 1000; // seconds since first reading
                const tInWindow = t - (windowStartSec as number);
                if (tInWindow < 0 || tInWindow > windowSpan) continue;
                const x = plotLeft + (tInWindow / windowSpan) * plotW;
                if (typeof d.hr === 'number' && d.hr > 0) hrPoints.push([x, toY(d.hr)]);
                if (typeof d.hrv === 'number' && d.hrv > 0) hrvPoints.push([x, toY(d.hrv)]);
            }
        } else {
            const denom = Math.max(1, data.length - 1);
            data.forEach((d, i) => {
                const x = plotLeft + (i / denom) * plotW;
                if (typeof d.hr === 'number' && d.hr > 0) hrPoints.push([x, toY(d.hr)]);
                if (typeof d.hrv === 'number' && d.hrv > 0) hrvPoints.push([x, toY(d.hrv)]);
            });
        }

        const hrPath = smoothPath(hrPoints);
        const hrvPath = smoothPath(hrvPoints);
        const closeToBottom = (path: string, points: Array<[number, number]>) => {
            if (!points.length) return '';
            const first = points[0];
            const last = points[points.length - 1];
            return `${path} L ${last[0]},${plotBottom} L ${first[0]},${plotBottom} Z`;
        };
        const hrArea = closeToBottom(hrPath, hrPoints);
        const hrvArea = closeToBottom(hrvPath, hrvPoints);

        // Y-axis grid values — 5 evenly spaced ticks
        const gridValues: number[] = [];
        for (let i = 0; i <= 4; i++) {
            gridValues.push(processed.yMin + (yRange * i) / 4);
        }

        // X-axis tick labels (start, mid, end of window)
        const xTicks: Array<{ x: number; label: string }> = [];
        if (useTimeWindow) {
            xTicks.push({ x: plotLeft, label: formatSec(windowStartSec as number) });
            xTicks.push({
                x: plotLeft + plotW / 2,
                label: formatSec(((windowStartSec as number) + (windowEndSec as number)) / 2),
            });
            xTicks.push({ x: plotRight, label: formatSec(windowEndSec as number) });
        }

        return {
            plotLeft, plotRight, plotTop, plotBottom, plotW, plotH,
            hrPath, hrvPath, hrArea, hrvArea,
            hrPoints, hrvPoints,
            gridValues, xTicks,
        };
    }, [data, processed, height, windowStartSec, windowEndSec]);

    if (!processed || !geometry) {
        return (
            <View style={[styles.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: COLORS.textLegend, opacity: 0.6 }}>Waiting for data…</Text>
            </View>
        );
    }

    const { unit } = processed;

    return (
        <View style={[styles.container, { height }]}>
            {/* Top-right legend — "The Pace (HR)" per spec */}
            <View style={styles.legendTop}>
                <View style={styles.legendItem}>
                    <Text style={[styles.legendText, { color: COLORS.hrGold }]}>The Pace (HR)</Text>
                    <View style={[styles.dot, { backgroundColor: COLORS.hrGold }]} />
                </View>
            </View>

            <View style={styles.chartArea}>
                <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${height}`}>
                    <Defs>
                        <LinearGradient id="gradHr" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={COLORS.hrGold} stopOpacity="0.45" />
                            <Stop offset="1" stopColor={COLORS.hrGold} stopOpacity="0" />
                        </LinearGradient>
                        <LinearGradient id="gradHrv" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={COLORS.hrvGreen} stopOpacity="0.45" />
                            <Stop offset="1" stopColor={COLORS.hrvGreen} stopOpacity="0" />
                        </LinearGradient>
                        <Pattern
                            id="circuit"
                            x="0" y="0"
                            width="40" height="40"
                            patternUnits="userSpaceOnUse"
                        >
                            <Path
                                d="M 0 20 L 40 20 M 20 0 L 20 40"
                                stroke={COLORS.circuit}
                                strokeWidth="0.5"
                                fill="none"
                            />
                            <Circle cx="20" cy="20" r="1.2" fill={COLORS.circuitDot} />
                        </Pattern>
                    </Defs>

                    {/* Circuit background */}
                    <Rect x="0" y="0" width={VB_W} height={height} fill="url(#circuit)" />

                    {/* Y-axis unit label */}
                    <SvgText
                        x={4}
                        y={PAD_TOP + 4}
                        fontSize="9"
                        fill={COLORS.textAxis}
                        fontWeight="600"
                    >
                        {unit}
                    </SvgText>

                    {/* Horizontal grid + y labels */}
                    {geometry.gridValues.map((v, i) => {
                        const y = geometry.plotBottom - (i / 4) * geometry.plotH;
                        return (
                            <React.Fragment key={i}>
                                <SvgLine
                                    x1={geometry.plotLeft}
                                    x2={geometry.plotRight}
                                    y1={y}
                                    y2={y}
                                    stroke={COLORS.gridLine}
                                    strokeDasharray="3 4"
                                />
                                <SvgText
                                    x={geometry.plotLeft - 4}
                                    y={y + 3}
                                    fontSize="9"
                                    fill={COLORS.textAxis}
                                    textAnchor="end"
                                >
                                    {Math.round(v)}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}

                    {/* HR area + line */}
                    {geometry.hrArea && (
                        <Path d={geometry.hrArea} fill="url(#gradHr)" stroke="none" />
                    )}
                    {geometry.hrPath && (
                        <Path
                            d={geometry.hrPath}
                            fill="none"
                            stroke={COLORS.hrGold}
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    )}

                    {/* HRV area + line */}
                    {geometry.hrvArea && (
                        <Path d={geometry.hrvArea} fill="url(#gradHrv)" stroke="none" />
                    )}
                    {geometry.hrvPath && (
                        <Path
                            d={geometry.hrvPath}
                            fill="none"
                            stroke={COLORS.hrvGreen}
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    )}

                    {/* X-axis tick labels */}
                    {geometry.xTicks.map((t, i) => (
                        <SvgText
                            key={i}
                            x={t.x}
                            y={height - 4}
                            fontSize="9"
                            fill={COLORS.textAxis}
                            textAnchor={i === 0 ? 'start' : i === geometry.xTicks.length - 1 ? 'end' : 'middle'}
                        >
                            {t.label}
                        </SvgText>
                    ))}
                </Svg>
            </View>

            {/* Bottom legend */}
            <View style={styles.legendBottom}>
                <View style={styles.legendItem}>
                    <Text style={[styles.legendText, { color: COLORS.hrGold }]}>The Pace (HR)</Text>
                    <View style={[styles.dot, { backgroundColor: COLORS.hrGold }]} />
                </View>
                <View style={styles.legendItem}>
                    <Text style={[styles.legendText, { color: COLORS.hrvGreen }]}>Capacity (HRV)</Text>
                    <View style={[styles.dot, { backgroundColor: COLORS.hrvGreen }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
    },
    chartArea: {
        flex: 1,
        overflow: 'hidden',
    },
    legendTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingTop: 6,
    },
    legendBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 6,
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
        fontSize: 11,
        fontWeight: '600',
    },
});
