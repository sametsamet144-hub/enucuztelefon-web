"use client";

import { useState, useMemo } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Truck,
  CreditCard,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingDown,
  Filter,
} from "lucide-react";
import StoreLogo from "@/components/common/StoreLogo";
import { formatPrice, resolveStoreOfferUrl } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { StorePrice } from "@/types";

interface Props {
  storesPrices: StorePrice[];
  phoneName: string;
}

export default function StoreComparisonTable({ storesPrices, phoneName }: Props) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [filterMode, setFilterMode] = useState<"all" | "official" | "free_shipping">("all");

  // Sort by price ascending
  const sorted = useMemo(() => {
    return [...storesPrices].sort((a, b) => a.price - b.price);
  }, [storesPrices]);

  const lowestPrice = sorted[0]?.price || 0;
  const highestPrice = sorted[sorted.length - 1]?.price || lowestPrice;
  const maxSavings = highestPrice - lowestPrice;

  const filtered = useMemo(() => {
    if (filterMode === "official") {
      return sorted.filter((s) => s.isOfficial !== false);
    }
    if (filterMode === "free_shipping") {
      return sorted.filter(
        (s) =>
          !s.shippingText ||
          s.shippingText.toLowerCase().includes("ücretsiz") ||
          s.shippingText.toLowerCase().includes("prime")
      );
    }
    return sorted;
  }, [sorted, filterMode]);

  if (!storesPrices || storesPrices.length === 0) {
    return (
      <div
        className={`rounded-3xl border shadow-sm p-8 text-center transition-colors ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-100 mb-2">
          {phoneName} İçin Aktif Mağaza Teklifi Bulunamadı
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
          Bu model henüz Türkiye'deki yetkili e-ticaret mağazalarında satışa çıkmamış veya resmi distribütör stoğu tükenmiş olabilir. Fiyat takibi alarmı kurarak satışa çıktığı anda bildirim alabilirsiniz.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-all cursor-pointer">
          <Sparkles className="w-4 h-4" />
          <span>Fiyat Düşünce Haber Ver</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border shadow-sm overflow-hidden transition-colors ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/90"
      }`}
    >
      {/* Header & Akakçe-Style Savings Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-2 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Akakçe Standartlarında Canlı Fiyat Karşılaştırması</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {phoneName} En Ucuz Nerede Satılıyor?
            </h2>
            <p className="text-xs text-sky-200 mt-1">
              {storesPrices.length} yetkili ve güvenilir satıcının kargo, taksit, garanti ve anlık fiyat listesi
            </p>
          </div>

          {/* Savings Badge */}
          {maxSavings > 0 && (
            <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-4 text-center shrink-0 backdrop-blur-sm">
              <div className="text-[11px] text-emerald-300 font-semibold flex items-center justify-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Maksimum Tasarruf Potansiyeli
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5 price-display">
                {formatPrice(maxSavings)}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                En ucuz ile en pahalı satıcı arasındaki fark
              </div>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filtrele:
          </span>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === "all"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Tüm Satıcılar ({sorted.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("official")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === "official"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Resmi Distribütör Satıcıları
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("free_shipping")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === "free_shipping"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Ücretsiz Kargo
          </button>
        </div>
      </div>

      {/* Akakçe-Style Detailed Price Rows */}
      <div className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
        {filtered.map((item, index) => {
          const isCheapest = item.price === lowestPrice;
          const diff = item.price - lowestPrice;

          return (
            <div
              key={item.storeSlug + index}
              className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                isCheapest
                  ? isDark
                    ? "bg-emerald-950/35 border-l-4 border-l-emerald-500 hover:bg-emerald-950/50"
                    : "bg-emerald-50/60 border-l-4 border-l-emerald-500"
                  : isDark
                    ? "hover:bg-slate-800/50"
                    : "hover:bg-slate-50/80"
              }`}
            >
              {/* Left Column: Real Store Logo & Merchant Information */}
              <div className="flex items-start sm:items-center gap-4">
                {/* Real Store Logo Badge */}
                <div className="shrink-0">
                  <StoreLogo storeSlug={item.storeSlug} storeName={item.store} size="md" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-extrabold text-sm ${
                        isDark ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      {item.sellerName || item.store}
                    </span>
                    {item.sellerRating && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          isDark
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {item.sellerRating}/10
                      </span>
                    )}
                    {isCheapest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        EN UCUZ FİYAT
                      </span>
                    )}
                    {item.isOfficial !== false && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border text-[10px] font-bold px-2 py-0.5 ${
                          isDark
                            ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                            : "bg-sky-50 text-sky-700 border-sky-200"
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3 text-sky-500" />
                        Yetkili Satıcı
                      </span>
                    )}
                  </div>

                  {/* Metadata tags */}
                  <div
                    className={`flex items-center gap-3 text-[11px] mt-1.5 flex-wrap ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-sky-500" />
                      {item.shippingText || "Ücretsiz Kargo"}
                    </span>
                    <span className={isDark ? "text-slate-600" : "text-slate-300"}>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                      {item.installmentText || "Peşin Fiyatına 3 Taksit"}
                    </span>
                    <span className={isDark ? "text-slate-600" : "text-slate-300"}>•</span>
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        isDark ? "text-emerald-400" : "text-emerald-700"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {item.guaranteeText || "2 Yıl Resmi Türkiye Garantili"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Action Button */}
              <div
                className={`flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 ${
                  isDark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <div className="text-left lg:text-right">
                  <div
                    className={`text-xl sm:text-2xl font-black price-display tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {formatPrice(item.price)}
                  </div>
                  {diff > 0 ? (
                    <div className="text-[11px] text-rose-500 font-bold mt-0.5">
                      +{formatPrice(diff)} daha pahalı
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 font-extrabold mt-0.5 flex items-center lg:justify-end gap-1">
                      <Sparkles className="w-3 h-3" />
                      En avantajlı fiyat
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 flex items-center lg:justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Bugün teyit edildi</span>
                  </div>
                </div>

                <a
                  href={resolveStoreOfferUrl(item.storeSlug, phoneName, item.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-5 py-3 rounded-2xl font-black text-xs inline-flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    isCheapest
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25"
                      : isDark
                        ? "bg-slate-800 hover:bg-sky-600 text-white border border-slate-700"
                        : "bg-slate-900 hover:bg-sky-600 text-white shadow-slate-900/10"
                  }`}
                >
                  <span>Mağazaya Git</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Verification Disclaimer Footer */}
      <div
        className={`p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isDark
            ? "bg-slate-950/60 border-slate-800 text-slate-400"
            : "bg-slate-50 border-slate-100 text-slate-500"
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Fiyatlar 24 saat kesintisiz taranır ve kargo/taksit dahil net tutarlar listelenir.</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Son senkronizasyon: {new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
