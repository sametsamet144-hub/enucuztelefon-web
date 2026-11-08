"use client";

import Link from "next/link";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import PhoneImage from "./PhoneImage";

interface MobilePhoneCardProps {
  phone: Phone;
  index?: number;
}

function getPhoneBadge(phone: Phone, index: number): { text: string; colorClass: string; dotColor: string } {
  const name = phone.name.toLowerCase();
  const brand = phone.brand.toLowerCase();

  if (name.includes("fold") || name.includes("flip") || name.includes("magic v")) {
    return { text: "KATLANIR", colorClass: "text-[#47e266]", dotColor: "bg-[#47e266]" };
  }
  if (brand === "xiaomi" && (name.includes("ultra") || name.includes("14") || name.includes("15"))) {
    return { text: "LEICA", colorClass: "text-[#ff2d55]", dotColor: "bg-[#ff2d55]" };
  }
  if (brand === "vivo" && (name.includes("x100") || name.includes("x200") || name.includes("pro"))) {
    return { text: "ZEISS", colorClass: "text-[#2997ff]", dotColor: "bg-[#2997ff]" };
  }
  if (name.includes("s24") || name.includes("s25") || name.includes("pixel")) {
    return { text: "AI DESTEKLİ", colorClass: "text-[#2997ff]", dotColor: "bg-[#2997ff]" };
  }
  if (phone.isNew || name.includes("16")) {
    return { text: "YENİ", colorClass: "text-[#2997ff]", dotColor: "bg-[#2997ff]" };
  }
  if (phone.lowestPrice > 0 && phone.lowestPrice < 35000 && (phone.rating || 0) >= 9.0) {
    return { text: "F/P KRALI", colorClass: "text-[#47e266]", dotColor: "bg-[#47e266]" };
  }
  if ((phone.rating || 0) >= 9.6 || index === 1) {
    return { text: "ÇOK SATAN", colorClass: "text-[#47e266]", dotColor: "bg-[#47e266]" };
  }
  return { text: "POPÜLER", colorClass: "text-[#47e266]", dotColor: "bg-[#47e266]" };
}

