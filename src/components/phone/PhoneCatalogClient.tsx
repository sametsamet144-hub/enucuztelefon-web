"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  X,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Search,
} from "lucide-react";
import type { Phone, Brand, SortOption } from "@/types";
import PhoneCard from "./PhoneCard";
import MobilePhoneCard from "./MobilePhoneCard";
import { formatPrice } from "@/lib/utils";

interface Props {
  initialPhones: Phone[];
  brands: Brand[];
  initialBrand?: string;
  initialQuery?: string;
}

const ITEMS_PER_PAGE_DESKTOP = 16;
const ITEMS_PER_PAGE_MOBILE = 8;

export default function PhoneCatalogClient({
  initialPhones,
  brands,
  initialBrand,
  initialQuery,
}: Props) {
  // ── Filter States ──
  const [search, setSearch] = useState(initialQuery || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [pricePreset, setPricePreset] = useState<string>("all");
  const [selectedRAMs, setSelectedRAMs] = useState<number[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<number[]>([]);
  const [minCamera, setMinCamera] = useState<number>(0);
  const [selectedScreenHz, setSelectedScreenHz] = useState<number[]>([]);
  const [minBattery, setMinBattery] = useState<number>(0);
  const [features, setFeatures] = useState<{
    fiveG: boolean;
    nfc: boolean;
    wirelessCharging: boolean;
    ip68: boolean;
  }>({
    fiveG: false,
    nfc: false,
    wirelessCharging: false,
    ip68: false,
  });
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [freeShippingOnly, setFreeShippingOnly] = useState<boolean>(false);
  const [installmentOnly, setInstallmentOnly] = useState<boolean>(false);
  const [dipFiyatOnly, setDipFiyatOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    storage: true,
    ram: true,
    camera: true,
    screen: true,
    battery: true,
    features: true,
    os: true,
  });

  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const applyPricePreset = (preset: string) => {
    setPricePreset(preset);
    if (preset === "budget") {
      setMinPrice("0");
      setMaxPrice("15000");
    } else if (preset === "mid") {
      setMinPrice("15000");
      setMaxPrice("30000");
    } else if (preset === "upper_mid") {
      setMinPrice("30000");
      setMaxPrice("50000");
    } else if (preset === "flagship") {
      setMinPrice("50000");
      setMaxPrice("");
    } else {
      setMinPrice("");
      setMaxPrice("");
    }
    setCurrentPage(1);
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) => {
      const exists = prev.some((x) => x.toLowerCase() === b.toLowerCase());
      if (exists) {
        return prev.filter((x) => x.toLowerCase() !== b.toLowerCase());
      }
      return [...prev, b];
    });
    setCurrentPage(1);
  };

  const toggleRAM = (ram: number) => {
    setSelectedRAMs((prev) =>
      prev.includes(ram) ? prev.filter((x) => x !== ram) : [...prev, ram]
    );
    setCurrentPage(1);
  };

  const toggleStorage = (st: number) => {
    setSelectedStorages((prev) =>
      prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
    );
    setCurrentPage(1);
  };

  const toggleScreenHz = (hz: number) => {
    setSelectedScreenHz((prev) =>
      prev.includes(hz) ? prev.filter((x) => x !== hz) : [...prev, hz]
    );
    setCurrentPage(1);
  };

  const toggleOS = (os: string) => {
    setSelectedOS((prev) =>
      prev.includes(os) ? prev.filter((x) => x !== os) : [...prev, os]
    );
    setCurrentPage(1);
  };

  const toggleFeature = (feat: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [feat]: !prev[feat] }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setPricePreset("all");
    setSelectedRAMs([]);
    setSelectedStorages([]);
    setMinCamera(0);
    setSelectedScreenHz([]);
    setMinBattery(0);
    setFeatures({
      fiveG: false,
      nfc: false,
      wirelessCharging: false,
      ip68: false,
    });
    setSelectedOS([]);
    setFreeShippingOnly(false);
    setInstallmentOnly(false);
    setDipFiyatOnly(false);
    setSort("popular");
    setCurrentPage(1);
  };

  const brandPills = useMemo(() => {
    return brands.map((b) => ({
      name: b.name,
      count:
        b.phoneCount ||
        initialPhones.filter(
          (p) => p.brand.toLowerCase() === b.name.toLowerCase()
        ).length,
    }));
  }, [brands, initialPhones]);

  const filteredSidebarBrands = useMemo(() => {
    if (!brandSearch.trim()) return brandPills;
    return brandPills.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandPills, brandSearch]);

  // ── Filtering Logic ──
  const filteredPhones = useMemo(() => {
    return initialPhones.filter((phone) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = phone.name.toLowerCase().includes(q);
        const matchesBrand = phone.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }

      if (selectedBrands.length > 0) {
        const lowerSelected = selectedBrands.map((b) => b.toLowerCase());
        if (!lowerSelected.includes(phone.brand.toLowerCase())) {
          return false;
        }
      }

      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;
      if (phone.lowestPrice < minP || phone.lowestPrice > maxP) {
        return false;
      }

      if (dipFiyatOnly && !phone.isPriceDropped && (phone.priceDropPercent || 0) < 10) {
        return false;
      }

      return true;
    });
  }, [initialPhones, search, selectedBrands, minPrice, maxPrice, dipFiyatOnly]);

  // ── Sorting Logic ──
  const sortedPhones = useMemo(() => {
    const list = [...filteredPhones];
    if (sort === "popular") return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "price-asc") return list.sort((a, b) => a.lowestPrice - b.lowestPrice);
    if (sort === "price-desc") return list.sort((a, b) => b.lowestPrice - a.lowestPrice);
    if (sort === "rating") return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "price-drop")
      return list.sort((a, b) => (b.priceDropPercent ?? 0) - (a.priceDropPercent ?? 0));
    return list;
  }, [filteredPhones, sort]);

  // ── Paginated Phones ──
  const paginatedDesktop = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE_DESKTOP;
    return sortedPhones.slice(start, start + ITEMS_PER_PAGE_DESKTOP);
  }, [sortedPhones, currentPage]);

  const paginatedMobile = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE_MOBILE;
    return sortedPhones.slice(start, start + ITEMS_PER_PAGE_MOBILE);
  }, [sortedPhones, currentPage]);

  const totalPagesDesktop = Math.max(1, Math.ceil(sortedPhones.length / ITEMS_PER_PAGE_DESKTOP));
  const totalPagesMobile = Math.max(1, Math.ceil(sortedPhones.length / ITEMS_PER_PAGE_MOBILE));

  // ── Filter Sidebar Component ──
  const FilterControls = (
    <div className="space-y-4 text-xs text-zinc-300">
      {/* 1. Marka */}
      <details className="group space-y-2.5" open={openSections.brand}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("brand");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[#2997ff] text-[16px]">smartphone</span>
            Marka
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.brand ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.brand && (
          <div className="space-y-2 pt-1">
            <input
              type="text"
              placeholder="Marka ara..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full bg-[#0e0e10] border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] transition-all"
            />

            <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto no-scrollbar">
              {filteredSidebarBrands.map((b) => {
                const isChecked = selectedBrands.some(
                  (sb) => sb.toLowerCase() === b.name.toLowerCase()
                );
                return (
                  <label
                    key={b.name}
                    onClick={() => toggleBrand(b.name)}
                    className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-[#18181b] cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-zinc-700 text-[#2997ff] focus:ring-0 bg-[#0e0e10] w-4 h-4 cursor-pointer"
                      />
                      <span
                        className={`text-xs font-medium ${
                          isChecked ? "text-[#2997ff] font-semibold" : "text-zinc-300 group-hover/item:text-white"
                        }`}
                      >
                        {b.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">{b.count}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </details>

      {/* 2. Fiyat Aralığı */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.price}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("price");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">payments</span>
            Fiyat Aralığı
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.price ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.price && (
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="number"
                placeholder="Min TL"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-[#0e0e10] border border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2997ff]"
              />
              <input
                type="number"
                placeholder="Max TL"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#0e0e10] border border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2997ff]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {[
                { id: "all", label: "Tümü" },
                { id: "budget", label: "0-15K" },
                { id: "mid", label: "15-30K" },
                { id: "upper_mid", label: "30-50K" },
                { id: "flagship", label: "50K+" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPricePreset(p.id)}
                  className={`px-2.5 py-1 rounded-lg border transition-all filter-pill-neon ${
                    pricePreset === p.id
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 font-semibold filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </details>

      {/* 3. Dahili Depolama */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.storage}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("storage");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-amber-400 text-[16px]">inventory_2</span>
            Dahili Depolama
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.storage ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.storage && (
          <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
            {[128, 256, 512, 1024].map((st) => {
              const isSelected = selectedStorages.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleStorage(st)}
                  className={`px-3 py-1 rounded-xl border transition-all filter-pill-neon ${
                    isSelected
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 font-semibold filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {st === 1024 ? "1 TB" : `${st} GB`}
                </button>
              );
            })}
          </div>
        )}
      </details>

      {/* 4. Bellek (RAM) */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.ram}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("ram");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-purple-400 text-[16px]">memory</span>
            Bellek (RAM)
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.ram ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.ram && (
          <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
            {[8, 12, 16, 24].map((ram) => {
              const isSelected = selectedRAMs.includes(ram);
              return (
                <button
                  key={ram}
                  type="button"
                  onClick={() => toggleRAM(ram)}
                  className={`px-3 py-1 rounded-xl border transition-all filter-pill-neon ${
                    isSelected
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 font-semibold filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {ram} GB
                </button>
              );
            })}
          </div>
        )}
      </details>

      {/* 5. Kamera */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.camera}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("camera");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-rose-400 text-[16px]">photo_camera</span>
            Kamera
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.camera ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.camera && (
          <div className="space-y-1.5 pt-1 text-[11px]">
            {[
              { val: 0, label: "Tümü" },
              { val: 50, label: "50 MP ve Üzeri" },
              { val: 200, label: "200 MP Zirve" },
            ].map((c) => {
              const isSelected = minCamera === c.val;
              return (
                <label
                  key={c.val}
                  onClick={() => setMinCamera(c.val)}
                  className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-[#18181b] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="kamera"
                    checked={isSelected}
                    onChange={() => {}}
                    className="text-rose-500 focus:ring-0 bg-[#0e0e10] border-zinc-700 w-4 h-4 cursor-pointer"
                  />
                  <span className={isSelected ? "text-rose-400 font-semibold" : "text-zinc-400 hover:text-white"}>
                    {c.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </details>

      {/* 6. Ekran & Hz */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.screen}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("screen");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-cyan-400 text-[16px]">phone_android</span>
            Ekran & Hz
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.screen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.screen && (
          <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
            {[60, 120, 144].map((hz) => {
              const isSelected = selectedScreenHz.includes(hz);
              return (
                <button
                  key={hz}
                  type="button"
                  onClick={() => toggleScreenHz(hz)}
                  className={`px-3 py-1 rounded-xl border transition-all filter-pill-neon ${
                    isSelected
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 font-semibold filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {hz === 144 ? "144 Hz+" : `${hz} Hz`}
                </button>
              );
            })}
          </div>
        )}
      </details>

      {/* 7. Batarya */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.battery}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("battery");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">battery_charging_full</span>
            Batarya
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.battery ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.battery && (
          <div className="space-y-1.5 pt-1 text-[11px]">
            {[
              { val: 0, label: "Tümü" },
              { val: 5000, label: "5.000 mAh+" },
              { val: 5500, label: "5.500 mAh+" },
            ].map((b) => {
              const isSelected = minBattery === b.val;
              return (
                <label
                  key={b.val}
                  onClick={() => setMinBattery(b.val)}
                  className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-[#18181b] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="batarya"
                    checked={isSelected}
                    onChange={() => {}}
                    className="text-emerald-500 focus:ring-0 bg-[#0e0e10] border-zinc-700 w-4 h-4 cursor-pointer"
                  />
                  <span className={isSelected ? "text-emerald-400 font-semibold" : "text-zinc-400 hover:text-white"}>
                    {b.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </details>

      {/* 8. Özellikler */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.features}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("features");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-purple-400 text-[16px]">security</span>
            Özellikler
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.features ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.features && (
          <div className="space-y-1.5 pt-1">
            {[
              { id: "fiveG", label: "5G Şebeke" },
              { id: "nfc", label: "NFC Ödeme" },
              { id: "wirelessCharging", label: "Kablosuz Şarj" },
              { id: "ip68", label: "IP68 Su Geçirmez" },
            ].map((f) => {
              const featKey = f.id as keyof typeof features;
              const isChecked = features[featKey];
              return (
                <label
                  key={f.id}
                  onClick={() => toggleFeature(featKey)}
                  className="flex items-center gap-2.5 py-1 px-1 rounded-lg hover:bg-[#18181b] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded border-zinc-700 text-[#2997ff] focus:ring-0 bg-[#0e0e10] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300">{f.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </details>

      {/* 9. İşletim Sistemi */}
      <details className="group space-y-2.5 pt-3 border-t border-zinc-700/60" open={openSections.os}>
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleSection("os");
          }}
          className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none list-none"
        >
          <span className="flex items-center gap-2 text-zinc-200 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[#2997ff] text-[16px]">language</span>
            İşletim Sistemi
          </span>
          <span
            className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 text-[18px] ${
              openSections.os ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </summary>

        {openSections.os && (
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            {["Android", "iOS"].map((os) => {
              const isChecked = selectedOS.includes(os);
              return (
                <button
                  key={os}
                  type="button"
                  onClick={() => toggleOS(os)}
                  className={`py-1.5 px-3 rounded-xl border font-medium text-center filter-pill-neon transition-all ${
                    isChecked
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 font-semibold filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {os}
                </button>
              );
            })}
          </div>
        )}
      </details>
    </div>
  );

  return (
    <div className="bg-[#0e0e10] text-[#e5e1e4] min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE EXPERIENCE (<lg) ── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden">
        {/* Top Search & Filter Bar */}
        <div className="flex flex-col gap-2 px-3 pt-3 pb-3 bg-[#131315] border-b border-white/[0.08] shadow-sm">
          {/* Quick Search Pill Bar */}
          <div className="relative w-full">
            <div className="flex items-center w-full h-11 px-3.5 rounded-full bg-[#201f22] text-[#c0c7d5] focus-within:ring-2 focus-within:ring-[#2997ff]/60 border border-white/[0.06]">
              <span className="material-symbols-outlined text-[20px] mr-2 text-[#2997ff] shrink-0">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Model, marka veya özellik ara..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder-[#8a919e]"
              />
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#2a2a2c] text-[#c0c7d5] hover:text-white shrink-0 ml-1 active:scale-95"
                title="Filtreler"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </button>
            </div>
          </div>

          {/* Horizontal Brand Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-3 px-3">
            <button
              type="button"
              onClick={() => {
                setSelectedBrands([]);
                setCurrentPage(1);
              }}
              className={`h-8 px-3.5 rounded-full flex items-center shrink-0 text-xs font-semibold shadow-sm transition-all ${
                selectedBrands.length === 0
                  ? "bg-white text-[#0e0e10]"
                  : "bg-[#201f22] text-[#c0c7d5] border border-white/[0.06]"
              }`}
            >
              Tüm Markalar
            </button>
            {brandPills.map((b) => {
              const active = selectedBrands.includes(b.name);
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => toggleBrand(b.name)}
                  className={`h-8 px-3.5 rounded-full flex items-center gap-1 shrink-0 text-xs font-semibold shadow-sm transition-all ${
                    active
                      ? "bg-white text-[#0e0e10]"
                      : "bg-[#201f22] text-[#c0c7d5] border border-white/[0.06]"
                  }`}
                >
                  <span>{b.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Benefit Filter Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-3 px-3">
            <button
              type="button"
              onClick={() => setFreeShippingOnly((v) => !v)}
              className={`h-7 px-2.5 rounded-full flex items-center gap-1 shrink-0 text-[11px] font-medium border transition-all ${
                freeShippingOnly
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-[#1c1b1d] text-[#8a919e] border-white/[0.06]"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              <span>Kargo Bedava</span>
            </button>
            <button
              type="button"
              onClick={() => setInstallmentOnly((v) => !v)}
              className={`h-7 px-2.5 rounded-full flex items-center gap-1 shrink-0 text-[11px] font-medium border transition-all ${
                installmentOnly
                  ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                  : "bg-[#1c1b1d] text-[#8a919e] border-white/[0.06]"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">credit_card</span>
              <span>Peşin Fiyatına Taksit</span>
            </button>
            <button
              type="button"
              onClick={() => setDipFiyatOnly((v) => !v)}
              className={`h-7 px-2.5 rounded-full flex items-center gap-1 shrink-0 text-[11px] font-medium border transition-all ${
                dipFiyatOnly
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                  : "bg-[#1c1b1d] text-[#8a919e] border-white/[0.06]"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              <span>Tarihi Dip Fiyat</span>
            </button>
          </div>

          {/* Model Counter & View Mode Switcher */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-[#8a919e]">
              <span className="font-bold text-white">{sortedPhones.length} Model</span>
              <span>•</span>
              <span>16 Mağaza</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-[#201f22] text-[#c0c7d5] text-xs rounded-lg px-2 py-1 border border-white/[0.08] outline-none"
              >
                <option value="popular">En Popüler</option>
                <option value="price-asc">En Düşük Fiyat</option>
                <option value="price-desc">En Yüksek Fiyat</option>
                <option value="rating">Kullanıcı Puanı</option>
                <option value="price-drop">İndirim Oranı</option>
              </select>

              <div className="flex items-center bg-[#201f22] p-0.5 rounded-lg border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${
                    viewMode === "grid" ? "bg-[#2997ff] text-white" : "text-[#8a919e]"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${
                    viewMode === "list" ? "bg-[#2997ff] text-white" : "text-[#8a919e]"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Device Grid */}
        <div className="p-3">
          {sortedPhones.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <span className="material-symbols-outlined text-4xl mb-2 text-zinc-600">
                search_off
              </span>
              <p className="text-sm">Seçilen filtrelere uygun telefon bulunamadı.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 px-4 py-1.5 rounded-full bg-[#2997ff] text-white text-xs font-semibold"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-2.5">
              {paginatedMobile.map((p) => (
                <MobilePhoneCard key={p.id} phone={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedMobile.map((p) => (
                <PhoneCard key={p.id} phone={p} variant="list" />
              ))}
            </div>
          )}

          {/* Mobile Pagination */}
          {totalPagesMobile > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-12">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full bg-[#201f22] text-[#c0c7d5] flex items-center justify-center disabled:opacity-40 border border-white/[0.08]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-[#8a919e]">
                Sayfa <strong className="text-white">{currentPage}</strong> / {totalPagesMobile}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPagesMobile}
                onClick={() => setCurrentPage((p) => Math.min(totalPagesMobile, p + 1))}
                className="w-8 h-8 rounded-full bg-[#201f22] text-[#c0c7d5] flex items-center justify-center disabled:opacity-40 border border-white/[0.08]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Filter Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-h-[85vh] bg-[#131315] rounded-t-3xl border-t border-white/[0.1] p-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2997ff]">tune</span>
                  <h3 className="font-bold text-base text-white">Filtreleri Düzenle</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#201f22] flex items-center justify-center text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {FilterControls}

              <div className="sticky bottom-0 pt-4 pb-2 bg-[#131315] flex gap-2 border-t border-white/[0.08] mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-1/2 py-2.5 rounded-full bg-[#201f22] text-[#c0c7d5] text-xs font-semibold"
                >
                  Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 rounded-full bg-[#2997ff] text-white text-xs font-bold"
                >
                  Uygula ({sortedPhones.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── DESKTOP EXPERIENCE (>=lg) - EXACT STITCH CATALOGUE DESIGN ── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block relative">
        {/* Ambient Dot Grid & Lighting */}
        <div className="ambient-dot-grid absolute inset-0 pointer-events-none opacity-50" />
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#2997ff]/5 rounded-full blur-3xl pointer-events-none" />

        {/* ── Sub-Header Control Bar ── */}
        <section className="max-w-[1880px] mx-auto px-4 lg:px-6 pt-4 pb-3 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-700/60 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                  Tüm Telefonlar
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#2997ff]/15 text-[#2997ff] border border-[#2997ff]/30 font-semibold text-xs shadow-sm shadow-[#2997ff]/20">
                  {sortedPhones.length} Model Listeleniyor
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-sm shadow-emerald-400" />
                </span>
                <span>16 Yetkili Mağazadan Anlık Fiyatlar • 15 Dakikada Bir Otomatik Güncellenir</span>
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-3">
              {/* Quick Filters */}
              <div className="hidden xl:flex items-center gap-2 text-xs text-zinc-400 pr-2 border-r border-zinc-700/60">
                <span className="text-zinc-500 font-medium">Hızlı Filtre:</span>
                <button
                  type="button"
                  onClick={() => setFreeShippingOnly((v) => !v)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all filter-pill-neon ${
                    freeShippingOnly
                      ? "bg-[#201f22] text-emerald-400 border-emerald-500/60 filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  <span>Kargo Bedava</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInstallmentOnly((v) => !v)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all filter-pill-neon ${
                    installmentOnly
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-[#2997ff] border-[#2997ff]/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">credit_card</span>
                  <span>Peşin Fiyatına Taksit</span>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500">Sırala:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="appearance-none bg-[#18181b] border border-zinc-700 text-zinc-200 text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-[#2997ff] font-medium cursor-pointer"
                  >
                    <option value="popular">En Popüler</option>
                    <option value="price-asc">En Düşük Fiyat</option>
                    <option value="price-drop">En Yüksek İndirim</option>
                    <option value="price-desc">Fiyatı Azalan</option>
                    <option value="rating">En Yeni Çıkanlar</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-[16px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-zinc-700 rounded-xl bg-[#18181b] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg tactile-bounce ${
                    viewMode === "grid"
                      ? "bg-[#201f22] text-[#2997ff] shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 transition-colors"
                  }`}
                  title="Geniş Izgara (Bento 4'lü)"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg tactile-bounce ${
                    viewMode === "list"
                      ? "bg-[#201f22] text-[#2997ff] shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 transition-colors"
                  }`}
                  title="Kompakt Liste Görünümü"
                >
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Marka Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3.5 pb-1">
            <button
              type="button"
              onClick={() => {
                setSelectedBrands([]);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 filter-pill-neon transition-all shrink-0 ${
                selectedBrands.length === 0
                  ? "bg-[#2997ff] text-white shadow-md shadow-[#2997ff]/30 filter-pill-active"
                  : "bg-[#18181b]/90 hover:bg-[#201f22] text-zinc-300 hover:text-white border border-zinc-700/80"
              }`}
            >
              <span>Tüm Markalar</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedBrands.length === 0 ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {initialPhones.length}
              </span>
            </button>

            {brandPills.map((b) => {
              const active = selectedBrands.includes(b.name);
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => toggleBrand(b.name)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 filter-pill-neon transition-all shrink-0 ${
                    active
                      ? "bg-[#2997ff] text-white shadow-md shadow-[#2997ff]/30 filter-pill-active"
                      : "bg-[#18181b]/90 hover:bg-[#201f22] text-zinc-300 hover:text-white border border-zinc-700/80"
                  }`}
                >
                  <span>{b.name}</span>
                  <span className={`text-[11px] ${active ? "text-white/80" : "text-zinc-500"}`}>
                    {b.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Main Catalogue Layout ── */}
        <main className="max-w-[1880px] mx-auto px-4 lg:px-6 pb-16 pt-2 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Filtre Sidebar */}
            <aside className="lg:col-span-3 xl:col-span-2 bg-[#131315]/90 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-4 shadow-2xl space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-700/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2997ff] text-[20px]">tune</span>
                  <h2 className="font-extrabold text-white text-xs tracking-wider uppercase">FİLTRELER</h2>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-[#2997ff] hover:text-[#1d82ea] transition-all hover:underline px-2.5 py-0.5 rounded-full hover:bg-[#2997ff]/10 tactile-bounce"
                >
                  Sıfırla
                </button>
              </div>

              {FilterControls}
            </aside>

            {/* Ürün Bölümü */}
            <section className="lg:col-span-9 xl:col-span-10">
              {sortedPhones.length === 0 ? (
                <div className="py-24 text-center text-zinc-500 bg-[#131315] rounded-2xl border border-zinc-800 p-8">
                  <span className="material-symbols-outlined text-5xl mb-3 text-zinc-600">
                    search_off
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1">Eşleşen Telefon Bulunamadı</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto mb-4">
                    Belirlediğin filtreleme kriterlerine uygun aktif model bulunamadı. Filtreleri sıfırlayarak tüm katalogu görüntüleyebilirsin.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-full bg-[#2997ff] hover:bg-[#1d8cf8] text-white text-xs font-bold transition-all shadow-md"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                  {paginatedDesktop.map((p) => (
                    <PhoneCard key={p.id} phone={p} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedDesktop.map((p) => (
                    <PhoneCard key={p.id} phone={p} variant="list" />
                  ))}
                </div>
              )}

              {/* Desktop Pagination Bar */}
              {totalPagesDesktop > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-zinc-700/60 mt-6 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span>
                      Toplam {sortedPhones.length} modelden{" "}
                      <span className="text-white font-semibold">
                        {(currentPage - 1) * ITEMS_PER_PAGE_DESKTOP + 1}-
                        {Math.min(currentPage * ITEMS_PER_PAGE_DESKTOP, sortedPhones.length)}
                      </span>{" "}
                      arası gösteriliyor
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#18181b] border border-zinc-700/80 text-zinc-300 hover:text-white disabled:text-zinc-500 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                      <span>Önceki</span>
                    </button>

                    {Array.from({ length: totalPagesDesktop }, (_, i) => i + 1)
                      .slice(
                        Math.max(0, currentPage - 3),
                        Math.min(totalPagesDesktop, currentPage + 2)
                      )
                      .map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                            currentPage === pageNum
                              ? "bg-[#2997ff] text-white shadow-sm"
                              : "bg-[#18181b] hover:bg-[#201f22] border border-zinc-700/80 text-zinc-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                    <button
                      type="button"
                      disabled={currentPage >= totalPagesDesktop}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPagesDesktop, p + 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-[#201f22] border border-zinc-700/80 text-zinc-300 hover:text-white disabled:text-zinc-500 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                    >
                      <span>Sonraki</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
