# BE333 — App To-Do

Living punch list of what's left, keyed to the Master Manual. Update as
items ship or new ones surface.

## Audio assets (swap in real files — needs Raychel)
- [ ] **Bells** — replace placeholder Google `.ogg` URLs in `services/BellService.ts`
  with proper meditation bells (start / midpoint / end). Manual spec:
  *distinct but soft, -12 dBFS peaks*.
- [ ] **Award chime** — under 400ms, gentle. Wire into `PetalAwardModal`
  when it opens.
- [ ] **Background nature loops** — stream, birdsong, room tone. Seamless
  over 3 min. Play behind the timer when `showNatureVisuals` is on.
  *Batch 1 landed: `assets/audio/ambient/water-birds.wav` (22 s, CC0,
  Freesound 192648). Still need: (a) at least one more variety —
  stream / rain / room tone; (b) verify the water file loops
  seamlessly, or crossfade the seams before shipping.*
- [ ] **Onboarding welcome background** — plays behind the first
  Welcome screen on new-user launch. Batch 1 landed:
  `assets/audio/intro/chime-welcome.wav` (56 s, CC0, Freesound 566579).
  *Still to wire: add a `useEffect` on the welcome screen that
  starts the file at mount and stops on navigate.*

### Removed from scope
- ~~**Chanting stack** — audio tracks for OM / So Hum / humming /
  silent mantra.~~ Replaced by on-screen scrolling text (see next
  bullet); no audio to source.
- ~~**Mantra stack** — 20 mantras, audio narration for 6 of them.~~
  Text-only; users can chant aloud themselves from the on-screen text.
- ~~**Core session audio** — 6 voice-over scripts.~~ Cut. Sessions
  stay text-driven + optional ambient nature loop behind the timer.

### Chanting — on-screen text (new)
- [ ] **Show the chant words on screen** for each track (OM, So Hum,
  humming, silent). Render the lines line-by-line with a subtle
  highlight moving down the stack in rhythm; user chants aloud
  themselves. Same for the 20 mantras — meaning + phrase on the
  screen with a gentle pace indicator. No audio playback needed.

## Audio sourcing + credits (before shipping any real files)
- [ ] For every real audio file that lands, add a row to
  `docs/AUDIO_CREDITS.md` (file · category · duration · source URL ·
  license · download date · code path that uses it). Even for CC0 —
  provenance stays with the app.
- [ ] Prefer sources in this order: Freesound (filter CC0) → Pixabay
  Audio → YouTube Audio Library (attribution-not-required) → Wikimedia
  Commons / Internet Archive for public-domain religious content.
- [ ] Never bundle CC-BY-SA (ShareAlike infects the app),
  CC-NC (disqualifies the Pro / Lifetime tier), or "free with signup"
  audio without confirming the terms allow paid-app use.
- [ ] The moment the first CC-BY track goes in, add a Settings →
  About → **Sound credits** screen that renders the credits table
  from `docs/AUDIO_CREDITS.md` (or a JSON mirror of it) so attribution
  travels with the app.
- [ ] Match filename convention (`{category}-{short-name}.{ext}`) and
  the -12 dBFS peak spec called out in `docs/AUDIO_CREDITS.md`.

## Illustrations (needs Raychel)

_Log every new illustration in `docs/ILLUSTRATION_CREDITS.md` when it
lands (file · category · source · license · date · code path)._

### Habit-stack category icons (priority: highest)
Nine gold line-art icons, one per habit stack, matching the
`golden_lotus.png` line-weight / gold-fill style. Ships in
`components/HabitStackContent.tsx` and the habit-stack picker on the
Dashboard. Filename convention: `stack-{name}.svg`.

- [ ] `stack-chanting.svg` — sound wave / mouth silhouette / OM glyph
- [ ] `stack-prayer.svg` — folded hands or open hands
- [ ] `stack-journaling.svg` — open book with a soft pen line
- [ ] `stack-poetry.svg` — quill / feather / stanza mark
- [ ] `stack-dayplanning.svg` — small sun with a horizon line
- [ ] `stack-gratitude.svg` — heart with a leaf accent
- [ ] `stack-mantra.svg` — mala bead loop
- [ ] `stack-stretching.svg` — abstract figure mid-stretch
- [ ] `stack-yoga.svg` — lotus-seated figure silhouette

