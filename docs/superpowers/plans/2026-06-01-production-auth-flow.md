# Production Auth Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the demo-only entry flow with production-ready registration, email/password login, seeded-account login, and Google OAuth while preserving SINAD+ safety copy and parent/child data boundaries.

**Architecture:** Use Supabase Auth as the source of identity, keep app data in existing Supabase tables with `user_id` ownership, and migrate `/login` from a demo-only action into a real auth surface. Keep a seeded demo account as a low-friction trial path, but label it as a demo option rather than the primary product flow.

**Tech Stack:** Next.js 16 App Router, React Server Actions, Supabase Auth/SSR, Supabase OAuth Google provider, Playwright E2E, Vitest.

---

## Product Flow

### Public Entry

- Landing page primary CTA becomes `Daftar Gratis`.
- Secondary CTA becomes `Masuk`.
- Demo remains available as `Coba akun demo` on the auth page, not as the main product promise.

### Register

1. User opens `/register`.
2. User enters name, email, password, and confirms they understand SINAD+ is not a diagnosis tool.
3. Server action calls `supabase.auth.signUp()`.
4. If email confirmation is enabled, show `Cek email Anda` state.
5. If local/dev seeded mode is active, allow immediate redirect after successful session.
6. First authenticated visit redirects to `/anak/setup` if no child profile exists.

### Login

1. User opens `/login`.
2. User chooses email/password, Google, or demo account.
3. Email/password calls `supabase.auth.signInWithPassword()`.
4. Google calls `supabase.auth.signInWithOAuth({ provider: 'google' })` with redirect callback.
5. Demo account calls sign-in using seeded credentials from environment variables.
6. Success redirects to `/dashboard` or the originally requested app route.

### Logout

- Existing red `Keluar` button stays.
- Server action calls `supabase.auth.signOut()` and redirects to `/login`.

### First-Run Child Profile

- `/dashboard` should require a child profile.
- If none exists, redirect to `/anak/setup`.
- `/anak/setup` collects child name, birth date, and gender.
- After setup, redirect to dashboard.

---

## Security and Data Model

### Required Tables / Columns

- Ensure `children.user_id` references `auth.users.id`.
- Ensure screenings, behavior logs, reports, and user-created activity state are reachable only through the authenticated user's children.
- Keep static educational/activity catalog readable without auth if desired, but user-specific records must be scoped.

### RLS Policies

Add or verify policies:

