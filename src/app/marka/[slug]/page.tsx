import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Smartphone, ArrowRight, Star, SlidersHorizontal, Scale } from "lucide-react";
import { getBrand, getPhonesByBrand } from "@/lib/data";
import PhoneCard from "@/components/phone/PhoneCard";
import BrandLogo from "@/components/common/BrandLogo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: "Marka Bulunamadı - EnUcuzTelefon.com" };

  return {
    title: `${brand.name} Telefon Fiyatları ve Modelleri - EnUcuzTelefon.com`,
    description: `En ucuz ${brand.name} telefon modelleri, teknik özellikleri ve güncel mağaza fiyatları. ${brand.name} telefonları karşılaştırın.`,
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) {
    notFound();
  }

  const brandPhones = await getPhonesByBrand(brand.slug);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white py-12 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sky-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/markalar" className="hover:text-white transition-colors">Markalar</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-bold">{brand.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-32 rounded-2xl bg-white p-3 flex items-center justify-center shadow-xl shrink-0">
                <BrandLogo slug={brand.slug} name={brand.name} size={40} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  {brand.name} Telefonları ve En Ucuz Fiyatları
                </h1>
                <p className="text-sky-200 text-sm mt-1 max-w-2xl">
                  {brand.description || `${brand.name} akıllı telefon modellerini 16 farklı güvenilir mağazanın canlı fiyatlarıyla karşılaştırın.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl text-center">
                <span className="block text-2xl font-black text-white">{brandPhones.length}</span>
                <span className="text-xs text-sky-300 font-semibold">Aktif Model</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {brand.name} Akıllı Telefon Modelleri ({brandPhones.length})
          </h2>
          <Link
            href={`/telefonlar?brand=${brand.slug}`}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Filtreli Görünüme Git <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {brandPhones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brandPhones.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Bu markaya ait listelenmiş model bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
