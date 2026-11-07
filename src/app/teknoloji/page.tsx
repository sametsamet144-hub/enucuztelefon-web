import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, ChevronRight, ArrowRight, Smartphone, Camera, Zap, Shield, Wifi, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Telefon Teknolojileri Rehberi ve Sözlüğü - EnUcuzTelefon.com",
  description: "AMOLED nedir? LTPO ekran nasıl çalışır? OIS kamera ne işe yarar? 5G ve işlemci mimarileri hakkında bilmeniz gereken tüm telefon teknolojileri.",
};

export const TECH_TOPICS = [
  {
    slug: "islemciler",
    title: "Akıllı Telefon İşlemcileri (SoC) ve Mimariler",
    icon: Cpu,
    category: "Donanım",
    excerpt: "Snapdragon, Apple A Serisi Bionic, MediaTek Dimensity ve Exynos işlemcilerin farkları, nanometre (nm) üretim süreçleri ve çekirdek yapıları.",
  },
  {
    slug: "amoled-oled-ve-ltpo-ekran",
    title: "AMOLED, OLED ve LTPO Ekran Teknolojileri",
    icon: Smartphone,
    category: "Ekran",
    excerpt: "OLED panellerin sonsuz kontrastı, piksel aydınlatması ve 1 Hz ile 120 Hz arasında dinamik değişen LTPO teknolojisinin pil tasarrufuna etkisi.",
  },
  {
    slug: "ois-optik-goruntu-sabitleme",
    title: "OIS (Optik Görüntü Sabitleme) ve Kamera Sensörleri",
    icon: Camera,
    category: "Kamera",
    excerpt: "EIS (Elektronik) ile OIS (Optik) arasındaki farklar. Gece çekimlerinde titremeyi engelleyerek net fotoğraf ve pürüzsüz video elde etme.",
  },
  {
    slug: "5g-teknolojisi-ve-frekanslar",
    title: "5G Nedir ve Telefonlarda Nasıl Çalışır?",
    icon: Wifi,
    category: "Bağlantı",
    excerpt: "Sub-6 GHz ve mmWave frekansları, gigabit seviyesinde indirme hızları ve Türkiye'deki operatör uyumluluğu hakkında bilmeniz gerekenler.",
  },
  {
    slug: "hizli-sarj-ve-kablosuz-sarj",
    title: "Hızlı Şarj (Watt) ve Kablosuz Şarj Standartları",
    icon: Zap,
    category: "Batarya",
    excerpt: "PD (Power Delivery), QC (Quick Charge), GaN şarj aletleri ve Qi2 manyetik kablosuz şarj protokollerinin batarya ömrüne etkisi.",
  },
  {
    slug: "ip-sertifikalari-suya-dayaniklilik",
    title: "IP Sertifikaları (IP67, IP68, IP69) ve Su Dayanıklılığı",
    icon: Shield,
    category: "Dayanıklılık",
    excerpt: "Telefonunuz suya ve toza ne kadar dayanıklı? Tuzlu su, buhar ve havuz suyunda garanti şartlarının geçerliliği rehberi.",
  },
  {
    slug: "ram-ve-ufrs-depolama",
    title: "LPDDR5X RAM ve UFS 4.0 Depolama Hızları",
    icon: Layers,
    category: "Hafıza",
    excerpt: "Telefonun açılış hızı, oyun yükleme süreleri ve arka planda uygulama tutma kabiliyetini belirleyen yeni nesil bellek standartları.",
  },
];

export default function TechDictionaryPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefon-rehberi" className="hover:text-white transition-colors">Telefon Rehberi</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Telefon Teknolojileri</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Cpu className="w-4 h-4" />
            Teknoloji Rehberi & Sözlüğü
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Telefon Teknolojileri ve Teknik Terimler
          </h1>
          <p className="text-indigo-100 text-base max-w-2xl">
            Telefon özellik tablolarında gördüğünüz karmaşık terimlerin ne anlama geldiğini, günlük kullanımınıza ve pil ömrünüze etkisini keşfedin.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <Link
                key={topic.slug}
                href={`/teknoloji/${topic.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {topic.category}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                    {topic.title}
                  </h2>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                    {topic.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>Detaylı İnceleme</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Okumaya Başla <ArrowRight className="w-3.5 h-3.5" />
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
