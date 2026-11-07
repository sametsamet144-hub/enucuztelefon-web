"use client";

import React from "react";

/**
 * 8 Custom 3D-Style Kawaii Emote & Visual Illustrations for the Home Page Portal Cards.
 * Each SVG fills the center visual stage with glowing aura rings, floating graphic elements,
 * and an expressive mascot emote.
 */

export function CatalogExplorerEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="catGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="catBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="catVisor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Ambient Glow & Orbit Rings */}
      <circle cx="110" cy="60" r="54" fill="url(#catGlow)" />
      <ellipse cx="110" cy="62" rx="78" ry="26" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.45" />

      {/* Floating Left Graphic Card (Filter Sliders) */}
      <g transform="translate(14, 26) rotate(-8)">
        <rect width="42" height="32" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="8" y1="10" x2="34" y2="10" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="10" r="3" fill="#fde047" />
        <line x1="8" y1="21" x2="34" y2="21" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="21" r="3" fill="#38bdf8" />
      </g>

      {/* Floating Right Graphic Badge (Store Bag & Star) */}
      <g transform="translate(162, 22) rotate(10)">
        <rect width="42" height="34" rx="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
        <path d="M15 14 V11 A6 6 0 0 1 27 11 V14" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
        <rect x="11" y="14" width="20" height="14" rx="3" fill="#f59e0b" />
        <text x="21" y="24" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">16</text>
      </g>

      {/* Main 3D Kawaii Emote Sphere */}
      <circle cx="110" cy="62" r="36" fill="url(#catBody)" stroke="#e0f2fe" strokeWidth="2" />
      {/* Glossy Top Highlight */}
      <ellipse cx="98" cy="38" rx="16" ry="7" transform="rotate(-18 98 38)" fill="#ffffff" opacity="0.45" />

      {/* Cute Explorer Visor Hat */}
      <path d="M78 44 Q110 26 142 44 L136 34 Q110 20 84 34 Z" fill="url(#catVisor)" stroke="#fef08a" strokeWidth="1.2" />

      {/* Expressive Happy Eyes */}
      <circle cx="96" cy="58" r="5" fill="#0f172a" />
      <circle cx="94.5" cy="56" r="2" fill="#ffffff" />
      <circle cx="124" cy="58" r="5" fill="#0f172a" />
      <circle cx="122.5" cy="56" r="2" fill="#ffffff" />

      {/* Rosy Cheeks */}
      <ellipse cx="86" cy="65" rx="5.5" ry="3" fill="#fb7185" opacity="0.7" />
      <ellipse cx="134" cy="65" rx="5.5" ry="3" fill="#fb7185" opacity="0.7" />

      {/* Big Cheerful Smile */}
      <path d="M100 66 Q110 77 120 66" fill="#be123c" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      <path d="M104 70 Q110 75 116 70" fill="#fb7185" />

      {/* Glowing Magnifying Glass Held by Emote */}
      <g transform="translate(128, 60) rotate(18)">
        <circle cx="12" cy="12" r="11" fill="#e0f2fe" fillOpacity="0.3" stroke="#fde047" strokeWidth="3" />
        <line x1="20" y1="20" x2="29" y2="29" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Sparkles */}
      <path d="M68 24 L70 30 L76 32 L70 34 L68 40 L66 34 L60 32 L66 30 Z" fill="#fde047" />
      <path d="M150 78 L151.5 82 L155.5 83.5 L151.5 85 L150 89 L148.5 85 L144.5 83.5 L148.5 82 Z" fill="#38bdf8" />
    </svg>
  );
}

