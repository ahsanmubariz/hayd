# Calendar/Rhythm Cycle Tracker — Architecture

## 1. Product scope

This application is a privacy-conscious menstrual cycle tracker built around a **calendar/rhythm-only** prediction model. It does **not** implement symptothermal, cervical mucus, BBT, or medical-grade fertility detection. The app estimates upcoming period and ovulation-related windows from historical cycle length and logged period dates only, which is materially less reliable than multi-indicator fertility-awareness methods.[1][2]

The system should be positioned as a planning and self-tracking tool, not a contraceptive or diagnostic device. The UI, copy, consent flows, and warning banners must consistently state that predictions are estimates based on historical patterns and may be inaccurate when cycles are irregular, postpartum, perimenopausal, affected by stress/illness, or otherwise variable.[3][2][4]

Because period-tracking data is sensitive health data, the architecture should minimize third-party exposure, avoid ad-tech integrations, keep analytics optional or self-hosted, and provide strong deletion/export controls from day one.[5][6][7][8]

## 2. Core product model

### 2.1 Actors

- **User**: tracks menstrual periods, symptoms/status, and sees cycle predictions.
- **Admin**: manages user accounts, activates/deactivates accounts, reviews account status, and audits key system events.

### 2.2 Product boundaries

Included:
- Email/password login.
- Role-based access: `admin`, `user`.
- Period history logging.
- Past and current daily status logging.
- Calendar-based predictions for next period, estimated ovulation day, and fertile-window-style estimate.
- Admin user lifecycle management: register, deactivate, reactivate, soft-delete, reset password flow trigger.
- Audit log for security-sensitive admin actions.

Explicitly excluded in v1:
- Medical advice.
- Contraception recommendations.
- BBT, mucus, LH strip, wearable integration.
- Chat/community/social feed.
- Native mobile app.
- Push notifications requiring external device infrastructure.

## 3. Recommended technical stack

### 3.1 Runtime and framework

- **Framework**: Astro.js in SSR mode.
- **Rendering strategy**: server-rendered authenticated app, with islands for interactive widgets.
- **Deployment target**: Cloudflare Workers via Astro Cloudflare adapter.[9]
- **Database**: Cloudflare D1.
- **Session storage**: Astro Sessions API backed by Cloudflare-supported session storage; Cloudflare documents Astro session support for Workers deployments.[9]
- **UI**: Astro + React islands for shadcn/ui components.
- **Styling**: Tailwind CSS + shadcn/ui tokens.
- **Validation**: Zod.
- **Forms**: server actions or SSR form POST handlers with Zod validation.
- **Password hashing**: Argon2id preferred, bcrypt acceptable if edge/runtime support dictates.

### 3.2 Why this architecture fits

Cloudflare’s Astro guidance supports Astro on Workers and notes Astro Sessions support on the Cloudflare adapter, which makes SSR authentication patterns practical without a separate backend service.[9] Role-based dashboards and shadcn-style admin layouts are a strong fit for a split admin/user portal because the component system already covers data tables, forms, drawers, dialogs, toasts, and navigation patterns commonly used in operational consoles.[10][11][12]

## 4. System architecture

### 4.1 High-level design

Use a **single Astro application** with server-side rendering and route-level authorization.

```text
Browser
  -> Astro SSR routes on Cloudflare Workers
      -> Auth/session middleware
      -> Domain services (auth, users, cycles, predictions, audit)
      -> Cloudflare D1
      -> Astro islands for interactive UI
```

### 4.2 No separate backend

The “backend” lives inside Astro server routes, middleware, and server actions. This matches the requirement to avoid a standalone backend while still preserving clean server-side domain boundaries.

Recommended layers:

- `src/middleware.ts`
  - Session retrieval.
  - Role extraction.
  - Route protection.
- `src/lib/auth/*`
  - Password hashing, session helpers, auth guards.
- `src/lib/db/*`
  - D1 access wrapper and query helpers.
- `src/lib/modules/users/*`
  - User lifecycle operations.
- `src/lib/modules/cycles/*`
  - Period logs, day status logs, cycle summaries.
- `src/lib/modules/predictions/*`
  - Calendar/rhythm algorithm.
