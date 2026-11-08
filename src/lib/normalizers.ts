import type { Phone, PhoneSpecs, StorePrice, PriceHistory } from "@/types";

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

  // Stores prices mapping
  const storesPrices: StorePrice[] = Array.isArray(raw.storesPrices)
    ? raw.storesPrices.map((sp: any) => ({
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
    : [];

  const lowestPrice = Number(raw.lowestPrice) || 0;
  const highestPrice = Number(raw.highestPrice) || lowestPrice;

  return {
    id: String(raw.id || raw.slug),
    slug: raw.slug,
    name: raw.name,
    brand: raw.brand || "Bilinmeyen",
    brandSlug: raw.brandSlug || (raw.brand || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
    image: raw.image || "/images/phones/placeholder.webp",
    images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [raw.image || "/images/phones/placeholder.webp"],
    lowestPrice,
    highestPrice,
    sixMonthLowestPrice: raw.sixMonthLowestPrice ? Number(raw.sixMonthLowestPrice) : undefined,
    lowestPriceStoreName: raw.lowestPriceStoreName || storesPrices[0]?.store || undefined,
    lowestPriceUrl: raw.lowestPriceUrl || storesPrices[0]?.url || undefined,
    priceStore: raw.priceStore || raw.lowestPriceStoreName || storesPrices[0]?.store || null,
    priceUrl: raw.priceUrl || raw.lowestPriceUrl || storesPrices[0]?.url || null,
    releaseDate: raw.releaseDate || new Date().toISOString(),
    isNew: raw.isNew ?? false,
    isPriceDropped: raw.isPriceDropped ?? false,
    priceDropPercent: raw.priceDropPercent !== undefined ? raw.priceDropPercent : null,
    rating: raw.rating ? Number(raw.rating) : 9.0,
    reviewCount: raw.reviewCount ? Number(raw.reviewCount) : 100,
    storesCount: raw.storesCount || storesPrices.length || 1,
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
