-- ============================================================================
-- Vrajatian — Phase 1 catalog schema (packages + admin access)
-- Run this once in the Supabase SQL Editor (dashboard → SQL → New query).
-- ============================================================================

-- 1. Packages ----------------------------------------------------------------
create table if not exists public.packages (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  description      text,
  cover_image_path text,                    -- path inside the 'package-images' bucket
  price            numeric(12,2) not null,
  duration         text not null,           -- e.g. "5 Days, 4 Nights"
  rating           numeric(2,1) default 4.8,
  location         text not null,
  region           text not null,
  difficulty       text check (difficulty in ('Easy','Medium','Hard')),
  group_size       int  not null default 10,
  inclusions       jsonb not null default '[]'::jsonb,
  exclusions       jsonb not null default '[]'::jsonb,
  itinerary        jsonb not null default '[]'::jsonb,
  status           text not null default 'draft' check (status in ('draft','published')),
  is_featured      boolean not null default false,
  type             text not null default 'trip' check (type in ('trip','activity','education','corporate')),
  special_request_allowed boolean not null default true,
  tiers            jsonb not null default '[]'::jsonb,  -- [{ name: 'Basic'|'Value'|'Deluxe', price: number, description?: string }]
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Additive migration for databases where public.packages already existed
-- before the columns above were introduced (CREATE TABLE IF NOT EXISTS is a
-- no-op on an existing table, so these ALTERs are what actually apply on a
-- re-run against a live database).
alter table public.packages add column if not exists exclusions jsonb not null default '[]'::jsonb;
alter table public.packages add column if not exists type text not null default 'trip';
alter table public.packages add column if not exists special_request_allowed boolean not null default true;
alter table public.packages add column if not exists tiers jsonb not null default '[]'::jsonb;

alter table public.packages alter column difficulty drop not null;
alter table public.packages drop constraint if exists packages_difficulty_check;
alter table public.packages add constraint packages_difficulty_check
  check (difficulty is null or difficulty in ('Easy','Medium','Hard'));

alter table public.packages drop constraint if exists packages_type_check;
alter table public.packages add constraint packages_type_check
  check (type in ('trip','activity','education','corporate'));

create index if not exists packages_status_idx on public.packages (status);
create index if not exists packages_type_idx on public.packages (type);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists packages_set_updated_at on public.packages;
create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- 2. Admin allow-list --------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 3. Row Level Security ------------------------------------------------------
alter table public.packages enable row level security;
alter table public.admins   enable row level security;

-- Anyone (anon or logged-in) can read PUBLISHED packages.
drop policy if exists "public reads published packages" on public.packages;
create policy "public reads published packages" on public.packages
  for select using (status = 'published');

-- Admins can read every package (incl. drafts).
drop policy if exists "admins read all packages" on public.packages;
create policy "admins read all packages" on public.packages
  for select using (public.is_admin());

-- Admins can create / edit / delete packages.
drop policy if exists "admins insert packages" on public.packages;
create policy "admins insert packages" on public.packages
  for insert with check (public.is_admin());

drop policy if exists "admins update packages" on public.packages;
create policy "admins update packages" on public.packages
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete packages" on public.packages;
create policy "admins delete packages" on public.packages
  for delete using (public.is_admin());

-- Admins can see the admin list (no public access at all).
drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select using (public.is_admin());

-- 4. Storage policies for the 'package-images' bucket ------------------------
-- Public READ is automatic on a public bucket. These let admins upload/replace/delete.
drop policy if exists "admins upload package images" on storage.objects;
create policy "admins upload package images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'package-images' and public.is_admin());

drop policy if exists "admins update package images" on storage.objects;
create policy "admins update package images" on storage.objects
  for update to authenticated
  using (bucket_id = 'package-images' and public.is_admin());

drop policy if exists "admins delete package images" on storage.objects;
create policy "admins delete package images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'package-images' and public.is_admin());

-- 5. Booking requests ---------------------------------------------------------
-- Public visitors submit these via the NestJS API (service-role key), never a
-- direct browser insert — see backend/src/modules/booking-requests. RLS below
-- is defense-in-depth, not the primary gate.
create table if not exists public.booking_requests (
  id                uuid primary key default gen_random_uuid(),
  package_id        uuid references public.packages(id) on delete set null,
  package_title     text not null,           -- snapshot at submission time
  package_price     numeric(12,2) not null,  -- snapshot at submission time
  start_date        date not null,
  travelers         int not null check (travelers > 0),
  full_name         text not null,
  email             text not null,
  phone             text not null,
  special_requests  text not null default '',
  status            text not null default 'new' check (status in ('new','contacted')),
  -- Individual traveler names/ages, added by admin after confirming with the
  -- customer (not collected on the public booking form). [{ name, age? }]
  traveler_details  jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Additive migration for databases where public.booking_requests already
-- existed before this column was introduced.
alter table public.booking_requests add column if not exists traveler_details jsonb not null default '[]'::jsonb;

create index if not exists booking_requests_status_idx on public.booking_requests (status);
create index if not exists booking_requests_created_at_idx on public.booking_requests (created_at desc);

drop trigger if exists booking_requests_set_updated_at on public.booking_requests;
create trigger booking_requests_set_updated_at
  before update on public.booking_requests
  for each row execute function public.set_updated_at();

alter table public.booking_requests enable row level security;

-- Admins only — no public select/insert/delete policy at all.
drop policy if exists "admins read booking requests" on public.booking_requests;
create policy "admins read booking requests" on public.booking_requests
  for select using (public.is_admin());

drop policy if exists "admins update booking requests" on public.booking_requests;
create policy "admins update booking requests" on public.booking_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- Defense-in-depth: the backend deletes via the service-role key (bypasses
-- RLS), but every other table has explicit policies for every action it
-- supports, so this keeps booking_requests consistent now that admins can
-- delete trip requests from the admin panel.
drop policy if exists "admins delete booking requests" on public.booking_requests;
create policy "admins delete booking requests" on public.booking_requests
  for delete using (public.is_admin());

-- Change history / versioning was tried and dropped as overkill for this
-- table — if an earlier run of this script created booking_request_versions,
-- clean it up (no real data ever depended on it).
drop table if exists public.booking_request_versions cascade;

-- 6. Booking request rate limiting --------------------------------------------
-- Server-side throttle mirroring website/supabase/schema.sql's
-- contact_messages_rate_limit(): blocks a repeat insert for the same
-- email+package within 5 minutes (scoped to the package, not just the email,
-- so requesting quotes on two different packages back-to-back is never
-- blocked — that's normal, desirable behavior on a travel site), and caps
-- total inserts to 10 per minute. SECURITY DEFINER so it fires for every
-- role, including service_role (which bypasses RLS but not triggers) — real
-- defense-in-depth even though the API rate-limits too.
create or replace function public.booking_requests_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.booking_requests
    where email = new.email
      and package_id = new.package_id
      and created_at > now() - interval '5 minutes'
  ) then
    raise exception 'rate_limited: wait a few minutes before requesting this package again';
  end if;

  if (
    select count(*) from public.booking_requests
    where created_at > now() - interval '1 minute'
  ) >= 10 then
    raise exception 'rate_limited: too many booking requests right now, try again shortly';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_booking_requests_rate_limit on public.booking_requests;
create trigger trg_booking_requests_rate_limit
  before insert on public.booking_requests
  for each row execute function public.booking_requests_rate_limit();

-- ============================================================================
-- AFTER RUNNING THIS SQL:
--
--   1. Storage → confirm a PUBLIC bucket named exactly 'package-images' exists.
--
--   2. Authentication → Users → "Add user" → create your admin email + password
--      (tick "Auto Confirm User"). Copy the new user's UID.
--
--   3. Run, with your UID pasted in:
--          insert into public.admins (user_id) values ('PASTE-ADMIN-UID-HERE');
--
--   4. In the app, log in at /login with that email + password to manage packages.
-- ============================================================================
