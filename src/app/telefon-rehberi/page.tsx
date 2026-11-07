import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  DollarSign,
  Scale,
  FileText,
  ShoppingCart,
  Wrench,
  Cpu,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Battery,
  Camera,
  Flame,
  Zap
} from "lucide-react";
import { getGuides } from "@/lib/data";

export const metadata: Metadata = {
  title: "Telefon Rehberi ve Bilgi Merkezi - EnUcuzTelefon.com",
  description: "Türkiye'nin en kapsamlı telefon araştırma ve bilgi merkezi: Telefon fiyatları, karşılaştırmalar, incelemeler, satın alma rehberleri, sorun çözümleri ve teknoloji rehberi.",
};

const HUB_SECTIONS = [
  {
    id: "fiyatlar",
    title: "Telefon Fiyatları & Fırsatlar",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    description: "Güncel mağaza fiyatları, en ucuz telefonlar, fiyatı düşenler ve fiyat alarmları.",
    links: [
      { label: "En Ucuz Telefonlar", href: "/telefonlar/en-ucuz" },
      { label: "Fiyatı Düşen Telefonlar", href: "/telefonlar/fiyati-dusen" },
      { label: "Fiyat Takibi ve Alarm Kur", href: "/fiyat-takibi" },
      { label: "Tüm Telefon Fiyatları", href: "/telefonlar" },
    ],
  },
  {
    id: "karsilastirma",
    title: "Telefon Karşılaştırmaları",
    icon: Scale,
    color: "from-sky-500 to-blue-600",
    description: "2'li ve 4'lü modelleri yan yana kamera, batarya, ekran ve performans bazında karşılaştırın.",
    links: [
      { label: "İki ve Dört Telefon Karşılaştır", href: "/karsilastir" },
      { label: "Kamera Karşılaştırması", href: "/karsilastir?tab=camera" },
      { label: "Batarya ve Şarj Karşılaştırması", href: "/karsilastir?tab=battery" },
      { label: "Fiyat / Performans Kıyaslama", href: "/karsilastir?tab=price" },
    ],
  },
  {
    id: "incelemeler",
    title: "Detaylı Telefon İncelemeleri",
    icon: FileText,
    color: "from-violet-500 to-purple-600",
    description: "Artılar, eksiler, oyun testleri, pil ömrü testleri ve tarafsız uzman değerlendirmeleri.",
    links: [
      { label: "Tüm İncelemeler", href: "/incelemeler" },
      { label: "iPhone 16 Pro Max İncelemesi", href: "/telefon/iphone-16-pro-max" },
      { label: "Galaxy S25 Ultra İncelemesi", href: "/telefon/samsung-galaxy-s25-ultra" },
      { label: "Xiaomi 15 Pro İncelemesi", href: "/telefon/xiaomi-15-pro" },
    ],
  },
  {
    id: "rehberler",
    title: "Satın Alma Rehberleri",
    icon: ShoppingCart,
    color: "from-amber-500 to-orange-600",
    description: "Bütçenize ve ihtiyacınıza en uygun telefonu seçmeniz için hazırlanmış uzman tavsiyeleri.",
    links: [
      { label: "Bütçeye Göre Telefon Önerileri", href: "/rehber/butceye-gore" },
      { label: "En İyi Kameralı Telefonlar", href: "/rehber/en-iyi-kamerali" },
      { label: "En İyi Bataryalı Telefonlar", href: "/rehber/en-iyi-bataryali" },
      { label: "En İyi Oyun Telefonları", href: "/rehber/oyun-telefonlari" },
      { label: "Öğrenciler İçin Telefonlar", href: "/rehber/ogrenciler-icin" },
      { label: "Sıfır vs Yenilenmiş Telefon Farkları", href: "/rehber/sifir-vs-yenilenmis" },
    ],
  },
  {
    id: "sorunlar",
    title: "Telefon Sorunları ve Çözümleri",
    icon: Wrench,
    color: "from-rose-500 to-red-600",
    description: "Isınma, yavaşlama, hızlı şarj bitmesi, ekran ve bağlantı sorunlarına adım adım çözüm rehberi.",
    links: [
      { label: "Telefon Neden Isınır ve Nasıl Önlenir?", href: "/sorunlar/telefon-neden-isinir" },
      { label: "Telefon Neden Yavaşlar?", href: "/sorunlar/telefon-neden-yavaslar" },
      { label: "Batarya Neden Hızlı Biter?", href: "/sorunlar/batarya-neden-hizli-biter" },
      { label: "Telefon Neden Şarj Olmaz?", href: "/sorunlar/telefon-neden-sarj-olmaz" },
      { label: "Wi-Fi & Mobil Veri Sorunları", href: "/sorunlar/wifi-ve-mobil-veri-sorunlari" },
    ],
  },
  {
    id: "teknoloji",
    title: "Telefon Teknolojileri Sözlüğü",
    icon: Cpu,
    color: "from-indigo-500 to-sky-600",
    description: "AMOLED, LTPO, Hz, OIS, 5G, Snapdragon, Bionic, IP sertifikaları ve teknik terimler.",
    links: [
      { label: "İşlemciler ve Çip Mimarileri", href: "/teknoloji/islemciler" },
      { label: "AMOLED, OLED ve LTPO Ekran Nedir?", href: "/teknoloji/amoled-oled-ve-ltpo-ekran" },
      { label: "OIS (Optik Görüntü Sabitleme) Nedir?", href: "/teknoloji/ois-optik-goruntu-sabitleme" },
      { label: "5G Teknolojisi ve Türkiye Uyumu", href: "/teknoloji/5g-teknolojisi-ve-frekanslar" },
      { label: "IP68 ve Suya Dayanıklılık Sertifikaları", href: "/teknoloji/ip-sertifikalari-suya-dayaniklilik" },
    ],
  },
  {
    id: "bilgi-destek",
    title: "Bilgi ve Resmi Destek Merkezi",
    icon: ShieldCheck,
    color: "from-slate-700 to-slate-900",
    description: "IMEI sorgulama, e-Devlet kayıt işlemleri, garanti sorgulama ve ikinci el kontrol rehberi.",
    links: [
      { label: "IMEI Sorgulama & e-Devlet BTK Rehberi", href: "/bilgi/imei-sorgulama" },
      { label: "IMEI Kayıt ve Harç İşlemleri", href: "/bilgi/imei-kayit" },
      { label: "Garanti Sorgulama ve Distribütör Hakları", href: "/bilgi/garanti" },
      { label: "İkinci El Telefon Satın Alma Kontrol Listesi", href: "/bilgi/ikinci-el-kontrol" },
      { label: "SIM ve eSIM Kullanımı", href: "/bilgi/sim-ve-esim" },
    ],
  },
  {
    id: "soru-cevap",
    title: "Gelişmiş Soru-Cevap Sistemi",
    icon: HelpCircle,
    color: "from-amber-600 to-amber-700",
    description: "Kullanıcıların en sık karşılaştığı telefon soruları, uzman cevapları ve çözüm yolları.",
    links: [
      { label: "Tüm Soruları Ara", href: "/soru-cevap" },
      { label: "Satın Alma Soruları", href: "/soru-cevap?kategori=satin-alma" },
      { label: "Teknik & Donanım Soruları", href: "/soru-cevap?kategori=teknik" },
      { label: "Batarya ve Şarj Soruları", href: "/soru-cevap?kategori=batarya" },
    ],
  },
];

