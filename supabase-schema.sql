-- ============================================================
-- SPILRIX DISTRIBUTION — Full Supabase Schema (v2)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run (uses IF NOT EXISTS + ON CONFLICT)
-- ============================================================

-- ── 1. RELEASES TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS releases (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name      TEXT NOT NULL,
  song_title       TEXT NOT NULL,
  genre            TEXT NOT NULL,
  release_date     DATE NOT NULL,
  audio_url        TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'Pending Review'
                    CHECK (status IN ('Pending Review', 'Approved', 'Rejected')),
  rejection_reason TEXT DEFAULT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_releases_artist_name ON releases(artist_name);
CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);

ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Drop old policies before recreating (idempotent)
DROP POLICY IF EXISTS "Allow insert for all" ON releases;
DROP POLICY IF EXISTS "Allow read own releases" ON releases;
DROP POLICY IF EXISTS "Allow update for all" ON releases;

CREATE POLICY "Allow insert for all"
  ON releases FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow read own releases"
  ON releases FOR SELECT TO anon, authenticated USING (true);

-- Admin needs to update status/rejection_reason
CREATE POLICY "Allow update for all"
  ON releases FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 2. SUPPORT TICKETS TABLE ───────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Open'
               CHECK (status IN ('Open', 'Resolved')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_artist_name ON support_tickets(artist_name);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert tickets" ON support_tickets;
DROP POLICY IF EXISTS "Allow read tickets" ON support_tickets;
DROP POLICY IF EXISTS "Allow update tickets" ON support_tickets;

CREATE POLICY "Allow insert tickets"
  ON support_tickets FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow read tickets"
  ON support_tickets FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow update tickets"
  ON support_tickets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 3. STORAGE BUCKET ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow uploads to songs bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read of songs" ON storage.objects;

CREATE POLICY "Allow uploads to songs bucket"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'songs');

CREATE POLICY "Allow public read of songs"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'songs');

-- ============================================================
-- DONE. Schema v2 applied.
-- ============================================================
