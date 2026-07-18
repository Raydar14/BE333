// Yoga sequences — Sun Salutation A + 3 vinyasas per Master Manual Part 6.
// Names use both Sanskrit and English for accessibility.

import { Sequence } from './types';

export const YOGA_SEQUENCES: Sequence[] = [
    {
        id: 'sun-salutation-a',
        name: 'Sun Salutation A',
        purpose: 'Full-body energizing and mental focus.',
        totalMinutes: 3,
        steps: [
            { name: 'Tadasana (Mountain)', durationSec: 15, cue: 'Ground the feet. Long spine. Centering breath.' },
            { name: 'Urdhva Hastasana (Upward Salute)', durationSec: 10, cue: 'Inhale, arms sweep up overhead.' },
            { name: 'Uttanasana (Forward Fold)', durationSec: 15, cue: 'Exhale, fold from the hips. Soft knees are fine.' },
            { name: 'Halfway Lift', durationSec: 10, cue: 'Inhale, halfway lift, long spine, fingertips or shins.' },
            { name: 'Plank → Chaturanga', durationSec: 20, cue: 'Exhale, step or float back to plank. Lower with control.' },
            { name: 'Upward Dog / Cobra', durationSec: 15, cue: 'Inhale, lift the chest. Elbows soft. Roll shoulders back.' },
            { name: 'Downward Dog', durationSec: 30, cue: 'Exhale, hips high. Hold 3 slow breaths.' },
            { name: 'Step forward → Halfway Lift', durationSec: 10, cue: 'Inhale, walk or jump feet in. Long spine again.' },
            { name: 'Uttanasana', durationSec: 10, cue: 'Exhale, fold.' },
            { name: 'Urdhva Hastasana', durationSec: 10, cue: 'Inhale, rise. Sweep arms overhead.' },
            { name: 'Tadasana', durationSec: 15, cue: 'Exhale, hands to heart. Repeat, other leg leads.' },
        ],
    },
    {
        id: 'clear-the-mind',
        name: 'Vinyasa 1 · Clear the Mind',
        purpose: 'Mental clarity, light energy boost.',
        totalMinutes: 3,
        steps: [
            { name: 'Tadasana', durationSec: 15, cue: 'Centering breath. Set a light intention.' },
            { name: 'Flow to Downward Dog', durationSec: 60, cue: 'Urdhva → fold → halfway → plank → chaturanga → up dog → down dog. One breath per pose.' },
            { name: 'Downward Dog hold', durationSec: 30, cue: 'Three long breaths. Pedal the feet if it feels good.' },
            { name: 'Step forward → Halfway Lift', durationSec: 15, cue: 'Walk in slowly.' },
            { name: 'Forward Fold', durationSec: 10, cue: 'Release the head.' },
            { name: 'Urdhva Hastasana', durationSec: 10, cue: 'Inhale, rise.' },
            { name: 'Tadasana', durationSec: 10, cue: 'Exhale, hands to heart. Notice.' },
        ],
    },
    {
        id: 'nervous-system-reset',
        name: 'Vinyasa 2 · Nervous System Reset',
        purpose: 'Calm the mind and body, relieve stress.',
        totalMinutes: 3,
        steps: [
            { name: 'Sukhasana (Easy Seat)', durationSec: 30, cue: 'Sit cross-legged. One hand on belly, one on chest. Long exhales.' },
            { name: 'Cat–Cow (5 rounds)', durationSec: 60, cue: 'Move at the speed of your breath. Inhale arch, exhale round.' },
            { name: 'Thread the Needle (right)', durationSec: 40, cue: 'Right arm under, shoulder to mat. Rest cheek down.' },
            { name: 'Thread the Needle (left)', durationSec: 40, cue: 'Left arm under. Even softer this side.' },
            { name: "Child's Pose", durationSec: 30, cue: 'Rest. Ground the forehead. Breathe into the low back.' },
        ],
    },
    {
        id: 'root-and-rise',
        name: 'Vinyasa 3 · Root & Rise',
        purpose: 'Grounding, strength, confidence.',
        totalMinutes: 3,
        steps: [
            { name: 'Tadasana', durationSec: 15, cue: 'Ground the feet. Steady breath. Set an intention.' },
            { name: 'Chair (Utkatasana)', durationSec: 30, cue: 'Sit back into imaginary chair. Arms overhead. Keep chest lifted.' },
            { name: 'Forward Fold → Warrior II (R)', durationSec: 30, cue: 'Step right foot back. Bend front knee, arms wide, gaze over front hand.' },
            { name: 'Reverse Warrior (R)', durationSec: 30, cue: 'Front arm rises, back hand slides down the leg. Long side body.' },
            { name: 'Wide-Leg Fold (Prasarita)', durationSec: 30, cue: 'Turn to center, feet wide, hinge forward. Let the crown release.' },
            { name: 'Warrior II + Reverse (L)', durationSec: 45, cue: 'Rise up. Repeat on the left side, same slow tempo.' },
        ],
    },
];
