"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  BarChart2,
  HeadphonesIcon,
  Music2,
  LogOut,
  Disc3,
  ChevronRight,
} from "lucide-react";

const NAV = [
  {
    href: "/dashboard/upload",
    label: "Upload",
    icon: Upload,
    desc: "Submit a release",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart2,
    desc: "Track your releases",
  },
  {
    href: "/dashboard/support",
    label: "Support",
    icon: HeadphonesIcon,
    desc: "Get help",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [artistName, setArtistName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("artist_name");
    if (!stored) {
      router.replace("/");
    } else {
      setArtistName(stored);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("artist_name");
    router.push("/");
  };

  if (!artistName) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Disc3 className="w-8 h-8 text-accent-violet animate-spin" />
      </div>
    );
  }

  const initials = artistName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-bg-border bg-bg-card fixed h-full z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-bg-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center shadow-glow-sm">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-text-primary tracking-tight">
            Spilrix
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group
                  ${
                    active
                      ? "bg-accent-violet/15 text-text-primary shadow-glow-sm border border-accent-violet/20"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${active ? "text-accent-glow" : "text-text-muted group-hover:text-text-secondary"}`}
                />
                <div>
                  <p className="font-medium leading-tight">{label}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{desc}</p>
                </div>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-accent-violet/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Artist footer */}
        <div className="px-3 pb-4 border-t border-bg-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bg-elevated">
            <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-white text-xs font-bold shadow-glow-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {artistName}
              </p>
              <p className="text-[10px] text-text-muted">Artist</p>
            </div>
            <button
              onClick={handleLogout}
              title="Switch artist"
              className="text-text-muted hover:text-status-rejected transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-bg-card border-b border-bg-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-text-primary text-sm">Spilrix</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary p-1.5 rounded-lg hover:bg-bg-elevated"
        >
          <div className="space-y-1">
            <span
              className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-bg-base/90 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-14 left-0 right-0 bg-bg-card border-b border-bg-border p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all
                  ${pathname === href ? "bg-accent-violet/15 text-text-primary border border-accent-violet/20" : "text-text-secondary hover:bg-bg-elevated"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-bg-border mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-status-rejected hover:bg-bg-elevated w-full"
              >
                <LogOut className="w-4 h-4" />
                Switch Artist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen">
        <div className="pt-14 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
