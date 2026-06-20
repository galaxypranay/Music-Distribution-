"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import type { ToastState } from "@/types";

interface ToastProps extends ToastState {
  onClose: () => void;
}

const icons = {
  success: <CheckCircle2 className="w-4 h-4 text-status-approved shrink-0" />,
  error: <XCircle className="w-4 h-4 text-status-rejected shrink-0" />,
  info: <Info className="w-4 h-4 text-accent-glow shrink-0" />,
};

const borders = {
  success: "border-status-approved/30",
  error: "border-status-rejected/30",
  info: "border-accent-violet/30",
};

export function Toast({ message, type, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast-in">
      <div
        className={`flex items-center gap-3 bg-bg-elevated border ${borders[type]} rounded-xl px-4 py-3 shadow-card max-w-xs`}
      >
        {icons[type]}
        <span className="text-sm text-text-primary font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
