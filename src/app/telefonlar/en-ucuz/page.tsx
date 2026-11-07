import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, Shield, Clock, Tag } from "lucide-react";
import { getCheapestPhones } from "@/lib/data";
import PhoneCard from "@/components/phone/PhoneCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "En Ucuz Telefonlar 2026 - EnUcuzTelefon.com",
  description: "Türkiye'deki en ucuz telefonları keşfet. 50+ mağazadan fiyat karşılaştırması ile en uygun telefonu bul.",
};

export default async function EnUcuzTelefonlarPage() {
  const cheapestPhones = await getCheapestPhones(50);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sky-200 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefonlar" className="hover:text-white transition-colors">Telefonlar</Link>
            <ChevronRight className="w-4 h-4" />
            <span>En Ucuz Telefonlar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">💰 En Ucuz Telefonlar ve Fırsatlar</h1>
          <p className="text-sky-100 text-base max-w-2xl mb-6">
            Bütçe dostu, fiyat/performans canavarı telefon modelleri. Fiyatlar günlük olarak 50+ mağazadan taranarak güncellenmektedir.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Canlı fiyat takibi</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Doğrulanmış resmi satıcılar</span>
            </div>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            En Düşük Fiyattan Sıralı Modeller ({cheapestPhones.length})
          </h2>
          <Link href="/telefonlar" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            Filtreli Arama Yap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cheapestPhones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cheapestPhones.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Model listesi yükleniyor veya henüz model bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
