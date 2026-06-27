-- ============================================================================
-- Spilrix Distribution — Supabase schema
-- Run this whole file once in Supabase → SQL Editor for a FRESH project.
--
-- If you already have a Spilrix project running the old single-table
-- `releases` shape, do NOT run this file — run
-- supabase/migration-ep-album.sql instead, which upgrades your existing
-- data in place without losing anything.
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
--
-- A release is the "project" — a Single, EP, or Album. Its actual songs
-- live in the `tracks` table below (a Single just happens to have exactly
-- one track). Status lives at the release level: a whole EP/Album moves
-- through review and distribution together, not track-by-track.
-- ----------------------------------------------------------------------------
create table if not exists public.releases (
  id                 uuid primary key default gen_random_uuid(),
  artist_id          uuid not null references public.artists (id) on delete cascade,
  artist_name        text not null,
  title              text not null,
  release_type       text not null default 'Single'
                       check (release_type in ('Single', 'EP', 'Album')),
  cover_art_url      text,
  release_date       date,
  status             text not null default 'Pending Review'
                       check (status in (
                         'Pending Review', 'Approved', 'Sent to Platforms', 'Live', 'Rejected'
                       )),
  rejection_reason   text,
  spotify_url        text,
  apple_music_url    text,
  youtube_url        text,
  created_at         timestamptz not null default now()
);

create index if not exists releases_artist_id_idx on public.releases (artist_id);
create index if not exists releases_status_idx on public.releases (status);
create index if not exists releases_release_date_idx on public.releases (release_date);

-- ----------------------------------------------------------------------------
-- tracks
--
-- One row per song within a release. A Single has exactly one of these;
-- an EP/Album has several, ordered by track_number.
-- ----------------------------------------------------------------------------
create table if not exists public.tracks (
  id            uuid primary key default gen_random_uuid(),
  release_id    uuid not null references public.releases (id) on delete cascade,
  track_number  int not null default 1,
  song_title    text not null,
  genre         text,
  audio_url     text not null,
  explicit      boolean not null default false,
  songwriter    text,
  created_at    timestamptz not null default now()
);

create index if not exists tracks_release_id_idx on public.tracks (release_id);

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
alter table public.tracks   enable row level security;
alter table public.tickets  enable row level security;

-- (No policies are created for anon/authenticated — RLS with zero policies
-- means every request from those roles is denied by default. Only the
-- service role, used server-side, can read or write these tables.)

-- ============================================================================
-- Storage buckets
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true), ('songs', 'songs', true), ('covers', 'covers', true)
on conflict (id) do nothing;

-- Public read so profile photos, cover art, and audio previews can be played
-- directly from their public URL.
drop policy if exists "Public read access - profiles" on storage.objects;
create policy "Public read access - profiles"
  on storage.objects for select
  using (bucket_id = 'profiles');

drop policy if exists "Public read access - songs" on storage.objects;
create policy "Public read access - songs"
  on storage.objects for select
  using (bucket_id = 'songs');

drop policy if exists "Public read access - covers" on storage.objects;
create policy "Public read access - covers"
  on storage.objects for select
  using (bucket_id = 'covers');

-- Anyone can upload into these buckets (this is the "no password" trade-off
-- described in the README), but nobody can overwrite or delete existing
-- files — there are intentionally no update/delete policies below.
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

drop policy if exists "Public upload - covers" on storage.objects;
create policy "Public upload - covers"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'covers');

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
  where bucket_id in ('profiles', 'songs', 'covers')
  group by bucket_id;
$$;

grant execute on function public.get_storage_usage() to service_role;
