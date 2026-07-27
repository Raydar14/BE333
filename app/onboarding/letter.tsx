import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Leaf } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ShimmerButton } from '../../components/ShimmerButton';
import {
    useLetterToYourself,
    DEFAULT_LETTER,
    ONBOARDING_PROMPT,
} from '../../hooks/useLetterToYourself';

// Onboarding step: Letter to Yourself.
// Skippable. If the user skips, the default (BE333-voice) letter is used
// automatically on Missed Day returns. Manual Part 5 has the spec + copy.
export default function OnboardingLetter() {
    const { colors } = useTheme();
    const router = useRouter();
    const { letter, save } = useLetterToYourself();
    const [text, setText] = useState(letter);
    const [saving, setSaving] = useState(false);

    const handleContinue = async (opts: { skip: boolean }) => {
        setSaving(true);
        if (!opts.skip && text.trim()) {
            await save(text.trim());
        }
        setSaving(false);
        router.push('/onboarding/review');
    };

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.iconBadge}>
                    <Mail size={22} color="#FFD700" />
                </View>
                <Text style={[styles.title, { color: colors.primary }]}>
                    A letter for the day you lapse
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Missed days will happen. This is the note your future self
                    will read on those days.
                </Text>

                <View style={styles.promptCard}>
                    <Text style={styles.promptText}>{ONBOARDING_PROMPT}</Text>
                </View>

                <TextInput
                    value={text}
                    onChangeText={setText}
                    multiline
                    placeholder="Two or three sentences is plenty…"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    style={styles.input}
                    maxLength={600}
                    textAlignVertical="top"
                />
                <Text style={styles.counter}>{text.length} / 600</Text>

                <View style={styles.defaultBlock}>
                    <Text style={styles.defaultLabel}>If you skip, this is what appears:</Text>
                    <Text style={styles.defaultText}>{DEFAULT_LETTER}</Text>
                </View>

                <View style={{ flex: 1 }} />

                <ShimmerButton
                    title={saving ? 'Saving…' : 'Save & Continue'}
                    onPress={() => handleContinue({ skip: false })}
                    disabled={saving || text.trim().length === 0}
                    icon={Leaf}
                    style={{ marginTop: 20 }}
                />
                <TouchableOpacity
                    onPress={() => handleContinue({ skip: true })}
                    disabled={saving}
                    style={styles.skipBtn}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    container: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 50,
        maxWidth: 460,
        alignSelf: 'center',
        width: '100%',
    },
    iconBadge: {
        alignSelf: 'center',
        width: 48, height: 48, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)',
        backgroundColor: 'rgba(255,215,0,0.1)',
        marginBottom: 14,
    },
    title: {
        fontSize: 24, fontWeight: 'bold',
        textAlign: 'center', marginBottom: 6,
    },
    subtitle: {
        fontSize: 14, textAlign: 'center', lineHeight: 20,
        marginBottom: 20, paddingHorizontal: 4,
    },
    promptCard: {
        padding: 14, borderRadius: 12,
        borderLeftWidth: 3, borderLeftColor: '#FFD700',
        backgroundColor: 'rgba(255,215,0,0.08)',
        marginBottom: 14,
    },
    promptText: {
        color: '#FFF8DC', fontSize: 14, lineHeight: 20, fontStyle: 'italic',
    },
    input: {
        minHeight: 140,
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 22,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(0,0,0,0.25)',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
    },
    counter: {
        marginTop: 6,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        textAlign: 'right',
    },
    defaultBlock: {
        marginTop: 20,
        padding: 12,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    defaultLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    defaultText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    skipBtn: {
        marginTop: 12,
        marginBottom: 20,
        alignSelf: 'center',
        padding: 10,
    },
    skipText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 13,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});
