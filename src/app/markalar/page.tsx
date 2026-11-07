import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Smartphone, ArrowRight, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { getBrands, getPhones } from "@/lib/data";
import BrandLogo from "@/components/common/BrandLogo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tüm Telefon Markaları ve Modelleri - EnUcuzTelefon.com",
  description: "Apple, Samsung, Xiaomi, POCO, Vivo, Realme, Nothing, Huawei, Honor ve Türkiye pazarındaki tüm akıllı telefon markaları ve modelleri.",
};

export default async function BrandsPage() {
  const [brands, phones] = await Promise.all([
    getBrands(),
    getPhones(),
  ]);

  // Compute actual counts from real phones data
  const brandList = brands.map((b) => {
    const count = phones.filter((p) => p.brandSlug === b.slug || p.brand.toLowerCase() === b.name.toLowerCase()).length;
    return {
      ...b,
      phoneCount: count > 0 ? count : b.phoneCount || 0,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sky-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Markalar</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full mb-3 border border-sky-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resmi Distribütör Garantili Üreticiler</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Akıllı Telefon Markaları ({brandList.length} Marka)
          </h1>
          <p className="text-sky-200 text-base max-w-2xl">
            Türkiye&apos;de satışı yapılan resmi distribütör garantili tüm telefon markalarını inceleyin, model kataloglarına ve en ucuz mağaza fiyatlarına tek tıkla ulaşın.
          </p>
        </div>
      </div>

      {/* Brand Grid with Authentic Vector Logos */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brandList.map((brand) => (
            <Link
              key={brand.id}
              href={`/marka/${brand.slug}`}
              className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Brand Vector Logo Box */}
                  <div className="h-16 w-28 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-2.5 shadow-sm group-hover:scale-105 group-hover:border-sky-300 transition-all">
                    <BrandLogo slug={brand.slug} name={brand.name} size={32} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
                    {brand.phoneCount} Model
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                  {brand.name}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                  {brand.description || `${brand.name} güncel modelleri ve en ucuz fiyatları.`}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                <span>Modelleri İncele</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
