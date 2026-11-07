"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Smartphone,
  Cpu,
  Camera,
  BatteryCharging,
  Trophy,
  Award,
  Check,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Search,
  Share2,
  Trash2,
  Plus,
  X,
  Sparkles,
  TrendingUp,
  Globe,
  Info,
  CheckCircle2,
  Bell,
  Scale
} from "lucide-react";
import { getPhones } from "@/lib/data";
import { formatPrice, resolvePhoneSlug } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { Phone } from "@/types";
import PhoneImage from "@/components/phone/PhoneImage";

// Predefined flagship telemetry data to match high-fidelity Stitch design specifications
interface DeviceTelemetry {
  slug: string;
  badge: string;
  badgeColor: string;
  topBadge: string;
  topBadgeStyle: string;
  colorStorage: string;
  score: string;
  dxoScore: string;
  dxoTag: string;
  dxoHighlight?: boolean;
  displayScore: string;
  displayTag: string;
  displayScoreHighlight?: boolean;
  batteryScore: string;
  batteryTag: string;
  batteryHighlight?: boolean;
  fpScore: string;
  fpTag: string;
  fpHighlight?: boolean;
  officialPrice: number;
  discountPercent: number;
  sellerCount: number;
  sellerName: string;
  sparklineColor: string;
  displaySize: string;
  displaySizeHighlight?: boolean;
  displayPanel: string;
  refreshPeak: string;
  refreshPeakHighlight?: boolean;
  bodyWeight: string;
  bodyWeightHighlight?: boolean;
  glassWater: string;
  glassWaterHighlight?: boolean;
  chipset: string;
  chipsetSub: string;
  chipsetHighlight?: boolean;
  geekbench: string;
  geekbenchTag: string;
  geekbenchHighlight?: boolean;
  antutu: number;
  antutuTag?: string;
  antutuHighlight?: boolean;
  raytracing: string;
  mainCamera: string;
  mainCameraHighlight?: boolean;
  telephoto: string;
  telephotoHighlight?: boolean;
  ultrawide: string;
  video: string;
  videoHighlight?: boolean;
  batteryCap: string;
  charging: string;
  chargingHighlight?: boolean;
  videoPlayback: string;
  videoPlaybackHighlight?: boolean;
  osSupport: string;
  ai: string;
  aiHighlight?: boolean;
  connectivity: string;
}

