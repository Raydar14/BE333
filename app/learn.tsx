import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, BookOpen, Zap, Anchor, ChevronRight, Clock, X,
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import {
    HOW_TO_CARDS, HowToCard,
    SOS_SCRIPTS, SosScript,
    TRAUMA_SENSITIVE,
} from '../content/learn';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

// /learn — Wave 4 content surface.
// Three tabs: How-to (9 short reads), SOS (four 60-second scripts),
// Grounding (trauma-sensitive variant). Tap any row to expand into
// a full-screen read; tap the X to close and pick another.
type Tab = 'howto' | 'sos' | 'ground';

export default function LearnScreen() {
    useProtectedRoute();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('howto');
    const [openHowTo, setOpenHowTo] = useState<HowToCard | null>(null);
    const [openSos, setOpenSos] = useState<SosScript | null>(null);
    const [openGround, setOpenGround] = useState(false);

    // Full-screen readers close over the list, so back tab click closes them first.
    const closeAll = () => {
        setOpenHowTo(null);
        setOpenSos(null);
        setOpenGround(false);
    };

    if (openHowTo) return <HowToReader card={openHowTo} onClose={closeAll} />;
    if (openSos) return <SosReader script={openSos} onClose={closeAll} />;
    if (openGround) return <GroundReader onClose={closeAll} />;

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
                    <ArrowLeft size={18} color={Colors.text} />
                    <Text style={styles.backText}>Home</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Learn</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.tabRow}>
                <Tab active={tab === 'howto'} onPress={() => setTab('howto')} icon={<BookOpen size={14} color={tab === 'howto' ? '#FFF8DC' : Colors.textSecondary} />} label="How-to" />
                <Tab active={tab === 'sos'} onPress={() => setTab('sos')} icon={<Zap size={14} color={tab === 'sos' ? '#FFF8DC' : Colors.textSecondary} />} label="60-second SOS" />
                <Tab active={tab === 'ground'} onPress={() => setTab('ground')} icon={<Anchor size={14} color={tab === 'ground' ? '#FFF8DC' : Colors.textSecondary} />} label="Grounding" />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {tab === 'howto' && HOW_TO_CARDS.map((c) => (
                    <TouchableOpacity key={c.id} style={styles.row} onPress={() => setOpenHowTo(c)} activeOpacity={0.75}>
                        <View style={[styles.iconWrap, { borderColor: 'rgba(225,183,37,0.35)', backgroundColor: 'rgba(225,183,37,0.12)' }]}>
                            <BookOpen size={16} color={Colors.secondary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>{c.title}</Text>
                            <Text style={styles.rowSubtitle}>{c.subtitle}</Text>
                            <View style={styles.metaRow}>
                                <Clock size={11} color={Colors.textSecondary} />
                                <Text style={styles.metaText}>~{c.readSec}s read</Text>
                            </View>
                        </View>
                        <ChevronRight size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                ))}

                {tab === 'sos' && SOS_SCRIPTS.map((s) => (
                    <TouchableOpacity key={s.id} style={styles.row} onPress={() => setOpenSos(s)} activeOpacity={0.75}>
                        <View style={[styles.iconWrap, { borderColor: 'rgba(255,107,107,0.35)', backgroundColor: 'rgba(255,107,107,0.12)' }]}>
                            <Zap size={16} color="#FF6B6B" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>{s.title}</Text>
                            <Text style={styles.rowSubtitle}>{s.subtitle}</Text>
                            <Text style={styles.whenText}>{s.when}</Text>
                            <View style={styles.metaRow}>
                                <Clock size={11} color={Colors.textSecondary} />
                                <Text style={styles.metaText}>{s.durationSec}s</Text>
                            </View>
                        </View>
                        <ChevronRight size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                ))}

                {tab === 'ground' && (
                    <>
                        <TouchableOpacity style={styles.row} onPress={() => setOpenGround(true)} activeOpacity={0.75}>
                            <View style={[styles.iconWrap, { borderColor: 'rgba(183,228,199,0.4)', backgroundColor: 'rgba(183,228,199,0.12)' }]}>
                                <Anchor size={16} color="#B7E4C7" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle}>{TRAUMA_SENSITIVE.title}</Text>
                                <Text style={styles.rowSubtitle}>{TRAUMA_SENSITIVE.subtitle}</Text>
                            </View>
                            <ChevronRight size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                        <Text style={styles.reminder}>{TRAUMA_SENSITIVE.reminder}</Text>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

function Tab({ active, onPress, icon, label }: {
    active: boolean; onPress: () => void; icon: React.ReactNode; label: string;
}) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]} activeOpacity={0.7}>
            {icon}
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

