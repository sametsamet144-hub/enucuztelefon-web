"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowRight, RotateCcw } from "lucide-react";
import { getPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneCard from "@/components/phone/PhoneCard";

type BudgetRange = "all" | "under-15k" | "15k-30k" | "30k-50k" | "above-50k";
type Purpose = "all" | "camera" | "gaming" | "battery" | "compact";

export default function InteractivePhoneFinder() {
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getPhones().then((p) => { if (p) setPhones(p); });
  }, []);
  const [budget, setBudget] = useState<BudgetRange>("all");
  const [purpose, setPurpose] = useState<Purpose>("all");

  const filteredPhones = useMemo(() => {
    return phones.filter((p) => {
      // Budget match
      if (budget === "under-15k" && p.lowestPrice >= 15000) return false;
      if (budget === "15k-30k" && (p.lowestPrice < 15000 || p.lowestPrice > 30000)) return false;
      if (budget === "30k-50k" && (p.lowestPrice < 30000 || p.lowestPrice > 50000)) return false;
      if (budget === "above-50k" && p.lowestPrice <= 50000) return false;

      // Purpose match
      if (purpose === "camera") {
        const hasHighMp = (p.specs?.camera?.mainCamera?.megapixels ?? 0) >= 48;
        const hasOis = p.specs?.camera?.mainCamera?.ois === true;
        const hasTele = !!p.specs?.camera?.telephoto;
        if (!hasHighMp && !hasOis && !hasTele) return false;
      }
      if (purpose === "gaming") {
        const antutu = p.specs?.performance?.antutuScore ?? 0;
        const ram = p.specs?.performance?.ram ?? 0;
        if (antutu < 800000 && ram < 8) return false;
      }
      if (purpose === "battery") {
        const cap = p.specs?.battery?.capacity ?? 0;
        if (cap < 5000) return false;
      }
      if (purpose === "compact") {
        const size = p.specs?.display?.size ?? 6.7;
        if (size > 6.4) return false;
      }

      return true;
    });
  }, [phones, budget, purpose]);

  const resetFilters = () => {
    setBudget("all");
    setPurpose("all");
  };

  const budgetOptions: { id: BudgetRange; label: string }[] = [
    { id: "all", label: "Tüm Bütçeler" },
    { id: "under-15k", label: "< 15.000 ₺ (Giriş)" },
    { id: "15k-30k", label: "15.000 - 30.000 ₺ (F/P)" },
    { id: "30k-50k", label: "30.000 - 50.000 ₺ (Üst Orta)" },
    { id: "above-50k", label: "50.000 ₺+ (Amiral)" },
  ];

  const purposeOptions: { id: Purpose; label: string }[] = [
    { id: "all", label: "Tüm Özellikler" },
    { id: "camera", label: "📸 En İyi Kamera & OIS" },
    { id: "gaming", label: "🎮 Oyun & Yüksek Hız" },
    { id: "battery", label: "🔋 5000+ mAh Batarya" },
    { id: "compact", label: "📱 Kompakt & Tek El" },
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full mb-2 border border-sky-200">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Akıllı Keşif Aracı</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bütçene ve İhtiyacına Göre Telefon Bul
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Bütçenizi ve kullanım amacınızı seçin; kriterlerinize en uygun modelleri anında listeleyelim.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm mb-8">
          <div className="space-y-4">
            {/* 1. Bütçe Seçimi */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Bütçe Aralığınız
              </div>
              <div className="flex flex-wrap gap-2">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBudget(opt.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      budget === opt.id
                        ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Kullanım Amacı */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Öncelikli Kullanım Amacınız
              </div>
              <div className="flex flex-wrap gap-2">
                {purposeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPurpose(opt.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      purpose === opt.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="font-bold text-slate-700">
              Bulunan Model:{" "}
              <span className="text-sky-600 font-extrabold">{filteredPhones.length} Adet</span>
            </div>
            {(budget !== "all" || purpose !== "all") && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-slate-500 hover:text-rose-500 inline-flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Filtreleri Sıfırla</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {filteredPhones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
            {filteredPhones.slice(0, 8).map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <p className="text-sm font-semibold text-slate-600">
              Bu filtre kriterlerine uygun telefon bulunamadı.
            </p>
            <button
              onClick={resetFilters}
              className="mt-3 px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow"
            >
              Tüm Telefonları Göster
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