- `src/lib/modules/audit/*`
  - Admin audit logging.
- `src/pages/*`
  - SSR pages and form endpoints.
- `src/components/*`
  - Shared UI and shadcn wrappers.

### 4.3 Architecture principles

- SSR-first for security-sensitive pages.
- Progressive enhancement for forms.
- Mobile-first layout.
- Database access only from server code.
- No direct D1 access from client.
- Prediction logic centralized in a service module, never duplicated in components.
- Soft-delete and auditability for user administration.

## 5. Authentication and authorization

### 5.1 Auth model

Use credentials-based authentication with secure, HttpOnly, same-site cookies and server-side session validation. Astro/Cloudflare auth patterns commonly rely on encrypted session cookies or session storage on the edge, and Cloudflare examples show Astro sessions are supported in this deployment model.[9][13][14]

Recommended approach:
- Email + password login.
- Session cookie contains opaque session id or signed token.
- Session record stores `user_id`, `role`, `expires_at`, `last_seen_at`, `ip_hash`, `user_agent_hash`.
- Password reset implemented through signed time-limited token table.
- Optional invitation-based registration for users created by admin.

### 5.2 Roles

Two fixed roles:
- `admin`
- `user`

Authorization matrix:

| Capability | User | Admin |
|---|---|---|
| Login/logout | Yes | Yes |
| View own profile | Yes | Yes |
| Edit own basic profile | Yes | Yes |
| Log period dates | Yes | Optional |
| Log current/past day status | Yes | Optional impersonation-free admin read only |
| View own predictions | Yes | No direct override |
| View users list | No | Yes |
| Register user | No | Yes |
| Deactivate/reactivate user | No | Yes |
| Soft-delete user | No | Yes |
| View audit logs | No | Yes |

Admin should **not** edit private health logs directly unless there is a clearly disclosed support workflow. For privacy reasons, prefer read-only support visibility plus explicit user ownership of cycle data.[5][7][8]

### 5.3 Route protection

Recommended route groups:
- `/login`
- `/logout`
- `/app/*` for authenticated users.
- `/admin/*` for admins only.

Middleware behavior:
1. Read session cookie.
2. Resolve session.
3. Attach `locals.user` and `locals.session`.
4. Redirect unauthenticated users away from protected routes.
5. Redirect non-admin users away from `/admin/*`.
6. Rotate or extend session for active users on safe cadence.

## 6. Data architecture

### 6.1 Main entities

1. `users`
2. `sessions`
3. `password_reset_tokens`
4. `user_profiles`
5. `period_logs`
6. `daily_status_logs`
7. `prediction_snapshots`
8. `admin_audit_logs`

### 6.2 Suggested schema

#### `users`
- `id TEXT PRIMARY KEY`
- `email TEXT UNIQUE NOT NULL`
- `password_hash TEXT NOT NULL`
- `role TEXT NOT NULL CHECK(role IN ('admin','user'))`
- `status TEXT NOT NULL CHECK(status IN ('active','inactive','deleted'))`
- `email_verified INTEGER NOT NULL DEFAULT 0`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`
- `deactivated_at TEXT NULL`
- `deleted_at TEXT NULL`

#### `user_profiles`
- `user_id TEXT PRIMARY KEY`
- `display_name TEXT NOT NULL`
- `timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta'`
- `birth_year INTEGER NULL`
- `cycle_goal TEXT NULL` -- e.g. `tracking`, `planning`
- `average_cycle_length_override INTEGER NULL`
- `average_period_length_override INTEGER NULL`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`

#### `sessions`
- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `expires_at TEXT NOT NULL`
- `created_at TEXT NOT NULL`
- `last_seen_at TEXT NOT NULL`
- `ip_hash TEXT NULL`
- `user_agent_hash TEXT NULL`
- `revoked_at TEXT NULL`

#### `password_reset_tokens`
- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `token_hash TEXT NOT NULL`
- `expires_at TEXT NOT NULL`
- `used_at TEXT NULL`
- `created_at TEXT NOT NULL`

#### `period_logs`
- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `start_date TEXT NOT NULL`
- `end_date TEXT NOT NULL`
- `flow_intensity TEXT NULL` -- optional enum summary
- `notes TEXT NULL`
- `source TEXT NOT NULL DEFAULT 'manual'`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`

