"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Ticket, Music2, Shield, Users } from "lucide-react";

const NAV = [
  {
    href: "/spilrix-admin/artists",
    label: "Artists",
    icon: Users,
    desc: "Profiles & songs",
  },
  {
    href: "/spilrix-admin/tickets",
    label: "Support Tickets",
    icon: Ticket,
    desc: "Artist messages",
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-bg-border bg-bg-card fixed h-full z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-bg-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-orange-500 flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-text-primary tracking-tight text-sm block leading-tight">
              Spilrix
            </span>
            <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group
                  ${active
                    ? "bg-rose-500/15 text-text-primary border border-rose-500/20"
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-rose-400" : "text-text-muted group-hover:text-text-secondary"}`} />
                <div>
                  <p className="font-medium leading-tight">{label}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{desc}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom brand */}
        <div className="px-5 pb-5 border-t border-bg-border pt-4">
          <div className="flex items-center gap-2">
            <Music2 className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted">Spilrix Distribution</span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-bg-card border-b border-bg-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-600 to-orange-500 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-text-primary text-sm">Admin Panel</span>
        </div>
        <div className="flex gap-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${pathname.startsWith(href)
                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                  : "text-text-secondary hover:bg-bg-elevated"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
