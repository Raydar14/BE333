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

### Social Layer — the BE Buddy Challenge

A BE Buddy Challenge sits on top of a BE Practice. The Practice stays the same; the Challenge adds a two-player layer of accountability and playful competition.

- **Invite flow:** from the main Practice screen, "Invite a BE Buddy." Text or email a friend; if they accept, the two Practices link and each can see the other's progress on a shared Buddy Board.
- **Rules:** both are in the same 21-Day BE Practice with the same daily goal (3 BE Pauses). Each person is allowed 3 Missed Sessions for the whole Challenge. After a 3rd Missed Session, that person loses the Round — their Practice continues, but the Round goes to their Buddy.
- The lotus rules are unchanged: Bloom Days still earn petals, and petals are never removed.
- When a Round ends, offer a rematch on the next Practice ("Start a new BE Buddy Round").

### Therapist Layer — the BE Guide View

Therapists get a role name and a feature that fit the app. The therapist role inside BE333 is a **BE Guide**; the feature is the **BE Guide View** (or Guide View); the client action is **"Link a BE Guide."** This lets a therapist track a client's mindfulness homework live, without paper or emails — a primary reason the app was designed.

- **Account type:** at sign-up, "I am a BE Guide (Therapist, Coach, or Mental Health Professional)" sets the account to receive Sneak Peek reports from clients.
- **Continuous sharing:** when on, the BE Guide receives regular Sneak Peek updates (Bloom Days and Missed Pauses). Can be turned off anytime.
- **On-demand report:** "Send a Sneak Peek Report Now" sends a one-time report with the Lotus Bloom Map and a recent Practice summary.
- **Guide requests:** when continuous sharing is off, the BE Guide can request a Sneak Peek. The client always sees and approves any report before it is sent.
- **Framing:** this is a conversation starter about how mindfulness is fitting into a client's life, not a performance score.

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
| "Habit linking" | A marketing term, not a scientific one. The academic concept is **implementation intentions** ("if-then" planning), pioneered by Peter Gollwitzer (1999). Deciding when and where you will act dramatically increases success; habits are context-dependent, so linking to a stable existing cue works. |
| Is meditation beneficial? | Yes. Beyond surveys, neuroimaging shows it physically alters brain structure (neuroplasticity) and reduces inflammation. Goyal et al. (2014, JAMA Internal Medicine) found moderate, reliable evidence that meditation reduces anxiety, depression, and pain. Lazar (2005) and Hölzel (2011) showed increased cortical thickness and gray-matter density after 8 weeks of MBSR. |
| "Habit stacking" | Coined by S.J. Scott (2014); the method was formalized earlier by BJ Fogg as "Anchoring" (Tiny Habits) and popularized by James Clear (Atomic Habits). It works via synaptic pruning: the brain grafts a new habit onto an existing "super-highway" rather than building a dirt road. Lally (2010) "66 days" study found cue consistency is the biggest factor in automaticity. |
| Is peer accountability effective? | Yes, but ignore the mythical "95% ASTD" statistic. Real research shows accountability works via the Köhler Effect (we work harder in a group to avoid being the weak link). Wing & Jeffery (1999) found people who joined with friends had far higher completion rates. |
| Does breathing impact mental health? | Yes. Balban & Huberman (2023) showed 5 minutes of cyclic sighing outperformed mindfulness meditation for mood and respiratory rate. Breathing-based practice is validated even for PTSD (Seppälä, 2014). |
| Benefits of being in nature | Nature restores directed attention (Attention Restoration Theory). Ulrich (1984) found patients with a view of trees recovered faster; Bratman (2015) showed a nature walk reduced activity in the brain region tied to depressive brooding. |
| Is biofeedback helpful? | Yes. HRV biofeedback bridges the mind-body gap by making calm measurable; high HRV is a biomarker for stress resilience. Meta-analysis (Goessl, 2017) confirmed a large effect size for reducing stress and anxiety. |
| Motivation vs. habits | Motivation is for starting; habit is for continuing. Intrinsic motivation (autonomy) creates stronger habits than external rewards or pressure. Relying on willpower long-term is a failing strategy (Wood & Rünger, 2016). |
| Guilt, shame & reinforcement | Shame is toxic to habits — it triggers the "what-the-hell effect" (Abstinence Violation Effect). Guilt ("I did a bad thing") can be reparative, but shame ("I am bad") leads to withdrawal and relapse. Self-compassion after a slip makes people try harder next time (Breines & Chen, 2012). |
| How to bounce back | Use the Fresh Start Effect (a temporal landmark) plus coping planning (planning for failure). Separate identity from failure: viewing a slip as a "lapse" rather than a "relapse" is the key to getting back on track (Marlatt). |

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

**Example closing lines** (mix and reuse): "I showed up for myself today." · "I can begin again at any moment." · "My breath is a safe place to rest."

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

### Global Content Standards

