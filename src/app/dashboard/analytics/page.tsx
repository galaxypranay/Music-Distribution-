"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart2,
  RefreshCw,
  Music2,
  TrendingUp,
  Radio,
  Clock,
  Disc3,
  SearchX,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Release } from "@/types";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-accent-violet/15 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-accent-glow" />
      </div>
      <div>
        <p className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AnalyticsPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [artistName, setArtistName] = useState<string | null>(null);

  const fetchReleases = useCallback(
    async (isRefresh = false) => {
      if (!artistName) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const { data, error } = await supabase
        .from("releases")
        .select("*")
        .eq("artist_name", artistName)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReleases(data as Release[]);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [artistName]
  );

  useEffect(() => {
    const stored = localStorage.getItem("artist_name");
    setArtistName(stored);
  }, []);

  useEffect(() => {
    if (artistName) fetchReleases();
  }, [artistName, fetchReleases]);

  const approved = releases.filter((r) => r.status === "Approved").length;
  const pending = releases.filter((r) => r.status === "Pending Review").length;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-accent-glow" />
            <span className="text-xs font-semibold text-accent-glow uppercase tracking-widest">
              Overview
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your releases and distribution status.
          </p>
        </div>

        <button
          onClick={() => fetchReleases(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 text-xs text-text-secondary border border-bg-border rounded-lg px-3 py-2
            hover:bg-bg-elevated hover:text-text-primary transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Total Streams"
          value="0"
          sub="Go live to start counting"
        />
        <StatCard
          icon={Music2}
          label="Total Releases"
          value={releases.length}
          sub="All time"
        />
        <StatCard
          icon={Radio}
          label="Approved"
          value={approved}
          sub="Live on platforms"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={pending}
          sub="Under review"
        />
      </div>

      {/* Releases table */}
      <div className="bg-bg-card border border-bg-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-bg-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            Release History
          </h2>
          <span className="text-xs text-text-muted">
            {releases.length} {releases.length === 1 ? "track" : "tracks"}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Disc3 className="w-7 h-7 text-accent-violet animate-spin" />
            <p className="text-sm text-text-muted">Loading releases...</p>
          </div>
        ) : releases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <SearchX className="w-10 h-10 text-text-muted" />
            <p className="text-sm font-medium text-text-secondary">
              No releases yet
            </p>
            <p className="text-xs text-text-muted">
              Head to Upload to submit your first track.
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_120px_120px_140px] gap-4 px-5 py-3 bg-bg-elevated text-xs font-semibold text-text-muted uppercase tracking-wide">
              <span>Track</span>
              <span>Genre</span>
              <span>Release Date</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-bg-border">
              {releases.map((r, idx) => (
                <div
                  key={r.id}
                  className="px-5 py-4 flex flex-col md:grid md:grid-cols-[1fr_120px_120px_140px] gap-2 md:gap-4 md:items-center
                    hover:bg-bg-elevated/50 transition-colors animate-fade-up"
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  {/* Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-violet/10 flex items-center justify-center shrink-0">
                      <Music2 className="w-4 h-4 text-accent-glow" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {r.song_title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 md:hidden">
                        {r.genre} · {formatDate(r.release_date)}
                      </p>
                    </div>
                  </div>

                  {/* Genre */}
                  <span className="hidden md:block text-sm text-text-secondary">
                    {r.genre}
                  </span>

                  {/* Date */}
                  <span className="hidden md:block text-sm text-text-secondary">
                    {formatDate(r.release_date)}
                  </span>

                  {/* Status */}
                  <div className="flex md:block">
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