```sql
create policy "Users can read own children"
  on children for select
  using (auth.uid() = user_id);

create policy "Users can insert own children"
  on children for insert
  with check (auth.uid() = user_id);

create policy "Users can update own children"
  on children for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Repeat equivalent policies for screenings, behavior logs, generated reports, and any table that stores user-owned data. Use joins through `children.user_id` when child_id is the ownership field.

### Seeded Demo Account

Environment variables:

```env
SINAD_DEMO_EMAIL=demo@sinadplus.local
SINAD_DEMO_PASSWORD=<strong generated password>
```

Seed script responsibilities:

1. Create or update auth user for the demo email.
2. Create demo child `Alya` owned by that auth user.
3. Seed sample screening, behavior logs, and activities/report state.
4. Make the script idempotent.

---

## File Structure

- Modify `app/(public)/page.tsx` and `components/layout/public-nav.tsx` — update CTAs from demo-first to register/login/demo-secondary.
- Replace `app/(demo)/login/page.tsx` with real auth UI, or move to `app/(auth)/login/page.tsx` if route groups are reorganized.
- Create `app/(auth)/register/page.tsx` — registration form.
- Create `app/(auth)/auth-actions.ts` — email/password login, register, Google OAuth start, demo login.
- Create `app/auth/callback/route.ts` — Supabase OAuth callback exchange and redirect.
- Modify `middleware.ts` or future `proxy.ts` — protect app routes and redirect unauthenticated users.
- Modify `lib/supabase/server.ts` if needed — ensure server client supports auth session reads.
- Modify `lib/supabase/queries.ts` — remove demo-user assumptions and scope queries by authenticated user/child.
- Create `app/(app)/anak/setup/page.tsx` and action — first-run child setup.
- Add migration SQL under `supabase/migrations/` — user ownership and RLS policies.
- Add seed/update script under `supabase/seed-demo.sql` or `scripts/seed-demo.ts`.
- Update `tests/e2e/demo-flow.spec.ts` or create `tests/e2e/auth-flow.spec.ts` — register/login/demo/google button visibility and protected-route redirects.

---

## Implementation Tasks

### Task 1: Auth Route Structure and Copy

- [ ] Create `/login` page with tabs/cards for Email Login, Google Login, and Demo Account.
- [ ] Create `/register` page with disclaimer acknowledgement.
- [ ] Update landing/public nav CTAs.
- [ ] Add Playwright tests proving the public CTAs route correctly.
- [ ] Commit: `feat: add production auth entry routes`.

### Task 2: Supabase Auth Actions

- [ ] Implement email/password register server action.
- [ ] Implement email/password login server action.
- [ ] Implement Google OAuth start action.
- [ ] Implement callback route exchanging code for session.
- [ ] Keep medical disclaimer acknowledgement validation on register.
- [ ] Add unit tests for action validation helpers where possible.
- [ ] Commit: `feat: implement auth server actions`.

### Task 3: Protected App Routing

- [ ] Protect `/dashboard`, `/anak`, `/skrining`, `/aktivitas`, `/catatan`, `/laporan`, `/hasil/*`.
- [ ] Redirect unauthenticated users to `/login?next=<path>`.
- [ ] Redirect authenticated users away from `/login` and `/register` to `/dashboard`.
- [ ] Add Playwright tests for protected redirects.
- [ ] Commit: `feat: protect authenticated app routes`.

### Task 4: User-Scoped Data Queries

- [ ] Replace demo child lookup with authenticated user lookup.
- [ ] Update dashboard, laporan, catatan, skrining actions, and report generation to use the current user's child.
- [ ] Preserve demo data only when logged in as seeded demo account.
- [ ] Add tests for helper functions that choose current child / handle missing profile.
- [ ] Commit: `feat: scope app data to authenticated users`.

### Task 5: First-Run Child Setup

- [ ] Add `/anak/setup` form.
- [ ] Add server action creating child record with current `auth.uid()`.
- [ ] Redirect users without children to setup before dashboard.
- [ ] Add Playwright first-run flow test.
- [ ] Commit: `feat: add first child setup flow`.

### Task 6: Seeded Demo Account

- [ ] Add idempotent seed path for demo auth user and demo child data.
- [ ] Add demo login action using `SINAD_DEMO_EMAIL` and `SINAD_DEMO_PASSWORD`.
- [ ] Update login page demo card to say data is fictitious and resettable.
- [ ] Add E2E test that demo login reaches dashboard.
- [ ] Commit: `feat: add seeded demo account login`.

### Task 7: Google OAuth Configuration Notes

- [ ] Document Supabase dashboard Google provider setup.
- [ ] Document redirect URLs for local and production.
- [ ] Add environment variable checklist.
- [ ] Ensure UI handles OAuth errors from callback route.
- [ ] Commit: `docs: add Google OAuth setup notes`.

### Task 8: Final Verification

- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run full Playwright auth/app suite.
- [ ] Manually verify email login, demo login, protected redirect, logout, and report PDF as authenticated user.
- [ ] Push branch.

---

## Open Decisions Before Implementation

1. **Email confirmation:** decide whether production requires email verification before first login.
2. **Google OAuth consent screen:** decide app display name and support email.
3. **Account model:** decide whether one parent account can manage multiple children in the first production release. Recommended: schema supports multiple children, UI starts with one default child.
4. **Demo reset:** decide whether demo data resets on every login, nightly, or manually. Recommended: nightly plus idempotent seed script.
5. **Deployment URLs:** define production domain before configuring Google OAuth redirects.

---

## Verification Checklist

- [ ] Unauthenticated users cannot access app routes.
- [ ] Registered users can create a child profile and reach dashboard.
- [ ] Seeded demo account reaches demo data.
- [ ] Google button starts OAuth and callback handles success/error.
- [ ] User A cannot read or mutate User B records under RLS.
- [ ] Report PDF generation works for authenticated non-demo and demo users.
- [ ] Medical disclaimer remains visible on register and report surfaces.
