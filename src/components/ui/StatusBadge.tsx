import type { ReleaseStatus } from "@/types";

const config: Record<ReleaseStatus, { dot: string; bg: string; text: string }> = {
  "Pending Review": { dot: "bg-yellow-400 animate-pulse-dot", bg: "bg-yellow-400/10", text: "text-yellow-400" },
  "Approved":       { dot: "bg-green-400",                    bg: "bg-green-400/10",  text: "text-green-400"  },
  "Rejected":       { dot: "bg-red-400",                      bg: "bg-red-400/10",    text: "text-red-400"    },
};

export function StatusBadge({ status }: { status: ReleaseStatus }) {
  const c = config[status] ?? config["Pending Review"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
