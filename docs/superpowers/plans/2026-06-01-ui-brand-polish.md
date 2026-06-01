# UI Brand Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the provided SINAD+ logo across the web app/PDF/browser tab and fix the reported UI bugs around date picker opacity, profile visibility, report labels, logout visibility, long records, and helpful screening auto-advance.

**Architecture:** Add one reusable brand component backed by a committed SVG in `public/brand/`, reuse existing category/domain display helpers, and keep form UX changes localized to the existing DatePicker, AppShell, laporan, catatan, skrining, and PDF modules. Use Playwright E2E coverage for visible UI behavior and Vitest for existing report/scoring safety.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS utilities, @react-pdf/renderer, Playwright, Vitest.

---

## File Structure

- Create `public/brand/sinad-logo.svg` — committed copy of the user-provided root logo asset.
- Create `components/brand/brand-mark.tsx` — shared web brand mark component using `next/image` for consistent logo rendering.
- Modify `app/layout.tsx` — register browser tab icon metadata.
- Modify `components/layout/public-nav.tsx` — replace hardcoded `S+` with `BrandMark`.
- Modify `components/layout/app-shell.tsx` — use logo, add desktop profile summary, make logout red/visible.
- Modify `app/(demo)/login/page.tsx` and `app/(demo)/login/loading.tsx` — replace hardcoded `S+` with logo.
- Modify `components/ui/date-picker.tsx` — fix calendar stacking/opacity.
- Modify `app/(app)/laporan/page.tsx` — human-readable category/domain labels.
- Modify `lib/report/report-pdf.tsx` — show logo and human-readable category/domain labels in PDF.
- Modify `app/(app)/catatan/page.tsx` — sticky form and bounded history scroll for many notes.
- Modify `app/(app)/skrining/screening-form.tsx` — helpful auto-scroll to next unanswered question.
- Modify `tests/e2e/demo-flow.spec.ts` — Playwright coverage for logo, date picker, report labels, and screening auto-advance.

---

### Task 1: Add Logo Asset and Shared BrandMark

**Files:**
- Create: `public/brand/sinad-logo.svg`
- Create: `components/brand/brand-mark.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/layout/public-nav.tsx`
- Modify: `app/(demo)/login/page.tsx`
- Modify: `app/(demo)/login/loading.tsx`

- [ ] **Step 1: Copy the user logo into the worktree asset directory**

Run from the worktree root `D:\Kuliah\rhenata\sinadplus-app\.worktrees\sinadplus-mvp-implementation`:

```powershell
New-Item -ItemType Directory -Force "public/brand"
Copy-Item "D:/Kuliah/rhenata/sinadplus-app/1_1 DraftLogo_Sinad+.svg" "public/brand/sinad-logo.svg" -Force
```

Expected: `public/brand/sinad-logo.svg` exists and contains the SVG.

- [ ] **Step 2: Write the failing Playwright test for logo visibility on login and app shell**

Append this test to `tests/e2e/demo-flow.spec.ts`:

```ts
test.describe('SINAD+ Branding', () => {
  test('uses the provided logo on login and authenticated shell', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('img', { name: 'Logo SINAD+' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');

    await expect(page.getByRole('img', { name: 'Logo SINAD+' }).first()).toBeVisible();
  });
});
```

- [ ] **Step 3: Run the logo test and verify it fails**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "uses the provided logo" --reporter=line
```

Expected: FAIL because no image has accessible name `Logo SINAD+` yet.

- [ ] **Step 4: Create the shared BrandMark component**

Create `components/brand/brand-mark.tsx`:

```tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
  imageClassName?: string
  priority?: boolean
}

