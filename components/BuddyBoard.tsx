import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { BuddyChallengeState } from '../hooks/useBeBuddy';

interface BuddyBoardProps {
    myPetals: number;
    buddyPetals: number;
    challengeState: BuddyChallengeState;
    buddyName?: string;
    onRematch?: () => Promise<void> | void;
    onEndBuddy?: () => Promise<void> | void;
}

export function BuddyBoard({ myPetals, buddyPetals, challengeState, buddyName, onRematch, onEndBuddy }: BuddyBoardProps) {
    // Prefer the status the hook wrote (canonical), falling back to inferred.
    const isLost = challengeState.status === 'lost' || challengeState.myMissedSessions >= 3;
    const isWon = challengeState.status === 'won' || challengeState.buddyMissedSessions >= 3;
    const roundOver = isLost || isWon;
    const [busy, setBusy] = useState(false);

    const handleRematch = async () => {
        if (!onRematch) return;
        setBusy(true);
        await onRematch();
        setBusy(false);
    };
    const handleEnd = () => {
        if (!onEndBuddy) return;
        Alert.alert(
            'End buddy pairing?',
            `You and ${buddyName || 'your buddy'} will each return to solo practice. You can pair up again later.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'End pairing', style: 'destructive', onPress: async () => {
                    setBusy(true);
                    await onEndBuddy();
                    setBusy(false);
                } },
            ]
        );
    };

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

            {/* Rematch controls surface when a round has resolved */}
            {roundOver && (onRematch || onEndBuddy) && (
                <View style={styles.rematchRow}>
                    {onRematch && (
                        <TouchableOpacity
                            style={[styles.rematchBtn, busy && { opacity: 0.6 }]}
                            onPress={handleRematch}
                            disabled={busy}
                        >
                            <Text style={styles.rematchBtnText}>Start a new Round</Text>
                        </TouchableOpacity>
                    )}
                    {onEndBuddy && (
                        <TouchableOpacity
                            style={[styles.endBtn, busy && { opacity: 0.6 }]}
                            onPress={handleEnd}
                            disabled={busy}
                        >
                            <Text style={styles.endBtnText}>End pairing</Text>
                        </TouchableOpacity>
                    )}
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
    },
    rematchRow: {
        marginTop: 12,
        flexDirection: 'row',
        gap: 8,
    },
    rematchBtn: {
        flex: 2,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: Colors.secondary,
    },
    rematchBtnText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.3,
    },
    endBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    endBtnText: {
        color: Colors.textSecondary,
        fontWeight: '600',
        fontSize: 12,
    },
});
