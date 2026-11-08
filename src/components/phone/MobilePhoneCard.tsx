"use client";

import Link from "next/link";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface MobilePhoneCardProps {
  phone: Phone;
  index?: number;
}

interface BadgeConfig {
  text: string;
  dotBg: string;
  textColor: string;
}

function getPhoneBadge(phone: Phone, index: number): BadgeConfig {
  const name = phone.name.toLowerCase();
  const brand = phone.brand.toLowerCase();

  if (name.includes("fold") || name.includes("flip") || name.includes("magic v")) {
    return {
      text: "KATLANIR",
      dotBg: "#47e266",
      textColor: "#47e266",
    };
  }
  if (brand === "xiaomi" && (name.includes("ultra") || name.includes("14") || name.includes("15"))) {
    return {
      text: "LEICA",
      dotBg: "#ff2d55",
      textColor: "#ff2d55",
    };
  }
  if (brand === "vivo" && (name.includes("x100") || name.includes("x200") || name.includes("pro"))) {
    return {
      text: "ZEISS",
      dotBg: "#2997ff",
      textColor: "#2997ff",
    };
  }
  if (name.includes("s24") || name.includes("s25") || name.includes("pixel")) {
    return {
      text: "AI DESTEKLİ",
      dotBg: "#2997ff",
      textColor: "#2997ff",
    };
  }
  if (phone.isNew || name.includes("16")) {
    return {
      text: "YENİ",
      dotBg: "#2997ff",
      textColor: "#2997ff",
    };
  }
  if (phone.lowestPrice > 0 && phone.lowestPrice < 35000 && (phone.rating || 0) >= 9.0) {
    return {
      text: "F/P KRALI",
      dotBg: "#47e266",
      textColor: "#47e266",
    };
  }
  if ((phone.rating || 0) >= 9.6 || index === 1) {
    return {
      text: "ÇOK SATAN",
      dotBg: "#47e266",
      textColor: "#47e266",
    };
  }
  return {
    text: "POPÜLER",
    dotBg: "#47e266",
    textColor: "#47e266",
  };
}

