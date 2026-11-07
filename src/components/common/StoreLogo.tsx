"use client";

import React from "react";

interface StoreLogoProps {
  storeSlug: string;
  storeName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function StoreLogo({
  storeSlug,
  storeName,
  className = "",
  size = "md",
}: StoreLogoProps) {
  const s = (storeSlug || storeName || "").toLowerCase();
  const name = storeName || storeSlug;

  const boxSizes = {
    sm: "w-28 h-8 px-2",
    md: "w-36 h-11 px-2.5",
    lg: "w-44 h-12 px-3",
  }[size];

  const baseContainer = `store-logo-badge inline-flex items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-sm shrink-0 overflow-hidden select-none ${boxSizes} ${className}`;

  // 1. Trendyol (Official geometric wordmark + orange shopping bag emblem)
  if (s.includes("trendyol")) {
    return (
      <div className={baseContainer} title="Trendyol">
        <svg viewBox="0 0 150 38" className="w-full h-full">
          {/* Trendyol Shopping Bag Icon */}
          <path
            d="M10 12h16l-1.5 18a2 2 0 01-2 1.8H13.5a2 2 0 01-2-1.8L10 12z"
            fill="#F27A1A"
          />
          <path
            d="M14.5 12V9.5a3.5 3.5 0 017 0V12"
            stroke="#231F20"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="18" cy="21" r="3.2" fill="#FFFFFF" />
          {/* Official lowercase trendyol wordmark */}
          <text
            x="32"
            y="26"
            fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontSize="21"
            fontWeight="800"
            letterSpacing="-0.7"
            fill="#231F20"
          >
            trendyol
          </text>
          <circle cx="139" cy="24" r="3" fill="#F27A1A" />
        </svg>
      </div>
    );
  }

  // 2. Hepsiburada (Official orange bold wordmark + signature bottom bar)
  if (s.includes("hepsiburada")) {
    return (
      <div className={baseContainer} title="Hepsiburada">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <text
            x="80"
            y="23"
            textAnchor="middle"
            fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontSize="20.5"
            fontWeight="900"
            letterSpacing="-0.8"
            fill="#FF6000"
          >
            hepsiburada
          </text>
          {/* Official Hepsiburada multi-segment accent bar */}
          <rect x="26" y="29" width="68" height="3.5" rx="1.75" fill="#FF6000" />
          <rect x="97" y="29" width="22" height="3.5" rx="1.75" fill="#7B2CBF" />
          <rect x="122" y="29" width="12" height="3.5" rx="1.75" fill="#00B4D8" />
        </svg>
      </div>
    );
  }

  // 3. Amazon Türkiye (amazon.com.tr + iconic orange smile arrow from a to z)
  if (s.includes("amazon")) {
    return (
      <div className={baseContainer} title="Amazon.com.tr">
        <svg viewBox="0 0 160 42" className="w-full h-full">
          <text
            x="14"
            y="23"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="21"
            fontWeight="900"
            letterSpacing="-0.7"
            fill="#131921"
          >
            amazon
          </text>
          <text
            x="93"
            y="23"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="13.5"
            fontWeight="800"
            letterSpacing="-0.3"
            fill="#0f172a"
          >
            .com.tr
          </text>
          {/* Official curved Amazon smile arrow from 'a' to 'z' */}
          <path
            d="M22 28.5 C 40 36.5, 68 36.5, 86 28.5"
            stroke="#FF9900"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M81 26.5 L 87.5 28 L 84 33.5"
            stroke="#FF9900"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // 4. Teknosa (Official orange badge + navy orbital ring + italic bold TEKNOSA)
  if (s.includes("teknosa")) {
    return (
      <div className={baseContainer} title="Teknosa">
        <svg viewBox="0 0 155 40" className="w-full h-full">
          <rect x="4" y="4" width="147" height="32" rx="7" fill="#FF6000" />
          {/* Orbital swoosh ring */}
          <ellipse
            cx="77"
            cy="20"
            rx="62"
            ry="12"
            transform="rotate(-6 77 20)"
            stroke="#1B2A4A"
            strokeWidth="2.4"
            fill="none"
          />
          <text
            x="77"
            y="25.5"
            textAnchor="middle"
            fontFamily="Arial Black, Inter, sans-serif"
            fontStyle="italic"
            fontSize="18.5"
            fontWeight="900"
            letterSpacing="0.5"
            fill="#FFFFFF"
          >
            TEKNOSA
          </text>
        </svg>
      </div>
    );
  }

  // 5. Vatan Bilgisayar (Official Vatan red/blue V emblem + VATAN BİLGİSAYAR)
  if (s.includes("vatan")) {
    return (
      <div className={baseContainer} title="Vatan Bilgisayar">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          {/* Vatan Red/Blue Emblem */}
          <rect x="8" y="7" width="26" height="26" rx="5" fill="#004B93" />
          <path
            d="M13 13 L21 28 L29 11"
            stroke="#E30613"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 13 L21 28 L29 11"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* VATAN */}
          <text
            x="40"
            y="22"
            fontFamily="Arial Black, Inter, sans-serif"
            fontSize="18.5"
            fontWeight="900"
            letterSpacing="0.6"
            fill="#004B93"
          >
            VATAN
          </text>
          {/* BİLGİSAYAR Red Bar */}
          <rect x="40" y="25" width="110" height="9" rx="2" fill="#E30613" />
          <text
            x="95"
            y="32"
            textAnchor="middle"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="6.8"
            fontWeight="800"
            letterSpacing="2.2"
            fill="#FFFFFF"
          >
            BİLGİSAYAR
          </text>
        </svg>
      </div>
    );
  }

  // 6. MediaMarkt (Official red box + italic MediaMarkt + white spiral swirl)
  if (s.includes("mediamarkt")) {
    return (
      <div className={baseContainer} title="MediaMarkt">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <rect x="4" y="4" width="152" height="32" rx="7" fill="#DF0000" />
          <text
            x="13"
            y="25.5"
            fontFamily="Arial Black, Inter, sans-serif"
            fontStyle="italic"
            fontSize="16.5"
            fontWeight="900"
            letterSpacing="-0.5"
            fill="#FFFFFF"
          >
            MediaMarkt
          </text>
          {/* MediaMarkt Iconic Swirl Target */}
          <circle cx="137" cy="20" r="9.5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
          <circle cx="137" cy="20" r="5.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeDasharray="22 6" />
          <circle cx="137" cy="20" r="2.2" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 7. n11 (Official Ladybug Uğur Böceği emblem + n11.com)
  if (s.includes("n11")) {
    return (
      <div className={baseContainer} title="n11.com">
        <svg viewBox="0 0 150 40" className="w-full h-full">
          {/* Ladybug / Uğur Böceği body */}
          <circle cx="34" cy="22" r="11" fill="#E52521" />
          <path d="M25 16 Q34 22 43 16" stroke="#1F2937" strokeWidth="1.8" fill="none" />
          <line x1="34" y1="16" x2="34" y2="33" stroke="#1F2937" strokeWidth="1.6" />
          {/* Ladybug spots */}
          <circle cx="29.5" cy="22" r="1.8" fill="#1F2937" />
          <circle cx="38.5" cy="22" r="1.8" fill="#1F2937" />
          <circle cx="31" cy="27.5" r="1.5" fill="#1F2937" />
          <circle cx="37" cy="27.5" r="1.5" fill="#1F2937" />
          {/* Antennae */}
          <path d="M31 11 L28 7 M37 11 L40 7" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="28" cy="7" r="1.3" fill="#1F2937" />
          <circle cx="40" cy="7" r="1.3" fill="#1F2937" />
          {/* n11 wordmark */}
          <text
            x="50"
            y="29"
            fontFamily="Inter, Arial Black, sans-serif"
            fontSize="25"
            fontWeight="900"
            letterSpacing="-1"
            fill="#5C2D91"
          >
            n11
          </text>
          <text
            x="96"
            y="28"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="12"
            fontWeight="800"
            fill="#64748B"
          >
            .com
          </text>
        </svg>
      </div>
    );
  }

  // 8. PttAVM (Official PTT yellow/navy emblem + PttAVM.com)
  if (s.includes("ptt")) {
    return (
      <div className={baseContainer} title="PttAVM.com">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          {/* PTT Winged Horn Emblem */}
          <rect x="8" y="8" width="28" height="24" rx="5" fill="#FED100" />
          <path
            d="M12 20 L22 13 L20 19 L31 15 L22 26 L23 20 Z"
            fill="#003366"
          />
          {/* Ptt in Navy */}
          <text
            x="41"
            y="26.5"
            fontFamily="Inter, Arial Black, sans-serif"
            fontSize="20"
            fontWeight="900"
            letterSpacing="-0.5"
            fill="#003366"
          >
            Ptt
          </text>
          {/* AVM in Magenta/Red */}
          <text
            x="72"
            y="26.5"
            fontFamily="Inter, Arial Black, sans-serif"
            fontSize="20"
            fontWeight="900"
            letterSpacing="-0.5"
            fill="#E30613"
          >
            AVM
          </text>
          <text
            x="119"
            y="26"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="11.5"
            fontWeight="700"
            fill="#64748B"
          >
            .com
          </text>
        </svg>
      </div>
    );
  }

  // 9. Pazarama (İş Bankası Pazarama pink/blue bag emblem + pazarama)
  if (s.includes("pazarama")) {
    return (
      <div className={baseContainer} title="Pazarama">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          {/* Pazarama Pink & Blue Bag Icon */}
          <rect x="10" y="10" width="21" height="21" rx="6" fill="#FF007A" />
          <path
            d="M15 17 C15 13, 26 13, 26 17"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="17.5" cy="22.5" r="2" fill="#00D2FF" />
          <circle cx="23.5" cy="22.5" r="2" fill="#FFFFFF" />
          {/* pazarama wordmark */}
          <text
            x="36"
            y="26"
            fontFamily="Inter, -apple-system, sans-serif"
            fontSize="20"
            fontWeight="900"
            letterSpacing="-0.6"
            fill="#0038A8"
          >
            pazarama
          </text>
        </svg>
      </div>
    );
  }

  // 10. Turkcell Pasaj (Official yellow antenna mascot circle + Turkcell Pasaj)
  if (s.includes("pasaj") || s.includes("turkcell")) {
    return (
      <div className={baseContainer} title="Turkcell Pasaj">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          {/* Turkcell Yellow Circle & Antennae */}
          <circle cx="21" cy="20" r="12" fill="#FFC900" />
          <path
            d="M16 11 Q13 5 9 7 M25 11 Q28 5 32 7"
            stroke="#0033A0"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="9" cy="7" r="1.8" fill="#0033A0" />
          <circle cx="32" cy="7" r="1.8" fill="#0033A0" />
          <circle cx="17.5" cy="19" r="2" fill="#0033A0" />
          <circle cx="24.5" cy="19" r="2" fill="#0033A0" />
          <path d="M17 24 Q21 27 25 24" stroke="#0033A0" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Turkcell Pasaj Text */}
          <text
            x="38"
            y="18.5"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="12"
            fontWeight="900"
            letterSpacing="0.2"
            fill="#0033A0"
          >
            TURKCELL
          </text>
          <rect x="38" y="21" width="64" height="12" rx="3" fill="#0033A0" />
          <text
            x="70"
            y="30"
            textAnchor="middle"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="9.5"
            fontWeight="900"
            letterSpacing="1.5"
            fill="#FFC900"
          >
            PASAJ
          </text>
        </svg>
      </div>
    );
  }

  // 11. ÇiçekSepeti (Colorful daisy flower icon + ÇiçekSepeti wordmark)
  if (s.includes("cicek") || s.includes("ciceksepeti")) {
    return (
      <div className={baseContainer} title="ÇiçekSepeti">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          {/* Colorful Flower Petals */}
          <circle cx="21" cy="13" r="4" fill="#FF595E" />
          <circle cx="27" cy="16.5" r="4" fill="#FFCA3A" />
          <circle cx="27" cy="23.5" r="4" fill="#8AC926" />
          <circle cx="21" cy="27" r="4" fill="#1982C4" />
          <circle cx="15" cy="23.5" r="4" fill="#6A4C93" />
          <circle cx="15" cy="16.5" r="4" fill="#FF924C" />
          <circle cx="21" cy="20" r="3.8" fill="#FFFFFF" />
          <circle cx="21" cy="20" r="2.2" fill="#FFCA3A" />
          {/* ÇiçekSepeti text */}
          <text
            x="36"
            y="25"
            fontFamily="Inter, -apple-system, sans-serif"
            fontSize="17.5"
            fontWeight="800"
            letterSpacing="-0.5"
            fill="#0057B8"
          >
            ÇiçekSepeti
          </text>
        </svg>
      </div>
    );
  }

  // 12. Vodafone Yanımda (Official Red Speech-Mark Circle + vodafone)
  if (s.includes("vodafone")) {
    return (
      <div className={baseContainer} title="Vodafone Yanımda">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          {/* Vodafone Red Circle & Speech Mark */}
          <circle cx="22" cy="20" r="12" fill="#E60000" />
          <path
            d="M23.5 11.5 C18 12.5, 15.5 17.5, 16.5 22.5 C17.5 26, 21 27.5, 24 26 C26.5 24.5, 27 21, 24.5 19 C22.5 17.5, 20 18.5, 20.5 16 C21 14, 23 13, 25 13 Z"
            fill="#FFFFFF"
          />
          <text
            x="39"
            y="25.5"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="20"
            fontWeight="800"
            letterSpacing="-0.6"
            fill="#E60000"
          >
            vodafone
          </text>
        </svg>
      </div>
    );
  }

  // 13. Türk Telekom (Official Geometric Ribbon Wings + Türk Telekom)
  if (s.includes("telekom")) {
    return (
      <div className={baseContainer} title="Türk Telekom">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          {/* Geometric T Wings */}
          <polygon points="10,12 22,8 18,20" fill="#E30613" />
          <polygon points="22,8 32,14 20,22" fill="#00A8E8" />
          <polygon points="18,20 28,24 19,33" fill="#002855" />
          <text
            x="37"
            y="19"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="13.5"
            fontWeight="900"
            fill="#002855"
          >
            Türk
          </text>
          <text
            x="37"
            y="31"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="13.5"
            fontWeight="800"
            fill="#00A8E8"
          >
            Telekom
          </text>
        </svg>
      </div>
    );
  }

  // 14. İtopya (Official Tech Gaming Typography + Orange Triangle Icon)
  if (s.includes("itopya")) {
    return (
      <div className={baseContainer} title="İtopya.com">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <rect x="4" y="4" width="152" height="32" rx="7" fill="#111827" />
          <polygon points="15,12 27,20 15,28" fill="#FF6600" />
          <text
            x="33"
            y="26"
            fontFamily="Inter, Arial Black, sans-serif"
            fontSize="19"
            fontWeight="900"
            letterSpacing="1"
            fill="#FFFFFF"
          >
            ITOPYA
          </text>
          <text
            x="114"
            y="26"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="11"
            fontWeight="800"
            fill="#FF6600"
          >
            .COM
          </text>
        </svg>
      </div>
    );
  }

  // 15. Sinerji Bilgisayar (Hexagon S Tech Cube + SİNERJİ)
  if (s.includes("sinerji")) {
    return (
      <div className={baseContainer} title="Sinerji Bilgisayar">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <polygon points="21,8 31,14 31,26 21,32 11,26 11,14" fill="#0066CC" />
          <path
            d="M25 15 H18 L17 19 H24 L23 25 H16"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="38"
            y="22"
            fontFamily="Inter, Arial Black, sans-serif"
            fontSize="17"
            fontWeight="900"
            letterSpacing="0.5"
            fill="#003875"
          >
            SİNERJİ
          </text>
          <text
            x="38"
            y="31.5"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="7.5"
            fontWeight="800"
            letterSpacing="2"
            fill="#00A8E8"
          >
            BİLGİSAYAR
          </text>
        </svg>
      </div>
    );
  }

  // 16. İncehesap (Blue/Orange Check Tag + incehesap.com)
  if (s.includes("incehesap")) {
    return (
      <div className={baseContainer} title="İncehesap.com">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <rect x="8" y="10" width="20" height="20" rx="5" fill="#0055A5" />
          <path d="M12 20 L16 24 L24 15" stroke="#FF6600" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <text
            x="33"
            y="25"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="17.5"
            fontWeight="900"
            letterSpacing="-0.5"
            fill="#0055A5"
          >
            incehesap
          </text>
          <text
            x="119"
            y="25"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="10.5"
            fontWeight="800"
            fill="#FF6600"
          >
            .com
          </text>
        </svg>
      </div>
    );
  }

  // 17. Sahibinden.com (Iconic Yellow Square [s] + sahibinden.com)
  if (s.includes("sahibinden")) {
    return (
      <div className={baseContainer} title="sahibinden.com">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <rect x="8" y="8" width="24" height="24" rx="4" fill="#FFE800" stroke="#111827" strokeWidth="1.2" />
          <text x="20" y="26" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="19" fontWeight="900" fill="#111827">
            s
          </text>
          <text
            x="37"
            y="25"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="16"
            fontWeight="900"
            letterSpacing="-0.4"
            fill="#111827"
          >
            sahibinden
          </text>
          <text x="126" y="25" fontFamily="Inter, Arial, sans-serif" fontSize="10" fontWeight="700" fill="#64748B">
            .com
          </text>
        </svg>
      </div>
    );
  }

  // 18. Apple Store
  if (s.includes("apple")) {
    return (
      <div className={baseContainer} title="Apple Store Türkiye">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <path
            d="M25.5 20.2c0-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-2-.2-3.9 1.2-4.9 1.2-1 0-2.5-1.2-4.2-1.1-2.1 0-4.1 1.3-5.2 3.2-2.2 3.9-.6 9.6 1.6 12.8 1.1 1.5 2.3 3.2 4 3.2 1.6-.1 2.2-1 4.1-1 1.9 0 2.5 1 4.2 1 1.7 0 2.8-1.5 3.9-3.1 1.2-1.8 1.7-3.5 1.7-3.6-.1-.1-3.3-1.3-3.3-5.3zM22.3 10.8c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.9.9-3.8 2-.8.9-1.5 2.5-1.3 3.9 1.5.1 2.9-.7 3.8-1.8z"
            fill="#111827"
          />
          <text x="38" y="25" fontFamily="Inter, -apple-system, sans-serif" fontSize="16.5" fontWeight="800" fill="#111827">
            Apple Store
          </text>
        </svg>
      </div>
    );
  }

  // 19. Samsung Store
  if (s.includes("samsung")) {
    return (
      <div className={baseContainer} title="Samsung Online Mağaza">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <ellipse cx="80" cy="20" rx="68" ry="14" fill="#1428A0" />
          <text
            x="80"
            y="25"
            textAnchor="middle"
            fontFamily="Arial Black, Inter, sans-serif"
            fontSize="15"
            fontWeight="900"
            letterSpacing="2"
            fill="#FFFFFF"
          >
            SAMSUNG
          </text>
        </svg>
      </div>
    );
  }

  // 20. Xiaomi Mi Store
  if (s.includes("mistore") || s.includes("xiaomi")) {
    return (
      <div className={baseContainer} title="Xiaomi Mi Store">
        <svg viewBox="0 0 160 40" className="w-full h-full">
          <rect x="10" y="8" width="24" height="24" rx="7" fill="#FF6900" />
          <text x="22" y="25" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="14" fontWeight="900" fill="#FFFFFF">
            mi
          </text>
          <text x="42" y="25" fontFamily="Inter, Arial, sans-serif" fontSize="16" fontWeight="800" fill="#111827">
            Xiaomi TR
          </text>
        </svg>
      </div>
    );
  }

  // 21. Official Store / Resmi Distribütör Fallback
  return (
    <div className={baseContainer} title={name}>
      <svg viewBox="0 0 160 40" className="w-full h-full">
        <path
          d="M20 8 L30 12 V20 C30 26.5 25.5 31 20 33 C14.5 31 10 26.5 10 20 V12 L20 8 Z"
          fill="#0284C7"
        />
        <path d="M16 20 L19 23 L25 17" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <text
          x="36"
          y="24.5"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="14.5"
          fontWeight="800"
          fill="#0F172A"
        >
          {name.length > 14 ? name.slice(0, 13) + "." : name}
        </text>
      </svg>
    </div>
  );
}
