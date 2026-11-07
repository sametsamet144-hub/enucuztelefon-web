"use client";

import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Bildirimler"
      className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bg = "bg-slate-900/95 border-emerald-500/50 text-white";
        let iconColor = "text-emerald-400";

        if (toast.type === "warning") {
          Icon = AlertCircle;
          bg = "bg-slate-900/95 border-amber-500/50 text-white";
          iconColor = "text-amber-400";
        } else if (toast.type === "info") {
          Icon = Info;
          bg = "bg-slate-900/95 border-sky-500/50 text-white";
          iconColor = "text-sky-400";
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 duration-200 ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
}
