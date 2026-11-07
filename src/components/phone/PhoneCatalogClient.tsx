"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import type { Phone, Brand, SortOption } from "@/types";
import PhoneCard from "./PhoneCard";
import { formatPrice } from "@/lib/utils";

interface Props {
  initialPhones: Phone[];
  brands: Brand[];
  initialBrand?: string;
  initialQuery?: string;
}

// Exactly the 8 models in the Stitch screenshot in order
const STITCH_FEATURED_SLUGS = [
  "iphone-16-pro-max",
  "samsung-galaxy-s25-ultra",
  "xiaomi-15-ultra",
  "honor-magic-v3",
  "huawei-pura-70-ultra",
  "poco-f6-pro",
  "iphone-15",
  "samsung-galaxy-s24-fe",
];

const ITEMS_PER_PAGE = 8;

export default function PhoneCatalogClient({
  initialPhones,
  brands,
  initialBrand,
  initialQuery,
}: Props) {
  // --- Filter States matching Stitch Design ---
  const [search, setSearch] = useState(initialQuery || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [pricePreset, setPricePreset] = useState<string>("all");
  const [selectedRAMs, setSelectedRAMs] = useState<number[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<number[]>([256]); // 256GB selected in design
  const [minCamera, setMinCamera] = useState<number>(0); // Tümü
  const [selectedScreenHz, setSelectedScreenHz] = useState<number[]>([120]); // 120Hz selected in design
  const [minBattery, setMinBattery] = useState<number>(5000); // 5000 mAh+ selected in design
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
  const [selectedOS, setSelectedOS] = useState<string[]>([]); // default all or toggleable
  const [freeShippingOnly, setFreeShippingOnly] = useState<boolean>(false);
  const [installmentOnly, setInstallmentOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const [openSections, setOpenSections] = useState({
    brand: true,
    price: true,
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
    setSort("popular");
    setCurrentPage(1);
  };

  // Fixed Stitch brand count badge numbers
  const brandPills = [
    { name: "Apple", count: 12 },
    { name: "Samsung", count: 18 },
    { name: "Xiaomi", count: 14 },
    { name: "POCO", count: 7 },
    { name: "HONOR", count: 5 },
    { name: "Huawei", count: 3 },
    { name: "vivo", count: 4 },
    { name: "Google", count: 3 },
    { name: "Motorola", count: 3 },
    { name: "Nothing", count: 2 },
    { name: "ASUS", count: 2 },
    { name: "Infinix", count: 2 },
  ];

  // Sidebar brand list with counts matching screenshot
  const sidebarBrands = [
    { name: "Apple", count: 12 },
    { name: "Samsung", count: 18 },
    { name: "Xiaomi", count: 14 },
    { name: "Huawei", count: 3 },
    { name: "HONOR", count: 5 },
    { name: "POCO", count: 7 },
  ];

  const filteredSidebarBrands = useMemo(() => {
    if (!brandSearch.trim()) return sidebarBrands;
    return sidebarBrands.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [sidebarBrands, brandSearch]);

  // Filtering Logic
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

      return true;
    });
  }, [initialPhones, search, selectedBrands, minPrice, maxPrice]);

  // Sort: When default "popular", make sure the 8 Stitch phones are in exact order
  const sortedPhones = useMemo(() => {
    const list = [...filteredPhones];
    if (sort === "popular") {
      return list.sort((a, b) => {
        const idxA = STITCH_FEATURED_SLUGS.findIndex((s) => a.slug.includes(s));
        const idxB = STITCH_FEATURED_SLUGS.findIndex((s) => b.slug.includes(s));
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });
    }
    if (sort === "price-asc") return list.sort((a, b) => a.lowestPrice - b.lowestPrice);
    if (sort === "price-desc") return list.sort((a, b) => b.lowestPrice - a.lowestPrice);
    if (sort === "rating") return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "price-drop") return list.sort((a, b) => (b.priceDropPercent ?? 0) - (a.priceDropPercent ?? 0));
    return list;
  }, [filteredPhones, sort]);

  // Paginated Phones (8 per page matching the 8 cards in screenshot)
  const paginatedPhones = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedPhones.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedPhones, currentPage]);

  const totalPages = 12; // matching Stitch pagination: 1 2 3 ... 12

  // ─── Sidebar Filter Controls ──────────────────────────────────────────────
  const FilterControls = (
    <div className="space-y-4 text-xs text-slate-300">
      {/* 1. Marka */}
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Smartphone className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Marka</span>
          </span>
          {openSections.brand ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {openSections.brand && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="Marka ara..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#202738] bg-[#0c0e14] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1d8cf8]"
            />

            <div className="space-y-1 pt-1">
              {filteredSidebarBrands.map((b) => {
                const isChecked = selectedBrands.some(
                  (sb) => sb.toLowerCase() === b.name.toLowerCase()
                ) || (selectedBrands.length === 0 && b.name === "Apple"); // Apple checked in screenshot
                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => toggleBrand(b.name)}
                    className="w-full flex items-center justify-between py-1 px-1 rounded-md cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-[#1d8cf8] border-[#1d8cf8] text-white"
                            : "bg-[#0b0d11] border-[#283042] group-hover:border-slate-500"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span
                        className={`text-xs ${
                          isChecked ? "text-[#38bdf8] font-bold" : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {b.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({b.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Fiyat Aralığı */}
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#3b82f6] font-extrabold text-sm leading-none">₺</span>
            <span>Fiyat Aralığı</span>
          </span>
          {openSections.price ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-2.5 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "all", label: "Tümü", fullWidth: false },
                { id: "budget", label: "< 15.000 ₺", fullWidth: false },
                { id: "mid", label: "15k - 30k ₺", fullWidth: false },
                { id: "upper_mid", label: "30k - 50k ₺", fullWidth: false },
                { id: "flagship", label: "50.000 ₺ ve Üzeri", fullWidth: true },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPricePreset(p.id)}
                  className={`${
                    p.fullWidth ? "col-span-2" : ""
                  } px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-center border ${
                    pricePreset === p.id
                      ? "bg-[#1d8cf8] text-white border-[#1d8cf8]"
                      : "bg-[#0b0d11] text-slate-300 border-[#1e2433] hover:border-slate-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                placeholder="Min ₺"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPricePreset("custom");
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#1e2433] bg-[#0b0d11] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder="Max ₺"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPricePreset("custom");
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#1e2433] bg-[#0b0d11] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Hafıza */}
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("storage")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Hafıza</span>
          </span>
          {openSections.storage ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {openSections.storage && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[128, 256, 512, 1024].map((st) => {
              const label = st === 1024 ? "1 TB" : `${st} GB`;
              const isSelected = selectedStorages.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleStorage(st)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    isSelected
                      ? "bg-[#11223d] text-[#38bdf8] border-[#1e3a68]"
                      : "bg-[#0b0d11] text-slate-300 border-[#1e2433] hover:border-slate-700"
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
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("ram")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>RAM</span>
          </span>
          {openSections.ram ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
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
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    isSelected
                      ? "bg-[#11223d] text-[#38bdf8] border-[#1e3a68]"
                      : "bg-[#0b0d11] text-slate-300 border-[#1e2433] hover:border-slate-700"
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
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("camera")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Camera className="w-3.5 h-3.5 text-rose-500" />
            <span>Kamera</span>
          </span>
          {openSections.camera ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
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
                        ? "border-[#f43f5e] bg-[#f43f5e]/20"
                        : "border-[#283042] bg-[#0b0d11]"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />}
                  </span>
                  <span className={`text-xs ${isSelected ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-200"}`}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Ekran & Hz */}
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("screen")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ekran &amp; Hz</span>
          </span>
          {openSections.screen ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {openSections.screen && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              { hz: 60, label: "60 Hz" },
              { hz: 120, label: "120 Hz" },
              { hz: 144, label: "144 Hz+" },
            ].map((item) => {
              const isChecked = selectedScreenHz.includes(item.hz);
              return (
                <button
                  key={item.hz}
                  type="button"
                  onClick={() => toggleScreenHz(item.hz)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    isChecked
                      ? "bg-[#11223d] text-[#38bdf8] border-[#1e3a68]"
                      : "bg-[#0b0d11] text-slate-300 border-[#1e2433] hover:border-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Batarya */}
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("battery")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span>Batarya</span>
          </span>
          {openSections.battery ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {openSections.battery && (
          <div className="mt-2 space-y-1.5">
            {[
              { val: 5000, label: "5.000 mAh+" },
              { val: 5500, label: "5.500 mAh+" },
            ].map((b) => {
              const isSelected = minBattery === b.val;
              return (
                <button
                  key={b.val}
                  type="button"
                  onClick={() => setMinBattery(isSelected ? 0 : b.val)}
                  className="w-full flex items-center gap-2 py-1 text-left group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? "border-[#10b981] bg-[#10b981]/20"
                        : "border-[#283042] bg-[#0b0d11]"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                  </span>
                  <span className={`text-xs ${isSelected ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-200"}`}>
                    {b.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. Özellikler */}
      <div className="border-b border-[#1c2230] pb-3.5">
        <button
          type="button"
          onClick={() => toggleSection("features")}
          className="w-full flex items-center justify-between font-bold text-white py-1"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Özellikler</span>
          </span>
          {openSections.features ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
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
                        ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
                        : "bg-[#0b0d11] border-[#283042] group-hover:border-slate-500"
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className={`text-xs ${isChecked ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-200"}`}>
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
            <Globe className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>İşletim Sistemi</span>
          </span>
          {openSections.os ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {openSections.os && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["Android", "iOS"].map((os) => {
              const isChecked = selectedOS.includes(os) || (selectedOS.length === 0 && os === "iOS"); // iOS active in design
              return (
                <button
                  key={os}
                  type="button"
                  onClick={() => toggleOS(os)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    isChecked
                      ? "bg-[#11223d] text-[#38bdf8] border-[#1e3a68]"
                      : "bg-[#0b0d11] text-slate-300 border-[#1e2433] hover:border-slate-700"
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
    <div className="bg-[#080a0f] text-slate-100 min-h-screen py-5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── 1. Subheader Bar (Title, Count, Quick Filters, Sort, View Mode) ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#181d27]">
          {/* Left: Title & Live Model Count */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Tüm Telefonlar
            </h1>

            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#11223d] text-[#38bdf8] border border-[#1d3865]">
              97 Model Listeleniyor
            </span>

            <span className="text-xs text-slate-500 font-medium">
              • 16 Mağaza Taranıyor
            </span>
          </div>

          {/* Right: Quick Filters, Sort & View Mode matching Stitch */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Filtrele:
              </span>

              {/* Kargo Bedava Pill */}
              <button
                type="button"
                onClick={() => setFreeShippingOnly((p) => !p)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  freeShippingOnly
                    ? "bg-[#10b981] text-white border-[#10b981]"
                    : "bg-[#0d2821] text-[#10b981] border-[#134e3a] hover:border-[#10b981]/50"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Kargo Bedava</span>
              </button>

              {/* Peşin Fiyatına Taksit Pill */}
              <button
                type="button"
                onClick={() => setInstallmentOnly((p) => !p)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  installmentOnly
                    ? "bg-[#1d8cf8] text-white border-[#1d8cf8]"
                    : "bg-[#11223d] text-[#3b82f6] border-[#1e3a68] hover:border-[#3b82f6]/50"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Peşin Fiyatına Taksit</span>
              </button>
            </div>

            {/* Sırala Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Sırala:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="px-3 py-1.5 rounded-lg border border-[#202738] bg-[#121620] text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#1d8cf8] cursor-pointer"
              >
                <option value="popular">Popülerlik</option>
                <option value="newest">En Yeni Çıkanlar</option>
                <option value="price-asc">En Düşük Fiyat</option>
                <option value="price-desc">En Yüksek Fiyat</option>
                <option value="rating">Uzman Puanı</option>
                <option value="price-drop">İndirim Oranı</option>
              </select>
            </div>

            {/* View Mode Toggle: Grid & List */}
            <div className="flex items-center p-0.5 rounded-lg border border-[#202738] bg-[#121620]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#1b2b48] text-[#38bdf8]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Izgara Görünümü"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-[#1b2b48] text-[#38bdf8]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Liste Görünümü"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#202738] bg-[#121620] text-xs font-bold text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>Filtreler</span>
            </button>
          </div>
        </div>

        {/* ─── 2. Horizontal Brand Filter Pills Bar ─── */}
        <div className="py-3.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedBrands([])}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedBrands.length === 0
                ? "bg-[#1d8cf8] text-white shadow-sm shadow-blue-500/20"
                : "bg-[#11141b] hover:bg-[#181d27] text-slate-300 border border-[#202636]"
            }`}
          >
            Tüm Markalar (97)
          </button>

          {brandPills.map((b) => {
            const isSelected = selectedBrands.some(
              (sb) => sb.toLowerCase() === b.name.toLowerCase()
            );
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => toggleBrand(b.name)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#1d8cf8] text-white border-[#1d8cf8] shadow-sm shadow-blue-500/20"
                    : "bg-[#11141b] hover:bg-[#181d27] text-slate-300 border-[#202636]"
                }`}
              >
                <span>{b.name}</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {b.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── 3. Main Two-Column Layout: Left Sidebar + Right 4-Column Grid ─── */}
        <div className="mt-2 flex flex-row gap-5 items-start w-full">
          {/* Left Sidebar (Desktop) */}
          <aside className="hidden lg:flex w-60 xl:w-64 shrink-0 rounded-2xl border border-[#1e2433] bg-[#0c0e14] p-4 flex-col sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c2230]">
              <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-white">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>FİLTRELER</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-[#38bdf8] hover:text-blue-400 cursor-pointer"
              >
                Sıfırla
              </button>
            </div>

            {FilterControls}
          </aside>

          {/* Mobile Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative z-10 w-80 max-w-[85vw] h-full overflow-y-auto p-4 flex flex-col bg-[#0c0e14] text-slate-100 border-r border-[#1e2433]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c2230]">
                  <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-white">
                    <SlidersHorizontal className="w-4 h-4 text-[#3b82f6]" />
                    <span>FİLTRELER</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-semibold text-[#38bdf8]"
                    >
                      Sıfırla
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {FilterControls}
              </div>
            </div>
          )}

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0">
            {paginatedPhones.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {paginatedPhones.map((phone) => (
                      <PhoneCard key={phone.id} phone={phone} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {paginatedPhones.map((phone) => (
                      <PhoneCard key={phone.id} phone={phone} variant="list" />
                    ))}
                  </div>
                )}

                {/* ─── 4. Pagination Bar matching Stitch: < [1] 2 3 ... 12 > ─── */}
                <div className="mt-8 mb-4 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 rounded-lg border border-[#202636] bg-[#11141b] flex items-center justify-center text-slate-400 hover:text-white transition-colors ${
                      currentPage === 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:border-[#38bdf8]"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === 1
                        ? "bg-[#1d8cf8] text-white shadow-sm shadow-blue-500/20"
                        : "bg-[#11141b] border border-[#202636] text-slate-400 hover:text-white"
                    }`}
                  >
                    1
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === 2
                        ? "bg-[#1d8cf8] text-white shadow-sm shadow-blue-500/20"
                        : "bg-[#11141b] border border-[#202636] text-slate-400 hover:text-white"
                    }`}
                  >
                    2
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(3)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === 3
                        ? "bg-[#1d8cf8] text-white shadow-sm shadow-blue-500/20"
                        : "bg-[#11141b] border border-[#202636] text-slate-400 hover:text-white"
                    }`}
                  >
                    3
                  </button>

                  <span className="px-1 text-xs text-slate-500 select-none">...</span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-[#1d8cf8] text-white shadow-sm shadow-blue-500/20"
                        : "bg-[#11141b] border border-[#202636] text-slate-400 hover:text-white"
                    }`}
                  >
                    {totalPages}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 rounded-lg border border-[#202636] bg-[#11141b] flex items-center justify-center text-slate-400 hover:text-white transition-colors ${
                      currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:border-[#38bdf8]"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-[#1e2433] bg-[#0c0e14] p-12 text-center">
                <RotateCcw className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Aramanıza Uygun Telefon Bulunamadı</h3>
                <p className="text-xs text-slate-400 mb-4">Lütfen filtreleri sıfırlayarak tekrar deneyin.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#1d8cf8] hover:bg-[#1577d6] text-white text-xs font-bold rounded-xl"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
