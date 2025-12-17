import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { BiofeedbackReading } from '../services/BiofeedbackService';

interface BiofeedbackGraphProps {
    data: BiofeedbackReading[];
    width?: number;
    height?: number;
    color?: string;
}

export function BiofeedbackGraph({ data, width = 280, height = 60, color = '#FF6B6B' }: BiofeedbackGraphProps) {
    const colorHrv = '#4A9977';

    const { pathHr, pathHrv } = useMemo(() => {
        if (!data || data.length < 2) return { pathHr: '', pathHrv: '' };

        // Determine range for Y axis (combine both to find min/max)
        const hrs = data.map(d => d.hr);
        const hrvs = data.map(d => d.hrv || 0).filter(v => v > 0);

        const allValues = [...hrs, ...hrvs];
        if (allValues.length === 0) return { pathHr: '', pathHrv: '' };

        const minVal = Math.min(...allValues) - 5;
        const maxVal = Math.max(...allValues) + 5;
        const range = maxVal - minVal || 1;

        const makePath = (values: number[]) => {
            if (values.length < 2) return '';
            const points = values.map((val, index) => {
                const x = (index / (values.length - 1)) * width;
                const y = height - ((val - minVal) / range) * height;
                return `${x},${y}`;
            });
            return `M ${points[0]}` + points.slice(1).map(p => ` L ${p}`).join('');
        };

        const pathHr = makePath(data.map(d => d.hr));
        // Treat missing HRV as minVal (aligned with bottom) or just filter out (but need alignment)
        const pathHrv = makePath(data.map(d => d.hrv || minVal));

        return { pathHr, pathHrv };

    }, [data, width, height]);

    if (!data || data.length === 0) return null;

    return (
        <View style={[styles.container, { width, height }]}>
            <Svg width={width} height={height}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={color} stopOpacity="1" />
                        <Stop offset="1" stopColor={color} stopOpacity="0.2" />
                    </LinearGradient>
                </Defs>

                {/* HRV Line (Green) */}
                <Path
                    d={pathHrv}
                    fill="none"
                    stroke={colorHrv}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.8}
                />

                {/* HR Line (Red) */}
                <Path
                    d={pathHr}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }
});
