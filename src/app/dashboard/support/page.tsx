"use client";

import { useState } from "react";
import {
  HeadphonesIcon,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;
    setLoading(true);
    // Simulate async submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
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
          <HeadphonesIcon className="w-5 h-5" style={{ color: "#ff6a00" }} />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#ff8533" }}
          >
            Help Center
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Support</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted2)" }}>
          We typically respond within 4–8 hours.
        </p>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-3"
          style={{ color: "var(--muted2)" }}
        >
          Common Questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,235,190,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="text-sm font-medium text-text-primary">
                  {item.q}
                </span>
                <ChevronDown
                  className="w-4 h-4 shrink-0 transition-transform"
                  style={{
                    color: "var(--muted)",
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              {openFaq === i && (
                <div
                  className="px-5 pb-4 text-sm leading-relaxed pt-3"
                  style={{
                    color: "var(--muted2)",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-4 h-4" style={{ color: "#ff6a00" }} />
          <h2 className="text-sm font-semibold text-text-primary">
            Send a Message
          </h2>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(74,222,128,0.15)" }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: "#4ade80" }} />
            </div>
            <p className="text-base font-semibold text-text-primary">
              Message received!
            </p>
            <p
              className="text-sm text-center max-w-xs"
              style={{ color: "var(--muted2)" }}
            >
              Our team will get back to you within 4–8 hours. Check your
              registered contact for the reply.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage("");
                setSubject("");
              }}
              className="mt-2 text-xs hover:underline"
              style={{ color: "#ff8533" }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wide block mb-2"
                style={{ color: "var(--muted)" }}
              >
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. My release status hasn't updated"
                maxLength={120}
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

            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wide block mb-2"
                style={{ color: "var(--muted)" }}
              >
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={5}
                maxLength={1000}
                className="w-full rounded-xl px-4 py-3 text-sm placeholder:text-text-muted outline-none transition-all resize-none"
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
              <p
                className="text-xs text-right mt-1"
                style={{ color: "var(--muted)" }}
              >
                {message.length}/1000
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !message.trim() || !subject.trim()}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-3 px-6 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #ff6a00, #ff8533)",
                boxShadow: "var(--shadow-card), 0 0 15px rgba(255,106,0,0.25)",
                opacity: loading || !message.trim() || !subject.trim() ? 0.5 : 1,
                cursor:
                  loading || !message.trim() || !subject.trim()
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                if (!loading && message.trim() && subject.trim()) {
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
                  <div
                    className="w-4 h-4 rounded-full animate-spin"
                    style={{
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                    }}
                  />
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
