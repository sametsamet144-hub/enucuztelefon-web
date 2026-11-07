// ============================================================
// EnUcuzTelefon.com - Core TypeScript Types
// ============================================================

// ─── Display ────────────────────────────────────────────────
export interface DisplaySpecs {
  size: number; // inches, e.g. 6.7
  resolution: string; // e.g. "2796 x 1290"
  technology: string; // e.g. "OLED", "AMOLED", "IPS LCD"
  refreshRate: number; // Hz, e.g. 120
  brightness: number; // nits, e.g. 2000
  aspectRatio: string; // e.g. "19.5:9"
  protection?: string; // e.g. "Corning Gorilla Glass Victus 2"
  hdr?: string; // e.g. "HDR10+", "Dolby Vision"
  ppi: number; // pixels per inch
}

// ─── Camera ─────────────────────────────────────────────────
export interface CameraSpecs {
  mainCamera: {
    megapixels: number;
    aperture: string; // e.g. "f/1.8"
    sensorSize?: string; // e.g. "1/1.56\""
    ois: boolean;
    autofocus: string; // e.g. "PDAF, Laser AF"
  };
  ultrawide?: {
    megapixels: number;
    aperture: string;
    fov: number; // field of view in degrees
  };
  telephoto?: {
    megapixels: number;
    aperture: string;
    opticalZoom: number;
    maxZoom?: number;
  };
  periscope?: {
    megapixels: number;
    aperture: string;
    opticalZoom: number;
    maxZoom?: number;
  };
  frontCamera: {
    megapixels: number;
    aperture: string;
    autofocus?: boolean | string;
  };
  videoCapabilities: string[]; // e.g. ["4K@60fps", "1080p@240fps"]
  features?: string[]; // e.g. ["Night Mode", "Portrait", "ProRAW"]
}

// ─── Battery ─────────────────────────────────────────────────
export interface BatterySpecs {
  capacity: number; // mAh
  wiredCharging: number; // watts
  wirelessCharging?: number; // watts, optional
  reverseWirelessCharging?: boolean;
  chargingTime?: string; // e.g. "0'dan 50%'ye 20 dakika"
  removable: boolean;
}

// ─── Performance ─────────────────────────────────────────────
export interface PerformanceSpecs {
  chipset: string; // e.g. "Apple A18 Pro"
  cpu: string; // e.g. "Hexa-core (2x3.78GHz + 4x2.11GHz)"
  gpu: string; // e.g. "Apple GPU (6-core)"
  ram: number; // GB
  storage: number; // GB
  storageType: string; // e.g. "NVMe", "UFS 4.0"
  expandableStorage: boolean;
  antutuScore?: number;
  geekbenchSingle?: number;
  geekbenchMulti?: number;
}

// ─── Connectivity ─────────────────────────────────────────────
export interface ConnectivitySpecs {
  sim: string; // e.g. "Nano SIM + eSIM"
  nfc: boolean;
  bluetooth: string; // e.g. "5.3"
  wifi: string; // e.g. "Wi-Fi 6E (802.11ax)"
  usb: string; // e.g. "USB-C 3.2 Gen 2"
  gps?: string[]; // e.g. ["GPS", "GLONASS", "Galileo"]
  network?: string[]; // e.g. ["5G", "4G LTE", "3G", "2G"]
  fiveG?: boolean;
  infrared?: boolean;
  satelliteConnectivity?: boolean;
}

// ─── Design ──────────────────────────────────────────────────
export interface DesignSpecs {
  width: number; // mm
  height: number; // mm
  thickness: number; // mm
  weight: number; // grams
  materials: string; // e.g. "Alüminyum çerçeve, cam arka"
  colors: string[]; // e.g. ["Siyah Titanyum", "Doğal Titanyum"]
  waterResistance: string; // e.g. "IP68"
  fingerprint: string; // e.g. "Ekran altı optik", "Yan baskı"
  faceId: boolean;
}

