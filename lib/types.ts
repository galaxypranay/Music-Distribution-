export interface Artist {
  id: string
  name: string
  photo_url: string | null
  created_at: string
}

export type ReleaseStatus = 'Pending Review' | 'Approved' | 'Rejected'

export interface Release {
  id: string
  artist_id: string
  artist_name: string
  song_title: string
  genre: string | null
  release_date: string | null
  audio_url: string
  status: ReleaseStatus
  created_at: string
}

export interface Ticket {
  id: string
  artist_id: string
  artist_name: string
  subject: string
  message: string
  status: string
  created_at: string
}

export interface StorageUsage {
  usedBytes: number
  limitBytes: number
  fileCount: number
  byBucket: Array<{ bucketId: string; totalBytes: number; fileCount: number }>
}
