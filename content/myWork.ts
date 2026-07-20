// "My Work" — user-visible name for the collection of writings a person
// accumulates across their BE Pauses. Every entry is tagged with one of
// four categories, editable when writing.

import type { HabitStackActivity } from './habitStack';

export type WorkCategory =
    | 'insight-diary'
    | 'insightful-notes'
    | 'inspiring-messages'
    | 'self-advice';

export const WORK_CATEGORIES: WorkCategory[] = [
    'insight-diary',
    'insightful-notes',
    'inspiring-messages',
    'self-advice',
];

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
    'insight-diary': 'Insight Diary',
    'insightful-notes': 'Insightful Notes',
    'inspiring-messages': 'Inspiring Messages',
    'self-advice': 'Self-Advice',
};

// A short description shown in filter chips / picker help text.
export const WORK_CATEGORY_HINTS: Record<WorkCategory, string> = {
    'insight-diary': 'What you noticed today',
    'insightful-notes': 'Quick thoughts, lines, and observations',
    'inspiring-messages': 'What lifted you or lifted someone else',
    'self-advice': 'Notes to your future self',
};

// Reasonable defaults so users don't have to pick every session — the
// picker is still shown, but pre-selected to the activity's natural fit.
export function defaultCategoryFor(activity: HabitStackActivity): WorkCategory {
    switch (activity) {
        case 'Journaling': return 'insight-diary';
        case 'Poetry': return 'insightful-notes';
        case 'Gratitude': return 'inspiring-messages';
        case 'Day Planning': return 'self-advice';
        default: return 'insightful-notes';
    }
}
