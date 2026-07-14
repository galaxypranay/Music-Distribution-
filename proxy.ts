import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Maintenance mode check.
 *
 * We can't call Supabase directly from Edge middleware (no Node.js runtime
 * there). Instead we call our own /api/settings endpoint — it's a simple
 * Supabase read, so it's fast. We only block /dashboard routes; the admin
 * panel, the login gateway, and API routes are always reachable so the admin
 * can turn maintenance mode back off.
 *
 * Fix: cache: 'no-store' prevents the fetch result from being cached at the
 * edge layer. Without it, maintenance_mode=true gets cached and persists even
 * after the admin turns it off — the page keeps showing maintenance until
 * the edge cache expires naturally (which can take minutes).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only enforce on artist-facing dashboard pages.
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  try {
    const settingsUrl = new URL('/api/settings', request.url)
    const res = await fetch(settingsUrl.toString(), {
      // CRITICAL: no-store prevents the cached ON state from persisting
      // after maintenance mode is turned off in the admin panel.
      cache: 'no-store',
      headers: {
        // Prevents /api/settings from accidentally being redirected to
        // /maintenance by the proxy itself (circular redirect guard).
        'x-proxy-internal': '1',
      },
      // Short timeout so a Supabase outage doesn't hang every page load.
      signal: AbortSignal.timeout(3000),
    })

    if (res.ok) {
      const settings = await res.json()
      if (settings.maintenance_mode) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }
  } catch {
    // If we can't reach the settings endpoint, fail open — it's better for
    // artists to see the site than to lock everyone out because of a timeout.
  }

  return NextResponse.next()
}

export const config = {
  // Also match the root login page — if maintenance is on, visiting /
  // should also show the maintenance page, not let artists "log in" to
  // a site that's locked.
  matcher: ['/', '/dashboard/:path*'],
}
