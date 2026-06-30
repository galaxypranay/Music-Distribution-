export interface Artist {
  id: string
  display_id: number
  name: string
  photo_url: string | null
  instagram_url: string | null
  youtube_url: string | null
  spotify_url: string | null
  created_at: string
}

export type ReleaseType = 'Single' | 'EP' | 'Album'

export type ReleaseStatus =
  | 'Draft'
  | 'Pending Review'
  | 'Approved'
  | 'Sent to Platforms'
  | 'Live'
  | 'Rejected'

/** A release is the "project" — a Single, EP, or Album — made up of one or more tracks. */
export interface Release {
  id: string
  artist_id: string
  artist_name: string
  title: string
  release_type: ReleaseType
  cover_art_url: string | null
  release_date: string | null
  status: ReleaseStatus
  rejection_reason: string | null
  spotify_url: string | null
  apple_music_url: string | null
  youtube_url: string | null
  /** When set (and in the future), this release is scheduled for permanent deletion. */
  scheduled_deletion_at: string | null
  deletion_reason: string | null
  created_at: string
}

export interface Track {
  id: string
  release_id: string
  track_number: number
  song_title: string
  genre: string | null
  audio_url: string
  explicit: boolean
  songwriter: string | null
  created_at: string
}

/** A release with its tracks attached — the shape most of the UI works with. */
export interface ReleaseWithTracks extends Release {
  tracks: Track[]
}

export type TicketStatus = 'Open' | 'Closed'

export interface Ticket {
  id: string
  artist_id: string
  artist_name: string
  subject: string
  message: string
  status: TicketStatus
  created_at: string
}

export interface StorageUsage {
  usedBytes: number
  limitBytes: number
  fileCount: number
  byBucket: Array<{ bucketId: string; totalBytes: number; fileCount: number }>
}
