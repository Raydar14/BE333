# BE333 — Illustration Credits

Every illustration or non-logo brand image shipped with the app (habit-stack
category icons, pose illustrations, chakra glyphs, milestone badges, ambient
backgrounds) is listed here with its source, license, and where it's used.
The rules mirror `docs/AUDIO_CREDITS.md`.

## Sourcing rules

Original work by **Raychel Powers** (or another BE333 contributor) is the
default source. Third-party art is allowed only under one of these licenses:

- **Original / commissioned** — internally made. Attribute to the artist.
- **CC0 / Public Domain** — no attribution required.
- **CC-BY** — allowed. Requires visible in-app credit on the
  "Illustration credits" screen (Settings → About → Illustration credits).
- **unDraw** (MIT) — free for commercial use, no attribution required.
- **Purchased royalty-free** (Envato, iStock, Adobe Stock, Storyset paid) —
  keep the receipt and license PDF alongside the file.

**Never use:**

- **CC-BY-SA** — infects the app with ShareAlike.
- **CC-NC** — disqualifies use inside the Pro / Lifetime tier.
- **"Free for personal use"** — usually blocks paid-app use.
- AI-generated art without a clear provenance/license from the tool used
  (some models' outputs carry legal ambiguity for commercial use).

## Preferred sources (in order)

1. **Original — commissioned from Raychel Powers** (primary).
2. **[unDraw](https://undraw.co)** — MIT-licensed vector illustrations,
   free for commercial use, recolorable to the brand gold.
3. **[Storyset by Freepik](https://storyset.com)** — free with attribution,
   paid tier to skip attribution.
4. **[Wikimedia Commons](https://commons.wikimedia.org)** — public-domain
   religious / cultural imagery (chakra symbols, mudras, historical prints).
5. **Paid royalty-free stock** (Envato Elements, Adobe Stock) — last resort.

## File conventions

- Format: **SVG** for line-art icons + simple vector illustrations; **PNG**
  (transparent, 3× density: 1024, 2048, 3072 px) for photorealistic or
  gradient-heavy pieces.
- Filename: `{category}-{short-name}.{ext}` — e.g.
  `stack-chanting.svg`, `pose-warrior1.png`, `badge-day7.svg`.
- Storage:
  - **Small vectors (< 50 KB)** — bundle in `assets/icons/` (create the
    folder when the first one lands).
  - **Full illustrations (> 50 KB)** — bundle in `assets/images/`.
- Style baseline: gold-line-art on transparent background at 1.5-2 pt stroke
  weight, matching the existing `golden_lotus.png`. Fill color: brand
  accent gold. Line weight consistent across the set.

## Credits table

| File | Category | Source | License | Added | Used in |
|---|---|---|---|---|---|
| _(none yet — replace this row when the first real illustration lands)_ | | | | | |

<!--
Example row shape:

| stack-chanting.svg | Habit-stack icon | Raychel Powers (commissioned) | Original | 2026-08-24 | components/HabitStackContent.tsx (Chanting card) |
| pose-warrior1.svg | Yoga pose | unDraw | MIT | 2026-09-02 | app/habit-stack/timer.tsx (yoga sequence) |

`Used in` = code path(s) that reference the file, so a swap can find every
caller. `License` = one of: Original · CC0 · CC-BY · MIT · Purchased · PD.
CC-BY requires an in-app credit on the Illustration credits screen.
-->

## When you add an illustration

1. Add a row above with all six columns filled.
2. If the license is CC-BY or Purchased, add the credit line to the in-app
   "Illustration credits" screen (Settings → About → Illustration credits).
3. Check off the corresponding item in `TODO.md` → **Illustrations**.
4. If purchased, download the license PDF and stash it next to the file
   so the terms at the time of purchase are preserved.
