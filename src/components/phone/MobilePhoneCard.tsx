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

  // Brand Aura
  const brandLower = phone.brand.toLowerCase();
  let auraBg = "bg-[#2997ff]/20";
  if (brandLower === "xiaomi") {
    auraBg = "bg-[#ff2d55]/20";
  } else if (brandLower === "poco") {
    auraBg = "bg-[#f59e0b]/20";
  } else if (displayName.toLowerCase().includes("magic") || displayName.toLowerCase().includes("fold")) {
    auraBg = "bg-[#47e266]/20";
  } else if (brandLower === "apple") {
    auraBg = "bg-[#2997ff]/25";
  }

  const badge = getPhoneBadge(phone, index);
  const isFirstSpotlight = index === 0;
  const isSecondSpotlight = index === 2;

  const installmentText =
    brandLower === "samsung" ? "Vade Farksız 3 Taksit" : "Peşin 3 Taksit";

  // Card Inner Body
  const innerCard = (
    <div className="flex flex-col h-full justify-between">
      {/* 1. Top Badges & Micro Actions */}
      <div className="flex items-start justify-between w-full z-10 gap-1 mb-1">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#dc2626] text-white text-[10.5px] font-black tracking-tight shadow-sm inline-flex items-center">
              -%{discountPercent}
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded-full bg-[#201f22] border border-white/5 ${badge.colorClass} text-[10px] font-bold tracking-wider inline-flex items-center gap-1 shadow-sm`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor} animate-ping`} />
            {badge.text}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className={`w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
              isComp
                ? "bg-[#2997ff]/25 text-[#2997ff] border border-[#2997ff]/50"
                : "bg-[#201f22] border border-white/5 text-zinc-400 hover:text-white"
            }`}
            title="Karşılaştır"
          >
            <span className="material-symbols-outlined text-[15px]">balance</span>
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(phone)}
            className={`w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
              isFav
                ? "bg-rose-500/25 text-rose-400 border border-rose-500/50"
                : "bg-[#201f22] border border-white/5 text-zinc-400 hover:text-rose-400"
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

      {/* 2. Device Showcase with 3D Float, Aura & Rating */}
      <Link
        href={`/telefon/${phone.slug}`}
        className="relative w-full h-36 flex items-center justify-center my-1 rounded-xl bg-[#0e0e10] border border-white/5 overflow-hidden group/img block shadow-inner"
      >
        <div className={`absolute w-24 h-24 rounded-full ${auraBg} blur-xl pointer-events-none opacity-60`} />
        <div
          className="w-full h-full p-2 relative z-10 flex items-center justify-center drop-shadow-[0_10px_16px_rgba(0,0,0,0.8)] group-hover/img:scale-105 transition-transform duration-300"
          style={{
            animation: "floatGentle 4s ease-in-out infinite",
            animationDelay: `${(index * 0.7) % 3}s`,
          }}
        >
          <PhoneImage
            src={phone.image}
            alt={displayName}
            className="w-full h-full object-contain filter contrast-105"
          />
        </div>
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#131315]/90 border border-white/10 backdrop-blur-md text-white text-[11px] font-bold shadow-sm z-20">
          <span className="text-[#47e266] text-[12px]">★</span>
          <span>{ratingVal}</span>
        </div>
      </Link>

      {/* 3. Brand & Title */}
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="text-[10px] text-[#8a919e] font-bold tracking-wider uppercase">
          {brandName}
        </span>
        <h3 className="text-[13px] leading-snug font-bold text-white line-clamp-1 group-hover:text-[#2997ff] transition-colors">
          <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
        </h3>
      </div>

      {/* 4. Specs Tags */}
      <div className="flex flex-wrap gap-1 my-1.5">
        <span className="px-2 py-0.5 rounded-md bg-[#201f22] border border-white/5 text-[#c0c7d5] text-[10px] font-medium truncate max-w-[100px]">
          {spec1}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-[#201f22] border border-white/5 text-[#c0c7d5] text-[10px] font-medium truncate max-w-[95px]">
          {spec2}
        </span>
      </div>

      {/* 5. Benefits */}
      <div className="flex flex-col gap-0.5 mb-2">
        <div className="flex items-center gap-1 text-[#47e266] text-[10.5px] font-medium">
          <span className="material-symbols-outlined text-[13px]">local_shipping</span>
          <span>Ücretsiz Kargo</span>
        </div>
        <div className="flex items-center gap-1 text-[#c0c7d5] text-[10.5px] font-medium">
          <span className="material-symbols-outlined text-[13px] text-[#2997ff]">credit_card</span>
          <span>{installmentText}</span>
        </div>
      </div>

      {/* 6. Price & Action Bar */}
      <div className="mt-auto flex flex-col pt-1.5 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-[#c0c7d5] text-[11px]">
          <span className="truncate max-w-[90px] font-medium">{cheapestStore}</span>
          {strikethroughPrice > displayPrice && (
            <span className="line-through text-[#8a919e] text-[10px]">
              {formatPrice(strikethroughPrice)}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-[18px] leading-tight font-black text-[#47e266] drop-shadow-[0_0_8px_rgba(71,226,102,0.3)]">
            {formatPrice(displayPrice)}
          </span>
        </div>

        <span className="text-[10px] text-[#8a919e] truncate mb-2">
          {secondStoreText}
        </span>

        {/* Action Button Row: Electric Blue "Fiyatları Gör" + Bell Button */}
        <div className="flex items-center gap-1.5 w-full">
          <Link
            href={`/telefon/${phone.slug}`}
            style={{ backgroundColor: "#2997ff", color: "#ffffff" }}
            className="flex-1 h-8.5 rounded-xl text-white text-xs font-bold flex items-center justify-center active:scale-95 shadow-[0_2px_12px_rgba(41,151,255,0.45)] hover:brightness-110 transition-all cursor-pointer"
          >
            Fiyatları Gör
          </Link>

          <button
            type="button"
            onClick={() => openAlertModal(phone)}
            style={{ backgroundColor: "#201f22" }}
            className="w-8.5 h-8.5 rounded-xl border border-white/10 text-[#c0c7d5] hover:text-[#2997ff] active:scale-90 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm"
            title="Fiyat Alarmı"
          >
            <span className="material-symbols-outlined text-[17px]">notifications</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Outer Wrapper with Conic Rotating Border-Beam on Featured Devices
  if (isFirstSpotlight) {
    return (
      <div className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_8px_28px_rgba(41,151,255,0.28)] transition-all duration-300 hover:scale-[1.015]">
        <div className="absolute -inset-[150%] animate-[beamRotateFast_6.5s_linear_infinite] bg-[conic-gradient(from_0deg,#2997ff,transparent_30%,#a3c9ff_50%,#47e266_75%,transparent_90%)] opacity-70 pointer-events-none" />
        <div className="relative w-full h-full rounded-[15px] bg-[#161619] p-2.5 flex flex-col justify-between border border-white/10 backdrop-blur-xl">
          {innerCard}
        </div>
      </div>
    );
  }

  if (isSecondSpotlight) {
    return (
      <div className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_8px_28px_rgba(255,45,85,0.25)] transition-all duration-300 hover:scale-[1.015]">
        <div className="absolute -inset-[150%] animate-[beamRotateFast_6.5s_linear_infinite] bg-[conic-gradient(from_0deg,#ff2d55,transparent_30%,#f59e0b_50%,#2997ff_75%,transparent_90%)] opacity-70 pointer-events-none" />
        <div className="relative w-full h-full rounded-[15px] bg-[#161619] p-2.5 flex flex-col justify-between border border-white/10 backdrop-blur-xl">
          {innerCard}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#161619] rounded-2xl p-2.5 relative group shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.015] hover:border-[#2997ff]/40 border border-white/10">
      {innerCard}
    </div>
  );
}
