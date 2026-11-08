import type { Phone, PhoneSpecs, StorePrice, PriceHistory } from "@/types";

export const FLAGSHIP_STUDIO_PHOTOS: Record<string, string> = {
  // Apple
  "iphone-16-pro-max":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0vj7rv81MUeOggNnTdP9Ln_oEwfzko5WKQSWADsGRJ7kdCvXOCovz5FR3ljzVWz49kVVMB1iulmFqVNAZBSnaV9s1fchWUQxkGdYzuFGbLYf1pWWvEau-5yFJ26hiZky60f8Pp6a5IReNuZ0trnTvEUw2dcJoiHgPBaJVjIRD6hPSeUXJrYH7mUibjryvJxK4XGfAoXVEOQe16l6tGWvCwdTsRy563yQLDQb4icY",
  "iphone-16-pro":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0vj7rv81MUeOggNnTdP9Ln_oEwfzko5WKQSWADsGRJ7kdCvXOCovz5FR3ljzVWz49kVVMB1iulmFqVNAZBSnaV9s1fchWUQxkGdYzuFGbLYf1pWWvEau-5yFJ26hiZky60f8Pp6a5IReNuZ0trnTvEUw2dcJoiHgPBaJVjIRD6hPSeUXJrYH7mUibjryvJxK4XGfAoXVEOQe16l6tGWvCwdTsRy563yQLDQb4icY",
  "iphone-16":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAXttEFuCSMxqCB6CX6XbI3_vfZZnuryTiawJ56TfSTFtT6zm_XBCMdOzTFyGZz1m7S5zqWHdiJEavKJsvbmIIzAcFZ8xRxf4m98QNYNLboYrLqhlHX-VP5abgbga-EUMuR-9UT9bjSvcyWl9v8W-paIFYk5TAHRNWi0dD1ymmwjdXU8Sli-u6WqiyhEJxGkW7TsgzsL7GCc6zovNWvDvfKWRlwnwIdfWxu8kODg5c",
  "iphone-16-plus":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAXttEFuCSMxqCB6CX6XbI3_vfZZnuryTiawJ56TfSTFtT6zm_XBCMdOzTFyGZz1m7S5zqWHdiJEavKJsvbmIIzAcFZ8xRxf4m98QNYNLboYrLqhlHX-VP5abgbga-EUMuR-9UT9bjSvcyWl9v8W-paIFYk5TAHRNWi0dD1ymmwjdXU8Sli-u6WqiyhEJxGkW7TsgzsL7GCc6zovNWvDvfKWRlwnwIdfWxu8kODg5c",
  "iphone-15":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAXttEFuCSMxqCB6CX6XbI3_vfZZnuryTiawJ56TfSTFtT6zm_XBCMdOzTFyGZz1m7S5zqWHdiJEavKJsvbmIIzAcFZ8xRxf4m98QNYNLboYrLqhlHX-VP5abgbga-EUMuR-9UT9bjSvcyWl9v8W-paIFYk5TAHRNWi0dD1ymmwjdXU8Sli-u6WqiyhEJxGkW7TsgzsL7GCc6zovNWvDvfKWRlwnwIdfWxu8kODg5c",
  "iphone-15-pro-max": "/images/phones/iphone-15-pro-max.webp",
  "iphone-15-pro": "/images/phones/iphone-15-pro-max.webp",
  "iphone-14": "/images/phones/iphone-14.webp",
  "iphone-13": "/images/phones/iphone-13.webp",

  // Samsung
  "samsung-galaxy-s25-ultra":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDtjLSOzd0Yv-vG7uGoaOUjRK1Jm6HL5SjQJ10WOFUZIlj5wZrZF-n_LSce4iq_AsDvGFt9H-Orun3jiNyCC_LxXuyJEGpNZQ5VU_pvUuHBZ3d9lu5T8hSWiN_rmZPjpWn-nFfSkOwqQ3KU0ZJ2iqf2YDx-eHz_dVK6Bh8G-f9qyE4jt5XZri9SSvP4G-Q9Njx4x_ufWXPMsrsk9XLXLA8RZMg6VfckMHg8YsUup5k",
  "samsung-galaxy-s25":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDtjLSOzd0Yv-vG7uGoaOUjRK1Jm6HL5SjQJ10WOFUZIlj5wZrZF-n_LSce4iq_AsDvGFt9H-Orun3jiNyCC_LxXuyJEGpNZQ5VU_pvUuHBZ3d9lu5T8hSWiN_rmZPjpWn-nFfSkOwqQ3KU0ZJ2iqf2YDx-eHz_dVK6Bh8G-f9qyE4jt5XZri9SSvP4G-Q9Njx4x_ufWXPMsrsk9XLXLA8RZMg6VfckMHg8YsUup5k",
  "samsung-galaxy-s24-fe":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCJzrZxD7TjyxrvQhvQ_lOwHnQfRCw4UeM8KpGUmpbAXdAaiYGn1WwMdWon2qZoWIt0D7I7rmHJQQg_FhyXOtp3GC_SklX1nR-oy6sdUvbyP3SAfnF1RaPzaFkosUpMEqkP1Ck-YMmIS09M8r3lmc2amiADk4rXDOefu1EAkqWrydO1MN_KYv-j1z-XwBS0uhtAX6GGnaArql8gb2R0ajM00WogNDxnkhqeMRx8Y64",
  "samsung-galaxy-s24-ultra": "/images/phones/samsung-galaxy-s24-ultra.webp",
  "samsung-galaxy-s24": "/images/phones/samsung-galaxy-s24.webp",
  "samsung-galaxy-z-fold-6": "/images/phones/samsung-galaxy-z-fold-6.webp",
  "samsung-galaxy-z-flip-6": "/images/phones/samsung-galaxy-z-fold-6.webp",
  "samsung-galaxy-a56": "/images/phones/samsung-galaxy-a56.webp",
  "samsung-galaxy-a55": "/images/phones/samsung-galaxy-a55.webp",
  "samsung-galaxy-a35": "/images/phones/samsung-galaxy-a35.webp",

  // Xiaomi & POCO
  "xiaomi-15-ultra":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCB_m7zqFC678Lc5ZAKNn08YQWxdSLouFjvxXm6Dlt6-dIB5l7e426A8w2AOX7hiaPQ2XLArIUJamoaqmiI8WQpxvjuHbAdfI7bJOx7IjOqFSPHpeKmPO61w2-0jBXVn3H6yLmIeAqizvR9KFy9Nj1KrUAcVeT-xrNdkEEQpUcX0AY5SsqJKtf84swrFHRwuZmY-jZPGV3gNjUcPLXIsFK8EKhuILMrebinWopnno",
  "xiaomi-15":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCB_m7zqFC678Lc5ZAKNn08YQWxdSLouFjvxXm6Dlt6-dIB5l7e426A8w2AOX7hiaPQ2XLArIUJamoaqmiI8WQpxvjuHbAdfI7bJOx7IjOqFSPHpeKmPO61w2-0jBXVn3H6yLmIeAqizvR9KFy9Nj1KrUAcVeT-xrNdkEEQpUcX0AY5SsqJKtf84swrFHRwuZmY-jZPGV3gNjUcPLXIsFK8EKhuILMrebinWopnno",
  "xiaomi-15-pro": "/images/phones/xiaomi-15-pro.webp",
  "xiaomi-14": "/images/phones/xiaomi-14.webp",
  "xiaomi-14t-pro": "/images/phones/xiaomi-14t-pro.webp",
  "poco-f6-pro":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBd5yYKglTOHH2xPhNeM2hHCpEVo-u_twfi1Hxq8SmEHp3taxnjJe2EHWOI1sJ7_UB0S5BmQoXcFmOV-TODBnkcWCUsmTKQXId_IAHZVmpNXpC7vSptaZY_5S6-L1ub-8r9Hn2YZIfJ1T1Ev5bDXmKh6sH35gRX80NpitR262Ayqg5DV1Kq3DOJqOSpjezEfDD7GqSQdhKOevj7G6ttpI37TsPBaU7CGKvi4w5nd_Y",
  "poco-x6-pro": "/images/phones/poco-x6-pro.webp",
  "redmi-note-13-pro-5g": "/images/phones/redmi-note-13-pro-5g.webp",
  "redmi-note-14-pro-plus": "/images/phones/redmi-note-14-pro-plus.webp",

  // HONOR
  "honor-magic-v3":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC1QFn27SalL6G4AYYH50EHxAVBUW8knHJbAzACbFubswgm8CAlDRRP2HPBwXkBdIUaDsrF0waFHya2SpZxgG9HQ-lyL0PXBpwzAmvxmEvyqeouM7FPkmVC2jAxGm_218pfjEVyiIJ-xKa0VG2138GuPvkty2TEYP_symLz3DQu5PQEtfAeqmM4CwbkZgXF6aXnLFepx6TvE8BfFTZ51HmyzZPRq2xM9aDf_bpnWSQ",
  "honor-magic-6-pro": "/images/phones/honor-magic-6-pro.webp",

  // vivo
  "vivo-x200-pro":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBDysvFI6lXxgB9gutYq7jDGUOEZXUIoxwhJFVwXOvbxOwrKuElKlSn53TfVaigobpmCZWYjpY_6AzrhS11tmpoYEA2OPwFBzxDu34BXNeq4ii2XPnErpSJFtIEefBf17VSRCzXsxgteecg10QE-s8bbQGLZCjcyroNWZEHJCpsTSm79Qb0J5mlx5B9IDrDl6CHkwOu1MNO24SkQIplaaxEUSCWeRjoAB1TtefKXwE",
  "vivo-x100-pro": "/images/phones/vivo-x100-pro.webp",

  // Others
  "huawei-pura-70-ultra": "/images/phones/huawei-pura-70-ultra.webp",
  "google-pixel-9-pro-xl": "/images/phones/google-pixel-9-pro-xl.webp",
  "oppo-find-x8-pro": "/images/phones/oppo-find-x8-pro.webp",
  "oneplus-12": "/images/phones/oneplus-12.webp",
  "realme-gt-6": "/images/phones/realme-gt-6.webp",
  "nothing-phone-2": "/images/phones/nothing-phone-2.webp",
};

