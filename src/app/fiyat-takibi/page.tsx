"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  Shield,
  ShieldCheck,
  ArrowRight,
  Trash2,
  Heart,
  Award,
  Sparkles,
  Zap,
  Store,
  ChevronRight,
} from "lucide-react";
import { getPhones } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import PhoneImage from "@/components/phone/PhoneImage";
import ProPriceAnalysisCenter from "@/components/phone/ProPriceAnalysisCenter";
import { useApp } from "@/context/AppContext";
import type { Phone } from "@/types";

interface TrendingDeviceCard {
  slug: string;
  brand: string;
  name: string;
  specsLine: string;
  price: number;
  storeCount: number;
  badgeText: string;
  badgeType: "discount" | "new";
  os: "ios" | "android";
  image: string;
}

export default function PriceTrackingPage() {
  const { alerts, removeAlert, favorites, toggleFavorite, createAlert } = useApp();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("iphone-16-pro");
  const [trendFilter, setTrendFilter] = useState<"all" | "ios" | "android">("all");

  const trendingDevices = useMemo(() => {
    return phones.slice(0, 10).map((p) => ({
      slug: p.slug,
      brand: p.brand.toUpperCase(),
      name: p.name,
      specsLine: `${p.specs?.display?.size || 6.7}" • ${p.specs?.performance?.chipset?.split("(")[0].trim() || p.brand}`,
      price: p.lowestPrice,
      storeCount: p.storesCount || p.storesPrices?.length || 1,
      badgeText: p.priceDropPercent ? `-%${p.priceDropPercent}` : p.isNew ? "YENİ" : "DİP",
      badgeType: (p.isNew ? "new" : "discount") as "discount" | "new",
      os: (p.brand.toLowerCase() === "apple" ? "ios" : "android") as "ios" | "android",
      image: p.image || "/images/phones/placeholder.webp",
    }));
  }, [phones]);

  // Quick Radar Card State (Middle Bento Card 2)
  const [radarTargetPrice, setRadarTargetPrice] = useState<number>(44000);

  const heroPhone = phones.length > 0 ? phones[0] : null;
  const vsPhone1 = phones.find((p) => p.brand.toLowerCase() === "apple") || phones[0] || null;
  const vsPhone2 = phones.find((p) => p.brand.toLowerCase() === "samsung" && p.slug !== vsPhone1?.slug) || phones[1] || null;
  const radarPhone = phones[1] || phones[0] || null;

  const fpList = useMemo(() => {
    return phones.slice(0, 3).map((p, idx) => ({
      rank: idx + 1,
      name: p.name,
      sub: `${p.brand} • ${p.specs?.performance?.chipset?.split("(")[0].trim() || "Mobil Donanım"}`,
      price: p.lowestPrice,
      tag: p.priceDropPercent ? `-%${p.priceDropPercent} İndirim` : "Doğrulanmış Fiyat",
      tagEmerald: idx === 0,
      slug: p.slug,
    }));
  }, [phones]);
  const [radarTelegramSms, setRadarTelegramSms] = useState<boolean>(true);
  const [radarCreated, setRadarCreated] = useState<boolean>(false);

  const topAnalyzerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPhones().then((res) => {
      if (res && res.length > 0) {
        setPhones(res);
        const ip16Pro = res.find((p) => p.slug === "iphone-16-pro");
        if (ip16Pro) {
          setSelectedSlug(ip16Pro.slug);
        }
        if (res[1]?.lowestPrice) {
          setRadarTargetPrice(Math.round((res[1].lowestPrice * 0.95) / 100) * 100);
        } else if (res[0]?.lowestPrice) {
          setRadarTargetPrice(Math.round((res[0].lowestPrice * 0.95) / 100) * 100);
        }
      }
    });
  }, []);

  const activePhone =
    phones.find((p) => p.slug === selectedSlug) ||
    phones.find((p) => p.slug.includes("iphone-16-pro")) ||
    null;

  const handleInspectPhone = (slug: string) => {
    const matched =
      phones.find((p) => p.slug === slug) ||
      phones.find((p) => p.slug.includes(slug));
    if (matched) {
      setSelectedSlug(matched.slug);
    } else {
      setSelectedSlug(slug);
    }
    topAnalyzerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCreateQuickRadarAlert = () => {
    const targetPhone = radarPhone || activePhone || phones[0];
    if (targetPhone) {
      createAlert({
        phone: targetPhone,
        targetPrice: radarTargetPrice,
        email: "alarm@enucuztelefon.com",
      });
    }
    setRadarCreated(true);
    setTimeout(() => setRadarCreated(false), 3500);
  };

  const filteredTrending = trendingDevices.filter((item: TrendingDeviceCard) => {
    if (trendFilter === "all") return true;
    return item.os === trendFilter;
  });

  return (
    <div className="min-h-screen bg-[#070a0f] text-white pb-20 selection:bg-sky-500 selection:text-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-6 space-y-10">
        {/* ─── 1. PRO ANALİZ MERKEZİ (MAĞAZA FİYAT KARŞILAŞTIRMA & FİYAT ANALİZ EKRANI) ─── */}
        <section ref={topAnalyzerRef} className="scroll-mt-6">
          <ProPriceAnalysisCenter
            phone={activePhone}
            phones={phones}
            onSelectPhone={(slug) => setSelectedSlug(slug)}
          />
        </section>

        {/* ─── 2. HERO DEAL & HEAD-TO-HEAD VS BENTO ROW (8 COLS + 4 COLS) ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: iPhone 16 Pro 256GB Flagship Deal Card */}
          <div className="lg:col-span-8 rounded-3xl bg-[#101520] border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Left Text Info */}
              <div className="sm:col-span-7 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {heroPhone?.name || "Günün Öne Çıkan Modeli"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {heroPhone?.specs?.performance?.chipset || heroPhone?.brand || "Gelişmiş donanım"} • Doğrulanmış yetkili satıcı fiyatı.
                </p>

                <div className="pt-1 flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-white price-display tracking-tight">
                    {heroPhone ? formatPrice(heroPhone.lowestPrice) : "Fiyat Yükleniyor"}
                  </span>
                  {heroPhone?.highestPrice && heroPhone.highestPrice > heroPhone.lowestPrice && (
                    <span className="text-sm text-slate-500 line-through font-bold">
                      {formatPrice(heroPhone.highestPrice)}
                    </span>
                  )}
                  {heroPhone?.priceDropPercent ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                      -%{heroPhone.priceDropPercent} İndirim
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span>
                    En düşük satıcı:{" "}
                    <strong className="text-white font-extrabold">
                      {heroPhone?.lowestPriceStoreName || "Doğrulanmış Satıcı"}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Right Framed Phone Showcase */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <div className="w-full max-w-[230px] aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#172033] via-[#0d121d] to-[#090d14] border border-white/10 p-4 flex items-center justify-center shadow-inner group">
                  <div className="w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <PhoneImage
                      src={heroPhone?.image || "/images/phones/placeholder.webp"}
                      alt={heroPhone?.name || "Telefon"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sparkline & Store Action Bar */}
            <div className="mt-6 rounded-2xl bg-[#0b0f17] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-1">
                    6 Aylık Fiyat Telemetrisi Grafiği
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Mini Green Sparkline SVG */}
                    <svg
                      viewBox="0 0 120 28"
                      className="w-28 h-7 overflow-visible"
                    >
                      <path
                        d="M 2 8 L 26 6 L 50 14 L 74 11 L 96 19 L 116 23"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <circle cx="116" cy="23" r="3.5" fill="#10b981" />
                    </svg>
                    {heroPhone?.highestPrice && heroPhone.highestPrice > heroPhone.lowestPrice ? (
                      <span className="text-xs font-extrabold text-emerald-400">
                        + {formatPrice(heroPhone.highestPrice - heroPhone.lowestPrice)} Tasarruf
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <div className="flex items-center gap-1">
                  {heroPhone?.lowestPriceStoreName && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">
                      {heroPhone.lowestPriceStoreName}
                    </span>
                  )}
                  {heroPhone?.storesPrices?.slice(0, 3).map((st) => (
                    <span
                      key={st.store}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300"
                    >
                      {st.store}
                    </span>
                  ))}
                </div>

                <Link
                  href={heroPhone ? `/telefon/${heroPhone.slug}` : "/telefonlar"}
                  className="px-4 py-2.5 rounded-xl bg-[#1d8cf8] hover:bg-sky-500 text-white font-extrabold text-xs inline-flex items-center gap-1 shadow-lg shadow-sky-500/25 transition-all shrink-0"
                >
                  <span>Fırsatı İncele</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Quick VS Battle Card */}
          <div className="lg:col-span-4 rounded-3xl bg-[#101520] border border-white/10 p-6 flex flex-col justify-between shadow-2xl">
            <div className="rounded-2xl bg-[#0b0f17] border border-white/10 p-4 grid grid-cols-2 gap-3 text-center">
              {/* Phone 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center mb-2.5">
                  <PhoneImage
                    src={vsPhone1?.image || "/images/phones/placeholder.webp"}
                    alt={vsPhone1?.name || "Model 1"}
                  />
                </div>
                <div className="text-xs font-black text-white truncate max-w-full">
                  {vsPhone1?.name || "Model 1"}
                </div>
                <div className="text-xs font-extrabold text-sky-400 mt-0.5">
                  {vsPhone1?.lowestPrice ? formatPrice(vsPhone1.lowestPrice) : "Fiyat Yok"}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {vsPhone1?.specs?.display?.size ? `${vsPhone1.specs.display.size}" Ekran` : vsPhone1?.brand}
                </div>
              </div>

              {/* Phone 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center mb-2.5">
                  <PhoneImage
                    src={vsPhone2?.image || "/images/phones/placeholder.webp"}
                    alt={vsPhone2?.name || "Model 2"}
                  />
                </div>
                <div className="text-xs font-black text-white truncate max-w-full">
                  {vsPhone2?.name || "Model 2"}
                </div>
                <div className="text-xs font-extrabold text-sky-400 mt-0.5">
                  {vsPhone2?.lowestPrice ? formatPrice(vsPhone2.lowestPrice) : "Fiyat Yok"}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {vsPhone2?.specs?.display?.size ? `${vsPhone2.specs.display.size}" Ekran` : vsPhone2?.brand}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="my-4">
              <Link
                href={vsPhone1 && vsPhone2 ? `/karsilastir?phone1=${vsPhone1.slug}&phone2=${vsPhone2.slug}` : "/karsilastir"}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Karşılaştırmayı Başlat</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 3. THREE-COLUMN TELEMETRY & RADAR BENTO ROW ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: F/P RADARI — Fiyat/Performans Liderleri */}
          <div className="rounded-3xl bg-[#101520] border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  F/P RADARI
                </span>
                <Award className="w-4 h-4 text-slate-400" />
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white">
                Fiyat/Performans Liderleri
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Bütçenize göre en yüksek donanım endeksine sahip modeller.
              </p>

              <div className="mt-5 space-y-2.5">
                {fpList.map((item: any) => (
                  <Link
                    key={item.rank}
                    href={`/telefon/${item.slug}`}
                    className="rounded-2xl bg-[#0b0f17] hover:bg-[#141c2c] border border-white/10 px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                          item.rank === 1
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/5 text-slate-400 border border-white/10"
                        }`}
                      >
                        {item.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.sub}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-black text-white price-display">
                        {formatPrice(item.price)}
                      </div>
                      <div
                        className={`text-[10px] font-bold ${
                          item.tagEmerald ? "text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        {item.tag}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/telefonlar/en-ucuz"
              className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Tüm Fiyat Kademe Listelerini Gör</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: AKILLI RADAR — Fiyat Alarmı Kurun */}
          <div className="rounded-3xl bg-[#101520] border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-black uppercase tracking-wider">
                  AKILLI RADAR
                </span>
                <Bell className="w-4 h-4 text-slate-400" />
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white">
                Fiyat Alarmı Kurun
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Seçtiğiniz model hedef rakama indiği an saniyeler içinde
                bildirim alın.
              </p>

              <div className="mt-5 rounded-2xl bg-[#0b0f17] border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Hedef Cihaz:
                  </span>
                  <strong className="text-white font-extrabold truncate max-w-[180px]">
                    {radarPhone?.name || "Model Seçiniz"}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Güncel Fiyat:
                  </span>
                  <span className="text-slate-300 font-bold">
                    {radarPhone?.lowestPrice ? formatPrice(radarPhone.lowestPrice) : "Fiyat Yok"}
                  </span>
                </div>

                <div className="rounded-xl bg-emerald-950/25 border border-emerald-500/30 px-3.5 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-400">
                    Hedef Eşik Fiyat
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-white">₺</span>
                    <input
                      type="number"
                      value={radarTargetPrice}
                      onChange={(e) =>
                        setRadarTargetPrice(Number(e.target.value))
                      }
                      className="w-20 bg-transparent text-right text-sm font-black text-white outline-none"
                    />
                  </div>
                </div>

                <div
                  onClick={() => setRadarTelegramSms((v) => !v)}
                  className="pt-1 flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                    <span>Telegram &amp; SMS Bildirimi</span>
                  </span>
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      radarTelegramSms ? "bg-[#1d8cf8]" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        radarTelegramSms ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateQuickRadarAlert}
              className="mt-5 w-full py-3 rounded-2xl bg-[#1d8cf8] hover:bg-sky-500 text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>
                {radarCreated
                  ? "Alarm Oluşturuldu ✓"
                  : "Ücretsiz Alarm Oluştur"}
              </span>
            </button>
          </div>

          {/* Card 3: DOĞRULANMIŞ AĞ — Sıfır Risk Garantisi */}
          <div className="rounded-3xl bg-[#101520] border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  DOĞRULANMIŞ AĞ
                </span>
                <Shield className="w-4 h-4 text-slate-400" />
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white">
                Sıfır Risk Garantisi
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Yalnızca resmi ithalat ve yetkili distribütör faturalı satıcılar
                listelenir.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-[#0b0f17] border border-white/10 p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">
                      BTK IMEI Sorgulama
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Tüm listelenen satıcılar Türkiye kayıtlı seri
                      numaralarıyla senkronizedir.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0b0f17] border border-white/10 p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">
                      16 Yetkili Pazar Yeri
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Apple Store, Amazon, Hepsiburada, Teknosa, MediaMarkt ve
                      diğerleri.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">
                Güvenlik Puanı: <strong className="text-white">100/100</strong>
              </span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Aktif Doğrulama</span>
              </span>
            </div>
          </div>
        </section>

        {/* ─── OPTIONAL ACTIVE USER ALERTS BAR (IF USER CREATED ALERTS) ─── */}
        {alerts.length > 0 && (
          <section className="rounded-3xl bg-[#101520] border border-white/10 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm sm:text-base font-black text-white">
                  Aktif Fiyat Alarmlarınız ({alerts.length})
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold">
                ● Canlı Takip Ediliyor
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 bg-[#0b0f17] rounded-2xl border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 bg-white/5 rounded-xl p-1.5 border border-white/10 flex items-center justify-center shrink-0">
                      <PhoneImage
                        src={alert.phoneImage}
                        alt={alert.phoneName}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-white text-xs truncate">
                        {alert.phoneName}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Hedef:{" "}
                        <strong className="text-emerald-400">
                          {formatPrice(alert.targetPrice)}
                        </strong>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {alert.email}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Alarmı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 4. CANLI TRENDLER: PİYASANIN EN GÖZDE CİHAZLARI ─── */}
        <section className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-1">
                CANLI TRENDLER
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Piyasanın En Gözde Cihazları
              </h2>
            </div>

            {/* OS Filter Pills */}
            <div className="flex items-center gap-1 bg-[#101520] border border-white/10 rounded-xl p-1 self-start sm:self-auto">
              {[
                { id: "all" as const, label: "Tümü" },
                { id: "ios" as const, label: "iOS" },
                { id: "android" as const, label: "Android" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTrendFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    trendFilter === tab.id
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTrending.map((device: TrendingDeviceCard) => {
              const isFav = favorites.includes(device.slug);
              return (
                <div
                  key={device.slug}
                  className="group rounded-3xl bg-[#101520] border border-white/10 hover:border-sky-500/40 p-5 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
                >
                  <div>
                    {/* Top Row: Badge + Heart */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                          device.badgeType === "discount"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/10 text-white border border-white/15"
                        }`}
                      >
                        {device.badgeText}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const found = phones.find(
                            (p) => p.slug === device.slug || p.slug.includes(device.slug)
                          );
                          if (found) {
                            toggleFavorite(found);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Favorilere Ekle"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Studio Dark Image Box */}
                    <div className="w-full h-40 rounded-2xl bg-gradient-to-b from-[#161e2e] to-[#0b0f17] border border-white/5 p-4 flex items-center justify-center mb-4">
                      <div className="w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <PhoneImage src={device.image} alt={device.name} />
                      </div>
                    </div>

                    {/* Brand & Model Info */}
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {device.brand}
                    </div>
                    <h3 className="text-base font-black text-white mt-0.5">
                      {device.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      {device.specsLine}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xl font-black text-white price-display">
                        {formatPrice(device.price)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {device.storeCount} Mağaza
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInspectPhone(device.slug)}
                        className="col-span-2 py-2.5 rounded-xl bg-white/5 hover:bg-[#1d8cf8] text-slate-200 hover:text-white border border-white/10 hover:border-transparent font-extrabold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Fiyatları İncele</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. SMART CHOICE ASSISTANT BANNER (SİZİN İÇİN UYGUN AKILLI TERCİH) ─── */}
        <section className="rounded-3xl bg-gradient-to-r from-[#101520] via-[#131d31] to-[#172846] border border-white/10 p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl">
            <div className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-1.5">
              SİZİN İÇİN UYGUN AKILLI TERCİH
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-snug">
              Hangi telefonu seçeceğinizden emin değil misiniz?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              5 adımlık akıllı cihaz asistanımızla bütçenize ve ihtiyaçlarınıza
              en uygun amiral gemisini 60 saniyede bulun.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/telefon-rehberi"
              className="px-6 py-3.5 rounded-2xl bg-[#1d8cf8] hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <span>Akıllı Rehberi Başlat</span>
              <Sparkles className="w-4 h-4" />
            </Link>
            <Link
              href="/telefonlar"
              className="px-6 py-3.5 rounded-2xl bg-[#0b0f17] hover:bg-white/10 text-white font-extrabold text-xs sm:text-sm border border-white/15 transition-all"
            >
              Tüm Modelleri Keşfet
            </Link>
          </div>
        </section>

        {/* ─── 6. AUTHORIZED SELLER & INTEGRATION NETWORK FOOTER STRIP ─── */}
        <section className="pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              YETKİLİ SATICI VE ENTEGRASYON AĞI
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sertifikalı pazar yerleri ve yetkili Apple distribütörlerinin anlık
              fiyat telemetrisi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              "Apple Store",
              "Hepsiburada",
              "Trendyol",
              "Amazon TR",
              "MediaMarkt",
              "Teknosa",
            ].map((storeName) => (
              <Link
                key={storeName}
                href="/magazalar"
                className="px-3.5 py-1.5 rounded-xl bg-[#101520] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                {storeName}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
