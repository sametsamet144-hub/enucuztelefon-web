"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getPhones, searchPhones } from "@/lib/data";
import type { Phone } from "@/types";

export interface CandidateDevice {
  slug: string;
  brand: string;
  name: string;
  score: string;
  chipset: string;
  battery: string;
  camera: string;
  price: number;
  store: string;
  image?: string;
  icon?: string;
  isFlagship?: boolean;
  hasPeriscope?: boolean;
  hasRecordDiscount?: boolean;
}


export function phoneToCandidate(p: Phone): CandidateDevice {
  const cameraMp = p.specs?.camera?.mainMp || p.specs?.camera?.mainCamera?.megapixels || 50;
  return {
    slug: p.slug,
    brand: p.brand,
    name: p.name,
    score: (p.rating || 9.2).toFixed(1),
    chipset: p.specs?.performance?.chipset || (p.brand === "Apple" ? "Apple A18 Pro" : "Snapdragon 8 Elite"),
    battery: `${p.specs?.battery?.capacity || 5000} mAh`,
    camera: `${cameraMp} MP Kamera`,
    price: p.lowestPrice,
    store: p.lowestPriceStoreName || p.storesPrices?.[0]?.store || "Doğrulanmış Satıcı",
    image: p.image,
    isFlagship: (p.specs?.performance?.ram ?? 0) >= 12 || p.lowestPrice > 35000,
    hasPeriscope: Boolean(p.specs?.camera?.telephoto || p.specs?.camera?.telephotoMp),
    hasRecordDiscount: Boolean(p.isPriceDropped),
  };
}

export const CANDIDATE_FLAGSHIPS: CandidateDevice[] = [];


interface DeviceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlots: CandidateDevice[];
  onSlotChange: (index: number, newDevice: CandidateDevice) => void;
  onSlotRemove: (index: number) => void;
  onConfirm: () => void;
}

