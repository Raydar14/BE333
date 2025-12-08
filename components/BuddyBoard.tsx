import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { BuddyChallengeState } from '../hooks/useBeBuddy';

interface BuddyBoardProps {
    myPetals: number;
    buddyPetals: number;
    challengeState: BuddyChallengeState;
    buddyName?: string;
}

export function BuddyBoard({ myPetals, buddyPetals, challengeState, buddyName }: BuddyBoardProps) {
    const isLost = challengeState.myMissedSessions >= 3;
    const isWon = challengeState.buddyMissedSessions >= 3; // Simplified logic, assumes update from backend or hook

    return (
        <View style={styles.container}>
            <Text style={styles.header}>BE Buddy Board</Text>

            <View style={styles.row}>
                {/* Me */}
                <View style={styles.playerCol}>
                    <Text style={styles.label}>You</Text>
                    <Text style={styles.score}>{myPetals}</Text>
                    <Text style={styles.sub}>Petals</Text>

                    <Text style={[styles.missed, challengeState.myMissedSessions >= 2 && styles.danger]}>
                        Missed: {challengeState.myMissedSessions}/3
                    </Text>
                </View>

                <View style={styles.vsContainer}>
                    <Text style={styles.vs}>VS</Text>
                </View>

                {/* Buddy */}
                <View style={styles.playerCol}>
                    <Text style={styles.label}>{buddyName || 'Buddy'}</Text>
                    <Text style={styles.score}>{buddyPetals}</Text>
                    <Text style={styles.sub}>Petals</Text>

                    <Text style={styles.missed}>
                        Missed: {challengeState.buddyMissedSessions}/3
                    </Text>
                </View>
            </View>

            {/* Status Banner */}
            {isLost && (
                <View style={[styles.banner, styles.lostBanner]}>
                    <Text style={styles.bannerText}>Round Lost. Keep going!</Text>
                </View>
            )}
            {isWon && (
                <View style={[styles.banner, styles.wonBanner]}>
                    <Text style={styles.bannerText}>You Won this Round!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playerCol: {
        alignItems: 'center',
        flex: 1,
    },
    vsContainer: {
        width: 40,
        alignItems: 'center',
    },
    vs: {
        fontSize: 14,
        fontWeight: '900',
        color: Colors.textSecondary,
        opacity: 0.5,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 5,
        fontWeight: '600',
    },
    score: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    sub: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 10,
    },
    missed: {
        fontSize: 12,
        color: Colors.textLight,
        opacity: 0.8,
    },
    danger: {
        color: Colors.error,
        fontWeight: 'bold',
    },
    banner: {
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    lostBanner: {
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
    },
    wonBanner: {
        backgroundColor: 'rgba(52, 199, 89, 0.2)',
    },
    bannerText: {
        color: Colors.text,
        fontWeight: 'bold',
    }
});
