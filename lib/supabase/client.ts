import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

/**
 * Browser-side Supabase client, built lazily on first use.
 *
 * Uses the public anon key only. It is used exclusively for direct-to-storage
 * uploads (profile photos, audio files). All database reads and writes go
 * through our own API routes (see /app/api/**), which use the service role
 * key on the server. The anon key therefore never needs table privileges —
 * Row Level Security on every table can stay fully locked down.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to your environment variables.'
    )
  }

  browserClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  })

  return browserClient
}
