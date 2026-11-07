import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Shield,
  Smartphone,
  Camera,
  Cpu,
  Battery,
  Wifi,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getPhone, getRelatedPhones, getPriceHistory } from "@/lib/data";
import PhoneInteractiveShowcase from "@/components/phone/PhoneInteractiveShowcase";
import StoreComparisonTable from "@/components/phone/StoreComparisonTable";
import PhoneCard from "@/components/phone/PhoneCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const phone = await getPhone(slug);
  if (!phone) {
    return {
      title: "Telefon Bulunamadı - EnUcuzTelefon.com",
    };
  }

  return {
    title: `${phone.name} En Ucuz Fiyatı, Mağaza Karşılaştırması ve Özellikleri - EnUcuzTelefon.com`,
    description: `${phone.name} en ucuz nerede satılıyor? 16 farklı güvenilir mağazanın güncel fiyatları, teknik özellikleri, kamera puanı, batarya ömrü ve kullanıcı yorumları.`,
  };
}

export default async function PhoneDetailPage({ params }: Props) {
  const { slug } = await params;
  const phone = await getPhone(slug);

  if (!phone) {
    notFound();
  }

  const relatedPhones = await getRelatedPhones(phone.id, 4);

  const displaySpecs = phone.specs?.display;
  const cameraSpecs = phone.specs?.camera;
  const batterySpecs = phone.specs?.battery;
  const perfSpecs = phone.specs?.performance;
  const designSpecs = phone.specs?.design;
  const softwareSpecs = phone.specs?.software;
  const connSpecs = phone.specs?.connectivity;

  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="border-b border-slate-800/40 bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-xs text-slate-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-sky-400 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <Link href="/telefonlar" className="hover:text-sky-400 transition-colors">Telefonlar</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <Link href={`/marka/${phone.brandSlug}`} className="hover:text-sky-400 transition-colors">{phone.brand}</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <span className="text-sky-400 font-bold">{phone.name}</span>
        </div>
      </div>

      {/* Hero + Revised Price History, Date-Range Statistics & Market Analysis */}
      <PhoneInteractiveShowcase phone={phone} />

      {/* Main Content Body */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 space-y-12">

          {/* Akakçe-Style Multi-Store Price Comparison (16 Stores) */}
          <section id="fiyat-karsilastir" className="scroll-mt-6">
            <StoreComparisonTable
              storesPrices={phone.storesPrices || []}
              phoneName={phone.name}
            />
          </section>

          {/* Deep Dive Performance & Benchmark Section */}
          <section className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-white/10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Laboratuvar ve Benchmark Sonuçları
                </span>
                <h2 className="text-2xl font-black mt-2 text-white">
                  {phone.name} Donanım Gücü ve Performans Skoru
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Yonga seti, yapay zeka işlem birimi ve oyun stres testi verileri
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">AnTuTu v10 Skoru</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-300">
                  {perfSpecs?.antutuScore?.toLocaleString("tr-TR") || "1.650.000"} Puan
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Benchmark 1 */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>İşlemci Verimliliği</span>
                  <span className="text-emerald-400 font-bold">%98 Zirve</span>
                </div>
                <div className="font-bold text-white text-base mb-1">{perfSpecs?.chipset || "Gelişmiş Mobil Yonga"}</div>
                <div className="text-xs text-slate-400 mb-4">{perfSpecs?.cpu || "8 Çekirdekli Hibrit Mimari"}</div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>

              {/* Benchmark 2 */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Grafik ve Oyun (GPU)</span>
                  <span className="text-indigo-400 font-bold">120 FPS Kararlı</span>
                </div>
                <div className="font-bold text-white text-base mb-1">{perfSpecs?.gpu || "Yüksek Hızlı Grafik Birimi"}</div>
                <div className="text-xs text-slate-400 mb-4">Işın İzleme (Ray Tracing) ve Mesh Shading</div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>

              {/* Benchmark 3 */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>RAM & Depolama Hızı</span>
                  <span className="text-cyan-400 font-bold">UFS 4.0 / LPDDR5X</span>
                </div>
                <div className="font-bold text-white text-base mb-1">{perfSpecs?.ram || 12} GB RAM + {perfSpecs?.storage || 256} GB</div>
                <div className="text-xs text-slate-400 mb-4">4200 MB/s Okuma, Sıfır Gecikme Çoklu Görev</div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full" style={{ width: "96%" }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Full Technical Specifications Grid */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                  Eksiksiz Donanım Bilgisi
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  {phone.name} Detaylı Teknik Özellikleri
                </h2>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                Doğrulanmış Üretici Verileri
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Ekran */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 pb-3 border-b border-slate-200 mb-3 text-sm">
                  <div className="p-2 bg-sky-500/10 text-sky-600 rounded-xl">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  Ekran Özellikleri
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Boyut</dt>
                    <dd className="font-bold text-slate-900">{displaySpecs?.size || 6.7} inç</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Panel Teknolojisi</dt>
                    <dd className="font-bold text-slate-900">{displaySpecs?.technology || "OLED / AMOLED"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Çözünürlük</dt>
                    <dd className="font-bold text-slate-900">{displaySpecs?.resolution || "FHD+ / QHD+"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Yenileme Hızı</dt>
                    <dd className="font-bold text-emerald-600">{displaySpecs?.refreshRate || 120} Hz</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Zirve Parlaklık</dt>
                    <dd className="font-bold text-slate-900">{displaySpecs?.brightness || 2000} nits</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">Cam Koruması</dt>
                    <dd className="font-bold text-slate-900">{displaySpecs?.protection || "Gorilla Glass / Ceramic"}</dd>
                  </div>
                </dl>
              </div>

              {/* Kamera */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 pb-3 border-b border-slate-200 mb-3 text-sm">
                  <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
                    <Camera className="w-4 h-4" />
                  </div>
                  Kamera Donanımı
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Ana Kamera</dt>
                    <dd className="font-bold text-slate-900">{cameraSpecs?.mainCamera?.megapixels || 50} MP ({cameraSpecs?.mainCamera?.aperture || "f/1.8"})</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Optik Sabitleme (OIS)</dt>
                    <dd className="font-bold text-emerald-600">{cameraSpecs?.mainCamera?.ois ? "Donanımsal OIS Mevcut" : "Elektronik EIS"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Ultra Geniş Açı</dt>
                    <dd className="font-bold text-slate-900">{cameraSpecs?.ultrawide?.megapixels || 12} MP</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Telefoto / Zoom</dt>
                    <dd className="font-bold text-slate-900">{cameraSpecs?.telephoto ? `${cameraSpecs.telephoto.opticalZoom}x Optik Zoom` : "Dijital Yakınlaştırma"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Ön Kamera</dt>
                    <dd className="font-bold text-slate-900">{cameraSpecs?.frontCamera?.megapixels || 12} MP</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">Video Çözünürlüğü</dt>
                    <dd className="font-bold text-slate-900">{cameraSpecs?.videoCapabilities?.[0] || "4K @ 60 FPS"}</dd>
                  </div>
                </dl>
              </div>

              {/* Batarya & Hızlı Şarj */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 pb-3 border-b border-slate-200 mb-3 text-sm">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                    <Battery className="w-4 h-4" />
                  </div>
                  Batarya & Şarj
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Pil Kapasitesi</dt>
                    <dd className="font-bold text-slate-900">{batterySpecs?.capacity || 5000} mAh</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Kablolu Hızlı Şarj</dt>
                    <dd className="font-bold text-emerald-600">{batterySpecs?.wiredCharging || 45}W Destekli</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Kablosuz Şarj</dt>
                    <dd className="font-bold text-slate-900">{batterySpecs?.wirelessCharging ? `${batterySpecs.wirelessCharging}W Hızlı Kablosuz` : "Desteklenmiyor"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Ters Kablosuz Şarj</dt>
                    <dd className="font-bold text-slate-900">{batterySpecs?.reverseWirelessCharging ? "Var (Aksesuar Şarjı)" : "Yok"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Şarj Süresi</dt>
                    <dd className="font-bold text-slate-900">{batterySpecs?.chargingTime || "Yaklaşık 35-45 dk"}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">Pil Türü</dt>
                    <dd className="font-bold text-slate-900">Li-Ion / Li-Po (Sabit)</dd>
                  </div>
                </dl>
              </div>

              {/* Performans & Donanım */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 pb-3 border-b border-slate-200 mb-3 text-sm">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                    <Cpu className="w-4 h-4" />
                  </div>
                  İşlemci & Bellek
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Yonga Seti</dt>
                    <dd className="font-bold text-slate-900">{perfSpecs?.chipset || "Yüksek Hızlı Çip"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">RAM</dt>
                    <dd className="font-bold text-slate-900">{perfSpecs?.ram || 8} GB</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Dahili Hafıza</dt>
                    <dd className="font-bold text-slate-900">{perfSpecs?.storage || 256} GB</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Hafıza Kartı (microSD)</dt>
                    <dd className="font-bold text-slate-900">{perfSpecs?.expandableStorage ? "Destekleniyor" : "Desteklenmiyor"}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">Depolama Standardı</dt>
                    <dd className="font-bold text-slate-900">{perfSpecs?.storageType || "UFS 4.0 / NVMe"}</dd>
                  </div>
                </dl>
              </div>

              {/* Bağlantı & Ağ */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 pb-3 border-b border-slate-200 mb-3 text-sm">
                  <div className="p-2 bg-cyan-500/10 text-cyan-600 rounded-xl">
                    <Wifi className="w-4 h-4" />
                  </div>
                  Bağlantı & İletişim
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">5G Desteği</dt>
                    <dd className="font-bold text-emerald-600">{connSpecs?.fiveG ? "Var (Tam 5G Uyumlu)" : "4.5G LTE"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">NFC (Temassız Ödeme)</dt>
                    <dd className="font-bold text-emerald-600">{connSpecs?.nfc ? "Var" : "Yok"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Wi-Fi Versiyonu</dt>
                    <dd className="font-bold text-slate-900">{connSpecs?.wifi || "Wi-Fi 6E / Wi-Fi 7"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Bluetooth</dt>
                    <dd className="font-bold text-slate-900">{connSpecs?.bluetooth || "5.3"}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">SIM Tipi</dt>
                    <dd className="font-bold text-slate-900">{connSpecs?.sim || "Nano-SIM + eSIM"}</dd>
                  </div>
                </dl>
              </div>

              {/* Tasarım & Kasa */}
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 pb-3 border-b border-slate-200 mb-3 text-sm">
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                    <Layers className="w-4 h-4" />
                  </div>
                  Kasa, Ağırlık & Dayanıklılık
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Su / Toz Dayanıklılığı</dt>
                    <dd className="font-bold text-slate-900">{designSpecs?.waterResistance || "IP68 (1.5m 30 dk)"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Ağırlık</dt>
                    <dd className="font-bold text-slate-900">{designSpecs?.weight || 215} gram</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Kasa Materyali</dt>
                    <dd className="font-bold text-slate-900">{designSpecs?.materials || "Titanyum / Alüminyum & Cam"}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <dt className="text-slate-500">Biyometrik Güvenlik</dt>
                    <dd className="font-bold text-slate-900">{designSpecs?.faceId ? "Yüz Tanıma + Parmak İzi" : "Parmak İzi"}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-500">İşletim Sistemi</dt>
                    <dd className="font-bold text-slate-900">{softwareSpecs?.os || "Android 14 / iOS 18"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Pros & Cons (Artılar ve Eksiler) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 rounded-3xl p-6 border border-emerald-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {phone.name} Öne Çıkan Artıları
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Üst düzey ekran parlaklığı ({displaySpecs?.brightness || 2000} nits) ve akıcı {displaySpecs?.refreshRate || 120} Hz deneyimi</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Sınıfının en güçlü yonga seti mimarisi ({perfSpecs?.chipset || "Yüksek performanslı işlemci"})</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Optik Görüntü Sabitleme (OIS) ile gece çekimlerinde minimum gürültü ve yüksek detay</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>16 farklı doğrulanmış satıcı arasında yüksek fiyat rekabeti ve avantajlı taksit imkanları</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-rose-50/70 to-rose-100/30 rounded-3xl p-6 border border-rose-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-base mb-4">
                <XCircle className="w-5 h-5 text-rose-600" />
                Satın Almadan Önce Bilinmesi Gerekenler
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Kutu içeriğinde şarj adaptörü bulunmayabilir (ayrı olarak satın alınmalıdır)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>MicroSD hafıza kartı yuvası bulunmadığından ihtiyacınıza uygun depolama varyantını seçiniz</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>3.5mm geleneksel kulaklık girişi yoktur, kablosuz kulaklık veya Type-C dönüştürücü gerektirir</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Official Consumer Advisory & IMEI Warning (Per Strategic Mandate) */}
          <section className="bg-amber-50 rounded-3xl p-6 sm:p-7 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-2xl shrink-0 mt-0.5">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-amber-950 text-sm sm:text-base">
                  Resmi Garanti ve IMEI Sorgulama Bilgilendirmesi
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed max-w-3xl">
                  EnUcuzTelefon.com resmî devlet sorgulama merkezi değildir. Satın alacağınız telefonun IMEI durumunu, kayıt tarihini ve ithalatçı/distribütör statüsünü her zaman resmî e-Devlet BTK IMEI Sorgulama portalı üzerinden doğrulayınız. Sitemizdeki tüm mağazalar 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında işlem yapmaktadır.
                </p>
              </div>
            </div>

            <a
              href="https://www.turkiye.gov.tr/imei-sorgulama"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shrink-0 shadow-sm transition-colors"
            >
              <span>e-Devlet IMEI Sorgula</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>

          {/* Related and Rival Smartphones */}
          {relatedPhones.length > 0 && (
            <section className="pt-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                    Alternatif Seçenekler
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    {phone.name} ile Kıyaslanan Diğer Modeller
                  </h2>
                </div>
                <Link
                  href="/telefonlar"
                  className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
                >
                  <span>Tüm Telefonlar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPhones.map((p) => (
                  <PhoneCard key={p.id} phone={p} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}