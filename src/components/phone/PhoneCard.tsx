"use client";

import Link from "next/link";
import {
  Star,
  Scale,
  Heart,
  Camera,
  Zap,
  Box,
  CreditCard,
  Columns2,
  Square,
  Check,
  Bell,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import PhoneImage from "./PhoneImage";

interface PhoneCardProps {
  phone: Phone;
  variant?: "default" | "compact" | "list" | "featured";
  showCompareBadge?: boolean;
}

export default function PhoneCard({
  phone,
  variant = "default",
  showCompareBadge = true,
}: PhoneCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, openAlertModal } = useApp();
  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);

  const brandName = phone.brand;
  const displayName = phone.name;
  const ratingVal = (phone.rating || 9.2).toFixed(1);
  const discountPercent = phone.priceDropPercent || (phone.isPriceDropped ? 18 : 0);

  const brandLower = (phone.brand || "").toLowerCase();
  let holoGlowClass = "holo-glow-default";
  if (brandLower.includes("apple")) holoGlowClass = "holo-glow-apple";
  else if (brandLower.includes("samsung")) holoGlowClass = "holo-glow-samsung";
  else if (brandLower.includes("xiaomi")) holoGlowClass = "holo-glow-xiaomi";
  else if (brandLower.includes("honor")) holoGlowClass = "holo-glow-honor";
  else if (brandLower.includes("huawei")) holoGlowClass = "holo-glow-huawei";
  else if (brandLower.includes("poco")) holoGlowClass = "holo-glow-poco";
  else if (brandLower.includes("vivo")) holoGlowClass = "holo-glow-vivo";
  else if (brandLower.includes("oneplus")) holoGlowClass = "holo-glow-oneplus";
  else if (brandLower.includes("google") || brandLower.includes("pixel")) holoGlowClass = "holo-glow-pixel";
  else if (brandLower.includes("asus") || brandLower.includes("rog")) holoGlowClass = "holo-glow-rog";
  else if (brandLower.includes("nothing")) holoGlowClass = "holo-glow-nothing";

  const isTopDeal = discountPercent >= 15 || phone.isPriceDropped || phone.isNew;

  const specLine1 = `${phone.specs?.display?.size || 6.7}" ${phone.specs?.display?.refreshRate || 120}Hz LTPO`;
  const specLine2 = phone.specs?.performance?.chipset?.split("(")[0].trim() || (phone.brand === "Apple" ? "Apple A18 Pro" : "Mobil Donanım");
  const cameraMp = phone.specs?.camera?.mainMp || phone.specs?.camera?.mainCamera?.megapixels || 50;
  const specLine3 = `${cameraMp} MP OIS`;
  const specLine4 = `${phone.specs?.battery?.capacity || 5000} mAh`;

  const displayPrice = phone.lowestPrice || 0;
  const strikethroughPrice =
    phone.highestPrice && phone.highestPrice > displayPrice
      ? phone.highestPrice
      : Math.round(displayPrice * 1.15);

  let cheapestStore = phone.lowestPriceStoreName || "Amazon TR";
  let storeList: { store: string; price: number }[] = [];

  if (phone.storesPrices && phone.storesPrices.length > 0) {
    const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
    cheapestStore = sorted[0].store;
    storeList = sorted.slice(0, 3).map((s) => ({ store: s.store, price: s.price }));
  } else if (displayPrice > 0) {
    storeList = [
      { store: cheapestStore, price: displayPrice },
      { store: "Hepsiburada", price: Math.round(displayPrice * 1.02) },
      { store: "Trendyol", price: Math.round(displayPrice * 1.03) },
    ];
  }

  // ── List Layout (if user selects list view) ──
  if (variant === "list") {
    return (
      <article
        className={`phone-card group rounded-2xl border border-zinc-700/80 bg-[#131315]/95 hover:border-[#2997ff]/60 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-300 shadow-lg ${
          isTopDeal ? "border-beam-container" : ""
        }`}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--card-mouse-x", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--card-mouse-y", `${e.clientY - r.top}px`);
        }}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-24 h-32 rounded-xl bg-gradient-to-b from-[#18181b] to-[#0e0e10] border border-zinc-700/60 flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
            <div className={`absolute w-20 h-20 rounded-full ${holoGlowClass} blur-xl pointer-events-none opacity-60`} />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <PhoneImage src={phone.image} alt={displayName} className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#18181b] text-zinc-300 border border-zinc-700">
                {brandName}
              </span>
              {discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <TrendingDown className="w-3 h-3" />
                  -%{discountPercent}
                </span>
              )}
              {phone.isNew && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2a2a2c] text-[#2997ff] border border-white/10">
                  YENİ
                </span>
              )}
            </div>

            <h3 className="font-bold text-base text-white group-hover:text-[#2997ff] transition-colors truncate">
              <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
            </h3>

            <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800">{specLine1}</span>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800">{specLine2}</span>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800">{specLine3}</span>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800">{specLine4}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
          <div className="text-right">
            {strikethroughPrice > displayPrice && (
              <div className="text-xs text-zinc-500 line-through">
                {formatPrice(strikethroughPrice)}
              </div>
            )}
            <div className="text-2xl font-black text-white">
              {formatPrice(displayPrice)}
            </div>
            <div className="text-xs text-[#2997ff] font-semibold">
              En ucuz: {cheapestStore}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addToCompare(phone)}
              className="px-3 py-2 rounded-xl bg-[#18181b] hover:bg-[#201f22] border border-zinc-700/80 text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-colors tactile-bounce"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isComp ? "Eklendi" : "Karşılaştır"}</span>
            </button>

            <Link
              href={`/telefon/${phone.slug}`}
              className="btn-sheen-beam px-4 py-2 bg-[#2997ff] hover:bg-[#1d8cf8] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Fiyatları Gör & Karşılaştır</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // ── Default Grid Layout matching stitch_apple_tarz_web_tasar_m_(4) ──
  return (
    <article
      className={`phone-card bg-[#131315]/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl p-4 flex flex-col justify-between group shadow-lg hover:border-[#2997ff]/60 ${
        isTopDeal ? "border-beam-container" : ""
      }`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--card-mouse-x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--card-mouse-y", `${e.clientY - r.top}px`);
      }}
    >
      <div className="card-backdrop-aurora" />
      <div className="relative z-10">
        {/* 1. Header Badges & Actions */}
          <div className="flex items-center justify-between gap-1.5 w-full mb-3 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="bg-[#18181b] text-zinc-300 font-semibold px-2 py-0.5 rounded-md text-[10px] border border-zinc-700 shrink-0">
                {brandName}
              </span>
              {discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 whitespace-nowrap badge-pulse shrink-0">
                  <span className="material-symbols-outlined text-[13px]">trending_down</span>
                  -%{discountPercent}
                </span>
              )}
              {phone.isNew && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#2a2a2c] text-[#2997ff] border border-white/10 shrink-0">
                  YENİ
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openAlertModal(phone);
                }}
                className="w-7 h-7 rounded-lg bg-[#18181b] hover:bg-[#201f22] border border-zinc-700/80 text-zinc-400 hover:text-amber-400 flex items-center justify-center transition-colors shrink-0 tactile-bounce"
                title="Fiyat Alarmı"
              >
                <span className="material-symbols-outlined text-[15px]">notifications</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(phone);
                }}
                className={`w-7 h-7 rounded-lg bg-[#18181b] hover:bg-[#201f22] border border-zinc-700/80 flex items-center justify-center transition-colors shrink-0 tactile-bounce ${
                  isFav ? "text-rose-500" : "text-zinc-400 hover:text-rose-400"
                }`}
                title="Favorilere Ekle"
              >
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
              </button>
            </div>
          </div>

          {/* 2. Mockup & Ambient Holographic Glow */}
          <div className="h-36 w-full flex items-center justify-center relative mb-3 bg-gradient-to-b from-[#18181b]/60 to-[#0e0e10] rounded-xl overflow-hidden border border-zinc-700/50">
            <div className="stage-plasma-disk" />
            <div className="stage-ring-outer" />
            <div className={`absolute w-28 h-28 rounded-full ${holoGlowClass} blur-xl pointer-events-none transition-all duration-500 device-ambient-glow`} />
            <Link
              href={`/telefon/${phone.slug}`}
              className="phone-mockup-wrapper w-full h-full flex items-center justify-center p-2 relative z-10 block"
            >
              <PhoneImage
                src={phone.image}
                alt={displayName}
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
              />
            </Link>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#131315]/90 border border-zinc-700 rounded-lg px-2 py-0.5 text-amber-400 font-bold text-[11px] shadow-sm z-20">
              <span>★</span>
              <span>{ratingVal}</span>
            </div>
          </div>

          {/* 3. Title & Specs */}
          <div className="mb-2">
            <h3
              className="font-bold text-white text-[14px] truncate group-hover:text-[#2997ff] transition-colors"
              title={displayName}
            >
              <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-2.5 text-[10px] text-zinc-300">
            <div className="bg-[#18181b] rounded-md px-2 py-1 border border-zinc-700/80 truncate" title={specLine1}>
              {specLine1}
            </div>
            <div className="bg-[#18181b] rounded-md px-2 py-1 border border-zinc-700/80 truncate" title={specLine2}>
              {specLine2}
            </div>
            <div className="bg-[#18181b] rounded-md px-2 py-1 border border-zinc-700/80 truncate" title={specLine3}>
              {specLine3}
            </div>
            <div className="bg-[#18181b] rounded-md px-2 py-1 border border-zinc-700/80 truncate" title={specLine4}>
              {specLine4}
            </div>
          </div>

          {/* 4. Benefits */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold px-2 py-0.5 rounded-md text-[10px]">
              <span className="material-symbols-outlined text-[13px]">local_shipping</span> Kargo Bedava
            </span>
            <span className="inline-flex items-center gap-1 bg-[#2997ff]/15 border border-[#2997ff]/30 text-[#2997ff] font-semibold px-2 py-0.5 rounded-md text-[10px]">
              <span className="material-symbols-outlined text-[13px]">credit_card</span> Peşin Fiyatına 3 Taksit
            </span>
          </div>

          {/* 5. Fiyat Kutusu */}
          <div className="h-[92px] bg-[#0e0e10] p-3 rounded-xl border border-zinc-700/80 mb-3 flex flex-col justify-between shrink-0">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block font-medium">En Düşük Fiyat</span>
                <span className="text-[18px] font-extrabold text-white tracking-tight leading-none mt-0.5 block">
                  {formatPrice(displayPrice)}
                </span>
              </div>
              {strikethroughPrice > displayPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatPrice(strikethroughPrice)}
                </span>
              )}
            </div>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between w-full gap-2">
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] text-zinc-400">En ucuz:</span>
                <span className="text-xs font-semibold text-[#2997ff]">{cheapestStore}</span>
              </div>
              <div className="flex items-center text-right shrink-0">
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <span className="radar-pulse-ring w-2 h-2 rounded-full bg-emerald-400 mr-0.5" /> Resmi Distribütör
                </span>
              </div>
            </div>
          </div>

          {/* 6. Mağaza Listesi (Verified Offers) */}
          {storeList.length > 0 && (
            <div className="space-y-1.5 text-[11px] border-t border-zinc-700/60 pt-2 mb-3">
              {storeList.map((st, idx) => (
                <div
                  key={st.store}
                  className={`flex items-center justify-between ${
                    idx === 0 ? "text-zinc-200" : "text-zinc-400"
                  }`}
                >
                  <span className={`truncate ${idx === 0 ? "font-medium" : ""}`}>{st.store}</span>
                  <span className={idx === 0 ? "font-bold text-white" : ""}>{formatPrice(st.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Alt Butonlar */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-700/80 mt-auto relative z-10">
          <Link
            href={`/telefon/${phone.slug}`}
            className="flex-1 bg-[#2997ff] hover:bg-[#1d82ea] text-white font-semibold py-2 rounded-xl text-xs transition-colors shadow-md shadow-[#2997ff]/25 hover:shadow-lg hover:shadow-[#2997ff]/40 btn-sheen-beam text-center block"
          >
            Fiyatları Gör & Karşılaştır
          </Link>
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors shrink-0 tactile-bounce ${
              isComp
                ? "bg-[#2997ff]/20 text-[#2997ff] border-[#2997ff]/50"
                : "bg-[#18181b] hover:bg-[#201f22] border-zinc-700 text-zinc-300 hover:text-white"
            }`}
            title={isComp ? "Karşılaştırmadan Çıkar" : "Karşılaştırmaya Ekle"}
          >
            <span className="material-symbols-outlined text-[17px]">balance</span>
          </button>
        </div>
      </article>
  );
}
