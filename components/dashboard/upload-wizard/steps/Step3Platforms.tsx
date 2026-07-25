'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { Plus, X, Lock, Check, Music2 } from 'lucide-react'
import { FaAmazon } from 'react-icons/fa'
import {
  SiApplemusic,
  SiDeezer,
  SiFacebook,
  SiInstagram,
  SiSpotify,
  SiTidal,
  SiTiktok,
  SiYoutubemusic,
} from 'react-icons/si'
import type { IconType } from 'react-icons'
import type { PlatformData } from '../types'
import { OPTIONAL_PLATFORMS } from '../types'

interface Step3PlatformsProps {
  platforms: PlatformData[]
  onPlatformsChange: (platforms: PlatformData[]) => void
}

const PLATFORM_ICONS: Record<string, IconType | IconType[]> = {
  spotify: SiSpotify,
  apple_music: SiApplemusic,
  youtube_music: SiYoutubemusic,
  amazon_music: FaAmazon,
  deezer: SiDeezer,
  tidal: SiTidal,
  tiktok: SiTiktok,
  instagram_facebook: [SiInstagram, SiFacebook],
}

function PlatformIcon({ platformId }: { platformId: string }) {
  const icon = PLATFORM_ICONS[platformId]
  const icons = Array.isArray(icon) ? icon : [icon ?? Music2]

  return (
    <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
      {icons.map((Icon, index) => <Icon key={index} className="h-6 w-6 text-ink" />)}
    </span>
  )
}

export default function Step3Platforms({ platforms, onPlatformsChange }: Step3PlatformsProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [customPlatformName, setCustomPlatformName] = useState('')

  const handleToggle = (id: string) => {
    onPlatformsChange(
      platforms.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p
      )
    )
  }

  const handleRemoveCustom = (id: string) => {
    onPlatformsChange(platforms.filter((p) => p.id !== id))
  }

  const handleAddCustom = () => {
    const trimmed = customPlatformName.trim()
    if (!trimmed) return

    const newPlatform: PlatformData = {
      id: `custom_${trimmed.toLowerCase().replace(/\s+/g, '_')}`,
      name: trimmed,
      isDefault: false,
      selected: true,
    }

    onPlatformsChange([...platforms, newPlatform])
    setCustomPlatformName('')
    setShowAddModal(false)
  }

  const defaultPlatforms = platforms.filter((p) => p.isDefault)
  const optionalPlatformIds = new Set(OPTIONAL_PLATFORMS.map((platform) => platform.id))
  const customPlatforms = platforms.filter(
    (platform) => !platform.isDefault && !optionalPlatformIds.has(platform.id)
  )

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xl uppercase text-ink">Distribution Platforms</p>
          <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-ink-soft">
            Select where your release will be delivered. Defaults are always included.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Platform
        </Button>
      </div>

      {/* Default Platforms - Always Selected */}
      <div className="space-y-3">
        <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-ink-soft flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cobalt/10 flex items-center justify-center">
            <Lock className="h-3 w-3 text-cobalt" />
          </span>
          Core Platforms (always included)
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {defaultPlatforms.map((platform) => (
            <label
              key={platform.id}
              className={cn(
                'group flex items-center gap-3 p-4 rounded-lg border-[2.5px] transition-all',
                'bg-white border-ink cursor-pointer',
                'hover:border-canary hover:bg-canary/10'
              )}
            >
              <input
                type="checkbox"
                checked={platform.selected}
                disabled
                className="h-5 w-5 accent-cobalt cursor-not-allowed"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <PlatformIcon platformId={platform.id} />
                  <span className="font-body font-medium text-ink truncate">{platform.name}</span>
                </div>
                <p className="font-mono text-[10px] text-ink-faint">Default — cannot be removed</p>
              </div>
              <Lock className="h-4 w-4 text-ink-faint group-hover:text-cobalt transition-colors" />
            </label>
          ))}
        </div>
      </div>

      {/* Optional Platforms */}
      <div className="space-y-3">
        <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-ink-soft">
          Additional Platforms
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONAL_PLATFORMS.map((opt) => {
            const existing = customPlatforms.find((p) => p.id === opt.id)
            return (
              <label
                key={opt.id}
                className={cn(
                  'group flex items-center gap-3 p-4 rounded-lg border-[2.5px] transition-all',
                  existing?.selected
                    ? 'bg-lime border-lime shadow-[0_0_0_1px_var(--color-lime-deep)]'
                    : 'bg-white border-ink/20 hover:border-canary hover:bg-canary/10'
                )}
              >
                <input
                  type="checkbox"
                  checked={!!existing?.selected}
                  onChange={() => handleToggle(opt.id)}
                  className="h-5 w-5 accent-lime"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platformId={opt.id} />
                    <span className="font-body font-medium text-ink truncate">{opt.name}</span>
                  </div>
                  <p className="font-mono text-[10px] text-ink-faint">Optional</p>
                </div>
                {existing?.selected && (
                  <Check className="h-5 w-5 text-lime-deep" />
                )}
              </label>
            )
          })}

          {/* Custom Platforms */}
          {customPlatforms.map((platform) => (
            <div
              key={platform.id}
              className={cn(
                'group flex items-center gap-3 p-4 rounded-lg border-[2.5px] transition-all',
                platform.selected
                  ? 'bg-lime border-lime shadow-[0_0_0_1px_var(--color-lime-deep)]'
                  : 'bg-white border-ink/20 hover:border-canary hover:bg-canary/10'
              )}
            >
              <input
                type="checkbox"
                checked={platform.selected}
                onChange={() => handleToggle(platform.id)}
                className="h-5 w-5 accent-lime"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                <PlatformIcon platformId={platform.id} />
                  <span className="font-body font-medium text-ink truncate">{platform.name}</span>
                </div>
                <p className="font-mono text-[10px] text-ink-faint">Custom platform</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCustom(platform.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5 text-punch" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Count */}
      <div className="p-3 rounded-lg border-[2.5px] border-canary bg-canary/10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-lime" />
          {platforms.filter((p) => p.selected).length} platform{platforms.filter((p) => p.selected).length !== 1 ? 's' : ''} selected for distribution
        </p>
      </div>

      {/* Add Custom Platform Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 animate-fade-up">
          <div className="w-full max-w-md rounded-xl border-[3px] border-ink bg-paper p-6 shadow-[9px_9px_0_0_var(--color-ink)]">
            <h3 className="font-display text-lg uppercase text-ink mb-4">Add Custom Platform</h3>
            <input
              type="text"
              value={customPlatformName}
              onChange={(e) => setCustomPlatformName(e.target.value)}
              placeholder="e.g., Pandora, Anghami, NetEase..."
              className="w-full rounded-lg border-[3px] border-ink bg-white px-4 py-3 font-body text-sm font-medium text-ink placeholder:text-ink-faint focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddCustom} className="flex-1" disabled={!customPlatformName.trim()}>
                Add Platform
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