export function BrandMark({ className, imageClassName, priority = false }: BrandMarkProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-blue-100',
        className,
      )}
    >
      <Image
        src="/brand/sinad-logo.svg"
        alt="Logo SINAD+"
        width={64}
        height={64}
        priority={priority}
        className={cn('h-full w-full object-contain p-1.5', imageClassName)}
      />
    </span>
  )
}
```

- [ ] **Step 5: Register the browser tab icon**

Modify `app/layout.tsx` metadata to include icons:

```tsx
export const metadata: Metadata = {
  title: "SINAD+ - Pendampingan Awal Perkembangan Anak",
  description: "Alat bantu pendampingan perkembangan anak dengan skrining awal, aktivitas terstruktur, dan laporan konsultasi.",
  icons: {
    icon: '/brand/sinad-logo.svg',
    shortcut: '/brand/sinad-logo.svg',
    apple: '/brand/sinad-logo.svg',
  },
};
```

- [ ] **Step 6: Use BrandMark in public nav**

Modify `components/layout/public-nav.tsx` to import and render `BrandMark` instead of the hardcoded `S+` block:

```tsx
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants/copy'
import { BrandMark } from '@/components/brand/brand-mark'

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Beranda SINAD+">
          <BrandMark className="h-10 w-10 rounded-xl" priority />
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-950">{APP_NAME}</div>
            <div className="text-xs font-medium text-slate-500">Pendampingan awal</div>
          </div>
        </Link>
        <Link
          href="/login"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Masuk Demo
        </Link>
      </div>
    </header>
  )
}
```

If the existing file has more nav links, preserve those links and only replace the hardcoded mark with `<BrandMark />`.

- [ ] **Step 7: Use BrandMark in login page and login loading**

In both `app/(demo)/login/page.tsx` and `app/(demo)/login/loading.tsx`:

1. Add:

```tsx
import { BrandMark } from '@/components/brand/brand-mark'
```

2. Replace the hardcoded mark:

```tsx
<span className="...">S+</span>
```

with:

```tsx
<BrandMark className="mb-4 h-14 w-14" priority />
```

For the loading page, keep the animated orb wrappers and place `<BrandMark className="relative h-14 w-14 rounded-full" priority />` where the `S+` span currently sits.

- [ ] **Step 8: Run the logo test and verify it passes**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "uses the provided logo" --reporter=line
```

Expected: PASS.

- [ ] **Step 9: Commit Task 1**

Run:

