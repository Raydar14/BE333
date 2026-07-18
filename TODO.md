# BE333 — App To-Do

Living punch list of what's left, keyed to the Master Manual. Update as
items ship or new ones surface.

## Audio assets (swap in real files)
- [ ] **Bells** — replace placeholder Google `.ogg` URLs in `services/BellService.ts`
  with proper meditation bells (start / midpoint / end). Manual spec:
  *distinct but soft, -12 dBFS peaks*.
- [ ] **Award chime** — under 400ms, gentle. Wire into `PetalAwardModal`
  when it opens.
- [ ] **Background nature loops** — stream, birdsong, room tone. Seamless
  over 3 min. Play behind the timer when `showNatureVisuals` is on.
- [ ] **Chanting stack** — OM, So Hum, humming, silent mantra
  (4 tracks × ~3 min).
- [ ] **Mantra stack** — 20 mantras, audio narration for 6 of them.
- [ ] **Core session audio** — 6 scripts (morning, midday, evening,
  anywhere, tough day, calm focus). Voice: warm, neutral accent, no reverb.

## Wave 1 (in flight)
- [x] Fix Bloom Day pauses to 3 for everyone (manual override of Pro perk).
- [x] 60-line self-compassion prompt library, shown on completion.
- [x] Milestone-specific messages in PetalAwardModal (Day 1, 3, 7, 11, 14, 19, 21).
- [x] Chakra strip on Lotus Bloom Map (days 15-21, Root → Crown).
- [x] Session bells wired at 0:00, midpoint, end (placeholder audio).
- [ ] **Reset & Rest Ritual** — 3-day pause after 3rd streak break; UI +
  state machine + 1-min breath + kind message on restart.

## Wave 2 — Habit-stack content depth
Each activity should surface real content, not just a button.

- [ ] **Chanting** — 4 tracks (OM, So Hum, humming, silent). Structure:
  20s intro / ~2min chant with subtle bells every 30s / 40s close.
- [ ] **Prayer** — 6 texts: secular, interfaith, Christian, Jewish, Muslim,
  Hindu/Buddhist. Global "hide prayers" toggle.
- [ ] **Journaling** — 40 prompts across awareness / emotion / choice /
  values / reframing buckets. Autosave. 500-char soft cap.
- [ ] **Poetry** — 30 prompts, line counter, export to "My Reflections."
- [ ] **Day planning** — 6 mini-templates, one-tap carryover to tomorrow.
- [ ] **Gratitude** — 30 rotating micro-prompts, 1-3 entries, optional photo.
- [ ] **Mantra practices** — 20 mantras with meanings.
- [ ] **Stretching** — 3 illustrated sequences (desk / neck-shoulders /
  back-hips), 6 moves × 30s each.
- [ ] **Yoga** — Sun Salutation A + 3 vinyasas (Clear the Mind, Nervous
  System Reset, Root & Rise). Illustrated poses.

## Wave 3 — Social, therapist, advanced
- [ ] **BE Buddy Challenge scoring** — increment `myMissedSessions`
  when a day ends with < 3 pauses; at 3 misses mark that person's Round
  as lost but Practice continues; offer rematch after Practice ends.
- [ ] **BE Guide View / Sneak Peek** — therapist-facing dashboard of
  linked client's Lotus Bloom Map + recent Practice summary. On-demand
  "Send Sneak Peek Now" from client. Guide-initiated request → client
  approves.
- [ ] **EMA check-in** — one-tap post-session capture: stress /
  mood / focus + one word.
- [ ] **Implementation-intention notifications** — dynamic reminders
  keyed to a user's chosen anchor ("After I make coffee, I will…").
- [ ] **Progression stages** — 666 (6 min × 3) unlock after first
  Practice, 999 (9 min × 3) after 666. Show as tiers on onboarding
  review screen.
- [ ] **Day 1 launch coupon** — code redemption flow granting free
  User Pro annual or Therapist monthly.

## Wave 4 — How-to guides & drop-ins
- [ ] **9 how-to cards** — sit/posture, thoughts, sensations, worries,
  diaphragmatic breathing, mantras, chanting, mind-body, why 333. Text
  + optional micro-audio.
- [ ] **60-second SOS scripts** — physiologic sigh, email/meeting reset,
  walking mindfulness, lying-down wind-down.
- [ ] **Trauma-sensitive variant** — ground + orient script (see manual
  Part 5).

## Post-launch polish
- [ ] Pro custom app colors (theme editor UI).
- [ ] Pro custom habit-stacking (add/edit activities beyond the built-in 10).
- [ ] Rebrand Firestore field names to Manual-canonical terms if useful
  (e.g. `bloomDays` → OK, but `currentPauses` might read as `pausesToday`).
- [ ] Voice-consistent notification copy replaces generic scheduler
  content (Morning: *"Begin soft. Exhale first…"*, etc.).
- [ ] Cleanup: remove `firebase-debug.log` from tracking and add to
  `.gitignore`; delete the corrupted `"ervice, bump…"` file.

## Notes
Every task ends in a link to be tested end-to-end in the browser preview
before shipping. Master Manual is the source of truth for terminology,
tone, and pricing — cross-check when in doubt.