export function PriceDropFireEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fireBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="45%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="flameCrown" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="60" r="54" fill="url(#fireGlow)" />

      {/* Left Floating Discount Tag */}
      <g transform="translate(12, 28) rotate(-12)">
        <rect width="46" height="28" rx="8" fill="#e11d48" stroke="#fecdd3" strokeWidth="1.5" />
        <text x="23" y="18" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">-%15</text>
      </g>

      {/* Right Floating Downward Trend Arrow Badge */}
      <g transform="translate(160, 26) rotate(10)">
        <rect width="44" height="30" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
        <path d="M10 10 L20 20 L26 14 L35 23" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="36,24 30,24 36,18" fill="#34d399" />
      </g>

      {/* Flame Hair/Aura on Top of Emote */}
      <path d="M85 36 Q92 10 104 26 Q112 4 122 25 Q134 12 135 36 Z" fill="url(#flameCrown)" />

      {/* Main 3D Emote Body */}
      <circle cx="110" cy="64" r="35" fill="url(#fireBody)" stroke="#ffe4e6" strokeWidth="2" />
      <ellipse cx="97" cy="42" rx="15" ry="6" transform="rotate(-18 97 42)" fill="#ffffff" opacity="0.4" />

      {/* Star-Struck Excited Eyes (🤩) */}
      <polygon points="95,49 97,55 103,55 98,59 100,65 95,61 90,65 92,59 87,55 93,55" fill="#fde047" stroke="#0f172a" strokeWidth="1" />
      <polygon points="125,49 127,55 133,55 128,59 130,65 125,61 120,65 122,59 117,55 123,55" fill="#fde047" stroke="#0f172a" strokeWidth="1" />

      {/* Cheeks & Excited Open Smile */}
      <ellipse cx="84" cy="68" rx="5" ry="3" fill="#fde047" opacity="0.6" />
      <ellipse cx="136" cy="68" rx="5" ry="3" fill="#fde047" opacity="0.6" />
      <path d="M98 70 Q110 86 122 70 Z" fill="#881337" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M103 76 Q110 82 117 76" fill="#fb7185" />

      {/* Floating Golden TL Coins */}
      <circle cx="58" cy="78" r="10" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
      <text x="58" y="82" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="900">₺</text>
      <circle cx="162" cy="76" r="10" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
      <text x="162" y="80" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="900">₺</text>
    </svg>
  );
}

export function BudgetKingEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="emeraldBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="60" r="54" fill="url(#emeraldGlow)" />

      {/* Left Winged Coin */}
      <g transform="translate(18, 42) rotate(-10)">
        <path d="M0 12 Q-10 2 4 4 Q-4 -4 10 4" fill="#e2e8f0" />
        <circle cx="18" cy="12" r="12" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.5" />
        <text x="18" y="16" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="900">₺</text>
      </g>

      {/* Right F/P Trophy Badge */}
      <g transform="translate(160, 28) rotate(8)">
        <rect width="46" height="28" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
        <text x="23" y="18" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="900">F/P #1</text>
      </g>

      {/* Golden Royal Crown on Top */}
      <polygon points="88,34 94,14 105,25 110,10 115,25 126,14 132,34" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.5" />
      <circle cx="110" cy="10" r="3" fill="#34d399" />
      <circle cx="94" cy="14" r="2.5" fill="#fb7185" />
      <circle cx="126" cy="14" r="2.5" fill="#38bdf8" />

      {/* Main 3D Emerald Mascot */}
      <circle cx="110" cy="65" r="35" fill="url(#emeraldBody)" stroke="#d1fae5" strokeWidth="2" />
      <ellipse cx="97" cy="43" rx="15" ry="6" transform="rotate(-18 97 43)" fill="#ffffff" opacity="0.4" />

      {/* Winking Eye + Happy Eye */}
      <path d="M90 58 Q96 51 102 58" fill="none" stroke="#064e3b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="124" cy="58" r="5" fill="#064e3b" />
      <circle cx="122.5" cy="56" r="2" fill="#ffffff" />

      {/* Rosy Cheeks & Cute Smile */}
      <ellipse cx="85" cy="66" rx="5.5" ry="3" fill="#fb7185" opacity="0.65" />
      <ellipse cx="135" cy="66" rx="5.5" ry="3" fill="#fb7185" opacity="0.65" />
      <path d="M99 68 Q110 79 121 68" fill="none" stroke="#064e3b" strokeWidth="3" strokeLinecap="round" />

      {/* Mini Gold Tag at Bottom Right */}
      <g transform="translate(132, 74) rotate(-8)">
        <rect width="38" height="20" rx="6" fill="url(#goldGrad)" stroke="#fff" strokeWidth="1.2" />
        <text x="19" y="14" textAnchor="middle" fill="#451a03" fontSize="9" fontWeight="900">UCUZ</text>
      </g>
    </svg>
  );
}

