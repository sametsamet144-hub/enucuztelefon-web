import type { Metadata } from "next";
import Link from "next/link";
import { Store, ShieldCheck, Truck, ExternalLink, ChevronRight, Star, CheckCircle2 } from "lucide-react";
import type { StoreInfo } from "@/types";
import { getPhones, getStores } from "@/lib/data";
import { resolveStoreOfferUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anlaşmalı ve Takip Edilen Mağazalar | EnUcuzTelefon.com",
  description:
    "EnUcuzTelefon.com tarafından fiyatları 2 saatte bir otomatik karşılaştırılan güvenilir teknoloji mağazaları ve resmi pazaryerleri.",
};

export default async function StoresPage() {
  const [apiStores, phones] = await Promise.all([
    getStores(),
    getPhones(),
  ]);
  const storeList: StoreInfo[] = apiStores || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-medium">Mağazalar</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                  Doğrulanmış Mağaza Ağı
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Takip Edilen Resmi Mağazalar ve Pazaryerleri
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{storeList.length} Aktif Mağaza • {phones.length} Telefon Modeli</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4 leading-relaxed">
            EnUcuzTelefon.com veri toplama motoru, aşağıda yer alan Türkiye&apos;nin önde gelen e-ticaret platformları ve teknoloji perakendecilerindeki cep telefonu fiyatlarını, stok durumlarını ve resmi distribütör garantisi bilgilerini düzenli olarak kontrol eder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {storeList.map((store) => {
            const activeOfferCount = phones.filter((p) =>
              p.storesPrices.some(
                (sp) =>
                  sp.storeSlug === store.slug ||
                  sp.store.toLowerCase() === store.name.toLowerCase()
              )
            ).length;
            const storeUrl =
              store.website ||
              resolveStoreOfferUrl(store.slug, store.name, "cep telefonu");

            return (
              <div
                key={store.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider">
                        {store.typeLabel}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900">{store.name}</h2>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {store.distributorGuarantee
                            ? "Resmi Türkiye Garantili Satış"
                            : "Doğrulanmış Mağaza"}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {store.reliabilityScore}/10
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block">Doğrulanmış Fiyat</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {activeOfferCount > 0
                          ? `${activeOfferCount} Aktif Model (${store.verifiedPriceCount.toLocaleString("tr-TR")} Kayıt)`
                          : `${store.verifiedPriceCount.toLocaleString("tr-TR")} Kayıt`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Kargo & Teslimat</span>
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                        <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{store.shippingInfo}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href="/telefonlar"
                    className="text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors"
                  >
                    Fiyatları Karşılaştır →
                  </Link>
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <span>Mağazayı Ziyaret Et</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