- **Reading level:** 6th grade. **Tone:** gentle, encouraging, nonjudgmental.
- **Lengths:** 45–75 spoken words per minute; 3-minute tracks ≈ 180–220 words.
- **Voiceover:** warm, clear, neutral accent; room tone; no reverb; -16 LUFS; WAV 48kHz/24-bit; filenames kebab-case.
- **Text style:** present-tense, short sentences, plain language.
- **Accessibility:** every audio has an on-screen transcript; all visuals have alt text; color contrast meets AA.
- **Sound design:** bells (start, midpoint, end) distinct but soft, file set at -12 dBFS peaks; background loops (stream, birdsong, room tone) seamless over 3 minutes; award chime gentle and brief (under 400 ms).

---

## Part 6 · 3-Minute Yoga Vinyasa Manual

For clarity, calm, and energy. These short flows complete in three minutes or less — ideal for busy days, mid-task resets, or centering before teaching. Each sequence targets a specific wellness goal and uses intentional, breath-linked movement.

### Sun Salutation A (Surya Namaskar A)

**Purpose:** full-body energizing and mental focus. **Time:** ~3 minutes (both sides). One round = both right and left sides.

1. Tadasana (Mountain Pose) — inhale, ground and center.
2. Urdhva Hastasana (Upward Salute) — inhale, arms rise.
3. Uttanasana (Forward Fold) — exhale, fold from hips.
4. Ardha Uttanasana (Halfway Lift) — inhale, lengthen spine.
5. Plank → Chaturanga — exhale, step back and lower.
6. Cobra or Upward Dog — inhale, lift chest.
7. Downward Dog — exhale, hold 3 breaths (~30 sec).
8. Step forward → Halfway Lift — inhale.
9. Forward Fold — exhale.
10. Urdhva Hastasana — inhale, rise.
11. Tadasana — exhale, return to center. Repeat with the opposite leg for step back/forward.

| Segment | Duration |
|---|---|
| Tadasana + centering breath | 10 sec |
| Flow to Downward Dog | ~60 sec |
| Hold Down Dog | ~30 sec |
| Return to Tadasana | ~60 sec |
| **Total (1 round)** | **~3 min** |

### Vinyasa 1 · Clear the Mind

**Purpose:** mental clarity, light energy boost. **Time:** ~2.5 minutes.

1. Tadasana — centering breath (15 sec).
2. Urdhva Hastasana → Uttanasana → Halfway Lift → Plank → Chaturanga → Upward Dog → Downward Dog — flow, 1 breath per pose (~60 sec).
3. Downward Dog hold — 3 breaths (~30 sec).
4. Step forward → Halfway Lift → Forward Fold → Urdhva Hastasana → Tadasana (~45 sec).

### Vinyasa 2 · Nervous System Reset

**Purpose:** calm the mind and body, relieve stress. **Time:** ~2.5–3 minutes.

1. Easy Seat (Sukhasana) — breathwork or Gyan Mudra (30 sec).
2. Cat-Cow (5 rounds) — slow breath and movement (60 sec).
3. Thread the Needle (right + left) — ~40 sec per side.
4. Child's Pose — rest and ground (20–30 sec).

### Vinyasa 3 · Root & Rise

**Purpose:** grounding, strength, confidence. **Time:** ~3 minutes.

1. Tadasana — breath and intention (15 sec).
2. Chair Pose (Utkatasana) — hold 20–30 sec.
3. Forward Fold → Step to Warrior II (right) — ~30 sec.
4. Reverse Warrior (right) — 30 sec.
5. Wide-Leg Forward Fold (Prasarita) — 30 sec.
6. Warrior II + Reverse Warrior (left) — 30 sec.

### Teaching & Practice Tips

- Use 1-breath-per-pose cueing for faster pacing.
- Slow the breath or hold poses longer for more grounding.
- Modify or shorten if time or mobility is limited (e.g., skip the second side).
- These flows are ideal for class openings, work breaks, or evening resets.

### Core Pose Reference (for illustration)

| Group | Poses |
|---|---|
| Standing & transition | Tadasana (Mountain), Urdhva Hastasana (Upward Salute), Uttanasana (Forward Fold), Ardha Uttanasana (Halfway Lift), Chair (Utkatasana). |
| Flowing & strength | Plank (Phalakasana), Chaturanga Dandasana, Upward-Facing Dog, Cobra (Bhujangasana). |
| Inversions & downward | Downward-Facing Dog (Adho Mukha Svanasana), Child's Pose (Balasana), Thread the Needle. |
| Warrior & grounding | Warrior I & II (Virabhadrasana), Reverse Warrior, Wide-Leg Forward Fold (Prasarita). |
| Seated & centering | Easy Seat (Sukhasana), Seated Twist (Ardha Matsyendrasana), Tree (Vrksasana), Hero's Pose (Virasana). |

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

**Reasons it works (for copy)**

- 3 minutes is short enough to be realistic but long enough to shift the nervous system.
- Frequent repetition creates new neural pathways for calm and focus.
- Habit linking ties practice to existing daily actions, increasing consistency.
- Self-compassion prompts improve emotional resilience and reduce self-criticism.

### Taglines

| Primary | Supporting |
|---|---|
| Pause. Breathe. Be. | Microdose peace. |
| Three minutes. Three times. Three weeks. | Small moments. Real change. |
| Begin again, gently. | Make mindfulness a habit. |
| Petal by petal, you bloom. | Practice peace three times a day. |

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