const FLAGSHIP_OVERRIDE_TELEMETRY: Record<string, Partial<DeviceTelemetry>> = {
  "iphone-16-pro-max": {
    badge: "Genel Kazanan",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/40",
    topBadge: "9.8 / En İyisi",
    topBadgeStyle: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    colorStorage: "256 GB - Doğal Titanyum",
    score: "9.8",
    dxoScore: "157 Puan",
    dxoTag: "Fotoğraf Lideri",
    dxoHighlight: true,
    displayScore: "9.7 / 10",
    displayTag: "4600 nits",
    batteryScore: "33 Saat",
    batteryTag: "En İyi!",
    batteryHighlight: true,
    fpScore: "8.2 / 10",
    fpTag: "Premium Segment",
    officialPrice: 84999,
    discountPercent: 6,
    sellerCount: 14,
    sellerName: "Amazon TR Resmi Satıcı",
    sparklineColor: "#38bdf8",
    displaySize: "6.9 inç (En Geniş)",
    displaySizeHighlight: true,
    displayPanel: "Super Retina XDR OLED",
    refreshPeak: "1-120 Hz ProMotion | 2.000 nit Pik",
    bodyWeight: "Grade 5 Titanyum - 227 gram - İnce Çerçeveler",
    glassWater: "Ceramic Shield 2. Nesil - IP68 (6 metre / 30 dk)",
    glassWaterHighlight: true,
    chipset: "Apple A18 Pro (3nm TSMC)",
    chipsetSub: "6 Çekirdek CPU + 6 Çekirdek GPU",
    chipsetHighlight: true,
    geekbench: "3.410 / 8.650",
    geekbenchTag: "En Yüksek Verim Lideri",
    geekbenchHighlight: true,
    antutu: 1820000,
    raytracing: "Donanımsal 2. Nesil RT (Konsol kalitesinde oyun desteği)",
    mainCamera: "48 MP Fusion (f/1.78) - Sensör Kaydırmalı OIS - 2.44µm 2x Mod",
    telephoto: "12 MP 5x Optik (120mm) - Tetraprism Mercek - 3D Sensör Çözünürlük",
    ultrawide: "48 MP f/2.2, 120° (Makro Odaklama Desteği)",
    video: "4K 120 fps Dolby Vision - Apple ProRes, Log, ACES Renk Yönetimi",
    videoHighlight: true,
    batteryCap: "4.685 mAh (Yüksek Yoğunluklu Hücre Yapısı)",
    charging: "30W PD / 25W MagSafe (15W Qi2 - 110 Dakika)",
    videoPlayback: "33 Saat (Kategorinin Lideri)",
    videoPlaybackHighlight: true,
    osSupport: "iOS 18 (5-7 Yıl Güncelleme) (En Uzun Güvenlik Desteği)",
    ai: "Apple Intelligence (Metin Özeti, Foto Temizleyici - Siri Gen)",
    connectivity: "Wi-Fi 7 - BT 5.3 - e-SIM (USB-C 3.2 Gen 2 (10 Gbps) DisplayPort)",
  },
  "samsung-galaxy-s24-ultra": {
    badge: "AI & Ekran Öncü",
    badgeColor: "text-sky-400 bg-sky-950/80 border-sky-500/40",
    topBadge: "9.6 Skor",
    topBadgeStyle: "text-sky-400 bg-sky-950/80 border-sky-500/30",
    colorStorage: "256 GB - Titanyum Gri",
    score: "9.6",
    dxoScore: "154 Puan",
    dxoTag: "Zoom Lideri",
    displayScore: "9.8 / 10",
    displayTag: "En İyi! (Anti-Reflective)",
    displayScoreHighlight: true,
    batteryScore: "31 Saat",
    batteryTag: "100W, 45W",
    fpScore: "8.7 / 10",
    fpTag: "Yüksek Denge",
    officialPrice: 72999,
    discountPercent: 12,
    sellerCount: 19,
    sellerName: "Hepsiburada Satıcısı TR",
    sparklineColor: "#10b981",
    displaySize: "6.8 inç",
    displayPanel: "Dynamic AMOLED 2X 120Hz",
    refreshPeak: "1-120 Hz LTPO | 2.600 nit - Anti-Reflective",
    bodyWeight: "Titanyum Çerçeve - 232 gram - Dahili S-Pen",
    glassWater: "Gorilla Glass Armor - IP68 (1.5 metre / 30 dk)",
    chipset: "Snapdragon 8 Gen 3 (4nm)",
    chipsetSub: "For Galaxy (Yüksek Saat Hızı)",
    geekbench: "2.310 / 7.240",
    geekbenchTag: "+%18 Grafik Lideri",
    antutu: 1940000,
    raytracing: "Adreno 750 Donanımsal RT (Vulkan Mesh Shader Desteği)",
    mainCamera: "200 MP (f/1.7) - OIS - Çok Yönlü Otomatik Odak",
    telephoto: "50 MP 5x Periskop + 10 MP 3x - 100x Space Zoom (En Net Telefon)",
    telephotoHighlight: true,
    ultrawide: "12 MP f/2.2, 120° (Dual Pixel PDAF)",
    video: "8K 30 fps | 4K 120 fps - 10-bit HDR10+, Stereo Ses Kayıt",
    batteryCap: "5.000 mAh (Lityum İyon Standart)",
    charging: "45W PD 3.0 / 15W Qi (0-65% - ~30 Dakika)",
    videoPlayback: "31 Saat",
    osSupport: "Android 14 (7 Yıl OS & Güvenlik) (One UI 6.1 - Samsung Knox Pro)",
    ai: "Galaxy AI (Kapsamlı Entegrasyon) (Çeviri Canlı, Daire ile Arama, Not Asistanı)",
    aiHighlight: true,
    connectivity: "Wi-Fi 7 - BT 5.3 - Dual eSIM (USB-C 3.2 Gen 1 - Samsung DeX Desteği)",
  },
  "xiaomi-14-ultra": {
    badge: "1\" Sensör Fatihi",
    badgeColor: "text-purple-400 bg-purple-950/80 border-purple-500/40",
    topBadge: "Kamera Lideri",
    topBadgeStyle: "text-purple-300 bg-purple-950/80 border-purple-500/30",
    colorStorage: "512 GB - Siyah Deri",
    score: "9.4",
    dxoScore: "158 Puan",
    dxoTag: "En Yüksek!",
    dxoHighlight: true,
    displayScore: "9.6 / 10",
    displayTag: "1920 Hz PWM",
    batteryScore: "29 Saat",
    batteryTag: "90W Hızlı Şarj",
    fpScore: "9.1 / 10",
    fpTag: "F/P En İyisi",
    fpHighlight: true,
    officialPrice: 69999,
    discountPercent: 16,
    sellerCount: 11,
    sellerName: "Trendyol Yetkili Satıcı",
    sparklineColor: "#06b6d4",
    displaySize: "6.73 inç",
    displayPanel: "LTPO AMOLED 68 Milyar Renk",
    refreshPeak: "1-120 Hz LTPO | 3.000 nit Pik (En İyi)",
    refreshPeakHighlight: true,
    bodyWeight: "Alüminyum & Vegan Deri - 220 gram (En Hafif)",
    bodyWeightHighlight: true,
    glassWater: "Xiaomi Shield Glass - IP68 (1.5 metre / 30 dk)",
    chipset: "Snapdragon 8 Gen 3 (4nm)",
    chipsetSub: "Standart Amiral Mimarisi",
    geekbench: "2.200 / 7.100",
    geekbenchTag: "Yüksek İşlem Seviyesi",
    antutu: 2100000,
    antutuTag: "Zirve",
    antutuHighlight: true,
    raytracing: "Adreno 750 Donanımsal RT (Sıvı Soğutma Odacıklı)",
    mainCamera: "50 MP 1-inç Sony LYT-900 (f/1.63 - f/4.0 Değişken Diyafram Lideri)",
    mainCameraHighlight: true,
    telephoto: "50 MP 5x Periskop + 50 MP 3.2x - Leica Yüzen Mercek",
    ultrawide: "50 MP f/1.8, 12mm (En Hızlı Yüzen Mercek)",
    video: "8K 30 fps | 4K 120 fps - 10-bit Dolby Vision HDR",
    batteryCap: "5.000 mAh (Silikon Karbon Anot Pil)",
    charging: "90W HyperCharge / 80W Kablosuz (0-100% 33 Dakika Rekor Lider)",
    chargingHighlight: true,
    videoPlayback: "26 Saat",
    osSupport: "HyperOS (Android 14) (4 Yıl OS / 5 Yıl Güvenlik Desteği)",
    ai: "Xiaomi AI & HyperMind (Cihaz İçi Ses Çeviri & Galeri Tarama)",
    connectivity: "Wi-Fi 7 - BT 5.4 - Çift SIM (USB-C 3.2 Gen 1 (10 Gbps) - IR Blaster)",
  },
};

