import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight, ArrowRight, ExternalLink, AlertCircle, FileCheck, Smartphone, RefreshCw, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Telefon Bilgi ve Resmi Destek Merkezi - EnUcuzTelefon.com",
  description: "IMEI sorgulama, e-Devlet kayıt işlemleri, garanti sorgulama, ikinci el telefon ekspertiz rehberi ve resmi kurumlara yönlendirme.",
};

const SUPPORT_TOPICS = [
  {
    slug: "imei-sorgulama",
    title: "IMEI Sorgulama Rehberi",
    desc: "IMEI numaranızı öğrenme ve e-Devlet BTK üzerinden kayıt durumunu güvenli sorgulama adımları.",
    officialSource: "e-Devlet / BTK",
    href: "/bilgi/imei-sorgulama",
  },
  {
    slug: "imei-kayit",
    title: "Yurt Dışı Telefon IMEI Kayıt İşlemleri",
    desc: "Yurt dışından getirilen telefonlar için harç ödeme, pasaporta işletme ve e-Devlet üzerinden kayıt adımları.",
    officialSource: "Gelir İdaresi Başkanlığı / e-Devlet",
    href: "/bilgi/imei-kayit",
  },
  {
    slug: "garanti",
    title: "Garanti Sorgulama ve Distribütör Hakları",
    desc: "Apple, Samsung, Xiaomi resmi garanti süreleri, fatura zorunluluğu ve tüketici hakem heyeti hakları.",
    officialSource: "Ticaret Bakanlığı / Tüketici Hakları",
    href: "/bilgi/garanti",
  },
  {
    slug: "ikinci-el-kontrol",
    title: "İkinci El Telefon Satın Alma Kontrol Listesi",
    desc: "İkinci el telefon alırken ekran değişimi, pil sağlığı, iCloud/Google kilidi ve donanım test adımları.",
    officialSource: "Ekspertiz Rehberi",
    href: "/bilgi/ikinci-el-kontrol",
  },
  {
    slug: "sim-ve-esim",
    title: "SIM ve eSIM Kullanımı Rehberi",
    desc: "Fiziksel SIM karttan dijital eSIM'e geçiş, çift hat kullanımı ve operatör aktivasyon yönergeleri.",
    officialSource: "Operatör Rehberi",
    href: "/bilgi/sim-ve-esim",
  },
];

export default function SupportCenterPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefon-rehberi" className="hover:text-white transition-colors">Telefon Rehberi</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Bilgi & Destek</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-700/60 border border-slate-600 text-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Resmi Kaynaklarla Doğrulanmış Bilgi
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Telefon Bilgi ve Resmi Destek Merkezi
          </h1>
          <p className="text-slate-300 text-base max-w-2xl">
            IMEI sorgulama, garanti hakları, yurt dışı telefon kaydı ve ikinci el cihaz kontrolleri ile ilgili en doğru bilgileri öğrenin, resmi platformlara doğrudan ulaşın.
          </p>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="max-w-7xl mx-auto px-4 -mt-4">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong>Yasal Bilgilendirme:</strong> EnUcuzTelefon.com bir resmi kamu kurumu değildir ve doğrudan IMEI kaydı veya sorgulama hizmeti sunmamaktadır. Platformumuz yalnızca vatandaşlarımızı doğru bilgilendirmek ve resmi devlet portallarına (e-Devlet, BTK, GİB) güvenli yönlendirme sağlamak amacıyla rehberlik etmektedir.
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUPPORT_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={topic.href}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {topic.officialSource}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors leading-snug">
                  {topic.title}
                </h2>

                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  {topic.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600">
                <span>Rehberi İncele</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Devam Et <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
