// BE333 brand palette — kept in sync with docs/MASTER_MANUAL.md §2.
// Colors are named after their brand role (not the shade) so the palette
// can evolve without touching every consumer.

export const Colors = {
    // Primary / greens
    primary: '#1A4331',        // Deep Lotus Green — main brand green, primary background
    primaryLight: '#2C6E52',   // Lotus Green (mid) — cards, surfaces, secondary green
    plantGreen: '#4A9977',     // Plant Green — breathing ring, session-phase indicators

    // Accent / golds
    secondary: '#E1B725',      // Bloom Gold — highlights, icons, milestone accents
    secondaryLight: '#F5D765', // Soft Gold — glows, hover states
    heroGold: '#FFD700',       // Hero Gold — reserved for the logo mark and top-tier celebratory moments

    // Optional deep accent (chakra / energy moments — not yet used in UI)
    royalPurple: '#4B006E',

    // Surfaces
    background: '#1A4331',     // Dark green background
    surface: '#2C6E52',        // Lighter green for cards/inputs

    // Text
    text: '#FFFFFF',           // White text on dark background
    textSecondary: '#E1B725',  // Gold for secondary text
    textLight: '#FFFFFF',      // For text on primary background

    // System
    border: '#E1E1E1',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
};
