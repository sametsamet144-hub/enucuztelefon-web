"use client";

import { Scale, Heart, Bell, Share2, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Phone } from "@/types";

export default function PhoneDetailActions({ phone }: { phone: Phone }) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, openAlertModal, showToast } = useApp();

  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Sayfa bağlantısı panoya kopyalandı! 📋", "success");
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 w-full max-w-sm justify-center">
      <button
        type="button"
        onClick={() => addToCompare(phone)}
        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
          isComp
            ? "bg-slate-900 text-white border-slate-900 shadow"
            : "bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200"
        }`}
      >
        {isComp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Scale className="w-3.5 h-3.5" />}
        <span>{isComp ? "Kıyaslamada" : "Karşılaştır"}</span>
      </button>

      <button
        type="button"
        onClick={() => openAlertModal(phone)}
        className="px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
        title="Fiyat Alarmı Kur"
      >
        <Bell className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden sm:inline">Alarm Kur</span>
      </button>

      <button
        type="button"
        onClick={() => toggleFavorite(phone)}
        className={`p-2 rounded-xl border transition-colors ${
          isFav
            ? "bg-rose-50 text-rose-500 border-rose-200"
            : "bg-slate-50 text-slate-600 hover:text-rose-500 hover:bg-rose-50 border-slate-200"
        }`}
        title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      >
        <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="p-2 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
        title="Paylaş"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
