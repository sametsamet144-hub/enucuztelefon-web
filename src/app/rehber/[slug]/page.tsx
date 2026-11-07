import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar, ArrowLeft, Share2, Bookmark, CheckCircle2 } from "lucide-react";
import { getGuides, getGuide } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return { title: "Rehber Bulunamadı - EnUcuzTelefon.com" };

  return {
    title: `${guide.title} - EnUcuzTelefon.com Rehberi`,
    description: guide.excerpt,
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-sky-600 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <Link href="/telefon-rehberi" className="hover:text-sky-600 transition-colors">Telefon Rehberi</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <Link href="/rehber" className="hover:text-sky-600 transition-colors">Satın Alma Rehberleri</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">{guide.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
          {/* Category & Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
            <span className="font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
              {guide.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {guide.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {guide.readingTime || 5} dk okuma
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {guide.title}
          </h1>

          <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-100 text-sky-900 text-sm leading-relaxed mb-8">
            <div className="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-1">
              Özet Bilgi
            </div>
            {guide.excerpt}
          </div>

          {/* Guide Content */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-base">
            <div dangerouslySetInnerHTML={{ __html: guide.content }} />

            {/* Practical Advice Box */}
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Telefon Seçerken Dikkat Edilmesi Gereken 4 Temel Kural
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span>
                  <span><strong>Kullanım Amacı:</strong> Günlük sosyal medya ve mesajlaşma için orta segment bir işlemci fazlasıyla yeterlidir; amiral gemisi almanıza gerek yoktur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span>
                  <span><strong>Depolama ve RAM:</strong> 2026 yılı standartlarında en az 8 GB RAM ve 128 GB (tercihen 256 GB) depolama kapasitesi tercih edilmelidir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span>
                  <span><strong>Yazılım Güncelleme Desteği:</strong> Samsung ve Apple 5 ila 7 yıla varan güncelleme garantisi sunarak cihazın kullanım ömrünü uzatmaktadır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0"></span>
                  <span><strong>Resmi Distribütör Garantisi:</strong> İthalatçı garantili ürünlerde servis süreçleri farklılık gösterebilir, resmi distribütör logolu ürünleri tercih edin.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
            <Link
              href="/rehber"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Diğer Rehberlere Dön
            </Link>

            <Link
              href="/telefonlar"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Telefon Fiyatlarını İncele
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