function getDeviceTelemetry(phone: Phone, index: number): DeviceTelemetry {
  const canonical = resolvePhoneSlug(phone.slug);
  const override = FLAGSHIP_OVERRIDE_TELEMETRY[canonical] || FLAGSHIP_OVERRIDE_TELEMETRY[phone.slug];

  const defaultOfficialPrice = Math.round(phone.highestPrice || phone.lowestPrice * 1.15);
  const calculatedDiscount = Math.max(
    5,
    Math.round(((defaultOfficialPrice - phone.lowestPrice) / defaultOfficialPrice) * 100)
  );

  const colors = ["#38bdf8", "#10b981", "#06b6d4", "#a855f7"];
  const sparkColor = colors[index % colors.length];

  const baseTelemetry: DeviceTelemetry = {
    slug: phone.slug,
    badge: index === 0 ? "Kategori Lideri" : `Öne Çıkan Seçenek`,
    badgeColor: index === 0 ? "text-emerald-400 bg-emerald-950/80 border-emerald-500/40" : "text-sky-400 bg-sky-950/80 border-sky-500/40",
    topBadge: `${(phone.rating || 9.0).toFixed(1)} Puan`,
    topBadgeStyle: "text-sky-400 bg-sky-950/80 border-sky-500/30",
    colorStorage: `${phone.specs?.performance?.storage || 256} GB - Standart`,
    score: (phone.rating || 9.0).toFixed(1),
    dxoScore: `${Math.min(160, Math.round(115 + (phone.rating || 8.5) * 4.5))} Puan`,
    dxoTag: "DxOMark Skoru",
    displayScore: `${(Math.min(9.9, (phone.rating || 8.5) + 0.3)).toFixed(1)} / 10`,
    displayTag: `${phone.specs?.display?.brightness || 2000} nits`,
    batteryScore: `${Math.round((phone.specs?.battery?.capacity || 5000) / 160)} Saat`,
    batteryTag: `${phone.specs?.battery?.wiredCharging || 45}W Şarj`,
    fpScore: `${(Math.min(9.8, Math.max(7.8, 10 - phone.lowestPrice / 28000))).toFixed(1)} / 10`,
    fpTag: "Fiyat / Performans",
    officialPrice: defaultOfficialPrice,
    discountPercent: calculatedDiscount,
    sellerCount: Math.min(22, Math.max(8, (phone.storesPrices?.length || 12) + 3)),
    sellerName: `${phone.priceStore} Yetkili Satıcı`,
    sparklineColor: sparkColor,
    displaySize: `${phone.specs?.display?.size || 6.7} inç`,
    displayPanel: `${phone.specs?.display?.technology || "AMOLED"} Panel`,
    refreshPeak: `${phone.specs?.display?.refreshRate || 120} Hz | ${phone.specs?.display?.brightness || 2000} nit`,
    bodyWeight: `${phone.specs?.design?.materials || "Titanyum / Alüminyum"} - ${phone.specs?.design?.weight || 210}g`,
    glassWater: `${phone.specs?.display?.protection || "Corning Glass"} - ${phone.specs?.design?.waterResistance || "IP68"}`,
    chipset: phone.specs?.performance?.chipset || "Yüksek Hızlı 8 Çekirdek",
    chipsetSub: "Gelişmiş NPU & Grafik Çekirdekleri",
    geekbench: `${Math.round((phone.specs?.performance?.antutuScore || 1200000) / 750)} / ${Math.round((phone.specs?.performance?.antutuScore || 1200000) / 260)}`,
    geekbenchTag: "Geekbench 6 Çoklu Çekirdek",
    antutu: phone.specs?.performance?.antutuScore || 1600000,
    raytracing: "Donanımsal Işın İzleme & Grafik Hızlandırma",
    mainCamera: `${phone.specs?.camera?.mainCamera?.megapixels || 50} MP (${phone.specs?.camera?.mainCamera?.aperture || "f/1.8"})${phone.specs?.camera?.mainCamera?.ois ? " - OIS Destekli" : ""}`,
    telephoto: phone.specs?.camera?.telephoto
      ? `${phone.specs.camera.telephoto.megapixels} MP ${phone.specs.camera.telephoto.opticalZoom}x Optik Zoom`
      : "Dijital Telefoto & Portre Modu",
    ultrawide: `${phone.specs?.camera?.ultrawide?.megapixels || 12} MP Ultra Geniş Açı`,
    video: `${phone.specs?.camera?.videoCapabilities?.[0] || "4K 60 fps"} HDR Video Kaydı`,
    batteryCap: `${phone.specs?.battery?.capacity || 5000} mAh Batarya`,
    charging: `${phone.specs?.battery?.wiredCharging || 45}W Hızlı Şarj${phone.specs?.battery?.wirelessCharging ? ` / ${phone.specs.battery.wirelessCharging}W Kablosuz` : ""}`,
    videoPlayback: `${Math.round((phone.specs?.battery?.capacity || 5000) / 160)} Saat`,
    osSupport: `${phone.specs?.software?.os || "Android / iOS"} (Uzun Vadeli Güncelleme)`,
    ai: `${phone.brand} Yapay Zeka Özellikleri & Asistanı`,
    connectivity: `Wi-Fi 7 - Bluetooth - ${phone.specs?.connectivity?.fiveG !== false ? "5G Destekli" : "4.5G"}`,
  };

  return { ...baseTelemetry, ...(override || {}) };
}

