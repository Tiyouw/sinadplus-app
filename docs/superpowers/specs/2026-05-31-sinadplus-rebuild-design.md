# SINAD+ Rebuild Design Spec

**Date:** 2026-05-31  
**Project:** SINAD+ / Siaga Anak ADHD  
**Spec status:** Approved product direction from brainstorming; pending user review of written spec  
**Primary source documents:**
- `SINAD_PPL_Tim_Ready.md`
- `SINAD_Plus_Verdict_Hakim_Revisi_Konsulen_Juri.md`

---

## 1. Product Direction

SINAD+ will be rebuilt as an Indonesian-first parent companion app for early ADHD-related observation. It must not claim to diagnose, treat, or replace professional care.

The product promise is:

> Membantu orang tua memahami sinyal awal, mencoba pendampingan rumah yang aman, mencatat perkembangan, dan menyiapkan laporan untuk konsultasi profesional.

The rebuild target is **Approach A+ — Polished Working Demo MVP**: a real working, live-capable app with already-good UI, while leaving room for later visual and motion upgrades.

The MVP should feel like software, not only a visual prototype. At the same time, it must be polished enough to present confidently to a competition jury.

---

## 2. Main Demo Story

The demo should present one coherent journey, not disconnected menu features:

1. Jury opens the landing page.
2. Jury clicks **Masuk Demo**.
3. App opens a premium parent dashboard for one seeded child profile.
4. User views the latest SNAP-IV screening result with safe disclaimer.
5. User sees recommended **Aktivitas Bermain Terstruktur** based on the strongest screening domain.
6. User views or adds a daily behavior log.
7. User opens **Laporan Konsultasi**.
8. User generates/downloads a polished PDF report.
9. Presenter closes with the message that SINAD+ does not replace professionals; it prepares parents to meet them.

Primary flagship feature:

- Generated PDF consultation report.

Secondary flagship feature:

- Premium guided parent dashboard.

Supporting features:

- Full guided SNAP-IV screening.
- Activity recommendation and manual browsing.
- Daily behavior logging.
- Parent progress/checklist.
- Seeded curated education content.

---

## 3. Technology Direction

Use a production-like stack from the start:

- **Framework:** Next.js + TypeScript.
- **Styling:** Tailwind CSS.
- **UI components:** shadcn/ui.
- **Backend/auth/database:** Supabase.
- **Hosting target:** Vercel.
- **PDF:** actual generated PDF download, with in-app preview.
- **Language:** Indonesian-first.
- **Demo data:** seeded demo user and seeded content.

The app should be able to run locally during development and be deployable to Vercel for jury access.

---

## 4. Authentication and Demo Strategy

MVP uses a **seeded demo account only**.

Public registration is not part of MVP. The landing page should provide a frictionless **Masuk Demo** path so jury can immediately enter the product without onboarding friction.

Future plan:

- public registration/login,
- real parent accounts,
- optional onboarding,
- multi-child management for real users.

---

## 5. Core App Modules

### 5.1 Public Landing Page

Purpose:

- explain SINAD+ clearly,
- present safe non-diagnostic positioning,
- show the product flow,
- provide CTA: **Masuk Demo**.

The landing page should sell the idea as a safe early companion, not a medical tool.

### 5.2 Demo Login

A simple demo entry screen or one-click demo login.

MVP should avoid complex registration flows.

### 5.3 Dashboard

The dashboard is the visual center of the app.

It should include:

- child profile summary,
- latest screening summary,
- parent consistency/progress checklist,
- recent behavior log summary,
- recommended next step,
- quick CTA to generate consultation report.

The dashboard should feel calm, premium, and useful during a 3–5 minute demo.

### 5.4 Profil Anak

Stores and displays the seeded child profile.

Fields:

- child name,
- gender,
- birth date or age,
- optional notes.

Schema should allow multi-child support later, but MVP may show one seeded child.

### 5.5 Skrining Awal SNAP-IV

The MVP includes the full SNAP-IV guided form.

Requirements:

- grouped questions,
- progress stepper,
- 0–3 answer scale,
- deterministic scoring,
- saved screening result,
- Indonesian copy.

The form should be credible but not overwhelming. The demo account should already contain seeded screening history so presenters do not need to fill the full form live.

