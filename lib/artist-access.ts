import type { ArtistAccess, UploadAccessState } from '@/lib/types'

type AccessClient = {
  from: (table: string) => any
}

/** Date-only comparisons avoid time-zone changes locking an artist early. */
export function isAccessActive(access: ArtistAccess | null | undefined): boolean {
  if (!access?.upload_access || !access.expiry_date) return false
  const today = new Date().toISOString().slice(0, 10)
  return access.expiry_date >= today
}

export async function getArtistAccessState(
  supabase: AccessClient,
  artistId: string
): Promise<UploadAccessState> {
  const { data, error } = await supabase
    .from('artist_access')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  const access = (data ?? null) as ArtistAccess | null
  const expired = Boolean(access?.upload_access && access.expiry_date && !isAccessActive(access))
  return { active: isAccessActive(access), expired, access }
}
