# Calendar/Rhythm Cycle Tracker — Features Specification

## 1. Product definition

This application is a mobile-first web app for menstrual cycle tracking using a **calendar/rhythm method only**. It estimates upcoming period and ovulation-related dates from past period history and user-entered records. Because calendar-only methods are less reliable than multi-indicator fertility-awareness methods, the product must present every prediction as an estimate and not as medical or contraceptive certainty.[cite:6][cite:8][cite:18]

## 2. User roles

### User
A registered user can log into the app, manage personal cycle records, record past and current status, and view estimated predictions.

### Admin
An admin can manage users, review account state, activate/deactivate access, and inspect operational audit logs. Admin tooling should avoid unnecessary exposure to intimate health note data because period-tracking information is sensitive personal health data.[cite:23][cite:26][cite:35]

## 3. User-facing features

### 3.1 Authentication
- Email/password login.
- Logout.
- Forgot password.
- Reset password via time-limited token.
- Session timeout and re-login flow.
- Friendly inactive-account message.

### 3.2 Onboarding
- Welcome flow explaining what the app does.
- Explicit disclosure that predictions are based only on calendar history.
- Privacy summary during onboarding.
- First-time data entry wizard:
  - display name,
  - timezone,
  - average historical cycle estimate optional,
  - recent past period dates.
- “Need at least 3 logged period starts for better estimates” explanation.[cite:6][cite:18]

### 3.3 Home dashboard
The user home screen should provide a quick, emotionally reassuring overview.

Widgets:
- Next predicted period date.
- Estimated ovulation date.
- Estimated fertile-window-style range.
- Current cycle day.
- Recent logging streak / completeness indicator.
- Latest symptom/status summary.
- Warning badge when confidence is low or cycle irregularity is detected.

### 3.4 Calendar view
- Month calendar with marked period days.
- Predicted next period highlight.
- Predicted ovulation day highlight.
- Estimated fertile-window highlight.
- Today indicator.
- Tap a day to open details drawer/sheet.
- Navigate month-by-month.
- Quick-add log action from a selected date.

### 3.5 Period logging
- Add period start date.
- Add period end date.
- Edit an existing period entry.
- Delete a period entry with confirmation.
- Optional flow intensity note.
- Optional notes.
- Validation preventing overlapping impossible ranges.

### 3.6 Past and current status logging
User can add status for any day, including today and past dates.

Suggested fields:
- bleeding status,
- cramps/pain level,
- mood,
- energy level,
- symptoms checklist,
- free-text notes.

Behavior:
- one daily log per date,
- update existing log when revisiting same date,
- fast mobile bottom-sheet form,
- prefilled today shortcut.

### 3.7 Predictions
Prediction page should contain:
- next predicted period date,
- estimated ovulation date,
- fertile-window-style estimated range,
- confidence level,
- cycles used in computation,
- average cycle length used,
- explanation of how estimate was derived,
- warning that irregular cycles reduce reliability.[cite:6][cite:18][cite:20]

### 3.8 History and insights
- List of previous cycles.
- Calculated cycle lengths.
- Average cycle length.
- Average period length.
- Trend chips like “more variable than usual”.
- Flags for insufficient or inconsistent data.

### 3.9 Profile and privacy controls
- Update display name.
- Change password.
- View account status.
- Export own records.
- Request account deletion.
- View privacy notice.
- View data-processing explanation.

## 4. Admin-facing features

### 4.1 Admin dashboard
- Total users.
- Active users.
- Inactive users.
- Newly registered users.
- Recently active users.
- Quick actions to add user or search user.

### 4.2 User management
- Create/register user.
- View user list with search and filters.
- Open user detail page.
- Activate/reactivate user.
- Deactivate user.
- Soft-delete user.
- Trigger password reset flow.
- View account metadata: created date, last login, status, role.

### 4.3 User detail view
- Account summary.
- Profile summary.
- Count of cycle logs and daily logs.
- Last prediction generated.
- Privacy-safe read-only access pattern.
- Action buttons: deactivate, reactivate, send reset link, soft-delete.

### 4.4 Audit log
- List admin actions by time.
- Filter by admin, user, action type, date range.
- View action details.
- Immutable append-only display in UI.

## 5. Shared platform features

### 5.1 Role-based access control
- Admin-only route group.
- User-only route group.
- Redirect unauthorized access.
- Session-based route guards on server.

### 5.2 Validation and safety
- Server-side validation for all write operations.
- Friendly field-level errors.
- Protection against duplicate same-day period starts when invalid.
- Protection against impossible date ranges.
- Generic auth errors to avoid user enumeration.

### 5.3 Privacy-first behavior
External reports on period-tracking apps show persistent concerns about data sharing, weak consent design, and limited deletion clarity.[cite:23][cite:26][cite:32][cite:35] Product features should respond directly:

