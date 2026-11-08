"use client";

import Link from "next/link";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import PhoneImage from "./PhoneImage";

interface MobilePhoneCardProps {
  phone: Phone;
}

export default function MobilePhoneCard({ phone }: MobilePhoneCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, openAlertModal } = useApp();
  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);

  const brandName = phone.brand;
  const displayName = phone.name;
  const ratingVal = (phone.rating || 9.2).toFixed(1);
  const discountPercent = phone.priceDropPercent || (phone.isPriceDropped ? 18 : 0);

  const isTopDeal = discountPercent >= 15 || phone.isPriceDropped || phone.isNew;

  const displayPrice = phone.lowestPrice || 0;
  const strikethroughPrice =
    phone.highestPrice && phone.highestPrice > displayPrice
      ? phone.highestPrice
      : Math.round(displayPrice * 1.15);

  let cheapestStore = phone.lowestPriceStoreName || "Doğrulanmış Satıcı";
  let secondStoreText = "";

  if (phone.storesPrices && phone.storesPrices.length > 1) {
    const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
    cheapestStore = sorted[0].store;
    const second = sorted[1];
    const moreCount = sorted.length - 2;
    secondStoreText = `${second.store} ${formatPrice(second.price)}${
      moreCount > 0 ? ` • +${moreCount} mağaza` : ""
    }`;
  } else {
    secondStoreText = "Doğrulanmış Mağaza Telemetrisi";
  }

  const spec1 = `${phone.specs?.display?.size || 6.7}" ${phone.specs?.display?.refreshRate || 120}Hz`;
  const spec2 = phone.specs?.performance?.chipset?.split("(")[0].trim() || (phone.brand === "Apple" ? "A18 Pro" : "Yüksek Hızlı İşlemci");

  return (
    <div
      className={`rounded-2xl p-[1.5px] group transition-all duration-300 hover:scale-[1.015] ${
        isTopDeal
          ? "anim-border-beam shadow-[0_4px_24px_rgba(41,151,255,0.22)]"
          : "border border-white/[0.08] bg-[#1c1b1d]/80"
      }`}
    >
      <div className="anim-card-inner flex flex-col bg-[#1c1b1d] p-2.5 h-full relative rounded-[calc(1rem-1.5px)]">
        {/* Top Badges & Micro Actions */}
        <div className="flex items-start justify-between w-full z-10">
          <div className="flex flex-col gap-1 items-start">
            {discountPercent > 0 && (
              <span className="anim-badge-pulse px-1.5 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] text-[10px] font-bold tracking-tight shadow-sm">
                -%{discountPercent}
              </span>
            )}
            {phone.isNew && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#353437] text-[#a3c9ff] text-[10px] font-semibold tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] anim-radar-ping" />
                YENİ
              </span>
            )}
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
                  : "bg-[#2a2a2c]/80 text-[#c0c7d5] hover:text-rose-400"
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

        {/* Device Showcase with 3D Float */}
        <Link
          href={`/telefon/${phone.slug}`}
          className="relative w-full h-36 flex items-center justify-center my-1 rounded-xl bg-[#0e0e10]/60 overflow-hidden group/img block"
        >
          <div className="absolute w-24 h-24 rounded-full bg-[#2997ff]/20 blur-xl pointer-events-none" />
          <div className="anim-float-3d w-full h-full p-2 relative z-10 flex items-center justify-center drop-shadow-[0_10px_16px_rgba(41,151,255,0.3)]">
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
          <span className="text-[10px] text-[#c0c7d5] font-semibold tracking-wider uppercase">
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
          <span className="px-1.5 py-0.5 rounded bg-[#2a2a2c] text-[#c0c7d5] text-[10px] truncate max-w-[90px]">
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
            <span>Peşin 3 Taksit</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex flex-col pt-1.5 border-t border-white/[0.08]">
          <div className="flex items-center justify-between text-[#c0c7d5] text-[11px]">
            <span className="truncate max-w-[85px] font-medium">{cheapestStore}</span>
            {strikethroughPrice > displayPrice && (
              <span className="line-through text-[#8a919e] text-[10px]">
                {formatPrice(strikethroughPrice)}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-[17px] leading-tight font-extrabold text-[#47e266]">
              {formatPrice(displayPrice)}
            </span>
          </div>

          <span className="text-[10px] text-[#8a919e] truncate mb-2">
            {secondStoreText}
          </span>

          <div className="flex items-center gap-1.5 w-full">
            <Link
              href={`/telefon/${phone.slug}`}
              className="anim-sheen-btn flex-1 h-8 rounded-full bg-[#2997ff] text-white text-xs font-bold flex items-center justify-center active:scale-95 shadow-[0_2px_10px_rgba(41,151,255,0.35)] transition-transform"
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
    </div>
  );
}