export function getStudioPhotoUrl(slug?: string, brand?: string, image?: string): string {
  const cleanSlug = (slug || "").toLowerCase().trim();
  if (cleanSlug && FLAGSHIP_STUDIO_PHOTOS[cleanSlug]) {
    return FLAGSHIP_STUDIO_PHOTOS[cleanSlug];
  }

  // If image is a valid remote URL or existing webp, keep it
  if (
    image &&
    !image.endsWith(".svg") &&
    !image.includes("placeholder") &&
    (image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.endsWith(".webp") ||
      image.endsWith(".jpg") ||
      image.endsWith(".png"))
  ) {
    return image;
  }

  // Fallback brand studio photography for SVGs/placeholders
  const cleanBrand = (brand || "").toLowerCase().trim();
  if (cleanBrand.includes("apple")) {
    return FLAGSHIP_STUDIO_PHOTOS["iphone-16-pro-max"];
  }
  if (cleanBrand.includes("samsung")) {
    return FLAGSHIP_STUDIO_PHOTOS["samsung-galaxy-s25-ultra"];
  }
  if (cleanBrand.includes("xiaomi") || cleanBrand.includes("redmi")) {
    return FLAGSHIP_STUDIO_PHOTOS["xiaomi-15-ultra"];
  }
  if (cleanBrand.includes("poco")) {
    return FLAGSHIP_STUDIO_PHOTOS["poco-f6-pro"];
  }
  if (cleanBrand.includes("honor")) {
    return FLAGSHIP_STUDIO_PHOTOS["honor-magic-v3"];
  }
  if (cleanBrand.includes("vivo")) {
    return FLAGSHIP_STUDIO_PHOTOS["vivo-x200-pro"];
  }
  if (cleanBrand.includes("huawei")) {
    return FLAGSHIP_STUDIO_PHOTOS["huawei-pura-70-ultra"];
  }
  if (cleanBrand.includes("google")) {
    return FLAGSHIP_STUDIO_PHOTOS["google-pixel-9-pro-xl"];
  }

  return FLAGSHIP_STUDIO_PHOTOS["iphone-16-pro-max"];
}

