import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0A0A0F",
          card: "#111118",
          elevated: "#16161F",
          border: "#1E1E2A",
        },
        accent: {
          violet: "#7C3AED",
          indigo: "#4F46E5",
          glow: "#9D71F5",
        },
        status: {
          pending: "#F59E0B",
          approved: "#10B981",
          rejected: "#EF4444",
        },
        text: {
          primary: "#F0EEFF",
          secondary: "#8B8BAD",
          muted: "#4A4A6A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
        "gradient-glow": "radial-gradient(ellipse at top, #7C3AED22 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-violet": "0 0 24px rgba(124, 58, 237, 0.35)",
        "glow-sm": "0 0 12px rgba(124, 58, 237, 0.2)",
        card: "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
      },
      keyframes: {
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "wave-1": "wave-bar 1s ease-in-out infinite 0s",
        "wave-2": "wave-bar 1s ease-in-out infinite 0.15s",
        "wave-3": "wave-bar 1s ease-in-out infinite 0.3s",
        "wave-4": "wave-bar 1s ease-in-out infinite 0.45s",
        "wave-5": "wave-bar 1s ease-in-out infinite 0.6s",
        "fade-up": "fade-up 0.4s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
        "toast-in": "toast-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
