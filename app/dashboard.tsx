import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Colors } from '../constants/Colors';
import { Button } from '../components/Button';
import { PremiumButton } from '../components/PremiumButton';
import { ProFeatureLock } from '../components/ProFeatureLock';
import { useBePractice } from '../hooks/useBePractice';
import { useSettings } from '../contexts/SettingsContext';
import { useBeBuddy } from '../hooks/useBeBuddy';
import { LotusBloomMap } from '../components/LotusBloomMap';
import { BuddyBoard } from '../components/BuddyBoard';
import { TrendChart } from '../components/TrendChart';
import { GuideSection } from '../components/GuideSection';
import { useUserRole } from '../hooks/useBeGuide';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'expo-router';
import { usePurchase } from '../contexts/PurchaseContext';
import { Users, Trophy, Camera, Share2, Instagram, Facebook, Settings as SettingsIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Share, Alert, ActivityIndicator, Linking } from 'react-native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from '../lib/firebase';

export default function Dashboard() {
    const { user } = useAuth();
    const { stats, loading: practiceLoading, startNewPractice, completeStageAndAdvance } = useBePractice();
    const { buddyState, buddyStats } = useBeBuddy();
    const role = useUserRole();
    const { isPro } = usePurchase();
    const { socialLinks } = useSettings();

    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    useProtectedRoute();

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri && user) {
                setUploading(true);
                const uri = result.assets[0].uri;

                // For web/expo-go compatibility in demo, we might just use the local URI or upload if possible
                // Real upload to Firebase Storage:
                try {
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    const fileRef = ref(storage, `profiles/${user.uid}/avatar.jpg`);
                    await uploadBytes(fileRef, blob);
                    const photoURL = await getDownloadURL(fileRef);

                    await updateProfile(user, { photoURL });
                    // Force refresh or just let AuthContext eventually catch up (it might need a reload)
                    // We can manually update the current user object if needed, but context user usually updates on reload.
                    // Ideally we'd have a setUser in context, but for now this persists it.
                    Alert.alert("Success", "Profile picture updated!");
                } catch (e: unknown) {
                    console.error('Upload failed', e);
                    Alert.alert('Error', 'Failed to upload image: ' + (e instanceof Error ? e.message : String(e)));
                } finally {
                    setUploading(false);
                }
            }
        } catch (e) {
            console.log("Picker error", e);
            setUploading(false);
        }
    };

    const handleShare = async (platform: 'tiktok' | 'facebook' | 'instagram') => {
        // If the user has linked a specific profile, try to open that.
        // Otherwise, use the primitive system share for general sharing.

        try {
            const message = `I'm on Day ${stats?.dayOfPractice || 1} of my 21-day breathing journey with BE333! Pause. Breathe. Join me.`;
            let url = '';

            // Check if user linked their profile (Deep linking logic can be complex, these are basic web fallbacks)
            if (platform === 'tiktok' && socialLinks?.tiktok) {
                // Just open the app or their profile if linked? 
                // Usually "sharing" means posting. But user said "link Ticktock... to share progress". 
                // If they want to POST, we usually need the system share sheet or specific SDKs.
                // For now, I'll default to the system share sheet but maybe PREP the clipboard?
                await Share.share({ message });
                return;
            }

            // Default behavior: specific intents if possible, else standard Share
            await Share.share({
                message: message,
                title: 'My BE333 Journey'
            });

        } catch (error: unknown) {
            Alert.alert('Sharing Error', error instanceof Error ? error.message : 'Could not share');
        }
    };

    async function handleSignOut() {
        try {
            await signOut(auth);
        } catch (e: unknown) {
            Alert.alert('Sign Out Error', e instanceof Error ? e.message : 'Could not sign out');
        }
    }

    if (practiceLoading || !stats) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: Colors.text }}>Loading Practice...</Text>
            </View>
        );
    }

    const targetPauses = 3;

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Practice Playground</Text>
                    <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerSettingsBtn}>
                        <SettingsIcon size={24} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Profile & Social Header */}
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
                        {user?.photoURL ? (
                            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, { backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' }]}>
                                <Users size={40} color={Colors.textSecondary} />
                            </View>
                        )}
                        <View style={styles.editBadge}>
                            {uploading ? <ActivityIndicator size="small" color="#FFF" /> : <Camera size={14} color="#FFF" />}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.userName}>{user?.displayName || 'Breather'}</Text>

                    <View style={styles.shareRow}>
                        <TouchableOpacity onPress={() => handleShare('tiktok')} style={[styles.shareBtn, { backgroundColor: '#000' }]}>
                            <Text style={styles.shareBtnText}>TikTok</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleShare('facebook')} style={[styles.shareBtn, { backgroundColor: '#1877F2' }]}>
                            <Facebook size={16} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleShare('instagram')} style={[styles.shareBtn, { backgroundColor: '#E1306C' }]}>
                            <Instagram size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.shareHint}>Share your progress for accountability!</Text>
                </View>

                {/* 1. Golden Lotus Showcase */}
                <View style={styles.lotusShowcase}>
                    <Image
                        source={require('../assets/images/be333_text_logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.lotusTitle}>Day {stats?.dayOfPractice || 1} of 21</Text>
                    <Text style={styles.stageLabel}>
                        Stage {stats?.practiceStage || '333'} · {
                            stats?.practiceStage === '999' ? '9 min × 3'
                                : stats?.practiceStage === '666' ? '6 min × 3'
                                    : '3 min × 3'
                        }
                    </Text>
                    <LotusBloomMap bloomDays={stats?.bloomDays || 0} dayOfPractice={stats?.dayOfPractice || 0} />

                    {role === 'therapist' && (
                        <TouchableOpacity
                            style={styles.guideNav}
                            onPress={() => router.push('/guide')}
                        >
                            <Users size={16} color="#FFD700" />
                            <Text style={styles.guideNavText}>Open BE Guide View</Text>
                        </TouchableOpacity>
                    )}

                    {/* Practice complete → offer next stage or restart */}
                    {stats && stats.dayOfPractice > 21 && (
                        <View style={styles.stageAdvanceCard}>
                            <Text style={styles.stageAdvanceTitle}>Practice Complete</Text>
                            <Text style={styles.stageAdvanceBody}>
                                Twenty-one days of Stage {stats.practiceStage || '333'}. What's next?
                            </Text>
                            {stats.practiceStage !== '999' && (
                                <TouchableOpacity
                                    style={styles.stageAdvanceBtn}
                                    onPress={() => completeStageAndAdvance()}
                                >
                                    <Text style={styles.stageAdvanceBtnText}>
                                        Advance to Stage {stats.practiceStage === '666' ? '999' : '666'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.stageAdvanceBtn, styles.stageAdvanceBtnSecondary]}
                                onPress={() => startNewPractice({ stage: stats.practiceStage || '333' })}
                            >
                                <Text style={styles.stageAdvanceBtnText}>
                                    Repeat Stage {stats.practiceStage || '333'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Awards / Trophy Case */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Trophy size={18} color="#FFD700" />
                        <Text style={styles.sectionTitle}>Trophy Case</Text>
                    </View>

                    {/* 3D Shelf container */}
                    <View style={styles.trophyCaseContainer}>
                        <View style={styles.shelfLevel}>
                            {/* Placeholder trophies - User will describe later */}
                            <Text style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontSize: 12 }}>
                                Empty Shelf
                            </Text>
                        </View>
                        <View style={styles.shelfShadow} />

                        <View style={styles.shelfLevel}>
                            <Text style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontSize: 12 }}>
                                Empty Shelf
                            </Text>
                        </View>
                        <View style={styles.shelfShadow} />
                    </View>
                </View>

                {/* 2. Trends Section */}
                <View style={styles.section}>
                    <TrendChart
                        currentPauses={stats.currentPauses}
                        history={stats.recentHistory || []}
                    />
                </View>

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
            </ScrollView >
        </View >
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
    },
    headerSettingsBtn: {
        position: 'absolute',
        right: 0,
        padding: 5,
    },
    logoImage: {
        width: 120,
        height: 40,
        marginBottom: 10,
    },
    lotusShowcase: {
        alignItems: 'center',
        marginBottom: 30,
        // Removed redundant text
    },
    guideNav: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 14,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.4)',
        backgroundColor: 'rgba(255,215,0,0.1)',
        alignSelf: 'center',
    },
    guideNavText: {
        color: '#FFD700',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    stageLabel: {
        fontSize: 12,
        color: '#DAA520',
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: 4,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    stageAdvanceCard: {
        marginTop: 20,
        padding: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.4)',
        backgroundColor: 'rgba(26,67,49,0.6)',
        width: '100%',
    },
    stageAdvanceTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 6,
        textAlign: 'center',
    },
    stageAdvanceBody: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 14,
        lineHeight: 20,
    },
    stageAdvanceBtn: {
        marginTop: 8,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255,215,0,0.2)',
        alignItems: 'center',
    },
    stageAdvanceBtnSecondary: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    stageAdvanceBtnText: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.4,
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
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.primary,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.background,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 15,
    },
    shareRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 5,
    },
    shareBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        height: 40,
    },
    shareBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    shareHint: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 5,
        fontStyle: 'italic',
    },
    trophyCaseContainer: {
        backgroundColor: 'rgba(60, 40, 20, 0.4)', // Dark wood-ish tint
        borderRadius: 12,
        padding: 15,
        borderWidth: 4,
        borderColor: '#5D4037', // Wood frame color
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    shelfLevel: {
        height: 60,
        borderBottomWidth: 8,
        borderBottomColor: '#3E2723', // Darker shelf edge
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0.2)', // Inner depth
    },
    shelfShadow: {
        width: '100%',
        height: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        top: -10,
        marginBottom: 5,
        borderRadius: 5,
    }
});
