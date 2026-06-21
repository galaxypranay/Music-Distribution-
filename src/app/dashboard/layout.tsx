"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Music2, Disc3, Radio, Zap, Globe } from "lucide-react";

const BARS = 32;

export default function HomePage() {
  const router = useRouter();
  const [artistName, setArtistName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("artist_name");
    if (stored) {
      router.replace("/dashboard/upload");
    } else {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = artistName.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("Enter a valid artist name (min 2 chars).");
      return;
    }
    setSubmitting(true);
    localStorage.setItem("artist_name", trimmed);
    setTimeout(() => router.push("/dashboard/upload"), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Disc3 className="w-8 h-8 text-accent-orange animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg-base relative overflow-hidden flex flex-col items-center justify-center px-4">

      {/* Ambient orbs */}
      <div className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 animate-orb-float"
        style={{ background: "rgba(255,80,10,0.08)", filter: "blur(120px)", top: "20%", left: "-200px" }} />
      <div className="fixed w-[500px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(179,136,255,0.05)", filter: "blur(120px)", bottom: "10%", right: "-150px" }} />
      <div className="fixed w-[350px] h-[300px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(0,229,255,0.03)", filter: "blur(100px)", top: "50%", right: "10%" }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">

        {/* Waveform */}
        <div className="flex items-end gap-[2px] h-10 mb-8 opacity-70">
          {Array.from({ length: BARS }).map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: "3px",
                background: `linear-gradient(to top, #ff6a00, #ff8533)`,
                height: `${Math.max(15, Math.abs(Math.sin(i * 0.5)) * 100)}%`,
                animation: `wave-bar ${0.7 + (i % 6) * 0.1}s ease-in-out infinite alternate`,
                animationDelay: `${(i * 0.05).toFixed(2)}s`,
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center btn-orange"
            style={{ boxShadow: "var(--shadow-neon)" }}>
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-4xl text-text-primary tracking-wider">SPILRIX</span>
        </div>

        <p className="text-text-muted text-sm tracking-[0.2em] uppercase mb-10">
          Music Distribution
        </p>

        {/* Main heading */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight mb-3">
            Your music,{" "}
            <span style={{
              background: "linear-gradient(135deg, #ff6a00, #ff8533, #ffaa66)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              everywhere.
            </span>
          </h1>
          <p className="text-text-secondary text-base max-w-sm mx-auto leading-relaxed">
            Upload your tracks and reach listeners on every major platform — Spotify, Apple Music, JioSaavn & 100+ more.
          </p>
        </div>

        {/* Input card */}
        <div className="w-full glass-card rounded-2xl p-6 mb-6 animate-fade-up"
          style={{ animationDelay: "0.1s" }}>

          <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-1">
            Artist Name
          </label>
          <p className="text-xs text-text-muted mb-4" style={{ color: "var(--muted)" }}>
            This is how your releases will appear on all platforms.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={artistName}
              onChange={(e) => { setArtistName(e.target.value); setError(""); }}
              placeholder="e.g. The Midnight, Billie Eilish..."
              maxLength={60}
              className="input-skeu w-full rounded-xl px-4 py-3 text-sm"
              style={{
                borderColor: error ? "rgba(248,113,113,0.5)" : undefined,
              }}
            />

            {error && (
              <p className="text-xs animate-slide-in" style={{ color: "#f87171" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-orange w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold"
            >
              {submitting ? (
                <><Disc3 className="w-4 h-4 animate-spin" /> Setting up...</>
              ) : (
                <>Enter Dashboard <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-6 text-xs flex-wrap"
          style={{ color: "var(--muted)" }}>
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" style={{ color: "#ff8533" }} />
            100+ Platforms
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" style={{ color: "#ff8533" }} />
            24hr Review
          </span>
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" style={{ color: "#ff8533" }} />
            Live Tracking
          </span>
        </div>
      </div>
    </main>
  );
}
