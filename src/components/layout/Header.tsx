"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Smartphone,
  Search,
  Bell,
  User,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, openAlertModal } = useApp();
  const isDark = theme === "dark";

  const [headerSearch, setHeaderSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/telefonlar?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const navLinks = [
    { label: "Tüm Telefonlar", href: "/telefonlar", matchPath: ["/telefonlar", "/"] },
    { label: "Karşılaştır", href: "/karsilastir", matchPath: ["/karsilastir"] },
    {
      label: "Fiyatı Düşenler",
      href: "/telefonlar/fiyati-dusen",
      matchPath: ["/telefonlar/fiyati-dusen"],
      badge: "İndirim",
    },
    { label: "Fiyat Alarmı", href: "/fiyat-takibi", matchPath: ["/fiyat-takibi"] },
    { label: "Kılavuz", href: "/telefon-rehberi", matchPath: ["/telefon-rehberi", "/rehber"] },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090b0e] border-b border-[#181d27] text-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="EnUcuzTelefon Ana Sayfa"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1d8cf8] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Smartphone className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
            EnUcuzTelefon
          </span>
        </Link>

        {/* Center-Left: Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = link.matchPath.includes(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-[#38bdf8] font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#381722] text-[#fb7185] border border-[#591d32] text-[9.5px] font-extrabold leading-tight">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Center-Right: Search Input matching Stitch design */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xs xl:max-w-md mx-2 relative"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Model veya işlemci ara (örn: iPhone 16, S25 Ultra)"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            className="w-full bg-[#121620] border border-[#202738] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#1d8cf8] transition-colors"
          />
          {headerSearch && (
            <button
              type="button"
              onClick={() => setHeaderSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Right Actions: Theme Toggle, Alarm Kur, Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Siyah / Beyaz Theme Switcher Pill */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#202738] bg-[#121620] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isDark ? "Beyaz Moda Geç" : "Siyah Moda Geç"}
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="text-[11px] font-medium hidden sm:inline">&amp;</span>
                <Sun className="w-3.5 h-3.5 text-slate-500" />
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-medium hidden sm:inline">&amp;</span>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              </>
            )}
          </button>

          {/* Alarm Kur Button matching Stitch */}
          <button
            type="button"
            onClick={() => openAlertModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2a2618] bg-[#171510] text-[#fbbf24] hover:bg-[#231f14] transition-colors text-xs font-bold cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alarm Kur</span>
          </button>

          {/* User Profile Avatar Circle */}
          <Link
            href="/admin"
            className="w-8 h-8 rounded-full border border-[#202738] bg-[#121620] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#1d8cf8] transition-colors"
            title="Kullanıcı / Yönetim Paneli"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
