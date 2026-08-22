# BE333 — Legal Documents

> **⚠️ These are DRAFTS. Every document in this folder must be reviewed and revised by a qualified attorney before it is published to the live site, shown to a user, or referenced in an App Store / Play Store listing. The drafts capture the technical facts of what the app does; a lawyer supplies jurisdictional accuracy, defensibility, and appropriate risk allocation.**

## Why this folder exists

BE333 collects identifiable user data, serves mental-health-adjacent content, offers a therapist tier, and reaches users across multiple jurisdictions (US + custom domain accessible from EU / UK). That surface triggers legal obligations under, at minimum:

- **US federal:** COPPA (users under 13), CAN-SPAM (transactional email), FTC Act §5 (unfair/deceptive practices), possibly HIPAA (if the therapist tier ever crosses into covered activity — currently it does not).
- **US state:** CCPA / CPRA (California), CDPA (Virginia), CPA (Colorado), CTDPA (Connecticut), UCPA (Utah), plus emerging equivalents.
- **EU / UK:** GDPR, UK-DPA 2018, ePrivacy Directive (cookies + trackers).
- **App stores (if native apps ship):** Apple App Store Review Guidelines §5 (Legal), Google Play Data Safety declarations.
- **Payments:** the RevenueCat / underlying store terms (Apple, Google, Stripe) impose additional disclosure and refund requirements.

## Documents in this folder

| File | Purpose | Ships to users where |
|---|---|---|
| `PRIVACY.md` | What data BE333 collects, why, who it's shared with, how long it's kept, user rights, contact for requests. | Public URL (e.g. `be333.app/privacy`), linked from signup, footer, app-store listings. |
| `TERMS.md` | User agreement — accounts, acceptable use, subscription terms, IP, disclaimers, limitation of liability, dispute resolution. | Signup checkbox with link; footer link; app-store listings. |
| `DISCLAIMERS.md` | Medical / mental-health disclaimer, emergency resources, therapist self-attestation clarifications, "not therapy" language. | In-app screens (Onboarding, Learn/SOS/Grounding tabs), Privacy & Data screen, footer. |

## Review checklist for the attorney

- [ ] Confirm the enumerated data categories in `PRIVACY.md` match what the app actually stores. Cross-check against Firestore collections, Firebase Auth fields, Storage buckets, and the trackers in `app/+html.tsx`.
- [ ] Confirm the list of third-party processors is complete and each has a valid data-processing agreement (DPA) in place: Firebase (Google), RevenueCat, Google Analytics, Microsoft Clarity, reCAPTCHA (Google), Stripe (if used directly).
- [ ] Confirm the retention periods stated match what actually happens. Firestore data currently persists indefinitely; if you commit to a retention window in the policy, engineering needs a cron/Cloud Function to enforce it.
- [ ] Add jurisdictional sections required for your target markets — California-specific rights disclosures, GDPR Article 13/14 notices, UK-specific ICO contact, etc.
- [ ] Set the governing law and dispute forum in `TERMS.md` — currently placeholder.
- [ ] Set the liability cap in `TERMS.md` — currently placeholder.
- [ ] Decide the age policy (US 13+, EU 16+, or global 18+) and enforce it consistently: signup age gate + Terms language + Privacy language.
- [ ] Decide whether to require an arbitration clause + class-action waiver. If yes, add appropriate notice + opt-out language per state.
- [ ] Confirm the "not therapy / not medical advice" language in `DISCLAIMERS.md` is strong enough. Given the BE Guide tier features a licensed clinician relationship, extra care may be needed here.
- [ ] Confirm the crisis-line resources in `DISCLAIMERS.md` are current and comprehensive for the markets served.

## Publishing checklist (post-attorney-review)

- [ ] Attorney has signed off in writing on each document.
- [ ] Documents are converted to public web pages at stable URLs (e.g. `be333.app/privacy`, `be333.app/terms`, `be333.app/disclaimers`). Consider a static route in Expo Router (`app/legal/privacy.tsx` etc.) that renders the Markdown content.
- [ ] Signup form includes a checkbox: *"I agree to the [Terms of Service] and [Privacy Policy]"*. Cannot submit without ticking it. Store `termsAgreedAt` and `privacyAgreedAt` timestamps on the user doc.
- [ ] Footer of every screen links to Terms + Privacy.
- [ ] Every marketing / landing page (`be333.app` root, WordPress content site, social bios) links to the Privacy Policy.
- [ ] A version-stamp is embedded at the bottom of each document (e.g. *"Effective 2026-08-15. Version 1.0."*) so future changes can be communicated to users.
- [ ] A material-change process is defined: how users get notified when Terms or Privacy change (email + in-app banner is the standard).
- [ ] Data-request contact (`privacy@be333.app` or similar) is monitored by a real human and has a response SLA documented.
- [ ] App Store Privacy details (iOS) and Play Console Data Safety form (Android) are filled in consistently with the Privacy Policy.