```powershell
git add public/brand/sinad-logo.svg components/brand/brand-mark.tsx app/layout.tsx components/layout/public-nav.tsx 'app/(demo)/login/page.tsx' 'app/(demo)/login/loading.tsx' tests/e2e/demo-flow.spec.ts
git commit -m @'
feat: add SINAD+ brand logo

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

---

### Task 2: Fix App Shell Profile and Logout Visibility

**Files:**
- Modify: `components/layout/app-shell.tsx`
- Test: `tests/e2e/demo-flow.spec.ts`

- [ ] **Step 1: Write the failing Playwright test**

Append this test to `tests/e2e/demo-flow.spec.ts`:

```ts
test.describe('Authenticated Shell', () => {
  test('shows desktop profile summary and prominent logout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');

    await expect(page.getByRole('link', { name: /Profil Alya/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Keluar' })).toHaveClass(/text-red-700/);
  });
});
```

- [ ] **Step 2: Run the shell test and verify it fails**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "desktop profile summary" --reporter=line
```

Expected: FAIL because the top-right profile summary is not present and logout is not red.

- [ ] **Step 3: Modify AppShell imports**

In `components/layout/app-shell.tsx`, add `BrandMark` import and ensure `LogOut` has trailing comma style:

```tsx
import { BrandMark } from '@/components/brand/brand-mark'
```

- [ ] **Step 4: Replace mobile and sidebar text logo with BrandMark**

In mobile header, replace the text-only link with:

```tsx
<Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
  <BrandMark className="h-9 w-9 rounded-xl" priority />
  <span>SINAD+</span>
</Link>
```

In sidebar logo block, replace the text-only link with:

```tsx
<Link
  href="/dashboard"
  className="flex items-center gap-3 text-xl font-semibold text-slate-900"
  onClick={() => setMobileMenuOpen(false)}
>
  <BrandMark className="h-10 w-10 rounded-xl" priority />
  <span>SINAD+</span>
</Link>
```

- [ ] **Step 5: Add desktop top-right profile summary**

Change the main content area from:

```tsx
<main className="lg:pl-64 pt-16 lg:pt-0">
  <div className="min-h-screen">
    {children}
  </div>
</main>
```

to:

```tsx
<main className="pt-16 lg:pl-64 lg:pt-0">
  <div className="hidden h-16 items-center justify-end border-b border-slate-200 bg-white/80 px-6 backdrop-blur lg:flex">
    <Link
      href="/anak"
      aria-label="Profil Alya"
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
        A
      </span>
      <span className="text-right">
        <span className="block text-sm font-semibold text-slate-900">Alya</span>
        <span className="block text-xs text-slate-500 group-hover:text-blue-700">Profil Anak</span>
      </span>
    </Link>
  </div>
  <div className="min-h-[calc(100vh-4rem)]">
    {children}
  </div>
</main>
```

- [ ] **Step 6: Make logout red and visible**

Replace the logout button class with:

```tsx
className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:border-red-200 hover:bg-red-100 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/30"
```

- [ ] **Step 7: Run the shell test and verify it passes**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "desktop profile summary" --reporter=line
```

Expected: PASS.

- [ ] **Step 8: Commit Task 2**

Run:

```powershell
git add components/layout/app-shell.tsx tests/e2e/demo-flow.spec.ts
git commit -m @'
feat: polish authenticated shell header

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

---

### Task 3: Fix DatePicker Calendar Opacity and Stacking

**Files:**
- Modify: `components/ui/date-picker.tsx`
- Test: `tests/e2e/demo-flow.spec.ts`

- [ ] **Step 1: Write the failing Playwright test**

Append this test to `tests/e2e/demo-flow.spec.ts`:

```ts
test.describe('App Form Widgets', () => {
  test('date picker calendar is opaque and above following form controls', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');
    await page.getByRole('link', { name: 'Catatan' }).click();

    await page.getByRole('button', { name: /Juni 2026/ }).click();
    const dialog = page.getByRole('dialog', { name: 'Pilih tanggal' });

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    const hit = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return target?.closest('[role="dialog"]') === element;
    });

    expect(hit).toBe(true);
  });
});
```

If this creates a duplicate `test.describe('App Form Widgets')`, merge the test into the existing block instead of adding a second block.

- [ ] **Step 2: Run the DatePicker test and verify it fails or reproduces the bug**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "date picker calendar" --reporter=line
```

Expected: FAIL if the calendar is intercepted/transparent; if it passes on CSS but manual runtime still shows transparency, continue with the implementation and verify manually.

- [ ] **Step 3: Fix DatePicker stacking context**

Change the outer wrapper in `components/ui/date-picker.tsx` from:

```tsx
<div className="animate-fade-in">
```

to:

```tsx
<div className={cn('animate-fade-in relative', open && 'z-40')}>
```

- [ ] **Step 4: Strengthen calendar panel opacity and shadow**

Change the dialog class from:

```tsx
className="animate-scale-in absolute z-20 mt-2 w-72 origin-top rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10"
```

to:

```tsx
className="animate-scale-in absolute z-50 mt-2 w-72 origin-top rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5"
```

- [ ] **Step 5: Run the DatePicker test and verify it passes**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "date picker calendar" --reporter=line
```

Expected: PASS.

- [ ] **Step 6: Commit Task 3**

Run:

```powershell
git add components/ui/date-picker.tsx tests/e2e/demo-flow.spec.ts
git commit -m @'
fix: keep date picker calendar above form controls

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

---

### Task 4: Fix Human-Readable Category/Domain Labels in Laporan and PDF

**Files:**
- Modify: `app/(app)/laporan/page.tsx`
- Modify: `lib/report/report-pdf.tsx`
- Test: `tests/e2e/demo-flow.spec.ts`
- Existing tests: `lib/report/build-report-data.test.ts`

- [ ] **Step 1: Write the failing Playwright test for laporan labels**

Append this test to `tests/e2e/demo-flow.spec.ts`:

```ts
test.describe('Laporan Page', () => {
  test('renders human-readable screening category and domain', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');
    await page.getByRole('link', { name: 'Laporan' }).click();

    await expect(page.getByText('Perlu Diperhatikan')).toBeVisible();
    await expect(page.getByText('perlu_diperhatikan')).toHaveCount(0);
    await expect(page.getByText('Inatensi')).toBeVisible();
    await expect(page.getByText('inattention')).toHaveCount(0);
  });
});
```

- [ ] **Step 2: Run laporan label test and verify it fails**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "human-readable screening" --reporter=line
```

