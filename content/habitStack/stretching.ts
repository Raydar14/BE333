// Stretching sequences — 3 short flows per Master Manual: desk release,
// neck & shoulders, back & hips. Each is 6 moves × 30 sec = 3 min.
// Safety: stop if pain; breathe gently.

import { Sequence } from './types';

export const STRETCHING_SEQUENCES: Sequence[] = [
    {
        id: 'desk-release',
        name: 'Desk Release',
        purpose: 'Undo the shape of a screen day. Ideal for midday.',
        totalMinutes: 3,
        posture: 'sitting',
        steps: [
            { name: 'Wrist Flex & Extend', durationSec: 30, cue: 'Arms forward, palms down. Bend wrists up, then down. Slow.' },
            { name: 'Shoulder Rolls', durationSec: 30, cue: 'Big slow circles. Five back, five forward. Full range.' },
            { name: 'Seated Cat–Cow', durationSec: 30, cue: 'Hands on knees. Inhale, arch. Exhale, round. Six rounds.' },
            { name: 'Chest Opener', durationSec: 30, cue: 'Hands behind back, laced or holding. Lift the chest, lengthen.' },
            { name: 'Seated Twist', durationSec: 30, cue: '15 sec each side. Inhale tall, exhale twist, no strain.' },
            { name: 'Neck Release', durationSec: 30, cue: 'Right ear to right shoulder — 15 sec. Then left.' },
        ],
    },
    {
        id: 'neck-shoulders',
        name: 'Neck & Shoulders',
        purpose: 'Melt the phone-neck. Great after long meetings.',
        totalMinutes: 3,
        posture: 'mixed',
        steps: [
            { name: 'Neck Nods (yes)', durationSec: 30, cue: 'Slow chin-tuck, then look up. Small range, no force.' },
            { name: 'Neck Turns (no)', durationSec: 30, cue: 'Turn right — 15 sec. Then left. Slow.' },
            { name: 'Ear-to-shoulder', durationSec: 30, cue: 'Right ear to right shoulder. Left hand reaches down.' },
            { name: 'Shoulder Shrug & Drop', durationSec: 30, cue: 'Squeeze shoulders up to ears. Hold 3 sec. Drop. Repeat 6x.' },
            { name: 'Eagle Arms', durationSec: 30, cue: 'Cross elbows, wrap forearms, palms together. Lift elbows.' },
            { name: 'Cactus Arms', durationSec: 30, cue: 'Arms in goalpost. Squeeze shoulder blades together. Breathe.' },
        ],
    },
    {
        id: 'back-hips',
        name: 'Back & Hips',
        purpose: 'Open the low back and hips. Good before bed or after driving.',
        totalMinutes: 3,
        posture: 'mixed',
        steps: [
            { name: 'Child\'s Pose', durationSec: 30, cue: 'Knees wide, big toes together. Forehead to mat. Breathe.' },
            { name: 'Cat–Cow', durationSec: 30, cue: 'On hands and knees. Six full slow rounds with the breath.' },
            { name: 'Thread the Needle (R)', durationSec: 30, cue: 'Right arm threads under, shoulder to mat. Rest cheek down.' },
            { name: 'Thread the Needle (L)', durationSec: 30, cue: 'Left arm threads under. Same slow, breathing depth.' },
            { name: 'Low Lunge (R)', durationSec: 30, cue: 'Right foot forward, back knee down. Sink hips forward.' },
            { name: 'Low Lunge (L)', durationSec: 30, cue: 'Left foot forward. Same. Breathe into the front hip.' },
        ],
    },
];
