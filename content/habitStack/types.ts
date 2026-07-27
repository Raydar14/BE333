// Shared types for habit-stack activity content modules.
// Voice per Master Manual: 6th-grade reading level, warm, encouraging,
// nonjudgmental. Short sentences, present tense.

export type PrayerTradition =
    | 'secular'
    | 'interfaith'
    | 'christian'
    | 'jewish'
    | 'muslim'
    | 'hindu-buddhist';

export interface PrayerText {
    id: string;
    tradition: PrayerTradition;
    title: string;
    text: string;
}

export interface ChantingTrack {
    id: string;
    name: string;
    meaning: string;
    intro: string;   // 20-sec posture/breath intro
    core: string;    // ~2-min chant pacing guide
    close: string;   // 40-sec quiet sit and close
}

export interface Mantra {
    text: string;
    meaning: string;
    hasAudio?: boolean; // Manual specifies audio for 6 of the 20
}

export interface DayPlanField {
    label: string;
    placeholder: string;
}

export interface DayPlanTemplate {
    id: string;
    title: string;
    subtitle: string;
    fields: DayPlanField[];
}

export interface SequenceStep {
    name: string;
    durationSec: number;
    cue: string;
}

// Body position a sequence uses. Lets people practice at a desk, in an
// airport, or on a mat — floor is not required for real movement.
export type SequencePosture = 'standing' | 'sitting' | 'mixed';

export interface Sequence {
    id: string;
    name: string;
    purpose: string;
    totalMinutes: number;
    posture: SequencePosture;
    steps: SequenceStep[];
}

// The habit-stack activity keys that ship with rich content.
export type HabitStackActivity =
    | 'Chanting'
    | 'Prayer'
    | 'Journaling'
    | 'Poetry'
    | 'Day Planning'
    | 'Gratitude'
    | 'Mantra'
    | 'Stretching'
    | 'Yoga'
    | 'Singing';
