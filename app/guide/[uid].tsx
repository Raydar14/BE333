import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useLinkedClient, useUserRole } from '../../hooks/useBeGuide';
import { LotusBloomMap } from '../../components/LotusBloomMap';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

export default function GuideClientDetail() {
    useProtectedRoute();
    const params = useLocalSearchParams();
    const router = useRouter();
    const role = useUserRole();
    const uid = typeof params.uid === 'string' ? params.uid : '';
    const { client, loading } = useLinkedClient(uid);

    if (role !== 'therapist') {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
                <Text style={styles.hint}>This view is for BE Guides only.</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.hint}>Loading client…</Text>
            </View>
        );
    }

    if (!client) {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.hint}>Client not found.</Text>
            </View>
        );
    }

    const stats = client.bePractice;
    const recent = stats?.recentHistory ?? [];

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Guides</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{client.displayName}</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {!client.shareWithGuide && (
                    <View style={styles.warnBox}>
                        <Text style={styles.warnText}>
                            {client.displayName} has paused sharing with you. Progress may be out of date.
                        </Text>
                    </View>
                )}

                {/* Snapshot */}
                <View style={styles.snapshotRow}>
                    <Stat label="Day" value={String(stats?.dayOfPractice ?? '—')} />
                    <Stat label="Petals" value={String(stats?.bloomDays ?? 0)} />
                    <Stat label="Stage" value={stats?.practiceStage ?? '333'} />
                </View>

                <View style={styles.snapshotRow}>
                    <Stat label="Streak breaks" value={String(stats?.streakBreaksUsed ?? 0) + ' / 3'} />
                    <Stat label="Today" value={String(stats?.currentPauses ?? 0) + ' / 3'} />
                    <Stat label="State" value={stats?.practiceState ?? '—'} />
                </View>

                {/* Lotus Bloom Map */}
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <LotusBloomMap
                        bloomDays={stats?.bloomDays ?? 0}
                        dayOfPractice={stats?.dayOfPractice ?? 0}
                    />
                </View>

                {/* Recent history */}
                <Text style={styles.sectionTitle}>Recent days</Text>
                {recent.length === 0 ? (
                    <Text style={styles.hint}>No history yet.</Text>
                ) : (
                    recent.map((day, i) => (
                        <View key={i} style={styles.historyRow}>
                            <Text style={styles.historyDate}>{day.date}</Text>
                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                {[0, 1, 2].map((idx) => (
                                    <View
                                        key={idx}
                                        style={[
                                            styles.pauseDot,
                                            idx < (day.pauses ?? 0) && styles.pauseDotOn,
                                        ]}
                                    />
                                ))}
                            </View>
                            <Text style={styles.historyLabel}>
                                {day.pauses >= 3 ? 'Bloom Day' : day.pauses === 0 ? 'Rest Day' : `${day.pauses}/3`}
                            </Text>
                        </View>
                    ))
                )}

                <Text style={styles.disclaimer}>
                    Use this as a conversation starter, not a performance score.
                </Text>
            </ScrollView>
        </View>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
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
        marginBottom: 12,
    },
    headerTitle: {
        color: Colors.text,
        fontSize: 17,
        fontWeight: '700',
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
    hint: {
        color: Colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        padding: 20,
    },
    snapshotRow: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 8,
    },
    statCard: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center',
    },
    statValue: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: '800',
    },
    statLabel: {
        marginTop: 4,
        color: Colors.textSecondary,
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 6,
    },
    historyDate: {
        color: Colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
    pauseDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'transparent',
    },
    pauseDotOn: {
        backgroundColor: '#4A9977',
        borderColor: '#4A9977',
    },
    historyLabel: {
        color: Colors.textSecondary,
        fontSize: 11,
        fontStyle: 'italic',
    },
    warnBox: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,180,0,0.4)',
        backgroundColor: 'rgba(255,180,0,0.1)',
        marginBottom: 12,
    },
    warnText: {
        color: '#FFE580',
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
    disclaimer: {
        color: Colors.textSecondary,
        fontSize: 11,
        fontStyle: 'italic',
        marginTop: 30,
        textAlign: 'center',
        lineHeight: 18,
    },
});
