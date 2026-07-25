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
  difficulty       text not null default 'Easy' check (difficulty in ('Easy','Medium','Hard')),
  group_size       int  not null default 10,
  inclusions       jsonb not null default '[]'::jsonb,
  itinerary        jsonb not null default '[]'::jsonb,
  status           text not null default 'draft' check (status in ('draft','published')),
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists packages_status_idx on public.packages (status);

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
