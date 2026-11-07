"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, TrendingDown, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { searchPhones } from "@/lib/data";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";
import type { Phone } from "@/types";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  { label: "iPhone 16 Pro Max", href: "/telefon/iphone-16-pro-max" },
  { label: "Samsung Galaxy S25 Ultra", href: "/telefon/samsung-galaxy-s25-ultra" },
  { label: "Xiaomi 15 Pro", href: "/telefon/xiaomi-15-pro" },
  { label: "POCO X6 Pro 5G", href: "/telefon/poco-x6-pro" },
  { label: "Galaxy A55 5G", href: "/telefon/samsung-galaxy-a55" },
  { label: "iPhone 15", href: "/telefon/iphone-15" },
  { label: "Huawei Pura 70 Ultra", href: "/telefon/huawei-pura-70-ultra" },
  { label: "OnePlus 12", href: "/telefon/oneplus-12" },
];

const LOCAL_STORAGE_KEY = "enucuz_recent_searches";
const MAX_RECENT = 5;

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [matchingPhones, setMatchingPhones] = useState<Phone[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live matching phones from backend API
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length > 1) {
      const timer = setTimeout(() => {
        searchPhones(trimmed).then((res) => {
          if (res) setMatchingPhones(res.slice(0, 6));
        });
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setMatchingPhones([]);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) setRecentSearches(JSON.parse(stored));
        } catch {}
      }, 50);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const saveRecent = (searchTerm: string) => {
    try {
      const updated = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, MAX_RECENT);
      setRecentSearches(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecent(searchTerm.trim());
    onClose();
    router.push(`/telefonlar?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Panel */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl border-b border-slate-200 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(query);
            }}
            className="relative flex items-center gap-3"
          >
            <div className="relative flex-1">
              <Search
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Telefon veya marka ara... (örn: iPhone 16 Pro, S25 Ultra, Snapdragon, AMOLED)"
                className="w-full pl-12 pr-4 py-3.5 text-base bg-slate-50 border-2 border-slate-200 focus:border-sky-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-slate-400 font-medium"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 px-6 py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-2xl transition-all shadow-md"
            >
              Ara
            </button>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-3 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Aramayı kapat"
            >
              <X size={22} />
            </button>
          </form>

          {/* Instant Live Matching Results */}
          {matchingPhones.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                  Canlı Eşleşen Telefonlar ({matchingPhones.length})
                </span>
                <span className="text-xs text-slate-400">Tümünü görmek için Enter&apos;a basın</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {matchingPhones.map((phone) => (
                  <Link
                    key={phone.id}
                    href={`/telefon/${phone.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-100 flex items-center justify-center shrink-0">
                      <PhoneImage src={phone.image} alt={phone.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 truncate">
                        {phone.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        {formatPrice(phone.lowestPrice)}
                        <span className="text-[10px] text-slate-400 ml-1 font-normal">
                          ({phone.priceStore})
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent & Popular Searches */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Son Aramalar
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    Temizle
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSearchSubmit(term)}
                      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-colors text-left"
                    >
                      <Search size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className={recentSearches.length > 0 ? "md:col-span-2" : "md:col-span-3"}>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                Popüler Telefon Aramaları
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-600 transition-all"
                  >
                    <Smartphone size={13} className="text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