export default function DeviceSelectorModal({
  isOpen,
  onClose,
  activeSlots,
  onSlotChange,
  onSlotRemove,
  onConfirm,
}: DeviceSelectorModalProps) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBrandFilter, setActiveBrandFilter] = useState("Tümü");
  const [quickFilter, setQuickFilter] = useState<
    "all" | "flagship" | "periscope" | "discount"
  >("all");
  const [backendDevices, setBackendDevices] = useState<CandidateDevice[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const q = searchQuery.trim();
    if (q.length > 1) {
      const timer = setTimeout(() => {
        searchPhones(q, 20).then((res) => {
          if (res) setBackendDevices(res.map(phoneToCandidate));
        });
      }, 200);
      return () => clearTimeout(timer);
    } else {
      getPhones({ pageSize: 30 }).then((res) => {
        if (res) setBackendDevices(res.map(phoneToCandidate));
      });
    }
  }, [isOpen, searchQuery]);

  const modalRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Mousemove Event Listener attached to all .tilt-card elements
  useEffect(() => {
    if (!isOpen) return;

    const cards = modalRef.current?.querySelectorAll<HTMLElement>(".tilt-card");
    if (!cards) return;

    const listeners: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    cards.forEach((card) => {
      let glare = card.querySelector<HTMLElement>(".tilt-card-glare");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "tilt-card-glare";
        card.appendChild(glare);
      }

      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        const centerX = width / 2;
        const centerY = height / 2;
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const maxRotate = 7;
        const rotateX = (-percentY * maxRotate).toFixed(2);
        const rotateY = (percentX * maxRotate).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
        card.style.boxShadow = `0 18px 36px -8px rgba(0, 0, 0, 0.65), 0 0 25px rgba(41, 151, 255, 0.15)`;

        if (glare) {
          const glareX = ((x / width) * 100).toFixed(1);
          const glareY = ((y / height) * 100).toFixed(1);
          glare.style.opacity = "1";
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 75%)`;
        }
      };

      const onMouseLeave = () => {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        card.style.boxShadow = "";
        if (glare) {
          glare.style.opacity = "0";
        }
      };

      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);
      listeners.push({ el: card, move: onMouseMove, leave: onMouseLeave });
    });

    return () => {
      listeners.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [isOpen, selectedSlotIndex, searchQuery, activeBrandFilter, quickFilter]);

  // Brand chip list with counts
  const brands = useMemo(() => {
    const brandMap: Record<string, number> = {};
    backendDevices.forEach((d) => {
      brandMap[d.brand] = (brandMap[d.brand] || 0) + 1;
    });
    const list = Object.entries(brandMap).map(([name, count]) => ({ name, count }));
    return [{ name: "Tümü", count: backendDevices.length }, ...list];
  }, [backendDevices]);

  // Filtered candidate devices
  const filteredCandidates = useMemo(() => {
    return backendDevices.filter((dev) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          dev.name.toLowerCase().includes(q) ||
          dev.brand.toLowerCase().includes(q) ||
          dev.chipset.toLowerCase().includes(q) ||
          dev.camera.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Brand
      if (activeBrandFilter !== "Tümü" && dev.brand !== activeBrandFilter) {
        return false;
      }

      // Quick filter
      if (quickFilter === "flagship" && !dev.isFlagship) return false;
      if (quickFilter === "periscope" && !dev.hasPeriscope) return false;
      if (quickFilter === "discount" && !dev.hasRecordDiscount) return false;

      return true;
    });
  }, [searchQuery, activeBrandFilter, quickFilter]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-xl animate-fade-in"
      id="device-selector-modal"
    >
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-surface-container-low border border-surface-container-highest shadow-2xl flex flex-col overflow-hidden text-on-surface animate-modal-entrance">
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between p-6 border-b border-surface-container-highest bg-surface-container/60">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">
                Canlı Telemetri Karşılaştırma Motoru
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">
              Karşılaştırma Listesini Düzenle &amp; Cihaz Değiştir
            </h2>
            <p className="text-[13px] text-on-surface-variant">
              Mevcut 4 yuvadaki cihazları çıkarabilir, yer değiştirebilir veya
              488 model arasından 3D eğilme (tilt) efektli kartlarla yeni telefon
              seçebilirsiniz.
            </p>
          </div>
          <button
            aria-label="Kapat"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors border border-surface-container-highest shrink-0 cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 4 ACTIVE SLOTS BAR WITH 3D TILT */}
        <div className="p-6 border-b border-surface-container-highest bg-surface-container-lowest/50 flex flex-col gap-3">
          <div className="flex items-center justify-between text-outline text-[11px]">
            <span className="font-semibold uppercase tracking-wider">
              Aktif 4 Cihaz Yuvası (Mevcut Ring)
            </span>
            <span className="text-primary font-medium">
              Slot {selectedSlotIndex + 1} için yeni amiral gemisi aranıyor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeSlots.map((slot, idx) => {
              const isSelected = selectedSlotIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSlotIndex(idx)}
                  className={`tilt-card p-3 rounded-2xl flex items-center justify-between gap-2 cursor-pointer shadow-md transition-all ${
                    isSelected
                      ? "bg-primary-container/10 border-2 border-primary shadow-[0_0_20px_rgba(41,151,255,0.25)] relative overflow-hidden animate-pulse-glow"
                      : "bg-surface-container border border-surface-container-highest hover:border-primary/40"
                  }`}
                >
                  <div className="tilt-card-glare" />

                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-11 shrink-0 rounded-lg flex items-center justify-center p-0.5 overflow-hidden ${
                        isSelected
                          ? "bg-primary-container/20 border border-primary/40"
                          : "bg-surface-container-low border border-surface-container-highest"
                      }`}
                    >
                      {slot.image ? (
                        <img
                          alt={slot.name}
                          className="w-full h-full object-contain"
                          src={slot.image}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          {slot.icon || "smartphone"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-[10px] uppercase block truncate font-semibold ${
                          isSelected ? "text-primary" : "text-outline"
                        }`}
                      >
                        Yuva {idx + 1} · {slot.brand}
                      </span>
                      <span className="text-[14px] font-bold text-on-surface truncate block">
                        {slot.name}
                      </span>
                      <span className="text-[11px] text-tertiary block truncate font-semibold">
                        {formatPrice(slot.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0 relative z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSlotIndex(idx);
                      }}
                      className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors border border-surface-container-highest cursor-pointer"
                      title="Değiştir"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        sync_alt
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSlotRemove(idx);
                      }}
                      className="w-6 h-6 rounded bg-surface-container-high hover:bg-error-container/20 text-error flex items-center justify-center transition-colors border border-surface-container-highest cursor-pointer"
                      title="Kaldır"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        close
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEARCH & ADVANCED FILTER CONTROLS */}
        <div className="p-6 pb-4 flex flex-col gap-4 bg-surface-container-low">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-3 w-full flex-1 px-4 py-2.5 rounded-2xl bg-surface-container border border-surface-container-highest focus-within:border-primary/60 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">
                search
              </span>
              <input
                className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none text-[15px]"
                placeholder="Model adı, işlemci veya donanım ara (örn: Vivo X200 Pro, OnePlus 13, Magic 7...)"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-2 py-0.5 rounded bg-surface-container-high text-outline hover:text-on-surface text-[12px] font-medium border border-surface-container-highest cursor-pointer"
                >
                  Temizle
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() =>
                  setQuickFilter((q) => (q === "flagship" ? "all" : "flagship"))
                }
                className={`px-3 py-2 rounded-full border text-[11px] font-semibold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  quickFilter === "flagship"
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  bolt
                </span>
                <span>Sadece Amiral Gemileri</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setQuickFilter((q) => (q === "periscope" ? "all" : "periscope"))
                }
                className={`px-3 py-2 rounded-full border text-[11px] font-medium shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  quickFilter === "periscope"
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  camera
                </span>
                <span>1-inç &amp; Periskop</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setQuickFilter((q) => (q === "discount" ? "all" : "discount"))
                }
                className={`px-3 py-2 rounded-full border text-[11px] font-medium shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  quickFilter === "discount"
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  trending_down
                </span>
                <span>Rekor İndirimler</span>
              </button>
            </div>
          </div>

          {/* BRAND PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-medium no-scrollbar">
            {brands.map((b) => {
              const isSelected = activeBrandFilter === b.name;
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setActiveBrandFilter(b.name)}
                  className={`px-3 py-1 rounded-full shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary-container text-on-primary-container font-semibold shimmer-button shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface border border-surface-container-highest"
                  }`}
                >
                  {b.name} ({b.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* CANDIDATE FLAGSHIP PHONES GRID WITH INTERACTIVE 3D TILT */}
        <div
          className="p-6 pt-2 max-h-[380px] overflow-y-auto flex flex-col gap-3"
          id="tilt-cards-container"
        >
          {filteredCandidates.map((device) => {
            const isCurrentlyInActiveSlot = activeSlots.some(
              (s) => s.slug === device.slug
            );
            return (
              <div
                key={device.slug}
                onClick={() => {
                  onSlotChange(selectedSlotIndex, device);
                }}
                className="tilt-card p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-surface-container-highest hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer shadow-lg"
              >
                <div className="tilt-card-glare" />

                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-14 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    {device.image ? (
                      <img
                        alt={device.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        src={device.image}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[32px] text-primary group-hover:scale-110 transition-transform">
                        {device.icon || "smartphone"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[17px] font-bold text-on-surface truncate">
                        {device.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">
                        {device.score} Skor
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-outline text-[11px] truncate">
                        {device.camera}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-on-surface-variant flex-wrap">
                      <span>{device.chipset}</span>
                      <span>·</span>
                      <span>{device.battery}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-container-highest relative z-10">
                  <div className="flex flex-col text-left sm:text-right">
                    <span className="text-[17px] font-extrabold text-tertiary">
                      {formatPrice(device.price)}
                    </span>
                    <span className="text-[11px] text-outline">
                      En Ucuz: {device.store}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlotChange(selectedSlotIndex, device);
                    }}
                    className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all shadow-md flex items-center gap-1.5 shimmer-button cursor-pointer ${
                      isCurrentlyInActiveSlot
                        ? "bg-surface-container-highest text-outline hover:text-white"
                        : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary shadow-primary-container/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isCurrentlyInActiveSlot ? "check" : "add_task"}
                    </span>
                    <span>
                      {isCurrentlyInActiveSlot
                        ? "Yuvada Mevcut"
                        : "Bu Yuvaya Seç"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL FOOTER ACTION BAR */}
        <div className="p-6 border-t border-surface-container-highest bg-surface-container/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-surface-container-highest">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span className="text-[11px] font-semibold text-on-surface">
                Seçili: {activeSlots.length} / 4 Cihaz Dolu
              </span>
            </div>
            <span className="text-[12px] text-outline hidden md:inline">
              Değişiklikler anlık telemetri matrisine yansıtılacak.
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              className="px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-[14px] font-semibold transition-colors border border-surface-container-highest cursor-pointer"
              onClick={onClose}
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary text-[14px] font-semibold transition-all shadow-lg shadow-primary-container/25 shimmer-button flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                done_all
              </span>
              <span>Karşılaştırmayı Güncelle &amp; Göster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
