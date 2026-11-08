"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ArrowRight, Camera, Battery, Cpu, Sparkles, Tag } from "lucide-react";
import { getPhones, getPopularPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneCard from "@/components/phone/PhoneCard";

type WallTab = "all" | "flagship" | "camera" | "battery" | "budget" | "new";

export default function PopularPhonesGallery() {
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getPopularPhones(18).then((popular) => {
      if (popular && popular.length > 0) {
        setPhones(popular);
      } else {
        getPhones().then((p) => {
          if (p) setPhones(p);
        });
      }
    });
  }, []);

  const [activeTab, setActiveTab] = useState<WallTab>("all");

  const tabs: { id: WallTab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "all", label: "🔥 En Popüler Vitrin", icon: <Flame className="w-3.5 h-3.5" />, count: 18 },
    { id: "flagship", label: "💎 Amiral Gemileri (12GB+ RAM)", icon: <Cpu className="w-3.5 h-3.5" />, count: 18 },
    { id: "camera", label: "📸 108MP & 200MP Kameralılar", icon: <Camera className="w-3.5 h-3.5" />, count: 18 },
    { id: "battery", label: "🔋 5500+ mAh Dev Bataryalılar", icon: <Battery className="w-3.5 h-3.5" />, count: 18 },
    { id: "budget", label: "💰 20.000 ₺ Altı F/P Kralları", icon: <Tag className="w-3.5 h-3.5" />, count: 18 },
    { id: "new", label: "✨ 2025 / 2026 Yeni Çıkanlar", icon: <Sparkles className="w-3.5 h-3.5" />, count: 18 },
  ];

  const getFilteredWallPhones = () => {
    switch (activeTab) {
      case "flagship":
        return phones.filter((p) => (p.specs?.performance?.ram ?? 0) >= 12).slice(0, 18);
      case "camera":
        return [...phones]
          .sort(
            (a, b) =>
              (Number(b.specs?.camera?.mainMp || b.specs?.camera?.mainCamera?.megapixels) || 0) -
              (Number(a.specs?.camera?.mainMp || a.specs?.camera?.mainCamera?.megapixels) || 0)
          )
          .slice(0, 18);
      case "battery":
        return [...phones]
          .sort(
            (a, b) =>
              (Number(b.specs?.battery?.capacity) || 0) - (Number(a.specs?.battery?.capacity) || 0)
          )
          .slice(0, 18);
      case "budget":
        return phones
          .filter((p) => p.lowestPrice <= 22000)
          .sort((a, b) => a.lowestPrice - b.lowestPrice)
          .slice(0, 18);
      case "new":
        return phones.filter((p) => p.isNew).slice(0, 18);
      case "all":
      default:
        return phones.slice(0, 18);
    }
  };

  const wallPhones = getFilteredWallPhones();

  return (
    <section className="py-14 bg-white border-b border-slate-200 overflow-hidden">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-2 border border-amber-200">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>Büyük Görsel Telefon Duvarı</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popüler Telefonlar &amp; Canlı Mağaza Vitrini
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Kategorilere tıklayarak telefonların görsellerini, 4 temel donanım özelliğini, son 6 ayın en düşük fiyatını ve en ucuz 3 satıcıyı anında inceleyin
            </p>
          </div>

          <Link
            href="/telefonlar"
            className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-black inline-flex items-center gap-2 shadow-md transition-colors shrink-0"
          >
            <span>Tüm Modelleri Filtrele</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Visual Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-lg scale-[1.02]"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 18-Phone High-Density Visual Wall (6 per row on wide desktop) */}
        <div
          className="grid gap-3.5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {wallPhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      </div>
    </section>
  );
}
