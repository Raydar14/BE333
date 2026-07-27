// Wave 4 · Trauma-sensitive variant.
// A ground-and-orient script for anyone whose baseline is not "I am safe."
// Referenced in Manual Part 5. This is not a replacement for professional
// care — it is the on-ramp for people for whom eyes-closed breath focus
// can be activating rather than calming.

export interface TraumaSensitiveScript {
    id: 'ground-orient';
    title: string;
    subtitle: string;
    intro: string;
    ground: {
        heading: string;
        steps: Array<{ cue: string; detail: string }>;
    };
    orient: {
        heading: string;
        steps: Array<{ cue: string; detail: string }>;
    };
    breathe: {
        heading: string;
        note: string;
        steps: Array<{ cue: string; detail: string }>;
    };
    close: string;
    reminder: string;
}

export const TRAUMA_SENSITIVE: TraumaSensitiveScript = {
    id: 'ground-orient',
    title: 'Ground & orient',
    subtitle: 'For when the breath alone feels like too much',
    intro:
        'For some people, closing the eyes and turning attention inward is not soothing — it is destabilizing. If that is you, none of this is a failure of the practice. Try this variant instead. Eyes open. Feet on the floor. Body in the room, before breath in the belly.',
    ground: {
        heading: 'Ground',
        steps: [
            { cue: 'Feet flat on the floor.', detail: 'Both of them. Press down until you feel the floor push back.' },
            { cue: 'Hands on your thighs.', detail: 'Palms down. Feel the fabric. Feel the temperature.' },
            { cue: 'Sit into the chair.', detail: 'Let the chair hold you. Your back does not need to work right now.' },
            { cue: 'Notice the weight.', detail: 'Which side of you is heavier? Where do you meet the seat?' },
        ],
    },
    orient: {
        heading: 'Orient',
        steps: [
            { cue: 'Look slowly around the room.', detail: 'Turn your head. Do not stare. Let your eyes land where they want.' },
            { cue: 'Name three things you can see.', detail: 'Silently. A door. A lamp. A cup. Real, present, ordinary objects.' },
            { cue: 'Name two things you can hear.', detail: 'A refrigerator. A car. Your own breath.' },
            { cue: 'Name one thing you can touch.', detail: 'Reach for it. Feel it. It is real. You are here.' },
        ],
    },
    breathe: {
        heading: 'Breathe (optional)',
        note: 'Only if the grounding felt steady. Skip if not — grounding alone is enough.',
        steps: [
            { cue: 'Keep your eyes open.', detail: 'Soft focus, mid-distance. No need to close them.' },
            { cue: 'One slow exhale through the mouth.', detail: 'That is one full breath. If it was enough, stop there.' },
            { cue: 'Three normal breaths.', detail: 'Do not lengthen or slow them. Just notice them happening.' },
            { cue: 'If that felt fine — try three slow ones.', detail: 'In through the nose, out through the mouth. Stop the moment it stops feeling steady.' },
        ],
    },
    close:
        'You are here. The room is here. The floor is here. That is enough. You can build slowly from this floor.',
    reminder:
        'If breath-focus practices consistently activate rather than settle you, please work with a trauma-informed clinician. This script is a support, not a substitute for care.',
};
