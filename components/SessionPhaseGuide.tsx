import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Frown, Wind, Sprout } from 'lucide-react-native';
import { BiofeedbackReading } from '../services/BiofeedbackService';
import { BiofeedbackChart } from './BiofeedbackChart';

type PhaseType = 'arrive' | 'align' | 'bloom';

interface PhaseConfig {
    id: PhaseType;
    title: string;
    minuteLabel: string;
    timeRange: [number, number]; // Start sec, End sec
    coaching: string;
    Icon: React.ElementType;
}

const SESSION_PHASES: PhaseConfig[] = [
    {
        id: 'arrive',
        title: 'ARRIVE',
        minuteLabel: 'MINUTE 1',
        timeRange: [0, 60],
        coaching: "The noise is loud here.\nThat’s okay. Just land.",
        Icon: Frown
    },
    {
        id: 'align',
        title: 'ALIGN',
        minuteLabel: 'MINUTE 2',
        timeRange: [60, 120],
        coaching: "Ride the wave.\nSoften the edges.",
        Icon: Wind
    },
    {
        id: 'bloom',
        title: 'BLOOM',
        minuteLabel: 'MINUTE 3',
        timeRange: [120, 180],
        coaching: "Roots down. Heart open.\nYou are replenished.",
        Icon: Sprout
    }
];

interface SessionPhaseGuideProps {
    elapsedTime: number; // Current session time in seconds
    data: BiofeedbackReading[];
}

export function SessionPhaseGuide({ elapsedTime, data }: SessionPhaseGuideProps) {
    // Determine current phase based on time
    const currentPhase = useMemo(() => {
        if (elapsedTime >= 120) return SESSION_PHASES[2];
        if (elapsedTime >= 60) return SESSION_PHASES[1];
        return SESSION_PHASES[0];
    }, [elapsedTime]);

    // Calculate progress within current phase
    const phaseProgress = useMemo(() => {
        const [start, end] = currentPhase.timeRange;
        const duration = end - start;
        const current = elapsedTime - start;
        return Math.min(100, Math.max(0, (current / duration) * 100));
    }, [elapsedTime, currentPhase]);

    const Icon = currentPhase.Icon;

    return (
        <View style={styles.container}>

            {/* Phase Dots (Timeline) */}
            <View style={styles.indicatorRow}>
                <View style={styles.indicatorTrack} />
                {SESSION_PHASES.map((phase) => {
                    const isActive = currentPhase.id === phase.id;
                    const isPast = elapsedTime > phase.timeRange[1];
                    const dotStyle = isActive ? styles.dotActive : (isPast ? styles.dotPast : styles.dotFuture);
                    return (
                        <View key={phase.id} style={styles.dotContainer}>
                            <View style={[styles.dotBase, dotStyle]} />
                        </View>
                    );
                })}
            </View>

            {/* Main Card */}
            <Animated.View
                key={currentPhase.id} // Re-animate on phase change
                entering={FadeInDown.springify().damping(15)}
                exiting={FadeOutUp.duration(200)}
                style={styles.card}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.minuteLabel}>BE333 {currentPhase.minuteLabel}:</Text>
                    <Text style={styles.phaseTitle}>{currentPhase.title}</Text>
                </View>

                {/* Chart Area */}
                <View style={styles.chartContainer}>
                    <BiofeedbackChart data={data} height={160} />
                </View>

                {/* Footer (Coaching) */}
                <View style={styles.footer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.coachingText}>{currentPhase.coaching}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon size={28} color="#F2C94C" />
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${phaseProgress}%` }]} />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
        paddingHorizontal: 4,
    },
    indicatorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        marginBottom: 8,
        position: 'relative',
        height: 20,
    },
    indicatorTrack: {
        position: 'absolute',
        top: 9,
        left: 50, right: 50,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: -1,
    },
    dotContainer: {
        width: 20, alignItems: 'center'
    },
    dotBase: {
        width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    },
    dotActive: {
        backgroundColor: '#4A9977', borderColor: '#4A9977',
        shadowColor: '#4A9977', shadowRadius: 6, shadowOpacity: 0.8, elevation: 4
    },
    dotPast: {
        backgroundColor: '#4A9977', borderColor: '#4A9977', opacity: 0.5
    },
    dotFuture: {
        backgroundColor: '#0b1612', borderColor: 'rgba(255,255,255,0.2)'
    },
    card: {
        backgroundColor: '#0b1612',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2D6A4F',
        overflow: 'hidden',
        paddingTop: 16,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    minuteLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    phaseTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    chartContainer: {
        height: 160,
        backgroundColor: 'rgba(0,0,0,0.2)', // Slightly darker for graph
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 24, // Space for progress bar
    },
    coachingText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        lineHeight: 22,
        fontFamily: 'serif', // Elegant feel
    },
    iconContainer: {
        width: 48, height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F2C94C',
        backgroundColor: 'rgba(242, 201, 76, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarTrack: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 4,
        backgroundColor: 'rgba(74, 153, 119, 0.2)',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4A9977',
    },
});
