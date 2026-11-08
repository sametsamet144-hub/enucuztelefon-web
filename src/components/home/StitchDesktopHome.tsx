"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  TrendingDown,
  Bell,
  ArrowRight,
  Sparkles,
  Heart,
  CheckCircle2,
  Scale,
  Award,
  Store,
  ChevronRight,
  Zap,
  Plus,
  Minus,
} from "lucide-react";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface TrendingItem {
  slug: string;
  brand: string;
  name: string;
  specs: string;
  price: number;
  storeCount: number;
  badge: string;
  badgeType: "discount" | "new";
  os: "iOS" | "Android";
  image: string;
}

const TRENDING_DEVICES: TrendingItem[] = [
  {
    slug: "iphone-16",
    brand: "APPLE",
    name: "iPhone 16 128GB",
    specs: "A18 Çip • Kamera Denetimi • HDR",
    price: 58999,
    storeCount: 14,
    badge: "-%10",
    badgeType: "discount",
    os: "iOS",
    image: "/images/phones/iphone-16.webp",
  },
  {
    slug: "samsung-galaxy-s24-plus",
    brand: "SAMSUNG",
    name: "Galaxy S24+ 256GB",
    specs: "Galaxy AI • QHD+ • 12GB RAM",
    price: 41299,
    storeCount: 16,
    badge: "-%18",
    badgeType: "discount",
    os: "Android",
    image: "/images/phones/samsung-galaxy-s24-plus.webp",
  },
  {
    slug: "honor-magic-6-pro",
    brand: "HONOR",
    name: "Magic 6 Pro 512GB",
    specs: "180MP Periskop • 5600mAh Batarya",
    price: 49999,
    storeCount: 11,
    badge: "Yeni",
    badgeType: "new",
    os: "Android",
    image: "/images/phones/honor-magic-v3.svg",
  },
  {
    slug: "google-pixel-9-pro",
    brand: "GOOGLE",
    name: "Pixel 9 Pro 128GB",
    specs: "Tensor G4 • Gemini Nano • Super Actua",
    price: 47500,
    storeCount: 8,
    badge: "-%8",
    badgeType: "discount",
    os: "Android",
    image: "/images/phones/iphone-15.svg",
  },
  {
    slug: "iphone-16-pro-max",
    brand: "APPLE",
    name: "iPhone 16 Pro Max 256GB",
    specs: "A18 Pro • 6.9\" ProMotion • 5x Zoom",
    price: 84999,
    storeCount: 16,
    badge: "-%15",
    badgeType: "discount",
    os: "iOS",
    image: "/images/phones/iphone-16-pro-max.webp",
  },
  {
    slug: "iphone-15",
    brand: "APPLE",
    name: "iPhone 15 128GB",
    specs: "A16 Bionic • Dynamic Island • 48MP",
    price: 48999,
    storeCount: 16,
    badge: "-%11",
    badgeType: "discount",
    os: "iOS",
    image: "/images/phones/iphone-15.svg",
  },
  {
    slug: "iphone-16-pro",
    brand: "APPLE",
    name: "iPhone 16 Pro 256GB",
    specs: "A18 Pro • Doğal Titanyum • 120Hz",
    price: 59899,
    storeCount: 15,
    badge: "-%18",
    badgeType: "discount",
    os: "iOS",
    image: "/images/phones/iphone-16-pro.svg",
  },
  {
    slug: "xiaomi-15-ultra",
    brand: "XIAOMI",
    name: "Xiaomi 15 Ultra 512GB",
    specs: "Snapdragon 8 Elite • Leica 200MP",
    price: 64999,
    storeCount: 12,
    badge: "-%22",
    badgeType: "discount",
    os: "Android",
    image: "/images/phones/xiaomi-15-ultra.svg",
  },
];