export function VsBattleEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="vsGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="leftFighter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="rightFighter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="60" r="56" fill="url(#vsGlow)" />

      {/* Left Cute Contender Emote (Blue) */}
      <g transform="translate(56, 62)">
        <circle cx="0" cy="0" r="28" fill="url(#leftFighter)" stroke="#bae6fd" strokeWidth="2" />
        <ellipse cx="-8" cy="-16" rx="10" ry="4" transform="rotate(-18 -8 -16)" fill="#ffffff" opacity="0.4" />
        {/* Determined Cute Eyes */}
        <path d="M-12 -8 L-2 -4" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="-7" cy="-2" r="3.5" fill="#0f172a" />
        <circle cx="-8" cy="-3.5" r="1.5" fill="#fff" />
        <path d="M12 -4 L2 -8" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="7" cy="-2" r="3.5" fill="#0f172a" />
        <circle cx="6" cy="-3.5" r="1.5" fill="#fff" />
        {/* Confident Grin */}
        <path d="M-8 10 Q0 16 9 8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Right Cute Contender Emote (Purple) */}
      <g transform="translate(164, 62)">
        <circle cx="0" cy="0" r="28" fill="url(#rightFighter)" stroke="#e9d5ff" strokeWidth="2" />
        <ellipse cx="-8" cy="-16" rx="10" ry="4" transform="rotate(-18 -8 -16)" fill="#ffffff" opacity="0.4" />
        {/* Playful Cool Eyes */}
        <circle cx="-7" cy="-2" r="3.5" fill="#0f172a" />
        <circle cx="-8" cy="-3.5" r="1.5" fill="#fff" />
        <circle cx="7" cy="-2" r="3.5" fill="#0f172a" />
        <circle cx="6" cy="-3.5" r="1.5" fill="#fff" />
        <ellipse cx="-14" cy="4" rx="4" ry="2" fill="#fb7185" opacity="0.6" />
        <ellipse cx="14" cy="4" rx="4" ry="2" fill="#fb7185" opacity="0.6" />
        {/* Smirk */}
        <path d="M-9 8 Q0 16 8 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Center Electric Lightning & VS Emblem */}
      <polygon points="114,10 98,54 112,54 104,108 126,58 111,58" fill="url(#boltGrad)" opacity="0.9" />
      <circle cx="110" cy="60" r="20" fill="#1e1b4b" stroke="#fde047" strokeWidth="2.5" />
      <text x="110" y="66" textAnchor="middle" fill="#fef08a" fontSize="16" fontWeight="900">VS</text>
    </svg>
  );
}

