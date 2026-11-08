"use client";

import Link from "next/link";
import type { Phone } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface MobilePhoneCardProps {
  phone: Phone;
  index?: number;
}

interface ShowcaseOverride {
  brand: string;
  title: string;
  discountPercent: number;
  badgeText: string;
  badgeTextColor: string;
  badgeDotColor: string;
  rating: string;
  spec1: string;
  spec2: string;
  benefit2: string;
  storeName: string;
  oldPriceText: string;
  priceText: string;
  secondStoreText: string;
  imageUrl: string;
  auraColor: string;
  dropShadow: string;
  animDelay: string;
  beamType?: "blue-green" | "amber-red";
}

const SHOWCASE_OVERRIDES: Record<string, ShowcaseOverride> = {
  "iphone-16-pro-max": {
    brand: "Apple",
    title: "iPhone 16 Pro Max 256GB",
    discountPercent: 18,
    badgeText: "YENİ",
    badgeTextColor: "#a3c9ff",
    badgeDotColor: "#a3c9ff",
    rating: "9.8",
    spec1: '6.9" 120Hz',
    spec2: "A18 Pro",
    benefit2: "Peşin 3 Taksit",
    storeName: "Amazon TR",
    oldPriceText: "99.999 ₺",
    priceText: "88.499 ₺",
    secondStoreText: "Hepsiburada 89.200 ₺ • +14 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0vj7rv81MUeOggNnTdP9Ln_oEwfzko5WKQSWADsGRJ7kdCvXOCovz5FR3ljzVWz49kVVMB1iulmFqVNAZBSnaV9s1fchWUQxkGdYzuFGbLYf1pWWvEau-5yFJ26hiZky60f8Pp6a5IReNuZ0trnTvEUw2dcJoiHgPBaJVjIRD6hPSeUXJrYH7mUibjryvJxK4XGfAoXVEOQe16l6tGWvCwdTsRy563yQLDQb4icY",
    auraColor: "rgba(163, 201, 255, 0.25)",
    dropShadow: "drop-shadow(0 10px 16px rgba(41, 151, 255, 0.3))",
    animDelay: "0s",
    beamType: "blue-green",
  },
  "samsung-galaxy-s25-ultra": {
    brand: "Samsung",
    title: "Galaxy S25 Ultra 512GB",
    discountPercent: 14,
    badgeText: "ÇOK SATAN",
    badgeTextColor: "#47e266",
    badgeDotColor: "#47e266",
    rating: "9.7",
    spec1: '6.8" 120Hz',
    spec2: "200MP OIS",
    benefit2: "Vade Farksız 3 Taksit",
    storeName: "Hepsiburada",
    oldPriceText: "82.999 ₺",
    priceText: "70.737 ₺",
    secondStoreText: "Trendyol 71.499 ₺ • +16 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtjLSOzd0Yv-vG7uGoaOUjRK1Jm6HL5SjQJ10WOFUZIlj5wZrZF-n_LSce4iq_AsDvGFt9H-Orun3jiNyCC_LxXuyJEGpNZQ5VU_pvUuHBZ3d9lu5T8hSWiN_rmZPjpWn-nFfSkOwqQ3KU0ZJ2iqf2YDx-eHz_dVK6Bh8G-f9qyE4jt5XZri9SSvP4G-Q9Njx4x_ufWXPMsrsk9XLXLA8RZMg6VfckMHg8YsUup5k",
    auraColor: "rgba(163, 201, 255, 0.2)",
    dropShadow: "drop-shadow(0 8px 16px rgba(41, 151, 255, 0.25))",
    animDelay: "0.8s",
  },
  "xiaomi-15": {
    brand: "Xiaomi",
    title: "Xiaomi 15 Ultra 512GB",
    discountPercent: 22,
    badgeText: "LEICA",
    badgeTextColor: "#a3c9ff",
    badgeDotColor: "#ffb4ab",
    rating: "9.6",
    spec1: "SD 8 Elite",
    spec2: '1" Leica 50MP',
    benefit2: "Peşin 3 Taksit",
    storeName: "Trendyol",
    oldPriceText: "68.999 ₺",
    priceText: "53.819 ₺",
    secondStoreText: "Amazon 54.499 ₺ • +11 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCB_m7zqFC678Lc5ZAKNn08YQWxdSLouFjvxXm6Dlt6-dIB5l7e426A8w2AOX7hiaPQ2XLArIUJamoaqmiI8WQpxvjuHbAdfI7bJOx7IjOqFSPHpeKmPO61w2-0jBXVn3H6yLmIeAqizvR9KFy9Nj1KrUAcVeT-xrNdkEEQpUcX0AY5SsqJKtf84swrFHRwuZmY-jZPGV3gNjUcPLXIsFK8EKhuILMrebinWopnno",
    auraColor: "rgba(255, 45, 85, 0.2)",
    dropShadow: "drop-shadow(0 8px 16px rgba(255, 45, 85, 0.25))",
    animDelay: "1.6s",
    beamType: "amber-red",
  },
  "honor-magic-v3": {
    brand: "HONOR",
    title: "Magic V3 512GB",
    discountPercent: 16,
    badgeText: "KATLANIR",
    badgeTextColor: "#47e266",
    badgeDotColor: "#47e266",
    rating: "9.7",
    spec1: '7.92" 120Hz',
    spec2: "9.2mm İnce",
    benefit2: "Peşin 3 Taksit",
    storeName: "Hepsiburada",
    oldPriceText: "74.999 ₺",
    priceText: "62.999 ₺",
    secondStoreText: "Vatan Bilgisayar 64.999 ₺ • +8 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1QFn27SalL6G4AYYH50EHxAVBUW8knHJbAzACbFubswgm8CAlDRRP2HPBwXkBdIUaDsrF0waFHya2SpZxgG9HQ-lyL0PXBpwzAmvxmEvyqeouM7FPkmVC2jAxGm_218pfjEVyiIJ-xKa0VG2138GuPvkty2TEYP_symLz3DQu5PQEtfAeqmM4CwbkZgXF6aXnLFepx6TvE8BfFTZ51HmyzZPRq2xM9aDf_bpnWSQ",
    auraColor: "rgba(71, 226, 102, 0.2)",
    dropShadow: "drop-shadow(0 8px 16px rgba(71, 226, 102, 0.25))",
    animDelay: "2.2s",
  },
  "poco-f6-pro": {
    brand: "POCO",
    title: "POCO F6 Pro 512GB",
    discountPercent: 24,
    badgeText: "F/P KRALI",
    badgeTextColor: "#47e266",
    badgeDotColor: "#47e266",
    rating: "9.5",
    spec1: "120W Hızlı Şarj",
    spec2: "SD 8 Gen 2",
    benefit2: "Peşin 3 Taksit",
    storeName: "Amazon TR",
    oldPriceText: "34.999 ₺",
    priceText: "26.599 ₺",
    secondStoreText: "Trendyol 27.200 ₺ • +15 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd5yYKglTOHH2xPhNeM2hHCpEVo-u_twfi1Hxq8SmEHp3taxnjJe2EHWOI1sJ7_UB0S5BmQoXcFmOV-TODBnkcWCUsmTKQXId_IAHZVmpNXpC7vSptaZY_5S6-L1ub-8r9Hn2YZIfJ1T1Ev5bDXmKh6sH35gRX80NpitR262Ayqg5DV1Kq3DOJqOSpjezEfDD7GqSQdhKOevj7G6ttpI37TsPBaU7CGKvi4w5nd_Y",
    auraColor: "rgba(245, 158, 11, 0.2)",
    dropShadow: "drop-shadow(0 8px 16px rgba(245, 158, 11, 0.25))",
    animDelay: "1.1s",
  },
  "iphone-15": {
    brand: "Apple",
    title: "iPhone 15 128GB",
    discountPercent: 12,
    badgeText: "POPÜLER",
    badgeTextColor: "#47e266",
    badgeDotColor: "#47e266",
    rating: "9.4",
    spec1: "A16 Bionic",
    spec2: "Dynamic Island",
    benefit2: "Peşin 3 Taksit",
    storeName: "N11",
    oldPriceText: "58.499 ₺",
    priceText: "51.479 ₺",
    secondStoreText: "Amazon TR 51.999 ₺ • +22 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXttEFuCSMxqCB6CX6XbI3_vfZZnuryTiawJ56TfSTFtT6zm_XBCMdOzTFyGZz1m7S5zqWHdiJEavKJsvbmIIzAcFZ8xRxf4m98QNYNLboYrLqhlHX-VP5abgbga-EUMuR-9UT9bjSvcyWl9v8W-paIFYk5TAHRNWi0dD1ymmwjdXU8Sli-u6WqiyhEJxGkW7TsgzsL7GCc6zovNWvDvfKWRlwnwIdfWxu8kODg5c",
    auraColor: "rgba(163, 201, 255, 0.2)",
    dropShadow: "drop-shadow(0 8px 16px rgba(41, 151, 255, 0.25))",
    animDelay: "2.7s",
  },
  "samsung-galaxy-s24-fe": {
    brand: "Samsung",
    title: "Galaxy S24 FE 256GB",
    discountPercent: 19,
    badgeText: "AI DESTEKLİ",
    badgeTextColor: "#a3c9ff",
    badgeDotColor: "#a3c9ff",
    rating: "9.3",
    spec1: "Galaxy AI",
    spec2: '6.7" AMOLED',
    benefit2: "Vade Farksız 3 Taksit",
    storeName: "Hepsiburada",
    oldPriceText: "36.999 ₺",
    priceText: "29.899 ₺",
    secondStoreText: "Amazon TR 30.150 ₺ • +18 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJzrZxD7TjyxrvQhvQ_lOwHnQfRCw4UeM8KpGUmpbAXdAaiYGn1WwMdWon2qZoWIt0D7I7rmHJQQg_FhyXOtp3GC_SklX1nR-oy6sdUvbyP3SAfnF1RaPzaFkosUpMEqkP1Ck-YMmIS09M8r3lmc2amiADk4rXDOefu1EAkqWrydO1MN_KYv-j1z-XwBS0uhtAX6GGnaArql8gb2R0ajM00WogNDxnkhqeMRx8Y64",
    auraColor: "rgba(163, 201, 255, 0.2)",
    dropShadow: "drop-shadow(0 8px 16px rgba(41, 151, 255, 0.25))",
    animDelay: "1.9s",
  },
  "vivo-x200-pro": {
    brand: "vivo",
    title: "vivo X200 Pro 512GB",
    discountPercent: 15,
    badgeText: "ZEISS",
    badgeTextColor: "#a3c9ff",
    badgeDotColor: "#a3c9ff",
    rating: "9.6",
    spec1: "Dimensity 9400",
    spec2: "200MP APO",
    benefit2: "Peşin 3 Taksit",
    storeName: "Trendyol",
    oldPriceText: "64.999 ₺",
    priceText: "54.999 ₺",
    secondStoreText: "Hepsiburada 55.499 ₺ • +9 mağaza",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDysvFI6lXxgB9gutYq7jDGUOEZXUIoxwhJFVwXOvbxOwrKuElKlSn53TfVaigobpmCZWYjpY_6AzrhS11tmpoYEA2OPwFBzxDu34BXNeq4ii2XPnErpSJFtIEefBf17VSRCzXsxgteecg10QE-s8bbQGLZCjcyroNWZEHJCpsTSm79Qb0J5mlx5B9IDrDl6CHkwOu1MNO24SkQIplaaxEUSCWeRjoAB1TtefKXwE",
    auraColor: "rgba(163, 201, 255, 0.2)",
    dropShadow: "drop-shadow(0 8px 16px rgba(41, 151, 255, 0.25))",
    animDelay: "2.5s",
  },
};

