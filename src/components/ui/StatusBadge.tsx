import type { ReleaseStatus } from "@/types";

const config: Record<
  ReleaseStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  "Pending Review": {
    label: "Pending Review",
    dot: "bg-status-pending animate-pulse-dot",
    bg: "bg-status-pending/10",
    text: "text-status-pending",
  },
  Approved: {
    label: "Approved",
    dot: "bg-status-approved",
    bg: "bg-status-approved/10",
    text: "text-status-approved",
  },
  Rejected: {
    label: "Rejected",
    dot: "bg-status-rejected",
    bg: "bg-status-rejected/10",
    text: "text-status-rejected",
  },
};

export function StatusBadge({ status }: { status: ReleaseStatus }) {
  const c = config[status] ?? config["Pending Review"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
