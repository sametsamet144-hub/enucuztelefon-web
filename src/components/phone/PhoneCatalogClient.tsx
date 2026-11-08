"use client";

import SiteLogo from "@/components/common/SiteLogo";

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
import { useApp } from "@/context/AppContext";

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
  const { openAlertModal, theme, toggleTheme, compareList } = useApp();

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById("desktop-catalog-search");
        input?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    const knownBrands = [
      "Apple",
      "Samsung",
      "Xiaomi",
      "POCO",
      "HONOR",
      "vivo",
      "Huawei",
      "Google",
      "Nothing",
      "Realme",
      "OnePlus",
      "Motorola",
      "Oppo",
      "Tecno",
      "Infinix",
    ];

    const seenLower = new Set<string>();
    const uniqueBrandNames: string[] = [];
    for (const rawName of [
      ...knownBrands,
      ...initialPhones.map((p) => p.brand),
      ...brands.map((b) => b.name),
    ]) {
      if (!rawName) continue;
      const lower = rawName.toLowerCase().trim();
      if (!seenLower.has(lower)) {
        seenLower.add(lower);
        uniqueBrandNames.push(rawName.trim());
      }
    }

    const stitchBrandCounts: Record<string, number> = {
      apple: 12,
      samsung: 18,
      xiaomi: 14,
      poco: 7,
      honor: 8,
    };

    const list = uniqueBrandNames
      .map((brandName) => {
        const lower = brandName.toLowerCase();
        const bObj = brands.find((b) => b.name.toLowerCase() === lower);
        const actualCount =
          initialPhones.filter((p) => p.brand.toLowerCase() === lower).length ||
          bObj?.phoneCount ||
          0;
        const count = stitchBrandCounts[lower] ?? actualCount;
        return {
          name: brandName,
          count,
        };
      })
      .filter((b) => b.count > 0 || initialPhones.length === 0);

    const priorityBrands = [
      "Apple",
      "Samsung",
      "Xiaomi",
      "POCO",
      "HONOR",
      "vivo",
      "Huawei",
      "Google",
      "Nothing",
    ];
    return list.sort((a, b) => {
      const idxA = priorityBrands.findIndex(
        (p) => p.toLowerCase() === a.name.toLowerCase()
      );
      const idxB = priorityBrands.findIndex(
        (p) => p.toLowerCase() === b.name.toLowerCase()
      );
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b.count - a.count;
    });
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

      if (freeShippingOnly && phone.lowestPrice <= 0) {
        return false;
      }

      if (
        installmentOnly &&
        !phone.storesPrices?.some((s) => s.installmentText) &&
        phone.brand.toLowerCase() !== "samsung" &&
        phone.brand.toLowerCase() !== "apple"
      ) {
        return false;
      }

      if (selectedStorages.length > 0) {
        const phoneStorage = phone.specs?.performance?.storage;
        if (phoneStorage && !selectedStorages.includes(phoneStorage)) {
          return false;
        }
      }

      if (selectedRAMs.length > 0) {
        const phoneRam = phone.specs?.performance?.ram;
        if (phoneRam && !selectedRAMs.includes(phoneRam)) {
          return false;
        }
      }

      if (minCamera > 0) {
        const cam = phone.specs?.camera?.mainCamera?.megapixels || 0;
        if (cam < minCamera) {
          return false;
        }
      }

      if (selectedScreenHz.length > 0) {
        const hz = phone.specs?.display?.refreshRate;
        if (hz && !selectedScreenHz.includes(hz)) {
          return false;
        }
      }

      if (minBattery > 0) {
        const bat = phone.specs?.battery?.capacity || 0;
        if (bat < minBattery) {
          return false;
        }
      }

      if (features.fiveG && !phone.specs?.connectivity?.fiveG && !phone.specs?.connectivity?.network?.includes("5G")) {
        return false;
      }

      if (features.nfc && !phone.specs?.connectivity?.nfc) {
        return false;
      }

      if (features.wirelessCharging && !phone.specs?.battery?.wirelessCharging) {
        return false;
      }

      if (features.ip68 && !phone.specs?.design?.waterResistance?.includes("IP68")) {
        return false;
      }

      if (selectedOS.length > 0) {
        const isIOS = phone.brand.toLowerCase() === "apple";
        const osName = isIOS ? "iOS" : "Android";
        if (!selectedOS.includes(osName)) {
          return false;
        }
      }

      return true;
    });
  }, [
    initialPhones,
    search,
    selectedBrands,
    minPrice,
    maxPrice,
    dipFiyatOnly,
    freeShippingOnly,
    installmentOnly,
    selectedStorages,
    selectedRAMs,
    minCamera,
    selectedScreenHz,
    minBattery,
    features,
    selectedOS,
  ]);

  // ── Sorting Logic ──
  const sortedPhones = useMemo(() => {
    const list = [...filteredPhones];
    if (sort === "popular") {
      if (selectedBrands.length === 0 && !search.trim()) {
        const SHOWCASE_ORDER = [
          "iphone-16-pro-max",
          "samsung-galaxy-s25-ultra",
          "xiaomi-15",
          "honor-magic-v3",
          "poco-f6-pro",
          "iphone-15",
          "samsung-galaxy-s24-fe",
          "vivo-x200-pro",
        ];
        const CONCEPT_BOTTOM = new Set([
          "iphone-17-pro-max",
          "iphone-17-pro",
          "iphone-17-plus",
          "iphone-17",
          "iphone-17-air",
          "iphone-air",
          "samsung-galaxy-s26-ultra",
          "samsung-galaxy-s26",
          "samsung-galaxy-s25-phone-015",
          "redmi-note-13-pro-5g-phone-038",
          "iphone-se-4-nesil",
        ]);
        return list.sort((a, b) => {
          const idxA = SHOWCASE_ORDER.indexOf(a.slug);
          const idxB = SHOWCASE_ORDER.indexOf(b.slug);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          const isConceptA = CONCEPT_BOTTOM.has(a.slug);
          const isConceptB = CONCEPT_BOTTOM.has(b.slug);
          if (isConceptA && !isConceptB) return 1;
          if (!isConceptA && isConceptB) return -1;
          return (b.rating ?? 0) - (a.rating ?? 0);
        });
      }
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    if (sort === "price-asc") return list.sort((a, b) => a.lowestPrice - b.lowestPrice);
    if (sort === "price-desc") return list.sort((a, b) => b.lowestPrice - a.lowestPrice);
    if (sort === "rating") return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "price-drop")
      return list.sort((a, b) => (b.priceDropPercent ?? 0) - (a.priceDropPercent ?? 0));
    return list;
  }, [filteredPhones, sort, selectedBrands, search]);

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

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE_MOBILE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE_MOBILE, sortedPhones.length);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count += 1;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (minPrice || maxPrice) count += 1;
    if (freeShippingOnly) count += 1;
    if (installmentOnly) count += 1;
    if (dipFiyatOnly) count += 1;
    if (selectedRAMs.length > 0) count += selectedRAMs.length;
    if (selectedStorages.length > 0) count += selectedStorages.length;
    if (minCamera > 0) count += 1;
    if (selectedScreenHz.length > 0) count += selectedScreenHz.length;
    if (minBattery > 0) count += 1;
    if (features.fiveG) count += 1;
    if (features.nfc) count += 1;
    if (features.wirelessCharging) count += 1;
    if (features.ip68) count += 1;
    if (selectedOS.length > 0) count += selectedOS.length;
    return count;
  }, [
    search,
    selectedBrands,
    minPrice,
    maxPrice,
    freeShippingOnly,
    installmentOnly,
    dipFiyatOnly,
    selectedRAMs,
    selectedStorages,
    minCamera,
    selectedScreenHz,
    minBattery,
    features,
    selectedOS,
  ]);

  const mobilePageNumbers = useMemo(() => {
    const total = totalPagesMobile;
    const current = currentPage;
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 2, total - 1, total];
    }
    return [1, "...", current, "...", total];
  }, [totalPagesMobile, currentPage]);

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
    <div className="bg-[#131315] text-[#e5e1e4] min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE EXPERIENCE (<lg) - MATCHING OBSIDIAN PRECISION STITCH DESIGN ── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden bg-surface text-on-surface" style={{ backgroundColor: "#131315", color: "#e5e1e4" }}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes border-beam-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes float-phone {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-4px) scale(1.02); }
}
@keyframes sheen-sweep {
  0% { transform: translateX(-150%) skewX(-20deg); }
  30%, 100% { transform: translateX(250%) skewX(-20deg); }
}
@keyframes badge-breathe {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 180, 171, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 8px 2px rgba(255, 180, 171, 0.3); }
}
@keyframes radar-wave {
  0% { transform: scale(0.9); opacity: 0.9; }
  70% { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
}
.anim-border-beam {
  position: relative !important;
  overflow: hidden !important;
}
.anim-border-beam::before {
  content: '' !important;
  display: block !important;
  position: absolute !important;
  inset: -50% !important;
  background: conic-gradient(from 0deg, transparent 0deg, #2997ff 60deg, transparent 120deg, #47e266 220deg, transparent 280deg) !important;
  animation: border-beam-rotate 4s linear infinite !important;
  z-index: 0 !important;
}
.anim-border-beam-amber::before {
  background: conic-gradient(from 0deg, transparent 0deg, #ff9500 70deg, transparent 140deg, #ff2d55 240deg, transparent 300deg) !important;
}
.anim-card-inner {
  position: relative !important;
  z-index: 1 !important;
  border-radius: calc(1rem - 1.5px) !important;
}
.anim-float-3d {
  animation: float-phone 4.5s ease-in-out infinite !important;
  will-change: transform;
}
.anim-sheen-btn {
  position: relative !important;
  overflow: hidden !important;
}
.anim-sheen-btn::after {
  content: '' !important;
  display: block !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 60% !important;
  height: 100% !important;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent) !important;
  animation: sheen-sweep 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite !important;
  pointer-events: none !important;
}
.anim-badge-pulse {
  animation: badge-breathe 2.4s ease-in-out infinite !important;
  will-change: transform;
}
.anim-radar-ping {
  position: relative !important;
  z-index: 1;
}
.anim-radar-ping::after {
  content: '' !important;
  display: block !important;
  position: absolute !important;
  inset: 0 !important;
  border-radius: 9999px !important;
  background: inherit !important;
  animation: radar-wave 1.8s cubic-bezier(0, 0, 0.2, 1) infinite !important;
  pointer-events: none !important;
  z-index: -1 !important;
}
.soft-lift-card {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease;
}
.soft-lift-card:hover, .soft-lift-card:active {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.65);
}
`,
          }}
        />
        {/* Top Mobile Header */}
        <header
          className="sticky top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.35)]"
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: 50,
            backgroundColor: "rgba(19, 19, 21, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 1px 12px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div
            className="h-16 px-gutter-mobile flex items-center justify-between gap-space-sm"
            style={{
              height: "64px",
              paddingLeft: "12px",
              paddingRight: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <SiteLogo size="sm" href="/" />

            <div
              className="flex items-center gap-1 shrink-0"
              style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}
            >
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("mobile-catalog-search");
                  el?.focus();
                }}
                aria-label="Ara"
                className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  color: "#c0c7d5",
                  background: "transparent",
                  border: "none",
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontSize: "22px", lineHeight: 1 }}
                >
                  search
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                aria-label="Filtrele"
                className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer relative"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  color: "#c0c7d5",
                  background: "transparent",
                  border: "none",
                  position: "relative",
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontSize: "22px", lineHeight: 1 }}
                >
                  tune
                </span>
                {activeFiltersCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "9999px",
                      backgroundColor: "#2997ff",
                    }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => openAlertModal()}
                aria-label="Fiyat Alarmları"
                className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  color: "#c0c7d5",
                  background: "transparent",
                  border: "none",
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontSize: "22px", lineHeight: 1 }}
                >
                  notifications
                </span>
              </button>

              <Link
                href="/admin"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 ml-1"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9999px",
                  backgroundColor: "#a3c9ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginLeft: "4px",
                  textDecoration: "none",
                }}
                aria-label="Profil"
              >
                <span
                  className="material-symbols-outlined text-on-primary text-[18px]"
                  style={{ color: "#00315c", fontSize: "18px", lineHeight: 1 }}
                >
                  person
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Top Filter & Toolbar Section */}
        <div
          className="flex flex-col gap-space-sm px-gutter-mobile pt-space-xs pb-space-sm bg-surface-container-low shadow-sm"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px 12px 10px 12px",
            backgroundColor: "#1c1b1d",
          }}
        >
          {/* Quick Search Pill Bar */}
          <div className="relative w-full" style={{ position: "relative", width: "100%" }}>
            <div
              className="flex items-center w-full h-11 px-3.5 rounded-full bg-surface-container-high text-on-surface-variant transition-all focus-within:text-on-surface focus-within:shadow-[0_0_0_2px_rgba(41,151,255,0.4)]"
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "44px",
                paddingLeft: "14px",
                paddingRight: "14px",
                borderRadius: "9999px",
                backgroundColor: "#2a2a2c",
                color: "#c0c7d5",
              }}
            >
              <span
                className="material-symbols-outlined text-[20px] mr-2 text-primary shrink-0"
                style={{ fontSize: "20px", lineHeight: 1, marginRight: "8px", color: "#a3c9ff", flexShrink: 0 }}
              >
                search
              </span>
              <input
                id="mobile-catalog-search"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Model, marka veya özellik ara..."
                className="w-full bg-transparent border-0 outline-none text-body-sm text-on-surface placeholder:text-on-surface-variant/60 font-body-sm"
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "#e5e1e4",
                }}
              />
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant hover:text-on-surface shrink-0 ml-1 cursor-pointer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "9999px",
                  backgroundColor: "#353437",
                  color: "#c0c7d5",
                  flexShrink: 0,
                  marginLeft: "4px",
                  border: "none",
                }}
                title="Filtrele"
              >
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontSize: "14px", lineHeight: 1 }}
                >
                  tune
                </span>
              </button>
            </div>
          </div>

          {/* Horizontal Brand Chips */}
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-gutter-mobile px-gutter-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              overflowX: "auto",
              paddingTop: "2px",
              paddingBottom: "2px",
              marginLeft: "-12px",
              marginRight: "-12px",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedBrands([]);
                setCurrentPage(1);
              }}
              className="h-8 px-3.5 rounded-full flex items-center gap-1.5 shrink-0 font-label-md text-label-md shadow-sm cursor-pointer"
              style={{
                height: "32px",
                paddingLeft: "14px",
                paddingRight: "14px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0,
                backgroundColor: selectedBrands.length === 0 ? "#e5e1e4" : "#2a2a2c",
                color: selectedBrands.length === 0 ? "#0e0e10" : "#c0c7d5",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: selectedBrands.length === 0 ? 600 : 500,
                border: "none",
              }}
            >
              <span>Tüm Markalar</span>
              <span
                className="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm"
                style={{
                  padding: "1px 6px",
                  borderRadius: "9999px",
                  backgroundColor:
                    selectedBrands.length === 0 ? "rgba(14, 14, 16, 0.15)" : "#353437",
                  color: selectedBrands.length === 0 ? "#0e0e10" : "#c0c7d5",
                  fontSize: "11px",
                  lineHeight: "16px",
                  fontWeight: 600,
                }}
              >
                {initialPhones.length}
              </span>
            </button>

            {brandPills.map((b) => {
              const active = selectedBrands.some(
                (sb) => sb.toLowerCase() === b.name.toLowerCase()
              );
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => toggleBrand(b.name)}
                  className="h-8 px-3.5 rounded-full flex items-center gap-1.5 shrink-0 font-label-md text-label-md cursor-pointer"
                  style={{
                    height: "32px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                    backgroundColor: active ? "#e5e1e4" : "#2a2a2c",
                    color: active ? "#0e0e10" : "#c0c7d5",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: active ? 600 : 500,
                    border: "none",
                  }}
                >
                  <span>{b.name}</span>
                  <span
                    className="px-1.5 py-0.2 rounded-full font-label-sm text-label-sm"
                    style={{
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      backgroundColor: active ? "rgba(14, 14, 16, 0.15)" : "#353437",
                      color: active ? "#0e0e10" : "#c0c7d5",
                      fontSize: "11px",
                      lineHeight: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {b.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Benefit Filter Tags */}
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-gutter-mobile px-gutter-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              overflowX: "auto",
              marginLeft: "-12px",
              marginRight: "-12px",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setFreeShippingOnly((v) => !v);
                setCurrentPage(1);
              }}
              className="h-7 px-2.5 rounded-full flex items-center gap-1 shrink-0 bg-surface-container text-on-surface-variant hover:text-primary font-label-sm text-label-sm cursor-pointer"
              style={{
                height: "28px",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
                backgroundColor: "#201f22",
                color: freeShippingOnly ? "#47e266" : "#c0c7d5",
                fontSize: "11px",
                lineHeight: "16px",
                fontWeight: 600,
                border: freeShippingOnly ? "1px solid rgba(71, 226, 102, 0.5)" : "none",
              }}
            >
              <span
                className="material-symbols-outlined text-[15px] text-tertiary"
                style={{ fontSize: "15px", lineHeight: 1, color: "#47e266" }}
              >
                local_shipping
              </span>
              <span>Kargo Bedava</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInstallmentOnly((v) => !v);
                setCurrentPage(1);
              }}
              className="h-7 px-2.5 rounded-full flex items-center gap-1 shrink-0 bg-surface-container text-on-surface-variant hover:text-primary font-label-sm text-label-sm cursor-pointer"
              style={{
                height: "28px",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
                backgroundColor: "#201f22",
                color: installmentOnly ? "#a3c9ff" : "#c0c7d5",
                fontSize: "11px",
                lineHeight: "16px",
                fontWeight: 600,
                border: installmentOnly ? "1px solid rgba(163, 201, 255, 0.5)" : "none",
              }}
            >
              <span
                className="material-symbols-outlined text-[15px] text-primary"
                style={{ fontSize: "15px", lineHeight: 1, color: "#a3c9ff" }}
              >
                credit_card
              </span>
              <span>Peşin Fiyatına Taksit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDipFiyatOnly((v) => !v);
                setCurrentPage(1);
              }}
              className="h-7 px-2.5 rounded-full flex items-center gap-1 shrink-0 bg-surface-container text-on-surface-variant hover:text-primary font-label-sm text-label-sm cursor-pointer"
              style={{
                height: "28px",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
                backgroundColor: "#201f22",
                color: dipFiyatOnly ? "#47e266" : "#c0c7d5",
                fontSize: "11px",
                lineHeight: "16px",
                fontWeight: 600,
                border: dipFiyatOnly ? "1px solid rgba(71, 226, 102, 0.5)" : "none",
              }}
            >
              <span
                className="material-symbols-outlined text-[15px] text-tertiary"
                style={{ fontSize: "15px", lineHeight: 1, color: "#47e266" }}
              >
                trending_down
              </span>
              <span>Tarihi Dip Fiyat</span>
            </button>
          </div>

          {/* Model Counter & View Mode Switcher */}
          <div
            className="flex items-center justify-between pt-1"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "4px",
            }}
          >
            <div
              className="flex items-center gap-1.5"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span
                className="font-label-md text-label-md text-on-surface font-semibold"
                style={{ fontSize: "14px", lineHeight: "20px", fontWeight: 600, color: "#e5e1e4" }}
              >
                {sortedPhones.length} Model
              </span>
              <span
                className="w-1 h-1 rounded-full bg-outline-variant"
                style={{ width: "4px", height: "4px", borderRadius: "9999px", backgroundColor: "#404753" }}
              />
              <span
                className="font-label-sm text-label-sm text-on-surface-variant"
                style={{ fontSize: "11px", lineHeight: "16px", fontWeight: 600, color: "#c0c7d5" }}
              >
                16 Mağaza
              </span>
            </div>

            <div
              className="flex items-center gap-2"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {/* Sort Select Trigger */}
              <div className="relative" style={{ position: "relative" }}>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  className="appearance-none flex items-center gap-1 h-7 pl-2.5 pr-6 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm outline-none cursor-pointer"
                  style={{
                    height: "28px",
                    paddingLeft: "10px",
                    paddingRight: "24px",
                    borderRadius: "9999px",
                    backgroundColor: "#201f22",
                    color: "#e5e1e4",
                    fontSize: "11px",
                    lineHeight: "16px",
                    fontWeight: 600,
                    border: "none",
                    outline: "none",
                  }}
                >
                  <option value="popular">En Popüler</option>
                  <option value="price-asc">En Düşük Fiyat</option>
                  <option value="price-desc">En Yüksek Fiyat</option>
                  <option value="rating">Kullanıcı Puanı</option>
                  <option value="price-drop">İndirim Oranı</option>
                </select>
                <span
                  className="material-symbols-outlined text-[16px] text-on-surface-variant pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1,
                    color: "#c0c7d5",
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  expand_more
                </span>
              </div>

              {/* View Toggle (Grid / List) */}
              <div
                className="flex items-center p-0.5 rounded-full bg-surface-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                  borderRadius: "9999px",
                  backgroundColor: "#201f22",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: viewMode === "grid" ? "#a3c9ff" : "transparent",
                    color: viewMode === "grid" ? "#00315c" : "#c0c7d5",
                    border: "none",
                  }}
                  title="2'li Grid"
                >
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontSize: "15px", lineHeight: 1 }}
                  >
                    grid_view
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: viewMode === "list" ? "#a3c9ff" : "transparent",
                    color: viewMode === "list" ? "#00315c" : "#c0c7d5",
                    border: "none",
                  }}
                  title="Liste Görünümü"
                >
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ fontSize: "15px", lineHeight: 1 }}
                  >
                    view_list
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN DEVICE GRID */}
        <div>
          {sortedPhones.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <span className="material-symbols-outlined text-4xl mb-2 text-zinc-600">
                search_off
              </span>
              <p className="text-sm">Seçilen filtrelere uygun telefon bulunamadı.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                style={{ backgroundColor: "#2997ff", color: "#002e57" }}
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div
              className="grid grid-cols-2 gap-3 px-3 py-3 w-full"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px",
                padding: "12px",
                width: "100%",
              }}
            >
              {paginatedMobile.map((p, idx) => (
                <MobilePhoneCard key={p.id} phone={p} index={idx} />
              ))}
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {paginatedMobile.map((p) => (
                <PhoneCard key={p.id} phone={p} variant="list" />
              ))}
            </div>
          )}

          {/* PAGINATION AREA */}
          {totalPagesMobile > 1 && (
            <div
              className="flex flex-col items-center justify-center gap-3 pt-4 pb-12 px-gutter-mobile"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                paddingTop: "16px",
                paddingBottom: "32px",
                paddingLeft: "12px",
                paddingRight: "12px",
              }}
            >
              <div
                className="flex items-center gap-1.5"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant disabled:opacity-30 cursor-pointer"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#2a2a2c",
                    color: "#c0c7d5",
                    border: "none",
                    opacity: currentPage <= 1 ? 0.3 : 1,
                  }}
                  title="Önceki Sayfa"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontSize: "18px", lineHeight: 1 }}
                  >
                    chevron_left
                  </span>
                </button>

                {mobilePageNumbers.map((num, i) => {
                  if (num === "...") {
                    return (
                      <span
                        key={`ellipsis-${i}`}
                        className="px-1 text-on-surface-variant font-label-sm text-label-sm"
                        style={{ padding: "0 4px", color: "#c0c7d5", fontSize: "11px", fontWeight: 600 }}
                      >
                        ...
                      </span>
                    );
                  }
                  const isActive = num === currentPage;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setCurrentPage(num as number);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center font-label-md text-label-md cursor-pointer"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isActive ? "#a3c9ff" : "#201f22",
                        color: isActive ? "#00315c" : "#e5e1e4",
                        fontSize: "14px",
                        fontWeight: isActive ? 700 : 500,
                        border: "none",
                      }}
                    >
                      {num}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPagesMobile}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPagesMobile, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface hover:text-primary cursor-pointer"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#2a2a2c",
                    color: "#e5e1e4",
                    border: "none",
                    opacity: currentPage >= totalPagesMobile ? 0.3 : 1,
                  }}
                  title="Sonraki Sayfa"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontSize: "18px", lineHeight: 1 }}
                  >
                    chevron_right
                  </span>
                </button>
              </div>

              <span
                className="font-label-sm text-label-sm text-on-surface-variant/80"
                style={{ fontSize: "11px", lineHeight: "16px", fontWeight: 600, color: "rgba(192, 199, 213, 0.8)" }}
              >
                Toplam {sortedPhones.length} telefon modelinden {startIdx + 1}-{endIdx} arası gösteriliyor
              </span>
            </div>
          )}

          {/* FLOATING FILTER BAR (BOTTOM PILL) */}
          <div
            className="sticky bottom-20 z-40 flex justify-center w-full px-4 pointer-events-none mb-2"
            style={{
              position: "sticky",
              bottom: "76px",
              zIndex: 40,
              display: "flex",
              justifyContent: "center",
              width: "100%",
              paddingLeft: "16px",
              paddingRight: "16px",
              pointerEvents: "none",
              marginBottom: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold shadow-[0_8px_24px_rgba(41,151,255,0.45)] active:scale-95 transition-all cursor-pointer"
              style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                borderRadius: "9999px",
                backgroundColor: "#2997ff",
                color: "#002e57",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 600,
                boxShadow: "0 8px 24px rgba(41, 151, 255, 0.45)",
                border: "none",
              }}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontSize: "20px", lineHeight: 1 }}
              >
                filter_list
              </span>
              <span>Filtrele ({sortedPhones.length} Model)</span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-on-primary-container"
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "9999px",
                  backgroundColor: "#002e57",
                }}
              />
              <span className="font-bold" style={{ fontWeight: 700 }}>
                {activeFiltersCount > 0 ? activeFiltersCount : 4} Aktif
              </span>
            </button>
          </div>
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
                  className="w-8 h-8 rounded-full bg-[#201f22] flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {FilterControls}

              <div className="sticky bottom-0 pt-4 pb-2 bg-[#131315] flex gap-2 border-t border-white/[0.08] mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-1/2 py-2.5 rounded-full bg-[#201f22] text-[#c0c7d5] text-xs font-semibold hover:text-white cursor-pointer"
                >
                  Sıfırla
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 rounded-full bg-[#2997ff] text-[#002e57] text-xs font-bold shadow-md cursor-pointer"
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
      <div
        className="hidden lg:block relative min-h-screen ambient-dot-grid"
        onMouseMove={(e) => {
          document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
          document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
        }}
      >
        {/* Ambient Background Lighting */}
        <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="fixed inset-0 z-0 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(650px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(41, 151, 255, 0.08), transparent 80%)",
            }}
          />
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#0066cc]/15 blur-[130px] animate-pulse pointer-events-none"
            style={{ animationDuration: "9s" }}
          />
          <div
            className="absolute top-[28%] -right-40 w-[650px] h-[650px] rounded-full bg-[#4f46e5]/10 blur-[150px] pointer-events-none animate-pulse"
            style={{ animationDuration: "12s" }}
          />
          <div className="absolute bottom-10 left-[25%] w-[550px] h-[550px] rounded-full bg-[#0ea5e9]/10 blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* ── Desktop Header ── */}
          <header className="border-b border-zinc-700/80 bg-[#131315]/85 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-[1880px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-6">
              <div className="flex items-center gap-6 shrink-0">
                <SiteLogo href="/" />
                <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-zinc-400 pl-2">
                  <Link
                    href="/telefonlar"
                    className="text-white font-semibold flex items-center gap-1.5"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2997ff] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2997ff]" />
                    </span>
                    Tüm Telefonlar
                  </Link>
                  <Link href="/karsilastir" className="hover:text-white transition-colors">
                    Karşılaştır
                  </Link>
                  <Link
                    href="/fiyati-dusenler"
                    className="hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Fiyatı Düşenler</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      İndirim
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => openAlertModal()}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Fiyat Alarmı
                  </button>
                  <Link href="/rehber" className="hover:text-white transition-colors">
                    Rehber & Kılavuz
                  </Link>
                </nav>
              </div>

              {/* Central Search Bar */}
              <div className="flex-1 max-w-2xl relative hidden md:block">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]">
                  search
                </span>
                <input
                  id="desktop-catalog-search"
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Model, marka veya donanım ara (örn: iPhone 16 Pro Max, S25 Ultra, Snapdragon 8 Elite)..."
                  className="w-full bg-[#18181b]/80 border border-zinc-700/80 rounded-xl pl-10 pr-20 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] transition-all backdrop-blur-md"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-[#201f22] border border-zinc-700 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center bg-[#18181b] border border-zinc-700/80 rounded-xl p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== "dark") toggleTheme();
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all tactile-bounce cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#201f22] text-[#2997ff] font-medium shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                    title="Koyu Mod"
                  >
                    <span className="material-symbols-outlined text-[15px]">dark_mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== "light") toggleTheme();
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all tactile-bounce cursor-pointer ${
                      theme === "light"
                        ? "bg-[#201f22] text-[#2997ff] font-medium shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                    title="Açık Mod"
                  >
                    <span className="material-symbols-outlined text-[15px]">light_mode</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => openAlertModal()}
                  className="hidden sm:flex items-center gap-1.5 bg-[#18181b] hover:bg-[#201f22] text-zinc-200 border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors tactile-bounce cursor-pointer"
                >
                  <span className="material-symbols-outlined text-amber-400 text-[16px]">
                    notifications_active
                  </span>
                  <span>Fiyat Alarmı</span>
                </button>

                <Link
                  href="/karsilastir"
                  className="hidden lg:flex items-center gap-1.5 bg-[#18181b] hover:bg-[#201f22] text-zinc-200 border border-zinc-700/80 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors tactile-bounce cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#2997ff] text-[16px]">balance</span>
                  <span>Karşılaştır</span>
                  <span className="bg-[#2997ff] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {compareList.length}
                  </span>
                </Link>

                <Link
                  href="/admin"
                  aria-label="Kullanıcı Profili"
                  className="w-9 h-9 rounded-xl bg-[#18181b] border border-zinc-700/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#2997ff] transition-colors tactile-bounce cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">person</span>
                </Link>
              </div>
            </div>
          </header>

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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 filter-pill-neon transition-all shrink-0 ${
                selectedBrands.length === 0
                  ? "bg-[#2997ff] text-white shadow-md shadow-[#2997ff]/30 filter-pill-active"
                  : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 hover:text-white border border-zinc-700/80"
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 filter-pill-neon transition-all shrink-0 ${
                    active
                      ? "bg-[#2997ff] text-white shadow-md shadow-[#2997ff]/30 filter-pill-active"
                      : "bg-[#18181b] hover:bg-[#201f22] text-zinc-300 hover:text-white border border-zinc-700/80"
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
            <section className="lg:col-span-9 xl:col-span-10 space-y-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
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
    </div>
  );
}
