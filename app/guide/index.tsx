import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, ArrowLeft, Users } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useLinkedClients, useUserRole } from '../../hooks/useBeGuide';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

export default function GuideIndex() {
    useProtectedRoute();
    const router = useRouter();
    const role = useUserRole();
    const isGuide = role === 'therapist';
    const { clients, loading } = useLinkedClients(isGuide);

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

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={styles.subheader}>
                    Your linked clients. Tap a client to see their Lotus Bloom Map and recent
                    Practice summary.
                </Text>

                {loading ? (
                    <Text style={styles.hint}>Loading clients…</Text>
                ) : clients.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Users size={32} color={Colors.textSecondary} />
                        <Text style={styles.emptyTitle}>No linked clients yet</Text>
                        <Text style={styles.emptyBody}>
                            Ask a client to open Settings → Link a BE Guide and enter your email.
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
    wrapper: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
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
    backText: {
        color: Colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
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
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    clientName: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
    clientMeta: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    hint: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
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
});