// ─── Software ────────────────────────────────────────────────
export interface SoftwareSpecs {
  os: string; // e.g. "iOS 18"
  androidVersion?: number;
  uiLayer?: string; // e.g. "One UI 7", "MIUI 15"
  updatePolicy?: string; // e.g. "7 yıl Android güncellemesi"
}

// ─── PhoneSpecs (composite) ────────────────────────────────
export interface PhoneSpecs {
  display: DisplaySpecs;
  camera: CameraSpecs;
  battery: BatterySpecs;
  performance: PerformanceSpecs;
  connectivity: ConnectivitySpecs;
  design?: DesignSpecs;
  software?: SoftwareSpecs;
}

// ─── StorePrice ──────────────────────────────────────────────
export interface StorePrice {
  store: string; // e.g. "Trendyol"
  storeSlug: string; // e.g. "trendyol"
  sellerName?: string; // e.g. "Apple Türkiye Resmi Satıcı", "Amazon.com.tr"
  sellerRating?: number; // e.g. 9.8
  price: number; // TRY
  url: string;
  isAvailable: boolean;
  lastUpdated: string; // ISO date
  shippingText?: string; // e.g. "Ücretsiz Kargo • Aynı Gün"
  guaranteeText?: string; // e.g. "2 Yıl Resmi Distribütör Garantili"
  installmentText?: string; // e.g. "Peşin Fiyatına 3 Taksit"
  isOfficial?: boolean;
}

// ─── PriceHistory ────────────────────────────────────────────
export interface PriceHistory {
  date: string; // ISO date
  price: number; // TRY
  store: string;
}

// ─── Phone ───────────────────────────────────────────────────
export interface Phone {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  image: string;
  images: string[];
  lowestPrice: number;
  highestPrice: number;
  sixMonthLowestPrice?: number;
  priceStore?: string | null;
  priceUrl?: string | null;
  releaseDate: string; // ISO date
  isNew: boolean;
  isPriceDropped: boolean;
  priceDropPercent?: number;
  specs: PhoneSpecs;
  storesPrices: StorePrice[];
  rating?: number; // 0–10
  reviewCount?: number;
  tags?: string[];
  description?: string;
}

// ─── Brand ───────────────────────────────────────────────────
export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  phoneCount: number;
  country: string;
  description?: string;
  website?: string;
  foundedYear?: number;
}

// ─── Guide ───────────────────────────────────────────────────
export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date
  readingTime: number; // minutes
  author?: string;
  relatedPhones?: string[];
}

// ─── QAItem ──────────────────────────────────────────────────
export interface QAItem {
  id: string;
  slug: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  relatedPhones?: string[];
  relatedGuides?: string[];
  helpful: number;
  publishedAt?: string;
}

// ─── FilterOptions ───────────────────────────────────────────
export interface FilterOptions {
  brands: string[];
  priceRange: [number, number];
  ram: number[];
  storage: number[];
  screenSize: [number, number];
  battery: number[];
  os: string[];
  features: string[];
  sortBy?: SortOption;
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating"
  | "name-asc"
  | "name-desc"
  | "price-drop";

// ─── NavItem ─────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

// ─── SearchResult ────────────────────────────────────────────
export interface SearchResult {
  phones: Phone[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── CompareItem ─────────────────────────────────────────────
export interface CompareItem {
  phone: Phone;
  addedAt: string;
}

// ─── Breadcrumb ──────────────────────────────────────────────
export interface Breadcrumb {
  label: string;
  href?: string;
}

// ─── SiteStats ───────────────────────────────────────────────
export interface SiteStats {
  totalPhones: number;
  totalBrands: number;
  totalStores: number;
  lastUpdated: string;
}


// ─── StoreInfo ────────────────────────────────────────────────
export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  website: string;
  type: string;
  typeLabel: string;
  status: string;
  integrationMethod?: string;
  productCount?: number;
  verifiedPriceCount: number;
  lastSyncTime?: string;
  lastErrorTime?: string | null;
  failedRecordCount?: number;
  isVerified?: boolean;
  reliabilityScore: number;
  shippingInfo: string;
  returnPolicy: string;
  distributorGuarantee: boolean;
}
