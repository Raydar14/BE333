# BE333 — Master Manual

*Pause. Breathe. Be.*
**3 minutes · 3 times a day · 3 weeks**

A psychologist-created mindfulness app · Brand · Product · Science · Content · Marketing

---

> **How this document works**
>
> This is the canonical source of truth for BE333's brand voice, feature
> descriptions, terminology, and pricing — tracked in git alongside the
> code so every shipping change updates the Manual in the same PR.
>
> The Google Doc at `G:\My Drive\Brandz\BE333\BE333_Master_Manual (1).gdoc`
> is a mirror you sync from this file, not the other way around.
>
> Last synced from the app: 2026-07-20 (post "Rename Reflections → My
> Work" and "Remove Reset & Rest Ritual").

---

## Contents

- [How to Use This Manual](#how-to-use-this-manual)
- [Part 1 · Brand Foundation](#part-1--brand-foundation)
- [Part 2 · Visual Identity](#part-2--visual-identity)
- [Part 3 · The Product](#part-3--the-product)
- [Part 4 · The Science](#part-4--the-science)
- [Part 5 · Content Library — Scripts & Guides](#part-5--content-library--scripts--guides)
- [Part 6 · 3-Minute Yoga Vinyasa Manual](#part-6--3-minute-yoga-vinyasa-manual)
- [Part 7 · Mantra & Affirmation Bank](#part-7--mantra--affirmation-bank)
- [Part 8 · Marketing & Growth](#part-8--marketing--growth)
- [Part 9 · Production & Technical Reference](#part-9--production--technical-reference)
- [Glossary of Core Terms](#glossary-of-core-terms)

---

## How to Use This Manual

This is the single, consolidated reference for BE333. It gathers everything scattered across earlier drafts — brand strategy, product and feature specs, the research foundation, the full content library of scripts and prompts, the yoga sequences, the mantra bank, and all marketing and app-store material — into one organized document.

It is written to serve three audiences at once: the founder and brand owner, anyone writing copy or content in the BE333 voice, and the developers building the app. Each part can be read on its own, and the glossary at the end defines every product term precisely so everyone uses the same language.

**The idea in one line:** BE333 makes mindfulness simple, frequent, and truly doable: three minutes, three times a day, for three weeks. Short enough to actually do, often enough to matter, gentle enough that you keep coming back.

---

## Part 1 · Brand Foundation

### Origin & Mission

| Element | Description |
|---|---|
| Origin | BE333 was created by a licensed psychologist to make mindfulness accessible, sustainable, and compassionate. |
| Core concept | Built on the science-backed idea that three minutes, practiced three times a day for three weeks, can meaningfully improve focus, mood, and self-compassion. |
| Mission | To help people reset their nervous system, reduce stress, and build lifelong habits of mindfulness and self-kindness. |

### The Story of BE333

BE333 was born from the frustration of watching mindfulness practices fail — not because they don't work, but because they aren't designed for real life. Too often mindfulness is presented as a 30-minute sit, a silent retreat, or a rigid daily routine that leaves no room for the natural messiness of being human. People start with good intentions, miss a day, feel guilty, and stop altogether.

We wanted something different: a practice that meets people where they are, offers structure without rigidity, and reinforces self-kindness as much as focus. We wanted to make mindfulness simple, frequent, and deeply humane.

The search for the right format led to the 3-Minute Breathing Space, a mindfulness-based cognitive therapy technique shown to interrupt automatic negative thinking, reduce stress, and regulate mood. Three minutes is short enough to overcome resistance but long enough to create a meaningful shift in the nervous system. Pairing that with the proven power of habit linking and visual progress tracking gave us the foundation for BE333: three minutes, three times a day, for three weeks.

The design inspiration came from the lotus — a symbol of growth through murky water — and the chakra system, a visual metaphor for alignment and energy. In BE333 the lotus grows petal by petal through the first 14 days, then unlocks the seven chakras in the final week, symbolizing inner alignment and full bloom. The focus on green and gold reinforces both grounding and vitality: steady growth and radiant self-care.

### Voice & Tone Guidelines

BE333's communication must feel consistent across every platform — in-app copy, notifications, website, app store, and ads.

| Element | Guideline |
|---|---|
| Overall tone | Warm, clear, encouraging, and nonjudgmental. |
| Language | Short, plain sentences. Present tense. Written at roughly a 6th-grade reading level. |
| Core message | Foster self-love, compassion, and radical acceptance — kindness even during setbacks. |
| Stylistic notes | Gentle humor is welcome. Avoid shame language and "should" statements. Never frame a missed session as failure. |

**Voice do / don't**

- **Do:** "Welcome back. Begin again softly — three minutes is enough."
- **Don't:** "You broke your streak. Don't miss again."

---

## Part 2 · Visual Identity

The visual system is designed to feel rhythmic, patterned, clean, and accessible.

### Brand Colors

Palette below matches `constants/Colors.ts` verbatim. When updating either
side, update both in the same commit.

| Color | Hex | Usage |
|---|---|---|
| Deep Lotus Green | `#1A4331` | Primary background, main brand green. |
| Lotus Green (mid) | `#2C6E52` | Cards, surfaces, secondary green. |
| Plant Green (breathing) | `#4A9977` | Glowing ring and synced breathing animation around the timer; session-phase indicators. |
| Bloom Gold | `#E1B725` | Highlights, icons, milestone accents; primary gold for UI. |
| Soft Gold | `#F5D765` | Glows, hover states, secondary gold. |
| Hero Gold | `#FFD700` | Reserved for the logo mark and top-tier celebratory moments (e.g., Petal Award). |
| Royal Purple (accent) | `#4B006E` | Optional deep accent for future chakra/energy moments. Not currently used in UI. |

### Logo & Icon

The mark is a **gold lotus above a serif wordmark**. Composition and
color choices are documented so future edits stay consistent — where a
description conflicts with what is shipped, the shipped mark is the
source of truth and this section should be updated to match.

| Element | Description |
|---|---|
| Main logo | A Hero Gold (`#FFD700`) stylized lotus centered above the wordmark **BE333**. Serif typeface (Marcellus-style). "BE" is Deep Lotus Green fill with a gold outline; "333" is gold fill with a green outline. A decorative gold vine wraps the left side of the "B," and a small cluster of white lotus flowers with gold leaves sits at the baseline of the "B." |
| Icon (app / favicon) | Small-use variant: the lotus alone, in Hero Gold on a Deep Lotus Green background. Wordmark is dropped for icons ≤ 128 px so it remains legible. |
| Wordmark-only variant | For contexts where the lotus is redundant (e.g., in-app headers already framed by lotus imagery), use **BE333** in serif type with the same color treatment as the main logo. |

**Known design tensions** (candidates for a future logo refresh — not
blockers): the main lotus and the small flower cluster use two different
illustration styles; the fill/outline inversion between BE and 333
creates two visual weights; the vine ornament is left-side-only. These
are documented so any redesign is intentional, not accidental drift.

### Fonts & Typography

| Usage | Font options | Vibe |
|---|---|---|
| Headlines | DM Serif Display or Marcellus | Used sparingly for emphasis. |
| Primary UI | Inter or DM Sans | Clean and accessible. |
| Friendly / supportive text | Nunito or Atkinson Hyperlegible | Friendly and supportive. |

### The Lotus & Chakra Progress System

- Progress is shown as a lotus that blooms one petal per Bloom Day (a day all three sessions are completed).
- The first 14 days grow the petals; the final 7 days unlock the seven chakras in ascending order and color.
- Petals never disappear. Missing sessions pauses growth but never removes progress.
- Choose one petal model and hold to it consistently (e.g., one petal per Bloom Day, up to 21).

---

## Part 3 · The Product

### Core Purpose

Mindfulness made simple, frequent, and doable: three minutes, three times a day, for three weeks. Humans need regular nervous-system resets — moments to pause, check in with themselves, and restore balance. BE333 turns that into genuine, repeatable self-care.

### How It Works — the 21-Day BE Practice

A BE Practice is the 21-day container. Each day holds three BE Pauses — a BE Pause is one short, guided three-minute session to breathe, notice, and reset.

| Term | Meaning |
|---|---|
| BE Practice | The 21-day journey (formally: 21-Day BE Practice). |
| BE Pause | One 3-minute practice session; three are scheduled per day (morning, midday, evening). |
| Bloom Day | A day on which all three BE Pauses are completed; earns one Bloom Petal. |
| Rest Day | A day with too many missed Pauses; no petal is added, but nothing is erased. |

### Rise · Reset · Relax — the daily rhythm

The three daily Pauses are framed around the body's natural energy arc.

| Pause | Psychological / energetic rationale |
|---|---|
| Rise | Anchoring energy. Sets the tone and roots the habit before daily stress begins, leveraging the willpower you have on waking. |
| Reset | Preventing the slump. A deliberate recharge point that breaks up the longest activity block and eases the afternoon energy dip. |
| Relax | Winding down. Creates separation between the day's activity and sleep, promoting reflection and better rest. |

### Progress rules (plain-language)

- Each day has 3 BE Pauses. Completing all three makes it a Bloom Day and adds a Bloom Petal.
- If you miss more than one Pause in a day, that day becomes a Rest Day and no petal is added. Petals never disappear.
- You have 3 streak breaks built into each 21-Day Practice. If a break happens, come back with kindness — the next Pause is always waiting.

### Core Features

- Guided 3-minute timer — optional bells at start, midpoint, and end; optional background nature sounds; start / pause / reset controls.
- Daily gentle reminders — three per day, encouraging and pressure-free, with optional streak-close nudges.
- Lotus flower progress map — each completed session adds a petal or subtle bloom; missing sessions pauses growth but never removes petals.
- Rewards & milestones — badges for 1 day, 3 days, 1 week, halfway, 2 weeks 5 days, and completion, plus Acceptance & Self-Kindness awards for resilience moments (e.g., "Practiced on a Hard Day," "Came Back After a Break").
- Habit linking — connect BE Pauses to existing daily habits so practice becomes automatic (e.g., "After I brush my teeth, I will BE").
- Habit stacking add-ons — after the core 3 minutes, optionally stack another 3-minute activity: chanting, stretching, yoga, journaling, gratitude, poetry, day planning, prayer, or mantra.
- Self-compassion prompts — a gentle affirmation after each session, drawn from a 60-line library across six buckets.
- Mantra library — psychologist-curated affirmations for self-compassion and resilience, one for each day of the practice.
- **My Work** — every writing session (Journaling, Poetry, Gratitude, Day Planning) saves to a personal, filterable archive; users pick one of four categories per entry (see Part 5).
- **History & Trends** — every completed BE Pause and habit-stack session lands in `/history` (reverse chronological, filterable, exportable). Tap a BE Pause to see its detail page with the in-session HR/HRV curve redrawn from the stored samples. Dashboard shows long-arc trend cards (avg HR, avg HRV, EMA mood over time) plus weekly and monthly rollup cards (BE Pause count, habit-stack count, total minutes, avg ΔHR — This Week since Sunday, This Month since the 1st).
- **Learn & SOS surface** — `/learn` gathers the app's teaching library: nine how-to cards (sit / posture, working with thoughts, sensations, worries, diaphragmatic breathing, mantras, chanting, mind-body, why 333), four 60-second SOS scripts (physiologic sigh, email/meeting reset, walking mindfulness, lying-down wind-down), and the trauma-sensitive Ground & Orient variant. All written in the BE333 voice; each card notes an estimated read time and steps have hold-times.
- **Letter to Yourself** — during onboarding, users write a kind letter to their future self for the day they lapse. Stored as a single canonical entry on the user doc (`letterToSelf`) and editable anytime from Settings → Letter to Yourself. Surfaced automatically at the top of the first BE Pause after a Missed Day; if the user skipped writing one, a warm default in the BE333 voice appears. Never visible to a linked BE Guide.
- **Day-plan carryover** — when the user opens Day Planning, yesterday's plan appears at the top of the card. One tap fills any of today's template fields whose labels match yesterday's; extras appear as a read-only "Notes from yesterday" strip so nothing is lost when the user cycles to a different template.
- **Gratitude photo attach** — Gratitude entries optionally accept a photo (pick from library → uploaded to `users/{uid}/gratitudePhotos/`); the photo appears on the entry card in My Work alongside the written line.
- **Coupon redemption** — Settings → *Redeem a code* accepts launch/referral codes stored at `coupons/{CODE}` in Firestore and unlocks the matching tier (`user` or `therapist`) via a Firestore-mirrored override. Coupon-granted entitlements never revoke a paid RevenueCat subscription — the higher tier wins.
- **Buddy Round rematch** — when a Buddy Round resolves (won/lost/tied), the BuddyBoard offers "Start a new Round" (resets counters for both sides atomically) or "End pairing" (returns both to solo practice).
- **Stage-following timer** — non-Pro BE Pauses auto-follow the current practice stage (333 → 3 min, 666 → 6 min, 999 → 9 min) so users progressing through the ladder never have to visit Settings to update the duration. Pro users keep the manual override.
- **Clean-slate returns** — missed sessions and Rest Days never erase a Bloom Petal. The practice always resumes at the next Pause without penalty; the visual state (petals, chakras) stays intact.
- **Associative-learning cues** — every daily reminder is tied to an existing habit the user chose (Pavlovian anchoring). The cue and the practice fire together until returning to the breath feels automatic.
- How-to guides — simple illustrated tips on posture, breathing, non-engagement, and non-judgment.

### Habit Linking vs. Habit Stacking

These are two distinct mechanics and should never be conflated in copy or UI.

**Habit linking** ties the 3-minute practice to a habit the user already does — an anchor. During onboarding, for each of the three daily times, the user identifies an existing habit and links a BE Pause before or after it (e.g., "After I brush my teeth, I will sit and BE for 3"; "At 3:33, I will BE for 3"). This creates a chain of cues through the day.

**Habit stacking** means adding more onto the practice — stacking a second (or third) 3-minute block after the core session, like building a rock tower. Because each block is only three minutes, it stays easy to do.

### Breathing System

#### The core pattern — Slow-Exhale (4-1-6)

The signature pattern makes the exhale longer than the inhale, which is the key to activating the body's rest-and-digest response. We always begin with an out-breath.

| Phase | Guidance |
|---|---|
| Inhale (4s) | Through the nose, easy, filling the belly like a slow balloon. |
| Pause (1s) | A brief, comfortable, gentle pause at the top — natural, no strain. Priority is the slow exhale, not a long hold. |
| Exhale (6s) | Slow, through the mouth or nose. The exhale is about 2 seconds longer than the inhale. |

- **Beginner option:** start with a 3-second inhale and 5-second exhale (with a 1-second pause). Keep the exhale longer than the inhale.
- **Settings option:** allow a 3-1-5 ratio instead of 4-1-6.
- **Activating option (6-1-4):** flips the ratio — inhale longer than exhale — for morning Rise sessions when the goal is energizing rather than calming. Not recommended for users managing panic or acute anxiety; the calming default (exhale-longer) remains the primary pattern.
- **Cue the body:** "Imagine your exhale is a long, slow sigh of relief." This prevents forcing the breath.

#### DEEP3 ignition (optional, read first)

An optional set of three deep breaths to connect mind and body and start the three minutes in calm. After the timer starts but before the breathing pattern begins, the user takes three full breaths (mouth out, nose in), releasing all the air with as much sound and sighing as feels good. Offer 15 or 20 seconds for this (set in settings), or an option to tap when finished.

**How to perform the DEEP breath:**
- **Release** — sigh or blow all the air out through the mouth until the lungs feel empty.
- **Pause** — relax with no breath until the body requests air.
- **Inhale** — through the nose, a full calm breath filling the belly to about 84%.
- **Exhale** — let it go slowly through the mouth.

#### The Breathing Belly lotus animation

A breathing visualization built around a lotus at the person's core. The lotus sits small at the base/belly, grows bigger as the user breathes in, then shrinks back to its base, almost disappearing, on the exhale — one complete sequence repeating without hesitation, each graphic working in order.

- Inhale (3.5s): the glowing circle contracts / shrinks.
- Pause (0.5s).
- Exhale (6.5s): the circle expands / grows.
- Pause (0.5s).

A glowing Plant Green ring (`#4A9977`) surrounds the timer with layered glow rings for depth; the timer border also turns bright green. The circle pulses with the breath.

There should be 14 leaves and 7 flowers to match the 21-day set; guidance text sits above the head of the figure.

#### Biofeedback (advanced feature)

An optional feature that links Bluetooth devices — watches, rings, chest straps — to track body signals during a session: heart rate, HRV, breaths per minute, and temperature where possible. It bridges the mind-body gap by making "feeling calm" measurable.

- Show indicators on the timer screen; compare starting numbers to ending numbers to highlight the improvement made in the short session.
- Optional audio cue when the tracked metric (HR or HRV, user's choice) improves, to reinforce the biofeedback loop.
- Available to everyone, with the same lifetime-data rules that apply to Pro versions.
- Best form: HRV (heart-rate variability) biofeedback; high HRV is a biomarker for stress resilience. Resonance-frequency breathing (~6 breaths/min) trains the breath to sync with heart rate for maximum vagal tone.

#### Technical approach (web app)

Using the Web Bluetooth API, the app continuously reads HR / HRV / breathing-rate from the connected device. Rather than waiting for the session to end, it periodically writes incoming data to a per-session document (e.g., a `biofeedback_readings` subcollection in Cloud Firestore).

A Cloud Function triggers on new/updated readings, computes moving averages, trend detection (is HR rising or falling?), anomaly detection, and combined stress indicators, then writes results back to a `session_analysis` subcollection. The client listens in real time and reflects the physiological state during the session — near-real-time feedback without a persistent open connection.

### Social Layer — Share · Connect · Challenge

Three actions, three levels of accountability, all optional:

- **Share** — every session-completion screen offers a one-tap share (TikTok / Facebook / Instagram) of the finished BE Pause. Lightest touch; broadcast rather than relationship.
- **Connect** — link a **BE Guide** (therapist, coach, or mental-health professional) so your Practice is visible in their dashboard live. Deepest bond; asymmetric relationship. See *Therapist Layer — the BE Guide View* below.
- **Challenge** — invite a friend by email to run the same 21-Day Practice as a two-player Buddy Challenge. Peer-level; symmetric relationship.

**Why it works — observer accountability.** Knowing a specific person will see your progress produces two effects, not one: more attempts (the Köhler Effect — nobody wants to be the weak link) and *deeper* cognitive engagement per attempt (you think more carefully about what you are doing when someone is watching). The app harnesses both.

#### The BE Buddy Challenge

A BE Buddy Challenge sits on top of a BE Practice. The Practice stays the same; the Challenge adds a two-player layer of accountability and playful competition.

- **Invite flow:** from the main Practice screen, "Invite a BE Buddy." Text or email a friend; if they accept, the two Practices link and each can see the other's progress on a shared Buddy Board.
- **Rules:** both are in the same 21-Day BE Practice with the same daily goal (3 BE Pauses). Each person is allowed 3 Missed Sessions for the whole Challenge. After a 3rd Missed Session, that person loses the Round — their Practice continues, but the Round goes to their Buddy.
- The lotus rules are unchanged: Bloom Days still earn petals, and petals are never removed.
- When a Round ends, offer a rematch on the next Practice ("Start a new BE Buddy Round").

### Therapist Layer — the BE Guide View

Therapists get a role name and a feature that fit the app. The therapist role inside BE333 is a **BE Guide**; the feature is the **BE Guide View** (or Guide View); the client action is **"Link a BE Guide."** This lets a therapist track a client's mindfulness homework live, without paper or emails — a primary reason the app was designed.

#### Signing up as a BE Guide

At sign-up, choose the **Therapist** role. This unlocks the Guide View section of the app and adds three fields to the sign-up form:

- **License / certification** (free-text, self-attested) — e.g., *"LMFT #12345, CA"* or *"ICF-PCC coach."* Not verified by BE333; used only to help clients decide whether to link with you.
- **Primary specialty** (optional free-text) — e.g., *"Trauma-informed CBT,"* *"Adolescents,"* *"Somatic."*
- **Data-handling acknowledgment** (required checkbox) — see *Privacy & data* below.

Anyone who signs up as a therapist can browse the Guide View, but **linking clients requires the Therapist Pro subscription** (see Plans & Pricing). A therapist without an active Pro tier sees a paywall on the client dashboard.

#### What a linked client shares

When a client uses **Settings → Link a BE Guide** to enter your email (or redeem your invite code), they turn on continuous sharing by default. Each linked client can toggle sharing off at any time; when they do, their card in your Guide View shows a "Sharing paused" note and their stats stop refreshing.

The BE Guide View surfaces, per client:

- **Snapshot stats** — current day of Practice · Bloom Petals · practice stage (333 / 666 / 999) · streak breaks used out of 3 · today's Pauses out of 3 · practice state (active / completed)
- **Lotus Bloom Map** — full visual with the same chakra unlock strip the client sees on their own dashboard
- **Recent days history** — Bloom Day / Rest Day labels for the last three days, each with dots for the Pauses completed
- **Sharing status** — a warning banner if the client has paused sharing
- **Your notes** — a persistent free-text note pinned to that client (see *Guide tools* below)

#### Guide tools

- **Client notes.** Each client card in your dashboard has a private note field only you can see. Store session context, homework observations, or reminders here. Autosaves as you type; timestamped on last edit.
- **All notes at once.** A **Recent Notes** view (`/guide/notes`, linked from the top of the BE Guide View) shows every note you've written across the whole roster, most recent first, with three-line previews. Tap any row to jump straight into that client's detail page for full editing.
- **Invite codes.** Generate a short shareable code from the Guide View — clients redeem it in Settings → Link a BE Guide as an alternative to typing your email. Useful for referrals, wait-room handouts, or QR codes in your office.

#### Client capacity per tier

| Tier | Linked clients |
|---|---|
| Free therapist (browsing only) | 0 — must upgrade to link |
| Therapist Pro (monthly / yearly) | 25 |
| Therapist Lifetime | 100 |

If a client tries to link a Guide whose roster is full, the client sees *"This BE Guide has reached their client capacity."*

#### Billing model

The Therapist Pro subscription is paid by the **Guide**, not the client. Clients do not need a Pro subscription to link — the Guide pays for the seat and the client shares for free. This mirrors how a therapist would pay for a records / EHR system on behalf of their practice.

#### Privacy & data

BE333 is a wellness app, not a covered entity under HIPAA. Data shared with a BE Guide is limited to what the app collects: practice cadence (Bloom Days, Missed Pauses), practice stage, snapshot stats, and the Lotus Bloom Map. **The Guide never sees:** biofeedback readings, written entries in *My Work* (Insight Diary / Insightful Notes / Inspiring Messages / Self-Advice), EMA check-in responses, or session-completion messages. Notes the Guide writes about a client are visible only to that Guide and never to the client.

At sign-up as a therapist, the acknowledgment checkbox says approximately:

> I understand that BE333 is a wellness tracking tool, not a HIPAA-covered service, and that any client data I view here is a summary of practice cadence — not clinical documentation. I will treat client identifiers with the same care as any other client record.

Clients see a matching note in Settings when they link a Guide, so both sides understand the scope.

#### Framing (for copy and coaching)

This is a conversation starter about how mindfulness is fitting into a client's life — not a performance score. The Guide View exists to make homework visible, not to grade it.

### Progression — Beyond the First 21 Days

After completing the first 333, users begin a second phase ("Part 2") for the next 21 days. They can repeat another set of 333 or increase to a longer session.

- **Part 2:** another 21 days — repeat 333, or move to 6 minutes, 3 times a day.
- **Final stages:** after completing 333, then 666 (or 333+333), users can unlock a final stage of 9 minutes, 3 times a day — or simply continue with another 333.
- **Pro options:** edit the timer to any duration (not just 3 minutes), customize app colors, and edit habit-stacking options.

### Plans & Pricing

| Version | Monthly | Other |
|---|---|---|
| User | $3.33 / month | $33.33 / year · $99 lifetime |
| Therapist (BE Guide) | $9.99 / month | $111 / year · $333 lifetime |

- **Day 1 coupon code:** free User Pro annual, or therapist monthly, as a launch offer.
- Dashboard tracks days with 1-of-3 sessions and the number of sessions in the current Challenge / 21-day set; lifetime numbers are a Pro feature.
- The Start button begins the timer; a session is not logged until the full three minutes complete.

---

## Part 4 · The Science

BE333 is not a guess. Its design rests on decades of findings in attention, memory, habit, and nervous-system science. The sections below summarize the evidence and separate what is solid from what is often overstated in wellness marketing.

### Why Three Minutes Works

Brief mindfulness meditation (BMM) — sessions of roughly 3 to 17 minutes — produces measurable benefits, even for beginners.

- A 10-minute session eased perceived stress and improved sustained attention.
- A 10-minute guided meditation improved executive attention in novices, especially on difficult trials — a sign of better resource allocation.
- A brief recording produced faster correct reaction times on an attention task versus control.
- A 4-week program (15 min/day, 6 days/week) raised dispositional mindfulness and improved attention.
- In a dose-comparison trial, well-being rose and distress fell across all conditions, including the shortest (~10-minute) meditations — brief practice can help regardless of dose.

The mechanism is attention switching: brief practice releases attentional resources that would otherwise be spent on worry or task-irrelevant thinking.

### Why Three Times a Day — Distributed Practice

The 3-times-a-day cadence leans on the **spacing effect**, one of the most established findings in learning science.

- Spreading practice across time helps memory more than massing it together.
- **Study-phase retrieval:** the benefit of spacing comes from retrieving the earlier session at the moment of the next one (the Reminding Model).
- **The sweet spot:** memory gains most when retrieval is a little effortful. Too little forgetting makes reminding "impotent"; too much makes it "unlikely." Frequent short sessions aim right in between.

A short dose also answers the most common reason meditation programs fail: people stop doing them. Lower durations are easier to repeat, and brief practice isn't bound by time or place — convenient, low-cost, and easy to fold into a normal day.

### Why Three Weeks — Habit & Learning

- **Slower forgetting:** repetition supported by reminding leads to "retarded forgetting," helping a habit resist decay.
- **Skill consolidation:** frequent, successful return to the practice turns a deliberate act into something closer to second nature.
- **Better mindfulness → better well-being:** higher dispositional mindfulness is linked to greater well-being and stress relief.

### How the 3-3-3 Design Maps to the Research

| BE333 component | Research concept & finding |
|---|---|
| 3-minute session (short dose) | Brief mindfulness meditation improves attention and well-being, even in novices. |
| Three times a day (frequency) | Distributed practice and the spacing effect support memory and skill via study-phase retrieval between sessions. |
| Three weeks (duration) | Extended practice periods raise dispositional mindfulness and strengthen attention function. |
| Habit formation (calm & kindness) | Better dispositional mindfulness is linked to greater well-being and stress relief. |

### The Breathing "Superpower"

Breathing is the one part of the autonomic nervous system we can consciously control — a remote control for the vagus nerve that can switch off the stress response.

- Exhale-biased slow breathing (e.g., 1:2 inhale:exhale, or cyclic sighing) acutely boosts HRV and lowers respiratory rate; exhalation heightens vagal activity.
- Slow breathing near 6 breaths/min increases HRV and reduces state anxiety.
- The physiological sigh (double inhale through the nose, long exhale through the mouth) is the best tool for a rapid state shift.
- **Note:** inhale-first "big breath" cues are tradition and convenience, not physiology-driven. For calming, favor slower rates and longer exhales.

### Deep-Dive Verdicts

A closer look at the mechanisms behind each feature, with the influencer marketing filtered out.

| Question | The verdict |
|---|---|
| Associative learning (Pavlov) | The foundational finding: pair a neutral cue (bell) with a meaningful event (food) enough times and the cue alone will trigger the response. BE333's habit linking rides this — pair an existing daily anchor (coffee, teeth-brushing, arriving at your car) with the 3-minute Pause until the anchor itself starts to summon the practice. |
| "Neurons that fire together, wire together" (Hebb's rule) | Donald Hebb (1949): repeated co-activation of two neural circuits strengthens the connection between them. Every BE Pause done after the same anchor is a rep for that wiring. |
| "Habit linking" | A marketing term, not a scientific one. The academic concept is **implementation intentions** ("if-then" planning), pioneered by Peter Gollwitzer (1999). Deciding when and where you will act dramatically increases success; habits are context-dependent, so linking to a stable existing cue works. |
| Why does the old habit keep firing? | Old cues will keep triggering old responses until a new response is deliberately paired with them enough times to compete. That is why the app treats a lapse as a normal chapter of learning, not a failure: the old wiring is still doing its job — you just haven't out-repped it yet. |
| Is meditation beneficial? | Yes. Neuroimaging shows it physically alters brain structure (neuroplasticity) and reduces inflammation. Goyal et al. (2014, JAMA Internal Medicine) found moderate, reliable evidence that meditation reduces anxiety, depression, and pain across hundreds of trials *(placeholder for the ~1,800-study review — citation pending)*. Lazar (2005) found long-term meditators had cortical thickness in attention and sensory-processing regions matching people ~20 years younger — meditation appears to counter age-related cortical thinning. Hölzel (2011) documented increased gray-matter density in the hippocampus (learning and memory) after 8 weeks of MBSR. Meditation also reliably reduces cortisol. |
| "Habit stacking" & superadditivity | Coined by S.J. Scott (2014); the method was formalized earlier by BJ Fogg as "Anchoring" (Tiny Habits) and popularized by James Clear (Atomic Habits). It works via **synaptic pruning** — the brain grafts a new habit onto an existing "super-highway" rather than building a dirt road — and via **superadditivity**: two habits done together produce more benefit than the sum of their effects done separately, because the second habit inherits the first's neural context. Lally (2010) "66 days" study found cue consistency is the biggest factor in automaticity. |
| Is peer accountability effective? | Yes, but ignore the mythical "95% ASTD" statistic. Real research shows accountability works via the **Köhler Effect** (we work harder in a group to avoid being the weak link). Wing & Jeffery (1999) found people who joined with friends had far higher completion rates. Beyond frequency, being watched also increases *explorative thoughts and cognitive effort per attempt* — knowing a therapist or buddy will see it makes the practice deeper, not just more consistent. |
| Does breathing impact mental health? | Yes. Balban & Huberman (2023) showed 5 minutes of cyclic sighing outperformed mindfulness meditation for mood and respiratory rate. Breathing-based practice is validated even for PTSD (Seppälä, 2014). |
| Benefits of being in nature | Nature restores directed attention (Attention Restoration Theory). Ulrich (1984) found patients with a view of trees recovered faster; Bratman (2015) showed a nature walk reduced activity in the brain region tied to depressive brooding. |
| Is biofeedback helpful? | Yes. HRV biofeedback bridges the mind-body gap by making calm measurable; high HRV is a biomarker for stress resilience. Meta-analysis (Goessl, 2017) confirmed a large effect size for reducing stress and anxiety. |
| Motivation vs. habits | Motivation is for starting; habit is for continuing. Intrinsic motivation (autonomy) creates stronger habits than external rewards or pressure. Relying on willpower long-term is a failing strategy (Wood & Rünger, 2016). |
| Guilt, shame & reinforcement | Shame is toxic to habits — it triggers the "what-the-hell effect" (Abstinence Violation Effect). Guilt ("I did a bad thing") can be reparative, but shame ("I am bad") leads to withdrawal and relapse. Self-compassion after a slip (Breines & Chen, 2012) produces a specific outcome pattern: **↑ motivation to try again, ↑ self-improvement, ↓ shame, ↓ withdrawal, ↓ guilt.** This is the exact opposite of what critics assume — self-compassion doesn't lower the bar, it raises the return rate. |
| How to bounce back | Use the Fresh Start Effect (a temporal landmark) plus coping planning (planning for failure). Separate identity from failure: viewing a slip as a "lapse" rather than a "relapse" is the key to getting back on track (Marlatt). BE333's phrase for this: **plan for imperfection** — build the assumption of missed days into the design of the practice, not around it. |

### Concepts Often Missed When Designing Mindfulness

- **Decentering vs. relaxation:** cognitive distance from thoughts is distinct from calm. Meta-awareness — noticing mind-wandering fast, without judgment — is the core skill.
- **Frequency over minutes:** active days and number of sessions predict outcomes better than per-session length. Track both state (immediate calm) and trait (long-term skill) change.
- **Just-in-time delivery (JITAI):** deliver prompts at stress inflection points, not random times. Implementation intentions ("if X, then 3 breaths") tie practice to real triggers.
- **Adverse effects:** not everyone relaxes. Watch for dissociation, derealization, trauma flashbacks, and increased anxiety. Offer trauma-sensitive adaptations (eyes open, orienting, short sets, opt-out language) and, for panic-prone or respiratory conditions, emphasize the exhale and avoid rapid deep inhalations.
- **Avoid spiritual bypass:** mindfulness is not a substitute for problem-solving or treatment. Be explicit about what app data is tracked and why.

---

## Part 5 · Content Library — Scripts & Guides

This part is the working content spec: what needs to be written and produced, plus ready-to-use scripts and prompts. All content follows the global standards at the end of this part.

### Content Deliverables Inventory

- 6 core session scripts (morning, midday, evening, anywhere, tough day, calm focus).
- 60 self-compassion prompts (post-session pop-ups).
- 50 mantras (with meanings; audio guidance for a subset).
- 8 habit-stack categories, each with scripts/prompts.
- 9 how-to guides + micro-audios.
- Milestone and kindness awards; notifications and nudges.
- Audio library (bells, loops, chants, yoga cues) and visual assets (lotus + chakra progression, icons, app-store art).

### Core Session Script Structure

Each 3-minute core script follows the same arc:

- **Arrival (15–20 sec):** posture and breath cue.
- **Body / breath (90 sec):** notice, return, kindness.
- **Closing (30–40 sec):** one line of self-kindness.

**Example closing lines** (mix and reuse): "I showed up for myself today." · "I can begin again at any moment." · "My breath is a safe place to rest." · "Ground down into the present moment." · "Returning to the practice is the practice."

### Core 3-Minute Script — Exhale-Longer (seated, eyes open or softly closed)

Bells at 0:00, 1:30, 3:00.

| Time | Script |
|---|---|
| 0:00 (bell) | Breathe out gently first. Let the shoulders drop. Inhale through the nose, easy. Exhale longer than the inhale, smooth. Settle the tongue on the roof of the mouth. Soften the jaw. |
| 0:20 | Feel the belly rise on the inhale. Feel the belly fall on the exhale. Count softly: In 4… Out 6. Adjust as comfortable. |
| 0:45 | Notice one sound. Name it: hearing. Notice one body sensation. Name it: feeling. Return to breathing. In 4… Out 6. |
| 1:30 (bell) | Micro-scan: brow, eyes, jaw, throat, chest, belly, hands. Soften each on the exhale. If thoughts appear, label thinking. Return to the next exhale. |
| 2:15 | Invite kindness: I am here. I can be gentle. Two more rounds. In 4… Out 6–8. Unhurried. |
| 3:00 (bell) | Release control of the breath. Notice how you feel. Name one word for the moment (calmer, present, steady). Whisper: good job for showing up. |

### Trauma-Sensitive Variant (ground + orient)

| Time | Script |
|---|---|
| 0:00 (bell) | Keep eyes open. Look around and name three colors. Exhale first. Feel your feet on the floor. In 4… Out 6. Hand to belly if helpful. |
| 0:45 | Name three things you see. Name two sounds you hear. Name one sensation you feel. |
| 1:30 (bell) | Soften your gaze. Exhale longer. Let the ribs drop. If a memory or image comes, label past and look at one neutral object. |
| 2:15 | Re-orient: today's date, where you are, one safe thing near you. In 4… Out 6–8. Slow and steady. |
| 3:00 (bell) | Check: safer, same, or activated? Choose next step: water, stretch, or continue your day. |

### Other Drop-In Scripts

- **Walking mindfulness (3 min):** exhale as you stand; match steps to breath (inhale 3 steps, exhale 4–5); feel heel-to-toe; name three sights without judging; unclench the jaw; thank your body for moving.
- **Lying-down wind-down (sleep prep):** exhale first, one hand on belly, one on chest; in 4 through the nose, out 8; on each exhale say "release"; count down with exhales 5…4…3…2…1; three slow rounds, In 4… Out 8–10; stay or sleep.
- **60-second SOS — physiologic sigh:** two quick inhales through the nose (second shorter), one long slow exhale; repeat 5–8 times, then In 4… Out 6 for 30 seconds; label: reset.
- **60-second email/meeting reset:** exhale first, roll shoulders back; In 4… Out 6, five rounds; name the task, name the first small action, start.
- **Cyclic exhale practice (2-min add-on):** In 3… Out 6; In 3… Out 7; In 3… Out 8; find your easy ratio and keep it effortless.

### Self-Compassion Prompts

60 total, 3–12 words each, rotated after sessions. No imperatives that shame. Six buckets with sample lines:

| Bucket | Sample lines |
|---|---|
| Showing up | I gave myself three minutes. · I arrived for me. |
| Beginning again | This moment counts. · I can restart, kindly. |
| Softening perfection | Progress, not perfect. · Small is still real. |
| Difficult days | Hard and worthy coexist. · I did the kind thing. |
| Body kindness | My breath steadies me. · My shoulders can soften. |
| Patience | Habits grow gently. · Petal by petal. |

### How-To Guides

- **Sit & posture** — sit comfortably, upright, shoulders relaxed. No rigid positions required.
- **What to do with thoughts** — notice, label ("thinking"), and gently return to your focus without judgment.
- **What to do with bodily sensations** — acknowledge, adjust if necessary, return attention to breath or anchor.
- **What to do with worries** — label as worry and bring focus back to the present.
- **Diaphragmatic breathing** — inhale into the belly, exhale slowly; engages the parasympathetic nervous system.
- **How to use mantras** — repeat silently or aloud; match to your breath; return to it when the mind wanders.
- **Benefits of chanting** — regulates breath, stimulates the vagus nerve, unites mind and body in rhythm.
- **The mind-body connection** — thoughts, feelings, and physical states influence each other; mindful awareness helps restore balance.
- **Why do 333** — small, frequent practices are more sustainable and effective than occasional long sessions.

### Post-Session Extensions (Habit-Stack Add-Ons, each ~3 min)

| Add-on | What it includes |
|---|---|
| Chanting | 4 tracks (OM, So Hum, simple humming, silent mantra). Structure: 20-sec posture/breath intro, ~2 min chant pacing (subtle bell every 30 sec), 40-sec quiet sit and close. Meaning line: So Hum = "I am." |
| Stretching | 3 sequences with still illustrations (desk release; neck/shoulders; back/hips), 6 moves × 30 sec each. Safety: stop if pain; breathe gently. |
| Prayer | 6 short prayers (secular, interfaith, Christian, Jewish, Muslim, Hindu/Buddhist-inspired). Inclusive and non-proselytizing; option to hide prayers globally. |
| Journaling | 40 prompts, one line each, autosave, 500-character soft cap. Buckets: awareness, emotion, choice, values, reframing. Saves to **My Work**. |
| Poetry writing | 30 prompts, 3-minute timer, line counter, saves to **My Work**. E.g., "Write a 4-line poem that begins, Today I returned…" |
| Day planning | 6 mini-templates, 3-minute timer, one-tap carryover to tomorrow. Saves to **My Work**. E.g., Today's three: Focus, Kindness, One small win. |
| Gratitude | 30 rotating micro-prompts, 1–3 entries, optional photo. Saves to **My Work**. E.g., "One small kindness I received…" |
| Mantra practices | 20 mantras with meanings, audio guidance for 6. E.g., "I return to now." · "Soft body, strong heart." |

### My Work — categorized writing

Every writing session (Journaling, Poetry, Gratitude, Day Planning) saves to a personal, filterable archive called **My Work**. Users pick one of four categories for each entry; the picker is pre-selected to a natural default per activity, editable in one tap.

| Category | Meaning | Default for |
|---|---|---|
| **Insight Diary** | What you noticed today | Journaling |
| **Insightful Notes** | Quick thoughts, lines, observations | Poetry |
| **Inspiring Messages** | What lifted you or lifted someone else | Gratitude |
| **Self-Advice** | Notes to your future self | Day Planning |

Entries can be filtered by category and exported as plain text via the platform share sheet. Deletion is single-tap with confirmation.

### Yoga Add-On Sequences

See Part 6 for the full 3-Minute Yoga Vinyasa Manual, which supplies the stretching / yoga stack content.

### Reminders, Nudges & Micro-Interactions

**3× daily reminder copy**

- **Morning:** Begin soft. Exhale first. 3 minutes, then go live your day.
- **Midday:** Unclench, unrush. 3 minutes to reset your nervous system.
- **Evening:** Land the day gently. 3 minutes, then rest.

**Implementation-intention templates**

- After I make coffee, I will do 3 minutes of breathing.
- After I open email, I will take 5 cyclic sighs, then 3 minutes.
- After I park the car, I will walk-mindfulness for 3 minutes.

**EMA check-ins (one tap after a session)**

- Stress now: lower / same / higher.
- Mood now: better / same / worse.
- Focus now: clearer / same / foggier.
- One word for this session: ______.

**Week-by-week**

- **Week 1:** breath basics (In 4… Out 6–8).
- **Week 2:** body and sound (label feeling, hearing).
- **Week 3:** open attention + kindness (let it be, be kind).

**Letter to Yourself (missed-day recovery script)**

During onboarding, offer the user a short writing prompt:

> "Write a kind letter to your future self for the day you miss a Pause. What would you want to hear on that day? Two or three sentences is plenty."

Store the entry in My Work under **Self-Advice**. Surface it automatically at the top of the first BE Pause after a Missed Day, with the eyebrow *"You wrote this for today."*

If the user skipped the writing step, use this warm default in the BE333 voice:

> Welcome back. A missed day isn't a broken practice — it's the practice, meeting you where you are. Petals stay. The breath is right here. Three minutes, and you're back.

### Global Content Standards

- **Reading level:** 6th grade. **Tone:** gentle, encouraging, nonjudgmental.
- **Lengths:** 45–75 spoken words per minute; 3-minute tracks ≈ 180–220 words.
- **Voiceover:** warm, clear, neutral accent; room tone; no reverb; -16 LUFS; WAV 48kHz/24-bit; filenames kebab-case.
- **Text style:** present-tense, short sentences, plain language.
- **Accessibility:** every audio has an on-screen transcript; all visuals have alt text; color contrast meets AA.
- **Sound design:** bells (start, midpoint, end) distinct but soft, file set at -12 dBFS peaks; background loops (stream, birdsong, room tone) seamless over 3 minutes; award chime gentle and brief (under 400 ms).

---

## Part 6 · Daily Sequences

Three sessions, each in three versions: **Standing Up**, **Laying Down**, and **Up&Down**. Every sequence runs about 3 minutes. Each session keeps one breath pattern across all three versions. Morning uses even breath. Midday uses a slightly lengthened exhale. Evening uses an exhale twice as long as the inhale.

### Morning Rise

**Breath:** even, 4 counts in, 4 counts out. **Purpose:** bring the system online. Every version ends upright, and each contains one strength moment.

#### Morning Rise · Standing Up (~3 min)

1. **Standing Full-Body Reach** (arms sweep overhead, stretch long through the fingers, heels can lift) — inhale up, exhale arms float down, 3 rounds (25 sec)
2. **Standing Cat-Cow** (hands on thighs or a counter, arch and round the spine with the breath) — 6 rounds, slightly brisk (40 sec)
3. **Shoulder Rolls + Gentle Neck Turns** — five backward rolls, then look slowly right and left, twice each way (30 sec)
4. **Standing Side Reach** — right and left, about 15 sec per side (30 sec)
5. **Chair Pose Pulses** (sit back a few inches on the inhale, rise on the exhale, arms optional) — 4 slow rounds, natural sit-back, belly soft (35 sec)
6. **Tree Pose** (fingertips on wall or counter as needed) — 10 to 15 sec per side (25 sec)

#### Morning Rise · Laying Down (~3 min, starts in bed, ends standing)

1. **Full-Body Reach** (on the back, arms overhead, stretch fingers to heels, point and flex the feet) — inhale into the stretch, soften on the exhale, 2 to 3 rounds (25 sec)
2. **Knees-to-Chest Rock** (loose hug, small side-to-side rocking) — easy breath (25 sec)
3. **Reclined Twist** (knees drop to one side, arms wide) — right and left, about 15 sec per side, no pulling (30 sec)
4. **Bridge Lifts** (knees bent, feet flat, hips lift a few inches on the inhale, lower on the exhale) — 4 slow rounds (35 sec)
5. **Roll to the side, press up to sitting, then stand** — head comes up last (10 sec)
6. **Mountain Pose + Standing Side Reach** (one arm overhead, lean gently away) — right and left, about 15 sec per side (30 sec)
7. **Tree Pose** (one foot lifted, fingertips on wall, dresser, or counter as needed) — 10 to 15 sec per side (25 sec)

#### Morning Rise · Up&Down (~3 min)

1. **Easy Cross-Legged Seat on the floor** (blanket under hips as needed) — 3 even breaths, shoulders roll back once (25 sec)
2. **Cat-Cow from hands and knees** — 6 rounds, slightly brisk (40 sec)
3. **Sphinx** (forearms down, chest gently lifted, legs heavy) — even breath (30 sec)
4. **Downward-Facing Dog, knees bent, pedaling the feet** — 20 to 30 sec, then walk the feet forward and roll up to standing, head last (40 sec)
5. **Standing Side Reach** — right and left, about 15 sec per side (30 sec)
6. **Tree Pose** (wall or counter as needed) — 10 to 15 sec per side (25 sec)

### Mid-Day Reset

**Breath:** slightly lengthened exhale. **Purpose:** clear tension, reset posture, return to the day. Every version ends upright or rising.

#### Mid-Day Reset · Standing Up (~3 min, desk-friendly)

1. **Mountain Pose + Shoulder Rolls** — five slow backward rolls, then stand still and let the exhale lengthen (40 sec)
2. **Cat-Cow** — inhale to arch, exhale to round, small range, about 8 slow rounds (50 sec). Hands can go to a desk or counter instead of the floor.
3. **Thread the Needle** (from hands and knees, slide one arm under, shoulder rests down) — right and left, about 20 sec per side, breath into the back ribs (40 sec)
4. **Standing Side Reach** — right and left, about 20 sec per side, finish with two long exhales (50 sec)

#### Mid-Day Reset · Laying Down (~3 min)

1. **Full-Body Reach on the back** — inhale into the stretch, soften on the exhale, 2 rounds (20 sec)
2. **Knees-to-Chest Rock** — loose hug, small rocking, easy breath (30 sec)
3. **Reclined Twist** — right and left, about 20 sec per side (40 sec)
4. **Reclined Figure-4** (ankle over opposite knee, hands behind the thigh, gentle) — right and left, about 20 sec per side (40 sec)
5. **Legs-Up-the-Wall** or legs resting on the couch or chair seat — in 4, out 6 (50 sec). Then roll to the side and come up.

#### Mid-Day Reset · Up&Down (~3 min)

1. **Mountain Pose + Shoulder Rolls** — five slow backward rolls, exhale lengthening (30 sec)
2. **Standing Side Reach** — right and left, about 15 sec per side (30 sec)
3. **Lower to hands and knees, then Cat-Cow** — 6 slow rounds (45 sec)
4. **Thread the Needle** — right and left, about 20 sec per side (40 sec)
5. **Child's Pose**, knees wide, pillow under hips if the fold feels crowded — 3 long exhales (20 sec)
6. **Rise back to standing, roll up slowly, then Mountain Pose** — two long exhales to close (15 sec)

### Evening Rest

**Breath:** exhale twice as long as the inhale, throughout. **Purpose:** down-shift the nervous system toward sleep. No effort anywhere, and each version gets progressively stiller.

#### Evening Rest · Standing Up (~3 min)

1. **Mountain Pose, eyes soft or closed, hand on belly** — in 4, out 8, three rounds (40 sec)
2. **Slow Shoulder Rolls, then let the arms hang heavy** — five rolls, then stand and let the arms weigh down, jaw unclenched, teeth slightly parted (30 sec)
3. **Standing Side Reach, slow-motion version** — right and left, about 20 sec per side, exhale long on the way over (40 sec)
4. **Standing Forward Fold**, knees generously bent, arms dangling or holding opposite elbows — gentle sway, head heavy (30 sec). Hands can rest on a bed or chair seat for a supported half-fold instead.
5. **Return to Mountain, rolling up slowly, head last** — one final round of in 4, out 8, standing still (40 sec)

#### Evening Rest · Laying Down (~3 min, bed-friendly, flows into sleep)

1. **Supported Reclined Butterfly** (on the back, soles of feet together, knees resting on pillows, pillows required) — belly breathing, one hand on belly, one on chest, only the belly hand moves (60 sec)
2. **Knees-to-Chest Rock** — loose grip, shoulders down, tiny rocking (45 sec)
3. **Reclined Twist** — right and left, lazy version, gravity does the work, about 20 sec per side (40 sec)
4. **Corpse Pose or straight into sleep position** — 4-7-8 breath (in 4, hold 7, out 8), two to three rounds, or simplify to a long exhale if counting feels like work (35 sec)

#### Evening Rest · Up&Down (~3 min, one-way trip: starts standing, ends down)

1. **Mountain Pose, eyes soft, hand on belly** — in 4, out 8, two rounds, jaw unclenched, teeth slightly parted (30 sec)
2. **Standing Forward Fold**, knees generously bent, arms dangling or hands resting on the bed or a chair seat — gentle sway, head heavy (25 sec)
3. **Lower to sitting, then Easy Cross-Legged Seat** (blanket or against the bed for back support) — long-exhale breathing, shoulders melting (30 sec)
4. **Recline back, then Knees-to-Chest Rock** — loose grip, tiny rocking (35 sec)
5. **Reclined Twist** — right and left, lazy version, about 20 sec per side (40 sec)
6. **Corpse Pose or sleep position** — 4-7-8 breath, two rounds, or just the long exhale (20 sec)

### Translation Key Additions

- *Viparita Karani* = Legs-Up-the-Wall
- *Supta Kapotasana (modified)* = Reclined Figure-4
- *Supta Matsyendrasana* = Reclined Twist
- *Savasana* = Corpse Pose
- *Supta Baddha Konasana* = Supported Reclined Butterfly
- *Apanasana* = Knees-to-Chest
- *Salamba Bhujangasana* = Sphinx
- *Vrksasana* = Tree Pose
- *Setu Bandha (dynamic)* = Bridge Lifts

### Safety Notes

All nine sequences follow the same framework: soft or bent knees on every fold, no loaded spinal flexion, no forced hip rotation, no core gripping or tailbone tucking cues, and all floor transitions happen via the side or via hands and knees. The only strength moments live in Morning Rise (Bridge Lifts, Chair Pulses, or the floor-to-stand transition). Evening Rest contains no effort by design.

---

## Part 7 · Mantra & Affirmation Bank

Psychologist-curated affirmations for self-compassion and resilience — one for each day of the 21-day practice, plus a wider bank to rotate through the app.

### Self-Compassion & Presence

1. "I am here. I breathe in kindness, I breathe out judgment."
2. "For these moments, I'm gentle with myself."
3. "My feelings are valid, even the uncomfortable ones."
4. "Everyone struggles. I am human, and I am not alone."
5. "I acknowledge my suffering. I respond with comfort."
6. "In this breath I release self-criticism and invite self-care."
7. "I allow imperfection, because there is no such thing as perfect."
8. "My breath is my anchor to the present moment."
9. "I treat myself with the same kindness I offer others."
10. "I notice my thoughts. I let them pass. I stay grounded."
11. "I release the need for things to be different."
12. "I am grateful for this body that carries me."
13. "I am allowed to rest. Rest is required."
14. "I learn, I forgive, I let go."
15. "I trust the timing of my life."
16. "I embrace this moment fully."

### Growth & Patience (the Lotus theme)

1. "Petal by petal, I am growing."
2. "Slow progress is still progress."
3. "I trust the timing of my bloom."
4. "I don't have to force the flower open."
5. "Each breath is a new beginning."
6. "I am building inner peace, one breath at a time."
7. "Roots first, then the bloom."
8. "Rest is required, not earned."

### Strength & Resilience

1. "Soft body, strong heart."
2. "I can handle this moment and the next."
3. "I breathe in courage, I breathe out fear."
4. "My calm is my power."
5. "I am learning to stay with myself."
6. "Resilience is returning to the breath."
7. "I bend so I do not break."
8. "Feelings are waves; I am the ocean."
9. "I honor my effort, however small."
10. "I choose to begin again."
11. "I have the strength to set boundaries."
12. "Peace is not a prize; it is a practice."

---

## Part 8 · Marketing & Growth

### Positioning

BE333 is a psychologist-created mindfulness app that makes calm practical, compassionate, and sustainable: three minutes, three times a day, for three weeks. It stands apart by being doable — short enough to fit anywhere, frequent enough to change the nervous system, and gentle enough to keep people coming back.

**The one-line positioning:** *Half science, half Dr. Powers* — every technique in the app comes from either the peer-reviewed literature or from Dr. Powers's clinical practice, and often from both.

**Reasons it works (for copy)**

- 3 minutes is short enough to be realistic but long enough to shift the nervous system.
- Frequent repetition creates new neural pathways for calm and focus (Hebb's rule).
- Habit linking ties practice to existing daily actions via associative learning, increasing consistency.
- Habit stacking uses *superadditivity* — two habits done together produce more benefit than the sum of their effects done separately.
- Observer accountability (therapist + Buddy) drives both more attempts and deeper engagement per attempt.
- Self-compassion prompts and clean-slate returns raise the come-back rate after a lapse.

### Taglines

| Primary | Supporting |
|---|---|
| Pause. Breathe. Be. | Microdose peace. |
| Three minutes. Three times. Three weeks. | Small moments. Real change. |
| Begin again, gently. | Make mindfulness a habit. |
| Petal by petal, you bloom. | Practice peace three times a day. |
| Returning to the practice *is* the practice. | The rhythm of returning. |
| Share. Connect. Challenge. | Observer accountability, done kindly. |
| Half science, half Dr. Powers. | Psychologist-created. Research-backed. |
| Visual guidance to keep you on track. | Three minutes, three times a day. |
| A busy brain isn't the obstacle. It's the equipment. | Wandering isn't failing. Returning is the rep. |
| Do the thing you said you couldn't. | It takes three minutes. |
| You can't fail at noticing. | Noticing *is* the practice. |
| Size and frequency matters. | Small doses, done often. |
| Ground down into the present moment. | Feet on the floor. Breath in the body. |

### App Store Copy

**Short description**

> Mindfulness in 3 minutes, 3 times a day, 3 weeks — to a calmer, kinder you.

**Long description**

> BE333 makes mindfulness simple, frequent, and doable. Just 3 minutes, 3 times a day, for 3 weeks. Backed by research on the 3-Minute Breathing Space, BE333 helps you reset your mind, calm your body, and build lasting habits of self-compassion. Your progress blooms on a lotus, and in the final week the seven chakras light up — a celebration of growth and alignment. With gentle reminders, visual rewards, and optional habit-stacking activities like chanting, yoga, and journaling, BE333 fits mindfulness into real life without pressure. Practice genuine self-care. Build a habit of peace.

**App store title / subtitle**

- BE333 — Mindfulness in Minutes: Practice Peace in 3 Minutes, 3 Times a Day.
- Description hook: A psychologist-created app for building self-compassion, habit-linked mindfulness, and nervous-system resets.

### Google Ads Copy

| Headlines (≤30 chars) | Descriptions (≤90 chars) |
|---|---|
| 3 Minutes to Calm — Try BE333 | Mindfulness that fits your day in just 3 minutes. |
| Mindfulness That Fits Your Day | Reset your mind and body — three times a day. |
| Build Habits of Peace | Created by a psychologist to help you reset and breathe. |
| Psychologist-Created App | Small steps. Big change. Begin your BE333 journey today. |

### SEO & App-Store Optimization

**Core keyword buckets**

| Bucket | Keywords |
|---|---|
| General | mindfulness app, meditation, guided meditation, calm, zen, breathing techniques, meditation for beginners. |
| Pain-point (high conversion) | anxiety relief, stress management, panic attack help, insomnia relief, sleep meditation, mood tracker, gratitude journal. |
| Performance & focus | focus music, deep work, concentration booster, brain training, flow state, resilience, cognitive performance. |
| Niche audiences | mindfulness for kids, corporate wellness, workplace stress, study focus, exam stress, chakra balancing, mantra meditation. |
| Feature-specific | 3-minute meditation, meditation timer, breathwork tracker, streak counter, offline mode, wearable / Apple Watch meditation. |
| 2025 trending | somatic exercises, nervous system regulation, vagus nerve, cortisol detox, circadian rhythm, trauma release, inner child healing. |

**App-store metadata sets** (iOS keyword field — no spaces after commas)

- **Set A (general):** `meditation,mindfulness,calm,headspace,zen,focus,breathe,anxiety,sleep,yoga,stress,health,relax`
- **Set B (sleep & sounds):** `sleep,insomnia,sounds,rain,noise,bedtime,fan,dream,snooze,nap,relaxing,melatonin,slumber,white`
- **Set C (somatic & therapy):** `somatic,trauma,nervous,system,healing,therapy,cbt,emdr,vagus,nerve,body,scan,regulation,panic`

**ASO strategy**

- The title is king: put your most important keyword in the title.
- The subtitle is queen: use the next most important, intent-based keywords there.
- Don't duplicate: a word in the title generally doesn't need to be in the keyword field.
- Target competitors carefully: competitor names can go in backend keyword tags, but never in your public title or description (risk of rejection).

### Brand Catch Phrases

A rotating bank for social, ads, and in-app moments — the BE333 voice at its most playful.

- "Don't binge on silence; snack on peace."
- "Distribution is the solution."
- "Three minutes you do beats thirty minutes you don't."
- "Short. Sweet. Repeat."
- "You don't have to be a monk to find peace. Just be a human & repeat."
- "Micro-dose sanity."
- "The power is in the pattern, not the duration."
- "We become what we repeat, not what we endure."
- "Every pause is a rep for your resilience."
- "Consistency beats intensity."
- "The medicine is in the frequency, not the dosage."
- "Sip serenity. Don't chug it."
- "You can't overdose on small moments."
- "A river cuts rock not by power, but by persistence."
- "Put your own oxygen mask on first."
- "The kids can wait 180 seconds."
- "Stop the doomscroll. Start the bloom-scroll."
- "It is not the length of the pause that rewires your brain, but the frequency of the reset."
- "The magic isn't in the minutes; it is in the rhythm of returning."
- "Growth happens in the pauses."
- "Returning to the practice is the practice."
- "Half science, half Dr. Powers."
- "Share. Connect. Challenge."
- "Observer accountability — because someone is watching, in the best possible way."
- "Plan for imperfection."
- "Clean slate every time you return."
- "The cue and the breath fire together, until returning is automatic."
- "Neurons that pause together, wire together."
- "Two habits, one bond. That's superadditivity."
- "A busy brain isn't the obstacle. It's the equipment."
- "Wandering isn't failing. Returning is the rep."
- "You can't fail at noticing."
- "Do the thing you said you couldn't. It takes three minutes."
- "Size and frequency matters."
- "Ground down into the present moment."

### Ad Concept · The BE Still Challenge

Companion to the Video Scripts, B-Roll & Shot List, and Reels Tagline Bank. Two versions on identical footage — same format, same timer, same chime; opposite emotional bet.

- **Version A — The Dare:** *"bet you can't"*
- **Version B — The Surprise:** *"bet you can — and you'll surprise yourself"*

**Working titles (A):** The BE Still Challenge · Can You Make It to 3:00? · The 3-Minute Dare · Still Here?
**Working titles (B):** The "I Can't Meditate" Challenge · Surprise Yourself · Bet You Can · Told You So

#### One-line pitch

A full-screen countdown timer dares scrollers to sit still for three minutes over the most beautiful footage we own — and the ones who make it get their first real meditation, a chime, and a reward, right there in the feed.

#### The insight

Nobody thinks they need a meditation app — but nobody can sit still for three minutes either. This ad doesn't tell people that; it proves it to them, personally, in the middle of a doomscroll. The scroll itself becomes the "before" state, and the ad becomes the "after." The viewer's own restlessness is the hook, and the app is the answer.

And the proof isn't a claim — it's felt. The ad ends with a guided body-check ("notice your shoulders, your jaw — feel the difference?") so the viewer experiences a before-and-after in their own body, in real time. No testimonial can compete with a difference you just felt yourself.

The second insight is structural: **the ad IS the product.** Anyone who stays to the end hasn't watched a demo of BE333 — they've just completed their first BE333 session without downloading anything. The pitch and the free trial are the same 3 minutes.

#### Why this works

- **It's a challenge, not an ad.** Challenge formats are native to Reels/TikTok. The dare ("you won't make it") triggers the exact competitive itch that keeps people watching.
- **It's algorithm-aligned.** Platforms rank on watch time and completion rate. This format is engineered to maximize both — every second the viewer accepts the dare is a ranking signal. A 3-minute Reel with high completion is rocket fuel.
- **It flips the doomscroll.** The viewer is already scrolling; we don't interrupt the behavior, we hijack it into a scroll break. This is *"Stop the doomscroll. Start the bloom-scroll."* made literal.
- **The reward loop mirrors the app.** Timer → practice → chime → bloom is exactly the in-app loop (BE Pause → lotus gains a petal). The ad trains the habit loop before the download.
- **Built-in comment bait.** *"Did you make it?"* is an irresistible comment prompt — and comments compound reach.

#### Format

Vertical 9:16 · full 3:00 runtime (Reels supports up to 3 min) · burned-in captions · voice and text carry the same guidance in parallel, so the practice works sound-on with eyes closed, sound-on with eyes open, or fully muted.

- **Visual:** one continuous, slowly evolving take from the Sanctuary shot bank — hero shot is the mossy green waterfall with mist and slow-motion water. No cuts after the open; stillness is the point.
- **Timer:** large countdown from 3:00, styled in brand (Bloom Gold `#F2C94C` numerals on Deep Lotus Green `#2D6A4F` chip, or gold on the footage), positioned in the safe zone. **The timer is the protagonist.**

#### Voice and text carry the same practice (from 1:00 on)

Closing the eyes is an invitation, not a requirement — plenty of viewers will do the whole practice with their eyes soft on the water, and that counts. So from 1:00 on, the voice and the on-screen text carry the same guidance in parallel: the VO leads for anyone whose eyes are closed (everything they need is spoken, including *"open your eyes"* before the chime), and the text mirrors it — breath counts, the body-check, the payoff — so muted and eyes-open viewers get the full practice too. The text never comments on whether the viewer's eyes are open; it simply guides.

#### Beat sheet — Version A · The Dare (3:00 cut)

| Time | Timer | On-screen text | Audio / VO |
|---|---|---|---|
| 0:00–0:03 | 3:00 starts | "You won't make it 3 minutes without scrolling." | Waterfall ambience fades in. No music. |
| 0:03–0:15 | counting | "Even watching this. Bet you're already twitchy." | Ambience only. |
| 0:15–0:30 | counting | "The average scroller leaves in 1.7 seconds. You're beating them already." | Soft VO (optional): "Just watch the water." |
| 0:30–1:00 | counting | "Thumb getting restless? That's not boredom. That's your nervous system asking for a break." | Ambience. |
| 1:00–1:20 | 2:00 | "Still here? Close your eyes if you like — or keep them soft on the water. We'll keep the timer running." | VO: "If you're still here — close your eyes if you like, or just rest them on the water. I'll keep the timer running, and I'll tell you when it's done." |
| 1:20–2:15 | counting | Breath cues mirror the voice: "In through your nose… 2… 3… 4" / "Out through your nose… 2… 3… 4… 5… 6" with the lotus breathing-belly graphic pulsing in time. | VO carries the practice — 3–4 slow cycles: "Breathe in through your nose… two… three… four. And out through your nose… two… three… four… five… six. You just gave yourself a scroll break." |
| 2:15–2:35 | 0:45 | "Now notice: your shoulders. Your jaw. Your chest. Feel the difference?" | VO: "Notice your shoulders. Your jaw. The pace of your thoughts. Feel the difference? That's three minutes. You can feel the difference." |
| 2:35–2:45 | 0:25 | "That calm? Your brain made it. You can feel the difference — and it's trainable." | VO: "Your brain built that calm on its own. Imagine it trained — three minutes, three times a day." |
| 2:45–2:55 | 0:10 | "Almost there. Most people never get this far." | Ambience swells gently. VO: "Almost there…" |
| 2:55–3:00 | 0:00 | CHIME. Lotus blooms on screen — petal-by-petal animation, chakra glow. "You made it. That was your first BE333." | VO: "Open your eyes." → signature chime (the in-app completion sound) as the lotus blooms. "You made it. That was your first BE333." |
| End card (2s) | — | Lotus + logo · "Three minutes, three times a day. That's BE333." · "Link in bio" | VO: "BE333. Pause. Breathe. Be." |

#### The reward moment

The final 5 seconds must feel earned — this is the dopamine payoff the whole ad builds toward:

- **Chime:** use the actual in-app completion chime so the sound becomes a brand asset (and later, a recognition trigger).
- **Bloom:** the lotus gains petals in real time — the same animation the app uses, so day one in the app feels familiar.
- **Affirmation line:** *"You made it. That was your first BE333."* — names what just happened: they didn't watch an ad, they meditated.
- **Felt proof:** the chime lands right after the body-check, so the reward arrives *while the viewer can still feel the difference* in their own shoulders and jaw — the product's benefit and the ad's payoff are the same sensation.
- **Optional deepener:** *"Comment 🪷 if you made it to the chime."* (comment-bait that also self-identifies warm leads.)

#### Caption copy — Version A (ready to paste)

> 99% of people can't watch this to the end without scrolling. The timer doesn't lie. If you hear the chime, you just did your first 3-minute meditation — and you can feel the difference. That's the whole app. 🪷 Comment 🪷 if you made it.
> #BE333 #ScrollBreak #3MinuteChallenge #Mindfulness #NervousSystemReset

#### Version B — The Surprise · *"you think you can't — watch yourself do it"*

**The insight:** The number-one reason people never try meditation: *"I can't. My brain's too busy. I can't focus."* Version B meets that head-on — not with a dare, but with belief: that busy brain is *exactly* the point. Meditation was never about emptying your mind; it's noticing your mind wandered and coming back. The wandering isn't failure — returning is the rep. So this version expects the viewer to win, walks them through it, and lets them surprise themselves: *"You just meditated. With the brain you said was too busy."*

Where Version A hooks the competitive skeptic (*"bet you can't"*), Version B hooks the self-doubter — arguably the bigger, warmer audience, and squarely in the brand's Compassion pillar. Same timer, same waterfall, same chime; the emotional bet flips from *prove us wrong* to *prove yourself wrong.*

#### Beat sheet — Version B · The Surprise (3:00 cut)

| Time | Timer | On-screen text | Audio / VO |
|---|---|---|---|
| 0:00–0:05 | 3:00 starts | *"I can't meditate. My brain's too busy."* — you, probably | VO: "You say you can't meditate?" Waterfall ambience fades in. |
| 0:05–0:15 | counting | "Perfect. A busy brain is exactly the right equipment. Give us three minutes." | VO: "Perfect. You're exactly who this is for. Three minutes — let's prove you wrong." |
| 0:15–0:40 | counting | "Nobody told you the secret: meditation isn't emptying your mind. It's noticing it wandered — and coming back." | VO: "Here's what nobody told you. Meditation isn't emptying your mind. It's noticing your mind wandered… and coming back. That's the whole skill." |
| 0:40–1:00 | counting | "Your mind WILL wander in the next 3 minutes. Good. Every time you come back — that's a rep." | VO: "Your brain will wander during this. Probably a lot. That's not failing. Every time you notice and come back, that's one rep." |
| 1:00–1:20 | 2:00 | "Close your eyes if you like — or keep them soft on the water. 🎧 sound on" | VO: "Close your eyes if you like, or just rest them on the water. I'll keep the timer running." |
| 1:20–2:15 | counting | Breath cues mirror the voice: "In through your nose… 2… 3… 4" / "Out… 2… 3… 4… 5… 6" + pulsing lotus. Mid-way: "Thinking about your to-do list? You just NOTICED. That's a rep. Come back." | VO: 3–4 slow cycles. Mid-way: "Thinking about your list? Great — you just noticed. That's a rep. Come back to the breath." |
| 2:15–2:35 | 0:45 | "Now notice: your shoulders. Your jaw. Your chest. Feel the difference?" | VO: "Notice your shoulders. Your jaw. The pace of your thoughts. Feel the difference? You did that." |
| 2:35–2:45 | 0:25 | "You did that. With the brain you said was too busy." | VO: "You built that calm with the brain you said was too busy. Imagine it trained — three minutes, three times a day." |
| 2:45–2:55 | 0:10 | "Almost there. You're doing the thing you said you couldn't." | Ambience swells gently. VO: "Almost there…" |
| 2:55–3:00 | 0:00 | CHIME. Lotus blooms — petal-by-petal, chakra glow. "You just meditated. Told you." | VO: "Open your eyes." → chime as the lotus blooms. "You just meditated. Told you." |
| End card (2s) | — | Lotus + logo · "Three minutes, three times a day. That's BE333." · "Link in bio" | VO: "BE333. Pause. Breathe. Be." |

#### Caption copy — Version B (ready to paste)

> If your brain is "too busy" to meditate — congratulations, you're qualified. Meditation isn't emptying your mind; it's noticing it wandered and coming back. Wandering isn't failing. Returning is the rep. Three minutes on the timer. Surprise yourself. 🪷 Comment 🪷 if you just did the thing you said you couldn't.
> #BE333 #ICantMeditate #3MinuteChallenge #Mindfulness #BusyBrain

#### When to run which version

Run them as an A/B pair on the same footage — one edit day, two ads. Version A (the dare) travels on competitiveness: shares, stitches, "bet you can't" tags. Version B (the surprise) converts the *"I can't meditate"* objection directly — it's the version to retarget people who watched A past 1:00 but didn't click, and the better fit for warm audiences, therapist referrals, and the Compassion side of the feed. Watch which one produces more 🪷 comments and more link taps; the loser still wins as a top-of-funnel feeder for the other.

#### Cut-down variants

- **90-second version:** compress the open to 10s, one breath cycle instead of four, same chime ending. For paid placements where 3:00 is too long a buy.
- **60-second version:** dare → 20s of stillness → "close your eyes" → one breath → chime. The challenge becomes *"one minute"* (*"Can't do 3? Start with 1."*).
- **30-second teaser:** the dare + timer only, cut before payoff: *"Full 3-minute challenge on our page. Bring headphones."* Drives profile visits to the hero Reel.
- **Series potential:** same format, rotating sanctuaries (waterfall / rain on leaves / still pond + lotus / golden-hour mist) — one recognizable challenge, endlessly repostable. *"Round 2. Harder than it looks."*

#### Production notes

- **Footage:** Sanctuary shot bank hero (mossy waterfall + mist). One continuous or invisibly-looped take; slow-motion water reads as premium and hypnotic. Film real (botanical garden, local waterfall) or license (Artgrid/Storyblocks; free: Pexels, Coverr — *"rainforest waterfall,"* *"misty jungle slow motion"*).
- **Audio:** natural water ambience throughout — no music until (optionally) a low swell in the last 15s. The chime must be clean and isolated.
- **Timer:** real-time and honest — do not skip time. Viewers will screen-record to verify; the honesty is part of the trust.
- **Text:** all overlays in the safe zone; brand colors; large enough for mute autoplay.
- **Breathing cue:** pair VO with the lotus breathing-belly animation so eyes-closed viewers get audio and eyes-open viewers get the visual.

#### Measurement

Primary: average watch time, completion rate (% reaching the chime), and completion-to-profile-visit rate. Secondary: 🪷 comments (self-reported completions = warmest retargeting pool), shares/sends (*"bet you can't do this"*), saves, and link-in-bio taps within 24h of posting. Success looks like completion rates far above the ~10% short-form norm — the dare structure should pull an unusually deep tail.

#### Brand fit

This concept operationalizes three lines already in the tagline bank: *"Stop the doomscroll. Start the bloom-scroll."* (the premise), *"Three minutes you do beats thirty minutes you don't."* (the proof), and *"Every pause is a rep for your resilience."* (the payoff). It is the **Chaos → Sanctuary** signature style with one twist — the chaos isn't on screen, it's the viewer's own thumb.

### Play Store Asset Requirements

| Asset | Spec |
|---|---|
| App name | Up to 30 characters (how it appears on Google Play). |
| Short description | Up to 80 characters. |
| Full description | Up to 4,000 characters. |
| App icon | PNG or JPEG, up to 1 MB, 512 × 512 px (have: Icon.png). |
| Feature graphic | PNG or JPEG, up to 15 MB, 1,024 × 500 px. |
| Phone screenshots | 2–8, PNG/JPEG, up to 8 MB each, 16:9 or 9:16; include 4+ at 1080px+ for promotion. |
| Tablet / Chromebook / XR | Additional screenshot sets per Google's size specs; optional promo and XR video via YouTube URL. |

---

## Part 9 · Production & Technical Reference

### Technology Stack

BE333 is a React Native / Expo mobile and web breathing-exercise and meditation app with biofeedback integration (Bluetooth heart-rate monitoring). It features the DEEP3 breathing technique, habit stacking, a 21-day practice journey, and social sharing. Real-time biofeedback analysis runs on Cloud Functions with Cloud Firestore (see Part 3, Biofeedback).

### Production Checklist

| Category | Deliverables |
|---|---|
| Core content | 6 core scripts; 60 self-compassion prompts; 50 mantras. |
| Stacks | Chanting: 4 scripts + audio. Prayer: 6 scripts + audio for 3. Journaling: 40 prompts. Poetry: 30 prompts. Day planning: 6 templates. Gratitude: 30 prompts. Mantras: 20 + audio for 6. |
| Guidance | How-to: 8 cards + 2 micro-audios. Awards: 15 badges with rules and lines. Notifications: 26 lines (12 reminders, 8 nudges, 6 restart). |
| Media | Bells (start/mid/end); background loops (stream, birdsong, room tone); award chime; lotus + chakra visuals; icons (chant, stretch, prayer, journal, poetry, plan, gratitude, mantra); empty-state art. |

### QA Scenarios to Script

- New-user onboarding (habit-link setup for all three daily times).
- Streak-break flow (missed sessions never erase petals; user resumes at any time).
- Habit-linking awards and habit-stack completion.
- Offline mode and sync conflicts.
- Export **My Work**; biofeedback device connect/disconnect.

### Awards & Milestones Reference

**Core milestones**

- **Day 1:** First petal opened — rule: 3 sessions in one day.
- **Day 3:** A routine begins — rule: 9 sessions across 3 days.
- **Week 1, Halfway, Day 19, Day 21 Completion:** friendly lines tailored to each.

**Acceptance & self-kindness awards**

- **Practiced on a Hard Day:** user toggles a difficult day + completes a core session.
- **Came Back After a Break:** completed the first day after a rest.
- **Gentle Choice:** completed any one session when earlier reminders were missed.

**Habit-linker awards**

- **Two-in-a-Row:** core + 1 add-on in the same block.
- **Triple Flow:** core + 2 add-ons.
- **Full Bloom:** core + 3 add-ons.
- **Mindful Creator:** 5 entries in My Work in 7 days.
- **Gratitude Streak:** gratitude entry daily for 7 days.

**Copy examples** (10–14 words max): "You came back. That's courage." · "Petal by petal, you're growing a habit."

### Legal & Web Pages

- **Website:** be333.online
- **Delete account:** be333ag.web.app/delete-account.html
- **Privacy policy:** be333ag.web.app/privacy-policy.html

---

## Glossary of Core Terms

| Term | Definition |
|---|---|
| BE Practice | The 21-day container for the program. |
| BE Pause | One 3-minute practice session (3 scheduled per day). |
| Bloom Day | A day with all 3 Pauses completed. |
| Bloom Petal | Earned for each Bloom Day; shown on the Lotus Bloom Map. |
| Lotus Bloom Map | The visual progress display of Bloom Petals and chakras. |
| Rest Day | A day with too many Missed Pauses; no petal added, nothing erased. |
| Missed Pause / Missed Session | A skipped practice moment. |
| BE Buddy Challenge | Optional two-player accountability layer over a BE Practice. |
| BE Buddy Board | Shared progress view between two Buddies. |
| BE Guide | A linked therapist, coach, or mental-health professional. |
| BE Guide View / Sneak Peek | The therapist-facing view and the shared progress report. |
| Habit linking | Tying a BE Pause to an existing habit (anchor). |
| Habit stacking | Adding another 3-minute activity after the core session. |
| DEEP3 | Optional three deep ignition breaths at the start of a session. |
| My Work | Personal archive of everything you've written across BE Pauses. |
| Writing Category | The tag each entry carries: Insight Diary, Insightful Notes, Inspiring Messages, or Self-Advice. |

---

**BE333 — Pause. Breathe. Be.**
*End of Master Manual*
