import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, NotebookPen } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useLinkedClient, useUserRole, useClientNotes } from '../../hooks/useBeGuide';
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

                {/* Private notes — only the Guide sees these */}
                <ClientNotesPanel clientUid={uid} clientDisplayName={client.displayName} />

                <Text style={styles.disclaimer}>
                    Use this as a conversation starter, not a performance score.
                </Text>
            </ScrollView>
        </View>
    );
}

// Debounced-autosave notes card. The client never sees this content.
function ClientNotesPanel({
    clientUid,
    clientDisplayName,
}: {
    clientUid: string;
    clientDisplayName: string;
}) {
    const { text, savedAt, save, loading } = useClientNotes(clientUid);
    const [draft, setDraft] = useState('');
    const [dirty, setDirty] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Sync remote text into local draft when it first loads or clientUid changes.
    useEffect(() => {
        if (!dirty) setDraft(text);
    }, [text, clientUid]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (v: string) => {
        setDraft(v);
        setDirty(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            save(v, clientDisplayName);
            setDirty(false);
        }, 1200);
    };

    return (
        <View style={styles.notesCard}>
            <View style={styles.notesHeader}>
                <NotebookPen size={14} color={Colors.secondary} />
                <Text style={styles.notesTitle}>Private notes</Text>
                <Text style={styles.notesStatus}>
                    {dirty ? 'Saving…' : savedAt ? `Saved ${savedAt.toLocaleDateString()}` : ''}
                </Text>
            </View>
            <Text style={styles.notesHint}>
                Session context, homework observations, reminders. Only visible to you.
            </Text>
            <TextInput
                value={draft}
                onChangeText={handleChange}
                multiline
                placeholder={loading ? 'Loading notes…' : 'Start typing your notes on this client…'}
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.notesInput}
                textAlignVertical="top"
                editable={!loading}
            />
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
    notesCard: {
        marginTop: 24,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.35)',
        backgroundColor: 'rgba(26,67,49,0.5)',
    },
    notesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    notesTitle: {
        color: Colors.secondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        flex: 1,
    },
    notesStatus: {
        color: Colors.textSecondary,
        fontSize: 10,
        fontStyle: 'italic',
    },
    notesHint: {
        color: Colors.textSecondary,
        fontSize: 11,
        lineHeight: 15,
        marginBottom: 8,
    },
    notesInput: {
        minHeight: 120,
        color: '#FFF8DC',
        fontSize: 14,
        lineHeight: 20,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(0,0,0,0.25)',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
    },
});
