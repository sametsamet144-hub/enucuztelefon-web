"use client";

import React from "react";

interface BrandLogoProps {
  slug: string;
  name?: string;
  className?: string;
  size?: number;
}

export default function BrandLogo({ slug, name, className = "", size = 32 }: BrandLogoProps) {
  const s = slug.toLowerCase();

  if (s.includes("apple")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 170 170"
        fill="currentColor"
        className={className}
        aria-label="Apple"
      >
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.85-11.96-14.43-5.77-8.91-10.33-19.14-13.68-30.7-3.36-11.55-5.04-22.37-5.04-32.46 0-14.56 3.68-26.68 11.05-36.35 7.37-9.67 16.73-14.61 28.08-14.81 4.9 0 10.33 1.25 16.29 3.75 5.96 2.5 9.87 3.86 11.73 4.09 1.63-.33 5.76-1.8 12.4-4.42 6.63-2.61 12.29-3.77 16.97-3.47 13.06.66 23.51 5.48 31.36 14.47-11.43 6.87-17.04 16.44-16.83 28.71.22 9.68 3.96 17.74 11.22 24.19 7.27 6.45 15.89 10.15 25.86 11.1-2.18 6.53-4.8 13.12-7.86 19.78-3.06 6.66-6.15 12.7-9.27 18.12zm-30.85-112.5c0 6.64-2.45 13.06-7.35 18.26-4.9 5.2-10.74 8.54-17.52 10.02-.22-1.32-.33-2.52-.33-3.6 0-6.64 2.58-13.2 7.74-18.49 5.16-5.28 11.25-8.54 18.27-9.78.11 1.2.19 2.4.19 3.59z" />
      </svg>
    );
  }

  if (s.includes("samsung")) {
    return (
      <svg
        width={size * 2}
        height={size}
        viewBox="0 0 200 60"
        fill="currentColor"
        className={className}
        aria-label="Samsung"
      >
        <text
          x="100"
          y="42"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="36"
          fontWeight="900"
          letterSpacing="4"
          textAnchor="middle"
        >
          SAMSUNG
        </text>
      </svg>
    );
  }

  if (s.includes("xiaomi") || s.includes("redmi")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        aria-label="Xiaomi"
      >
        <rect width="100" height="100" rx="28" fill="#FF6900" />
        <path
          d="M26 31h13v24c0 3.3 2.7 6 6 6s6-2.7 6-6V31h13v24c0 10.5-8.5 19-19 19s-19-8.5-19-19V31zm38 0h13v43H64V31z"
          fill="#FFF"
        />
        <rect x="44" y="44" width="8" height="15" fill="#FFF" />
      </svg>
    );
  }

  if (s.includes("honor")) {
    return (
      <svg
        width={size * 1.8}
        height={size}
        viewBox="0 0 160 50"
        fill="currentColor"
        className={className}
        aria-label="Honor"
      >
        <text
          x="80"
          y="36"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="32"
          fontWeight="800"
          letterSpacing="5"
          textAnchor="middle"
        >
          HONOR
        </text>
      </svg>
    );
  }

  if (s.includes("poco")) {
    return (
      <div
        className={`bg-amber-400 text-black font-black px-2.5 py-1 rounded-lg text-sm tracking-widest inline-flex items-center justify-center ${className}`}
        style={{ minWidth: size * 1.8, height: size }}
      >
        POCO
      </div>
    );
  }

  if (s.includes("oneplus")) {
    return (
      <svg
        width={size * 1.2}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        aria-label="OnePlus"
      >
        <rect width="90" height="90" rx="16" fill="#F5010C" />
        <text
          x="45"
          y="65"
          fill="#FFF"
          fontSize="56"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          1
        </text>
        <path d="M72 26v16h-4V26h-8v-4h8v-8h4v8h8v4h-8z" fill="#FFF" />
      </svg>
    );
  }

  if (s.includes("huawei")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        aria-label="Huawei"
      >
        <g fill="#CE0E2D">
          <path d="M50 15c-2 6-2 15 0 21 2-6 2-15 0-21z" />
          <path d="M38 18c-4 5-7 13-6 19 6-2 12-7 15-12-3-4-6-7-9-7z" />
          <path d="M62 18c3 4 6 7 9 7-3 5-9 10-15 12-1-6 2-14 6-19z" />
          <path d="M28 26c-5 4-10 11-10 17 6 0 13-3 18-7-3-4-6-8-8-10z" />
          <path d="M72 26c2 2 5 6 8 10 5 4 12 7 18 7 0-6-5-13-10-17-5-3-11-2-16 0z" />
          <path d="M22 38c-6 3-12 8-14 14 6 2 13 0 19-3-2-5-4-9-5-11z" />
          <path d="M78 38c-1 2-3 6-5 11 6 3 13 5 19 3-2-6-8-11-14-14z" />
          <path d="M20 52c-6 1-13 4-16 10 6 3 13 2 20 0-2-4-3-8-4-10z" />
          <path d="M80 52c-1 2-2 6-4 10 7 2 14 3 20 0-3-6-10-9-16-10z" />
        </g>
        <text
          x="50"
          y="85"
          fill="#333"
          fontSize="15"
          fontWeight="bold"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          HUAWEI
        </text>
      </svg>
    );
  }

  if (s.includes("google")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className={className}
        aria-label="Google"
      >
        <path
          fill="#4285F4"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#EA4335"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
    );
  }

  if (s.includes("oppo")) {
    return (
      <svg
        width={size * 1.8}
        height={size}
        viewBox="0 0 160 50"
        className={className}
        aria-label="OPPO"
      >
        <text
          x="80"
          y="35"
          fill="#008060"
          fontFamily="Arial, sans-serif"
          fontSize="36"
          fontWeight="900"
          letterSpacing="4"
          textAnchor="middle"
        >
          oppo
        </text>
      </svg>
    );
  }

  if (s.includes("vivo")) {
    return (
      <svg
        width={size * 1.8}
        height={size}
        viewBox="0 0 160 50"
        className={className}
        aria-label="Vivo"
      >
        <text
          x="80"
          y="35"
          fill="#415fff"
          fontFamily="Arial, sans-serif"
          fontSize="36"
          fontWeight="900"
          letterSpacing="5"
          textAnchor="middle"
        >
          vivo
        </text>
      </svg>
    );
  }

  if (s.includes("realme")) {
    return (
      <div
        className={`bg-[#FFC915] text-black font-black px-2.5 py-1 rounded-lg text-sm tracking-wider inline-flex items-center justify-center ${className}`}
        style={{ minWidth: size * 1.8, height: size }}
      >
        realme
      </div>
    );
  }

  if (s.includes("nothing")) {
    return (
      <div
        className={`bg-black text-white font-mono font-bold px-3 py-1 rounded-lg text-xs tracking-widest inline-flex items-center justify-center border border-white/20 ${className}`}
        style={{ minWidth: size * 1.8, height: size }}
      >
        NOTHING (R)
      </div>
    );
  }

  // Fallback
  return (
    <div
      className={`bg-slate-900 text-white font-extrabold rounded-xl flex items-center justify-center text-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {(name || slug).charAt(0).toUpperCase()}
    </div>
  );
}
