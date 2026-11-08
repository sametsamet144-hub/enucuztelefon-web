"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, ShieldCheck, Truck, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { useEffect } from "react";
import { getPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice, resolveStoreOfferUrl } from "@/lib/utils";

export default function LiveStoreMatrixSection() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [activeSlug, setActiveSlug] = useState("");

  useEffect(() => {
    getPhones().then((p) => {
      if (p && p.length > 0) {
        setPhones(p);
        setActiveSlug(p[0].slug);
      }
    });
  }, []);

  const showcasePhones = phones.length > 0 ? [
    phones.find((p) => p.slug === "iphone-16-pro-max") || phones[0],
    phones.find((p) => p.slug === "samsung-galaxy-s25-ultra") || phones[1] || phones[0],
    phones.find((p) => p.slug === "samsung-galaxy-a55") || phones[2] || phones[0],
    phones.find((p) => p.slug === "poco-x6-pro") || phones[3] || phones[0],
  ] : [];

  const activePhone = showcasePhones.find((p) => p.slug === activeSlug) || showcasePhones[0] || null;

  if (!activePhone || showcasePhones.length === 0) return null;

  const storeRows = (activePhone.storesPrices && activePhone.storesPrices.length > 0)
    ? activePhone.storesPrices.map((sp) => ({
        store: sp.store,
        storeSlug: sp.storeSlug,
        seller: sp.sellerName || sp.store,
        price: sp.price,
        isLowest: sp.price === activePhone.lowestPrice,
        shipping: sp.shippingText || "Hızlı Teslimat",
        guarantee: sp.guaranteeText || "2 Yıl Resmi Türkiye Garantili",
        inStock: sp.isAvailable !== false,
        lastChecked: "Canlı",
        url: sp.url || "",
      }))
    : (activePhone.lowestPrice > 0 ? [{
        store: activePhone.lowestPriceStoreName || "Doğrulanmış Satıcı",
        storeSlug: "store",
        seller: "Resmi Distribütör",
        price: activePhone.lowestPrice,
        isLowest: true,
        shipping: "Hızlı Teslimat",
        guarantee: "2 Yıl Resmi Türkiye Garantili",
        inStock: true,
        lastChecked: "Canlı",
        url: activePhone.lowestPriceUrl || "",
      }] : []);

  if (storeRows.length === 0) return null;

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200">
              <Store className="h-3.5 w-3.5" />
              <span>Canlı Satıcı Fiyat Matrisi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aynı Telefon, Farklı Mağazalarda Kaç Para?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Doğrulanmış resmi mağazaların kargo, garanti ve canlı fiyat tablosu
            </p>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {showcasePhones.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setActiveSlug(p.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeSlug === p.slug
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Phone Focus Card */}
          <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Seçili Model
            </span>
            <div className="h-48 w-full flex items-center justify-center p-3 my-3">
              <PhoneImage src={activePhone.image} alt={activePhone.name} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">{activePhone.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{activePhone.brand} • 256GB / 5G</p>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-400">En Düşük Mağaza Fiyatı</div>
              <div className="text-2xl font-black text-slate-900 price-display mt-0.5">
                {formatPrice(activePhone.lowestPrice)}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>En ucuz mağaza ile en pahalı arasında {formatPrice(activePhone.highestPrice - activePhone.lowestPrice)} fark var</span>
              </div>
            </div>

            <Link
              href={`/telefon/${activePhone.slug}`}
              className="mt-5 block w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Modelin Tüm Özelliklerini İncele
            </Link>
          </div>

          {/* Right: Stores Comparison Table */}
          <div className="lg:col-span-8 overflow-x-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {storeRows.map((row, idx) => (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      row.isLowest ? "bg-emerald-50/40" : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Store Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-slate-800 text-base shrink-0">
                        {row.store.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{row.store}</span>
                          {row.isLowest && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              EN UCUZ FİYAT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3 text-sky-500" />
                            {row.shipping}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            {row.guarantee}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-lg font-black text-slate-900 price-display">
                          {formatPrice(row.price)}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center sm:justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{row.lastChecked}</span>
                        </div>
                      </div>

                      {row.url ? (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm ${
                            row.isLowest
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                              : "bg-slate-900 hover:bg-sky-600 text-white"
                          }`}
                        >
                          <span>Mağazaya Git</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-sm ${
                            row.isLowest
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span>Doğrulanmış Fiyat</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
