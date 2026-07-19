// BE333 self-compassion prompt library.
// 60 lines across six buckets — voice per Master Manual: short (3-12 words),
// gentle, encouraging, nonjudgmental, present tense, ~6th-grade reading level.
// Shown briefly after a completed BE Pause.

export type PromptBucket =
    | 'showingUp'
    | 'beginningAgain'
    | 'softeningPerfection'
    | 'difficultDays'
    | 'bodyKindness'
    | 'patience';

export const SELF_COMPASSION_PROMPTS: Record<PromptBucket, string[]> = {
    showingUp: [
        'I gave myself three minutes.',
        'I arrived for me.',
        'Being here is the practice.',
        'Three minutes is a real gift.',
        'I made room for this pause.',
        'Showing up is enough today.',
        'My presence is the win.',
        'I chose me, quietly.',
        'I made space to breathe.',
        'Just arriving is a kind act.',
    ],
    beginningAgain: [
        'This moment counts.',
        'I can restart, kindly.',
        'Now is a good time to begin.',
        'Every breath is a fresh start.',
        'Beginning again is not failing.',
        'I return without judgment.',
        'I begin again, softly.',
        'There is no wrong time to return.',
        'I let go and start once more.',
        'Coming back is the work.',
    ],
    softeningPerfection: [
        'Progress, not perfect.',
        'Small is still real.',
        'Enough is a kind word.',
        'I release the need to be perfect.',
        'Good enough is good.',
        'A little effort still counts.',
        'I loosen my grip on perfect.',
        'This session was mine.',
        'Slow is still steady.',
        'I trust the smallness.',
    ],
    difficultDays: [
        'Hard and worthy coexist.',
        'I did the kind thing.',
        'Even today, I showed up.',
        'I honor how hard this was.',
        'My tenderness is strength.',
        'On hard days, gentleness wins.',
        'I hold the day with soft hands.',
        'Rough days need soft breath.',
        'I am worthy on tired days.',
        'A hard-day pause counts double.',
    ],
    bodyKindness: [
        'My breath steadies me.',
        'My shoulders can soften.',
        'My body is a home.',
        'I thank my body for staying.',
        'Softness is welcome here.',
        'My jaw can rest.',
        'I let my chest fall gently.',
        'My hands can be still.',
        'My belly can be soft.',
        'My body deserves this pause.',
    ],
    patience: [
        'Habits grow gently.',
        'Petal by petal.',
        'Roots grow before blooms.',
        'Slow and steady rewires.',
        'Peace comes in patterns.',
        'I trust the rhythm.',
        'Tiny is still moving.',
        'The bloom will come.',
        'Nothing grows in a rush.',
        'Small pauses, big changes.',
    ],
};

const ALL_PROMPTS = Object.values(SELF_COMPASSION_PROMPTS).flat();

// Returns a random prompt drawn uniformly from all 60 lines.
export function getRandomPrompt(): string {
    if (ALL_PROMPTS.length === 0) return '';
    const idx = Math.floor(Math.random() * ALL_PROMPTS.length);
    return ALL_PROMPTS[idx];
}

// Bucket-specific draw — useful for future contextual prompts
// (e.g., serve "beginningAgain" after a missed day).
export function getRandomPromptFromBucket(bucket: PromptBucket): string {
    const list = SELF_COMPASSION_PROMPTS[bucket];
    if (!list || list.length === 0) return getRandomPrompt();
    return list[Math.floor(Math.random() * list.length)];
}
