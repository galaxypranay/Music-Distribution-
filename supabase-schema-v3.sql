-- ============================================================
-- SPILRIX DISTRIBUTION — Schema V3 (Artist Profiles + Delete)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run (uses IF NOT EXISTS + ON CONFLICT)
-- ============================================================

-- ── 1. ARTIST PROFILES TABLE ───────────────────────────────
CREATE TABLE IF NOT EXISTS artist_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name       TEXT NOT NULL UNIQUE,
  profile_image_url TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artist_profiles_name ON artist_profiles(artist_name);

ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert profiles" ON artist_profiles;
DROP POLICY IF EXISTS "Allow read profiles" ON artist_profiles;
DROP POLICY IF EXISTS "Allow update profiles" ON artist_profiles;
DROP POLICY IF EXISTS "Allow delete profiles" ON artist_profiles;

CREATE POLICY "Allow insert profiles"
  ON artist_profiles FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow read profiles"
  ON artist_profiles FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow update profiles"
  ON artist_profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete profiles"
  ON artist_profiles FOR DELETE TO anon, authenticated USING (true);

-- ── 2. ALLOW DELETE ON RELEASES + SUPPORT TICKETS ──────────
-- (earlier schemas only had insert/select/update — admin delete needs this)

DROP POLICY IF EXISTS "Allow delete releases" ON releases;
CREATE POLICY "Allow delete releases"
  ON releases FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow delete tickets" ON support_tickets;
CREATE POLICY "Allow delete tickets"
  ON support_tickets FOR DELETE TO anon, authenticated USING (true);

-- ── 3. AVATARS STORAGE BUCKET ───────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow uploads to avatars bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read of avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete avatars" ON storage.objects;

CREATE POLICY "Allow uploads to avatars bucket"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public read of avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow delete avatars"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (bucket_id = 'avatars');

-- ── 4. ALLOW DELETE ON SONGS BUCKET (audio files) ──────────
DROP POLICY IF EXISTS "Allow delete songs" ON storage.objects;
CREATE POLICY "Allow delete songs"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (bucket_id = 'songs');

-- ============================================================
-- DONE. V3 schema applied.
-- ============================================================
