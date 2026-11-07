"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Scale,
  Plus,
  X,
  Check,
  ChevronRight,
  Smartphone,
  Cpu,
  Camera,
  Battery,
  Zap,
  Star,
  ExternalLink,
  Search
} from "lucide-react";
import { getPhones } from "@/lib/data";
import { formatPrice, resolvePhoneSlug } from "@/lib/utils";
import type { Phone } from "@/types";
import PhoneImage from "@/components/phone/PhoneImage";

function CompareContent() {
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getPhones().then((res) => { if (res && res.length > 0) setPhones(res); });
  }, []);
  const searchParams = useSearchParams();

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    "iphone-16-pro-max",
    "samsung-galaxy-s25-ultra",
  ]);

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

  const [searchModalIndex, setSearchModalIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "camera" | "battery" | "performance" | "display" | "price">("all");

  const selectedPhones = useMemo(() => {
    return selectedSlugs
      .map((slug) => phones.find((p) => p.slug === resolvePhoneSlug(slug)))
      .filter((p): p is Phone => !!p);
  }, [selectedSlugs]);

  const addPhone = (slug: string) => {
    if (searchModalIndex !== null) {
      const next = [...selectedSlugs];
      next[searchModalIndex] = slug;
      setSelectedSlugs(next);
      setSearchModalIndex(null);
    } else if (selectedSlugs.length < 4) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
    setSearchQuery("");
  };

  const removePhone = (index: number) => {
    if (selectedSlugs.length <= 1) return;
    const next = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(next);
  };

  const filteredPhonesForSearch = phones.filter(
    (p) =>
      !selectedSlugs.includes(p.slug) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sky-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Telefon Karşılaştırma</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 flex items-center gap-3">
            <Scale className="w-8 h-8 text-sky-400" />
            Telefon Karşılaştırma Merkezi
          </h1>
          <p className="text-sky-200 text-base max-w-2xl">
            2 veya 4 telefona kadar yan yana teknik özellik, kamera, batarya ve güncel mağaza fiyatlarını karşılaştırın.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="text-xs text-slate-300 py-1">Popüler Karşılaştırmalar:</span>
            <button
              onClick={() => setSelectedSlugs(["iphone-16-pro-max", "samsung-galaxy-s25-ultra"])}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              iPhone 16 Pro Max vs Galaxy S25 Ultra
            </button>
            <button
              onClick={() => setSelectedSlugs(["xiaomi-15-pro", "samsung-galaxy-s25-ultra"])}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              Xiaomi 15 Pro vs S25 Ultra
            </button>
            <button
              onClick={() => setSelectedSlugs(["vivo-x100-pro", "iphone-16-pro-max"])}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              Vivo X100 Pro vs iPhone 16 Pro Max
            </button>
            <button
              onClick={() => setSelectedSlugs(["nothing-phone-2", "poco-f6-pro"])}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              Nothing Phone (2) vs POCO F6 Pro
            </button>
            <button
              onClick={() => setSelectedSlugs(["iphone-15", "samsung-galaxy-s24-ultra"])}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              iPhone 15 vs Galaxy S24 Ultra
            </button>
          </div>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Comparison Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => {
            const phone = selectedPhones[index];

            if (!phone) {
              return (
                <button
                  key={`empty-${index}`}
                  onClick={() => setSearchModalIndex(index)}
                  className="h-64 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl bg-white hover:bg-sky-50/50 flex flex-col items-center justify-center p-6 text-slate-400 hover:text-sky-600 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center mb-3 transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm">Karşılaştırmaya Telefon Ekle</span>
                  <span className="text-xs text-slate-400 mt-1">Model aramak için tıklayın</span>
                </button>
              );
            }

            return (
              <div
                key={phone.id}
                className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
              >
                {selectedPhones.length > 1 && (
                  <button
                    onClick={() => removePhone(index)}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                    title="Kaldır"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-32 bg-slate-50 rounded-xl flex items-center justify-center p-2 mb-3 border border-slate-100">
                    <PhoneImage src={phone.image} alt={phone.name} />
                  </div>
                  <div className="text-xs text-sky-600 font-semibold uppercase">{phone.brand}</div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mt-1">
                    {phone.name}
                  </h3>
                  <div className="mt-2 text-lg font-extrabold text-slate-900 price-display">
                    {formatPrice(phone.lowestPrice)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{phone.priceStore}&apos;da</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSearchModalIndex(index)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    Değiştir
                  </button>
                  <Link
                    href={`/telefon/${phone.slug}`}
                    className="py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    İncele
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Focus Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "all" ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tüm Özellikler
          </button>
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "camera" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Kamera Odaklı
          </button>
          <button
            onClick={() => setActiveTab("battery")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "battery" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Battery className="w-3.5 h-3.5" />
            Batarya Odaklı
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "performance" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Performans Odaklı
          </button>
          <button
            onClick={() => setActiveTab("display")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "display" ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Ekran Odaklı
          </button>
          <button
            onClick={() => setActiveTab("price")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "price" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Fiyat / Performans
          </button>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4 min-w-[180px]">
                    Özellik
                  </th>
                  {selectedPhones.map((phone) => (
                    <th key={phone.id} className="p-4 text-sm font-bold text-slate-900 min-w-[200px]">
                      {phone.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {/* FİYAT */}
                {(activeTab === "all" || activeTab === "price") && (
                  <>
                    <tr className="bg-sky-50/50">
                      <td colSpan={selectedPhones.length + 1} className="px-4 py-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                        Fiyat ve Mağaza Bilgileri
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">En Düşük Fiyat</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 font-extrabold text-slate-900 text-base price-display">
                          {formatPrice(phone.lowestPrice)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">En Ucuz Mağaza</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.priceStore}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Kullanıcı Puanı</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4">
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {phone.rating || 9.0} / 10
                          </span>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* EKRAN */}
                {(activeTab === "all" || activeTab === "display") && (
                  <>
                    <tr className="bg-sky-50/50">
                      <td colSpan={selectedPhones.length + 1} className="px-4 py-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                        Ekran Özellikleri
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Ekran Boyutu</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 font-semibold text-slate-900">
                          {phone.specs?.display?.size || 6.7}&quot;
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Ekran Teknolojisi</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.display?.technology || "OLED"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Yenileme Hızı</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 font-semibold text-slate-900">
                          {phone.specs?.display?.refreshRate || 120} Hz
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Çözünürlük</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.display?.resolution || "FHD+"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Maksimum Parlaklık</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.display?.brightness || 2000} nits
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* PERFORMANS */}
                {(activeTab === "all" || activeTab === "performance") && (
                  <>
                    <tr className="bg-sky-50/50">
                      <td colSpan={selectedPhones.length + 1} className="px-4 py-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                        Performans & Donanım
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">İşlemci (Çip)</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 font-semibold text-slate-900">
                          {phone.specs?.performance?.chipset || "Yüksek Performans"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">RAM Bellek</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 font-semibold text-slate-900">
                          {phone.specs?.performance?.ram || 8} GB
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Dahili Depolama</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.performance?.storage || 256} GB
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">AnTuTu Puanı</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.performance?.antutuScore?.toLocaleString() || "1.200.000+"}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* KAMERA */}
                {(activeTab === "all" || activeTab === "camera") && (
                  <>
                    <tr className="bg-sky-50/50">
                      <td colSpan={selectedPhones.length + 1} className="px-4 py-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                        Kamera Yetenekleri
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Ana Kamera</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 font-semibold text-slate-900">
                          {phone.specs?.camera?.mainCamera?.megapixels || 50} MP ({phone.specs?.camera?.mainCamera?.aperture || "f/1.8"})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">OIS (Görüntü Sabitleme)</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4">
                          {phone.specs?.camera?.mainCamera?.ois ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-4 h-4" /> Var
                            </span>
                          ) : (
                            <span className="text-slate-400">Yok</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Optik Zoom (Telefoto)</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.camera?.telephoto ? `${phone.specs.camera.telephoto.opticalZoom}x Optik` : "Yok"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Ön (Selfie) Kamera</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.camera?.frontCamera?.megapixels || 12} MP
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* BATARYA */}
                {(activeTab === "all" || activeTab === "battery") && (
                  <>
                    <tr className="bg-sky-50/50">
                      <td colSpan={selectedPhones.length + 1} className="px-4 py-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                        Batarya & Şarj
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Batarya Kapasitesi</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 font-semibold text-slate-900">
                          {phone.specs?.battery?.capacity || 5000} mAh
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Hızlı Şarj Gücü</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.battery?.wiredCharging || 45}W
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Kablosuz Şarj</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.battery?.wirelessCharging ? `${phone.specs.battery.wirelessCharging}W Destekli` : "Yok"}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* YAZILIM & BAĞLANTI */}
                {activeTab === "all" && (
                  <>
                    <tr className="bg-sky-50/50">
                      <td colSpan={selectedPhones.length + 1} className="px-4 py-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                        Yazılım & Bağlantı
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">İşletim Sistemi</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.software?.os || "Android / iOS"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">5G Desteği</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4">
                          {phone.specs?.connectivity?.fiveG !== false ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-4 h-4" /> Var
                            </span>
                          ) : (
                            <span className="text-slate-400">Yok</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-500 font-medium">Suya Dayanıklılık</td>
                      {selectedPhones.map((phone) => (
                        <td key={phone.id} className="p-4 text-slate-700">
                          {phone.specs?.design?.waterResistance || "IP68"}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Model Selection Modal */}
      {searchModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Karşılaştırılacak Telefonu Seçin</h3>
              <button
                onClick={() => setSearchModalIndex(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Telefon veya marka ara (örn: iPhone 16, S25, Xiaomi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {filteredPhonesForSearch.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Aramanızla eşleşen telefon bulunamadı.
                </div>
              ) : (
                filteredPhonesForSearch.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addPhone(p.slug)}
                    className="w-full p-3 flex items-center justify-between hover:bg-sky-50 rounded-xl transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center p-1 border border-slate-100 shrink-0">
                        <PhoneImage src={p.image} alt={p.name} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-500">{p.brand}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm price-display">
                        {formatPrice(p.lowestPrice)}
                      </div>
                      <span className="text-[11px] text-sky-600 font-medium">Seç</span>
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-xs font-bold text-slate-500">
          Karşılaştırma aracı yükleniyor...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
