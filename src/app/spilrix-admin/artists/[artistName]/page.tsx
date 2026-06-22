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
  X,
  ShieldAlert,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Release, ArtistProfile } from "@/types";

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

// ── Confirm modal (reused for song + profile delete) ──────────
function ConfirmDeleteModal({
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
              <><Disc3 className="w-3.5 h-3.5 animate-spin" />Deleting...</>
            ) : (
              <><Trash2 className="w-3.5 h-3.5" />{confirmLabel}</>
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
  const [songToDelete, setSongToDelete] = useState<Release | null>(null);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Disc3 className="w-8 h-8 text-accent-violet animate-spin" />
        <p className="text-sm text-text-muted">Loading artist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto">
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

      {/* Songs list */}
      <div className="bg-bg-card border border-bg-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-bg-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-text-muted" />
            <h2 className="text-sm font-semibold text-text-primary">Songs</h2>
          </div>
          <span className="text-xs text-text-muted">{releases.length} entries</span>
        </div>

        {releases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <SearchX className="w-10 h-10 text-text-muted" />
            <p className="text-sm font-medium text-text-secondary">No songs uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-bg-border">
            {releases.map((r, idx) => (
              <div
                key={r.id}
                className="px-5 py-4 flex flex-col lg:grid lg:grid-cols-[1fr_100px_110px_220px_130px_100px] gap-3 lg:items-center hover:bg-bg-elevated/40 transition-colors"
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
                  <p className="text-[10px] text-text-muted mt-0.5">{fmtDateTime(r.created_at)}</p>
                </div>

                {/* Genre */}
                <span className="text-xs text-text-secondary bg-bg-elevated border border-bg-border px-2 py-1 rounded-lg w-fit">
                  {r.genre}
                </span>

                {/* Date */}
                <span className="text-xs text-text-secondary">{fmt(r.release_date)}</span>

                {/* Audio player */}
                <div className="w-full max-w-[220px]">
                  <audio controls preload="none" src={r.audio_url} className="w-full h-8" style={{ accentColor: "#7C3AED" }} />
                </div>

                {/* Status */}
                <div><StatusBadge status={r.status} /></div>

                {/* Delete */}
                <div>
                  <button
                    onClick={() => setSongToDelete(r)}
                    disabled={actionLoading === r.id}
                    title="Delete song"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                      bg-status-rejected/15 hover:bg-status-rejected/30 text-status-rejected border border-status-rejected/25
                      hover:scale-105 active:scale-95 disabled:opacity-60"
                  >
                    {actionLoading === r.id ? (
                      <Disc3 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Song delete confirm */}
      {songToDelete && (
        <ConfirmDeleteModal
          title="Delete Song"
          description={`This will permanently delete "${songToDelete.song_title}" and its audio file from storage. This cannot be undone.`}
          confirmLabel="Delete Song"
          onClose={() => setSongToDelete(null)}
          onConfirm={handleDeleteSong}
        />
      )}

      {/* Profile delete confirm */}
      {confirmDeleteProfile && (
        <ConfirmDeleteModal
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
            <Music2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span className="text-sm font-medium text-text-primary">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
