"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Music,
  Calendar,
  Tag,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Disc3,
  CloudUpload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Toast } from "@/components/ui/Toast";
import type { ToastState } from "@/types";

const GENRES = [
  "Pop",
  "Hip-Hop / Rap",
  "R&B / Soul",
  "Electronic / EDM",
  "Rock",
  "Alternative",
  "Indie",
  "Jazz",
  "Classical",
  "Reggaeton",
  "Afrobeats",
  "Latin",
  "Country",
  "Folk",
  "Metal",
  "Ambient",
  "Lo-Fi",
  "Other",
];

export default function UploadPage() {
  const [songTitle, setSongTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => setToast((t) => ({ ...t, visible: false }));

  const handleFile = (file: File | null) => {
    if (!file) return;
    const valid = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"];
    if (!valid.includes(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
      showToast("Only .mp3 and .wav files are accepted.", "error");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast("File must be under 50MB.", "error");
      return;
    }
    setAudioFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!songTitle.trim() || !genre || !releaseDate || !audioFile) {
      showToast("Please fill in all fields and attach an audio file.", "error");
      return;
    }

    const artistName = localStorage.getItem("artist_name");
    if (!artistName) {
      showToast("Session expired. Please refresh.", "error");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload file to Supabase Storage
      const ext = audioFile.name.split(".").pop();
      const fileName = `${artistName.replace(/\s+/g, "_")}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("songs")
        .upload(fileName, audioFile, {
          contentType: audioFile.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from("songs")
        .getPublicUrl(fileName);

      const audioUrl = urlData.publicUrl;

      // 3. Insert into releases table
      const { error: insertError } = await supabase.from("releases").insert({
        artist_name: artistName,
        song_title: songTitle.trim(),
        genre,
        release_date: releaseDate,
        audio_url: audioUrl,
        status: "Pending Review",
      });

      if (insertError) throw insertError;

      showToast(
        `"${songTitle}" submitted successfully! We'll review it shortly.`,
        "success"
      );

      // Reset form
      setSongTitle("");
      setGenre("");
      setReleaseDate("");
      setAudioFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <CloudUpload className="w-5 h-5" style={{ color: "#ff6a00" }} />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#ff8533" }}
          >
            Submit Release
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Upload Track</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted2)" }}>
          Your release will be reviewed within 24–48 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Song Title */}
        <div>
          <label
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--muted2)" }}
          >
            <Music className="w-3.5 h-3.5" />
            Song Title
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="Enter the full track name"
            maxLength={100}
            className="w-full rounded-xl px-4 py-3 text-sm placeholder:text-text-muted outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#ff6a00";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,106,0,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Genre */}
        <div>
          <label
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--muted2)" }}
          >
            <Tag className="w-3.5 h-3.5" />
            Genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#ff6a00";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,106,0,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <option value="">Select a genre</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Release Date */}
        <div>
          <label
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--muted2)" }}
          >
            <Calendar className="w-3.5 h-3.5" />
            Release Date
          </label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all [color-scheme:dark]"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#ff6a00";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,106,0,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Audio File Drop Zone */}
        <div>
          <label
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--muted2)" }}
          >
            <FileAudio className="w-3.5 h-3.5" />
            Audio File
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={() => setIsDragging(false)}
            className="relative rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
            style={{
              border: `2px dashed ${
                isDragging
                  ? "#ff6a00"
                  : audioFile
                    ? "rgba(74,222,128,0.4)"
                    : "var(--border)"
              }`,
              background: isDragging
                ? "rgba(255,106,0,0.07)"
                : audioFile
                  ? "rgba(74,222,128,0.05)"
                  : "var(--surface)",
              boxShadow: isDragging ? "0 0 15px rgba(255,106,0,0.2)" : "none",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />

            {audioFile ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8" style={{ color: "#4ade80" }} />
                <p className="text-sm font-semibold text-text-primary">
                  {audioFile.name}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAudioFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs mt-1 transition-colors"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--muted)";
                  }}
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8" style={{ color: "var(--muted)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--muted2)" }}>
                  Drop your audio file here
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  or click to browse · MP3 / WAV · Max 50MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-3.5 px-6 rounded-xl mt-2 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #ff6a00, #ff8533)",
            boxShadow: "var(--shadow-card), 0 0 15px rgba(255,106,0,0.25)",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow =
                "var(--shadow-hover), 0 0 25px rgba(255,106,0,0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "var(--shadow-card), 0 0 15px rgba(255,106,0,0.25)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? (
            <>
              <Disc3 className="w-4 h-4 animate-spin" />
              Uploading release...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Submit Release
            </>
          )}
        </button>

        {/* Disclaimer */}
        <p
          className="text-xs text-center flex items-center justify-center gap-1.5"
          style={{ color: "var(--muted)" }}
        >
          <AlertCircle className="w-3 h-3" />
          Make sure you own all rights to this track before submitting.
        </p>
      </form>

      <Toast {...toast} onClose={closeToast} />
    </div>
  );
}
