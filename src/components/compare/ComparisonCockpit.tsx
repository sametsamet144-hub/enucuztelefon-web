"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import DeviceSelectorModal, {
  CandidateDevice,
  CANDIDATE_FLAGSHIPS,
} from "./DeviceSelectorModal";
import { formatPrice } from "@/lib/utils";

export default function ComparisonCockpit() {
  const searchParams = useSearchParams();
  const { openAlertModal, showToast } = useApp();

  // Active 4 devices state
  const [activeDevices, setActiveDevices] = useState<CandidateDevice[]>([
    CANDIDATE_FLAGSHIPS[5], // iPhone 16 Pro Max
    CANDIDATE_FLAGSHIPS[6], // Galaxy S25 Ultra
    CANDIDATE_FLAGSHIPS[7], // Xiaomi 15 Pro
    CANDIDATE_FLAGSHIPS[8], // Pixel 9 Pro XL
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiffHighlighted, setIsDiffHighlighted] = useState(false);

  // Sync with searchParams if present
  useEffect(() => {
    const phonesParam = searchParams.get("phones");
    if (phonesParam) {
      const slugs = phonesParam.split(",");
      const resolved = slugs
        .map((s) => CANDIDATE_FLAGSHIPS.find((d) => d.slug === s.trim()))
        .filter(Boolean) as CandidateDevice[];
      if (resolved.length > 0) {
        // Pad to up to 4 if needed
        const merged = [...resolved];
        while (merged.length < 4 && merged.length < CANDIDATE_FLAGSHIPS.length) {
          const next = CANDIDATE_FLAGSHIPS.find(
            (c) => !merged.some((m) => m.slug === c.slug)
          );
          if (next) merged.push(next);
          else break;
        }
        setActiveDevices(merged);
      }
    }
  }, [searchParams]);

  const toggleDifferences = () => {
    setIsDiffHighlighted((prev) => !prev);
    showToast(
      !isDiffHighlighted
        ? "Farklılıklar ve lider donanımlar vurgulandı! ✨"
        : "Vurgulama kapatıldı.",
      "info"
    );
  };

  const handleSlotChange = (index: number, newDevice: CandidateDevice) => {
    setActiveDevices((prev) => {
      const next = [...prev];
      next[index] = newDevice;
      return next;
    });
    showToast(`${newDevice.name} ${index + 1}. yuvaya atandı!`, "success");
  };

  const handleSlotRemove = (index: number) => {
    if (activeDevices.length <= 2) {
      showToast("En az 2 telefon karşılaştırılmalıdır.", "warning");
      return;
    }
    setActiveDevices((prev) => prev.filter((_, i) => i !== index));
    showToast("Cihaz yuvadan kaldırıldı.", "info");
  };

  const handleReset = () => {
    setActiveDevices([
      CANDIDATE_FLAGSHIPS[5], // iPhone 16 Pro Max
      CANDIDATE_FLAGSHIPS[6], // Galaxy S25 Ultra
      CANDIDATE_FLAGSHIPS[7], // Xiaomi 15 Pro
      CANDIDATE_FLAGSHIPS[8], // Pixel 9 Pro XL
    ]);
    setIsDiffHighlighted(false);
    showToast("Karşılaştırma varsayılan 4 amiral gemisine sıfırlandı.", "info");
  };

  // Safe device accessors
  const dev1 = activeDevices[0] || CANDIDATE_FLAGSHIPS[5];
  const dev2 = activeDevices[1] || CANDIDATE_FLAGSHIPS[6];
  const dev3 = activeDevices[2] || CANDIDATE_FLAGSHIPS[7];
  const dev4 = activeDevices[3] || CANDIDATE_FLAGSHIPS[8];

  const currentDate = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      id="page-cockpit"
      className={`min-h-screen bg-[#08080a] text-slate-200 font-sans antialiased selection:bg-apple-sapphire selection:text-white ${
        isDiffHighlighted ? "highlight-active" : ""
      }`}
    >
      {/* HERO HEADER & TELEMETRY BADGE */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1c1c24]">
          <div className="flex flex-col gap-2.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-medium tracking-wide uppercase border border-blue-500/20">
                4 Model Yan Yana
              </span>
              <span className="text-slate-500 text-[12px]">
                {currentDate} Güncellemesi
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Telefon Karşılaştırma
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-[14px] sm:text-[15px] font-medium text-slate-300">
              <span className="text-blue-400 font-semibold">{dev1.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">{dev2.name}</span>
              {activeDevices.length > 2 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400 font-semibold">{dev3.name}</span>
                </>
              )}
              {activeDevices.length > 3 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-purple-400 font-semibold">{dev4.name}</span>
                </>
              )}
            </div>

            <p className="text-slate-400 text-[13px] sm:text-[14px] leading-relaxed mt-0.5">
              4 farklı modelin teknik özelliklerini, kamera yeteneklerini ve mağaza
              fiyatlarını yan yana inceleyin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13131a] hover:bg-[#1a1a24] text-slate-300 hover:text-white text-[13px] font-medium border border-[#252533] transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-blue-400">
                sync_alt
              </span>
              <span>Modelleri Değiştir</span>
            </button>

            <button
              id="toggleDiffBtn"
              type="button"
              onClick={toggleDifferences}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all shadow-sm cursor-pointer ${
                isDiffHighlighted
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  : "bg-[#13131a] hover:bg-[#1a1a24] text-slate-300 hover:text-white border-[#252533]"
              }`}
              title="Farkları vurgular"
            >
              <span className="material-symbols-outlined text-[17px] text-emerald-400">
                auto_awesome
              </span>
              <span>Farkları Vurgula</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13131a] hover:bg-[#1a1a24] text-slate-400 hover:text-white text-[13px] font-medium border border-[#252533] transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                restart_alt
              </span>
              <span>Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Anchor Quick Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3.5 mt-1 no-scrollbar border-b border-[#181822]">
          <a
            className="px-3.5 py-1.5 rounded-full bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-[12px] font-medium transition-all shrink-0 flex items-center gap-1.5"
            href="#benchmark-bolumu"
          >
            <span className="material-symbols-outlined text-[15px]">memory</span>
            <span>İşlemci &amp; Benchmark</span>
          </a>
          <a
            className="px-3.5 py-1.5 rounded-full bg-[#14141c] hover:bg-[#1c1c28] text-slate-300 hover:text-white border border-[#242432] text-[12px] font-medium transition-all shrink-0 flex items-center gap-1.5"
            href="#kamera-bolumu"
          >
            <span className="material-symbols-outlined text-[15px] text-cyan-400">
              photo_camera
            </span>
            <span>Kamera &amp; Optik</span>
          </a>
          <a
            className="px-3.5 py-1.5 rounded-full bg-[#14141c] hover:bg-[#1c1c28] text-slate-300 hover:text-white border border-[#242432] text-[12px] font-medium transition-all shrink-0 flex items-center gap-1.5"
            href="#ekran-bolumu"
          >
            <span className="material-symbols-outlined text-[15px] text-amber-400">
              smartphone
            </span>
            <span>Ekran &amp; Kasa</span>
          </a>
          <a
            className="px-3.5 py-1.5 rounded-full bg-[#14141c] hover:bg-[#1c1c28] text-slate-300 hover:text-white border border-[#242432] text-[12px] font-medium transition-all shrink-0 flex items-center gap-1.5"
            href="#batarya-bolumu"
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-400">
              battery_charging_full
            </span>
            <span>Batarya &amp; Şarj</span>
          </a>
          <a
            className="px-3.5 py-1.5 rounded-full bg-[#14141c] hover:bg-[#1c1c28] text-slate-300 hover:text-white border border-[#242432] text-[12px] font-medium transition-all shrink-0 flex items-center gap-1.5"
            href="#yapayzeka-bolumu"
          >
            <span className="material-symbols-outlined text-[15px] text-purple-400">
              psychology
            </span>
            <span>Yapay Zeka &amp; OS</span>
          </a>
          <a
            className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[12px] font-medium transition-all shrink-0 flex items-center gap-1.5"
            href="#arbitraj"
          >
            <span className="material-symbols-outlined text-[15px]">
              candlestick_chart
            </span>
            <span>Mağaza Fiyatları</span>
          </a>
        </div>
      </section>

      {/* 1. STRICT HORIZONTAL 4-COLUMN STICKY HARDWARE COMPARATOR BAR */}
      <aside className="sticky top-16 z-40 w-full bg-[#09090c]/95 backdrop-blur-2xl border-y border-[#20202d] shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {activeDevices.map((dev, idx) => {
              const borderStyles = [
                "border-blue-500/30 hover:border-blue-400/60 bg-gradient-to-b from-[#141824] to-[#0e1017]",
                "border-cyan-500/30 hover:border-cyan-400/60 bg-gradient-to-b from-[#141b24] to-[#0e1218]",
                "border-amber-500/30 hover:border-amber-400/60 bg-gradient-to-b from-[#1f1912] to-[#120e0a]",
                "border-purple-500/30 hover:border-purple-400/60 bg-gradient-to-b from-[#1b1424] to-[#110c17]",
              ][idx % 4];

              const tagColors = [
                "text-blue-400",
                "text-cyan-400",
                "text-amber-400",
                "text-purple-400",
              ][idx % 4];

              return (
                <div
                  key={dev.slug}
                  className={`rounded-2xl p-3 border shadow-md transition-all flex flex-col justify-between group ${borderStyles}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-11 h-14 shrink-0 rounded-xl bg-[#090b10] border border-white/10 p-1 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                        {dev.image ? (
                          <img
                            alt={dev.name}
                            className="w-full h-full object-contain"
                            src={dev.image}
                          />
                        ) : (
                          <span className={`material-symbols-outlined text-[28px] ${tagColors}`}>
                            {dev.icon || "smartphone"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold tracking-wider uppercase ${tagColors}`}
                          >
                            {dev.brand} · #{idx + 1}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <h2 className="text-[14px] font-bold text-white truncate transition-colors">
                          {dev.name}
                        </h2>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {dev.chipset}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[12px] font-extrabold border bg-white/5 border-white/10 ${tagColors}`}
                      >
                        {dev.score}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                        Donanım
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                    <div>
                      <div className="text-[14px] font-extrabold text-white font-mono">
                        {formatPrice(dev.price)}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        {dev.store} Dip
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] border border-white/10 cursor-pointer"
                        title="Cihazı Değiştir"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          swap_horiz
                        </span>
                      </button>
                      <a
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-all shadow-sm shadow-blue-500/20"
                        href="#arbitraj"
                      >
                        <span>Satın Al</span>
                        <span className="material-symbols-outlined text-[12px]">
                          arrow_forward
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* 2. BENCHMARK & HARDWARE TELEMETRY MATRIX */}
        <section
          className="glass-card rounded-3xl p-6 lg:p-8 border border-[#222230] shadow-2xl relative overflow-hidden"
          id="benchmark-bolumu"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#20202c]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <span className="material-symbols-outlined text-[22px]">
                  memory
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    İşlemci Mimarisi, Termal &amp; Sentetik Benchmark Matrisi
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] border border-blue-500/20">
                    3nm vs 4nm
                  </span>
                </div>
                <p className="text-[13px] text-slate-400">
                  Geekbench 6, 3DMark Solar Bay Ray Tracing ve AnTuTu v10 4&apos;lü
                  eş zamanlı telemetrisi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded bg-blue-500" /> A18 Pro
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> SD 8 Elite
                (Gal.)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded bg-amber-400" /> SD 8 Elite
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded bg-purple-400" /> Tensor G4
              </span>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-[#1c1c28]">
            {/* ROW: Yonga Seti Mimarisi */}
            <div className="py-4">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-slate-500">
                  developer_board
                </span>{" "}
                Yonga Seti (SoC) &amp; Üretim Süreci
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="font-bold text-blue-400 text-[14px]">
                    Apple A18 Pro (3nm TSMC N3E)
                  </div>
                  <div className="text-[12px] text-slate-400 mt-1">
                    2x 4.04 GHz + 4x 2.20 GHz
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    6 Çekirdek GPU · 16 Çekirdek NPU (35 TOPS)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30">
                  <div className="font-bold text-cyan-400 text-[14px]">
                    SD 8 Elite for Galaxy (3nm)
                  </div>
                  <div className="text-[12px] text-slate-400 mt-1">
                    2x 4.32 GHz Oryon + 6x 3.53 GHz
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Adreno 830 (1.1 GHz) · Hexagon NPU
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/30">
                  <div className="font-bold text-amber-400 text-[14px]">
                    Snapdragon 8 Elite (3nm TSMC)
                  </div>
                  <div className="text-[12px] text-slate-400 mt-1">
                    2x 4.32 GHz Oryon + 6x 3.53 GHz
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Adreno 830 GPU · 3D Çift Buhar Odası
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="font-bold text-purple-400 text-[14px]">
                    Google Tensor G4 (4nm Samsung)
                  </div>
                  <div className="text-[12px] text-slate-400 mt-1">
                    1x 3.1 GHz + 3x 2.6 GHz + 4x 1.95 GHz
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Mali-G715 MP7 · Edge TPU AI Çipi
                  </div>
                </div>
              </div>
            </div>

            {/* ROW: Geekbench 6 Single-Core */}
            <div className="py-4">
              <div className="flex items-center justify-between text-[12px] font-mono text-slate-400 mb-2">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-blue-400">
                    speed
                  </span>{" "}
                  Geekbench 6 (Tek Çekirdek Skoru)
                </span>
                <span className="text-emerald-400 font-bold">
                  Lider: iPhone 16 Pro Max (+14% fark)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/40 win-spec">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-blue-400 font-mono">
                      3.410
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                      Mutlak Galip
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden relative">
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-400 h-2 rounded-full w-full relative">
                      <span className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Tek çekirdekte masaüstü M3 seviyesi IPC
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-cyan-300 font-mono">
                      3.120
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      91.5% Oran
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-2 rounded-full w-[91.5%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Oryon çekirdeği 4.32 GHz turbo
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/30">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-amber-400 font-mono">
                      3.150
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      92.3% Oran
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full w-[92.3%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Agresif termal profil desteği
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-purple-400 font-mono">
                      2.080
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      61.0% Oran
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full w-[61%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    AI odaklı düşük frekanslı mimari
                  </span>
                </div>
              </div>
            </div>

            {/* ROW: Geekbench 6 Multi-Core */}
            <div className="py-4">
              <div className="flex items-center justify-between text-[12px] font-mono text-slate-400 mb-2">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-400">
                    stacks
                  </span>{" "}
                  Geekbench 6 (Çoklu Çekirdek Skoru)
                </span>
                <span className="text-amber-400 font-bold">
                  Lider: Xiaomi 15 Pro &amp; S25 Ultra (Oryon Çifti)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-blue-300 font-mono">
                      8.690
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      6 Çekirdek (Dengeli)
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full w-[88%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Pil tasarruflu işlem verimliliği
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-cyan-300 font-mono">
                      9.650
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      +11% Çok Çekirdek
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-2 rounded-full w-[98%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    8 Oryon çekirdeği tam yük altında
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/40 win-spec">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-amber-400 font-mono">
                      9.780
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                      Zirve Skor
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden relative">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-300 h-2 rounded-full w-full relative">
                      <span className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Loop LiquidCool ile kesintisiz hız
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[18px] font-extrabold text-purple-400 font-mono">
                      5.150
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      52.6% Oran
                    </span>
                  </div>
                  <div className="w-full bg-[#1e202c] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full w-[52.6%]" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Termal kısıtlama odaklı frekans
                  </span>
                </div>
              </div>
            </div>

            {/* ROW: 3DMark Solar Bay Ray Tracing & AnTuTu v10 */}
            <div className="py-4">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">
                    sports_esports
                  </span>{" "}
                  3DMark Solar Bay Ray Tracing / AnTuTu v10
                </span>
                <span className="text-cyan-400 font-mono text-[11px]">
                  Adreno 830 vs Apple MetalFX
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="text-[13px] text-slate-300 font-semibold">
                    8.450 Puan{" "}
                    <span className="text-[10px] text-slate-500">(Solar Bay)</span>
                  </div>
                  <div className="text-[14px] font-mono font-bold text-blue-400 mt-0.5">
                    1.940.000 AnTuTu
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Metal FX donanımsal ışın izleme desteği
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30">
                  <div className="text-[13px] text-slate-300 font-semibold">
                    8.920 Puan{" "}
                    <span className="text-[10px] text-emerald-400 font-bold">
                      (+6%)
                    </span>
                  </div>
                  <div className="text-[14px] font-mono font-bold text-cyan-300 mt-0.5">
                    2.750.000 AnTuTu
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Genişletilmiş grafit buhar odasıyla stabil FPS
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/30 win-spec">
                  <div className="text-[13px] text-amber-300 font-semibold">
                    9.110 Puan{" "}
                    <span className="text-[10px] text-amber-400 font-bold">
                      (RT Lideri)
                    </span>
                  </div>
                  <div className="text-[14px] font-mono font-bold text-amber-400 mt-0.5">
                    2.820.000 AnTuTu
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Adreno Slice mimarisi ile en yüksek grafik çıktısı
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="text-[13px] text-slate-300 font-semibold">
                    5.890 Puan{" "}
                    <span className="text-[10px] text-slate-500">(Solar Bay)</span>
                  </div>
                  <div className="text-[14px] font-mono font-bold text-purple-400 mt-0.5">
                    1.180.000 AnTuTu
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Vulkan tabanlı temel ışın izleme hesaplaması
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DEEP CAMERA & OPTICS COMPARATOR */}
        <section
          className="glass-card rounded-3xl p-6 lg:p-8 border border-[#222230] shadow-2xl relative overflow-hidden"
          id="kamera-bolumu"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#20202c]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <span className="material-symbols-outlined text-[22px]">
                  photo_camera
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Kamera Donanımı &amp; Optik Sensör Telemetrisi
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] border border-cyan-500/20">
                    4K 120fps · 200MP · Leica Optik
                  </span>
                </div>
                <p className="text-[13px] text-slate-400">
                  Ana sensör boyutu, telefoto/periskop yakınlaştırma mimarisi ve
                  profesyonel log video kayıt yetenekleri
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Laboratuvar DxOMark &amp; Video Telemetrisi
            </div>
          </div>

          <div className="flex flex-col divide-y divide-[#1c1c28]">
            {/* ROW: Ana Kamera */}
            <div className="py-4">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-cyan-400">
                  center_focus_strong
                </span>{" "}
                Ana Kamera Sensörü (MP, Sensör Boyutu, OIS)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="font-bold text-blue-300 text-[14px]">
                    48 MP Fusion (f/1.78)
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    1/1.28&quot; Sensör · 24mm
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    2. Nesil Sensor-shift OIS · 48MP HEIF Max
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30 win-spec">
                  <div className="font-bold text-cyan-300 text-[14px]">
                    200 MP ISOCELL HP2 (f/1.7)
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    1/1.3&quot; Sensör · 23mm
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    16-in-1 Piksel Birleştirme · Genişletilmiş OIS
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/30 win-spec">
                  <div className="font-bold text-amber-400 text-[14px]">
                    50 MP Light Hunter 900
                  </div>
                  <div className="text-[12px] text-amber-300 mt-1">
                    1/1.31&quot; Sensör · f/1.44 (En Geniş)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Leica Summilux 7P Lens · 13.5 EV Dinamik Aralık
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="font-bold text-purple-400 text-[14px]">
                    50 MP Octa PD (f/1.68)
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    1/1.31&quot; Sensör · 25mm
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Dual Pixel LDAF + OIS · Ultra Hesaplamalı HDR+
                  </div>
                </div>
              </div>
            </div>

            {/* ROW: Telefoto & Periskop Zoom */}
            <div className="py-4">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-400">
                    zoom_in
                  </span>{" "}
                  Telefoto &amp; Periskop Yakınlaştırma Mimarisi
                </span>
                <span className="text-cyan-400 font-mono text-[11px]">
                  100x Space Zoom vs 5x Tetraprism
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="font-bold text-blue-300 text-[14px]">
                    12 MP 5x Optik (120mm)
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    Tetraprism f/2.8 · 3D Sensör Shift OIS
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    25x Dijital Zoom · 120mm portre odak uzaklığı
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30 win-spec">
                  <div className="font-bold text-cyan-300 text-[14px]">
                    50 MP 5x + 10 MP 3x Optik
                  </div>
                  <div className="text-[12px] text-emerald-400 font-semibold mt-1">
                    Çift Telefoto (115mm &amp; 67mm)
                  </div>
                  <div className="text-[11px] text-cyan-400 font-bold mt-0.5">
                    100x AI Space Zoom (Tartışmasız Lider)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/30">
                  <div className="font-bold text-amber-400 text-[14px]">
                    50 MP 5x Periskop (120mm)
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    Sony IMX858 Sensör · f/2.5 Diyafram
                  </div>
                  <div className="text-[11px] text-amber-300 mt-0.5">
                    Leica Yüzen Lens · 30cm Telemakro Özelliği
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="font-bold text-purple-400 text-[14px]">
                    48 MP 5x Periskop (113mm)
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    f/2.8 Diyafram · Quad PD OIS
                  </div>
                  <div className="text-[11px] text-purple-300 mt-0.5">
                    30x Pro Super Res Zoom (AI Generative Denge)
                  </div>
                </div>
              </div>
            </div>

            {/* ROW: Video & Prodüksiyon */}
            <div className="py-4">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-rose-400">
                    videocam
                  </span>{" "}
                  Profesyonel Video, Log &amp; Renk Profili
                </span>
                <span className="text-blue-400 font-mono text-[11px]">
                  Hollywood Prodüksiyon Standardı
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/40 win-spec">
                  <div className="font-bold text-blue-400 text-[14px]">
                    4K 120fps Dolby Vision
                  </div>
                  <div className="text-[12px] text-emerald-400 font-semibold mt-1">
                    Apple Log + ACES Desteği
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    USB-C Harici SSD ProRes 4K120 (Sinema Lideri)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30">
                  <div className="font-bold text-cyan-300 text-[14px]">
                    8K 30fps / 4K 120fps HDR
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    HDR10+ / LOG profili
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    360 Ses Kaydı &amp; Mikrofon Yakınlaştırma
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/30">
                  <div className="font-bold text-amber-400 text-[14px]">
                    8K 30fps Dolby Vision
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    10-bit Log Kayıt (Rec.2020)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Leica Otantik ve Canlı Sinema Modları
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="font-bold text-purple-400 text-[14px]">
                    4K 60fps + 8K Video Boost
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    Bulut Tabanlı Night Sight Video
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Audio Magic Eraser ile ortam sesi temizleme
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. DISPLAY, CHASSIS & BATTERY COCKPIT */}
        <section
          className="glass-card rounded-3xl p-6 lg:p-8 border border-[#222230] shadow-2xl relative overflow-hidden"
          id="ekran-bolumu"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#20202c]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <span className="material-symbols-outlined text-[22px]">
                  devices
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Ekran Parlaklığı, Kasa Materyali &amp; Batarya Mimarisi
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] border border-amber-500/20">
                    3.200 nit · 6.100 mAh
                  </span>
                </div>
                <p className="text-[13px] text-slate-400">
                  Armor anti-reflekte cam, PWM karartma hızı, gövde ağırlığı ve
                  90W ultra hızlı şarj telemetrisi
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Panel Spektrometresi &amp; Termal Dağılım
            </div>
          </div>

          <div className="flex flex-col divide-y divide-[#1c1c28]">
            {/* ROW: Ekran */}
            <div className="py-4">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-400">
                    brightness_7
                  </span>{" "}
                  Ekran Boyutu, Panel Teknolojisi &amp; Tepe Nit
                </span>
                <span className="text-amber-400 font-mono text-[11px]">
                  3.200 nit Zirvesi
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="text-[14px] font-bold text-white">
                    6.9&quot; Super Retina XDR OLED
                  </div>
                  <div className="text-[12px] text-blue-300 font-semibold mt-1">
                    2.000 nit Tepe · 1 nit Minimum
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    1-120Hz ProMotion · 2868 x 1320 px (460 ppi)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30 win-spec">
                  <div className="text-[14px] font-bold text-white">
                    6.8&quot; Dynamic AMOLED 2X
                  </div>
                  <div className="text-[12px] text-cyan-300 font-semibold mt-1">
                    2.600 nit Tepe · Gorilla Armor
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    %75 Yansıma Engelleyici Mat Kaplama (Lider)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/40 win-spec">
                  <div className="text-[14px] font-bold text-white">
                    6.73&quot; LTPO OLED (2K Çözünürlük)
                  </div>
                  <div className="text-[12px] text-amber-400 font-bold mt-1">
                    3.200 nit Tepe (En Parlak Panel)
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                    1920Hz PWM Karartma · 522 ppi Keskinlik
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="text-[14px] font-bold text-white">
                    6.8&quot; Super Actua OLED
                  </div>
                  <div className="text-[12px] text-purple-300 font-semibold mt-1">
                    3.000 nit Tepe · Victus 2
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    1-120Hz LTPO · 1344 x 2992 px (486 ppi)
                  </div>
                </div>
              </div>
            </div>

            {/* ROW: Batarya & Şarj */}
            <div className="py-4" id="batarya-bolumu">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">
                    bolt
                  </span>{" "}
                  Batarya Kapasitesi (mAh), Kablolu/Kablosuz Watt &amp; Süre
                </span>
                <span className="text-amber-400 font-mono text-[11px]">
                  Xiaomi 6.100 mAh &amp; 90W Hükmü
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[16px] font-extrabold text-blue-300 font-mono">
                      4.685 mAh
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      27W Kablolu
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    0-100% Şarj: 85 Dakika
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    25W MagSafe Desteği · 33 Saat Video
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[16px] font-extrabold text-cyan-300 font-mono">
                      5.000 mAh
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      45W PD 3.0
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    0-100% Şarj: 65 Dakika
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    15W Kablosuz · 4.5W Ters Şarj
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/40 win-spec">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[16px] font-extrabold text-amber-400 font-mono">
                      6.100 mAh (Devasa)
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 font-bold">
                      90W Kablolu
                    </span>
                  </div>
                  <div className="text-[12px] text-emerald-400 font-bold mt-1">
                    0-100% Şarj: 32 Dakika (Lider)
                  </div>
                  <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                    50W Kablosuz Hızlı Şarj · Silikon-Karbon Pil
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[16px] font-extrabold text-purple-300 font-mono">
                      5.060 mAh
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      37W PD Hızlı
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-300 mt-1">
                    0-100% Şarj: 74 Dakika
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    23W Pixel Stand Kablosuz · Ters Şarj
                  </div>
                </div>
              </div>
            </div>

            {/* ROW: Kasa & Ağırlık */}
            <div className="py-4">
              <div className="text-[12px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-slate-400">
                  shield
                </span>{" "}
                Kasa Materyali, Ağırlık &amp; Suya Dayanıklılık
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#11131c] border border-blue-500/30">
                  <div className="text-[13px] font-bold text-white">
                    Grade 5 Titanyum (227g)
                  </div>
                  <div className="text-[12px] text-blue-300 mt-1">
                    Ceramic Shield 2. Nesil Ön Cam
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    IP68 (6 Metre - 30 Dakika Lideri)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#10141b] border border-cyan-500/30">
                  <div className="text-[13px] font-bold text-white">
                    Titanyum Çerçeve (232g)
                  </div>
                  <div className="text-[12px] text-cyan-300 mt-1">
                    Gorilla Armor Cam Ön &amp; Arka
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Dahili S-Pen Stylus Yuvası · IP68 (1.5m)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17130e] border border-amber-500/30 win-spec">
                  <div className="text-[13px] font-bold text-white">
                    Havacılık Alüminyum (213g)
                  </div>
                  <div className="text-[12px] text-amber-300 mt-1">
                    Dragon Crystal Glass 2 Ön Cam
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    En Hafif ve İnce Gövde (8.35mm) · IP68
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#15101c] border border-purple-500/30">
                  <div className="text-[13px] font-bold text-white">
                    Cilalı Metal Çerçeve (221g)
                  </div>
                  <div className="text-[12px] text-purple-300 mt-1">
                    Mat Cam Arka Kapak · Victus 2
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    İkonik Kamera Vizörü Barı · IP68 (1.5m)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ON-DEVICE AI, NPU & SOFTWARE LIFECYCLE */}
        <section
          className="glass-card rounded-3xl p-6 lg:p-8 border border-[#222230] shadow-2xl relative overflow-hidden"
          id="yapayzeka-bolumu"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#20202c]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <span className="material-symbols-outlined text-[22px]">
                  psychology
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    On-Device Yapay Zeka, NPU TOPS &amp; Yazılım Güncelleme Ömrü
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] border border-purple-500/20">
                    Gemini Nano · Apple Intelligence
                  </span>
                </div>
                <p className="text-[13px] text-slate-400">
                  Yerel NPU işleme gücü, üretken görsel/metin araçları ve garanti
                  edilen ana işletim sistemi sürüm desteği
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              LLM &amp; Multimodal NPU Telemetrisi
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#11131c] border border-blue-500/30 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-blue-400 uppercase">
                    Apple Intelligence
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[11px]">
                    35 TOPS NPU
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1">
                  A18 Pro Private Cloud Compute
                </h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Siri LLM entegrasyonu, sistem geneli Yazma Araçları, Image
                  Playground, Genmoji ve sıfır veri depolamalı güvenli uç bilişim
                  mimarisi.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1c2235] text-[11px] font-mono text-slate-400 flex justify-between items-center">
                <span>Yazılım Desteği:</span>
                <span className="text-blue-300 font-semibold">
                  5-6 Yıl iOS Garantisi
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#10141b] border border-cyan-500/30 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
                    Galaxy AI
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[11px]">
                    45 TOPS NPU
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1">
                  S-Pen &amp; Gemini Pro Hibrit
                </h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Circle to Search, Canlı Görüşme Çevirisi, Not Asistanı, S-Pen
                  Çizimden Görsele dönüştürme ve DeX ortamında kesintisiz
                  üretkenlik.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1c2738] text-[11px] font-mono text-slate-400 flex justify-between items-center">
                <span>Yazılım Desteği:</span>
                <span className="text-emerald-400 font-bold">
                  7 Yıl Android + Güvenlik
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#17130e] border border-amber-500/30 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                    HyperOS 2.0 AI
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[11px]">
                    45 TOPS NPU
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1">
                  HyperMind 2.0 Proaktif
                </h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Altyapı seviyesinde akıllı ev ekosistem öğrenmesi, yapay
                  zekalı dinamik kilit ekranı portre sentezi, sesli toplantı
                  özetleme.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2e2316] text-[11px] font-mono text-slate-400 flex justify-between items-center">
                <span>Yazılım Desteği:</span>
                <span className="text-amber-300 font-semibold">
                  4 Yıl Android + 5 Yıl Güv.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#15101c] border border-purple-500/40 win-spec flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-purple-400 uppercase">
                    Gemini Nano (Lider)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-mono text-[11px] font-bold">
                    Multimodal TPU
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1">
                  Entegre Yerel Gemini Asistan
                </h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Pixel Screenshots, Magic Editor, Best Take, Video Boost bulut
                  sentezi ve cihaz içinde internet bağlantısız çalışan multimodal
                  yapay zeka.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2a1e38] text-[11px] font-mono text-slate-400 flex justify-between items-center">
                <span>Yazılım Desteği:</span>
                <span className="text-emerald-400 font-bold">
                  7 Yıl Saf Android Garantisi
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. LIVE MARKET ARBITRAGE MATRIX */}
        <section
          className="glass-card rounded-3xl p-6 lg:p-8 border border-[#222230] shadow-2xl relative overflow-hidden"
          id="arbitraj"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#20202c]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <span className="material-symbols-outlined text-[22px]">
                  candlestick_chart
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Canlı Piyasa &amp; 4&apos;lü Mağaza Fiyat Arbitraj Tablosu
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                    Anlık Fiyat Botu
                  </span>
                </div>
                <p className="text-[13px] text-slate-400">
                  Yetkili dağıtıcılar ve sertifikalı pazaryerlerinde 15 dakikada
                  bir otomatik senkronize edilen dip fiyatlar
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border border-emerald-500/25 flex items-center gap-2.5 text-[12px] font-medium text-emerald-300">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                verified
              </span>
              <span>
                Maksimum Fiyat Avantajı:{" "}
                <strong className="text-amber-300">Xiaomi 15 Pro</strong> (iPhone
                16 Pro Max&apos;e kıyasla tam{" "}
                <strong className="text-emerald-300">₺14.000 daha uygun</strong>
                )
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#212130] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-3">Yetkili Mağaza &amp; Dağıtıcı</th>
                  <th className="py-3.5 px-3 text-blue-400 font-semibold">
                    1. {dev1.name}
                  </th>
                  <th className="py-3.5 px-3 text-cyan-400 font-semibold">
                    2. {dev2.name}
                  </th>
                  <th className="py-3.5 px-3 text-amber-400 font-semibold">
                    3. {dev3.name}
                  </th>
                  <th className="py-3.5 px-3 text-purple-400 font-semibold">
                    4. {dev4.name}
                  </th>
                  <th className="py-3.5 px-3 text-center">Fiyat Avantajı</th>
                  <th className="py-3.5 px-3 text-right">Alarm &amp; Git</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181822] text-[13px]">
                {/* Amazon TR */}
                <tr className="hover:bg-[#12121a] transition-colors group">
                  <td className="py-4 px-3 font-semibold flex items-center gap-2.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Amazon TR (Resmi Dağıtıcı)</span>
                  </td>
                  <td className="py-4 px-3 font-bold text-emerald-400 font-mono">
                    ₺72.499{" "}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ml-1 font-bold">
                      DİP
                    </span>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺69.499
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺59.299
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺65.499
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-[11px] text-amber-400 font-semibold">
                    Xiaomi -₺13.200
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openAlertModal()}
                        className="w-7 h-7 rounded-lg bg-[#181824] hover:bg-[#202030] text-slate-400 hover:text-white flex items-center justify-center text-[13px] cursor-pointer"
                        title="Alarm Kur"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          notifications
                        </span>
                      </button>
                      <a
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        href="https://www.amazon.com.tr"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Mağaza</span>
                        <span className="material-symbols-outlined text-[12px]">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>

                {/* Hepsiburada */}
                <tr className="hover:bg-[#12121a] transition-colors group">
                  <td className="py-4 px-3 font-semibold flex items-center gap-2.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>Hepsiburada (Resmi Mağaza)</span>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺73.299
                  </td>
                  <td className="py-4 px-3 font-bold text-emerald-400 font-mono">
                    ₺68.999{" "}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ml-1 font-bold">
                      DİP
                    </span>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺58.999
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺65.899
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-[11px] text-cyan-300 font-semibold">
                    S25U -₺4.300
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openAlertModal()}
                        className="w-7 h-7 rounded-lg bg-[#181824] hover:bg-[#202030] text-slate-400 hover:text-white flex items-center justify-center text-[13px] cursor-pointer"
                        title="Alarm Kur"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          notifications
                        </span>
                      </button>
                      <a
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        href="https://www.hepsiburada.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Mağaza</span>
                        <span className="material-symbols-outlined text-[12px]">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>

                {/* Trendyol */}
                <tr className="hover:bg-[#12121a] transition-colors group">
                  <td className="py-4 px-3 font-semibold flex items-center gap-2.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Trendyol (Yetkili Satıcı)</span>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺73.999
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺69.899
                  </td>
                  <td className="py-4 px-3 font-extrabold text-amber-400 font-mono">
                    ₺58.499{" "}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 ml-1 font-bold">
                      REKOR DİP
                    </span>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺65.200
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-[11px] text-amber-300 font-semibold">
                    Xiaomi -₺15.500
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openAlertModal()}
                        className="w-7 h-7 rounded-lg bg-[#181824] hover:bg-[#202030] text-slate-400 hover:text-white flex items-center justify-center text-[13px] cursor-pointer"
                        title="Alarm Kur"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          notifications
                        </span>
                      </button>
                      <a
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        href="https://www.trendyol.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Mağaza</span>
                        <span className="material-symbols-outlined text-[12px]">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>

                {/* Teknosa */}
                <tr className="hover:bg-[#12121a] transition-colors group">
                  <td className="py-4 px-3 font-semibold flex items-center gap-2.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span>Teknosa (Mağaza &amp; Web)</span>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺76.999
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺72.499
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-mono">
                    ₺61.999
                  </td>
                  <td className="py-4 px-3 font-bold text-emerald-400 font-mono">
                    ₺64.999{" "}
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ml-1 font-bold">
                      DİP
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-[11px] text-purple-400 font-semibold">
                    Pixel -₺12.000
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openAlertModal()}
                        className="w-7 h-7 rounded-lg bg-[#181824] hover:bg-[#202030] text-slate-400 hover:text-white flex items-center justify-center text-[13px] cursor-pointer"
                        title="Alarm Kur"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          notifications
                        </span>
                      </button>
                      <a
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        href="https://www.teknosa.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Mağaza</span>
                        <span className="material-symbols-outlined text-[12px]">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e1e2c] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[12px] text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">
                security
              </span>
              <span>
                Fiyatlar doğrudan resmi API ve doğrulanmış fatura garantili
                satıcılardan çekilmektedir.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => openAlertModal()}
                className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1a2133] text-blue-400 border border-blue-500/30 text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  notifications_active
                </span>
                <span>{dev1.name} Alarmı Kur</span>
              </button>
              <button
                type="button"
                onClick={() => openAlertModal()}
                className="px-3 py-1.5 rounded-lg bg-[#121922] hover:bg-[#172330] text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  notifications_active
                </span>
                <span>{dev2.name} Alarmı Kur</span>
              </button>
            </div>
          </div>
        </section>

        {/* 7. RECOMMENDATION VERDICT CARDS (4 USER PROFILES) */}
        <section className="glass-card rounded-3xl p-6 lg:p-10 border border-[#232332] shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 mb-6 border-b border-[#20202c]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-semibold uppercase tracking-wider border border-emerald-500/25 mb-2.5">
                <span className="material-symbols-outlined text-[15px]">
                  recommend
                </span>
                <span>EnUcuzTelefon Karar ve Tercih Rehberi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hangi Amiral Gemisi Sizin İçin Doğru?
              </h2>
              <p className="text-slate-400 text-[14px] mt-1">
                Kullanım tarzınıza, donanım önceliklerinize ve yatırım bütçenize
                göre uzman değerlendirmesi:
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-[13px] shadow-lg shadow-blue-500/25 transition-all"
                href="#arbitraj"
              >
                Canlı İndirim Bildirimi Al
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-[#11131c] border border-blue-500/30 hover:border-blue-400/60 transition-all flex flex-col justify-between gap-4 group">
              <div>
                <span className="text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider block mb-1">
                  Hollywood &amp; 2. El Güvencesi
                </span>
                <h3 className="text-[17px] font-bold text-white group-hover:text-blue-300 transition-colors">
                  iPhone 16 Pro Max
                </h3>
                <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">
                  Sinematik 4K 120fps Dolby Vision, USB-C doğrudan SSD ProRes
                  kaydı, Apple Log renk derecelendirmesi ve Türkiye pazarında en
                  az değer kaybı yaşayan ekosistem lideri.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1c2235] flex items-center justify-between">
                <span className="text-white font-mono font-bold text-[14px]">
                  ₺72.499
                </span>
                <span className="text-[11px] text-blue-400 font-medium">
                  Amazon TR
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-[#10141b] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between gap-4 group">
              <div>
                <span className="text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider block mb-1">
                  Ultra Zoom &amp; Mobil Ofis
                </span>
                <h3 className="text-[17px] font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Galaxy S25 Ultra
                </h3>
                <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">
                  Dahili S-Pen kalemi, Gorilla Armor parlama önleyici camı, 100x
                  Uzay Zoom yeteneği ve Samsung DeX ile masaüstü üretkenliği
                  arayan profesyonellerin mutlak tercihi.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1c2738] flex items-center justify-between">
                <span className="text-white font-mono font-bold text-[14px]">
                  ₺68.999
                </span>
                <span className="text-[11px] text-cyan-400 font-medium">
                  Hepsiburada
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-[#17130e] border border-amber-500/30 hover:border-amber-400/60 transition-all flex flex-col justify-between gap-4 group">
              <div>
                <span className="text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider block mb-1">
                  Batarya Canavarı &amp; F/P Zirvesi
                </span>
                <h3 className="text-[17px] font-bold text-white group-hover:text-amber-300 transition-colors">
                  Xiaomi 15 Pro
                </h3>
                <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">
                  6.100 mAh devasa silikon-karbon pil, 32 dakikada tam dolum 90W
                  şarj, Snapdragon 8 Elite ve iPhone&apos;a oranla tam{" "}
                  <strong>₺14.000 fiyat avantajı</strong> ile en rasyonel amiral
                  gemisi.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2e2316] flex items-center justify-between">
                <span className="text-amber-400 font-mono font-bold text-[14px]">
                  ₺58.499
                </span>
                <span className="text-[11px] text-amber-300 font-medium">
                  Trendyol (Dip)
                </span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-[#15101c] border border-purple-500/30 hover:border-purple-400/60 transition-all flex flex-col justify-between gap-4 group">
              <div>
                <span className="text-purple-400 font-mono text-[11px] font-bold uppercase tracking-wider block mb-1">
                  Saf Android &amp; Yapay Zeka Uç
                </span>
                <h3 className="text-[17px] font-bold text-white group-hover:text-purple-300 transition-colors">
                  Pixel 9 Pro XL
                </h3>
                <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">
                  En pürüzsüz saf Android arayüzü, 7 yıl garantili anlık OS
                  güncellemeleri, Magic Editor ve on-device çalışan üretken yapay
                  zeka deneyimi isteyen teknoloji meraklıları için rakipsiz.
                </p>
              </div>
              <div className="pt-3 border-t border-[#2a1e38] flex items-center justify-between">
                <span className="text-white font-mono font-bold text-[14px]">
                  ₺64.999
                </span>
                <span className="text-[11px] text-purple-400 font-medium">
                  Teknosa
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3D TILT DEVICE SELECTOR MODAL (stitch_export_2) */}
      <DeviceSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeSlots={activeDevices}
        onSlotChange={handleSlotChange}
        onSlotRemove={handleSlotRemove}
        onConfirm={() => {
          setIsModalOpen(false);
          showToast(
            "Karşılaştırma matrisi seçilen cihazlarla güncellendi! ⚔️",
            "success"
          );
        }}
      />
    </div>
  );
}