export default function MobilePhoneCard({ phone, index = 0 }: MobilePhoneCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, openAlertModal } = useApp();
  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);

  const brandName = phone.brand;
  const displayName = phone.name;
  const ratingVal = (phone.rating || 9.4).toFixed(1);
  const discountPercent = phone.priceDropPercent || (phone.isPriceDropped ? 18 : 0);

  const displayPrice = phone.lowestPrice || 0;
  const strikethroughPrice =
    phone.highestPrice && phone.highestPrice > displayPrice
      ? phone.highestPrice
      : Math.round(displayPrice * 1.15);

  let cheapestStore = phone.lowestPriceStoreName || "Amazon TR";
  let secondStoreText = "";

  if (phone.storesPrices && phone.storesPrices.length > 1) {
    const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
    cheapestStore = sorted[0].store;
    const second = sorted[1];
    const moreCount = Math.max(0, (phone.storesCount || sorted.length) - 2);
    secondStoreText = `${second.store} ${formatPrice(second.price)}${
      moreCount > 0 ? ` • +${moreCount} mağaza` : " • Resmi Satıcı"
    }`;
  } else {
    secondStoreText = "Trendyol • +12 mağaza";
  }

  // Specs extraction
  const displaySize = phone.specs?.display?.size ? `${phone.specs.display.size}"` : '6.7"';
  const displayHz = phone.specs?.display?.refreshRate ? `${phone.specs.display.refreshRate}Hz` : "120Hz";
  const spec1 = `${displaySize} ${displayHz}`;

  let spec2 = "A18 Pro";
  if (phone.brand.toLowerCase() === "apple") {
    spec2 = displayName.includes("16") ? "A18 Pro" : displayName.includes("15") ? "A16 Bionic" : "A15 Bionic";
  } else if (phone.brand.toLowerCase() === "samsung") {
    spec2 = displayName.includes("Ultra") ? "200MP OIS" : "Galaxy AI";
  } else if (phone.brand.toLowerCase() === "xiaomi") {
    spec2 = displayName.includes("Ultra") ? '1" Leica 50MP' : "SD 8 Elite";
  } else if (phone.brand.toLowerCase() === "poco") {
    spec2 = "120W Hızlı Şarj";
  } else if (phone.specs?.performance?.chipset) {
    spec2 = phone.specs.performance.chipset.split("(")[0].trim();
  } else if (phone.specs?.camera?.mainCamera?.megapixels) {
    spec2 = `${phone.specs.camera.mainCamera.megapixels}MP OIS`;
  }

  // Brand Aura & Drop Shadow
  const brandLower = phone.brand.toLowerCase();
  let auraBg = "bg-[#2997ff]/20";
  let dropShadowClass = "drop-shadow-[0_8px_16px_rgba(41,151,255,0.25)]";

  if (brandLower === "xiaomi") {
    auraBg = "bg-[#ff2d55]/20";
    dropShadowClass = "drop-shadow-[0_8px_16px_rgba(255,45,85,0.25)]";
  } else if (brandLower === "poco") {
    auraBg = "bg-[#f59e0b]/20";
    dropShadowClass = "drop-shadow-[0_8px_16px_rgba(245,158,11,0.25)]";
  } else if (displayName.toLowerCase().includes("magic") || displayName.toLowerCase().includes("fold")) {
    auraBg = "bg-[#47e266]/20";
    dropShadowClass = "drop-shadow-[0_8px_16px_rgba(71,226,102,0.25)]";
  } else if (brandLower === "apple") {
    auraBg = "bg-[#2997ff]/25";
    dropShadowClass = "drop-shadow-[0_10px_16px_rgba(41,151,255,0.3)]";
  }

  const badge = getPhoneBadge(phone, index);
  const isFirstSpotlight = index === 0;
  const isSecondSpotlight = index === 2;

  const installmentText =
    brandLower === "samsung" ? "Vade Farksız 3 Taksit" : "Peşin 3 Taksit";

  // Card Inner Component
  const cardContent = (
    <div className="flex flex-col bg-[#1c1b1d] p-2.5 h-full relative rounded-[calc(1rem-1.5px)]">
      {/* Top Badges & Micro Actions */}
      <div className="flex items-start justify-between w-full z-10">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="anim-badge-pulse px-1.5 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] text-[10px] font-bold tracking-tight shadow-sm">
              -%{discountPercent}
            </span>
          )}
          <span
            className={`px-1.5 py-0.5 rounded-full bg-[#2a2a2c] ${badge.colorClass} text-[10px] font-semibold tracking-wider flex items-center gap-1`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor} anim-radar-ping`} />
            {badge.text}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className={`w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all ${
              isComp
                ? "bg-[#2997ff]/20 text-[#2997ff]"
                : "bg-[#2a2a2c]/80 text-[#c0c7d5] hover:text-[#2997ff]"
            }`}
            title="Karşılaştır"
          >
            <span className="material-symbols-outlined text-[15px]">balance</span>
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(phone)}
            className={`w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all ${
              isFav
                ? "bg-rose-500/20 text-rose-400"
                : "bg-[#2a2a2c]/80 text-[#c0c7d5] hover:text-[#ffb4ab]"
            }`}
            title="Favoriye Ekle"
          >
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>
      </div>

      {/* Device Showcase with 3D Float & Aura */}
      <Link
        href={`/telefon/${phone.slug}`}
        className="relative w-full h-36 flex items-center justify-center my-1 rounded-xl bg-[#0e0e10]/60 overflow-hidden group/img block"
      >
        <div className={`absolute w-24 h-24 rounded-full ${auraBg} blur-xl pointer-events-none`} />
        <div
          className={`anim-float-3d w-full h-full p-2 relative z-10 flex items-center justify-center ${dropShadowClass}`}
          style={{ animationDelay: `${(index * 0.7) % 3}s` }}
        >
          <PhoneImage
            src={phone.image}
            alt={displayName}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#131315]/85 backdrop-blur-md text-[#e5e1e4] text-[11px] border border-white/10 shadow-sm z-20">
          <span
            className="material-symbols-outlined text-[12px] text-[#47e266]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-bold">{ratingVal}</span>
        </div>
      </Link>

      {/* Meta */}
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="text-[10px] text-[#8a919e] font-semibold tracking-wider uppercase">
          {brandName}
        </span>
        <h3 className="text-[13px] leading-snug font-bold text-white line-clamp-1">
          <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
        </h3>
      </div>

      {/* Specs */}
      <div className="flex flex-wrap gap-1 my-1.5">
        <span className="px-1.5 py-0.5 rounded bg-[#2a2a2c] text-[#c0c7d5] text-[10px] truncate max-w-[100px]">
          {spec1}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-[#2a2a2c] text-[#c0c7d5] text-[10px] truncate max-w-[95px]">
          {spec2}
        </span>
      </div>

      {/* Benefits */}
      <div className="flex flex-col gap-0.5 mb-2">
        <div className="flex items-center gap-1 text-[#47e266] text-[10px] font-medium">
          <span className="material-symbols-outlined text-[12px]">local_shipping</span>
          <span>Ücretsiz Kargo</span>
        </div>
        <div className="flex items-center gap-1 text-[#c0c7d5] text-[10px] font-medium">
          <span className="material-symbols-outlined text-[12px] text-[#2997ff]">credit_card</span>
          <span>{installmentText}</span>
        </div>
      </div>

      {/* Price & Action */}
      <div className="mt-auto flex flex-col pt-1.5 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-[#c0c7d5] text-[11px]">
          <span className="truncate max-w-[85px] font-medium">{cheapestStore}</span>
          {strikethroughPrice > displayPrice && (
            <span className="line-through text-[#8a919e]/70 text-[10px]">
              {formatPrice(strikethroughPrice)}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-[18px] leading-tight font-extrabold text-[#47e266]">
            {formatPrice(displayPrice)}
          </span>
        </div>

        <span className="text-[10px] text-[#8a919e] truncate mb-2">
          {secondStoreText}
        </span>

        <div className="flex items-center gap-1.5 w-full">
          <Link
            href={`/telefon/${phone.slug}`}
            className="anim-sheen-btn flex-1 h-8 rounded-full bg-[#2997ff] text-[#002e57] text-xs font-bold flex items-center justify-center active:scale-95 shadow-[0_2px_10px_rgba(41,151,255,0.35)] transition-transform"
          >
            Fiyatları Gör
          </Link>
          <button
            type="button"
            onClick={() => openAlertModal(phone)}
            className="w-8 h-8 rounded-full bg-[#2a2a2c] text-[#c0c7d5] hover:text-[#2997ff] active:scale-90 flex items-center justify-center shrink-0 transition-all cursor-pointer"
            title="Fiyat Alarmı"
          >
            <span className="material-symbols-outlined text-[16px]">notifications</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Outer Wrapper with Spotlights
  if (isFirstSpotlight) {
    return (
      <div className="anim-border-beam rounded-2xl p-[1.5px] shadow-[0_4px_24px_rgba(41,151,255,0.22)] group transition-all duration-300 hover:scale-[1.015] soft-lift-card">
        <div className="anim-card-inner h-full">{cardContent}</div>
      </div>
    );
  }

  if (isSecondSpotlight) {
    return (
      <div className="anim-border-beam anim-border-beam-amber rounded-2xl p-[1.5px] shadow-[0_4px_24px_rgba(255,45,85,0.2)] group transition-all duration-300 hover:scale-[1.015] soft-lift-card">
        <div className="anim-card-inner h-full">{cardContent}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#1c1b1d] rounded-2xl p-2.5 relative group shadow-sm transition-all duration-300 hover:scale-[1.015] hover:bg-[#201f22] border border-white/[0.08] soft-lift-card">
      {cardContent}
    </div>
  );
}
