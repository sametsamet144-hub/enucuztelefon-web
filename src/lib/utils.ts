import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names with conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a price number to Turkish Lira string.
 * @example formatPrice(32999) → "32.999 ₺"
 */
export function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + " ₺"
  );
}

/**
 * Format an ISO date string to Turkish locale date string.
 * @example formatDate("2026-11-04T00:00:00Z") → "4 Kasım 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Format an ISO date string to relative time (Turkish).
 * @example formatRelativeDate("2026-10-04T00:00:00Z") → "1 ay önce"
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return "az önce";
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 30) return `${diffDays} gün önce`;
  if (diffMonths < 12) return `${diffMonths} ay önce`;
  return `${diffYears} yıl önce`;
}

/**
 * Slugify a string for use in URLs.
 * Handles Turkish characters.
 * @example slugify("iPhone 16 Pro Max") → "iphone-16-pro-max"
 */
export function slugify(text: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  return text
    .split("")
    .map((char) => turkishMap[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Truncate a string to a given length, appending "...".
 * @example truncate("Bu çok uzun bir metin", 10) → "Bu çok u..."
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}

/**
 * Returns a Tailwind text color class based on a 0–100 score.
 * @example getScoreColor(85) → "text-green-500"
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 45) return "text-orange-500";
  return "text-red-500";
}

/**
 * Returns a Tailwind background color class based on a 0–100 score.
 */
export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-green-100 text-green-800";
  if (score >= 75) return "bg-green-50 text-green-700";
  if (score >= 60) return "bg-yellow-50 text-yellow-700";
  if (score >= 45) return "bg-orange-50 text-orange-700";
  return "bg-red-50 text-red-700";
}

/**
 * Returns a human-readable Turkish string for a price change percent.
 * @example priceChangeText(-15) → "%15 indirimli"
 * @example priceChangeText(10) → "%10 artış"
 */
export function priceChangeText(percent: number): string {
  const abs = Math.abs(percent);
  if (percent < 0) return `%${abs} indirimli`;
  if (percent > 0) return `%${abs} artış`;
  return "Fiyat değişmedi";
}

/**
 * Returns a Tailwind color class for a price change.
 */
export function priceChangeColor(percent: number): string {
  if (percent < 0) return "text-red-500";
  if (percent > 0) return "text-green-500";
  return "text-slate-500";
}

/**
 * Calculate price difference percentage between two prices.
 * @example priceDiffPercent(30000, 32000) → -6.25 (6.25% cheaper)
 */
export function priceDiffPercent(current: number, original: number): number {
  if (original === 0) return 0;
  return Math.round(((current - original) / original) * 100 * 100) / 100;
}

/**
 * Format storage in GB — returns "128 GB" or "1 TB" etc.
 */
export function formatStorage(gb: number): string {
  if (gb >= 1000) return `${gb / 1000} TB`;
  return `${gb} GB`;
}

/**
 * Format RAM — "8 GB RAM"
 */
export function formatRam(gb: number): string {
  return `${gb} GB RAM`;
}

/**
 * Format battery — "5000 mAh"
 */
export function formatBattery(mah: number): string {
  return `${mah.toLocaleString("tr-TR")} mAh`;
}

/**
 * Returns a friendly label for a sort option.
 */
export function sortLabel(sort: string): string {
  const labels: Record<string, string> = {
    "price-asc": "En Ucuz",
    "price-desc": "En Pahalı",
    newest: "En Yeni",
    rating: "En Yüksek Puan",
    "name-asc": "İsim (A-Z)",
    "name-desc": "İsim (Z-A)",
    "price-drop": "En Çok İndirim",
  };
  return labels[sort] ?? sort;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a placeholder image URL for phones.
 */
export function phonePlaceholder(name: string): string {
  return `/images/phones/placeholder.webp`;
}

/**
 * Check if a phone was released within the last N days.
 */
export function isRecentRelease(releaseDate: string, days = 90): boolean {
  const release = new Date(releaseDate);
  const now = new Date();
  const diffMs = now.getTime() - release.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

/**
 * Validates real outbound store offer URLs.
 * If no real offer URL is provided by the backend API, returns empty string.
 * Linkler ve fiyatlar için sahte fallback üretilmez — data yoksa boştur.
 */
export function resolveStoreOfferUrl(
  _storeSlug?: string,
  _phoneName?: string,
  rawUrl?: string
): string {
  if (
    rawUrl &&
    typeof rawUrl === "string" &&
    (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) &&
    !rawUrl.includes("enucuztelefon.com") &&
    !rawUrl.includes("-10000000") &&
    !rawUrl.includes("HBC0000100000")
  ) {
    return rawUrl;
  }

  return "";
}

/**
 * Generates the backend redirect URL for outbound store links.
 * Returns empty string if no valid destination URL exists.
 */
export function getStoreRedirectUrl(
  storeSlug: string,
  phoneName: string,
  rawUrl?: string
): string {
  const resolved = resolveStoreOfferUrl(storeSlug, phoneName, rawUrl);
  if (!resolved) return "";

  const backendBase =
    (typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL) ||
    "http://localhost:5000/api/v1";

  const params = new URLSearchParams({
    store: storeSlug,
    product: phoneName,
    url: resolved,
  });

  return `${backendBase}/redirect?${params.toString()}`;
}

/**
 * Resolves common phone slug aliases (e.g. "apple-iphone-16-pro-max" -> "iphone-16-pro-max")
 */
export function resolvePhoneSlug(slug: string): string {
  const s = (slug || "").toLowerCase().trim();
  const aliasMap: Record<string, string> = {
    "apple-iphone-16-pro-max": "iphone-16-pro-max",
    "apple-iphone-16-pro": "iphone-16-pro",
    "apple-iphone-16-plus": "iphone-16-plus",
    "apple-iphone-16": "iphone-16",
    "apple-iphone-15-pro-max": "iphone-15-pro-max",
    "apple-iphone-15-pro": "iphone-15-pro",
    "apple-iphone-15": "iphone-15",
    "apple-iphone-14": "iphone-14",
    "apple-iphone-13": "iphone-13",
    "xiaomi-redmi-note-13-pro-5g": "redmi-note-13-pro-5g",
    "xiaomi-redmi-note-14-pro": "redmi-note-14-pro",
    "galaxy-s24-ultra": "samsung-galaxy-s24-ultra",
    "galaxy-s25-ultra": "samsung-galaxy-s25-ultra",
    "samsung-galaxy-s24": "samsung-galaxy-s24-ultra",
    "xiaomi-14-ultra": "xiaomi-13-ultra",
  };
  return aliasMap[s] || s;
}
