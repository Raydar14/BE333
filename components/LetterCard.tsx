import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, X } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useLetterToYourself, DEFAULT_LETTER } from '../hooks/useLetterToYourself';

/**
 * LetterCard — surfaces the user's Letter to Yourself at the top of the
 * first BE Pause after a Missed Day. Falls back to a warm default in the
 * BE333 voice if the user skipped the onboarding writing step.
 *
 * Purely presentational aside from a local dismiss. Missed-day detection
 * lives at the call site via justReturnedFromMissedDay(stats).
 */
export function LetterCard({ onEdit }: { onEdit?: () => void }) {
    const { letter, hasLetter } = useLetterToYourself();
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;

    const body = hasLetter ? letter : DEFAULT_LETTER;
    const eyebrow = hasLetter ? 'You wrote this for today.' : 'A note in the BE333 voice — write your own in Settings.';

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.iconWrap}>
                    <Mail size={14} color="#FFD700" />
                </View>
                <Text style={styles.eyebrow}>{eyebrow}</Text>
                <TouchableOpacity onPress={() => setDismissed(true)} style={styles.dismissBtn} accessibilityLabel="Dismiss">
                    <X size={14} color="rgba(255,255,255,0.55)" />
                </TouchableOpacity>
            </View>
            <Text style={styles.body}>{body}</Text>
            {onEdit && (
                <TouchableOpacity onPress={onEdit} style={styles.editRow}>
                    <Text style={styles.editText}>
                        {hasLetter ? 'Edit your letter' : 'Write your own'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 4,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.35)',
        backgroundColor: 'rgba(26,67,49,0.6)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    iconWrap: {
        width: 24, height: 24, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)',
        backgroundColor: 'rgba(255,215,0,0.1)',
    },
    eyebrow: {
        flex: 1,
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    dismissBtn: {
        padding: 4,
    },
    body: {
        color: Colors.text,
        fontSize: 15,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    editRow: {
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    editText: {
        color: '#B7E4C7',
        fontSize: 12,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
