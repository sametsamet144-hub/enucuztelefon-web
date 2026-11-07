import type { Metadata } from "next";
import Link from "next/link";
import { Tablet, ArrowRight, Star, TrendingDown, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Tabletler - EnUcuzTelefon.com",
  description: "En uygun fiyatlı tabletleri karşılaştır, en iyi tablet fiyatlarını bul.",
};

const TABLET_BRANDS = [
  { name: "Apple iPad", slug: "apple", count: 12 },
  { name: "Samsung Galaxy Tab", slug: "samsung", count: 18 },
  { name: "Xiaomi Pad", slug: "xiaomi", count: 8 },
  { name: "Huawei MatePad", slug: "huawei", count: 6 },
  { name: "Lenovo Tab", slug: "lenovo", count: 10 },
];

export default function TabletlerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-4">
            <Tablet className="w-4 h-4" />
            <span>İkincil Kategori</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Tablet Fiyatları</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Tablet modellerini karşılaştır, en uygun fiyatları bul. 
            Bu kategori yakında genişletilecektir.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/telefonlar" className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              Telefonlara Git <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/karsilastir" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Karşılaştır
            </Link>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Marka Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tablet Markaları</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {TABLET_BRANDS.map((brand) => (
              <div key={brand.slug} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-sky-300 hover:shadow-md transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Tablet className="w-6 h-6 text-sky-600" />
                </div>
                <div className="font-semibold text-gray-900 text-sm">{brand.name}</div>
                <div className="text-xs text-gray-500 mt-1">{brand.count} model</div>
              </div>
            ))}
          </div>
        </div>

        {/* Yakında Banner */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tablet Kategorisi Yakında Genişliyor</h3>
          <p className="text-gray-600 mb-6">
            Tablet fiyat karşılaştırma, detaylı inceleme ve teknik özellik sayfaları çok yakında hazır olacak.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />Tablet incelemeleri</div>
            <div className="flex items-center gap-1"><TrendingDown className="w-4 h-4 text-green-500" />Fiyat takibi</div>
            <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-orange-500" />Karşılaştırma</div>
          </div>
        </div>

        {/* Telefon Önerisi */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Önce telefon mu arıyorsunuz?</p>
          <Link href="/telefonlar" className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition-colors">
            Telefon kategorisine git <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
