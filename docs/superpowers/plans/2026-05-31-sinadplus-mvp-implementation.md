# SINAD+ MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished working SINAD+ competition-demo MVP: landing page → seeded demo login → dashboard → SNAP-IV screening/results → activities/logs → generated PDF consultation report.

**Architecture:** Use Next.js App Router with a small set of focused domain modules under `lib/` and feature components under `components/`. Supabase is the production-like data/auth backend, with seed data for the demo path and typed access helpers isolated from UI. Core business logic such as SNAP-IV scoring and report data building is pure TypeScript and tested before UI integration.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase SSR, Supabase Postgres, Vitest, Playwright, PDF generation via `@react-pdf/renderer` unless implementation-time testing shows a blocker.

---

## File Structure Map

Create or modify these files during implementation:

```text
package.json                         # scripts and dependencies
next.config.ts                       # Next.js config
postcss.config.mjs                   # Tailwind PostCSS config
tailwind.config.ts                   # Tailwind theme tokens
tsconfig.json                        # TypeScript path aliases
vitest.config.ts                     # unit test config
playwright.config.ts                 # E2E config
.env.example                         # required Supabase/demo env vars
README.md                            # setup, seed, run, deploy notes

app/layout.tsx                       # root layout metadata and fonts
app/globals.css                      # design tokens, base styles, animations
app/(public)/page.tsx                # landing page
app/(demo)/login/page.tsx            # demo login page
app/(demo)/login/actions.ts          # one-click demo sign-in server action
app/(app)/layout.tsx                 # protected app shell
app/(app)/dashboard/page.tsx         # dashboard
app/(app)/anak/page.tsx              # seeded child profile view
app/(app)/skrining/page.tsx          # guided SNAP-IV form
app/(app)/skrining/actions.ts        # save screening action
app/(app)/hasil/[screeningId]/page.tsx # screening result detail
app/(app)/aktivitas/page.tsx         # activity library
app/(app)/aktivitas/[activityId]/page.tsx # activity detail
app/(app)/catatan/page.tsx           # behavior log list/form
app/(app)/catatan/actions.ts         # save behavior log action
app/(app)/laporan/page.tsx           # report preview
app/api/reports/generate/route.ts    # generated PDF route
app/(app)/edukasi/page.tsx           # article list
app/(app)/edukasi/[articleId]/page.tsx # article detail
middleware.ts                        # Supabase session refresh and app route guard

components/layout/app-shell.tsx      # sidebar/topbar shell
components/layout/public-nav.tsx     # public nav
components/dashboard/*.tsx           # focused dashboard cards
components/screening/*.tsx           # question stepper and scale controls
components/results/*.tsx             # result summary/disclaimer/activity suggestions
components/activities/*.tsx          # activity cards/details
components/logs/*.tsx                # log form/list
components/report/*.tsx              # report preview sections
components/ui/*                      # shadcn components

lib/constants/copy.ts                # Indonesian disclaimers and app copy
lib/scoring/snap-iv.ts               # SNAP-IV questions and scoring
lib/scoring/snap-iv.test.ts          # scoring tests
lib/report/build-report-data.ts      # pure report snapshot builder
lib/report/build-report-data.test.ts # report builder tests
lib/report/report-pdf.tsx            # PDF document component
lib/supabase/client.ts               # browser client
lib/supabase/server.ts               # server client
lib/supabase/queries.ts              # typed read helpers
lib/supabase/types.ts                # generated or hand-written DB types
lib/seed-data/*.ts                   # seeded content constants
lib/validation/*.ts                  # zod schemas

supabase/migrations/0001_initial.sql # schema/RLS policies
supabase/seed.sql                    # demo seed data

tests/e2e/demo-flow.spec.ts          # Playwright core journey
```

---

## Task 1: Scaffold Next.js app and baseline tooling

**Files:**
- Create/modify: `package.json`
- Create/modify: `app/layout.tsx`
- Create/modify: `app/globals.css`
- Create/modify: `tsconfig.json`
- Create: `.env.example`
- Create: `vitest.config.ts`

- [ ] **Step 1: Scaffold the project in the existing repo**

Run from `D:/Kuliah/rhenata/sinadplus-app`:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir false --import-alias "@/*"
```

When prompted about overwriting files, do not overwrite the existing proposal/spec docs. Expected: Next.js files are created and existing docs remain.

- [ ] **Step 2: Install core dependencies**

```bash
npm install @supabase/ssr @supabase/supabase-js zod date-fns lucide-react clsx tailwind-merge class-variance-authority @react-pdf/renderer
npm install -D vitest @vitejs/plugin-react jsdom playwright
```

Expected: dependencies are added to `package.json`.

- [ ] **Step 3: Add test scripts to `package.json`**

Ensure `scripts` includes:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "e2e": "playwright test"
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': new URL('./', import.meta.url).pathname,
    },
  },
})
```

- [ ] **Step 5: Create `.env.example`**

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEMO_EMAIL=demo@sinadplus.local
DEMO_PASSWORD=sinadplus-demo-2026
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 6: Verify scaffold**

Run:

```bash
npm run lint
npm run test
```

Expected: lint passes or only scaffold-generated issues appear; tests pass with no tests found only if Vitest exits successfully. If Vitest fails because no tests exist, add this temporary file and rerun:

`lib/smoke.test.ts`