export function BrandsStarEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="starMascot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="45%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
        <linearGradient id="shadesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="60" r="54" fill="url(#purpleGlow)" />

      {/* Orbiting Brand Mini Pills */}
      <g transform="translate(10, 24) rotate(-8)">
        <rect width="46" height="22" rx="11" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
        <text x="23" y="14" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontWeight="900">APPLE</text>
      </g>
      <g transform="translate(158, 22) rotate(8)">
        <rect width="52" height="22" rx="11" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="26" y="14" textAnchor="middle" fill="#bae6fd" fontSize="8" fontWeight="900">SAMSUNG</text>
      </g>
      <g transform="translate(14, 76) rotate(6)">
        <rect width="46" height="22" rx="11" fill="#1e1b4b" stroke="#fb923c" strokeWidth="1.5" />
        <text x="23" y="14" textAnchor="middle" fill="#fed7aa" fontSize="8" fontWeight="900">XIAOMI</text>
      </g>
      <g transform="translate(160, 76) rotate(-6)">
        <rect width="48" height="22" rx="11" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="24" y="14" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="900">+27 DAHA</text>
      </g>

      {/* Main VIP Mascot Sphere */}
      <circle cx="110" cy="62" r="35" fill="url(#starMascot)" stroke="#f3e8ff" strokeWidth="2" />
      <ellipse cx="97" cy="40" rx="15" ry="6" transform="rotate(-18 97 40)" fill="#ffffff" opacity="0.4" />

      {/* Cool VIP Sunglasses (😎) */}
      <path d="M76 52 L144 52" stroke="#fde047" strokeWidth="2.5" />
      <rect x="82" y="48" width="24" height="14" rx="4" fill="url(#shadesGrad)" stroke="#fde047" strokeWidth="1.5" />
      <rect x="114" y="48" width="24" height="14" rx="4" fill="url(#shadesGrad)" stroke="#fde047" strokeWidth="1.5" />
      <line x1="86" y1="59" x2="94" y2="50" stroke="#ffffff" strokeWidth="1.8" opacity="0.7" />
      <line x1="118" y1="59" x2="126" y2="50" stroke="#ffffff" strokeWidth="1.8" opacity="0.7" />

      {/* Confident VIP Smile */}
      <path d="M98 71 Q110 80 122 70" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />

      {/* Golden Star Badge */}
      <polygon points="110,12 114,22 124,22 116,28 119,38 110,32 101,38 104,28 96,22 106,22" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.2" />
    </svg>
  );
}

export function PriceRadarBellEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bellBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Radar Concentric Rings */}
      <circle cx="110" cy="60" r="54" fill="url(#amberGlow)" />
      <circle cx="110" cy="60" r="46" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.5" />
      <circle cx="110" cy="60" r="62" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.25" />

      {/* Sound / Alert Waves Left & Right */}
      <path d="M58 42 Q46 60 58 78" fill="none" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 34 Q32 60 48 86" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
      <path d="M162 42 Q174 60 162 78" fill="none" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
      <path d="M172 34 Q188 60 172 86" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />

      {/* Cute 3D Bell Mascot */}
      <circle cx="110" cy="20" r="7" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
      <path
        d="M110 24 C86 24 78 46 78 72 L68 84 L152 84 L142 72 C142 46 134 24 110 24 Z"
        fill="url(#bellBody)"
        stroke="#fef08a"
        strokeWidth="2"
      />
      <circle cx="110" cy="90" r="9" fill="#b45309" stroke="#fde047" strokeWidth="1.5" />

      {/* Glossy Highlight on Bell */}
      <path d="M90 38 Q84 54 84 68" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.55" />

      {/* Cute Bell Face */}
      <circle cx="97" cy="56" r="4.5" fill="#451a03" />
      <circle cx="95.5" cy="54.5" r="1.8" fill="#ffffff" />
      <circle cx="123" cy="56" r="4.5" fill="#451a03" />
      <circle cx="121.5" cy="54.5" r="1.8" fill="#ffffff" />
      <ellipse cx="88" cy="63" rx="5" ry="2.8" fill="#f43f5e" opacity="0.6" />
      <ellipse cx="132" cy="63" rx="5" ry="2.8" fill="#f43f5e" opacity="0.6" />
      <path d="M101 64 Q110 73 119 64" fill="none" stroke="#451a03" strokeWidth="2.8" strokeLinecap="round" />

      {/* Floating Notification Badge */}
      <g transform="translate(132, 16) rotate(12)">
        <rect width="46" height="22" rx="11" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
        <text x="23" y="14" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="900">ALARM!</text>
      </g>
    </svg>
  );
}

