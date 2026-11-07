"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Smartphone,
  Shield,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Camera,
  BatteryCharging,
  Scale,
  Bell,
  BookOpen,
  Award,
  Gamepad2,
  Layers,
  Zap,
  Tag,
  HelpCircle,
} from "lucide-react";
import { getPhones } from "@/lib/data";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import {
  CatalogExplorerEmote,
  PriceDropFireEmote,
  BudgetKingEmote,
  VsBattleEmote,
  BrandsStarEmote,
  PriceRadarBellEmote,
  GuideScholarEmote,
  BtkShieldEmote,
} from "@/components/home/PortalCardEmotes";

export default function HeroSection() {
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [phones, setPhones] = useState<Phone[]>([]);
  const [suggestions, setSuggestions] = useState<Phone[]>([]);

  useEffect(() => {
    getPhones().then((res) => { if (res && res.length > 0) setPhones(res); });
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length > 1) {
      const filtered = phones
        .filter(
          (p) =>
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            p.brand.toLowerCase().includes(val.toLowerCase()) ||
            p.specs?.performance?.chipset?.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/telefonlar?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/telefonlar");
    }
  };

  // Top Quick Brand Redirection Buttons (Small subtle icon + Bold Centered Brand Name)
  const brandButtons = [
    { name: "Apple", slug: "apple", emote: "🍎" },
    { name: "Samsung", slug: "samsung", emote: "🌌" },
    { name: "Xiaomi", slug: "xiaomi", emote: "⚡" },
    { name: "Redmi", slug: "redmi", emote: "🔥" },
    { name: "POCO", slug: "poco", emote: "🚀" },
    { name: "HONOR", slug: "honor", emote: "👑" },
    { name: "Huawei", slug: "huawei", emote: "🌸" },
    { name: "vivo", slug: "vivo", emote: "📸" },
    { name: "OPPO", slug: "oppo", emote: "💎" },
    { name: "realme", slug: "realme", emote: "🎯" },
    { name: "OnePlus", slug: "oneplus", emote: "➕" },
    { name: "Google", slug: "google", emote: "🌈" },
    { name: "Nothing", slug: "nothing", emote: "✨" },
    { name: "Motorola", slug: "motorola", emote: "🦋" },
    { name: "Tecno", slug: "tecno", emote: "🔷" },
    { name: "Infinix", slug: "infinix", emote: "🟢" },
    { name: "ASUS", slug: "asus", emote: "🎮" },
    { name: "REDMAGIC", slug: "redmagic", emote: "🐉" },
    { name: "General Mobile", slug: "general-mobile", emote: "🇹🇷" },
    { name: "Casper", slug: "casper", emote: "🇹🇷" },
    { name: "Reeder", slug: "reeder", emote: "🇹🇷" },
    { name: "Omix", slug: "omix", emote: "🇹🇷" },
  ];

  // 8 Main Navigation Portal Cards (Centered Large Typography + Compact Emotes)
  const portalCards = [
    {
      title: "Tüm Telefonlar Kataloğu",
      subtitle: `${phones.length} Model • Sol Filtre • 16 Mağaza`,
      badge: "ANA KATALOG",
      statusEmote: "🧭 KEŞFET",
      href: "/telefonlar",
      btnText: "Kataloğu Aç",
      gradient: "from-sky-600/25 via-blue-950/45 to-slate-900 border-sky-500/35 hover:border-sky-400",
      btnColor: "bg-sky-500 group-hover:bg-sky-400 text-slate-950",
      pillColor: "bg-sky-500/15 border-sky-400/25 text-sky-200",
      icon: <Smartphone className="w-3 h-3 text-sky-400" />,
      visual: <CatalogExplorerEmote />,
      pills: [`${phones.length} Model`, "Detaylı Filtre", "16 Mağaza"],
    },
    {
      title: "Fiyatı Düşen Telefonlar",
      subtitle: "Son 6 ayın en düşük fiyatlı indirimleri",
      badge: "CANLI İNDİRİM",
      statusEmote: "🔥 FIRSAT",
      href: "/telefonlar/fiyati-dusen",
      btnText: "İndirimlere Git",
      gradient: "from-rose-600/25 via-rose-950/45 to-slate-900 border-rose-500/35 hover:border-rose-400",
      btnColor: "bg-rose-500 group-hover:bg-rose-400 text-white",
      pillColor: "bg-rose-500/15 border-rose-400/25 text-rose-200",
      icon: <TrendingDown className="w-3 h-3 text-rose-400" />,
      visual: <PriceDropFireEmote />,
      pills: ["-%15 İndirim", "6 Ayın En Düşüğü", "Anlık Stok"],
    },
    {
      title: "En Ucuz Telefonlar",
      subtitle: "4.199 ₺'den başlayan garantili modeller",
      badge: "BÜTÇE DOSTU",
      statusEmote: "👑 F/P KRALI",
      href: "/telefonlar/en-ucuz",
      btnText: "En Ucuzları Gör",
      gradient: "from-emerald-600/25 via-emerald-950/45 to-slate-900 border-emerald-500/35 hover:border-emerald-400",
      btnColor: "bg-emerald-500 group-hover:bg-emerald-400 text-slate-950",
      pillColor: "bg-emerald-500/15 border-emerald-400/25 text-emerald-200",
      icon: <Tag className="w-3 h-3 text-emerald-400" />,
      visual: <BudgetKingEmote />,
      pills: ["4.199 ₺'den", "F/P Şampiyonu", "%100 Garantili"],
    },
    {
      title: "Telefon Karşılaştır (VS)",
      subtitle: "Kamera, ekran, pil ve fiyatları kıyasla",
      badge: "KAFA KAFAYA",
      statusEmote: "⚡ DÜELLO",
      href: "/karsilastir",
      btnText: "Karşılaştırmaya Git",
      gradient: "from-indigo-600/25 via-indigo-950/45 to-slate-900 border-indigo-500/35 hover:border-indigo-400",
      btnColor: "bg-indigo-500 group-hover:bg-indigo-400 text-white",
      pillColor: "bg-indigo-500/15 border-indigo-400/25 text-indigo-200",
      icon: <Scale className="w-3 h-3 text-indigo-400" />,
      visual: <VsBattleEmote />,
      pills: ["4 Cihaz Kıyas", "Kamera & Ekran", "AnTuTu Skor"],
    },
    {
      title: "34 Resmi Telefon Markası",
      subtitle: "Apple, Samsung, Xiaomi, GM, Casper ve tümü",
      badge: "RESMİ DİSTRİBÜTÖR",
      statusEmote: "🌟 34 MARKA",
      href: "/markalar",
      btnText: "Markaları Keşfet",
      gradient: "from-purple-600/25 via-purple-950/45 to-slate-900 border-purple-500/35 hover:border-purple-400",
      btnColor: "bg-purple-500 group-hover:bg-purple-400 text-white",
      pillColor: "bg-purple-500/15 border-purple-400/25 text-purple-200",
      icon: <Award className="w-3 h-3 text-purple-400" />,
      visual: <BrandsStarEmote />,
      pills: ["Apple & Samsung", "Xiaomi & POCO", "+30 Marka"],
    },
    {
      title: "Fiyat Takibi & Alarm Kur",
      subtitle: "Fiyat düştüğü an bildirim ve uyarı al",
      badge: "FİYAT RADARI",
      statusEmote: "🔔 ALARM",
      href: "/fiyat-takibi",
      btnText: "Fiyat Takibine Git",
      gradient: "from-amber-600/25 via-amber-950/45 to-slate-900 border-amber-500/35 hover:border-amber-400",
      btnColor: "bg-amber-400 group-hover:bg-amber-300 text-slate-950",
      pillColor: "bg-amber-500/15 border-amber-400/25 text-amber-200",
      icon: <Bell className="w-3 h-3 text-amber-400" />,
      visual: <PriceRadarBellEmote />,
      pills: ["Anlık Bildirim", "6 Aylık Grafik", "Hedef Fiyat"],
    },
    {
      title: "Telefon Rehberi & İnceleme",
      subtitle: "Satın alma rehberleri ve uzman testleri",
      badge: "BİLGİ MERKEZİ",
      statusEmote: "📘 UZMAN",
      href: "/telefon-rehberi",
      btnText: "Rehberi Aç",
      gradient: "from-cyan-600/25 via-cyan-950/45 to-slate-900 border-cyan-500/35 hover:border-cyan-400",
      btnColor: "bg-cyan-400 group-hover:bg-cyan-300 text-slate-950",
      pillColor: "bg-cyan-500/15 border-cyan-400/25 text-cyan-200",
      icon: <BookOpen className="w-3 h-3 text-cyan-400" />,
      visual: <GuideScholarEmote />,
      pills: ["Kamera Testi", "Oyun & FPS", "Batarya Testi"],
    },
    {
      title: "BTK IMEI & Resmi Destek",
      subtitle: "e-Devlet IMEI, garanti ve arıza çözümü",
      badge: "RESMİ REHBER",
      statusEmote: "🛡️ GÜVENLİ",
      href: "/bilgi",
      btnText: "Destek Merkezine Git",
      gradient: "from-teal-600/25 via-teal-950/45 to-slate-900 border-teal-500/35 hover:border-teal-400",
      btnColor: "bg-teal-400 group-hover:bg-teal-300 text-slate-950",
      pillColor: "bg-teal-500/15 border-teal-400/25 text-teal-200",
      icon: <Shield className="w-3 h-3 text-teal-400" />,
      visual: <BtkShieldEmote />,
      pills: ["e-Devlet IMEI", "24 Ay Garanti", "5G & eSIM"],
    },
  ];

  // Bottom Quick Category Filter Redirection Buttons (Small Icon + Centered Large Bold Text)
  const categoryShortcuts = [
    { label: "200 MP Kamera Telefonları", href: "/telefonlar?q=200", icon: <Camera className="w-3.5 h-3.5 text-rose-400 shrink-0" /> },
    { label: "144Hz-165Hz Oyun Telefonları", href: "/telefonlar?q=Pro", icon: <Gamepad2 className="w-3.5 h-3.5 text-orange-400 shrink-0" /> },
    { label: "6000+ mAh Dev Bataryalılar", href: "/telefonlar?q=Redmi", icon: <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> },
    { label: "Katlanabilir (Fold & Flip)", href: "/telefonlar?q=Fold", icon: <Layers className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" /> },
    { label: "120W Süper Hızlı Şarjlılar", href: "/telefonlar?q=Xiaomi", icon: <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" /> },
    { label: "Telefon Sorunları & Çözümleri", href: "/sorunlar", icon: <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" /> },
  ];

  return (
    <section
      className={`relative w-full h-full flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-2 overflow-hidden select-none transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px] h-full flex flex-col justify-between gap-2">
        {/* ─── 1. TOP BAR: COMPACT BRAND REDIRECTION BUTTONS ─── */}
        <div
          className={`flex items-center justify-between gap-2 pb-1.5 border-b shrink-0 ${
            isDark ? "border-white/10" : "border-slate-300"
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <Link
              href="/markalar"
              className="shrink-0 px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400 text-xs font-extrabold uppercase tracking-wider hover:bg-sky-500 hover:text-slate-950 transition-colors"
            >
              34 Marka:
            </Link>
            {brandButtons.map((b) => (
              <Link
                key={b.slug}
                href={`/telefonlar?brand=${encodeURIComponent(b.name)}`}
                className={`group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl border transition-all text-center ${
                  isDark
                    ? "bg-white/5 hover:bg-white/15 border-white/10 hover:border-sky-400"
                    : "bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-400 shadow-xs"
                }`}
              >
                <span className="text-[10px] leading-none opacity-85 group-hover:scale-110 transition-transform">
                  {b.emote}
                </span>
                <span
                  className={`text-xs sm:text-[13px] font-extrabold tracking-tight ${
                    isDark
                      ? "text-slate-100 group-hover:text-white"
                      : "text-slate-800 group-hover:text-sky-700"
                  }`}
                >
                  {b.name}
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/markalar"
            className={`shrink-0 px-3.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-colors ${
              isDark
                ? "bg-white/10 hover:bg-sky-600 text-white"
                : "bg-slate-900 hover:bg-sky-600 text-white"
            }`}
          >
            <span>Tüm Markalar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ─── 2. HERO HEADER & SEARCH BAR (TITLE CENTERED ABOVE SEARCH BAR) ─── */}
        <div className="bg-gradient-to-b from-slate-900/95 via-sky-950/75 to-slate-900/95 rounded-2xl border border-white/10 px-5 py-2.5 shadow-xl shrink-0">
          <div className="flex flex-col items-center justify-center text-center gap-2 max-w-4xl mx-auto">
            {/* Centered Live Badge & Main Heading Above Search Bar */}
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-sky-300 bg-sky-500/15 px-3 py-0.5 rounded-full border border-sky-400/25 mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Türkiye&apos;nin Hızlı Telefon &amp; Fiyat Yönlendirme Merkezi</span>
              </div>
              <h1 className="text-xl sm:text-2xl xl:text-3xl font-black tracking-tight text-white text-center leading-tight">
                En Ucuz Telefonu Bul,{" "}
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Kıyasla ve Keşfet
                </span>
              </h1>
            </div>

            {/* Centered Search Bar + Primary Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-3xl">
              <div className="relative flex-1 w-full z-30">
                <form
                  onSubmit={handleSearch}
                  className={`flex items-center rounded-xl p-1 shadow-lg ring-2 ring-sky-500/30 ${
                    isDark ? "bg-slate-900 border border-slate-700" : "bg-white"
                  }`}
                >
                  <Search className="ml-3 h-4 w-4 shrink-0 text-sky-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Model, marka veya işlemci yazın (örn: iPhone 16, S25 Ultra)..."
                    className={`flex-1 bg-transparent py-1.5 pl-2.5 pr-2 placeholder-slate-400 outline-none text-xs sm:text-sm font-bold text-center sm:text-left ${
                      isDark ? "text-slate-100" : "text-slate-900"
                    }`}
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-5 py-1.5 text-xs sm:text-sm font-black text-white transition-all shrink-0"
                  >
                    Telefon Ara
                  </button>
                </form>

                {/* Compact Search Dropdown */}
                {suggestions.length > 0 && (
                  <div
                    className={`absolute top-full left-0 right-0 mt-1.5 rounded-xl shadow-2xl border overflow-hidden text-left z-50 ${
                      isDark
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div
                      className={`divide-y max-h-64 overflow-y-auto ${
                        isDark ? "divide-slate-800" : "divide-slate-100"
                      }`}
                    >
                      {suggestions.map((p) => (
                        <Link
                          key={p.id}
                          href={`/telefon/${p.slug}`}
                          className={`flex items-center justify-between p-2.5 transition-colors group ${
                            isDark ? "hover:bg-slate-800" : "hover:bg-sky-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                                isDark
                                  ? "bg-sky-500/20 text-sky-400"
                                  : "bg-sky-100 text-sky-600"
                              }`}
                            >
                              📱
                            </span>
                            <div>
                              <div
                                className={`text-xs font-black group-hover:text-sky-400 ${
                                  isDark ? "text-slate-100" : "text-slate-900"
                                }`}
                              >
                                {p.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {p.brand} • {p.specs.performance.chipset}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-black text-sky-500">
                            {formatPrice(p.lowestPrice)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Centered Quick Redirection Buttons Next to Search */}
              <div className="flex items-center justify-center gap-2 shrink-0">
                <Link
                  href="/telefonlar"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Tüm Telefonlar ({phones.length})</span>
                </Link>
                <Link
                  href="/karsilastir"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Scale className="w-4 h-4 text-sky-400" />
                  <span>Karşılaştır</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. CENTER PORTAL GRID: 8 CARDS (CENTERED LARGE TEXT + SMALLER REFINED EMOTES) ─── */}
        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-stretch">
          {portalCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative rounded-2xl bg-gradient-to-br ${card.gradient} border p-3 flex flex-col items-center justify-between text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden`}
            >
              {/* Centered Top Badges & Large Bold Typography */}
              <div className="w-full flex flex-col items-center text-center shrink-0">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/70 border border-white/10 text-[9px] font-extrabold uppercase tracking-widest text-slate-200">
                    {card.icon}
                    <span>{card.badge}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-extrabold text-white">
                    {card.statusEmote}
                  </span>
                </div>

                {/* Large, Stylish Centered Heading */}
                <h2 className="text-lg sm:text-xl xl:text-[22px] font-black tracking-tight text-white group-hover:text-sky-200 transition-colors leading-tight text-center drop-shadow-sm">
                  {card.title}
                </h2>
                <p className="text-xs sm:text-[13px] font-semibold text-slate-200/90 leading-snug text-center mt-0.5">
                  {card.subtitle}
                </p>
              </div>

              {/* Compact Centered Visual Stage: Smaller Emote + Centered Bold Feature Pills */}
              <div className="flex-1 min-h-0 w-full my-1.5 rounded-xl bg-slate-950/40 border border-white/10 px-2 py-1.5 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {card.visual}
                </div>

                <div className="w-full grid grid-cols-3 gap-1 shrink-0">
                  {card.pills.map((pill) => (
                    <span
                      key={pill}
                      className={`px-1.5 py-1 rounded-lg border text-[10px] sm:text-[11px] font-extrabold tracking-tight text-center truncate ${card.pillColor}`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Centered Full-Width Bottom Redirection Button with Large Bold Font */}
              <div className="w-full pt-1 shrink-0">
                <span
                  className={`w-full py-1.5 px-4 rounded-xl text-xs sm:text-sm font-black tracking-tight inline-flex items-center justify-center gap-1.5 shadow-md transition-all ${card.btnColor}`}
                >
                  <span>{card.btnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ─── 4. BOTTOM BAR: CENTERED BOLD CATEGORY SHORTCUT BUTTONS & COMPACT FOOTER ─── */}
        <div
          className={`shrink-0 space-y-1.5 pt-1 border-t ${
            isDark ? "border-white/10" : "border-slate-300"
          }`}
        >
          {/* 6 Category Direction Buttons (Small Icon + Centered Large Bold Text) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {categoryShortcuts.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`group flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-center ${
                  isDark
                    ? "bg-white/5 hover:bg-sky-500/20 border-white/10 hover:border-sky-400/50"
                    : "bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-400 shadow-xs"
                }`}
              >
                {cat.icon}
                <span
                  className={`text-xs sm:text-[13px] font-extrabold tracking-tight truncate ${
                    isDark
                      ? "text-slate-100 group-hover:text-white"
                      : "text-slate-800 group-hover:text-sky-700"
                  }`}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Minimal 1-Line Centered/Balanced Footer Bar inside the single screen */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>
              © 2026{" "}
              <strong className={isDark ? "text-slate-300" : "text-slate-800"}>
                EnUcuzTelefon.com
              </strong>{" "}
              • 16 Resmi Mağaza Canlı Fiyat Karşılaştırma Platformu
            </span>
            <div className="flex items-center gap-4">
              <Link href="/magazalar" className="hover:text-sky-400 transition-colors">
                Anlaşmalı Mağazalar
              </Link>
              <Link href="/soru-cevap" className="hover:text-sky-400 transition-colors">
                Soru-Cevap
              </Link>
              <Link href="/gizlilik-politikasi" className="hover:text-sky-400 transition-colors">
                Gizlilik
              </Link>
              <Link href="/admin" className="hover:text-sky-400 transition-colors">
                Yönetim Paneli
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
