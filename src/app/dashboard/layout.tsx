"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Upload, BarChart2, HeadphonesIcon, Music2, LogOut, Disc3, X } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("artist_name");
    if (!stored) { router.replace("/"); return; }
    setArtistName(stored);
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close sidebar on Escape key, lock body scroll while open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

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
          background: "var(--nav-bg, rgba(26,18,8,0.88))",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          borderBottom: "1px solid var(--glass-border, rgba(255,235,190,0.1))",
          boxShadow: "0 4px 20px rgba(10,5,0,0.4)",
        }}>
        <div className="max-w-6xl mx-auto h-full px-4 grid grid-cols-3 items-center gap-4">

          {/* Left: Hamburger */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex flex-col justify-center gap-[5px] w-11 h-11 rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-hover), 0 0 15px rgba(255,106,0,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "var(--border2, rgba(255,106,0,0.2))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <span className="block h-[2px] rounded-full mx-auto" style={{ width: "20px", background: "var(--muted2)" }} />
              <span className="block h-[2px] rounded-full mx-auto" style={{ width: "20px", background: "var(--muted2)" }} />
              <span className="block h-[2px] rounded-full mx-auto" style={{ width: "20px", background: "var(--muted2)" }} />
            </button>
          </div>

          {/* Center: Logo */}
          <Link href="/dashboard/upload" className="flex items-center justify-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #ff6a00, #ff8533)",
                boxShadow: "0 0 20px rgba(255,106,0,0.25), var(--shadow-card)",
              }}>
              <Music2 className="w-4 h-4 text-white relative z-10" />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(255,235,190,0.18) 0%, transparent 50%)" }} />
            </div>
            <span className="text-2xl text-text-primary tracking-wider hidden sm:block"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              SPIL<span style={{ color: "#ff6a00" }}>RIX</span>
            </span>
          </Link>

          {/* Right: Artist + logout */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                style={{
                  background: "linear-gradient(135deg, #ff6a00, #ff8533)",
                  boxShadow: "0 0 10px rgba(255,106,0,0.25)",
                }}>
                {initials}
              </div>
              <span className="text-xs font-medium text-text-secondary max-w-[100px] truncate">
                {artistName}
              </span>
            </div>
            <button onClick={handleLogout} title="Switch artist"
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--muted2)",
                boxShadow: "var(--shadow-card)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-hover), 0 0 15px rgba(255,106,0,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "var(--border2, rgba(255,106,0,0.2))";
                e.currentTarget.style.color = "#ff6a00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted2)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-pressed)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── SIDEBAR BACKDROP ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 z-[90]"
        style={{
          background: "var(--nav-backdrop, rgba(16,10,4,0.75))",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* ── SIDEBAR (left slide-in, full height) ── */}
      <aside
        className="fixed top-0 left-0 bottom-0 z-[100] w-[280px] max-w-[80vw] flex flex-col"
        style={{
          background: "var(--nav-bg, rgba(26,18,8,0.96))",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          borderRight: "1px solid var(--glass-border, rgba(255,235,190,0.1))",
          boxShadow: menuOpen ? "12px 0 40px rgba(10,5,0,0.5)" : "none",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-5 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #ff6a00, #ff8533)",
                boxShadow: "0 0 14px rgba(255,106,0,0.25)",
              }}>
              <Music2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg text-text-primary tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              MENU
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--muted2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ff6a00"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted2)"; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar nav links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(label, href);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium relative overflow-hidden"
                style={active ? {
                  background: "linear-gradient(135deg, #ff6a00, #ff8533)",
                  color: "white",
                  boxShadow: "0 0 12px rgba(255,106,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                } : {
                  color: "var(--muted2)",
                  background: "transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--text)";
                    e.currentTarget.style.background = "rgba(255,235,190,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--muted2)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {active && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(255,235,190,0.12) 0%, transparent 50%)" }} />
                )}
                <Icon className="w-4 h-4 shrink-0 relative z-10" />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar footer: artist info */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, #ff6a00, #ff8533)",
                boxShadow: "0 0 10px rgba(255,106,0,0.25)",
              }}>
              {initials}
            </div>
            <span className="text-sm font-medium text-text-secondary truncate">
              {artistName}
            </span>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--muted2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff6a00";
              e.currentTarget.style.borderColor = "var(--border2, rgba(255,106,0,0.2))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted2)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}>
            <LogOut className="w-3.5 h-3.5" />
            Switch artist
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-16 relative z-10">
        {children}
      </main>
    </div>
  );
}
