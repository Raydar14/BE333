import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings, HabitLinkConfig, HabitLinks } from '../contexts/SettingsContext';
import { ShimmerButton } from './ShimmerButton';
import { useRouter } from 'expo-router';
import { Leaf } from 'lucide-react-native';

// Sacred time presets
const SACRED_TIMES = [
    { label: '11:11 AM', hour: 11, minute: 11 },
    { label: '3:33 PM', hour: 15, minute: 33 },
    { label: '11:11 PM', hour: 23, minute: 11 },
];

type Period = keyof HabitLinks;

interface HabitLinkBuilderProps {
    period: Period;
    title: string;
    description: string;
    suggestions: string[];
    nextRoute: string;
    isFinal?: boolean;
}

export function HabitLinkBuilder({ period, title, description, suggestions, nextRoute, isFinal }: HabitLinkBuilderProps) {
    const { colors } = useTheme();
    const router = useRouter();
    const { habitLinks, updateHabitLink } = useSettings();

    // Local state initialized from Context
    const currentLink = habitLinks[period];
    const [anchor, setAnchor] = useState(currentLink.anchor);
    const [relation, setRelation] = useState<'before' | 'after'>(currentLink.relation);
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const applyPresetTime = (hour: number, minute: number) => {
        const d = new Date();
        d.setHours(hour, minute, 0, 0);
        setTime(d);
    };

    // Initialize time object from string HH:mm
    useEffect(() => {
        if (currentLink.time) {
            const [h, m] = currentLink.time.split(':');
            const d = new Date();
            d.setHours(parseInt(h), parseInt(m));
            setTime(d);
        }
    }, []);

    const handleNext = () => {
        const h = time.getHours().toString().padStart(2, '0');
        const m = time.getMinutes().toString().padStart(2, '0');

        updateHabitLink(period, {
            anchor,
            relation,
            time: `${h}:${m}`,
            enabled: true
        });

        router.push(nextRoute as any);
    };

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>{description}</Text>

                {/* Sentence Builder */}
                <View style={[styles.sentenceBox, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            onPress={() => setRelation('before')}
                            style={[styles.toggleBtn, relation === 'before' && { backgroundColor: colors.primary }]}
                        >
                            <Text style={[styles.toggleText, relation === 'before' && { color: colors.textLight }]}>Before I</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setRelation('after')}
                            style={[styles.toggleBtn, relation === 'after' && { backgroundColor: colors.primary }]}
                        >
                            <Text style={[styles.toggleText, relation === 'after' && { color: colors.textLight }]}>After I</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                        value={anchor}
                        onChangeText={setAnchor}
                        placeholder="e.g. Brush Teeth"
                        placeholderTextColor={colors.textSecondary}
                    />

                    <Text style={[styles.linkText, { color: colors.text }]}>... I will BE.</Text>
                </View>

                {/* Suggestions */}
                <Text style={[styles.label, { color: colors.text }]}>Common Habits:</Text>
                <View style={styles.chipContainer}>
                    {suggestions.map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[styles.chip, { borderColor: colors.secondary, backgroundColor: anchor === s ? colors.secondary : 'transparent' }]}
                            onPress={() => setAnchor(s)}
                        >
                            <Text style={{ color: anchor === s ? colors.primary : colors.text }}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Time Picker */}
                <Text style={[styles.label, { color: colors.text, marginTop: 20 }]}>Reminder Time:</Text>

                {/* Sacred Time Presets */}
                <View style={styles.sacredRow}>
                    {SACRED_TIMES.map((st) => (
                        <TouchableOpacity
                            key={st.label}
                            style={[styles.sacredChip, { borderColor: colors.secondary }]}
                            onPress={() => applyPresetTime(st.hour, st.minute)}
                        >
                            <Text style={{ color: colors.text, fontSize: 12 }}>{st.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {Platform.OS === 'ios' ? (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="spinner"
                        onChange={(e, d) => d && setTime(d)}
                        style={{ height: 120 }}
                        textColor={colors.text}
                    />
                ) : (
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.timeButton, { borderColor: colors.border }]}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                )}

                {showPicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={(e, d) => {
                            setShowPicker(false);
                            if (d) setTime(d);
                        }}
                    />
                )}

                <View style={{ flex: 1 }} />

                <ShimmerButton
                    title={isFinal ? "Review Links" : "Next Step"}
                    onPress={handleNext}
                    style={{ marginTop: 24, marginBottom: 16 }}
                    icon={Leaf}
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
        padding: 16,
        paddingTop: 40,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    desc: {
        fontSize: 14,
        marginBottom: 20,
    },
    sentenceBox: {
        padding: 16,
        borderRadius: 14,
        borderWidth: 2,
        marginBottom: 20,
    },
    sacredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 12,
    },
    sacredChip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
    },
    toggleRow: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#eee', // Hardcoded faint background for toggle track
        borderRadius: 8,
        padding: 2,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    input: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        paddingVertical: 4,
        textAlign: 'center',
        marginBottom: 8,
    },
    linkText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    timeButton: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
    }
});
