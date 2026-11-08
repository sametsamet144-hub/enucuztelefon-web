"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Share2,
  User,
  TrendingDown,
  TrendingUp,
  LayoutList,
  Smartphone,
  Monitor,
  Check,
} from "lucide-react";
import PhoneImage from "./PhoneImage";
import StoreComparisonTable from "./StoreComparisonTable";
import { formatPrice } from "@/lib/utils";
import type { Phone } from "@/types";

interface Props {
  phone: Phone;
}

export default function PhoneInteractiveShowcase({ phone }: Props) {
  const currentPrice = phone.lowestPrice || 0;
  const listPrice =
    phone.highestPrice && phone.highestPrice > currentPrice
      ? phone.highestPrice
      : 0;
  const savingsAmount = listPrice > currentPrice ? listPrice - currentPrice : 0;
  const discountPct =
    phone.priceDropPercent ||
    (listPrice > currentPrice
      ? Math.round((savingsAmount / listPrice) * 100)
      : 0);

  const storages = [
    {
      label: phone.specs?.performance?.storage
        ? `${phone.specs.performance.storage}GB`
        : "Standart",
      available: true,
    },
  ];

  const [selectedStorage, setSelectedStorage] = useState(storages[0].label);
  const [activeMobileTab, setActiveMobileTab] = useState<"stores" | "chart">("stores");
  const [forceMobilePreview, setForceMobilePreview] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Colors from specs
  const colors =
    phone.specs?.design?.colors && phone.specs.design.colors.length > 0
      ? phone.specs.design.colors.map((c) => ({
          name: c.toUpperCase(),
          hex: "#64748b",
        }))
      : [{ name: "STANDART", hex: "#1C1C1E" }];
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const shortChipset =
    phone.specs?.performance?.chipset
      ?.replace(/Apple\s+/i, "")
      ?.replace(/Qualcomm\s+Snapdragon\s+/i, "Snapdragon ")
      ?.split("(")[0]
      ?.trim() || phone.brand;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator
          .share({
            title: `${phone.name} En Ucuz Fiyat & Mağaza Telemetrisi`,
            url: window.location.href,
          })
          .catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    }
  };

  return (
    <div
      className={`mx-auto px-3.5 sm:px-4 pt-3 pb-6 transition-all duration-300 ${
        forceMobilePreview ? "max-w-[430px]" : "max-w-7xl"
      }`}
    >
      {/* ─── 1. TOP APP NAVIGATION BAR (Matches `< Telefon Detay` Stitch Header) ─── */}
      <div className="flex items-center justify-between py-2.5 mb-3">
        <Link
          href="/telefonlar"
          className="inline-flex items-center gap-2 text-white hover:text-sky-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
          <span className="text-sm sm:text-base font-extrabold tracking-tight">
            Telefon Detay
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Desktop Viewport Preview Switcher (Allows testing Mobile Stitch frame on Desktop) */}
          <div className="hidden lg:flex items-center bg-[#12161f] border border-white/10 rounded-xl p-1 mr-2">
            <button
              type="button"
              onClick={() => setForceMobilePreview(true)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                forceMobilePreview
                  ? "bg-[#2b8cff] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobil Tasarım</span>
            </button>
            <button
              type="button"
              onClick={() => setForceMobilePreview(false)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                !forceMobilePreview
                  ? "bg-[#2b8cff] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Geniş Ekran</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            title="Sayfayı Paylaş"
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          <Link
            href="/fiyat-takibi"
            title="Fiyat Alarmlarım"
            className="w-8 h-8 rounded-full bg-indigo-400/20 border border-indigo-400/40 flex items-center justify-center text-indigo-200 hover:bg-indigo-400/30 transition-colors"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ─── 2. HERO PHONE SUMMARY CARD (Matches Top Card of 7f90792fdee54b80a7c5ec745acc8f40) ─── */}
      <div className="relative rounded-[28px] overflow-hidden bg-[#12161f] border border-white/[0.08] p-4 sm:p-6 shadow-2xl mb-4">
        {/* Ambient Emerald Glow at bottom-left */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status Pills Row */}
        <div className="relative flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3 py-1.5 text-[11px] font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="leading-tight">
              10 Doğrulanmış Satıcı • Canlı Telemetri
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const curIdx = storages.findIndex((s) => s.label === selectedStorage);
              const nextIdx = (curIdx + 1) % storages.length;
              setSelectedStorage(storages[nextIdx].label);
            }}
            title="Depolama kapasitesini değiştirmek için dokunun"
            className="inline-flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-2xl px-3 py-1.5 text-[11px] font-extrabold text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <span>
              {shortChipset} • {selectedStorage}
            </span>
          </button>
        </div>

        {/* Middle Phone Identity Row */}
        <div className="relative flex items-center gap-4 mb-4">
          {/* Circular Dark Phone Pedestal */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#090c12] border border-white/10 p-3 flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              <PhoneImage src={phone.image} alt={phone.name} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() =>
                setSelectedColorIdx((prev) => (prev + 1) % colors.length)
              }
              className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors block text-left cursor-pointer"
            >
              {colors[selectedColorIdx].name}
            </button>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight mt-0.5 truncate">
              {phone.name}
            </h1>

            <p className="text-xs text-slate-400 mt-1 truncate">
              {phone.brand} Türkiye Garantili •{" "}
              {phone.specs?.display?.size || 6.3} inç{" "}
              {phone.specs?.display?.technology || "LTPO OLED"}
            </p>

            {/* Quick Storage Pills on Tablet/Desktop */}
            <div className="hidden sm:flex items-center gap-1.5 mt-2.5">
              {storages.map((st) => (
                <button
                  key={st.label}
                  type="button"
                  onClick={() => setSelectedStorage(st.label)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border transition-all cursor-pointer ${
                    selectedStorage === st.label
                      ? "bg-[#2b8cff] text-white border-blue-400 shadow"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Lowest Market Price Box */}
        <div className="relative bg-gradient-to-r from-[#0f1f1c] via-[#0e151f] to-[#0d111a] border border-emerald-500/20 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              PİYASADAKİ EN DÜŞÜK FİYAT
            </div>
            <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight price-display">
                {currentPrice > 0 ? formatPrice(currentPrice) : "Fiyat Belirtilmemiş"}
              </span>
              {listPrice > currentPrice && (
                <span className="text-xs text-slate-500 line-through font-semibold price-display">
                  {formatPrice(listPrice)}
                </span>
              )}
            </div>
          </div>

          {discountPct > 0 && (
            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl px-2.5 py-1 text-[10px] sm:text-[11px] font-black">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>%{discountPct} İndirim</span>
              </div>
              {savingsAmount > 0 && (
                <div className="text-[11px] font-bold text-slate-300 mt-1">
                  {formatPrice(savingsAmount)} Tasarruf
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. SEGMENTED TAB SWITCHER BAR (`10 Satıcı Listesi` | `Fiyat Grafiği & Alarm`) ─── */}
      <div className="bg-[#12161f] border border-white/[0.08] rounded-2xl p-1.5 grid grid-cols-2 gap-1.5 mb-5 shadow-lg">
        <button
          type="button"
          onClick={() => {
            setActiveMobileTab("stores");
            const el = document.getElementById("tum-magazalar");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMobileTab === "stores"
              ? "bg-white text-slate-950 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <LayoutList className="w-4 h-4 shrink-0" />
          <span>10 Satıcı Listesi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMobileTab("chart");
            const el = document.getElementById("fiyat-telemetri-alarm");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMobileTab === "chart"
              ? "bg-white text-slate-950 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span className="leading-tight">Fiyat Grafiği &amp; Alarm</span>
        </button>
      </div>

      {/* ─── 4. UNIFIED STORE TELEMETRY, 10 STORES LIST, ACCESSORY & SMART ALARM ─── */}
      <StoreComparisonTable
        storesPrices={phone.storesPrices || []}
        phoneName={phone.name}
        phone={phone}
        selectedStorage={selectedStorage}
        storageOffset={0}
        activeMobileTab={activeMobileTab}
      />
    </div>
  );
}
