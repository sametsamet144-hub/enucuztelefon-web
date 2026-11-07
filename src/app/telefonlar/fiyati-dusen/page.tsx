import type { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, ChevronRight, ArrowRight, Shield, Zap } from "lucide-react";
import { getPriceDroppedPhones } from "@/lib/data";
import PhoneCard from "@/components/phone/PhoneCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fiyatı Düşen Telefonlar 2026 - EnUcuzTelefon.com",
  description: "Son 24 saatte fiyatı düşen telefonları anlık takip et. En büyük indirim fırsatlarını kaçırma!",
};

export default async function FiyatiDusenPage() {
  const priceDroppingPhones = await getPriceDroppedPhones(50);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-rose-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefonlar" className="hover:text-white transition-colors">Telefonlar</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Fiyatı Düşenler</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            <TrendingDown className="w-4 h-4" />
            Canlı İndirim Takibi
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Son 24 Saatte Fiyatı Düşen Telefonlar
          </h1>
          <p className="text-rose-100 text-base max-w-2xl">
            Mağazalar arası fiyat dalgalanmalarını filtreleyip gerçek indirim oranlarını listeliyoruz.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            İndirime Giren Telefonlar ({priceDroppingPhones.length})
          </h2>
          <Link
            href="/fiyat-takibi"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            Fiyat Alarmı Kur <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {priceDroppingPhones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {priceDroppingPhones.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <TrendingDown className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Şu an kayıtlı bir indirim bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
