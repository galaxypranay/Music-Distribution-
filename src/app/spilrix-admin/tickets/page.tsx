"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  RefreshCw,
  CheckCircle2,
  Clock,
  Disc3,
  SearchX,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SupportTicket } from "@/types";

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"All" | "Open" | "Resolved">("All");

  const fetchTickets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setTickets(data as SupportTicket[]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleResolve = async (ticket: SupportTicket) => {
    setResolvingId(ticket.id);
    const newStatus = ticket.status === "Resolved" ? "Open" : "Resolved";

    const { error } = await supabase
      .from("support_tickets")
      .update({ status: newStatus })
      .eq("id", ticket.id);

    if (!error) {
      setTickets((prev) =>
        prev.map((t) => t.id === ticket.id ? { ...t, status: newStatus } : t)
      );
    }
    setResolvingId(null);
  };

  const filtered = filterStatus === "All"
    ? tickets
    : tickets.filter((t) => t.status === filterStatus);

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
            Inbox
          </p>
          <h1 className="text-2xl font-extrabold text-text-primary">Support Tickets</h1>
          <p className="text-sm text-text-secondary mt-1">
            Messages sent by artists from the support page.
          </p>
        </div>
        <button
          onClick={() => fetchTickets(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 text-xs text-text-secondary border border-bg-border rounded-lg px-3 py-2
            hover:bg-bg-elevated hover:text-text-primary transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-violet/15 flex items-center justify-center">
            <Ticket className="w-4 h-4 text-accent-glow" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Total</p>
            <p className="text-xl font-bold text-text-primary">{tickets.length}</p>
          </div>
        </div>
        <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-status-pending/15 flex items-center justify-center">
            <Clock className="w-4 h-4 text-status-pending" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Open</p>
            <p className="text-xl font-bold text-text-primary">{openCount}</p>
          </div>
        </div>
        <div className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-status-approved/15 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-status-approved" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Resolved</p>
            <p className="text-xl font-bold text-text-primary">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(["All", "Open", "Resolved"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${filterStatus === s
                ? "bg-accent-violet/20 border-accent-violet/40 text-accent-glow"
                : "border-bg-border text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Disc3 className="w-8 h-8 text-accent-violet animate-spin" />
          <p className="text-sm text-text-muted">Loading tickets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <SearchX className="w-10 h-10 text-text-muted" />
          <p className="text-sm font-medium text-text-secondary">No tickets found</p>
          <p className="text-xs text-text-muted">Artists haven&apos;t sent any messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket, idx) => (
            <div
              key={ticket.id}
              className={`bg-bg-card border rounded-xl p-5 transition-all hover:bg-bg-elevated/50
                ${ticket.status === "Resolved"
                  ? "border-bg-border opacity-70"
                  : "border-bg-border hover:border-accent-violet/20"
                }`}
              style={{
                animation: "fade-up 0.3s ease-out forwards",
                animationDelay: `${idx * 0.04}s`,
                opacity: 0,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    {/* Artist */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-white text-[9px] font-bold">
                        {ticket.artist_name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-text-primary flex items-center gap-1">
                        <User className="w-3 h-3 text-text-muted" />
                        {ticket.artist_name}
                      </span>
                    </div>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full
                      ${ticket.status === "Open"
                        ? "bg-status-pending/15 text-status-pending"
                        : "bg-status-approved/15 text-status-approved"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === "Open" ? "bg-status-pending animate-pulse-dot" : "bg-status-approved"}`} />
                      {ticket.status}
                    </span>

                    {/* Date */}
                    <span className="flex items-center gap-1 text-[10px] text-text-muted ml-auto">
                      <Calendar className="w-3 h-3" />
                      {fmtDateTime(ticket.created_at)}
                    </span>
                  </div>

                  {/* Subject */}
                  <p className="text-sm font-semibold text-text-primary mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-accent-glow shrink-0" />
                    {ticket.subject}
                  </p>

                  {/* Message */}
                  <p className="text-sm text-text-secondary leading-relaxed bg-bg-elevated rounded-lg px-3 py-2.5 border border-bg-border">
                    {ticket.message}
                  </p>
                </div>

                {/* Resolve button */}
                <button
                  onClick={() => handleResolve(ticket)}
                  disabled={resolvingId === ticket.id}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border
                    ${ticket.status === "Resolved"
                      ? "bg-bg-elevated border-bg-border text-text-muted hover:border-status-pending/40 hover:text-status-pending"
                      : "bg-status-approved/15 border-status-approved/25 text-status-approved hover:bg-status-approved/25 hover:scale-105"
                    } disabled:opacity-50 active:scale-95`}
                >
                  {resolvingId === ticket.id ? (
                    <Disc3 className="w-3 h-3 animate-spin" />
                  ) : ticket.status === "Resolved" ? (
                    <><Clock className="w-3 h-3" />Reopen</>
                  ) : (
                    <><CheckCircle2 className="w-3 h-3" />Resolve</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
