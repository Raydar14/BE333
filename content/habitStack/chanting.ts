// Chanting stack — 4 tracks per Master Manual.
// Structure: 20-sec posture/breath intro, ~2-min chant with subtle bells
// every 30 sec, 40-sec quiet sit and close. Audio files are TODO.

import { ChantingTrack } from './types';

export const CHANTING_TRACKS: ChantingTrack[] = [
    {
        id: 'om',
        name: 'OM',
        meaning: 'The primordial sound. A vibration of wholeness, said to contain all others.',
        intro: 'Sit tall. Soft belly. Long exhale. On the next in-breath, prepare to sound.',
        core:
            'Inhale slowly. Exhale on OM, the "O" opening as your belly softens, the "M" ' +
            'humming as the exhale ends. Let each round be its own. Follow the natural pace ' +
            'of your breath, not a clock.',
        close: 'Rest in silence. Notice the vibration still humming in your chest and jaw. Let sound and silence be equal.',
    },
    {
        id: 'so-hum',
        name: 'So Hum',
        meaning: '"I am." On the in-breath: SO. On the out-breath: HUM.',
        intro: 'Settle. One long exhale. Place your attention at the top of the belly.',
        core:
            'Inhale silently on the word SO. Exhale silently on HUM. Let the syllables ride ' +
            'the breath, not lead it. If the mind drifts, gently return: SO on the in, HUM on the out.',
        close: 'Let go of the syllables. Sit with the natural breath. Notice: something in you was already saying, "I am."',
    },
    {
        id: 'humming',
        name: 'Simple Humming',
        meaning: 'A wordless hum — soothes the vagus nerve and lengthens the exhale.',
        intro: 'Lips softly closed. Jaw loose. Take one full inhale.',
        core:
            'On the exhale, hum any note that feels easy. Feel the buzz in your lips, ' +
            'nose, and cheekbones. Let each hum be a little longer than the one before, ' +
            'until it finds a comfortable natural length.',
        close: 'Stop humming. Keep the lips soft. Notice the tingle where the sound was.',
    },
    {
        id: 'silent-mantra',
        name: 'Silent Mantra',
        meaning: 'A repeated word held internally — the practice of returning.',
        intro: 'Choose a short word: peace, home, here, still. Something kind. Settle in your breath.',
        core:
            'Silently think the word on the exhale. Let the in-breath be free. When the ' +
            'mind wanders, it will — that is the practice. Softly return to the word.',
        close: 'Release the word. Sit in the quiet it leaves behind. Notice how you feel.',
    },
];
