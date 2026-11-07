import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | EnUcuzTelefon.com",
  description:
    "EnUcuzTelefon.com fiyat karşılaştırma ve telefon veri platformu kullanım koşulları ve yasal sorumluluk beyanı.",
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-medium">Kullanım Koşulları</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Hizmet Sözleşmesi
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Kullanım Koşulları ve Yasal Uyarı
              </h1>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            <strong>EnUcuzTelefon.com</strong> platformunu ziyaret ederek ve sunduğumuz fiyat karşılaştırma, teknik özellik inceleme ve fiyat takip araçlarını kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Hizmetin Kapsamı ve Tek Gerçek Veri Kaynağı İlkemiz
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              EnUcuzTelefon.com, Türkiye&apos;de faaliyet gösteren çevrimiçi mağazaların cep telefonu fiyatlarını, stok durumlarını ve ürün özelliklerini 2 saatlik periyodik veri toplama motoru ile derleyen bağımsız bir karşılaştırma platformudur. Sitemiz doğrudan satış veya ödeme tahsilatı yapmaz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              2. Fiyat ve Stok Bilgilerinin Doğruluğu
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Mağaza fiyatları ve stok durumları anlık kampanyalar nedeniyle değişiklik gösterebilir. Satın alma işlemi öncesinde yönlendirildiğiniz mağazanın sepet/ödeme sayfasındaki nihai fiyat, kargo ve garanti koşullarını kontrol etmek kullanıcının sorumluluğundadır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              3. Fikri Mülkiyet Hakları
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Platformda yer alan tüm yazılım altyapısı, fiyat geçmişi analizleri, karşılaştırma algoritmaları ve özgün inceleme içerikleri EnUcuzTelefon.com&apos;a aittir. Marka adları ve ürün görselleri ilgili üreticilerin tescilli markalarıdır.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-sky-600">
            <Link href="/gizlilik-politikasi" className="hover:underline">Gizlilik Politikası</Link>
            <Link href="/cerez-politikasi" className="hover:underline">Çerez Politikası</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
