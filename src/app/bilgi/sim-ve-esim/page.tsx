import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Smartphone, QrCode, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "SIM ve eSIM Kullanımı Rehberi - EnUcuzTelefon.com",
  description: "Fiziksel SIM kart ile dijital eSIM arasındaki farklar, Türkiye'deki operatörlerde eSIM aktivasyonu, QR kod ile kurulum ve çift hat kullanımı.",
};

export default function SimEsimPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/bilgi" className="hover:text-white">Bilgi & Destek</Link>
            <ChevronRight className="w-4 h-4" />
            <span>SIM ve eSIM</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            SIM ve eSIM Kullanımı Rehberi
          </h1>
          <p className="text-slate-300 text-base">
            Geleneksel plastik nano-SIM kartlardan dijital eSIM teknolojisine geçiş adımları ve avantajları.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">eSIM Nedir ve Nasıl Çalışır?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            eSIM (Embedded SIM), doğrudan telefonunuzun anakartına entegre edilmiş küçük bir dijital çiptir. Plastik bir kart takıp çıkarmanıza gerek kalmadan, operatörünüzün verdiği QR kodu kameranızla taratarak hattınızı saniyeler içinde aktif hale getirebilirsiniz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                eSIM Avantajları
              </h3>
              <ul className="text-xs space-y-2 text-slate-600">
                <li>• Kart kaybolması veya aşınması riski yoktur.</li>
                <li>• Cihaz çalındığında hırsız kartı çıkarıp atamaz, konum takibi sürer.</li>
                <li>• Tek telefonda hem fiziksel SIM hem eSIM ile çift hat (iş ve özel) kullanılabilir.</li>
                <li>• Yurt dışı seyahatlerinde yerel veri paketleri QR kodla anında yüklenebilir.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-sky-500" />
                Nasıl Kurulur?
              </h3>
              <ol className="text-xs space-y-2 text-slate-600 list-decimal pl-4">
                <li>Operatörünüzün (Turkcell, Vodafone, Türk Telekom) bayisinden veya uygulamasından eSIM talep edin.</li>
                <li>Ayarlar &gt; Hücresel / Mobil Ağ &gt; eSIM Ekle seçeneğine dokunun.</li>
                <li>Operatörün sağladığı QR kodu taratın.</li>
                <li>Profil indirilince hattınız anında kullanıma açılır.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
