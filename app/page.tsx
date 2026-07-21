'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

/**
 * Root gateway: logged-in (verified) users go to the dashboard,
 * everyone else goes to the login page.
 */
export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    getSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data }) => {
        if (data.session?.user?.email_confirmed_at) {
          router.replace('/dashboard')
        } else {
          router.replace('/login')
        }
      })
      .catch(() => router.replace('/login'))
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-canary">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink">
        Loading…
      </p>
    </main>
  )
}
