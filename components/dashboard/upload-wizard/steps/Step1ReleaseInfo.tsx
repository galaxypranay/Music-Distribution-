'use client'

import { useState } from 'react'
import { Input, Select, Textarea } from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { LANGUAGES, GENRES, RELEASE_TYPES, MIN_TRACKS_BY_TYPE } from '../types'
import type { ReleaseInfoData } from '../types'

interface Step1ReleaseInfoProps {
  data: ReleaseInfoData
  onChange: (patch: Partial<ReleaseInfoData>) => void
  errors: string[]
  minTracks: number
}

export default function Step1ReleaseInfo({ data, onChange, errors, minTracks }: Step1ReleaseInfoProps) {
  const [releaseDate, setReleaseDate] = useState(data.releaseDate)
  const [originalReleaseDate, setOriginalReleaseDate] = useState(data.originalReleaseDate || '')

  return (
    <div className="space-y-6 animate-fade-up">
      {errors.length > 0 && (
        <div className="rounded-lg border-[2.5px] border-ink bg-punch px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
          <p className="mb-2 font-display text-lg">Please fix the following:</p>
          <ul className="space-y-1 list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="space-y-4">
        <h3 className="font-display text-xl uppercase text-ink">Release Type & Title <span className="font-mono text-xs text-ink-faint">({minTracks}+ track{minTracks === 1 ? '' : 's'} required)</span></h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Release Type"
            required
            value={data.releaseType}
            onChange={(e) => onChange({ releaseType: e.target.value as ReleaseInfoData['releaseType'] })}
            error={!data.releaseType && 'Required'}
          >
            {RELEASE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type} {type !== 'Single' && `(${MIN_TRACKS_BY_TYPE[type]}+ tracks)`}
              </option>
            ))}
          </Select>

          <Input
            label="Release Title"
            required
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g., Midnight Echoes"
            error={!data.title && 'Required'}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Version (Optional)"
            value={data.version || ''}
            onChange={(e) => onChange({ version: e.target.value || undefined })}
            placeholder="Radio Edit, Deluxe, Acoustic, etc."
          />

          <Input
            label="Primary Artist"
            required
            value={data.primaryArtist}
            onChange={(e) => onChange({ primaryArtist: e.target.value })}
            placeholder="Artist name"
            error={!data.primaryArtist && 'Required'}
          />
        </div>
      </section>

      <section className="space-y-4 pt-6 border-t-[2.5px] border-ink">
        <h3 className="font-display text-xl uppercase text-ink">Artist Links (Optional)</h3>
        <Input
          label="Primary Artist Spotify Profile URL"
          type="url"
          value={data.primaryArtistSpotifyUrl || ''}
          onChange={(e) => onChange({ primaryArtistSpotifyUrl: e.target.value || undefined })}
          placeholder="https://open.spotify.com/artist/..."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Textarea
            label="Featuring Artists"
            value={data.featuringArtists || ''}
            onChange={(e) => onChange({ featuringArtists: e.target.value || undefined })}
            placeholder="Feature 1, Feature 2"
            rows={2}
          />

          <Textarea
            label="Featuring Artist Spotify URLs (one per line)"
            value={data.featuringArtistSpotifyUrls || ''}
            onChange={(e) => onChange({ featuringArtistSpotifyUrls: e.target.value || undefined })}
            placeholder="https://open.spotify.com/artist/...
https://open.spotify.com/artist/..."
            rows={2}
          />
        </div>
      </section>

      <section className="space-y-4 pt-6 border-t-[2.5px] border-ink">
        <h3 className="font-display text-xl uppercase text-ink">Release Dates</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Release Date"
            type="date"
            required
            value={releaseDate}
            onChange={(e) => {
              setReleaseDate(e.target.value)
              onChange({ releaseDate: e.target.value })
            }}
            min={new Date().toISOString().split('T')[0]}
            error={!releaseDate && 'Required'}
          />

          <Input
            label="Original Release Date (Optional)"
            type="date"
            value={originalReleaseDate}
            onChange={(e) => {
              setOriginalReleaseDate(e.target.value)
              onChange({ originalReleaseDate: e.target.value || undefined })
            }}
            placeholder="For re-releases"
          />
        </div>
      </section>

      <section className="space-y-4 pt-6 border-t-[2.5px] border-ink">
        <h3 className="font-display text-xl uppercase text-ink">Genres & Language</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Primary Genre"
            required
            value={data.primaryGenre}
            onChange={(e) => onChange({ primaryGenre: e.target.value })}
            error={!data.primaryGenre && 'Required'}
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>

          <Select
            label="Secondary Genre (Optional)"
            value={data.secondaryGenre || ''}
            onChange={(e) => onChange({ secondaryGenre: e.target.value || undefined })}
          >
            <option value="">— Select —</option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>
        </div>

        <Select
          label="Language"
          required
          value={data.language}
          onChange={(e) => onChange({ language: e.target.value })}
          error={!data.language && 'Required'}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.name}>
              {lang.name}
            </option>
          ))}
        </Select>
      </section>

      <section className="space-y-4 pt-6 border-t-[2.5px] border-ink">
        <h3 className="font-display text-xl uppercase text-ink">Label (Optional)</h3>
        <Input
          label="Record Label"
          value={data.recordLabel || ''}
          onChange={(e) => onChange({ recordLabel: e.target.value || undefined })}
          placeholder="Your label name"
        />
      </section>

      <div className="pt-4 flex justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onChange({ releaseDate: new Date().toISOString().split('T')[0] })}
        >
          Set Release Date to Today
        </Button>
      </div>
    </div>
  )
}