interface BadgeConfig {
  text: string;
  dotBg: string;
  textColor: string;
}

function getDynamicBadge(phone: Phone, index: number): BadgeConfig {
  const name = phone.name.toLowerCase();
  const brand = phone.brand.toLowerCase();

  if (name.includes("fold") || name.includes("flip") || name.includes("magic v")) {
    return { text: "KATLANIR", dotBg: "#47e266", textColor: "#47e266" };
  }
  if (brand === "xiaomi" && (name.includes("ultra") || name.includes("14") || name.includes("15"))) {
    return { text: "LEICA", dotBg: "#ffb4ab", textColor: "#a3c9ff" };
  }
  if (brand === "vivo" && (name.includes("x100") || name.includes("x200") || name.includes("pro"))) {
    return { text: "ZEISS", dotBg: "#a3c9ff", textColor: "#a3c9ff" };
  }
  if (name.includes("s24") || name.includes("s25") || name.includes("pixel")) {
    return { text: "AI DESTEKLİ", dotBg: "#a3c9ff", textColor: "#a3c9ff" };
  }
  if (phone.isNew || name.includes("16")) {
    return { text: "YENİ", dotBg: "#a3c9ff", textColor: "#a3c9ff" };
  }
  if (phone.lowestPrice > 0 && phone.lowestPrice < 35000 && (phone.rating || 0) >= 9.0) {
    return { text: "F/P KRALI", dotBg: "#47e266", textColor: "#47e266" };
  }
  if ((phone.rating || 0) >= 9.6 || index === 1) {
    return { text: "ÇOK SATAN", dotBg: "#47e266", textColor: "#47e266" };
  }
  return { text: "POPÜLER", dotBg: "#47e266", textColor: "#47e266" };
}

