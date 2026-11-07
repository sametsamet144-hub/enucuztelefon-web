"use client";

import Link from "next/link";
import { Camera, Gamepad2, BatteryCharging, Zap, ArrowRight, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { getPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneCard from "@/components/phone/PhoneCard";

type CuratedCat = "camera" | "gaming" | "battery" | "value";

export default function CategoryCuratedSection() {
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getPhones().then((p) => { if (p) setPhones(p); });
  }, []);
  const [activeCat, setActiveCat] = useState<CuratedCat>("camera");

  const categories = [
    {
      id: "camera" as CuratedCat,
      title: "📸 Kamera Şampiyonları",
      desc: "DXOMARK zirvesi, 1 inç sensör, 200 MP ve 5x-10x periskop zoom lensli modeller",
      badge: "Kamera Odaklı",
      phoneSlugs: [
        "huawei-pura-70-ultra",
        "iphone-16-pro-max",
        "samsung-galaxy-s25-ultra",
        "vivo-x200-pro",
        "xiaomi-15-pro",
        "honor-magic-7-pro",
      ],
    },
    {
      id: "gaming" as CuratedCat,
      title: "🎮 En Güçlü Oyun Telefonları",
      desc: "2 Milyon+ AnTuTu skoru, 144Hz-165Hz ekran ve gelişmiş sıvı soğutma sistemi",
      badge: "Maksimum Performans",
      phoneSlugs: [
        "asus-rog-phone-8-pro",
        "redmagic-9s-pro",
        "iqoo-13-5g",
        "poco-f7-pro",
        "oneplus-13",
        "xiaomi-15-pro",
      ],
    },
    {
      id: "battery" as CuratedCat,
      title: "🔋 Batarya & Hızlı Şarj Devleri",
      desc: "5500-6500 mAh yüksek kapasiteli silikon-karbon piller ve 80W-120W süper hızlı şarj",
      badge: "2 Güne Varan Pil",
      phoneSlugs: [
        "realme-gt-7-pro",
        "redmi-note-14-pro",
        "xiaomi-15-pro",
        "oneplus-13",
        "vivo-x200-pro",
        "honor-magic-7-pro",
      ],
    },
    {
      id: "value" as CuratedCat,
      title: "⚡ Fiyat / Performans Kralları",
      desc: "Uygun bütçeyle amiral gemisi özelliklerini sunan Türkiye pazarının en popüler modelleri",
      badge: "En Yüksek F/P",
      phoneSlugs: [
        "samsung-galaxy-a56",
        "redmi-note-13-pro-5g",
        "poco-x6-pro",
        "iphone-13",
        "cmf-phone-1",
        "samsung-galaxy-a35",
      ],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeCat) || categories[0];
  const curatedPhones = currentCategory.phoneSlugs
    .map((slug) => phones.find((p) => p.slug.includes(slug)))
    .filter(Boolean) as Phone[];

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-3 py-1 rounded-full mb-2 border border-sky-200">
              <Award className="h-3.5 w-3.5" />
              <span>Uzman Seçimleri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kullanım Amacınıza Göre En İyiler
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Kamera, oyun hızı veya batarya ömrü gibi kriterlerinize göre uzmanların seçtiği zirve modeller
            </p>
          </div>

          <Link
            href="/rehber"
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
          >
            <span>Tüm Satın Alma Rehberleri</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCat(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeCat === cat.id
                  ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-100"
                  : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-sm font-bold text-slate-900">{cat.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.desc}</div>
            </button>
          ))}
        </div>

        {/* Curated Grid (6 phones per row) */}
        <div
          className="grid gap-3.5 animate-in fade-in duration-200"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
            gap: "14px",
          }}
        >
          {curatedPhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      </div>
    </section>
  );
}
