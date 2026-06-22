# Hayd

A privacy-conscious, calendar-based cycle tracker. Built with Astro, React, and Cloudflare Pages + D1.

## Features

- **Cycle Tracking** — Log period start/end dates, flow intensity, and notes
- **Daily Status** — Track bleeding, pain level, mood, and energy
- **Predictions** — Calendar-based next period and ovulation estimates
- **Admin Panel** — User management, password reset, audit logs
- **i18n** — Bahasa Indonesia (default) and English
- **Dark/Light Mode** — Theme toggle with system preference detection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 + React 18 |
| Database | Cloudflare D1 (SQLite) |
| Deployment | Cloudflare Pages |
| Styling | Tailwind CSS v4 |
| Auth | bcrypt sessions with httpOnly cookies |

## Project Structure

```
src/
├── layouts/
│   ├── AppShell.astro      # Main app layout (nav, theme, i18n)
│   ├── AdminShell.astro    # Admin panel layout
│   └── AuthLayout.astro    # Login/auth pages layout
├── pages/
│   ├── login.astro         # Sign in
│   ├── logout.astro        # Sign out
│   ├── app/
│   │   ├── index.astro     # Dashboard (cycle ring, quick actions, stats)
│   │   ├── calendar.astro  # Calendar view with period markers
│   │   ├── log.astro       # Daily status & period logging
│   │   ├── predictions.astro  # Cycle predictions
│   │   ├── history.astro   # Period history
│   │   └── profile.astro   # Account settings
│   └── admin/
│       ├── index.astro     # Admin dashboard
│       ├── users.astro     # User list
│       ├── users/new.astro # Create user
│       └── users/[id].astro # User detail & actions
├── components/
│   ├── ui/                 # Shared UI (Card, Button, Input, etc.)
│   └── app/                # Feature components (CycleRing, PhaseTimeline, etc.)
├── lib/
│   ├── auth/               # Session, CSRF, rate limiting
│   ├── db/                 # D1 client, migrations, schema
│   ├── i18n/               # Translations (id/en)
│   └── modules/            # Business logic (users, cycles, predictions, audit)
└── styles/
    └── app.css             # Tailwind + theme variables
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Cloudflare account with D1 database

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file for local development:

```env
# No env vars required for local dev
# The app defaults to Cloudflare adapter in production
# and Node adapter in development
```

### Database

Run migrations locally:

```bash
npm run db:migrate
```

Run migrations against Cloudflare D1:

```bash
npx wrangler d1 execute hayd-db --remote --file="src/lib/db/migrations/009_rate_limits.sql"
```

Or run all migrations:

```bash
for f in src/lib/db/migrations/*.sql; do
  npx wrangler d1 execute hayd-db --remote --file="$f"
done
```

### Development

```bash
npm run dev
```

The app runs at `http://localhost:4321`.

### Build

```bash
# For Cloudflare Pages
npm run build

# For Node.js (local)
DEPLOY_TARGET=node npm run build
```

### Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=hayd
```

## Cloudflare Configuration

### D1 Binding

In Cloudflare Dashboard → Pages → hayd → Settings → Functions:

| Binding | Database |
|---------|----------|
| `DB`    | `hayd-db` |

### Environment Variables

| Variable | Value |
|----------|-------|
| `DEPLOY_TARGET` | `cloudflare` |
| `NODE_VERSION` | `20` |

### Security Headers

Configured in `public/_headers`:

- `Content-Security-Policy` — Restrictive policy allowing inline scripts
- `Strict-Transport-Security` — 2 years, includeSubDomains, preload
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Security

- **CSRF Protection** — Double-submit cookie pattern on all POST forms
- **Session Management** — 256-bit session IDs, httpOnly cookies, 7-day TTL
- **Rate Limiting** — 5 login attempts per 15-minute window, 30-minute lockout
- **Password Policy** — Min 8 chars, requires uppercase, lowercase, and number
- **Input Validation** — Zod schemas on all inputs
- **SQL Injection** — All queries use parameterized statements
- **XSS** — Framework auto-escaping + CSP headers
- **IDOR** — Ownership checks on all data access
- **Audit Logging** — All admin actions recorded

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | User accounts (email, password hash, role, status) |
| `sessions` | Active sessions (user_id, expires_at, ip_hash) |
| `user_profiles` | Profile data (display_name, timezone, preferences) |
| `period_logs` | Menstrual period records |
| `daily_status_logs` | Daily symptom/wellness tracking |
| `prediction_snapshots` | Cycle predictions (next period, ovulation) |
| `admin_audit_logs` | Admin action audit trail |
| `rate_limits` | Login rate limiting |
| `password_reset_tokens` | Reserved for future use |

## Default Admin

After initial deployment, create an admin user via D1:

```bash
# Generate a password hash
node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"

# Insert user
npx wrangler d1 execute hayd-db --remote --command="INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at) VALUES ('<uuid>', 'admin@hayd.local', '<hash>', 'admin', 'active', 1, datetime('now'), datetime('now'))"

# Insert profile
npx wrangler d1 execute hayd-db --remote --command="INSERT INTO user_profiles (user_id, display_name, timezone, created_at, updated_at) VALUES ('<uuid>', 'Admin', 'Asia/Jakarta', datetime('now'), datetime('now'))"
```

## License

Private — All rights reserved.