/**
 * Strictly validates that a store offer is a real direct product offer.
 * Discards all fake fallback search links and non-phone supermarket templates.
 */
export function isRealDirectStoreOffer(sp: any): boolean {
  if (!sp || typeof sp !== "object") return false;
  const price = Number(sp.price);
  if (!price || isNaN(price) || price <= 0) return false;

  const url = typeof sp.url === "string" ? sp.url.trim() : "";
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) return false;

  const lowerUrl = url.toLowerCase();

  // Search or generic category fallback URLs are strictly fake:
  if (
    lowerUrl.includes("/arama") ||
    lowerUrl.includes("/ara?") ||
    lowerUrl.includes("/ara/") ||
    lowerUrl.includes("/sr?q=") ||
    lowerUrl.includes("/sr?") ||
    lowerUrl.includes("/sr/") ||
    lowerUrl.includes("/s?k=") ||
    lowerUrl.includes("/s?") ||
    lowerUrl.includes("search_text=") ||
    lowerUrl.includes("?query=") ||
    lowerUrl.includes("&query=") ||
    lowerUrl.includes("?text=") ||
    lowerUrl.includes("&text=") ||
    lowerUrl.includes("?q=") ||
    lowerUrl.includes("&q=") ||
    lowerUrl.includes("search.html") ||
    lowerUrl.includes("/categories/") ||
    lowerUrl.includes("/kategori/") ||
    lowerUrl.includes("/katalog/") ||
    lowerUrl.includes("/kampanyalar/") ||
    lowerUrl.includes("/cihazlar") ||
    lowerUrl.includes("/faturaya-ek") ||
    lowerUrl.includes("apple.com/tr/iphone") ||
    lowerUrl.includes("shop.samsung.com") ||
    lowerUrl.includes("/mobil/cep-telefonu") ||
    lowerUrl.includes("mi.com/tr") ||
    lowerUrl.includes("honor.com/tr") ||
    lowerUrl.includes("consumer.huawei.com") ||
    lowerUrl.includes("tecno-mobile.com") ||
    lowerUrl.includes("infinixmobility.com") ||
    lowerUrl.includes("myepoint.com") ||
    lowerUrl.includes("enucuztelefon.com") ||
    lowerUrl.includes("placeholder") ||
    lowerUrl.includes("-10000000") ||
    lowerUrl.includes("hbc0000100000") ||
    lowerUrl.includes("bim.com.tr") ||
    lowerUrl.includes("a101.com.tr") ||
    lowerUrl.includes("kurumsalsok.com.tr") ||
    lowerUrl.includes("sokmarket.com.tr") ||
    lowerUrl.includes("evkur.com.tr") ||
    lowerUrl.includes("yonavm.com.tr") ||
    lowerUrl.includes("mutluevim.com.tr") ||
    lowerUrl.includes("arcelik.com.tr") ||
    lowerUrl.includes("beko.com.tr") ||
    lowerUrl.includes("vestel.com.tr")
  ) {
    return false;
  }

  // Supermarket/grocery or installment catalog chains without real live phone feeds:
  const storeSlug = (sp.storeSlug || sp.store || "").toLowerCase().trim();
  const fakeStoreSlugs = [
    "bim",
    "a101",
    "sok",
    "evkur",
    "yonavm",
    "mutluevim",
    "arcelik",
    "beko",
    "vestel",
  ];
  if (fakeStoreSlugs.includes(storeSlug)) {
    return false;
  }

  return true;
}

