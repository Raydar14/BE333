// Day planning templates — 6 mini-templates per Master Manual.
// Structure: title + fields the user fills in during 3 minutes.

import { DayPlanTemplate } from './types';

export const DAY_PLAN_TEMPLATES: DayPlanTemplate[] = [
    {
        id: 'three-focuses',
        title: "Today's Three",
        subtitle: 'Focus · Kindness · One small win',
        fields: [
            { label: 'Focus', placeholder: 'What matters most today?' },
            { label: 'Kindness', placeholder: 'One kind act, for me or another' },
            { label: 'One small win', placeholder: 'A tiny goal I can finish' },
        ],
    },
    {
        id: 'top-then-tender',
        title: 'Top · Then · Tender',
        subtitle: 'The one hard thing, then everything else, then a kindness',
        fields: [
            { label: 'Top task', placeholder: 'The one I keep dodging' },
            { label: 'Then', placeholder: 'What comes after' },
            { label: 'Tender', placeholder: 'How I refill afterward' },
        ],
    },
    {
        id: 'must-may-later',
        title: 'Must · May · Later',
        subtitle: 'Sort the day into three honest piles',
        fields: [
            { label: 'Must do today', placeholder: 'Truly non-negotiable' },
            { label: 'May do today', placeholder: 'Would be nice' },
            { label: 'Later this week', placeholder: 'Not today' },
        ],
    },
    {
        id: 'anchor-and-arc',
        title: 'Anchor · Arc',
        subtitle: 'The habit that grounds me and the shape of the day',
        fields: [
            { label: 'Anchor', placeholder: 'The habit that steadies me' },
            { label: 'Morning arc', placeholder: 'How I want to begin' },
            { label: 'Evening arc', placeholder: 'How I want to close' },
        ],
    },
    {
        id: 'energy-map',
        title: 'Energy Map',
        subtitle: 'Match hard work to high energy, rest to low',
        fields: [
            { label: 'When I am sharpest', placeholder: 'e.g., 9–11am — deep work' },
            { label: 'When I dip', placeholder: 'e.g., 2–3pm — walk or reset' },
            { label: 'When I recover', placeholder: 'e.g., 6pm — closing ritual' },
        ],
    },
    {
        id: 'one-line-plan',
        title: 'One-Line Plan',
        subtitle: 'The whole day in a single sentence',
        fields: [
            { label: 'Today, I…', placeholder: 'One sentence. Complete it.' },
        ],
    },
];