export default async function TelefonRehberiPage() {
  const guides = await getGuides();
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sky-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Telefon Rehberi & Bilgi Merkezi</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/30 text-sky-300 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
              <BookOpen className="w-4 h-4" />
              Türkiye&apos;nin Kapsamlı Telefon Bilgi Kütüphanesi
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Telefon Rehberi & Bilgi Merkezi
            </h1>
            <p className="text-sky-200 text-base md:text-lg leading-relaxed">
              Telefon satın alırken, fiyat araştırırken, modelleri kıyaslarken veya cihazınızla ilgili teknik bir problem yaşadığınızda aradığınız tüm bilgiler burada.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid of 8 Comprehensive Sections */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HUB_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white mb-4 shadow-sm`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">{section.title}</h2>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{section.description}</p>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 px-2 py-1.5 rounded-md transition-colors group"
                    >
                      <span className="truncate">{link.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Articles & Guides */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">En Çok Okunan Rehber Yazıları</h2>
            <p className="text-sm text-slate-500">Kullanıcıların en çok faydalandığı uzman rehberleri</p>
          </div>
          <Link
            href="/rehber"
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Tüm Rehberleri Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.slice(0, 3).map((guide) => (
            <Link
              key={guide.id}
              href={`/rehber/${guide.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-sky-400 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md mb-3">
                  {guide.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors line-clamp-2 mb-2">
                  {guide.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{guide.publishedAt}</span>
                <span className="text-sky-600 font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Yazıyı Oku <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
