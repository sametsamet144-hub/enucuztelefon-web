"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  Zap,
  TrendingDown,
  Bell,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  ExternalLink,
  Radar,
  Percent,
} from "lucide-react";
import { getPhones } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { Phone } from "@/types";

export default function StitchMobileHome() {
  const router = useRouter();
  const { openAlertModal, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tümü");
  const [radarTargetPrice, setRadarTargetPrice] = useState(44000);
  const [liveScanCount, setLiveScanCount] = useState(1442740);
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getPhones().then((res) => {
      if (res && res.length > 0) setPhones(res);
    });
  }, []);

  const heroPhone = phones.length > 0 ? phones[0] : null;
  const vsPhone1 = phones.find((p) => p.brand.toLowerCase() === "apple") || phones[0] || null;
  const vsPhone2 = phones.find((p) => p.brand.toLowerCase() === "samsung" && p.slug !== vsPhone1?.slug) || phones[1] || null;

  const tickerItems = useMemo(() => {
    return phones
      .filter((p) => p.lowestPrice > 0)
      .slice(0, 4)
      .map((p) => ({
        icon: p.priceDropPercent ? "📉" : "⚡",
        text: `${p.name} ${p.lowestPriceStoreName ? p.lowestPriceStoreName + "'de" : "en uygun"} ${formatPrice(p.lowestPrice)}`,
        tag: p.priceDropPercent ? `-%${p.priceDropPercent} İndirim` : "Doğrulanmış",
        href: `/telefon/${p.slug}`,
      }));
  }, [phones]);

  const popularPhones = useMemo(() => {
    return phones.slice(0, 4);
  }, [phones]);

  const fpPhones = useMemo(() => {
    return phones.slice(0, 3);
  }, [phones]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveScanCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/telefonlar?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/telefonlar");
    }
  };

  const brandList = [
    "Tümü",
    "Apple",
    "Samsung",
    "Xiaomi",
  ];

  return (
    <div className="w-full max-w-lg mx-auto pb-12 text-on-surface bg-background relative overflow-hidden">
      {/* Ambient Radial Glow Orbs for Mobile */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[280px] bg-primary-container/15 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── 0. LIVE MOBILE MARQUEE TICKER ─────────────────────────────────── */}
      <div className="w-full bg-surface-container-lowest/90 border-b border-white/[0.06] backdrop-blur-md overflow-hidden py-1.5 px-3 flex items-center relative z-20">
        <div className="shrink-0 flex items-center gap-1.5 pr-2.5 mr-2.5 border-r border-white/10 z-10 bg-surface-container-lowest">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary">
            CANLI
          </span>
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee-infinite items-center gap-6 text-[11.5px] text-on-surface-variant">
            {tickerItems.length > 0 && [...tickerItems, ...tickerItems].map(
              (item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>{item.icon}</span>
                  <span className="font-semibold text-on-surface">
                    {item.text}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-tertiary/10 text-[10px] font-semibold text-tertiary">
                    ({item.tag})
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <div className="px-3.5 py-4 space-y-4 relative z-10">
        {/* ─── 1. HERO SLOGAN & SEARCH ───────────────────────────────────────── */}
        <div className="space-y-3">
          <h1 className="text-[28px] font-black tracking-tight text-white leading-tight">
            En doğru telefonu bul. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2997ff] via-[#a3c9ff] to-[#47e266]">
              En dip fiyata yakala.
            </span>
          </h1>

          {/* 2 Stats Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container/80 border border-white/[0.08] text-on-surface-variant backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <strong className="text-white font-bold">488+ Aktif</strong>{" "}
              Telefon
            </span>

            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container/80 border border-white/[0.08] text-on-surface-variant backdrop-blur-md">
              <Shield className="w-3 h-3 text-primary" />
              16 Resmi Distribütör &amp; Satıcı
            </span>
          </div>

          {/* Hero Search Box with "Ara ->" button */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-surface-container/90 border border-white/[0.08] rounded-full p-1.5 pl-3.5 shadow-2xl backdrop-blur-xl focus-within:border-primary/50 transition-all"
          >
            <Search className="w-4 h-4 text-outline shrink-0 mr-2" />
            <input
              type="text"
              placeholder="En dip fiyatlı amiral gemiler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs text-on-surface placeholder-outline focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 px-4 py-2 bg-primary-container hover:bg-primary hover:text-on-primary text-white text-xs font-bold rounded-full transition-all flex items-center gap-1 shadow-[0_0_20px_rgba(41,151,255,0.25)]"
            >
              <span>Ara</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Brand Horizontal Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
            {brandList.map((brand) => {
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(brand);
                    if (brand !== "Tümü") {
                      router.push(`/telefonlar?brand=${brand.toLowerCase()}`);
                    }
                  }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-white text-surface font-bold shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant border border-white/[0.06] hover:text-on-surface"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* 3 Metric Summary Cards */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Card 1 */}
            <div className="rounded-xl bg-surface-container/80 border border-white/[0.06] p-2.5 text-center backdrop-blur-md">
              <div className="text-[10px] font-bold text-tertiary flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                <span>CANLI</span>
              </div>
              <div className="text-sm sm:text-base font-black text-white mt-0.5 tabular-nums">
                {liveScanCount.toLocaleString("tr-TR")}
              </div>
              <div className="text-[9.5px] text-outline">Fiyat Taraması</div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl bg-surface-container/80 border border-white/[0.06] p-2.5 text-center backdrop-blur-md">
              <div className="text-[10px] font-bold text-primary flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
              </div>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">
                %100
              </div>
              <div className="text-[9.5px] text-outline">BTK Garantili</div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl bg-surface-container/80 border border-white/[0.06] p-2.5 text-center backdrop-blur-md">
              <div className="text-[10px] font-bold text-primary flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
              </div>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">
                Anlık
              </div>
              <div className="text-[9.5px] text-outline">Fiyat Takibi</div>
            </div>
          </div>
        </div>

        {/* ─── 2. GÜNÜN REKORU FEATURED DEAL CARD (WITH BORDER-BEAM) ─────────── */}
        <div className="border-beam-card bg-surface-container/85 p-4 shadow-xl relative overflow-hidden group">
          <div className="beam-spotlight" />
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary-container/15 rounded-full blur-[60px] pointer-events-none" />

          {/* Top Badges */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-[10px] font-bold text-on-surface">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>GÜNÜN REKORU</span>
            </span>

            {heroPhone?.priceDropPercent ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/30 text-[10.5px] font-extrabold text-tertiary price-drop-pulse">
                <TrendingDown className="w-3 h-3" />
                <span>-%{heroPhone.priceDropPercent} İNDİRİM</span>
              </span>
            ) : null}
          </div>

          {/* Card Body: Info on Left, 3D Studio Phone image on Right */}
          <div className="grid grid-cols-12 gap-2 items-center relative z-10">
            <div className="col-span-7 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-primary">
                  GÜNÜN FIRSATI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-on-surface-variant">
                  {heroPhone?.brand || "Mobil"}
                </span>
              </div>

              <h2 className="text-lg font-black text-on-surface leading-tight">
                {heroPhone?.name || "Öne Çıkan Model"}
              </h2>

              <div className="text-[11px] text-on-surface-variant pt-0.5">
                En ucuz: <strong className="text-primary">{heroPhone?.lowestPriceStoreName || "Doğrulanmış Satıcı"}</strong>
              </div>

              <div className="text-2xl font-black text-on-surface tracking-tight price-number-pulse">
                {heroPhone?.lowestPrice ? formatPrice(heroPhone.lowestPrice) : "Fiyat Yükleniyor"}
              </div>

              {heroPhone?.highestPrice && heroPhone.highestPrice > heroPhone.lowestPrice && (
                <div className="text-[10px] text-outline line-through">
                  {formatPrice(heroPhone.highestPrice)}
                </div>
              )}
            </div>

            <div className="col-span-5 flex items-center justify-center">
              <div className="w-32 h-36 flex items-center justify-center p-1 rounded-xl bg-surface-container-lowest/60">
                <img
                  src={heroPhone?.image || "/images/phones/placeholder.webp"}
                  alt={heroPhone?.name || "Telefon"}
                  className="w-full h-full object-contain drop-shadow-2xl animate-float-mockup"
                />
              </div>
            </div>
          </div>

          {/* Full-width CTA Button */}
          <div className="mt-3.5 pt-1 relative z-10">
            <Link
              href={heroPhone ? `/telefon/${heroPhone.slug}` : "/telefonlar"}
              className="w-full py-2.5 bg-primary-container hover:bg-primary hover:text-on-primary text-white font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(41,151,255,0.3)] transition-all"
            >
              <span>Fırsatı İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ─── 3. ZİRVE CİHAZLARI BİREBİR KIYASLAMA (VS BATTLE CARD) ─────────── */}
        <div className="border-beam-card beam-delay-1 bg-surface-container/85 p-4 space-y-3 group-vs group">
          <div className="beam-spotlight" />
          <div className="text-[10.5px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider relative z-10">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>ZİRVEDEKİLERİN KAPIŞMASI</span>
          </div>

          {/* Two Devices with VS in Center */}
          <div className="grid grid-cols-11 items-center gap-1 text-center py-2 rounded-xl bg-surface-container-lowest p-3 border border-white/[0.04] relative z-10">
            {/* Left Device */}
            <div className="col-span-5 vs-device-left flex flex-col items-center transition-transform duration-300">
              <div className="w-14 h-20 flex items-center justify-center mb-1">
                <img
                  src={vsPhone1?.image || "/images/phones/placeholder.webp"}
                  alt={vsPhone1?.name || "Model 1"}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="text-xs font-bold text-on-surface truncate max-w-full">
                {vsPhone1?.name || "Model 1"}
              </div>
              <div className="text-xs font-black text-tertiary">
                {vsPhone1?.lowestPrice ? formatPrice(vsPhone1.lowestPrice) : "Fiyat Yok"}
              </div>
            </div>

            {/* Center: VS Badge */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-surface-container-highest border border-white/10 text-primary font-black text-[10px] flex items-center justify-center shadow-lg">
                VS
              </div>
            </div>

            {/* Right Device */}
            <div className="col-span-5 vs-device-right flex flex-col items-center transition-transform duration-300">
              <div className="w-14 h-20 flex items-center justify-center mb-1">
                <img
                  src={vsPhone2?.image || "/images/phones/placeholder.webp"}
                  alt={vsPhone2?.name || "Model 2"}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="text-xs font-bold text-on-surface truncate max-w-full">
                {vsPhone2?.name || "Model 2"}
              </div>
              <div className="text-xs font-black text-tertiary">
                {vsPhone2?.lowestPrice ? formatPrice(vsPhone2.lowestPrice) : "Fiyat Yok"}
              </div>
            </div>
          </div>

          <Link
            href={vsPhone1 && vsPhone2 ? `/karsilastir?phone1=${vsPhone1.slug}&phone2=${vsPhone2.slug}` : "/karsilastir"}
            className="relative z-10 w-full py-2.5 rounded-full bg-surface-container-highest hover:bg-surface-bright text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Tüm Özellikleri Kıyasla</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ─── 4. FİYAT TAKİP RADARI: İSTEDİĞİN FİYATI BELİRLE ───────────────── */}
        <div className="border-beam-card beam-delay-2 bg-surface-container/85 p-4 space-y-3 group-hover-bell">
          <div className="beam-spotlight" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                <span>⏰</span>
                <span>FİYAT TAKİP RADARI</span>
              </div>
              <h3 className="text-sm font-extrabold text-on-surface mt-0.5">
                İstediğin Fiyatı Belirle
              </h3>
            </div>

            <div className="w-8 h-8 rounded-full bg-tertiary/15 border border-tertiary/30 flex items-center justify-center text-tertiary price-drop-pulse">
              <Radar className="w-4 h-4" />
            </div>
          </div>

          {/* Stepper Price Control */}
          <div className="flex items-center justify-between bg-surface-container-lowest border border-white/[0.05] rounded-xl p-3 relative z-10">
            <div>
              <div className="text-[10px] text-tertiary font-semibold">
                Hedef Eşik Fiyat
              </div>
              <div className="text-2xl font-black text-on-surface tracking-tight price-number-pulse mt-0.5">
                {formatPrice(radarTargetPrice)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setRadarTargetPrice((p) => Math.max(10000, p - 1000))
                }
                className="w-8 h-8 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRadarTargetPrice((p) => p + 1000)}
                className="w-8 h-8 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Green Full Width Button */}
          <button
            type="button"
            onClick={() => {
              showToast(
                `${formatPrice(radarTargetPrice)} hedef fiyat alarmı hazırlandı!`
              );
              openAlertModal();
            }}
            className="relative z-10 w-full py-2.5 bg-tertiary-container hover:bg-tertiary hover:text-on-tertiary text-white font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 bell-target" />
            <span>Bu Cihaza Ücretsiz Alarm Kur</span>
          </button>
        </div>

        {/* ─── 5. F/P İNDEKSİ LİDERLERİ (LEADERBOARD) ────────────────────────── */}
        <div className="border-beam-card beam-delay-3 bg-surface-container/85 p-4 space-y-2.5">
          <div className="beam-spotlight" />
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-on-surface">
              <Shield className="w-4 h-4 text-primary" />
              <span>F/P İndeksi Liderleri</span>
            </div>

            <Link
              href="/telefonlar?sort=price-drop"
              className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Skora Göre</span>
              <span>&gt;</span>
            </Link>
          </div>

          {/* Dynamic F/P phones list */}
          {fpPhones.map((p, idx) => (
            <div key={p.slug} className={`flex items-center justify-between py-1.5 ${idx > 0 ? "border-t border-white/[0.05]" : ""} relative z-10`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-full bg-tertiary/15 text-tertiary font-black text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <Link
                    href={`/telefon/${p.slug}`}
                    className="font-bold text-xs text-on-surface hover:text-primary truncate block"
                  >
                    {p.name}
                  </Link>
                  <div className="text-[10px] text-outline truncate">
                    {p.lowestPriceStoreName || "Doğrulanmış Satıcı"}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-tertiary">
                  {p.lowestPrice > 0 ? formatPrice(p.lowestPrice) : "Fiyat Yok"}
                </div>
                {p.priceDropPercent ? (
                  <div className="text-[9.5px] text-emerald-400 font-bold">-%{p.priceDropPercent}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* ─── 6. PİYASANIN EN GÖZDELERİ (2X2 GRID OF 4 PHONES) ───────────────── */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-on-surface">
                Piyasanın En Gözdeleri
              </h2>
              <p className="text-[10.5px] text-outline">
                Son 24 saatte en çok tıklanan ve fiyatı takip edilenler
              </p>
            </div>
            <Link
              href="/telefonlar"
              className="text-xs font-bold text-primary hover:underline"
            >
              Tümü &gt;
            </Link>
          </div>

          {/* 2x2 Grid with High-Res Studio Renders */}
          <div className="grid grid-cols-2 gap-2.5">
            {popularPhones.map((phone) => {
              const hasDrop = (phone.priceDropPercent || 0) > 0;
              const hasOldPrice =
                phone.highestPrice && phone.highestPrice > phone.lowestPrice;
              return (
                <div
                  key={phone.id || phone.slug}
                  className="rounded-2xl bg-surface-container/90 border border-white/[0.06] p-3 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    {hasDrop ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary text-[9.5px] font-bold mb-2 price-drop-pulse">
                        <span>🔥 -%{phone.priceDropPercent} Fırsat</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[9.5px] font-bold mb-2">
                        <span>⚡ Doğrulanmış Fiyat</span>
                      </div>
                    )}
                    <div className="w-full h-28 flex items-center justify-center p-1 mb-2">
                      <img
                        src={phone.image || "/images/phones/placeholder.webp"}
                        alt={phone.name}
                        className="h-24 object-contain drop-shadow-xl"
                      />
                    </div>
                    <div className="text-[9.5px] font-bold text-outline uppercase">
                      {phone.brand}
                    </div>
                    <h4 className="font-bold text-xs text-on-surface truncate">
                      {phone.name}
                    </h4>
                    <div className="text-[10px] text-outline mt-1 flex items-center justify-between">
                      <span>{phone.lowestPriceStoreName || "En Uygun"}</span>
                      {hasOldPrice ? (
                        <span className="line-through">
                          {formatPrice(phone.highestPrice!)}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm font-black text-on-surface mt-0.5">
                      {phone.lowestPrice > 0
                        ? formatPrice(phone.lowestPrice)
                        : "Fiyat Yok"}
                    </div>
                  </div>
                  <Link
                    href={`/telefon/${phone.slug}`}
                    className="mt-2.5 py-1.5 text-center bg-surface-container-highest hover:bg-primary-container text-[10.5px] font-bold text-on-surface hover:text-white rounded-full block transition-colors"
                  >
                    Fiyatları Gör &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 7. HANGİ TELEFONU SEÇECEĞİNİZDEN EMİN DEĞİL MİSİNİZ? (AI CTA) ─── */}
        <div className="border-beam-card beam-delay-4 bg-gradient-to-r from-surface-container to-surface-container-high p-5 text-center space-y-3 relative overflow-hidden shadow-2xl">
          <div className="beam-spotlight" />
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-primary-container/20 rounded-full blur-[60px] pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center mx-auto shadow-inner relative z-10">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <h3 className="text-base font-black text-on-surface leading-tight relative z-10">
            Hangi telefonu seçeceğinizden emin değil misiniz?
          </h3>

          <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed relative z-10">
            Bütçenizi, kamera önceliğinizi veya kullanım alışkanlığınızı
            belirtin; 30 saniyede en iyi 3 alternatifi eşleştirelim.
          </p>

          <Link
            href="/telefon-rehberi"
            className="relative z-10 inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary-container hover:bg-primary hover:text-on-primary text-white font-bold text-xs rounded-full shadow-[0_0_20px_rgba(41,151,255,0.3)] transition-all"
          >
            <span>Akıllı Rehberi Başlat</span>
            <span>✨</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
