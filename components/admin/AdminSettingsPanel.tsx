'use client'

import { useState, type FormEvent } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import type { AppSettings } from '@/lib/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'

interface AdminSettingsPanelProps {
  settings: AppSettings
  passcode: string
  onSaved: (updated: AppSettings) => void
}

export default function AdminSettingsPanel({
  settings,
  passcode,
  onSaved,
}: AdminSettingsPanelProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenance_mode)
  const [maxUploadMb, setMaxUploadMb] = useState(String(settings.max_upload_mb))
  const [imageFormats, setImageFormats] = useState(settings.allowed_image_formats.join(', '))
  const [audioFormats, setAudioFormats] = useState(settings.allowed_audio_formats.join(', '))

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)

    const maxMb = Number(maxUploadMb)
    if (!Number.isInteger(maxMb) || maxMb < 1 || maxMb > 500) {
      setError('Max upload size must be a whole number between 1 and 500 MB.')
      return
    }

    const parsedImageFormats = imageFormats
      .split(',')
      .map((f) => f.trim().toLowerCase().replace(/^\./, ''))
      .filter(Boolean)

    const parsedAudioFormats = audioFormats
      .split(',')
      .map((f) => f.trim().toLowerCase().replace(/^\./, ''))
      .filter(Boolean)

    if (parsedImageFormats.length === 0) {
      setError('At least one image format is required.')
      return
    }

    if (parsedAudioFormats.length === 0) {
      setError('At least one audio format is required.')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify({
          maintenance_mode: maintenanceMode,
          max_upload_mb: maxMb,
          allowed_image_formats: parsedImageFormats,
          allowed_audio_formats: parsedAudioFormats,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Could not save settings.')
      }

      onSaved(result.settings as AppSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div>
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
            Maintenance mode
          </p>
          <div className="flex items-center justify-between gap-4 rounded-lg border-[2.5px] border-ink bg-paper p-4">
            <div>
              <p className="font-bold text-ink">Lock the site for artists</p>
              <p className="mt-0.5 text-sm font-medium text-ink-soft">
                When ON, visiting artists see a &quot;Be right back&quot; page. The admin
                panel and API routes are always accessible.
              </p>
              {maintenanceMode ? (
                <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-punch">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Currently ON — artists cannot access the dashboard
                </p>
              ) : null}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={maintenanceMode}
              onClick={() => setMaintenanceMode((prev) => !prev)}
              className={`brutal-press relative h-7 w-12 shrink-0 rounded-full border-[2.5px] border-ink transition-colors ${
                maintenanceMode ? 'bg-punch' : 'bg-white'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full border-[2px] border-ink bg-white shadow-[1px_1px_0_0_var(--color-ink)] transition-transform ${
                  maintenanceMode ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
            Upload limits
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Max upload size (MB)"
              hint="1 – 500"
              type="number"
              min={1}
              max={500}
              required
              value={maxUploadMb}
              onChange={(e) => setMaxUploadMb(e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
            Allowed file formats
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="image-formats"
                className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint"
              >
                Cover art (comma-separated)
              </label>
              <input
                id="image-formats"
                value={imageFormats}
                onChange={(e) => setImageFormats(e.target.value)}
                placeholder="jpg, jpeg, png, webp"
                className="w-full rounded-lg border-[3px] border-ink bg-white px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="audio-formats"
                className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint"
              >
                Audio (comma-separated)
              </label>
              <input
                id="audio-formats"
                value={audioFormats}
                onChange={(e) => setAudioFormats(e.target.value)}
                placeholder="mp3, wav, flac, aac, ogg"
                className="w-full rounded-lg border-[3px] border-ink bg-white px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border-[2.5px] border-ink bg-punch px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
            {error}
          </p>
        ) : null}

        {saved ? (
          <p className="flex items-center gap-2 rounded-lg border-[2.5px] border-ink bg-lime px-4 py-3 text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--color-ink)]">
            <Check className="h-4 w-4" />
            Settings saved.
          </p>
        ) : null}

        <Button type="submit" isLoading={isSaving} disabled={isSaving}>
          Save settings
        </Button>
      </form>
    </Card>
  )
}
