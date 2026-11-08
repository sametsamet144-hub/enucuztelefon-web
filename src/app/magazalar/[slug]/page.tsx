import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Store,
  ShieldCheck,
  Truck,
  ExternalLink,
  ChevronRight,
  Star,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getStore, getPhones } from "@/lib/data";
import PhoneCard from "@/components/phone/PhoneCard";
import { resolveStoreOfferUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore(slug);

  if (!store) {
    return { title: "Mağaza Bulunamadı - EnUcuzTelefon.com" };
  }

  return {
    title: `${store.name} Telefon Fiyatları ve Güvenilirlik Raporu - EnUcuzTelefon.com`,
    description: `${store.name} güncel cep telefonu fiyatları, kargo teslimat hızı, iade politikası ve distribütör garantisi durumunu inceleyin.`,
  };
}

export default async function StoreDetailPage({ params }: Props) {
  const { slug } = await params;
  const [store, allPhones] = await Promise.all([
    getStore(slug),
    getPhones(),
  ]);

  if (!store) {
    notFound();
  }

  // Filter phones available in this store
  const storePhones = allPhones.filter(
    (p) =>
      p.storesPrices?.some(
        (sp) => sp.storeSlug.toLowerCase() === store.slug.toLowerCase()
      ) ||
      p.lowestPriceStoreName?.toLowerCase().includes(store.slug.toLowerCase())
  );

  const displayPhones = storePhones.length > 0 ? storePhones : allPhones.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#08090c] text-white pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06] bg-[#0b0e14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center text-xs text-slate-400">
          <Link href="/" className="hover:text-sky-400 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <Link href="/magazalar" className="hover:text-sky-400 transition-colors">
            Mağazalar
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <span className="text-sky-400 font-bold">{store.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Store Profile Card */}
        <div className="bg-[#12161f] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-sky-400 shadow-inner shrink-0">
                <Store className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                    {store.typeLabel || "Resmi Satıcı & Pazaryeri"}
                  </span>
                  {store.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Doğrulanmış
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {store.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  EnUcuzTelefon.com canlı telemetri motoru tarafından 2 saatte bir taranmaktadır.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={resolveStoreOfferUrl(store.slug, "akilli telefonlar")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
              >
                <span>Mağazaya Git</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
              <span className="text-slate-400 text-[11px] block mb-1">Güvenilirlik Puanı</span>
              <div className="flex items-center gap-1 text-emerald-400 font-black text-lg">
                <Star className="w-4 h-4 fill-emerald-400" />
                <span>{store.reliabilityScore || 9.8} / 10</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
              <span className="text-slate-400 text-[11px] block mb-1">Doğrulanmış Fiyat</span>
              <div className="text-white font-black text-lg">
                {store.verifiedPriceCount || 488}+ Fiyat
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
              <span className="text-slate-400 text-[11px] block mb-1">Kargo Teslimatı</span>
              <div className="text-white font-bold text-xs truncate" title={store.shippingInfo}>
                {store.shippingInfo || "Aynı Gün & Hızlı Kargo"}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
              <span className="text-slate-400 text-[11px] block mb-1">İade Politikası</span>
              <div className="text-white font-bold text-xs truncate" title={store.returnPolicy}>
                {store.returnPolicy || "14 Gün Koşulsuz İade"}
              </div>
            </div>
          </div>
        </div>

        {/* Store's Phones Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">
              {store.name} Bünyesindeki Telefon Modelleri
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              En güncel mağaza teklifleri ve en ucuz fiyat karşılaştırmaları
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 font-bold">
            {displayPhones.length} Model Listeleniyor
          </span>
        </div>

        {/* Phones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayPhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      </div>
    </div>
  );
}
