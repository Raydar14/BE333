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
    const {
        timerDuration, setTimerDuration,
        habitCue, setHabitCue,
        socialLinks, updateSocialLink,
        showHabitStacking, setShowHabitStacking,
        timerMode, setTimerMode,
        // Added missing destructuring
        showBreathingGuide, setShowBreathingGuide,
        showNatureVisuals, setShowNatureVisuals,
        breathingPattern, setBreathingPattern,
        deep3Enabled, setDeep3Enabled,
        deep3Duration, setDeep3Duration,
        bellsEnabled, setBellsEnabled,
    } = useSettings();
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

                {/* Account & Profile Link - New user flow */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => router.push('/dashboard')}
                    >
                        <Text style={[styles.menuItemText, { color: colors.text }]}>View Profile & Stats</Text>
                        <ArrowLeft size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
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
                            value={showBreathingGuide}
                            onValueChange={setShowBreathingGuide}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={showBreathingGuide ? "#fff" : "#f4f3f4"}
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
                            value={showNatureVisuals}
                            onValueChange={setShowNatureVisuals}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={showNatureVisuals ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Session Bells</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                Soft chimes at start, midpoint & end
                            </Text>
                        </View>
                        <Switch
                            value={bellsEnabled}
                            onValueChange={setBellsEnabled}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={bellsEnabled ? "#fff" : "#f4f3f4"}
                        />
                    </View>
                </View>

                {/* Breathing Logic Settings (NEW) */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Breathing Logic</Text>

                    {/* Pattern Selection */}
                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Find & Set your Breathing Frequency</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                {breathingPattern === '4-1-6' ? '4s In - 1s Pause - 6s Out' : '3s In - 1s Pause - 5s Out'}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <TouchableOpacity
                                onPress={() => setBreathingPattern('4-1-6')}
                                style={[styles.optionButton, breathingPattern === '4-1-6' && { backgroundColor: colors.primary }]}
                            >
                                <Text style={[styles.optionText, { color: breathingPattern === '4-1-6' ? '#fff' : colors.text }]}>4-1-6</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setBreathingPattern('3-1-5')}
                                style={[styles.optionButton, breathingPattern === '3-1-5' && { backgroundColor: colors.primary }]}
                            >
                                <Text style={[styles.optionText, { color: breathingPattern === '3-1-5' ? '#fff' : colors.text }]}>3-1-5</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* DEEP3 Toggle */}
                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Start with DEEP3</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                3 Deep full body sighs before timing starts
                            </Text>
                        </View>
                        <Switch
                            value={deep3Enabled}
                            onValueChange={setDeep3Enabled}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={deep3Enabled ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    {/* DEEP3 Duration */}
                    {deep3Enabled && (
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1, paddingRight: 10 }}>
                                <Text style={[styles.label, { color: colors.text }]}>DEEP3 Duration</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <TouchableOpacity
                                    onPress={() => setDeep3Duration(15)}
                                    style={[styles.optionButton, deep3Duration === 15 && { backgroundColor: colors.primary }]}
                                >
                                    <Text style={[styles.optionText, { color: deep3Duration === 15 ? '#fff' : colors.text }]}>15s</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setDeep3Duration(20)}
                                    style={[styles.optionButton, deep3Duration === 20 && { backgroundColor: colors.primary }]}
                                >
                                    <Text style={[styles.optionText, { color: deep3Duration === 20 ? '#fff' : colors.text }]}>20s</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
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
                        onPress={() => router.push('/')}
                    >
                        <Text style={{ color: colors.primary, textAlign: 'center' }}>Manage Devices on Home Screen</Text>
                    </TouchableOpacity>
                </View>

                {/* Social Media Linking - NEW */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Social Links</Text>
                    <Text style={[styles.hint, { color: colors.textSecondary, marginBottom: 15 }]}>
                        Link your profiles to easily share progress.
                    </Text>

                    <View style={styles.socialInputRow}>
                        <Text style={[styles.label, { color: colors.text, width: 80 }]}>TikTok</Text>
                        <TextInput
                            style={[styles.input, { flex: 1, marginTop: 0 }]}
                            placeholder="@username"
                            placeholderTextColor={colors.textSecondary}
                            value={socialLinks.tiktok || ''}
                            onChangeText={(val) => updateSocialLink('tiktok', val)}
                        />
                    </View>

                    <View style={styles.socialInputRow}>
                        <Text style={[styles.label, { color: colors.text, width: 80 }]}>Facebook</Text>
                        <TextInput
                            style={[styles.input, { flex: 1, marginTop: 0 }]}
                            placeholder="Profile URL"
                            placeholderTextColor={colors.textSecondary}
                            value={socialLinks.facebook || ''}
                            onChangeText={(val) => updateSocialLink('facebook', val)}
                        />
                    </View>

                    <View style={styles.socialInputRow}>
                        <Text style={[styles.label, { color: colors.text, width: 80 }]}>Instagram</Text>
                        <TextInput
                            style={[styles.input, { flex: 1, marginTop: 0 }]}
                            placeholder="@username"
                            placeholderTextColor={colors.textSecondary}
                            value={socialLinks.instagram || ''}
                            onChangeText={(val) => updateSocialLink('instagram', val)}
                        />
                    </View>
                </View>

                {/* Habit Stacking - Unlocked for everyone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Habit Stacking</Text>

                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.label, { color: colors.text }]}>Show Stacking Options</Text>
                            <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                Prompt to link habits after sessions
                            </Text>
                        </View>
                        <Switch
                            value={showHabitStacking}
                            onValueChange={setShowHabitStacking}
                            trackColor={{ false: "#767577", true: colors.primary }}
                            thumbColor={showHabitStacking ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    {showHabitStacking && (
                        <View>
                            <Text style={[styles.label, { color: colors.text, marginTop: 10 }]}>My Cue (After I...)</Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                                placeholder="e.g., brush my teeth"
                                placeholderTextColor={colors.textSecondary}
                                value={habitCue}
                                onChangeText={setHabitCue}
                            />
                        </View>
                    )}
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

            </ScrollView >
        </View >
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
    },
    socialInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    }
});
