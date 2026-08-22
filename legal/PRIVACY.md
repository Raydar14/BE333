# BE333 — Privacy Policy

> **⚠️ DRAFT — attorney review required before publishing.**
> The technical facts (what data is collected, which processors are used) are drawn from the actual codebase and should be accurate. Jurisdictional language, exact retention windows, dispute mechanisms, and the age policy need a lawyer's decision.

**Effective:** _[Set date on publish]_
**Version:** _0.1 (draft)_

---

## 1. Who we are

BE333 ("**BE333**," "**we**," "**us**") is a mindfulness-tracking product operated by _[legal entity name and address to be inserted]_. This Privacy Policy explains what personal information we collect when you use the BE333 web app at [https://be333.app](https://be333.app) (the "**Service**"), how we use it, who we share it with, and the choices you have.

For questions about this policy or to exercise a privacy right, contact **[privacy@be333.app]** _(placeholder — attach a monitored inbox before publishing)_.

## 2. Scope

This policy covers the Service — the BE333 web app and its underlying Firebase project — including the following features:

- **Member experience:** BE Pauses (breathing sessions), habit stacks (chanting, prayer, journaling, poetry, day-planning, gratitude, mantra, stretching, yoga), Learn/how-to/SOS content, session history, and BE Buddy pairings.
- **BE Guide (therapist) experience:** clinicians who sign up as a "Therapist" role and, with client consent, view practice-cadence summaries for linked clients and record private per-client notes.
- **Optional paid features** delivered through RevenueCat (subscriptions) or coupon codes.

This policy does *not* cover: any third-party website you reach by clicking a link out of the Service; the separate WordPress content / marketing site (if any) which has its own policy; App Store or Play Store data collection when native apps are eventually distributed.

## 3. Information we collect

### 3.1 Information you provide directly

- **Account information:** email address, display name, password (stored only as a hash by Firebase Auth — we never see the plain-text value), and — if you sign in with Google — your Google account email and profile name.
- **Role designation:** whether you signed up as a **Member** or a **Therapist**.
- **Therapist-only self-attested fields:** license or registration number (e.g., "LMFT #12345, CA") and a required acknowledgment that BE333 is a wellness-tracking tool and not a HIPAA-covered service. The number is *not verified* by BE333 — it is displayed to prospective clients solely to help them decide whether to link.
- **Practice content you create:** journaling entries, poetry entries, day plans, gratitude entries (including any photos you attach), your BE Buddy pairing, any "Letter to Yourself," and any invite codes you generate.
- **Optional biometric samples during a session:** if you connect a Bluetooth heart-rate monitor, per-session heart-rate and heart-rate-variability sample arrays are recorded under `users/{uid}/sessions/{sessionId}` in Firestore.
- **EMA check-in responses** on session completion: a three-tap stress / mood / focus rating plus a one-word capture.
- **Client-linkage data (BE Guide):** if you are a Member and link a Guide, we store the guide's email/UID on your user document and default `shareWithGuide=true`. If you are a Guide, we store your active invite code and the UIDs of linked clients. Guides can record private per-client notes visible only to themselves.
- **Support communications** you send us.

### 3.2 Information collected automatically

- **Session / usage telemetry** collected by Google Analytics 4 (measurement ID `G-2RSMKC21N0`): page views, session duration, general geolocation (city-level, IP-derived), device / browser / OS, referral source, and standard GA4 events.
- **Session replays and heatmaps** collected by Microsoft Clarity (property `xwdgl8puwu`): recordings of your mouse movements, clicks, taps, and page interactions. Clarity may capture the visible content of the page other than fields marked sensitive by our code.
- **Firebase Authentication metadata:** last sign-in time, creation time, verified email flag.
- **Firestore server-side timestamps** on documents you write.
- **Push and local notification tokens** (if you accept notification permission on a supported device).

### 3.3 Information from third parties

- **Google Sign-In:** if you use Sign in with Google, we receive your Google account email, name, and (optionally) profile picture URL.
- **RevenueCat / stores:** when you subscribe or redeem a purchase, RevenueCat and the underlying store (Apple, Google, or Stripe) share your entitlement status, tier, and subscription lifecycle events with our system so we can grant Pro / Lifetime features.

### 3.4 We do not knowingly collect

- Payment card numbers. Card entry happens inside the store (Apple, Google) or a payment-processor page (Stripe / RevenueCat's checkout) and never touches BE333 servers.
- Government identifiers, precise geolocation, contacts, or microphone audio.
- Health information beyond what you voluntarily attach to sessions (optional heart-rate samples).

## 4. How we use your information

We use the information we collect to:

- **Provide the Service** — authenticate you, save your practice, sync between devices, deliver notifications you enabled.
- **Enable the BE Guide relationship** — surface a linked client's practice-cadence summary to the guide they chose to link. The current app also exposes a `shareWithGuide` toggle that surfaces a *"Sharing paused"* warning to the guide, but as of this document's version the underlying practice data still reaches the guide when the toggle is off; server-side enforcement is a known gap tracked as engineering work. Until that is fixed, do not treat the toggle as a hard cut-off — unlink the guide if you want to fully stop the flow.
- **Improve the product** — Google Analytics for aggregate usage patterns, Microsoft Clarity for session-level UX diagnostics.
- **Communicate with you** — transactional emails (password reset, subscription receipts), and — if you opt in — product updates.
- **Ensure security and prevent abuse** — Firebase Auth's built-in rate limiting, App Check (when enforced), reCAPTCHA on phone auth, and standard log-based anomaly detection.
- **Comply with law** — respond to lawful requests, enforce our Terms, defend against claims.

### Legal bases (GDPR / UK-DPA)

For users in the EU/UK/EEA, we rely on the following bases:

- **Performance of a contract** — creating your account, running the sessions, remembering your progress.
- **Consent** — analytics + session-replay trackers (once we ship the consent gate — currently pending; see `TODO.md`); marketing communications; optional biometric samples.
- **Legitimate interests** — securing the Service, preventing fraud, aggregate product analytics (where consent is not required).
- **Legal obligation** — responding to subpoenas, tax records for paid subscriptions.

## 5. Sensitive data

The following categories deserve special notice:

- **Health-adjacent content** — your journal entries, mood check-ins, meditation prompts you engage with, and optional heart-rate samples may reveal information about your mental or physical state. We treat these as sensitive and do not use them for advertising, do not sell them, and store them only in your own user-scoped Firestore paths.
- **Therapist-client relationship data** — the fact that Client A is linked with Guide B is stored in Client A's user document (`linkedGuideUid`) and is visible only to Guide B (via a query where `linkedGuideUid == guide's uid`). Guide-side private notes about a client are stored under the guide's own subcollection (`users/{guideUid}/clientNotes/{clientUid}`) and are not visible to the client.
- **Letter to Yourself** — the reflective letter written during onboarding is stored on your user document and is explicitly *not* visible to any BE Guide you link.

## 6. Who we share information with

We do not sell your personal information. We share it only with:

- **Processors that run the Service on our behalf** under written data-processing terms:
  - **Google / Firebase** — Auth, Firestore, Storage, Hosting, Analytics.
  - **Microsoft Clarity** — session replays and heatmaps.
  - **RevenueCat** — subscription entitlement management.
  - **Apple / Google Play / Stripe** — payment processing.
  - **Google reCAPTCHA** — bot mitigation on phone auth and (when enabled) App Check.
- **Other users, only as directed by you** — a BE Guide you link (see the note in Section 4 about `shareWithGuide` and the recommended "unlink" path), a BE Buddy you accept, or content you export via the Share feature.
- **Legal recipients** — when required by valid legal process, or to protect the rights, safety, and property of BE333, our users, or others.
- **Successors** — if BE333 is involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction. We will notify you before your information becomes subject to a materially different privacy policy.

We do not use your personal information for third-party advertising and do not participate in cross-context behavioral advertising as defined under US state privacy laws.

## 7. International data transfers

Firebase and Microsoft Clarity process data in multiple regions, including the United States. For users in the EU / UK / EEA, transfers outside your region are covered by Standard Contractual Clauses (SCCs) or equivalent safeguards provided by the respective processors.

## 8. How long we keep your data

- **Account and practice data** — retained for as long as your account is active. If you delete your account, we delete or de-identify your user-scoped Firestore data within _[N]_ days _(attorney and engineering to align on a specific number)_.
- **Firebase Auth records** — deleted on account deletion.
- **BE Guide notes about a linked client** — remain the guide's records unless the guide deletes the note.
- **Analytics data (GA4, Clarity)** — retained per each provider's default retention (currently 14 months for GA4 events; adjustable in the console).
- **Backups and legal-hold copies** — may persist for a limited period beyond deletion for disaster recovery or legal preservation obligations.

## 9. Your rights

Depending on where you live, you may have the right to:

- **Access** the personal information we hold about you.
- **Correct** inaccurate information.
- **Delete** your information, subject to limited exceptions (e.g., fraud investigations).
- **Export** a copy of your information in a portable format.
- **Object to or restrict** certain processing.
- **Withdraw consent** where processing is based on consent (this does not affect the lawfulness of processing before withdrawal).
- **Lodge a complaint** with your local data-protection authority (e.g., the ICO in the UK, a supervisory authority in an EU member state, the California AG's office).

### How to exercise a right

Email **[privacy@be333.app]** with the request and enough detail for us to verify your identity (typically the email associated with your account). We will respond within the time frame required by applicable law.

We will not discriminate against you for exercising a privacy right.

## 10. Children

BE333 is not directed to children. We do not knowingly collect personal information from children under _[13 in the US / 16 in most of the EU — attorney to decide policy]_. If you believe a child has provided us with personal information, contact **[privacy@be333.app]** and we will delete it.

## 11. Cookies and tracking technologies

We use:

- **Strictly necessary storage** — Firebase Auth session tokens and local state required for the app to function; not subject to consent.
- **Analytics cookies** — set by Google Analytics 4 (`_ga`, `_ga_G-2RSMKC21N0`) to aggregate usage.
- **Session-replay cookies** — set by Microsoft Clarity to record UX sessions.

Where legally required (EU / UK / EEA), we will present a consent banner before setting analytics or session-replay cookies. You can also block trackers in your browser or extension of choice.

## 12. Security

We rely on Firebase's platform security (encrypted transit and at-rest, hashed passwords, region isolation), Firestore security rules to scope data access per user, App Check (when enforced) to reject non-app traffic, and reCAPTCHA on phone authentication. No system is perfectly secure. If we become aware of a breach involving your personal information, we will notify you and any required regulators within the time frames required by applicable law.

Report a suspected vulnerability via `SECURITY.md` in the repository (or the contact listed there).

## 13. Changes to this policy

We may update this policy from time to time. If a change is material, we will notify you by email and/or by an in-app banner before the change takes effect. The effective date at the top of this document indicates the most recent version.

## 14. Contact

**Privacy inquiries:** [privacy@be333.app] _(placeholder)_
**Postal address:** _[legal-entity address to be inserted]_
**EU / UK representative:** _[to be appointed if required — attorney to confirm]_
