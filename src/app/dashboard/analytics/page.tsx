"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart2, RefreshCw, Music2, TrendingUp, Radio, Clock, Disc3, SearchX } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Release, ReleaseStatus } from "@/types";

const STATUS_CONFIG: Record<ReleaseStatus, { dot: string; bg: string; text: string }> = {
  "Pending Review": { dot: "bg-yellow-400 animate-pulse-dot", bg: "bg-yellow-400/10", text: "text-yellow-400" },
  "Approved":       { dot: "bg-green-400",                    bg: "bg-green-400/10",  text: "text-green-400"  },
  "Rejected":       { dot: "bg-red-400",                      bg: "bg-red-400/10",    text: "text-red-400"    },
};

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card rounded-xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, boxShadow: `0 0 12px ${color}22` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--muted)" }}>{label}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AnalyticsPage() {
  const [releases,    setReleases]    = useState<Release[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [artistName,  setArtistName]  = useState<string | null>(null);

  const fetchReleases = useCallback(async (isRefresh = false) => {
    if (!artistName) return;
    if (isRefresh) setRefreshing(true); else setLoading(true);
    const { data, error } = await supabase.from("releases").select("*")
      .eq("artist_name", artistName).order("created_at", { ascending: false });
    if (!error && data) setReleases(data as Release[]);
    setLoading(false); setRefreshing(false);
  }, [artistName]);

  useEffect(() => { setArtistName(localStorage.getItem("artist_name")); }, []);
  useEffect(() => { if (artistName) fetchReleases(); }, [artistName, fetchReleases]);

  const stats = {
    total:    releases.length,
    approved: releases.filter(r => r.status === "Approved").length,
    pending:  releases.filter(r => r.status === "Pending Review").length,
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2"
            style={{ color: "#ff8533" }}>
            <BarChart2 className="w-4 h-4" /> Overview
          </p>
          <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>Track your releases and distribution status.</p>
        </div>
        <button onClick={() => fetchReleases(true)} disabled={refreshing || loading}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all disabled:opacity-50 glass-card"
          style={{ color: "var(--text-dim)" }}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Total Streams" value="0"   color="#ff8533" />
        <StatCard icon={Music2}     label="Releases"      value={stats.total}    color="#b388ff" />
        <StatCard icon={Radio}      label="Approved"      value={stats.approved} color="#4ade80" />
        <StatCard icon={Clock}      label="Pending"       value={stats.pending}  color="#facc15" />
      </div>

      {/* Releases table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="text-sm font-semibold text-text-primary">Release History</h2>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {releases.length} {releases.length === 1 ? "track" : "tracks"}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Disc3 className="w-7 h-7 animate-spin" style={{ color: "#ff6a00" }} />
            <p className="text-sm" style={{ color: "var(--muted)" }}>Loading releases...</p>
          </div>
        ) : releases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <SearchX className="w-10 h-10" style={{ color: "var(--muted)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-dim)" }}>No releases yet</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Head to Upload to submit your first track.</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_120px_120px_150px] gap-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest"
              style={{ background: "var(--surface)", color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              <span>Track</span><span>Genre</span><span>Release Date</span><span>Status</span>
            </div>

            <div style={{ borderTop: "1px solid var(--border)" }}>
              {releases.map((r, idx) => {
                const sc = STATUS_CONFIG[r.status] ?? STATUS_CONFIG["Pending Review"];
                return (
                  <div key={r.id}
                    className="px-5 py-4 flex flex-col md:grid md:grid-cols-[1fr_120px_120px_150px] gap-2 md:gap-4 md:items-center
                      transition-all hover:opacity-90 animate-fade-up"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      animationDelay: `${idx * 0.05}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }}>
                    {/* Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,106,0,0.12)", boxShadow: "0 0 8px rgba(255,106,0,0.1)" }}>
                        <Music2 className="w-4 h-4" style={{ color: "#ff8533" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{r.song_title}</p>
                        <p className="text-xs md:hidden mt-0.5" style={{ color: "var(--muted)" }}>
                          {r.genre} · {fmtDate(r.release_date)}
                        </p>
                      </div>
                    </div>
                    <span className="hidden md:block text-sm" style={{ color: "var(--text-dim)" }}>{r.genre}</span>
                    <span className="hidden md:block text-sm" style={{ color: "var(--text-dim)" }}>{fmtDate(r.release_date)}</span>
                    <div className="flex md:block">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {r.status}
                      </span>
                      {r.rejection_reason && (
                        <p className="text-[10px] mt-1 text-red-400 truncate">{r.rejection_reason}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
