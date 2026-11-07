"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, Search, Bell, Scale, Heart, TrendingDown, Moon, Sun } from "lucide-react";
import Navigation from "./Navigation";
import MobileNav from "./MobileNav";
import SearchBar from "./SearchBar";
import clsx from "clsx";
import { useApp } from "@/context/AppContext";

// ─── Info Bar ────────────────────────────────────────────────────────────────
function InfoBar() {
  const { openAlertModal, theme, toggleTheme } = useApp();
  const isDark = theme === "dark";

  return (
    <div className="hidden sm:block bg-slate-950 text-slate-300 text-xs py-1.5 border-b border-slate-800/90">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            type="button"
            onClick={() => openAlertModal()}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Bell size={12} className="shrink-0 text-amber-400" />
            <span>Fiyat alarmı kur</span>
          </button>
          <span className="text-slate-700 select-none">|</span>
          <Link
            href="/karsilastir"
            prefetch={false}
            className="flex items-center gap-1.5 hover:text-sky-400 transition-colors"
          >
            <Scale size={12} className="shrink-0 text-sky-400" />
            <span>Telefon Karşılaştır</span>
          </Link>
          <span className="text-slate-700 select-none">|</span>
          <Link
            href="/telefonlar/fiyati-dusen"
            prefetch={false}
            className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
          >
            <TrendingDown size={12} className="shrink-0 text-rose-400" />
            <span>Fiyatı düşen telefonlar</span>
          </Link>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 hover:text-sky-400 transition-colors cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun size={12} className="text-amber-400" />
                <span>Beyaz Moda Geç</span>
              </>
            ) : (
              <>
                <Moon size={12} className="text-sky-400" />
                <span>Siyah Moda Geç</span>
              </>
            )}
          </button>
          <span className="text-slate-700 select-none">|</span>
          <Link
            href="/telefon-rehberi"
            prefetch={false}
            className="hover:text-slate-100 transition-colors text-slate-400"
          >
            Telefon Rehberi
          </Link>
          <span className="text-slate-700 select-none">|</span>
          <Link
            href="/admin"
            prefetch={false}
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors bg-sky-950 px-2 py-0.5 rounded border border-sky-800"
          >
            Yönetim Paneli
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Logo (Zarif & Tatlı Telefon Emote) ──────────────────────────────────────
function Logo() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  return (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Ana Sayfa">
      <div className="relative flex items-center justify-center">
        {/* Soft ambient glow behind the cute phone emote */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 via-indigo-400 to-pink-400 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
        
        {/* Cute Smartphone Mascot Emote SVG */}
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-violet-600 p-0.5 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-slate-900/20 to-slate-950/60 flex items-center justify-center relative overflow-hidden">
            <svg
              viewBox="0 0 48 48"
              className="w-9 h-9 drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Phone outer metallic frame */}
              <rect
                x="10"
                y="4"
                width="28"
                height="40"
                rx="7"
                fill="url(#cutePhoneBody)"
                stroke="#ffffff"
                strokeWidth="1.8"
              />
              {/* Phone glowing screen */}
              <rect
                x="12.5"
                y="6.5"
                width="23"
                height="35"
                rx="5"
                fill="url(#cutePhoneScreen)"
              />
              {/* Screen glossy reflection */}
              <path
                d="M13 11C16 8 22 7 34 7.5V16C25 14 17 16 13 20V11Z"
                fill="white"
                fillOpacity="0.22"
              />
              {/* Cute Dynamic Island / Earpiece */}
              <rect x="20" y="8.5" width="8" height="2.4" rx="1.2" fill="#0f172a" />
              <circle cx="26.2" cy="9.7" r="0.7" fill="#38bdf8" />

              {/* Left Eye: Sparkling kawaii eye */}
              <circle cx="18.8" cy="21.5" r="2.5" fill="#0f172a" />
              <circle cx="18.1" cy="20.6" r="1" fill="#ffffff" />
              <circle cx="19.7" cy="22.3" r="0.5" fill="#ffffff" />

              {/* Right Eye: Cute happy wink */}
              <path
                d="M26.8 21.8C27.5 19.8 30.2 19.8 30.9 21.8"
                stroke="#0f172a"
                strokeWidth="2.1"
                strokeLinecap="round"
              />

              {/* Rosy kawaii blush cheeks */}
              <ellipse cx="16.2" cy="24.5" rx="2" ry="1.1" fill="#fb7185" fillOpacity="0.75" />
              <ellipse cx="31.8" cy="24.5" rx="2" ry="1.1" fill="#fb7185" fillOpacity="0.75" />

              {/* Sweet cheerful smile */}
              <path
                d="M21.2 24.5C22.2 26.8 25.8 26.8 26.8 24.5"
                stroke="#0f172a"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Cute little tongue/heart accent */}
              <path
                d="M22.8 25.8C23.4 26.7 24.6 26.7 25.2 25.8"
                stroke="#f43f5e"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {/* Little Cute Heart / Price Badge on Screen Bottom */}
              <rect x="17" y="31" width="14" height="5" rx="2.5" fill="#0ea5e9" fillOpacity="0.2" />
              <path
                d="M24 35.2C24 35.2 21.2 33.6 21.2 32.1C21.2 31.3 21.9 30.8 22.6 30.8C23.2 30.8 23.7 31.1 24 31.6C24.3 31.1 24.8 30.8 25.4 30.8C26.1 30.8 26.8 31.3 26.8 32.1C26.8 33.6 24 35.2 24 35.2Z"
                fill="#f43f5e"
              />

              {/* Home bar */}
              <rect x="20" y="38.5" width="8" height="1.3" rx="0.65" fill="#0f172a" fillOpacity="0.35" />

              {/* Floating Sparkle Star top-right */}
              <path
                d="M40 7L41.1 9.9L44 11L41.1 12.1L40 15L38.9 12.1L36 11L38.9 9.9L40 7Z"
                fill="#fbbf24"
              />

              <defs>
                <linearGradient id="cutePhoneBody" x1="10" y1="4" x2="38" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.5" stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="cutePhoneScreen" x1="12.5" y1="6.5" x2="35.5" y2="41.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.55" stopColor="#f0f9ff" />
                  <stop offset="1" stopColor="#e0e7ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Cute Floating Mini Discount Tag Badge */}
        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-rose-500 text-white text-[9px] font-black rounded-full border-2 border-white shadow-sm leading-none flex items-center justify-center">
          ₺
        </span>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={clsx(
            "text-lg font-black group-hover:text-sky-500 transition-colors tracking-tight",
            isDark ? "text-white" : "text-slate-900"
          )}
        >
          EnUcuzTelefon
          <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">.com</span>
        </span>
        <span className="text-[10px] text-slate-400 font-semibold tracking-wide mt-0.5">
          Türkiye Telefon &amp; Fiyat Merkezi
        </span>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Header() {
  const { favoritesCount, compareList, openAlertModal, theme, setTheme } = useApp();
  const isDark = theme === "dark";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30">
        <InfoBar />

        <div
          className={clsx(
            "transition-all duration-200",
            isDark
              ? isScrolled
                ? "bg-slate-900/95 shadow-lg border-b border-slate-800"
                : "bg-slate-900 border-b border-slate-800"
              : isScrolled
                ? "bg-white shadow-md"
                : "bg-white shadow-sm border-b border-slate-200/80"
          )}
        >
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 h-16">
              {/* Mobile: Hamburger */}
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className={clsx(
                  "lg:hidden p-2 rounded-xl transition-colors",
                  isDark
                    ? "text-slate-300 hover:text-sky-400 hover:bg-slate-800"
                    : "text-slate-600 hover:text-sky-600 hover:bg-slate-100"
                )}
                aria-label="Menüyü aç"
                aria-expanded={isMobileNavOpen}
              >
                <Menu size={24} />
              </button>

              <Logo />

              {/* Desktop Navigation */}
              <div className="flex-1 flex justify-center">
                <Navigation />
              </div>

              {/* Right Action Tools */}
              <div className="flex items-center gap-1.5 ml-auto">
                {/* Siyah Mod / Beyaz Mod Segmented Switcher */}
                <div
                  className={clsx(
                    "flex items-center p-1 rounded-xl border transition-colors",
                    isDark
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-100 border-slate-200"
                  )}
                  role="group"
                  aria-label="Tema Seçimi"
                >
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={clsx(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer",
                      isDark
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                    title="Siyah Mod (Göz Yormayan Gece Modu)"
                  >
                    <Moon size={13} className={isDark ? "text-white" : "text-slate-500"} />
                    <span className="hidden sm:inline">Siyah Mod</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={clsx(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer",
                      !isDark
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                    title="Beyaz Mod (Açık Görünüm)"
                  >
                    <Sun size={13} className={!isDark ? "text-amber-500" : "text-slate-400"} />
                    <span className="hidden sm:inline">Beyaz Mod</span>
                  </button>
                </div>

                {/* Search Trigger */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors group",
                    isDark
                      ? "text-slate-300 hover:text-sky-400 hover:bg-slate-800"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-100"
                  )}
                  aria-label="Arama Aç"
                >
                  <Search size={19} />
                  <span
                    className={clsx(
                      "hidden xl:block text-xs font-semibold transition-colors",
                      isDark
                        ? "text-slate-300 group-hover:text-sky-400"
                        : "text-slate-500 group-hover:text-sky-600"
                    )}
                  >
                    Ara...
                  </span>
                  <kbd
                    className={clsx(
                      "hidden xl:flex items-center px-1.5 py-0.5 rounded font-mono text-[10px]",
                      isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-400"
                    )}
                  >
                    /
                  </kbd>
                </button>

                {/* Compare Button with Badge */}
                <Link
                  href="/karsilastir"
                  prefetch={false}
                  className={clsx(
                    "relative p-2 rounded-xl transition-colors",
                    isDark
                      ? "text-slate-300 hover:text-sky-400 hover:bg-slate-800"
                      : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                  )}
                  title="Karşılaştırma Listesi"
                >
                  <Scale size={19} />
                  {compareList.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                      {compareList.length}
                    </span>
                  )}
                </Link>

                {/* Favorites Button with Badge */}
                <Link
                  href="/fiyat-takibi"
                  prefetch={false}
                  className={clsx(
                    "relative p-2 rounded-xl transition-colors",
                    isDark
                      ? "text-slate-300 hover:text-rose-400 hover:bg-slate-800"
                      : "text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                  )}
                  title="Favorilerim & Fiyat Takibi"
                >
                  <Heart size={19} className={favoritesCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                {/* Price Alert CTA */}
                <button
                  type="button"
                  onClick={() => openAlertModal()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Bell size={14} />
                  <span>Fiyat Alarmı</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
