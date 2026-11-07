"use client";

import Link from "next/link";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PhoneImage from "@/components/phone/PhoneImage";

export default function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare } = useApp();

  if (compareList.length === 0) return null;

  const compareUrl = `/karsilastir?${compareList
    .map((p, idx) => `phone${idx + 1}=${p.slug}`)
    .join("&")}`;

  return (
    <aside
      aria-label="Telefon Karşılaştırma Çubuğu"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-slate-900/95 text-white backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-3 sm:p-4 animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Selected Models */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1.5 rounded-lg border border-sky-800">
            <Scale className="w-3.5 h-3.5" />
            <span>{compareList.length}/4 Seçildi</span>
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((p) => (
              <div
                key={p.slug}
                className="relative group flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2 py-1 rounded-xl shrink-0"
              >
                <div className="w-7 h-7 bg-white/10 rounded-md p-0.5 flex items-center justify-center">
                  <PhoneImage src={p.image} alt={p.name} />
                </div>
                <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate">
                  {p.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCompare(p.slug)}
                  className="w-4 h-4 rounded-full bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-[10px]"
                  title="Kaldır"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-2 rounded-xl transition-colors inline-flex items-center gap-1"
            title="Tümünü Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Temizle</span>
          </button>

          <Link
            href={compareUrl}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
          >
            <span>Karşılaştır (VS)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
