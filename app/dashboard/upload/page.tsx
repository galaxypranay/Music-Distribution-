'use client'

import { useRef, useState, type FormEvent } from 'react'
import { Music2, UploadCloud } from 'lucide-react'
import { useArtistSession } from '@/components/dashboard/SessionProvider'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getFileExtension, slugify } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Field'

const GENRES = [
  'Afrobeats',
  'Amapiano',
  'Hip-Hop / Rap',
  'R&B / Soul',
  'Pop',
  'Dance / Electronic',
  'Reggae / Dancehall',
  'Gospel',
  'Rock / Alternative',
  'Other',
]

type SubmitState = 'idle' | 'uploading' | 'success' | 'error'

export default function UploadPage() {
  const { artist } = useArtistSession()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [songTitle, setSongTitle] = useState('')
  const [genre, setGenre] = useState(GENRES[0])
  const [releaseDate, setReleaseDate] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  function resetForm() {
    setSongTitle('')
    setGenre(GENRES[0])
    setReleaseDate('')
    setAudioFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!audioFile) {
      setError('Select an audio file to upload.')
      return
    }

    setState('uploading')

    try {
      const supabase = getSupabaseBrowserClient()
      const extension = getFileExtension(audioFile.name) || 'mp3'
      const path = `${artist.id}/${Date.now()}-${slugify(songTitle)}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('songs')
        .upload(path, audioFile, { cacheControl: '3600', upsert: false })

      if (uploadError) throw new Error(uploadError.message)

      const { data: publicUrlData } = supabase.storage.from('songs').getPublicUrl(path)

      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_id: artist.id,
          artist_name: artist.name,
          song_title: songTitle,
          genre,
          release_date: releaseDate || null,
          audio_url: publicUrlData.publicUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Could not submit the release.')
      }

      setState('success')
      resetForm()
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    }
  }

  const isUploading = state === 'uploading'

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <header className="mb-8">
        <p className="inline-block -rotate-2 bg-cobalt px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          New submission
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase text-ink">Upload a release</h1>
        <p className="mt-2 text-sm font-medium text-ink-soft">
          Every submission enters Pending Review before it reaches the catalog.
        </p>
      </header>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Song title"
            required
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="e.g. Midnight in Lagos"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Select
              label="Genre"
              required
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>

            <Input
              label="Release date"
              type="date"
              required
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              Audio file <span className="text-punch">*</span>
            </p>
            <label
              htmlFor="audio-file"
              className="flex cursor-pointer items-center gap-4 rounded-lg border-[3px] border-dashed border-ink bg-paper px-4 py-6 transition-colors hover:bg-canary/30"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-[2.5px] border-ink bg-white">
                {audioFile ? (
                  <Music2 className="h-5 w-5 text-cobalt" />
                ) : (
                  <UploadCloud className="h-5 w-5 text-ink-soft" />
                )}
              </span>
              <span className="text-sm font-medium">
                {audioFile ? (
                  <span className="text-ink">{audioFile.name}</span>
                ) : (
                  <>
                    <span className="text-ink">Choose a file</span>{' '}
                    <span className="text-ink-faint">— MP3 or WAV, up to 50MB</span>
                  </>
                )}
              </span>
            </label>
            <input
              ref={fileInputRef}
              id="audio-file"
              type="file"
              accept="audio/*"
              required
              className="sr-only"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {error ? (
            <p className="rounded-lg border-[2.5px] border-ink bg-punch px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
              {error}
            </p>
          ) : null}

          {state === 'success' ? (
            <p className="rounded-lg border-[2.5px] border-ink bg-lime px-4 py-3 text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--color-ink)]">
              Submitted. Track its status under the Status tab.
            </p>
          ) : null}

          <Button type="submit" isLoading={isUploading} disabled={isUploading}>
            {isUploading ? 'Uploading…' : 'Submit for review'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