const LIVE_TICKER_ITEMS = [
  {
    icon: "📱",
    model: "Galaxy S24 Ultra",
    store: "Hepsiburada'da",
    highlight: "4.200 ₺ düştü",
    tag: "Son 6 Ayın Dibi",
    href: "/telefon/samsung-galaxy-s24-ultra",
  },
  {
    icon: "🔥",
    model: "iPhone 16 Pro 256GB",
    store: "Amazon TR'de",
    highlight: "59.899 ₺",
    tag: "-%18 İndirim",
    href: "/telefon/iphone-16-pro",
  },
  {
    icon: "⚡",
    model: "Xiaomi 15 Ultra",
    store: "Trendyol'da",
    highlight: "64.999 ₺",
    tag: "Peşin Fiyatına 3 Taksit",
    href: "/telefon/xiaomi-15-ultra",
  },
  {
    icon: "📉",
    model: "POCO F6 Pro 512GB",
    store: "Trendyol'da",
    highlight: "23.499 ₺",
    tag: "F/P Kralı",
    href: "/telefon/poco-f6-pro",
  },
  {
    icon: "💎",
    model: "Galaxy S25 Ultra 512GB",
    store: "Amazon TR'de",
    highlight: "68.790 ₺",
    tag: "Hızlı Teslimat",
    href: "/telefon/samsung-galaxy-s25-ultra",
  },
];