Expected: FAIL because the page currently renders raw values.

- [ ] **Step 3: Update laporan page imports**

In `app/(app)/laporan/page.tsx`, add:

```tsx
import { getCategoryDisplay, getDomainLabel } from '@/lib/constants/categories'
```

- [ ] **Step 4: Update laporan page category/domain rendering**

Inside the `reportData.latestScreening` section, before the return is not possible because it is inline JSX. Replace the paragraph:

```tsx
<p className="mt-4 text-sm text-slate-600">
  Kategori: <strong>{reportData.latestScreening.category}</strong> · Domain dominan:{' '}
  <strong>{reportData.latestScreening.dominant_domain}</strong>
</p>
```

with:

```tsx
<div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
  <span>Kategori:</span>
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getCategoryDisplay(reportData.latestScreening.category).badgeClass}`}
  >
    <span className={`h-2 w-2 rounded-full ${getCategoryDisplay(reportData.latestScreening.category).dotClass}`} />
    {getCategoryDisplay(reportData.latestScreening.category).label}
  </span>
  <span className="mx-1 text-slate-300">•</span>
  <span>Domain dominan: <strong className="text-slate-900">{getDomainLabel(reportData.latestScreening.dominant_domain)}</strong></span>
</div>
```

- [ ] **Step 5: Update PDF imports**

In `lib/report/report-pdf.tsx`, change the import from:

```tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
```

to:

```tsx
import { Document, Image, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
```

Add:

```tsx
import path from 'node:path'
import { getCategoryDisplay, getDomainLabel } from '@/lib/constants/categories'
```

Add near the top after imports:

```tsx
const LOGO_PATH = path.join(process.cwd(), 'public', 'brand', 'sinad-logo.svg')
```

- [ ] **Step 6: Add PDF logo styles**

Add to `StyleSheet.create`:

```tsx
brandRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
logo: {
  width: 36,
  height: 36,
},
```

- [ ] **Step 7: Render logo in PDF header**

Replace the header title block:

```tsx
<View style={styles.header}>
  <View>
    <Text style={styles.title}>SINAD+</Text>
    <Text style={styles.subtitle}>Laporan Konsultasi Anak</Text>
  </View>
```

with:

```tsx
<View style={styles.header}>
  <View style={styles.brandRow}>
    <Image src={LOGO_PATH} style={styles.logo} />
    <View>
      <Text style={styles.title}>SINAD+</Text>
      <Text style={styles.subtitle}>Laporan Konsultasi Anak</Text>
    </View>
  </View>
```

- [ ] **Step 8: Render human-readable labels in PDF**

In `ReportPDF`, add immediately inside the function before `return`:

```tsx
const categoryDisplay = data.latestScreening ? getCategoryDisplay(data.latestScreening.category) : null
const domainLabel = data.latestScreening ? getDomainLabel(data.latestScreening.dominant_domain) : null
```

Replace PDF category/domain value rendering:

```tsx
<Text style={styles.value}>{data.latestScreening.category}</Text>
```

with:

```tsx
<Text style={styles.value}>{categoryDisplay?.label ?? data.latestScreening.category}</Text>
```

Replace:

```tsx
{data.latestScreening.dominant_domain}
```

with:

```tsx
{domainLabel ?? data.latestScreening.dominant_domain}
```

- [ ] **Step 9: Run tests and verify labels pass**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "human-readable screening" --reporter=line
npm test
```

Expected: Playwright label test PASS. Vitest `3 passed`, `23 passed` or updated count if tests changed.

- [ ] **Step 10: Commit Task 4**

Run:

```powershell
git add 'app/(app)/laporan/page.tsx' lib/report/report-pdf.tsx tests/e2e/demo-flow.spec.ts
git commit -m @'
fix: render readable report labels

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

---

### Task 5: Improve Long Catatan History UX

**Files:**
- Modify: `app/(app)/catatan/page.tsx`

- [ ] **Step 1: Write the failing Playwright test for bounded history**

Append this test to `tests/e2e/demo-flow.spec.ts`:

```ts
test.describe('Catatan Page', () => {
  test('keeps note history in a bounded scroll region on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');
    await page.getByRole('link', { name: 'Catatan' }).click();

    const history = page.getByTestId('catatan-history-scroll');
    await expect(history).toBeVisible();
    await expect(history).toHaveClass(/lg:max-h-\[calc\(100vh-14rem\)\]/);
    await expect(history).toHaveClass(/lg:overflow-y-auto/);
  });
});
```

- [ ] **Step 2: Run bounded history test and verify it fails**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "bounded scroll region" --reporter=line
```

