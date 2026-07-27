// Yoga sequences — per Master Manual Part 6 (Daily Sequences).
// Three sessions × three versions = 9 sequences. Each session keeps one
// breath pattern across all three versions.
//   Morning Rise    — even 4/4 breath, one strength moment per version
//   Mid-Day Reset   — slightly lengthened exhale, desk-friendly
//   Evening Rest    — exhale twice as long as inhale, effortless by design
// Every version runs ~3 minutes. Named in plain English throughout;
// Sanskrit translations live in the Manual's Translation Key.
//
// Safety framework (Manual Part 6):
// - Soft or bent knees on every fold
// - No loaded spinal flexion, no forced hip rotation
// - No core-gripping or tailbone-tucking cues
// - All floor transitions happen via the side or via hands and knees
// - Strength moments only appear in Morning Rise; Evening has no effort by design

import { Sequence } from './types';

export const YOGA_SEQUENCES: Sequence[] = [
    // ────────────────────────────────────────────────────────────
    // MORNING RISE — breath: even, 4 in / 4 out
    // ────────────────────────────────────────────────────────────
    {
        id: 'morning-rise-standing',
        name: 'Morning Rise · Standing Up',
        purpose: 'Bring the system online. Breath: even, 4 in / 4 out.',
        totalMinutes: 3,
        posture: 'standing',
        steps: [
            { name: 'Standing Full-Body Reach', durationSec: 25, cue: 'Arms sweep overhead, stretch long through the fingers, heels can lift. Inhale up, exhale float down. 3 rounds.' },
            { name: 'Standing Cat-Cow', durationSec: 40, cue: 'Hands on thighs or a counter. Arch and round the spine with the breath. 6 rounds, slightly brisk.' },
            { name: 'Shoulder Rolls + Neck Turns', durationSec: 30, cue: 'Five backward rolls. Then look slowly right and left, twice each way.' },
            { name: 'Standing Side Reach', durationSec: 30, cue: 'Right and left. About 15 sec per side. One arm overhead, lean gently away.' },
            { name: 'Chair Pose Pulses', durationSec: 35, cue: 'Sit back a few inches on the inhale, rise on the exhale. 4 slow rounds. Belly soft, arms optional.' },
            { name: 'Tree Pose', durationSec: 25, cue: '10 to 15 sec per side. Fingertips on wall or counter as needed.' },
        ],
    },
    {
        id: 'morning-rise-laying',
        name: 'Morning Rise · Laying Down',
        purpose: 'Bring the system online, starting in bed. Breath: even, 4 in / 4 out. Ends standing.',
        totalMinutes: 3,
        posture: 'mixed',
        steps: [
            { name: 'Full-Body Reach', durationSec: 25, cue: 'On the back, arms overhead. Stretch fingers to heels, point and flex the feet. 2 to 3 rounds. Inhale into the stretch, soften on the exhale.' },
            { name: 'Knees-to-Chest Rock', durationSec: 25, cue: 'Loose hug, small side-to-side rocking. Easy breath.' },
            { name: 'Reclined Twist', durationSec: 30, cue: 'Knees drop to one side, arms wide. Right and left, about 15 sec per side. No pulling.' },
            { name: 'Bridge Lifts', durationSec: 35, cue: 'Knees bent, feet flat. Hips lift a few inches on the inhale, lower on the exhale. 4 slow rounds.' },
            { name: 'Rise to Standing', durationSec: 10, cue: 'Roll to the side, press up to sitting, then stand. Head comes up last.' },
            { name: 'Mountain + Standing Side Reach', durationSec: 30, cue: 'Right and left, about 15 sec per side. One arm overhead, lean gently away.' },
            { name: 'Tree Pose', durationSec: 25, cue: '10 to 15 sec per side. One foot lifted. Fingertips on wall, dresser, or counter as needed.' },
        ],
    },
    {
        id: 'morning-rise-updown',
        name: 'Morning Rise · Up&Down',
        purpose: 'Bring the system online with a floor-to-standing arc. Breath: even, 4 in / 4 out.',
        totalMinutes: 3,
        posture: 'mixed',
        steps: [
            { name: 'Easy Cross-Legged Seat', durationSec: 25, cue: 'On the floor, blanket under hips as needed. 3 even breaths. Shoulders roll back once.' },
            { name: 'Cat-Cow', durationSec: 40, cue: 'From hands and knees. 6 rounds, slightly brisk. Inhale arch, exhale round.' },
            { name: 'Sphinx', durationSec: 30, cue: 'Forearms down, chest gently lifted, legs heavy. Even breath.' },
            { name: 'Downward-Facing Dog (knees bent)', durationSec: 40, cue: 'Knees bent, pedaling the feet. 20 to 30 sec. Then walk the feet forward and roll up to standing, head last.' },
            { name: 'Standing Side Reach', durationSec: 30, cue: 'Right and left, about 15 sec per side.' },
            { name: 'Tree Pose', durationSec: 25, cue: '10 to 15 sec per side. Wall or counter as needed.' },
        ],
    },

    // ────────────────────────────────────────────────────────────
    // MID-DAY RESET — breath: slightly lengthened exhale
    // ────────────────────────────────────────────────────────────
    {
        id: 'midday-reset-standing',
        name: 'Mid-Day Reset · Standing Up',
        purpose: 'Clear tension, reset posture, return to the day. Breath: slightly lengthened exhale. Desk-friendly.',
        totalMinutes: 3,
        posture: 'mixed',
        steps: [
            { name: 'Mountain + Shoulder Rolls', durationSec: 40, cue: 'Five slow backward rolls. Then stand still and let the exhale lengthen.' },
            { name: 'Cat-Cow', durationSec: 50, cue: 'Inhale to arch, exhale to round. Small range, about 8 slow rounds. Hands can go to a desk or counter instead of the floor.' },
            { name: 'Thread the Needle', durationSec: 40, cue: 'From hands and knees, slide one arm under, shoulder rests down. Right and left, about 20 sec per side. Breath into the back ribs.' },
            { name: 'Standing Side Reach', durationSec: 50, cue: 'Right and left, about 20 sec per side. Finish with two long exhales.' },
        ],
    },
    {
        id: 'midday-reset-laying',
        name: 'Mid-Day Reset · Laying Down',
        purpose: 'Clear tension, reset posture, without leaving the floor. Breath: slightly lengthened exhale.',
        totalMinutes: 3,
        posture: 'sitting',
        steps: [
            { name: 'Full-Body Reach on the Back', durationSec: 20, cue: 'Inhale into the stretch, soften on the exhale. 2 rounds.' },
            { name: 'Knees-to-Chest Rock', durationSec: 30, cue: 'Loose hug, small rocking, easy breath.' },
            { name: 'Reclined Twist', durationSec: 40, cue: 'Right and left, about 20 sec per side. Knees drop, arms wide.' },
            { name: 'Reclined Figure-4', durationSec: 40, cue: 'Ankle over opposite knee, hands behind the thigh. Gentle. Right and left, about 20 sec per side.' },
            { name: 'Legs-Up-the-Wall', durationSec: 50, cue: 'Or legs resting on the couch or chair seat. In 4, out 6. Then roll to the side and come up.' },
        ],
    },
    {
        id: 'midday-reset-updown',
        name: 'Mid-Day Reset · Up&Down',
        purpose: 'Clear tension with a full standing-to-floor-to-standing arc. Breath: slightly lengthened exhale.',
        totalMinutes: 3,
        posture: 'mixed',
        steps: [
            { name: 'Mountain + Shoulder Rolls', durationSec: 30, cue: 'Five slow backward rolls. Exhale lengthening.' },
            { name: 'Standing Side Reach', durationSec: 30, cue: 'Right and left, about 15 sec per side.' },
            { name: 'Cat-Cow (from hands and knees)', durationSec: 45, cue: 'Lower to hands and knees, then 6 slow rounds.' },
            { name: 'Thread the Needle', durationSec: 40, cue: 'Right and left, about 20 sec per side.' },
            { name: 'Child\'s Pose', durationSec: 20, cue: 'Knees wide. Pillow under hips if the fold feels crowded. 3 long exhales.' },
            { name: 'Rise to Mountain Pose', durationSec: 15, cue: 'Roll up slowly. Two long exhales to close.' },
        ],
    },

    // ────────────────────────────────────────────────────────────
    // EVENING REST — breath: exhale twice as long as inhale
    // ────────────────────────────────────────────────────────────
    {
        id: 'evening-rest-standing',
        name: 'Evening Rest · Standing Up',
        purpose: 'Down-shift the nervous system toward sleep. Breath: exhale twice as long as the inhale.',
        totalMinutes: 3,
        posture: 'standing',
        steps: [
            { name: 'Mountain Pose', durationSec: 40, cue: 'Eyes soft or closed. Hand on belly. In 4, out 8. Three rounds.' },
            { name: 'Slow Shoulder Rolls, Arms Heavy', durationSec: 30, cue: 'Five rolls. Then stand and let the arms weigh down. Jaw unclenched, teeth slightly parted.' },
            { name: 'Standing Side Reach (Slow-Motion)', durationSec: 40, cue: 'Right and left, about 20 sec per side. Exhale long on the way over.' },
            { name: 'Standing Forward Fold', durationSec: 30, cue: 'Knees generously bent. Arms dangling or holding opposite elbows. Gentle sway, head heavy. Hands can rest on a bed or chair seat for a supported half-fold instead.' },
            { name: 'Return to Mountain', durationSec: 40, cue: 'Rolling up slowly, head last. One final round of in 4, out 8. Standing still.' },
        ],
    },
    {
        id: 'evening-rest-laying',
        name: 'Evening Rest · Laying Down',
        purpose: 'Down-shift toward sleep without leaving the bed. Breath: exhale twice as long as the inhale.',
        totalMinutes: 3,
        posture: 'sitting',
        steps: [
            { name: 'Supported Reclined Butterfly', durationSec: 60, cue: 'On the back, soles of feet together, knees resting on pillows (pillows required). Belly breathing — one hand on belly, one on chest, only the belly hand moves.' },
            { name: 'Knees-to-Chest Rock', durationSec: 45, cue: 'Loose grip, shoulders down, tiny rocking.' },
            { name: 'Reclined Twist', durationSec: 40, cue: 'Right and left, lazy version. Gravity does the work. About 20 sec per side.' },
            { name: 'Corpse Pose / Sleep Position', durationSec: 35, cue: '4-7-8 breath (in 4, hold 7, out 8), two to three rounds. Or simplify to a long exhale if counting feels like work.' },
        ],
    },
    {
        id: 'evening-rest-updown',
        name: 'Evening Rest · Up&Down',
        purpose: 'One-way trip: starts standing, ends down for sleep. Breath: exhale twice as long as the inhale.',
        totalMinutes: 3,
        posture: 'mixed',
        steps: [
            { name: 'Mountain Pose', durationSec: 30, cue: 'Eyes soft. Hand on belly. In 4, out 8. Two rounds. Jaw unclenched, teeth slightly parted.' },
            { name: 'Standing Forward Fold', durationSec: 25, cue: 'Knees generously bent. Arms dangling or hands resting on the bed or a chair seat. Gentle sway, head heavy.' },
            { name: 'Easy Cross-Legged Seat', durationSec: 30, cue: 'Lower to sitting. Blanket or against the bed for back support. Long-exhale breathing, shoulders melting.' },
            { name: 'Knees-to-Chest Rock', durationSec: 35, cue: 'Recline back. Loose grip, tiny rocking.' },
            { name: 'Reclined Twist', durationSec: 40, cue: 'Right and left, lazy version. About 20 sec per side.' },
            { name: 'Corpse Pose / Sleep Position', durationSec: 20, cue: '4-7-8 breath, two rounds. Or just the long exhale.' },
        ],
    },
];
