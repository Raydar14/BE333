// Voice-consistent notification copy per Master Manual Part 4 (Voice)
// and Part 3 (Rise · Rest · Relax rhythms). Titles are short — line 1 of
// a lock-screen notification. Bodies close each cue on a breath, in the
// BE333 voice: warm, second-person, no jargon, no urgency, no exclamation.
//
// {anchor} is the user's chosen habit anchor for that period (Coffee,
// Lunch, Dinner…). If unset, the body falls back to a self-contained line.

export type NotificationPeriod = 'morning' | 'midday' | 'evening';

interface PeriodCopy {
    title: string;
    bodyWithAnchor: (relation: 'before' | 'after', anchor: string) => string;
    bodyFallback: string;
}

export const NOTIFICATION_COPY: Record<NotificationPeriod, PeriodCopy> = {
    morning: {
        title: 'Rise · Begin soft',
        bodyWithAnchor: (relation, anchor) =>
            relation === 'before'
                ? `Before you ${anchor}, one exhale. Then three minutes.`
                : `After you ${anchor}, three minutes. Exhale first.`,
        bodyFallback: 'Begin soft. Exhale first. Three minutes is the whole practice.',
    },
    midday: {
        title: 'Rest · Return to the breath',
        bodyWithAnchor: (relation, anchor) =>
            relation === 'before'
                ? `Before you ${anchor}, three minutes. Let the morning land.`
                : `After you ${anchor}, three minutes. The wave has passed.`,
        bodyFallback: 'Return to the breath. Three minutes to reset the middle of the day.',
    },
    evening: {
        title: 'Relax · Long exhale',
        bodyWithAnchor: (relation, anchor) =>
            relation === 'before'
                ? `Before you ${anchor}, wind down. Three minutes, long exhale.`
                : `After you ${anchor}, three minutes. Let the day close.`,
        bodyFallback: 'Wind down. Long exhale. Three minutes to close the day.',
    },
};

// Convenience for callers — picks the anchored or fallback body.
export function bodyFor(
    period: NotificationPeriod,
    relation: 'before' | 'after',
    anchor: string | undefined | null,
): string {
    const c = NOTIFICATION_COPY[period];
    const clean = (anchor || '').trim();
    return clean ? c.bodyWithAnchor(relation, clean) : c.bodyFallback;
}
