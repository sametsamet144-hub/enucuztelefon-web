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

  const isTopDeal = discountPercent >= 15 || phone.isPriceDropped || phone.isNew;

  const specLine1 = `${phone.specs?.display?.size || 6.7}" ${phone.specs?.display?.refreshRate || 120}Hz`;
  const specLine2 = phone.specs?.performance?.chipset?.split("(")[0].trim() || (phone.brand === "Apple" ? "Apple Bionic" : "Mobil İşlemci");
  const cameraMp = phone.specs?.camera?.mainMp || phone.specs?.camera?.mainCamera?.megapixels || 50;
  const specLine3 = `${cameraMp} MP OIS`;
  const specLine4 = `${phone.specs?.battery?.capacity || 5000} mAh`;

  const displayPrice = phone.lowestPrice || 0;
  const strikethroughPrice =
    phone.highestPrice && phone.highestPrice > displayPrice
      ? phone.highestPrice
      : Math.round(displayPrice * 1.15);

  let cheapestStore = phone.lowestPriceStoreName || "Doğrulanmış Satıcı";
  let storeList: { store: string; price: number }[] = [];

  if (phone.storesPrices && phone.storesPrices.length > 0) {
    const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
    cheapestStore = sorted[0].store;
    storeList = sorted.slice(0, 3).map((s) => ({ store: s.store, price: s.price }));
  } else if (displayPrice > 0) {
    storeList = [{ store: cheapestStore, price: displayPrice }];
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
              <span>Fiyatları Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // ── Default Grid Layout ──
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
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
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
          <Link
            href={`/telefon/${phone.slug}`}
            className="h-36 w-full flex items-center justify-center relative mb-3 bg-gradient-to-b from-[#18181b]/60 to-[#0e0e10] rounded-xl overflow-hidden border border-zinc-700/50 block group/img"
          >
            <div className={`absolute w-28 h-28 rounded-full ${holoGlowClass} blur-xl pointer-events-none transition-all duration-500 device-ambient-glow`} />
            <div className="phone-mockup-wrapper relative z-10 w-full h-full flex items-center justify-center p-2">
              <PhoneImage
                src={phone.image}
                alt={displayName}
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
              />
            </div>
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#131315]/85 backdrop-blur-md text-white text-[11px] border border-zinc-700/50 shadow-sm z-20">
              <span className="material-symbols-outlined text-[12px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="font-bold">{ratingVal}</span>
            </div>
          </Link>

          {/* 3. Title & Specs */}
          <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#2997ff] transition-colors">
            <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
          </h3>

          <div className="mt-2 grid grid-cols-2 gap-1 text-[10.5px]">
            <div className="px-2 py-1 rounded bg-[#18181b] border border-zinc-700/60 text-zinc-300 truncate" title={specLine1}>
              {specLine1}
            </div>
            <div className="px-2 py-1 rounded bg-[#18181b] border border-zinc-700/60 text-zinc-300 truncate" title={specLine2}>
              {specLine2}
            </div>
            <div className="px-2 py-1 rounded bg-[#18181b] border border-zinc-700/60 text-zinc-300 truncate" title={specLine3}>
              {specLine3}
            </div>
            <div className="px-2 py-1 rounded bg-[#18181b] border border-zinc-700/60 text-zinc-300 truncate" title={specLine4}>
              {specLine4}
            </div>
          </div>

          {/* 4. Benefits */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
              <span className="material-symbols-outlined text-[12px]">local_shipping</span> Kargo Bedava
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-medium">
              <span className="material-symbols-outlined text-[12px]">credit_card</span> Peşin Taksit
            </span>
          </div>

          {/* 5. Fiyat Kutusu */}
          <div className="mt-2.5 p-2.5 rounded-xl bg-[#0e0e10] border border-zinc-800">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span>En Düşük Fiyat</span>
              {strikethroughPrice > displayPrice && (
                <span className="line-through">{formatPrice(strikethroughPrice)}</span>
              )}
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-lg font-black text-white">{formatPrice(displayPrice)}</span>
              <span className="text-[11px] text-[#2997ff] font-semibold">{cheapestStore}</span>
            </div>
          </div>

          {/* 6. Mağaza Listesi (Verified Offers) */}
          {storeList.length > 0 && (
            <div className="mt-2 space-y-1">
              {storeList.map((st) => (
                <div
                  key={st.store}
                  className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg bg-[#18181b]/70 border border-zinc-800/80"
                >
                  <span className="text-zinc-300 font-medium truncate">{st.store}</span>
                  <span className="font-bold text-white shrink-0">{formatPrice(st.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Alt Butonlar */}
        <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-zinc-800/60">
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className={`w-1/2 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors tactile-bounce ${
              isComp
                ? "bg-[#2997ff]/20 text-[#2997ff] border-[#2997ff]/50"
                : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">balance</span>
            <span>{isComp ? "Listede" : "Karşılaştır"}</span>
          </button>
          <Link
            href={`/telefon/${phone.slug}`}
            className="w-1/2 py-2 rounded-xl bg-[#2997ff] hover:bg-[#1d8cf8] text-white text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md btn-sheen-beam"
          >
            <span>Fiyatları Gör</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
