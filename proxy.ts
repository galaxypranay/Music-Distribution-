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
  matcher: ['/dashboard/:path*'],
}