### 5.6 Ringkasan Hasil

The result page should include:

- domain scores,
- tendency/category explanation,
- strong non-diagnostic disclaimer,
- plain-language next steps,
- suggested activities based on strongest domain.

Required safety framing:

- results are early screening indicators,
- results are not medical diagnosis,
- parents should consult psychologists, child psychiatrists, or pediatricians for professional evaluation.

### 5.7 Aktivitas Bermain Terstruktur

Replace “play therapy,” “therapy,” and “terapi” product claims with safer wording:

- **Aktivitas Bermain Terstruktur**,
- **Pendampingan Bermain di Rumah**,
- **Aktivitas Stimulasi Fokus dan Kontrol Diri**.

Each activity must include:

- title,
- objective,
- target domain,
- suitable age range,
- duration,
- required tools,
- steps,
- behaviors for parents to observe,
- safety notes,
- when to stop,
- simple rationale/source.

Recommendation behavior:

- guided recommendation based on strongest screening domain,
- manual browsing remains available,
- recommendations must not be framed as treatment prescriptions.

Safe wording example:

> Aktivitas ini dapat membantu orang tua mengamati pola fokus anak di rumah. Aktivitas ini bukan terapi klinis dan tidak menggantikan arahan profesional.

### 5.8 Catatan Harian

Short parent behavior log.

Fields:

- child id,
- optional related activity,
- date,
- mood,
- focus rating,
- impulsivity rating,
- cooperation rating,
- notes,
- optional incident flag or incident text.

The log should be quick and low-friction.

### 5.9 Laporan Konsultasi

This is the primary flagship.

The report module should include:

- in-app report preview,
- actual generated PDF download,
- data generated from current child data,
- saved report snapshot metadata for each generated report,
- strong disclaimer.

Report contents:

- child profile summary,
- screening history or latest screening,
- domain scores,
- recent behavior logs,
- activities tried,
- parent notes,
- suggested professional follow-up copy,
- disclaimer that SINAD+ is not a diagnostic tool.

MVP report behavior:

1. User opens **Laporan Konsultasi**.
2. App builds preview from current child data.
3. User clicks **Generate/Unduh PDF**.
4. App generates actual PDF file.
5. App stores report snapshot metadata so previous generated reports can be listed.

### 5.10 Edukasi

Seeded/static content only for MVP.

Each article should include:

- title,
- category,
- summary,
- body,
- source label,
- reviewer status label,
- read time.

Avoid fake expert validation claims. If no expert is confirmed, label content honestly as requiring further expert validation.

### 5.11 Roadmap / Tentang Batasan

The app should clearly communicate boundaries:

- SINAD+ is not a diagnosis tool,
- no confirmed clinical advisor yet,
- expert validation is a future plan,
- public registration is future plan,
- content and activities need further professional review.

---

## 6. Data Model

Use Supabase Postgres.

### 6.1 Auth User / Demo User

MVP uses a seeded demo account. Public registration is disabled or not surfaced in the UI.

### 6.2 `children`

Stores child profile.

Suggested fields:

- `id`,
- `user_id`,
- `name`,
- `gender`,
- `birth_date`,
- `notes`,
- `created_at`,
- `updated_at`.

### 6.3 `screenings`

Stores completed SNAP-IV screening.

Suggested fields:

- `id`,
- `child_id`,
- `completed_at`,
- `inattention_score`,
- `hyperactivity_impulsivity_score`,
- `total_score`,
- `category`,
- `dominant_domain`,
- `answers_json`,
- `disclaimer_version`,
- `created_at`.

### 6.4 `activities`

Seeded structured activities.

Suggested fields:

- `id`,
- `title`,
- `domain`,
- `age_min`,
- `age_max`,
- `duration_minutes`,
- `objective`,
- `tools`,
- `steps_json`,
- `observed_behaviors`,
- `safety_notes`,
- `stop_conditions`,
- `rationale`,
- `source_label`,
- `created_at`.

### 6.5 `behavior_logs`

Stores parent daily logs.

Suggested fields:

- `id`,
- `child_id`,
- `activity_id`,
- `log_date`,
- `mood`,
- `focus_rating`,
- `impulsivity_rating`,
- `cooperation_rating`,
- `notes`,
- `incident_text`,
- `created_at`,
- `updated_at`.

