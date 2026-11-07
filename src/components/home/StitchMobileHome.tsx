"use client";

import { useState } from "react";
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
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export default function StitchMobileHome() {
  const router = useRouter();
  const { openAlertModal } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tümü");
  const [radarTargetPrice, setRadarTargetPrice] = useState(44000);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/telefonlar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const brandList = [
    "Tümü",
    "Apple",
    "Samsung",
    "Xiaomi",
    "POCO",
    "HONOR",
    "Huawei",
    "vivo",
    "Google",
    "Nothing",
  ];

  return (
    <div className="w-full max-w-lg mx-auto px-3.5 py-4 space-y-4 text-slate-100 pb-12">
      {/* ─── 1. HERO SLOGAN & SEARCH ───────────────────────────────────────── */}
      <div className="space-y-3">
        <h1 className="text-[26px] font-black tracking-tight text-white leading-tight">
          En doğru telefonu bul. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#10b981]">
            En dip fiyata yakala.
          </span>
        </h1>

        {/* 2 Stats Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111622] border border-[#1e2638] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-white font-bold">488+ Aktif</strong> Telefon
          </span>

          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111622] border border-[#1e2638] text-slate-300">
            <Shield className="w-3 h-3 text-[#38bdf8]" />
            16 Resmi Distribütör &amp; Satıcı
          </span>
        </div>

        {/* Hero Search Box with "Ara ->" button */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center bg-[#10141d] border border-[#1e2434] rounded-full p-1 pl-3.5 shadow-md focus-within:border-[#1d8cf8] transition-colors"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            placeholder="En dip fiyatlı amiral gemiler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 px-4 py-2 bg-[#1d8cf8] hover:bg-[#1577d6] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1"
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
                    ? "bg-white text-slate-950 font-bold shadow-sm"
                    : "bg-[#111622] text-slate-300 border border-[#1e2638] hover:border-slate-600"
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
          <div className="rounded-xl bg-[#11141c] border border-[#1e2434] p-2.5 text-center">
            <div className="text-[10px] font-bold text-[#10b981] flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>CANLI</span>
            </div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5">
              1.442.740
            </div>
            <div className="text-[9.5px] text-slate-400">Fiyat Taraması</div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl bg-[#11141c] border border-[#1e2434] p-2.5 text-center">
            <div className="text-[10px] font-bold text-[#38bdf8] flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
            </div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5">
              %100
            </div>
            <div className="text-[9.5px] text-slate-400">BTK Garantili</div>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl bg-[#11141c] border border-[#1e2434] p-2.5 text-center">
            <div className="text-[10px] font-bold text-[#10b981] flex items-center justify-center gap-1">
              <Percent className="w-3 h-3" />
            </div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5">
              0 ₺
            </div>
            <div className="text-[9.5px] text-slate-400">Komisyonsuz</div>
          </div>
        </div>
      </div>

      {/* ─── 2. GÜNÜN REKORU FEATURED DEAL CARD ────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#121622] via-[#0e121a] to-[#0a0d14] border border-[#202738] p-4 shadow-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between mb-2.5 relative z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1c2230] border border-[#2c364d] text-[10px] font-bold text-slate-300">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>GÜNÜN REKORU</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0d2821] border border-[#134e3a] text-[10.5px] font-extrabold text-[#10b981]">
            <TrendingDown className="w-3 h-3" />
            <span>-%18 İNDİRİM</span>
          </span>
        </div>

        {/* Card Body: Info on Left, Phone image on Right */}
        <div className="grid grid-cols-12 gap-2 items-center relative z-10">
          <div className="col-span-7 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#38bdf8]">Apple</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">
                A18 Pro
              </span>
            </div>

            <h2 className="text-lg font-black text-white leading-tight">
              iPhone 16 Pro
            </h2>
            <div className="text-[11px] text-slate-400 font-medium">256GB</div>

            <div className="text-[11px] text-slate-300 pt-0.5">
              En ucuz: <strong className="text-[#38bdf8]">Amazon TR</strong>
            </div>

            <div className="text-[10px] text-slate-500">Flaş İndirim</div>

            <div className="text-2xl font-black text-white tracking-tight price-display">
              59.899 ₺
            </div>

            <div className="text-[10px] font-semibold text-[#10b981] flex items-center gap-1 pt-0.5">
              <span>✓ Son 30 günün en düşüğü</span>
            </div>
          </div>

          <div className="col-span-5 flex items-center justify-center">
            <div className="w-28 h-32 flex items-center justify-center p-1">
              <PhoneImage
                src="/images/phones/iphone-16-pro.svg"
                alt="iPhone 16 Pro 256GB"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Full-width CTA Button */}
        <div className="mt-3.5 pt-1 relative z-10">
          <Link
            href="/telefon/iphone-16-pro"
            className="w-full py-2.5 bg-[#1d8cf8] hover:bg-[#1577d6] text-white font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <span>Fırsatı İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ─── 3. ZİRVE CİHAZLARI BİREBİR KIYASLAMA (VS BATTLE CARD) ─────────── */}
      <div className="rounded-2xl bg-[#10131b] border border-[#1e2434] p-3.5 space-y-3">
        <div className="text-[10.5px] font-bold text-[#38bdf8] flex items-center gap-1.5 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>ZİRVE CİHAZLARI BİREBİR KIYASLAMA</span>
        </div>

        {/* Two Devices with VS in Center */}
        <div className="grid grid-cols-11 items-center gap-1 text-center py-1">
          {/* Left: iPhone 16 Pro */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="w-14 h-16 flex items-center justify-center mb-1">
              <PhoneImage
                src="/images/phones/iphone-16-pro.svg"
                alt="iPhone 16 Pro"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xs font-bold text-white truncate max-w-full">
              iPhone 16 Pro
            </div>
            <div className="text-xs font-black text-[#10b981]">59.899 ₺</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              ⚡ 1.72M AnTuTu
            </div>
          </div>

          {/* Center: VS Badge */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-[10px] flex items-center justify-center shadow-md">
              VS
            </div>
            <span className="text-[8.5px] text-slate-500 mt-1">1-0 Üstün</span>
          </div>

          {/* Right: S24 Ultra */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="w-14 h-16 flex items-center justify-center mb-1">
              <PhoneImage
                src="/images/phones/samsung-galaxy-s24-ultra.webp"
                alt="S24 Ultra"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xs font-bold text-white truncate max-w-full">
              S24 Ultra
            </div>
            <div className="text-xs font-black text-[#10b981]">57.499 ₺</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              📷 200MP Quad
            </div>
          </div>
        </div>

        <Link
          href="/karsilastir"
          className="w-full py-2 rounded-xl bg-[#161a24] hover:bg-[#1e2330] border border-[#202738] text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Tüm Özellikleri Kıyasla</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ─── 4. FİYAT TAKİP RADARI: İSTEDİĞİN FİYATI BELİRLE ───────────────── */}
      <div className="rounded-2xl bg-[#10131b] border border-[#1e2434] p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>⏰</span>
              <span>FİYAT TAKİP RADARI</span>
            </div>
            <h3 className="text-sm font-extrabold text-white mt-0.5">
              İstediğin Fiyatı Belirle
            </h3>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#0d2821] border border-[#134e3a] flex items-center justify-center text-[#10b981] animate-pulse">
            <Radar className="w-4 h-4" />
          </div>
        </div>

        {/* Stepper Price Control matching Screenshot: 44.000 ₺ */}
        <div className="flex items-center justify-between bg-[#0b0e14] border border-[#1a1f2c] rounded-xl p-3">
          <div>
            <div className="text-[10px] text-slate-400">Hedef Eşik Fiyat</div>
            <div className="text-2xl font-black text-white tracking-tight price-display mt-0.5">
              {formatPrice(radarTargetPrice)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRadarTargetPrice((p) => Math.max(10000, p - 1000))}
              className="w-8 h-8 rounded-lg bg-[#161a24] hover:bg-[#202636] border border-[#202738] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setRadarTargetPrice((p) => p + 1000)}
              className="w-8 h-8 rounded-lg bg-[#161a24] hover:bg-[#202636] border border-[#202738] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Green Full Width Button */}
        <button
          type="button"
          onClick={() => openAlertModal()}
          className="w-full py-2.5 bg-[#10b981] hover:bg-[#059669] active:scale-98 text-white font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Bu Cihaza Ücretsiz Alarm Kur</span>
        </button>
      </div>

      {/* ─── 5. F/P İNDEKSİ LİDERLERİ (LEADERBOARD) ────────────────────────── */}
      <div className="rounded-2xl bg-[#10131b] border border-[#1e2434] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-[#181d28]">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
            <Shield className="w-4 h-4 text-[#38bdf8]" />
            <span>F/P İndeksi Liderleri</span>
          </div>

          <Link
            href="/telefonlar?sort=price-drop"
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
          >
            <span>Skora Göre</span>
            <span>&gt;</span>
          </Link>
        </div>

        {/* Row 1: Poco F6 Pro */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div className="min-w-0">
              <Link
                href="/telefon/poco-f6-pro"
                className="font-bold text-xs text-white hover:text-[#38bdf8] truncate block"
              >
                Poco F6 Pro
              </Link>
              <div className="text-[10px] text-slate-400 truncate">
                Snapdragon 8 Gen 2
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs font-black text-[#10b981]">23.499 ₺</div>
            <div className="text-[9.5px] text-slate-400">9.8 / 10 Puan</div>
          </div>
        </div>

        {/* Row 2: Galaxy A55 */}
        <div className="flex items-center justify-between py-1.5 border-t border-[#181d28]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div className="min-w-0">
              <Link
                href="/telefon/samsung-galaxy-a55"
                className="font-bold text-xs text-white hover:text-[#38bdf8] truncate block"
              >
                Galaxy A55
              </Link>
              <div className="text-[10px] text-slate-400 truncate">
                AMOLED 120Hz Cam Tasarım
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs font-black text-[#10b981]">16.890 ₺</div>
            <div className="text-[9.5px] text-slate-400">9.4 / 10 Puan</div>
          </div>
        </div>

        {/* Row 3: Nothing Phone 2a */}
        <div className="flex items-center justify-between py-1.5 border-t border-[#181d28]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div className="min-w-0">
              <Link
                href="/telefon/nothing-phone-2a"
                className="font-bold text-xs text-white hover:text-[#38bdf8] truncate block"
              >
                Nothing Phone 2a
              </Link>
              <div className="text-[10px] text-slate-400 truncate">
                Özgün Arayüz &amp; Akıcı UI
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs font-black text-[#10b981]">18.499 ₺</div>
            <div className="text-[9.5px] text-slate-400">9.3 / 10 Puan</div>
          </div>
        </div>
      </div>

      {/* ─── 6. PİYASANIN EN GÖZDELERİ (2X2 GRID OF 4 PHONES) ───────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">
              Piyasanın En Gözdeleri
            </h2>
            <p className="text-[10.5px] text-slate-400">
              Son 24 saatte en çok tıklanan ve fiyatı takip edilenler
            </p>
          </div>
          <Link
            href="/telefonlar"
            className="text-xs font-bold text-[#38bdf8] hover:underline"
          >
            Tümü &gt;
          </Link>
        </div>

        {/* 2x2 Grid matching Screenshot */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Item 1: iPhone 16 Pro Max */}
          <div className="rounded-2xl bg-[#10131b] border border-[#1e2434] p-3 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9.5px] font-bold mb-2">
                <span>🔥 En Popüler</span>
              </div>
              <div className="w-full h-24 flex items-center justify-center p-1 mb-2">
                <PhoneImage
                  src="/images/phones/iphone-16-pro-max.webp"
                  alt="iPhone 16 Pro Max"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[9.5px] font-bold text-slate-400 uppercase">
                APPLE
              </div>
              <h4 className="font-bold text-xs text-white truncate">
                iPhone 16 Pro Max...
              </h4>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Amazon TR</span>
                <span className="line-through text-slate-500">99.999 ₺</span>
              </div>
              <div className="text-sm font-black text-white price-display mt-0.5">
                84.999 ₺
              </div>
            </div>
            <Link
              href="/telefon/iphone-16-pro-max"
              className="mt-2.5 py-1.5 text-center bg-[#161a24] hover:bg-[#202738] border border-[#202738] text-[10.5px] font-bold text-slate-200 rounded-lg block"
            >
              Fiyatları Gör &rarr;
            </Link>
          </div>

          {/* Item 2: Galaxy S25 Ultra */}
          <div className="rounded-2xl bg-[#10131b] border border-[#1e2434] p-3 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9.5px] font-bold mb-2">
                <span>-%12 Fırsat</span>
              </div>
              <div className="w-full h-24 flex items-center justify-center p-1 mb-2">
                <PhoneImage
                  src="/images/phones/samsung-galaxy-s25-ultra.webp"
                  alt="Galaxy S25 Ultra"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[9.5px] font-bold text-slate-400 uppercase">
                SAMSUNG
              </div>
              <h4 className="font-bold text-xs text-white truncate">
                Galaxy S25 Ultra 51...
              </h4>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Hepsiburada</span>
                <span className="line-through text-slate-500">76.490 ₺</span>
              </div>
              <div className="text-sm font-black text-white price-display mt-0.5">
                68.790 ₺
              </div>
            </div>
            <Link
              href="/telefon/samsung-galaxy-s25-ultra"
              className="mt-2.5 py-1.5 text-center bg-[#161a24] hover:bg-[#202738] border border-[#202738] text-[10.5px] font-bold text-slate-200 rounded-lg block"
            >
              Fiyatları Gör &rarr;
            </Link>
          </div>

          {/* Item 3: Xiaomi 15 Pro */}
          <div className="rounded-2xl bg-[#10131b] border border-[#1e2434] p-3 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-[#38bdf8] text-[9.5px] font-bold mb-2">
                <span>⚡ Dip Fiyat</span>
              </div>
              <div className="w-full h-24 flex items-center justify-center p-1 mb-2">
                <PhoneImage
                  src="/images/phones/xiaomi-15-pro.webp"
                  alt="Xiaomi 15 Pro"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[9.5px] font-bold text-slate-400 uppercase">
                XIAOMI
              </div>
              <h4 className="font-bold text-xs text-white truncate">
                Xiaomi 15 Pro 512GB
              </h4>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Trendyol</span>
                <span className="line-through text-slate-500">59.999 ₺</span>
              </div>
              <div className="text-sm font-black text-white price-display mt-0.5">
                52.499 ₺
              </div>
            </div>
            <Link
              href="/telefon/xiaomi-15-pro"
              className="mt-2.5 py-1.5 text-center bg-[#161a24] hover:bg-[#202738] border border-[#202738] text-[10.5px] font-bold text-slate-200 rounded-lg block"
            >
              Fiyatları Gör &rarr;
            </Link>
          </div>

          {/* Item 4: vivo X200 Pro */}
          <div className="rounded-2xl bg-[#10131b] border border-[#1e2434] p-3 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[#10b981] text-[9.5px] font-bold mb-2">
                <span>📷 Kamera Lideri</span>
              </div>
              <div className="w-full h-24 flex items-center justify-center p-1 mb-2">
                <PhoneImage
                  src="/images/phones/vivo-x200-pro.svg"
                  alt="vivo X200 Pro"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-[9.5px] font-bold text-slate-400 uppercase">
                VIVO
              </div>
              <h4 className="font-bold text-xs text-white truncate">
                vivo X200 Pro 512GB
              </h4>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Amazon TR</span>
                <span className="line-through text-slate-500">63.490 ₺</span>
              </div>
              <div className="text-sm font-black text-white price-display mt-0.5">
                56.999 ₺
              </div>
            </div>
            <Link
              href="/telefon/vivo-x200-pro"
              className="mt-2.5 py-1.5 text-center bg-[#161a24] hover:bg-[#202738] border border-[#202738] text-[10.5px] font-bold text-slate-200 rounded-lg block"
            >
              Fiyatları Gör &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 7. HANGİ TELEFONU SEÇECEĞİNİZDEN EMİN DEĞİL MİSİNİZ? (AI CTA) ─── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#131b2e] via-[#0f1422] to-[#0a0d16] border border-[#202738] p-5 text-center space-y-3 relative overflow-hidden shadow-xl">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-[#38bdf8] flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <h3 className="text-base font-black text-white leading-tight">
          Hangi telefonu seçeceğinizden emin değil misiniz?
        </h3>

        <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
          Bütçenizi, kamera önceliğinizi veya kullanım alışkanlığınızı belirtin;
          30 saniyede en iyi 3 alternatifi eşleştirelim.
        </p>

        <Link
          href="/rehber"
          className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#1d8cf8] to-[#3b82f6] hover:from-[#1577d6] hover:to-[#2563eb] text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Akıllı Rehberi Başlat</span>
          <span>🪄</span>
        </Link>
      </div>
    </div>
  );
}
