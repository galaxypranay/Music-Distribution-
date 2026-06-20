"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Music2, Disc3, Radio } from "lucide-react";

const WAVEFORM_BARS = 28;

export default function HomePage() {
  const router = useRouter();
  const [artistName, setArtistName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("artist_name");
    if (stored) {
      router.replace("/dashboard/upload");
    } else {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = artistName.trim();
    if (!trimmed) {
      setError("Please enter your artist name.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setSubmitting(true);
    localStorage.setItem("artist_name", trimmed);
    setTimeout(() => router.push("/dashboard/upload"), 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Disc3 className="w-8 h-8 text-accent-violet animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg-base relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#7C3AED18] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#4F46E518] rounded-full blur-3xl" />
      </div>

      {/* Animated waveform — signature element */}
      <div className="flex items-end gap-[3px] h-12 mb-10 opacity-60">
        {Array.from({ length: WAVEFORM_BARS }).map((_, i) => (
          <div
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-accent-violet to-accent-glow"
            style={{
              height: `${Math.max(20, Math.sin(i * 0.45) * 40 + 24)}%`,
              animation: `wave-bar ${0.8 + (i % 5) * 0.12}s ease-in-out infinite alternate`,
              animationDelay: `${(i * 0.06).toFixed(2)}s`,
            }}
          />
        ))}
      </div>

      {/* Logo & tagline */}
      <div className="text-center mb-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow-violet">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">
            Spilrix
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
          Your music,{" "}
          <span className="bg-gradient-accent bg-clip-text text-transparent">
            everywhere.
          </span>
        </h1>
        <p className="mt-3 text-text-secondary text-base max-w-sm mx-auto leading-relaxed">
          Upload your tracks, track distribution status, and reach listeners
          across every platform.
        </p>
      </div>

      {/* Input card */}
      <div
        className="w-full max-w-md animate-fade-up"
        style={{ animationDelay: "0.1s", opacity: 0 }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-bg-card border border-bg-border rounded-2xl p-6 shadow-card"
        >
          <label
            htmlFor="artist-name"
            className="block text-sm font-semibold text-text-primary mb-1.5 tracking-wide"
          >
            Artist Name
          </label>
          <p className="text-xs text-text-muted mb-4">
            This is how your releases will be listed on all platforms.
          </p>

          <input
            ref={inputRef}
            id="artist-name"
            type="text"
            value={artistName}
            onChange={(e) => {
              setArtistName(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. The Midnight, Billie Eilish..."
            maxLength={60}
            className={`w-full bg-bg-elevated border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted
              transition-all duration-200 outline-none
              ${error ? "border-status-rejected" : "border-bg-border focus:border-accent-violet focus:shadow-glow-sm"}`}
          />

          {error && (
            <p className="mt-2 text-xs text-status-rejected animate-slide-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-accent text-white font-semibold text-sm py-3 px-6 rounded-xl
              transition-all duration-200 hover:shadow-glow-violet hover:scale-[1.01] active:scale-[0.99]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {submitting ? (
              <>
                <Disc3 className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Enter Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Trust indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-text-muted text-xs">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-accent-violet" />
            100+ Platforms
          </span>
          <span className="flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5 text-accent-violet" />
            Unlimited Uploads
          </span>
          <span className="flex items-center gap-1.5">
            <Disc3 className="w-3.5 h-3.5 text-accent-violet" />
            Live Tracking
          </span>
        </div>
      </div>
    </main>
  );
}
