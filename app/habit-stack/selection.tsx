import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { usePurchase } from '../../contexts/PurchaseContext';
import { ProFeatureLock } from '../../components/ProFeatureLock';
import { HabitActivity } from '../../hooks/useHabitStack';
import { useSettings } from '../../contexts/SettingsContext';

type TimerMode = 'timer' | 'count_up';

const ACTIVITIES: HabitActivity[] = [
    'Yoga', 'Chanting', 'Singing', 'Journaling',
    'Stretching', 'Gratitude', 'Poetry',
    'Day Planning', 'Prayer', 'Mantra'
];

export default function HabitSelectionScreen() {
    const router = useRouter();
    const { isPro } = usePurchase();
    const { hidePrayers } = useSettings();
    const visibleActivities = hidePrayers ? ACTIVITIES.filter(a => a !== 'Prayer') : ACTIVITIES;

    const [selectedActivity, setSelectedActivity] = useState<HabitActivity | null>(null);
    const [mode, setMode] = useState<TimerMode>('timer');
    const [durationMinutes, setDurationMinutes] = useState('3'); // Default 3 for everyone

    const handleStart = () => {
        if (!selectedActivity) return;

        const durationSec = parseInt(durationMinutes) * 60;

        router.push({
            pathname: '/habit-stack/timer',
            params: {
                activity: selectedActivity,
                mode: mode,
                durationSeconds: isNaN(durationSec) ? 180 : durationSec
            }
        });
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => router.push('/dashboard')}>
                        <Text style={styles.homeLink}>Home</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.header}>Stack a Positive Habit</Text>
                <Text style={styles.subHeader}>Extend your mindfulness practice.</Text>

                {/* Activity Grid */}
                <Text style={styles.sectionTitle}>1. Choose Activity</Text>
                <View style={styles.grid}>
                    {visibleActivities.map((activity) => (
                        <TouchableOpacity
                            key={activity}
                            style={[
                                styles.activityCard,
                                selectedActivity === activity && styles.activityCardSelected
                            ]}
                            onPress={() => setSelectedActivity(activity)}
                        >
                            <Text style={[
                                styles.activityText,
                                selectedActivity === activity && styles.activityTextSelected
                            ]}>{activity}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Settings Section */}
                {selectedActivity && (
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>2. Configure Session</Text>

                        {/* Timer Mode Toggle - Pro Only */}
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Stopwatch Mode (Count Up)</Text>
                            {isPro ? (
                                <Switch
                                    value={mode === 'count_up'}
                                    onValueChange={(val) => setMode(val ? 'count_up' : 'timer')}
                                    trackColor={{ false: Colors.border, true: Colors.primary }}
                                />
                            ) : (
                                <ProFeatureLock />
                            )}
                        </View>

                        {/* Duration Input */}
                        {mode === 'timer' && (
                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Duration (Minutes)</Text>
                                {isPro ? (
                                    <TextInput
                                        style={styles.durationInput}
                                        value={durationMinutes}
                                        onChangeText={setDurationMinutes}
                                        keyboardType="number-pad"
                                        maxLength={3}
                                    />
                                ) : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Text style={styles.lockedValue}>3 min</Text>
                                        <ProFeatureLock />
                                    </View>
                                )}
                            </View>
                        )}

                        {!isPro && (
                            <Text style={styles.proHint}>
                                Unlock Pro to use Stopwatch mode and custom timer durations.
                            </Text>
                        )}
                    </View>
                )}

                <View style={{ flex: 1 }} />

                <Button
                    title="Start Stack"
                    onPress={handleStart}
                    disabled={!selectedActivity}
                    style={{ marginTop: 30, marginBottom: 20 }}
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
        paddingTop: 20,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    homeLink: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 15,
        marginTop: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 30,
    },
    activityCard: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    activityCardSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    activityText: {
        color: Colors.text,
        fontWeight: '500',
    },
    activityTextSelected: {
        color: '#FFFFFF',
    },
    settingsSection: {
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    settingLabel: {
        fontSize: 16,
        color: Colors.text,
    },
    durationInput: {
        backgroundColor: Colors.background,
        color: Colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        minWidth: 60,
        textAlign: 'center',
    },
    lockedValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textSecondary,
    },
    proHint: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        marginTop: 5,
    }
});
