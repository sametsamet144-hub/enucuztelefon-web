import type { Metadata } from "next";
import Link from "next/link";
import { Star, Shield, ArrowRight, ChevronRight, Camera, Gamepad2, Battery, Cpu } from "lucide-react";
import { getPhones } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import PhoneImage from "@/components/phone/PhoneImage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detaylı Telefon İncelemeleri ve Test Sonuçları - EnUcuzTelefon.com",
  description: "En yeni amiral gemisi ve orta segment telefonların tarafsız incelemeleri: Kamera puanları, oyun testleri, pil ömrü ve artılar/eksiler.",
};

export default async function ReviewsListPage() {
  const allPhones = await getPhones();
  const reviewedPhones = allPhones.slice(0, 9);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-violet-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefon-rehberi" className="hover:text-white transition-colors">Telefon Rehberi</Link>
            <ChevronRight className="w-4 h-4" />
            <span>İncelemeler</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Detaylı Telefon İncelemeleri & Testleri
          </h1>
          <p className="text-violet-200 text-base max-w-2xl">
            Laboratuvar ve günlük kullanım testleri: Kamera performans puanları, FPS oyun değerleri, ekran parlaklık ölçümleri ve batarya dayanıklılık süreleri.
          </p>
        </div>
      </div>

      {/* Grid of Reviews */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewedPhones.map((phone) => (
            <div
              key={phone.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md">
                    {phone.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{phone.rating || 9.1} / 10</span>
                  </div>
                </div>

                <div className="h-44 bg-slate-50 rounded-xl flex items-center justify-center p-3 mb-4 border border-slate-100">
                  <PhoneImage src={phone.image} alt={phone.name} className="h-full w-full max-h-[140px] object-contain drop-shadow" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{phone.name}</h3>
                <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {phone.specs?.performance?.chipset ? `${phone.specs.performance.chipset} işlemci, ` : ""}
                  {phone.specs?.camera?.mainCamera?.megapixels ? `${phone.specs.camera.mainCamera.megapixels} MP ana kamera sensörü, ` : ""}
                  {phone.specs?.battery?.capacity ? `${phone.specs.battery.capacity} batarya kapasitesi ile test edildi.` : ""}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg mb-4">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-violet-500" />
                    {phone.specs?.performance?.ram || "8 GB"} RAM
                  </span>
                  <span className="flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-500" />
                    {phone.specs?.battery?.capacity || "5000 mAh"}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">En Ucuz Fiyat</span>
                  <span className="text-base font-extrabold text-slate-900">{formatPrice(phone.lowestPrice)}</span>
                </div>
                <Link
                  href={`/telefon/${phone.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>İncelemeyi Oku</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
