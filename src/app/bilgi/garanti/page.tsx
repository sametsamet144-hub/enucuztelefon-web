import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Telefon Garanti Sorgulama ve Tüketici Hakları - EnUcuzTelefon.com",
  description: "Apple, Samsung, Xiaomi resmi garanti sorgulama bağlantıları, 2 yıl yasal garanti süresi, fatura şartı ve servis hakları rehberi.",
};

export default function GarantiPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/bilgi" className="hover:text-white">Bilgi & Destek</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Garanti Sorgulama</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Telefon Garanti Sorgulama ve Yasal Haklar
          </h1>
          <p className="text-slate-300 text-base">
            Türkiye&apos;de satın alınan tüm cep telefonlarında 2 yıl yasal garanti zorunludur. Markanızın resmi garanti sorgulama ekranına ulaşın.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Önemli Hatırlatma:</strong> Garanti sorgulaması yalnızca telefon üreticisinin kendi resmi servis sistemleri üzerinden yapılabilir. Aşağıda Türkiye&apos;deki yetkili sorgulama adresleri listelenmiştir.
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900">Resmi Marka Garanti Sorgulama Portalları</h2>

          <div className="space-y-3">
            <a
              href="https://checkcoverage.apple.com/tr/tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-colors group"
            >
              <div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-sky-600">
                  Apple Kapsam ve Garanti Kontrolü
                </div>
                <div className="text-xs text-slate-500">checkcoverage.apple.com — iPhone Seri Numarası ile sorgulama</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
            </a>

            <a
              href="https://www.samsung.com/tr/support/your-service/warranty-check/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-colors group"
            >
              <div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-sky-600">
                  Samsung Türkiye Garanti Durumu Sorgulama
                </div>
                <div className="text-xs text-slate-500">samsung.com/tr — IMEI ile garanti kontrolü</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
            </a>

            <a
              href="https://www.mi.com/tr/service/imei/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-colors group"
            >
              <div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-sky-600">
                  Xiaomi / Redmi / POCO Doğrulama
                </div>
                <div className="text-xs text-slate-500">mi.com/tr/service — Orijinal ürün ve garanti kontrolü</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
            </a>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Tüketici Olarak Yasal Haklarınız
            </h3>
            <ul className="text-xs space-y-2 text-slate-600">
              <li>• <strong>20 İş Günü Süresi:</strong> Servise verilen telefonun azami tamir süresi 20 iş günüdür. Aşılması halinde bedel iadesi veya sıfır cihazla değişim talep edebilirsiniz.</li>
              <li>• <strong>Yedek Cihaz Hakkı:</strong> Tamir süresi 10 iş gününü geçerse yetkili servis geçici bir telefon tahsis etmekle yükümlüdür.</li>
              <li>• <strong>Fatura Saklama:</strong> Fatura üzerinde IMEI numarasının yazılı olması, garanti uyuşmazlıklarında yasal güvencenizdir.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