Expected: FAIL because the data-testid and bounded scroll classes are not present.

- [ ] **Step 3: Make the form sticky on desktop**

In `app/(app)/catatan/page.tsx`, change:

```tsx
<div>
  <h2 className="mb-4 text-xl font-semibold text-slate-900">Tambah Catatan Baru</h2>
  <div className="sinad-card p-6">
    <BehaviorLogForm activities={activities} />
  </div>
</div>
```

to:

```tsx
<div className="lg:sticky lg:top-24 lg:self-start">
  <h2 className="mb-4 text-xl font-semibold text-slate-900">Tambah Catatan Baru</h2>
  <div className="sinad-card p-6">
    <BehaviorLogForm activities={activities} />
  </div>
</div>
```

- [ ] **Step 4: Add bounded scroll container around note history**

Change:

```tsx
<div className="space-y-4">
  {logs.map((log) => (
```

to:

```tsx
<div
  data-testid="catatan-history-scroll"
  className="space-y-4 pr-1 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:overscroll-contain"
>
  {logs.map((log) => (
```

- [ ] **Step 5: Add helper text for many notes**

Below the `Riwayat Catatan ({logs.length})` heading, add:

```tsx
<p className="mb-4 text-sm text-slate-500">
  Catatan terbaru tampil di atas. Jika catatan semakin banyak, daftar ini dapat digulir tanpa menutup formulir.
</p>
```

- [ ] **Step 6: Run bounded history test and verify it passes**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "bounded scroll region" --reporter=line
```

Expected: PASS.

- [ ] **Step 7: Commit Task 5**

Run:

```powershell
git add 'app/(app)/catatan/page.tsx' tests/e2e/demo-flow.spec.ts
git commit -m @'
feat: improve long catatan history layout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

---

### Task 6: Add Helpful Screening Auto-Advance

**Files:**
- Modify: `app/(app)/skrining/screening-form.tsx`
- Test: `tests/e2e/demo-flow.spec.ts`

- [ ] **Step 1: Write the failing Playwright test**

Append this test to `tests/e2e/demo-flow.spec.ts`:

```ts
test.describe('Skrining Form', () => {
  test('moves attention to the next unanswered question after answering', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');
    await page.getByRole('link', { name: 'Skrining' }).click();

    await page.locator('fieldset').first().getByText('Sedikit', { exact: true }).click();

    await expect(page.getByTestId('question-card-2')).toHaveClass(/border-blue-300/);
    await expect(page.getByText('Lanjut ke pertanyaan 2')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run auto-advance test and verify it fails**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "moves attention" --reporter=line
```

Expected: FAIL because question cards do not have test IDs and no hint appears.

- [ ] **Step 3: Add next unanswered helper functions**

In `app/(app)/skrining/screening-form.tsx`, replace `handleSelect` with:

```tsx
function getNextUnansweredId(currentQuestionId: string, nextAnswers: Record<string, number>) {
  const currentIndex = SNAP_IV_QUESTIONS.findIndex((question) => question.id === currentQuestionId)
  if (currentIndex < 0) return null

  const nextQuestion = SNAP_IV_QUESTIONS.slice(currentIndex + 1).find(
    (question) => nextAnswers[question.id] === undefined,
  )

  return nextQuestion?.id ?? null
}

function questionIsComfortablyVisible(el: HTMLDivElement) {
  const rect = el.getBoundingClientRect()
  return rect.top >= 96 && rect.bottom <= window.innerHeight - 96
}

function focusQuestion(questionId: string, message = false) {
  setActiveId(questionId)
  const el = questionRefs.current[questionId]
  if (!el) return

  if (!questionIsComfortablyVisible(el)) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: el.offsetTop - 96,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  if (message) {
    window.setTimeout(() => setActiveId((current) => (current === questionId ? current : current)), 0)
  }
}

function handleSelect(questionId: string, value: number) {
  setAnswers((prev) => {
    const wasAlreadyAnswered = prev[questionId] !== undefined
    const next = { ...prev, [questionId]: value }
    const nextUnansweredId = getNextUnansweredId(questionId, next)

    if (!wasAlreadyAnswered && nextUnansweredId) {
      window.setTimeout(() => focusQuestion(nextUnansweredId, true), 120)
    }

    return next
  })
}
```

