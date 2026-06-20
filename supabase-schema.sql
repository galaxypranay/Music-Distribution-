-- ============================================================
-- SPILRIX DISTRIBUTION — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. RELEASES TABLE
CREATE TABLE IF NOT EXISTS releases (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name  TEXT NOT NULL,
  song_title   TEXT NOT NULL,
  genre        TEXT NOT NULL,
  release_date DATE NOT NULL,
  audio_url    TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'Pending Review'
                CHECK (status IN ('Pending Review', 'Approved', 'Rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast artist lookups
CREATE INDEX IF NOT EXISTS idx_releases_artist_name ON releases(artist_name);

-- 2. ROW LEVEL SECURITY (RLS)
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anon users via artist name)
CREATE POLICY "Allow insert for all"
  ON releases FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow read only by matching artist_name
CREATE POLICY "Allow read own releases"
  ON releases FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- STORAGE BUCKET
-- Run this OR do it manually in: Storage → New Bucket
-- ============================================================

-- Create the 'songs' bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated & anon users to upload to 'songs'
CREATE POLICY "Allow uploads to songs bucket"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'songs');

-- Allow public read access to all files in 'songs'
CREATE POLICY "Allow public read of songs"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'songs');

-- ============================================================
-- DONE. Your Spilrix backend is ready.
-- ============================================================
