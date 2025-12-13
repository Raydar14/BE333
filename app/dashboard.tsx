import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Colors } from '../constants/Colors';
import { Button } from '../components/Button';
import { PremiumButton } from '../components/PremiumButton';
import { ProFeatureLock } from '../components/ProFeatureLock';
import { useBePractice } from '../hooks/useBePractice';
import { useBeBuddy } from '../hooks/useBeBuddy';
import { LotusBloomMap } from '../components/LotusBloomMap';
import { BuddyBoard } from '../components/BuddyBoard';
import { TrendChart } from '../components/TrendChart';
import { GuideSection } from '../components/GuideSection';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'expo-router';
import { usePurchase } from '../contexts/PurchaseContext';
import { Users, Trophy } from 'lucide-react-native';

export default function Dashboard() {
    const { user } = useAuth();
    const { stats, loading: practiceLoading, startNewPractice } = useBePractice();
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
                <Text style={styles.headerTitle}>Practice Hub</Text>

                {/* 1. Golden Lotus Showcase */}
                <View style={styles.lotusShowcase}>
                    <Text style={styles.lotusTitle}>Day {stats.dayOfPractice} of 21</Text>
                    {/* The Map visualizes the Lotus */}
                    <LotusBloomMap bloomDays={stats.bloomDays} />
                    <Text style={styles.lotusSubtitle}>{stats.bloomDays} Pause Petals Collected</Text>
                </View>

                {/* 2. Trends Section */}
                {!isResting && (
                    <View style={styles.section}>
                        <TrendChart
                            currentPauses={stats.currentPauses}
                            history={stats.recentHistory || []}
                        />
                    </View>
                )}

                {/* Resting Ritual Card (Cycle Failed State) */}
                {isResting && (
                    <View style={[styles.section, styles.restingCard]}>
                        <Text style={styles.restingTitle}>Cycle Interrupted</Text>
                        <Text style={styles.restingBody}>
                            You've missed 3 sessions. It happens to the best of us!
                            {"\n"}Ready to begin a fresh 21-day journey?
                        </Text>
                        <PremiumButton
                            title="Start New Cycle"
                            variant="primary"
                            onPress={startNewPractice}
                            style={{ marginTop: 20, width: '100%' }}
                        />
                    </View>
                )}

                {/* 3. Challenge Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Trophy size={20} color="#FFD700" />
                        <Text style={styles.sectionTitle}>Challenge Level</Text>
                    </View>

                    {buddyState && buddyState.active ? (
                        <View>
                            <BuddyBoard
                                myPetals={stats.bloomDays}
                                buddyPetals={buddyStats?.bloomDays || 0}
                                challengeState={{
                                    ...buddyState,
                                    myMissedSessions: stats.streakBreaksUsed
                                }}
                                buddyName={buddyState.buddyName}
                            />
                            <View style={styles.challengeStats}>
                                <Text style={styles.statLine}>Current Streak: <Text style={{ fontWeight: 'bold', color: Colors.primary }}>{stats.streakBreaksUsed === 0 ? 'Perfect' : 'Active'}</Text></Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.inviteCard}>
                            <Users size={32} color={Colors.textSecondary} style={{ marginBottom: 10 }} />
                            <Text style={styles.inviteTitle}>Buddy Challenge</Text>
                            <Text style={styles.inviteText}>
                                Accountability doubles your success rate. Invite a friend to a 21-Day connection.
                            </Text>
                            <PremiumButton
                                title="Invite a Friend"
                                onPress={() => router.push('/social/invite')}
                                variant="outline"
                                style={{ marginTop: 10, width: '100%' }}
                            />
                            <Text style={styles.pendingText}>0 Pending Invites</Text>
                        </View>
                    )}
                </View>

                {/* 4. Guide Section */}
                <View style={styles.section}>
                    <GuideSection />
                </View>

                {/* Footer Actions */}
                <PremiumButton
                    title="Return to Timer"
                    onPress={() => router.push('/')}
                    variant="secondary"
                    style={{ marginBottom: 15 }}
                />

                <Button
                    title="Sign Out"
                    onPress={handleSignOut}
                    variant="ghost"
                    textStyle={{ color: Colors.textSecondary }}
                />
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
        paddingTop: 50,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    lotusShowcase: {
        alignItems: 'center',
        marginBottom: 30,
    },
    lotusTitle: {
        fontSize: 18,
        color: Colors.primary,
        fontWeight: '600',
        marginBottom: 10,
    },
    lotusSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 10,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
        paddingLeft: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
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
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inviteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    inviteText: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
        lineHeight: 20,
    },
    pendingText: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 10,
        fontStyle: 'italic',
    },
    challengeStats: {
        marginTop: 10,
        alignItems: 'center',
    },
    statLine: {
        color: Colors.text,
        fontSize: 14,
    }
});
