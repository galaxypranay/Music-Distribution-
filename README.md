# Spilrix Distribution

A premium, minimalist artist-submission portal. No email/password registration —
artists identify themselves with just a name and (optional) photo, then submit
Singles/EPs/Albums for review. Admins triage everything from a hidden control
room at `/spilrix-admin`, track releases through to "Live," and hand off files
for manual upload to streaming platforms.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase.

---

## ⚠️ Upgrading an existing Spilrix project?

If you already have this running in production with real data, **do not run
`supabase/schema.sql`** — it assumes a brand-new database. Run
**`supabase/migration-ep-album.sql`** instead, once, in your existing
project's SQL Editor. It safely upgrades your existing `releases` rows (each
becomes a "Single" with its one song carried over into the new `tracks`
table) without losing anything. See that file's comments for details.

---

## 1. How it's wired together

```
Browser (anon key)              Server (service role key)
─────────────────────           ──────────────────────────
Direct-to-Storage uploads  ──▶  Supabase Storage buckets
                                 ('profiles', 'songs', 'covers' — public
                                  read, open insert, no update/delete)

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
role** key, which never reaches the browser. `artists`, `releases`, `tracks`,
and `tickets` keep RLS *enabled with zero policies* — fully locked to anon
and authenticated roles, accessible only server-side. The Storage buckets are
the exception: file uploads happen directly from the browser to avoid
Vercel's request-body size limits, so they do need an anon-accessible insert
policy (see the security notes below).

## 2. The release model: Release + Tracks

A **release** is the "project" — a Single, EP, or Album. Its songs live in a
separate **tracks** table; a Single just happens to have exactly one. Status,
cover art, and release date all live on the release, not per-track — a whole
EP moves through review together, the way it would with a real distributor.

```
Release (Single / EP / Album)
  title, cover_art_url, release_date, status, rejection_reason,
  spotify_url, apple_music_url, youtube_url
  │
  └── Tracks (1 or more)
        song_title, genre, audio_url, explicit, songwriter, track_number
```

### Status lifecycle

```
Pending Review → Approved → Sent to Platforms → Live
       │
       └──────────────────────────────────────────▶ Rejected → (resubmit) → Pending Review
```

- **Pending Review** — just submitted, awaiting your review.
- **Approved** — you've reviewed it and it's good to go out.
- **Sent to Platforms** — you've handed the files off (e.g. to whoever
  manually uploads to Spotify/Apple Music/etc.).
- **Live** — it's actually live. Admin can attach Spotify/Apple Music/YouTube
  links here, which then show up on the artist's Status page as clickable
  "Listen on ___" buttons.
- **Rejected** — comes with a reason you write when rejecting. The artist
  sees that reason on their Status page along with a **Resubmit** button,
  which reopens the same form (pre-filled) to fix and resend — title, cover
  art, release date, and every track (including replacing audio files) can
  all be edited. Resubmitting resets status to Pending Review.

## 3. Folder structure

```
app/
├── page.tsx                       Login gateway (/)
├── layout.tsx                     Root layout, fonts, metadata
├── globals.css                    Design tokens (Tailwind v4 @theme)
├── dashboard/
│   ├── layout.tsx                 Session guard + TopNav + Sidebar shell
│   ├── page.tsx                   Redirects to /dashboard/upload
│   ├── upload/page.tsx            Tab A — submit a release (ReleaseForm)
│   ├── status/page.tsx            Tab B — track releases, resubmit, live links
│   └── support/page.tsx           Tab C — open a support ticket
├── spilrix-admin/
│   ├── layout.tsx                 noindex metadata
│   └── page.tsx                   Passcode gate + roster + artist drill-down
└── api/
    ├── artists/route.ts           POST create artist
    ├── releases/
    │   ├── route.ts                POST create release+tracks · GET own releases
    │   └── [id]/route.ts           PATCH resubmit a rejected release (artist-owned)
    ├── tickets/route.ts           POST create ticket
    └── admin/
        ├── auth/route.ts          POST verify passcode
        ├── artists/route.ts       GET all artists (passcode-protected)
        ├── storage/route.ts       GET Storage usage across all buckets
        ├── tickets/
        │   ├── route.ts            GET all tickets (passcode-protected)
        │   └── [id]/route.ts       PATCH ticket status (passcode-protected)
        └── releases/
            ├── route.ts            GET all releases+tracks (passcode-protected)
            └── [id]/route.ts       PATCH status lifecycle · DELETE (+ Storage cleanup)

components/
├── ui/                            Button, Card, Field (Input/Select/Textarea)
├── StatusBadge.tsx                The recurring "catalog stamp" status pill
├── Logo.tsx
├── EqualizerAnimation.tsx         Animated bars next to the dashboard wordmark
├── dashboard/
│   ├── SessionProvider, TopNav, Sidebar, MobileTabs
│   └── ReleaseForm.tsx            Shared create/resubmit form (release + tracks)
└── admin/
    ├── AdminGate, ArtistRoster, ArtistDetailPanel
    ├── ReleaseManager.tsx          Per-artist release cards: full status actions,
    │                               ZIP download, days-until-release indicator
    └── TicketsList.tsx

