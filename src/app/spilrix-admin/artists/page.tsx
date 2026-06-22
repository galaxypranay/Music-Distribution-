"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  User,
  Music2,
  Calendar,
  Disc3,
  SearchX,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ArtistWithStats } from "@/types";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<ArtistWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArtists = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const [{ data: profiles, error: profileError }, { data: releases, error: releaseError }] =
      await Promise.all([
        supabase
          .from("artist_profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("releases").select("artist_name"),
      ]);

    if (!profileError && profiles) {
      const counts = new Map<string, number>();
      (releases ?? []).forEach((r: { artist_name: string }) => {
        counts.set(r.artist_name, (counts.get(r.artist_name) ?? 0) + 1);
      });

      // Make sure artists who have releases but somehow no profile row still show up.
      const knownNames = new Set(profiles.map((p) => p.artist_name));
      const extraNames = [...counts.keys()].filter((n) => !knownNames.has(n));

      const merged: ArtistWithStats[] = [
        ...profiles.map((p) => ({
          ...p,
          total_songs: counts.get(p.artist_name) ?? 0,
        })),
        ...extraNames.map((name) => ({
          id: `unregistered-${name}`,
          artist_name: name,
          profile_image_url: null,
          created_at: new Date().toISOString(),
          total_songs: counts.get(name) ?? 0,
        })),
      ];

      setArtists(merged);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchArtists(); }, [fetchArtists]);

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
            Roster
          </p>
          <h1 className="text-2xl font-extrabold text-text-primary">Artists</h1>
          <p className="text-sm text-text-secondary mt-1">
            All registered artist profiles and their submissions.
          </p>
        </div>
        <button
          onClick={() => fetchArtists(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 text-xs text-text-secondary border border-bg-border rounded-lg px-3 py-2
            hover:bg-bg-elevated hover:text-text-primary transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat strip */}
      <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3 mb-6 w-fit">
        <div className="w-9 h-9 rounded-lg bg-accent-violet/15 flex items-center justify-center">
          <Users className="w-4 h-4 text-accent-glow" />
        </div>
        <div>
          <p className="text-xs text-text-muted">Total Artists</p>
          <p className="text-xl font-bold text-text-primary">{artists.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Disc3 className="w-8 h-8 text-accent-violet animate-spin" />
          <p className="text-sm text-text-muted">Loading artists...</p>
        </div>
      ) : artists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <SearchX className="w-10 h-10 text-text-muted" />
          <p className="text-sm font-medium text-text-secondary">No artists yet</p>
          <p className="text-xs text-text-muted">Artists will appear here once they sign up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artists.map((artist, idx) => (
            <button
              key={artist.id}
              onClick={() => router.push(`/spilrix-admin/artists/${encodeURIComponent(artist.artist_name)}`)}
              className="bg-bg-card border border-bg-border rounded-xl p-5 text-left transition-all
                hover:border-accent-violet/30 hover:bg-bg-elevated/50 hover:-translate-y-0.5"
              style={{
                animation: "fade-up 0.3s ease-out forwards",
                animationDelay: `${idx * 0.03}s`,
                opacity: 0,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gradient-accent text-white font-bold text-lg">
                  {artist.profile_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artist.profile_image_url}
                      alt={artist.artist_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials(artist.artist_name)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    {artist.artist_name}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {fmt(artist.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-bg-elevated border border-bg-border rounded-lg px-3 py-2">
                <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Music2 className="w-3.5 h-3.5 text-accent-glow" />
                  Songs
                </span>
                <span className="text-sm font-bold text-text-primary">{artist.total_songs}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