#### `daily_status_logs`
- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `log_date TEXT NOT NULL`
- `bleeding_status TEXT NULL`
- `pain_level INTEGER NULL`
- `mood TEXT NULL`
- `energy_level INTEGER NULL`
- `symptoms_json TEXT NULL`
- `notes TEXT NULL`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`
- `UNIQUE(user_id, log_date)`

#### `prediction_snapshots`
- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `basis_period_log_id TEXT NULL`
- `predicted_next_period_date TEXT NOT NULL`
- `predicted_ovulation_date TEXT NULL`
- `predicted_fertile_start TEXT NULL`
- `predicted_fertile_end TEXT NULL`
- `average_cycle_length_used INTEGER NOT NULL`
- `average_period_length_used INTEGER NOT NULL`
- `cycles_considered INTEGER NOT NULL`
- `confidence_band TEXT NOT NULL` -- low/medium only; never “medical certainty”
- `algorithm_version TEXT NOT NULL`
- `created_at TEXT NOT NULL`

#### `admin_audit_logs`
- `id TEXT PRIMARY KEY`
- `admin_user_id TEXT NOT NULL`
- `target_user_id TEXT NULL`
- `action TEXT NOT NULL`
- `entity_type TEXT NOT NULL`
- `entity_id TEXT NULL`
- `metadata_json TEXT NULL`
- `created_at TEXT NOT NULL`

### 6.3 D1 indexing guidance

Add indexes on:
- `users(email)` unique
- `sessions(user_id, expires_at)`
- `period_logs(user_id, start_date DESC)`
- `daily_status_logs(user_id, log_date DESC)`
- `prediction_snapshots(user_id, created_at DESC)`
- `admin_audit_logs(admin_user_id, created_at DESC)`
- `admin_audit_logs(target_user_id, created_at DESC)`

## 7. Prediction engine design

### 7.1 Important product warning

Calendar/rhythm estimation is based on previous cycle lengths and assumptions about ovulation timing. Clinical sources and public guidance consistently note that cycle variability limits reliability, especially when using calendar-only methods.[1][3][2][4]

### 7.2 Recommended v1 algorithm

Use a **simple, explicit, inspectable algorithm**, not ML.

Inputs:
- Last 3 to 12 completed cycles.
- Each cycle length = difference between consecutive period start dates.
- Average cycle length from available completed cycles.
- Average period length from recent logs.

Rules:
1. Determine completed cycle lengths from `period_logs.start_date` values.
2. Exclude obviously invalid cycles, for example `< 15` days or `> 90` days, and flag irregularity.
3. Use median or trimmed mean for cycle length to reduce outlier impact.
4. Predict next period start = `last_period_start + average_cycle_length_used`.
5. Estimate ovulation day = `predicted_next_period_date - 14 days`.
6. Estimate fertile-like window = ovulation day minus 5 through ovulation day plus 1.
7. Store prediction snapshot with algorithm version.

Recommended confidence labeling:
- `low`: fewer than 3 completed cycles, or irregular cycle dispersion above threshold.
- `medium`: at least 3 reasonably consistent cycles.
- Do **not** expose `high` confidence for calendar-only prediction.

### 7.3 Algorithm explainability in UI

Every prediction screen should explain:
- how many cycles were used,
- average cycle length used,
- date of last logged period,
- why prediction confidence is low/medium,
- that dates are estimates and not medical confirmation.

This matters because users often over-trust period apps, while external reviews repeatedly emphasize that these apps process sensitive data and can shape health decisions despite inherent prediction limits.[5][6][7]

## 8. UX architecture

### 8.1 App shell

Build a mobile-first app shell with:
- top header,
- optional compact greeting,
- bottom tab navigation for users,
- admin drawer/sidebar that collapses to bottom or sheet on mobile.

### 8.2 Role-specific navigation

#### User navigation
- Home
- Calendar
- Log
- Predictions
- Profile

#### Admin navigation
- Dashboard
- Users
- User detail
- Audit logs
- Settings

### 8.3 UI direction

The UI should feel welcoming, calm, and feminine without becoming childish or overly decorative. Prefer soft surfaces, warm neutrals, rose/plum/coral accents used sparingly, rounded cards, gentle transitions, and friendly empty states. Because the audience includes women tracking sensitive health information, the interface should prioritize emotional safety, privacy clarity, and low cognitive load.[5][15][7]

### 8.4 Interactive behaviors

Recommended interactive elements:
- tappable month calendar with animated selection,
- log-entry bottom sheet on mobile,
- prediction cards with expandable “how this is estimated,”
- onboarding carousel with progress indicator,
- optimistic UI for safe local form state only, server-confirmed persistence after submit,
- celebratory microinteraction after completing first cycle log.

## 9. Route map

### Public/auth routes
- `GET /login`
- `POST /login`
- `POST /logout`
- `GET /forgot-password`
- `POST /forgot-password`
- `GET /reset-password/:token`
- `POST /reset-password/:token`

### User routes
- `GET /app`
- `GET /app/calendar`
- `GET /app/log`
- `POST /app/log/period`
- `POST /app/log/status`
- `GET /app/predictions`
- `POST /app/predictions/recompute`
- `GET /app/profile`
- `POST /app/profile`

### Admin routes
- `GET /admin`
- `GET /admin/users`
- `GET /admin/users/new`
- `POST /admin/users`
- `GET /admin/users/:id`
- `POST /admin/users/:id/deactivate`
- `POST /admin/users/:id/reactivate`
- `POST /admin/users/:id/delete`
- `POST /admin/users/:id/reset-password`
- `GET /admin/audit-logs`

## 10. Server module design

### 10.1 Suggested folder structure

```text
src/
  components/
    ui/
    app/
    admin/
  layouts/
    AppShell.astro
    AdminShell.astro
    AuthLayout.astro
  lib/
    auth/
      session.ts
      password.ts
      guards.ts
      tokens.ts
    db/
      client.ts
      schema.ts
      migrations/
    modules/
      users/
        repository.ts
        service.ts
        validation.ts
      cycles/
        repository.ts
        service.ts
        validation.ts
      predictions/
        engine.ts
        service.ts
        types.ts
      audit/
        repository.ts
        service.ts
    utils/
      dates.ts
      pagination.ts
      security.ts
  middleware.ts
  pages/
    login.astro
    forgot-password.astro
    reset-password/[token].astro
    app/
    admin/
