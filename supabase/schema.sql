-- ============================================================================
-- Spilrix Distribution — Supabase schema
-- Run this whole file once in Supabase → SQL Editor.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- artists
-- ----------------------------------------------------------------------------
create table if not exists public.artists (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  photo_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists artists_name_idx on public.artists (name);

-- ----------------------------------------------------------------------------
-- releases
-- ----------------------------------------------------------------------------
create table if not exists public.releases (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid not null references public.artists (id) on delete cascade,
  artist_name   text not null,
  song_title    text not null,
  genre         text,
  release_date  date,
  audio_url     text not null,
  status        text not null default 'Pending Review'
                  check (status in ('Pending Review', 'Approved', 'Rejected')),
  created_at    timestamptz not null default now()
);

create index if not exists releases_artist_id_idx on public.releases (artist_id);
create index if not exists releases_status_idx on public.releases (status);

-- ----------------------------------------------------------------------------
-- tickets
-- ----------------------------------------------------------------------------
create table if not exists public.tickets (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid not null references public.artists (id) on delete cascade,
  artist_name   text not null,
  subject       text not null,
  message       text not null,
  status        text not null default 'Open'
                  check (status in ('Open', 'Closed')),
  created_at    timestamptz not null default now()
);

create index if not exists tickets_artist_id_idx on public.tickets (artist_id);

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- The Next.js app never talks to these tables with the anon key — every read
-- and write goes through a Route Handler under /app/api/**, which uses the
-- SERVICE ROLE key (and, for /api/admin/**, a server-side passcode check).
-- The service role bypasses RLS entirely, so the correct policy for the anon
-- and authenticated roles here is simply: no access at all.
-- ----------------------------------------------------------------------------
alter table public.artists  enable row level security;
alter table public.releases enable row level security;
alter table public.tickets  enable row level security;

-- (No policies are created for anon/authenticated — RLS with zero policies
-- means every request from those roles is denied by default. Only the
-- service role, used server-side, can read or write these tables.)

-- ============================================================================
-- Storage buckets
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true), ('songs', 'songs', true)
on conflict (id) do nothing;

-- Public read so profile photos and audio previews can be played directly
-- from their public URL (artist dashboard avatars, admin audio previews).
--
-- Note: Postgres's CREATE POLICY does not support IF NOT EXISTS, so each
-- policy is dropped first (a no-op if it doesn't exist yet) to keep this
-- script safely re-runnable.
drop policy if exists "Public read access - profiles" on storage.objects;
create policy "Public read access - profiles"
  on storage.objects for select
  using (bucket_id = 'profiles');

drop policy if exists "Public read access - songs" on storage.objects;
create policy "Public read access - songs"
  on storage.objects for select
  using (bucket_id = 'songs');

-- Anyone can upload into these two buckets (this is the "no password"
-- trade-off described in the README), but nobody can overwrite or delete
-- existing files — there are intentionally no update/delete policies below.
drop policy if exists "Public upload - profiles" on storage.objects;
create policy "Public upload - profiles"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'profiles');

drop policy if exists "Public upload - songs" on storage.objects;
create policy "Public upload - songs"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'songs');

-- ============================================================================
-- Storage usage (for the admin control room's storage meter)
--
-- The `storage` schema isn't exposed through the normal REST API, so the
-- app can't just query storage.objects directly. This function lives in
-- `public` (which is exposed) and reads storage.objects internally — SQL
-- functions can always see other schemas regardless of REST API exposure.
-- ============================================================================
create or replace function public.get_storage_usage()
returns table (bucket_id text, total_bytes bigint, file_count bigint)
language sql
security definer
set search_path = public
as $$
  select
    bucket_id,
    coalesce(sum((metadata->>'size')::bigint), 0) as total_bytes,
    count(*) as file_count
  from storage.objects
  where bucket_id in ('profiles', 'songs')
  group by bucket_id;
$$;

grant execute on function public.get_storage_usage() to service_role;
