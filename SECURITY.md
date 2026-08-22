# Security Policy

## Reporting a vulnerability

If you believe you've found a security vulnerability in BE333 — the web app at [be333.app](https://be333.app), the Firebase project `be333ag`, or the source in this repository — please report it privately rather than opening a public issue or pull request.

**Preferred channel:** email **[security@be333.app]** *(placeholder — a monitored inbox is being set up; until it is live, email the address in [`legal/PRIVACY.md`](./legal/PRIVACY.md#14-contact) with the subject line "SECURITY REPORT" and we will route it internally).*

Please include:

- A clear description of the vulnerability and the impact you believe it has.
- Steps to reproduce (a minimal proof-of-concept is ideal).
- Any relevant URLs, request/response captures, or screenshots.
- Whether you've disclosed the issue to anyone else.

## What to expect

- **Acknowledgment** within **3 business days** of your report.
- **Initial assessment** (severity classification, whether we can reproduce it) within **7 business days**.
- **Status updates** at least every two weeks until the issue is resolved or we decide not to act on it (with a reason).
- **Disclosure coordination** — we will agree with you on a disclosure timeline before publishing details. Standard practice is 90 days from the initial report, adjusted for severity.

## What is in scope

- The BE333 web app served from `be333.app`, `be333ag.web.app`, and `be333ag.firebaseapp.com`.
- Firestore data-access rules, Firebase Auth flows, and the client-side integration with Firebase Storage.
- The signup, login, password-reset, Google Sign-In, and phone-verification flows.
- Client-facing code in this repository.

## What is out of scope

- Denial-of-service or rate-limit stress tests against production.
- Vulnerabilities in third-party services BE333 depends on (Firebase, Google Analytics, Microsoft Clarity, RevenueCat, reCAPTCHA) — please report those to the respective vendor.
- Social engineering of BE333 team members or users.
- Physical attacks on infrastructure BE333 does not operate.
- Findings that require a rooted / jailbroken device or a malicious browser extension already installed by the victim.
- Missing security headers or best-practice hardening with no demonstrated impact.

## Safe harbor

Good-faith security research that follows this policy is welcomed. We will not pursue legal action against researchers who:

- Report vulnerabilities privately before disclosing them.
- Do not access, modify, or destroy user data beyond what is necessary to demonstrate the vulnerability.
- Do not degrade the Service for other users.
- Give us a reasonable window to remediate before public disclosure.

Thank you for helping keep BE333 users safe.
