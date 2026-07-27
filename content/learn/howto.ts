// Wave 4 · How-to cards. Nine short pieces that each answer one common
// question a user brings to the practice. Voice: warm, plain-language,
// psychologist. No jargon, no drama. Optional micro-audio can be added
// later by dropping tracks into services and wiring them by `id`.

export interface HowToCard {
    id: string;
    title: string;
    subtitle: string;
    // Ordered content blocks — mixed prose and lists so the /learn screen
    // can render each without inventing structure.
    blocks: Array<
        | { kind: 'p'; text: string }
        | { kind: 'list'; items: string[] }
        | { kind: 'callout'; text: string }
    >;
    readSec: number; // approximate silent-read time
}

export const HOW_TO_CARDS: HowToCard[] = [
    {
        id: 'sit-posture',
        title: 'Sitting & posture',
        subtitle: 'A body that lets breath move easily',
        readSec: 60,
        blocks: [
            { kind: 'p', text: 'You do not need to sit cross-legged. You do not need a cushion, a chair, or a special corner. The goal is a spine that stacks, a belly that can move, and a jaw that can soften. That is it.' },
            { kind: 'list', items: [
                'Feet flat on the floor, or ankles crossed on a cushion — either is fine.',
                'Sit forward on the chair so your back is not doing the leaning.',
                'Let your hands rest palms-down on your thighs. Palms-up wakes the shoulders.',
                'Chin slightly tucked. Crown of your head reaching gently up.',
                'Soften the space between your eyebrows. Soften your jaw. Let your tongue rest.',
            ]},
            { kind: 'callout', text: 'If any of this hurts, it is not the posture for you. Lying down is a real option. The breath is the practice, not the shape.' },
        ],
    },
    {
        id: 'working-with-thoughts',
        title: 'Working with thoughts',
        subtitle: 'Not stopping them — noticing them',
        readSec: 55,
        blocks: [
            { kind: 'p', text: 'The mind is going to think. Thinking during a BE Pause is not a failure — it is what minds do. The practice is not about a blank mind. It is about noticing when you have drifted, and gently coming back to the exhale.' },
            { kind: 'p', text: 'You will drift. Ten times, twenty times, a hundred times. Each time you notice you drifted is a repetition. That is the muscle.' },
            { kind: 'callout', text: 'The moment you catch yourself thinking is the moment of the practice. That is the win, not the absence of thought.' },
        ],
    },
    {
        id: 'working-with-sensations',
        title: 'Working with sensations',
        subtitle: 'Itches, aches, and the urge to move',
        readSec: 50,
        blocks: [
            { kind: 'p', text: 'When you sit still, sensations you normally ignore get louder. An itch on your nose. A twinge in your knee. The tag on your shirt. Your body checking whether you meant it.' },
            { kind: 'p', text: 'First, notice. Name it — "itch," "warmth," "pressure." Then decide, without judgment: do I move, or do I let this pass? Both are fine. Moving is not weakness. Sitting through is not virtue.' },
            { kind: 'callout', text: 'Sharp pain is a signal, not a test. Move. Adjust. Come back.' },
        ],
    },
    {
        id: 'working-with-worries',
        title: 'Working with worries',
        subtitle: 'When the mind keeps returning to the same thing',
        readSec: 65,
        blocks: [
            { kind: 'p', text: 'Some sessions the mind keeps circling one problem — an email, a conversation, a fear. Fighting it makes it louder. So does pretending it is not there.' },
            { kind: 'p', text: 'Try this: give the worry a name and a chair. "Work worry, I see you. Sit here for three minutes. I will come back to you when the timer ends." Then return to the exhale.' },
            { kind: 'p', text: 'When the timer ends, keep your promise. Look at the worry. Often, three minutes of breath is enough to see it differently — smaller, more solvable, or worth writing down.' },
        ],
    },
    {
        id: 'diaphragmatic-breathing',
        title: 'Diaphragmatic breathing',
        subtitle: 'Belly, not chest',
        readSec: 55,
        blocks: [
            { kind: 'p', text: 'Chest breathing is what your body does under stress — shallow, fast, high in the ribs. Diaphragmatic breathing is what it does at rest — the belly rises on the inhale, softens on the exhale.' },
            { kind: 'p', text: 'Place one hand on your chest and one on your belly. Breathe in through your nose. The hand that should move is the one on your belly. If both are moving, focus on the belly. If only the chest is moving, slow down.' },
            { kind: 'callout', text: 'Diaphragmatic breathing is the on-switch for the calm side of your nervous system. Every slow exhale tells your body: we are safe.' },
        ],
    },
    {
        id: 'mantras-how-to',
        title: 'How to use a mantra',
        subtitle: 'One phrase, on repeat, without judgment',
        readSec: 55,
        blocks: [
            { kind: 'p', text: 'A mantra is a short phrase you repeat — silently or aloud — during the practice. It gives your mind something to do so it stops narrating.' },
            { kind: 'list', items: [
                'Pick one from the Mantra library, or write your own.',
                'On the inhale: silently say the first half. On the exhale: the second half.',
                'When your mind drifts to something else — come back to the mantra, not to why you drifted.',
                'Use the same mantra for the whole session. Do not shop.',
            ]},
            { kind: 'callout', text: 'Mantras work not because the words are magic, but because repetition crowds out rumination.' },
        ],
    },
    {
        id: 'chanting-how-to',
        title: 'How to use chanting',
        subtitle: 'Sound as an anchor',
        readSec: 55,
        blocks: [
            { kind: 'p', text: 'Chanting adds a felt vibration to the practice. Humming, OM, or a soft "so-hum" all work the same way — the sound travels through your chest and throat, giving attention somewhere to land that is bigger than thought.' },
            { kind: 'list', items: [
                'Sit tall enough that sound has room to move.',
                'Inhale through the nose. Chant on the exhale — soft, low, longer than feels natural.',
                'Do not push volume. This is not performance.',
                'If self-conscious: hum. Same effect, less exposure.',
            ]},
        ],
    },
    {
        id: 'mind-body',
        title: 'The mind-body connection',
        subtitle: 'Why breath changes mood',
        readSec: 70,
        blocks: [
            { kind: 'p', text: 'Your breath is one of the only autonomic systems you can consciously override. Heart rate, digestion, hormone release — those run in the background. Breath runs in the background too, but you can grab the wheel any time.' },
            { kind: 'p', text: 'When you slow the exhale, you send a signal up the vagus nerve that says: no danger here. Your heart rate drops. Your muscles soften. Stress chemistry starts to clear.' },
            { kind: 'callout', text: 'You are not "trying to relax." You are giving your body the input it needs to relax on its own. Very different job.' },
        ],
    },
    {
        id: 'why-333',
        title: 'Why 333?',
        subtitle: 'Three minutes, three times, three weeks',
        readSec: 65,
        blocks: [
            { kind: 'p', text: 'Three minutes is short enough that you will actually do it. Three times a day is often enough to shift your baseline. Three weeks is long enough for the nervous system to relearn its resting state.' },
            { kind: 'p', text: 'Longer sessions are not better. Consistency is the whole game. A three-minute Pause you did today beats a twenty-minute session you skipped.' },
            { kind: 'p', text: 'Once the first 21 days are steady, you can graduate to 666 (six minutes × three) or 999 (nine × three). Same rhythm, more room.' },
            { kind: 'callout', text: 'Three-minute breath breaks are the most-researched, most-effective form of habitual mindfulness we have. This is not a shortcut — it is the actual dose.' },
        ],
    },
];
