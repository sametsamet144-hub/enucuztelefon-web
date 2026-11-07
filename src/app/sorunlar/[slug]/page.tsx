import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Wrench, AlertTriangle, CheckCircle2, ArrowLeft, HelpCircle } from "lucide-react";
import { PHONE_PROBLEMS } from "../page";

interface Props {
  params: Promise<{ slug: string }>;
}

const PROBLEM_SLUG_ALIASES: Record<string, string> = {
  "baglanti-sorunlari": "wifi-ve-mobil-veri-sorunlari",
  "isinma-sorunu": "telefon-asiri-isiniyor",
  "sarj-sorunu": "sarj-cabuk-bitiyor",
  "yavaslama-sorunu": "telefon-yavasladi-donuyor",
};

function findProblemBySlug(slug: string) {
  const normalized = PROBLEM_SLUG_ALIASES[slug] || slug;
  return PHONE_PROBLEMS.find((p) => p.slug === normalized || p.slug === slug);
}

export async function generateStaticParams() {
  const base = PHONE_PROBLEMS.map((p) => ({ slug: p.slug }));
  const aliases = Object.keys(PROBLEM_SLUG_ALIASES).map((slug) => ({ slug }));
  return [...base, ...aliases];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const problem = findProblemBySlug(slug);
  if (!problem) return { title: "Sorun Bulunamadı - EnUcuzTelefon.com" };

  return {
    title: `${problem.title} - Çözüm Rehberi | EnUcuzTelefon.com`,
    description: problem.excerpt,
  };
}

export default async function ProblemDetailPage({ params }: Props) {
  const { slug } = await params;
  const problem = findProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  const Icon = problem.icon;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-sky-600 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <Link href="/telefon-rehberi" className="hover:text-sky-600 transition-colors">Telefon Rehberi</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <Link href="/sorunlar" className="hover:text-sky-600 transition-colors">Sorunlar ve Çözümler</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">{problem.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${problem.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                Sorun Çözüm Rehberi
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {problem.title}
              </h1>
            </div>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-900 text-sm leading-relaxed mb-8">
            <div className="font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Sorun Belirtileri
            </div>
            {problem.excerpt}
          </div>

          {/* Step by Step Solution */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              Adım Adım Çözüm Yöntemleri
            </h2>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Arka Planda Çalışan Ağır Uygulamaları Kapatın</h3>
                </div>
                <p className="text-slate-600 text-sm pl-10 leading-relaxed">
                  Özellikle konum servisini kullanan harita uygulamaları, yüksek grafikli oyunlar ve sosyal medya uygulamaları işlemciyi sürekli %100 yük altında tutabilir. Son kullanılan uygulamalar menüsünden hepsini sonlandırın.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Orijinal Şarj Cihazı ve Kablosu Kullanın</h3>
                </div>
                <p className="text-slate-600 text-sm pl-10 leading-relaxed">
                  Voltaj ve amper değeri telefonun batarya entegresiyle uyumlu olmayan sahte adaptörler hem aşırı ısınmaya hem de batarya şişmesine neden olur. Telefon üreticisinin onayladığı orijinal veya lisanslı aksesuarları tercih edin.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Yazılım Güncellemelerini Kontrol Edin</h3>
                </div>
                <p className="text-slate-600 text-sm pl-10 leading-relaxed">
                  Üreticiler belirli aralıklarla sistem hatalarını ve aşırı pil/işlemci tüketimini onaran güvenlik ve performans yamaları yayınlar. Ayarlar &gt; Sistem Güncellemesi bölümünden telefonunuzun güncel olduğundan emin olun.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Depolama Alanını %20 Boş Bırakın</h3>
                </div>
                <p className="text-slate-600 text-sm pl-10 leading-relaxed">
                  Tamamen dolmuş bir dahili hafıza, işletim sisteminin geçici sanal bellek (swap) oluşturmasını engelleyerek kilitlenmelere ve ani kapanmalara yol açar. Kullanmadığınız uygulamaları ve gereksiz medya dosyalarını silin.
                </p>
              </div>
            </div>

            {/* Yetkili Servis Uyarısı */}
            <div className="mt-8 p-5 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-900 text-sm mb-1">
                Sorun Devam Ediyorsa Ne Yapmalısınız?
              </h4>
              <p className="text-amber-800 text-xs leading-relaxed">
                Yukarıdaki adımlar sorununuzu çözmediyse, cihazınızda donanımsal bir arıza (anakart entegresi veya batarya ömrü tükenmesi) olabilir. Garantisi devam eden cihazları yetkisiz tamircilere açtırmadan yetkili servise teslim etmenizi öneririz.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/sorunlar"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tüm Sorunlara Geri Dön
            </Link>

            <Link
              href="/soru-cevap"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              <HelpCircle className="w-4 h-4" />
              Soru-Cevap Sistemine Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
