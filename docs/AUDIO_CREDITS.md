# BE333 — Audio Credits

Every audio file bundled with the app or served from Firebase Storage is
listed here, with its source, license, download date, and where it plays.
Even for CC0 / public-domain files: keep the row. Future-you (or an
auditor, or an App Store reviewer) will want the provenance.

## Sourcing rules

Before adding a new sound to this table, confirm its license is one of:

- **CC0 / Public Domain** — preferred. No attribution required. No
  long-term liability.
- **CC-BY** — allowed. Requires visible in-app credit on the "Sound
  credits" screen (Settings → About → Sound credits). Add the row here
  first; the screen renders from this file's data.
- **Pixabay Content License** — allowed. Free for commercial use, no
  attribution required.
- **YouTube Audio Library — "attribution not required"** — allowed.

**Never use:**

- **CC-BY-SA** — the ShareAlike clause forces us to license the whole app
  the same way.
- **CC-NC** — non-commercial. Disqualifies use inside a paid tier (Pro /
  Lifetime).
- **"Free for personal use" / "free with signup"** — read the fine print.
  Most block use inside a paid app or require a paid commercial tier.
- Anything ripped from Spotify / YouTube / a commercial release — even
  modern kirtan or mantra recordings are copyrighted.

## Preferred sources (in order)

1. **[Freesound.org](https://freesound.org)** — filter to license =
   *Creative Commons 0*. Best for chimes, singing bowls, bells, breath
   cues, page turns, subtle woosh SFX.
2. **[Pixabay Audio](https://pixabay.com/music/)** — Pixabay Content
   License. Best for ambient meditation beds, soft piano, drone pads,
   nature loops.
3. **YouTube Audio Library** (`studio.youtube.com` → Audio Library) —
   filter to "Attribution not required." Solid ambient / cinematic beds.
4. **[Free Music Archive](https://freemusicarchive.org)** — read each
   track's license, avoid SA.
5. **[Wikimedia Commons](https://commons.wikimedia.org)** +
   **[Internet Archive](https://archive.org)** — for public-domain
   religious / devotional recordings (Gregorian chant, temple bells).

## File conventions

- Format: **MP3 128 kbps** for anything over 10 seconds; **WAV** or **OGG**
  for short SFX under a second.
- Peaks at **-12 dBFS** or quieter (matches the Manual's bell spec).
- Filename: `{category}-{short-name}.{ext}` — e.g.
  `bell-start-soft.ogg`, `ambient-forest-loop.mp3`.
- Storage:
  - **Small SFX (< 200 KB)** — bundle in `assets/audio/`.
  - **Longer beds (> 200 KB)** — upload to Firebase Storage under
    `audio/{category}/{filename}`, reference by URL.

## Credits table

| File | Category | Duration | Source | License | Downloaded | Used in |
|---|---|---|---|---|---|---|
| `assets/audio/intro/chime-welcome.wav` | Onboarding welcome | 0:56 | [freesound.org/s/566579](https://freesound.org/s/566579/) by **bainmack** ("chime song mellow chill short2") | CC0 | 2026-08-25 | _(pending wire-in — target: onboarding welcome screen background)_ |
| `assets/audio/ambient/water-birds.wav` | Ambient nature loop | 0:22 | [freesound.org/s/192648](https://freesound.org/s/192648/) by **pibborn** ("field recording edited water and birds") | CC0 | 2026-08-25 | _(pending wire-in — target: BE Pause background when `showNatureVisuals` is on)_ |

<!--
Add rows in this shape:

| bell-start-soft.ogg | SFX / bell | 0:02 | https://freesound.org/s/12345/ | CC0 | 2026-08-23 | services/BellService.ts (start) |

`Used in` = code path(s) that reference the file, so a swap can find every
caller. `License` = one of: CC0 · CC-BY · Pixabay · YT-Audio · PD. If it's
CC-BY, also add the author name to the "Sound credits" screen data.
-->

## When you add a file

1. Add a row above with all seven columns filled.
2. If the license is CC-BY, add author + link to the in-app
   "Sound credits" screen (Settings → About → Sound credits).
3. Check the corresponding item off in `TODO.md` → **Audio assets**.
4. If the source page has terms that could change (Freesound, Pixabay
   pages get edited), download and stash the license PDF next to the
   file so the terms at the time you took it are preserved.
