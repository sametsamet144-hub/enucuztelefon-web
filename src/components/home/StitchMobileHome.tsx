"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function StitchMobileHome() {
  const router = useRouter();
  const { openAlertModal, showToast } = useApp();
  const [, startTransition] = useTransition();

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

  // Typewriter effect state
  const [typewriterText, setTypewriterText] = useState("");
  const phrases = [
    "iPhone 16 Pro Max 256GB...",
    "Snapdragon 8 Elite modeller...",
    "50.000 TL altı en iyi kameralar...",
    "Galaxy S25 Ultra indirimleri...",
    "En dip fiyatlı amiral gemileri...",
  ];
  const phraseIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function typeLoop() {
      const current = phrases[phraseIdxRef.current];

      if (isDeletingRef.current) {
        charIdxRef.current--;
        setTypewriterText(current.substring(0, charIdxRef.current));
      } else {
        charIdxRef.current++;
        setTypewriterText(current.substring(0, charIdxRef.current));
      }

      let speed = isDeletingRef.current ? 25 : 60;

      if (!isDeletingRef.current && charIdxRef.current === current.length) {
        speed = 2000;
        isDeletingRef.current = true;
      } else if (isDeletingRef.current && charIdxRef.current === 0) {
        isDeletingRef.current = false;
        phraseIdxRef.current = (phraseIdxRef.current + 1) % phrases.length;
        speed = 450;
      }

      timeoutId = setTimeout(typeLoop, speed);
    }

    typeLoop();

    return () => clearTimeout(timeoutId);
  }, []);

  // Telemetry Live Scan Counter
  const [scanCounter, setScanCounter] = useState(1442736);
  useEffect(() => {
    const interval = setInterval(() => {
      setScanCounter((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  // Interactive Price Radar Stepper
  const [targetPrice, setTargetPrice] = useState(44000);
  const [targetPriceBouncing, setTargetPriceBouncing] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);

  const stepUp = () => {
    setTargetPrice((prev) => prev + 500);
    setTargetPriceBouncing(true);
    setTimeout(() => setTargetPriceBouncing(false), 150);
  };

  const stepDown = () => {
    if (targetPrice > 5000) {
      setTargetPrice((prev) => prev - 500);
      setTargetPriceBouncing(true);
      setTimeout(() => setTargetPriceBouncing(false), 150);
    }
  };

  const handleSetAlarm = () => {
    setAlarmActive(true);
    showToast(`✓ ${targetPrice.toLocaleString("tr-TR")} ₺ için radar alarmı kuruldu!`);
    openAlertModal();
    setTimeout(() => {
      setAlarmActive(false);
    }, 3200);
  };

  // Search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      startTransition(() => {
        router.push(`/telefonlar?q=${encodeURIComponent(searchQuery.trim())}`);
      });
    } else {
      startTransition(() => {
        router.push("/telefonlar");
      });
    }
  };

  // Brand pill filter
  const brands = [
    { id: "all", label: "Tümü" },
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "xiaomi", label: "Xiaomi" },
    { id: "poco", label: "POCO" },
    { id: "honor", label: "Honor" },
    { id: "vivo", label: "vivo" },
    { id: "huawei", label: "Huawei" },
    { id: "pixel", label: "Pixel" },
    { id: "nothing", label: "Nothing" },
  ];

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    if (brandId !== "all") {
      startTransition(() => {
        router.push(`/telefonlar?brand=${brandId}`);
      });
    }
  };

  return (
    <div className="bg-[#0e0e10] font-sans text-[#e5e1e4] flex flex-col min-h-screen selection:bg-[#2997ff] selection:text-[#002e57] relative overflow-x-hidden">
      {/* ── Self-Contained Keyframe Animations & Custom Classes ── */}
      <style>{`
        @keyframes beamRotateFast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes shimmerEffect {
          0% { transform: translateX(-140%); }
          50%, 100% { transform: translateX(160%); }
        }
        @keyframes pulseExpandingRing {
          0% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 0 0 rgba(41,151,255,0.6); }
          70% { transform: scale(1.15); opacity: 0.2; box-shadow: 0 0 24px 12px rgba(41,151,255,0.25); }
          100% { transform: scale(1.25); opacity: 0; box-shadow: 0 0 30px 18px rgba(41,151,255,0); }
        }
        @keyframes pulseEnergyCore {
          0%, 100% { transform: scale(1); box-shadow: 0 0 16px rgba(41,151,255,0.6), inset 0 0 8px rgba(255,255,255,0.3); }
          50% { transform: scale(1.06); box-shadow: 0 0 26px rgba(121,40,202,0.7), inset 0 0 12px rgba(41,151,255,0.5); }
        }
        @keyframes radarContinuousSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes radarWaveEmit {
          0% { transform: scale(0.3); opacity: 0.9; }
          50% { opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes bellTinkle {
          0%, 75%, 100% { transform: rotate(0deg); }
          80% { transform: rotate(-12deg); }
          85% { transform: rotate(10deg); }
          90% { transform: rotate(-8deg); }
          95% { transform: rotate(4deg); }
        }
        @keyframes auroraGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes breathingGlow {
          0%, 100% { opacity: 0.35; transform: scale(0.98); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }

        .aurora-btn-bg {
          background: linear-gradient(115deg, #0060aa, #2997ff, #7928ca, #00ac40, #2997ff) !important;
          background-size: 260% 260% !important;
          animation: auroraGradientShift 5s ease infinite !important;
        }

        .shimmer-badge {
          position: relative;
          overflow: hidden;
        }
        .shimmer-badge::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(60deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%);
          animation: shimmerEffect 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
        }

        .card-shimmer {
          position: relative;
          overflow: hidden;
        }
        .card-shimmer::before {
          content: '';
          position: absolute;
          top: -60%;
          left: -60%;
          width: 220%;
          height: 220%;
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 52%, transparent 60%);
          animation: shimmerEffect 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: 15;
        }

        .gold-glow {
          box-shadow: 0 0 16px rgba(255, 215, 0, 0.45);
          border: 1px solid rgba(255, 215, 0, 0.6);
        }
        .silver-glow {
          box-shadow: 0 0 14px rgba(220, 226, 235, 0.4);
          border: 1px solid rgba(220, 226, 235, 0.55);
        }
        .bronze-glow {
          box-shadow: 0 0 14px rgba(255, 140, 0, 0.4);
          border: 1px solid rgba(255, 140, 0, 0.55);
        }
      `}</style>

      {/* ── Ambient Lighting Backdrops ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full blur-[90px]"
          style={{
            background: "radial-gradient(circle, rgba(41,151,255,0.25) 0%, rgba(121,40,202,0.18) 50%, transparent 80%)",
            animation: "breathingGlow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[480px] -left-20 w-[300px] h-[300px] rounded-full blur-[85px]"
          style={{
            background: "radial-gradient(circle, rgba(0,172,64,0.18) 0%, rgba(41,151,255,0.18) 50%, transparent 80%)",
            animation: "breathingGlow 9s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-[880px] -right-20 w-[300px] h-[300px] rounded-full blur-[90px]"
          style={{
            background: "radial-gradient(circle, rgba(41,151,255,0.22) 0%, rgba(121,40,202,0.18) 50%, transparent 80%)",
            animation: "breathingGlow 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Fixed Mobile Header ───────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 w-full z-50 bg-[#131315]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="h-16 px-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 active:scale-95 transition-transform duration-200 cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded-full bg-[#2a2a2c]/90 border border-white/10 flex items-center justify-center text-[#2997ff] shadow-inner">
              <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] leading-tight tracking-tight text-white font-extrabold">
                EnUcuz
                <span className="bg-gradient-to-r from-[#2997ff] to-[#a3c9ff] bg-clip-text text-transparent">
                  Telefon
                </span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Bildirimler"
              onClick={() => openAlertModal()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#c0c7d5] hover:text-white bg-[#2a2a2c]/70 border border-white/10 active:scale-90 transition-all duration-200 cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ animation: "bellTinkle 3.8s ease-in-out infinite" }}
              >
                notifications
              </span>
            </button>

            <Link
              href="/admin"
              aria-label="Profil"
              className="w-10 h-10 flex items-center justify-center active:scale-90 transition-all duration-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2997ff] to-[#a3c9ff] p-[1.5px] shadow-[0_0_12px_rgba(41,151,255,0.5)]">
                <div className="w-full h-full rounded-full bg-[#2a2a2c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#2997ff] text-[18px]">person</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Mobile Content ──────────────────────────────────── */}
      {/* Safe padding ensures fixed header NEVER covers the hero title */}
      <main
        className="flex flex-col relative z-10 w-full pb-24 bg-transparent min-h-screen px-4"
        style={{
          paddingTop: "calc(4.5rem + env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="flex flex-col w-full text-[#e5e1e4]">

          {/* ── 2. HERO SECTION & SMART SEARCH ───────────────────── */}
          <section className="flex flex-col pb-3 pt-3">
            <h1 className="text-[28px] leading-[36px] tracking-tight text-white font-extrabold">
              En doğru telefonu bul.
              <br />
              <span className="bg-gradient-to-r from-[#2997ff] via-[#a3c9ff] to-[#47e266] bg-clip-text text-transparent">
                En dip fiyata yakala.
              </span>
            </h1>

            {/* Düzeltilmiş Açıklama Metni (488+ Akıllı Telefon) */}
            <div className="inline-flex items-center gap-2 mt-2.5 mb-4 self-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a2a2c]/80 border border-white/10 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold tracking-wide text-white">
                  488+ Akıllı Telefon
                </span>
                <span className="w-1 h-1 rounded-full bg-[#404753]" />
                <span className="text-[11px] font-medium text-[#c0c7d5] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#2997ff]">
                    verified
                  </span>
                  16 Resmi Distribütör &amp; Satıcı
                </span>
              </div>
            </div>

            {/* Typewriter Search Input Box */}
            <form onSubmit={handleSearchSubmit}>
              <div className="relative w-full rounded-2xl p-[1px] bg-gradient-to-r from-[#2997ff]/60 via-white/10 to-[#47e266]/40 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 focus-within:shadow-[0_0_30px_rgba(41,151,255,0.45)]">
                <div className="flex items-center h-12 px-3 gap-2 bg-[#0e0e10]/95 backdrop-blur-xl rounded-2xl">
                  <span className="material-symbols-outlined text-[#2997ff] text-[22px]">
                    search
                  </span>

                  <div className="relative flex-1 flex items-center h-full overflow-hidden">
                    <input
                      id="smartSearchInput"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder=""
                      className="w-full bg-transparent border-none outline-none text-[15px] text-white placeholder:text-transparent relative z-10"
                    />

                    {/* Animated Typewriter Placeholder */}
                    {searchQuery === "" && (
                      <div
                        id="typewriterOverlay"
                        className="pointer-events-none absolute left-0 flex items-center text-[15px] text-[#8a919e] z-0"
                      >
                        <span id="typewriterText">{typewriterText}</span>
                        <span className="w-[2px] h-4 bg-[#2997ff] ml-0.5 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {searchQuery.length > 0 && (
                    <button
                      type="button"
                      id="clearSearchBtn"
                      onClick={() => setSearchQuery("")}
                      className="text-[#8a919e] hover:text-white p-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#2997ff",
                      color: "#002e57",
                      boxShadow: "0 2px 12px rgba(41,151,255,0.4)",
                    }}
                    className="h-9 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1 active:scale-90 hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>Ara</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Brand Pills - Exact Match with Pure White Active "Tümü" */}
            <div className="flex items-center gap-2 mt-3.5 overflow-x-auto no-scrollbar py-1">
              {brands.map((b) => {
                const isActive = selectedBrand === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleBrandSelect(b.id)}
                    style={
                      isActive
                        ? {
                            backgroundColor: "#ffffff",
                            color: "#000000",
                            fontWeight: 700,
                            boxShadow: "0 2px 10px rgba(255,255,255,0.25)",
                          }
                        : {
                            backgroundColor: "rgba(42, 42, 44, 0.7)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#c0c7d5",
                          }
                    }
                    className="brand-filter-pill px-4 py-1.5 rounded-full text-[13px] shrink-0 transition-all active:scale-90 cursor-pointer"
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 3. REAL-TIME TELEMETRY METRIC RIBBON ─────────────── */}
          <section className="grid grid-cols-3 gap-2 py-2 mb-2">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#1c1b1d]/85 backdrop-blur-xl border border-white/[0.08] text-center shadow-lg active:scale-95 transition-transform">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47e266] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#47e266]" />
                </span>
                <span className="text-[10px] text-[#47e266] font-bold tracking-tight">
                  CANLI
                </span>
              </div>
              <span
                id="scanCounter"
                className="text-[17px] font-extrabold text-white tracking-tight"
              >
                {scanCounter.toLocaleString("tr-TR")}
              </span>
              <span className="text-[#c0c7d5] text-[11px] leading-tight">
                Fiyat Taraması
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#1c1b1d]/85 backdrop-blur-xl border border-white/[0.08] text-center shadow-lg active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[#2997ff] text-[18px] mb-0.5">
                verified_user
              </span>
              <span className="text-[17px] font-extrabold text-white tracking-tight">
                %100
              </span>
              <span className="text-[#c0c7d5] text-[11px] leading-tight">
                BTK Garantili
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#1c1b1d]/85 backdrop-blur-xl border border-white/[0.08] text-center shadow-lg active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[#47e266] text-[18px] mb-0.5">
                percent
              </span>
              <span className="text-[17px] font-extrabold text-white tracking-tight">
                0 ₺
              </span>
              <span className="text-[#c0c7d5] text-[11px] leading-tight">
                Komisyonsuz
              </span>
            </div>
          </section>

          {/* ── 4. BENTO GRID HIGHLIGHTS ─────────────────────────── */}
          <section className="flex flex-col gap-4 my-2">

            {/* a) GÜNÜN REKOR DÜŞÜŞÜ (7s Conic Rotating Apple Keynote Border-Beam) */}
            <div className="relative rounded-3xl p-[1.5px] overflow-hidden group shadow-[0_16px_40px_rgba(0,0,0,0.7)] active:scale-[0.99] transition-transform duration-300">
              {/* 7s Conic Rotating Apple Keynote Border-Beam (bulletproof inline styles) */}
              <div
                className="absolute -inset-[150%] opacity-60 pointer-events-none"
                style={{
                  animation: "beamRotateFast 7s linear infinite",
                  background: "conic-gradient(from 0deg, #2997ff, transparent 30%, #a3c9ff 50%, #47e266 75%, transparent 90%)",
                }}
              />

              {/* Bento Inner Body */}
              <div className="relative w-full rounded-[23px] bg-[#161619]/95 p-5 backdrop-blur-2xl flex flex-col overflow-hidden border border-white/10">
                {/* Holographic Ambient Spotlight */}
                <div
                  className="absolute top-1/2 right-4 -translate-y-1/2 w-44 h-44 rounded-full blur-3xl pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(41,151,255,0.25) 0%, rgba(121,40,202,0.2) 50%, rgba(71,226,102,0.2) 100%)",
                    animation: "breathingGlow 4s ease-in-out infinite",
                  }}
                />

                {/* Header Tag & Shimmering Discount Badge */}
                <div className="flex items-center justify-between z-10">
                  <div className="shimmer-badge px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1.5 bg-[#2a2a2c]/90 border border-white/10 text-white shadow-md">
                    <span
                      className="material-symbols-outlined text-[15px] text-[#2997ff]"
                      style={{ animation: "bellTinkle 2s infinite" }}
                    >
                      local_fire_department
                    </span>
                    <span className="leading-none text-white font-semibold">
                      Günün Rekor Düşüşü
                    </span>
                  </div>

                  <div className="shimmer-badge flex items-center gap-1 bg-[#47e266]/20 text-[#47e266] px-3 py-1 rounded-full text-[11px] font-bold border border-[#47e266]/30 shadow-[0_0_14px_rgba(71,226,102,0.35)]">
                    <span className="material-symbols-outlined text-[12px] animate-bounce">
                      arrow_downward
                    </span>
                    -%18 İNDİRİM
                  </div>
                </div>

                {/* Product Presentation & Levitating Phone Mockup (~4s süzülme) */}
                <div className="grid grid-cols-5 items-center gap-2 my-4 z-10">
                  <div className="col-span-3 flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#2997ff] font-bold tracking-wide">
                        Apple
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2a2a2c] text-[#c0c7d5] font-mono">
                        A18 Pro
                      </span>
                    </div>

                    <h2 className="text-[22px] leading-snug font-extrabold text-white tracking-tight">
                      iPhone 16 Pro{" "}
                      <span className="text-[15px] text-[#c0c7d5] font-normal">
                        256GB
                      </span>
                    </h2>

                    <p className="text-[12px] text-[#c0c7d5] mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#47e266]">
                        storefront
                      </span>
                      En ucuz:{" "}
                      <strong className="text-white underline decoration-[#2997ff]/40">
                        Amazon TR
                      </strong>
                    </p>

                    {/* Price Drop Telemetry with Neon Glow */}
                    <div className="mt-3 flex flex-col">
                      <span className="text-[12px] text-[#8a919e] line-through">
                        72.999 ₺
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[32px] leading-[36px] font-black text-white tracking-tight drop-shadow-[0_2px_14px_rgba(255,255,255,0.35)]">
                          59.899
                        </span>
                        <span className="text-[18px] text-[#2997ff] font-extrabold">
                          ₺
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Levitating Phone Graphic */}
                  <div className="col-span-2 relative flex items-center justify-center">
                    <div
                      className="relative w-28 h-40 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.85)] border border-white/10"
                      style={{ animation: "floatGentle 4s ease-in-out infinite" }}
                    >
                      <img
                        className="w-full h-full object-cover rounded-2xl filter contrast-105"
                        alt="Apple iPhone 16 Pro Desert Titanium"
                        src="/images/stitch/hero-iphone16pro.webp"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuBDhZ4fa5dnrpW9iKNRf7U1uoRI1Dhbqp22lX0Dt8AuUMUmxRirZXApXappx1vQqw-_6q3INy3H7ncopBR5FJnG6qOg2P2Xs6WWJtzNfr4pnndnIQdem4ehARHGjf80QTse0PpC0dpReCW2t1ZDd3lZ_X6yYv35sou2UKAtTVPDIcz1iT2Qw9spIaJ0F-10BoJS74vdTAijUYbPu7g-Kz4f_KzW0vXMNHvYSQ9UbGQ";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Trend Sparkline & Springy Action CTA */}
                <div className="mt-1 pt-3 border-t border-white/[0.08] flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 text-[#47e266] text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">show_chart</span>
                    <span>Son 30 günün en düşüğü</span>
                  </div>

                  <Link
                    href="/telefon/apple-iphone-16-pro"
                    style={{
                      background: "linear-gradient(to right, #2997ff, #a3c9ff)",
                      color: "#002e57",
                      boxShadow: "0 4px 22px rgba(41,151,255,0.45)",
                    }}
                    className="shimmer-badge h-10 px-5 rounded-full text-[13px] font-bold flex items-center gap-1.5 active:scale-90 hover:scale-105 transition-all duration-200 shrink-0 select-none group"
                  >
                    <span className="group-active:scale-95 transition-transform">
                      Fırsatı İncele
                    </span>
                    <span className="material-symbols-outlined text-[17px] transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dual Bento Column */}
            <div className="grid grid-cols-1 gap-4">

              {/* b) AMİRAL GEMİSİ DÜELLOSU (VS Bento with Pulsing Ring + Stagger Float) */}
              <div className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-2xl active:scale-[0.99] transition-transform duration-300">
                {/* 6.5s Sapphire Blue & Purple Conic Rotating Border-Beam */}
                <div
                  className="absolute -inset-[150%] opacity-70 pointer-events-none"
                  style={{
                    animation: "beamRotateFast 6.5s linear infinite",
                    background: "conic-gradient(from 0deg, #2997ff, transparent 25%, #7928ca 50%, #2997ff 75%, transparent 95%)",
                  }}
                />

                <div className="relative w-full rounded-[15px] bg-[#1c1b1d]/95 backdrop-blur-xl p-4 flex flex-col justify-between border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-[#2997ff] font-extrabold tracking-wider uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                      Zirvedekiler: Birebir Kıyaslama
                    </span>
                  </div>

                  <div className="relative flex items-center justify-between py-2 px-1">
                    {/* iPhone 16 Pro with Smooth Gentle Float */}
                    <div
                      className="flex flex-col items-center w-5/12 text-center"
                      style={{ animation: "floatGentle 4s ease-in-out infinite" }}
                    >
                      <div className="w-16 h-20 rounded-xl overflow-hidden mb-2 bg-[#201f22] shadow-[0_8px_20px_rgba(0,0,0,0.6)] border border-white/10">
                        <img
                          className="w-full h-full object-cover"
                          alt="Apple iPhone 16 Pro dark titanium"
                          src="/images/stitch/vs-iphone16pro.webp"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://lh3.googleusercontent.com/aida-public/AB6AXuA_5vnB3toMQzPooJ1bwkYJzYH9JEKhlYofg6nUECHc_LwWF8dAvoAv1vsOIrYqR8sThGeLbJa4i_3Z1TSmrlCRg4fpwuDBA8rvDuBjTbsDxx22y8-m6Ase9xwlw9Dv8SWSG-32MolX5RJ94U-Yk5an0QZvLZrSz5yhtAl2Lh0vs-gzT5kKqXqb88s-jrGiApLW-QEftIqJNEyGWDV2wVGluQnNudXfJBrRqmsNz1E";
                          }}
                        />
                      </div>
                      <span className="text-[13px] font-bold text-white leading-tight">
                        iPhone 16 Pro
                      </span>
                      <span className="text-[12px] text-[#47e266] font-bold mt-0.5">
                        59.899 ₺
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-[#c0c7d5] text-[11px]">
                        <span className="material-symbols-outlined text-[13px] text-[#2997ff]">
                          speed
                        </span>
                        1.72M Antutu
                      </div>
                    </div>

                    {/* Glowing Pulsing VS Centerpiece */}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <div
                        className="absolute w-14 h-14 rounded-full border border-[#2997ff] pointer-events-none"
                        style={{
                          animation: "pulseExpandingRing 2.6s cubic-bezier(0, 0.2, 0.8, 1) infinite",
                        }}
                      />
                      <div
                        className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#2997ff] via-[#7928ca] to-[#a3c9ff] text-white flex items-center justify-center font-black text-sm tracking-tighter"
                        style={{
                          animation: "pulseEnergyCore 2.4s infinite",
                          boxShadow: "0 0 16px rgba(41,151,255,0.6)",
                        }}
                      >
                        VS
                      </div>
                      <span className="text-[9px] text-[#8a919e] font-extrabold tracking-widest mt-1">
                        H2H
                      </span>
                    </div>

                    {/* S24 Ultra with Delayed Stagger Float (2s delay) */}
                    <div
                      className="flex flex-col items-center w-5/12 text-center"
                      style={{ animation: "floatGentle 4s ease-in-out infinite 2s" }}
                    >
                      <div className="w-16 h-20 rounded-xl overflow-hidden mb-2 bg-[#201f22] shadow-[0_8px_20px_rgba(0,0,0,0.6)] border border-white/10">
                        <img
                          className="w-full h-full object-cover"
                          alt="Samsung Galaxy S24 Ultra Titanium Gray smartphone"
                          src="/images/stitch/vs-s24ultra.webp"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://lh3.googleusercontent.com/aida-public/AB6AXuDyxzOD--Jt7RzkRiFWCs10vTE5CDS0g4QM1lfGIhl_-lw0Ks8QtiqHlFv1lYkJTiI0N9JL0KMr3qqnF1IzoV_I5fFm9d5PT-ufAESqspU7LDiymPMQicFaO-Obn_3hwjCq4x7q9W2_vnz-dOMNC1KSNdjFN7c1mGpB3qzEPvU4brCfcyAVjODiDv_X0hYpjNVGCmnELVffGLz589nQwErwFCupKmLf91puGXVMhnk";
                          }}
                        />
                      </div>
                      <span className="text-[13px] font-bold text-white leading-tight">
                        S24 Ultra
                      </span>
                      <span className="text-[12px] text-[#47e266] font-bold mt-0.5">
                        62.499 ₺
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-[#c0c7d5] text-[11px]">
                        <span className="material-symbols-outlined text-[13px] text-[#2997ff]">
                          photo_camera
                        </span>
                        200MP Quad
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/karsilastir?device1=apple-iphone-16-pro&device2=samsung-galaxy-s24-ultra"
                    className="shimmer-badge mt-3 w-full py-2.5 rounded-xl bg-[#2a2a2c]/90 hover:bg-[#353437] text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 shadow-lg active:scale-95 transition-all text-center"
                  >
                    <span>Tüm Özellikleri Kıyasla</span>
                    <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                  </Link>
                </div>
              </div>

              {/* c) CANLI FİYAT TAKİP RADARI (Akıcı Sonar Tarama & Etkileşimli Eşik) */}
              <div className="relative rounded-3xl p-[1.5px] overflow-hidden group shadow-xl active:scale-[0.99] transition-transform">
                <div
                  className="absolute -inset-[150%] opacity-50 pointer-events-none"
                  style={{
                    animation: "beamRotateFast 6.5s linear infinite",
                    background: "conic-gradient(from 180deg, #47e266, transparent 40%, #2997ff 70%, transparent 95%)",
                  }}
                />

                <div className="relative w-full rounded-[23px] bg-[#1c1b1d]/95 backdrop-blur-xl p-4 flex flex-col border border-white/10 overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#47e266] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ animation: "bellTinkle 2s ease-in-out infinite" }}
                        >
                          notifications_active
                        </span>
                        Fiyat Takip Radarı
                      </span>
                      <h3 className="text-[17px] font-bold text-white mt-0.5">
                        İstediğin Fiyatı Belirle
                      </h3>
                    </div>

                    {/* Continuous 3.2s Radar Sonar Visual */}
                    <div className="relative w-11 h-11 rounded-full bg-[#00ac40]/20 border border-[#47e266]/50 flex items-center justify-center overflow-hidden shadow-[0_0_18px_rgba(71,226,102,0.4)]">
                      {/* Sonar Expanding Waves */}
                      <div
                        className="absolute inset-0 rounded-full border border-[#47e266]/60 pointer-events-none"
                        style={{ animation: "radarWaveEmit 2.4s ease-out infinite" }}
                      />
                      {/* Rotating Radar Sweep Line */}
                      <div
                        className="absolute inset-0 rounded-full origin-center"
                        style={{
                          background: "conic-gradient(from 0deg, transparent 65%, rgba(71, 226, 102, 0.85) 100%)",
                          animation: "radarContinuousSweep 3.2s linear infinite",
                        }}
                      />
                      <span className="material-symbols-outlined text-[20px] text-[#47e266] relative z-10">
                        radar
                      </span>
                    </div>
                  </div>

                  {/* Radar Stepper Micro-Interaction */}
                  <div className="my-3 p-3 rounded-xl bg-[#201f22]/90 border border-white/5 flex items-center justify-between shadow-inner">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#c0c7d5] font-medium">
                        Hedef Eşik Fiyat
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span
                          id="targetPriceDisplay"
                          className={`text-[17px] font-extrabold text-white tracking-tight transition-transform ${
                            targetPriceBouncing ? "scale-110 text-[#2997ff]" : ""
                          }`}
                        >
                          {targetPrice.toLocaleString("tr-TR")}
                        </span>
                        <span className="text-[12px] text-[#2997ff] font-bold">₺</span>
                      </div>
                    </div>

                    {/* Step Adjusters */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Fiyatı Azalt"
                        onClick={stepDown}
                        className="w-9 h-9 rounded-xl bg-[#2a2a2c]/90 hover:bg-[#353437] border border-white/10 text-white flex items-center justify-center active:scale-80 active:bg-[#2997ff] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <button
                        type="button"
                        aria-label="Fiyatı Artır"
                        onClick={stepUp}
                        className="w-9 h-9 rounded-xl bg-[#2a2a2c]/90 hover:bg-[#353437] border border-white/10 text-white flex items-center justify-center active:scale-80 active:bg-[#2997ff] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Alarm Set Action Button */}
                  <button
                    type="button"
                    onClick={handleSetAlarm}
                    style={{
                      background: "linear-gradient(to right, #00ac40, #00c853, #47e266)",
                      color: "#ffffff",
                      boxShadow: "0 4px 22px rgba(0, 172, 64, 0.38)",
                    }}
                    className="shimmer-badge w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-[19px]"
                      style={{ animation: "bellTinkle 2s infinite" }}
                    >
                      notification_add
                    </span>
                    <span>
                      {alarmActive
                        ? `✓ Radar Aktif (${targetPrice.toLocaleString("tr-TR")} ₺)`
                        : "Bu Cihaza Ücretsiz Alarm Kur"}
                    </span>
                  </button>
                </div>
              </div>

              {/* d) F/P İNDEKSİ LİDERLERİ (1. Altın, 2. Gümüş, 3. Bronz) */}
              <div className="rounded-3xl bg-[#1c1b1d]/95 backdrop-blur-xl p-4 shadow-xl border border-white/10 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#2997ff] text-[20px]">
                      award_star
                    </span>
                    <span className="text-[17px] font-bold text-white">
                      F/P İndeksi Liderleri
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8a919e]">Skora Göre</span>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Item 1: Gold Glow */}
                  <Link
                    href="/telefon/poco-f6-pro"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#201f22]/80 border border-white/5 hover:border-[#ffd700]/50 hover:bg-[#2a2a2c] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ffd700] via-[#ffae00] to-[#ffd700] text-black font-black text-xs flex items-center justify-center gold-glow">
                        1
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-white">Poco F6 Pro</span>
                        <span className="text-[#8a919e] text-[11px]">
                          Snapdragon 8 Gen 2
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-extrabold text-[#47e266] drop-shadow-[0_0_8px_rgba(71,226,102,0.3)]">
                        23.499 ₺
                      </span>
                      <span className="text-[#c0c7d5] text-[10px]">9.8 / 10 Puan</span>
                    </div>
                  </Link>

                  {/* Item 2: Silver Glow */}
                  <Link
                    href="/telefon/samsung-galaxy-a55"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#201f22]/80 border border-white/5 hover:border-[#dce2eb]/50 hover:bg-[#2a2a2c] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ffffff] via-[#dce2eb] to-[#8a919e] text-black font-black text-xs flex items-center justify-center silver-glow">
                        2
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-white">Galaxy A55</span>
                        <span className="text-[#8a919e] text-[11px]">
                          AMOLED 120Hz Cam Tasarım
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-extrabold text-[#47e266]">
                        16.890 ₺
                      </span>
                      <span className="text-[#c0c7d5] text-[10px]">9.4 / 10 Puan</span>
                    </div>
                  </Link>

                  {/* Item 3: Bronze/Amber Glow */}
                  <Link
                    href="/telefon/nothing-phone-2a"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#201f22]/80 border border-white/5 hover:border-[#ff8c00]/50 hover:bg-[#2a2a2c] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff9f43] via-[#e67e22] to-[#b33939] text-white font-black text-xs flex items-center justify-center bronze-glow">
                        3
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-white">
                          Nothing Phone 2a
                        </span>
                        <span className="text-[#8a919e] text-[11px]">
                          Glyph Arayüzü &amp; Akıcı UI
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-extrabold text-[#47e266]">
                        18.499 ₺
                      </span>
                      <span className="text-[#c0c7d5] text-[10px]">9.1 / 10 Puan</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── 5. PİYASANIN EN GÖZDELERİ (4 Premium Elevated Cards) ── */}
          <section className="flex flex-col my-4">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-[22px] font-bold text-white tracking-tight">
                  Piyasanın En Gözdeleri
                </h2>
                <p className="text-[13px] text-[#c0c7d5]">
                  Son 24 saatte en çok tıklanan ve fiyatı takip edilenler
                </p>
              </div>
              <Link
                href="/telefonlar"
                className="text-xs text-[#2997ff] font-bold flex items-center hover:underline active:scale-95 transition-transform"
              >
                <span>Tümü</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            {/* 2-Column Product Grid: 4 Yükseltilmiş Premium Cihaz Kartı */}
            <div className="grid grid-cols-2 gap-3" id="deviceGrid">

              {/* Cihaz 1: iPhone 16 Pro Max (Safir/Lacivert Atmosferik Neon Ambiyans) */}
              <div
                className="card-shimmer flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#181a24] to-[#121318] backdrop-blur-xl p-3 shadow-[0_10px_30px_rgba(0,49,92,0.35)] border border-[#2997ff]/25 hover:border-[#2997ff]/60 group relative hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                {/* Safir Arka Plan Işıltısı */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#2997ff]/10 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-500" />
                <div className="relative z-10">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="shimmer-badge px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/25 to-rose-500/25 border border-orange-400/40 text-orange-300 text-[10px] font-bold inline-flex items-center gap-1 shadow-sm leading-tight shrink-0 whitespace-nowrap">
                      🔥 En Popüler
                    </span>
                  </div>

                  {/* Device Image Showcase with Reflective Circular Glow & Micro Zoom */}
                  <div className="w-full h-32 rounded-xl bg-[#0e1017]/90 overflow-hidden mb-2.5 relative border border-white/5 flex items-center justify-center shadow-inner">
                    <div className="absolute w-20 h-20 bg-gradient-to-tr from-[#2997ff]/15 to-purple-600/10 rounded-full blur-2xl pointer-events-none opacity-40" />
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                      alt="Apple iPhone 16 Pro Max Black Titanium flagship"
                      src="/images/stitch/grid-iphone16promax.webp"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuBiKR9WOqG3lj1Ygy7hnN_FJO7FDdaIEKP0moFtG1fDTIQ9MPj_Bhy-RZVeKsnrKQtz3uE7JxfnZdTCDLLsKbCJI1wi0rC7jhMnMxaOTEKYoYRhbn21kzGmpQFA_4OZ6ihJvdyiPzV-xRmpYH6kACcXh_1X-SbWqq7R-1dKOlu29imT18qJqktywfQTYpHkO4_4XOW9xIi24-dFajlKTUerCwsUTmF2jr6g3gnZBnM";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Brand & Title */}
                  <span className="text-[11px] font-bold text-[#2997ff] tracking-wider uppercase">
                    Apple
                  </span>
                  <h3 className="text-[13px] font-bold text-white truncate">
                    iPhone 16 Pro Max 256GB
                  </h3>

                  {/* Store Details & Crossed-out Original Price */}
                  <div className="flex items-center justify-between text-[11px] text-[#c0c7d5] mt-1.5">
                    <span className="flex items-center gap-1 font-medium text-[#c0c7d5] truncate">
                      <span className="material-symbols-outlined text-[13px] text-[#47e266]">
                        storefront
                      </span>
                      Amazon TR
                    </span>
                    <span className="line-through text-[#8a919e] text-[11px]">91.999 ₺</span>
                  </div>

                  {/* Lowest Price Highlight */}
                  <div className="flex items-baseline gap-1 mt-0.5 mb-3">
                    <span className="text-[17px] font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(41,151,255,0.4)]">
                      84.999
                    </span>
                    <span className="text-[11px] text-[#2997ff] font-bold">₺</span>
                  </div>
                </div>

                {/* Action Button: Glassmorphic Pill */}
                <Link
                  href="/telefon/apple-iphone-16-pro-max"
                  className="relative z-10 w-full py-1.5 px-3 rounded-full bg-[#2a2a2c]/80 hover:bg-[#2997ff] hover:text-[#002e57] text-white text-[12px] font-medium border border-white/10 hover:border-transparent transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 group/btn shadow-sm"
                >
                  <span>Fiyatları Gör</span>
                  <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/btn:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Cihaz 2: Samsung Galaxy S25 Ultra (Amber/Altın Atmosferik Neon Ambiyans) */}
              <div
                className="card-shimmer flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#201c15] to-[#14120e] backdrop-blur-xl p-3 shadow-[0_10px_30px_rgba(217,119,6,0.3)] border border-amber-400/25 hover:border-amber-400/60 group relative hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                {/* Amber/Altın Arka Plan Işıltısı */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-500" />
                <div className="relative z-10">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="shimmer-badge px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold inline-flex items-center gap-1 shadow-sm leading-tight shrink-0 whitespace-nowrap">
                      📉 -%12 Fırsat
                    </span>
                  </div>

                  {/* Device Image Showcase with Reflective Circular Glow & Micro Zoom */}
                  <div className="w-full h-32 rounded-xl bg-[#14120f]/90 overflow-hidden mb-2.5 relative border border-white/5 flex items-center justify-center shadow-inner">
                    <div className="absolute w-20 h-20 bg-gradient-to-tr from-amber-400/15 to-orange-600/10 rounded-full blur-2xl pointer-events-none opacity-40" />
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                      alt="Samsung Galaxy S25 Ultra Titanium Gray flagship"
                      src="/images/stitch/grid-s25ultra.webp"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuAzY5Akm4fFvaliD7kMnpuIHubbaRP2PrZWet-i-SfhOqY5cgEaTn9gpE2l2dnrmScNJaL5Z55N0c_5V7xsFxEXZeZx3WZjZ1Uvz45hUcERsPzTmxAJdfvmhN8jJ7oe5IXpqlNs8yhnf-jYvtU0KfngiGwQbjwc6XJaYJNYUzsOyzGfEf9sAMmUT8re38poYxvvv9u0bumQYutbAeWweN_0_nWVwBBfJqTHFtmD4GQ";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Brand & Title */}
                  <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                    Samsung
                  </span>
                  <h3 className="text-[13px] font-bold text-white truncate">
                    Galaxy S25 Ultra 512GB
                  </h3>

                  {/* Store Details & Crossed-out Original Price */}
                  <div className="flex items-center justify-between text-[11px] text-[#c0c7d5] mt-1.5">
                    <span className="flex items-center gap-1 font-medium text-[#c0c7d5] truncate">
                      <span className="material-symbols-outlined text-[13px] text-[#47e266]">
                        storefront
                      </span>
                      Hepsiburada
                    </span>
                    <span className="line-through text-[#8a919e] text-[11px]">74.499 ₺</span>
                  </div>

                  {/* Lowest Price Highlight */}
                  <div className="flex items-baseline gap-1 mt-0.5 mb-3">
                    <span className="text-[17px] font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                      68.799
                    </span>
                    <span className="text-[11px] text-amber-300 font-bold">₺</span>
                  </div>
                </div>

                {/* Action Button: Glassmorphic Pill */}
                <Link
                  href="/telefon/samsung-galaxy-s25-ultra"
                  className="relative z-10 w-full py-1.5 px-3 rounded-full bg-[#2a2a2c]/80 hover:bg-amber-400 hover:text-black text-white text-[12px] font-medium border border-white/10 hover:border-transparent transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 group/btn shadow-sm"
                >
                  <span>Fiyatları Gör</span>
                  <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/btn:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Cihaz 3: Xiaomi 15 Pro (Cyan/Turkuaz Atmosferik Neon Ambiyans) */}
              <div
                className="card-shimmer flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#121b22] to-[#0e1318] backdrop-blur-xl p-3 shadow-[0_10px_30px_rgba(6,182,212,0.3)] border border-cyan-400/25 hover:border-cyan-400/60 group relative hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                {/* Cyan/Turkuaz Arka Plan Işıltısı */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-500" />
                <div className="relative z-10">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="shimmer-badge px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold inline-flex items-center gap-1 shadow-sm leading-tight shrink-0 whitespace-nowrap">
                      ⚡ Dip Fiyat
                    </span>
                  </div>

                  {/* Device Image Showcase with Reflective Circular Glow & Micro Zoom */}
                  <div className="w-full h-32 rounded-xl bg-[#0d1419]/90 overflow-hidden mb-2.5 relative border border-white/5 flex items-center justify-center shadow-inner">
                    <div className="absolute w-20 h-20 bg-gradient-to-tr from-cyan-400/15 to-blue-600/10 rounded-full blur-2xl pointer-events-none opacity-40" />
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                      alt="Xiaomi 15 Pro Leica camera flagship smartphone dark render"
                      src="/images/stitch/grid-xiaomi15pro.webp"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuC0zB-ChZfJx0MW-074KF69D47H72q5ITt_7qqXczJ2F-ccl5pS0xEufr9m5b_CroBbkJJ3GB1OhVgYhpYvd6fQO60ou_a9eyiQnXihivw1xqzwKPvtwMX6eu2xnJlIfPmX2OP1VZeTf6mO9DUnv3qvRVZGDPUzNU2AWbzQG01rRmGMWhgA3qJaYrDsVl-zNJKACQSICEu3cNWYlQlqRiquz-Kq6wo8YS3OAs9Yukc";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Brand & Title */}
                  <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase">
                    Xiaomi
                  </span>
                  <h3 className="text-[13px] font-bold text-white truncate">
                    Xiaomi 15 Pro 512GB
                  </h3>

                  {/* Store Details & Crossed-out Original Price */}
                  <div className="flex items-center justify-between text-[11px] text-[#c0c7d5] mt-1.5">
                    <span className="flex items-center gap-1 font-medium text-[#c0c7d5] truncate">
                      <span className="material-symbols-outlined text-[13px] text-[#47e266]">
                        storefront
                      </span>
                      Trendyol
                    </span>
                    <span className="line-through text-[#8a919e] text-[11px]">58.999 ₺</span>
                  </div>

                  {/* Lowest Price Highlight */}
                  <div className="flex items-baseline gap-1 mt-0.5 mb-3">
                    <span className="text-[17px] font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                      52.499
                    </span>
                    <span className="text-[11px] text-cyan-300 font-bold">₺</span>
                  </div>
                </div>

                {/* Action Button: Glassmorphic Pill */}
                <Link
                  href="/telefon/xiaomi-15-pro"
                  className="relative z-10 w-full py-1.5 px-3 rounded-full bg-[#2a2a2c]/80 hover:bg-cyan-400 hover:text-black text-white text-[12px] font-medium border border-white/10 hover:border-transparent transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 group/btn shadow-sm"
                >
                  <span>Fiyatları Gör</span>
                  <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/btn:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Cihaz 4: Vivo X200 Pro (Zümrüt Yeşili Atmosferik Neon Ambiyans) */}
              <div
                className="card-shimmer flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#101e16] to-[#0d1511] backdrop-blur-xl p-3 shadow-[0_10px_30px_rgba(16,185,129,0.3)] border border-emerald-400/25 hover:border-emerald-400/60 group relative hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                {/* Zümrüt Yeşili Arka Plan Işıltısı */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-500" />
                <div className="relative z-10">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="shimmer-badge px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1 shadow-sm leading-tight shrink-0 whitespace-nowrap">
                      📸 Kamera Lideri
                    </span>
                  </div>

                  {/* Device Image Showcase with Reflective Circular Glow & Micro Zoom */}
                  <div className="w-full h-32 rounded-xl bg-[#0c1611]/90 overflow-hidden mb-2.5 relative border border-white/5 flex items-center justify-center shadow-inner">
                    <div className="absolute w-20 h-20 bg-gradient-to-tr from-emerald-400/15 to-teal-600/10 rounded-full blur-2xl pointer-events-none opacity-40" />
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                      alt="Vivo X200 Pro Zeiss telephoto luxury smartphone"
                      src="/images/stitch/grid-vivox200pro.webp"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuC5f5e2qDTpKrvTJ8-nbXk8Svvp-2lHTHReX5Qj8cltMyKP9N9cu_RJ42G2opGU_41orwfUUrtmRp6c2WDdA7m7KaUhVnBCQjB4MANwdyZ-ixQ_Vll2oi05HaQkDhZviyKcYoVz0M0QxnEvZnM2e3i6xPiZe1ECLKO43qGlgvvPRku-aurDqg0zzOq6sZjKc-zghMoHhj2dYPD95E-9k-HHEKkyz-OE8PYnQiy91f4";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Brand & Title */}
                  <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
                    vivo
                  </span>
                  <h3 className="text-[13px] font-bold text-white truncate">
                    vivo X200 Pro 512GB
                  </h3>

                  {/* Store Details & Crossed-out Original Price */}
                  <div className="flex items-center justify-between text-[11px] text-[#c0c7d5] mt-1.5">
                    <span className="flex items-center gap-1 font-medium text-[#c0c7d5] truncate">
                      <span className="material-symbols-outlined text-[13px] text-[#47e266]">
                        storefront
                      </span>
                      Amazon TR
                    </span>
                    <span className="line-through text-[#8a919e] text-[11px]">63.499 ₺</span>
                  </div>

                  {/* Lowest Price Highlight */}
                  <div className="flex items-baseline gap-1 mt-0.5 mb-3">
                    <span className="text-[17px] font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                      56.999
                    </span>
                    <span className="text-[11px] text-emerald-300 font-bold">₺</span>
                  </div>
                </div>

                {/* Action Button: Glassmorphic Pill */}
                <Link
                  href="/telefon/vivo-x200-pro"
                  className="relative z-10 w-full py-1.5 px-3 rounded-full bg-[#2a2a2c]/80 hover:bg-emerald-400 hover:text-black text-white text-[12px] font-medium border border-white/10 hover:border-transparent transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 group/btn shadow-sm"
                >
                  <span>Fiyatları Gör</span>
                  <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/btn:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>
              </div>

            </div>
          </section>

          {/* ── 6. SMART AI PHONE FINDER CTA BOX ─────────────────── */}
          <section className="mt-4 mb-6">
            <div className="relative rounded-3xl p-[1.5px] overflow-hidden shadow-2xl active:scale-[0.99] transition-transform">
              {/* Aurora Border Beam (5.5s) */}
              <div
                className="absolute -inset-[150%] opacity-70 pointer-events-none"
                style={{
                  animation: "beamRotateFast 5.5s linear infinite",
                  background: "conic-gradient(from 0deg, #2997ff, #7928ca, #47e266, #2997ff)",
                }}
              />

              <div className="relative rounded-[22px] bg-[#161619]/95 backdrop-blur-2xl p-5 flex flex-col items-center text-center border border-white/10">
                {/* Magic Aura Icon */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2997ff]/20 to-[#7928ca]/30 text-[#2997ff] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(41,151,255,0.35)] border border-[#2997ff]/30">
                  <span className="material-symbols-outlined text-[30px] animate-pulse">
                    auto_awesome
                  </span>
                </div>

                <h3 className="text-[20px] font-extrabold text-white leading-tight">
                  Hangi telefonu seçeceğinizden emin değil misiniz?
                </h3>

                <p className="text-[13px] text-[#c0c7d5] max-w-xs mt-1.5 mb-4">
                  Bütçenizi, kamera önceliğinizi veya kullanım alışkanlığınızı belirtin; 30 saniyede
                  en iyi 3 alternatifi eşleştirelim.
                </p>

                {/* Flowing Aurora Button */}
                <Link
                  href="/telefon-rehberi"
                  className="aurora-btn-bg shimmer-badge w-full max-w-xs py-3.5 rounded-full text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(41,151,255,0.5)] active:scale-95 transition-all text-center"
                >
                  <span>Akıllı Rehberi Başlat</span>
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
