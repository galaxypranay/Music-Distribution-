import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { getAppSettings } from '@/lib/app-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()
    const settings = await getAppSettings(supabase)

    // Only expose fields the artist-side actually needs.
    return NextResponse.json({
      maintenance_mode: settings.maintenance_mode,
      max_upload_mb: settings.max_upload_mb,
      allowed_image_formats: settings.allowed_image_formats,
      allowed_audio_formats: settings.allowed_audio_formats,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
