import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckSquare, AlertTriangle, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "İkinci El Telefon Satın Alma Kontrol Listesi - EnUcuzTelefon.com",
  description: "İkinci el telefon alırken dolandırılmamak için dikkat etmeniz gerekenler: IMEI kontrolü, iCloud/Google kilidi, ekran orijinalliği, pil sağlığı ve donanım testleri.",
};

const CHECKLIST = [
  { step: "1. IMEI ve Kayıt Durumu", desc: "Telefon tuş takımından *#06# tuşlayarak çıkan IMEI ile e-Devlet BTK IMEI Sorgulama ekranındaki cihaz modelinin birebir aynı olduğunu teyit edin. 'Kayıt Dışı' veya 'Klonlanmış' uyarısı olan cihazları kesinlikle almayın." },
  { step: "2. iCloud / Google Hesap Kilidi", desc: "Cihazın önceki sahibinin Apple Kimliği veya Google hesabından tamamen çıkış yaptığından ve cihazın sıfırlanabildiğinden emin olun. Kilitli kalan telefonlar kullanılamaz." },
  { step: "3. Ekran ve Dokunmatik Orijinalliği", desc: "iPhone modellerinde True Tone özelliğinin aktif olup olmadığını kontrol edin (yan sanayi ekranlarda True Tone çalışmaz). Ekranda ölü piksel ve sararma testi yapın." },
  { step: "4. Face ID / Parmak İzi Sensörü", desc: "Face ID veya parmak izi okuyucunun çalıştığını test edin. Bu bileşenler anakarta bağlı olduğundan, yan sanayi tamirlerde genelde devre dışı kalır." },
  { step: "5. Batarya Sağlığı ve Şişme", desc: "Pil sağlığı %80'in altına düşmüşse yakın zamanda batarya değişimi gerekecektir. Ekranın kasadan hafif ayrılmış olması bataryanın şiştiğini gösterebilir." },
  { step: "6. Ahize, Mikrofon ve Hoparlör", desc: "Cihazı almadan önce birini arayarak sesinizin net gidip gitmediğini ve karşı tarafın sesini cızırtısız duyup duymadığınızı kontrol edin." },
  { step: "7. Kamera Netleme ve OIS", desc: "Ana kamera ve ultra geniş açılı kamerayı açın, uzaktaki ve yakındaki nesnelere odaklanarak sarsıntı veya titreme olup olmadığını video modunda test edin." },
];

export default function IkinciElPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/bilgi" className="hover:text-white">Bilgi & Destek</Link>
            <ChevronRight className="w-4 h-4" />
            <span>İkinci El Kontrol Listesi</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            İkinci El Telefon Satın Alma Kontrol Listesi
          </h1>
          <p className="text-slate-300 text-base">
            İkinci el telefon alırken mağdur olmamak için adım adım ekspertiz kontrol noktaları.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs leading-relaxed flex items-center justify-between">
            <span className="font-semibold">Resmi IMEI Sorgulama için e-Devlet Kapısı:</span>
            <a
              href="https://www.turkiye.gov.tr/imei-sorgulama"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              e-Devlet&apos;e Git <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4">
            {CHECKLIST.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sky-600" />
                  {item.step}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-100 rounded-xl text-slate-600 text-xs">
            💡 <strong>Tavsiye:</strong> İkinci el alım satımlarda mutlaka satıcıdan imzalı bir kimlik fotokopisi veya devir sözleşmesi talep edin.
          </div>
        </div>
      </div>
    </div>
  );
}
