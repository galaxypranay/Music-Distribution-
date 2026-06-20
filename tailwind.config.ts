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
          base:     "#1a1208",
          card:     "#221a0c",
          elevated: "#2a1e10",
          border:   "#342818",
          light:    "#3e3020",
        },
        accent: {
          orange:  "#ff6a00",
          orange2: "#ff8533",
          orange3: "#ffaa66",
          glow:    "rgba(255,106,0,0.25)",
          cyan:    "#00e5ff",
          purple:  "#b388ff",
        },
        status: {
          pending:  "#F59E0B",
          approved: "#4ade80",
          rejected: "#f87171",
        },
        text: {
          primary:   "#f0ece6",
          secondary: "#c8c2ba",
          muted:     "#6a6460",
          muted2:    "#9a928c",
        },
      },
      fontFamily: {
        sans:    ["DM Sans", "system-ui", "sans-serif"],
        display: ["Bebas Neue", "sans-serif"],
      },
      boxShadow: {
        raised:  "8px 8px 16px rgba(10,5,0,0.55), -4px -4px 12px rgba(255,235,190,0.04), inset 0 1px 0 rgba(255,235,190,0.06)",
        card:    "6px 6px 14px rgba(10,5,0,0.45), -3px -3px 10px rgba(255,235,190,0.03), inset 0 1px 0 rgba(255,235,190,0.05)",
        hover:   "10px 10px 24px rgba(10,5,0,0.55), -4px -4px 14px rgba(255,235,190,0.04), 0 0 30px rgba(255,106,0,0.25)",
        neon:    "0 0 15px rgba(255,106,0,0.25), 0 0 30px rgba(255,106,0,0.15), 0 0 60px rgba(255,106,0,0.08)",
        pressed: "inset 4px 4px 8px rgba(10,5,0,0.4), inset -2px -2px 6px rgba(255,235,190,0.03)",
        "glow-orange": "0 0 20px rgba(255,106,0,0.4)",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%":   { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "toast-in": {
          "0%":   { opacity: "0", transform: "translateY(20px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%":      { transform: "scaleY(1)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.3" },
        },
        "orb-float": {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":      { transform: "translateY(-20px) scale(1.05)" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.5s ease-out forwards",
        "slide-in":   "slide-in 0.3s ease-out forwards",
        "toast-in":   "toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "wave-1":     "wave-bar 1s ease-in-out infinite 0s",
        "wave-2":     "wave-bar 1s ease-in-out infinite 0.15s",
        "wave-3":     "wave-bar 1s ease-in-out infinite 0.3s",
        "wave-4":     "wave-bar 1s ease-in-out infinite 0.45s",
        "wave-5":     "wave-bar 1s ease-in-out infinite 0.6s",
        "pulse-dot":  "pulse-dot 2s ease-in-out infinite",
        "orb-float":  "orb-float 8s ease-in-out infinite",
        "spin-slow":  "spin-slow 12s linear infinite",
      },
      backgroundImage: {
        "gradient-orange": "linear-gradient(135deg, #ff6a00 0%, #ff8533 100%)",
        "gradient-warm":   "linear-gradient(135deg, #ff6a00 0%, #b388ff 100%)",
        "glass":           "linear-gradient(135deg, rgba(255,235,190,0.08) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
