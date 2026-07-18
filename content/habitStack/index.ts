// Barrel + shape helpers for habit-stack content.

import { JOURNALING_PROMPTS } from './journaling';
import { POETRY_PROMPTS } from './poetry';
import { GRATITUDE_PROMPTS } from './gratitude';
import { DAY_PLAN_TEMPLATES } from './dayPlanning';
import { PRAYER_TEXTS } from './prayer';
import { MANTRAS } from './mantras';
import { CHANTING_TRACKS } from './chanting';
import { STRETCHING_SEQUENCES } from './stretching';
import { YOGA_SEQUENCES } from './yoga';
import { HabitStackActivity } from './types';

export * from './types';
export {
    JOURNALING_PROMPTS,
    POETRY_PROMPTS,
    GRATITUDE_PROMPTS,
    DAY_PLAN_TEMPLATES,
    PRAYER_TEXTS,
    MANTRAS,
    CHANTING_TRACKS,
    STRETCHING_SEQUENCES,
    YOGA_SEQUENCES,
};

export function pickRandom<T>(arr: T[]): T | null {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

// Which content shape backs each activity — used by the timer screen to
// decide which renderer to show.
export type ContentKind =
    | 'prompt-write'   // Journaling, Poetry, Gratitude
    | 'templates'      // Day Planning
    | 'read-list'      // Prayer, Mantra
    | 'sequence'       // Stretching, Yoga
    | 'tracks'         // Chanting
    | 'none';          // Singing (freeform)

export function contentKindFor(activity: HabitStackActivity): ContentKind {
    switch (activity) {
        case 'Journaling':
        case 'Poetry':
        case 'Gratitude':
            return 'prompt-write';
        case 'Day Planning':
            return 'templates';
        case 'Prayer':
        case 'Mantra':
            return 'read-list';
        case 'Stretching':
        case 'Yoga':
            return 'sequence';
        case 'Chanting':
            return 'tracks';
        case 'Singing':
        default:
            return 'none';
    }
}