### Pose illustrations (priority: later wave)
- [ ] Pose illustrations for **Stretching** (3 sequences × 6 moves = 18 poses).
- [ ] Pose illustrations for **Yoga** (Sun Salutation A + 3 vinyasas ≈ 12 poses).

### Milestone / Petal badges (priority: optional)
- [ ] 7 gold badges for Days **1, 3, 7, 11, 14, 19, 21** — wire into
  `PetalAwardModal`. Small (~64 px). Filename: `badge-day{n}.svg`.

### Chakra glyphs (priority: optional)
- [ ] 7 traditional chakra symbols for Bloom Map days 15-21 (Root, Sacral,
  Solar, Heart, Throat, Third Eye, Crown). Public-domain source art on
  Wikimedia Commons — trace and restyle in brand gold. Filename:
  `chakra-{name}.svg`.

### App-icon SVG exports (priority: nice-to-have)
- [ ] SVG exports of `assets/images/golden_lotus.png` and
  `assets/images/brand_logo_text.png` so future exports at any size stay
  crisp. Drop into `assets/images/` next to the PNGs.

## Meditation reminders (real push story)

The web build now has a `.ics` calendar-file fallback (see
`lib/icsReminders.ts` + `components/CalendarReminderButton.tsx`,
surfaced in Settings → Reminders and auto-triggered at the end of
onboarding on web). That gets a user a working reminder path today via
their own calendar app, but it isn't the whole story:

- [ ] **Real web push via Firebase Cloud Messaging + a service worker.**
  Needs a `firebase-messaging-sw.js` service worker in `public/`
  (Firebase Hosting will serve it at the root scope), VAPID key
  provisioning in the Firebase Console → Project Settings → Cloud
  Messaging, and a client-side registration flow that swaps the
  current `registerForPushNotificationsAsync` web bail-out for an
  FCM Web token request. Send the three daily notifications from a
  Cloud Function scheduled trigger (or FCM's own schedule). Only
  worth building once native isn't the priority — coverage on iOS
  Safari is 16.4+ and requires the user to install the PWA to the
  home screen for it to work reliably.
- [ ] **Email reminders as an alternate path.** Cheapest reliable
  cross-platform reminder. Firebase Cloud Function on a cron trigger
  reads users whose reminder times fall in the current 5-minute
  window and sends via SendGrid / Postmark / Resend. Needs a
  transactional-email vendor account, a template per period, and an
  unsubscribe / manage-preferences flow.
- [ ] **Native mobile reminders (iOS/Android) via expo-notifications.**
  Already wired in `services/NotificationService.ts`; kicks in
  automatically when native builds ship. Nothing to do beyond
  shipping the native apps.

## Wave 1 — Bloom, milestones, bells (all shipped)
- [x] Fix Bloom Day pauses to 3 for everyone (manual override of Pro perk).
- [x] 60-line self-compassion prompt library, shown on completion.
- [x] Milestone-specific messages in PetalAwardModal (Day 1, 3, 7, 11, 14, 19, 21).
- [x] Chakra strip on Lotus Bloom Map (days 15-21, Root → Crown).
- [x] Session bells wired at 0:00, midpoint, end (placeholder audio).
- [x] ~~Reset & Rest Ritual~~ — removed by design decision; concept
  dropped from app and Manual.

## Wave 2 — Habit-stack content depth (shipped; audio + illustrations remain above)
- [x] **Chanting** — 4 tracks (OM, So Hum, humming, silent). Text scripts
  shipped; **audio recordings still TODO** (see Audio Assets).
- [x] **Prayer** — 6 texts: secular, interfaith, Christian, Jewish, Muslim,
  Hindu/Buddhist. Global "hide prayers" toggle in Settings.
- [x] **Journaling** — 40 prompts across the 5 buckets. Autosave to
  `users/{uid}/reflections`. 500-char soft cap.
- [x] **Poetry** — 30 prompts. Autosave shipped. Line counter alongside
  char counter (Poetry-only).
- [x] **Day planning** — 6 mini-templates, autosave-composed entry.
  One-tap carryover from yesterday's plan (matching labels prefill,
  extras appear as "Notes from yesterday").
- [x] **Gratitude** — 30 rotating micro-prompts. Autosave shipped.
  Optional photo attach via ImagePicker + Firebase Storage;
  photo appears on the entry card in My Work.
- [x] **Mantra practices** — 20 mantras with meanings; 6 flagged
  `hasAudio: true` awaiting audio files.
