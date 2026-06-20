"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Download,
  Music2,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  X,
  Disc3,
  SearchX,
  Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Release, ReleaseStatus } from "@/types";

// ── helpers ──────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFilenameFromUrl(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop() ?? "audio");
  } catch {
    return "audio";
  }
}

// ── stat card ─────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-extrabold text-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── reject modal ──────────────────────────────────────────────
function RejectModal({
  release,
  onClose,
  onConfirm,
}: {
  release: Release;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    await onConfirm(reason.trim());
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-bg-card border border-bg-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-up">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-status-rejected" />
              <h3 className="text-base font-bold text-text-primary">Reject Release</h3>
            </div>
            <p className="text-xs text-text-muted">
              <span className="text-text-secondary font-medium">{release.song_title}</span>
              {" "}by {release.artist_name}
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
          Rejection Reason <span className="text-status-rejected">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Audio quality is below our minimum standard (128kbps). Please re-upload at 320kbps."
          rows={4}
          className="w-full bg-bg-elevated border border-bg-border rounded-xl px-4 py-3 text-sm text-text-primary
            placeholder:text-text-muted transition-all focus:border-status-rejected/60 outline-none resize-none mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-border text-sm text-text-secondary hover:bg-bg-elevated transition-all"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!reason.trim() || loading}
            className="flex-1 py-2.5 rounded-xl bg-status-rejected/90 hover:bg-status-rejected text-white text-sm font-semibold
              transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Disc3 className="w-3.5 h-3.5 animate-spin" />Rejecting...</>
            ) : (
              <><XCircle className="w-3.5 h-3.5" />Confirm Reject</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────
export default function AdminDashboard() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Release | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReleaseStatus | "All">("All");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchReleases = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const { data, error } = await supabase
      .from("releases")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReleases(data as Release[]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchReleases(); }, [fetchReleases]);

  // approve
  const handleApprove = async (release: Release) => {
    setActionLoading(release.id);
    const { error } = await supabase
      .from("releases")
      .update({ status: "Approved", rejection_reason: null })
      .eq("id", release.id);

    if (error) {
      showToast("Failed to approve. Try again.", "error");
    } else {
      setReleases((prev) =>
        prev.map((r) => r.id === release.id ? { ...r, status: "Approved", rejection_reason: null } : r)
      );
      showToast(`"${release.song_title}" approved!`, "success");
    }
    setActionLoading(null);
  };

  // reject
  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    const target = rejectTarget;
    setRejectTarget(null);
    setActionLoading(target.id);

    const { error } = await supabase
      .from("releases")
      .update({ status: "Rejected", rejection_reason: reason })
      .eq("id", target.id);

    if (error) {
      showToast("Failed to reject. Try again.", "error");
    } else {
      setReleases((prev) =>
        prev.map((r) => r.id === target.id ? { ...r, status: "Rejected", rejection_reason: reason } : r)
      );
      showToast(`"${target.song_title}" rejected.`, "success");
    }
    setActionLoading(null);
  };

  // download all info as CSV
  const handleDownloadAll = (release: Release) => {
    const rows = [
      ["Field", "Value"],
      ["Artist Name", release.artist_name],
      ["Song Title", release.song_title],
      ["Genre", release.genre],
      ["Release Date", release.release_date],
      ["Status", release.status],
      ["Submission Date", fmtDateTime(release.created_at)],
      ["Audio URL", release.audio_url],
      ["Rejection Reason", release.rejection_reason ?? "N/A"],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${release.artist_name}_${release.song_title}.csv`.replace(/\s+/g, "_");
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = filterStatus === "All"
    ? releases
    : releases.filter((r) => r.status === filterStatus);

  const stats = {
    total: releases.length,
    pending: releases.filter((r) => r.status === "Pending Review").length,
    approved: releases.filter((r) => r.status === "Approved").length,
    rejected: releases.filter((r) => r.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
            Master Control
          </p>
          <h1 className="text-2xl font-extrabold text-text-primary">Releases Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Review, approve, or reject artist submissions.
          </p>
        </div>
        <button
          onClick={() => fetchReleases(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 text-xs text-text-secondary border border-bg-border rounded-lg px-3 py-2
            hover:bg-bg-elevated hover:text-text-primary transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Total Submissions" value={stats.total} color="bg-accent-violet/15 text-accent-glow" />
        <StatCard icon={Clock} label="Pending Review" value={stats.pending} color="bg-status-pending/15 text-status-pending" />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} color="bg-status-approved/15 text-status-approved" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="bg-status-rejected/15 text-status-rejected" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-text-muted" />
        {(["All", "Pending Review", "Approved", "Rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${filterStatus === s
                ? "bg-accent-violet/20 border-accent-violet/40 text-accent-glow"
                : "border-bg-border text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
              }`}
          >
            {s} {s !== "All" && `(${stats[s === "Pending Review" ? "pending" : s.toLowerCase() as "approved" | "rejected"]})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-bg-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-bg-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-text-muted" />
            <h2 className="text-sm font-semibold text-text-primary">All Releases</h2>
          </div>
          <span className="text-xs text-text-muted">{filtered.length} entries</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Disc3 className="w-8 h-8 text-accent-violet animate-spin" />
            <p className="text-sm text-text-muted">Loading releases...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <SearchX className="w-10 h-10 text-text-muted" />
            <p className="text-sm font-medium text-text-secondary">No releases found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop table header */}
            <div className="hidden xl:grid grid-cols-[180px_180px_100px_110px_220px_130px_180px] gap-3 px-5 py-3 bg-bg-elevated
              text-[10px] font-semibold text-text-muted uppercase tracking-widest border-b border-bg-border">
              <span>Artist</span>
              <span>Song Title</span>
              <span>Genre</span>
              <span>Release Date</span>
              <span>Audio Preview</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-bg-border">
              {filtered.map((r, idx) => (
                <div
                  key={r.id}
                  className="px-5 py-4 flex flex-col xl:grid xl:grid-cols-[180px_180px_100px_110px_220px_130px_180px] gap-3 xl:items-center
                    hover:bg-bg-elevated/40 transition-colors"
                  style={{
                    animation: "fade-up 0.3s ease-out forwards",
                    animationDelay: `${idx * 0.03}s`,
                    opacity: 0,
                  }}
                >
                  {/* Artist */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {r.artist_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{r.artist_name}</p>
                      <p className="text-[10px] text-text-muted">{fmtDateTime(r.created_at)}</p>
                    </div>
                  </div>

                  {/* Song */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate flex items-center gap-1.5">
                      <Music2 className="w-3.5 h-3.5 text-accent-glow shrink-0" />
                      {r.song_title}
                    </p>
                    {r.rejection_reason && (
                      <p className="text-[10px] text-status-rejected mt-0.5 truncate" title={r.rejection_reason}>
                        ✕ {r.rejection_reason}
                      </p>
                    )}
                  </div>

                  {/* Genre */}
                  <span className="text-xs text-text-secondary bg-bg-elevated border border-bg-border px-2 py-1 rounded-lg w-fit">
                    {r.genre}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-text-secondary">{fmt(r.release_date)}</span>

                  {/* Audio player */}
                  <div className="w-full max-w-[220px]">
                    <audio
                      controls
                      preload="none"
                      src={r.audio_url}
                      className="w-full h-8"
                      style={{ accentColor: "#7C3AED" }}
                    />
                    <p className="text-[10px] text-text-muted mt-1 truncate" title={getFilenameFromUrl(r.audio_url)}>
                      {getFilenameFromUrl(r.audio_url)}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <StatusBadge status={r.status} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Approve */}
                    <button
                      onClick={() => handleApprove(r)}
                      disabled={r.status === "Approved" || actionLoading === r.id}
                      title="Approve"
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                        ${r.status === "Approved"
                          ? "bg-status-approved/10 text-status-approved border border-status-approved/20 cursor-default"
                          : "bg-status-approved/15 hover:bg-status-approved/30 text-status-approved border border-status-approved/25 hover:scale-105 active:scale-95"
                        } disabled:opacity-60`}
                    >
                      {actionLoading === r.id ? (
                        <Disc3 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      Approve
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => setRejectTarget(r)}
                      disabled={r.status === "Rejected" || actionLoading === r.id}
                      title="Reject"
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                        ${r.status === "Rejected"
                          ? "bg-status-rejected/10 text-status-rejected border border-status-rejected/20 cursor-default"
                          : "bg-status-rejected/15 hover:bg-status-rejected/30 text-status-rejected border border-status-rejected/25 hover:scale-105 active:scale-95"
                        } disabled:opacity-60`}
                    >
                      <XCircle className="w-3 h-3" />
                      Reject
                    </button>

                    {/* Download all info */}
                    <button
                      onClick={() => handleDownloadAll(r)}
                      title="Download all client info as CSV"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                        bg-bg-elevated hover:bg-accent-violet/15 text-text-muted hover:text-accent-glow
                        border border-bg-border hover:border-accent-violet/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          release={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl animate-toast-in
          ${toast.type === "success"
            ? "bg-bg-elevated border-status-approved/30 text-status-approved"
            : "bg-bg-elevated border-status-rejected/30 text-status-rejected"
          }`}>
          {toast.type === "success"
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <XCircle className="w-4 h-4 shrink-0" />
          }
          <span className="text-sm font-medium text-text-primary">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
