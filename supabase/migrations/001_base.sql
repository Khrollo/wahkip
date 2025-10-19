-- =========================
-- Wahkip base schema (001)
-- =========================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- =========================
-- Tables
-- =========================

-- USERS (minimal placeholder; optional if you use Supabase Auth only)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now()
);

-- VENUES
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  lat double precision not null,
  lon double precision not null,
  address text,
  created_at timestamptz not null default now()
);

-- EVENTS
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues(id) on delete set null,
  title text not null,
  description text,
  date_start timestamptz not null,
  date_end timestamptz,
  tags text[] not null default '{}'::text[],
  city text not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- HELPERS
create table if not exists public.helpers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,  -- supabase auth uid (optional for demo; required if you add auth)
  name text not null,
  city text not null,
  langs text[] not null default '{en}'::text[],
  skills text[] not null default '{}'::text[],
  rate_min int,
  rate_max int,
  verified boolean not null default false,
  phone text,
  whatsapp text,
  rating numeric,
  created_at timestamptz not null default now()
);

-- HELPER AVAILABILITY (presence-like heartbeat)
create table if not exists public.helper_availability (
  id uuid primary key default gen_random_uuid(),
  helper_id uuid not null references public.helpers(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null check (status in ('online','busy','offline')),
  city text not null,
  lat double precision,
  lon double precision,
  created_at timestamptz not null default now()
);

-- ITINERARY REQUESTS & RESULTS
create table if not exists public.itinerary_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  city text not null,
  date date not null,
  interests text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.itinerary_requests(id) on delete cascade,
  json jsonb not null,
  picks uuid[] not null default '{}'::uuid[],
  created_at timestamptz not null default now()
);

-- REVIEWS (mock trust)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  helper_id uuid not null references public.helpers(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- METRICS (sampled timings)
create table if not exists public.metrics (
  id bigserial primary key,
  route text not null,
  t_ms int not null,
  ts timestamptz not null default now()
);

-- =========================
-- Indexes (safe if repeated)
-- =========================

-- events
create index if not exists idx_events_city_date on public.events (city, date_start);
create index if not exists idx_events_tags_gin on public.events using gin (tags);
create index if not exists idx_events_title_trgm on public.events using gin (title gin_trgm_ops);

-- helper availability
create index if not exists idx_avail_helper_time on public.helper_availability (helper_id, ends_at);
create index if not exists idx_avail_city_time on public.helper_availability (city, ends_at);

-- itineraries
create index if not exists idx_itins_req on public.itineraries (request_id);

-- reviews
create index if not exists idx_reviews_helper on public.reviews (helper_id);

-- metrics
create index if not exists idx_metrics_ts on public.metrics (ts);

-- =========================
-- Row Level Security (RLS)
-- =========================
alter table public.events enable row level security;
alter table public.venues enable row level security;
alter table public.helpers enable row level security;
alter table public.helper_availability enable row level security;
alter table public.itinerary_requests enable row level security;
alter table public.itineraries enable row level security;
alter table public.reviews enable row level security;
alter table public.metrics enable row level security;

-- =========================
-- Policies (drop-if-exists → create)
-- =========================

-- Public READ (browsing without auth)
drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events for select using (true);

drop policy if exists "public read venues" on public.venues;
create policy "public read venues" on public.venues for select using (true);

drop policy if exists "public read helpers" on public.helpers;
create policy "public read helpers" on public.helpers for select using (true);

drop policy if exists "public read reviews" on public.reviews;
create policy "public read reviews" on public.reviews for select using (true);

drop policy if exists "public read itineraries" on public.itineraries;
create policy "public read itineraries" on public.itineraries for select using (true);

drop policy if exists "public read itinerary_requests" on public.itinerary_requests;
create policy "public read itinerary_requests" on public.itinerary_requests for select using (true);

drop policy if exists "public read availability" on public.helper_availability;
create policy "public read availability" on public.helper_availability for select using (true);

-- Helpers manage their own rows (requires authenticated user)
drop policy if exists "helpers insert own" on public.helpers;
create policy "helpers insert own"
  on public.helpers for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "helpers update own" on public.helpers;
create policy "helpers update own"
  on public.helpers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Availability rows managed by owning helper
drop policy if exists "availability insert own" on public.helper_availability;
create policy "availability insert own"
  on public.helper_availability for insert
  to authenticated
  with check (
    exists (
      select 1 from public.helpers h
      where h.id = helper_availability.helper_id
        and h.user_id = auth.uid()
    )
  );

drop policy if exists "availability update own" on public.helper_availability;
create policy "availability update own"
  on public.helper_availability for update
  to authenticated
  using (
    exists (
      select 1 from public.helpers h
      where h.id = helper_availability.helper_id
        and h.user_id = auth.uid()
    )
  )
  with check (true);
