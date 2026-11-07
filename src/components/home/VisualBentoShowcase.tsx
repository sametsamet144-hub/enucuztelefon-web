"use client";

import Link from "next/link";
import {
  Sparkles,
  Camera,
  Gamepad2,
  BatteryCharging,
  Layers,
  Award,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getPhones as fetchPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";

export default function VisualBentoShowcase() {
  const [phoneList, setPhoneList] = useState<Phone[]>([]);

  useEffect(() => {
    fetchPhones().then((p) => { if (p) setPhoneList(p); });
  }, []);

  const getPhones = (slugs: string[]) =>
    slugs
      .map((s) => phoneList.find((p) => p.slug.includes(s)))
      .filter(Boolean) as Phone[];

  const foldables = getPhones([
    "huawei-mate-xt-ultimate",
    "samsung-galaxy-z-fold-6",
    "honor-magic-v3",
    "motorola-razr-50-ultra",
  ]);

  const cameraKings = getPhones([
    "vivo-x200-pro",
    "huawei-pura-70-ultra",
    "xiaomi-15-pro",
    "honor-magic-7-pro",
  ]);

  const gamingBeasts = getPhones([
    "asus-rog-phone-8-pro",
    "redmagic-9s-pro",
    "iqoo-13-5g",
    "poco-f7-pro",
  ]);

  const batteryGiants = getPhones([
    "realme-gt-7-pro",
    "redmi-note-14-pro",
    "oneplus-13",
    "xiaomi-15-pro",
  ]);

  const budgetKings = getPhones([
    "samsung-galaxy-a35",
    "redmi-note-13-pro-5g",
    "cmf-phone-1",
    "poco-m6-pro",
  ]);

  return (
    <section className="py-12 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Ambient Visual Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full mb-2 border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Özel Görsel Koleksiyonlar</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Teknoloji Harikası Telefon Dünyaları
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Katlanabilir dev ekranlardan 200 MP ZEISS kameralara ve 165Hz fanlı oyuncu telefonlarına kadar görsel keşif vitrini
            </p>
          </div>

          <Link
            href="/telefonlar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all shrink-0"
          >
            <span>Tüm Koleksiyonu Aç</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ─── TOP ROW: 2 GIANT VISUAL SHOWCASE BANNERS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* BENTO 1: Foldable & Tri-Fold Revolution */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-fuchsia-300 bg-fuchsia-500/20 px-3 py-1 rounded-full border border-fuchsia-400/30 mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  Fold • Flip • Tri-Fold Devrimi
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Katlanabilir Süper Telefonlar
                </h3>
                <p className="text-xs text-indigo-200 mt-1">
                  Cebe sığan 10.2 inç üç katlı tablet ekranlar ve ultra ince titanyum menteşeli modeller
                </p>
              </div>
              <Link
                href="/telefonlar?q=Fold"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white shrink-0 flex items-center gap-1"
              >
                İncele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Foldable Phones Visual Stage */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              {foldables.map((fp) => (
                <Link
                  key={fp.id}
                  href={`/telefon/${fp.slug}`}
                  className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-fuchsia-400 rounded-2xl p-3 flex flex-col items-center text-center transition-all hover:-translate-y-1"
                >
                  <div className="h-32 w-full flex items-center justify-center p-1 group-hover:scale-110 transition-transform duration-300">
                    <PhoneImage src={fp.image} alt={fp.name} />
                  </div>
                  <span className="text-[10px] font-bold text-fuchsia-300 mt-2">
                    {fp.specs.display.size}&quot; {fp.specs.display.refreshRate}Hz
                  </span>
                  <div className="text-xs font-black text-white line-clamp-1 mt-0.5">
                    {fp.name}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-400 mt-1">
                    {formatPrice(fp.lowestPrice)}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BENTO 2: 200MP & Leica/ZEISS Camera Kings */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 border border-rose-500/30 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-400/30 mb-2">
                  <Camera className="w-3.5 h-3.5" />
                  DXOMARK &amp; Profesyonel Lensler
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  200 MP Periskop &amp; Leica / ZEISS Kralları
                </h3>
                <p className="text-xs text-rose-200 mt-1">
                  1 inç dev sensör, 200 MP telefoto zoom ve DSLR kalitesinde gece portreleri
                </p>
              </div>
              <Link
                href="/telefonlar?q=Pro"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white shrink-0 flex items-center gap-1"
              >
                İncele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Camera Kings Visual Stage */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              {cameraKings.map((cp) => (
                <Link
                  key={cp.id}
                  href={`/telefon/${cp.slug}`}
                  className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-rose-400 rounded-2xl p-3 flex flex-col items-center text-center transition-all hover:-translate-y-1"
                >
                  <div className="h-32 w-full flex items-center justify-center p-1 group-hover:scale-110 transition-transform duration-300">
                    <PhoneImage src={cp.image} alt={cp.name} />
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 mt-2">
                    {cp.specs.camera.mainCamera.megapixels}MP OIS Kamera
                  </span>
                  <div className="text-xs font-black text-white line-clamp-1 mt-0.5">
                    {cp.name}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-400 mt-1">
                    {formatPrice(cp.lowestPrice)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM ROW: 3 VISUAL BENTO POSTERS (GAMING, BATTERY, F/P) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BENTO 3: Gaming Beasts */}
          <div className="rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 border border-red-500/30 p-5 shadow-xl flex flex-col justify-between">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-300 bg-red-500/20 px-2.5 py-1 rounded-full border border-red-400/30 mb-2">
                <Gamepad2 className="w-3.5 h-3.5" />
                165Hz &amp; Aktif Soğutma Fanlı
              </span>
              <h3 className="text-lg font-black text-white">
                Oyun &amp; Performans Canavarları
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {gamingBeasts.map((gp) => (
                <Link
                  key={gp.id}
                  href={`/telefon/${gp.slug}`}
                  className="group bg-white/10 hover:bg-white/15 border border-white/10 hover:border-red-400 rounded-2xl p-2.5 flex items-center gap-2.5 transition-all"
                >
                  <div className="w-14 h-16 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneImage src={gp.image} alt={gp.name} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-orange-300">
                      {gp.specs.display.refreshRate}Hz • {gp.specs.performance.ram}GB
                    </div>
                    <div className="text-xs font-black text-white truncate">
                      {gp.name}
                    </div>
                    <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                      {formatPrice(gp.lowestPrice)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BENTO 4: 6000+ mAh Battery Giants */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-5 shadow-xl flex flex-col justify-between">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30 mb-2">
                <BatteryCharging className="w-3.5 h-3.5" />
                6000 - 6500 mAh &amp; 120W Şarj
              </span>
              <h3 className="text-lg font-black text-white">
                Silikon-Karbon Batarya Devleri
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {batteryGiants.map((bp) => (
                <Link
                  key={bp.id}
                  href={`/telefon/${bp.slug}`}
                  className="group bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-400 rounded-2xl p-2.5 flex items-center gap-2.5 transition-all"
                >
                  <div className="w-14 h-16 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneImage src={bp.image} alt={bp.name} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-emerald-300">
                      {bp.specs.battery.capacity}mAh • {bp.specs.battery.wiredCharging}W
                    </div>
                    <div className="text-xs font-black text-white truncate">
                      {bp.name}
                    </div>
                    <div className="text-xs font-extrabold text-amber-300 mt-0.5">
                      {formatPrice(bp.lowestPrice)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BENTO 5: Best Value / Budget Kings */}
          <div className="rounded-3xl bg-gradient-to-br from-sky-950 via-slate-900 to-blue-950 border border-sky-500/30 p-5 shadow-xl flex flex-col justify-between">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-full border border-sky-400/30 mb-2">
                <Award className="w-3.5 h-3.5" />
                7.500 ₺ - 15.000 ₺ Arası
              </span>
              <h3 className="text-lg font-black text-white">
                Fiyat / Performans Şampiyonları
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {budgetKings.map((vp) => (
                <Link
                  key={vp.id}
                  href={`/telefon/${vp.slug}`}
                  className="group bg-white/10 hover:bg-white/15 border border-white/10 hover:border-sky-400 rounded-2xl p-2.5 flex items-center gap-2.5 transition-all"
                >
                  <div className="w-14 h-16 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PhoneImage src={vp.image} alt={vp.name} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-sky-300">
                      {vp.specs.camera.mainCamera.megapixels}MP • {vp.specs.display.refreshRate}Hz
                    </div>
                    <div className="text-xs font-black text-white truncate">
                      {vp.name}
                    </div>
                    <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                      {formatPrice(vp.lowestPrice)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
