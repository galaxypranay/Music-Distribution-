'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, User as UserIcon } from 'lucide-react'
import Logo from '@/components/Logo'
import Button from '@/components/ui/Button'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { saveSession, parseSession, SESSION_STORAGE_KEY } from '@/lib/session'
import { useBrowserStorageValue } from '@/lib/use-browser-storage-value'
import { getFileExtension, slugify } from '@/lib/utils'

export default function LoginGatewayPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rawSession = useBrowserStorageValue('localStorage', SESSION_STORAGE_KEY)
  // undefined = not yet resolved (brief, pre-hydration) · null = definitely no session
  const existingArtist = rawSession === undefined ? undefined : parseSession(rawSession)

  const [name, setName] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // A navigation call, not a setState call — this is exactly what effects are for.
    if (existingArtist) router.replace('/dashboard')
  }, [existingArtist, router])

  function handlePhotoChange(file: File | null) {
    setPhotoFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Enter your artist name to continue.')
      return
    }

    setIsSubmitting(true)

    try {
      let photoUrl: string | null = null

      if (photoFile) {
        const supabase = getSupabaseBrowserClient()
        const extension = getFileExtension(photoFile.name) || 'jpg'
        const path = `${slugify(trimmedName)}-${Date.now()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(path, photoFile, { cacheControl: '3600', upsert: false })

        if (uploadError) throw new Error(uploadError.message)

        const { data: publicUrlData } = supabase.storage.from('profiles').getPublicUrl(path)
        photoUrl = publicUrlData.publicUrl
      }

      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, photo_url: photoUrl }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Could not create your profile.')
      }

      saveSession({
        id: result.artist.id,
        name: result.artist.name,
        photo_url: result.artist.photo_url,
      })

      router.push('/dashboard')
    } catch (err) {
      setIsSubmitting(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    }
  }

  if (existingArtist === undefined || existingArtist) {
    return <div className="min-h-screen bg-paper" />
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canary px-6 py-16">
      <div aria-hidden className="halftone-field absolute inset-0 opacity-[0.12]" />

      <div className="animate-fade-up relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
        </div>

        <div className="rounded-2xl border-[3px] border-ink bg-white p-8 shadow-[8px_8px_0_0_var(--color-ink)] md:p-10">
          <h1 className="font-display text-2xl uppercase text-ink">Welcome, artist</h1>
          <p className="mt-2 text-sm font-medium text-ink-soft">
            Tell us who you are. No password, no waiting room.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <label
                htmlFor="profile-photo"
                className="group relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-[3px] border-ink bg-paper shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-ink-faint" />
                )}
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-ink bg-cobalt text-white">
                  <Camera className="h-3.5 w-3.5" />
                </span>
              </label>
              <input
                ref={fileInputRef}
                id="profile-photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
              />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                Profile photo (optional)
              </p>
            </div>

            <div>
              <label
                htmlFor="artist-name"
                className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
              >
                Artist name <span className="text-punch">*</span>
              </label>
              <input
                id="artist-name"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Naomi Reyes"
                className="w-full rounded-lg border-[3px] border-ink bg-paper px-3.5 py-3 text-center font-display text-lg uppercase text-ink placeholder:font-body placeholder:text-base placeholder:normal-case placeholder:text-ink-faint focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none"
              />
            </div>

            {error ? (
              <p className="rounded-lg border-[2.5px] border-ink bg-punch px-4 py-3 text-center text-sm font-bold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
                {error}
              </p>
            ) : null}

            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Entering…' : 'Enter dashboard'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink">
          Spilrix Distribution — independent release management
        </p>
      </div>
    </main>
  )
}
