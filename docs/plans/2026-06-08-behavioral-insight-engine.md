# Behavioral Insight Engine Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. Because filesystem subagents may route to Notion in this environment, implementation is executed directly with local tools and verified with tests/lint/build.

**Goal:** Add a transparent behavioral insight layer that answers Gemastik jury feedback about innovation, adaptive recommendations, measurable indicators, and parent-centered UX without making unsafe clinical claims.

**Architecture:** Keep the core recommendation engine in a pure TypeScript module under `lib/insights/` so it can be tested without Supabase. Add an optional server-side OpenAI-compatible narration layer with timeout, safety checks, and rule-based fallback. Pages consume these modules to render dashboard, result, and report sections. No database schema changes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase data rows, Vitest.

---

## Task 1: Add pure behavioral insight engine

**Objective:** Compute safe, explainable insights from screenings, behavior logs, and activities.

**Files:**
- Create: `lib/insights/behavior-insights.ts`
- Create: `lib/insights/behavior-insights.test.ts`

**Acceptance:**
- Computes latest/previous screening trend.
- Computes observation metrics from logs.
- Picks an adaptive activity recommendation by dominant domain and log pattern.
- Computes consultation readiness criteria.
- Uses copy that says observation/pattern, not diagnosis/therapy.

**Verify:** `npm run test -- lib/insights/behavior-insights.test.ts`

## Task 2: Add Supabase helper for screening history

**Objective:** Let dashboard/report compare multiple screenings, not only latest.

**Files:**
- Modify: `lib/supabase/queries.ts`

**Acceptance:**
- Adds `getScreenings(childId)` ordered newest first.
- Existing `getLatestScreening` remains unchanged.

**Verify:** `npm run lint`

## Task 2b: Add optional AI narration with safe fallback

**Objective:** Use AI only when configured and safe, without making the product depend on external AI for core functionality.

**Files:**
- Create: `lib/insights/ai-insight.ts`
- Create: `lib/insights/ai-insight.test.ts`
- Modify: `.env.example`
- Modify: `README.md`

**Acceptance:**
- Server-side OpenAI-compatible request only; no public env variables or client-side API key.
- Falls back when API key/model/base URL is missing, request fails, response is empty, or response violates medical safety boundaries.
- Prompt explicitly forbids diagnosis, medication/dosage advice, clinical therapy claims, and guaranteed improvement.

**Verify:** `npm run test -- lib/insights/ai-insight.test.ts`

## Task 3: Surface insight engine on dashboard

**Objective:** Make first authenticated screen feel adaptive and parent-centered.

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`

**Acceptance:**
- Shows “Insight Adaptif Minggu Ini” with evidence chips.
- Shows “Rekomendasi Aktivitas Berikutnya”.
- Shows measurable indicators and consultation readiness.
- Avoids clinical claims.

**Verify:** `npm run lint && npm run build`

## Task 4: Add adaptive recommendation to screening result

**Objective:** Make `/hasil/[screeningId]` connect screening scores to next actions with clearer intelligence.

**Files:**
- Modify: `app/(app)/hasil/[screeningId]/page.tsx`

**Acceptance:**
- Shows an explanation of why a recommended activity is suggested.
- Uses log evidence when available.
- Still keeps medical disclaimer visible.

**Verify:** `npm run lint && npm run build`

## Task 5: Include measurable indicators in report preview/PDF data

**Objective:** Make output for consultation stronger and address “dampak belum terukur”.

**Files:**
- Modify: `lib/report/build-report-data.ts`
- Modify: `app/(app)/laporan/page.tsx`
- Modify: `lib/report/report-pdf.tsx`
- Modify: `lib/report/build-report-data.test.ts`

**Acceptance:**
- Report data includes behavioral insights.
- Preview and PDF include observation metrics/readiness summary.
- Tests cover insight inclusion.

**Verify:** `npm run test && npm run lint && npm run build`

## Task 6: Final verification and PR

**Objective:** Create a reviewable branch and PR.

**Commands:**
- `npm run test`
- `npm run lint`
- `npm run build`
- `git diff --stat`
- Commit and push branch `feat/behavioral-insight-engine`.
- Open PR to `main`.
