"use client";

import Link from "next/link";
import { ArrowRight, Globe, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { getBrands, getPhones } from "@/lib/data";
import type { Brand, Phone } from "@/types";
import BrandLogo from "@/components/common/BrandLogo";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";

export default function BrandShowcaseSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getBrands().then((b) => { if (b) setBrands(b); });
    getPhones().then((p) => { if (p) setPhones(p); });
  }, []);
  // Separate top 12 major visual showcase brands + remaining 18 brands
  const featuredBrands = brands.slice(0, 12);
  const moreBrands = brands.slice(12);

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-2 border border-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>30 Resmi Teknoloji Markası</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Görsel Marka Evreni &amp; Model Vitrinleri
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Her markanın öne çıkan telefon görsellerini, model sayılarını ve başlangıç fiyatlarını doğrudan keşfedin
            </p>
          </div>

          <Link
            href="/markalar"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>30 Markanın Tamamını İncele</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ─── TOP 12 BRANDS WITH FAN-OUT PHONE VISUALS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {featuredBrands.map((brand) => {
            const brandPhones = phones.filter(
              (p) => p.brandSlug === brand.slug || p.brand.toLowerCase() === brand.name.toLowerCase()
            );
            const displayPhones = brandPhones.length > 0 ? brandPhones.slice(0, 3) : phones.slice(0, 2);
            const lowestBrandPrice =
              brandPhones.length > 0
                ? Math.min(...brandPhones.map((p) => p.lowestPrice))
                : 11999;

            return (
              <Link
                key={brand.id}
                href={`/marka/${brand.slug}`}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-4 hover:border-sky-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Top Brand Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm">
                        <BrandLogo slug={brand.slug} name={brand.name} size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-sm group-hover:text-sky-600 transition-colors leading-none">
                          {brand.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                          <Globe className="w-2.5 h-2.5" /> {brand.country}
                        </span>
                      </div>
                    </div>

                    <span className="text-sky-700 bg-sky-50 border border-sky-200/60 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {brandPhones.length || brand.phoneCount} Model
                    </span>
                  </div>

                  {/* Multi-Phone Visual Showcase Stage inside the Brand Card */}
                  <div className="relative h-32 w-full rounded-2xl bg-gradient-to-br from-slate-100 via-sky-50/50 to-indigo-50/50 border border-slate-200/60 flex items-center justify-center p-2 my-2 overflow-hidden">
                    <div className="flex items-center justify-center -space-x-3">
                      {displayPhones.map((dp, idx) => (
                        <div
                          key={dp.id}
                          className={`w-16 h-24 p-1 bg-white rounded-xl border border-slate-200/80 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                            idx === 1 ? "z-10 scale-110 -translate-y-1" : "opacity-90"
                          }`}
                        >
                          <PhoneImage src={dp.image} alt={dp.name} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 font-medium">
                    {brandPhones[0]?.name || brand.description}
                  </p>
                </div>

                {/* Bottom Price & Action */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[9.5px] text-slate-400">Başlangıç Fiyatı:</div>
                    <div className="text-xs font-black text-slate-900">
                      {formatPrice(lowestBrandPrice)}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-sky-50 group-hover:bg-sky-600 text-sky-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ─── REMAINING 18 BRANDS VISUAL PILL GRID ─── */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Diğer Resmi Akıllı Telefon Markaları ({moreBrands.length} Marka)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2.5">
            {moreBrands.map((brand) => {
              const bp = phones.find(
                (p) => p.brandSlug === brand.slug || p.brand.toLowerCase() === brand.name.toLowerCase()
              );
              return (
                <Link
                  key={brand.id}
                  href={`/marka/${brand.slug}`}
                  className="group flex items-center gap-2.5 bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 rounded-2xl p-2 transition-all shadow-xs"
                >
                  <div className="w-9 h-10 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {bp ? (
                      <PhoneImage src={bp.image} alt={brand.name} />
                    ) : (
                      <BrandLogo slug={brand.slug} name={brand.name} size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 truncate">
                      {brand.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {brand.country}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
