// Wave 4 · 60-second SOS scripts. For the moments you need something to do
// right now — before a meeting, in an inbox spiral, on a walk, in bed
// unable to sleep. Each is under a minute if you follow the pacing marks.

export interface SosScript {
    id: string;
    title: string;
    subtitle: string;
    when: string; // one-line "use when …"
    durationSec: number;
    steps: Array<{
        cue: string;    // what to do
        detail: string; // one-line felt sense / how
        holdSec: number; // pause before the next cue
    }>;
    close: string; // one-line landing
}

export const SOS_SCRIPTS: SosScript[] = [
    {
        id: 'physiologic-sigh',
        title: 'Physiologic sigh',
        subtitle: 'The fastest reset your body knows',
        when: 'Use when adrenaline hits — pre-meeting, mid-argument, mid-scroll.',
        durationSec: 45,
        steps: [
            { cue: 'Inhale through the nose', detail: 'Fill the belly. Slow, not sharp.', holdSec: 4 },
            { cue: 'Second short inhale — same breath', detail: 'A small top-up. Fills the last of the lungs.', holdSec: 2 },
            { cue: 'Long, slow exhale through the mouth', detail: 'Twice as long as the inhale. Let it sigh audibly.', holdSec: 8 },
            { cue: 'Repeat twice more', detail: 'Two more double-inhale, long-exhale cycles.', holdSec: 20 },
        ],
        close: 'Notice your shoulders. They are probably lower than they were 45 seconds ago.',
    },
    {
        id: 'meeting-reset',
        title: 'Email / meeting reset',
        subtitle: 'Between one thing and the next',
        when: 'Use when you notice you are already three tabs ahead of yourself.',
        durationSec: 60,
        steps: [
            { cue: 'Close what you were looking at', detail: 'Tab, phone, message thread — end the sentence.', holdSec: 3 },
            { cue: 'Feet flat on the floor', detail: 'Chair firm under you. Both hands on the desk.', holdSec: 3 },
            { cue: 'One slow exhale', detail: 'Through the mouth. Longer than felt necessary.', holdSec: 6 },
            { cue: 'Three normal breaths', detail: 'Do not steer them. Just notice them.', holdSec: 20 },
            { cue: 'Ask: what is the ONE next thing?', detail: 'Not the list. One thing. Do that.', holdSec: 5 },
        ],
        close: 'The next thing is smaller than the pile felt. That is the point.',
    },
    {
        id: 'walking-mindfulness',
        title: 'Walking mindfulness',
        subtitle: 'A minute of "I am here"',
        when: 'Use on the walk to your car, the mailbox, the coffee shop.',
        durationSec: 60,
        steps: [
            { cue: 'Slow the pace by a third', detail: 'Not slow-motion. Just deliberate.', holdSec: 5 },
            { cue: 'Feel the foot land', detail: 'Heel — arch — toes. Left, then right.', holdSec: 15 },
            { cue: 'Match breath to steps', detail: 'Inhale for three steps. Exhale for four.', holdSec: 20 },
            { cue: 'Name three things you see', detail: 'Silently. Object, color, texture.', holdSec: 15 },
        ],
        close: 'Your surroundings were always there. Now you are, too.',
    },
    {
        id: 'wind-down',
        title: 'Lying-down wind-down',
        subtitle: 'When sleep is being difficult',
        when: 'Use in bed when the mind will not quiet.',
        durationSec: 90,
        steps: [
            { cue: 'Lie flat on your back', detail: 'Legs uncrossed. Arms loose at your sides, palms up.', holdSec: 5 },
            { cue: 'One long exhale', detail: 'Through the mouth. Softer than a sigh.', holdSec: 6 },
            { cue: 'Scan from feet to jaw', detail: 'Notice each place. Do not fix anything. Just visit.', holdSec: 30 },
            { cue: 'Breathe with the count of 4-1-6', detail: 'In 4, pause 1, out 6. Ten rounds.', holdSec: 40 },
        ],
        close: 'Sleep is not a task you can force. Rest is enough. The rest often follows.',
    },
];