export default function MobilePhoneCard({ phone, index = 0 }: MobilePhoneCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, openAlertModal } = useApp();
  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);

  const brandName = phone.brand;
  const displayName = phone.name;
  const ratingVal = (phone.rating || 9.4).toFixed(1);

  // Exact Stitch discounts: -%18, -%14, -%22, -%16, -%24, -%12, -%19, -%15
  const showcaseDiscounts = [18, 14, 22, 16, 24, 12, 19, 15];
  const discountPercent =
    phone.priceDropPercent ||
    (phone.isPriceDropped ? 18 : showcaseDiscounts[index % showcaseDiscounts.length]);

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
    secondStoreText = "Hepsiburada • +14 mağaza";
  }

  // Specs extraction matching Stitch
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
  } else if (displayName.toLowerCase().includes("magic") || displayName.toLowerCase().includes("fold")) {
    spec2 = "9.2mm İnce";
  } else if (phone.specs?.performance?.chipset) {
    spec2 = phone.specs.performance.chipset.split("(")[0].trim();
  } else if (phone.specs?.camera?.mainCamera?.megapixels) {
    spec2 = `${phone.specs.camera.mainCamera.megapixels}MP OIS`;
  }

  // Ambient Aura
  const brandLower = phone.brand.toLowerCase();
  let auraBg = "rgba(41, 151, 255, 0.25)";
  if (brandLower === "xiaomi") {
    auraBg = "rgba(255, 45, 85, 0.2)";
  } else if (brandLower === "poco") {
    auraBg = "rgba(245, 158, 11, 0.2)";
  } else if (displayName.toLowerCase().includes("magic") || displayName.toLowerCase().includes("fold")) {
    auraBg = "rgba(71, 226, 102, 0.2)";
  }

  const badge = getPhoneBadge(phone, index);
  const isFirstSpotlight = index === 0;
  const isSecondSpotlight = index === 2;

  const installmentText =
    brandLower === "samsung" ? "Vade Farksız 3 Taksit" : "Peşin 3 Taksit";

  // Card Content Component
  const cardBody = (
    <div
      className="flex flex-col p-2.5 h-full relative"
      style={{
        backgroundColor: "#161619",
        borderRadius: "calc(1rem - 1.5px)",
      }}
    >
      {/* 1. Top Badges & Micro Actions */}
      <div className="flex items-start justify-between w-full z-10">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full font-bold tracking-tight shadow-sm text-[10px]"
              style={{ backgroundColor: "#93000a", color: "#ffdad6" }}
            >
              -%{discountPercent}
            </span>
          )}
          <span
            className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider flex items-center gap-1"
            style={{ backgroundColor: "#201f22", color: badge.textColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: badge.dotBg }}
            />
            {badge.text}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            style={{
              backgroundColor: isComp ? "rgba(41,151,255,0.25)" : "rgba(42,42,44,0.8)",
              color: isComp ? "#2997ff" : "#c0c7d5",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            title="Karşılaştır"
          >
            <span className="material-symbols-outlined text-[15px]">balance</span>
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(phone)}
            className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            style={{
              backgroundColor: isFav ? "rgba(255,45,85,0.25)" : "rgba(42,42,44,0.8)",
              color: isFav ? "#ff2d55" : "#c0c7d5",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
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

      {/* 2. Device Showcase with Glow */}
      <Link
        href={`/telefon/${phone.slug}`}
        className="relative w-full h-36 flex items-center justify-center my-1 rounded-xl overflow-hidden group/img block border border-white/5"
        style={{ backgroundColor: "#0e0e10" }}
      >
        <div
          className="absolute w-24 h-24 rounded-full blur-xl pointer-events-none"
          style={{ backgroundColor: auraBg }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={phone.image}
          alt={displayName}
          loading={index < 4 ? "eager" : "lazy"}
          style={{
            filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.6))",
          }}
          className="w-full h-full object-contain p-2 relative z-10 transition-transform duration-300 group-hover/img:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              phone.brand.toLowerCase() === "apple"
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC0vj7rv81MUeOggNnTdP9Ln_oEwfzko5WKQSWADsGRJ7kdCvXOCovz5FR3ljzVWz49kVVMB1iulmFqVNAZBSnaV9s1fchWUQxkGdYzuFGbLYf1pWWvEau-5yFJ26hiZky60f8Pp6a5IReNuZ0trnTvEUw2dcJoiHgPBaJVjIRD6hPSeUXJrYH7mUibjryvJxK4XGfAoXVEOQe16l6tGWvCwdTsRy563yQLDQb4icY"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuDtjLSOzd0Yv-vG7uGoaOUjRK1Jm6HL5SjQJ10WOFUZIlj5wZrZF-n_LSce4iq_AsDvGFt9H-Orun3jiNyCC_LxXuyJEGpNZQ5VU_pvUuHBZ3d9lu5T8hSWiN_rmZPjpWn-nFfSkOwqQ3KU0ZJ2iqf2YDx-eHz_dVK6Bh8G-f9qyE4jt5XZri9SSvP4G-Q9Njx4x_ufWXPMsrsk9XLXLA8RZMg6VfckMHg8YsUup5k";
          }}
        />
        <div
          className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md backdrop-blur-md text-[11px] border border-white/10 shadow-sm z-20"
          style={{ backgroundColor: "rgba(19, 19, 21, 0.9)", color: "#e5e1e4" }}
        >
          <span
            className="material-symbols-outlined text-[12px]"
            style={{ fontVariationSettings: "'FILL' 1", color: "#47e266" }}
          >
            star
          </span>
          <span className="font-bold">{ratingVal}</span>
        </div>
      </Link>

      {/* 3. Meta: Brand & Title */}
      <div className="flex flex-col gap-0.5 mt-1">
        <span className="text-[10px] text-[#8a919e] font-semibold tracking-wider uppercase">
          {brandName}
        </span>
        <h3 className="text-[14px] leading-snug font-bold text-white line-clamp-1">
          <Link href={`/telefon/${phone.slug}`}>{displayName}</Link>
        </h3>
      </div>

      {/* 4. Specs */}
      <div className="flex flex-wrap gap-1 my-1.5">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] truncate max-w-[100px]"
          style={{ backgroundColor: "#201f22", color: "#c0c7d5" }}
        >
          {spec1}
        </span>
        <span
          className="px-1.5 py-0.5 rounded text-[10px] truncate max-w-[95px]"
          style={{ backgroundColor: "#201f22", color: "#c0c7d5" }}
        >
          {spec2}
        </span>
      </div>

      {/* 5. Benefits */}
      <div className="flex flex-col gap-0.5 mb-2">
        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#47e266" }}>
          <span className="material-symbols-outlined text-[12px]">local_shipping</span>
          <span>Ücretsiz Kargo</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#c0c7d5" }}>
          <span className="material-symbols-outlined text-[12px]" style={{ color: "#2997ff" }}>
            credit_card
          </span>
          <span>{installmentText}</span>
        </div>
      </div>

      {/* 6. Price & Action */}
      <div className="mt-auto flex flex-col pt-1.5 border-t border-white/[0.08]">
        <div className="flex items-center justify-between text-[11px]" style={{ color: "#c0c7d5" }}>
          <span className="truncate max-w-[80px] font-medium">{cheapestStore}</span>
          {strikethroughPrice > displayPrice && (
            <span className="line-through text-[10px]" style={{ color: "rgba(138, 145, 158, 0.6)" }}>
              {formatPrice(strikethroughPrice)}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1 my-0.5">
          <span
            className="text-[18px] leading-tight font-extrabold"
            style={{ color: "#47e266" }}
          >
            {formatPrice(displayPrice)}
          </span>
        </div>

        <span
          className="text-[10px] truncate mb-2"
          style={{ color: "rgba(138, 145, 158, 0.8)" }}
        >
          {secondStoreText}
        </span>

        {/* Action Button Row: Electric Blue "Fiyatları Gör" + Bell Button */}
        <div className="flex items-center gap-1.5 w-full">
          <Link
            href={`/telefon/${phone.slug}`}
            className="flex-1 h-8 rounded-full text-xs font-bold flex items-center justify-center active:scale-95 transition-transform"
            style={{
              backgroundColor: "#2997ff",
              color: "#ffffff",
              boxShadow: "0 2px 10px rgba(41, 151, 255, 0.4)",
            }}
          >
            Fiyatları Gör
          </Link>
          <button
            type="button"
            onClick={() => openAlertModal(phone)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer border border-white/10"
            style={{
              backgroundColor: "#201f22",
              color: "#c0c7d5",
            }}
            title="Fiyat Alarmı"
          >
            <span className="material-symbols-outlined text-[16px]">notifications</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Outer Wrapper with Conic Rotating Border-Beam on Featured Devices
  if (isFirstSpotlight) {
    return (
      <div
        className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_4px_24px_rgba(41,151,255,0.3)] transition-all duration-300 hover:scale-[1.015]"
      >
        <div
          className="absolute -inset-[150%] opacity-60 pointer-events-none"
          style={{
            animation: "beamRotateFast 7s linear infinite",
            background: "conic-gradient(from 0deg, #2997ff, transparent 30%, #a3c9ff 50%, #47e266 75%, transparent 90%)",
          }}
        />
        <div className="relative h-full rounded-2xl overflow-hidden">{cardBody}</div>
      </div>
    );
  }

  if (isSecondSpotlight) {
    return (
      <div
        className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_4px_24px_rgba(255,45,85,0.25)] transition-all duration-300 hover:scale-[1.015]"
      >
        <div
          className="absolute -inset-[150%] opacity-60 pointer-events-none"
          style={{
            animation: "beamRotateFast 6.5s linear infinite",
            background: "conic-gradient(from 0deg, #ff2d55, transparent 25%, #ff9500 50%, #ff2d55 75%, transparent 95%)",
          }}
        />
        <div className="relative h-full rounded-2xl overflow-hidden">{cardBody}</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col rounded-2xl p-[1px] relative group shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.015] border border-white/10"
      style={{ backgroundColor: "#161619" }}
    >
      {cardBody}
    </div>
  );
}
