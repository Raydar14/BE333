import React, { useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react-native';
import {
    HabitStackActivity,
    contentKindFor,
    pickRandom,
    JOURNALING_PROMPTS,
    POETRY_PROMPTS,
    GRATITUDE_PROMPTS,
    DAY_PLAN_TEMPLATES,
    PRAYER_TEXTS,
    MANTRAS,
    CHANTING_TRACKS,
    STRETCHING_SEQUENCES,
    YOGA_SEQUENCES,
} from '../content/habitStack';
import {
    WORK_CATEGORIES,
    WORK_CATEGORY_LABELS,
    WorkCategory,
    defaultCategoryFor,
} from '../content/myWork';

interface HabitStackContentProps {
    activity: HabitStackActivity;
    elapsedSec: number;
    totalDurationSec: number;
    onEntryChange?: (text: string) => void;
    onCategoryChange?: (category: WorkCategory) => void;
    hidePrayers?: boolean;
}

// Shared: pill row that lets the user tag a writing entry to one of the
// four "My Work" categories. Rendered above prompt-write and day-planning.
function CategoryPicker({
    activity,
    onChange,
}: {
    activity: HabitStackActivity;
    onChange?: (cat: WorkCategory) => void;
}) {
    const [selected, setSelected] = useState<WorkCategory>(defaultCategoryFor(activity));
    return (
        <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>Save to</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
            >
                {WORK_CATEGORIES.map((c) => {
                    const isActive = selected === c;
                    return (
                        <TouchableOpacity
                            key={c}
                            onPress={() => {
                                setSelected(c);
                                onChange?.(c);
                            }}
                            style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                        >
                            <Text
                                style={[
                                    styles.categoryPillText,
                                    isActive && styles.categoryPillTextActive,
                                ]}
                            >
                                {WORK_CATEGORY_LABELS[c]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

// Journaling / Poetry / Gratitude — shared "prompt + write" renderer.
function PromptWrite({
    activity,
    prompts,
    onEntryChange,
    onCategoryChange,
    maxLen = 500,
}: {
    activity: HabitStackActivity;
    prompts: string[];
    onEntryChange?: (text: string) => void;
    onCategoryChange?: (cat: WorkCategory) => void;
    maxLen?: number;
}) {
    const [promptIdx, setPromptIdx] = useState(() => Math.floor(Math.random() * prompts.length));
    const [text, setText] = useState('');
    const prompt = prompts[promptIdx];

    const cycle = useCallback(() => {
        setPromptIdx((i) => (i + 1) % prompts.length);
    }, [prompts.length]);

    const handleTextChange = (v: string) => {
        setText(v);
        onEntryChange?.(v);
    };

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.promptText}>{prompt}</Text>
                <TouchableOpacity onPress={cycle} style={styles.iconBtn}>
                    <RefreshCw size={16} color="#DAA520" />
                </TouchableOpacity>
            </View>
            <CategoryPicker activity={activity} onChange={onCategoryChange} />
            <TextInput
                value={text}
                onChangeText={handleTextChange}
                multiline
                placeholder="Write freely. This autosaves to My Work."
                placeholderTextColor="rgba(255,255,255,0.35)"
                maxLength={maxLen + 200}
                style={styles.textInput}
                textAlignVertical="top"
            />
            <Text style={[styles.counter, text.length > maxLen && { color: '#E57373' }]}>
                {text.length} / {maxLen}
            </Text>
        </View>
    );
}

// Day Planning — pick a template, fill fields.
function DayPlanning({
    onEntryChange,
    onCategoryChange,
}: {
    onEntryChange?: (text: string) => void;
    onCategoryChange?: (cat: WorkCategory) => void;
}) {
    const [templateIdx, setTemplateIdx] = useState(0);
    const [fields, setFields] = useState<Record<string, string>>({});
    const template = DAY_PLAN_TEMPLATES[templateIdx];

    const cycleTemplate = () => {
        setTemplateIdx((i) => (i + 1) % DAY_PLAN_TEMPLATES.length);
        setFields({});
    };

    const updateField = (label: string, value: string) => {
        const next = { ...fields, [label]: value };
        setFields(next);
        const combined = template.fields
            .map((f) => `${f.label}: ${next[f.label] || ''}`)
            .join('\n');
        onEntryChange?.(combined);
    };

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.templateTitle}>{template.title}</Text>
                    <Text style={styles.templateSubtitle}>{template.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={cycleTemplate} style={styles.iconBtn}>
                    <RefreshCw size={16} color="#DAA520" />
                </TouchableOpacity>
            </View>

            <CategoryPicker activity="Day Planning" onChange={onCategoryChange} />

            {template.fields.map((f) => (
                <View key={f.label} style={{ marginTop: 12 }}>
                    <Text style={styles.fieldLabel}>{f.label}</Text>
                    <TextInput
                        style={styles.fieldInput}
                        placeholder={f.placeholder}
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        value={fields[f.label] || ''}
                        onChangeText={(v) => updateField(f.label, v)}
                    />
                </View>
            ))}
        </View>
    );
}

// Prayer / Mantra — cycle through a list with prev/next.
function ReadList({
    activity,
    hidePrayers,
}: {
    activity: 'Prayer' | 'Mantra';
    hidePrayers?: boolean;
}) {
    const isPrayer = activity === 'Prayer';
    const items = isPrayer ? PRAYER_TEXTS : MANTRAS;
    const [idx, setIdx] = useState(0);

    if (isPrayer && hidePrayers) {
        return (
            <View style={styles.card}>
                <Text style={styles.promptText}>
                    Prayer content is hidden in your settings. Turn on “Show Prayer Stack” in Settings to enable.
                </Text>
            </View>
        );
    }

    const next = () => setIdx((i) => (i + 1) % items.length);
    const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);

    if (isPrayer) {
        const p = PRAYER_TEXTS[idx];
        return (
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.templateSubtitle}>
                            {p.tradition.replace('-', ' / ')}
                        </Text>
                        <Text style={styles.templateTitle}>{p.title}</Text>
                    </View>
                    <View style={styles.navRow}>
                        <TouchableOpacity onPress={prev} style={styles.iconBtn}>
                            <ChevronLeft size={16} color="#DAA520" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={next} style={styles.iconBtn}>
                            <ChevronRight size={16} color="#DAA520" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.bodyText}>{p.text}</Text>
                <Text style={styles.counter}>
                    {idx + 1} / {items.length}
                </Text>
            </View>
        );
    }

    // Mantra
    const m = MANTRAS[idx];
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.templateSubtitle}>
                    Mantra {idx + 1} / {items.length}
                </Text>
                <View style={styles.navRow}>
                    <TouchableOpacity onPress={prev} style={styles.iconBtn}>
                        <ChevronLeft size={16} color="#DAA520" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={next} style={styles.iconBtn}>
                        <ChevronRight size={16} color="#DAA520" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.mantraText}>“{m.text}”</Text>
            <Text style={styles.meaningText}>{m.meaning}</Text>
        </View>
    );
}