### 6.6 `education_articles`

Seeded article content.

Suggested fields:

- `id`,
- `title`,
- `slug`,
- `category`,
- `summary`,
- `body`,
- `source_label`,
- `reviewer_status`,
- `read_time_minutes`,
- `created_at`.

### 6.7 `report_snapshots`

Stores metadata and source-data snapshots for generated reports.

Suggested fields:

- `id`,
- `child_id`,
- `generated_at`,
- `title`,
- `snapshot_json`,
- `pdf_storage_path`,
- `version`,
- `created_at`.

---

## 7. Seed Data

MVP should include realistic seeded data:

- one parent demo user,
- one realistic child profile,
- at least two screening histories,
- five to eight behavior logs,
- six to ten structured activities,
- five to eight education articles,
- optional pre-generated report snapshot.

Seeded data should support the full demo journey without requiring the jury to type much.

---

## 8. Clinical and Ethical Safety

No confirmed expert is available yet. Therefore the MVP must avoid named expert claims and avoid saying content is clinically validated.

Allowed framing:

- “SINAD+ bukan alat diagnosis.”
- “Hasil skrining bersifat indikasi awal dan perlu dikonsultasikan dengan psikolog, psikiater anak, atau dokter anak.”
- “Konten edukasi disusun dari sumber terbuka dan perlu validasi lebih lanjut oleh ahli.”
- “Validasi bersama profesional kesehatan anak” belongs in the roadmap, not current product claims.

Disallowed claims:

- diagnosis,
- treatment,
- cure,
- therapy prescription,
- expert-reviewed content if no expert has approved it,
- machine learning screening,
- consultation feature without real professional partnership.

---

## 9. UI/UX Direction

Use **calm clinical warmth**, anchored around a blue palette. The existing logo is currently unavailable, so design a temporary SINAD+ brand system that can accept the logo later.

### 9.1 Visual Principles

- Blue as the main trust and brand anchor.
- Off-white, cream, soft slate, and gentle teal/green accents for warmth.
- Avoid rainbow/childish visual overload.
- Avoid sterile hospital-only white/gray.
- Use premium cards, spacious layout, clear hierarchy, and empathetic microcopy.

### 9.2 Layout Direction

Responsive, but desktop-demo optimized first.

Key layouts:

- polished landing page,
- app shell with sidebar/topbar,
- calm dashboard summary cards,
- guided SNAP-IV stepper,
- clear result page,
- report preview designed like a professional consultation document,
- structured activity cards,
- quick log form.

### 9.3 Motion Direction

MVP should include light premium animation.

Include:

- soft page transitions,
- subtle card entrance animation,
- gentle hover states,
- progress/checklist animation,
- dashboard number fade/slide,
- form step transitions,
- PDF/report generation loading state,
- small success confirmation after logging.

Avoid:

- intense parallax,
- chaotic motion,
- bouncing childish effects,
- confetti for symptoms/results,
- too many looping animations,
- anything that makes health data feel like a game.

---

## 10. Suggested Code Structure

```text
app/
  (public)/
    page.tsx
  (demo)/
    login/
      page.tsx
  (app)/
    dashboard/
      page.tsx
    anak/
      page.tsx
    skrining/
      page.tsx
    hasil/
      [screeningId]/
        page.tsx
    aktivitas/
      page.tsx
      [activityId]/
        page.tsx
    catatan/
      page.tsx
    laporan/
      page.tsx
    edukasi/
      page.tsx
      [articleId]/
        page.tsx

components/
  layout/
  dashboard/
  screening/
  activities/
  logs/
  report/
  ui/

lib/
  supabase/
  scoring/
  report/
  seed-data/
  constants/
  validation/
```

Important modules:

- `lib/scoring`: SNAP-IV questions, scoring, category mapping, result copy, tests.
- `lib/report`: report data builder, PDF generation, snapshot serialization, disclaimer insertion.
- `lib/supabase`: Supabase clients and typed data helpers.
- `components/screening`: guided form, answer scale, progress UI.
- `components/report`: preview, sections, PDF download button.

---

## 11. Development Workflow and Skills/Plugins

The rebuild should be design-heavy, verification-heavy, and iterative.

### 11.1 Planning

Use:

