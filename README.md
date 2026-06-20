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
3. Paste and run the contents of `supabase-schema.sql`
4. This creates the `releases` table + `songs` storage bucket

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
- `/` → Enter artist name → saved to `localStorage`
- `/dashboard/upload` → Upload track to Supabase Storage, insert metadata
- `/dashboard/analytics` → View all your releases with live status
- `/dashboard/support` → Submit support messages

---

## Supabase Storage
- Bucket name: `songs` (public)
- Accepted: `.mp3`, `.wav` up to 50MB
- Files named: `ArtistName_timestamp.ext`

---

## Status Flow
`Pending Review` → `Approved` or `Rejected`

Update manually from Supabase Dashboard → Table Editor → `releases` table.
