// Prayer texts — 6 short prayers per Master Manual.
// Secular, interfaith, Christian, Jewish, Muslim, Hindu/Buddhist-inspired.
// Inclusive, non-proselytizing. A global toggle can hide the whole stack.

import { PrayerText } from './types';

export const PRAYER_TEXTS: PrayerText[] = [
    {
        id: 'secular-still-point',
        tradition: 'secular',
        title: 'A Still Point',
        text: `May I be steady in this moment.
May my breath be a place to return.
May I meet myself with kindness.
May the noise settle, if only a little.
May I carry this small quiet with me.`,
    },
    {
        id: 'interfaith-common-ground',
        tradition: 'interfaith',
        title: 'Common Ground',
        text: `To whatever holds this life,
thank you for this breath.
Let me be gentle where I can.
Let me be honest where I must.
Let me carry peace to the next room.`,
    },
    {
        id: 'christian-shepherd',
        tradition: 'christian',
        title: 'From Psalm 23 (adapted)',
        text: `The Lord is my shepherd; I shall not want.
He makes me lie down in green pastures.
He leads me beside still waters.
He restores my soul.
Goodness and mercy will follow me all my days.`,
    },
    {
        id: 'jewish-shehecheyanu',
        tradition: 'jewish',
        title: 'Shehecheyanu (adapted)',
        text: `Blessed are You, Source of all life,
for keeping me,
for sustaining me,
for bringing me to this moment.
May I meet it awake and grateful.`,
    },
    {
        id: 'muslim-al-fatihah',
        tradition: 'muslim',
        title: 'Al-Fatihah (adapted opening)',
        text: `In the name of God, the most compassionate, the most merciful.
Praise be to God, cherisher of all worlds.
Guide me on the straight path.
The path of those who receive Your grace.
Grant me mercy and peace.`,
    },
    {
        id: 'hindu-buddhist-metta',
        tradition: 'hindu-buddhist',
        title: 'Metta (loving-kindness)',
        text: `May I be safe. May I be well.
May I be peaceful and at ease.
May those I love be safe and well.
May all beings be safe and well.
May all beings be free from suffering.`,
    },
];
