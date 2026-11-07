import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "IMEI Sorgulama Rehberi - EnUcuzTelefon.com",
  description: "IMEI numarasını nasıl öğrenirim? IMEI kayıt işlemleri, Türkiye'de IMEI sorgulama rehberi.",
};

export default function IMEIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefon-rehberi" className="hover:text-white">Rehber</Link>
            <ChevronRight className="w-4 h-4" />
            <span>IMEI Sorgulama</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">IMEI Sorgulama Rehberi</h1>
          <p className="text-slate-300 text-lg">IMEI numaranızı öğrenin ve Türkiye&apos;de kayıt işlemlerini yapın.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Önemli Uyarı */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-800 mb-1">Önemli Bilgi</div>
            <p className="text-amber-700 text-sm">
              IMEI sorgulama ve kayıt işlemleri için resmi hizmetleri kullanmanız gerekmektedir. 
              Bu sayfada yalnızca yönlendirme bilgisi verilmekte, herhangi bir resmi işlem yapılmamaktadır.
            </p>
          </div>
        </div>

        {/* IMEI Nedir? */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">IMEI Nedir?</h2>
          <p className="text-gray-600 mb-4">
            IMEI (International Mobile Equipment Identity), her cep telefonuna özgü 15 haneli bir kimlik numarasıdır. 
            Bu numara, cihazınızı dünya genelinde benzersiz şekilde tanımlar.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-mono text-lg text-center text-sky-600 tracking-widest">
              353 457 06 123456 7
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">Örnek IMEI Numarası (15 Hane)</div>
          </div>
        </section>

        {/* IMEI Nasıl Öğrenilir? */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">IMEI Numaranızı Nasıl Öğrenirsiniz?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-900">*#06# Tuş Kombinasyonu</div>
                <p className="text-gray-600 text-sm mt-1">Telefon tuş takımından *#06# tuşlayın. IMEI numaranız ekranda görünecektir.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-900">Telefon Ayarları</div>
                <p className="text-gray-600 text-sm mt-1">
                  <strong>Android:</strong> Ayarlar &gt; Telefon Hakkında &gt; Durum Bilgisi &gt; IMEI<br/>
                  <strong>iPhone:</strong> Ayarlar &gt; Genel &gt; Hakkında
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-900">Kutu veya Fatura</div>
                <p className="text-gray-600 text-sm mt-1">Telefon kutusu veya orijinal fatura üzerinde IMEI numarası yazmaktadır.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resmi Kaynaklar */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resmi IMEI Kayıt ve Sorgulama</h2>
          <p className="text-gray-600 mb-4">
            Türkiye&apos;de IMEI kayıt ve sorgulama işlemleri için aşağıdaki resmi kurumlara başvurmanız gerekmektedir:
          </p>
          <div className="space-y-3">
            <a href="https://www.btk.gov.tr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-colors group">
              <div>
                <div className="font-semibold text-gray-900">BTK (Bilgi Teknolojileri ve İletişim Kurumu)</div>
                <div className="text-sm text-gray-500">www.btk.gov.tr — Resmi IMEI kayıt işlemleri</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
            </a>
            <a href="https://www.gib.gov.tr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-colors group">
              <div>
                <div className="font-semibold text-gray-900">Gelir İdaresi Başkanlığı</div>
                <div className="text-sm text-gray-500">www.gib.gov.tr — Yurt dışından getirilen cihaz bildirimi</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
            </a>
          </div>
        </section>

        {/* İlgili Rehberler */}
        <section>
          <h3 className="font-bold text-gray-900 mb-4">İlgili Rehberler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "İkinci El Telefon Kontrol Rehberi", href: "/bilgi/ikinci-el-kontrol" },
              { title: "Garanti Sorgulama", href: "/bilgi/garanti" },
              { title: "Yenilenmiş Telefon Rehberi", href: "/rehber/sifir-vs-yenilenmis" },
              { title: "Telefon Güvenliği", href: "/bilgi/telefon-guvenligi" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition-all group">
                <ChevronRight className="w-5 h-5 text-sky-500" />
                <span className="font-medium text-gray-700 group-hover:text-sky-700">{item.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
