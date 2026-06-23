# 🎵 Spilrix Distribution

A sleek music distribution portal — built with Next.js 14, Supabase, and Tailwind CSS.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## Quick Setup

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/spilrix-distribution
cd spilrix-distribution
npm install
```

### 2. Supabase Setup
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query**
3. Run `supabase-schema.sql`, then `supabase-schema-v2.sql`, then `supabase-schema-v3.sql` — in that order
4. This creates the `releases`, `support_tickets`, and `artist_profiles` tables, plus the `songs` and `avatars` storage buckets

### 3. Environment Variables
Create `.env.local` in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```
Find these in: Supabase → Settings → API

### 4. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel
1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add the two env variables above in Vercel → Settings → Environment Variables
4. Deploy ✅

---

## User Flow
- `/` → Enter artist name + optional profile photo → account created/updated in `artist_profiles`, saved to `localStorage`
- `/dashboard/upload` → Upload track to Supabase Storage, insert metadata
- `/dashboard/analytics` → View all your releases with live status
- `/dashboard/support` → Submit support messages (saved to `support_tickets`)

---

## Admin Panel (`/spilrix-admin`)
- `/spilrix-admin/artists` → Grid of all artists (photo, join date, song count)
- `/spilrix-admin/artists/[artistName]` → That artist's songs — approve, reject (with reason), export CSV, or delete a song (removes the audio file from Storage too)
  - **Delete Profile** button removes the artist entirely: all their songs (DB + Storage), their support tickets, their avatar (Storage), and their profile row
- `/spilrix-admin/tickets` → All support tickets, mark Open/Resolved

⚠️ This panel currently has **no login/password protection** — anyone with the URL can access it. Add auth before going to production with real users.

---

## Supabase Storage
- `songs` bucket (public) — `.mp3`, `.wav` up to 50MB, named `ArtistName_timestamp.ext`
- `avatars` bucket (public) — profile photos, up to 3MB

---

## Status Flow
`Pending Review` → `Approved` or `Rejected`

Managed from `/spilrix-admin/artists/[artistName]` (or manually via Supabase Dashboard → Table Editor → `releases` table).
