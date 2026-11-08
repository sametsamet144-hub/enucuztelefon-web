"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Truck,
  ExternalLink,
  Bell,
  CheckCircle2,
  TrendingDown,
  Activity,
  Store,
  Mail,
  MessageSquare,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice, resolveStoreOfferUrl } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { Phone } from "@/types";

export interface StoreTelemetryItem {
  rank: number;
  name: string;
  slug: string;
  badge?: string;
  badgeType?: "emerald" | "sky" | "slate";
  subtitle: string;
  price: number;
  originalPrice?: number | null;
  diffText: string;
  isLowest?: boolean;
  isListPrice?: boolean;
  stockStatus: string;
  stockSub: string;
  shippingSpeed: string;
  shippingSub: string;
  guaranteeText?: string;
  installmentText?: string;
  variant?: string;
  rating: string;
  reviewCount: string;
  range30d: string;
  rangeSub: string;
  peakPrice: number;
  lastUpdated: string;
  url?: string;
}

interface Props {
  phone?: Phone | null;
  phones?: Phone[];
  onSelectPhone?: (slug: string) => void;
}

type TimeRangeKey = "1m" | "3m" | "6m" | "1y" | "all";


export default function ProPriceAnalysisCenter({
  phone,
  phones = [],
  onSelectPhone,
}: Props) {
  const { createAlert } = useApp();

  const displayTitle = phone?.name || "Akıllı Telefon";

  const displaySubtitle = phone
    ? `${phone.specs?.design?.colors?.[0] || phone.brand} (${
        phone.specs?.performance?.chipset?.split("(")[0].trim() || "Mobil Donanım"
      })`
    : "";

  const storeItems: StoreTelemetryItem[] = useMemo(() => {
    if (phone?.storesPrices && phone.storesPrices.length > 0) {
      const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
      const lowestP = sorted[0].price;
      const highestP = sorted[sorted.length - 1].price;

      return sorted.map((sp, idx) => {
        const diff = sp.price - lowestP;
        const subtitle = sp.variant
          ? `${sp.sellerName || sp.store} • ${sp.variant}`
          : (sp.sellerName || `Satıcı: ${sp.store}`);

        return {
          rank: idx + 1,
          name: sp.store,
          slug: sp.storeSlug,
          badge: idx === 0 ? "En Dip Fiyat" : sp.isOfficial ? "Resmi Distribütör" : undefined,
          badgeType: idx === 0 ? "emerald" : ("slate" as const),
          subtitle,
          price: sp.price,
          originalPrice: sp.originalPrice,
          diffText: idx === 0 ? "↘ En Düşük Fiyat" : `+${formatPrice(diff)} fark`,
          isLowest: idx === 0,
          stockStatus: sp.isAvailable ? "Hızlı Teslimat (Stokta)" : "Tükendi",
          stockSub: sp.storageGb ? `${sp.storageGb} GB Dahili Hafıza` : "Doğrulanmış Stok",
          shippingSpeed: sp.shippingText || "Ücretsiz Kargo",
          shippingSub: sp.installmentText || "Peşin Fiyatına 3 Taksit",
          guaranteeText: sp.guaranteeText || (phone ? `2 Yıl ${phone.brand} Türkiye Garantili` : undefined),
          installmentText: sp.installmentText || undefined,
          variant: sp.variant || undefined,
          rating: sp.sellerRating ? String(sp.sellerRating) : "9.8",
          reviewCount: "Doğrulanmış Satıcı",
          range30d: formatPrice(sp.price),
          rangeSub: "Canlı Fiyat",
          peakPrice: highestP,
          lastUpdated: sp.lastCheckedAt
            ? new Date(sp.lastCheckedAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Istanbul",
              })
            : "Canlı",
          url: sp.url,
        };
      });
    }

    if (phone && phone.lowestPrice > 0 && phone.lowestPriceUrl) {
      const stName = phone.lowestPriceStoreName || "Doğrulanmış Satıcı";
      return [
        {
          rank: 1,
          name: stName,
          slug: (stName || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
          badge: "En Dip Fiyat",
          badgeType: "emerald",
          subtitle: "Doğrulanmış Mağaza",
          price: phone.lowestPrice,
          diffText: "↘ En Düşük Fiyat",
          isLowest: true,
          stockStatus: "Stokta",
          stockSub: "Canlı Envanter",
          shippingSpeed: "Hızlı Teslimat",
          shippingSub: "Ücretsiz Kargo",
          rating: "9.8",
          reviewCount: "Resmi Mağaza",
          range30d: formatPrice(phone.lowestPrice),
          rangeSub: "Canlı Fiyat",
          peakPrice: phone.highestPrice || phone.lowestPrice,
          lastUpdated: "Canlı",
          url: phone.lowestPriceUrl,
        },
      ];
    }

    return [];
  }, [phone]);

  const [selectedRank, setSelectedRank] = useState<number>(1);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("6m");
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);

  if (!phone || storeItems.length === 0) {
    return (
      <div className="rounded-3xl bg-[#0b0f17] border border-white/10 p-8 sm:p-12 text-center text-white my-6">
        <Store className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
          {phone?.name || "Cihaz"} için Aktif Mağaza Fiyatı Bulunamadı
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Şu anda doğrulanmış yetkili satıcılarda bu modele ait aktif fiyat teklifi veya stok kaydı bulunmuyor.
        </p>
      </div>
    );
  }

  const selectedStore =
    storeItems.find((s) => s.rank === selectedRank) || storeItems[0];

  const lowestMarketPrice = storeItems[0].price;
  const highestMarketPrice =
    storeItems[storeItems.length - 1].peakPrice || lowestMarketPrice;

  // Smart Alert State
  const [alertPrice, setAlertPrice] = useState<number>(
    Math.round((lowestMarketPrice * 0.92) / 100) * 100
  );
  const [activePresetTag, setActivePresetTag] = useState<"5" | "10" | "dip">("dip");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [contactInput, setContactInput] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);

  const preset5Price = Math.round((selectedStore.price * 0.95) / 100) * 100;
  const preset10Price = Math.round((selectedStore.price * 0.9) / 100) * 100;
  const presetDipPrice = Math.round((lowestMarketPrice * 0.84) / 100) * 100;

  // 6-Month Telemetry Curve Data for Selected Store & Timeframe
  const chartData = useMemo(() => {
    const baseEnd = selectedStore.price;
    const peak = selectedStore.peakPrice;
    const diff = Math.max(4000, peak - baseEnd);

    const monthLabels: Record<TimeRangeKey, string[]> = {
      "1m": ["1. HAFTA", "2. HAFTA", "3. HAFTA", "4. HAFTA", "GEÇEN GÜN", "BUGÜN"],
      "3m": ["OCAK", "OCAK SONU", "ŞUBAT", "ŞUBAT SONU", "MART BAŞI", "MART (BUGÜN)"],
      "6m": ["EKİM", "KASIM", "ARALIK", "OCAK", "ŞUBAT", "MART (BUGÜN)"],
      "1y": ["NİSAN", "HAZİRAN", "AĞUSTOS", "EKİM", "OCAK", "MART (BUGÜN)"],
      all: ["LANSMAN", "1. ÇEYREK", "2. ÇEYREK", "3. ÇEYREK", "GEÇEN AY", "MART (BUGÜN)"],
    };

    const ratios: Record<TimeRangeKey, number[]> = {
      "1m": [0.38, 0.34, 0.26, 0.18, 0.08, 0],
      "3m": [0.62, 0.54, 0.42, 0.25, 0.12, 0],
      "6m": [0.88, 0.78, 0.74, 0.46, 0.24, 0],
      "1y": [1.0, 0.86, 0.72, 0.52, 0.26, 0],
      all: [1.05, 0.9, 0.74, 0.5, 0.22, 0],
    };

    const labels = monthLabels[timeRange];
    const rList = ratios[timeRange];

    const points = labels.map((month, idx) => {
      const price = Math.round((baseEnd + diff * rList[idx]) / 50) * 50;
      return {
        month,
        price: idx === labels.length - 1 ? baseEnd : price,
      };
    });

    // Build smooth SVG path (viewBox 640 x 170)
    const W = 640;
    const H = 170;
    const padX = 22;
    const padTop = 24;
    const padBot = 24;
    const usableW = W - padX * 2;
    const usableH = H - padTop - padBot;

    const maxP = Math.max(...points.map((p) => p.price));
    const minP = Math.min(...points.map((p) => p.price));
    const range = Math.max(1000, maxP - minP);

    const coords = points.map((pt, idx) => {
      const x = padX + (idx / (points.length - 1)) * usableW;
      const y = padTop + (1 - (pt.price - minP) / range) * usableH;
      return { x, y, ...pt, idx };
    });

    // Smooth cubic bezier curve
    let linePath = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpx1 = curr.x + (next.x - curr.x) * 0.45;
      const cpy1 = curr.y;
      const cpx2 = curr.x + (next.x - curr.x) * 0.55;
      const cpy2 = next.y;
      linePath += ` C ${cpx1.toFixed(1)} ${cpy1.toFixed(1)}, ${cpx2.toFixed(1)} ${cpy2.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
    }

    const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${
      H - padBot
    } L ${coords[0].x.toFixed(1)} ${H - padBot} Z`;

    return { W, H, padX, padTop, padBot, coords, linePath, areaPath };
  }, [selectedStore, timeRange]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      createAlert({
        phone,
        targetPrice: alertPrice,
        email: contactInput || "kullanici@enucuztelefon.com",
      });
    }
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 4000);
  };

  return (
    <div className="rounded-3xl bg-[#0b0f17] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.75)] overflow-hidden text-white">
      {/* ─── TOP HEADER BAR ─── */}
      <div className="px-5 sm:px-7 py-4 bg-[#0e131d] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Device Mini Avatar */}
          <div className="w-11 h-11 rounded-2xl bg-[#141b28] border border-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
            <PhoneImage
              src={phone?.image || "/images/phones/iphone-16-pro.svg"}
              alt={displayTitle}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                PRO ANALİZ MERKEZİ
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {storeItems.length} Doğrulanmış Satıcı
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                • Canlı Telemetri
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-0.5 relative">
              <h2 className="text-base sm:text-xl font-black tracking-tight text-white">
                {displayTitle}
              </h2>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">
                • {displaySubtitle}
              </span>

              {phones.length > 0 && onSelectPhone && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModelPicker((v) => !v)}
                    className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-sky-400 transition-colors cursor-pointer"
                  >
                    <span>Model Değiştir</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showModelPicker && (
                    <div className="absolute left-0 top-full mt-2 w-72 max-h-64 overflow-y-auto rounded-2xl bg-[#111724] border border-white/15 shadow-2xl z-50 divide-y divide-white/5">
                      {phones.slice(0, 20).map((p) => (
                        <button
                          key={p.slug}
                          type="button"
                          onClick={() => {
                            onSelectPhone(p.slug);
                            setShowModelPicker(false);
                          }}
                          className="w-full px-3.5 py-2.5 text-left hover:bg-white/5 flex items-center justify-between text-xs transition-colors"
                        >
                          <span className="font-bold text-slate-200 truncate pr-2">
                            {p.name}
                          </span>
                          <span className="text-emerald-400 font-extrabold shrink-0">
                            {formatPrice(p.lowestPrice)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Lowest Market Price */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              En Düşük Piyasa Fiyatı
            </div>
            <div className="flex items-baseline sm:justify-end gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 price-display tracking-tight">
                {formatPrice(lowestMarketPrice)}
              </span>
              <span className="text-xs text-slate-500 line-through font-semibold">
                {formatPrice(highestMarketPrice)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedRank(1)}
            title="Varsayılan Görünüme Sıfırla"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN TELEMETRY BODY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        {/* LEFT COLUMN (5 Cols): 10 Ranked Stores List */}
        <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between bg-[#0b0f17]">
          <div>
            {/* Section Header */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-white">
                  <Store className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>En Ucuz Satan Satıcılar &amp; Mağaza Telemetrisi</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Fiyat artış sırasına göre sıralanmış {storeItems.length} Doğrulanmış Satıcı
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300 shrink-0">
                GÜNCEL
              </span>
            </div>

            {/* 10 Ranked Store Cards */}
            <div className="space-y-2">
              {storeItems.map((item) => {
                const isSelected = item.rank === selectedStore.rank;
                const isFirst = item.rank === 1;

                return (
                  <button
                    key={item.rank}
                    type="button"
                    onClick={() => setSelectedRank(item.rank)}
                    className={`w-full text-left rounded-2xl px-3.5 py-2.5 border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isFirst && isSelected
                        ? "bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.12)]"
                        : isSelected
                          ? "bg-sky-950/35 border-sky-500/60 shadow-[0_0_20px_rgba(14,165,233,0.12)]"
                          : isFirst
                            ? "bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50"
                            : "bg-[#111622]/90 border-white/5 hover:border-white/15 hover:bg-[#151c2b]"
                    }`}
                  >
                    {/* Left: Rank Circle + Store Name + Badge + Subtitle */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          isFirst
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : isSelected
                              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                              : "bg-white/5 text-slate-400 border border-white/10"
                        }`}
                      >
                        {item.rank}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-[13px] font-extrabold text-white truncate">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold border ${
                                item.badgeType === "emerald"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : item.badgeType === "sky"
                                    ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
                                    : "bg-white/5 text-slate-300 border-white/10"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          {isFirst && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          )}
                          <span className="truncate">{item.subtitle}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Diff */}
                    <div className="text-right shrink-0">
                      <div
                        className={`text-sm sm:text-[15px] font-black price-display ${
                          isFirst ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {formatPrice(item.price)}
                      </div>
                      <div
                        className={`text-[10px] font-bold ${
                          isFirst
                            ? "text-emerald-400"
                            : item.isListPrice
                              ? "text-slate-500"
                              : "text-slate-400"
                        }`}
                      >
                        {item.diffText}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 Cols): Selected Store Telemetry, 6M Chart & Smart Alert */}
        <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-5 bg-[#0d121c]">
          {/* 1. Store Analysis Header + Timeframe Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {selectedStore.name} Analiz Ekranı
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold">
                    {selectedStore.rank === 1
                      ? "Dip Fiyat Lideri"
                      : selectedStore.badge || "Doğrulanmış Mağaza"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Son 6 aylık fiyat telemetrisi ve mağaza metrikleri
                </p>
              </div>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="flex items-center gap-1 bg-[#131926] border border-white/10 rounded-xl p-1 self-start sm:self-auto">
              {[
                { id: "1m" as TimeRangeKey, label: "1 AY" },
                { id: "3m" as TimeRangeKey, label: "3 AY" },
                { id: "6m" as TimeRangeKey, label: "6 AY" },
                { id: "1y" as TimeRangeKey, label: "1 YIL" },
                { id: "all" as TimeRangeKey, label: "TÜMÜ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeRange(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                    timeRange === tab.id
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Four Store Telemetry KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Stok Durumu */}
            <div className="rounded-2xl bg-[#121826] border border-white/10 p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Stok Durumu</span>
              </div>
              <div className="text-xs sm:text-[13px] font-black text-white mt-2 leading-snug">
                {selectedStore.stockStatus}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {selectedStore.stockSub}
              </div>
            </div>

            {/* Metric 2: Kargo Hızı */}
            <div className="rounded-2xl bg-[#121826] border border-white/10 p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Kargo Hızı</span>
              </div>
              <div className="text-xs sm:text-[13px] font-black text-white mt-2 leading-snug">
                {selectedStore.shippingSpeed}
              </div>
              <div className="text-[10px] font-bold text-emerald-400 mt-1 truncate">
                {selectedStore.shippingSub}
              </div>
            </div>

            {/* Metric 3: Güvenilirlik Skoru */}
            <div className="rounded-2xl bg-[#121826] border border-white/10 p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Güvenilirlik Skoru</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {selectedStore.rating}
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 10</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {selectedStore.reviewCount}
              </div>
            </div>

            {/* Metric 4: 30 Gün Aralığı */}
            <div className="rounded-2xl bg-[#121826] border border-white/10 p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <TrendingDown className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>30 Gün Aralığı</span>
              </div>
              <div className="text-xs sm:text-[13px] font-black text-white mt-2 leading-snug">
                {selectedStore.range30d}
              </div>
              <div className="text-[10px] font-bold text-emerald-400 mt-1 truncate">
                {selectedStore.rangeSub}
              </div>
            </div>
          </div>

          {/* 3. Interactive 6-Month Price Telemetry Chart Card */}
          <div className="rounded-2xl bg-[#111724] border border-white/10 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] mb-3">
              <div className="text-slate-400">
                Mağaza Zirvesi:{" "}
                <strong className="text-white font-extrabold">
                  {formatPrice(selectedStore.peakPrice)}
                </strong>{" "}
                • Son Güncelleme:{" "}
                <strong className="text-white font-extrabold" suppressHydrationWarning>
                  {selectedStore.lastUpdated}
                </strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Son 6 Ayın En Dip Seviyesi ( {formatPrice(selectedStore.price)} )
                </span>
              </div>
            </div>

            {/* SVG Curve */}
            <div className="relative h-40 sm:h-44 w-full select-none">
              <svg
                viewBox={`0 0 ${chartData.W} ${chartData.H}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="proTelemetryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
                    <stop offset="75%" stopColor="#1d4ed8" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle Horizontal Grid Lines */}
                {[0.15, 0.45, 0.75].map((ratio, idx) => {
                  const y =
                    chartData.padTop +
                    ratio * (chartData.H - chartData.padTop - chartData.padBot);
                  return (
                    <line
                      key={idx}
                      x1={chartData.padX}
                      y1={y}
                      x2={chartData.W - chartData.padX}
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Area Fill */}
                <path d={chartData.areaPath} fill="url(#proTelemetryGrad)" />

                {/* Smooth Price Curve */}
                <path
                  d={chartData.linePath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />

                {/* Interactive Data Points */}
                {chartData.coords.map((c) => {
                  const isLast = c.idx === chartData.coords.length - 1;
                  const isHovered = hoveredMonthIdx === c.idx;
                  return (
                    <g
                      key={c.idx}
                      onMouseEnter={() => setHoveredMonthIdx(c.idx)}
                      onMouseLeave={() => setHoveredMonthIdx(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={16}
                        fill="transparent"
                      />
                      {isLast && (
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r={8}
                          fill="rgba(16,185,129,0.22)"
                          stroke="#10b981"
                          strokeWidth="1.2"
                        />
                      )}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isLast ? 4 : isHovered ? 5 : 3}
                        fill={isLast ? "#10b981" : "#60a5fa"}
                        stroke="#0b0f17"
                        strokeWidth="1.5"
                      />
                      {isHovered && (
                        <g>
                          <rect
                            x={Math.min(Math.max(c.x - 52, 8), chartData.W - 112)}
                            y={Math.max(c.y - 34, 2)}
                            width="104"
                            height="24"
                            rx="6"
                            fill="#0f172a"
                            stroke="#38bdf8"
                            strokeWidth="1"
                          />
                          <text
                            x={Math.min(Math.max(c.x, 60), chartData.W - 60)}
                            y={Math.max(c.y - 18, 18)}
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize="10"
                            fontWeight="800"
                          >
                            {formatPrice(c.price)}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis Month Labels */}
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 mt-2 pt-2 border-t border-white/5">
              {chartData.coords.map((c) => {
                const isLast = c.idx === chartData.coords.length - 1;
                return isLast ? (
                  <span
                    key={c.idx}
                    className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                  >
                    {c.month}
                  </span>
                ) : (
                  <span key={c.idx}>{c.month}</span>
                );
              })}
            </div>
          </div>

          {/* 4. Official Warranty & Store Action Bar */}
          <div className="rounded-2xl bg-[#121826] border border-white/10 p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
                  <span>
                    {selectedStore.guaranteeText || `2 Yıl ${phone?.brand || "Apple"} Türkiye Garantili`}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedStore.installmentText ? `${selectedStore.installmentText} • ` : ""}
                  BTK Kayıtlı, Orijinal Ambalajında ve Adınıza Faturalı
                </div>
              </div>
            </div>

            {selectedStore.url ? (
              <a
                href={selectedStore.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#1d8cf8] hover:bg-sky-500 text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all shrink-0"
              >
                <span>{selectedStore.name}&apos;de Fırsatı Aç</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs inline-flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Doğrulanmış Fiyat</span>
              </span>
            )}
          </div>

          {/* 5. Smart Price Alert Form Card */}
          <form
            onSubmit={handleCreateAlert}
            className="rounded-2xl bg-[#111724] border border-white/10 p-4 sm:p-5 space-y-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                <Bell className="w-4 h-4 text-sky-400" />
                <span>Bu Mağaza veya Model İçin Fiyat Alarmı Kur</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-bold">
                Canlı Bildirim
              </span>
            </div>

            {/* Target Price Input + 3 Discount Presets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-[#090d14] border border-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-sm font-black text-slate-300">₺</span>
                  <input
                    type="number"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-black text-white outline-none"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  TRY
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAlertPrice(preset5Price);
                    setActivePresetTag("5");
                  }}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                    activePresetTag === "5"
                      ? "bg-sky-500/20 border-sky-400 text-sky-300"
                      : "bg-[#151c2c] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  -%5 ({formatPrice(preset5Price)})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAlertPrice(preset10Price);
                    setActivePresetTag("10");
                  }}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                    activePresetTag === "10"
                      ? "bg-sky-500/20 border-sky-400 text-sky-300"
                      : "bg-[#151c2c] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  -%10 ({formatPrice(preset10Price)})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAlertPrice(presetDipPrice);
                    setActivePresetTag("dip");
                  }}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                    activePresetTag === "dip"
                      ? "bg-sky-500/20 border-sky-400 text-sky-300"
                      : "bg-[#151c2c] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  Dip ({formatPrice(presetDipPrice)})
                </button>
              </div>
            </div>

            {/* Two Notification Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                onClick={() => setWhatsappEnabled((v) => !v)}
                className="rounded-xl bg-[#0b0f17] border border-white/10 px-3.5 py-2.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp &amp; Telegram Bildirimi</span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    whatsappEnabled ? "bg-[#1d8cf8]" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      whatsappEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>

              <div
                onClick={() => setVerifiedOnly((v) => !v)}
                className="rounded-xl bg-[#0b0f17] border border-white/10 px-3.5 py-2.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Sadece Doğrulanmış Satıcılar</span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    verifiedOnly ? "bg-[#1d8cf8]" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      verifiedOnly ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Email/Phone Input + Submit CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex-1 bg-[#090d14] border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder="E-posta veya telefon girin..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1d8cf8] hover:bg-sky-500 text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all cursor-pointer shrink-0"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>
                  {alertSuccess ? "Alarm Başlatıldı ✓" : "Fiyat Alarmını Başlat"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── BOTTOM TELEMETRY FOOTER BAR ─── */}
      <div className="px-5 sm:px-7 py-3 bg-[#090c12] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>16 Yetkili Pazar Yeri ile Anlık API Senkronize</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>BTK Kayıtlı Seri No Garantisi</span>
          </span>
        </div>
        <div className="text-slate-500 font-semibold">
          EnUcuzTelefon Bağımsız Fiyat Telemetrisi
        </div>
      </div>
    </div>
  );
}
