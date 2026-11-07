import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ChevronRight, Settings, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Çerez (Cookie) Politikası | EnUcuzTelefon.com",
  description:
    "EnUcuzTelefon.com çerez kullanımı, yerel depolama (favoriler ve karşılaştırma listesi) tercihleri hakkında bilgilendirme.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-medium">Çerez Politikası</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Çerez & Yerel Depolama
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Çerez (Cookie) Politikası
              </h1>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            <strong>EnUcuzTelefon.com</strong> üzerinde size daha hızlı ve kişiselleştirilmiş bir deneyim sunabilmek için zorunlu çerezler ve tarayıcı yerel depolama (LocalStorage) teknolojileri kullanılmaktadır.
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-sky-600" />
              1. Kullandığımız Çerez ve Yerel Depolama Türleri
            </h2>
            <ul className="list-disc pl-5 text-slate-600 text-sm space-y-2">
              <li>
                <strong>Zorunlu İşlevsel Depolama:</strong> Seçtiğiniz favori telefonların, karşılaştırma listenizin ve oluşturduğunuz fiyat alarmlarının tarayıcınızda korunmasını sağlar.
              </li>
              <li>
                <strong>Performans ve Önbellek:</strong> Güncel mağaza fiyatlarının ve filtre tercihlerinizin sayfa geçişlerinde hızla yüklenmesine yardımcı olur.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              2. Çerez Tercihlerini Yönetme
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tarayıcınızın ayarlarından dilediğiniz zaman çerezleri ve site verilerini temizleyebilir veya engelleyebilirsiniz.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-sky-600">
            <Link href="/gizlilik-politikasi" className="hover:underline">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="hover:underline">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