```ts
import { describe, expect, it } from 'vitest'

describe('test setup', () => {
  it('runs vitest', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json app next.config.* postcss.config.* tailwind.config.* tsconfig.json vitest.config.ts .env.example lib/smoke.test.ts
 git commit -m "chore: scaffold Next.js app

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Install shadcn/ui and define calm clinical design system

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Create/modify: `components/ui/*`
- Create: `lib/constants/copy.ts`

- [ ] **Step 1: Initialize shadcn/ui**

Run:

```bash
npx shadcn@latest init
```

Choose defaults compatible with Next.js App Router, Tailwind, and `@/components` alias.

- [ ] **Step 2: Add MVP components**

```bash
npx shadcn@latest add button card badge alert progress tabs input label textarea select separator sheet table dialog skeleton
```

Expected: component files appear under `components/ui/`.

- [ ] **Step 3: Replace `app/globals.css` design tokens**

Use a blue-led warm palette and subtle animations:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 214 84% 56%;
    --primary-foreground: 0 0% 100%;
    --secondary: 205 45% 92%;
    --secondary-foreground: 215 35% 24%;
    --muted: 210 32% 94%;
    --muted-foreground: 215 16% 47%;
    --accent: 174 48% 88%;
    --accent-foreground: 180 45% 20%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 88%;
    --input: 214 32% 88%;
    --ring: 214 84% 56%;
    --radius: 1rem;
  }

  * { @apply border-border; }

  body {
    @apply bg-background text-foreground antialiased;
    background:
      radial-gradient(circle at top left, hsl(214 84% 92% / 0.8), transparent 32rem),
      linear-gradient(180deg, hsl(210 40% 98%), hsl(202 48% 96%));
  }
}

@layer utilities {
  .sinad-card {
    @apply rounded-3xl border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(30,64,175,0.08)] backdrop-blur;
  }

  .animate-soft-in {
    animation: soft-in 520ms ease both;
  }
}

@keyframes soft-in {
  from { opacity: 0; transform: translateY(10px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

- [ ] **Step 4: Create `lib/constants/copy.ts`**

```ts
export const APP_NAME = 'SINAD+'

export const MEDICAL_DISCLAIMER =
  'SINAD+ bukan alat diagnosis medis. Hasil skrining bersifat indikasi awal dan perlu dikonsultasikan dengan psikolog, psikiater anak, atau dokter anak untuk evaluasi profesional.'

export const CONTENT_REVIEW_DISCLAIMER =
  'Konten edukasi disusun dari sumber terbuka dan perlu validasi lebih lanjut oleh ahli.'

export const PRODUCT_PROMISE =
  'Membantu orang tua memahami sinyal awal, mencoba pendampingan rumah yang aman, mencatat perkembangan, dan menyiapkan laporan untuk konsultasi profesional.'
```

- [ ] **Step 5: Verify**

```bash
npm run lint
npm run test
```

Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css tailwind.config.ts components/ui lib/constants/copy.ts components.json
 git commit -m "style: add calm clinical design system

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Implement SNAP-IV domain logic with tests

**Files:**
- Create: `lib/scoring/snap-iv.ts`
- Create: `lib/scoring/snap-iv.test.ts`

- [ ] **Step 1: Write failing tests in `lib/scoring/snap-iv.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { SNAP_IV_QUESTIONS, scoreSnapIv } from './snap-iv'

describe('SNAP-IV scoring', () => {
  it('contains 18 MVP questions split into two domains', () => {
    expect(SNAP_IV_QUESTIONS).toHaveLength(18)
    expect(SNAP_IV_QUESTIONS.filter((q) => q.domain === 'inattention')).toHaveLength(9)
    expect(SNAP_IV_QUESTIONS.filter((q) => q.domain === 'hyperactivity_impulsivity')).toHaveLength(9)
  })

  it('scores domain totals and dominant domain', () => {
    const answers = Object.fromEntries(
      SNAP_IV_QUESTIONS.map((question, index) => [question.id, index < 9 ? 3 : 1]),
    )
    const result = scoreSnapIv(answers)
    expect(result.inattentionScore).toBe(27)
    expect(result.hyperactivityImpulsivityScore).toBe(9)
    expect(result.totalScore).toBe(36)
    expect(result.dominantDomain).toBe('inattention')
    expect(result.category).toBe('perlu_diperhatikan')
  })

  it('rejects incomplete answers', () => {
    expect(() => scoreSnapIv({ q1: 1 })).toThrow('Jawaban SNAP-IV belum lengkap')
  })
})
```

- [ ] **Step 2: Run failing test**

```bash
npm run test -- lib/scoring/snap-iv.test.ts
```

Expected: fail because `snap-iv.ts` does not exist.

- [ ] **Step 3: Implement `lib/scoring/snap-iv.ts`**

```ts
export type SnapIvDomain = 'inattention' | 'hyperactivity_impulsivity'
export type SnapIvCategory = 'rendah' | 'perlu_diperhatikan' | 'tinggi'

export type SnapIvQuestion = {
  id: string
  domain: SnapIvDomain
  text: string
}

export type SnapIvScore = {
  inattentionScore: number
  hyperactivityImpulsivityScore: number
  totalScore: number
  dominantDomain: SnapIvDomain
  category: SnapIvCategory
  summary: string
}

export const SNAP_IV_SCALE = [
  { value: 0, label: 'Tidak pernah' },
  { value: 1, label: 'Kadang-kadang' },
  { value: 2, label: 'Sering' },
  { value: 3, label: 'Sangat sering' },
] as const

export const SNAP_IV_QUESTIONS: SnapIvQuestion[] = [
  { id: 'q1', domain: 'inattention', text: 'Sering gagal memperhatikan detail atau membuat kesalahan ceroboh.' },
  { id: 'q2', domain: 'inattention', text: 'Sering sulit mempertahankan perhatian saat tugas atau bermain.' },
  { id: 'q3', domain: 'inattention', text: 'Sering tampak tidak mendengarkan ketika diajak bicara langsung.' },
  { id: 'q4', domain: 'inattention', text: 'Sering tidak mengikuti instruksi sampai selesai.' },
  { id: 'q5', domain: 'inattention', text: 'Sering sulit mengatur tugas atau aktivitas.' },
  { id: 'q6', domain: 'inattention', text: 'Sering menghindari tugas yang membutuhkan usaha mental berkelanjutan.' },
  { id: 'q7', domain: 'inattention', text: 'Sering kehilangan barang yang diperlukan untuk aktivitas.' },
  { id: 'q8', domain: 'inattention', text: 'Sering mudah terdistraksi oleh rangsangan sekitar.' },
  { id: 'q9', domain: 'inattention', text: 'Sering lupa dalam aktivitas sehari-hari.' },
  { id: 'q10', domain: 'hyperactivity_impulsivity', text: 'Sering gelisah atau menggerakkan tangan/kaki saat duduk.' },
  { id: 'q11', domain: 'hyperactivity_impulsivity', text: 'Sering meninggalkan tempat duduk saat diharapkan tetap duduk.' },
  { id: 'q12', domain: 'hyperactivity_impulsivity', text: 'Sering berlari atau memanjat pada situasi yang kurang tepat.' },
  { id: 'q13', domain: 'hyperactivity_impulsivity', text: 'Sering sulit bermain atau beraktivitas dengan tenang.' },
  { id: 'q14', domain: 'hyperactivity_impulsivity', text: 'Sering tampak terus bergerak seperti didorong mesin.' },
  { id: 'q15', domain: 'hyperactivity_impulsivity', text: 'Sering berbicara berlebihan.' },
  { id: 'q16', domain: 'hyperactivity_impulsivity', text: 'Sering menjawab sebelum pertanyaan selesai.' },
  { id: 'q17', domain: 'hyperactivity_impulsivity', text: 'Sering sulit menunggu giliran.' },
  { id: 'q18', domain: 'hyperactivity_impulsivity', text: 'Sering menyela atau mengganggu orang lain.' },
]

export function scoreSnapIv(answers: Record<string, number>): SnapIvScore {
  const missing = SNAP_IV_QUESTIONS.filter((question) => answers[question.id] === undefined)
  if (missing.length > 0) throw new Error('Jawaban SNAP-IV belum lengkap')

  for (const question of SNAP_IV_QUESTIONS) {
    const value = answers[question.id]
    if (!Number.isInteger(value) || value < 0 || value > 3) {
      throw new Error(`Nilai jawaban tidak valid untuk ${question.id}`)
    }
  }

  const inattentionScore = SNAP_IV_QUESTIONS
    .filter((question) => question.domain === 'inattention')
    .reduce((total, question) => total + answers[question.id], 0)
  const hyperactivityImpulsivityScore = SNAP_IV_QUESTIONS
    .filter((question) => question.domain === 'hyperactivity_impulsivity')
    .reduce((total, question) => total + answers[question.id], 0)
  const totalScore = inattentionScore + hyperactivityImpulsivityScore
  const dominantDomain = inattentionScore >= hyperactivityImpulsivityScore ? 'inattention' : 'hyperactivity_impulsivity'

  let category: SnapIvCategory = 'rendah'
  if (totalScore >= 36) category = 'tinggi'
  else if (totalScore >= 18) category = 'perlu_diperhatikan'

  return {
    inattentionScore,
    hyperactivityImpulsivityScore,
    totalScore,
    dominantDomain,
    category,
    summary: getCategorySummary(category),
  }
}

function getCategorySummary(category: SnapIvCategory): string {
  if (category === 'tinggi') return 'Pola jawaban menunjukkan banyak perilaku yang perlu diperhatikan dan sebaiknya dikonsultasikan dengan profesional.'
  if (category === 'perlu_diperhatikan') return 'Beberapa perilaku tampak cukup sering muncul. Orang tua dapat mulai mencatat pola dan mempertimbangkan konsultasi.'
  return 'Pola jawaban saat ini relatif rendah, namun orang tua tetap dapat melakukan observasi berkala bila ada kekhawatiran.'
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test -- lib/scoring/snap-iv.test.ts
```

Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add lib/scoring/snap-iv.ts lib/scoring/snap-iv.test.ts
 git commit -m "feat: add SNAP-IV scoring logic

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Add Supabase schema and seed data

**Files:**
- Create: `supabase/migrations/0001_initial.sql`
- Create: `supabase/seed.sql`
- Create: `lib/supabase/types.ts`

- [ ] **Step 1: Create migration `supabase/migrations/0001_initial.sql`**

```sql
create extension if not exists "pgcrypto";

create table public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  gender text not null check (gender in ('laki_laki', 'perempuan')),
  birth_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.screenings (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  completed_at timestamptz not null default now(),
  inattention_score integer not null,
  hyperactivity_impulsivity_score integer not null,
  total_score integer not null,
  category text not null,
  dominant_domain text not null,
  answers_json jsonb not null,
  disclaimer_version text not null default 'v1',
  created_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  domain text not null,
  age_min integer not null,
  age_max integer not null,
  duration_minutes integer not null,
  objective text not null,
  tools text not null,
  steps_json jsonb not null,
  observed_behaviors text not null,
  safety_notes text not null,
  stop_conditions text not null,
  rationale text not null,
  source_label text not null,
  created_at timestamptz not null default now()
);

create table public.behavior_logs (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete set null,
  log_date date not null,
  mood text not null,
  focus_rating integer not null check (focus_rating between 1 and 5),
  impulsivity_rating integer not null check (impulsivity_rating between 1 and 5),
  cooperation_rating integer not null check (cooperation_rating between 1 and 5),
  notes text not null,
  incident_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  summary text not null,
  body text not null,
  source_label text not null,
  reviewer_status text not null,
  read_time_minutes integer not null,
  created_at timestamptz not null default now()
);

create table public.report_snapshots (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  generated_at timestamptz not null default now(),
  title text not null,
  snapshot_json jsonb not null,
  pdf_storage_path text,
  version text not null default 'v1',
  created_at timestamptz not null default now()
);

alter table public.children enable row level security;
alter table public.screenings enable row level security;
alter table public.activities enable row level security;
alter table public.behavior_logs enable row level security;
alter table public.education_articles enable row level security;
alter table public.report_snapshots enable row level security;

create policy "demo children read" on public.children for select using (true);
create policy "demo children insert" on public.children for insert with check (true);
create policy "demo screenings read" on public.screenings for select using (true);
create policy "demo screenings insert" on public.screenings for insert with check (true);
create policy "activities read" on public.activities for select using (true);
create policy "demo logs read" on public.behavior_logs for select using (true);
create policy "demo logs insert" on public.behavior_logs for insert with check (true);
create policy "articles read" on public.education_articles for select using (true);
create policy "reports read" on public.report_snapshots for select using (true);
create policy "reports insert" on public.report_snapshots for insert with check (true);
```

- [ ] **Step 2: Create minimal seed file `supabase/seed.sql`**

Use fixed UUIDs so queries can rely on predictable demo data:

```sql
insert into public.children (id, user_id, name, gender, birth_date, notes) values
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Alya', 'perempuan', '2018-08-12', 'Profil demo untuk presentasi SINAD+.')
on conflict do nothing;

insert into public.activities (id, title, domain, age_min, age_max, duration_minutes, objective, tools, steps_json, observed_behaviors, safety_notes, stop_conditions, rationale, source_label) values
('22222222-2222-2222-2222-222222222221', 'Misi 5 Menit Fokus', 'inattention', 5, 12, 5, 'Melatih anak menyelesaikan instruksi singkat dengan distraksi minimal.', 'Kertas, pensil warna, timer', '["Pilih satu gambar sederhana.","Atur timer 5 menit.","Minta anak mewarnai hanya satu area sampai timer selesai.","Catat kapan anak terdistraksi dan bagaimana ia kembali fokus."]', 'Durasi fokus, respons terhadap instruksi, kebutuhan pengingat.', 'Lakukan di tempat aman dan tenang.', 'Hentikan bila anak tampak frustrasi, menangis, atau sangat menolak.', 'Aktivitas singkat membantu orang tua mengamati rentang fokus tanpa tekanan akademik.', 'Adaptasi edukasi pengasuhan; perlu validasi ahli'),
('22222222-2222-2222-2222-222222222222', 'Lampu Merah Lampu Hijau', 'hyperactivity_impulsivity', 5, 10, 10, 'Melatih berhenti, menunggu, dan mengikuti aba-aba sederhana.', 'Ruang aman untuk bergerak', '["Jelaskan aturan lampu hijau berarti jalan dan lampu merah berarti berhenti.","Mulai dengan tempo lambat.","Ulangi 5-8 kali.","Catat kemampuan anak berhenti saat aba-aba berubah."]', 'Kemampuan berhenti, menunggu, dan mengikuti aba-aba.', 'Pastikan lantai tidak licin dan area bebas benda tajam.', 'Hentikan bila anak berlari terlalu cepat atau sulit diarahkan dengan aman.', 'Permainan aba-aba membantu observasi kontrol impuls dalam suasana bermain.', 'Adaptasi aktivitas bermain anak; perlu validasi ahli')
on conflict do nothing;

insert into public.screenings (id, child_id, completed_at, inattention_score, hyperactivity_impulsivity_score, total_score, category, dominant_domain, answers_json) values
('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', now() - interval '14 days', 18, 13, 31, 'perlu_diperhatikan', 'inattention', '{"q1":2,"q2":2,"q3":2,"q4":2,"q5":2,"q6":2,"q7":2,"q8":2,"q9":2,"q10":1,"q11":1,"q12":1,"q13":1,"q14":2,"q15":2,"q16":2,"q17":2,"q18":1}'),
('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', now() - interval '2 days', 20, 12, 32, 'perlu_diperhatikan', 'inattention', '{"q1":2,"q2":3,"q3":2,"q4":2,"q5":2,"q6":2,"q7":2,"q8":3,"q9":2,"q10":1,"q11":1,"q12":1,"q13":1,"q14":2,"q15":1,"q16":2,"q17":2,"q18":1}')
on conflict do nothing;

insert into public.behavior_logs (child_id, activity_id, log_date, mood, focus_rating, impulsivity_rating, cooperation_rating, notes, incident_text) values
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', current_date - 5, 'Tenang', 3, 2, 4, 'Alya bisa mengikuti aktivitas sekitar 4 menit sebelum terdistraksi.', null),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', current_date - 3, 'Aktif', 2, 3, 3, 'Butuh dua kali pengingat untuk berhenti saat aba-aba merah.', 'Sempat berlari terlalu cepat lalu diarahkan pelan-pelan.'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', current_date - 1, 'Kooperatif', 4, 2, 4, 'Lebih mudah kembali fokus setelah diberi instruksi pendek.', null);

insert into public.education_articles (title, slug, category, summary, body, source_label, reviewer_status, read_time_minutes) values
('Memahami Skrining Awal ADHD', 'memahami-skrining-awal-adhd', 'Skrining', 'Apa arti skrining awal dan mengapa bukan diagnosis.', 'Skrining awal membantu orang tua mengenali pola perilaku yang perlu diamati. Hasil skrining perlu dikonsultasikan dengan profesional untuk evaluasi menyeluruh.', 'Sumber edukasi terbuka', 'Perlu validasi ahli', 4),
('Membuat Catatan Perilaku yang Berguna', 'membuat-catatan-perilaku', 'Catatan Harian', 'Cara mencatat perilaku anak secara singkat dan objektif.', 'Catatan yang berguna berisi waktu, situasi, perilaku yang terlihat, dan respons orang tua. Hindari label negatif dan fokus pada kejadian yang bisa diamati.', 'Sumber edukasi pengasuhan', 'Perlu validasi ahli', 3)
on conflict do nothing;
```

- [ ] **Step 3: Create hand-written DB type starter `lib/supabase/types.ts`**

```ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      children: { Row: { id: string; user_id: string; name: string; gender: 'laki_laki' | 'perempuan'; birth_date: string; notes: string | null; created_at: string; updated_at: string } }
      screenings: { Row: { id: string; child_id: string; completed_at: string; inattention_score: number; hyperactivity_impulsivity_score: number; total_score: number; category: string; dominant_domain: string; answers_json: Json; disclaimer_version: string; created_at: string } }
      activities: { Row: { id: string; title: string; domain: string; age_min: number; age_max: number; duration_minutes: number; objective: string; tools: string; steps_json: Json; observed_behaviors: string; safety_notes: string; stop_conditions: string; rationale: string; source_label: string; created_at: string } }
      behavior_logs: { Row: { id: string; child_id: string; activity_id: string | null; log_date: string; mood: string; focus_rating: number; impulsivity_rating: number; cooperation_rating: number; notes: string; incident_text: string | null; created_at: string; updated_at: string } }
      education_articles: { Row: { id: string; title: string; slug: string; category: string; summary: string; body: string; source_label: string; reviewer_status: string; read_time_minutes: number; created_at: string } }
      report_snapshots: { Row: { id: string; child_id: string; generated_at: string; title: string; snapshot_json: Json; pdf_storage_path: string | null; version: string; created_at: string } }
    }
  }
}
```

- [ ] **Step 4: Verify SQL manually in Supabase SQL editor or local Supabase**

Run migration and seed SQL. Expected: tables are created and seeded rows appear.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0001_initial.sql supabase/seed.sql lib/supabase/types.ts
 git commit -m "feat: add Supabase schema and seed data

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Supabase clients, queries, and app route guard

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/queries.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Create browser client `lib/supabase/client.ts`**

```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

- [ ] **Step 2: Create server client `lib/supabase/server.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Components cannot always set cookies; middleware refresh handles this path.
          }
        },
      },
    },
  )
}
```

- [ ] **Step 3: Create query helpers `lib/supabase/queries.ts`**

```ts
import { createClient } from './server'

export const DEMO_CHILD_ID = '11111111-1111-1111-1111-111111111111'

export async function getDemoChild() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('children').select('*').eq('id', DEMO_CHILD_ID).single()
  if (error) throw new Error(error.message)
  return data
}

export async function getLatestScreening(childId = DEMO_CHILD_ID) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('screenings').select('*').eq('child_id', childId).order('completed_at', { ascending: false }).limit(1).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function getScreeningById(screeningId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('screenings').select('*').eq('id', screeningId).single()
  if (error) throw new Error(error.message)
  return data
}

export async function getActivities(domain?: string) {
  const supabase = await createClient()
  let query = supabase.from('activities').select('*').order('title')
  if (domain) query = query.eq('domain', domain)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getActivityById(activityId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('activities').select('*').eq('id', activityId).single()
  if (error) throw new Error(error.message)
  return data
}

export async function getBehaviorLogs(childId = DEMO_CHILD_ID) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('behavior_logs').select('*, activities(title)').eq('child_id', childId).order('log_date', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getArticles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('education_articles').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}
```

- [ ] **Step 4: Create `middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isAppRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/anak') || request.nextUrl.pathname.startsWith('/skrining') || request.nextUrl.pathname.startsWith('/hasil') || request.nextUrl.pathname.startsWith('/aktivitas') || request.nextUrl.pathname.startsWith('/catatan') || request.nextUrl.pathname.startsWith('/laporan') || request.nextUrl.pathname.startsWith('/edukasi')

  if (isAppRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

- [ ] **Step 5: Verify**

```bash
npm run lint
npm run test
```

Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add lib/supabase middleware.ts
 git commit -m "feat: add Supabase clients and data queries

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Public landing page and demo login

**Files:**
- Create/modify: `app/(public)/page.tsx`
- Create: `app/(demo)/login/page.tsx`
- Create: `app/(demo)/login/actions.ts`
- Create: `components/layout/public-nav.tsx`

- [ ] **Step 1: Create demo login action `app/(demo)/login/actions.ts`**

```ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInDemo() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: process.env.DEMO_EMAIL!,
    password: process.env.DEMO_PASSWORD!,
  })

  if (error) throw new Error(`Demo login gagal: ${error.message}`)
  redirect('/dashboard')
}
```

- [ ] **Step 2: Create `app/(demo)/login/page.tsx`**

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInDemo } from './actions'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="sinad-card w-full max-w-md animate-soft-in">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk Demo SINAD+</CardTitle>
          <CardDescription>Gunakan data contoh agar juri dapat mencoba alur produk tanpa membuat akun.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signInDemo}>
            <Button className="w-full rounded-2xl" size="lg">Masuk Demo</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">Data demo bersifat fiktif dan hanya untuk presentasi.</p>
        </CardContent>
      </Card>
    </main>
  )
}
```

- [ ] **Step 3: Create landing page `app/(public)/page.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight, FileText, HeartHandshake, LineChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MEDICAL_DISCLAIMER, PRODUCT_PROMISE } from '@/lib/constants/copy'

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="text-xl font-bold text-primary">SINAD+</div>
        <Button asChild className="rounded-2xl"><Link href="/login">Masuk Demo</Link></Button>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="animate-soft-in">
          <p className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">Pendamping awal untuk orang tua</p>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">Mulai memahami pola anak dengan lebih tenang dan terarah.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{PRODUCT_PROMISE}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-2xl"><Link href="/login">Coba Demo <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button variant="outline" size="lg" className="rounded-2xl">Lihat Alur Produk</Button>
          </div>
          <p className="mt-6 max-w-xl text-sm text-muted-foreground">{MEDICAL_DISCLAIMER}</p>
        </div>

        <Card className="sinad-card animate-soft-in">
          <CardContent className="space-y-5 p-8">
            {[
              ['Skrining awal', 'Isi SNAP-IV dengan panduan langkah demi langkah.', LineChart],
              ['Aktivitas terstruktur', 'Pilih aktivitas rumah yang relevan untuk diamati.', HeartHandshake],
              ['Laporan konsultasi', 'Unduh ringkasan PDF untuk dibawa ke profesional.', FileText],
            ].map(([title, desc, Icon]) => (
              <div key={String(title)} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                <Icon className="h-6 w-6 text-primary" />
                <div><h3 className="font-semibold">{title}</h3><p className="text-sm text-muted-foreground">{desc}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Verify manually**

Run:

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: landing page displays, `/login` displays demo login. Demo login requires Supabase env and demo auth user.

- [ ] **Step 5: Commit**

```bash
git add app/'(public)' app/'(demo)' components/layout/public-nav.tsx
 git commit -m "feat: add landing page and demo login

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: App shell and dashboard

**Files:**
- Create: `app/(app)/layout.tsx`
- Create: `components/layout/app-shell.tsx`
- Create: `app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Create `components/layout/app-shell.tsx`**

```tsx
import Link from 'next/link'
import { Activity, BookOpen, ClipboardList, FileText, Home, UserRound } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/anak', label: 'Profil Anak', icon: UserRound },
  { href: '/skrining', label: 'Skrining', icon: ClipboardList },
  { href: '/aktivitas', label: 'Aktivitas', icon: Activity },
  { href: '/catatan', label: 'Catatan', icon: BookOpen },
  { href: '/laporan', label: 'Laporan', icon: FileText },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-white/70 p-6 backdrop-blur lg:block">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">SINAD+</Link>
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-primary/10 hover:text-primary">
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(app)/layout.tsx`**

```tsx
import { AppShell } from '@/components/layout/app-shell'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
```

- [ ] **Step 3: Create dashboard page `app/(app)/dashboard/page.tsx`**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getBehaviorLogs, getDemoChild, getLatestScreening } from '@/lib/supabase/queries'

export default async function DashboardPage() {
  const child = await getDemoChild()
  const latest = await getLatestScreening(child.id)
  const logs = await getBehaviorLogs(child.id)

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-soft-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard Orang Tua</p>
          <h1 className="text-4xl font-semibold tracking-tight">Selamat datang kembali</h1>
          <p className="mt-2 text-muted-foreground">Ringkasan pendampingan untuk {child.name}.</p>
        </div>
        <Button asChild className="rounded-2xl"><Link href="/laporan">Buat Laporan Konsultasi</Link></Button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="sinad-card"><CardHeader><CardTitle>Skor Terakhir</CardTitle></CardHeader><CardContent><p className="text-4xl font-semibold text-primary">{latest?.total_score ?? '-'}</p><p className="text-sm text-muted-foreground">Kategori: {latest?.category ?? 'Belum ada'}</p></CardContent></Card>
        <Card className="sinad-card"><CardHeader><CardTitle>Domain Dominan</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{latest?.dominant_domain === 'inattention' ? 'Fokus/Atensi' : 'Hiperaktif/Impulsif'}</p><p className="text-sm text-muted-foreground">Dipakai untuk menyarankan aktivitas observasi.</p></CardContent></Card>
        <Card className="sinad-card"><CardHeader><CardTitle>Konsistensi Catatan</CardTitle></CardHeader><CardContent><p className="text-4xl font-semibold text-primary">{logs.length}</p><p className="text-sm text-muted-foreground">catatan dalam data demo</p></CardContent></Card>
      </div>

      <Card className="sinad-card">
        <CardHeader><CardTitle>Kesiapan Konsultasi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Progress value={75} />
          <p className="text-sm text-muted-foreground">Skrining, aktivitas, dan catatan sudah tersedia. Laporan PDF dapat dibuat sebagai ringkasan awal.</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Verify**

Run app and visit `/dashboard` after demo login. Expected: dashboard shows seeded data.

- [ ] **Step 5: Commit**

```bash
git add app/'(app)'/layout.tsx components/layout/app-shell.tsx app/'(app)'/dashboard/page.tsx
 git commit -m "feat: add app shell and dashboard

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Screening form, save action, and result page

**Files:**
- Create: `app/(app)/skrining/page.tsx`
- Create: `app/(app)/skrining/actions.ts`
- Create: `app/(app)/hasil/[screeningId]/page.tsx`

- [ ] **Step 1: Create save action `app/(app)/skrining/actions.ts`**

```ts
'use server'

import { redirect } from 'next/navigation'
import { scoreSnapIv, SNAP_IV_QUESTIONS } from '@/lib/scoring/snap-iv'
import { createClient } from '@/lib/supabase/server'
import { DEMO_CHILD_ID } from '@/lib/supabase/queries'

export async function saveScreening(formData: FormData) {
  const answers = Object.fromEntries(
    SNAP_IV_QUESTIONS.map((question) => [question.id, Number(formData.get(question.id))]),
  )
  const score = scoreSnapIv(answers)
  const supabase = await createClient()
  const { data, error } = await supabase.from('screenings').insert({
    child_id: DEMO_CHILD_ID,
    inattention_score: score.inattentionScore,
    hyperactivity_impulsivity_score: score.hyperactivityImpulsivityScore,
    total_score: score.totalScore,
    category: score.category,
    dominant_domain: score.dominantDomain,
    answers_json: answers,
  }).select('id').single()
  if (error) throw new Error(error.message)
  redirect(`/hasil/${data.id}`)
}
```

- [ ] **Step 2: Create screening page `app/(app)/skrining/page.tsx`**

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SNAP_IV_QUESTIONS, SNAP_IV_SCALE } from '@/lib/scoring/snap-iv'
import { saveScreening } from './actions'

export default function ScreeningPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-soft-in">
      <div><p className="text-sm font-medium text-primary">Skrining Awal</p><h1 className="text-4xl font-semibold">SNAP-IV Terpandu</h1><p className="mt-2 text-muted-foreground">Pilih jawaban berdasarkan pengamatan orang tua. Ini bukan diagnosis medis.</p></div>
      <form action={saveScreening} className="space-y-4">
        {SNAP_IV_QUESTIONS.map((question, index) => (
          <Card key={question.id} className="sinad-card">
            <CardHeader><CardTitle className="text-base">{index + 1}. {question.text}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              {SNAP_IV_SCALE.map((option) => (
                <Label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm hover:border-primary">
                  <input required type="radio" name={question.id} value={option.value} /> {option.label}
                </Label>
              ))}
            </CardContent>
          </Card>
        ))}
        <Button size="lg" className="rounded-2xl">Simpan dan Lihat Hasil</Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Create result page `app/(app)/hasil/[screeningId]/page.tsx`**

```tsx
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MEDICAL_DISCLAIMER } from '@/lib/constants/copy'
import { getActivities, getScreeningById } from '@/lib/supabase/queries'

export default async function ResultPage({ params }: { params: Promise<{ screeningId: string }> }) {
  const { screeningId } = await params
  const screening = await getScreeningById(screeningId)
  const activities = await getActivities(screening.dominant_domain)

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-soft-in">
      <div><p className="text-sm font-medium text-primary">Ringkasan Hasil</p><h1 className="text-4xl font-semibold">Hasil Skrining Awal</h1></div>
      <Alert><AlertTitle>Batasan Penting</AlertTitle><AlertDescription>{MEDICAL_DISCLAIMER}</AlertDescription></Alert>
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="sinad-card"><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent><p className="text-4xl font-semibold text-primary">{screening.total_score}</p></CardContent></Card>
        <Card className="sinad-card"><CardHeader><CardTitle>Atensi</CardTitle></CardHeader><CardContent><p className="text-4xl font-semibold">{screening.inattention_score}</p></CardContent></Card>
        <Card className="sinad-card"><CardHeader><CardTitle>Hiperaktif/Impulsif</CardTitle></CardHeader><CardContent><p className="text-4xl font-semibold">{screening.hyperactivity_impulsivity_score}</p></CardContent></Card>
      </div>
      <Card className="sinad-card"><CardHeader><CardTitle>Aktivitas yang Relevan untuk Diamati</CardTitle></CardHeader><CardContent className="space-y-3">{activities.slice(0, 3).map((activity) => <Link className="block rounded-2xl border bg-white p-4 hover:border-primary" key={activity.id} href={`/aktivitas/${activity.id}`}>{activity.title}</Link>)}</CardContent></Card>
      <Button asChild className="rounded-2xl"><Link href="/laporan">Buat Laporan Konsultasi</Link></Button>
    </div>
  )
}
```

- [ ] **Step 4: Verify**

Fill all questions and submit. Expected: redirects to result page with scores and disclaimer.

- [ ] **Step 5: Commit**

```bash
git add app/'(app)'/skrining app/'(app)'/hasil
 git commit -m "feat: add SNAP-IV screening flow

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Activities, logs, education, and child profile pages

**Files:**
- Create: `app/(app)/aktivitas/page.tsx`
- Create: `app/(app)/aktivitas/[activityId]/page.tsx`
- Create: `app/(app)/catatan/page.tsx`
- Create: `app/(app)/catatan/actions.ts`
- Create: `app/(app)/anak/page.tsx`
- Create: `app/(app)/edukasi/page.tsx`

- [ ] **Step 1: Create pages with safe copy**

Use query helpers from Task 5. Every activity detail must include safety notes and stop conditions. Every education page must display reviewer status.

- [ ] **Step 2: Create behavior log action**

`app/(app)/catatan/actions.ts`:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DEMO_CHILD_ID } from '@/lib/supabase/queries'

export async function saveBehaviorLog(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('behavior_logs').insert({
    child_id: DEMO_CHILD_ID,
    activity_id: String(formData.get('activity_id') || '') || null,
    log_date: String(formData.get('log_date')),
    mood: String(formData.get('mood')),
    focus_rating: Number(formData.get('focus_rating')),
    impulsivity_rating: Number(formData.get('impulsivity_rating')),
    cooperation_rating: Number(formData.get('cooperation_rating')),
    notes: String(formData.get('notes')),
    incident_text: String(formData.get('incident_text') || '') || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/catatan')
}
```

- [ ] **Step 3: Verify**

Visit `/aktivitas`, `/catatan`, `/anak`, `/edukasi`. Add a behavior log and confirm it appears.

- [ ] **Step 4: Commit**

```bash
git add app/'(app)'/aktivitas app/'(app)'/catatan app/'(app)'/anak app/'(app)'/edukasi
 git commit -m "feat: add activities logs profile and education pages

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: Report data builder and PDF generation

**Files:**
- Create: `lib/report/build-report-data.ts`
- Create: `lib/report/build-report-data.test.ts`
- Create: `lib/report/report-pdf.tsx`
- Create: `app/(app)/laporan/page.tsx`
- Create: `app/api/reports/generate/route.ts`

- [ ] **Step 1: Write failing report builder test**

`lib/report/build-report-data.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildReportData } from './build-report-data'

describe('buildReportData', () => {
  it('includes disclaimer and latest screening', () => {
    const data = buildReportData({
      child: { name: 'Alya', birth_date: '2018-08-12', gender: 'perempuan' },
      screenings: [{ total_score: 32, dominant_domain: 'inattention', completed_at: '2026-05-31T00:00:00Z' }],
      logs: [],
      activities: [],
    })
    expect(data.childName).toBe('Alya')
    expect(data.latestScreening?.total_score).toBe(32)
    expect(data.disclaimer).toContain('bukan alat diagnosis')
  })
})
```

- [ ] **Step 2: Implement `lib/report/build-report-data.ts`**

```ts
import { MEDICAL_DISCLAIMER } from '@/lib/constants/copy'

type Input = {
  child: { name: string; birth_date: string; gender: string }
  screenings: Array<{ total_score: number; dominant_domain: string; completed_at: string }>
  logs: Array<{ log_date: string; mood: string; notes: string }>
  activities: Array<{ title: string; domain: string }>
}

export function buildReportData(input: Input) {
  const latestScreening = [...input.screenings].sort((a, b) => b.completed_at.localeCompare(a.completed_at))[0] ?? null
  return {
    title: `Laporan Konsultasi SINAD+ - ${input.child.name}`,
    generatedAt: new Date().toISOString(),
    childName: input.child.name,
    birthDate: input.child.birth_date,
    gender: input.child.gender,
    latestScreening,
    logs: input.logs,
    activities: input.activities,
    disclaimer: MEDICAL_DISCLAIMER,
  }
}
```

- [ ] **Step 3: Run tests**

```bash
npm run test -- lib/report/build-report-data.test.ts
```

Expected: pass.

- [ ] **Step 4: Implement PDF document and route**

Use `@react-pdf/renderer` to render a simple branded PDF. The route should return `application/pdf` and a content-disposition attachment filename.

- [ ] **Step 5: Create report preview page**

`/laporan` displays preview sections and a button/link to `/api/reports/generate`.

- [ ] **Step 6: Verify**

Open `/laporan`, click download. Expected: browser downloads a PDF.

- [ ] **Step 7: Commit**

```bash
git add lib/report app/'(app)'/laporan app/api/reports
 git commit -m "feat: add consultation report PDF generation

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 11: Playwright verification and UI review

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/demo-flow.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
```

- [ ] **Step 2: Create `tests/e2e/demo-flow.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

test('core demo journey is reachable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('SINAD+').first()).toBeVisible()
  await page.getByRole('link', { name: /coba demo|masuk demo/i }).first().click()
  await expect(page.getByRole('button', { name: /masuk demo/i })).toBeVisible()
})
```

- [ ] **Step 3: Run Playwright**

```bash
npx playwright install chromium
npm run e2e
```

Expected: tests pass. If Supabase credentials are not present, keep this test limited to public/login pages and document that authenticated journey requires env.

- [ ] **Step 4: Manual Playwright MCP review**

Use browser automation to inspect:

- landing desktop,
- landing mobile,
- dashboard,
- screening,
- result,
- report preview.

Capture screenshots for visual review if needed.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/demo-flow.spec.ts
 git commit -m "test: add Playwright demo flow checks

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 12: README, deployment notes, final verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write README setup**

Include:

```md
# SINAD+

Polished working MVP for a parent companion app that supports early ADHD-related observation. SINAD+ is not a diagnostic tool.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill Supabase URL and anon key.
3. Run Supabase migration and seed SQL.
4. Create demo auth user matching `DEMO_EMAIL` and `DEMO_PASSWORD`.
5. Run `npm install`.
6. Run `npm run dev`.

## Verification

- `npm run lint`
- `npm run test`
- `npm run e2e`

## Deployment

Deploy to Vercel and set the same environment variables. Use Supabase hosted database for live demo.

## Safety

SINAD+ bukan alat diagnosis medis. Hasil skrining bersifat indikasi awal dan perlu dikonsultasikan dengan profesional.
```

- [ ] **Step 2: Run final verification**

```bash
npm run lint
npm run test
npm run build
npm run e2e
```

Expected: all pass. If e2e authenticated path needs env, record exact missing env and keep public checks passing.

- [ ] **Step 3: Push all commits**

```bash
git status --short
git push origin main
```

- [ ] **Step 4: Commit README if changed**

```bash
git add README.md
 git commit -m "docs: add setup and deployment notes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push origin main
```

---

## Self-Review Notes

Spec coverage:

- Landing page: Task 6.
- Seeded demo account: Tasks 4 and 6.
- Dashboard: Task 7.
- Full SNAP-IV guided screening: Tasks 3 and 8.
- Result page and disclaimers: Task 8.
- Structured activity library: Tasks 4 and 9.
- Daily behavior log: Tasks 4 and 9.
- Generated PDF consultation report: Task 10.
- Seeded education content: Tasks 4 and 9.
- Light premium animation/design system: Task 2.
- Responsive UI and Playwright review: Task 11.
- Deployment notes: Task 12.

Implementation decisions resolved for plan:

- PDF library: start with `@react-pdf/renderer`.
- Seed mechanism: SQL migration + `supabase/seed.sql`.
- Report snapshot: metadata/source snapshot table; PDF file storage can be added after basic generated download works.
- Demo login: one-click server action using seeded credentials.
- SNAP-IV thresholds: conservative internal categories with explicit disclaimer.
- Animation: CSS-first light motion; no heavy animation library in MVP.
