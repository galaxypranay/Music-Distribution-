"use client";

import { useState } from "react";
import { HeadphonesIcon, Send, MessageSquare, CheckCircle2, ChevronDown, Disc3 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const FAQ = [
  { q: "How long does review take?", a: "Most releases are reviewed within 24–48 hours. You'll see your status update in the Analytics tab." },
  { q: "What formats do you accept?", a: "We accept MP3 (320kbps recommended) and WAV files up to 50MB." },
  { q: "Which platforms will my music reach?", a: "Spotify, Apple Music, YouTube Music, Amazon Music, JioSaavn, and 100+ more platforms." },
  { q: "Can I change my artist name?", a: "Click the logout icon in the top navbar to switch artist names." },
];

export default function SupportPage() {
  const [message,  setMessage]  = useState("");
  const [subject,  setSubject]  = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;
    const artistName = localStorage.getItem("artist_name");
    if (!artistName) { setError("Session expired. Please refresh."); return; }
    setLoading(true); setError("");
    const { error: dbError } = await supabase.from("support_tickets").insert({
      artist_name: artistName, subject: subject.trim(), message: message.trim(), status: "Open",
    });
    if (dbError) { setError("Failed to send. Please try again."); setLoading(false); return; }
    setLoading(false); setSubmitted(true);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-2xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2"
          style={{ color: "#ff8533" }}>
          <HeadphonesIcon className="w-4 h-4" /> Help Center
        </p>
        <h1 className="text-3xl font-bold text-text-primary">Support</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>We typically respond within 4–8 hours.</p>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted2)" }}>
          Common Questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 transition-all"
                style={{ background: openFaq === i ? "var(--surface2)" : "transparent" }}>
                <span className="text-sm font-medium text-text-primary">{item.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  style={{ color: "var(--muted)" }} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 pt-3 text-sm leading-relaxed animate-fade-up"
                  style={{ borderTop: "1px solid var(--border)", color: "var(--text-dim)" }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-4 h-4" style={{ color: "#ff8533" }} />
          <h2 className="text-sm font-semibold text-text-primary">Send a Message</h2>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(74,222,128,0.12)", boxShadow: "0 0 20px rgba(74,222,128,0.15)" }}>
              <CheckCircle2 className="w-7 h-7" style={{ color: "#4ade80" }} />
            </div>
            <p className="text-base font-semibold text-text-primary">Message received!</p>
            <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-dim)" }}>
              Our team will get back to you within 4–8 hours.
            </p>
            <button onClick={() => { setSubmitted(false); setMessage(""); setSubject(""); }}
              className="mt-2 text-xs transition-colors hover:underline" style={{ color: "#ff8533" }}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted2)" }}>
                Subject
              </label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. My release status hasn't updated" maxLength={120}
                className="input-skeu w-full rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted2)" }}>
                Message
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..." rows={5} maxLength={1000}
                className="input-skeu w-full rounded-xl px-4 py-3 text-sm resize-none" />
              <p className="text-xs text-right mt-1" style={{ color: "var(--muted)" }}>{message.length}/1000</p>
            </div>
            {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
            <button type="submit" disabled={loading || !message.trim() || !subject.trim()}
              className="btn-orange w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <><Disc3 className="w-4 h-4 animate-spin" />Sending...</>
                : <><Send className="w-4 h-4" />Send Message</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
