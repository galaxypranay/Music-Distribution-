"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Music, Calendar, Tag, FileAudio, CheckCircle2, AlertCircle, Disc3, CloudUpload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ToastState } from "@/types";

const GENRES = [
  "Pop","Hip-Hop / Rap","R&B / Soul","Electronic / EDM","Rock","Alternative",
  "Indie","Jazz","Classical","Reggaeton","Afrobeats","Latin","Country","Folk",
  "Metal","Ambient","Lo-Fi","Other",
];

function Toast({ message, type, visible, onClose }: ToastState & { onClose: () => void }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast-in flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: "var(--surface2)",
        border: `1px solid ${type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
        boxShadow: "var(--shadow-card)",
      }}>
      {type === "success"
        ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#4ade80" }} />
        : <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#f87171" }} />}
      <span className="text-sm font-medium text-text-primary">{message}</span>
      <button onClick={onClose} style={{ color: "var(--muted)" }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function UploadPage() {
  const [songTitle,   setSongTitle]   = useState("");
  const [genre,       setGenre]       = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [audioFile,   setAudioFile]   = useState<File | null>(null);
  const [isDragging,  setIsDragging]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [toast,       setToast]       = useState<ToastState>({ message: "", type: "success", visible: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastState["type"]) =>
    setToast({ message, type, visible: true });
  const closeToast = () => setToast(t => ({ ...t, visible: false }));

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.name.match(/\.(mp3|wav)$/i)) { showToast("Only .mp3 and .wav files accepted.", "error"); return; }
    if (file.size > 50 * 1024 * 1024) { showToast("File must be under 50MB.", "error"); return; }
    setAudioFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !genre || !releaseDate || !audioFile) {
      showToast("Please fill in all fields and attach an audio file.", "error"); return;
    }
    const artistName = localStorage.getItem("artist_name");
    if (!artistName) { showToast("Session expired. Refresh.", "error"); return; }

    setLoading(true);
    try {
      const ext = audioFile.name.split(".").pop();
      const fileName = `${artistName.replace(/\s+/g, "_")}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("songs").upload(fileName, audioFile, { contentType: audioFile.type, upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("songs").getPublicUrl(fileName);
      const { error: insertError } = await supabase.from("releases").insert({
        artist_name: artistName, song_title: songTitle.trim(), genre,
        release_date: releaseDate, audio_url: urlData.publicUrl, status: "Pending Review",
      });
      if (insertError) throw insertError;

      showToast(`"${songTitle}" submitted! We'll review it shortly.`, "success");
      setSongTitle(""); setGenre(""); setReleaseDate(""); setAudioFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    boxShadow: "inset 3px 3px 8px rgba(10,5,0,0.4), inset -2px -2px 6px rgba(255,235,190,0.03)",
  };

  const labelStyle = "block text-xs font-semibold uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2"
          style={{ color: "#ff8533" }}>
          <CloudUpload className="w-4 h-4" /> Submit Release
        </p>
        <h1 className="text-3xl font-bold text-text-primary">Upload Track</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>
          Reviewed within 24–48 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Song Title */}
        <div>
          <label className={labelStyle} style={{ color: "var(--muted2)" }}>
            <span className="flex items-center gap-2"><Music className="w-3.5 h-3.5" />Song Title</span>
          </label>
          <input type="text" value={songTitle} onChange={e => setSongTitle(e.target.value)}
            placeholder="Enter the full track name" maxLength={100}
            className="input-skeu w-full rounded-xl px-4 py-3 text-sm" />
        </div>

        {/* Genre */}
        <div>
          <label className={labelStyle} style={{ color: "var(--muted2)" }}>
            <span className="flex items-center gap-2"><Tag className="w-3.5 h-3.5" />Genre</span>
          </label>
          <select value={genre} onChange={e => setGenre(e.target.value)}
            className="input-skeu w-full rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer"
            style={{ ...inputStyle }}>
            <option value="">Select a genre</option>
            {GENRES.map(g => <option key={g} value={g} style={{ background: "var(--surface2)" }}>{g}</option>)}
          </select>
        </div>

        {/* Release Date */}
        <div>
          <label className={labelStyle} style={{ color: "var(--muted2)" }}>
            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />Release Date</span>
          </label>
          <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)}
            className="input-skeu w-full rounded-xl px-4 py-3 text-sm [color-scheme:dark]" />
        </div>

        {/* Audio drop zone */}
        <div>
          <label className={labelStyle} style={{ color: "var(--muted2)" }}>
            <span className="flex items-center gap-2"><FileAudio className="w-3.5 h-3.5" />Audio File</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
            style={{
              borderColor: isDragging ? "#ff6a00" : audioFile ? "rgba(74,222,128,0.4)" : "var(--border2)",
              background: isDragging ? "rgba(255,106,0,0.08)" : audioFile ? "rgba(74,222,128,0.04)" : "var(--surface)",
              boxShadow: isDragging ? "0 0 20px rgba(255,106,0,0.2)" : "inset 3px 3px 8px rgba(10,5,0,0.3)",
            }}>
            <input ref={fileInputRef} type="file" accept=".mp3,.wav,audio/mpeg,audio/wav"
              onChange={e => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
            {audioFile ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8" style={{ color: "#4ade80" }} />
                <p className="text-sm font-semibold text-text-primary">{audioFile.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button type="button"
                  onClick={e => { e.stopPropagation(); setAudioFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-xs mt-1 transition-colors hover:text-red-400" style={{ color: "var(--muted)" }}>
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8" style={{ color: "var(--muted)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--text-dim)" }}>Drop your audio file here</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>or click to browse · MP3 / WAV · Max 50MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="btn-orange w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading
            ? <><Disc3 className="w-4 h-4 animate-spin" /> Uploading...</>
            : <><Upload className="w-4 h-4" /> Submit Release</>}
        </button>

        <p className="text-xs text-center flex items-center justify-center gap-1.5" style={{ color: "var(--muted)" }}>
          <AlertCircle className="w-3 h-3" />
          Make sure you own all rights to this track.
        </p>
      </form>

      <Toast {...toast} onClose={closeToast} />
    </div>
  );
}
