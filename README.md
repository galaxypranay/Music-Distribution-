# Spilrix Distribution

A premium, minimalist artist-submission portal. No email/password registration —
artists identify themselves with just a name and (optional) photo, then upload
releases for review. Admins triage submissions from a hidden control room at
`/spilrix-admin`.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase.

---

## 1. How it's wired together

```
Browser (anon key)              Server (service role key)
─────────────────────           ──────────────────────────
Direct-to-Storage uploads  ──▶  Supabase Storage buckets
                                 ('profiles', 'songs' — public read,
                                  open insert, no update/delete)

fetch('/api/...')           ──▶  Route Handlers (/app/api/**)
                                 → Supabase tables via service role
                                   (RLS denies anon entirely)

localStorage ('spilrix_session')      sessionStorage ('spilrix_admin_passcode')
  → "who is the logged-in artist"       → admin gate, checked server-side
```

**Why route DB access through API routes instead of letting the browser talk
to Supabase tables directly?** With no password-based auth, there's no
`auth.uid()` to write Row Level Security policies against. Rather than open
the tables up to the anon key (which any visitor could call from devtools),
every table read/write goes through a Route Handler using the **service
role** key, which never reaches the browser. `artists`, `releases`, and
`tickets` keep RLS *enabled with zero policies* — fully locked to anon and
authenticated roles, accessible only server-side. The two Storage buckets are
the exception: file uploads happen directly from the browser to avoid
Vercel's request-body size limits, so they do need an anon-accessible insert
policy (see the security notes below).

## 2. Folder structure

```
app/
├── page.tsx                       Login gateway (/)
├── layout.tsx                     Root layout, fonts, metadata
├── globals.css                    Design tokens (Tailwind v4 @theme)
├── dashboard/
│   ├── layout.tsx                 Session guard + TopNav + Sidebar shell
│   ├── page.tsx                   Redirects to /dashboard/upload
│   ├── upload/page.tsx            Tab A — submit a release
│   ├── status/page.tsx            Tab B — track your own submissions
│   └── support/page.tsx           Tab C — open a support ticket
├── spilrix-admin/
│   ├── layout.tsx                 noindex metadata
│   └── page.tsx                   Passcode gate + roster + master table
└── api/
    ├── artists/route.ts           POST create artist
    ├── releases/route.ts          POST create release · GET own releases
    ├── tickets/route.ts           POST create ticket
    └── admin/
        ├── auth/route.ts          POST verify passcode
        ├── artists/route.ts       GET all artists (passcode-protected)
        └── releases/
            ├── route.ts           GET all releases (passcode-protected)
            └── [id]/route.ts      PATCH approve/reject (passcode-protected)

components/
├── ui/                            Button, Card, Field (Input/Select/Textarea)
├── StatusBadge.tsx                The recurring "catalog stamp" status pill
├── Logo.tsx
├── dashboard/                     SessionProvider, TopNav, Sidebar, MobileTabs
└── admin/                         AdminGate, ArtistRoster, SubmissionsTable

lib/
├── supabase/client.ts             Browser client (anon key) — Storage only
├── supabase/server.ts             Server client (service role) — API routes only
├── browser-storage.ts             Notifying localStorage/sessionStorage helpers
├── use-browser-storage-value.ts   useSyncExternalStore-based read hook
├── session.ts                     Artist session save/get/clear
├── admin-auth.ts                  Passcode header check for /api/admin/**
├── types.ts                       Artist / Release / Ticket types
└── utils.ts                       cn, date formatting, slugify

supabase/schema.sql                 Run once in the Supabase SQL editor
```

## 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run
   it. This creates the three tables (with RLS locked down), and the
   `profiles` and `songs` Storage buckets with their policies.
3. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
     never prefix it with `NEXT_PUBLIC_`, never commit it)

## 4. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSCODE=choose-a-long-random-passcode
```

Add the same four variables in **Vercel → Project → Settings →
Environment Variables** before deploying.

## 5. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The admin panel is at
`http://localhost:3000/spilrix-admin`.

## 6. Deploy to Vercel

```bash
npm i -g vercel   # if you don't have it
vercel
```

Or connect the repo in the Vercel dashboard. Set the four environment
variables there, then deploy — `next build` runs clean with no required
build-time secrets (everything Supabase-related is read lazily at request
time, never at build time).

---

## Security notes — read this before going to production

This app intentionally has **no real authentication system**, per the brief.
That trade-off has real consequences worth knowing:

- **Artist identity is just a name.** Nothing stops two people from typing
  the same artist name, or from reading another artist's Status tab if they
  know (or guess) that artist's `id`. There's no password tying a browser to
  an identity — `localStorage` just remembers "who I said I was."
- **`/spilrix-admin` is hidden, not authenticated** in the traditional sense.
  The passcode check happens server-side (`ADMIN_PASSCODE` is never sent to
  the browser bundle), which is meaningfully better than a client-only check
  — but it's still a single shared secret with no audit trail, rate limiting,
  or per-admin accountability.
- **Storage uploads are open to anyone** who can reach `/`. The `profiles`
  and `songs` buckets accept inserts from any visitor (no update/delete),
  which is what makes "no signup, just upload" possible — but it also means
  someone could script uploads directly against your Supabase Storage API,
  bypassing the UI.

**If this ever needs to be hardened**, the natural next step is swapping the
name-only gateway for real [Supabase Auth](https://supabase.com/docs/guides/auth)
(magic links work well if you still want to avoid traditional passwords),
then writing RLS policies against `auth.uid()` instead of routing everything
through the service role. The API route structure here would barely change —
you'd mostly be replacing the passcode/localStorage checks with real session
checks.

## Design notes

The palette swaps the usual "neon-on-black" SaaS look for something closer to
a record label's leather-and-brass aesthetic: warm near-black (`--color-void`),
brushed brass for primary accents, deep emerald/rust for approve/reject states
instead of pure green/red. `Fraunces` (display serif) carries headings and the
wordmark; `Inter` handles UI text; `JetBrains Mono` is used for anything
catalog-like — status pills, timestamps, labels — echoing a record sleeve's
printed metadata. The one recurring signature motif is the **status badge**
("catalog stamp"): a small dot + mono uppercase label, identical wherever a
release's status appears, tying the artist dashboard and admin panel together
visually.
