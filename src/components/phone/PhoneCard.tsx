"use client";

import Link from "next/link";
import { Star, TrendingDown, Scale, Heart, Bell, Check, Smartphone, Cpu, Camera, Battery } from "lucide-react";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import PhoneImage from "./PhoneImage";
import { useApp } from "@/context/AppContext";

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
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, openAlertModal, theme } = useApp();
  const isDark = theme === "dark";

  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);
  const hasOffers = Boolean(phone.lowestPrice && phone.lowestPrice > 0 && phone.storesPrices && phone.storesPrices.length > 0);
  const storeCount = phone.storesPrices?.length || 0;
  const rating = phone.rating || 9.1;

  // Sorted stores for Akakçe-style top 3 display
  const sortedStores = (phone.storesPrices || []).slice().sort((a, b) => a.price - b.price);
  const topStores = sortedStores.slice(0, 3);
  const remainingStoresCount = Math.max(0, sortedStores.length - 3);

  // 6 month lowest price
  const sixMonthLowest = phone.sixMonthLowestPrice || (phone.lowestPrice > 0 ? Math.round(phone.lowestPrice * 0.94) : 0);

  // ─── List Layout ──────────────────────────────────────────────
  if (variant === "list") {
    return (
      <div
        className={`group relative flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border p-3.5 sm:p-4 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-100"
            : "bg-white border-slate-200/90 text-slate-900"
        }`}
      >
        <div
          className={`relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 mx-auto sm:mx-0 overflow-hidden rounded-xl p-2 flex items-center justify-center border ${
            isDark
              ? "bg-slate-800/80 border-slate-700/80"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <PhoneImage src={phone.image} alt={phone.name} />
          {phone.isPriceDropped && (
            <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              -%{phone.priceDropPercent || 10}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(phone);
            }}
            className={`absolute right-2 top-2 p-1.5 rounded-full transition-all shadow-sm ${
              isFav
                ? "bg-rose-500/20 text-rose-500"
                : isDark
                  ? "bg-slate-900/80 text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                  : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white"
            }`}
            title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500" : ""}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  isDark ? "bg-sky-500/15 text-sky-300" : "bg-sky-50 text-sky-700"
                }`}
              >
                {phone.brand}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating}</span>
              </div>
            </div>

            <h3
              className={`font-bold text-base leading-snug transition-colors ${
                isDark
                  ? "text-slate-100 group-hover:text-sky-400"
                  : "text-slate-900 group-hover:text-sky-600"
              }`}
            >
              <Link href={`/telefon/${phone.slug}`}>{phone.name}</Link>
            </h3>

            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
              <span
                className={`px-2 py-0.5 rounded font-medium ${
                  isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
                }`}
              >
                {phone.specs?.display?.size ? `${phone.specs.display.size}" ${phone.specs.display.technology}` : "OLED Ekran"}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-medium ${
                  isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
                }`}
              >
                {phone.specs?.performance?.chipset || "Güçlü İşlemci"}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-medium ${
                  isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
                }`}
              >
                {phone.specs?.battery?.capacity ? `${phone.specs.battery.capacity} mAh` : "5000 mAh"}
              </span>
            </div>

            {/* Son 6 ayın en düşüğü badge */}
            {hasOffers && sixMonthLowest > 0 && (
              <div
                className={`mt-2 inline-flex items-center gap-1.5 border px-2 py-0.5 rounded text-[10px] font-semibold ${
                  isDark
                    ? "bg-emerald-950/70 text-emerald-300 border-emerald-800/60"
                    : "bg-emerald-50 text-emerald-800 border-emerald-100"
                }`}
              >
                <TrendingDown className="w-3 h-3 text-emerald-500" />
                <span>Son 6 ayın en düşüğü: {formatPrice(sixMonthLowest)}</span>
              </div>
            )}
          </div>

          <div
            className={`mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <div>
              {hasOffers ? (
                <>
                  <div
                    className={`text-xl font-extrabold price-display ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {formatPrice(phone.lowestPrice)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {phone.priceStore ? `${phone.priceStore}'da • ` : ""}{storeCount} mağaza
                  </div>
                </>
              ) : (
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    Stok Bekleniyor
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Aktif mağaza teklifi yok
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAlertModal(phone)}
                className={`p-2 rounded-xl border transition-colors ${
                  isDark
                    ? "text-slate-300 hover:text-amber-400 hover:bg-slate-800 border-slate-700"
                    : "text-slate-500 hover:text-amber-600 hover:bg-amber-50 border-slate-200"
                }`}
                title="Fiyat Alarmı Kur"
              >
                <Bell className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => addToCompare(phone)}
                className={`p-2 rounded-xl border transition-colors ${
                  isComp
                    ? "bg-sky-600 text-white border-sky-600"
                    : isDark
                      ? "text-slate-300 hover:text-sky-400 hover:bg-slate-800 border-slate-700"
                      : "text-slate-600 hover:text-sky-600 hover:bg-sky-50 border-slate-200"
                }`}
                title={isComp ? "Karşılaştırmadan Çıkar" : "Karşılaştırmaya Ekle"}
              >
                <Scale className="w-4 h-4" />
              </button>

              <Link
                href={`/telefon/${phone.slug}`}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                İncele & Fiyatlar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Default / Grid Card Layout (5-column compact design) ────
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3 sm:p-3.5 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200/90 text-slate-900"
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isDark ? "bg-sky-500/15 text-sky-300" : "bg-sky-50 text-sky-700"
              }`}
            >
              {phone.brand}
            </span>
            {phone.isPriceDropped && (
              <span className="flex items-center gap-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 shadow-sm">
                <TrendingDown className="w-2.5 h-2.5" />
                -%{phone.priceDropPercent || 10}
              </span>
            )}
            {phone.isNew && (
              <span className="rounded-full bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 shadow-sm">
                YENİ
              </span>
            )}
          </div>

          {/* Action icons: Favorite & Alert */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openAlertModal(phone);
              }}
              className={`p-1 rounded-full transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                  : "text-slate-400 hover:text-amber-500 hover:bg-amber-50"
              }`}
              title="Fiyat Alarmı Kur"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(phone);
              }}
              className={`p-1 rounded-full transition-colors ${
                isFav
                  ? "text-rose-500 bg-rose-500/15"
                  : isDark
                    ? "text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
              }`}
              title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Real Phone Image */}
        <Link
          href={`/telefon/${phone.slug}`}
          className={`relative h-32 sm:h-34 w-full my-1 flex items-center justify-center p-2 rounded-xl overflow-hidden group-hover:scale-102 transition-transform ${
            isDark
              ? "bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-800/80"
              : "bg-gradient-to-b from-slate-50/80 to-white"
          }`}
        >
          <div className="w-full h-full max-w-[105px] flex items-center justify-center">
            <PhoneImage src={phone.image} alt={phone.name} />
          </div>
        </Link>

        {/* Information */}
        <div className="mt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{rating}</span>
            </div>
            <span className="text-slate-400 font-medium">{storeCount} Mağaza</span>
          </div>

          <h3
            className={`font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[2.2rem] transition-colors ${
              isDark
                ? "text-slate-100 group-hover:text-sky-400"
                : "text-slate-900 group-hover:text-sky-600"
            }`}
          >
            <Link href={`/telefon/${phone.slug}`}>{phone.name}</Link>
          </h3>

          {/* Visible Specs Chips (Screen, Chipset, Camera, Battery) */}
          <div
            className={`mt-2 grid grid-cols-2 gap-1 text-[10px] ${
              isDark ? "text-slate-200" : "text-slate-600"
            }`}
          >
            <div
              className={`flex items-center gap-1 border px-1.5 py-1 rounded truncate ${
                isDark
                  ? "bg-slate-800/90 border-slate-700/80"
                  : "bg-slate-50 border-slate-100"
              }`}
              title={phone.specs?.display ? `${phone.specs.display.size}" ${phone.specs.display.technology} ${phone.specs.display.refreshRate}Hz` : "Ekran"}
            >
              <Smartphone className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate font-medium">{phone.specs?.display ? `${phone.specs.display.size}" ${phone.specs.display.refreshRate || 120}Hz` : "6.7\" 120Hz"}</span>
            </div>

            <div
              className={`flex items-center gap-1 border px-1.5 py-1 rounded truncate ${
                isDark
                  ? "bg-slate-800/90 border-slate-700/80"
                  : "bg-slate-50 border-slate-100"
              }`}
              title={phone.specs?.performance?.chipset || "İşlemci"}
            >
              <Cpu className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate font-medium">{phone.specs?.performance?.chipset ? phone.specs.performance.chipset.split("(")[0].trim() : "Çip"}</span>
            </div>

            <div
              className={`flex items-center gap-1 border px-1.5 py-1 rounded truncate ${
                isDark
                  ? "bg-slate-800/90 border-slate-700/80"
                  : "bg-slate-50 border-slate-100"
              }`}
              title="Ana Kamera"
            >
              <Camera className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate font-medium">{phone.specs?.camera?.mainCamera?.megapixels || 50} MP {phone.specs?.camera?.mainCamera?.ois ? "OIS" : ""}</span>
            </div>

            <div
              className={`flex items-center gap-1 border px-1.5 py-1 rounded truncate ${
                isDark
                  ? "bg-slate-800/90 border-slate-700/80"
                  : "bg-slate-50 border-slate-100"
              }`}
              title="Batarya & Şarj"
            >
              <Battery className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate font-medium">{phone.specs?.battery?.capacity || 5000} mAh • {phone.specs?.battery?.wiredCharging || 45}W</span>
            </div>
          </div>

          {/* Son 6 Ayın En Düşük Fiyatı Badge */}
          {hasOffers && sixMonthLowest > 0 && (
            <div
              className={`mt-2 border rounded-lg px-2 py-1 text-[10px] font-medium flex items-center justify-between ${
                isDark
                  ? "bg-emerald-950/70 border-emerald-800/60 text-emerald-300"
                  : "bg-emerald-50/90 border-emerald-100 text-emerald-800"
              }`}
            >
              <span className="flex items-center gap-1 text-[9.5px]">
                <TrendingDown className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Son 6 ayın en düşüğü:</span>
              </span>
              <span
                className={`font-bold shrink-0 ${
                  isDark ? "text-emerald-200" : "text-emerald-900"
                }`}
              >
                {formatPrice(sixMonthLowest)}
              </span>
            </div>
          )}

          {/* Pricing Box */}
          <div
            className={`mt-2.5 pt-2 border-t ${
              isDark ? "border-slate-800" : "border-slate-100"
            }`}
          >
            {hasOffers ? (
              <>
                <div className="text-[10px] text-slate-400">En Düşük Fiyat:</div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-lg font-extrabold price-display ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {formatPrice(phone.lowestPrice)}
                  </span>
                  {phone.highestPrice > phone.lowestPrice && (
                    <span className="text-[10px] text-slate-500 line-through">
                      {formatPrice(phone.highestPrice)}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">
                  En ucuz{" "}
                  <strong className={isDark ? "text-slate-200" : "text-slate-700"}>
                    {phone.priceStore}
                  </strong>
                  &apos;da
                </div>
              </>
            ) : (
              <div className="py-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                  Stok Bekleniyor
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Aktif mağaza teklifi yok
                </div>
              </div>
            )}
          </div>

          {/* Akakçe Tarzı: En Ucuz 3 Satıcı Listesi */}
          {topStores.length > 0 && (
            <div
              className={`mt-2 pt-2 border-t space-y-1 ${
                isDark ? "border-slate-800" : "border-slate-100"
              }`}
            >
              <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                En Ucuz Mağazalar:
              </div>
              {topStores.map((st, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10.5px] leading-tight">
                  <span
                    className={`font-medium truncate max-w-[95px] flex items-center gap-1 ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isDark ? "bg-slate-600" : "bg-slate-300"
                      }`}
                    />
                    <span className="truncate">{st.store}</span>
                  </span>
                  <span
                    className={`font-bold ${
                      isDark ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    {formatPrice(st.price)}
                  </span>
                </div>
              ))}
              {remainingStoresCount > 0 && (
                <div className="text-[9.5px] text-sky-500 font-bold hover:underline text-right pt-0.5">
                  +{remainingStoresCount} mağaza daha &rarr;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div
        className={`mt-3 flex items-center gap-1.5 pt-2 border-t ${
          isDark ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <Link
          href={`/telefon/${phone.slug}`}
          className="flex-1 py-2 text-center bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Fiyatları Gör
        </Link>

        {showCompareBadge && (
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className={`p-2 rounded-xl border transition-all ${
              isComp
                ? "bg-sky-600 text-white border-sky-600"
                : isDark
                  ? "text-slate-300 hover:text-sky-400 hover:bg-slate-800 border-slate-700"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50 border-slate-200"
            }`}
            title={isComp ? "Karşılaştırmadan Kaldır" : "Karşılaştır (VS)"}
          >
            {isComp ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Scale className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
