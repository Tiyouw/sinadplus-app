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