export function GuideScholarEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scholarBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="60" r="54" fill="url(#cyanGlow)" />

      {/* Floating Score Badge Left */}
      <g transform="translate(14, 28) rotate(-8)">
        <rect width="46" height="26" rx="8" fill="#083344" stroke="#22d3ee" strokeWidth="1.5" />
        <text x="23" y="17" textAnchor="middle" fill="#67e8f9" fontSize="9" fontWeight="900">10 / 10</text>
      </g>

      {/* Floating Trophy/Test Badge Right */}
      <g transform="translate(158, 28) rotate(8)">
        <rect width="48" height="26" rx="8" fill="#083344" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="24" y="17" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="900">★ TEST</text>
      </g>

      {/* Main Scholar Mascot */}
      <circle cx="110" cy="64" r="34" fill="url(#scholarBody)" stroke="#cffafe" strokeWidth="2" />

      {/* Graduation / Expert Cap */}
      <polygon points="110,14 70,30 110,42 150,30" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="90" y="34" width="40" height="8" rx="3" fill="#0f172a" />
      <path d="M142 32 L148 50" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="148" cy="52" r="3.5" fill="#fbbf24" />

      {/* Cute Smart Glasses (🤓) */}
      <circle cx="96" cy="58" r="11" fill="#ffffff" fillOpacity="0.2" stroke="#fde047" strokeWidth="2.5" />
      <circle cx="124" cy="58" r="11" fill="#ffffff" fillOpacity="0.2" stroke="#fde047" strokeWidth="2.5" />
      <line x1="107" y1="58" x2="113" y2="58" stroke="#fde047" strokeWidth="2.5" />
      <circle cx="96" cy="58" r="4" fill="#0f172a" />
      <circle cx="94.5" cy="56.5" r="1.6" fill="#fff" />
      <circle cx="124" cy="58" r="4" fill="#0f172a" />
      <circle cx="122.5" cy="56.5" r="1.6" fill="#fff" />

      {/* Happy Smile */}
      <path d="M101 73 Q110 81 119 73" fill="none" stroke="#083344" strokeWidth="2.8" strokeLinecap="round" />

      {/* Open Glowing Book at Bottom */}
      <path d="M82 96 Q110 88 110 98 Q110 88 138 96 L138 106 Q110 98 110 108 Q110 98 82 106 Z" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
    </svg>
  );
}

export function BtkShieldEmote() {
  return (
    <svg viewBox="0 0 220 120" className="w-32 h-16 sm:w-36 sm:h-[72px] mx-auto overflow-visible drop-shadow-md">
      <defs>
        <radialGradient id="tealGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shieldBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>
      </defs>

      <circle cx="110" cy="60" r="54" fill="url(#tealGlow)" />

      {/* Left IMEI Pill */}
      <g transform="translate(12, 28) rotate(-8)">
        <rect width="48" height="24" rx="8" fill="#042f2e" stroke="#2dd4bf" strokeWidth="1.5" />
        <text x="24" y="15" textAnchor="middle" fill="#99f6e4" fontSize="8" fontWeight="900">IMEI OK</text>
      </g>

      {/* Right BTK Check Pill */}
      <g transform="translate(160, 28) rotate(8)">
        <rect width="48" height="24" rx="8" fill="#042f2e" stroke="#34d399" strokeWidth="1.5" />
        <text x="24" y="15" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="900">24 AY ✓</text>
      </g>

      {/* Cute 3D Guardian Shield Mascot */}
      <path
        d="M110 16 L148 30 V58 C148 84 110 102 110 102 C110 102 72 84 72 58 V30 L110 16 Z"
        fill="url(#shieldBody)"
        stroke="#ccfbf1"
        strokeWidth="2.5"
      />
      {/* Shield Inner Highlight */}
      <path
        d="M110 23 L140 34 V56 C140 77 110 93 110 93"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.35"
      />

      {/* Cute Guardian Face */}
      <circle cx="96" cy="54" r="4.5" fill="#042f2e" />
      <circle cx="94.5" cy="52.5" r="1.8" fill="#ffffff" />
      <circle cx="124" cy="54" r="4.5" fill="#042f2e" />
      <circle cx="122.5" cy="52.5" r="1.8" fill="#ffffff" />
      <ellipse cx="86" cy="61" rx="5" ry="2.8" fill="#fb7185" opacity="0.65" />
      <ellipse cx="134" cy="61" rx="5" ry="2.8" fill="#fb7185" opacity="0.65" />
      <path d="M100 62 Q110 72 120 62" fill="none" stroke="#042f2e" strokeWidth="2.8" strokeLinecap="round" />

      {/* Glowing Checkmark Badge on Forehead */}
      <circle cx="110" cy="34" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M105 34 L108.5 37.5 L115.5 30.5" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
