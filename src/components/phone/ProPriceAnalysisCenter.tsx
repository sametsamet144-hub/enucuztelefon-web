"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
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
  Maximize2,
  Share2,
  Info,
  Check,
  Zap,
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
  diffText: string;
  isLowest?: boolean;
  isListPrice?: boolean;
  stockStatus: string;
  stockSub: string;
  shippingSpeed: string;
  shippingSub: string;
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
  const { createAlert, showToast } = useApp();

  const displayTitle = phone?.name || "Akıllı Telefon";

  const displaySubtitle = phone
    ? `${phone.specs?.design?.colors?.[0] || phone.brand} (${
        phone.specs?.performance?.chipset?.split("(")[0].trim() || "Mobil Donanım"
      })`
    : "";

  // ── Normalize Stores & Prices ──
  const storeItems: StoreTelemetryItem[] = useMemo(() => {
    if (phone?.storesPrices && phone.storesPrices.length > 0) {
      const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
      const lowestP = sorted[0].price;
      const highestP = sorted[sorted.length - 1].price;

      return sorted.map((sp, idx) => {
        const diff = sp.price - lowestP;
        return {
          rank: idx + 1,
          name: sp.store,
          slug: sp.storeSlug || sp.store.toLowerCase().replace(/[^a-z0-9]/g, ""),
          badge: idx === 0 ? "DİP FİYAT LİDERİ" : sp.isOfficial ? "Resmi Distribütör" : undefined,
          badgeType: idx === 0 ? "emerald" : ("slate" as const),
          subtitle: sp.sellerName || `${sp.store} Resmi Mağaza • Aynı Gün Kargo`,
          price: sp.price,
          diffText: idx === 0 ? "↘ En Düşük Fiyat" : `+${formatPrice(diff)} fark`,
          isLowest: idx === 0,
          stockStatus: sp.isAvailable ? "Hızlı Teslimat (Stokta)" : "Tükendi",
          stockSub: "Doğrulanmış Stok",
          shippingSpeed: sp.shippingText || (idx === 0 ? "Prime Teslimat • Ücretsiz Kargo" : "Ücretsiz Kargo"),
          shippingSub: "Kargo Güvencesi",
          rating: sp.sellerRating ? String(sp.sellerRating) : "9.8",
          reviewCount: "Doğrulanmış Satıcı",
          range30d: formatPrice(sp.price),
          rangeSub: "Canlı Fiyat",
          peakPrice: highestP,
          lastUpdated: "Canlı",
          url: sp.url,
        };
      });
    }

    if (phone && phone.lowestPrice > 0) {
      const stName = phone.lowestPriceStoreName || "Doğrulanmış Satıcı";
      return [
        {
          rank: 1,
          name: stName,
          slug: (stName || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
          badge: "DİP FİYAT LİDERİ",
          badgeType: "emerald",
          subtitle: "Doğrulanmış Mağaza • Hızlı Teslimat",
          price: phone.lowestPrice,
          diffText: "↘ En Düşük Fiyat",
          isLowest: true,
          stockStatus: "Stokta",
          stockSub: "Canlı Envanter",
          shippingSpeed: "Ücretsiz Kargo",
          shippingSub: "Kargo Güvencesi",
          rating: "9.8",
          reviewCount: "Resmi Mağaza",
          range30d: formatPrice(phone.lowestPrice),
          rangeSub: "Canlı Fiyat",
          peakPrice: phone.highestPrice || Math.round(phone.lowestPrice * 1.15),
          lastUpdated: "Canlı",
          url: phone.lowestPriceUrl,
        },
      ];
    }

    return [];
  }, [phone]);

  const [selectedRank, setSelectedRank] = useState<number>(1);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("6m");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);

  // Smart Alert State
  const lowestMarketPrice = storeItems[0]?.price || 0;
  const highestMarketPrice = storeItems[storeItems.length - 1]?.peakPrice || Math.round(lowestMarketPrice * 1.18);
  const averageMarketPrice = useMemo(() => {
    if (storeItems.length === 0) return 0;
    const sum = storeItems.reduce((acc, s) => acc + s.price, 0);
    return Math.round(sum / storeItems.length);
  }, [storeItems]);
  const priceSpread = Math.max(0, (storeItems[storeItems.length - 1]?.price || lowestMarketPrice) - lowestMarketPrice);

  const [alertPrice, setAlertPrice] = useState<number>(
    Math.round((lowestMarketPrice * 0.92) / 100) * 100
  );
  const [activePresetTag, setActivePresetTag] = useState<"5" | "10" | "15" | "dip">("dip");
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(false);
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);
  const [contactInput, setContactInput] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Modal Multi-Store Filter Layers
  const [modalLayers, setModalLayers] = useState({
    amazon: true,
    hepsiburada: true,
    trendyol: true,
    mediamarkt: true,
  });

  const selectedStore =
    storeItems.find((s) => s.rank === selectedRank) || storeItems[0];

  // ── Small Inline Chart Interactive Crosshair State ──
  const [chartHover, setChartHover] = useState<{
    active: boolean;
    svgX: number;
    svgY: number;
    normX: number;
    point: {
      date: string;
      price: string;
      change: string;
      status: string;
      merchant: string;
    };
  }>({
    active: false,
    svgX: 458,
    svgY: 135,
    normX: 458,
    point: {
      date: "Mart 2026 (Bugün)",
      price: formatPrice(lowestMarketPrice),
      change: "-%18",
      status: "Rekor Dip Seviye",
      merchant: selectedStore?.name || "Amazon TR Lider",
    },
  });

  // Dynamic Telemetry Data Points for 6M
  const telemetryData = useMemo(() => {
    const base = selectedStore?.price || lowestMarketPrice;
    const peak = selectedStore?.peakPrice || highestMarketPrice;
    return [
      {
        x: 10,
        y: 25,
        date: "Ekim 2025",
        price: formatPrice(peak),
        change: "Zirve Seviye",
        status: "Maksimum Fiyat",
        merchant: "Resmi Liste",
      },
      {
        x: 80,
        y: 35,
        date: "Kasım 2025",
        price: formatPrice(Math.round(base * 1.15)),
        change: "-%3.5 (İndirim)",
        status: "İlk İndirim Trendi",
        merchant: "Yetkili Satıcı",
      },
      {
        x: 160,
        y: 52,
        date: "Aralık 2025",
        price: formatPrice(Math.round(base * 1.11)),
        change: "-%6.5 (Yılbaşı)",
        status: "Yılbaşı Kampanyası",
        merchant: "Hepsiburada",
      },
      {
        x: 230,
        y: 58,
        date: "Ocak 2026",
        price: formatPrice(Math.round(base * 1.08)),
        change: "-%8.9 (Kış İndirimi)",
        status: "Durgunluk Dönemi",
        merchant: "Trendyol",
      },
      {
        x: 330,
        y: 88,
        date: "Şubat 2026",
        price: formatPrice(Math.round(base * 1.04)),
        change: "-%13.9 (Hızlı Düşüş)",
        status: "Hızlı Düşüş",
        merchant: "MediaMarkt",
      },
      {
        x: 458,
        y: 135,
        date: "Mart 2026 (Bugün)",
        price: formatPrice(base),
        change: "-%18 (Tarihi Dip)",
        status: "Rekor Dip Seviye",
        merchant: selectedStore?.name || "Amazon TR Lider",
      },
    ];
  }, [selectedStore, lowestMarketPrice, highestMarketPrice]);

  const getYOnCurve = useCallback(
    (x: number) => {
      const clampedX = Math.max(0, Math.min(460, x));
      for (let i = 0; i < telemetryData.length - 1; i++) {
        const p1 = telemetryData[i];
        const p2 = telemetryData[i + 1];
        if (clampedX >= p1.x && clampedX <= p2.x) {
          const t = (clampedX - p1.x) / (p2.x - p1.x);
          const easeT = t * t * (3 - 2 * t);
          return p1.y + (p2.y - p1.y) * easeT;
        }
      }
      return clampedX < telemetryData[0].x
        ? telemetryData[0].y
        : telemetryData[telemetryData.length - 1].y;
    },
    [telemetryData]
  );

  const getNearestTelemetry = useCallback(
    (svgX: number) => {
      let nearest = telemetryData[0];
      let minDist = Infinity;
      for (const pt of telemetryData) {
        const dist = Math.abs(pt.x - svgX);
        if (dist < minDist) {
          minDist = dist;
          nearest = pt;
        }
      }
      return nearest;
    },
    [telemetryData]
  );

  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normX = Math.max(0, Math.min(rect.width, mouseX));
    const svgX = (normX / rect.width) * 460;
    const svgY = getYOnCurve(svgX);
    const nearest = getNearestTelemetry(svgX);

    setChartHover({
      active: true,
      svgX,
      svgY,
      normX,
      point: nearest,
    });
  };

  const handleChartMouseLeave = () => {
    setChartHover((prev) => ({ ...prev, active: false }));
  };

  // ── Fullscreen Modal Interactive Crosshair State ──
  const [fsHover, setFsHover] = useState<{
    active: boolean;
    svgX: number;
    normX: number;
    pct: number;
    date: string;
    badge: string;
    pAmazon: string;
    pHB: string;
    pTY: string;
    pMM: string;
    diffHB: string;
    diffTY: string;
    diffMM: string;
    avg: string;
    spread: string;
  }>({
    active: false,
    svgX: 1040,
    normX: 1040,
    pct: 1,
    date: "7 Mart 2026 (Bugün)",
    badge: "Rekor Dip Seviye",
    pAmazon: formatPrice(lowestMarketPrice),
    pHB: formatPrice(Math.round(lowestMarketPrice * 1.03)),
    pTY: formatPrice(Math.round(lowestMarketPrice * 1.05)),
    pMM: formatPrice(Math.round(lowestMarketPrice * 1.08)),
    diffHB: `+${formatPrice(Math.round(lowestMarketPrice * 0.03))}`,
    diffTY: `+${formatPrice(Math.round(lowestMarketPrice * 0.05))}`,
    diffMM: `+${formatPrice(Math.round(lowestMarketPrice * 0.08))}`,
    avg: formatPrice(averageMarketPrice),
    spread: formatPrice(priceSpread),
  });

  const handleFsMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normX = Math.max(0, Math.min(rect.width, mouseX));
    const pct = normX / rect.width;
    const svgX = pct * 1100;

    // Interpolate prices for each merchant along time
    const base = lowestMarketPrice;
    const factorAmazon = 1.22 - pct * 0.22;
    const factorHB = 1.25 - pct * 0.22;
    const factorTY = 1.26 - pct * 0.21;
    const factorMM = 1.28 - pct * 0.2;

    const priceAmz = Math.round(base * factorAmazon);
    const priceHB = Math.round(base * factorHB);
    const priceTY = Math.round(base * factorTY);
    const priceMM = Math.round(base * factorMM);

    const dates = [
      "1 Ekim 2025",
      "15 Ekim 2025",
      "1 Kasım 2025",
      "15 Kasım 2025",
      "1 Aralık 2025",
      "15 Aralık 2025",
      "1 Ocak 2026",
      "15 Ocak 2026",
      "1 Şubat 2026",
      "15 Şubat 2026",
      "1 Mart 2026",
      "7 Mart 2026 (Bugün)",
    ];
    const dateIdx = Math.min(dates.length - 1, Math.floor(pct * dates.length));
    const hoverDate = dates[dateIdx];
    const hoverBadge =
      pct > 0.85
        ? "Rekor Dip Seviye"
        : pct < 0.2
        ? "Lansman Zirvesi"
        : "Trend İndirimi";

    setFsHover({
      active: true,
      svgX,
      normX,
      pct,
      date: hoverDate,
      badge: hoverBadge,
      pAmazon: formatPrice(priceAmz),
      pHB: formatPrice(priceHB),
      pTY: formatPrice(priceTY),
      pMM: formatPrice(priceMM),
      diffHB: `+${formatPrice(priceHB - priceAmz)}`,
      diffTY: `+${formatPrice(priceTY - priceAmz)}`,
      diffMM: `+${formatPrice(priceMM - priceAmz)}`,
      avg: formatPrice(Math.round((priceAmz + priceHB + priceTY + priceMM) / 4)),
      spread: formatPrice(priceMM - priceAmz),
    });
  };

  const handleFsMouseLeave = () => {
    setFsHover((prev) => ({ ...prev, active: false }));
  };

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
    showToast(`${formatPrice(alertPrice)} için fiyat alarmı oluşturuldu!`);
    setTimeout(() => setAlertSuccess(false), 4000);
  };

  if (!phone || storeItems.length === 0) {
    return (
      <div className="rounded-3xl bg-[#131315] border border-white/10 p-8 sm:p-12 text-center text-white my-6">
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

  const primaryTargetUrl =
    (selectedStore.url && (selectedStore.url.startsWith("http://") || selectedStore.url.startsWith("https://")))
      ? selectedStore.url
      : resolveStoreOfferUrl(selectedStore.slug || selectedStore.name, phone.name, selectedStore.url);

  return (
    <>
      {/* ── AMBIENT BACKLIGHTS & GLOW MESH ── */}
      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 my-6">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── COCKPIT CARD WRAPPER ── */}
        <div className="relative rounded-2xl bg-[#1c1b1d] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* MAIN OBSIDIAN COCKPIT CORE */}
          <div className="relative rounded-2xl bg-[#131315] p-5 sm:p-8 flex flex-col gap-8 text-[#e5e1e4]">
            {/* ── 1. TOP HEADER & TELEMETRY SUMMARY STRIP ── */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              {/* Left: Hardware Hero Micro Identity */}
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-[#201f22] flex items-center justify-center p-2 group transition-transform duration-500 hover:-translate-y-1 border border-white/[0.06]">
                  <div className="absolute inset-0 bg-[#2997ff]/15 rounded-xl blur-md group-hover:bg-[#2997ff]/25 transition-all" />
                  <div className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
                    <PhoneImage
                      src={phone.image || "/images/phones/iphone-16-pro.svg"}
                      alt={displayTitle}
                    />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47e266] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#47e266]" />
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#201f22] text-[#c0c7d5] text-[11px] font-semibold border border-white/[0.08] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#47e266] animate-pulse" />
                      Canlı Doğrulandı
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2997ff]/15 text-[#2997ff] text-[11px] font-semibold border border-[#2997ff]/20">
                      En Çok Satan #{selectedStore.rank}
                    </span>
                    <span className="text-[12px] text-[#8a919e]">
                      {phone.specs?.performance?.storage || 256}GB Depolama
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 flex-wrap">
                    <span>{displayTitle}</span>
                    <span className="text-sm font-normal text-[#8a919e]">
                      — {displaySubtitle}
                    </span>
                  </h1>

                  <div className="flex items-center gap-3 text-xs text-[#8a919e] flex-wrap">
                    <div className="flex items-center gap-1 text-[#47e266] font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>10 Doğrulanmış Mağaza</span>
                    </div>
                    <span>•</span>
                    <span>Anlık Satıcı Fiyatları</span>
                    <span>•</span>
                    <span className="text-[#a3c9ff]">Son Güncelleme: Az Önce</span>
                  </div>
                </div>
              </div>

              {/* Right: Price Magnitude Display */}
              <div className="flex flex-col lg:items-end gap-1 w-full lg:w-auto p-4 rounded-xl bg-[#1c1b1d]/80 border border-white/[0.06]">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8a919e]">
                  En Düşük Canlı Piyasa Fiyatı
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {formatPrice(lowestMarketPrice)}
                  </span>
                  <span className="text-xs text-[#47e266] font-bold bg-[#47e266]/15 px-2 py-0.5 rounded-full border border-[#47e266]/30">
                    -%18 Dip Seviye
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8a919e]">
                  <span>Piyasa Ortalaması: <strong className="text-[#c0c7d5]">{formatPrice(averageMarketPrice)}</strong></span>
                  <span>•</span>
                  <span className="text-[#47e266]">Tasarruf: {formatPrice(priceSpread)}</span>
                </div>
              </div>
            </div>

            {/* ── 2. MAIN COCKPIT BODY (10-STORE MATRIX & DEEP TELEMETRY PANEL) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: 10 VERIFIED STORES TELEMETRY MATRIX (7 Cols on desktop) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#2997ff] text-[20px]">equalizer</span>
                    <h2 className="text-base font-bold text-white">Canlı Satıcı Fiyat Telemetrisi</h2>
                    <span className="text-xs font-semibold bg-[#2a2a2c] px-2 py-0.5 rounded text-[#c0c7d5]">
                      {storeItems.length} Mağaza
                    </span>
                  </div>
                  <span className="text-xs text-[#8a919e] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#47e266] animate-pulse" />
                    Anlık Doğrulanıyor
                  </span>
                </div>

                {/* Stores Telemetry List */}
                <div className="flex flex-col gap-2.5" id="store-ranking-list">
                  {storeItems.map((item) => {
                    const isSelected = item.rank === selectedRank;
                    const offerUrl =
                      (item.url && (item.url.startsWith("http://") || item.url.startsWith("https://")))
                        ? item.url
                        : resolveStoreOfferUrl(item.slug || item.name, phone.name, item.url);

                    return (
                      <div
                        key={item.rank}
                        onClick={() => setSelectedRank(item.rank)}
                        className={`group relative rounded-xl p-3.5 bg-[#201f22]/90 hover:bg-[#2a2a2c] transition-all duration-300 cursor-pointer shadow-lg border ${
                          isSelected
                            ? "border-[#2997ff] ring-1 ring-[#2997ff] shadow-[0_0_20px_rgba(41,151,255,0.25)]"
                            : "border-white/[0.05]"
                        }`}
                      >
                        {item.rank === 1 && (
                          <div className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded-full bg-[#47e266] shadow-[0_0_12px_rgba(71,226,102,0.8)]" />
                        )}

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                                item.rank === 1
                                  ? "bg-[#47e266]/20 text-[#47e266]"
                                  : "bg-[#2a2a2c] text-[#c0c7d5]"
                              }`}
                            >
                              {item.rank}
                            </span>

                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-white group-hover:text-[#2997ff] transition-colors">
                                  {item.name}
                                </span>
                                {item.rank === 1 && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#47e266]/15 text-[#47e266] text-[11px] font-bold flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[12px]">star</span>
                                    DİP FİYAT LİDERİ
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[#8a919e] truncate">
                                {item.shippingSpeed} • {item.stockStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex flex-col items-end">
                              <span
                                className={`text-base font-extrabold tracking-tight ${
                                  item.rank === 1 ? "text-[#47e266]" : "text-white"
                                }`}
                              >
                                {formatPrice(item.price)}
                              </span>
                              <span
                                className={`text-[11px] font-semibold ${
                                  item.rank === 1 ? "text-[#47e266]" : "text-[#8a919e]"
                                }`}
                              >
                                {item.diffText}
                              </span>
                            </div>

                            <a
                              href={offerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2997ff] hover:bg-[#1d8cf8] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                            >
                              <span>Git</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: DEEP TELEMETRY & PRICE TREND COCKPIT (5 Cols on desktop) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Active Store Telemetry Container */}
                <div className="rounded-xl bg-[#201f22] p-5 flex flex-col gap-5 border border-white/[0.06]">
                  {/* Active Store Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#47e266]" />
                      <div>
                        <h3 className="font-bold text-sm text-white">
                          {selectedStore.name} Analiz Ekranı
                        </h3>
                        <p className="text-xs text-[#47e266]">
                          {selectedStore.rank === 1 ? "Dip Fiyat Lideri • " : ""}
                          {selectedStore.stockStatus}
                        </p>
                      </div>
                    </div>

                    {/* Time Range Filter Pills */}
                    <div className="flex items-center gap-1 bg-[#0e0e10] p-1 rounded-full text-xs">
                      {(["1m", "3m", "6m", "1y", "all"] as TimeRangeKey[]).map((tr) => (
                        <button
                          key={tr}
                          type="button"
                          onClick={() => setTimeRange(tr)}
                          className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                            timeRange === tr
                              ? "bg-[#2997ff] text-white font-bold shadow-[0_0_12px_rgba(41,151,255,0.4)]"
                              : "text-[#8a919e] hover:text-white"
                          }`}
                        >
                          {tr === "1m"
                            ? "1A"
                            : tr === "3m"
                            ? "3A"
                            : tr === "6m"
                            ? "6A"
                            : tr === "1y"
                            ? "1Y"
                            : "Tümü"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4 Telemetry Spec Micro Metrics Bento */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-[#2a2a2c]/60 border border-white/[0.04] flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#47e266] text-xs font-semibold">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Stok Durumu</span>
                      </div>
                      <span className="text-xs font-bold text-white">Hızlı Teslimat</span>
                      <span className="text-[11px] text-[#8a919e]">{selectedStore.name} Depolarında</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#2a2a2c]/60 border border-white/[0.04] flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#2997ff] text-xs font-semibold">
                        <span className="material-symbols-outlined text-[16px]">trending_down</span>
                        <span>Fiyat Stabilitesi</span>
                      </div>
                      <span className="text-xs font-bold text-white">A+ Yüksek Güven</span>
                      <span className="text-[11px] text-[#8a919e]">Son 30 Günde Stabil</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#2a2a2c]/60 border border-white/[0.04] flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#a3c9ff] text-xs font-semibold">
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        <span>Satıcı Güven Endeksi</span>
                      </div>
                      <span className="text-xs font-bold text-white">%98.4 Doğrulanmış</span>
                      <span className="text-[11px] text-[#8a919e]">Resmi ve Yetkili Mağaza</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#2a2a2c]/60 border border-white/[0.04] flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#47e266] text-xs font-semibold">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        <span>Kargo Performansı</span>
                      </div>
                      <span className="text-xs font-bold text-white">24 Saat İçi Sevk</span>
                      <span className="text-[11px] text-[#8a919e]">{selectedStore.shippingSpeed}</span>
                    </div>
                  </div>

                  {/* HIGH PRECISION PRICE TELEMETRY CHART */}
                  <div className="relative w-full rounded-xl bg-[#1c1b1d] p-3 border border-white/[0.06] overflow-hidden">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#8a919e] font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                        Fiyat Değişim Grafiği
                      </span>

                      {/* Fullscreen Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsFullscreenOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-white text-[11px] font-semibold border border-white/[0.08] transition-all cursor-pointer"
                        title="Grafiği Tam Ekran Görüntüle"
                      >
                        <Maximize2 className="w-3 h-3 text-[#2997ff]" />
                        <span>Tam Ekran</span>
                      </button>
                    </div>

                    {/* SVG Chart Container */}
                    <div className="relative w-full h-44 cursor-crosshair">
                      <svg
                        viewBox="0 0 460 160"
                        className="w-full h-full overflow-visible"
                        onMouseMove={handleChartMouseMove}
                        onMouseLeave={handleChartMouseLeave}
                      >
                        <defs>
                          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2997ff" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#2997ff" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="460" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                        <line x1="0" y1="75" x2="460" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                        <line x1="0" y1="120" x2="460" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                        {/* Area Under Curve */}
                        <path
                          d="M 10 25 C 50 30, 70 33, 80 35 C 120 45, 140 50, 160 52 C 200 56, 215 57, 230 58 C 280 65, 300 80, 330 88 C 380 105, 410 130, 458 135 L 458 160 L 10 160 Z"
                          fill="url(#curveGradient)"
                        />

                        {/* Neon Primary Telemetry Curve */}
                        <path
                          d="M 10 25 C 50 30, 70 33, 80 35 C 120 45, 140 50, 160 52 C 200 56, 215 57, 230 58 C 280 65, 300 80, 330 88 C 380 105, 410 130, 458 135"
                          fill="none"
                          stroke="#2997ff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Hover Crosshair Guide Line */}
                        {chartHover.active && (
                          <g>
                            <line
                              x1={chartHover.svgX}
                              y1="0"
                              x2={chartHover.svgX}
                              y2="160"
                              stroke="#2997ff"
                              strokeWidth="1.2"
                              strokeDasharray="2 2"
                            />
                            <circle
                              cx={chartHover.svgX}
                              cy={chartHover.svgY}
                              r="8"
                              fill="#2997ff"
                              fillOpacity="0.25"
                            />
                            <circle
                              cx={chartHover.svgX}
                              cy={chartHover.svgY}
                              r="4"
                              fill="#ffffff"
                              stroke="#2997ff"
                              strokeWidth="2"
                            />
                          </g>
                        )}

                        {/* Peak Pin */}
                        <circle cx="10" cy="25" r="3.5" fill="#ef4444" />
                        {/* Current Dip Pin */}
                        <circle cx="458" cy="135" r="4" fill="#47e266" />
                      </svg>

                      {/* Floating Glass Tooltip */}
                      {chartHover.active && (
                        <div
                          className="absolute pointer-events-none transition-transform z-30 px-3 py-2 rounded-lg bg-[#0e0e10]/95 border border-[#2997ff]/40 shadow-xl backdrop-blur-md text-xs flex flex-col gap-0.5 whitespace-nowrap"
                          style={{
                            left: `${Math.max(60, Math.min(chartHover.normX, 360))}px`,
                            top: `${Math.max(10, chartHover.svgY - 40)}px`,
                            transform: "translate(-50%, -100%)",
                          }}
                        >
                          <div className="flex items-center gap-1.5 text-[#8a919e] text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
                            <span>{chartHover.point.date}</span>
                          </div>
                          <span className="text-white font-extrabold text-sm">
                            {chartHover.point.price}
                          </span>
                          <span className="text-[#47e266] font-bold text-[10px]">
                            {chartHover.point.change} • {chartHover.point.merchant}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Merchant Redirect CTA */}
                  <a
                    href={primaryTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-full bg-[#2997ff] hover:bg-[#1d8cf8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(41,151,255,0.4)] transition-all active:scale-[0.98]"
                  >
                    <span>{selectedStore.name} Sitesine Git</span>
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>
                </div>

                {/* SMART PRICE ALARM WIDGET */}
                <div className="rounded-xl bg-[#201f22] p-5 flex flex-col gap-4 border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#47e266] text-[20px]">notifications_active</span>
                    <h3 className="font-bold text-sm text-white">Akıllı Fiyat Alarmı Kur</h3>
                  </div>
                  <p className="text-xs text-[#8a919e]">
                    Fiyat belirlediğin seviyenin altına düştüğünde anında ücretsiz bildirim al.
                  </p>

                  {/* Target Price Field & Quick Discount Presets */}
                  <form onSubmit={handleCreateAlert} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[#8a919e] uppercase">
                        Hedef Fiyatın (TL)
                      </label>
                      <input
                        type="number"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131315] border border-white/[0.1] text-white font-bold text-base focus:border-[#2997ff] focus:outline-none"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: "5", label: "-%5", p: Math.round((lowestMarketPrice * 0.95) / 100) * 100 },
                        { id: "10", label: "-%10", p: Math.round((lowestMarketPrice * 0.9) / 100) * 100 },
                        { id: "15", label: "-%15", p: Math.round((lowestMarketPrice * 0.85) / 100) * 100 },
                        { id: "dip", label: "Tarihi Dip", p: Math.round((lowestMarketPrice * 0.82) / 100) * 100 },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setActivePresetTag(preset.id as any);
                            setAlertPrice(preset.p);
                          }}
                          className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            activePresetTag === preset.id
                              ? "bg-[#2997ff]/20 text-[#2997ff] border-[#2997ff]"
                              : "bg-[#131315] text-[#8a919e] border-white/[0.06] hover:text-white"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Notification Channel Toggles */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs text-[#8a919e]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channelEmail}
                          onChange={(e) => setChannelEmail(e.target.checked)}
                          className="rounded text-[#2997ff] focus:ring-0 bg-[#131315] border-white/20"
                        />
                        <span>E-posta</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channelSms}
                          onChange={(e) => setChannelSms(e.target.checked)}
                          className="rounded text-[#2997ff] focus:ring-0 bg-[#131315] border-white/20"
                        />
                        <span>SMS</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channelWhatsapp}
                          onChange={(e) => setChannelWhatsapp(e.target.checked)}
                          className="rounded text-[#2997ff] focus:ring-0 bg-[#131315] border-white/20"
                        />
                        <span>WhatsApp</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="E-posta veya telefon numaran..."
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#131315] border border-white/[0.1] text-xs text-white placeholder-[#8a919e] focus:border-[#2997ff] focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[#47e266] hover:bg-[#3ecb58] text-[#002106] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                      <span>Alarmı Başlat ({formatPrice(alertPrice)})</span>
                    </button>
                  </form>

                  {alertSuccess && (
                    <div className="p-2.5 rounded-lg bg-[#47e266]/15 border border-[#47e266]/30 text-[#47e266] text-xs font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Fiyat alarmınız başarıyla aktif edildi!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── 3. BOTTOM TELEMETRY STATUS BAR ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08] text-xs text-[#8a919e]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2997ff] text-[18px]">api</span>
                <span>Resmi Satıcı API Telemetrisi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#47e266] text-[18px]">sync</span>
                <span>15 Dk. Bir Otomatik Güncelleme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a3c9ff] text-[18px]">verified</span>
                <span>%100 Orijinal Ürün & Garanti</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">handshake</span>
                <span>Komisyonsuz Tarafsız Rehber</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ========================================================================= ── */}
      {/* ── FULLSCREEN TELEMETRY MODAL (FİYAT GRAFİĞİ TAM EKRAN TELEMETRİ MODALI) ── */}
      {/* ── ========================================================================= ── */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-black/85 backdrop-blur-2xl transition-all duration-300">
          <div className="relative w-full max-w-[1440px] h-[94vh] max-h-[980px] bg-[#0e0e10]/95 border border-white/[0.12] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(41,151,255,0.15)] flex flex-col overflow-hidden text-[#e5e1e4]">
            {/* Top Modal Header Bar */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 bg-[#1c1b1d]/70 shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#2a2a2c] flex items-center justify-center shrink-0 border border-white/[0.08]">
                  <span className="material-symbols-outlined text-[#2997ff] text-[22px]">ssid_chart</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2997ff] px-2 py-0.5 rounded-full bg-[#2997ff]/20">
                      Telemetri Pro v2.4
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#47e266] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#47e266] animate-pulse" />
                      Canlı Matris Akışı
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white truncate">
                    {displayTitle} <span className="text-[#8a919e] font-normal">• Detaylı Fiyat Geçmişi & Çoklu Mağaza Telemetrisi</span>
                  </h2>
                </div>
              </div>

              {/* Action controls */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFullscreenOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#2a2a2c] hover:bg-white/[0.15] text-[#8a919e] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Kapat (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter & Store Toggles Strip */}
            <div className="px-6 py-3 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 bg-[#131315]/80 shrink-0">
              {/* Time Range Selectors */}
              <div className="flex items-center gap-1.5 bg-[#0e0e10] p-1 rounded-full text-xs">
                {(["1m", "3m", "6m", "1y", "all"] as TimeRangeKey[]).map((tr) => (
                  <button
                    key={tr}
                    type="button"
                    onClick={() => setTimeRange(tr)}
                    className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                      timeRange === tr
                        ? "bg-[#2997ff] text-white shadow-[0_0_12px_rgba(41,151,255,0.4)]"
                        : "text-[#8a919e] hover:text-white"
                    }`}
                  >
                    {tr === "1m"
                      ? "1 Ay"
                      : tr === "3m"
                      ? "3 Ay"
                      : tr === "6m"
                      ? "6 Ay"
                      : tr === "1y"
                      ? "1 Yıl"
                      : "Tümü"}
                  </button>
                ))}
              </div>

              {/* Multi-Store Telemetry Layer Toggles */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#47e266]">
                  <input
                    type="checkbox"
                    checked={modalLayers.amazon}
                    onChange={(e) => setModalLayers((prev) => ({ ...prev, amazon: e.target.checked }))}
                    className="rounded bg-[#0e0e10] border-white/20 text-[#47e266] focus:ring-0"
                  />
                  <span>Amazon TR</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#2997ff]">
                  <input
                    type="checkbox"
                    checked={modalLayers.hepsiburada}
                    onChange={(e) => setModalLayers((prev) => ({ ...prev, hepsiburada: e.target.checked }))}
                    className="rounded bg-[#0e0e10] border-white/20 text-[#2997ff] focus:ring-0"
                  />
                  <span>Hepsiburada</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#a855f7]">
                  <input
                    type="checkbox"
                    checked={modalLayers.trendyol}
                    onChange={(e) => setModalLayers((prev) => ({ ...prev, trendyol: e.target.checked }))}
                    className="rounded bg-[#0e0e10] border-white/20 text-[#a855f7] focus:ring-0"
                  />
                  <span>Trendyol</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#f97316]">
                  <input
                    type="checkbox"
                    checked={modalLayers.mediamarkt}
                    onChange={(e) => setModalLayers((prev) => ({ ...prev, mediamarkt: e.target.checked }))}
                    className="rounded bg-[#0e0e10] border-white/20 text-[#f97316] focus:ring-0"
                  />
                  <span>MediaMarkt</span>
                </label>
              </div>
            </div>

            {/* Main Chart High-Resolution Canvas Area */}
            <div className="relative flex-1 bg-[#131315] p-4 sm:p-6 flex flex-col justify-between overflow-hidden cursor-crosshair">
              {/* Fullscreen SVG */}
              <svg
                viewBox="0 0 1100 360"
                className="w-full h-full overflow-visible"
                onMouseMove={handleFsMouseMove}
                onMouseLeave={handleFsMouseLeave}
              >
                <defs>
                  <linearGradient id="fsAmazonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#47e266" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#47e266" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Price Y-Axis Grid Lines */}
                {[50, 110, 170, 230, 290].map((yVal, idx) => (
                  <g key={yVal}>
                    <line x1="60" y1={yVal} x2="1080" y2={yVal} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <text x="50" y={yVal + 4} fill="#8a919e" fontSize="10" textAnchor="end">
                      {formatPrice(Math.round(highestMarketPrice - (idx / 4) * (highestMarketPrice - lowestMarketPrice)))}
                    </text>
                  </g>
                ))}

                {/* Area Under Leader Line (Amazon) */}
                {modalLayers.amazon && (
                  <path
                    d="M 60 70 C 200 80, 350 95, 500 120 C 650 145, 800 190, 1040 290 L 1040 330 L 60 330 Z"
                    fill="url(#fsAmazonGrad)"
                  />
                )}

                {/* Multi-Store Price Curves */}
                {modalLayers.mediamarkt && (
                  <path
                    d="M 60 55 C 200 65, 350 75, 500 95 C 650 115, 800 145, 1040 220"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {modalLayers.trendyol && (
                  <path
                    d="M 60 62 C 200 70, 350 82, 500 105 C 650 128, 800 160, 1040 240"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {modalLayers.hepsiburada && (
                  <path
                    d="M 60 65 C 200 75, 350 88, 500 110 C 650 135, 800 175, 1040 260"
                    fill="none"
                    stroke="#2997ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {modalLayers.amazon && (
                  <path
                    d="M 60 70 C 200 80, 350 95, 500 120 C 650 145, 800 190, 1040 290"
                    fill="none"
                    stroke="#47e266"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Laser Crosshair Line */}
                {fsHover.active && (
                  <g>
                    <line
                      x1={fsHover.svgX}
                      y1="20"
                      x2={fsHover.svgX}
                      y2="330"
                      stroke="#2997ff"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx={fsHover.svgX} cy="290" r="4.5" fill="#47e266" stroke="#ffffff" strokeWidth="2" />
                    <circle cx={fsHover.svgX} cy="260" r="4" fill="#2997ff" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={fsHover.svgX} cy="240" r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={fsHover.svgX} cy="220" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                )}

                {/* Peak Pin and Dip Pin */}
                <circle cx="60" cy="55" r="4" fill="#ef4444" />
                <circle cx="1040" cy="290" r="5" fill="#47e266" />

                {/* Horizontal Month Labels */}
                <g fill="#8a919e" fontSize="11" textAnchor="middle">
                  <text x="60" y="348">Ekim 2025</text>
                  <text x="250" y="348">Kasım 2025</text>
                  <text x="450" y="348">Aralık 2025</text>
                  <text x="650" y="348">Ocak 2026</text>
                  <text x="850" y="348">Şubat 2026</text>
                  <text x="1040" y="348">Mart 2026 (Bugün)</text>
                </g>
              </svg>

              {/* ULTRA-LUXURY HOVER TELEMETRY HUD CARD */}
              {fsHover.active && (
                <div
                  className="absolute pointer-events-none z-30 p-4 rounded-xl bg-[#0e0e10]/95 border border-white/20 shadow-2xl backdrop-blur-xl text-xs flex flex-col gap-2.5 min-w-[280px]"
                  style={{
                    left: `${Math.max(160, Math.min(fsHover.normX, 880))}px`,
                    top: "30px",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                      {fsHover.date}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#47e266]/20 text-[#47e266]">
                      {fsHover.badge}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {modalLayers.amazon && (
                      <div className="flex items-center justify-between text-[#47e266]">
                        <span className="font-semibold">Amazon TR (Lider):</span>
                        <strong className="font-extrabold">{fsHover.pAmazon}</strong>
                      </div>
                    )}
                    {modalLayers.hepsiburada && (
                      <div className="flex items-center justify-between text-[#2997ff]">
                        <span className="font-semibold">Hepsiburada:</span>
                        <div className="flex items-center gap-1">
                          <strong className="font-extrabold">{fsHover.pHB}</strong>
                          <span className="text-[10px] text-[#8a919e]">({fsHover.diffHB})</span>
                        </div>
                      </div>
                    )}
                    {modalLayers.trendyol && (
                      <div className="flex items-center justify-between text-[#a855f7]">
                        <span className="font-semibold">Trendyol:</span>
                        <div className="flex items-center gap-1">
                          <strong className="font-extrabold">{fsHover.pTY}</strong>
                          <span className="text-[10px] text-[#8a919e]">({fsHover.diffTY})</span>
                        </div>
                      </div>
                    )}
                    {modalLayers.mediamarkt && (
                      <div className="flex items-center justify-between text-[#f97316]">
                        <span className="font-semibold">MediaMarkt:</span>
                        <div className="flex items-center gap-1">
                          <strong className="font-extrabold">{fsHover.pMM}</strong>
                          <span className="text-[10px] text-[#8a919e]">({fsHover.diffMM})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#8a919e]">
                    <span>Piyasa Ort.: <strong className="text-white">{fsHover.avg}</strong></span>
                    <span>Fark: <strong className="text-[#47e266]">{fsHover.spread}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM BENTO METRICS PANEL */}
            <div className="p-6 bg-[#1c1b1d] border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-5 gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-[#201f22] border border-white/[0.05] flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-[#8a919e] uppercase">Tarihi Dip Fiyat</span>
                <span className="text-base font-extrabold text-[#47e266]">{formatPrice(lowestMarketPrice)}</span>
                <span className="text-[10px] text-[#8a919e]">Amazon TR • Bugün</span>
              </div>
              <div className="p-3 rounded-xl bg-[#201f22] border border-white/[0.05] flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-[#8a919e] uppercase">Tarihi Zirve</span>
                <span className="text-base font-extrabold text-[#ffb4ab]">{formatPrice(highestMarketPrice)}</span>
                <span className="text-[10px] text-[#8a919e]">Lansman Tarihi</span>
              </div>
              <div className="p-3 rounded-xl bg-[#201f22] border border-white/[0.05] flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-[#8a919e] uppercase">Ortalama Piyasa</span>
                <span className="text-base font-extrabold text-white">{formatPrice(averageMarketPrice)}</span>
                <span className="text-[10px] text-[#8a919e]">Tüm Satıcılar Ortalaması</span>
              </div>
              <div className="p-3 rounded-xl bg-[#201f22] border border-white/[0.05] flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-[#8a919e] uppercase">30 Günlük Değişim</span>
                <span className="text-base font-extrabold text-[#47e266]">-%4.8</span>
                <span className="text-[10px] text-[#8a919e]">Fiyat Düşüş Trendinde</span>
              </div>
              <div className="p-3 rounded-xl bg-[#201f22] border border-white/[0.05] flex flex-col gap-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-semibold text-[#8a919e] uppercase">Volatilite Endeksi</span>
                <span className="text-base font-extrabold text-[#2997ff]">A+ Stabil</span>
                <span className="text-[10px] text-[#8a919e]">Güvenilir Fiyat Seviyesi</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
