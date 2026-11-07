"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  Smartphone,
  Cpu,
  Camera,
  Battery,
  Shield,
  Zap,
  TrendingDown,
  Wifi,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";
import type { Phone, Brand, SortOption } from "@/types";
import PhoneCard from "./PhoneCard";
import BrandLogo from "@/components/common/BrandLogo";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface Props {
  initialPhones: Phone[];
  brands: Brand[];
  initialBrand?: string;
  initialQuery?: string;
}

export default function PhoneCatalogClient({
  initialPhones,
  brands,
  initialBrand,
  initialQuery,
}: Props) {
  const { theme, setTheme } = useApp();
  const isDark = theme === "dark";

  // --- Filter States ---
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
  const [screenSizeCategory, setScreenSizeCategory] = useState<string>("all");
  const [minBattery, setMinBattery] = useState<number>(0);
  const [minCharging, setMinCharging] = useState<number>(0);
  const [features, setFeatures] = useState<{
    fiveG: boolean;
    nfc: boolean;
    ois: boolean;
    ip68: boolean;
    wirelessCharging: boolean;
  }>({
    fiveG: false,
    nfc: false,
    ois: false,
    ip68: false,
    wirelessCharging: false,
  });
  const [selectedOS, setSelectedOS] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mobile drawer open state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Brand search filter in sidebar
  const [brandSearch, setBrandSearch] = useState("");

  // Section collapse states
  const [openSections, setOpenSections] = useState({
    brand: true,
    price: true,
    ram: true,
    storage: true,
    camera: true,
    screen: true,
    battery: true,
    features: true,
    os: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Quick Price Presets
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
  };

  // Toggle helpers
  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const toggleRAM = (ram: number) => {
    setSelectedRAMs((prev) =>
      prev.includes(ram) ? prev.filter((x) => x !== ram) : [...prev, ram]
    );
  };

  const toggleStorage = (st: number) => {
    setSelectedStorages((prev) =>
      prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
    );
  };

  const toggleScreenHz = (hz: number) => {
    setSelectedScreenHz((prev) =>
      prev.includes(hz) ? prev.filter((x) => x !== hz) : [...prev, hz]
    );
  };

  const toggleOS = (os: string) => {
    setSelectedOS((prev) =>
      prev.includes(os) ? prev.filter((x) => x !== os) : [...prev, os]
    );
  };

  const toggleFeature = (feat: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [feat]: !prev[feat] }));
  };

  // Reset All Filters
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
    setScreenSizeCategory("all");
    setMinBattery(0);
    setMinCharging(0);
    setFeatures({
      fiveG: false,
      nfc: false,
      ois: false,
      ip68: false,
      wirelessCharging: false,
    });
    setSelectedOS([]);
    setSort("newest");
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (minPrice || maxPrice) count++;
    if (selectedRAMs.length > 0) count += selectedRAMs.length;
    if (selectedStorages.length > 0) count += selectedStorages.length;
    if (minCamera > 0) count++;
    if (selectedScreenHz.length > 0) count += selectedScreenHz.length;
    if (screenSizeCategory !== "all") count++;
    if (minBattery > 0) count++;
    if (minCharging > 0) count++;
    if (features.fiveG) count++;
    if (features.nfc) count++;
    if (features.ois) count++;
    if (features.ip68) count++;
    if (features.wirelessCharging) count++;
    if (selectedOS.length > 0) count += selectedOS.length;
    return count;
  }, [
    search,
    selectedBrands,
    minPrice,
    maxPrice,
    selectedRAMs,
    selectedStorages,
    minCamera,
    selectedScreenHz,
    screenSizeCategory,
    minBattery,
    minCharging,
    features,
    selectedOS,
  ]);

  // Model count per brand (case-insensitive matching)
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialPhones.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
      counts[p.brand.toLowerCase()] = (counts[p.brand.toLowerCase()] || 0) + 1;
    });
    return counts;
  }, [initialPhones]);

  // Filtered Brands for sidebar search
  const filteredBrandsList = useMemo(() => {
    const allNames = Array.from(
      new Set([
        ...(brands.length > 0 ? brands.map((b) => b.name) : []),
        ...initialPhones.map((p) => p.brand),
      ])
    );
    if (!brandSearch.trim()) return allNames;
    return allNames.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));
  }, [brands, initialPhones, brandSearch]);

  // Filtering Logic
  const filteredPhones = useMemo(() => {
    return initialPhones.filter((phone) => {
      // Search text
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = phone.name.toLowerCase().includes(q);
        const matchesBrand = phone.brand.toLowerCase().includes(q);
        const matchesChip = phone.specs?.performance?.chipset?.toLowerCase().includes(q);
        const matchesTags = phone.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesChip && !matchesTags) {
          return false;
        }
      }

      // Brand
      if (selectedBrands.length > 0) {
        const lowerSelected = selectedBrands.map((b) => b.toLowerCase());
        if (!lowerSelected.includes(phone.brand.toLowerCase())) {
          return false;
        }
      }

      // Price range
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;
      if (phone.lowestPrice < minP || phone.lowestPrice > maxP) {
        return false;
      }

      // RAM
      if (selectedRAMs.length > 0) {
        const ram = phone.specs?.performance?.ram;
        if (!ram || !selectedRAMs.includes(ram)) {
          return false;
        }
      }

      // Storage
      if (selectedStorages.length > 0) {
        const storage = phone.specs?.performance?.storage;
        if (!storage || !selectedStorages.includes(storage)) {
          return false;
        }
      }

      // Camera MP
      if (minCamera > 0) {
        const mp = phone.specs?.camera?.mainCamera?.megapixels || 0;
        if (mp < minCamera) {
          return false;
        }
      }

      // Screen Hz
      if (selectedScreenHz.length > 0) {
        const hz = phone.specs?.display?.refreshRate;
        if (!hz || !selectedScreenHz.includes(hz)) {
          return false;
        }
      }

      // Screen size category
      if (screenSizeCategory !== "all") {
        const sz = phone.specs?.display?.size || 0;
        if (screenSizeCategory === "compact" && sz >= 6.3) return false;
        if (screenSizeCategory === "standard" && (sz < 6.3 || sz > 6.6)) return false;
        if (screenSizeCategory === "large" && sz <= 6.6) return false;
      }

      // Battery
      if (minBattery > 0) {
        const cap = phone.specs?.battery?.capacity || 0;
        if (cap < minBattery) return false;
      }

      // Charging speed
      if (minCharging > 0) {
        const watt = phone.specs?.battery?.wiredCharging || 0;
        if (watt < minCharging) return false;
      }

      // Features
      if (features.fiveG && !phone.specs?.connectivity?.fiveG) return false;
      if (features.nfc && !phone.specs?.connectivity?.nfc) return false;
      if (features.ois && !phone.specs?.camera?.mainCamera?.ois) return false;
      if (features.ip68) {
        const wr = phone.specs?.design?.waterResistance?.toLowerCase() || "";
        if (!wr.includes("ip68")) return false;
      }
      if (features.wirelessCharging) {
        const wc = phone.specs?.battery?.wirelessCharging || 0;
        if (wc <= 0) return false;
      }

      // OS
      if (selectedOS.length > 0) {
        const os = phone.specs?.software?.os?.toLowerCase() || "";
        const matchesOS = selectedOS.some((o) => os.includes(o.toLowerCase()));
        if (!matchesOS) return false;
      }

      return true;
    });
  }, [
    initialPhones,
    search,
    selectedBrands,
    minPrice,
    maxPrice,
    selectedRAMs,
    selectedStorages,
    minCamera,
    selectedScreenHz,
    screenSizeCategory,
    minBattery,
    minCharging,
    features,
    selectedOS,
  ]);

  // Sort
  const sortedPhones = useMemo(() => {
    const list = [...filteredPhones];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.lowestPrice - b.lowestPrice);
      case "price-desc":
        return list.sort((a, b) => b.lowestPrice - a.lowestPrice);
      case "rating":
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "price-drop":
        return list.sort(
          (a, b) => (b.priceDropPercent ?? 0) - (a.priceDropPercent ?? 0)
        );
      case "newest":
      default:
        return list.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
    }
  }, [filteredPhones, sort]);

  // Sidebar Filter Form Content (Reused for Desktop & Mobile Drawer)
  const FilterControls = (
    <div className={`space-y-5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
      {/* 1. Brand Filter */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Smartphone className="w-4 h-4 text-sky-500" />
            Marka
            {selectedBrands.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-bold">
                {selectedBrands.length}
              </span>
            )}
          </span>
          {openSections.brand ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.brand && (
          <div className="mt-3 space-y-2">
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Marka ara..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:bg-slate-800"
                    : "bg-slate-100 border-slate-200 text-slate-900 focus:bg-white"
                }`}
              />
            </div>

            <div className="max-h-52 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
              {filteredBrandsList.map((brandName) => {
                const count = brandCounts[brandName] || 0;
                const isChecked = selectedBrands.includes(brandName);
                return (
                  <label
                    key={brandName}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                      isChecked
                        ? isDark
                          ? "bg-sky-500/20 text-sky-200 font-bold border border-sky-500/40"
                          : "bg-sky-50 text-sky-900 font-bold border border-sky-200"
                        : isDark
                          ? "hover:bg-slate-800 text-slate-300"
                          : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrand(brandName)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                      />
                      <span>{brandName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Price Range */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <span>₺</span> Fiyat Aralığı
          </span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3">
            {/* Quick Segment Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "all", label: "Tüm Fiyatlar" },
                { id: "budget", label: "< 15.000 ₺" },
                { id: "mid", label: "15k - 30k ₺" },
                { id: "upper_mid", label: "30k - 50k ₺" },
                { id: "flagship", label: "50.000 ₺ +" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPricePreset(p.id)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-center border ${
                    pricePreset === p.id
                      ? "bg-sky-500 text-white border-sky-400 shadow-sm"
                      : isDark
                        ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Min/Max Inputs */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₺"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPricePreset("custom");
                }}
                className={`w-full px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 font-semibold ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400"
                    : "border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                }`}
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max ₺"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPricePreset("custom");
                }}
                className={`w-full px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 font-semibold ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400"
                    : "border-slate-200 bg-slate-50 focus:bg-white text-slate-900"
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Storage (Hafıza) */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("storage")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Cpu className="w-4 h-4 text-indigo-500" />
            Dahili Hafıza
          </span>
          {openSections.storage ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.storage && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[64, 128, 256, 512, 1024].map((st) => {
              const label = st === 1024 ? "1 TB" : `${st} GB`;
              const isSelected = selectedStorages.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleStorage(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? "bg-sky-500 text-white border-sky-400 shadow-sm"
                      : isDark
                        ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RAM */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("ram")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            RAM Bellek
          </span>
          {openSections.ram ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.ram && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[4, 6, 8, 12, 16, 24].map((ram) => {
              const isSelected = selectedRAMs.includes(ram);
              return (
                <button
                  key={ram}
                  type="button"
                  onClick={() => toggleRAM(ram)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                      : isDark
                        ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {ram} GB
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Camera (MP) */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("camera")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Camera className="w-4 h-4 text-rose-500" />
            Ana Kamera
          </span>
          {openSections.camera ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.camera && (
          <div className="mt-3 space-y-1.5">
            {[
              { val: 0, label: "Tüm Çözünürlükler" },
              { val: 48, label: "48 MP ve Üzeri" },
              { val: 50, label: "50 MP ve Üzeri" },
              { val: 108, label: "108 MP ve Üzeri" },
              { val: 200, label: "200 MP Zirve Sensör" },
            ].map((c) => (
              <label
                key={c.val}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                  minCamera === c.val
                    ? isDark
                      ? "bg-rose-500/20 text-rose-200 font-bold border border-rose-500/40"
                      : "bg-rose-50 text-rose-900 font-bold border border-rose-200"
                    : isDark
                      ? "hover:bg-slate-800 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="camera_filter"
                  checked={minCamera === c.val}
                  onChange={() => setMinCamera(c.val)}
                  className="text-rose-500 focus:ring-rose-400"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Screen Refresh & Size */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("screen")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Smartphone className="w-4 h-4 text-cyan-500" />
            Ekran & Yenileme Hızı
          </span>
          {openSections.screen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.screen && (
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Yenileme Hızı (Hz)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[60, 90, 120, 144].map((hz) => {
                  const isChecked = selectedScreenHz.includes(hz);
                  return (
                    <button
                      key={hz}
                      type="button"
                      onClick={() => toggleScreenHz(hz)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isChecked
                          ? "bg-cyan-600 text-white border-cyan-500 shadow-sm"
                          : isDark
                            ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {hz} Hz
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Ekran Boyutu
              </div>
              <div className="space-y-1">
                {[
                  { id: "all", label: "Tüm Boyutlar" },
                  { id: "compact", label: 'Kompakt (< 6.3")' },
                  { id: "standard", label: 'Standart (6.3" - 6.6")' },
                  { id: "large", label: 'Büyük Ekran (6.7"+)' },
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                      screenSizeCategory === s.id
                        ? isDark
                          ? "bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/40"
                          : "bg-cyan-50 text-cyan-900 font-bold border border-cyan-200"
                        : isDark
                          ? "hover:bg-slate-800 text-slate-300"
                          : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="screen_size_cat"
                      checked={screenSizeCategory === s.id}
                      onChange={() => setScreenSizeCategory(s.id)}
                      className="text-cyan-600 focus:ring-cyan-400"
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. Battery & Charging */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("battery")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Battery className="w-4 h-4 text-emerald-500" />
            Batarya & Hızlı Şarj
          </span>
          {openSections.battery ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.battery && (
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Pil Kapasitesi
              </div>
              <div className="space-y-1">
                {[
                  { val: 0, label: "Tümü" },
                  { val: 4500, label: "4.500 mAh ve Üzeri" },
                  { val: 5000, label: "5.000 mAh ve Üzeri" },
                  { val: 5400, label: "5.400 mAh Zirve Pil" },
                ].map((b) => (
                  <label
                    key={b.val}
                    className={`flex items-center gap-2 px-2.5 py-1 rounded-xl cursor-pointer ${
                      minBattery === b.val
                        ? isDark
                          ? "font-bold text-emerald-400"
                          : "font-bold text-emerald-700"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="battery_cap"
                      checked={minBattery === b.val}
                      onChange={() => setMinBattery(b.val)}
                      className="text-emerald-500 focus:ring-emerald-400"
                    />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Kablolu Hızlı Şarj
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { val: 0, label: "Tümü" },
                  { val: 25, label: "25W+" },
                  { val: 45, label: "45W+" },
                  { val: 67, label: "67W+" },
                  { val: 100, label: "100W+" },
                ].map((w) => (
                  <button
                    key={w.val}
                    type="button"
                    onClick={() => setMinCharging(w.val)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                      minCharging === w.val
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                        : isDark
                          ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8. Advanced Hardware Features (OIS, 5G, NFC, IP68, etc.) */}
      <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={() => toggleSection("features")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Shield className="w-4 h-4 text-purple-500" />
            Öne Çıkan Özellikler
          </span>
          {openSections.features ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.features && (
          <div className="mt-3 space-y-2">
            {[
              { id: "fiveG", label: "5G Şebeke Desteği" },
              { id: "nfc", label: "NFC (Temassız Ödeme)" },
              { id: "ois", label: "OIS (Optik Kamera Sabitleyici)" },
              { id: "ip68", label: "IP68 Suya / Toza Dayanıklılık" },
              { id: "wirelessCharging", label: "Kablosuz Şarj Özelliği" },
            ].map((f) => {
              const featKey = f.id as keyof typeof features;
              const isChecked = features[featKey];
              return (
                <label
                  key={f.id}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                    isChecked
                      ? isDark
                        ? "bg-purple-500/20 text-purple-200 font-bold border border-purple-500/40"
                        : "bg-purple-50 text-purple-900 font-bold border border-purple-200"
                      : isDark
                        ? "hover:bg-slate-800 text-slate-300"
                        : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFeature(featKey)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-400"
                  />
                  <span>{f.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 9. Operating System (OS) */}
      <div className="pb-2">
        <button
          type="button"
          onClick={() => toggleSection("os")}
          className={`w-full flex items-center justify-between font-bold py-1 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5 text-sm">
            <Cpu className="w-4 h-4 text-slate-500" />
            İşletim Sistemi
          </span>
          {openSections.os ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.os && (
          <div className="mt-3 space-y-1.5">
            {["Android", "iOS"].map((os) => {
              const isChecked = selectedOS.includes(os);
              return (
                <label
                  key={os}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                    isChecked
                      ? isDark
                        ? "bg-sky-500/20 text-sky-200 font-bold border border-sky-500/40"
                        : "bg-sky-50 text-sky-900 font-bold border border-sky-200"
                      : isDark
                        ? "hover:bg-slate-800 text-slate-300"
                        : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOS(os)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                  />
                  <span>{os}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={resetFilters}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-colors ${
              isDark
                ? "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/30"
                : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Filtreleri Temizle ({activeFiltersCount})</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-sky-500 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className={`font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Akıllı Telefonlar
          </span>
        </div>
      </nav>

      {/* Top Banner & Search - Sleek, Compact, Balanced 3-Zone Card */}
      <div className="mb-4 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        {/* Decorative ambient subtle glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Zone 1: Title, Live Status & Subtitle */}
          <div className="shrink-0 max-w-md">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/15 px-2.5 py-0.5 rounded-full mb-1.5 border border-sky-400/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Canlı Karşılaştırma & Fiyat Takip</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Tüm Akıllı Telefonlar</span>
              <span className="text-xs font-bold text-sky-300 bg-sky-900/60 border border-sky-700/50 px-2 py-0.5 rounded-full">
                {initialPhones.length} Model
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>16 doğrulanmış mağaza</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Anlık taranan fiyatlar</span>
              <span>•</span>
              <span>Donanım puanları</span>
            </p>
          </div>

          {/* Zone 2: Sharp, High-Visibility Search Box with Instant Keywords */}
          <div className="flex-1 max-w-xl mx-auto lg:mx-4 w-full">
            <div className="relative">
              <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Model, marka veya işlemci ara (örn: iPhone 16, Dimensity, 120W)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-md border focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  isDark
                    ? "bg-slate-800/95 text-slate-100 placeholder-slate-400 border-slate-700"
                    : "bg-white text-slate-900 placeholder-slate-400 border-slate-200"
                }`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-700/50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Popular Quick Search Keywords */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400">
              <span className="text-slate-400 font-medium">Popüler:</span>
              {[
                "iPhone 16 Pro Max",
                "Galaxy S25 Ultra",
                "Xiaomi 15",
                "Snapdragon 8 Elite",
                "120W",
              ].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setSearch(keyword)}
                  className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors text-[10.5px]"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Zone 3: Trust & Stats Badges */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                16
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white">Canlı Mağaza</div>
                <div className="text-slate-400 text-[10px]">Doğrulanmış Fiyat</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white">Fiyat Takibi</div>
                <div className="text-slate-400 text-[10px]">Son 6 Ay Geçmişi</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white">%100 Orijinal</div>
                <div className="text-slate-400 text-[10px]">Resmi Distribütör</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Brand Filter Strip (One-click brand switcher) */}
      <div
        className={`mb-4 rounded-2xl border p-2 sm:p-2.5 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200/90"
        }`}
      >
        <button
          type="button"
          onClick={() => setSelectedBrands([])}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedBrands.length === 0
              ? isDark
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-slate-900 text-white shadow-sm"
              : isDark
                ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Tüm Markalar ({initialPhones.length})
        </button>

        {(brands.length > 0 ? brands.map((b) => b.name) : ["Apple", "Samsung", "Xiaomi", "Redmi", "POCO", "HONOR", "Huawei", "OPPO", "vivo", "realme", "OnePlus", "Google", "Motorola", "Nothing", "CMF", "Sony", "ASUS", "Lenovo", "ZTE", "Nubia", "REDMAGIC", "Tecno", "Infinix", "TCL", "Meizu", "Sharp", "Fairphone", "HMD", "Nokia", "General Mobile", "Casper", "Reeder", "Omix"]).map((bName) => {
          const isSelected = selectedBrands.some((s) => s.toLowerCase() === bName.toLowerCase());
          const count = brandCounts[bName] || brandCounts[bName.toLowerCase()] || 0;
          return (
            <button
              key={bName}
              type="button"
              onClick={() => toggleBrand(bName)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? "bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/50"
                  : isDark
                    ? "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
              }`}
            >
              <span>{bName}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : isDark
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout: Left Sidebar Filters + Right Products Grid */}
      <div className="flex flex-row gap-3 sm:gap-4 items-start w-full">
        {/* 1. LEFT SIDEBAR: FILTERS PANEL (Always on the Left, Independent Scroll) */}
        <aside
          className={`w-60 sm:w-64 lg:w-72 shrink-0 rounded-2xl border shadow-sm sticky top-4 h-[calc(100vh-2rem)] flex flex-col overflow-hidden z-10 ${
            isDark
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200/90"
          }`}
        >
          <div
            className={`flex items-center justify-between p-3.5 pb-2.5 border-b shrink-0 ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100"
            }`}
          >
            <div
              className={`flex items-center gap-2 font-black text-sm ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
              <span>Detaylı Filtreler</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-400 hover:underline"
              >
                Temizle ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 pr-2 space-y-4 scrollbar-thin">
            {FilterControls}
          </div>
        </aside>

        {/* 2. RIGHT PRODUCTS MAIN AREA: Sayfanın sığdığı kadar yan yana telefon (Minimum 5 adet) */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Controls Bar: Count, Theme Switcher, Sort & View Mode */}
          <div
            className={`rounded-2xl border p-4 shadow-sm space-y-3 ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200/90"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Toplam{" "}
                <strong
                  className={`font-extrabold text-sm ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {sortedPhones.length}
                </strong>{" "}
                telefon listeleniyor
              </div>

              <div className="flex items-center gap-3 flex-wrap self-end sm:self-auto">
                {/* Inline Siyah Mod / Beyaz Mod Quick Toggle right in the Catalog Bar */}
                <div
                  className={`flex items-center p-1 rounded-xl border ${
                    isDark
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isDark
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Siyah Mod</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isDark
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Beyaz Mod</span>
                  </button>
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold hidden sm:inline">Sıralama:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                      isDark
                        ? "border-slate-700 bg-slate-800 text-slate-100"
                        : "border-slate-200 bg-slate-50 text-slate-800"
                    }`}
                  >
                    <option value="newest">En Yeni Çıkanlar</option>
                    <option value="price-asc">En Düşük Fiyat (Artan)</option>
                    <option value="price-desc">En Yüksek Fiyat (Azalan)</option>
                    <option value="rating">En Yüksek Uzman Puanı</option>
                    <option value="price-drop">En Çok İndirime Girenler</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div
                  className={`flex items-center p-1 rounded-xl ${
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? isDark
                          ? "bg-slate-950 text-white shadow-sm"
                          : "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Izgara Görünümü (5'li)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? isDark
                          ? "bg-slate-950 text-white shadow-sm"
                          : "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Liste Görünümü"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Pills */}
            {activeFiltersCount > 0 && (
              <div
                className={`pt-3 border-t flex flex-wrap items-center gap-2 ${
                  isDark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <span className="text-[11px] font-bold text-slate-400 mr-1">Seçili Filtreler:</span>
                
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-semibold">
                    Arama: &quot;{search}&quot;
                    <button type="button" onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {selectedBrands.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-semibold">
                    {b}
                    <button type="button" onClick={() => toggleBrand(b)}><X className="w-3 h-3" /></button>
                  </span>
                ))}

                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    {minPrice ? `${formatPrice(Number(minPrice))}` : "0 ₺"} - {maxPrice ? `${formatPrice(Number(maxPrice))}` : "Limitsiz"}
                    <button type="button" onClick={() => { setMinPrice(""); setMaxPrice(""); setPricePreset("all"); }}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {selectedRAMs.map((ram) => (
                  <span key={ram} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                    {ram} GB RAM
                    <button type="button" onClick={() => toggleRAM(ram)}><X className="w-3 h-3" /></button>
                  </span>
                ))}

                {selectedStorages.map((st) => (
                  <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                    {st === 1024 ? "1 TB" : `${st} GB`}
                    <button type="button" onClick={() => toggleStorage(st)}><X className="w-3 h-3" /></button>
                  </span>
                ))}

                {minCamera > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                    {minCamera}+ MP Kamera
                    <button type="button" onClick={() => setMinCamera(0)}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {features.fiveG && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                    5G <button type="button" onClick={() => toggleFeature("fiveG")}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {features.nfc && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                    NFC <button type="button" onClick={() => toggleFeature("nfc")}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {features.ois && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                    OIS Sabitleyici <button type="button" onClick={() => toggleFeature("ois")}><X className="w-3 h-3" /></button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-rose-500 hover:underline ml-1"
                >
                  Tümünü Temizle
                </button>
              </div>
            )}
          </div>

          {/* Phone Cards Grid: Sayfanın sığdığı kadar yan yana telefon (Minimum 5 adet) */}
          {sortedPhones.length > 0 ? (
            viewMode === "grid" ? (
              <div 
                className="grid gap-2.5 w-full"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                  gap: '10px'
                }}
              >
                {sortedPhones.map((phone) => (
                  <PhoneCard key={phone.id} phone={phone} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedPhones.map((phone) => (
                  <PhoneCard key={phone.id} phone={phone} variant="list" />
                ))}
              </div>
            )
          ) : (
            <div
              className={`rounded-3xl border p-12 text-center shadow-sm ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-100"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 ${
                  isDark ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <Search className="w-8 h-8" />
              </div>
              <h3 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                Aramanıza Uygun Telefon Bulunamadı
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                Seçtiğiniz filtre kombinasyonuna uyan model bulunamadı. Lütfen filtrelerinizi gevşetip tekrar deneyin.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