- [x] **Stretching** — 3 sequences × 6 moves × 30 sec each, with per-pose
  cues; highlights current pose as the timer advances.
- [x] **Yoga** — Sun Salutation A + 3 vinyasas with pose-by-pose cues.

### Wave 2 follow-up
- [x] **My Work viewer** — renamed from "My Reflections". Users pick a
  category per entry (Insight Diary · Insightful Notes · Inspiring
  Messages · Self-Advice); the `/my-work` screen filters by category and
  offers a plain-text share/export. Dashboard has "Open My Work" nav.

## Wave 3 — Social, therapist, advanced (shipped)
- [x] **BE Buddy Challenge scoring** — `myMissedSessions` increments
  during the day-rollover check in `useBePractice.checkDailyLogic`.
  At 3 misses the Round is marked lost and the buddy's Round is
  marked won.
  - [x] Rematch offer flow — BuddyBoard now shows a "Start a new Round"
    button + "End pairing" option once a Round resolves. Both sides
    reset atomically via `useBeBuddy.rematchBuddy` / `endBuddy`.
- [x] **BE Guide View (level-up)** — full therapist product shipped:
  extended signup (license / registration #, HIPAA acknowledgment); Pro
  paywall gate on `/guide`; client capacity display + enforcement
  (free 0, Pro 25, Lifetime 100); private per-client notes with
  autosave; guide-generated invite codes with share and revoke;
  client-side invite-code redemption in Settings; Privacy & Data
  explainer in Settings; `GuideSection` dashboard card rewired to
  real data. Manual Part 3 rewritten to match.
  - [x] Guide-side notes list view — `/guide/notes` lists every note
    across the roster, most recent first, tap to jump to client.
  - [ ] **Sync `purchaseTier` with RevenueCat** so capacity tier is
    read from live subscription status. Currently defaults to `'pro'`
    when the field is missing, so live guides can accept clients while
    the sync is pending.
  - [x] Referral flow that works pre-signup — invite code from a
    `/signup?invite=CODE` deep link is stashed via `stashPendingInvite`
    and auto-consumed by `usePendingInviteConsumer` on first Home
    mount after signup.
- [x] **EMA check-in** — three-tap stress / mood / focus + one-word
  capture on session completion; writes to `users/{uid}/emaEntries`.
- [x] **Implementation-intention notifications (text-level)** — anchored
  bodies are now written as Gollwitzer if-then statements ("After I
  make coffee, I will BE"). Comment in `content/notifications.ts`
  documents the pattern. Event-driven firing (fire when the anchor
  actually happens, not at fixed clock time) still needs a native
  module and is out of scope for the current stack.
- [x] **Progression stages 333 / 666 / 999** — `practiceStage` +
  `completedStages` on `bePractice`; dashboard shows current stage;
  Practice-complete card offers "Advance" (333 → 666 → 999) or
  "Repeat". Timer duration now auto-follows the stage for non-Pro
  users; Pro users keep the manual override.
  - [x] Onboarding review screen previews the 333 → 666 → 999
    ladder card so users see the arc.
- [x] **Day 1 launch coupon** — Settings → "Redeem a code" input +
  `useCoupon.redeem` validates against `coupons/{CODE}` docs and
  sets `couponEntitlement` on the user. PurchaseContext picks the
  higher of RevenueCat tier vs coupon tier, so a coupon-granted
  seat unlocks Pro/Therapist features immediately. Create coupon
  docs in Firestore with `{ type: 'user'|'therapist', active: true }`.
- [x] **Session history + trends** — `/history` reverse-chron feed
  (BE Pauses + habit-stack merged, filterable, plain-text export via
  Share); per-session detail `/history/[id]` with in-session HR/HRV
  chart redrawn from stored samples; Dashboard `TrendCards` with
  sparklines for average HR per session, average HRV per session, and
  EMA mood over time. Sessions now write to `users/{uid}/sessions/`
  (scoped) with `hrSamples` + `hrvSamples` arrays for time-series
  playback.
  - [x] Weekly / monthly rollup summary cards on Dashboard
    (`RollupCards` — BE Pause count, habit stacks, total minutes,
    avg ΔHR for This Week and This Month).
  - [x] Migrate old root-level `sessions/` writes into
    `users/{uid}/sessions/` — best-effort one-time client-side
    migration in `useLegacySessionsMigration`, called from Dashboard.
    Skips gracefully if Firestore rules deny root reads.
- [x] **Letter to Yourself** — onboarding writing prompt shipped
  (`app/onboarding/letter.tsx`). Stored on the user doc
  (`letterToSelf`), surfaced at the top of the first BE Pause after a
  Missed Day via `LetterCard`. Warm default in the BE333 voice appears
  if the user skipped. Editable from Settings → Letter to Yourself.
  Explicitly listed as "never visible to your Guide" in Privacy & Data.
- [x] **6-1-4 activating breath pattern** — third choice in Settings
  alongside 4-1-6 and 3-1-5. UI shows the note "Energizing, not
  calming. Skip during panic or acute anxiety." Timer engine leads
  with Inhale for activating patterns.

## Wave 4 — How-to guides & drop-ins (shipped)
- [x] **9 how-to cards** — sit/posture, thoughts, sensations, worries,
  diaphragmatic breathing, mantras, chanting, mind-body, why 333.
  Content in `content/learn/howto.ts`. Rendered under `/learn` (How-to
  tab). Optional micro-audio hook-in remains (by `id`).
- [x] **60-second SOS scripts** — physiologic sigh, email/meeting reset,
  walking mindfulness, lying-down wind-down. In `content/learn/sos.ts`.
  `/learn` (SOS tab) with step-by-step cues + hold-times.
- [x] **Trauma-sensitive variant** — ground + orient script (Manual
  Part 5). In `content/learn/trauma.ts`. `/learn` (Grounding tab)
  with explicit reminder about professional care.

## Post-launch polish
- [ ] Pro custom app colors (theme editor UI).
- [ ] Pro custom habit-stacking (add/edit activities beyond the built-in 10).
- [ ] Rebrand Firestore field names to Manual-canonical terms if useful
  (e.g. `bloomDays` → OK, but `currentPauses` might read as `pausesToday`).
- [x] Voice-consistent notification copy — `content/notifications.ts`
  drives both onboarding flows (`app/onboarding/{setup,review}.tsx`)
  and the 30-minute snooze. Rise/Rest/Relax titles + anchored bodies.
- [x] Cleanup: `firebase-debug.log` untracked and in `.gitignore`;
  corrupted `"ervice, bump…"` file removed; `.firebase/` cache
  untracked.

## Surfaced during launch legal-docs review

Bugs found while grounding the legal drafts against the real code — the
drafts had to be softened to describe current behavior accurately, and
these two need engineering fixes before we can tighten the language.

- [ ] **Enforce `shareWithGuide=false` on the server side.** Right now
  `useLinkedClients` and `useLinkedClient` in `hooks/useBeGuide.ts`
  always copy `bePractice` into the guide's `LinkedClientSummary`
  regardless of the toggle; the guide sees a *"Sharing paused"*
  warning but the underlying practice data still flows. The privacy
  policy currently has to disclose this; when it's fixed we can also
  tighten the wording. Option A: gate the read in the hook so
  `bePractice` returns `undefined` when the toggled-off client's doc
  is snapshotted. Option B (cleaner): add a Firestore security rule
  that redacts / denies read of the `bePractice` field for a
  linked-guide query when the client has `shareWithGuide=false`.
- [ ] **Surface crisis-line numbers in the in-app "Grounding" tab.**
  `content/learn/trauma.ts` currently ends with a "work with a
  trauma-informed clinician" reminder; the numbers (988, 116 123,
  112, findahelpline.com, etc.) are only listed in
  `legal/DISCLAIMERS.md`, not where a user in acute distress would see
  them. Add a `resources` array to the trauma script and render it as
  a footer in `app/learn.tsx`. Match the crisis-number list in
  `legal/DISCLAIMERS.md` so the two never drift.

## Housekeeping still open
- [ ] `dist/` output is currently tracked (many-file diffs on every
  build). Decide: untrack + rely on Firebase Hosting deploy from
  local build, or keep tracked as a snapshot mirror.
- [ ] Decide fate of the `claude/website-clarity-access-64e9ar`
  branch (Microsoft Clarity analytics — merge or delete).
- [ ] **Swap Firebase web API key to the standard "Browser key (auto
  created by Firebase)"** in the `be333ag` project. Current build uses
  the custom "BE" key (`AIzaSy…dIg`), which needed its Google Cloud
  API-key restrictions loosened to unblock signup. The auto-created
  Browser key is pre-scoped correctly by Firebase and is the intended
  client key. Get its value from Firebase Console → Project settings
  → General → Your apps → Web app → SDK setup and configuration,
  put it in `.env` under `EXPO_PUBLIC_FIREBASE_API_KEY`, then
  `npm run build && npm run deploy`. Optional cleanup — not urgent.
