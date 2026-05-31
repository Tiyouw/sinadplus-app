# SINAD+ Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public landing page with a premium report-first SINAD+ landing page that communicates parent usefulness, includes safe disclaimers, and adds illustration plus restrained motion.

**Architecture:** Implement the redesign inside the existing Next.js App Router public route. Keep the landing page maintainable by extracting focused components under `components/landing/`, with global animation/design tokens in `app/globals.css`. Verification uses lint, tests, build, and Playwright/public-page screenshot review.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4 utility classes, lucide-react icons, existing shadcn/ui Button component.

---

## File Structure Map

```text
app/(public)/page.tsx                  # Landing page composition only
app/globals.css                        # SINAD+ tokens, background, landing animations, reduced-motion rules
components/landing/landing-hero.tsx    # Hero copy, CTA, disclaimer, report assembly illustration
components/landing/problem-section.tsx # Parent problem cards
components/landing/solution-flow.tsx   # 4-step product flow
components/landing/report-preview.tsx  # Flagship report preview mockup and annotations
components/landing/safety-section.tsx  # Ethical boundary section
components/landing/final-cta.tsx       # Closing CTA
```

---

## Task 1: Add landing visual tokens and motion utilities

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add SINAD+ landing tokens and animations**

Append these rules after existing animation utilities:

```css
:root {
  --sinad-blue: #2563eb;
  --sinad-blue-dark: #1e3a8a;
  --sinad-cyan: #22d3ee;
  --sinad-cream: #fff7ed;
  --sinad-paper: #ffffff;
  --sinad-slate: #0f172a;
  --sinad-muted: #64748b;
}

.landing-shell {
  background:
    radial-gradient(circle at 8% 10%, rgba(191, 219, 254, 0.72), transparent 28rem),
    radial-gradient(circle at 84% 8%, rgba(204, 251, 241, 0.64), transparent 30rem),
    linear-gradient(180deg, #f8fbff 0%, #f8fafc 48%, #fff7ed 100%);
}

.report-card-float {
  animation: report-card-float 7s ease-in-out infinite;
}

.report-card-float-delay-1 { animation-delay: 600ms; }
.report-card-float-delay-2 { animation-delay: 1200ms; }
.report-card-float-delay-3 { animation-delay: 1800ms; }

.report-line-draw {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: report-line-draw 900ms cubic-bezier(0.22, 1, 0.36, 1) 500ms forwards;
}

.report-sheet-enter {
  animation: report-sheet-enter 760ms cubic-bezier(0.22, 1, 0.36, 1) 740ms both;
}

@keyframes report-card-float {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -10px, 0); }
}

@keyframes report-line-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes report-sheet-enter {
  from { opacity: 0; transform: translateY(18px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Verify CSS parses**

Run:

```bash
npm run lint
```

Expected: pass or unrelated existing lint only.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add landing motion tokens"
```

---

## Task 2: Build focused landing section components

**Files:**
- Create: `components/landing/landing-hero.tsx`
- Create: `components/landing/problem-section.tsx`
- Create: `components/landing/solution-flow.tsx`
- Create: `components/landing/report-preview.tsx`
- Create: `components/landing/safety-section.tsx`
- Create: `components/landing/final-cta.tsx`

- [ ] **Step 1: Create `components/landing/landing-hero.tsx`**

Create a client-free server component that renders hero copy, CTA links, compact disclaimer, and the report assembly illustration. Use `Link`, `ArrowRight`, `ShieldCheck`, `FileText`, `ClipboardList`, `Activity`, `BookOpen`, and existing `Button`.

- [ ] **Step 2: Create `components/landing/problem-section.tsx`**

Create three empathetic parent problem cards: `Catatan tercecer`, `Bingung harus mulai dari mana`, and `Sulit menjelaskan pola saat konsultasi`.

- [ ] **Step 3: Create `components/landing/solution-flow.tsx`**

Create a four-step timeline: `Skrining Awal`, `Aktivitas Bermain Terstruktur`, `Catatan Harian`, `Laporan Konsultasi`.

- [ ] **Step 4: Create `components/landing/report-preview.tsx`**

Create a flagship report preview card with annotations for child profile, latest screening, behavior notes, activities tried, and disclaimer. Include CTA `Lihat Demo Laporan` linking to `/laporan`.

- [ ] **Step 5: Create `components/landing/safety-section.tsx`**

Create the explicit ethical boundary section with the required safe messages and no doctor/expert approval language.

- [ ] **Step 6: Create `components/landing/final-cta.tsx`**

Create final CTA with headline `Coba alur demo dan lihat bagaimana laporan konsultasi disusun.` and button to `/login`.

- [ ] **Step 7: Verify component typecheck via lint**

Run:

```bash
npm run lint
```

Expected: pass.

- [ ] **Step 8: Commit**

```bash
git add components/landing
 git commit -m "feat: add landing redesign sections"
```

---

## Task 3: Replace public landing page composition

**Files:**
- Modify: `app/(public)/page.tsx`

- [ ] **Step 1: Replace page body**

Import `PublicNav` and all landing section components. Render them in this order inside a `landing-shell` wrapper:

1. `PublicNav`
2. `LandingHero`
3. `ProblemSection`
4. `SolutionFlow`
5. `ReportPreviewSection`
6. `SafetySection`
7. `FinalCta`
8. footer with disclaimer

- [ ] **Step 2: Verify visible copy constraints**

Search the changed landing components for disallowed terms:

```bash
rg -i "doctor-approved|clinically validated|expert-reviewed|diagnosis tool|terapi klinis|menyembuhkan|approved by" app components
```

Expected: no unsafe product claims. Safe disclaimers that say `bukan alat diagnosis` are allowed.

- [ ] **Step 3: Run verification**

```bash
npm run lint
npm run test
npm run build
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add app/'(public)'/page.tsx
 git commit -m "feat: redesign public landing page"
```

---

## Task 4: Visual/manual verification and final push

**Files:**
- No planned source modifications unless verification finds defects.

- [ ] **Step 1: Start the app**

```bash
npm run dev
```

Expected: local app starts on `http://localhost:3000`.

- [ ] **Step 2: Inspect landing page**

Open `/` and verify:

- hero headline and CTA visible,
- compact disclaimer visible in hero,
- illustration does not overlap copy,
- `Lihat Alur` jumps to solution flow,
- `Lihat Demo Laporan` links to `/laporan`,
- mobile layout is usable,
- no console errors.

- [ ] **Step 3: Run final automated checks**

```bash
npm run lint
npm run test
npm run build
npm run e2e
```

Expected: all pass. If e2e requires missing Supabase env for authenticated pages, public/login checks must pass and the missing env must be documented in the summary.

- [ ] **Step 4: Commit any verification fixes**

```bash
git status --short
git add <changed-files>
git commit -m "fix: polish landing verification issues"
```

Only run this commit if verification produced source changes.

- [ ] **Step 5: Push**

```bash
git push origin HEAD
```

Expected: branch pushed to GitHub for Vercel deployment.

---

## Self-Review Notes

Spec coverage:

- Report-first concept: Task 2 hero/report preview and Task 3 composition.
- 80% system / 20% human warmth: Task 2 hero illustration.
- Compact hero disclaimer: Task 2 hero and Task 3 footer.
- Problem, flow, report, safety, final CTA sections: Task 2 and Task 3.
- Warm clinical premium palette: Task 1.
- Subtle motion and reduced motion: Task 1 and Task 2 hero.
- No unsafe claims: Task 3 search and Task 4 visual review.

Placeholder scan: no task contains TBD/TODO placeholders; code details are implemented during execution with exact files and verification commands.