- `superpowers:brainstorming`,
- `superpowers:writing-plans`,
- Workflow tool for multi-agent synthesis/review when useful.

Outputs:

- design spec,
- implementation plan,
- MVP scope lock,
- roadmap.

### 11.2 UI/UX Design

Use:

- `ui-ux-pro-max` for UX strategy, accessibility, dashboard/forms/layout review,
- `huashu-design` for high-fidelity prototype/design exploration,
- `design-taste-frontend` and high-end design/taste skills for anti-generic polish,
- `frontend-design:frontend-design` for production-grade frontend implementation,
- optional image generation skills if visual references are needed later.

### 11.3 Documentation and Library Accuracy

Use Context7 for current documentation when working with:

- Next.js,
- Supabase,
- shadcn/ui,
- Tailwind,
- PDF libraries,
- deployment-related library APIs.

### 11.4 Verification

Use:

- Playwright MCP for UI review and manual journey verification,
- `/run` or run skill for launching the app,
- `/verify` for confirming behavior,
- code review skills before considering implementation complete,
- security review if auth/deployment changes are significant,
- `superpowers:verification-before-completion` before claiming done.

Playwright should verify:

- landing to demo login,
- dashboard loads seeded data,
- screening/result pages work,
- activity and log flows work,
- report preview loads,
- PDF generation/download route responds,
- desktop and mobile layouts are usable,
- no obvious broken buttons/routes.

---

## 12. MVP Scope Lock

### Build Now

1. Landing page.
2. Seeded demo account.
3. Dashboard.
4. Full SNAP-IV guided screening.
5. Result page.
6. Structured activity library.
7. Daily behavior log.
8. Generated PDF consultation report.
9. Seeded education content.
10. Light premium animation.
11. Responsive desktop-demo optimized UI.
12. Verification with tests and Playwright review.

### Do Not Build in MVP

- open public registration,
- full forum,
- WhatsApp/community integration as a core feature,
- consultation/chat/video call,
- machine learning screening,
- teacher portal,
- full admin CMS,
- clinical advisor name/reviewer claims,
- leaderboard or competitive gamification,
- heavy motion/experimental animation.

---

## 13. Future Roadmap

### 13.1 Near Future

- real registration/login,
- multi-child management for real users,
- stronger Supabase RLS policies,
- deployment hardening,
- improved logo/brand kit integration,
- design and motion polish pass.

### 13.2 Product Credibility

- clinical advisor/reviewer collaboration,
- reviewed education labels,
- validated activity content,
- consultation preparation templates,
- professional referral/resource page.

### 13.3 Product Expansion

- admin content management,
- parent story curation,
- optional verified community entry,
- saved report history,
- reminder system,
- richer analytics for parent progress.

### 13.4 Long-Term Only If Validated

- supervised expert consultation,
- deeper personalization,
- integrations with professionals,
- AI assistance for summarizing notes with strict safety boundaries,
- no ML diagnosis unless there is proper clinical data, validation, and ethical review.

---

## 14. Acceptance Criteria

The MVP is successful when:

1. A judge can enter the app through **Masuk Demo** without creating an account.
2. The dashboard displays seeded child data, screening summary, logs, and next steps.
3. Full SNAP-IV screening exists and saves deterministic scoring results.
4. Result pages include clear non-diagnostic disclaimers.
5. Activity recommendations are linked to screening domains and remain safely worded.
6. Daily logs can be viewed and added.
7. A consultation report can be previewed and downloaded as an actual PDF.
8. Seeded education content exists with source/reviewer-status labels.
9. UI is polished enough for competition presentation on desktop/projector.
10. Mobile layout remains usable.
11. Playwright verifies the core demo journey.
12. No fake clinical validation, therapy, diagnosis, or ML claims appear in product copy.

---

## 15. Open Implementation Decisions for the Plan

These are implementation-level decisions to resolve during planning, not product-direction blockers:

1. Exact PDF generation library.
2. Exact Supabase seeding mechanism.
3. Whether generated PDF files are stored in Supabase Storage or regenerated from saved report snapshot metadata.
4. Whether demo login uses one-click server-side sign-in or displayed seeded credentials.
5. Exact SNAP-IV scoring thresholds and category copy, to be implemented conservatively with clear disclaimer.
6. Exact animation library, if any, beyond CSS transitions.