const FLOAT_DELAYS = ["0s", "0.8s", "1.6s", "2.2s", "1.1s", "2.7s", "1.9s", "2.5s"];
const SHOWCASE_DISCOUNTS = [18, 14, 22, 16, 24, 12, 19, 15];

export default function MobilePhoneCard({ phone, index = 0 }: MobilePhoneCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, openAlertModal } = useApp();
  const isFav = isFavorite(phone.slug);
  const isComp = isInCompare(phone.slug);

  const override = SHOWCASE_OVERRIDES[phone.slug];

  const brandName = override?.brand || phone.brand;
  const displayName = override?.title || phone.name;
  const ratingVal = override?.rating || (phone.rating || 9.4).toFixed(1);

  const discountPercent =
    override?.discountPercent ||
    phone.priceDropPercent ||
    (phone.isPriceDropped ? 18 : SHOWCASE_DISCOUNTS[index % SHOWCASE_DISCOUNTS.length]);

  const displayPrice = phone.lowestPrice || 0;
  const strikethroughPrice =
    phone.highestPrice && phone.highestPrice > displayPrice
      ? phone.highestPrice
      : Math.round(displayPrice * 1.15);

  const priceText = override?.priceText || formatPrice(displayPrice);
  const oldPriceText =
    override?.oldPriceText || (strikethroughPrice > displayPrice ? formatPrice(strikethroughPrice) : "");

  let cheapestStore = override?.storeName || phone.lowestPriceStoreName || "Amazon TR";
  let secondStoreText = override?.secondStoreText || "";

  if (!override) {
    if (phone.storesPrices && phone.storesPrices.length > 1) {
      const sorted = [...phone.storesPrices].sort((a, b) => a.price - b.price);
      cheapestStore = sorted[0].store;
      const second = sorted[1];
      const moreCount = Math.max(0, (phone.storesCount || sorted.length) - 2);
      secondStoreText = `${second.store} ${formatPrice(second.price)}${
        moreCount > 0 ? ` • +${moreCount} mağaza` : " • +8 mağaza"
      }`;
    } else {
      secondStoreText = "Hepsiburada • +14 mağaza";
    }
  }

  const displaySize = phone.specs?.display?.size ? `${phone.specs.display.size}"` : '6.7"';
  const displayHz = phone.specs?.display?.refreshRate ? `${phone.specs.display.refreshRate}Hz` : "120Hz";
  const spec1 = override?.spec1 || `${displaySize} ${displayHz}`;

  let dynamicSpec2 = "A18 Pro";
  const brandLower = phone.brand.toLowerCase();
  if (brandLower === "apple") {
    dynamicSpec2 = displayName.includes("16") ? "A18 Pro" : displayName.includes("15") ? "A16 Bionic" : "A15 Bionic";
  } else if (brandLower === "samsung") {
    dynamicSpec2 = displayName.includes("Ultra") ? "200MP OIS" : "Galaxy AI";
  } else if (brandLower === "xiaomi") {
    dynamicSpec2 = displayName.includes("Ultra") ? '1" Leica 50MP' : "SD 8 Elite";
  } else if (brandLower === "poco") {
    dynamicSpec2 = "120W Hızlı Şarj";
  } else if (displayName.toLowerCase().includes("magic") || displayName.toLowerCase().includes("fold")) {
    dynamicSpec2 = "9.2mm İnce";
  } else if (phone.specs?.performance?.chipset) {
    dynamicSpec2 = phone.specs.performance.chipset.split("(")[0].trim();
  }
  const spec2 = override?.spec2 || dynamicSpec2;

  let auraBg = override?.auraColor || "rgba(163, 201, 255, 0.2)";
  let dropShadow = override?.dropShadow || "drop-shadow(0 8px 16px rgba(41, 151, 255, 0.25))";
  if (!override) {
    if (brandLower === "xiaomi") {
      auraBg = "rgba(255, 45, 85, 0.2)";
      dropShadow = "drop-shadow(0 8px 16px rgba(255, 45, 85, 0.25))";
    } else if (brandLower === "poco") {
      auraBg = "rgba(245, 158, 11, 0.2)";
      dropShadow = "drop-shadow(0 8px 16px rgba(245, 158, 11, 0.25))";
    } else if (displayName.toLowerCase().includes("magic") || displayName.toLowerCase().includes("fold")) {
      auraBg = "rgba(71, 226, 102, 0.2)";
      dropShadow = "drop-shadow(0 8px 16px rgba(71, 226, 102, 0.25))";
    }
  }

  const dynBadge = getDynamicBadge(phone, index);
  const badgeText = override?.badgeText || dynBadge.text;
  const badgeTextColor = override?.badgeTextColor || dynBadge.textColor;
  const badgeDotColor = override?.badgeDotColor || dynBadge.dotBg;

  const animDelay = override?.animDelay || FLOAT_DELAYS[index % FLOAT_DELAYS.length];
  const imageSrc = override?.imageUrl || phone.image;
  const installmentText =
    override?.benefit2 || (brandLower === "samsung" ? "Vade Farksız 3 Taksit" : "Peşin 3 Taksit");

  const isBlueBeam = override?.beamType === "blue-green" || index === 0;
  const isAmberBeam = override?.beamType === "amber-red" || index === 2;

  const innerContent = (
    <>
      {/* Top Badges & Micro Actions */}
      <div
        className="flex items-start justify-between w-full z-10"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          className="flex flex-col gap-1 items-start"
          style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}
        >
          <span
            className="anim-badge-pulse px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold tracking-tight shadow-sm"
            style={{
              backgroundColor: "#93000a",
              color: "#ffdad6",
              padding: "2px 6px",
              borderRadius: "9999px",
              fontSize: "11px",
              lineHeight: "16px",
              fontWeight: 700,
              letterSpacing: "-0.015em",
              display: "inline-block",
            }}
          >
            -%{discountPercent}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full bg-surface-container-highest font-label-sm text-label-sm font-semibold tracking-wider flex items-center gap-1"
            style={{
              backgroundColor: "#353437",
              color: badgeTextColor,
              padding: "2px 6px",
              borderRadius: "9999px",
              fontSize: "11px",
              lineHeight: "16px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full anim-radar-ping"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "9999px",
                backgroundColor: badgeDotColor,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {badgeText}
          </span>
        </div>

        <div
          className="flex items-center gap-1"
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          <button
            type="button"
            onClick={() => addToCompare(phone)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-container-highest/80 text-on-surface-variant hover:text-primary active:scale-90 transition-all cursor-pointer"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isComp ? "rgba(41, 151, 255, 0.25)" : "rgba(53, 52, 55, 0.8)",
              color: isComp ? "#a3c9ff" : "#c0c7d5",
              border: "none",
            }}
            title="Karşılaştır"
          >
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontSize: "15px", lineHeight: 1 }}
            >
              balance
            </span>
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(phone)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-container-highest/80 text-on-surface-variant hover:text-error active:scale-90 transition-all cursor-pointer"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isFav ? "rgba(255, 180, 171, 0.2)" : "rgba(53, 52, 55, 0.8)",
              color: isFav ? "#ffb4ab" : "#c0c7d5",
              border: "none",
            }}
            title="Favoriye Ekle"
          >
            <span
              className="material-symbols-outlined text-[15px]"
              style={{
                fontSize: "15px",
                lineHeight: 1,
                fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>
        </div>
      </div>

      {/* Device Showcase with 3D Float & Ambient Aura */}
      <Link
        href={`/telefon/${phone.slug}`}
        className="relative w-full h-36 flex items-center justify-center my-1 rounded-DEFAULT bg-surface-container-lowest/60 overflow-hidden group"
        style={{
          position: "relative",
          width: "100%",
          height: "144px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "4px",
          marginBottom: "4px",
          borderRadius: "16px",
          backgroundColor: "rgba(14, 14, 16, 0.75)",
          overflow: "hidden",
          textDecoration: "none",
        }}
      >
        <div
          className="absolute w-24 h-24 rounded-full blur-xl pointer-events-none"
          style={{
            position: "absolute",
            width: "96px",
            height: "96px",
            borderRadius: "9999px",
            backgroundColor: auraBg,
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={displayName}
          loading={index < 4 ? "eager" : "lazy"}
          className="anim-float-3d w-full h-full object-contain p-2 relative z-10"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "8px",
            position: "relative",
            zIndex: 10,
            filter: dropShadow,
            animationDelay: animDelay,
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              brandLower === "apple"
                ? SHOWCASE_OVERRIDES["iphone-16-pro-max"].imageUrl
                : SHOWCASE_OVERRIDES["samsung-galaxy-s25-ultra"].imageUrl;
          }}
        />
        {/* Rating Pill strictly anchored at bottom-left corner */}
        <div
          className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-dim/85 backdrop-blur-md text-on-surface font-label-sm text-label-sm border border-surface-variant/40 shadow-sm z-20"
          style={{
            position: "absolute",
            bottom: "6px",
            left: "6px",
            top: "auto",
            right: "auto",
            zIndex: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 6px",
            borderRadius: "6px",
            backgroundColor: "rgba(19, 19, 21, 0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#e5e1e4",
            fontSize: "11px",
            lineHeight: "16px",
            fontWeight: 600,
            border: "1px solid rgba(53, 52, 55, 0.45)",
          }}
        >
          <span
            className="material-symbols-outlined text-[12px] text-tertiary"
            style={{
              fontVariationSettings: "'FILL' 1",
              fontSize: "12px",
              lineHeight: 1,
              color: "#47e266",
            }}
          >
            star
          </span>
          <span className="font-bold" style={{ fontWeight: 700, fontSize: "11px", color: "#e5e1e4" }}>
            {ratingVal}
          </span>
        </div>
      </Link>

      {/* Meta: Brand & Title */}
      <div
        className="flex flex-col gap-0.5 mt-1"
        style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}
      >
        <span
          className="font-label-sm text-label-sm text-on-surface-variant font-semibold tracking-wider uppercase"
          style={{
            fontSize: "11px",
            lineHeight: "16px",
            color: "#c0c7d5",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {brandName}
        </span>
        <h3
          className="font-title-sm text-[14px] leading-snug font-bold text-on-surface line-clamp-1"
          style={{
            fontSize: "14px",
            lineHeight: "1.375",
            fontWeight: 700,
            color: "#e5e1e4",
            margin: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          <Link
            href={`/telefon/${phone.slug}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {displayName}
          </Link>
        </h3>
      </div>

      {/* Specs */}
      <div
        className="flex flex-wrap gap-1 my-1.5"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          marginTop: "6px",
          marginBottom: "6px",
        }}
      >
        <span
          className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[10px]"
          style={{
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: "#2a2a2c",
            color: "#c0c7d5",
            fontSize: "10px",
            lineHeight: "14px",
            fontWeight: 600,
          }}
        >
          {spec1}
        </span>
        <span
          className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[10px]"
          style={{
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: "#2a2a2c",
            color: "#c0c7d5",
            fontSize: "10px",
            lineHeight: "14px",
            fontWeight: 600,
          }}
        >
          {spec2}
        </span>
      </div>

      {/* Benefits */}
      <div
        className="flex flex-col gap-0.5 mb-2"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          marginBottom: "8px",
        }}
      >
        <div
          className="flex items-center gap-1 text-tertiary font-label-sm text-[10px]"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "#47e266",
            fontSize: "10px",
            lineHeight: "14px",
            fontWeight: 600,
          }}
        >
          <span
            className="material-symbols-outlined text-[12px]"
            style={{ fontSize: "12px", lineHeight: 1, color: "#47e266" }}
          >
            local_shipping
          </span>
          <span>Ücretsiz Kargo</span>
        </div>
        <div
          className="flex items-center gap-1 text-on-surface-variant font-label-sm text-[10px]"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "#c0c7d5",
            fontSize: "10px",
            lineHeight: "14px",
            fontWeight: 600,
          }}
        >
          <span
            className="material-symbols-outlined text-[12px] text-primary"
            style={{ fontSize: "12px", lineHeight: 1, color: "#a3c9ff" }}
          >
            credit_card
          </span>
          <span>{installmentText}</span>
        </div>
      </div>

      {/* Price & Action */}
      <div
        className="mt-auto flex flex-col pt-1.5 border-t border-surface-variant/40"
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          paddingTop: "6px",
          borderTop: "1px solid rgba(53, 52, 55, 0.4)",
        }}
      >
        <div
          className="flex items-center justify-between text-on-surface-variant font-label-sm text-[11px]"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#c0c7d5",
            fontSize: "11px",
            lineHeight: "16px",
            fontWeight: 600,
          }}
        >
          <span
            className="truncate max-w-[80px]"
            style={{
              maxWidth: "80px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {cheapestStore}
          </span>
          {oldPriceText && (
            <span
              className="line-through text-on-surface-variant/60"
              style={{
                textDecoration: "line-through",
                color: "rgba(192, 199, 213, 0.6)",
              }}
            >
              {oldPriceText}
            </span>
          )}
        </div>

        <div
          className="flex items-baseline gap-1 my-0.5"
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
            marginTop: "2px",
            marginBottom: "2px",
          }}
        >
          <span
            className="font-headline-md text-[18px] leading-tight font-bold text-tertiary"
            style={{
              fontSize: "18px",
              lineHeight: "1.25",
              fontWeight: 700,
              color: "#47e266",
            }}
          >
            {priceText}
          </span>
        </div>

        <span
          className="font-label-sm text-[10px] text-on-surface-variant/80 truncate mb-2"
          style={{
            fontSize: "10px",
            lineHeight: "14px",
            fontWeight: 600,
            color: "rgba(192, 199, 213, 0.8)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: "8px",
          }}
        >
          {secondStoreText}
        </span>

        <div
          className="flex items-center gap-1.5 w-full"
          style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}
        >
          <Link
            href={`/telefon/${phone.slug}`}
            className="anim-sheen-btn flex-1 h-8 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold flex items-center justify-center active:scale-95 shadow-[0_2px_10px_rgba(41,151,255,0.35)] transition-transform"
            style={{
              flex: 1,
              height: "32px",
              borderRadius: "9999px",
              backgroundColor: "#2997ff",
              color: "#002e57",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(41, 151, 255, 0.35)",
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            Fiyatları Gör
          </Link>
          <button
            type="button"
            onClick={() => openAlertModal(phone)}
            className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary active:scale-90 flex items-center justify-center shrink-0 transition-all cursor-pointer"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              backgroundColor: "#2a2a2c",
              color: "#c0c7d5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "none",
            }}
            title="Fiyat Alarmı"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontSize: "16px", lineHeight: 1 }}
            >
              notifications
            </span>
          </button>
        </div>
      </div>
    </>
  );

  if (isBlueBeam) {
    return (
      <div
        className="anim-border-beam rounded-DEFAULT p-[1.5px] shadow-[0_4px_24px_rgba(41,151,255,0.22)] group transition-all duration-300 hover:scale-[1.015] soft-lift-card"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          padding: "1.5px",
          boxShadow: "0 4px 24px rgba(41, 151, 255, 0.22)",
        }}
      >
        <div
          className="anim-card-inner flex flex-col bg-surface-container-low p-2.5 h-full relative"
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "calc(16px - 1.5px)",
            backgroundColor: "#1c1b1d",
            padding: "10px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {innerContent}
        </div>
      </div>
    );
  }

  if (isAmberBeam) {
    return (
      <div
        className="anim-border-beam anim-border-beam-amber rounded-DEFAULT p-[1.5px] shadow-[0_4px_24px_rgba(255,45,85,0.2)] group transition-all duration-300 hover:scale-[1.015] soft-lift-card"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          padding: "1.5px",
          boxShadow: "0 4px 24px rgba(255, 45, 85, 0.2)",
        }}
      >
        <div
          className="anim-card-inner flex flex-col bg-surface-container-low p-2.5 h-full relative"
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "calc(16px - 1.5px)",
            backgroundColor: "#1c1b1d",
            padding: "10px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {innerContent}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col bg-surface-container-low rounded-DEFAULT p-2.5 relative group shadow-sm transition-all duration-300 hover:scale-[1.015] hover:bg-surface-container border border-surface-variant/30 soft-lift-card"
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1c1b1d",
        borderRadius: "16px",
        padding: "10px",
        position: "relative",
        border: "1px solid rgba(53, 52, 55, 0.45)",
      }}
    >
      {innerContent}
    </div>
  );
}
