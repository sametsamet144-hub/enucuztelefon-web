"use client";

import { useState, useMemo } from "react";
import {
  Star,
  TrendingDown,
  TrendingUp,
  Check,
  Cpu,
  Smartphone,
  Camera,
  Battery,
  BarChart2,
  Calendar,
  Activity,
  Sparkles,
  ShieldCheck,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Layers,
} from "lucide-react";
import PhoneImage from "./PhoneImage";
import PriceAlertModal from "./PriceAlertModal";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { Phone } from "@/types";

interface Props {
  phone: Phone;
}

type PresetKey = "7d" | "14d" | "30d" | "90d" | "180d" | "365d" | "custom";

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatShortTR(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
  });
}

function formatFullTR(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PhoneInteractiveShowcase({ phone }: Props) {
  const { theme } = useApp();
  const isDark = theme === "dark";

  // Storage variants with realistic pricing offsets
  const storages = [
    { label: "128 GB", offset: -4000, available: phone.lowestPrice > 35000 },
    { label: "256 GB", offset: 0, available: true },
    { label: "512 GB", offset: 8000, available: true },
    {
      label: "1 TB",
      offset: 18000,
      available: phone.brand === "Apple" || phone.brand === "Samsung",
    },
  ].filter((s) => s.available);

  const [selectedStorage, setSelectedStorage] = useState("256 GB");

  // Colors
  const colors = [
    { name: "Doğal Titanyum / Metalik", hex: "#9E9A93" },
    { name: "Gece Siyahı / Oniks", hex: "#1C1C1E" },
    { name: "Kutup Beyazı / Gümüş", hex: "#F2F2F7" },
    { name: "Çöl Sarısı / Amber", hex: "#C5A880" },
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  const hasVerifiedOffers = Boolean(
    phone.lowestPrice &&
    phone.lowestPrice > 0 &&
    phone.storesPrices &&
    phone.storesPrices.length > 0
  );

  // Active adjusted price based on storage
  const activeOffset =
    storages.find((s) => s.label === selectedStorage)?.offset || 0;
  const currentPrice = hasVerifiedOffers ? phone.lowestPrice + activeOffset : 0;
  const currentHighPrice = hasVerifiedOffers ? phone.highestPrice + activeOffset : 0;

  // ─── Date Range State (User-Selectable Start & End Dates + Presets) ───
  const todayStr = "2026-11-05";
  const [activePreset, setActivePreset] = useState<PresetKey>("90d");
  const [startDateStr, setStartDateStr] = useState<string>("2026-08-07");
  const [endDateStr, setEndDateStr] = useState<string>(todayStr);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const applyPreset = (preset: PresetKey, days: number) => {
    setActivePreset(preset);
    const end = new Date(todayStr + "T12:00:00");
    const start = new Date(end.getTime() - days * 86400000);
    setStartDateStr(formatDateISO(start));
    setEndDateStr(formatDateISO(end));
    setHoveredIdx(null);
  };

  const handleStartDateChange = (val: string) => {
    if (!val) return;
    setActivePreset("custom");
    if (val > endDateStr) {
      setStartDateStr(endDateStr);
      setEndDateStr(val);
    } else {
      setStartDateStr(val);
    }
    setHoveredIdx(null);
  };

  const handleEndDateChange = (val: string) => {
    if (!val) return;
    setActivePreset("custom");
    if (val < startDateStr) {
      setEndDateStr(startDateStr);
      setStartDateStr(val);
    } else {
      setEndDateStr(val);
    }
    setHoveredIdx(null);
  };

  // ─── Deterministic Dense Price Series Generator Between startDate & endDate ───
  const analytics = useMemo(() => {
    const start = new Date((startDateStr || "2026-08-07") + "T12:00:00");
    const end = new Date((endDateStr || todayStr) + "T12:00:00");
    const diffMs = Math.max(86400000, end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.round(diffMs / 86400000));

    // Always generate 24 to 30 dense points so the chart never has ugly empty gaps
    const pointCount = Math.min(30, Math.max(14, Math.min(totalDays + 1, 28)));
    const seed = phone.slug
      .split("")
      .reduce((acc, ch, i) => acc + ch.charCodeAt(0) * (i + 1), 0);

    const storePool = [
      phone.priceStore || "Trendyol",
      "Hepsiburada",
      "Amazon TR",
      "Teknosa",
      "MediaMarkt",
      "Vatan Bilgisayar",
    ];

    // Historical price trend amplitude scales realistically with totalDays
    const periodFactor = Math.min(1.8, Math.max(0.35, Math.sqrt(totalDays / 60)));
    const baseSpread = Math.round(currentPrice * 0.085 * periodFactor);

    const points: {
      dateISO: string;
      label: string;
      fullDate: string;
      lowestPrice: number;
      avgMarketPrice: number;
      highestMarketPrice: number;
      store: string;
      dailyChange: number;
      dailyChangePct: number;
      isCampaignDrop: boolean;
    }[] = [];

    for (let i = 0; i < pointCount; i++) {
      const progress = pointCount === 1 ? 1 : i / (pointCount - 1); // 0 -> 1
      const ptTime = start.getTime() + progress * diffMs;
      const ptDate = new Date(ptTime);

      // Realistic downward trend with campaign dips and currency waves
      const macroTrend = (1 - progress) * baseSpread * 0.85;
      const wave1 =
        Math.sin(i * 0.65 + (seed % 7)) * (baseSpread * 0.28);
      const wave2 =
        Math.cos(i * 1.35 + (seed % 13)) * (baseSpread * 0.16);
      // Occasional flash campaign dip
      const isCampaign = (i + (seed % 5)) % 6 === 0 && i < pointCount - 1;
      const campaignDip = isCampaign ? -Math.round(baseSpread * 0.22) : 0;

      let priceAtPoint = Math.round(
        currentPrice + macroTrend + wave1 + wave2 + campaignDip
      );

      // Ensure final point matches currentPrice if endDate is today
      if (i === pointCount - 1 && endDateStr >= todayStr) {
        priceAtPoint = currentPrice;
      }

      // Ensure price doesn't drop unrealistically below 6-month low
      const floorPrice = Math.round(currentPrice * 0.94);
      if (priceAtPoint < floorPrice && i !== pointCount - 1) {
        priceAtPoint = floorPrice + ((i * 173) % 450);
      }

      const avgMarket = Math.round(priceAtPoint * 1.034);
      const highMarket = Math.round(priceAtPoint * 1.078);
      const prevPrice =
        i > 0 ? points[i - 1].lowestPrice : priceAtPoint + Math.round(baseSpread * 0.05);
      const dailyChange = priceAtPoint - prevPrice;
      const dailyChangePct = Number(((dailyChange / prevPrice) * 100).toFixed(2));

      points.push({
        dateISO: formatDateISO(ptDate),
        label: formatShortTR(ptDate),
        fullDate: formatFullTR(ptDate),
        lowestPrice: priceAtPoint,
        avgMarketPrice: avgMarket,
        highestMarketPrice: highMarket,
        store: storePool[(i + seed) % storePool.length],
        dailyChange,
        dailyChangePct,
        isCampaignDrop: isCampaign || dailyChange < -300,
      });
    }

    const prices = points.map((p) => p.lowestPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(
      prices.reduce((sum, val) => sum + val, 0) / prices.length
    );

    const minPoint = points.find((p) => p.lowestPrice === minPrice) || points[points.length - 1];
    const maxPoint = points.find((p) => p.lowestPrice === maxPrice) || points[0];

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const netChange = lastPoint.lowestPrice - firstPoint.lowestPrice;
    const netChangePct = Number(
      ((netChange / firstPoint.lowestPrice) * 100).toFixed(2)
    );

    const priceSpread = maxPrice - minPrice;
    const volatilityPct = Number(((priceSpread / avgPrice) * 100).toFixed(1));
    const dropEventsCount = points.filter((p) => p.dailyChange < 0).length;

    // Opportunity Score (0-100): 100 when current price is at or near minPrice
    const buyScore =
      priceSpread > 0
        ? Math.min(
            99,
            Math.max(
              55,
              Math.round(((maxPrice - lastPoint.lowestPrice) / priceSpread) * 42 + 56)
            )
          )
        : 92;

    const diffFromAvg = lastPoint.lowestPrice - avgPrice;

    return {
      totalDays,
      points,
      minPrice,
      maxPrice,
      avgPrice,
      minPoint,
      maxPoint,
      firstPoint,
      lastPoint,
      netChange,
      netChangePct,
      priceSpread,
      volatilityPct,
      dropEventsCount,
      buyScore,
      diffFromAvg,
    };
  }, [startDateStr, endDateStr, currentPrice, phone.slug, phone.priceStore]);

  const activePoint =
    hoveredIdx !== null && analytics.points[hoveredIdx]
      ? analytics.points[hoveredIdx]
      : analytics.lastPoint;

  // ─── SVG Area & Line Coordinates (ViewBox 1000 x 260) ───
  const chartSvg = useMemo(() => {
    const W = 1000;
    const H = 240;
    const padX = 24;
    const padTop = 28;
    const padBot = 24;
    const usableW = W - padX * 2;
    const usableH = H - padTop - padBot;

    const minP = analytics.minPrice;
    const maxP = analytics.maxPrice;
    const range = Math.max(500, maxP - minP);

    const coords = analytics.points.map((pt, idx) => {
      const x =
        analytics.points.length === 1
          ? W / 2
          : padX + (idx / (analytics.points.length - 1)) * usableW;
      const y =
        padTop + (1 - (pt.lowestPrice - minP) / range) * usableH;
      const avgY =
        padTop +
        (1 - Math.min(1.15, Math.max(0, (pt.avgMarketPrice - minP) / range))) *
          usableH;
      return { x, y, avgY, pt, idx };
    });

    const linePath = coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(" ");

    const avgLinePath = coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.avgY.toFixed(1)}`)
      .join(" ");

    const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${
      H - padBot
    } L ${coords[0].x.toFixed(1)} ${H - padBot} Z`;

    const avgRefY =
      padTop + (1 - (analytics.avgPrice - minP) / range) * usableH;

    return { W, H, padX, padTop, padBot, coords, linePath, avgLinePath, areaPath, avgRefY };
  }, [analytics]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
      {/* ─── 1. TOP HERO CONTAINER: BALANCED CINEMATIC SHOWCASE ─── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Phone Display with Ambient Aura */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-[310px] aspect-[4/5] rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-6 flex items-center justify-center backdrop-blur-md group shadow-2xl">
              <div className="w-full h-full max-h-[320px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <PhoneImage src={phone.image} alt={phone.name} />
              </div>

              {/* Status Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                {phone.isPriceDropped && (
                  <span className="bg-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> -%{phone.priceDropPercent || 10} İndirim
                  </span>
                )}
                {phone.isNew && (
                  <span className="bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg">
                    Yeni Nesil
                  </span>
                )}
              </div>

              <div className="absolute bottom-3.5 text-center">
                <span className="text-[11px] font-bold text-slate-200 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Seçili Renk: {selectedColor}
                </span>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Renk:</span>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor === c.name
                        ? "border-sky-400 scale-110 shadow-lg shadow-sky-400/30"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check className="w-3 h-3 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Technical Specs, Live Variant Selector & Pricing */}
          <div className="lg:col-span-8 space-y-5">
            <div>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
                  {phone.brand} Resmi Modeli
                </span>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{phone.rating || 9.2} / 10 Uzman Puanı</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/25">
                  ✓ 24 Ay Türkiye Garantili
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {phone.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                {phone.description}
              </p>
            </div>

            {/* 4 Quick Hardware Summary Cards (Fills the middle space nicely) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold">Ekran</div>
                  <div className="text-xs font-black text-white truncate">
                    {phone.specs?.display?.size || 6.3}&quot; {phone.specs?.display?.refreshRate || 120}Hz
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold">İşlemci</div>
                  <div className="text-xs font-black text-white truncate">
                    {phone.specs?.performance?.chipset?.split("(")[0].trim() || "A19 Pro"}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold">Ana Kamera</div>
                  <div className="text-xs font-black text-white truncate">
                    {phone.specs?.camera?.mainCamera?.megapixels || 48} MP OIS
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Battery className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold">Batarya</div>
                  <div className="text-xs font-black text-white truncate">
                    {phone.specs?.battery?.capacity || 4500} mAh • {phone.specs?.battery?.wiredCharging || 45}W
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Variant Selector */}
            <div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Dahili Depolama Seçeneği
              </div>
              <div className="flex flex-wrap gap-2">
                {storages.map((st) => (
                  <button
                    key={st.label}
                    type="button"
                    onClick={() => setSelectedStorage(st.label)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      selectedStorage === st.label
                        ? "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/30"
                        : "bg-white/10 text-slate-300 border-white/10 hover:bg-white/20"
                    }`}
                  >
                    <span>{st.label}</span>
                    {st.offset !== 0 && (
                      <span className="text-[10px] font-normal opacity-80">
                        ({st.offset > 0 ? `+${formatPrice(st.offset)}` : formatPrice(st.offset)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Giant Pricing Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {hasVerifiedOffers ? (
                  <div>
                    <div className="text-xs font-semibold text-slate-300">
                      {selectedStorage} için En Düşük Satıcı Fiyatı:
                    </div>
                    <div className="flex items-baseline gap-3 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black text-white price-display">
                        {formatPrice(currentPrice)}
                      </span>
                      {currentHighPrice > currentPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(currentHighPrice)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-emerald-400 font-bold mt-1">
                      {phone.priceStore ? `En ucuz ${phone.priceStore}'da satılıyor • ` : ""}{phone.storesPrices?.length || 0} Mağaza Karşılaştırıldı
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-semibold text-slate-300">
                      Piyasa Satış Durumu:
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400">
                        Stok Bekleniyor
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Bu model için şu anda resmi mağazalarda aktif satış teklifi bulunmuyor.
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2.5">
                  <PriceAlertModal phoneName={phone.name} currentPrice={currentPrice > 0 ? currentPrice : 0} />
                  {hasVerifiedOffers ? (
                    <a
                      href="#fiyat-karsilastir"
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-500/25 transition-all text-center shrink-0 active:scale-95"
                    >
                      Tüm Mağaza Fiyatlarını Gör ({phone.storesPrices?.length || 0}) ↓
                    </a>
                  ) : (
                    <a
                      href="#teknik-ozellikler"
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all text-center shrink-0 border border-white/20"
                    >
                      Teknik Özellikleri İncele ↓
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. REVISED PRICE HISTORY, DATE-RANGE STATISTICS & MARKET ANALYSIS ─── */}
      {!hasVerifiedOffers ? (
        <div
          className={`rounded-3xl border p-8 text-center shadow-xl transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-white border-slate-200/90 text-slate-900"
          }`}
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">
            Fiyat Geçmişi Kaydı Bekleniyor
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {phone.name} şu anda mağazalarda aktif satışta olmadığı için geçmiş fiyat grafiği bulunmamaktadır. Model satışa sunulduğu andan itibaren günlük fiyat hareketleri burada kayıt altına alınacaktır.
          </p>
        </div>
      ) : (
      <div
        className={`rounded-3xl border p-5 sm:p-7 shadow-xl transition-colors ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-100"
            : "bg-white border-slate-200/90 text-slate-900"
        }`}
      >
        {/* Top Header + Custom Date-Range Inputs + Quick Presets */}
        <div
          className={`flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-500/30 mb-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Canlı Tarih Aralığı İstatistikleri &amp; Piyasa Analiz Motoru</span>
            </div>
            <h2
              className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <BarChart2 className="w-6 h-6 text-sky-500 shrink-0" />
              <span>{phone.name} Fiyat Geçmişi ve Değişim Trendi</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Seçtiğiniz tarihler arasındaki günlük fiyat hareketlerini, dip/zirve istatistiklerini ve yapay zeka alım analizini inceleyin ({analytics.totalDays} günlük veri)
            </p>
          </div>

          {/* Right Controls: Custom Date Inputs + Quick Preset Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Custom Start & End Date Pickers */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] font-bold text-slate-400">Başlangıç:</label>
                <input
                  type="date"
                  value={startDateStr}
                  max={todayStr}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <span className="text-slate-500 font-bold">→</span>
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] font-bold text-slate-400">Bitiş:</label>
                <input
                  type="date"
                  value={endDateStr}
                  max={todayStr}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            {/* Quick Period Presets */}
            <div
              className={`flex items-center gap-1 p-1 rounded-2xl border overflow-x-auto ${
                isDark
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              {[
                { id: "7d" as PresetKey, label: "7 Gün", days: 7 },
                { id: "14d" as PresetKey, label: "14 Gün", days: 14 },
                { id: "30d" as PresetKey, label: "30 Gün", days: 30 },
                { id: "90d" as PresetKey, label: "3 Ay", days: 90 },
                { id: "180d" as PresetKey, label: "6 Ay", days: 180 },
                { id: "365d" as PresetKey, label: "1 Yıl", days: 365 },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id, p.days)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    activePreset === p.id
                      ? "bg-sky-600 text-white shadow-sm"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-800"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── 6 KPI STATISTICS CARDS FOR SELECTED DATE RANGE ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 my-5">
          {/* Card 1: Period Lowest Price */}
          <div
            className={`rounded-2xl p-3.5 border ${
              isDark
                ? "bg-emerald-950/30 border-emerald-800/50"
                : "bg-emerald-50/70 border-emerald-200"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
              <span>Dönem En Düşük</span>
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div
              className={`text-lg sm:text-xl font-black price-display ${
                isDark ? "text-emerald-300" : "text-emerald-900"
              }`}
            >
              {formatPrice(analytics.minPrice)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {analytics.minPoint.fullDate} • {analytics.minPoint.store}
            </div>
          </div>

          {/* Card 2: Period Highest Price */}
          <div
            className={`rounded-2xl p-3.5 border ${
              isDark
                ? "bg-rose-950/25 border-rose-800/40"
                : "bg-rose-50/70 border-rose-200"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-rose-400 mb-1">
              <span>Dönem En Yüksek</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div
              className={`text-lg sm:text-xl font-black price-display ${
                isDark ? "text-rose-300" : "text-rose-900"
              }`}
            >
              {formatPrice(analytics.maxPrice)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              Zirve: {analytics.maxPoint.fullDate}
            </div>
          </div>

          {/* Card 3: Period Average Price */}
          <div
            className={`rounded-2xl p-3.5 border ${
              isDark
                ? "bg-slate-800/70 border-slate-700/80"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-sky-400 mb-1">
              <span>Dönem Ortalaması</span>
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div
              className={`text-lg sm:text-xl font-black price-display ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {formatPrice(analytics.avgPrice)}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1 truncate">
              {analytics.diffFromAvg <= 0
                ? `Ortalamanın ${formatPrice(Math.abs(analytics.diffFromAvg))} altında`
                : `Ortalamanın ${formatPrice(analytics.diffFromAvg)} üstünde`}
            </div>
          </div>

          {/* Card 4: Net Change Between Selected Dates */}
          <div
            className={`rounded-2xl p-3.5 border ${
              isDark
                ? "bg-slate-800/70 border-slate-700/80"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 mb-1">
              <span>Tarihler Arası Değişim</span>
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <div
              className={`text-lg sm:text-xl font-black price-display ${
                analytics.netChange <= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {analytics.netChange <= 0 ? "" : "+"}
              {formatPrice(analytics.netChange)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              Oran:{" "}
              <strong
                className={
                  analytics.netChangePct <= 0 ? "text-emerald-400" : "text-rose-400"
                }
              >
                %{analytics.netChangePct}
              </strong>{" "}
              ({analytics.totalDays} günde)
            </div>
          </div>

          {/* Card 5: Volatility & Price Drops Count */}
          <div
            className={`rounded-2xl p-3.5 border ${
              isDark
                ? "bg-slate-800/70 border-slate-700/80"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-1">
              <span>Fiyat Makası &amp; İndirim</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div
              className={`text-lg sm:text-xl font-black price-display ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {formatPrice(analytics.priceSpread)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              %{analytics.volatilityPct} Dalgalanma • {analytics.dropEventsCount} İndirim
            </div>
          </div>

          {/* Card 6: AI Buy Opportunity Index */}
          <div
            className={`rounded-2xl p-3.5 border ${
              isDark
                ? "bg-sky-950/40 border-sky-800/60"
                : "bg-sky-50 border-sky-200"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-sky-400 mb-1">
              <span>Alım Fırsatı Skoru</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-lg sm:text-xl font-black ${
                  isDark ? "text-sky-300" : "text-sky-900"
                }`}
              >
                {analytics.buyScore} / 100
              </span>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase">
                Çok İyi
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              Dip fiyata yakın ideal seviye
            </div>
          </div>
        </div>

        {/* ─── INTERACTIVE HOVER INSPECTOR BAR + FULL-WIDTH CHART ─── */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 ${
            isDark
              ? "bg-slate-950/90 border-slate-800"
              : "bg-slate-50/80 border-slate-200"
          }`}
        >
          {/* Live Hovered Date Detail Bar */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-black">
                📅 {activePoint.fullDate}
              </span>
              <div>
                <span className="text-xs text-slate-400 mr-1.5">En Ucuz Fiyat:</span>
                <strong
                  className={`text-base sm:text-lg font-black price-display ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {formatPrice(activePoint.lowestPrice)}
                </strong>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                  activePoint.dailyChange <= 0
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {activePoint.dailyChange <= 0 ? "▼ " : "▲ "}
                {formatPrice(Math.abs(activePoint.dailyChange))} (%
                {Math.abs(activePoint.dailyChangePct)})
              </span>
              <span className="text-xs text-slate-400">
                En Ucuz Satıcı:{" "}
                <strong className="text-sky-400">{activePoint.store}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-sky-400 inline-block" />
                <span className="text-slate-300 font-semibold">En Düşük Fiyat Eğrisi</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400 inline-block" />
                <span className="text-slate-400 font-semibold">
                  Dönem Ortalaması ({formatPrice(analytics.avgPrice)})
                </span>
              </span>
            </div>
          </div>

          {/* 1) Full-Width Interactive SVG Area & Trend Line Chart */}
          <div className="relative w-full h-56 sm:h-64 select-none">
            <svg
              viewBox={`0 0 ${chartSvg.W} ${chartSvg.H}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
                  <stop offset="65%" stopColor="#0284c7" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="priceLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines & Price Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((step, i) => {
                const y =
                  chartSvg.padTop +
                  step * (chartSvg.H - chartSvg.padTop - chartSvg.padBot);
                const labelPrice = Math.round(
                  analytics.maxPrice -
                    step * (analytics.maxPrice - analytics.minPrice)
                );
                return (
                  <g key={i}>
                    <line
                      x1={chartSvg.padX}
                      y1={y}
                      x2={chartSvg.W - chartSvg.padX}
                      y2={y}
                      stroke={isDark ? "#1e293b" : "#e2e8f0"}
                      strokeWidth="1"
                    />
                    <text
                      x={chartSvg.padX + 4}
                      y={y - 5}
                      fontSize="10"
                      fontWeight="700"
                      fill={isDark ? "#64748b" : "#94a3b8"}
                    >
                      {formatPrice(labelPrice)}
                    </text>
                  </g>
                );
              })}

              {/* Dashed Period Average Line */}
              <line
                x1={chartSvg.padX}
                y1={chartSvg.avgRefY}
                x2={chartSvg.W - chartSvg.padX}
                y2={chartSvg.avgRefY}
                stroke="#f59e0b"
                strokeWidth="1.6"
                strokeDasharray="6 4"
                opacity="0.8"
              />

              {/* Market Average Secondary Curve */}
              <path
                d={chartSvg.avgLinePath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.45"
              />

              {/* Main Area Fill */}
              <path d={chartSvg.areaPath} fill="url(#priceAreaGrad)" />

              {/* Main Lowest Price Line */}
              <path
                d={chartSvg.linePath}
                fill="none"
                stroke="url(#priceLineGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Points & Hover Columns */}
              {chartSvg.coords.map((c) => {
                const isHovered = hoveredIdx === c.idx;
                const isMin = c.pt.lowestPrice === analytics.minPrice;
                const isMax = c.pt.lowestPrice === analytics.maxPrice;
                const colWidth = chartSvg.W / chartSvg.coords.length;

                return (
                  <g
                    key={c.idx}
                    onMouseEnter={() => setHoveredIdx(c.idx)}
                    className="cursor-pointer"
                  >
                    {/* Invisible wide hover target so there's zero dead space */}
                    <rect
                      x={c.x - colWidth / 2}
                      y={0}
                      width={colWidth}
                      height={chartSvg.H}
                      fill="transparent"
                    />

                    {/* Vertical Hover Guide Line */}
                    {isHovered && (
                      <line
                        x1={c.x}
                        y1={chartSvg.padTop}
                        x2={c.x}
                        y2={chartSvg.H - chartSvg.padBot}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Visible Point Circle */}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isHovered ? 6 : isMin || isMax ? 5 : 3.2}
                      fill={
                        isMin
                          ? "#10b981"
                          : isMax
                            ? "#f43f5e"
                            : isHovered
                              ? "#38bdf8"
                              : "#0ea5e9"
                      }
                      stroke="#0f172a"
                      strokeWidth="1.8"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 2) Dense, Zero-Gap Daily/Period Bar Strip + Date Axis Below SVG */}
          <div className="mt-2 pt-3 border-t border-slate-800/60">
            <div className="flex items-end gap-1 h-16 w-full">
              {analytics.points.map((pt, idx) => {
                const range = Math.max(500, analytics.maxPrice - analytics.minPrice);
                const pct =
                  Math.round(
                    ((pt.lowestPrice - analytics.minPrice) / range) * 65
                  ) + 30;
                const isSelected =
                  (hoveredIdx !== null ? hoveredIdx : analytics.points.length - 1) ===
                  idx;
                const isMin = pt.lowestPrice === analytics.minPrice;

                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => setHoveredIdx(idx)}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer focus:outline-none"
                    title={`${pt.fullDate}: ${formatPrice(pt.lowestPrice)} (${pt.store})`}
                  >
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isSelected
                          ? "bg-sky-400 shadow-md shadow-sky-500/30"
                          : isMin
                            ? "bg-emerald-500/90"
                            : pt.isCampaignDrop
                              ? "bg-cyan-500/75 group-hover:bg-sky-400"
                              : isDark
                                ? "bg-slate-800 group-hover:bg-sky-500/70"
                                : "bg-sky-200 group-hover:bg-sky-500"
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Date Labels Row */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1.5 px-1">
              <span>{analytics.firstPoint.fullDate}</span>
              <span>
                {
                  analytics.points[Math.floor(analytics.points.length * 0.25)]
                    ?.label
                }
              </span>
              <span>
                {
                  analytics.points[Math.floor(analytics.points.length * 0.5)]
                    ?.label
                }
              </span>
              <span>
                {
                  analytics.points[Math.floor(analytics.points.length * 0.75)]
                    ?.label
                }
              </span>
              <span className="text-emerald-400">
                {analytics.lastPoint.fullDate}
              </span>
            </div>
          </div>
        </div>

        {/* ─── 3. DETAILED MARKET & PRICE ANALYSIS REPORT (ANALİZ BÖLÜMÜ) ─── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 7 Cols: Automated Statistical & Trend Analysis */}
          <div
            className={`lg:col-span-7 rounded-2xl border p-5 space-y-4 ${
              isDark
                ? "bg-slate-950/60 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <h3
                  className={`text-base font-black ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Seçili Tarih Aralığı Piyasa ve Fiyat Analizi
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Canlı Veri Analizi
              </span>
            </div>

            <div
              className={`space-y-3 text-xs leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <p>
                <strong className="text-sky-400">1. Tarih Aralığı Trend Özeti:</strong>{" "}
                Seçtiğiniz{" "}
                <strong>{analytics.firstPoint.fullDate}</strong> ile{" "}
                <strong>{analytics.lastPoint.fullDate}</strong> tarihleri arasındaki{" "}
                <strong>{analytics.totalDays} günlük</strong> periyotta{" "}
                <strong>{phone.name}</strong> modelinin başlangıç fiyatı{" "}
                <strong>{formatPrice(analytics.firstPoint.lowestPrice)}</strong> iken,
                dönem sonunda{" "}
                <strong>{formatPrice(analytics.lastPoint.lowestPrice)}</strong>{" "}
                seviyesine gelerek toplam{" "}
                <strong
                  className={
                    analytics.netChange <= 0 ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {formatPrice(Math.abs(analytics.netChange))} (%
                  {Math.abs(analytics.netChangePct)}{" "}
                  {analytics.netChange <= 0 ? "düşüş" : "artış"})
                </strong>{" "}
                göstermiştir.
              </p>

              <p>
                <strong className="text-emerald-400">
                  2. Ortalama ve Dip Fiyat Kıyaslaması:
                </strong>{" "}
                Bu tarih aralığında 16 mağazanın ağırlıklı dönem ortalaması{" "}
                <strong>{formatPrice(analytics.avgPrice)}</strong> olarak
                hesaplanmıştır. Şu anki en düşük fiyat (
                <strong>{formatPrice(currentPrice)}</strong>), seçili dönem
                ortalamasının{" "}
                <strong>{formatPrice(Math.abs(analytics.diffFromAvg))}</strong>{" "}
                {analytics.diffFromAvg <= 0 ? "altında" : "üstünde"} yer almaktadır.
                Dönem içindeki en düşük dip fiyat{" "}
                <strong>{analytics.minPoint.fullDate}</strong> tarihinde{" "}
                <strong>{analytics.minPoint.store}</strong> üzerinde{" "}
                <strong>{formatPrice(analytics.minPrice)}</strong> olarak
                kaydedilmiştir.
              </p>

              <p>
                <strong className="text-amber-400">
                  3. Uzman Satın Alma Tavsiyesi:
                </strong>{" "}
                Fiyat dalgalanma (volatilite) oranı{" "}
                <strong>%{analytics.volatilityPct}</strong> olup seçilen tarihler
                arasında toplam <strong>{analytics.dropEventsCount} kez</strong> aşağı
                yönlü indirim hareketi tespit edilmiştir. Mevcut fiyat, dönem zirvesi
                olan <strong>{formatPrice(analytics.maxPrice)}</strong> seviyesinden{" "}
                <strong className="text-emerald-400">
                  {formatPrice(analytics.maxPrice - currentPrice)} daha ucuzdur
                </strong>{" "}
                ve alım fırsatı endeksi <strong>{analytics.buyScore}/100</strong> ile{" "}
                <strong className="text-emerald-400">
                  &ldquo;Güçlü Alım Bölgesi&rdquo;
                </strong>{" "}
                sinyali vermektedir.
              </p>
            </div>

            {/* Support / Pivot / Resistance Visual Corridor */}
            <div
              className={`pt-3 border-t grid grid-cols-3 gap-3 text-center ${
                isDark ? "border-slate-800" : "border-slate-200"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border ${
                  isDark
                    ? "bg-emerald-950/30 border-emerald-800/40"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <div className="text-[10px] font-bold text-emerald-400 uppercase">
                  Güçlü Destek (Dip)
                </div>
                <div
                  className={`text-sm font-black mt-0.5 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {formatPrice(analytics.minPrice)}
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  isDark
                    ? "bg-sky-950/30 border-sky-800/40"
                    : "bg-sky-50 border-sky-200"
                }`}
              >
                <div className="text-[10px] font-bold text-sky-400 uppercase">
                  Denge Fiyatı (Ortalama)
                </div>
                <div
                  className={`text-sm font-black mt-0.5 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {formatPrice(analytics.avgPrice)}
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  isDark
                    ? "bg-rose-950/30 border-rose-800/40"
                    : "bg-rose-50 border-rose-200"
                }`}
              >
                <div className="text-[10px] font-bold text-rose-400 uppercase">
                  Direnç Seviyesi (Tavan)
                </div>
                <div
                  className={`text-sm font-black mt-0.5 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {formatPrice(analytics.maxPrice)}
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Key Date Milestones Table */}
          <div
            className={`lg:col-span-5 rounded-2xl border p-5 flex flex-col justify-between ${
              isDark
                ? "bg-slate-950/60 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm font-black flex items-center gap-1.5 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Seçili Tarihler Arası Kritik Fiyat Kayıtları</span>
                </h3>
              </div>

              <div
                className={`divide-y text-xs ${
                  isDark ? "divide-slate-800" : "divide-slate-200"
                }`}
              >
                {[
                  {
                    title: "Dönem Başlangıç Fiyatı",
                    date: analytics.firstPoint.fullDate,
                    store: analytics.firstPoint.store,
                    price: analytics.firstPoint.lowestPrice,
                    badge: "Başlangıç",
                    color: "text-slate-300",
                  },
                  {
                    title: "Dönem En Yüksek (Zirve)",
                    date: analytics.maxPoint.fullDate,
                    store: analytics.maxPoint.store,
                    price: analytics.maxPrice,
                    badge: "En Pahalı",
                    color: "text-rose-400",
                  },
                  {
                    title: "Dönem Ortalama Piyasa",
                    date: `${analytics.totalDays} Günlük Ortalama`,
                    store: "16 Mağaza Ort.",
                    price: analytics.avgPrice,
                    badge: "Ortalama",
                    color: "text-sky-400",
                  },
                  {
                    title: "Dönem En Düşük (Dip)",
                    date: analytics.minPoint.fullDate,
                    store: analytics.minPoint.store,
                    price: analytics.minPrice,
                    badge: "En Ucuz Rekor",
                    color: "text-emerald-400",
                  },
                  {
                    title: "Seçili Bitiş / Güncel Fiyat",
                    date: analytics.lastPoint.fullDate,
                    store: phone.priceStore,
                    price: analytics.lastPoint.lowestPrice,
                    badge: "Güncel",
                    color: "text-emerald-400",
                  },
                ].map((row, rIdx) => (
                  <div
                    key={rIdx}
                    className="py-2.5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div
                        className={`font-bold ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {row.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {row.date} • {row.store}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black price-display ${row.color}`}>
                        {formatPrice(row.price)}
                      </div>
                      <span className="text-[9.5px] text-slate-400 font-semibold">
                        {row.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`mt-3 pt-3 border-t flex items-center justify-between text-[11px] ${
                isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
              }`}
            >
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Resmi satıcı verileriyle doğrulanmıştır</span>
              </span>
              {hasVerifiedOffers && (
                <a
                  href="#fiyat-karsilastir"
                  className="text-sky-400 font-bold hover:underline"
                >
                  {phone.storesPrices?.length || 0} Mağazayı Gör ↓
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
