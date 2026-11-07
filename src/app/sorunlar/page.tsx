import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, ChevronRight, ArrowRight, Flame, BatteryCharging, Zap, Smartphone, Wifi, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Telefon Sorunları ve Çözümleri - EnUcuzTelefon.com",
  description: "Telefonunuz ısınıyor mu, şarj olmuyor mu veya yavaşladı mı? En sık karşılaşılan cep telefonu arızaları ve adım adım çözüm yöntemleri.",
};

export const PHONE_PROBLEMS = [
  {
    slug: "telefon-neden-isinir",
    title: "Telefon Neden Isınır ve Nasıl Soğutulur?",
    icon: Flame,
    color: "text-rose-500 bg-rose-50 border-rose-100",
    excerpt: "Oyun oynarken, şarjdayken veya video çekerken aşırı ısınan telefonlar için acil çözüm yolları ve donanım koruma önlemleri.",
    solutionsCount: 5,
  },
  {
    slug: "telefon-neden-yavaslar",
    title: "Telefon Neden Yavaşlar ve Kasmalar Nasıl Önlenir?",
    icon: Zap,
    color: "text-amber-500 bg-amber-50 border-amber-100",
    excerpt: "Zamanla yavaşlayan Android ve iOS telefonları hızlandırmanın 7 pratik yolu. Önbellek temizliği, animasyon ayarları ve depolama optimizasyonu.",
    solutionsCount: 7,
  },
  {
    slug: "batarya-neden-hizli-biter",
    title: "Telefon Bataryası Neden Hızlı Biter?",
    icon: BatteryCharging,
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
    excerpt: "Şarjınız 1 günü çıkarmıyor mu? Arka plan uygulamalarını sınırlandırma, ekran parlaklığı yönetimi ve pil sağlığını koruma rehberi.",
    solutionsCount: 6,
  },
  {
    slug: "telefon-neden-sarj-olmaz",
    title: "Telefon Neden Şarj Almıyor veya Yavaş Şarj Oluyor?",
    icon: AlertTriangle,
    color: "text-blue-500 bg-blue-50 border-blue-100",
    excerpt: "Şarj soketi tozu, arızalı kablo, adaptör uyumsuzluğu veya batarya entegre arızalarını tespit etme ve evde uygulanabilecek çözümler.",
    solutionsCount: 4,
  },
  {
    slug: "telefon-kendi-kendine-kapaniyor",
    title: "Telefon Neden Kendi Kendine Kapanır?",
    icon: Smartphone,
    color: "text-purple-500 bg-purple-50 border-purple-100",
    excerpt: "Ani kapanmalar, yeniden başlama döngüleri (bootloop) ve batarya kalibrasyon sorunlarının nedenleri ve kurtarma adımları.",
    solutionsCount: 5,
  },
  {
    slug: "ekran-ve-dokunmatik-sorunlari",
    title: "Ekran Titremesi ve Dokunmatik Basmama Sorunları",
    icon: Smartphone,
    color: "text-cyan-500 bg-cyan-50 border-cyan-100",
    excerpt: "Hayalet ekran (ghost touch), ekran kararması, kırık olmadan dokunmatiğin çalışmaması ve ekran yenileme hızı ayarları.",
    solutionsCount: 4,
  },
  {
    slug: "wifi-ve-mobil-veri-sorunlari",
    title: "Wi-Fi Kopması ve Mobil Veri Çekmeme Sorunları",
    icon: Wifi,
    color: "text-indigo-500 bg-indigo-50 border-indigo-100",
    excerpt: "İnternete bağlanamama, 'İnternet bağlantısı yok' uyarısı ve ağ ayarlarını sıfırlama adımları.",
    solutionsCount: 5,
  },
];

export default function PhoneIssuesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-rose-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefon-rehberi" className="hover:text-white transition-colors">Telefon Rehberi</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Sorunlar & Çözümler</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Wrench className="w-4 h-4" />
            Teknik Destek ve Sorun Giderme
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Telefon Sorunları ve Çözümleri
          </h1>
          <p className="text-rose-100 text-base max-w-2xl">
            Telefonunuzla ilgili yaşadığınız ısınma, şarj, kilitlenme veya yavaşlama gibi tüm teknik aksaklıkları çözmek için adım adım rehberleri inceleyin.
          </p>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHONE_PROBLEMS.map((problem) => {
            const Icon = problem.icon;
            return (
              <Link
                key={problem.slug}
                href={`/sorunlar/${problem.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${problem.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors leading-snug">
                    {problem.title}
                  </h2>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                    {problem.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600">
                  <span>{problem.solutionsCount} Adımda Çözüm</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Çözümü Gör <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
