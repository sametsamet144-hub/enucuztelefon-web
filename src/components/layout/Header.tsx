"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleTheme, openAlertModal } = useApp();

  const handleQuickSearchClick = () => {
    const heroSearch = document.getElementById(
      "hero-device-search"
    ) as HTMLInputElement | null;
    if (heroSearch) {
      heroSearch.focus();
      heroSearch.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      router.push("/telefonlar");
    }
  };

  const isPhonesPage = pathname === "/telefonlar";
  if (isPhonesPage) {
    return null;
  }
  const isHomePage = pathname === "/";
  const hideOnMobile = isHomePage;

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-white/[0.05] ${hideOnMobile ? "hidden lg:block" : ""}`}>
      <div className="h-16 max-w-7xl mx-auto px-gutter flex items-center justify-between gap-gutter">
        <Link
          href="/"
          className="flex items-center gap-space-sm shrink-0 group"
        >
          <img
            alt="EnUcuzTelefon Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/ALJJyrAhj_u0wlotCePixGC8Yd9f-jJJAE6wfLjBZNT7KwBqhIySHTgJrhHxmiK_ZaEJHt8dphvmTy44zWvpBqa8m84Y8eg5SBNCnRlP5kxEuxqJ7xTnGiruqkqq11BqoyUEfdmMEvABcRLqE5ee8g9FCnSmBEamWlSTpxVGjZWItapeTOWAVtCRF_2ivjKIKfyA5FaRSwlRKyUmWpgnuKUrvgxYbor5c5UrPkIkgXKrn34"
          />
          <span className="font-title-sm text-title-sm tracking-tight text-on-surface font-semibold">
            EnUcuzTelefon
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-space-lg">
          <Link
            className={`font-label-md text-label-md transition-colors ${
              pathname === "/telefonlar"
                ? "text-on-surface font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            href="/telefonlar"
          >
            Tüm Modeller
          </Link>
          <Link
            className={`font-label-md text-label-md transition-colors ${
              pathname === "/karsilastir"
                ? "text-on-surface font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            href="/karsilastir"
          >
            Karşılaştır
          </Link>
          <Link
            className={`font-label-md text-label-md transition-colors ${
              pathname === "/telefonlar/fiyati-dusen"
                ? "text-on-surface font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            href="/telefonlar/fiyati-dusen"
          >
            Fiyatı Düşenler
          </Link>
          <Link
            className={`font-label-md text-label-md transition-colors ${
              pathname === "/fiyat-takibi"
                ? "text-on-surface font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            href="/fiyat-takibi"
          >
            Fiyat Alarmı
          </Link>
          <Link
            className={`font-label-md text-label-md transition-colors ${
              pathname === "/telefon-rehberi"
                ? "text-on-surface font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            href="/telefon-rehberi"
          >
            Rehber
          </Link>
        </nav>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            className="flex items-center gap-space-sm h-9 px-space-sm rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            onClick={handleQuickSearchClick}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              search
            </span>
            <span className="font-label-sm text-label-sm hidden sm:inline text-outline">
              Hızlı Ara...
            </span>
            <kbd className="hidden md:inline px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">
              ⌘K
            </kbd>
          </button>

          <button
            aria-label="Tema Değiştir"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              dark_mode
            </span>
          </button>

          <button
            type="button"
            onClick={() => openAlertModal()}
            className="hidden sm:inline-flex items-center justify-center h-9 px-space-md rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[0_0_20px_rgba(41,151,255,0.25)] hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
          >
            Fiyat Alarmı Kur
          </button>

          <Link
            href="/admin"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
