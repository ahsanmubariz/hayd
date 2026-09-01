# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Women and menstruating individuals seeking a private, intimate, ad-free environment to track their menstrual cycle, symptoms, mood, and predictions.

## Product Purpose
Provide calm, discreet, and reliable calendar-based cycle tracking and wellness logging without selling data, displaying ads, or using intrusive notifications.

## Positioning
A sanctuary for menstrual health data: radical privacy, local/zero-tracking architecture, cryptographic session authentication (WebCrypto + Passkeys), and zero commodification of intimate bodily cycles.

## Operating Context
Daily quick-logging on mobile and desktop web; calendar exploration; reviewing rhythm-based predictions and historical patterns; managing private profile and security credentials.

## Capabilities and Constraints
- Calendar and rhythm-based prediction calculation.
- Daily wellness, bleeding status, pain level (0-10), mood, and energy tracking.
- Passkey (WebAuthn) and cryptographically signed 3-month session authentication.
- Bilingual support: Bahasa Indonesia (default) and English.
- Light/Dark mode with system preference auto-detection.
- Cloudflare Pages + D1 edge deployment constraints.

## Brand Commitments
- Name: Hayd (derived from the Arabic/Indonesian term for menstruation: حَيْض / haid).
- Tone: Serene, dignified, warm, empathetic, and respectful.
- Anti-patterns to reject: Generic "bubblegum pink" clichés, infantalizing emoji-overload, gamification badges, aggressive medical sterile coldness, or generic AI card templates.

## Evidence on Hand
- Full Astro 5 + React 18 codebase with active routes for Auth (`/login`), Dashboard (`/app`), Calendar (`/app/calendar`), Log (`/app/log`), Predictions (`/app/predictions`), History (`/app/history`), and Profile (`/app/profile`).

## Product Principles
1. Privacy as Sanctuary: Intimate health data is sacred; zero trackers, clear auditability, and cryptographic peace of mind.
2. Serenity and Dignity: Speak to the user with warmth, clarity, and respect; reject patronizing aesthetic stereotypes.
3. Effortless Daily Rhythm: Logging daily symptoms or cycle dates should take less than 10 seconds with frictionless tactile interactions.
4. Transparent Clarity: Predictions and cycle phases are always explained honestly as estimates, not opaque medical verdicts.

## Accessibility & Inclusion
- High contrast legibility in both light and dark modes.
- Generous touch targets for mobile thumb navigation.
- Screen reader semantic markup and keyboard navigation support.
- Inclusive language honoring diverse menstruating bodies.
