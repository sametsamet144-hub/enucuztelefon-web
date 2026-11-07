import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Cpu, ArrowLeft, CheckCircle2, Smartphone } from "lucide-react";
import { TECH_TOPICS } from "../page";

interface Props {
  params: Promise<{ slug: string }>;
}

const TECH_SLUG_ALIASES: Record<string, string> = {
  "amoled-oled-ekran": "amoled-oled-ve-ltpo-ekran",
  "ois-kamera": "ois-optik-goruntu-sabitleme",
  "5g-nedir": "5g-teknolojisi-ve-frekanslar",
  "ip-sertifikalari": "ip-sertifikalari-suya-dayaniklilik",
};

function findTechTopicBySlug(slug: string) {
  const normalized = TECH_SLUG_ALIASES[slug] || slug;
  return TECH_TOPICS.find((t) => t.slug === normalized || t.slug === slug);
}

export async function generateStaticParams() {
  const base = TECH_TOPICS.map((t) => ({ slug: t.slug }));
  const aliases = Object.keys(TECH_SLUG_ALIASES).map((slug) => ({ slug }));
  return [...base, ...aliases];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = findTechTopicBySlug(slug);
  if (!topic) return { title: "Teknoloji Bulunamadı - EnUcuzTelefon.com" };

  return {
    title: `${topic.title} Nedir? - EnUcuzTelefon.com`,
    description: topic.excerpt,
  };
}

export default async function TechTopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = findTechTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const Icon = topic.icon;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-sky-600 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <Link href="/telefon-rehberi" className="hover:text-sky-600 transition-colors">Telefon Rehberi</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <Link href="/teknoloji" className="hover:text-sky-600 transition-colors">Telefon Teknolojileri</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">{topic.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {topic.category} Teknolojisi
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {topic.title}
              </h1>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-950 text-sm leading-relaxed mb-8">
            <div className="font-bold text-xs uppercase tracking-wider mb-1 text-indigo-800">
              Kısaca Nedir?
            </div>
            {topic.excerpt}
          </div>

          {/* Educational Content */}
          <div className="space-y-6 text-slate-700 leading-relaxed text-base">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              Bu Teknoloji Günlük Kullanımı Nasıl Etkiler?
            </h2>

            <p>
              Akıllı telefon satın alırken teknik özellik listelerinde sıklıkla karşılaşılan bu terim, cihazınızın hem pil ömrünü hem de uzun vadeli performans akıcılığını doğrudan belirleyen temel etmenlerden biridir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Avantajları
                </div>
                <ul className="text-xs space-y-1.5 text-slate-600">
                  <li>• Daha yüksek enerji verimliliği ve düşük pil tüketimi</li>
                  <li>• Akıcı kullanıcı deneyimi ve daha hızlı tepki süreleri</li>
                  <li>• Zorlu koşullarda bile kararlı çalışma yeteneği</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-500" />
                  Hangi Telefonlarda Bulunur?
                </div>
                <p className="text-xs text-slate-600">
                  Genellikle güncel orta-üst ve amiral gemisi telefon modellerinde standart olarak yer alır. Fiyat karşılaştırma sayfamızdan filtreleyerek bulabilirsiniz.
                </p>
              </div>
            </div>

            <p>
              EnUcuzTelefon.com telefon detay ve karşılaştırma sayfalarında, incelediğiniz cihazın bu özelliğe sahip olup olmadığını teknik özellikler tablosundan anında kontrol edebilirsiniz.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/teknoloji"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tüm Teknolojilere Dön
            </Link>

            <Link
              href="/telefonlar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 px-5 py-2.5 rounded-xl transition-colors"
            >
              Bu Özellikteki Telefonları İncele
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
