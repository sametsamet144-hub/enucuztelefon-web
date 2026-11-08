"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

const TYPEWRITER_PHRASES = [
  "Model, marka veya özellik ara (örn: iPhone 16 Pro Max 256GB...)",
  "Model, marka veya özellik ara (örn: Snapdragon 8 Elite telefonlar...)",
  "Model, marka veya özellik ara (örn: 50.000 TL altı en iyi kameralı telefon...)",
  "Model, marka veya özellik ara (örn: Galaxy S25 Ultra 120Hz...)",
];

export default function StitchDesktopHome() {
  const router = useRouter();
  const { openAlertModal, showToast } = useApp();

  const ambientWrapperRef = useRef<HTMLDivElement>(null);
  const ambientTrackerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [typewriterText, setTypewriterText] = useState(TYPEWRITER_PHRASES[0]);
  const [alarmToggle, setAlarmToggle] = useState(true);
  const [activeBrand, setActiveBrand] = useState("Tümü");
  const [activeTrendTab, setActiveTrendTab] = useState<"Tümü" | "iOS" | "Android">("Tümü");

  // 1. Hero & Bento Container Radial Cursor Glow Tracker + Bento Border-Beam Mouse Spotlight
  useEffect(() => {
    const wrapper = ambientWrapperRef.current;
    const tracker = ambientTrackerRef.current;

    const handleAmbientMove = (e: MouseEvent) => {
      if (!wrapper || !tracker) return;
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      tracker.style.setProperty("--global-mouse-x", `${x}px`);
      tracker.style.setProperty("--global-mouse-y", `${y}px`);
    };

    if (wrapper) {
      wrapper.addEventListener("mousemove", handleAmbientMove);
    }

    const cards = document.querySelectorAll<HTMLElement>(".border-beam-card");
    const cardHandlers = new Map<HTMLElement, (e: MouseEvent) => void>();

    cards.forEach((card) => {
      const handler = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      };
      cardHandlers.set(card, handler);
      card.addEventListener("mousemove", handler);
    });

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("mousemove", handleAmbientMove);
      }
      cardHandlers.forEach((handler, card) => {
        card.removeEventListener("mousemove", handler);
      });
    };
  }, []);

  // 3. Search Bar Dynamic Typewriter Looping Effect
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];

      if (isDeleting) {
        charIndex = Math.max(0, charIndex - 1);
        setTypewriterText(currentPhrase.substring(0, charIndex));
      } else {
        charIndex = Math.min(currentPhrase.length, charIndex + 1);
        setTypewriterText(currentPhrase.substring(0, charIndex));
      }

      let typeSpeed = isDeleting ? 28 : 55;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length;
        typeSpeed = 450;
      }

      timerId = setTimeout(tick, typeSpeed);
    };

    timerId = setTimeout(tick, 500);
    return () => clearTimeout(timerId);
  }, []);

  // 6. Dynamic Counter Animation for Telemetry & Metrics + ⌘K Shortcut
  useEffect(() => {
    function animateValue(
      obj: Element,
      start: number,
      end: number,
      duration: number,
      formatThousands: boolean,
      prefix = "",
      suffix = ""
    ) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * (end - start) + start);

        let formatted = currentVal.toString();
        if (formatThousands) {
          formatted = currentVal.toLocaleString("tr-TR");
        }

        obj.innerHTML = `${prefix}${formatted}${suffix}`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          let finalStr = end.toString();
          if (formatThousands) finalStr = end.toLocaleString("tr-TR");
          obj.innerHTML = `${prefix}${finalStr}${suffix}`;
        }
      };
      window.requestAnimationFrame(step);
    }

    const countElements = document.querySelectorAll(".count-metric");
    let observer: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseInt(el.getAttribute("data-target") || "0", 10);
              const isFormatted = el.getAttribute("data-formatted") === "true";
              const prefix = el.getAttribute("data-prefix") || "";
              const suffix = el.getAttribute("data-suffix") || "";
              if (!isNaN(target) && target > 0) {
                animateValue(el, 0, target, 1600, isFormatted, prefix, suffix);
              }
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.2 }
      );

      countElements.forEach((el) => observer?.observe(el));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      observer?.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/telefonlar?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/telefonlar");
    }
  };

  const brands = [
    "Tümü",
    "Apple",
    "Samsung",
    "Xiaomi",
    "Honor",
    "Huawei",
    "Google Pixel",
    "Nothing Phone",
    "Vivo",
  ];

  const trendCards = [
    {
      slug: "iphone-16",
      brand: "Apple",
      name: "iPhone 16 128GB",
      specs: "A18 Çip • Kamera Denetimi • HDR",
      price: "₺58.999",
      stores: "14 Mağaza",
      badge: "-%12",
      isDiscount: true,
      os: "iOS",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaUIrBxBw_wRHBE6dWd3wP9kiJbZwEx9868os19xKLeQd2ytUxz3_sZLBkF0W0Z5M0T1LZo9LRJ10oXeopf7d6ajL0YJrg8uoj-TkJ4CVWEaWxJgtYBQhjRaQwkh1nOSLtjNmpdSLsov4nIEENfFDlGxYNYYJB15zKtkza1RBrU_H7X_HXmM6PnHJs_2j46Syr346SAOtmleHJMVC3BdHITUwkHv1hPtxlrykrj24",
      alt: "Apple iPhone 16 Plus Ultramarine premium studio product photography on minimalist clean pedestal",
    },
    {
      slug: "samsung-galaxy-s24-plus",
      brand: "Samsung",
      name: "Galaxy S24+ 256GB",
      specs: "Galaxy AI • QHD+ • 12GB RAM",
      price: "₺41.299",
      stores: "19 Mağaza",
      badge: "-%15",
      isDiscount: true,
      os: "Android",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpInXkXOXGBE1EHavHpsUF3cXkimDXWCO23Lwl0lGI8vJA9Pv6eEBVyOCdFobvZGztgvBcbMddRZe2o-JKqFprg3qQfCh1lnXxbqdZbF-Tk0JV6bZ-vbPonrStkekMfY9mvcYB0Pyfvu9Q9rx2ZGvwADQYzbJqd_UFuWwRlBcE1tXIvgD0gG3WaiDqlQfSTbqCesH6LpKtWZy38GuSSKGZuXxXVKZl7VBC4Xnil4s",
      alt: "Samsung Galaxy S24 Plus in Titanium Gray elegant pro studio render centered",
    },
    {
      slug: "honor-magic-v3",
      brand: "Honor",
      name: "Magic 6 Pro 512GB",
      specs: "180MP Periskop • 5600mAh Batarya",
      price: "₺49.999",
      stores: "11 Mağaza",
      badge: "Yeni",
      isDiscount: false,
      os: "Android",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxaJAOIZt-VMc70XFEH2ehSSp1m4KZfGRNKBA9NHXjsT6EAZ5tdJfOv99eSSYQXTO8ys6wDvOTXbKubj4Qc_YEAWwNz0m9hlaxNeUqvEBSXehWmHpOcTLXA1aUueU1e6XN7o_5ADVuN1i6-B4nSVveiZWcGFeaoL9T8zfgghsIaA8Bjr5xvsn7ILi4FiAlh4VMaIbJ5mJ005ygwkxC58oo6eO4k2gl-j--CsR4Ezw",
      alt: "Honor Magic 6 Pro Epi Green vegan leather texture back studio camera focus high tech render",
    },
    {
      slug: "iphone-15",
      brand: "Google",
      name: "Pixel 9 Pro 128GB",
      specs: "Tensor G4 • Gemini Nano • Super Actua",
      price: "₺47.500",
      stores: "8 Mağaza",
      badge: "-%8",
      isDiscount: true,
      os: "Android",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8DIkQLUOx3J2LX2QM4leU6SESQEvYgC9nkM55LVyzvTsIQnYUmX4X3GrIB6Z_nD1J3UzWLy-mZHzuIGor7PbFdYa519LDQEwMdRAfz0kdwOnw48M5zuA3cS6im1G19eai7Jqy9AQGbVRuEm9iMwD39SsBtalCCyrzOXVaOPhsknPVZkH1Bj5pFjNFPr-hWAhQ9wi338JFEsaf6W8qtuT3cle4toVc2x4OcO0Mlfs",
      alt: "Google Pixel 9 Pro Obsidian dark studio lighting showing iconic camera bar",
    },
  ];

  const displayedTrends =
    activeTrendTab === "Tümü"
      ? trendCards
      : trendCards.filter((c) => c.os === activeTrendTab);

  return (
    <div className="w-full min-h-[calc(100vh-16rem)] bg-background relative overflow-hidden font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <div className="flex flex-col w-full text-on-surface">
        {/* 2. CANLI FİYAT DÜŞÜŞ TICKER (LIVE MARQUEE TICKER) */}
        <section
          aria-label="Canlı Fiyat Değişim Akışı"
          className="w-full bg-surface-container-lowest/90 border-b border-white/[0.06] backdrop-blur-md overflow-hidden select-none py-2 relative z-30"
        >
          <div className="flex items-center">
            {/* Live Badge Anchor */}
            <div className="shrink-0 flex items-center gap-1.5 px-4 bg-surface-container-lowest z-10 border-r border-white/10 shadow-[8px_0_12px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
              <span className="font-label-sm text-label-sm text-tertiary font-semibold tracking-wider uppercase text-[11px] whitespace-nowrap">
                Canlı Fiyat Akışı
              </span>
            </div>

            {/* Infinite Running Track */}
            <div className="overflow-hidden flex-1 relative">
              <div className="animate-marquee-infinite items-center gap-8 text-[13px] font-label-md font-normal text-on-surface-variant">
                {/* Set 1 */}
                <Link
                  href="/telefon/samsung-galaxy-s24-ultra"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-tertiary">📉</span>{" "}
                  <strong>Galaxy S24 Ultra</strong> Hepsiburada&apos;da{" "}
                  <span className="text-tertiary font-semibold">4.200 ₺</span>{" "}
                  düştü{" "}
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-tertiary/10 text-tertiary font-medium">
                    (Son 6 Ayın Dibi)
                  </span>
                </Link>
                <span className="text-outline/40">•</span>
                <Link
                  href="/telefon/iphone-16-pro"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-error">🔥</span>{" "}
                  <strong>iPhone 16 Pro 256GB</strong> Amazon TR&apos;de{" "}
                  <span className="text-primary font-semibold">59.899 ₺</span>{" "}
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-medium">
                    (-%18 İndirim)
                  </span>
                </Link>
                <span className="text-outline/40">•</span>
                <Link
                  href="/telefon/xiaomi-15-ultra"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-primary">⚡</span>{" "}
                  <strong>Xiaomi 15 Ultra</strong> Trendyol&apos;da{" "}
                  <span className="text-on-surface font-semibold">
                    53.819 ₺
                  </span>{" "}
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-medium">
                    (Stok Sınırlı)
                  </span>
                </Link>
                <span className="text-outline/40">•</span>
                <Link
                  href="/telefon/honor-magic-v3"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-tertiary">📉</span>{" "}
                  <strong>Honor Magic V3 512GB</strong>{" "}
                  <span className="text-tertiary font-semibold">
                    7.000 ₺ İndirimle
                  </span>{" "}
                  <span className="text-on-surface">62.999 ₺</span>
                </Link>
                <span className="text-outline/40">•</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block" />{" "}
                  <span className="text-primary font-medium">
                    Canlı Fiyat Telemetrisi:
                  </span>{" "}
                  16 yetkili satıcı taranıyor...
                </span>
                <span className="text-outline/40">•</span>

                {/* Duplicated Set for Smooth Continuous Loop */}
                <Link
                  href="/telefon/samsung-galaxy-s24-ultra"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-tertiary">📉</span>{" "}
                  <strong>Galaxy S24 Ultra</strong> Hepsiburada&apos;da{" "}
                  <span className="text-tertiary font-semibold">4.200 ₺</span>{" "}
                  düştü{" "}
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-tertiary/10 text-tertiary font-medium">
                    (Son 6 Ayın Dibi)
                  </span>
                </Link>
                <span className="text-outline/40">•</span>
                <Link
                  href="/telefon/iphone-16-pro"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-error">🔥</span>{" "}
                  <strong>iPhone 16 Pro 256GB</strong> Amazon TR&apos;de{" "}
                  <span className="text-primary font-semibold">59.899 ₺</span>{" "}
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-medium">
                    (-%18 İndirim)
                  </span>
                </Link>
                <span className="text-outline/40">•</span>
                <Link
                  href="/telefon/xiaomi-15-ultra"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-primary">⚡</span>{" "}
                  <strong>Xiaomi 15 Ultra</strong> Trendyol&apos;da{" "}
                  <span className="text-on-surface font-semibold">
                    53.819 ₺
                  </span>{" "}
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-medium">
                    (Stok Sınırlı)
                  </span>
                </Link>
                <span className="text-outline/40">•</span>
                <Link
                  href="/telefon/honor-magic-v3"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-on-surface transition-colors"
                >
                  <span className="text-tertiary">📉</span>{" "}
                  <strong>Honor Magic V3 512GB</strong>{" "}
                  <span className="text-tertiary font-semibold">
                    7.000 ₺ İndirimle
                  </span>{" "}
                  <span className="text-on-surface">62.999 ₺</span>
                </Link>
                <span className="text-outline/40">•</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block" />{" "}
                  <span className="text-primary font-medium">
                    Canlı Fiyat Telemetrisi:
                  </span>{" "}
                  16 yetkili satıcı taranıyor...
                </span>
                <span className="text-outline/40">•</span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Ambient Hero & Bento Container with Interactive Radial Pointer Glow */}
        <div
          ref={ambientWrapperRef}
          className="relative w-full overflow-hidden"
          id="ambient-glow-wrapper"
        >
          {/* Interactive Dynamic Mouse Pointer Radial Glow Tracker */}
          <div
            ref={ambientTrackerRef}
            className="absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none"
            id="hero-ambient-tracker"
          />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-72 left-1/4 w-[380px] h-[380px] bg-surface-tint/5 rounded-full blur-[110px] pointer-events-none -z-10" />

          {/* Hero Content */}
          <section className="max-w-7xl mx-auto px-gutter pt-space-xl pb-margin flex flex-col items-center text-center relative z-10">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container/70 shadow-sm backdrop-blur-md mb-space-lg border border-white/[0.08] transition-all hover:border-primary/40">
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                verified
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wide uppercase">
                Türkiye&apos;nin Akıllı Telefon ve Fiyat Rehberi
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display-hero text-display-hero md:text-[68px] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-on-surface to-outline max-w-4xl leading-[1.08] mb-space-md">
              En doğru telefonu bul.
              <br className="hidden sm:inline" />
              En dip fiyata al.
            </h1>

            {/* Subtitle */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-space-xl leading-relaxed">
              <span
                className="font-semibold text-on-surface count-metric"
                data-suffix="+"
                data-target="488"
              >
                488+
              </span>{" "}
              güncel model,{" "}
              <span
                className="font-semibold text-on-surface count-metric"
                data-suffix=""
                data-target="16"
              >
                16
              </span>{" "}
              resmi yetkili satıcı ve anlık fiyat değişim telemetrisi.
              Karşılaştır, alarm kur, doğrulanmış en düşük fiyattan sahip ol.
            </p>

            {/* 3. Glass Search Box Component with Dynamic Typewriter Animation & Blinking Caret */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-3xl rounded-full bg-surface-container/90 shadow-2xl backdrop-blur-xl p-2 flex items-center gap-space-sm mb-space-lg transition-all focus-within:bg-surface-container-high/95 border border-white/[0.08] focus-within:border-primary/50 relative"
            >
              <div className="pl-space-md flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[24px]">
                  search
                </span>
              </div>
              <div className="relative flex-1 flex items-center overflow-hidden">
                <input
                  ref={searchInputRef}
                  autoComplete="off"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-transparent border-0 outline-none text-on-surface font-body-md text-body-md placeholder:text-outline focus:ring-0 px-space-xs text-left"
                  id="hero-device-search"
                  placeholder=""
                  type="text"
                />
                {/* Animated Typewriter Display Overlay (visible when input is empty) */}
                {searchValue.length === 0 && (
                  <div
                    style={{ opacity: isSearchFocused ? 0.4 : 1 }}
                    className="absolute left-1 pointer-events-none text-outline font-body-md text-body-md truncate flex items-center transition-opacity"
                    id="search-typewriter-container"
                  >
                    <span id="typewriter-text">{typewriterText}</span>
                    <span className="typewriter-cursor text-primary font-normal text-lg leading-none ml-0.5">
                      |
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden md:flex items-center gap-1 px-space-sm py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm border border-white/5">
                <span>⌘K</span>
              </div>
              <button
                className="shrink-0 h-12 px-space-xl rounded-full bg-primary-container text-white font-label-md text-label-md shadow-md hover:bg-primary hover:text-on-primary transition-all flex items-center gap-space-xs active:scale-[0.98] cursor-pointer"
                type="submit"
              >
                <span>Fiyatları Gör</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </form>

            {/* Quick Brand Chips */}
            <div className="flex flex-wrap items-center justify-center gap-space-xs max-w-3xl">
              {brands.map((brand) => {
                const isSelected = activeBrand === brand;
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setActiveBrand(brand);
                      if (brand !== "Tümü") {
                        const slug = brand.toLowerCase().split(" ")[0];
                        router.push(`/telefonlar?brand=${slug}`);
                      }
                    }}
                    className={
                      isSelected
                        ? "h-9 px-space-md rounded-full bg-white text-surface font-label-md text-label-md shadow-sm transition-all hover:opacity-95 cursor-pointer"
                        : "h-9 px-space-md rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer"
                    }
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* 6. Telemetry Bar with Dynamic Animated Counters */}
        <section className="w-full bg-surface-container-lowest/60 py-space-md mb-margin border-y border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-gutter flex flex-wrap items-center justify-between gap-space-md text-on-surface-variant">
            <div className="flex items-center gap-space-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label-sm text-label-sm tracking-wide text-on-surface font-semibold">
                CANLI TELEMETRİ
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Son güncelleme: 34 saniye önce
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-space-xl font-label-sm text-label-sm">
              <div className="flex items-center gap-space-xs">
                <span
                  className="text-on-surface font-semibold text-[15px] count-metric"
                  data-formatted="true"
                  data-target="1482903"
                >
                  1.482.903
                </span>
                <span className="text-outline">
                  günlük taranan fiyat satırı
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span
                  className="text-tertiary font-semibold text-[15px] count-metric"
                  data-prefix="%"
                  data-suffix=""
                  data-target="100"
                >
                  %100
                </span>
                <span className="text-outline">
                  BTK Kayıtlı Türkiye Garantili
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="text-primary font-semibold text-[15px]">
                  0 ms
                </span>
                <span className="text-outline">aracı komisyonu</span>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION: Akıllı Alışverişin Yeni Standardı */}
        <section className="max-w-7xl mx-auto px-gutter mb-margin w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                Bento Ekosistemi
              </span>
              <h2 className="font-headline-xl text-headline-xl tracking-tight text-on-surface mt-1">
                Akıllı Alışverişin Yeni Standardı
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Karmaşık reklam bannerları yok. Sadece saf veri, berrak fiyat
              değişim analizleri ve onaylı satıcı rotaları.
            </p>
          </div>

          {/* Bento Grid Container with Animated Border-Beam & Spotlight Effects */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-gutter">
            {/* BENTO 1: Large Feature - Fiyatı En Çok Düşenler (8 Cols) */}
            <div className="border-beam-card md:col-span-6 lg:col-span-8 bg-surface-container/85 p-space-xl relative overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:bg-surface-container-high/90 group">
              <div className="beam-spotlight" />
              {/* Ambient subtle accent */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg relative z-10">
                <div className="flex items-center gap-space-xs">
                  {/* 4. Pulsing Badge */}
                  <span className="px-space-sm py-1 rounded-full bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm flex items-center gap-1 price-drop-pulse">
                    <span className="material-symbols-outlined text-[14px]">
                      trending_down
                    </span>
                    Günün Rekor Düşüşü
                  </span>
                  <span
                    className="px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm price-drop-pulse"
                    style={{ animationDelay: "1.5s" }}
                  >
                    Son 6 Ayın En Dibi
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline">
                  Güncelleme: 14:20
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-lg items-center mb-space-lg relative z-10">
                <div className="sm:col-span-7 flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-medium tracking-wide">
                    APPLE FLAGSHIP
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 mb-space-xs">
                    iPhone 16 Pro 256GB
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Doğal Titanyum, A18 Pro Çip, 48MP Pro Kamera Sistemi. Resmi
                    Türkiye Garantili Ürün.
                  </p>
                  <div className="flex items-baseline gap-space-sm mb-space-sm">
                    {/* 4. Price Glow Pulse */}
                    <span className="font-price-xl text-price-xl text-on-surface tracking-tight price-number-pulse">
                      ₺59.899
                    </span>
                    <span className="font-body-md text-body-md text-outline line-through">
                      ₺72.999
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary font-semibold ml-1 price-drop-pulse px-2 py-0.5 rounded-full bg-tertiary/10">
                      -%18 İndirim
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">
                      check_circle
                    </span>
                    <span>
                      En düşük satıcı: <strong>Amazon TR</strong> (Satıcı &amp;
                      Gönderici Resmi Amazon)
                    </span>
                  </div>
                </div>

                {/* 5. 3D Floating Mockup Phone */}
                <div className="sm:col-span-5 relative flex items-center justify-center p-space-md rounded bg-surface-container-lowest/60">
                  <img
                    alt="Studio hardware render of Apple iPhone 16 Pro Natural Titanium"
                    className="w-48 h-56 object-contain drop-shadow-2xl animate-float-mockup transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDrVAurp_xNMekkJUnRh__oYVfi6GZhC-OVW_Oo0WLfhcEVZk2YGKIkXMVU_7EdpBAFbTPFnoSs-cK7_8um0OcXNjoWFs1DACEplsSrjKjett3wVgxI3KXb_TUvpA6QuMNbgPs0HKaxtj2UfOsys1Fp-fJTvnivZjk0sSwQ9QFleu-qe8-3IkbEsSo4EnNNCXaOeyZGc4tnvJwPms6QMpqjVE57tEgCZ58O_q_w_c"
                  />
                </div>
              </div>

              {/* Price History Sparkline & Action Row */}
              <div className="pt-space-md mt-space-sm bg-surface-container-lowest/40 rounded-DEFAULT p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md relative z-10 border border-white/[0.04]">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline">
                    6 Aylık Fiyat Telemetrisi Grafiği
                  </span>
                  <div className="flex items-center gap-space-md">
                    {/* Inline SVG Sparkline */}
                    <svg
                      className="w-44 h-8 text-tertiary overflow-visible"
                      fill="none"
                      viewBox="0 0 160 32"
                    >
                      <path
                        d="M0 8 L30 12 L60 7 L90 19 L120 15 L160 28"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      />
                      <circle
                        className="animate-ping"
                        cx="160"
                        cy="28"
                        fill="currentColor"
                        opacity="0.7"
                        r="4"
                      />
                      <circle cx="160" cy="28" fill="currentColor" r="4" />
                    </svg>
                    <span className="font-label-sm text-label-sm text-tertiary font-medium price-drop-pulse px-2 py-0.5 rounded bg-tertiary/10">
                      -₺13.100 Tasarruf
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm">
                  <div className="flex -space-x-2 overflow-hidden">
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold bg-surface-bright text-on-surface">
                      Amazon
                    </span>
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface">
                      HB
                    </span>
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold bg-surface-container-high text-on-surface">
                      Trendyol
                    </span>
                  </div>
                  <Link
                    className="h-10 px-space-lg rounded-full bg-primary-container text-white font-label-md text-label-md flex items-center gap-1 shadow-md hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                    href="/telefon/iphone-16-pro"
                  >
                    <span>Fırsatı İncele</span>
                    <span className="material-symbols-outlined text-[16px]">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* BENTO 2: Head-to-Head Comparison VS (4 Cols) with Device Hover Convergence */}
            <div className="border-beam-card beam-delay-1 md:col-span-6 lg:col-span-4 bg-surface-container/85 p-space-xl flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-300 hover:bg-surface-container-high/90 group-vs group">
              <div className="beam-spotlight" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-space-md">
                  <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold tracking-wide">
                    KAFA KAFAYA ANALİZ
                  </span>
                  <span className="material-symbols-outlined text-outline text-[20px] transition-transform duration-300 group-hover:rotate-12 group-hover:text-primary">
                    balance
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-space-xs">
                  Amiral Gemisi Düellosu
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">
                  Donanım matrisi, AnTuTu performansı ve anlık piyasa fiyat
                  karşılaştırması.
                </p>

                {/* 5. Dual spec comparison card with interactive device convergence on hover */}
                <div className="grid grid-cols-2 gap-space-sm rounded bg-surface-container-lowest p-space-md mb-space-md border border-white/[0.04] relative">
                  {/* VS Center Pill */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center shadow-lg pointer-events-none">
                    <span className="text-[10px] font-bold text-primary">
                      VS
                    </span>
                  </div>

                  {/* Left Device */}
                  <div className="vs-device-left flex flex-col items-center text-center transition-transform duration-300 ease-out">
                    <img
                      alt="Clean front view of iPhone 16 Pro"
                      className="w-16 h-24 object-contain mb-space-xs drop-shadow-md"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcWxymk-dsDtNmhFf_jhgjjVUi0HWvLTsfOm2HSSfcCUtHFviOdv6DoSvWaKEhyD6136lFISkxzBYIvOhVUzux0q-mfQarb0HQAEUm7hkj4xntSeoVxUQN16NyaXZzEg7f6midVNJXZRYI5zvGnzAEGsXRt_IBXo00WeGPw7i8lFhuW2j8GBKgUdl9HuHupVvL_sb6rh4t-VJib87oNVxZaz-CwGaAxxDH0WEt-_I"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate w-full">
                      iPhone 16 Pro
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold mt-1">
                      ₺59.899
                    </span>
                    <span className="text-[11px] text-outline mt-1">
                      6.3&quot; ProMotion
                    </span>
                    <span className="text-[11px] text-outline">
                      48MP Fusion
                    </span>
                  </div>

                  {/* Right Device */}
                  <div className="vs-device-right flex flex-col items-center text-center transition-transform duration-300 ease-out">
                    <img
                      alt="Clean front view of Samsung Galaxy S24 Ultra"
                      className="w-16 h-24 object-contain mb-space-xs drop-shadow-md"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA44u-M6KmPysMFuFPLcLx1Fy4Y1zQZImQoPqHHeHBJKOfTOppWpsPnMkVskEVe_19LOObF5zGbzfwOmmuwkVnO-Jd65KAQFioGcXLlmUP8yWCA5onRd-MHwLEs7LB4Huf4k7hkSupHk592WTgGlTYoP0QJrIefa5GE0WZyGa_Zpl8qcYYEcDRNdWnqHI39Ny_dx2BY7m3XfBhAZAvJZhvk1Gl9vsbzWhHFZlqfo_Q"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate w-full">
                      Galaxy S24 Ultra
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold mt-1">
                      ₺54.499
                    </span>
                    <span className="text-[11px] text-outline mt-1">
                      6.8&quot; AMOLED 2X
                    </span>
                    <span className="text-[11px] text-outline">
                      200MP Quad Cam
                    </span>
                  </div>
                </div>

                {/* Spec Bar */}
                <div className="flex flex-col gap-1.5 mb-space-md">
                  <div className="flex justify-between text-[12px] font-label-sm text-outline">
                    <span>AnTuTu v10 Skoru</span>
                    <span className="text-on-surface font-semibold">
                      1.82M vs 1.94M
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden flex">
                    <div className="bg-primary h-full w-[48%] transition-all duration-500" />
                    <div className="bg-tertiary-container h-full w-[52%] transition-all duration-500" />
                  </div>
                </div>
              </div>

              <Link
                className="relative z-10 w-full h-11 rounded-full bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-md text-label-md flex items-center justify-center gap-space-xs transition-all active:scale-98"
                href="/karsilastir"
              >
                <span>Karşılaştırmayı Başlat</span>
                <span className="material-symbols-outlined text-[18px]">
                  compare_arrows
                </span>
              </Link>
            </div>

            {/* BENTO 3: Bütçe & F/P Şampiyonları (4 Cols) */}
            <div className="border-beam-card beam-delay-2 md:col-span-6 lg:col-span-4 bg-surface-container/85 p-space-xl flex flex-col justify-between shadow-xl transition-all duration-300 hover:bg-surface-container-high/90">
              <div className="beam-spotlight" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-space-md">
                  <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-label-sm font-semibold tracking-wide">
                    F/P RADARI
                  </span>
                  <span className="material-symbols-outlined text-outline text-[20px]">
                    military_tech
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-space-xs">
                  Fiyat/Performans Liderleri
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Bütçenize göre en yüksek donanım endeksine sahip modeller.
                </p>
                <div className="flex flex-col gap-space-sm">
                  {/* Row 1 */}
                  <Link
                    href="/telefon/poco-f6-pro"
                    className="p-space-sm rounded bg-surface-container-lowest/80 flex items-center justify-between transition-all hover:bg-surface-container-lowest hover:translate-x-1 border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="w-7 h-7 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center text-[12px] font-bold shrink-0">
                        1
                      </span>
                      <div className="truncate">
                        <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          Xiaomi Poco F6 Pro
                        </h4>
                        <span className="text-[12px] text-outline">
                          12 Mağaza • 4.9/5 Skor
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-space-sm">
                      <span className="font-title-sm text-title-sm text-on-surface font-bold">
                        ₺23.499
                      </span>
                      <span className="block text-[11px] text-tertiary font-medium">
                        Bütçe Lideri
                      </span>
                    </div>
                  </Link>

                  {/* Row 2 */}
                  <Link
                    href="/telefon/samsung-galaxy-a55"
                    className="p-space-sm rounded bg-surface-container-lowest/80 flex items-center justify-between transition-all hover:bg-surface-container-lowest hover:translate-x-1 border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[12px] font-bold shrink-0">
                        2
                      </span>
                      <div className="truncate">
                        <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          Samsung Galaxy A55
                        </h4>
                        <span className="text-[12px] text-outline">
                          18 Mağaza • 4.8/5 Skor
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-space-sm">
                      <span className="font-title-sm text-title-sm text-on-surface font-bold">
                        ₺16.890
                      </span>
                      <span className="block text-[11px] text-outline">
                        20k Altı Kralı
                      </span>
                    </div>
                  </Link>

                  {/* Row 3 */}
                  <Link
                    href="/telefon/nothing-phone-2a"
                    className="p-space-sm rounded bg-surface-container-lowest/80 flex items-center justify-between transition-all hover:bg-surface-container-lowest hover:translate-x-1 border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <span className="w-7 h-7 rounded-full bg-surface-bright text-on-surface-variant flex items-center justify-center text-[12px] font-bold shrink-0">
                        3
                      </span>
                      <div className="truncate">
                        <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          Nothing Phone (2a)
                        </h4>
                        <span className="text-[12px] text-outline">
                          9 Mağaza • 4.7/5 Skor
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-space-sm">
                      <span className="font-title-sm text-title-sm text-on-surface font-bold">
                        ₺18.499
                      </span>
                      <span className="block text-[11px] text-outline">
                        Özgün Tasarım
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              <Link
                className="relative z-10 font-label-md text-label-md text-primary hover:text-primary-fixed mt-space-md flex items-center gap-1 transition-colors group"
                href="/telefonlar?sort=price-drop"
              >
                <span>Tüm Fiyat Kademe Listelerini Gör</span>
                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* BENTO 4: Canlı Fiyat Radarı & Alarm Kur (4 Cols) with Wiggling Bell Icon */}
            <div className="border-beam-card beam-delay-3 md:col-span-6 lg:col-span-4 bg-surface-container/85 p-space-xl flex flex-col justify-between shadow-xl transition-all duration-300 hover:bg-surface-container-high/90 group group-hover-bell">
              <div className="beam-spotlight" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-space-md">
                  <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold tracking-wide">
                    AKILLI RADAR
                  </span>
                  {/* 5. Wiggling Bell Icon */}
                  <span className="material-symbols-outlined text-outline text-[20px] bell-target transition-colors group-hover:text-primary">
                    notifications_active
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-space-xs">
                  Fiyat Alarmı Kurun
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Seçtiğiniz model hedef rakama indiği an saniyeler içinde
                  bildirim alın.
                </p>
                <div className="p-space-md rounded bg-surface-container-lowest/80 flex flex-col gap-space-sm mb-space-md border border-white/[0.04]">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">Hedef Cihaz:</span>
                    <span className="text-on-surface font-semibold">
                      iPhone 15 128GB
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">
                      Güncel Fiyat:
                    </span>
                    <span className="text-outline line-through">₺48.999</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container border border-white/[0.04]">
                    <span className="font-label-sm text-label-sm text-tertiary">
                      Hedef Eşik Fiyatı
                    </span>
                    <span className="font-title-sm text-title-sm font-bold text-on-surface price-number-pulse">
                      ₺44.000
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[12px] text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        send
                      </span>
                      Telegram &amp; SMS Bildirimi
                    </span>
                    {/* Smooth Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => setAlarmToggle(!alarmToggle)}
                      className={`w-10 h-5 rounded-full relative p-0.5 flex items-center cursor-pointer transition-colors ${
                        alarmToggle
                          ? "bg-primary-container"
                          : "bg-surface-container-highest"
                      }`}
                      id="alarm-toggle-switch"
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                          alarmToggle ? "ml-auto" : "ml-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  showToast(
                    "iPhone 15 128GB için ₺44.000 hedef fiyat alarmı hazırlandı!"
                  );
                  openAlertModal();
                }}
                className="relative z-10 w-full h-11 rounded-full bg-primary-container text-white font-label-md text-label-md shadow-md hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-space-xs active:scale-98 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add_alert
                </span>
                <span>Ücretsiz Alarm Oluştur</span>
              </button>
            </div>

            {/* BENTO 5: Güvenilirlik & Resmi Distribütör Garantisi (4 Cols) */}
            <div className="border-beam-card beam-delay-4 md:col-span-6 lg:col-span-4 bg-surface-container/85 p-space-xl flex flex-col justify-between shadow-xl transition-all duration-300 hover:bg-surface-container-high/90">
              <div className="beam-spotlight" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-space-md">
                  <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-label-sm font-semibold tracking-wide">
                    DOĞRULANMIŞ AĞ
                  </span>
                  <span className="material-symbols-outlined text-outline text-[20px]">
                    security
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-space-xs">
                  Sıfır Risk Garantisi
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Yalnızca resmi ithalat ve yetkili distribütör faturalı
                  satıcılar listelenir.
                </p>
                <div className="space-y-space-sm">
                  <div className="flex items-start gap-space-sm p-space-sm rounded bg-surface-container-lowest/80 border border-white/[0.04]">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                      verified_user
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        BTK IMEI Sorgusu
                      </span>
                      <span className="text-[12px] text-outline">
                        Tüm listelenen satıcılar Türkiye kayıtlı seri
                        numaralarıyla senkronizedir.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-sm p-space-sm rounded bg-surface-container-lowest/80 border border-white/[0.04]">
                    <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                      storefront
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        16 Yetkili Pazar Yeri
                      </span>
                      <span className="text-[12px] text-outline">
                        Apple Store, Amazon, Hepsiburada, Teknosa, MediaMarkt ve
                        diğerleri.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-space-md flex items-center justify-between text-outline text-[12px]">
                <span>
                  Güvenlik Puanı:{" "}
                  <strong className="text-on-surface">100/100</strong>
                </span>
                <span className="text-tertiary flex items-center gap-1 font-medium price-drop-pulse px-2 py-0.5 rounded-full bg-tertiary/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />{" "}
                  Aktif Doğrulama
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* POPÜLER & EN ÇOK ARANAN CİHAZLAR SHOWCASE */}
        <section className="w-full bg-surface-container-low/40 py-margin mb-margin border-y border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-gutter">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                  Canlı Trendler
                </span>
                <h2 className="font-headline-xl text-headline-xl tracking-tight text-on-surface mt-1">
                  Piyasanın En Gözde Cihazları
                </h2>
              </div>
              <div className="flex items-center gap-space-xs">
                {(["Tümü", "iOS", "Android"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTrendTab(tab)}
                    className={
                      activeTrendTab === tab
                        ? "h-9 px-space-md rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md cursor-pointer"
                        : "h-9 px-space-md rounded-full bg-transparent hover:bg-surface-container text-on-surface-variant font-label-md text-label-md transition-colors cursor-pointer"
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Device Showcase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {displayedTrends.map((card) => (
                <div
                  key={card.name}
                  className="rounded-lg bg-surface-container/90 p-space-md flex flex-col justify-between shadow-lg transition-all duration-300 hover:bg-surface-container-high border border-white/[0.05] hover:border-primary/30 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      {card.isDiscount ? (
                        <span className="px-space-xs py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-semibold price-drop-pulse">
                          {card.badge}
                        </span>
                      ) : (
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                          {card.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            `${card.name} favorilerinize eklendi! ❤️`,
                            "success"
                          )
                        }
                        className="w-8 h-8 rounded-full bg-surface-container-highest text-outline hover:text-primary flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          favorite
                        </span>
                      </button>
                    </div>
                    <Link
                      href={`/telefon/${card.slug}`}
                      className="relative w-full h-44 flex items-center justify-center mb-space-md"
                    >
                      <img
                        alt={card.alt}
                        className="h-40 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                        src={card.img}
                      />
                    </Link>
                    <div className="flex flex-col mb-space-md">
                      <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                        {card.brand}
                      </span>
                      <h3 className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                        {card.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {card.specs}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-space-xs">
                      <span className="font-price-xl text-price-xl text-on-surface">
                        {card.price}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">
                        {card.stores}
                      </span>
                    </div>
                    <Link
                      className="w-full h-10 rounded-full bg-surface-container-highest group-hover:bg-primary-container group-hover:text-white text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 transition-all"
                      href={`/telefon/${card.slug}`}
                    >
                      <span>Fiyatları İncele</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL-TO-ACTION (Minimalist Pro Finish) */}
        <section className="max-w-7xl mx-auto px-gutter mb-margin w-full">
          <div className="rounded-xl bg-gradient-to-r from-surface-container to-surface-container-high p-space-xl flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-2xl relative overflow-hidden border border-white/[0.06]">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-container/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex flex-col max-w-xl text-center lg:text-left z-10">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold mb-1">
                Cebinize Uygun Akıllı Tercih
              </span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-space-xs">
                Hangi telefonu seçeceğinizden emin değil misiniz?
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                3 adımlık akıllı cihaz asistanımızla bütçenize ve
                ihtiyaçlarınıza en uygun amiral gemisini 60 saniyede bulun.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-space-md z-10">
              <Link
                className="h-12 px-space-xl rounded-full bg-primary-container text-white font-label-md text-label-md shadow-md hover:bg-primary hover:text-on-primary transition-all flex items-center gap-space-xs active:scale-95"
                href="/telefon-rehberi"
              >
                <span>Akıllı Rehberi Başlat</span>
                <span className="material-symbols-outlined text-[18px]">
                  auto_awesome
                </span>
              </Link>
              <Link
                className="h-12 px-space-lg rounded-full bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-colors flex items-center"
                href="/telefonlar"
              >
                <span>Tüm Modelleri Keşfet</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
