-- ============================================================
-- SPILRIX DISTRIBUTION — Schema V2 (Admin Panel Update)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. ADD rejection_reason column to releases table
ALTER TABLE releases 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. ADD UPDATE policy to releases (for admin status changes)
CREATE POLICY "Allow update status"
  ON releases FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name  TEXT NOT NULL,
  subject      TEXT NOT NULL,
  message      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'Open'
                CHECK (status IN ('Open', 'Resolved')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_tickets_artist ON support_tickets(artist_name);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

-- RLS for support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert tickets"
  ON support_tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow read tickets"
  ON support_tickets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow update tickets"
  ON support_tickets FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- DONE. V2 schema applied.
-- ============================================================
