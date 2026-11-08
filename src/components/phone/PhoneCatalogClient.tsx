"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Smartphone,
  Cpu,
  Camera,
  Battery,
  Shield,
  Zap,
  Box,
  CreditCard,
  Globe,
  Search,
  Sliders,
  TrendingDown,
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

const ITEMS_PER_PAGE_DESKTOP = 12;
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

  // ── Filter Sidebar Component (Shared by Desktop & Mobile Drawer) ──
  const FilterControls = (
    <div className="space-y-4 text-xs text-zinc-300">
      {/* 1. Fiyat Aralığı */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-[#2997ff] text-[16px]">payments</span>
            <span>Fiyat Aralığı</span>
          </span>
          {openSections.price ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-2.5 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min TL"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-700 bg-[#0e0e10] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2997ff]"
              />
              <input
                type="number"
                placeholder="Max TL"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-700 bg-[#0e0e10] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2997ff]"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[11px]">
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
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    pricePreset === p.id
                      ? "bg-[#2997ff]/20 text-[#2997ff] border-[#2997ff]/60 font-semibold"
                      : "bg-[#18181b] text-zinc-400 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Marka */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-[#2997ff] text-[16px]">smartphone</span>
            <span>Marka</span>
          </span>
          {openSections.brand ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.brand && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="Marka ara..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-700 bg-[#0e0e10] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2997ff]"
            />

            <div className="space-y-1 pt-1 max-h-48 overflow-y-auto no-scrollbar">
              {filteredSidebarBrands.map((b) => {
                const isChecked = selectedBrands.some(
                  (sb) => sb.toLowerCase() === b.name.toLowerCase()
                );
                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => toggleBrand(b.name)}
                    className="w-full flex items-center justify-between py-1 px-1 rounded-md cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-[#2997ff] border-[#2997ff] text-white"
                            : "bg-[#0e0e10] border-zinc-700 group-hover:border-zinc-500"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span
                        className={`text-xs ${
                          isChecked
                            ? "text-white font-semibold"
                            : "text-zinc-300 group-hover:text-white"
                        }`}
                      >
                        {b.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {b.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Dahili Depolama */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("storage")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-amber-400 text-[16px]">inventory_2</span>
            <span>Dahili Depolama</span>
          </span>
          {openSections.storage ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.storage && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[128, 256, 512, 1024].map((st) => {
              const isSelected = selectedStorages.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleStorage(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                    isSelected
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 shadow-sm filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {st === 1024 ? "1 TB" : `${st} GB`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Bellek (RAM) */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("ram")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-purple-400 text-[16px]">memory</span>
            <span>Bellek (RAM)</span>
          </span>
          {openSections.ram ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.ram && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[8, 12, 16, 24].map((ram) => {
              const isSelected = selectedRAMs.includes(ram);
              return (
                <button
                  key={ram}
                  type="button"
                  onClick={() => toggleRAM(ram)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                    isSelected
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 shadow-sm filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {ram} GB
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Kamera */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("camera")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-rose-400 text-[16px]">photo_camera</span>
            <span>Kamera</span>
          </span>
          {openSections.camera ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.camera && (
          <div className="mt-2 space-y-1.5">
            {[
              { val: 0, label: "Tümü" },
              { val: 50, label: "50 MP ve Üzeri" },
              { val: 200, label: "200 MP Zirve" },
            ].map((c) => {
              const isSelected = minCamera === c.val;
              return (
                <button
                  key={c.val}
                  type="button"
                  onClick={() => setMinCamera(c.val)}
                  className="w-full flex items-center gap-2 py-1 text-left group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? "border-rose-500 bg-rose-500/20"
                        : "border-zinc-700 bg-[#0e0e10]"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </span>
                  <span
                    className={`text-xs ${
                      isSelected
                        ? "text-white font-semibold"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Ekran & Hz */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("screen")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-cyan-400 text-[16px]">phone_android</span>
            <span>Ekran & Hz</span>
          </span>
          {openSections.screen ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.screen && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[60, 120, 144].map((hz) => {
              const isSelected = selectedScreenHz.includes(hz);
              return (
                <button
                  key={hz}
                  type="button"
                  onClick={() => toggleScreenHz(hz)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                    isSelected
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 shadow-sm filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {hz === 144 ? "144 Hz+" : `${hz} Hz`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Batarya */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("battery")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">battery_charging_full</span>
            <span>Batarya</span>
          </span>
          {openSections.battery ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.battery && (
          <div className="mt-2 space-y-1.5">
            {[
              { val: 0, label: "Tümü" },
              { val: 5000, label: "5.000 mAh+" },
              { val: 5500, label: "5.500 mAh+" },
            ].map((b) => {
              const isSelected = minBattery === b.val;
              return (
                <button
                  key={b.val}
                  type="button"
                  onClick={() => setMinBattery(b.val)}
                  className="w-full flex items-center gap-2 py-1 text-left group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/20"
                        : "border-zinc-700 bg-[#0e0e10]"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </span>
                  <span
                    className={`text-xs ${
                      isSelected
                        ? "text-emerald-400 font-semibold"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    {b.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. Özellikler */}
      <div className="border-b border-zinc-800 pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("features")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-purple-400 text-[16px]">security</span>
            <span>Özellikler</span>
          </span>
          {openSections.features ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.features && (
          <div className="mt-2 space-y-1.5">
            {[
              { id: "fiveG", label: "5G Şebeke" },
              { id: "nfc", label: "NFC Ödeme" },
              { id: "wirelessCharging", label: "Kablosuz Şarj" },
              { id: "ip68", label: "IP68 Su Geçirmez" },
            ].map((f) => {
              const featKey = f.id as keyof typeof features;
              const isChecked = features[featKey];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFeature(featKey)}
                  className="w-full flex items-center gap-2.5 py-1 text-left group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isChecked
                        ? "bg-[#2997ff] border-[#2997ff] text-white"
                        : "bg-[#0e0e10] border-zinc-700 group-hover:border-zinc-500"
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span
                    className={`text-xs ${
                      isChecked
                        ? "text-white font-medium"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 9. İşletim Sistemi */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("os")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-[#2997ff] text-[16px]">language</span>
            <span>İşletim Sistemi</span>
          </span>
          {openSections.os ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {openSections.os && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["Android", "iOS"].map((os) => {
              const isChecked = selectedOS.includes(os);
              return (
                <button
                  key={os}
                  type="button"
                  onClick={() => toggleOS(os)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    isChecked
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 shadow-sm filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  {os}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#0e0e10] text-[#e5e1e4] min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE EXPERIENCE (<lg) - MATCHING MOBIL.ZIP (OBSIDIAN PRECISION) ── */}
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
      {/* ── DESKTOP EXPERIENCE (>=lg) - MATCHING TELEFONLAR.ZIP ── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block relative py-6">
        {/* Ambient Dot Grid & Lighting */}
        <div className="ambient-dot-grid absolute inset-0 pointer-events-none opacity-50" />
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#2997ff]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-8 space-y-6">
          {/* Sub-Header Control Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            {/* Title & Live Model Count */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Tüm Telefonlar
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#201f22] text-[#2997ff] border border-[#2997ff]/40 shadow-sm">
                {sortedPhones.length} Model Listeleniyor
              </span>
              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#47e266] animate-pulse" />
                16 Mağaza Taranıyor
              </span>
            </div>

            {/* Quick Benefits, Sort & View Mode */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFreeShippingOnly((v) => !v)}
                  className={`filter-pill-neon px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                    freeShippingOnly
                      ? "bg-[#201f22] text-[#47e266] border-[#47e266]/60 filter-pill-active"
                      : "bg-[#18181b] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] text-[#47e266]">local_shipping</span>
                  <span>Kargo Bedava</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInstallmentOnly((v) => !v)}
                  className={`filter-pill-neon px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                    installmentOnly
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff]/60 filter-pill-active"
                      : "bg-[#18181b] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] text-[#2997ff]">credit_card</span>
                  <span>Peşin Fiyatına Taksit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDipFiyatOnly((v) => !v)}
                  className={`filter-pill-neon px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                    dipFiyatOnly
                      ? "bg-[#201f22] text-rose-400 border-rose-500/60 filter-pill-active"
                      : "bg-[#18181b] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] text-rose-400">trending_down</span>
                  <span>Tarihi Dip Fiyat</span>
                </button>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                <span className="text-xs text-zinc-400 font-medium">Sırala:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="bg-[#18181b] hover:bg-[#201f22] text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-zinc-700/80 outline-none cursor-pointer"
                >
                  <option value="popular">En Popüler</option>
                  <option value="price-asc">En Düşük Fiyat</option>
                  <option value="price-desc">En Yüksek Fiyat</option>
                  <option value="rating">Kullanıcı Puanı</option>
                  <option value="price-drop">İndirim Oranı</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-[#18181b] p-1 rounded-xl border border-zinc-700/80">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#2997ff] text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title="Grid Görünüm"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-[#2997ff] text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title="Liste Görünüm"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Marka Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => {
                setSelectedBrands([]);
                setCurrentPage(1);
              }}
              className={`filter-pill-neon px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedBrands.length === 0
                  ? "bg-[#201f22] text-[#2997ff] border-[#2997ff] filter-pill-active"
                  : "bg-[#18181b] text-zinc-300 border-zinc-700/80 hover:text-white"
              }`}
            >
              Tüm Markalar ({initialPhones.length})
            </button>
            {brandPills.map((b) => {
              const active = selectedBrands.includes(b.name);
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => toggleBrand(b.name)}
                  className={`filter-pill-neon px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                    active
                      ? "bg-[#201f22] text-[#2997ff] border-[#2997ff] filter-pill-active"
                      : "bg-[#18181b] text-zinc-300 border-zinc-700/80 hover:text-white"
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">({b.count})</span>
                </button>
              );
            })}
          </div>

          {/* Main Catalogue Layout (Sidebar + Grid) */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Filtre Sidebar */}
            <aside className="col-span-3 bg-[#131315]/95 backdrop-blur-md rounded-2xl border border-zinc-700/80 p-5 sticky top-20 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2997ff] text-[18px]">tune</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Filtreler</span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] text-[#2997ff] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sıfırla</span>
                </button>
              </div>

              {FilterControls}
            </aside>

            {/* Ürün Grid */}
            <main className="col-span-9 space-y-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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

              {/* Desktop Pagination */}
              {totalPagesDesktop > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-zinc-800 text-xs">
                  <div className="text-zinc-400">
                    Toplam <strong className="text-white">{sortedPhones.length}</strong> modelden{" "}
                    <strong>{(currentPage - 1) * ITEMS_PER_PAGE_DESKTOP + 1}</strong> -{" "}
                    <strong>
                      {Math.min(currentPage * ITEMS_PER_PAGE_DESKTOP, sortedPhones.length)}
                    </strong>{" "}
                    arası gösteriliyor
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border border-zinc-700/80 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
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
                          className={`w-8 h-8 rounded-xl font-bold transition-all ${
                            currentPage === pageNum
                              ? "bg-[#2997ff] text-white shadow-[0_0_12px_rgba(41,151,255,0.4)]"
                              : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border border-zinc-700/80"
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
                      className="px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-[#201f22] text-zinc-300 border border-zinc-700/80 disabled:opacity-40 flex items-center gap-1 transition-colors"
                    >
                      <span>Sonraki</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