function ReaderHeader({ onClose, title }: { onClose: () => void; title: string }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                <X size={18} color={Colors.text} />
                <Text style={styles.backText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            <View style={{ width: 60 }} />
        </View>
    );
}

function HowToReader({ card, onClose }: { card: HowToCard; onClose: () => void }) {
    return (
        <View style={styles.wrapper}>
            <ReaderHeader onClose={onClose} title={card.title} />
            <ScrollView contentContainerStyle={styles.readerBody}>
                <Text style={styles.readerSubtitle}>{card.subtitle}</Text>
                <View style={styles.metaRowTop}>
                    <Clock size={12} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>~{card.readSec}s read</Text>
                </View>
                {card.blocks.map((b, i) => {
                    if (b.kind === 'p') return <Text key={i} style={styles.paragraph}>{b.text}</Text>;
                    if (b.kind === 'list') return (
                        <View key={i} style={styles.list}>
                            {b.items.map((item, j) => (
                                <View key={j} style={styles.listRow}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.listText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    );
                    return <View key={i} style={styles.callout}><Text style={styles.calloutText}>{b.text}</Text></View>;
                })}
            </ScrollView>
        </View>
    );
}

function SosReader({ script, onClose }: { script: SosScript; onClose: () => void }) {
    return (
        <View style={styles.wrapper}>
            <ReaderHeader onClose={onClose} title={script.title} />
            <ScrollView contentContainerStyle={styles.readerBody}>
                <Text style={styles.readerSubtitle}>{script.subtitle}</Text>
                <View style={styles.metaRowTop}>
                    <Clock size={12} color="#FF6B6B" />
                    <Text style={[styles.metaText, { color: '#FF9C9C' }]}>{script.durationSec}s</Text>
                </View>
                <View style={styles.whenBlock}>
                    <Text style={styles.whenLabel}>When to use</Text>
                    <Text style={styles.whenBody}>{script.when}</Text>
                </View>
                {script.steps.map((step, i) => (
                    <View key={i} style={styles.stepBlock}>
                        <View style={styles.stepIndex}><Text style={styles.stepIndexText}>{i + 1}</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stepCue}>{step.cue}</Text>
                            <Text style={styles.stepDetail}>{step.detail}</Text>
                            {step.holdSec > 0 && (
                                <Text style={styles.stepHold}>~{step.holdSec}s</Text>
                            )}
                        </View>
                    </View>
                ))}
                <View style={styles.closeBlock}>
                    <Text style={styles.closeText}>{script.close}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

function GroundReader({ onClose }: { onClose: () => void }) {
    const t = TRAUMA_SENSITIVE;
    return (
        <View style={styles.wrapper}>
            <ReaderHeader onClose={onClose} title={t.title} />
            <ScrollView contentContainerStyle={styles.readerBody}>
                <Text style={styles.readerSubtitle}>{t.subtitle}</Text>
                <Text style={styles.paragraph}>{t.intro}</Text>
                <SectionBlock heading={t.ground.heading} steps={t.ground.steps} tint="#B7E4C7" />
                <SectionBlock heading={t.orient.heading} steps={t.orient.steps} tint="#B7E4C7" />
                <SectionBlock heading={t.breathe.heading} steps={t.breathe.steps} tint="#B7E4C7" note={t.breathe.note} />
                <View style={styles.closeBlock}>
                    <Text style={styles.closeText}>{t.close}</Text>
                </View>
                <View style={styles.reminderBlock}>
                    <Text style={styles.reminderLabel}>A note</Text>
                    <Text style={styles.reminderBody}>{t.reminder}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

function SectionBlock({ heading, steps, tint, note }: {
    heading: string;
    steps: { cue: string; detail: string }[];
    tint: string;
    note?: string;
}) {
    return (
        <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionHeading, { color: tint }]}>{heading}</Text>
            {note && <Text style={styles.sectionNote}>{note}</Text>}
            {steps.map((s, i) => (
                <View key={i} style={styles.groundStep}>
                    <Text style={styles.groundCue}>{s.cue}</Text>
                    <Text style={styles.groundDetail}>{s.detail}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background, padding: 14 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
    },
    backBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingVertical: 6, paddingHorizontal: 10,
        borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)',
    },
    backText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
    headerTitle: { color: Colors.text, fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },

    tabRow: {
        flexDirection: 'row', gap: 6, paddingVertical: 6, marginBottom: 6,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.3)',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    tabActive: {
        backgroundColor: 'rgba(225,183,37,0.2)',
        borderColor: Colors.secondary,
    },
    tabText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '600',
    },
    tabTextActive: { color: '#FFF8DC' },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginBottom: 8,
    },
    iconWrap: {
        width: 34, height: 34, borderRadius: 17,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1,
    },
    rowTitle: { color: Colors.text, fontSize: 14, fontWeight: '700' },
    rowSubtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
    whenText: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 4, fontStyle: 'italic' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    metaText: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600' },
    metaRowTop: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },

    reminder: {
        marginTop: 14, padding: 12, borderRadius: 10,
        borderLeftWidth: 3, borderLeftColor: '#B7E4C7',
        backgroundColor: 'rgba(74,153,119,0.08)',
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12, lineHeight: 18, fontStyle: 'italic',
    },

    readerBody: { paddingBottom: 60 },
    readerSubtitle: {
        color: Colors.secondary,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    paragraph: {
        color: Colors.text,
        fontSize: 15,
        lineHeight: 24,
        marginTop: 14,
    },
    list: { marginTop: 14 },
    listRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    bullet: {
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: Colors.secondary,
        marginTop: 9,
    },
    listText: {
        flex: 1,
        color: Colors.text,
        fontSize: 14,
        lineHeight: 22,
    },
    callout: {
        marginTop: 18,
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: Colors.secondary,
        backgroundColor: 'rgba(225,183,37,0.08)',
    },
    calloutText: {
        color: '#FFF8DC',
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },

    whenBlock: {
        marginTop: 8,
        marginBottom: 14,
        padding: 12,
        borderRadius: 10,
        backgroundColor: 'rgba(255,107,107,0.08)',
        borderLeftWidth: 3, borderLeftColor: '#FF6B6B',
    },
    whenLabel: {
        color: '#FF9C9C',
        fontSize: 10, fontWeight: '700',
        letterSpacing: 0.8, textTransform: 'uppercase',
        marginBottom: 4,
    },
    whenBody: { color: Colors.text, fontSize: 13, lineHeight: 20 },

    stepBlock: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },
    stepIndex: {
        width: 26, height: 26, borderRadius: 13,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(225,183,37,0.15)',
        borderWidth: 1, borderColor: 'rgba(225,183,37,0.4)',
    },
    stepIndexText: {
        color: Colors.secondary,
        fontSize: 12, fontWeight: '700',
    },
    stepCue: {
        color: Colors.text,
        fontSize: 15, fontWeight: '700',
    },
    stepDetail: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13, lineHeight: 20, marginTop: 2,
    },
    stepHold: {
        color: Colors.secondary,
        fontSize: 11, fontWeight: '600', marginTop: 4,
    },
    closeBlock: {
        marginTop: 24,
        padding: 14,
        borderRadius: 10,
        backgroundColor: 'rgba(26,67,49,0.5)',
        borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)',
    },
    closeText: {
        color: '#FFF8DC',
        fontSize: 14, lineHeight: 22,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    reminderBlock: {
        marginTop: 20, padding: 12, borderRadius: 10,
        borderLeftWidth: 3, borderLeftColor: '#B7E4C7',
        backgroundColor: 'rgba(74,153,119,0.08)',
    },
    reminderLabel: {
        color: '#B7E4C7',
        fontSize: 10, fontWeight: '700',
        letterSpacing: 0.8, textTransform: 'uppercase',
        marginBottom: 4,
    },
    reminderBody: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12, lineHeight: 18,
    },
    sectionHeading: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    sectionNote: {
        color: Colors.textSecondary,
        fontSize: 11,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    groundStep: {
        marginTop: 10,
        paddingVertical: 6,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(183,228,199,0.4)',
    },
    groundCue: { color: Colors.text, fontSize: 14, fontWeight: '600' },
    groundDetail: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 20, marginTop: 2 },
});