// Chanting — pick a track, show intro / core / close.
function ChantingRenderer() {
    const [trackIdx, setTrackIdx] = useState(0);
    const t = CHANTING_TRACKS[trackIdx];

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.templateTitle}>{t.name}</Text>
                    <Text style={styles.templateSubtitle}>{t.meaning}</Text>
                </View>
                <View style={styles.navRow}>
                    <TouchableOpacity
                        onPress={() => setTrackIdx((i) => (i - 1 + CHANTING_TRACKS.length) % CHANTING_TRACKS.length)}
                        style={styles.iconBtn}
                    >
                        <ChevronLeft size={16} color="#DAA520" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setTrackIdx((i) => (i + 1) % CHANTING_TRACKS.length)}
                        style={styles.iconBtn}
                    >
                        <ChevronRight size={16} color="#DAA520" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionLabel}>Intro</Text>
            <Text style={styles.bodyText}>{t.intro}</Text>

            <Text style={styles.sectionLabel}>Core</Text>
            <Text style={styles.bodyText}>{t.core}</Text>

            <Text style={styles.sectionLabel}>Close</Text>
            <Text style={styles.bodyText}>{t.close}</Text>
        </View>
    );
}

// Sequence renderer for Yoga & Stretching — highlights current pose
// based on elapsed session time relative to the sequence total.
function SequenceRenderer({
    activity,
    elapsedSec,
    totalDurationSec,
}: {
    activity: 'Yoga' | 'Stretching';
    elapsedSec: number;
    totalDurationSec: number;
}) {
    const sequences = activity === 'Yoga' ? YOGA_SEQUENCES : STRETCHING_SEQUENCES;
    const [seqIdx, setSeqIdx] = useState(0);
    const seq = sequences[seqIdx];

    // Total step time within the sequence
    const stepTotal = useMemo(
        () => seq.steps.reduce((a, s) => a + s.durationSec, 0),
        [seq]
    );

    // Scale elapsedSec against the sequence total, so a 6-min session running
    // a 3-min sequence still highlights each pose proportionally.
    const scaled = totalDurationSec > 0
        ? (elapsedSec / totalDurationSec) * stepTotal
        : elapsedSec;

    let cumulative = 0;
    let currentIdx = 0;
    for (let i = 0; i < seq.steps.length; i++) {
        cumulative += seq.steps[i].durationSec;
        if (scaled < cumulative) {
            currentIdx = i;
            break;
        }
        if (i === seq.steps.length - 1) currentIdx = i;
    }

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.templateTitle}>{seq.name}</Text>
                    <Text style={styles.templateSubtitle}>{seq.purpose}</Text>
                </View>
                <View style={styles.navRow}>
                    <TouchableOpacity
                        onPress={() => setSeqIdx((i) => (i - 1 + sequences.length) % sequences.length)}
                        style={styles.iconBtn}
                    >
                        <ChevronLeft size={16} color="#DAA520" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSeqIdx((i) => (i + 1) % sequences.length)}
                        style={styles.iconBtn}
                    >
                        <ChevronRight size={16} color="#DAA520" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ maxHeight: 260 }}>
                {seq.steps.map((step, i) => {
                    const isCurrent = i === currentIdx;
                    return (
                        <View
                            key={i}
                            style={[
                                styles.stepRow,
                                isCurrent && styles.stepRowActive,
                            ]}
                        >
                            <Text style={[styles.stepIndex, isCurrent && styles.stepTextActive]}>
                                {String(i + 1).padStart(2, '0')}
                            </Text>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.stepName, isCurrent && styles.stepTextActive]}>
                                    {step.name}
                                </Text>
                                {isCurrent && (
                                    <Text style={styles.stepCue}>{step.cue}</Text>
                                )}
                            </View>
                            <Text style={[styles.stepDuration, isCurrent && styles.stepTextActive]}>
                                {step.durationSec}s
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export function HabitStackContent({
    activity,
    elapsedSec,
    totalDurationSec,
    onEntryChange,
    onCategoryChange,
    hidePrayers,
}: HabitStackContentProps) {
    const kind = contentKindFor(activity);

    switch (kind) {
        case 'prompt-write': {
            const prompts =
                activity === 'Journaling' ? JOURNALING_PROMPTS
                    : activity === 'Poetry' ? POETRY_PROMPTS
                        : GRATITUDE_PROMPTS;
            const maxLen = activity === 'Journaling' ? 500 : activity === 'Poetry' ? 500 : 300;
            return (
                <PromptWrite
                    activity={activity}
                    prompts={prompts}
                    onEntryChange={onEntryChange}
                    onCategoryChange={onCategoryChange}
                    maxLen={maxLen}
                />
            );
        }
        case 'templates':
            return <DayPlanning onEntryChange={onEntryChange} onCategoryChange={onCategoryChange} />;
        case 'read-list':
            return (
                <ReadList
                    activity={activity as 'Prayer' | 'Mantra'}
                    hidePrayers={hidePrayers}
                />
            );
        case 'sequence':
            return (
                <SequenceRenderer
                    activity={activity as 'Yoga' | 'Stretching'}
                    elapsedSec={elapsedSec}
                    totalDurationSec={totalDurationSec}
                />
            );
        case 'tracks':
            return <ChantingRenderer />;
        case 'none':
        default:
            return null;
    }
}

const styles = StyleSheet.create({
    card: {
        alignSelf: 'stretch',
        marginHorizontal: 10,
        marginVertical: 12,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(218,165,32,0.35)',
        backgroundColor: 'rgba(26,67,49,0.6)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    navRow: {
        flexDirection: 'row',
        gap: 6,
    },
    iconBtn: {
        padding: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(218,165,32,0.4)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    promptText: {
        color: '#FFF8DC',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        flex: 1,
    },
    textInput: {
        marginTop: 12,
        minHeight: 120,
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
    categoryRow: {
        marginTop: 12,
        marginBottom: 4,
    },
    categoryLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    categoryScroll: {
        gap: 6,
        paddingRight: 6,
    },
    categoryPill: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    categoryPillActive: {
        backgroundColor: 'rgba(255,215,0,0.25)',
        borderColor: '#FFD700',
    },
    categoryPillText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '600',
    },
    categoryPillTextActive: {
        color: '#FFF8DC',
    },
    templateTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '700',
    },
    templateSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 2,
        letterSpacing: 0.3,
    },
    fieldLabel: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.4,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    fieldInput: {
        color: '#FFFFFF',
        fontSize: 14,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
    },
    bodyText: {
        marginTop: 8,
        color: '#F0F4F0',
        fontSize: 14,
        lineHeight: 22,
    },
    sectionLabel: {
        color: '#DAA520',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: 12,
        textTransform: 'uppercase',
    },
    mantraText: {
        marginTop: 12,
        color: '#FFF8DC',
        fontSize: 20,
        fontWeight: '500',
        fontStyle: 'italic',
        lineHeight: 28,
        textAlign: 'center',
    },
    meaningText: {
        marginTop: 10,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginVertical: 2,
    },
    stepRowActive: {
        backgroundColor: 'rgba(255,215,0,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.4)',
    },
    stepIndex: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '700',
        width: 24,
    },
    stepName: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        fontWeight: '500',
    },
    stepTextActive: {
        color: '#FFD700',
    },
    stepCue: {
        marginTop: 3,
        color: 'rgba(255,255,255,0.85)',
        fontSize: 12,
        lineHeight: 18,
    },
    stepDuration: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
    },
});
