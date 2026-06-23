"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  Music2,
  Disc3,
  SearchX,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  ShieldAlert,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Release, ArtistProfile, ReleaseStatus } from "@/types";

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

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getFilenameFromUrl(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop() ?? "audio");
  } catch {
    return "audio";
  }
}

// Extract the storage object path (filename) from a Supabase public URL
function pathFromPublicUrl(url: string, bucket: string): string | null {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  } catch {
    return null;
  }
}

// ── Generic confirm modal (delete song / delete profile) ──────
function ConfirmModal({
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-bg-card border border-bg-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-up">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-status-rejected" />
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-5">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-border text-sm text-text-secondary hover:bg-bg-elevated transition-all"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-status-rejected/90 hover:bg-status-rejected text-white text-sm font-semibold
              transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Disc3 className="w-3.5 h-3.5 animate-spin" />Working...</>
            ) : (
              <><Trash2 className="w-3.5 h-3.5" />{confirmLabel}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reject reason modal ────────────────────────────────────────
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

export default function ArtistDetailPage() {
  const router = useRouter();
  const params = useParams<{ artistName: string }>();
  const artistName = decodeURIComponent(params.artistName);

  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ReleaseStatus | "All">("All");

  const [songToDelete, setSongToDelete] = useState<Release | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Release | null>(null);
  const [confirmDeleteProfile, setConfirmDeleteProfile] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);

    const [{ data: profileData }, { data: releaseData }] = await Promise.all([
      supabase.from("artist_profiles").select("*").eq("artist_name", artistName).maybeSingle(),
      supabase
        .from("releases")
        .select("*")
        .eq("artist_name", artistName)
        .order("created_at", { ascending: false }),
    ]);

    setProfile(profileData ?? null);
    setReleases((releaseData as Release[]) ?? []);
    setLoading(false);
  }, [artistName]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Approve ────────────────────────────────────────────────
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

  // ── Reject ─────────────────────────────────────────────────
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

  // ── Delete a single song: storage file + DB row ──────────────
  const handleDeleteSong = async () => {
    if (!songToDelete) return;
    const target = songToDelete;
    setSongToDelete(null);
    setActionLoading(target.id);

    try {
      const filePath = pathFromPublicUrl(target.audio_url, "songs");
      if (filePath) {
        const { error: storageError } = await supabase.storage.from("songs").remove([filePath]);
        // Don't hard-fail if the file was already gone; only block on real errors.
        if (storageError && storageError.message && !storageError.message.toLowerCase().includes("not found")) {
          throw storageError;
        }
      }

      const { error: dbError } = await supabase.from("releases").delete().eq("id", target.id);
      if (dbError) throw dbError;

      setReleases((prev) => prev.filter((r) => r.id !== target.id));
      showToast(`"${target.song_title}" deleted.`, "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete song.";
      showToast(message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Delete entire artist profile: songs + tickets + avatar + profile row ──
  const handleDeleteProfile = async () => {
    setConfirmDeleteProfile(false);
    setActionLoading("profile");

    try {
      // 1. Delete every song's audio file from storage
      const audioPaths = releases
        .map((r) => pathFromPublicUrl(r.audio_url, "songs"))
        .filter((p): p is string => Boolean(p));

      if (audioPaths.length > 0) {
        const { error: removeError } = await supabase.storage.from("songs").remove(audioPaths);
        if (removeError && !removeError.message?.toLowerCase().includes("not found")) {
          throw removeError;
        }
      }

      // 2. Delete all release rows for this artist
      const { error: releasesError } = await supabase
        .from("releases")
        .delete()
        .eq("artist_name", artistName);
      if (releasesError) throw releasesError;

      // 3. Delete all support tickets for this artist
      const { error: ticketsError } = await supabase
        .from("support_tickets")
        .delete()
        .eq("artist_name", artistName);
      if (ticketsError) throw ticketsError;

      // 4. Delete avatar file from storage (if any)
      if (profile?.profile_image_url) {
        const avatarPath = pathFromPublicUrl(profile.profile_image_url, "avatars");
        if (avatarPath) {
          const { error: avatarError } = await supabase.storage.from("avatars").remove([avatarPath]);
          if (avatarError && !avatarError.message?.toLowerCase().includes("not found")) {
            throw avatarError;
          }
        }
      }

      // 5. Delete the profile row itself (if it exists)
      if (profile) {
        const { error: profileError } = await supabase
          .from("artist_profiles")
          .delete()
          .eq("artist_name", artistName);
        if (profileError) throw profileError;
      }

      showToast(`"${artistName}" and all associated data deleted.`, "success");
      setTimeout(() => router.push("/spilrix-admin/artists"), 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete profile.";
      showToast(message, "error");
      setActionLoading(null);
    }
  };

  // ── Export single release info as CSV ─────────────────────
  const handleDownload = (release: Release) => {
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

  const filtered = filterStatus === "All" ? releases : releases.filter((r) => r.status === filterStatus);

  const stats = {
    pending: releases.filter((r) => r.status === "Pending Review").length,
    approved: releases.filter((r) => r.status === "Approved").length,
    rejected: releases.filter((r) => r.status === "Rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Disc3 className="w-8 h-8 text-accent-violet animate-spin" />
        <p className="text-sm text-text-muted">Loading artist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-6xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push("/spilrix-admin/artists")}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Artists
      </button>

      {/* Profile header */}
      <div className="bg-bg-card border border-bg-border rounded-xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gradient-accent text-white font-bold text-xl">
            {profile?.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profile_image_url}
                alt={artistName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials(artistName)}</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-text-primary flex items-center gap-2">
              <User className="w-4 h-4 text-text-muted" />
              {artistName}
            </h1>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {profile ? `Joined ${fmt(profile.created_at)}` : "No profile record (legacy artist)"}
            </p>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              <Music2 className="w-3 h-3" />
              {releases.length} {releases.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setConfirmDeleteProfile(true)}
          disabled={actionLoading === "profile"}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-status-rejected/15 hover:bg-status-rejected/30 text-status-rejected border border-status-rejected/25
            transition-all disabled:opacity-50 shrink-0"
        >
          {actionLoading === "profile" ? (
            <><Disc3 className="w-4 h-4 animate-spin" />Deleting...</>
          ) : (
            <><ShieldAlert className="w-4 h-4" />Delete Profile</>
          )}
        </button>
      </div>

      {/* Status stat strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-status-pending/15 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-status-pending" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Pending</p>
            <p className="text-xl font-bold text-text-primary">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-status-approved/15 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-status-approved" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Approved</p>
            <p className="text-xl font-bold text-text-primary">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-status-rejected/15 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-status-rejected" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Rejected</p>
            <p className="text-xl font-bold text-text-primary">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
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
            {s}
          </button>
        ))}
      </div>

      {/* Songs list */}
      <div className="bg-bg-card border border-bg-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-bg-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-text-muted" />
            <h2 className="text-sm font-semibold text-text-primary">Songs</h2>
          </div>
          <span className="text-xs text-text-muted">{filtered.length} entries</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <SearchX className="w-10 h-10 text-text-muted" />
            <p className="text-sm font-medium text-text-secondary">No songs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop header */}
            <div className="hidden xl:grid grid-cols-[160px_100px_110px_200px_130px_260px] gap-3 px-5 py-3 bg-bg-elevated
              text-[10px] font-semibold text-text-muted uppercase tracking-widest border-b border-bg-border">
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
                  className="px-5 py-4 flex flex-col xl:grid xl:grid-cols-[160px_100px_110px_200px_130px_260px] gap-3 xl:items-center hover:bg-bg-elevated/40 transition-colors"
                  style={{
                    animation: "fade-up 0.3s ease-out forwards",
                    animationDelay: `${idx * 0.03}s`,
                    opacity: 0,
                  }}
                >
                  {/* Title */}
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
                  <div className="w-full max-w-[200px]">
                    <audio controls preload="none" src={r.audio_url} className="w-full h-8" style={{ accentColor: "#7C3AED" }} />
                    <p className="text-[10px] text-text-muted mt-1 truncate" title={getFilenameFromUrl(r.audio_url)}>
                      {getFilenameFromUrl(r.audio_url)}
                    </p>
                  </div>

                  {/* Status */}
                  <div><StatusBadge status={r.status} /></div>

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

                    {/* Export CSV */}
                    <button
                      onClick={() => handleDownload(r)}
                      title="Export info as CSV"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                        bg-bg-elevated hover:bg-accent-violet/15 text-text-muted hover:text-accent-glow
                        border border-bg-border hover:border-accent-violet/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setSongToDelete(r)}
                      disabled={actionLoading === r.id}
                      title="Delete song"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                        bg-bg-elevated hover:bg-status-rejected/20 text-text-muted hover:text-status-rejected
                        border border-bg-border hover:border-status-rejected/30 hover:scale-105 active:scale-95 disabled:opacity-60"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
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

      {/* Song delete confirm */}
      {songToDelete && (
        <ConfirmModal
          title="Delete Song"
          description={`This will permanently delete "${songToDelete.song_title}" and its audio file from storage. This cannot be undone.`}
          confirmLabel="Delete Song"
          onClose={() => setSongToDelete(null)}
          onConfirm={handleDeleteSong}
        />
      )}

      {/* Profile delete confirm */}
      {confirmDeleteProfile && (
        <ConfirmModal
          title="Delete Artist Profile"
          description={`This will permanently delete "${artistName}", all ${releases.length} of their songs (audio files included), their profile photo, and all of their support tickets. This cannot be undone.`}
          confirmLabel="Delete Everything"
          onClose={() => setConfirmDeleteProfile(false)}
          onConfirm={handleDeleteProfile}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl animate-toast-in
          ${toast.type === "success"
            ? "bg-bg-elevated border-status-approved/30 text-status-approved"
            : "bg-bg-elevated border-status-rejected/30 text-status-rejected"
          }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="text-sm font-medium text-text-primary">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
