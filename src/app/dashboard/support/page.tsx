"use client";

import { useState } from "react";
import {
  HeadphonesIcon,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Disc3,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const FAQ = [
  {
    q: "How long does review take?",
    a: "Most releases are reviewed within 24–48 hours. You'll see your status update in the Analytics tab.",
  },
  {
    q: "What formats do you accept?",
    a: "We accept MP3 (320kbps recommended) and WAV files up to 50MB. Higher quality = better distribution results.",
  },
  {
    q: "Which platforms will my music reach?",
    a: "Your music will be distributed to Spotify, Apple Music, YouTube Music, Amazon Music, JioSaavn, and 100+ more platforms.",
  },
  {
    q: "Can I change my artist name?",
    a: "Click the logout icon in the sidebar to switch artist names. Note: this doesn't affect already-submitted releases.",
  },
];

export default function SupportPage() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;

    const artistName = localStorage.getItem("artist_name");
    if (!artistName) {
      setError("Session expired. Please refresh.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: dbError } = await supabase.from("support_tickets").insert({
      artist_name: artistName,
      subject: subject.trim(),
      message: message.trim(),
      status: "Open",
    });

    if (dbError) {
      setError("Failed to send. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-2xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <HeadphonesIcon className="w-5 h-5 text-accent-glow" />
          <span className="text-xs font-semibold text-accent-glow uppercase tracking-widest">
            Help Center
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Support</h1>
        <p className="text-sm text-text-secondary mt-1">
          We typically respond within 4–8 hours.
        </p>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Common Questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="bg-bg-card border border-bg-border rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 hover:bg-bg-elevated transition-colors"
              >
                <span className="text-sm font-medium text-text-primary">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-bg-border pt-3 animate-fade-up">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-bg-card border border-bg-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-4 h-4 text-accent-glow" />
          <h2 className="text-sm font-semibold text-text-primary">
            Send a Message
          </h2>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-14 h-14 rounded-full bg-status-approved/15 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-status-approved" />
            </div>
            <p className="text-base font-semibold text-text-primary">
              Message received!
            </p>
            <p className="text-sm text-text-secondary text-center max-w-xs">
              Our team will get back to you within 4–8 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage("");
                setSubject("");
              }}
              className="mt-2 text-xs text-accent-glow hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. My release status hasn't updated"
                maxLength={120}
                className="w-full bg-bg-elevated border border-bg-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted
                  transition-all focus:border-accent-violet focus:shadow-glow-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={5}
                maxLength={1000}
                className="w-full bg-bg-elevated border border-bg-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted
                  transition-all focus:border-accent-violet focus:shadow-glow-sm outline-none resize-none"
              />
              <p className="text-xs text-text-muted text-right mt-1">
                {message.length}/1000
              </p>
            </div>

            {error && (
              <p className="text-xs text-status-rejected">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !message.trim() || !subject.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-accent text-white font-semibold text-sm py-3 px-6 rounded-xl
                transition-all duration-200 hover:shadow-glow-violet hover:scale-[1.01] active:scale-[0.99]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <>
                  <Disc3 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
