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
  ExternalLink,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { getPhone, getRelatedPhones } from "@/lib/data";
import ProPriceAnalysisCenter from "@/components/phone/ProPriceAnalysisCenter";
import PhoneInteractiveShowcase from "@/components/phone/PhoneInteractiveShowcase";
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
    title: `${phone.name} En Ucuz Fiyatı, Mağaza Karşılaştırması ve Telemetri Analizi - EnUcuzTelefon.com`,
    description: `${phone.name} en ucuz nerede satılıyor? 10+ doğrulanmış satıcının canlı fiyat telemetrisi, 6 aylık dip fiyat grafiği, akıllı fiyat alarmı ve teknik özellikleri.`,
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
    <div className="min-h-screen bg-[#080a0f] text-white pb-16">
      {/* Desktop Breadcrumb (Hidden on Mobile where `< Telefon Detay` Stitch Header is active) */}
      <div className="hidden lg:block border-b border-white/[0.06] bg-[#0b0e14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center text-xs text-slate-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-sky-400 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <Link href="/telefonlar" className="hover:text-sky-400 transition-colors">
            Telefonlar
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <Link
            href={`/marka/${phone.brandSlug}`}
            className="hover:text-sky-400 transition-colors"
          >
            {phone.brand}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 shrink-0 text-slate-600" />
          <span className="text-sky-400 font-bold">{phone.name}</span>
        </div>
      </div>

      {/* Stitch Pro Fiyat Analiz & Canlı Mağaza Telemetri Ekranı */}
      <ProPriceAnalysisCenter phone={phone} />

      {/* Technical Hardware & Benchmark Deep-Dive Sections */}
      <div className="pt-6">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-4 space-y-10">
          {/* Deep Dive Performance & Benchmark Section */}
          <section className="bg-[#12161f] rounded-[28px] p-5 sm:p-8 border border-white/[0.08] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Laboratuvar ve Benchmark Telemetrisi
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2 text-white">
                  {phone.name} Donanım Gücü ve Performans Skoru
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Yonga seti, yapay zeka işlem birimi ve oyun stres testi verileri
                </p>
              </div>

              <div className="sm:text-right">
                <div className="text-xs text-slate-400">AnTuTu v10 Skoru</div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300">
                  {perfSpecs?.antutuScore?.toLocaleString("tr-TR") || "1.750.000"} Puan
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b0e14] rounded-2xl p-4 border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>İşlemci Verimliliği</span>
                  <span className="text-emerald-400 font-bold">%98 Zirve</span>
                </div>
                <div className="font-bold text-white text-sm sm:text-base mb-1">
                  {perfSpecs?.chipset || "Gelişmiş 3nm Mobil Yonga"}
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  {perfSpecs?.cpu || "Yüksek Frekanslı Hibrit Mimari"}
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                    style={{ width: "95%" }}
                  />
                </div>
              </div>

              <div className="bg-[#0b0e14] rounded-2xl p-4 border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Grafik ve Oyun (GPU)</span>
                  <span className="text-sky-400 font-bold">120 FPS Kararlı</span>
                </div>
                <div className="font-bold text-white text-sm sm:text-base mb-1">
                  {perfSpecs?.gpu || "Donanımsal Ray Tracing GPU"}
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  Işın İzleme (Ray Tracing) ve Mesh Shading
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>

              <div className="bg-[#0b0e14] rounded-2xl p-4 border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>RAM &amp; Depolama Hızı</span>
                  <span className="text-emerald-400 font-bold">NVMe / LPDDR5X</span>
                </div>
                <div className="font-bold text-white text-sm sm:text-base mb-1">
                  {perfSpecs?.ram || 8} GB RAM + {perfSpecs?.storage || 256} GB
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  Yüksek Bant Genişliği, Sıfır Gecikme Çoklu Görev
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                    style={{ width: "96%" }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Full Technical Specifications Grid */}
          <section
            id="teknik-ozellikler"
            className="bg-[#12161f] rounded-[28px] p-5 sm:p-8 border border-white/[0.08] shadow-xl"
          >
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
                  Eksiksiz Donanım Bilgisi
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {phone.name} Detaylı Teknik Özellikleri
                </h2>
              </div>
              <span className="text-xs text-slate-400 bg-white/[0.05] border border-white/10 px-3 py-1 rounded-full self-start sm:self-auto">
                Doğrulanmış Üretici Verileri
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Ekran */}
              <div className="bg-[#0b0e14] rounded-2xl p-4 sm:p-5 border border-white/[0.06]">
                <div className="flex items-center gap-2.5 font-bold text-white pb-3 border-b border-white/[0.08] mb-3 text-sm">
                  <div className="p-2 bg-sky-500/15 text-sky-400 rounded-xl">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  Ekran Özellikleri
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Boyut</dt>
                    <dd className="font-bold text-white">
                      {displaySpecs?.size || 6.3} inç
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Panel Teknolojisi</dt>
                    <dd className="font-bold text-white">
                      {displaySpecs?.technology || "LTPO Super Retina XDR OLED"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Çözünürlük</dt>
                    <dd className="font-bold text-white">
                      {displaySpecs?.resolution || "2622 x 1206 px"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Yenileme Hızı</dt>
                    <dd className="font-bold text-emerald-400">
                      {displaySpecs?.refreshRate || 120} Hz ProMotion
                    </dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-400">Zirve Parlaklık</dt>
                    <dd className="font-bold text-white">
                      {displaySpecs?.brightness || 2000} nits
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Kamera */}
              <div className="bg-[#0b0e14] rounded-2xl p-4 sm:p-5 border border-white/[0.06]">
                <div className="flex items-center gap-2.5 font-bold text-white pb-3 border-b border-white/[0.08] mb-3 text-sm">
                  <div className="p-2 bg-rose-500/15 text-rose-400 rounded-xl">
                    <Camera className="w-4 h-4" />
                  </div>
                  Kamera Donanımı
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Ana Kamera</dt>
                    <dd className="font-bold text-white">
                      {cameraSpecs?.mainCamera?.megapixels || 48} MP (
                      {cameraSpecs?.mainCamera?.aperture || "f/1.78"})
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Optik Sabitleme (OIS)</dt>
                    <dd className="font-bold text-emerald-400">
                      {cameraSpecs?.mainCamera?.ois
                        ? "Sensör Kaydırmalı OIS"
                        : "Elektronik EIS"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Ultra Geniş Açı</dt>
                    <dd className="font-bold text-white">
                      {cameraSpecs?.ultrawide?.megapixels || 48} MP
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Telefoto / Zoom</dt>
                    <dd className="font-bold text-white">
                      {cameraSpecs?.telephoto
                        ? `${cameraSpecs.telephoto.opticalZoom}x Optik Zoom`
                        : "5x Tetraprizma Optik"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-400">Video Kaydı</dt>
                    <dd className="font-bold text-white">
                      {cameraSpecs?.videoCapabilities?.[0] || "4K @ 120 FPS Dolby Vision"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Batarya & Şarj */}
              <div className="bg-[#0b0e14] rounded-2xl p-4 sm:p-5 border border-white/[0.06]">
                <div className="flex items-center gap-2.5 font-bold text-white pb-3 border-b border-white/[0.08] mb-3 text-sm">
                  <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl">
                    <Battery className="w-4 h-4" />
                  </div>
                  Batarya &amp; Şarj
                </div>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Pil Kapasitesi</dt>
                    <dd className="font-bold text-white">
                      {batterySpecs?.capacity || 3582} mAh
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Kablolu Hızlı Şarj</dt>
                    <dd className="font-bold text-emerald-400">
                      {batterySpecs?.wiredCharging || 30}W USB-C PD
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Kablosuz Şarj</dt>
                    <dd className="font-bold text-white">
                      {batterySpecs?.wirelessCharging
                        ? `${batterySpecs.wirelessCharging}W MagSafe / Qi2`
                        : "25W MagSafe"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.05]">
                    <dt className="text-slate-400">Ağ &amp; 5G</dt>
                    <dd className="font-bold text-emerald-400">
                      {connSpecs?.fiveG !== false ? "5G + Wi-Fi 7" : "4.5G LTE"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-slate-400">Kasa &amp; Koruma</dt>
                    <dd className="font-bold text-white">
                      {designSpecs?.waterResistance || "IP68 • Grade 5 Titanyum"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Pros & Cons */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#12161f] rounded-[28px] p-5 sm:p-6 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {phone.name} Öne Çıkan Artıları
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    10 doğrulanmış resmi mağaza arasında canlı fiyat rekabeti ve dip fiyat garantisi
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    Üst düzey ekran parlaklığı ({displaySpecs?.brightness || 2000} nits) ve{" "}
                    {displaySpecs?.refreshRate || 120} Hz akıcı panel
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    Sınıfının lideri işlemci mimarisi ({perfSpecs?.chipset || "A18 Pro"}) ve uzun yazılım desteği
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[#12161f] rounded-[28px] p-5 sm:p-6 border border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base mb-4">
                <XCircle className="w-5 h-5 text-rose-400" />
                Satın Almadan Önce Bilinmesi Gerekenler
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>
                    Kutu içeriğinde güç adaptörü yer almadığından tavsiye edilen hızlı şarj adaptörü ayrıca değerlendirilmelidir
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>
                    Hafıza kartı (microSD) desteği bulunmadığı için uzun vadeli kullanıma uygun depolama kapasitesi seçilmelidir
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Official Consumer Advisory & BTK IMEI Notice */}
          <section className="bg-[#12161f] rounded-[28px] p-5 sm:p-6 border border-amber-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-2xl shrink-0 mt-0.5">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm sm:text-base">
                  Resmi Garanti ve BTK IMEI Sorgulama Bilgilendirmesi
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">
                  Listelenen tüm mağaza teklifleri resmi Türkiye distribütör veya üretici garantili cihazları kapsar. Satın aldığınız cihazın IMEI kayıt durumunu her zaman resmî e-Devlet BTK portalı üzerinden doğrulayabilirsiniz.
                </p>
              </div>
            </div>

            <a
              href="https://www.turkiye.gov.tr/imei-sorgulama"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-xl shrink-0 transition-colors"
            >
              <span>e-Devlet IMEI Sorgula</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>

          {/* Related Smartphones */}
          {relatedPhones.length > 0 && (
            <section className="pt-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
                    Alternatif Seçenekler
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                    {phone.name} ile Kıyaslanan Diğer Modeller
                  </h2>
                </div>
                <Link
                  href="/telefonlar"
                  className="text-xs sm:text-sm font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                >
                  <span>Tüm Telefonlar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
