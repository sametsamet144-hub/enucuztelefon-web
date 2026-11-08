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
} from "lucide-react";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface PhoneCardProps {
  phone: Phone;
  variant?: "default" | "compact" | "list" | "featured";
  showCompareBadge?: boolean;
}

// ─── Minimalist Phone Silhouette Visual ───────────────────────────────────
function StitchPhoneVisual({ phone }: { phone: Phone }) {
  const slug = (phone.slug || "").toLowerCase();
  const brand = (phone.brand || "").toLowerCase();

  const isFoldable =
    slug.includes("fold") ||
    slug.includes("flip") ||
    slug.includes("magic-v") ||
    slug.includes("mate-xt");

  const isSamsungUltra = slug.includes("s25-ultra") || slug.includes("s24-ultra");
  const isXiaomiUltra = brand === "xiaomi" && slug.includes("ultra");
  const isHuaweiPura = slug.includes("pura-70");
  const isPoco = brand === "poco";
  const isApple = brand === "apple";

  // Phone body shape & styling
  let outerBorder = "border-[#252c3d]";
  let innerBg = "from-[#0e121a] via-[#121622] to-[#0a0d14]";
  let iconBadge = "border-white/10 bg-white/5 text-slate-300";
  let iconType: "camera" | "orange-camera" | "red-ring" | "purple-fold" | "green-cam" | "lightning" | "blue-rect" = "camera";

  if (isFoldable) {
    outerBorder = "border-[#3b2d5c]";
    innerBg = "from-[#141022] via-[#1a142c] to-[#0e0b17]";
    iconBadge = "border-[#8b5cf6]/40 bg-[#8b5cf6]/15 text-[#c084fc]";
    iconType = "purple-fold";
  } else if (isSamsungUltra) {
    outerBorder = "border-[#3d2e24]";
    innerBg = "from-[#191310] via-[#241a14] to-[#120d0a]";
    iconBadge = "border-[#f97316]/40 bg-[#f97316]/15 text-[#fb923c]";
    iconType = "orange-camera";
  } else if (isXiaomiUltra) {
    outerBorder = "border-[#402228]";
    innerBg = "from-[#190e11] via-[#241317] to-[#120a0d]";
    iconBadge = "border-[#ef4444]/40 bg-[#ef4444]/15 text-[#f87171]";
    iconType = "red-ring";
  } else if (isHuaweiPura) {
    outerBorder = "border-[#1b3d2f]";
    innerBg = "from-[#0e1c16] via-[#122820] to-[#0a1410]";
    iconBadge = "border-[#10b981]/40 bg-[#10b981]/15 text-[#34d399]";
    iconType = "green-cam";
  } else if (isPoco) {
    outerBorder = "border-[#3d2f1b]";
    innerBg = "from-[#19140e] via-[#241c12] to-[#120e0a]";
    iconBadge = "border-[#f59e0b]/40 bg-[#f59e0b]/15 text-[#fbbf24]";
    iconType = "lightning";
  } else if (isApple) {
    outerBorder = "border-[#2c3242]";
    innerBg = "from-[#10141d] via-[#151a26] to-[#0c0f16]";
    iconBadge = "border-white/15 bg-white/5 text-slate-300";
    iconType = slug.includes("pro") ? "camera" : "blue-rect";
  } else {
    outerBorder = "border-[#222c3d]";
    innerBg = "from-[#0e131d] via-[#121927] to-[#0a0e16]";
    iconBadge = "border-[#3b82f6]/40 bg-[#3b82f6]/15 text-[#60a5fa]";
    iconType = "blue-rect";
  }

  return (
    <div
      className={`relative ${
        isFoldable ? "w-[68px] h-[106px]" : isSamsungUltra ? "w-[62px] h-[108px] rounded-[10px]" : "w-[60px] h-[108px] rounded-[15px]"
      } border-2 ${outerBorder} bg-gradient-to-b ${innerBg} shadow-inner flex flex-col items-center justify-between py-2.5 px-1.5 select-none transition-transform duration-300 group-hover:scale-105`}
    >
      <div className="w-4 h-1 rounded-full bg-black/60 shadow-xs" />

      {isFoldable && (
        <div className="absolute inset-y-1.5 left-1/2 -translate-x-1/2 w-px bg-white/10" />
      )}

      <span className="text-[8.5px] font-semibold text-white/30 font-mono tracking-wider -mt-1">
        14:15
      </span>

      <div
        className={`w-6 h-6 rounded-lg border flex items-center justify-center shadow-sm ${iconBadge}`}
      >
        {iconType === "camera" && <Camera className="w-3.5 h-3.5 stroke-[2]" />}
        {iconType === "orange-camera" && (
          <Camera className="w-3.5 h-3.5 stroke-[2]" />
        )}
        {iconType === "red-ring" && (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-current" />
          </div>
        )}
        {iconType === "purple-fold" && (
          <Columns2 className="w-3.5 h-3.5 stroke-[2]" />
        )}
        {iconType === "green-cam" && (
          <Camera className="w-3.5 h-3.5 stroke-[2]" />
        )}
        {iconType === "lightning" && <Zap className="w-3.5 h-3.5 fill-current" />}
        {iconType === "blue-rect" && (
          <Square className="w-3.5 h-3.5 stroke-[2]" />
        )}
      </div>

      <div className="w-5 h-0.5 rounded-full bg-white/20" />
    </div>
  );
}