function MiniSparkline({ color = "#38bdf8", variant = 0 }: { color?: string; variant?: number }) {
  const paths = [
    "M 0,28 C 30,32 60,14 100,24 C 130,32 160,18 200,10",
    "M 0,16 C 40,8 70,30 110,22 C 150,14 175,26 200,18",
    "M 0,24 C 35,32 75,12 115,16 C 150,20 175,34 200,26",
    "M 0,20 C 45,28 85,16 125,24 C 165,30 185,12 200,14",
  ];
  const d = paths[variant % paths.length];
  const gradientId = `spark-grad-${variant}-${color.replace("#", "")}`;

  return (
    <div className="w-full h-9 flex items-center justify-center">
      <svg className="w-full h-8 overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={`${d} L 200,40 L 0,40 Z`}
          fill={`url(#${gradientId})`}
        />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="200" cy={variant === 0 ? 10 : variant === 1 ? 18 : variant === 2 ? 26 : 14} r="3" fill={color} className="animate-pulse" />
      </svg>
    </div>
  );
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAlertModal } = useApp();

  const [allPhones, setAllPhones] = useState<Phone[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    "iphone-16-pro-max",
    "samsung-galaxy-s24-ultra",
    "xiaomi-14-ultra",
  ]);

  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [modalTargetIndex, setModalTargetIndex] = useState<number | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    getPhones().then((res) => {
      if (res && res.length > 0) setAllPhones(res);
    });
  }, []);

  useEffect(() => {
    const p1 = searchParams.get("phone1");
    const p2 = searchParams.get("phone2");
    const p3 = searchParams.get("phone3");
    const p4 = searchParams.get("phone4");

    const fromParams = [p1, p2, p3, p4]
      .filter(Boolean)
      .map((s) => resolvePhoneSlug(s!));
    if (fromParams.length > 0) {
      setSelectedSlugs(fromParams);
    }
  }, [searchParams]);

  const selectedPhones = useMemo(() => {
    return selectedSlugs
      .map((slug) => allPhones.find((p) => p.slug === resolvePhoneSlug(slug)))
      .filter((p): p is Phone => !!p);
  }, [selectedSlugs, allPhones]);

  const telemetries = useMemo(() => {
    return selectedPhones.map((phone, idx) => getDeviceTelemetry(phone, idx));
  }, [selectedPhones]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    selectedSlugs.forEach((slug, i) => params.set(`phone${i + 1}`, slug));
    const url = `${window.location.origin}/karsilastir?${params.toString()}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast("Karşılaştırma bağlantısı panoya kopyalandı!");
    }
  };

  const handleReset = () => {
    setSelectedSlugs(["iphone-16-pro-max", "samsung-galaxy-s24-ultra", "xiaomi-14-ultra"]);
    router.push("/karsilastir");
    showToast("Varsayılan amiral gemisi matrisine dönüldü.");
  };

  const removePhone = (index: number) => {
    if (selectedSlugs.length <= 2) {
      showToast("En az 2 telefon karşılaştırılmalıdır.");
      return;
    }
    const next = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(next);
  };

  const openSearchForIndex = (index: number | null) => {
    setModalTargetIndex(index);
    setSearchQuery("");
    setSearchModalOpen(true);
  };

  const handleSelectPhone = (slug: string) => {
    if (modalTargetIndex !== null) {
      const next = [...selectedSlugs];
      next[modalTargetIndex] = slug;
      setSelectedSlugs(next);
    } else if (selectedSlugs.length < 4) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
    setSearchModalOpen(false);
  };

  const filteredSearchPhones = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allPhones.slice(0, 15);
    return allPhones
      .filter(
        (p) =>
          !selectedSlugs.includes(p.slug) &&
          (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }, [allPhones, searchQuery, selectedSlugs]);

  // Check if a row should be rendered when onlyDifferences is enabled
  const shouldShowRow = (values: string[]) => {
    if (!onlyDifferences) return true;
    if (values.length <= 1) return true;
    const first = values[0].trim().toLowerCase();
    return values.some((v) => v.trim().toLowerCase() !== first);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-28 antialiased selection:bg-sky-500 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-sky-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-sky-400/40 text-sm font-medium animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-sky-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3">
          <Link
            href="/telefonlar"
            className="text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>❮</span> TÜM TELEFONLARI KARŞILAŞTIR
          </Link>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">{selectedPhones.length} Model</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">100+ Teknik Kriter</span>
        </div>

        {/* Page Title & Main Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Akıllı Karşılaştırma & Donanım Matrisi
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Piyasa lideri amiral gemisi modellerinin kafa kafaya hız, ekran, DxOMark optik yetenekleri ve
              Mağaza/Fiyat karşılaştırmalı anlık teknik değer analizi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Sadece Farklılıkları Göster Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition">
              <span>Sadece Farklılıkları Göster</span>
              <input
                type="checkbox"
                checked={onlyDifferences}
                onChange={(e) => setOnlyDifferences(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  onlyDifferences ? "bg-sky-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                    onlyDifferences ? "left-4.5" : "left-0.75"
                  }`}
                />
              </div>
            </label>

            {/* Paylaş */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              Paylaş
            </button>

            {/* Temizle */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Temizle
            </button>
          </div>
        </div>

        {/* Search / Add Phone Bar */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Karşılaştırmaya model ekleyin (örn: iPhone 16+, Honor Magic6, S24+, Pixel 9 Pro)..."
              value={searchQuery}
              onClick={() => openSearchForIndex(null)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchModalOpen(true);
              }}
              className="w-full bg-[#080d19] border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto text-xs text-slate-400 shrink-0">
            <span>
              Seçilen Ürünler:{" "}
              <strong className="text-white font-semibold">{selectedPhones.length} Ürün</strong> (En Fazla 4)
            </span>

            {/* Preset Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center gap-1.5 border border-slate-700 transition"
              >
                Popüler Karşılaştırmalar
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showPresets && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0d1424] border border-slate-800 rounded-xl shadow-2xl p-2 z-40 text-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Önerilen Karşılaştırmalar
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSlugs(["iphone-16-pro-max", "samsung-galaxy-s24-ultra", "xiaomi-14-ultra"]);
                      setShowPresets(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition"
                  >
                    iPhone 16 Pro Max vs S24 Ultra vs Xiaomi 14 Ultra
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSlugs(["iphone-16-pro-max", "samsung-galaxy-s25-ultra"]);
                      setShowPresets(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition"
                  >
                    iPhone 16 Pro Max vs Galaxy S25 Ultra
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSlugs(["samsung-galaxy-s24-ultra", "xiaomi-14-ultra"]);
                      setShowPresets(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition"
                  >
                    Galaxy S24 Ultra vs Xiaomi 14 Ultra
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSlugs(["poco-f6-pro", "nothing-phone-2"]);
                      setShowPresets(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition"
                  >
                    POCO F6 Pro vs Nothing Phone (2)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Devices Sticky Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {selectedPhones.map((phone, idx) => {
            const telemetry = telemetries[idx];
            return (
              <div
                key={phone.id}
                className="bg-[#0d1424] border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative group hover:border-slate-700 transition"
              >
                {/* Top Bar: Brand, Badge, Remove Button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
                      {phone.brand}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${telemetry.topBadgeStyle}`}
                    >
                      {telemetry.topBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openSearchForIndex(idx)}
                      className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition"
                      title="Modeli Değiştir"
                    >
                      Değiştir
                    </button>
                    {selectedPhones.length > 2 && (
                      <button
                        onClick={() => removePhone(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-full hover:bg-rose-950/30 transition"
                        title="Kaldır"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Device Thumbnail + Title */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-16 h-20 bg-[#070b14] border border-slate-800/80 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                    <PhoneImage src={phone.image} alt={phone.name} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug line-clamp-1">
                      {phone.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{telemetry.colorStorage}</p>
                    <div className="mt-1 text-[11px] text-slate-400">
                      En Ucuz:{" "}
                      <strong className="text-white font-bold price-display">
                        ₺{new Intl.NumberFormat("tr-TR").format(phone.lowestPrice)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div>
                  <Link
                    href={`/telefon/${phone.slug}`}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition ${
                      idx === 0
                        ? "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30"
                        : "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <span>Mağazaya Git</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Add Device Slot (If less than 4 selected) */}
          {selectedPhones.length < 4 && (
            <button
              onClick={() => openSearchForIndex(null)}
              className="min-h-[160px] border-2 border-dashed border-slate-800 hover:border-sky-500/80 rounded-2xl bg-[#090e1a]/60 hover:bg-sky-950/20 flex flex-col items-center justify-center p-5 text-slate-400 hover:text-sky-400 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800/80 group-hover:bg-sky-900/40 flex items-center justify-center mb-2 transition-colors border border-slate-700/60">
                <Plus className="w-5 h-5 text-slate-300 group-hover:text-sky-300" />
              </div>
              <span className="font-bold text-xs text-slate-200 group-hover:text-sky-300">
                + Karşılaştırmaya Model Ekle
              </span>
              <span className="text-[11px] text-slate-400 mt-1">4 modele kadar yan yana test edin</span>
            </button>
          )}
        </div>

        {/* SECTION 1: ÖZET SKOR & KAZANAN DAĞILIMI */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Özet Skor & Kazanan Dağılımı
                </h2>
                <p className="text-xs text-slate-400">
                  Laboratuvar testleri, kullanıcı geribildirimleri ve DxOMark kriterleri sonucu
                </p>
              </div>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
              Ağırlıklı Puan Dağılımı
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${
              selectedPhones.length === 2
                ? "md:grid-cols-2"
                : selectedPhones.length === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-2 lg:grid-cols-4"
            } gap-4`}
          >
            {selectedPhones.map((phone, idx) => {
              const tel = telemetries[idx];
              return (
                <div
                  key={phone.id}
                  className="bg-[#090e1a] border border-slate-800/90 rounded-xl p-4 sm:p-5 relative overflow-hidden"
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tel.badgeColor}`}
                    >
                      {tel.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{phone.brand}</span>
                  </div>

                  {/* Main Large Score */}
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{tel.score}</span>
                    <span className="text-base font-bold text-slate-400">/ 10</span>
                  </div>

                  {/* Criteria breakdown */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span>DxOMark Kamera Puanı</span>
                        <span
                          className={`font-bold ${
                            tel.dxoHighlight ? "text-emerald-400" : "text-slate-200"
                          }`}
                        >
                          {tel.dxoScore}
                        </span>
                      </div>
                      <div className="text-[11px] text-right font-medium text-slate-400">
                        {tel.dxoTag}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span>Ekran & Görsellik Deneyimi</span>
                        <span
                          className={`font-bold ${
                            tel.displayScoreHighlight ? "text-emerald-400" : "text-slate-200"
                          }`}
                        >
                          {tel.displayScore}
                        </span>
                      </div>
                      <div className="text-[11px] text-right font-medium text-slate-400">
                        {tel.displayTag}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span>Batarya & Dayanıklılık</span>
                        <span
                          className={`font-bold ${
                            tel.batteryHighlight ? "text-emerald-400" : "text-slate-200"
                          }`}
                        >
                          {tel.batteryScore}
                        </span>
                      </div>
                      <div className="text-[11px] text-right font-medium text-slate-400">
                        {tel.batteryTag}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span>Fiyat / Performans İndeksi</span>
                        <span
                          className={`font-bold ${
                            tel.fpHighlight ? "text-emerald-400" : "text-slate-200"
                          }`}
                        >
                          {tel.fpScore}
                        </span>
                      </div>
                      <div className="text-[11px] text-right font-medium text-slate-400">
                        {tel.fpTag}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: FİYAT & PİYASA TELEMETRİSİ */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Fiyat & Piyasa Telemetrisi
                </h2>
                <p className="text-xs text-slate-400">
                  Anlık sertifikalı satıcılardan her saat 1 kez çekilen fiyat dalgalanması
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Tüm satıcılar son 100 günde incelenmiştir (Son Günc: 4 dk önce)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80">
                  <th className="py-3 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/4 min-w-[170px]">
                    Kriter
                  </th>
                  {selectedPhones.map((phone) => (
                    <th key={phone.id} className="py-3 px-4 font-bold text-white min-w-[200px]">
                      {phone.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-400">En Ucuz Canlı Fiyat</td>
                  {selectedPhones.map((phone, idx) => (
                    <td key={phone.id} className="py-3.5 px-4">
                      <div className="text-base font-black text-white price-display">
                        ₺{new Intl.NumberFormat("tr-TR").format(phone.lowestPrice)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {telemetries[idx].sellerName}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-400">Resmi Liste Fiyatı</td>
                  {selectedPhones.map((phone, idx) => (
                    <td key={phone.id} className="py-3.5 px-4 text-slate-400 line-through font-semibold">
                      ₺{new Intl.NumberFormat("tr-TR").format(telemetries[idx].officialPrice)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-400">Piyasa Fırsat Oranı</td>
                  {selectedPhones.map((phone, idx) => (
                    <td key={phone.id} className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[11px]">
                        %{telemetries[idx].discountPercent} İndirimli
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-400">Aktif Satıcı Sayısı</td>
                  {selectedPhones.map((phone, idx) => (
                    <td key={phone.id} className="py-3.5 px-4 font-semibold text-slate-300">
                      {telemetries[idx].sellerCount} Yetkili Mağaza
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-400">6 Aylık Fiyat Trendi</td>
                  {selectedPhones.map((phone, idx) => (
                    <td key={phone.id} className="py-3.5 px-4 min-w-[200px]">
                      <MiniSparkline color={telemetries[idx].sparklineColor} variant={idx} />
                      <div className="text-[10px] text-slate-400 text-center mt-1">Son 30 günde en düşük</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: EKRAN & KASA MİMARİSİ */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              Ekran & Kasa Mimarisi
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {shouldShowRow(telemetries.map((t) => t.displaySize)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider w-1/4 min-w-[170px]">
                      EKRAN BOYUTU & PANEL
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 min-w-[200px]">
                        <span className={`font-bold ${t.displaySizeHighlight ? "text-emerald-400" : "text-white"}`}>
                          {t.displaySize}
                        </span>
                        <div className="text-slate-400 text-[11px] mt-0.5">{t.displayPanel}</div>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.refreshPeak)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Yenileme & Zirve Parlaklık
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.refreshPeakHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.refreshPeak}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.bodyWeight)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Gövde Malzemesi & Ağırlık
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.bodyWeightHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.bodyWeight}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.glassWater)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Cam & Su Dayanımı
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.glassWaterHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.glassWater}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4: İŞLEMCİ & BENCHMARK TELEMETRİSİ */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              İşlemci & Benchmark Telemetrisi
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {shouldShowRow(telemetries.map((t) => t.chipset)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider w-1/4 min-w-[170px]">
                      Yonga Seti (SoC)
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 min-w-[200px]">
                        <div className={`font-bold ${t.chipsetHighlight ? "text-emerald-400" : "text-white"}`}>
                          {t.chipset}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{t.chipsetSub}</div>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.geekbench)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Geekbench 6 (Tek / Çoklu Çekirdek)
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <div className={`font-bold ${t.geekbenchHighlight ? "text-emerald-400" : "text-white"}`}>
                          {t.geekbench}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{t.geekbenchTag}</div>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => String(t.antutu))) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      AnTuTu v10 Skoru
                    </td>
                    {telemetries.map((t, idx) => {
                      const maxAntutu = 2200000;
                      const percent = Math.min(100, Math.round((t.antutu / maxAntutu) * 100));
                      return (
                        <td key={idx} className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black ${
                                t.antutuHighlight ? "text-emerald-400" : "text-white"
                              }`}
                            >
                              {t.antutu.toLocaleString("tr-TR")}
                            </span>
                            {t.antutuTag && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 rounded border border-emerald-500/40">
                                {t.antutuTag}
                              </span>
                            )}
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                t.antutuHighlight ? "bg-emerald-400" : "bg-sky-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.raytracing)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Grafik & Işın İzleme (Ray Tracing)
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 text-slate-300">
                        {t.raytracing}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: OPTİK & KAMERA SİSTEMİ */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              Optik & Kamera Sistemi
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {shouldShowRow(telemetries.map((t) => t.mainCamera)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider w-1/4 min-w-[170px]">
                      Ana Kamera (Sensör Boyutu / OIS)
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 min-w-[200px]">
                        <span className={`font-semibold ${t.mainCameraHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.mainCamera}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.telephoto)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Telefoto & Periskop Zoom
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.telephotoHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.telephoto}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.ultrawide)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Ultra Geniş Açı Sensörü
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 text-slate-300">
                        {t.ultrawide}
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.video)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Video Kayıt & Formatlar
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.videoHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.video}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 6: BATARYA KAPASİTESİ & HIZLI ŞARJ */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              Batarya Kapasitesi & Hızlı Şarj
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {shouldShowRow(telemetries.map((t) => t.batteryCap)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider w-1/4 min-w-[170px]">
                      Batarya Kapasitesi
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 min-w-[200px] text-slate-200 font-semibold">
                        {t.batteryCap}
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.charging)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Kablolu / Kablosuz Şarj
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.chargingHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.charging}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.videoPlayback)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Aktif Video Oynatma Süresi
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.videoPlaybackHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.videoPlayback}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 7: YAZILIM, YAPAY ZEKA & BAĞLANTI */}
        <div className="bg-[#0d1424] border border-slate-800/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              Yazılım, Yapay Zeka & Bağlantı
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {shouldShowRow(telemetries.map((t) => t.osSupport)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider w-1/4 min-w-[170px]">
                      İşletim Sistemi & Destek Ömrü
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 min-w-[200px] text-slate-300">
                        {t.osSupport}
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.ai)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Yapay Zeka Yetenekleri (AI)
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className={`font-semibold ${t.aiHighlight ? "text-emerald-400" : "text-slate-200"}`}>
                          {t.ai}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}

                {shouldShowRow(telemetries.map((t) => t.connectivity)) && (
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400 uppercase tracking-wider">
                      Bağlantı & Ek Arayüz
                    </td>
                    {telemetries.map((t, idx) => (
                      <td key={idx} className="py-3 px-4 text-slate-300">
                        {t.connectivity}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Telefon Ekle CTA Card */}
        {selectedPhones.length < 4 && (
          <div className="bg-[#0d1424] border border-slate-800/90 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0">
                <Info className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Dördüncü 4. Telefonu Dahil Et</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Honor Magic 6 Pro, Pixel 9 Pro XL veya Vivo X100 Pro modellerini ekleyerek 4 yönlü amiral gemisi testini yapın.
                </p>
              </div>
            </div>

            <button
              onClick={() => openSearchForIndex(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              Telefon Ekle
            </button>
          </div>
        )}

        {/* Bottom Recommendation CTA Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900 border border-sky-800/40 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl mb-8">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-sky-950/80 text-sky-400 border border-sky-500/30 text-[11px] font-bold rounded-full uppercase tracking-wider mb-2.5">
              Akıllı Cihaz Seçim Sihirbazı
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Karar Veremediniz mi? İhtiyacınıza En Uygun Olanı Seçin.
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Kullanım bütçenizi, kamera beklentinizi ve kullanım alışkanlıklarınızı seçin; yapay zeka algoritması en
              doğru telefonu anında belirlesin.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/telefonlar"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-sky-600/30 transition flex items-center gap-2"
            >
              <span>Akıllı Tavsiye Başlat</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => openAlertModal(selectedPhones[0])}
              className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Fiyat Alarmı Kur</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Footer Notice */}
        <div className="border-t border-slate-800/80 pt-6 text-[11px] text-slate-500 leading-relaxed">
          <div className="font-bold text-slate-400 mb-1">* FERAGATNAME VE BİLGİLENDİRME:</div>
          <p>
            Belirtilen teknik veriler ve anlık stoklu fiyatlar üretici/distribütörlerin resmi yetkili kaynaklarından
            derlenmiş olup piyasa koşullarına göre değişkenlik gösterebilir. DxOMark puanları ve benchmark değerleri
            resmi test laboratuvarları referans alınarak entegre edilmiştir.
          </p>
        </div>
      </div>

      {/* Model Selection Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0d1424] border border-slate-800 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Karşılaştırmaya Model Ekle</h3>
                <p className="text-xs text-slate-400">
                  {modalTargetIndex !== null
                    ? `${selectedPhones[modalTargetIndex]?.name || "Seçili"} modelinin yerine yenisini seçin`
                    : "Listeye eklenecek yeni modeli seçin"}
                </p>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 border-b border-slate-800/80 bg-[#090e1a]">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Telefon modeli veya marka ara (örn: iPhone 16, S24, Xiaomi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
              {filteredSearchPhones.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aramanızla eşleşen telefon bulunamadı.
                </div>
              ) : (
                filteredSearchPhones.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPhone(p.slug)}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-800/70 rounded-xl transition text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-14 bg-[#070b14] rounded-lg flex items-center justify-center p-1 border border-slate-800 shrink-0">
                        <PhoneImage src={p.image} alt={p.name} />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs sm:text-sm group-hover:text-sky-400 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{p.brand}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-xs sm:text-sm price-display">
                        ₺{new Intl.NumberFormat("tr-TR").format(p.lowestPrice)}
                      </div>
                      <span className="text-[10px] text-sky-400 font-medium">Karşılaştır</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-8 text-xs font-bold text-slate-500">
          Karşılaştırma ve Donanım Matrisi yükleniyor...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
