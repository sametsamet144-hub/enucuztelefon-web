import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight, Clock, ArrowRight, Tag } from "lucide-react";
import { getGuides } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Telefon Satın Alma Rehberleri - EnUcuzTelefon.com",
  description: "Bütçeye göre telefon önerileri, en iyi kameralı telefonlar, oyun telefonları, öğrenci indirimleri ve telefon alırken dikkat edilmesi gereken her şey.",
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sky-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefon-rehberi" className="hover:text-white transition-colors">Telefon Rehberi</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Satın Alma Rehberleri</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Telefon Satın Alma Rehberleri
          </h1>
          <p className="text-sky-200 text-base max-w-2xl">
            Doğru telefonu en uygun fiyata seçebilmeniz için uzmanlarımız tarafından hazırlanan tarafsız rehberler ve model tavsiyeleri.
          </p>
        </div>
      </div>

      {/* Guide List */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <article
                key={guide.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readingTime || 5} dk okuma
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug hover:text-sky-600 transition-colors">
                    <Link href={`/rehber/${guide.slug}`}>{guide.title}</Link>
                  </h2>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {guide.excerpt}
                  </p>

                  {guide.tags && guide.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {guide.tags.map((t) => (
                        <span key={t} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <Link
                    href={`/rehber/${guide.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors pt-3"
                  >
                    Rehberi Oku <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Rehberler hazırlanıyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
