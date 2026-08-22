# BE333

**Pause. Breathe. Be333.** — a mindfulness-tracking app that guides short, sustainable daily practice: 3 minutes, 3 times a day, for 3 weeks. Built as a React Native / Expo Router app, deployed as a web PWA on Firebase Hosting and (eventually) as native apps on iOS/Android.

- **Live site:** https://be333.app
- **Firebase project:** `be333ag`
- **Deployment:** Firebase Hosting
- **Owners:** [@Raydar14](https://github.com/Raydar14) and Raychel Powers

---

## What BE333 is

A daily-practice product with a few pillars:

- **BE Pauses** — three 3-minute breathing sessions a day (Rise / Rest / Relax), with a 21-day "Lotus Bloom" progression.
- **Habit stacks** — chanting, prayer, journaling, poetry, day-planning, gratitude, mantra, stretching, yoga — each with structured prompts or step-by-step cues.
- **Learn** — how-to guides, 60-second SOS scripts, trauma-sensitive grounding scripts.
- **BE Guide (therapist product)** — clinicians can link with clients (with consent) and see practice-cadence summaries, take private per-client notes, and manage invitations. Free tier can browse; the Pro tier (via RevenueCat) unlocks client capacity.
- **BE Buddy** — pair with another user and hold each other accountable across a "Round" of practice.

The **Master Manual** at `docs/MASTER_MANUAL.md` is the source of truth for terminology, tone, pricing, and product decisions. When code and Manual diverge, the Manual wins.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 52 |
| Router | [Expo Router](https://docs.expo.dev/router/introduction/) v4 (file-based, static rendering enabled) |
| Language | TypeScript |
| UI | React Native + `react-native-web` for the browser build |
| Auth | Firebase Auth (email/password + Google + phone/SMS) |
| Data | Firestore (`users/{uid}/…` collections) |
| Storage | Firebase Storage (gratitude photos, etc.) |
| Payments | [RevenueCat](https://www.revenuecat.com/) for subscription entitlements |
| Analytics | Google Analytics 4 (`G-2RSMKC21N0`) + Microsoft Clarity (`xwdgl8puwu`) |
| Hosting | Firebase Hosting (`be333ag` project); custom domain `be333.app` |

Root config lives in `app.json`, `firebase.json`, `.firebaserc`.

---

## Repository layout

```
app/                 Expo Router routes (file → URL mapping)
  (auth)/            /login, /signup (grouped, doesn't appear in URL)
  onboarding/        First-run flow
  guide/             BE Guide (therapist) screens
  history/           Session history + trends
  habit-stack/       Habit-stack selection + per-stack timer
  +html.tsx          Root HTML template — Google Analytics + Clarity tags live here
components/          Reusable UI (Button, Input, FormMessage, PaywallModal, …)
constants/           Colors, tokens
content/             Static content (notification copy, mantras, prompts, how-to cards)
contexts/            React context providers (Auth, Purchase, …)
docs/                Master Manual + supporting docs
hooks/               useBePractice, useBeGuide, useCoupon, etc.
legal/               Draft legal documents (Privacy, Terms, Disclaimers)
lib/                 Firebase init, error mappers, small utilities
migrations/          One-time Firestore data migrations
services/            BellService and other side-effect wrappers
brand/               Brand assets (logos, colors, marketing kit)
dist/                Firebase Hosting deploy target (build output, tracked)
TODO.md              Living punch list — update as items ship
```

---

## Getting set up (per developer, one-time)

You'll need:
- **Node.js** 20+ and **npm** 10+
- **Git** with your identity configured (`git config --global user.name`, `user.email`)
- A copy of `.env` with the Firebase config values (see below — ask an owner if you don't have it)

Then, in the project root:

```powershell
npm install
```

### The `.env` file

Never commit this. It lives locally on each developer's machine and holds the Firebase / reCAPTCHA credentials for the deployed environment:

```
EXPO_PUBLIC_FIREBASE_API_KEY=…
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=be333ag.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=be333ag
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=be333ag.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
EXPO_PUBLIC_FIREBASE_APP_ID=…
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2RSMKC21N0
# Optional: enables App Check on the client. Leave unset unless the
# corresponding reCAPTCHA v3 site key is registered in Firebase Console
# → App Check → Apps → your web app.
# EXPO_PUBLIC_RECAPTCHA_V3_SITE_KEY=6Lc…
```

Values come from Firebase Console → Project settings → Your apps → Web app → SDK setup and configuration.

---

## Common commands

```powershell
# Start the local dev server (web)
npm run web

# Build the production web bundle → dist/
npm run build

# Deploy dist/ to Firebase Hosting
npm run deploy
```

**Deploy cycle:** `git pull origin main → npm run build → npm run deploy`. `npm run deploy` alone re-uploads whatever's already in `dist/`; without a fresh `build`, code changes on `main` won't reach the live site.

---

## Development workflow (branch protection + PR flow)

`main` is protected. Nothing goes into `main` except through a pull request with at least one approval.

### To make a change

```powershell
# 1. Start from the latest main
git checkout main
git pull origin main

# 2. Branch off with a descriptive name
git checkout -b feature/short-description
# or fix/…, chore/…, docs/…

# 3. Edit → commit → push
git add .
git commit -m "Clear summary of what changed"
git push -u origin feature/short-description
```

`git push` prints a "Create pull request" URL. Open it, fill in the PR template (auto-loaded from `.github/pull_request_template.md`), and submit.

### To review

- Open the PR → **Files changed** tab → read the diff.
- Leave inline comments on lines you want to discuss.
- **Review changes** button → **Approve** / **Request changes** / **Comment**.

### To merge

Only squash merging is enabled. Once at least one non-author approval is in, click **Squash and merge** → confirm → **Delete branch**. GitHub also auto-deletes merged branches per repo settings.

### Rules

- Nobody merges their own PR without another approval.
- Small PRs beat large PRs — one intent per PR.
- Auto-generated files (`dist/*`, `.expo/types/router.d.ts`) that get regenerated by `npm run build` are safe to overwrite; use `git reset --hard HEAD` if you're stuck on a pull because of them.

More detail in `TODO.md` → "Git & repo housekeeping".

---

## Legal & compliance

BE333 collects identifiable user data (email, display name, practice history, optional heart-rate samples, optional therapist notes, optional gratitude photos), serves mental-health-adjacent content, and is reachable from the EU/UK. That surface has legal requirements.

**Draft legal documents live under `legal/`. All are drafts and MUST be reviewed by a qualified attorney before publishing to the live site.** The drafts capture the factual side (what data the app collects, which trackers fire, which third parties process what) so an attorney can focus on jurisdictional and defensibility questions rather than reconstructing the technical facts.

| Document | Path | Status |
|---|---|---|
| Privacy Policy | `legal/PRIVACY.md` | Draft |
| Terms of Service | `legal/TERMS.md` | Draft |
| Disclaimers (medical, emergency, therapist self-attestation) | `legal/DISCLAIMERS.md` | Draft |
| Legal docs README + review checklist | `legal/README.md` | Draft |

### Requirements the app currently satisfies

- **BE Guide HIPAA acknowledgment** — therapist-role signup requires a checkbox confirming BE333 is a wellness-tracking tool, not a HIPAA-covered service.
- **License field is self-attested** — noted in-app and in the Manual as unverified.
- **Client sharing consent** — the `shareWithGuide` toggle defaults on but is explicit; the guide sees "Sharing paused" when a client turns it off.

### Requirements not yet in place

- **Publishable Privacy Policy** at a public URL, linked from every entry point (login, signup, footer, app-store listings when applicable). *Draft: `legal/PRIVACY.md`.*
- **Terms of Service** shown at signup (checkbox + link). *Draft: `legal/TERMS.md`.*
- **Cookie / tracker consent** before Google Analytics and Microsoft Clarity fire, for EU/UK visitors. Currently both trackers fire on every page load with no gate. Tracked in `TODO.md`.
- **Medical / emergency disclaimer** — the meditation, breathing, and grounding content is wellness education, not medical advice; the app must point users at crisis lines (988 in the US, 116 123 in the UK, etc.) when the content touches acute distress. *Draft: `legal/DISCLAIMERS.md`.*
- **Data subject request flow** — GDPR/CCPA require an accessible way to request access to, export of, or deletion of personal data. Firebase Auth + Firestore make this technically feasible; the process needs to be documented and reachable (support email or Settings screen).
- **COPPA / minor consent** — BE333 currently has no age gate. If US users under 13 or EU users under 16 (varies by member state) could sign up, verifiable parental consent is required. Either add an age gate at signup or state minimum age in Terms and refuse minors.
- **App Store / Play Store metadata** — when native apps ship, both stores require a public privacy policy URL, data-collection declarations, and (for App Store) a signed developer agreement.

See `legal/README.md` for the full checklist.

---

## Deploy configuration reference

- **Firebase project:** `be333ag`
- **Hosting public directory:** `dist/`
- **Rewrites:** all paths → `/index.html` (SPA-style client-side routing)
- **Custom domains:** `be333.app`, `be333ag.web.app`, `be333ag.firebaseapp.com`
- **Auth authorized domains:** must include every domain the app is served from. Missing entry produces `auth/unauthorized-domain` on Google Sign-In.
- **App Check (currently unenforced for Auth):** if enforcement is turned back on in Firebase Console, `EXPO_PUBLIC_RECAPTCHA_V3_SITE_KEY` must be set in `.env` AND the corresponding reCAPTCHA v3 provider must be registered under App Check → Apps → the web app (with site key AND secret). Without both, every auth call 401s with `firebase-app-check-token-is-invalid`.

---

## Contact

For product, brand, or content questions: open an issue on this repo and tag [@Raydar14](https://github.com/Raydar14).

For security concerns (please do not open a public issue): email the address in `SECURITY.md`.