- [ ] **Initialize App Check in the client with reCAPTCHA v3** so real
  users get valid tokens and bots/scripts are rejected. This is the
  proper fix for the `auth/firebase-app-check-token-is-invalid` errors
  we hit at launch; we currently ship with App Check enforcement OFF
  for Authentication in `be333ag` as a workaround. To do it right:
  create a reCAPTCHA v3 site key in the reCAPTCHA admin console (or
  auto-provision one from Firebase Console → App Check → Register app),
  call `initializeAppCheck(app, { provider: new ReCaptchaV3Provider(SITE_KEY), isTokenAutoRefreshEnabled: true })` in `lib/firebase.ts` right after
  `initializeApp`, redeploy, then re-enforce App Check for Authentication
  (and Firestore) in Firebase Console. Optional but recommended before
  scaling — turning enforcement back on without this will break signup
  again.
- [ ] **Add `be333.app` (and `www.be333.app`) to Firebase Auth →
  Settings → Authorized domains** so Google Sign-In works on the custom
  domain. Symptom when missing: `auth/unauthorized-domain` on the "Sign
  in with Google" button on the login screen, with the console info
  message telling you which domain to add. Config-only change in the
  Firebase Console (project `be333ag`); no rebuild needed.
- [ ] **Consent gate for Google Analytics + Microsoft Clarity.** Both
  trackers in `app/+html.tsx` (gtag `G-2RSMKC21N0` and Clarity
  `xwdgl8puwu`) fire on every page load with no consent banner. Fine
  for a US-only audience; required for EU/UK users under GDPR/UK-DPA
  (Clarity's session recordings are especially load-bearing here). If
  BE333 will serve those regions, add a lightweight consent banner
  (Google Consent Mode v2 + a `clarity('consent')` call, or a
  simple "Accept / Decline" that gates injecting the two `<script>`
  tags in the first place). At minimum, disclose both trackers in the
  Privacy & Data screen.

## Git & repo housekeeping
Two-person team workflow follow-ups. Numbering below matches the order
they were discussed; items marked [x] are already done.

- [x] Auto-delete branches after merge (Settings → General → Pull Requests).
- [x] Squash-only merges (Settings → General → Pull Requests → allow squash only).
- [ ] **Enable Secret scanning + Push protection** in Settings → Code
  security. Blocks pushes that contain an API key, token, or credential.
  Especially valuable given how much Firebase / reCAPTCHA / Cloudflare
  key material has been near this repo.
- [ ] **Enable Dependabot alerts + security updates** in Settings → Code
  security. GitHub watches `package.json` / `package-lock.json` for
  vulnerable dependencies and auto-opens PRs to fix them.
- [ ] **Require 2FA on both accounts.** Each person: avatar → Settings
  → Password and authentication → Two-factor authentication → set up
  with an authenticator app.
- [ ] **Add `.github/CODEOWNERS`** so PRs auto-request review from the
  right person. Simplest starter is `*  @Raydar14` — every PR routes to
  the owner. Add coworker's `@` for paths they own once they've onboarded.
- [ ] **Configure local git identity on each machine.** One-time per
  computer: `git config --global user.name "Your Name"` and
  `git config --global user.email "you@example.com"` (email must match
  the one on the GitHub account so commits attribute correctly).
- [ ] **Require conversation resolution before merging** in the `Protect
  main` ruleset. Prevents merging while review comments are unresolved.
- [ ] **Enable Issues + add issue templates** (Settings → General →
  Features → Issues on; then create `.github/ISSUE_TEMPLATE/bug.md` and
  `feature.md`). Beats tracking bugs in scattered notes.
- [ ] **Add a minimal CI GitHub Action** — `.github/workflows/build.yml`
  running `npm ci && npm run build` on every PR — so build failures are
  caught before merging to `main`. Defer until the PR flow is habit.

## Notes
Every task ends in a link to be tested end-to-end in the browser preview
before shipping. Master Manual is the source of truth for terminology,
tone, and pricing — cross-check when in doubt.
