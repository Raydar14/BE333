import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Colors } from '../constants/Colors';
import { Button } from '../components/Button';
import { ProFeatureLock } from '../components/ProFeatureLock';
import { useBePractice } from '../hooks/useBePractice';
import { useBeBuddy } from '../hooks/useBeBuddy';
import { LotusBloomMap } from '../components/LotusBloomMap';
import { BuddyBoard } from '../components/BuddyBoard';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'expo-router';
import { usePurchase } from '../contexts/PurchaseContext';

export default function Dashboard() {
    const { user } = useAuth();
    const { stats, loading: practiceLoading } = useBePractice();
    const { buddyState, buddyStats } = useBeBuddy();
    const { isPro } = usePurchase();
    const router = useRouter();
    useProtectedRoute();

    async function handleSignOut() {
        await signOut(auth);
    }

    if (practiceLoading || !stats) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: Colors.text }}>Loading Practice...</Text>
            </View>
        );
    }

    const isResting = stats.practiceState === 'resting_ritual';
    const targetPauses = isPro ? 2 : 3;

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Your Dashboard</Text>

                {/* Resting Ritual State */}
                {isResting && (
                    <View style={[styles.section, styles.restingCard]}>
                        <Text style={styles.restingTitle}>Reset & Rest Ritual</Text>
                        <Text style={styles.restingBody}>
                            You've used your 3rd streak break. BE333 has activated a gentle 3-day rest for you.
                            Take this time to recharge. We'll begin a new practice together soon.
                        </Text>
                    </View>
                )}

                {/* Active Practice Section */}
                {!isResting && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>21-Day BE Practice</Text>
                        <Text style={styles.sectionSubtitle}>Day {stats.dayOfPractice} of 21</Text>

                        {/* Lotus Map */}
                        <LotusBloomMap bloomDays={stats.bloomDays} />

                        {/* Today's Progress */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats.currentPauses} / {targetPauses}</Text>
                                <Text style={styles.statLabel}>Today's Pauses</Text>
                                {stats.currentPauses >= targetPauses && (
                                    <Text style={styles.statSubLabel}>Bloom Day Complete!</Text>
                                )}
                            </View>

                            {/* Streak Breaks */}
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, { color: stats.streakBreaksUsed >= 2 ? Colors.warning : Colors.secondary }]}>
                                    {isPro ? '∞' : `${stats.streakBreaksUsed} / 3`}
                                </Text>
                                <Text style={styles.statLabel}>Streak Breaks</Text>
                                <Text style={styles.statSubLabel}>{isPro ? 'Pro Protected' : 'Avoid reaching 3'}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* BE Buddy Challenge Section */}
                {!isResting && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>BE Buddy Challenge</Text>

                        {buddyState && buddyState.active ? (
                            <BuddyBoard
                                myPetals={stats.bloomDays}
                                buddyPetals={buddyStats?.bloomDays || 0}
                                challengeState={{
                                    ...buddyState,
                                    myMissedSessions: stats.streakBreaksUsed
                                }}
                                buddyName={buddyState.buddyName}
                            />
                        ) : (
                            <View style={styles.inviteCard}>
                                <Text style={styles.inviteText}>
                                    Accountability is powerful. Invite a friend to join you in a 21-Day Challenge.
                                </Text>
                                <Button
                                    title="Invite a BE Buddy"
                                    onPress={() => router.push('/social/invite')}
                                    variant="secondary"
                                    style={{ marginTop: 10 }}
                                />
                            </View>
                        )}
                    </View>
                )}

                {/* Lifetime Stats (Pro) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lifetime Stats</Text>
                    <ProFeatureLock label="Pro Feature">
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>--</Text>
                                <Text style={styles.statLabel}>Total Sessions</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>--</Text>
                                <Text style={styles.statLabel}>Longest Flow</Text>
                            </View>
                        </View>
                    </ProFeatureLock>
                </View>

                <Button
                    title="Return to Timer"
                    onPress={() => router.push('/')}
                    variant="secondary"
                    style={{ marginTop: 20 }}
                />

                <Button title="Sign Out" onPress={handleSignOut} variant="ghost" style={{ marginTop: 10, marginBottom: 30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 60,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 30,
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
    statSubLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 2,
    },
    restingCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    restingTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    restingBody: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    inviteCard: {
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    inviteText: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
    }
});