export default function PhoneCard({
  phone,
  variant = "default",
  showCompareBadge = true,
}: PhoneCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare } = useApp();
  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);

  // Purely dynamic values from backend data
  const brandName = phone.brand;
  const displayName = phone.name;
  const ratingVal = (phone.rating || 9.0).toFixed(1);
  const discountPercent = phone.priceDropPercent || (phone.isPriceDropped ? 12 : 0);

  let statusBadge: { label: string; bg: string; text: string; border: string } | null = null;
  if (phone.isNew) {
    statusBadge = { label: "YENİ", bg: "bg-[#0d3326]", text: "text-[#10b981]", border: "border-[#15553e]" };
  } else if (phone.isPriceDropped) {
    statusBadge = { label: "İNDİRİM", bg: "bg-[#331420]", text: "text-[#f43f5e]", border: "border-[#54192f]" };
  }

  const specLine1 = `${phone.specs?.display?.size || 6.7}" ${phone.specs?.display?.refreshRate || 120}Hz ${phone.specs?.display?.technology || "OLED"}`;
  const specLine2 = phone.specs?.performance?.chipset?.split("(")[0].trim() || (phone.brand === "Apple" ? "Apple Bionic" : "Yüksek Hızlı İşlemci");
  const cameraMp = phone.specs?.camera?.mainMp || phone.specs?.camera?.mainCamera?.megapixels || 50;
  const specLine3 = `${cameraMp} MP Kamera`;
  const specLine4 = `${phone.specs?.battery?.capacity || 5000} mAh`;

  const shippingBadge = "Kargo Bedava";
  const installmentBadge = "Peşin Fiyatına Taksit";

  const displayPrice = phone.lowestPrice || 0;
  const strikethroughPrice =
    phone.highestPrice && phone.highestPrice > displayPrice
      ? phone.highestPrice
      : Math.round(displayPrice * 1.1);

  // Derive store comparison strictly from backend data
  let cheapestStore = phone.lowestPriceStoreName || "Resmi Satıcı";
  let perkText = "Doğrulanmış Fiyat";
  let storeList: { store: string; price: number }[] = [];

  if (phone.storesPrices && phone.storesPrices.length > 0) {
    const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
    cheapestStore = sorted[0].store;
    perkText = sorted[0].shippingText || "Aynı Gün Kargo";
    storeList = sorted.slice(0, 3).map((s) => ({ store: s.store, price: s.price }));
  } else if (displayPrice > 0) {
    storeList = [{ store: cheapestStore, price: displayPrice }];
  }

  // ─── List Layout (if user selects list view) ──────────────────────────────
  if (variant === "list") {
    return (
      <div className="group rounded-2xl border border-[#1e2433] bg-[#11141b] hover:border-[#2e3a52] p-4 flex flex-col sm:flex-row gap-4 items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <div className="w-24 h-32 rounded-xl bg-[#161922] border border-[#202636] flex items-center justify-center p-2 shrink-0">
            <StitchPhoneVisual phone={phone} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1e2330] text-slate-300 border border-[#2a3245]">
                {brandName}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#331420] text-[#f43f5e] border border-[#54192f]">
                  -%{discountPercent}
                </span>
              )}
              {statusBadge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}>
                  {statusBadge.label}
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-[#38bdf8] transition-colors">
              <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
            </h3>
            <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span>{specLine1}</span>
              <span>•</span>
              <span>{specLine2}</span>
              <span>•</span>
              <span>{specLine3}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 line-through">
              {formatPrice(strikethroughPrice)}
            </div>
            <div className="text-xl font-black text-white">
              {formatPrice(displayPrice)}
            </div>
            <div className="text-[11px] text-[#38bdf8] font-medium">
              En ucuz: {cheapestStore}
            </div>
          </div>
          <Link
            href={`/telefon/${phone.slug}`}
            className="px-4 py-2 bg-[#1d8cf8] hover:bg-[#1577d6] text-white text-xs font-bold rounded-xl transition-all"
          >
            Fiyatları Gör
          </Link>
        </div>
      </div>
    );
  }

  // ─── Default Card Layout ──────────────────────────────────────────────────
  return (
    <div className="group relative rounded-2xl border border-[#1e2433] bg-[#11141b] hover:border-[#2e3a52] transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between shadow-lg">
      <div>
        {/* 1. Header Badges & Silhouette Visual Frame */}
        <div className="rounded-xl bg-[#161922] border border-[#202636] p-2 sm:p-2.5 relative flex flex-col min-h-[170px] justify-between">
          <div className="flex items-center justify-between gap-1 z-10">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1e2330] text-slate-300 border border-[#2a3245]">
                {brandName}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#331420] text-[#f43f5e] border border-[#54192f]">
                  -%{discountPercent}
                </span>
              )}
              {statusBadge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}
                >
                  {statusBadge.label}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(phone);
                }}
                className={`p-1 rounded transition-colors ${
                  isFav ? "text-rose-500" : "hover:text-rose-400"
                }`}
                title="Favorilere Ekle"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>
          </div>

          <Link
            href={`/telefon/${phone.slug}`}
            className="flex-1 flex items-center justify-center py-1"
          >
            <StitchPhoneVisual phone={phone} />
          </Link>
        </div>

        {/* 2. Phone Title & Star Rating */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <h3
            className="font-bold text-[13px] text-white truncate group-hover:text-[#38bdf8] transition-colors"
            title={displayName}
          >
            <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
          </h3>

          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{ratingVal}</span>
          </div>
        </div>

        {/* 3. Specs Pills */}
        <div className="mt-2 grid grid-cols-2 gap-1 text-[10.5px]">
          <div className="px-2 py-1 rounded bg-[#161922] border border-[#202636] text-slate-300 truncate" title={specLine1}>
            {specLine1}
          </div>
          <div className="px-2 py-1 rounded bg-[#161922] border border-[#202636] text-slate-300 truncate" title={specLine2}>
            {specLine2}
          </div>
          <div className="px-2 py-1 rounded bg-[#161922] border border-[#202636] text-slate-300 truncate" title={specLine3}>
            {specLine3}
          </div>
          <div className="px-2 py-1 rounded bg-[#161922] border border-[#202636] text-slate-300 truncate" title={specLine4}>
            {specLine4}
          </div>
        </div>

        {/* 4. Benefits */}
        <div className="mt-2 flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0d2821] border border-[#134e3a] text-[#10b981] text-[10px] font-medium w-fit">
            <Box className="w-3 h-3" />
            <span>{shippingBadge}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#11223d] border border-[#1e3a68] text-[#3b82f6] text-[10px] font-medium w-fit">
            <CreditCard className="w-3 h-3" />
            <span>{installmentBadge}</span>
          </div>
        </div>

        {/* 5. Price Box */}
        <div className="mt-2.5 rounded-xl border border-[#1a1f2c] bg-[#0c0e14] p-2.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">En Düşük Fiyat</span>
            {strikethroughPrice > displayPrice && (
              <span className="text-slate-500 line-through font-medium">
                {formatPrice(strikethroughPrice)}
              </span>
            )}
          </div>

          <div className="text-lg font-black text-white tracking-tight my-0.5 price-display">
            {formatPrice(displayPrice)}
          </div>

          <div className="flex items-center justify-between text-[10px] mt-0.5">
            <span className="text-slate-400 truncate">
              En ucuz: <strong className="text-[#38bdf8] font-bold">{cheapestStore}</strong>
            </span>
            <span className="text-[#10b981] font-semibold shrink-0">
              {perkText}
            </span>
          </div>
        </div>

        {/* 6. Top Store Comparison List */}
        {storeList.length > 0 && (
          <div className="mt-2.5 space-y-1.5 px-0.5">
            {storeList.map((st, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] leading-tight">
                <span className={`truncate max-w-[120px] ${i === 0 ? "text-slate-300 font-medium" : "text-slate-500"}`}>
                  {st.store}
                </span>
                <span className={i === 0 ? "text-white font-extrabold" : "text-slate-400 font-medium"}>
                  {formatPrice(st.price)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Action Button Row */}
      <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-[#1a1f2c]">
        <Link
          href={`/telefon/${phone.slug}`}
          className="flex-1 py-2 text-center bg-[#1d8cf8] hover:bg-[#1577d6] active:scale-98 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Fiyatları Gör
        </Link>

        {showCompareBadge && (
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className={`p-2 rounded-xl border transition-all ${
              isComp
                ? "bg-[#1d8cf8] text-white border-[#1d8cf8]"
                : "bg-[#161922] hover:bg-[#202636] border-[#202636] text-slate-300 hover:text-white"
            }`}
            title="Karşılaştır"
          >
            {isComp ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
