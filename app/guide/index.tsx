import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Share,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
    ChevronRight, ArrowLeft, Users, Copy, RefreshCw, Lock, StickyNote,
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import {
    useLinkedClients, useUserRole, useGuideInviteCode,
    capacityForTier, GUIDE_CAPACITY,
} from '../../hooks/useBeGuide';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { usePurchase } from '../../contexts/PurchaseContext';

export default function GuideIndex() {
    useProtectedRoute();
    const router = useRouter();
    const role = useUserRole();
    const isGuide = role === 'therapist';
    const { clients, loading } = useLinkedClients(isGuide);
    const { user } = useAuth();
    const { isPro } = usePurchase();
    const { code, generate, revoke, generating } = useGuideInviteCode();

    // Purchase-tier gating: free therapists can browse but not link.
    const purchaseTier: 'free' | 'pro' | 'lifetime' = isPro ? 'pro' : 'free';
    const capacity = capacityForTier(purchaseTier);
    const atCapacity = capacity > 0 && clients.length >= capacity;

    const handleShareCode = async () => {
        if (!code) return;
        try {
            await Share.share({
                message: `Link with me on BE333 — enter this invite code in Settings → Link a BE Guide:\n\n${code}\n\n${user?.email ? `(Or use my email: ${user.email})` : ''}`.trim(),
            });
        } catch { /* user cancelled */ }
    };

    const handleGenerate = async () => {
        const next = await generate();
        if (!next) Alert.alert('Could not create code', 'Try again in a moment.');
    };

    const handleRevoke = () => {
        Alert.alert('Revoke invite code?', 'The current code will stop working. You can generate a new one anytime.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Revoke', style: 'destructive', onPress: revoke },
        ]);
    };

    if (role === 'loading') {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.hint}>Loading…</Text>
            </View>
        );
    }

    if (!isGuide) {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
                <View style={styles.emptyState}>
                    <Users size={40} color={Colors.textSecondary} />
                    <Text style={styles.emptyTitle}>BE Guide View</Text>
                    <Text style={styles.emptyBody}>
                        This area is for BE Guides (therapists, coaches, or mental-health
                        professionals). If you signed up as a BE Guide, log out and back in.
                    </Text>
                </View>
            </View>
        );
    }

    // Therapist without Pro subscription — paywall gate.
    if (isGuide && !isPro) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                        <ArrowLeft size={18} color={Colors.text} />
                        <Text style={styles.backText}>Home</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>BE Guide View</Text>
                    <View style={{ width: 60 }} />
                </View>
                <View style={styles.paywallCard}>
                    <Lock size={28} color={Colors.secondary} />
                    <Text style={styles.paywallTitle}>Therapist Pro required</Text>
                    <Text style={styles.paywallBody}>
                        Linking clients and viewing their practice needs an active Therapist Pro
                        subscription. Pro seats accept up to {GUIDE_CAPACITY.pro} clients; Lifetime seats
                        accept up to {GUIDE_CAPACITY.lifetime}.
                    </Text>
                    <TouchableOpacity style={styles.paywallCta} onPress={() => router.push('/dashboard')}>
                        <Text style={styles.paywallCtaText}>See plans</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>BE Guide View</Text>
                <View style={styles.capacityChip}>
                    <Text style={styles.capacityChipText}>
                        {clients.length} / {capacity}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Invite code panel */}
                <View style={styles.invitePanel}>
                    <View style={styles.inviteHeader}>
                        <Text style={styles.inviteLabel}>Invite code</Text>
                        {code && (
                            <TouchableOpacity onPress={handleRevoke} style={styles.revokeBtn}>
                                <Text style={styles.revokeText}>Revoke</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {code ? (
                        <>
                            <View style={styles.codeRow}>
                                <Text style={styles.codeText}>{code}</Text>
                                <TouchableOpacity onPress={handleShareCode} style={styles.copyBtn}>
                                    <Copy size={14} color={Colors.secondary} />
                                    <Text style={styles.copyText}>Share</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.inviteHint}>
                                Clients enter this in Settings → Link a BE Guide.
                            </Text>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={styles.generateBtn}
                            onPress={handleGenerate}
                            disabled={generating}
                        >
                            {generating ? (
                                <ActivityIndicator color={Colors.secondary} size="small" />
                            ) : (
                                <>
                                    <RefreshCw size={14} color={Colors.secondary} />
                                    <Text style={styles.generateBtnText}>Generate invite code</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.notesNav}
                    onPress={() => router.push('/guide/notes')}
                    activeOpacity={0.75}
                >
                    <StickyNote size={16} color={Colors.secondary} />
                    <Text style={styles.notesNavText}>Recent notes across all clients</Text>
                    <ChevronRight size={16} color={Colors.textSecondary} />
                </TouchableOpacity>

                <Text style={styles.subheader}>
                    Linked clients — tap a name to see their Lotus Bloom Map, snapshot stats,
                    and your notes on their practice.
                </Text>

                {atCapacity && (
                    <View style={styles.capacityWarn}>
                        <Text style={styles.capacityWarnText}>
                            Your roster is full ({clients.length} / {capacity}). New clients trying to link will see a "capacity reached" message until you unlink someone or upgrade.
                        </Text>
                    </View>
                )}

                {loading ? (
                    <Text style={styles.hint}>Loading clients…</Text>
                ) : clients.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Users size={32} color={Colors.textSecondary} />
                        <Text style={styles.emptyTitle}>No linked clients yet</Text>
                        <Text style={styles.emptyBody}>
                            Share your invite code, or ask a client to open Settings → Link a BE
                            Guide and enter your email.
                        </Text>
                    </View>
                ) : (
                    clients.map((c) => (
                        <TouchableOpacity
                            key={c.uid}
                            style={styles.clientRow}
                            onPress={() => router.push({ pathname: '/guide/[uid]', params: { uid: c.uid } })}
                        >
                            {c.photoURL ? (
                                <Image source={{ uri: c.photoURL }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <Text style={styles.avatarInitial}>
                                        {c.displayName.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.clientName}>{c.displayName}</Text>
                                <Text style={styles.clientMeta}>
                                    Day {c.bePractice?.dayOfPractice ?? '—'} · {c.bePractice?.bloomDays ?? 0} petals ·
                                    Stage {c.bePractice?.practiceStage ?? '333'}
                                </Text>
                                {!c.shareWithGuide && (
                                    <Text style={styles.hint}>Client has paused sharing.</Text>
                                )}
                            </View>
                            <ChevronRight size={20} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background, padding: 16 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: { color: Colors.text, fontSize: 18, fontWeight: '700' },
    subheader: {
        color: Colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        marginVertical: 12,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    backText: { color: Colors.text, fontSize: 13, fontWeight: '600' },

    capacityChip: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.4)',
        backgroundColor: 'rgba(225,183,37,0.12)',
        minWidth: 60,
        alignItems: 'center',
    },
    capacityChipText: {
        color: Colors.secondary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    invitePanel: {
        marginTop: 4,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.35)',
        backgroundColor: 'rgba(26,67,49,0.5)',
    },
    inviteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    inviteLabel: {
        color: Colors.secondary,
        fontSize: 10,
        letterSpacing: 1,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    revokeBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    revokeText: { color: '#E57373', fontSize: 11, fontWeight: '600' },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    codeText: {
        color: '#FFF8DC',
        fontSize: 22,
        fontFamily: 'monospace',
        letterSpacing: 2,
        fontWeight: '700',
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.secondary,
        backgroundColor: 'rgba(225,183,37,0.15)',
    },
    copyText: { color: Colors.secondary, fontSize: 12, fontWeight: '600' },
    inviteHint: {
        color: Colors.textSecondary,
        fontSize: 11,
        marginTop: 6,
        lineHeight: 16,
    },
    generateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.secondary,
        backgroundColor: 'rgba(225,183,37,0.1)',
        minHeight: 34,
    },
    generateBtnText: { color: Colors.secondary, fontSize: 13, fontWeight: '600' },

    notesNav: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.35)',
        backgroundColor: 'rgba(26,67,49,0.4)',
    },
    notesNavText: {
        flex: 1,
        color: Colors.text,
        fontSize: 13,
        fontWeight: '600',
    },

    capacityWarn: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,180,0,0.4)',
        backgroundColor: 'rgba(255,180,0,0.1)',
        marginBottom: 12,
    },
    capacityWarnText: { color: '#FFE580', fontSize: 12, lineHeight: 18 },

    clientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginBottom: 10,
    },
    avatar: { width: 44, height: 44, borderRadius: 22 },
    avatarPlaceholder: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    clientName: { color: Colors.text, fontSize: 15, fontWeight: '600' },
    clientMeta: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
    hint: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
    },
    emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
    emptyTitle: {
        color: Colors.text,
        fontSize: 17,
        fontWeight: '700',
        marginTop: 14,
        marginBottom: 6,
    },
    emptyBody: {
        color: Colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },

    paywallCard: {
        margin: 20,
        padding: 24,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.4)',
        backgroundColor: 'rgba(26,67,49,0.6)',
        alignItems: 'center',
    },
    paywallTitle: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 8,
    },
    paywallBody: {
        color: Colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    paywallCta: {
        backgroundColor: Colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    paywallCtaText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});
