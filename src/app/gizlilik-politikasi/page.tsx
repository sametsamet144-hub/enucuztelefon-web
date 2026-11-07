import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, ChevronRight, FileText, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK Aydınlatma Metni | EnUcuzTelefon.com",
  description:
    "EnUcuzTelefon.com gizlilik politikası, kişisel verilerin korunması (KVKK) ve veri güvenliği ilkeleri.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-medium">Gizlilik Politikası</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                Yasal Bilgilendirme & KVKK
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Gizlilik Politikası ve Aydınlatma Metni
              </h1>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            <strong>EnUcuzTelefon.com</strong> olarak kullanıcılarımızın gizliliğine ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamındaki haklarına en üst düzeyde özen gösteriyoruz. Bu politika, platformumuzu kullanırken hangi verilerin işlendiğini ve nasıl korunduğunu açıklar.
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-600" />
              1. Toplanan Veriler ve Kullanım Amaçları
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Platformumuzda telefon fiyatlarını karşılaştırmak, teknik özellikleri incelemek ve mağaza tekliflerine yönlenmek için üyelik zorunluluğu bulunmamaktadır. Yalnızca <strong>Fiyat Alarmı</strong> oluşturduğunuzda bildirim gönderebilmek amacıyla e-posta adresiniz ve hedef fiyat tercihiniz kaydedilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              2. Mağaza Yönlendirmeleri ve Üçüncü Taraf Bağlantılar
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              EnUcuzTelefon.com doğrudan ürün satışı yapmaz; Türkiye&apos;deki güvenilir e-ticaret platformlarının (Hepsiburada, Trendyol, Amazon Türkiye, Teknosa, MediaMarkt, Vatan Bilgisayar vb.) güncel fiyatlarını karşılaştırır. &quot;Mağazaya Git&quot; butonuna tıkladığınızda ilgili mağazanın kendi gizlilik ve güvenlik politikaları geçerli olur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              3. Veri Güvenliği ve Saklama Süresi
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fiyat alarmı ve favori listesi verileriniz güvenli sunucularımızda şifreli iletişim protokolleri (HTTPS/TLS) ile korunur. Fiyat alarmlarınızı dilediğiniz zaman tek tıkla iptal edebilir veya verilerinizin silinmesini talep edebilirsiniz.
            </p>
          </section>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Mail className="w-4 h-4 text-sky-600" />
              <span>KVKK ve gizlilik talepleriniz için: <strong>info@enucuztelefon.com</strong></span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-sky-600">
              <Link href="/kullanim-kosullari" className="hover:underline">Kullanım Koşulları</Link>
              <Link href="/cerez-politikasi" className="hover:underline">Çerez Politikası</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