lib/
├── supabase/
│   ├── client.ts                  Browser client (anon key) — Storage only
│   ├── server.ts                  Server client (service role) — API routes only
│   └── storage-path.ts            Public URL → {bucket, path} parser (for deletes)
├── browser-storage.ts             Notifying localStorage/sessionStorage helpers
├── use-browser-storage-value.ts   useSyncExternalStore-based read hook
├── session.ts                     Artist session save/get/clear
├── admin-auth.ts                  Passcode header check for /api/admin/**
├── types.ts                       Artist / Release / Track / Ticket types
└── utils.ts                       cn, date formatting, slugify, getDaysUntil, formatBytes

supabase/
├── schema.sql                     Fresh-install schema (new projects only)
└── migration-ep-album.sql         Upgrade path for existing projects (run this instead)
```

## 4. Set up Supabase

**Brand-new project:**
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
3. Go to **Settings → API** and copy the values described below.

**Existing project (already has artists/releases):** run
`supabase/migration-ep-album.sql` instead — see the warning at the top of
this README.

Either way, you'll need from **Settings → API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
  never prefix it with `NEXT_PUBLIC_`, never commit it)

## 5. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSCODE=choose-a-long-random-passcode
STORAGE_LIMIT_GB=1
```

Add the same variables in **Vercel → Project → Settings → Environment
Variables** before deploying.

## 6. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The admin panel is at
`http://localhost:3000/spilrix-admin`.

## 7. Deploy to Vercel

```bash
npm i -g vercel   # if you don't have it
vercel
```

Or connect the repo in the Vercel dashboard. Set the environment variables
there, then deploy — `next build` runs clean with no required build-time
secrets (everything Supabase-related is read lazily at request time, never
at build time).

---

## Admin panel features

- **Click an artist card** to open a panel scoped to just that artist —
  their releases and support tickets, all in one place.
- **Full release lifecycle controls**: Approve, Reject (with a reason the
  artist will see), Mark Sent, Mark Live (attach Spotify/Apple Music/YouTube
  links), and Delete (removes the DB rows *and* every associated file —
  cover art + all track audio — from Supabase Storage).
- **Download ZIP** on any release — bundles the cover art and every track's
  audio file into one .zip, built right in your browser (no server-side
  size/time limits to worry about). This is the file you'd hand off for
  manual upload to Spotify/Apple Music/etc.
- **Days-until-release badge** on every release, and the list is sorted by
  urgency (soonest release date first) so the most time-sensitive work
  surfaces automatically. Overdue, not-yet-live releases are flagged in pink.
- **Support tickets** show up inside each artist's panel with a
  Resolve/Reopen toggle. Artist cards show a small blue "N open" badge.
- **Search the roster** by artist name.
- **Storage usage meter** at the top of the page, color-coded as it fills up.
  Defaults to the 1 GB free-tier allowance — set `STORAGE_LIMIT_GB` if you've
  upgraded plans.

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
- **Storage uploads are open to anyone** who can reach `/`. The `profiles`,
  `songs`, and `covers` buckets accept inserts from any visitor (no
  update/delete), which is what makes "no signup, just upload" possible —
  but it also means someone could script uploads directly against your
  Supabase Storage API, bypassing the UI.

**If this ever needs to be hardened**, the natural next step is swapping the
name-only gateway for real [Supabase Auth](https://supabase.com/docs/guides/auth)
(magic links work well if you still want to avoid traditional passwords),
then writing RLS policies against `auth.uid()` instead of routing everything
through the service role. The API route structure here would barely change —
you'd mostly be replacing the passcode/localStorage checks with real session
checks.

## Design notes

The UI is neobrutalist: thick black borders, hard offset shadows (no blur),
flat poster colors, and a tactile "press down" interaction on every button —
the shadow collapses and the element shifts down-right on click. It leans
into a punk-flyer/zine energy, which fits an indie music distributor better
than a slick SaaS look. `Archivo Black` carries the wordmark and headlines;
`Space Grotesk` handles UI text; `JetBrains Mono` is used for anything
catalog-like — status stamps, timestamps — echoing a cassette tape's printed
labeling. The signature motif is the **status badge**: a slightly rotated
rubber stamp whose color tracks the release lifecycle (canary → cobalt → ink
→ lime, with punch as the rejected branch).

The dashboard and admin panel also use a **custom reticle cursor** (a thick
black-and-white crosshair with a canary center dot, defined in `globals.css`
via the `.brutal-cursor` class) instead of the default arrow — text fields
keep the normal text caret so typing isn't affected. The dashboard header has
a small **animated equalizer** next to the wordmark (`EqualizerAnimation`
component), bouncing in the brand's four accent colors — a nod to "currently
playing" indicators in music apps. Both respect `prefers-reduced-motion`.
