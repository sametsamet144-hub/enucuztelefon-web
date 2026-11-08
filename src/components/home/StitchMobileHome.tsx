"use client";

import { useState, useEffect } from "react";
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
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const MOBILE_TICKER_ITEMS = [
  {
    icon: "📉",
    text: "Galaxy S24 Ultra Hepsiburada'da 4.200 ₺ düştü",
    tag: "Son 6 Ayın Dibi",
    href: "/telefon/samsung-galaxy-s24-ultra",
  },
  {
    icon: "🔥",
    text: "iPhone 16 Pro 256GB Amazon TR'de 59.899 ₺",
    tag: "-%18 İndirim",
    href: "/telefon/iphone-16-pro",
  },
  {
    icon: "⚡",
    text: "Xiaomi 15 Ultra Trendyol'da 53.819 ₺",
    tag: "Stok Sınırlı",
    href: "/telefon/xiaomi-15-ultra",
  },
];

export default function StitchMobileHome() {
  const router = useRouter();
  const { openAlertModal, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tümü");
  const [radarTargetPrice, setRadarTargetPrice] = useState(44000);
  const [liveScanCount, setLiveScanCount] = useState(1442740);

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
            {[...MOBILE_TICKER_ITEMS, ...MOBILE_TICKER_ITEMS].map(
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

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/30 text-[10.5px] font-extrabold text-tertiary price-drop-pulse">
              <TrendingDown className="w-3 h-3" />
              <span>-%18 İNDİRİM</span>
            </span>
          </div>

          {/* Card Body: Info on Left, 3D Studio Phone image on Right */}
          <div className="grid grid-cols-12 gap-2 items-center relative z-10">
            <div className="col-span-7 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-primary">
                  GÜNÜN FIRSATI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-on-surface-variant">
                  A18 Pro
                </span>
              </div>

              <h2 className="text-lg font-black text-on-surface leading-tight">
                iPhone 16 Pro
              </h2>
              <div className="text-[11px] text-outline font-medium">256GB</div>

              <div className="text-[11px] text-on-surface-variant pt-0.5">
                En ucuz: <strong className="text-primary">Amazon TR</strong>
              </div>

              <div className="text-[10px] text-outline">Flaş İndirim</div>

              <div className="text-2xl font-black text-on-surface tracking-tight price-number-pulse">
                59.899 ₺
              </div>

              <div className="text-[10px] font-semibold text-tertiary flex items-center gap-1 pt-0.5">
                <span>✓ Son 30 günün en düşüğü</span>
              </div>
            </div>

            <div className="col-span-5 flex items-center justify-center">
              <div className="w-32 h-36 flex items-center justify-center p-1 rounded-xl bg-surface-container-lowest/60">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDrVAurp_xNMekkJUnRh__oYVfi6GZhC-OVW_Oo0WLfhcEVZk2YGKIkXMVU_7EdpBAFbTPFnoSs-cK7_8um0OcXNjoWFs1DACEplsSrjKjett3wVgxI3KXb_TUvpA6QuMNbgPs0HKaxtj2UfOsys1Fp-fJTvnivZjk0sSwQ9QFleu-qe8-3IkbEsSo4EnNNCXaOeyZGc4tnvJwPms6QMpqjVE57tEgCZ58O_q_w_c"
                  alt="iPhone 16 Pro 256GB"
                  className="w-full h-full object-contain drop-shadow-2xl animate-float-mockup"
                />
              </div>
            </div>
          </div>

          {/* Full-width CTA Button */}
          <div className="mt-3.5 pt-1 relative z-10">
            <Link
              href="/telefon/iphone-16-pro"
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
            {/* Left: iPhone 16 Pro */}
            <div className="col-span-5 vs-device-left flex flex-col items-center transition-transform duration-300">
              <div className="w-14 h-20 flex items-center justify-center mb-1">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcWxymk-dsDtNmhFf_jhgjjVUi0HWvLTsfOm2HSSfcCUtHFviOdv6DoSvWaKEhyD6136lFISkxzBYIvOhVUzux0q-mfQarb0HQAEUm7hkj4xntSeoVxUQN16NyaXZzEg7f6midVNJXZRYI5zvGnzAEGsXRt_IBXo00WeGPw7i8lFhuW2j8GBKgUdl9HuHupVvL_sb6rh4t-VJib87oNVxZaz-CwGaAxxDH0WEt-_I"
                  alt="iPhone 16 Pro"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="text-xs font-bold text-on-surface truncate max-w-full">
                iPhone 16 Pro
              </div>
              <div className="text-xs font-black text-tertiary">59.899 ₺</div>
              <div className="text-[10px] text-outline mt-0.5">
                ⚡ 1.82M AnTuTu
              </div>
            </div>

            {/* Center: VS Badge */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-surface-container-highest border border-white/10 text-primary font-black text-[10px] flex items-center justify-center shadow-lg">
                VS
              </div>
              <span className="text-[8.5px] text-outline mt-1">1-0 Üstün</span>
            </div>

            {/* Right: S24 Ultra */}
            <div className="col-span-5 vs-device-right flex flex-col items-center transition-transform duration-300">
              <div className="w-14 h-20 flex items-center justify-center mb-1">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA44u-M6KmPysMFuFPLcLx1Fy4Y1zQZImQoPqHHeHBJKOfTOppWpsPnMkVskEVe_19LOObF5zGbzfwOmmuwkVnO-Jd65KAQFioGcXLlmUP8yWCA5onRd-MHwLEs7LB4Huf4k7hkSupHk592WTgGlTYoP0QJrIefa5GE0WZyGa_Zpl8qcYYEcDRNdWnqHI39Ny_dx2BY7m3XfBhAZAvJZhvk1Gl9vsbzWhHFZlqfo_Q"
                  alt="S24 Ultra"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="text-xs font-bold text-on-surface truncate max-w-full">
                S24 Ultra
              </div>
              <div className="text-xs font-black text-tertiary">54.499 ₺</div>
              <div className="text-[10px] text-outline mt-0.5">
                📷 200MP Quad
              </div>
            </div>
          </div>

          <Link
            href="/karsilastir"
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

          {/* Row 1: Poco F6 Pro */}
          <div className="flex items-center justify-between py-1.5 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-tertiary/15 text-tertiary font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div className="min-w-0">
                <Link
                  href="/telefon/poco-f6-pro"
                  className="font-bold text-xs text-on-surface hover:text-primary truncate block"
                >
                  Poco F6 Pro
                </Link>
                <div className="text-[10px] text-outline truncate">
                  Snapdragon 8 Gen 2
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-black text-tertiary">23.499 ₺</div>
              <div className="text-[9.5px] text-outline">9.8 / 10 Puan</div>
            </div>
          </div>

          {/* Row 2: Galaxy A55 */}
          <div className="flex items-center justify-between py-1.5 border-t border-white/[0.05] relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-primary/15 text-primary font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div className="min-w-0">
                <Link
                  href="/telefon/samsung-galaxy-a55"
                  className="font-bold text-xs text-on-surface hover:text-primary truncate block"
                >
                  Galaxy A55
                </Link>
                <div className="text-[10px] text-outline truncate">
                  AMOLED 120Hz Cam Tasarım
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-black text-tertiary">16.890 ₺</div>
              <div className="text-[9.5px] text-outline">9.4 / 10 Puan</div>
            </div>
          </div>

          {/* Row 3: Nothing Phone 2a */}
          <div className="flex items-center justify-between py-1.5 border-t border-white/[0.05] relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-surface-bright text-on-surface-variant font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div className="min-w-0">
                <Link
                  href="/telefon/nothing-phone-2a"
                  className="font-bold text-xs text-on-surface hover:text-primary truncate block"
                >
                  Nothing Phone 2a
                </Link>
                <div className="text-[10px] text-outline truncate">
                  Özgün Arayüz &amp; Akıcı UI
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-black text-tertiary">18.499 ₺</div>
              <div className="text-[9.5px] text-outline">9.3 / 10 Puan</div>
            </div>
          </div>
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
            {/* Item 1: iPhone 16 */}
            <div className="rounded-2xl bg-surface-container/90 border border-white/[0.06] p-3 flex flex-col justify-between shadow-lg">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary text-[9.5px] font-bold mb-2 price-drop-pulse">
                  <span>🔥 -%12 Fırsat</span>
                </div>
                <div className="w-full h-28 flex items-center justify-center p-1 mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaUIrBxBw_wRHBE6dWd3wP9kiJbZwEx9868os19xKLeQd2ytUxz3_sZLBkF0W0Z5M0T1LZo9LRJ10oXeopf7d6ajL0YJrg8uoj-TkJ4CVWEaWxJgtYBQhjRaQwkh1nOSLtjNmpdSLsov4nIEENfFDlGxYNYYJB15zKtkza1RBrU_H7X_HXmM6PnHJs_2j46Syr346SAOtmleHJMVC3BdHITUwkHv1hPtxlrykrj24"
                    alt="iPhone 16 128GB"
                    className="h-24 object-contain drop-shadow-xl"
                  />
                </div>
                <div className="text-[9.5px] font-bold text-outline uppercase">
                  APPLE
                </div>
                <h4 className="font-bold text-xs text-on-surface truncate">
                  iPhone 16 128GB
                </h4>
                <div className="text-[10px] text-outline mt-1 flex items-center justify-between">
                  <span>Amazon TR</span>
                  <span className="line-through">64.999 ₺</span>
                </div>
                <div className="text-sm font-black text-on-surface mt-0.5">
                  58.999 ₺
                </div>
              </div>
              <Link
                href="/telefon/iphone-16"
                className="mt-2.5 py-1.5 text-center bg-surface-container-highest hover:bg-primary-container text-[10.5px] font-bold text-on-surface hover:text-white rounded-full block transition-colors"
              >
                Fiyatları Gör &rarr;
              </Link>
            </div>

            {/* Item 2: Galaxy S24+ */}
            <div className="rounded-2xl bg-surface-container/90 border border-white/[0.06] p-3 flex flex-col justify-between shadow-lg">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary text-[9.5px] font-bold mb-2 price-drop-pulse">
                  <span>-%15 Fırsat</span>
                </div>
                <div className="w-full h-28 flex items-center justify-center p-1 mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpInXkXOXGBE1EHavHpsUF3cXkimDXWCO23Lwl0lGI8vJA9Pv6eEBVyOCdFobvZGztgvBcbMddRZe2o-JKqFprg3qQfCh1lnXxbqdZbF-Tk0JV6bZ-vbPonrStkekMfY9mvcYB0Pyfvu9Q9rx2ZGvwADQYzbJqd_UFuWwRlBcE1tXIvgD0gG3WaiDqlQfSTbqCesH6LpKtWZy38GuSSKGZuXxXVKZl7VBC4Xnil4s"
                    alt="Galaxy S24+ 256GB"
                    className="h-24 object-contain drop-shadow-xl"
                  />
                </div>
                <div className="text-[9.5px] font-bold text-outline uppercase">
                  SAMSUNG
                </div>
                <h4 className="font-bold text-xs text-on-surface truncate">
                  Galaxy S24+ 256GB
                </h4>
                <div className="text-[10px] text-outline mt-1 flex items-center justify-between">
                  <span>Hepsiburada</span>
                  <span className="line-through">48.490 ₺</span>
                </div>
                <div className="text-sm font-black text-on-surface mt-0.5">
                  41.299 ₺
                </div>
              </div>
              <Link
                href="/telefon/samsung-galaxy-s24-plus"
                className="mt-2.5 py-1.5 text-center bg-surface-container-highest hover:bg-primary-container text-[10.5px] font-bold text-on-surface hover:text-white rounded-full block transition-colors"
              >
                Fiyatları Gör &rarr;
              </Link>
            </div>

            {/* Item 3: Honor Magic 6 Pro */}
            <div className="rounded-2xl bg-surface-container/90 border border-white/[0.06] p-3 flex flex-col justify-between shadow-lg">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[9.5px] font-bold mb-2">
                  <span>⚡ Yeni Zirve</span>
                </div>
                <div className="w-full h-28 flex items-center justify-center p-1 mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxaJAOIZt-VMc70XFEH2ehSSp1m4KZfGRNKBA9NHXjsT6EAZ5tdJfOv99eSSYQXTO8ys6wDvOTXbKubj4Qc_YEAWwNz0m9hlaxNeUqvEBSXehWmHpOcTLXA1aUueU1e6XN7o_5ADVuN1i6-B4nSVveiZWcGFeaoL9T8zfgghsIaA8Bjr5xvsn7ILi4FiAlh4VMaIbJ5mJ005ygwkxC58oo6eO4k2gl-j--CsR4Ezw"
                    alt="Magic 6 Pro 512GB"
                    className="h-24 object-contain drop-shadow-xl"
                  />
                </div>
                <div className="text-[9.5px] font-bold text-outline uppercase">
                  HONOR
                </div>
                <h4 className="font-bold text-xs text-on-surface truncate">
                  Magic 6 Pro 512GB
                </h4>
                <div className="text-[10px] text-outline mt-1 flex items-center justify-between">
                  <span>Trendyol</span>
                  <span className="line-through">54.999 ₺</span>
                </div>
                <div className="text-sm font-black text-on-surface mt-0.5">
                  49.999 ₺
                </div>
              </div>
              <Link
                href="/telefon/honor-magic-v3"
                className="mt-2.5 py-1.5 text-center bg-surface-container-highest hover:bg-primary-container text-[10.5px] font-bold text-on-surface hover:text-white rounded-full block transition-colors"
              >
                Fiyatları Gör &rarr;
              </Link>
            </div>

            {/* Item 4: Google Pixel 9 Pro */}
            <div className="rounded-2xl bg-surface-container/90 border border-white/[0.06] p-3 flex flex-col justify-between shadow-lg">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary text-[9.5px] font-bold mb-2 price-drop-pulse">
                  <span>📷 -%8 İndirim</span>
                </div>
                <div className="w-full h-28 flex items-center justify-center p-1 mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8DIkQLUOx3J2LX2QM4leU6SESQEvYgC9nkM55LVyzvTsIQnYUmX4X3GrIB6Z_nD1J3UzWLy-mZHzuIGor7PbFdYa519LDQEwMdRAfz0kdwOnw48M5zuA3cS6im1G19eai7Jqy9AQGbVRuEm9iMwD39SsBtalCCyrzOXVaOPhsknPVZkH1Bj5pFjNFPr-hWAhQ9wi338JFEsaf6W8qtuT3cle4toVc2x4OcO0Mlfs"
                    alt="Pixel 9 Pro 128GB"
                    className="h-24 object-contain drop-shadow-xl"
                  />
                </div>
                <div className="text-[9.5px] font-bold text-outline uppercase">
                  GOOGLE
                </div>
                <h4 className="font-bold text-xs text-on-surface truncate">
                  Pixel 9 Pro 128GB
                </h4>
                <div className="text-[10px] text-outline mt-1 flex items-center justify-between">
                  <span>Amazon TR</span>
                  <span className="line-through">51.490 ₺</span>
                </div>
                <div className="text-sm font-black text-on-surface mt-0.5">
                  47.500 ₺
                </div>
              </div>
              <Link
                href="/telefon/iphone-15"
                className="mt-2.5 py-1.5 text-center bg-surface-container-highest hover:bg-primary-container text-[10.5px] font-bold text-on-surface hover:text-white rounded-full block transition-colors"
              >
                Fiyatları Gör &rarr;
              </Link>
            </div>
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
