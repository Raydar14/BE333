import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartHandshake, ShieldCheck, LinkIcon, Users, Unlink } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useGuideLink, useUserRole } from '../hooks/useBeGuide';

/**
 * GuideSection — dashboard card that adapts to the viewer's role.
 *
 * Client (role = 'user'): shows current linked BE Guide + share toggle,
 * or a CTA to link one in Settings.
 *
 * Therapist (role = 'therapist'): shows an "Open BE Guide View" CTA.
 *
 * Real data from useGuideLink() / useUserRole() — replaces the earlier
 * mocked "share key" UI.
 */
export function GuideSection() {
    const router = useRouter();
    const role = useUserRole();
    const {
        linkedGuideEmail,
        shareWithGuide,
        loading,
        unlinkGuide,
        setShareWithGuide,
    } = useGuideLink();

    if (role === 'loading' || loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Loading…</Text>
            </View>
        );
    }

    // Therapist view of this card
    if (role === 'therapist') {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Users color={Colors.secondary} size={22} />
                    <Text style={styles.title}>BE Guide View</Text>
                </View>
                <Text style={styles.description}>
                    Track your clients' mindfulness practice at a glance. Client notes,
                    invite codes, and capacity settings all live in the Guide View.
                </Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/guide')}>
                    <Text style={styles.primaryBtnText}>Open BE Guide View</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Client view — no guide linked
    if (!linkedGuideEmail) {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <HeartHandshake color={Colors.primary} size={22} />
                    <Text style={styles.title}>Your BE Guide</Text>
                </View>
                <Text style={styles.description}>
                    Share your practice with a therapist, coach, or mental-health
                    professional. Only Bloom Days, Missed Pauses, and your Lotus Bloom Map
                    are visible — never your written entries in My Work.
                </Text>
                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => router.push('/settings')}
                >
                    <LinkIcon size={14} color={Colors.text} />
                    <Text style={styles.secondaryBtnText}>Link a BE Guide in Settings</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Client view — guide linked
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <HeartHandshake color={Colors.primary} size={22} />
                <Text style={styles.title}>Your BE Guide</Text>
            </View>

            <View style={styles.linkedBox}>
                <Text style={styles.linkedLabel}>Currently linked</Text>
                <Text style={styles.linkedEmail}>{linkedGuideEmail}</Text>
            </View>

            <View style={styles.shareRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={styles.shareLabel}>Share Progress</Text>
                    <Text style={styles.shareHint}>
                        {shareWithGuide
                            ? 'Live Bloom Days and Missed Pauses visible in their dashboard.'
                            : 'Paused — your Guide sees your last snapshot only.'}
                    </Text>
                </View>
                <Switch
                    value={shareWithGuide}
                    onValueChange={setShareWithGuide}
                    trackColor={{ false: '#767577', true: Colors.primary }}
                    thumbColor={shareWithGuide ? '#fff' : '#f4f3f4'}
                />
            </View>

            <View style={styles.footerRow}>
                <ShieldCheck size={12} color={Colors.textSecondary} />
                <Text style={styles.secureText}>
                    Written entries in My Work are never shared.
                </Text>
                <TouchableOpacity onPress={unlinkGuide} style={styles.unlinkBtn}>
                    <Unlink size={12} color="#E57373" />
                    <Text style={styles.unlinkText}>Unlink</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    loading: {
        color: Colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text,
    },
    description: {
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 19,
        marginBottom: 14,
    },
    primaryBtn: {
        backgroundColor: Colors.secondary,
        paddingVertical: 11,
        borderRadius: 10,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.3,
    },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    secondaryBtnText: {
        color: Colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
    linkedBox: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.35)',
        backgroundColor: 'rgba(225,183,37,0.08)',
        marginBottom: 10,
    },
    linkedLabel: {
        color: Colors.secondary,
        fontSize: 10,
        letterSpacing: 1,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    linkedEmail: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    shareRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        marginBottom: 6,
    },
    shareLabel: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    shareHint: {
        color: Colors.textSecondary,
        fontSize: 11,
        marginTop: 2,
        lineHeight: 15,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    secureText: {
        flex: 1,
        color: Colors.textSecondary,
        fontSize: 11,
    },
    unlinkBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    unlinkText: {
        color: '#E57373',
        fontSize: 11,
        fontWeight: '600',
    },
});
