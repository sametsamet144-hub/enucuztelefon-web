"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Smartphone, Search, Bell, User, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { openAlertModal } = useApp();

  const [headerSearch, setHeaderSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/telefonlar?q=${encodeURIComponent(headerSearch.trim())}`);
    } else {
      router.push("/telefonlar");
    }
  };

  const navLinks = [
    { label: "Tüm Modeller", href: "/telefonlar", matchPath: ["/telefonlar"] },
    { label: "Karşılaştır", href: "/karsilastir", matchPath: ["/karsilastir"] },
    {
      label: "Fiyatı Düşenler",
      href: "/telefonlar/fiyati-dusen",
      matchPath: ["/telefonlar/fiyati-dusen"],
    },
    { label: "Fiyat Alarmı", href: "/fiyat-takibi", matchPath: ["/fiyat-takibi"] },
    {
      label: "Rehber",
      href: "/telefon-rehberi",
      matchPath: ["/telefon-rehberi", "/rehber"],
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08090c]/95 backdrop-blur-md border-b border-[#141923] text-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo + Navigation */}
        <div className="flex items-center gap-6">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.matchPath.includes(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-white bg-white/8 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Compact Search + Bell + Blue "Fiyat Alarmı Kur" + Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center bg-[#10141d] border border-[#1d2433] focus-within:border-[#1d8cf8] rounded-full px-3.5 py-1.5 w-48 xl:w-56 transition-colors relative"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Hızlı ara..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            {headerSearch ? (
              <button
                type="button"
                onClick={() => setHeaderSearch("")}
                className="text-slate-400 hover:text-white ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.2 rounded bg-[#161c28] border border-[#222a3a]">
                ⌘K
              </span>
            )}
          </form>

          {/* Bell Icon Circle */}
          <button
            type="button"
            onClick={() => openAlertModal()}
            className="w-9 h-9 rounded-full border border-[#1d2433] bg-[#10141d] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#1d8cf8] transition-colors cursor-pointer"
            title="Bildirimler & Fiyat Alarmları"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Blue "Fiyat Alarmı Kur" Pill Button (Desktop) */}
          <button
            type="button"
            onClick={() => openAlertModal()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1d8cf8] hover:bg-[#1577d6] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Fiyat Alarmı Kur</span>
          </button>

          {/* User Avatar Circle */}
          <Link
            href="/admin"
            className="w-9 h-9 rounded-full border border-[#1d2433] bg-[#10141d] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#1d8cf8] transition-colors"
            title="Kullanıcı / Yönetim Paneli"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