```

### 10.2 Service boundaries

- Repository layer: SQL only.
- Service layer: business rules, validation orchestration, audit hooks.
- Presentation layer: Astro pages, components, form actions.
- Prediction engine: pure function module taking historical inputs and returning deterministic output.

## 11. Database migration strategy

Use SQL migration files committed in source control. Suggested sequence:
1. `001_users.sql`
2. `002_sessions.sql`
3. `003_profiles.sql`
4. `004_period_logs.sql`
5. `005_daily_status_logs.sql`
6. `006_prediction_snapshots.sql`
7. `007_admin_audit_logs.sql`

For Cloudflare D1, keep schema portable SQL-first and avoid premature ORM lock-in. A lightweight query helper layer is sufficient for this app.

## 12. Security and privacy requirements

### 12.1 Security baseline

- HttpOnly, Secure, SameSite=Lax cookies.
- CSRF protection for state-changing form posts.
- Password hashing with modern adaptive algorithm.
- Rate limit login and password reset.
- Generic login error messages.
- Server-side authorization on every protected route.
- Audit admin actions.
- Soft-delete by default.
- Escape and validate all free text notes.

### 12.2 Privacy baseline

Privacy research on period apps repeatedly highlights risk from third-party SDKs, extensive sharing, weak deletion controls, and unclear consent handling.[5][6][7][8] Reflect that in the architecture:

- No ad SDKs.
- No third-party trackers on authenticated pages.
- Avoid embedding third-party fonts or scripts on sensitive views if self-hosting is feasible.
- Data export for user-owned records.
- Hard delete option after explicit confirmation and grace policy.
- Clear consent text for health data processing.
- Separate auth/account data from health log display logic.
- Minimize admin visibility into intimate note content unless explicitly needed.

### 12.3 Compliance-oriented product decisions

Even if not formally targeting a regulated medical device classification, the app should behave conservatively:
- avoid medical claims,
- avoid “safe day” or contraception guarantees,
- clearly separate estimates from facts,
- log versioned algorithm outputs,
- preserve user access and deletion rights.[6][8]

## 13. State management approach

Because Astro is SSR-first, most state should remain server-derived.

Use:
- URL/query params for filters and pagination.
- server-rendered page data for authoritative state.
- small client islands for calendar interaction, tabs, animated cards, and form niceties.
- no SPA-global state unless a specific interaction truly needs it.

Recommended client state tools:
- React local state only for isolated islands.
- No heavy global client store in v1.

## 14. Mobile-first UI system

### 14.1 Layout rules

- Default target width: 375px first.
- Bottom tab bar for user app.
- Sticky primary action for logging on mobile.
- Calendar and logs optimized for thumb reach.
- Large touch targets >= 44px.
- One-handed critical flows.

### 14.2 shadcn component recommendations

Use shadcn/ui primitives for:
- Button
- Card
- Input
- Label
- Textarea
- Dialog
- Drawer/Sheet
- Tabs
- Badge
- Dropdown Menu
- Table
- Pagination
- Toast/Sonner
- Calendar wrapper or custom calendar grid
- Alert Dialog
- Switch
- Select

### 14.3 Visual language

Recommended design tokens:
- background: soft neutral blush/off-white,
- primary accent: dusty rose or berry,
- secondary accent: muted plum,
- success: muted green,
- warning: warm amber,
- dark mode: deep plum-charcoal instead of pure black.

Use interactive microanimations, but respect reduced motion.

## 15. Error, empty, and edge states

Design explicit states for:
- no data yet,
- only one period logged,
- insufficient cycles for prediction,
- irregular cycle detected,
- account inactive,
- expired session,
- password reset token expired,
- D1 temporary failure,
- duplicate date log.

Empty-state copy is important for trust. For example: “Add at least 3 period start dates to generate an estimate. Calendar-only estimates are less reliable for irregular cycles.” This is aligned with guidance that calendar-only methods are weaker than multi-indicator approaches.[1][2]

## 16. Analytics and observability

Keep analytics minimal on authenticated health screens.

Recommended:
- server-side request logs,
- error monitoring with PII scrubbing,
- admin action logs in D1,
- optional privacy-friendly analytics only on public/auth shell pages.

Do not log health note contents in analytics systems.

## 17. Testing strategy

### 17.1 Unit tests
- prediction engine deterministic cases,
- date math and cycle-length calculations,
- role guard helpers,
- validation schemas.

### 17.2 Integration tests
- login/logout,
- admin creates/deactivates/reactivates user,
- user logs period and sees updated prediction,
- unauthorized user blocked from admin route,
- inactive user blocked from app access.

### 17.3 UI tests
- mobile viewport navigation,
- calendar interaction,
- form validation rendering,
- dark mode,
- reduced motion.

## 18. Delivery phases

### Phase 1
- Auth
- Roles
- User management
- Period logs
- Current/past status logs
- Calendar/rhythm prediction engine
- User dashboard
- Admin dashboard
- Audit logs

### Phase 2
- Invitation flow
- Export/delete self-service
- Reminders
- Localization
- richer cycle insights

### Phase 3
- privacy center,
- consent history,
- data retention controls,
- optional offline-friendly PWA layer.

## 19. Guidance for the coding agent

Implementation priorities:
1. Build schema and migrations.
2. Build auth/session middleware.
3. Build admin user lifecycle.
4. Build user logging flows.
5. Build deterministic prediction engine.
6. Build mobile-first shells.
7. Add privacy controls, export/delete, and audit UX polish.

Non-negotiables:
- Keep prediction logic transparent.
- Never imply medical certainty.
- Keep server code modular despite “no backend” requirement.
- Make privacy, deletion, and minimal-data collection first-class concerns because external investigations have shown this category is especially sensitive and often mishandled by vendors.[5][6][7][8]