/**
 * Normalizes raw backend product data into consistent frontend Phone model.
 * Handles both rich local format and lightweight backend REST format gracefully.
 */
export function normalizePhone(raw: any): Phone {
  if (!raw) return raw;

  const displayRaw = raw.specs?.display || {};
  const cameraRaw = raw.specs?.camera || {};
  const batteryRaw = raw.specs?.battery || {};
  const perfRaw = raw.specs?.performance || {};
  const connRaw = raw.specs?.connectivity || {};
  const designRaw = raw.specs?.design || {};
  const softwareRaw = raw.specs?.software || {};

  // Parse numeric values safely
  const parseNum = (val: any, fallback = 0): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(/[^0-9.]/g, ""));
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  };

  const mainMp = parseNum(cameraRaw.mainMp || cameraRaw.mainCamera?.megapixels, 48);
  const telephotoMp = cameraRaw.telephotoMp
    ? parseNum(cameraRaw.telephotoMp, 12)
    : cameraRaw.telephoto?.megapixels;
  const ultrawideMp = cameraRaw.ultrawideMp
    ? parseNum(cameraRaw.ultrawideMp, 12)
    : cameraRaw.ultrawide?.megapixels;

  const displaySize = displayRaw.size ? parseNum(displayRaw.size, 6.7) : 6.7;
  const refreshRate = displayRaw.refreshRate ? parseNum(displayRaw.refreshRate, 120) : 120;
  const batteryCapacity = batteryRaw.capacity ? parseNum(batteryRaw.capacity, 5000) : 5000;
  const chargingWatt = batteryRaw.fastChargingWatt
    ? parseNum(batteryRaw.fastChargingWatt, 25)
    : batteryRaw.wiredCharging || 25;

  const specs: PhoneSpecs = {
    display: {
      size: displaySize,
      resolution: displayRaw.resolution || "2796 x 1290",
      technology: displayRaw.technology || "OLED",
      refreshRate: refreshRate,
      brightness: displayRaw.brightness || 2000,
      aspectRatio: displayRaw.aspectRatio || "19.5:9",
      protection: displayRaw.protection || "Corning Gorilla Glass",
      hdr: displayRaw.hdr || "HDR10+",
      ppi: displayRaw.ppi || 460,
    },
    camera: {
      mainCamera: {
        megapixels: mainMp,
        aperture: cameraRaw.mainCamera?.aperture || "f/1.8",
        sensorSize: cameraRaw.mainCamera?.sensorSize || "1/1.28\"",
        ois: cameraRaw.mainCamera?.ois ?? true,
        autofocus: cameraRaw.mainCamera?.autofocus || "PDAF, Laser AF",
      },
      mainMp: String(mainMp),
      telephotoMp: telephotoMp ? String(telephotoMp) : undefined,
      ultrawideMp: ultrawideMp ? String(ultrawideMp) : undefined,
      ultrawide: ultrawideMp
        ? {
            megapixels: ultrawideMp,
            aperture: cameraRaw.ultrawide?.aperture || "f/2.2",
            fov: cameraRaw.ultrawide?.fov || 120,
          }
        : cameraRaw.ultrawide,
      telephoto: telephotoMp
        ? {
            megapixels: telephotoMp,
            aperture: cameraRaw.telephoto?.aperture || "f/2.8",
            opticalZoom: cameraRaw.telephoto?.opticalZoom || 5,
            maxZoom: cameraRaw.telephoto?.maxZoom || 25,
          }
        : cameraRaw.telephoto,
      periscope: cameraRaw.periscope,
      frontCamera: cameraRaw.frontCamera || {
        megapixels: 12,
        aperture: "f/1.9",
        autofocus: true,
      },
      videoCapabilities: cameraRaw.videoCapabilities || ["4K@60fps", "1080p@240fps"],
      features: cameraRaw.features || ["Gece Modu", "Portre", "4K Video"],
    },
    battery: {
      capacity: batteryCapacity,
      wiredCharging: chargingWatt,
      fastChargingWatt: String(chargingWatt),
      wirelessCharging: batteryRaw.wirelessCharging || 15,
      reverseWirelessCharging: batteryRaw.reverseWirelessCharging,
      chargingTime: batteryRaw.chargingTime || "0'dan 50%'ye 30 dakika",
      removable: batteryRaw.removable ?? false,
    },
    performance: {
      chipset: perfRaw.chipset || (raw.brand === "Apple" ? "Apple A18 Pro" : "Snapdragon 8 Elite"),
      cpu: perfRaw.cpu || "Sekiz Çekirdekli",
      gpu: perfRaw.gpu || "Yüksek Performans GPU",
      ram: parseNum(perfRaw.ram, 8),
      storage: parseNum(perfRaw.storage, 256),
      storageType: perfRaw.storageType || "UFS 4.0",
      expandableStorage: perfRaw.expandableStorage ?? false,
      antutuScore: perfRaw.antutuScore,
      geekbenchSingle: perfRaw.geekbenchSingle,
      geekbenchMulti: perfRaw.geekbenchMulti,
    },
    connectivity: {
      sim: connRaw.sim || "Nano-SIM + eSIM",
      nfc: connRaw.nfc ?? true,
      bluetooth: connRaw.bluetooth || "5.3",
      wifi: connRaw.wifi || "Wi-Fi 7",
      usb: connRaw.usb || "USB-C 3.2",
      fiveG: connRaw.fiveG ?? true,
      gps: connRaw.gps || ["GPS", "GLONASS", "Galileo"],
      network: connRaw.network || ["5G", "4G LTE"],
    },
    design: {
      width: designRaw.width || 77.6,
      height: designRaw.height || 163.0,
      thickness: designRaw.thickness || 8.25,
      weight: designRaw.weight || 227,
      materials: designRaw.materials || "Titanyum çerçeve, cam arka",
      colors: designRaw.colors || ["Doğal Titanyum", "Siyah Titanyum", "Beyaz Titanyum"],
      waterResistance: designRaw.waterResistance || "IP68",
      fingerprint: designRaw.fingerprint || (raw.brand === "Apple" ? "Face ID" : "Ekran altı"),
      faceId: designRaw.faceId ?? (raw.brand === "Apple"),
    },
    software: {
      os: softwareRaw.os || (raw.brand === "Apple" ? "iOS 18" : "Android 15"),
      androidVersion: softwareRaw.androidVersion,
      uiLayer: softwareRaw.uiLayer,
      updatePolicy: softwareRaw.updatePolicy || "5+ yıl güvenlik güncellemesi",
    },
  };

  // Stores prices mapping - only real direct product offers are kept
  const rawStores = Array.isArray(raw.storesPrices) ? raw.storesPrices : [];
  const storesPrices: StorePrice[] = rawStores
    .filter(isRealDirectStoreOffer)
    .map((sp: any) => ({
      store: sp.store || "Mağaza",
      storeSlug: sp.storeSlug || (sp.store || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
      sellerName: sp.sellerName || sp.store,
      sellerRating: sp.sellerRating || 9.5,
      price: Number(sp.price) || 0,
      url: sp.url || "",
      isAvailable: sp.isAvailable ?? true,
      lastUpdated: sp.lastUpdated || new Date().toISOString(),
      shippingText: sp.shippingText || "Ücretsiz Kargo",
      guaranteeText: sp.guaranteeText || "Resmi Distribütör Garantili",
      installmentText: sp.installmentText || "Peşin Fiyatına Taksit",
      isOfficial: sp.isOfficial ?? false,
    }))
    .sort((a: StorePrice, b: StorePrice) => a.price - b.price);

  const realLowestOffer = storesPrices.length > 0 ? storesPrices[0] : null;
  const lowestPrice = realLowestOffer ? realLowestOffer.price : (Number(raw.lowestPrice) || 0);
  const highestPrice = storesPrices.length > 0
    ? storesPrices[storesPrices.length - 1].price
    : (Number(raw.highestPrice) || lowestPrice);

  const lowestPriceStoreName = realLowestOffer ? realLowestOffer.store : undefined;
  const lowestPriceUrl = realLowestOffer ? realLowestOffer.url : undefined;

  const resolvedImage = getStudioPhotoUrl(raw.slug, raw.brand, raw.image);
  const resolvedImages =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.map((img: string) => (typeof img === "string" && img.endsWith(".svg") ? resolvedImage : img))
      : [resolvedImage];

  return {
    id: String(raw.id || raw.slug),
    slug: raw.slug,
    name: raw.name,
    brand: raw.brand || "Bilinmeyen",
    brandSlug: raw.brandSlug || (raw.brand || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
    image: resolvedImage,
    images: resolvedImages,
    lowestPrice,
    highestPrice,
    sixMonthLowestPrice: raw.sixMonthLowestPrice ? Number(raw.sixMonthLowestPrice) : undefined,
    lowestPriceStoreName,
    lowestPriceUrl,
    priceStore: lowestPriceStoreName || null,
    priceUrl: lowestPriceUrl || null,
    releaseDate: raw.releaseDate || new Date().toISOString(),
    isNew: raw.isNew ?? false,
    isPriceDropped: raw.isPriceDropped ?? false,
    priceDropPercent: raw.priceDropPercent !== undefined ? raw.priceDropPercent : null,
    rating: raw.rating ? Number(raw.rating) : 9.0,
    reviewCount: raw.reviewCount ? Number(raw.reviewCount) : 100,
    storesCount: storesPrices.length,
    storesPrices,
    specs,
    tags: raw.tags || [],
    description: raw.description,
  };
}

/**
 * Normalizes price history entries from backend
 */
export function normalizePriceHistory(raw: any[]): PriceHistory[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => ({
    date: item.date,
    price: Number(item.price) || 0,
    changePercent: item.changePercent ?? null,
    store: item.store || "En Ucuz Mağaza",
  }));
}
