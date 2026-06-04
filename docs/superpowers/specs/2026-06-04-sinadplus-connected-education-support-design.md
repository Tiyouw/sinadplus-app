# SINAD+ Connected Education and Curated Support Design

**Date:** 2026-06-04

**Status:** Approved design for implementation planning.

## Goal

Close the remaining gaps between the SINAD+ competition-demo app and `SINAD_Plus_Verdict_Hakim_Revisi_Konsulen_Juri.md` by making education discoverable, adding a safe community substitute, strengthening the post-screening journey, and adding lightweight parent-focused progress cues.

This design intentionally does not add a full forum, direct consultation, medical diagnosis, or clinical claims. The verdict explicitly warns that full forums and unvalidated consultation add moderation, privacy, and credibility risks.

## Current State

The working implementation lives in:

```text
D:\Kuliah\rhenata\sinadplus-app\.worktrees\sinadplus-mvp-implementation
```

The app already includes:

- SNAP-IV screening.
- Result page with disclaimer.
- Structured activities.
- Daily behavior log.
- Report/PDF export.
- Education article list and detail pages with source/reviewer labels.

Remaining app-level gaps:

- The education page exists but is not visible in the sidebar navigation.
- No safe community/support feature exists.
- Parent-focused gamification/progress is weak.
- The result page does not make the full journey obvious enough: screening -> education -> activity -> log -> report -> curated support.

## Scope

Implement a focused demo enhancement with four parts:

1. Add `Edukasi` and `Dukungan` navigation links.
2. Add a new `/dukungan` page as curated social support, not a forum.
3. Add a clearer `Langkah Selanjutnya` journey on the screening result page.
4. Add lightweight parent progress/gamification on the dashboard.

## Non-Goals

Do not implement:

- Real-time forum.
- User-generated posts, comments, or private messaging.
- WhatsApp group automation.
- Clinical consultation flow.
- Professional directory with claims of partnership.
- Multi-profile child management in this pass.
- Machine learning or clinical scoring changes.

## Navigation

Update the protected app sidebar to include:

```text
Dashboard
Profil Anak
Skrining
Aktivitas
Catatan
Edukasi
Dukungan
Laporan
```

`Edukasi` links to the existing `/edukasi` pages. `Dukungan` links to the new curated support page.

Middleware route protection should include `/dukungan` so the page follows the same demo-auth behavior as the rest of the protected app.

## `/dukungan` Page

Create a new protected page at:

```text
app/(app)/dukungan/page.tsx
```

The page presents curated support content as static demo content. It must be clear that this is not a live community and not medical advice.

Sections:

### Hero

Purpose: explain that the page contains curated parent stories, safe tips, and consultation preparation prompts. Tone: supportive, careful, and non-clinical.

### Cerita Orang Tua Terkurasi

Show 2-3 short, generalized parent story cards. Each card includes situation, what the parent observed, what helped them prepare or reflect, and a reminder that outcomes vary and professional advice is still needed. These are not testimonials and must not imply treatment success.

### Tips Aman dari Pengalaman Orang Tua

Show practical, low-risk tips: write observations with time and context, avoid negative labels, keep routines simple, bring logs to consultation, stop activities when the child is distressed.

### Pertanyaan untuk Konsultasi

Show a checklist of questions parents can bring to a psychologist, child psychiatrist, or pediatrician.

### Batasan Dukungan

Include a visible disclaimer: curated stories are informational, do not replace professional evaluation, no diagnosis is made by SINAD+, and urgent concerns should be discussed with qualified professionals.

## Result Page Journey

Update `/hasil/[screeningId]` so the result page includes a clear `Langkah Selanjutnya` section with steps linking to `/edukasi`, `/aktivitas`, `/catatan`, `/laporan`, and `/dukungan`.

## Dashboard Progress/Gamification

Add a lightweight parent-focused progress panel framed as usage consistency, not clinical improvement. Badge-style labels such as `Mulai Memantau`, `Konsisten Mencatat`, `Siap Konsultasi` describe parent app usage only and must not claim symptom improvement.

## Data and Content Strategy

Use static TypeScript content for `/dukungan`. No schema changes required. If reusable, place content in `lib/seed-data/support-content.ts`; otherwise page-local constants are fine.

## Safety and Copy Rules

All new copy must follow the project safety rule: no diagnosis claim, no doctor approval claim, no clinical validation claim, no promise of improvement, no implication that parent stories are treatment evidence.

## Files Expected to Change

```text
components/layout/app-shell.tsx
middleware.ts
app/(app)/dashboard/page.tsx
app/(app)/hasil/[screeningId]/page.tsx
app/(app)/dukungan/page.tsx
lib/seed-data/support-content.ts (possible)
tests/e2e/demo-flow.spec.ts (possible)
```

## Verification

Run from the worktree: `npm run lint`, `npm run test`, `npm run build`. Confirm sidebar shows Edukasi and Dukungan, /dukungan renders with disclaimers, result page shows the connected journey, and dashboard shows progress without clinical claims.

## Commit and Push Target

All work, commits, and pushes use:

```text
D:\Kuliah\rhenata\sinadplus-app\.worktrees\sinadplus-mvp-implementation
```

Branch: `feature/sinadplus-mvp-implementation`. Verify branch/remote before pushing.
