import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';

// EMA (Ecological Momentary Assessment) — one-tap post-session capture,
// per Master Manual Part 5. Stress / Mood / Focus + one-word.
// Fires once per completed BE Pause; writes to users/{uid}/emaEntries.

type StressLevel = 'lower' | 'same' | 'higher';
type MoodLevel = 'better' | 'same' | 'worse';
type FocusLevel = 'clearer' | 'same' | 'foggier';

interface EMACheckInProps {
    // Session context, saved with the entry for later analysis
    sessionDurationSec: number;
    // Called after successful save so the parent can hide/collapse
    onSaved?: () => void;
}

export function EMACheckIn({ sessionDurationSec, onSaved }: EMACheckInProps) {
    const { user } = useAuth();
    const [stress, setStress] = useState<StressLevel | null>(null);
    const [mood, setMood] = useState<MoodLevel | null>(null);
    const [focus, setFocus] = useState<FocusLevel | null>(null);
    const [word, setWord] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const canSave = useMemo(
        () => !!(stress && mood && focus) && !saving && !saved,
        [stress, mood, focus, saving, saved]
    );

    const save = useCallback(async () => {
        if (!canSave || !user) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'users', user.uid, 'emaEntries'), {
                stress,
                mood,
                focus,
                oneWord: word.trim() || null,
                sessionDurationSec,
                createdAt: serverTimestamp(),
            });
            setSaved(true);
            onSaved?.();
        } catch (e) {
            console.warn('Failed to save EMA:', e);
        } finally {
            setSaving(false);
        }
    }, [canSave, user, stress, mood, focus, word, sessionDurationSec, onSaved]);

    if (saved) {
        return (
            <View style={styles.card}>
                <Text style={styles.savedText}>Noted. Thank you for checking in.</Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Check in with yourself</Text>

            <PickerRow
                label="Stress"
                options={[
                    { key: 'lower', label: 'Lower ↓' },
                    { key: 'same', label: 'Same →' },
                    { key: 'higher', label: 'Higher ↑' },
                ]}
                selected={stress}
                onSelect={(v) => setStress(v as StressLevel)}
            />

            <PickerRow
                label="Mood"
                options={[
                    { key: 'better', label: 'Better' },
                    { key: 'same', label: 'Same' },
                    { key: 'worse', label: 'Worse' },
                ]}
                selected={mood}
                onSelect={(v) => setMood(v as MoodLevel)}
            />

            <PickerRow
                label="Focus"
                options={[
                    { key: 'clearer', label: 'Clearer' },
                    { key: 'same', label: 'Same' },
                    { key: 'foggier', label: 'Foggier' },
                ]}
                selected={focus}
                onSelect={(v) => setFocus(v as FocusLevel)}
            />

            <View style={styles.wordRow}>
                <Text style={styles.wordLabel}>One word for this session:</Text>
                <TextInput
                    value={word}
                    onChangeText={setWord}
                    placeholder="calmer, steady, present…"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    style={styles.wordInput}
                    maxLength={40}
                />
            </View>

            <TouchableOpacity
                style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                disabled={!canSave}
                onPress={save}
                activeOpacity={0.8}
            >
                <Text style={[styles.saveText, !canSave && { color: 'rgba(255,255,255,0.4)' }]}>
                    {saving ? 'Saving…' : 'Save Check-in'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function PickerRow({
    label,
    options,
    selected,
    onSelect,
}: {
    label: string;
    options: Array<{ key: string; label: string }>;
    selected: string | null;
    onSelect: (v: string) => void;
}) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={styles.buttonGroup}>
                {options.map((o) => {
                    const isActive = selected === o.key;
                    return (
                        <TouchableOpacity
                            key={o.key}
                            onPress={() => onSelect(o.key)}
                            style={[styles.choice, isActive && styles.choiceActive]}
                        >
                            <Text style={[styles.choiceText, isActive && styles.choiceTextActive]}>
                                {o.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        alignSelf: 'stretch',
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 8,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.35)',
        backgroundColor: 'rgba(26,67,49,0.55)',
    },
    title: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.8,
        marginBottom: 12,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    row: {
        marginBottom: 12,
    },
    rowLabel: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 6,
    },
    choice: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
    },
    choiceActive: {
        backgroundColor: 'rgba(255,215,0,0.2)',
        borderColor: '#FFD700',
    },
    choiceText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
    },
    choiceTextActive: {
        color: '#FFF8DC',
    },
    wordRow: {
        marginTop: 4,
        marginBottom: 12,
    },
    wordLabel: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    wordInput: {
        color: '#FFF8DC',
        fontSize: 15,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(0,0,0,0.25)',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
    },
    saveBtn: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255,215,0,0.25)',
    },
    saveBtnDisabled: {
        borderColor: 'rgba(255,215,0,0.25)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    saveText: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    savedText: {
        textAlign: 'center',
        color: '#FFF8DC',
        fontSize: 14,
        fontStyle: 'italic',
        paddingVertical: 12,
    },
});
