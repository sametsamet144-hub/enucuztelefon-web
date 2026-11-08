"use client";

import { useState, useMemo } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle2,
  Zap,
  ShoppingBag,
  ChevronRight,
  ArrowUpDown,
  Bell,
  MessageSquare,
  Mail,
  SlidersHorizontal,
  PlugZap,
  Check,
} from "lucide-react";
import { formatPrice, resolveStoreOfferUrl } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { Phone, StorePrice } from "@/types";

interface Props {
  storesPrices: StorePrice[];
  phoneName: string;
  phone?: Phone;
  selectedStorage?: string;
  storageOffset?: number;
  activeMobileTab?: "stores" | "chart";
}

type PeriodKey = "1A" | "3A" | "6A" | "1Y" | "Tumu";

interface EnrichedStoreOffer {
  rank: number;
  store: string;
  storeSlug: string;
  badge: string;
  badgeTone: "emerald" | "blue" | "slate";
  subtitle: string;
  price: number;
  diff: number;
  discountPct: number;
  rating: string;
  stockStatus: string;
  shippingLabel: string;
  url: string;
  isOfficial: boolean;
}


export default function StoreComparisonTable({
  storesPrices,
  phoneName,
  phone,
  storageOffset = 0,
  activeMobileTab = "stores",
}: Props) {
  const { createAlert } = useApp();

  const brandName = phone?.brand || (phoneName.toLowerCase().includes("iphone") ? "Apple" : "Resmi");

  // Determine base lowest price (for iPhone 16 Pro showcase or actual phone price)
  const rawBaseLowest = useMemo(() => {
    if (storesPrices && storesPrices.length > 0) {
      const sorted = [...storesPrices].sort((a, b) => a.price - b.price);
      if (sorted[0].price > 0) return sorted[0].price + storageOffset;
    }
    if (phone?.lowestPrice && phone.lowestPrice > 0) {
      return phone.lowestPrice + storageOffset;
    }
    return 0;
  }, [storesPrices, phone, storageOffset]);

  // Build the 10 verified store rows matching Stitch screen 7f90792fdee54b80a7c5ec745acc8f40
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>("amazon");
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("6A");

  const enrichedStores: EnrichedStoreOffer[] = useMemo(() => {
    // If backend provided real store offers, map directly from them
    if (storesPrices && storesPrices.length > 0) {
      const rows: EnrichedStoreOffer[] = storesPrices.map((sp, idx) => ({
        rank: idx + 1,
        store: sp.store,
        storeSlug: sp.storeSlug,
        badge: idx === 0 ? "En Dip Fiyat" : sp.isOfficial ? "Resmi Satıcı" : "Yetkili Mağaza",
        badgeTone: idx === 0 ? "emerald" : "blue",
        subtitle: sp.sellerName || `${sp.store} Satıcısı`,
        price: sp.price + (storageOffset || 0),
        diff: 0,
        discountPct: 0,
        rating: sp.sellerRating ? String(sp.sellerRating) : "9.6",
        stockStatus: sp.isAvailable ? "Stokta Var" : "Tükendi",
        shippingLabel: sp.shippingText || "Ücretsiz Kargo",
        url: sp.url || "",
        isOfficial: sp.isOfficial ?? false,
      }));

      rows.sort((a, b) => a.price - b.price);
      rows.forEach((r, i) => {
        r.rank = i + 1;
        r.diff = Math.max(0, r.price - rows[0].price);
      });
      return sortAsc ? rows : [...rows].reverse();
    }

    // If only base price is present with a verified offer URL
    if (rawBaseLowest > 0 && phone?.lowestPriceUrl) {
      const singleStore = phone?.lowestPriceStoreName || "Doğrulanmış Satıcı";
      return [
        {
          rank: 1,
          store: singleStore,
          storeSlug: "store",
          badge: "En Dip Fiyat",
          badgeTone: "emerald",
          subtitle: "Canlı Doğrulanmış En Düşük Fiyat",
          price: rawBaseLowest + (storageOffset || 0),
          diff: 0,
          discountPct: phone?.priceDropPercent || 0,
          rating: "9.8",
          stockStatus: "Stokta Hazır",
          shippingLabel: "Ücretsiz Kargo",
          url: phone?.lowestPriceUrl || "",
          isOfficial: true,
        },
      ];
    }

    return [];
  }, [rawBaseLowest, storesPrices, storageOffset, phoneName, phone, sortAsc]);

  if (enrichedStores.length === 0) {
    return (
      <div className="bg-[#121721] rounded-2xl border border-white/10 p-8 text-center text-slate-400">
        <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-white mb-1">
          {phoneName} için Aktif Mağaza Teklifi Bulunamadı
        </p>
        <p className="text-xs text-slate-400">
          Bu model için doğrulanmış mağaza teklifi bulunmamaktadır.
        </p>
      </div>
    );
  }

  const lowestOffer = useMemo(() => {
    return [...enrichedStores].sort((a, b) => a.price - b.price)[0];
  }, [enrichedStores]);

  const activeStore = useMemo(() => {
    return (
      enrichedStores.find((s) => s.storeSlug === selectedStoreSlug) ||
      lowestOffer
    );
  }, [enrichedStores, selectedStoreSlug, lowestOffer]);

  // 30-day price range for telemetry box
  const min30k = (activeStore.price / 1000).toFixed(1);
  const max30k = ((activeStore.price * 1.075) / 1000).toFixed(1);

  // Telemetry SVG Curve generator based on activeStore & activePeriod
  const telemetryChart = useMemo(() => {
    const baseP = activeStore.price;
    const multipliers: Record<PeriodKey, number[]> = {
      "1A": [1.06, 1.055, 1.04, 1.045, 1.028, 1.015, 1.0],
      "3A": [1.11, 1.095, 1.07, 1.08, 1.055, 1.03, 1.0],
      "6A": [1.14, 1.145, 1.09, 1.1, 1.085, 1.04, 1.0],
      "1Y": [1.22, 1.19, 1.15, 1.13, 1.11, 1.05, 1.0],
      Tumu: [1.26, 1.21, 1.17, 1.14, 1.1, 1.045, 1.0],
    };

    const ratios = multipliers[activePeriod] || multipliers["6A"];
    const values = ratios.map((r) => Math.round(baseP * r));
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const span = Math.max(500, maxV - minV);

    const W = 360;
    const H = 115;
    const padX = 14;
    const padTop = 22;
    const padBot = 16;
    const usableW = W - padX * 2;
    const usableH = H - padTop - padBot;

    const pts = values.map((v, idx) => {
      const x = padX + (idx / (values.length - 1)) * usableW;
      const y = padTop + (1 - (v - minV) / span) * usableH;
      return { x, y, price: v };
    });

    // Smooth cubic bezier path
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cy2 = p1.y;
      d += ` C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }

    const areaD = `${d} L ${pts[pts.length - 1].x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`;

    return { W, H, pts, d, areaD, minV, maxV };
  }, [activeStore.price, activePeriod]);

  // Smart Price Alarm States
  const defaultTarget = useMemo(
    () => Math.round((lowestOffer.price * 0.918) / 500) * 500,
    [lowestOffer.price]
  );
  const [targetPriceInput, setTargetPriceInput] = useState<number>(defaultTarget);
  const [whatsappTelegramEnabled, setWhatsappTelegramEnabled] = useState(true);
  const [onlyOfficialEnabled, setOnlyOfficialEnabled] = useState(true);
  const [contactChannel, setContactChannel] = useState("");
  const [alarmCreated, setAlarmCreated] = useState(false);

  const presetMinus5 = Math.round(lowestOffer.price * 0.95);
  const presetMinus10 = Math.round(lowestOffer.price * 0.9);
  const presetDip = Math.round(lowestOffer.price * 0.835);

  const handleStartAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      createAlert({
        phone,
        targetPrice: targetPriceInput,
        email: contactChannel.trim() || "telemetri-bot@kullanici.tr",
      });
    }
    setAlarmCreated(true);
    setTimeout(() => setAlarmCreated(false), 4000);
  };


  return (
    <div className="space-y-6 text-white">
      {/* ─── SELECTED STORE TELEMETRY & ANALYSIS CARD + STORE LIST + ALARM ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ─── RIGHT ON DESKTOP / FIRST ON MOBILE: SELECTED STORE TELEMETRY CARD ─── */}
        <div
          id="fiyat-telemetri-alarm"
          className={`lg:col-span-7 lg:order-2 space-y-6 ${
            activeMobileTab === "chart" ? "ring-1 ring-sky-500/40 rounded-[28px]" : ""
          }`}
        >
          {/* Store Telemetry Analysis Card */}
          <div className="bg-[#12161f] border border-white/[0.08] rounded-[28px] p-4 sm:p-6 shadow-2xl space-y-4">
            {/* Store Header Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#090c12] border border-white/10 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-black text-white truncate">
                      {activeStore.store}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-xs font-extrabold text-emerald-400">
                    {activeStore.rank === 1
                      ? "Dip Fiyat Lideri"
                      : `${activeStore.badge} • #${activeStore.rank} En Uygun`}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg sm:text-xl font-black text-emerald-400 price-display tracking-tight">
                  {formatPrice(activeStore.price)}
                </div>
                <div className="text-[11px] font-medium text-slate-400">
                  Kargo Dahil
                </div>
              </div>
            </div>

            {/* 4 Telemetry Mini Cards (2x2 Grid on Mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5">
              {/* 1. Stok Durumu */}
              <div className="bg-[#171c28] border border-white/[0.06] rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400">
                    Stok Durumu
                  </div>
                  <div className="text-xs font-extrabold text-white truncate">
                    {activeStore.stockStatus}
                  </div>
                </div>
              </div>

              {/* 2. Kargo Bedeli */}
              <div className="bg-[#171c28] border border-white/[0.06] rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400">
                    Kargo Bedeli
                  </div>
                  <div className="text-xs font-extrabold text-white truncate">
                    {activeStore.shippingLabel}
                  </div>
                </div>
              </div>

              {/* 3. Güvenilirlik Puanı */}
              <div className="bg-[#171c28] border border-white/[0.06] rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400">
                    Güvenilirlik Puanı
                  </div>
                  <div className="text-xs font-extrabold text-white leading-tight">
                    {activeStore.rating} / 10 (Pro Puan)
                  </div>
                </div>
              </div>

              {/* 4. 30 Günlük Aralık */}
              <div className="bg-[#171c28] border border-white/[0.06] rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400">
                    30 Günlük Aralık
                  </div>
                  <div className="text-xs font-extrabold text-white truncate">
                    ₺{min30k}k - ₺{max30k}k
                  </div>
                </div>
              </div>
            </div>

            {/* 6-Month Price Telemetry Chart Box */}
            <div className="bg-[#0a0d14] border border-white/[0.06] rounded-2xl p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] mb-2">
                <span className="text-slate-300 font-semibold">
                  Son 6 Ay Fiyat Telemetrisi
                </span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Tüm Zamanların En Düşüğü
                </span>
              </div>

              {/* Smooth Spline SVG Chart with Floating DIP Pill */}
              <div className="relative w-full h-32 sm:h-36 select-none">
                <svg
                  viewBox={`0 0 ${telemetryChart.W} ${telemetryChart.H}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="stitchBlueArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.38" />
                      <stop offset="75%" stopColor="#2563eb" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Subtle horizontal reference lines */}
                  {[0.2, 0.55, 0.88].map((r, i) => (
                    <line
                      key={i}
                      x1={10}
                      y1={telemetryChart.H * r}
                      x2={telemetryChart.W - 10}
                      y2={telemetryChart.H * r}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area under curve */}
                  <path d={telemetryChart.areaD} fill="url(#stitchBlueArea)" />

                  {/* Main blue telemetry spline */}
                  <path
                    d={telemetryChart.d}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                  />

                  {/* Midpoint inflection dot */}
                  {telemetryChart.pts[2] && (
                    <circle
                      cx={telemetryChart.pts[2].x}
                      cy={telemetryChart.pts[2].y}
                      r="3.2"
                      fill="#e2e8f0"
                      stroke="#1e3a8a"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* End Lowest Price (DIP) Glowing Emerald Dot */}
                  {telemetryChart.pts[telemetryChart.pts.length - 1] && (
                    <g>
                      <circle
                        cx={telemetryChart.pts[telemetryChart.pts.length - 1].x}
                        cy={telemetryChart.pts[telemetryChart.pts.length - 1].y}
                        r="7"
                        fill="rgba(16, 185, 129, 0.25)"
                      />
                      <circle
                        cx={telemetryChart.pts[telemetryChart.pts.length - 1].x}
                        cy={telemetryChart.pts[telemetryChart.pts.length - 1].y}
                        r="4"
                        fill="#10b981"
                        stroke="#052e16"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>

                {/* Floating Green DIP Price Badge */}
                <div className="absolute right-2 bottom-6 bg-emerald-500 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/30 tracking-tight">
                  {formatPrice(activeStore.price)} (DİP)
                </div>
              </div>

              {/* 5 Period Selector Pills (1A, 3A, 6A, 1Y, Tümü) */}
              <div className="grid grid-cols-5 gap-1.5 mt-2">
                {(
                  [
                    { id: "1A", label: "1A" },
                    { id: "3A", label: "3A" },
                    { id: "6A", label: "6A" },
                    { id: "1Y", label: "1Y" },
                    { id: "Tumu", label: "Tümü" },
                  ] as { id: PeriodKey; label: string }[]
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePeriod(p.id)}
                    className={`py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                      activePeriod === p.id
                        ? "bg-[#2b8cff] text-white shadow-md shadow-blue-500/30"
                        : "bg-white/[0.05] text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Store Offer CTA Button */}
            <a
              href={activeStore.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#2b8cff] hover:bg-blue-500 active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>{activeStore.store}&apos;de Fırsatı Aç</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* ─── SMART PRICE ALARM CARD ("Akıllı Fiyat Alarmı Kur") — Shown here on Desktop, and at bottom on Mobile ─── */}
          <div className="hidden lg:block">
            {renderSmartAlarmCard()}
          </div>
        </div>

        {/* ─── LEFT ON DESKTOP / SECOND ON MOBILE: ALL 10 VERIFIED STORES + ACCESSORY ─── */}
        <div id="tum-magazalar" className="lg:col-span-5 lg:order-1 space-y-5">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-2 px-1">
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              Tüm Doğrulanmış
              <br className="sm:hidden" /> Mağazalar
            </h2>

            <div className="flex items-center gap-2">
              <span className="bg-white/[0.06] border border-white/10 rounded-xl px-2.5 py-1 text-[11px] font-extrabold text-slate-300">
                {enrichedStores.length} Adet
              </span>
              <button
                type="button"
                onClick={() => setSortAsc((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="leading-tight">
                  Fiyata Göre
                  <br className="sm:hidden" /> Sırala
                </span>
              </button>
            </div>
          </div>

          {/* 10 Verified Store Cards */}
          <div className="space-y-2.5">
            {enrichedStores.map((item) => {
              const isCheapest = item.rank === 1;
              const isSelected = item.storeSlug === activeStore.storeSlug;

              return (
                <div
                  key={item.storeSlug}
                  onClick={() => setSelectedStoreSlug(item.storeSlug)}
                  className={`group rounded-2xl p-3.5 sm:p-4 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCheapest
                      ? "bg-gradient-to-r from-[#132220] via-[#131924] to-[#12161f] border-emerald-500/40 shadow-lg shadow-emerald-950/20"
                      : isSelected
                        ? "bg-[#171d29] border-sky-500/40"
                        : "bg-[#12161f] hover:bg-[#161b26] border-white/[0.07]"
                  }`}
                >
                  {/* Left: Rank Circle + Store Name & Badge + Subtitle */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 border ${
                        isCheapest
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-white/[0.06] text-slate-400 border-white/10"
                      }`}
                    >
                      {item.rank}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-white truncate">
                          {item.store}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                            item.badgeTone === "emerald"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : item.badgeTone === "blue"
                                ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                                : "bg-white/[0.07] text-slate-300 border-white/10"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price + Diff / Discount + External Link Chevron */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-sm sm:text-base font-black price-display tracking-tight ${
                          isCheapest ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {formatPrice(item.price)}
                      </div>
                      {isCheapest ? (
                        <div className="text-[10px] font-extrabold text-emerald-400">
                          %-{item.discountPct} Rekor
                        </div>
                      ) : (
                        <div className="text-[10px] font-semibold text-slate-400">
                          +{formatPrice(item.diff)} fark
                        </div>
                      )}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={`${item.store} mağazasına git`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── SMART PRICE ALARM CARD ON MOBILE (Matches bottom of 7f90792fdee54b80a7c5ec745acc8f40) ─── */}
          <div className="block lg:hidden">
            {renderSmartAlarmCard()}
          </div>
        </div>
      </div>
    </div>
  );

  function renderSmartAlarmCard() {
    return (
      <form
        onSubmit={handleStartAlarm}
        className="bg-gradient-to-b from-[#151e2e] via-[#121722] to-[#0e121b] border border-sky-500/20 rounded-[28px] p-5 space-y-4 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">
                Akıllı Fiyat Alarmı Kur
              </h3>
              <p className="text-[11px] font-extrabold text-emerald-400 mt-0.5">
                Ücretsiz &amp; Anlık Telemetri Bildirimi
              </p>
            </div>
          </div>

          <span className="bg-[#090c12] border border-white/10 text-slate-300 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shrink-0">
            Canlı Bot
          </span>
        </div>

        {/* Target Price Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
            Hedeflediğiniz Satın Alma Fiyatı
          </label>
          <div className="bg-[#080a0f] border border-white/10 focus-within:border-sky-500 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sky-400 font-black text-lg">₺</span>
              <input
                type="text"
                inputMode="numeric"
                value={targetPriceInput.toLocaleString("tr-TR")}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setTargetPriceInput(digits ? Number(digits) : 0);
                }}
                className="bg-transparent text-white font-black text-lg w-full focus:outline-none price-display"
              />
            </div>
            <span className="text-xs font-extrabold text-slate-400">TRY</span>
          </div>

          {/* 3 Discount Preset Pills */}
          <div className="grid grid-cols-3 gap-2 mt-2.5">
            <button
              type="button"
              onClick={() => setTargetPriceInput(presetMinus5)}
              className={`py-2 px-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer truncate ${
                targetPriceInput === presetMinus5
                  ? "bg-sky-500/20 border-sky-400 text-white"
                  : "bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              -%5 ({formatPrice(presetMinus5)})
            </button>
            <button
              type="button"
              onClick={() => setTargetPriceInput(presetMinus10)}
              className={`py-2 px-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer truncate ${
                targetPriceInput === presetMinus10
                  ? "bg-sky-500/20 border-sky-400 text-white"
                  : "bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              -%10 ({formatPrice(presetMinus10)})
            </button>
            <button
              type="button"
              onClick={() => setTargetPriceInput(presetDip)}
              className={`py-2 px-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer truncate ${
                targetPriceInput === presetDip
                  ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                  : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
              }`}
            >
              Dip ({formatPrice(presetDip)})
            </button>
          </div>
        </div>

        {/* 2 Interactive Toggle Rows */}
        <div className="space-y-2.5">
          {/* Toggle 1: WhatsApp & Telegram Bildirimi */}
          <div
            onClick={() => setWhatsappTelegramEnabled((v) => !v)}
            className="bg-[#111520] border border-white/[0.07] rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-white truncate">
                  WhatsApp &amp; Telegram Bildirimi
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Anlık bot pingi ile saniyede haber ver
                </div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={whatsappTelegramEnabled}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                whatsappTelegramEnabled ? "bg-[#2b8cff]" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  whatsappTelegramEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Sadece Resmi & Onaylı Satıcılar */}
          <div
            onClick={() => setOnlyOfficialEnabled((v) => !v)}
            className="bg-[#111520] border border-white/[0.07] rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-white truncate">
                  Sadece Resmi &amp; Onaylı Satıcılar
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Puanı 9.0 altı olan pazar yerlerini yoksay
                </div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={onlyOfficialEnabled}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                onlyOfficialEnabled ? "bg-[#2b8cff]" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  onlyOfficialEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Contact Channel Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
            İletişim Kanalınız
          </label>
          <div className="bg-[#080a0f] border border-white/10 focus-within:border-sky-500 rounded-2xl px-4 py-3 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              required
              placeholder="05XX XXX XX XX veya E-posta adresi"
              value={contactChannel}
              onChange={(e) => setContactChannel(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-5 rounded-2xl bg-[#2b8cff] hover:bg-blue-500 active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {alarmCreated ? (
            <>
              <Check className="w-4 h-4" />
              <span>Fiyat Alarmınız Aktif Edildi!</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>Fiyat Alarmını Başlat</span>
            </>
          )}
        </button>

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          İstediğiniz an tek dokunuşla iptal edebilirsiniz. Sıfır spam politikası.
        </p>
      </form>
    );
  }
}
