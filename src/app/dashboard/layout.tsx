"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Upload, BarChart2, HeadphonesIcon, Music2, LogOut, Disc3 } from "lucide-react";

const NAV = [
  { href: "/dashboard/upload",    label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload",    label: "Upload",    icon: Upload           },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2        },
  { href: "/dashboard/support",   label: "Support",   icon: HeadphonesIcon   },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [artistName, setArtistName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("artist_name");
    if (!stored) { router.replace("/"); return; }
    setArtistName(stored);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("artist_name");
    router.push("/");
  };

  if (!artistName) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Disc3 className="w-8 h-8 text-accent-orange animate-spin" />
      </div>
    );
  }

  const initials = artistName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  // Active tab logic:
  // - "Upload" and "Dashboard" both point to /dashboard/upload
  // - Only "Upload" shows as active when on that page
  // - "Dashboard" never shows as active (it's just a home link)
  const isActive = (label: string, href: string) => {
    if (label === "Dashboard") return false;
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative">

      {/* Ambient orbs */}
      <div className="fixed w-[500px] h-[400px] rounded-full pointer-events-none z-0 animate-orb-float"
        style={{ background: "rgba(255,80,10,0.07)", filter: "blur(120px)", top: "-100px", left: "-150px" }} />
      <div className="fixed w-[400px] h-[350px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(179,136,255,0.04)", filter: "blur(100px)", bottom: "5%", right: "-100px" }} />

      {/* ── TOP NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16"
        style={{
          background: "rgba(26,18,8,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,235,190,0.08)",
          boxShadow: "0 4px 20px rgba(10,5,0,0.4)",
        }}>
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/dashboard/upload" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl btn-orange flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-2xl text-text-primary tracking-wider hidden sm:block">
              SPILRIX
            </span>
          </Link>

          {/* 4 nav tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl"
            style={{
              background: "var(--surface)",
              boxShadow: "inset 3px 3px 8px rgba(10,5,0,0.4), inset -2px -2px 6px rgba(255,235,190,0.03)",
            }}>
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(label, href);
              return (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap"
                  style={active ? {
                    background: "linear-gradient(135deg, #ff6a00, #ff8533)",
                    color: "white",
                    boxShadow: "0 0 12px rgba(255,106,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  } : {
                    color: "var(--muted2)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:block">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Artist + logout */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}>
              <div className="w-6 h-6 rounded-full btn-orange flex items-center justify-center text-white text-[9px] font-bold">
                {initials}
              </div>
              <span className="text-xs font-medium text-text-secondary max-w-[100px] truncate">
                {artistName}
              </span>
            </div>
            <button onClick={handleLogout} title="Switch artist"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--muted2)",
                boxShadow: "var(--shadow-card)",
              }}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 pt-16 relative z-10">
        {children}
      </main>
    </div>
  );
}
