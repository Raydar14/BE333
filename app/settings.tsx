import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useBiofeedback } from '../contexts/BiofeedbackContext';
import { Colors } from '../constants/Colors';
import { ProFeatureLock } from '../components/ProFeatureLock';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react-native';

export default function Settings() {
    const { colors, setPrimaryColor, setSecondaryColor, resetTheme } = useTheme();
    const { timerDuration, setTimerDuration, habitCue, setHabitCue } = useSettings();
    const {
        audioFeedbackEnabled,
        setAudioFeedback,
        audioFeedbackMetric,
        setAudioFeedbackMetric,
        isDemoMode,
        toggleDemoMode
    } = useBiofeedback();
    const router = useRouter();

    // Helper to convert seconds to minutes for display
    const durationMins = Math.floor(timerDuration / 60);

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.primary }]}>Settings</Text>
                    <TouchableOpacity onPress={() => router.push('/')} style={{ marginLeft: 'auto' }}>
                        <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Done</Text>
                    </TouchableOpacity>
                </View>

                {/* Timer Settings (Pro) */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Timer Duration</Text>
                    <ProFeatureLock label="Pro Feature">
                        <View style={styles.settingRow}>
                            <Text style={[styles.label, { color: colors.text }]}>Duration (Minutes):</Text>
                            <View style={styles.durationControls}>
                                <TouchableOpacity
                                    onPress={() => setTimerDuration(Math.max(60, timerDuration - 60))}
                                    style={[styles.controlButton, { borderColor: colors.primary }]}
                                >
                                    <Text style={{ color: colors.primary }}>-</Text>
                                </TouchableOpacity>

                                <Text style={[styles.value, { color: colors.text }]}>{durationMins} min</Text>

                                <TouchableOpacity
                                    onPress={() => setTimerDuration(timerDuration + 60)}
                                    style={[styles.controlButton, { borderColor: colors.primary }]}
                                >
                                    <Text style={{ color: colors.primary }}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ProFeatureLock>
                </View>

                {/* Breathing Visuals */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Visuals</Text>
                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Breathing Guide</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                Show "Expand/Shrink Belly" text
                            </Text>
                        </View>
                        <Switch
                            value={useSettings().showBreathingGuide}
                            onValueChange={useSettings().setShowBreathingGuide}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={useSettings().showBreathingGuide ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Nature Visuals</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                Show Lotus, Flowers & Leaves
                            </Text>
                        </View>
                        <Switch
                            value={useSettings().showNatureVisuals}
                            onValueChange={useSettings().setShowNatureVisuals}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={useSettings().showNatureVisuals ? "#fff" : "#f4f3f4"}
                        />
                    </View>
                </View>

                {/* Biofeedback Settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Biofeedback</Text>
                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Audio Feedback</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                Play sound when you improve
                            </Text>
                        </View>
                        <Switch
                            value={audioFeedbackEnabled}
                            onValueChange={setAudioFeedback}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={audioFeedbackEnabled ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    {audioFeedbackEnabled && (
                        <View style={styles.settingRow}>
                            <Text style={[styles.label, { color: colors.text }]}>Metric to Track:</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    style={[
                                        styles.optionButton,
                                        audioFeedbackMetric === 'hr' && { backgroundColor: colors.primary }
                                    ]}
                                    onPress={() => setAudioFeedbackMetric('hr')}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        { color: audioFeedbackMetric === 'hr' ? '#fff' : colors.text }
                                    ]}>Heart Rate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.optionButton,
                                        audioFeedbackMetric === 'hrv' && { backgroundColor: colors.primary }
                                    ]}
                                    onPress={() => setAudioFeedbackMetric('hrv')}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        { color: audioFeedbackMetric === 'hrv' ? '#fff' : colors.text }
                                    ]}>HRV</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={[styles.settingRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }]}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Demo Mode</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                Simulate biofeedback data
                            </Text>
                        </View>
                        <Switch
                            value={isDemoMode}
                            onValueChange={toggleDemoMode}
                            trackColor={{ false: "#767577", true: colors.secondary }}
                            thumbColor={isDemoMode ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.actionButton, { borderColor: colors.primary }]}
                        onPress={() => {
                            // Close settings and open scanner on main screen
                            // In a real app we might want a dedicated scanner screen
                            router.push('/');
                            // We need a way to trigger the scanner from here, or just direct them back
                        }}
                    >
                        <Text style={{ color: colors.primary, textAlign: 'center' }}>Manage Devices on Home Screen</Text>
                    </TouchableOpacity>
                </View>

                {/* Habit Stacking */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Habit Stacking</Text>
                    <ProFeatureLock label="Pro Feature">
                        <Text style={[styles.label, { color: colors.text, marginTop: 10 }]}>My Cue (After I...)</Text>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="e.g., brush my teeth"
                            placeholderTextColor={colors.textSecondary}
                            value={habitCue}
                            onChangeText={setHabitCue}
                        />
                    </ProFeatureLock>
                </View>

                {/* Theme Settings (Pro) */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>App Theme</Text>
                    <ProFeatureLock label="Pro Feature">
                        <View style={styles.colorRow}>
                            <Text style={[styles.label, { color: colors.text }]}>Primary Color:</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {['#1A4331', '#007AFF', '#FF3B30'].map(c => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[styles.colorDot, { backgroundColor: c, borderWidth: colors.primary === c ? 2 : 0 }]}
                                        onPress={() => setPrimaryColor(c)}
                                    />
                                ))}
                            </View>
                        </View>
                        <Button title="Reset Theme" onPress={resetTheme} variant="outline" style={{ marginTop: 10 }} />
                    </ProFeatureLock>
                </View>

                <Button
                    title="Return to Timer"
                    onPress={() => router.push('/')}
                    style={{ marginTop: 20, marginBottom: 40 }}
                />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 60,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    hint: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    durationControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    controlButton: {
        borderWidth: 1,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    colorDot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: '#000',
    },
    optionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    actionButton: {
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
    }
});