- [ ] **Step 4: Add test ids and helpful active hint**

In the question card wrapper, add `data-testid` and use active styling:

```tsx
data-testid={`question-card-${index + 1}`}
```

Inside each card after `</fieldset>`, add:

```tsx
{activeId === question.id && selected === undefined && (
  <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
    Lanjut ke pertanyaan {index + 1}
  </p>
)}
```

- [ ] **Step 5: Simplify the unused message parameter if lint complains**

If ESLint flags `message` as unused, remove it from `focusQuestion` signature and calls:

```tsx
function focusQuestion(questionId: string) {
  setActiveId(questionId)
  const el = questionRefs.current[questionId]
  if (!el) return

  if (!questionIsComfortablyVisible(el)) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: el.offsetTop - 96,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }
}
```

And call `focusQuestion(nextUnansweredId)`.

- [ ] **Step 6: Run auto-advance test and verify it passes**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --grep "moves attention" --reporter=line
```

Expected: PASS.

- [ ] **Step 7: Commit Task 6**

Run:

```powershell
git add 'app/(app)/skrining/screening-form.tsx' tests/e2e/demo-flow.spec.ts
git commit -m @'
feat: guide screening users to next unanswered question

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

---

### Task 7: Final Runtime Verification and Push

**Files:**
- No new source files unless verification exposes a bug.

- [ ] **Step 1: Run unit tests**

Run:

```powershell
npm test
```

Expected: all Vitest tests pass.

- [ ] **Step 2: Run lint**

Run:

```powershell
npm run lint
```

Expected: exit 0, no ESLint errors.

- [ ] **Step 3: Run production build**

Run:

```powershell
npm run build
```

Expected: build completes successfully. The existing Next.js middleware/proxy warning may appear and is not part of this task.

- [ ] **Step 4: Run Chromium E2E suite**

Run:

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'; npx playwright test tests/e2e/demo-flow.spec.ts --project=chromium --reporter=line
```

Expected: all desktop Chromium tests pass, mobile-specific test may be skipped under desktop project.

- [ ] **Step 5: Runtime observation**

Launch:

```powershell
npm run dev
```

Drive in browser/Playwright:

1. `/login` shows real logo and disclaimer.
2. Browser tab uses `/brand/sinad-logo.svg` as icon.
3. After demo login, desktop app shell shows logo, top-right `Profil Alya`, and red `Keluar`.
4. `/catatan` DatePicker panel is opaque and sits above rating controls.
5. `/catatan` history column has bounded desktop scroll.
6. `/laporan` shows `Perlu Diperhatikan` and `Inatensi` instead of raw enum values.
7. `/skrining` answering question 1 highlights/guides to question 2 without jumping backwards.
8. `/api/reports/generate` returns a PDF response with HTTP 200 and `Content-Type: application/pdf`.

- [ ] **Step 6: Commit any verification fixes**

If Step 5 exposes a bug, fix it with a failing test first, run the targeted test, then commit:

```powershell
git add <changed-files>
git commit -m @'
fix: address UI verification finding

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

- [ ] **Step 7: Push branch**

Run:

```powershell
git push
```

Expected: branch `feature/sinadplus-mvp-implementation` pushed to origin.

---

## Self-Review

- Spec coverage: Logo move/browser tab/app/PDF covered by Tasks 1 and 4; DatePicker bug by Task 3; profile/logout by Task 2; laporan raw labels by Task 4; many catatan by Task 5; screening next-question UX by Task 6; verification by Task 7.
- Placeholder scan: No `TBD`, `TODO`, or undefined implementation steps remain.
- Type consistency: `BrandMark`, `getCategoryDisplay`, `getDomainLabel`, and existing `SNAP_IV_QUESTIONS` names match existing code or are created in this plan.