export default function StitchDesktopHome() {
  const router = useRouter();
  const { openAlertModal, favorites, showToast } = useApp();
  const [localFavs, setLocalFavs] = useState<string[]>([]);

  const handleToggleFav = (slug: string, name: string) => {
    if (localFavs.includes(slug) || favorites.includes(slug)) {
      setLocalFavs((prev) => prev.filter((s) => s !== slug));
      showToast(`${name} favorilerden çıkarıldı.`, "info");
    } else {
      setLocalFavs((prev) => [...prev, slug]);
      showToast(`${name} favorilerinize eklendi! ❤️`, "success");
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tümü");
  const [trendFilter, setTrendFilter] = useState<"Tümü" | "iOS" | "Android">("Tümü");
  const [targetAlertPrice, setTargetAlertPrice] = useState(44000);
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [scannedCount, setScannedCount] = useState(1442890);
  const [secondsAgo, setSecondsAgo] = useState(14);

  // Live telemetry subtle counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScannedCount((prev) => prev + Math.floor(Math.random() * 4) + 1);
      setSecondsAgo((prev) => (prev >= 29 ? 2 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/telefonlar?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/telefonlar");
    }
  };

  const brandPills = [
    "Tümü",
    "Apple",
    "Samsung",
    "Xiaomi",
    "Honor",
    "Huawei",
    "Google Pixel",
    "Nothing Phone",
    "Vivo",
  ];

  const filteredTrends =
    trendFilter === "Tümü"
      ? TRENDING_DEVICES.slice(0, 4)
      : TRENDING_DEVICES.filter((d) => d.os === trendFilter).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 selection:bg-[#1d8cf8] selection:text-white">
      {/* ─── 1. LIVE SCROLLING PRICE TICKER BAR ────────────────────────────── */}
      <div className="w-full bg-[#06080b] border-b border-[#131822] overflow-hidden py-2 px-4 flex items-center">
        <div className="shrink-0 flex items-center gap-2 pr-4 mr-4 border-r border-[#1a202e] z-10 bg-[#06080b]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-400">
            CANLI FİYAT AKIŞI
          </span>
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee flex items-center gap-8 text-xs">
            {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors shrink-0 group"
              >
                <span>{item.icon}</span>
                <strong className="font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                  {item.model}
                </strong>
                <span className="text-slate-400">{item.store}</span>
                <span className="font-extrabold text-emerald-400">
                  {item.highlight}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                  {item.tag}
                </span>
                <span className="text-slate-700 pl-4">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 2. HERO SECTION ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14 pb-12 px-6">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[340px] bg-gradient-to-b from-[#1d8cf8]/12 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-[1100px] mx-auto text-center relative z-10 animate-fade-up">
          {/* Top Shield Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b1f1d] border border-[#153e38] text-[11px] font-extrabold text-emerald-400 tracking-wider uppercase mb-6 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>TÜRKİYE&apos;NİN AKILLI TELEFON VE FİYAT REHBERİ</span>
          </div>

          {/* Main 2-Line Headline */}
          <h1 className="text-5xl xl:text-[64px] font-black tracking-tight leading-[1.08] mb-5">
            <span className="block text-white">En doğru telefonu bul.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600">
              En dip fiyata al.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            <strong className="text-white font-bold">488+ güncel model</strong>,{" "}
            <strong className="text-white font-bold">
              16 resmi yetkili satıcı
            </strong>{" "}
            ve anlık fiyat değişim telemetrisi. Karşılaştır, alarm kur,
            doğrulanmış en düşük fiyattan sahip ol.
          </p>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center bg-[#0f131b] border border-[#1e2636] hover:border-[#2c374f] focus-within:border-[#1d8cf8] rounded-full p-2 pl-5 shadow-2xl transition-all mb-6"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Model, marka veya özellik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-md bg-[#161b26] border border-[#232b3d] text-[10px] font-mono text-slate-400 mr-2.5">
              ⌘K
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1d8cf8] hover:bg-[#1577d6] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <span>Fiyatları Gör</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Brand Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {brandPills.map((brand) => {
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(brand);
                    if (brand !== "Tümü") {
                      const slug = brand.toLowerCase().split(" ")[0];
                      router.push(`/telefonlar?brand=${slug}`);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-950 font-extrabold shadow-md scale-105"
                      : "bg-[#0f131b] text-slate-300 border border-[#1d2433] hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. LIVE TELEMETRY STRIP ───────────────────────────────────────── */}
      <div className="border-y border-[#131822] bg-[#0a0d13]/90">
        <div className="max-w-[1280px] mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-white tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CANLI TELEMETRİ</span>
            </span>
            <span className="text-slate-500">
              Son güncelleme: {secondsAgo} saniye önce
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <div>
              <strong className="text-white font-extrabold tabular-nums">
                {scannedCount.toLocaleString("tr-TR")}
              </strong>{" "}
              günlük taranan fiyat verisi
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <strong className="text-emerald-400 font-extrabold">%100</strong>{" "}
              BTK Kayıtlı Türkiye Garantili
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <strong className="text-[#38bdf8] font-extrabold">0 TL</strong>{" "}
              aracı komisyonu
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. BENTO EKOSİSTEMİ SECTION ──────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 pt-14 pb-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-up delay-75">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#38bdf8] mb-1.5">
              BENTO EKOSİSTEMİ
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Akıllı Alışverişin Yeni Standardı
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            Karmaşık reklam bannerları yok. Sadece saf veri, berrak fiyat
            değişim analizleri ve onaylı satıcı rotaları.
          </p>
        </div>

        {/* Row 1: 7 Cols Featured Deal + 5 Cols Flagship Duel */}
        <div className="grid grid-cols-12 gap-5 mb-5">
          {/* LEFT 7-COL CARD: Günün Rekor Düşüşü (iPhone 16 Pro 256GB) */}
          <div className="col-span-12 lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#10141d] via-[#0c1017] to-[#090c12] border border-[#1b2232] p-6 lg:p-7 flex flex-col justify-between relative overflow-hidden bento-card-hover animate-fade-up delay-150">
            {/* Ambient radial glow */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badges */}
            <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c261f] border border-[#15493a] text-[11px] font-bold text-emerald-400 animate-pulse-glow">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Günün Rekor Düşüşü</span>
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#151a24] border border-[#222a3a] text-[11px] font-semibold text-slate-300">
                  Son 6 Ayın En Dibi
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Güncelleme: 14:32
              </span>
            </div>

            {/* Center Content: Left Details + Right Framed Product Card */}
            <div className="grid grid-cols-12 gap-6 items-center my-2 relative z-10">
              <div className="col-span-7 space-y-2.5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#38bdf8]">
                  APPLE FLAGSHIP
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  iPhone 16 Pro 256GB
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Doğal Titanyum, A18 Pro Çip, 48MP Pro Kamera Sistemi, Resmi
                  Türkiye Garantili Ürün.
                </p>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-4xl font-black text-white tracking-tight">
                    ₺59.899
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    ₺72.999
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-extrabold text-emerald-400">
                    -%18 İndirim
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    En düşük satıcı:{" "}
                    <strong className="text-white font-bold">
                      Amazon TR (Satıcı &amp; Gönderici Resmi Amazon)
                    </strong>
                  </span>
                </div>
              </div>

              {/* Right Framed Product Image */}
              <div className="col-span-5">
                <div className="rounded-2xl bg-[#080a0f] border border-[#19202e] p-5 flex items-center justify-center h-52 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-emerald-500/10 pointer-events-none" />
                  <div className="w-36 h-40 animate-float flex items-center justify-center">
                    <PhoneImage
                      src="/images/phones/iphone-16-pro.svg"
                      alt="iPhone 16 Pro 256GB"
                      className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="mt-6 rounded-2xl bg-[#0a0d13] border border-[#171d2b] p-4 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10.5px] text-slate-400 mb-1">
                    6 Aylık Fiyat Telemetrisi Grafiği
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                       className="w-32 h-7 overflow-visible"
                      viewBox="0 0 130 28"
                      fill="none"
                    >
                      <path
                        d="M2 8 C22 10, 35 6, 52 12 C70 18, 85 11, 104 17 C114 20, 120 23, 126 24"
                        stroke="#10b981"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        className="animate-sparkline"
                      />
                      <circle
                        cx="126"
                        cy="24"
                        r="3.5"
                        className="fill-emerald-400 animate-ping"
                      />
                      <circle
                        cx="126"
                        cy="24"
                        r="3.5"
                        className="fill-emerald-400"
                      />
                    </svg>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[10.5px] font-bold text-emerald-400">
                      +₺13.100 Tasarruf
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1">
                  <span className="px-2 py-1 rounded-md bg-[#121722] border border-[#1e2636] text-[10px] font-semibold text-slate-300">
                    Amazon
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#121722] border border-[#1e2636] text-[10px] font-semibold text-slate-400">
                    HB
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#121722] border border-[#1e2636] text-[10px] font-semibold text-slate-400">
                    Trendyol
                  </span>
                </div>

                <Link
                  href="/telefon/iphone-16-pro"
                  className="px-4 py-2.5 rounded-xl bg-[#1d8cf8] hover:bg-[#1577d6] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <span>Fırsatı İncele</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT 5-COL CARD: Kafa Kafaya Analiz (Amiral Gemisi Düellosu) */}
          <div className="col-span-12 lg:col-span-5 rounded-3xl bg-[#0e121a] border border-[#1b2232] p-6 lg:p-7 flex flex-col justify-between bento-card-hover animate-fade-up delay-225">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#151b26] border border-[#232c3d] text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                  KAFA KAFAYA ANALİZ
                </span>
                <Scale className="w-4 h-4 text-slate-400" />
              </div>

              <h3 className="text-xl font-black text-white">
                Amiral Gemisi Düellosu
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Donanım verileri, AnTuTu performansı ve anlık piyasa fiyat
                karşılaştırması.
              </p>

              {/* VS Arena Box */}
              <div className="mt-5 rounded-2xl bg-[#090c12] border border-[#171d2b] p-4 grid grid-cols-11 items-center gap-2 text-center relative">
                {/* Left Phone */}
                <div className="col-span-5 flex flex-col items-center">
                  <div className="w-16 h-20 mb-2 flex items-center justify-center">
                    <PhoneImage
                      src="/images/phones/iphone-16-pro.svg"
                      alt="iPhone 16 Pro"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-extrabold text-white">
                    iPhone 16 Pro
                  </div>
                  <div className="text-xs font-black text-[#38bdf8] mt-0.5">
                    ₺59.899
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    6.3&quot; ProMotion
                  </div>
                  <div className="text-[10px] text-slate-500">48MP Fusion</div>
                </div>

                {/* Center VS */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#151b26] border border-[#263147] text-[10px] font-black text-slate-300 flex items-center justify-center shadow-inner">
                    VS
                  </div>
                </div>

                {/* Right Phone */}
                <div className="col-span-5 flex flex-col items-center">
                  <div className="w-16 h-20 mb-2 flex items-center justify-center">
                    <PhoneImage
                      src="/images/phones/samsung-galaxy-s24-ultra.webp"
                      alt="Galaxy S24 Ultra"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-extrabold text-white">
                    Galaxy S24 Ultra
                  </div>
                  <div className="text-xs font-black text-[#38bdf8] mt-0.5">
                    ₺64.499
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    6.8&quot; AMOLED 2X
                  </div>
                  <div className="text-[10px] text-slate-500">
                    200MP Quad Cam
                  </div>
                </div>
              </div>

              {/* Animated Benchmark Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">
                    AnTuTu v10 Skoru
                  </span>
                  <span className="font-extrabold text-white">
                    1.82M vs 1.94M
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#151b26] overflow-hidden flex gap-0.5">
                  <div className="w-[48%] h-full bg-emerald-400 rounded-l-full animate-bar-grow" />
                  <div className="w-[52%] h-full bg-[#1d8cf8] rounded-r-full animate-bar-grow" />
                </div>
              </div>
            </div>

            <Link
              href="/karsilastir"
              className="mt-5 w-full py-3 rounded-xl bg-[#151b26] hover:bg-[#1c2433] border border-[#232c3e] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              <span>Karşılaştırmayı Başlat</span>
              <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
            </Link>
          </div>
        </div>

        {/* Row 2: 3 Equal Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: F/P RADARI — Fiyat/Performans Liderleri */}
          <div className="rounded-3xl bg-[#0e121a] border border-[#1b2232] p-6 flex flex-col justify-between bento-card-hover animate-fade-up delay-150">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#151b26] border border-[#232c3d] text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                  F/P RADARI
                </span>
                <Award className="w-4 h-4 text-slate-400" />
              </div>

              <h3 className="text-lg font-black text-white">
                Fiyat/Performans Liderleri
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Bütçenize göre en yüksek donanım endeksine sahip modeller.
              </p>

              <div className="mt-5 space-y-2.5">
                {/* Item 1 */}
                <Link
                  href="/telefon/poco-f6-pro"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#090c12] border border-[#171d2b] hover:border-[#2a354d] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                        Xiaomi Poco F6 Pro
                      </div>
                      <div className="text-[10px] text-slate-500">
                        12 Mağaza • 4.9/5 Skor
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white">₺23.499</div>
                    <div className="text-[10px] font-bold text-emerald-400">
                      Bütçe Lideri
                    </div>
                  </div>
                </Link>

                {/* Item 2 */}
                <Link
                  href="/telefon/samsung-galaxy-a55"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#090c12] border border-[#171d2b] hover:border-[#2a354d] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#151b26] border border-[#232c3d] text-slate-300 text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                        Samsung Galaxy A55
                      </div>
                      <div className="text-[10px] text-slate-500">
                        16 Mağaza • 4.8/5 Skor
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white">₺16.890</div>
                    <div className="text-[10px] text-slate-400">Çok Satan</div>
                  </div>
                </Link>

                {/* Item 3 */}
                <Link
                  href="/telefon/nothing-phone-2a"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#090c12] border border-[#171d2b] hover:border-[#2a354d] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#151b26] border border-[#232c3d] text-slate-300 text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                        Nothing Phone (2a)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        9 Mağaza • 4.7/5 Skor
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white">₺18.499</div>
                    <div className="text-[10px] text-slate-400">
                      Özgün Tasarım
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <Link
              href="/telefonlar?sort=price-drop"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <span>Tüm Fiyat Kademe Listelerini Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: HIZLI RADAR — Fiyat Alarmı Kurun */}
          <div className="rounded-3xl bg-[#0e121a] border border-[#1b2232] p-6 flex flex-col justify-between bento-card-hover animate-fade-up delay-225">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#151b26] border border-[#232c3d] text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                  HIZLI RADAR
                </span>
                <Bell className="w-4 h-4 text-[#38bdf8]" />
              </div>

              <h3 className="text-lg font-black text-white">
                Fiyat Alarmı Kurun
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                İstediğiniz model hedef rakama indiğinde saniyeler içinde
                bildirim alın.
              </p>

              <div className="mt-5 rounded-2xl bg-[#090c12] border border-[#171d2b] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Hedef Cihaz</span>
                  <span className="font-bold text-white">iPhone 15 128GB</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Güncel Fiyat</span>
                  <span className="text-slate-400 line-through">₺48.999</span>
                </div>

                {/* Green Target Price Control Box */}
                <div className="rounded-xl bg-[#0b221c] border border-[#144638] p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10.5px] font-bold text-emerald-400">
                      Hedef Eşik Fiyat
                    </div>
                    <div className="text-base font-black text-white mt-0.5">
                      {formatPrice(targetAlertPrice)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setTargetAlertPrice((p) => Math.max(20000, p - 1000))
                      }
                      className="w-7 h-7 rounded-lg bg-[#0f2e26] hover:bg-[#164237] border border-emerald-500/30 text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetAlertPrice((p) => p + 1000)}
                      className="w-7 h-7 rounded-lg bg-[#0f2e26] hover:bg-[#164237] border border-emerald-500/30 text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Telegram &amp; SMS Bildirimi</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setTelegramEnabled(!telegramEnabled)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      telegramEnabled ? "bg-[#1d8cf8]" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        telegramEnabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast(
                  `iPhone 15 128GB için ${formatPrice(targetAlertPrice)} fiyat alarmı hazırlandı!`
                );
                openAlertModal();
              }}
              className="mt-5 w-full py-3 rounded-xl bg-[#1d8cf8] hover:bg-[#1577d6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Ücretsiz Alarm Oluştur</span>
            </button>
          </div>

          {/* Card 3: DOĞRULANMIŞ AĞ — Sıfır Risk Garantisi */}
          <div className="rounded-3xl bg-[#0e121a] border border-[#1b2232] p-6 flex flex-col justify-between bento-card-hover animate-fade-up delay-300">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-[#151b26] border border-[#232c3d] text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                  DOĞRULANMIŞ AĞ
                </span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>

              <h3 className="text-lg font-black text-white">
                Sıfır Risk Garantisi
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Yalnızca resmi ithalat ve yetkili distribütör faturalı satıcılar
                listelenir.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-[#090c12] border border-[#171d2b] p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-[#38bdf8] shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      BTK IMEI Sorgusu
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Tüm listelenen cihazlar Türkiye kayıtlı seri numaralarıyla
                      senkronizedir.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#090c12] border border-[#171d2b] p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      16 Yetkili Pazar Yeri
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Apple Store, Amazon, Hepsiburada, Teknosa, MediaMarkt ve
                      diğerleri.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#171d2b] flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Güvenlik Puanı:{" "}
                <strong className="text-white font-extrabold">100/100</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10.5px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Aktif Doğrulama</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CANLI TRENDLER SECTION ─────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#38bdf8] mb-1.5">
              CANLI TRENDLER
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Piyasanın En Gözde Cihazları
            </h2>
          </div>

          {/* Filter Tabs: Tümü / iOS / Android */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#0f131b] border border-[#1d2433]">
            {(["Tümü", "iOS", "Android"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTrendFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  trendFilter === tab
                    ? "bg-[#1d2433] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTrends.map((device) => {
            const isFav =
              favorites.includes(device.slug) ||
              localFavs.includes(device.slug);
            return (
              <div
                key={device.slug}
                className="rounded-3xl bg-[#0e121a] border border-[#1b2232] p-5 flex flex-col justify-between bento-card-hover group"
              >
                <div>
                  {/* Top Badge + Favorite Button */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                        device.badgeType === "discount"
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-[#161c28] border border-[#263044] text-slate-200"
                      }`}
                    >
                      {device.badge}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleFav(device.slug, device.name)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                        isFav
                          ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                          : "bg-[#131822] border-[#202838] text-slate-400 hover:text-white"
                      }`}
                      aria-label="Favorilere ekle"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Framed Image Area */}
                  <Link
                    href={`/telefon/${device.slug}`}
                    className="block rounded-2xl bg-[#080a0f] border border-[#151b26] h-44 p-4 mb-4 flex items-center justify-center overflow-hidden relative"
                  >
                    <div className="w-28 h-32 flex items-center justify-center group-hover:scale-108 transition-transform duration-500">
                      <PhoneImage
                        src={device.image}
                        alt={device.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </Link>

                  {/* Brand & Model */}
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    {device.brand}
                  </div>
                  <Link
                    href={`/telefon/${device.slug}`}
                    className="text-base font-black text-white hover:text-[#38bdf8] transition-colors block mt-0.5 truncate"
                  >
                    {device.name}
                  </Link>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    {device.specs}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#161c28]">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-2xl font-black text-white tracking-tight">
                      {formatPrice(device.price)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {device.storeCount} Mağaza
                    </span>
                  </div>

                  <Link
                    href={`/telefon/${device.slug}`}
                    className="w-full py-2.5 rounded-xl bg-[#151b26] group-hover:bg-[#1d8cf8] border border-[#222b3d] group-hover:border-[#1d8cf8] text-xs font-bold text-slate-200 group-hover:text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Fiyatları İncele</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 6. AI SMART ASSISTANT CALLOUT BANNER ──────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 pt-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#0e131f] via-[#111827] to-[#0c1018] border border-[#1e2638] p-8 lg:p-11 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl space-y-2 relative z-10 text-center lg:text-left">
            <div className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#38bdf8]">
              CEBİNİZE UYGUN AKILLI TERCİH
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight">
              Hangi telefonu seçeceğinizden emin değil misiniz?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
              3 adımlık akıllı cihaz asistanımızla bütçenize ve ihtiyaçlarınıza
              en uygun amiral gemisini 60 saniyede bulun.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 shrink-0">
            <Link
              href="/telefon-rehberi"
              className="px-6 py-3.5 rounded-full bg-[#1d8cf8] hover:bg-[#1577d6] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Akıllı Rehberi Başlat</span>
              <Sparkles className="w-4 h-4" />
            </Link>

            <Link
              href="/telefonlar"
              className="px-6 py-3.5 rounded-full bg-[#141923] hover:bg-[#1c2331] border border-[#242e42] text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all"
            >
              Tüm Modelleri Keşfet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
