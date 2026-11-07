import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CreditCard, ExternalLink, AlertCircle, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Yurt Dışı Telefon IMEI Kayıt İşlemleri - EnUcuzTelefon.com",
  description: "Yolcu beraberi getirilen telefonların IMEI kayıt harcı ödemesi, e-Devlet üzerinden BTK kaydı, pasaport eşleştirme ve hat kısıtlaması kuralları.",
};

export default function ImeiKayitPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/bilgi" className="hover:text-white">Bilgi & Destek</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Yurt Dışı IMEI Kaydı</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Yurt Dışı Telefon IMEI Kayıt Rehberi
          </h1>
          <p className="text-slate-300 text-base">
            Yurt dışından yolcu beraberinde getirilen telefonların Türkiye&apos;de kapanmadan yasal olarak kullanılması için izlenmesi gereken adımlar.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Resmi Mercilere Yönlendirme:</strong> IMEI kayıt harcı Gelir İdaresi Başkanlığı&apos;na (GİB) ödenir ve kayıt başvurusu e-Devlet Kapısı üzerinden BTK sistemine yapılır. EnUcuzTelefon.com üzerinde kayıt veya ödeme işlemi yapılamaz.
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900">4 Adımda IMEI Kayıt Süreci</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm mb-1">1. 120 Günlük Süre ve Pasaport Girişi</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yurt dışından getirilen cihazın Türkiye&apos;ye giriş tarihinden itibaren en geç 120 gün içinde kaydedilmesi zorunludur. Kayıt yapacak kişinin son 1 yıl içinde ülkeye yurtdışı giriş damgası bulunmalıdır.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm mb-1">2. IMEI Harç Bedelinin Ödenmesi</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harç ödemesi Dijital Vergi Dairesi (GİB) üzerinden veya anlaşmalı bankalar aracılığıyla, pasaport sahibinin T.C. Kimlik Numarası ve cihazın 15 haneli IMEI numarası belirtilerek yapılır.
              </p>
              <a
                href="https://dijital.gib.gov.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 mt-2"
              >
                GİB Dijital Vergi Dairesi <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm mb-1">3. e-Devlet Üzerinden BTK Kaydı</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harç ödendikten sonra e-Devlet &quot;IMEI Kaydet&quot; hizmetine girerek pasaport/kimlik bilgileri, giriş tarihi ve IMEI numarası eşleştirilerek kayıt onaylanır.
              </p>
              <a
                href="https://www.turkiye.gov.tr/btk-imei-kaydet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 mt-2"
              >
                e-Devlet BTK IMEI Kaydet Hizmeti <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm mb-1">4. 3 Yıl Hat Eşleşmesi Kuralı</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mevzuat gereği kaydedilen telefon, ilk 3 takvim yılı boyunca yalnızca kaydı yapan kişinin T.C. Kimlik Numarasına kayıtlı GSM hatlarıyla çalışabilir; başkasının hattı takıldığında şebeke vermez.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