- No ad or marketing trackers on authenticated screens.
- Minimal personal fields during signup.
- Clear privacy copy in plain language.
- Data export.
- Deletion request flow.
- Clear statement about what admins can and cannot see.
- Optional note fields, never mandatory.

## 6. Prediction feature rules

### 6.1 Input rules
- Use only historical period start dates and period lengths.
- Do not use temperature, mucus, intercourse, or other biomarkers in algorithm.
- Compute only from valid historical logs.

### 6.2 Output rules
- Next predicted period date.
- Estimated ovulation date as next predicted period minus 14 days.
- Estimated fertile-style range as ovulation minus 5 through plus 1 day.
- Confidence label = low or medium only.
- Reason string explaining confidence.

### 6.3 Confidence rules
- Low when fewer than 3 complete cycles exist.
- Low when cycle variation exceeds configured threshold.
- Medium when enough historical cycles exist and variability is moderate.
- Never “guaranteed”, “safe”, or “high confidence” for rhythm-only predictions.[cite:6][cite:18]

## 7. Detailed screen inventory

### Public/auth
- Login screen.
- Forgot password screen.
- Reset password screen.

### User app
- Dashboard.
- Calendar.
- Add/edit period screen or sheet.
- Add/edit daily status screen or sheet.
- Predictions screen.
- Cycle history screen.
- Profile/privacy screen.

### Admin app
- Admin dashboard.
- Users list.
- Create user screen.
- User detail screen.
- Audit logs screen.
- Admin settings screen.

## 8. UX/UI requirements for the coding agent

### 8.1 Mobile-first design
- Start at 375px width.
- Bottom navigation for user role.
- Thumb-reachable primary actions.
- Floating or sticky “Log today” CTA.
- Drawers/sheets over full-page redirects where practical.
- Forms with large touch targets and soft spacing.

### 8.2 Visual direction suitable for women
The interface should feel warm, modern, and respectful rather than clinical or childish. Use gentle color transitions, soft cards, rounded corners, subtle shadows, and supportive copy. The “feminine” quality should come from calm tone, comfort, and elegance rather than stereotypes.

### 8.3 Interactivity
- Animated selection states in calendar.
- Expandable “How prediction works” panel.
- Progress ring or streak chip.
- Small success feedback after log submission.
- Skeleton loading states.
- Friendly empty states.
- Dark mode support.

## 9. Feature-level acceptance criteria

### Authentication
- User can log in with valid credentials.
- Invalid login does not reveal whether email exists.
- User can log out and session is revoked.
- Inactive user cannot access protected pages.

### User registration by admin
- Admin can create a user with required fields.
- Created user can receive or use reset-password onboarding.
- Create action is written to audit log.

### Period logging
- User can create, update, and delete period entries.
- Period history updates dashboard and predictions.
- Invalid ranges are blocked.

### Daily status logging
- User can add a status for today or any past day.
- Revisiting a day updates existing log.
- Dashboard reflects most recent status.

### Predictions
- Prediction recalculates after relevant history changes.
- UI shows cycles used and confidence reason.
- UI displays clear estimate disclaimer.

### Admin control
- Admin can deactivate and reactivate a user.
- Deactivated user loses protected access.
- All admin actions are auditable.

### Privacy
- User can export records.
- User can start deletion flow.
- Authenticated pages do not load unnecessary third-party trackers.

## 10. Suggested component list

### Shared components
- App logo.
- Header.
- Theme toggle.
- Bottom nav.
- Page title bar.
- Empty state card.
- Skeleton card.
- Confirmation dialog.
- Status badge.
- Insight card.

### User components
- Cycle summary hero.
- Month calendar grid.
- Day detail sheet.
- Period form.
- Daily status form.
- Prediction explainer card.
- Cycle stats cards.
- Privacy card.

### Admin components
- KPI cards.
- User table.
- User filters.
- User status badge.
- User action menu.
- Audit table.
- Admin confirmation dialog.

## 11. Non-functional requirements

- Astro SSR only, no separate backend service.
- Cloudflare D1 as primary database.
- Server-only DB access.
- Fast mobile rendering.
- Accessible forms and navigation.
- Privacy-forward defaults.
- Deterministic algorithm versioning.
- Auditability for admin changes.

## 12. Copy constraints

The coding agent should enforce consistent copy rules in the UI:
- Say “estimate”, not “exact”.
- Say “predicted”, not “confirmed”.
- Avoid “safe day” terminology.
- Avoid “birth control” promises.
- Avoid medical diagnosis wording.
- Explain that irregular cycles reduce accuracy.[cite:6][cite:18][cite:20]

## 13. Nice-to-have enhancements after MVP

- Invitation emails.
- Localization (Indonesian + English).
- Reminder settings.
- PWA installability.
- Export to CSV/PDF.
- Lightweight trends visualization.
- Personal note tagging.
- Consent history screen.
