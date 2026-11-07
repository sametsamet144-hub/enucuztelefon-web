const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const phonesImgDir = path.join(projectDir, 'public', 'images', 'phones');

if (!fs.existsSync(phonesImgDir)) {
  fs.mkdirSync(phonesImgDir, { recursive: true });
}

const BRAND_COLORS = {
  apple: ['#2563eb', '#38bdf8'],
  samsung: ['#1e40af', '#60a5fa'],
  xiaomi: ['#ea580c', '#fb923c'],
  redmi: ['#dc2626', '#f87171'],
  poco: ['#ca8a04', '#facc15'],
  honor: ['#7c3aed', '#c084fc'],
  huawei: ['#be123c', '#fb7185'],
  oppo: ['#059669', '#34d399'],
  vivo: ['#1d4ed8', '#60a5fa'],
  iqoo: ['#d97706', '#fbbf24'],
  realme: ['#ca8a04', '#fde047'],
  oneplus: ['#dc2626', '#fca5a5'],
  motorola: ['#4338ca', '#818cf8'],
  nothing: ['#334155', '#94a3b8'],
  cmf: ['#ea580c', '#fdba74'],
  google: ['#0284c7', '#7dd3fc'],
  sony: ['#1e293b', '#64748b'],
  asus: ['#991b1b', '#f87171'],
  lenovo: ['#1d4ed8', '#93c5fd'],
  zte: ['#0369a1', '#38bdf8'],
  nubia: ['#b91c1c', '#fca5a5'],
  redmagic: ['#991b1b', '#ef4444'],
  tecno: ['#1d4ed8', '#60a5fa'],
  infinix: ['#047857', '#34d399'],
  tcl: ['#be123c', '#fda4af'],
  meizu: ['#0284c7', '#7dd3fc'],
  sharp: ['#0f766e', '#5eead4'],
  fairphone: ['#15803d', '#86efac'],
  hmd: ['#be185d', '#f472b6'],
  nokia: ['#1e3a8a', '#60a5fa'],
  'general-mobile': ['#0284c7', '#38bdf8'],
  casper: ['#1e40af', '#60a5fa'],
  reeder: ['#059669', '#34d399'],
  omix: ['#6d28d9', '#a78bfa'],
};

function ensurePhoneImage(slug, brand, modelName, brandSlug) {
  const webpPath = path.join(phonesImgDir, `${slug}.webp`);
  const svgPath = path.join(phonesImgDir, `${slug}.svg`);

  if (fs.existsSync(webpPath)) {
    return `/images/phones/${slug}.webp`;
  }
  const [primaryColor, accentColor] = BRAND_COLORS[brandSlug] || ['#0284c7', '#38bdf8'];
  const shortModel = modelName.replace(new RegExp(`^${brand}\\s+`, 'i'), '');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="45%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="${accentColor}"/>
    </linearGradient>
    <linearGradient id="rim_${slug}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
  </defs>
  <rect x="42" y="22" width="236" height="436" rx="42" fill="url(#rim_${slug})"/>
  <rect x="46" y="26" width="228" height="428" rx="38" fill="#0f172a"/>
  <rect x="53" y="33" width="214" height="414" rx="32" fill="url(#bg_${slug})"/>
  <circle cx="160" cy="175" r="95" fill="${primaryColor}" opacity="0.28"/>
  <circle cx="205" cy="315" r="80" fill="${accentColor}" opacity="0.24"/>
  <rect x="130" y="44" width="60" height="14" rx="7" fill="#020617"/>
  <circle cx="176" cy="51" r="3" fill="#38bdf8"/>
  <text x="160" y="112" font-family="sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">12:45</text>
  <text x="160" y="132" font-family="sans-serif" font-size="10" font-weight="700" fill="#bae6fd" text-anchor="middle">5G • TÜRKİYE GARANTİLİ</text>
  <rect x="68" y="212" width="184" height="68" rx="14" fill="#0f172a" fill-opacity="0.78" stroke="#ffffff" stroke-opacity="0.22"/>
  <text x="160" y="238" font-family="sans-serif" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle">${brand.toUpperCase()}</text>
  <text x="160" y="260" font-family="sans-serif" font-size="11.5" font-weight="800" fill="#ffffff" text-anchor="middle">${shortModel.length > 22 ? shortModel.slice(0, 20) + '..' : shortModel}</text>
  <rect x="120" y="434" width="80" height="4" rx="2" fill="#ffffff" opacity="0.65"/>
</svg>`;

  fs.writeFileSync(svgPath, svgContent);
  return `/images/phones/${slug}.svg`;
}

const STORES = [
  { store: "Trendyol", storeSlug: "trendyol", seller: "Trendyol Doğrulanmış Satıcı", baseDelta: 0, rating: 9.8, ship: "Hızlı Teslimat • Ücretsiz Kargo" },
  { store: "Hepsiburada", storeSlug: "hepsiburada", seller: "Hepsiburada Resmi", baseDelta: 249, rating: 9.7, ship: "HepsiJET ile Yarın Kapında" },
  { store: "Amazon TR", storeSlug: "amazon", seller: "Amazon Türkiye", baseDelta: 399, rating: 9.9, ship: "Prime ile Ertesi Gün Teslimat" },
  { store: "Teknosa", storeSlug: "teknosa", seller: "Teknosa Mağazacılık", baseDelta: 699, rating: 9.5, ship: "Mağazadan Hemen Teslim Al" },
  { store: "MediaMarkt", storeSlug: "mediamarkt", seller: "MediaMarkt Türkiye", baseDelta: 850, rating: 9.6, ship: "2 Yıl Kasko Seçeneği" },
  { store: "Vatan Bilgisayar", storeSlug: "vatan", seller: "Vatan Bilgisayar A.Ş.", baseDelta: 990, rating: 9.5, ship: "Tüm Türkiye 81 İl Mağaza" },
  { store: "n11", storeSlug: "n11", seller: "n11 Yetkili Teknoloji", baseDelta: 1100, rating: 9.3, ship: "Kupon Fırsatıyla İndirim" },
  { store: "Pazarama", storeSlug: "pazarama", seller: "Pazarama Güvencesi", baseDelta: 1250, rating: 9.4, ship: "İş Bankası MaxiPuan Fırsatı" },
  { store: "PttAVM", storeSlug: "pttavm", seller: "PttAVM Resmi Satıcı", baseDelta: 1390, rating: 9.1, ship: "PTT Kargo Güvencesi" },
  { store: "ÇiçekSepeti", storeSlug: "ciceksepeti", seller: "ÇiçekSepeti Extra", baseDelta: 1450, rating: 9.0, ship: "Ekstra Güvenli Teslimat" },
  { store: "Turkcell Pasaj", storeSlug: "turkcell", seller: "Turkcell Pasaj Resmi", baseDelta: 1600, rating: 9.6, ship: "Faturaya Ek 12 Taksit" },
  { store: "Vodafone", storeSlug: "vodafone", seller: "Vodafone Yanımda", baseDelta: 1750, rating: 9.4, ship: "Vodafone Tarifelerine Özel" },
  { store: "Türk Telekom", storeSlug: "turk-telekom", seller: "Türk Telekom Mağazaları", baseDelta: 1890, rating: 9.3, ship: "Evde İnternete Ek Taksit" },
  { store: "İtopya", storeSlug: "itopya", seller: "İtopya Bilişim", baseDelta: 2100, rating: 9.7, ship: "Gaming Uzmanı Satıcı" },
  { store: "Sinerji", storeSlug: "sinerji", seller: "Sinerji Bilgisayar", baseDelta: 2250, rating: 9.5, ship: "Aynı Gün Kargoda" },
  { store: "Resmî Mağaza", storeSlug: "official-store", seller: "Resmi Distribütör Türkiye", baseDelta: 2900, rating: 10.0, ship: "2 Yıl Birebir Değişim Garantisi" }
];

function generateStores(basePrice, phoneSlug) {
  return STORES.map((s, idx) => {
    const jitter = Math.round((idx * 137 + (basePrice % 73)) % 350);
    return {
      store: s.store,
      storeSlug: s.storeSlug,
      sellerName: s.seller,
      sellerRating: s.rating,
      price: basePrice + s.baseDelta + jitter,
      url: `https://www.${s.storeSlug === 'official-store' ? 'enucuztelefon.com' : s.storeSlug + '.com.tr'}/urun/${phoneSlug}`,
      isAvailable: true,
      lastUpdated: new Date(Date.now() - idx * 3600000).toISOString(),
      shippingText: s.ship,
      guaranteeText: "2 Yıl Resmi Distribütör Garantili",
      installmentText: "Peşin Fiyatına 3 Taksit",
      isOfficial: idx === 0 || s.storeSlug === 'official-store'
    };
  }).sort((a, b) => a.price - b.price);
}

// Tuple format: [name, brand, brandSlug, price, chipset, size, tech, hz, mp, ois, bat, wire, ram, storage, isNew]
const MODELS = [
  // ═══ 1. APPLE (iPhone 17, 16, 15, 14, 13, 12, 11, Air, SE, Pro, Pro Max, Plus) ═══
  ["iPhone 17 Pro Max", "Apple", "apple", 89999, "Apple A19 Pro (2nm)", 6.9, "LTPO Super Retina XDR OLED", 120, 48, true, 4850, 45, 12, 256, true],
  ["iPhone 17 Pro", "Apple", "apple", 79999, "Apple A19 Pro (2nm)", 6.3, "LTPO Super Retina XDR OLED", 120, 48, true, 3750, 45, 12, 256, true],
  ["iPhone 17 Air", "Apple", "apple", 64999, "Apple A19 (2nm)", 6.6, "Super Retina XDR OLED", 120, 48, true, 3900, 35, 8, 256, true],
  ["iPhone 17 Plus", "Apple", "apple", 61999, "Apple A19 (2nm)", 6.7, "Super Retina XDR OLED", 120, 48, true, 4700, 35, 8, 256, true],
  ["iPhone 17", "Apple", "apple", 54999, "Apple A19 (2nm)", 6.1, "Super Retina XDR OLED", 120, 48, true, 3650, 35, 8, 128, true],
  ["iPhone 16 Pro Max", "Apple", "apple", 74999, "Apple A18 Pro (3nm)", 6.9, "Super Retina XDR OLED", 120, 48, true, 4685, 45, 8, 256, true],
  ["iPhone 16 Pro", "Apple", "apple", 66999, "Apple A18 Pro (3nm)", 6.3, "Super Retina XDR OLED", 120, 48, true, 3582, 45, 8, 128, true],
  ["iPhone 16 Plus", "Apple", "apple", 54999, "Apple A18 (3nm)", 6.7, "Super Retina XDR OLED", 60, 48, true, 4674, 30, 8, 128, true],
  ["iPhone 16", "Apple", "apple", 46999, "Apple A18 (3nm)", 6.1, "Super Retina XDR OLED", 60, 48, true, 3561, 30, 8, 128, true],
  ["iPhone 16e", "Apple", "apple", 34999, "Apple A18 (3nm)", 6.1, "Super Retina OLED", 60, 48, true, 3500, 25, 8, 128, true],
  ["iPhone Air", "Apple", "apple", 58999, "Apple A19 (2nm)", 6.55, "ProMotion OLED", 120, 48, true, 3850, 35, 8, 256, true],
  ["iPhone 15 Pro Max", "Apple", "apple", 61999, "Apple A17 Pro (3nm)", 6.7, "Super Retina XDR OLED", 120, 48, true, 4441, 27, 8, 256, false],
  ["iPhone 15 Pro", "Apple", "apple", 52999, "Apple A17 Pro (3nm)", 6.1, "Super Retina XDR OLED", 120, 48, true, 3274, 27, 8, 128, false],
  ["iPhone 15 Plus", "Apple", "apple", 45999, "Apple A16 Bionic (4nm)", 6.7, "Super Retina XDR OLED", 60, 48, true, 4383, 25, 6, 128, false],
  ["iPhone 15", "Apple", "apple", 39999, "Apple A16 Bionic (4nm)", 6.1, "Super Retina XDR OLED", 60, 48, true, 3349, 25, 6, 128, false],
  ["iPhone 14 Pro Max", "Apple", "apple", 51999, "Apple A16 Bionic (4nm)", 6.7, "Super Retina XDR OLED", 120, 48, true, 4323, 27, 6, 128, false],
  ["iPhone 14 Pro", "Apple", "apple", 44999, "Apple A16 Bionic (4nm)", 6.1, "Super Retina XDR OLED", 120, 48, true, 3200, 25, 6, 128, false],
  ["iPhone 14 Plus", "Apple", "apple", 38999, "Apple A15 Bionic (5nm)", 6.7, "Super Retina XDR OLED", 60, 12, true, 4325, 20, 6, 128, false],
  ["iPhone 14", "Apple", "apple", 33999, "Apple A15 Bionic (5nm)", 6.1, "Super Retina XDR OLED", 60, 12, true, 3279, 20, 6, 128, false],
  ["iPhone 13 Pro Max", "Apple", "apple", 42999, "Apple A15 Bionic (5nm)", 6.7, "Super Retina XDR OLED", 120, 12, true, 4352, 27, 6, 128, false],
  ["iPhone 13 Pro", "Apple", "apple", 37999, "Apple A15 Bionic (5nm)", 6.1, "Super Retina XDR OLED", 120, 12, true, 3095, 23, 6, 128, false],
  ["iPhone 13", "Apple", "apple", 27999, "Apple A15 Bionic (5nm)", 6.1, "Super Retina XDR OLED", 60, 12, true, 3227, 20, 4, 128, false],
  ["iPhone 13 mini", "Apple", "apple", 25999, "Apple A15 Bionic (5nm)", 5.4, "Super Retina XDR OLED", 60, 12, true, 2438, 20, 4, 128, false],
  ["iPhone 12", "Apple", "apple", 22999, "Apple A14 Bionic (5nm)", 6.1, "Super Retina XDR OLED", 60, 12, true, 2815, 20, 4, 64, false],
  ["iPhone 11", "Apple", "apple", 18999, "Apple A13 Bionic (7nm)", 6.1, "Liquid Retina IPS LCD", 60, 12, true, 3110, 18, 4, 64, false],
  ["iPhone SE (4. Nesil)", "Apple", "apple", 26999, "Apple A18 (3nm)", 6.1, "Super Retina OLED", 60, 48, true, 3279, 25, 8, 128, true],
  ["iPhone SE (3. Nesil)", "Apple", "apple", 17499, "Apple A15 Bionic (5nm)", 4.7, "Retina IPS LCD", 60, 12, true, 2018, 20, 4, 64, false],

  // ═══ 2. SAMSUNG (Galaxy S26, S25, S24, S23, S22, S FE, Z Fold, Z Flip, A, M, F) ═══
  ["Samsung Galaxy S26 Ultra", "Samsung", "samsung", 84999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.9, "Dynamic AMOLED 3X", 144, 200, true, 5500, 65, 16, 512, true],
  ["Samsung Galaxy S26+", "Samsung", "samsung", 62999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.7, "Dynamic AMOLED 3X", 120, 50, true, 5000, 45, 12, 256, true],
  ["Samsung Galaxy S26", "Samsung", "samsung", 51999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.2, "Dynamic AMOLED 3X", 120, 50, true, 4300, 45, 12, 256, true],
  ["Samsung Galaxy S25 Ultra", "Samsung", "samsung", 69999, "Snapdragon 8 Elite (3nm)", 6.9, "Dynamic AMOLED 2X", 120, 200, true, 5000, 45, 12, 256, true],
  ["Samsung Galaxy S25+", "Samsung", "samsung", 52999, "Snapdragon 8 Elite (3nm)", 6.7, "Dynamic AMOLED 2X", 120, 50, true, 4900, 45, 12, 256, true],
  ["Samsung Galaxy S25", "Samsung", "samsung", 43999, "Snapdragon 8 Elite (3nm)", 6.2, "Dynamic AMOLED 2X", 120, 50, true, 4000, 25, 12, 128, true],
  ["Samsung Galaxy S25 Edge", "Samsung", "samsung", 57999, "Snapdragon 8 Elite (3nm)", 6.7, "Dynamic AMOLED 2X Slim", 120, 200, true, 4000, 45, 12, 256, true],
  ["Samsung Galaxy S25 FE", "Samsung", "samsung", 33999, "Samsung Exynos 2500 (3nm)", 6.7, "Dynamic AMOLED 2X", 120, 50, true, 4800, 45, 8, 256, true],
  ["Samsung Galaxy S24 Ultra", "Samsung", "samsung", 56999, "Snapdragon 8 Gen 3 (4nm)", 6.8, "Dynamic AMOLED 2X", 120, 200, true, 5000, 45, 12, 256, false],
  ["Samsung Galaxy S24+", "Samsung", "samsung", 41999, "Samsung Exynos 2400 (4nm)", 6.7, "Dynamic AMOLED 2X", 120, 50, true, 4900, 45, 12, 256, false],
  ["Samsung Galaxy S24", "Samsung", "samsung", 34999, "Samsung Exynos 2400 (4nm)", 6.2, "Dynamic AMOLED 2X", 120, 50, true, 4000, 25, 8, 128, false],
  ["Samsung Galaxy S24 FE", "Samsung", "samsung", 28999, "Samsung Exynos 2400e (4nm)", 6.7, "Dynamic AMOLED 2X", 120, 50, true, 4700, 25, 8, 128, true],
  ["Samsung Galaxy S23 Ultra", "Samsung", "samsung", 45999, "Snapdragon 8 Gen 2 (4nm)", 6.8, "Dynamic AMOLED 2X", 120, 200, true, 5000, 45, 12, 256, false],
  ["Samsung Galaxy S23+", "Samsung", "samsung", 35999, "Snapdragon 8 Gen 2 (4nm)", 6.6, "Dynamic AMOLED 2X", 120, 50, true, 4700, 45, 8, 256, false],
  ["Samsung Galaxy S23", "Samsung", "samsung", 28999, "Snapdragon 8 Gen 2 (4nm)", 6.1, "Dynamic AMOLED 2X", 120, 50, true, 3900, 25, 8, 128, false],
  ["Samsung Galaxy S23 FE", "Samsung", "samsung", 21999, "Samsung Exynos 2200 (4nm)", 6.4, "Dynamic AMOLED 2X", 120, 50, true, 4500, 25, 8, 128, false],
  ["Samsung Galaxy S22 Ultra", "Samsung", "samsung", 36999, "Snapdragon 8 Gen 1 (4nm)", 6.8, "Dynamic AMOLED 2X", 120, 108, true, 5000, 45, 12, 256, false],
  ["Samsung Galaxy S22", "Samsung", "samsung", 22499, "Snapdragon 8 Gen 1 (4nm)", 6.1, "Dynamic AMOLED 2X", 120, 50, true, 3700, 25, 8, 128, false],
  ["Samsung Galaxy Z Fold 6", "Samsung", "samsung", 78999, "Snapdragon 8 Gen 3 (4nm)", 7.6, "Foldable Dynamic AMOLED 2X", 120, 50, true, 4400, 25, 12, 256, true],
  ["Samsung Galaxy Z Fold 5", "Samsung", "samsung", 59999, "Snapdragon 8 Gen 2 (4nm)", 7.6, "Foldable Dynamic AMOLED 2X", 120, 50, true, 4400, 25, 12, 256, false],
  ["Samsung Galaxy Z Fold 4", "Samsung", "samsung", 46999, "Snapdragon 8+ Gen 1 (4nm)", 7.6, "Foldable Dynamic AMOLED 2X", 120, 50, true, 4400, 25, 12, 256, false],
  ["Samsung Galaxy Z Flip 6", "Samsung", "samsung", 45999, "Snapdragon 8 Gen 3 (4nm)", 6.7, "Foldable Dynamic AMOLED 2X", 120, 50, true, 4000, 25, 12, 256, true],
  ["Samsung Galaxy Z Flip 5", "Samsung", "samsung", 33999, "Snapdragon 8 Gen 2 (4nm)", 6.7, "Foldable Dynamic AMOLED 2X", 120, 12, true, 3700, 25, 8, 256, false],
  ["Samsung Galaxy Z Flip 4", "Samsung", "samsung", 25999, "Snapdragon 8+ Gen 1 (4nm)", 6.7, "Foldable Dynamic AMOLED 2X", 120, 12, true, 3700, 25, 8, 128, false],
  ["Samsung Galaxy A57 5G", "Samsung", "samsung", 21999, "Samsung Exynos 1680 (4nm)", 6.7, "Super AMOLED", 120, 50, true, 5000, 45, 8, 256, true],
  ["Samsung Galaxy A56", "Samsung", "samsung", 18999, "Samsung Exynos 1580 (4nm)", 6.6, "Super AMOLED", 120, 50, true, 5000, 45, 8, 128, true],
  ["Samsung Galaxy A55", "Samsung", "samsung", 16499, "Samsung Exynos 1480 (4nm)", 6.6, "Super AMOLED", 120, 50, true, 5000, 25, 8, 128, false],
  ["Samsung Galaxy A54 5G", "Samsung", "samsung", 14999, "Samsung Exynos 1380 (5nm)", 6.4, "Super AMOLED", 120, 50, true, 5000, 25, 8, 128, false],
  ["Samsung Galaxy A36", "Samsung", "samsung", 14999, "Snapdragon 7s Gen 2 (4nm)", 6.6, "Super AMOLED", 120, 50, true, 5000, 45, 8, 128, true],
  ["Samsung Galaxy A35", "Samsung", "samsung", 13299, "Samsung Exynos 1380 (5nm)", 6.6, "Super AMOLED", 120, 50, true, 5000, 25, 8, 128, false],
  ["Samsung Galaxy A34 5G", "Samsung", "samsung", 11999, "MediaTek Dimensity 1080 (6nm)", 6.6, "Super AMOLED", 120, 48, true, 5000, 25, 8, 128, false],
  ["Samsung Galaxy A26 5G", "Samsung", "samsung", 11999, "Samsung Exynos 1280+ (5nm)", 6.6, "Super AMOLED", 120, 50, true, 5000, 25, 6, 128, true],
  ["Samsung Galaxy A25 5G", "Samsung", "samsung", 10499, "Samsung Exynos 1280 (5nm)", 6.5, "Super AMOLED", 120, 50, true, 5000, 25, 6, 128, false],
  ["Samsung Galaxy A24", "Samsung", "samsung", 8999, "MediaTek Helio G99 (6nm)", 6.5, "Super AMOLED", 90, 50, true, 5000, 25, 6, 128, false],
  ["Samsung Galaxy A17 5G", "Samsung", "samsung", 9999, "MediaTek Dimensity 6300+", 6.7, "Super AMOLED", 90, 50, false, 5000, 25, 6, 128, true],
  ["Samsung Galaxy A16 5G", "Samsung", "samsung", 8999, "MediaTek Dimensity 6300 (6nm)", 6.7, "Super AMOLED", 90, 50, false, 5000, 25, 4, 128, true],
  ["Samsung Galaxy A15", "Samsung", "samsung", 7499, "MediaTek Helio G99 (6nm)", 6.5, "Super AMOLED", 90, 50, false, 5000, 25, 6, 128, false],
  ["Samsung Galaxy A06", "Samsung", "samsung", 5999, "MediaTek Helio G85", 6.7, "PLS LCD", 60, 50, false, 5000, 25, 4, 64, true],
  ["Samsung Galaxy M55 5G", "Samsung", "samsung", 13999, "Snapdragon 7 Gen 1 (4nm)", 6.7, "Super AMOLED Plus", 120, 50, true, 5000, 45, 8, 128, false],
  ["Samsung Galaxy M35 5G", "Samsung", "samsung", 11499, "Samsung Exynos 1380 (5nm)", 6.6, "Super AMOLED", 120, 50, true, 6000, 25, 8, 128, true],
  ["Samsung Galaxy M34 5G", "Samsung", "samsung", 9799, "Samsung Exynos 1280 (5nm)", 6.5, "Super AMOLED", 120, 50, true, 6000, 25, 6, 128, false],
  ["Samsung Galaxy M15 5G", "Samsung", "samsung", 7999, "MediaTek Dimensity 6100+ (6nm)", 6.5, "Super AMOLED", 90, 50, false, 6000, 25, 4, 128, false],
  ["Samsung Galaxy F55 5G", "Samsung", "samsung", 13499, "Snapdragon 7 Gen 1 (4nm)", 6.7, "Super AMOLED+", 120, 50, true, 5000, 45, 8, 128, false],
  ["Samsung Galaxy F34 5G", "Samsung", "samsung", 9499, "Samsung Exynos 1280 (5nm)", 6.5, "Super AMOLED", 120, 50, true, 6000, 25, 6, 128, false],

  // ═══ 3. XIAOMI (17, 15, 14, 13, 12, T, T Pro, MIX, Civi) ═══
  ["Xiaomi 17 Ultra", "Xiaomi", "xiaomi", 69999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.8, "LTPO AMOLED 2K", 144, 200, true, 6200, 120, 16, 512, true],
  ["Xiaomi 17 Pro", "Xiaomi", "xiaomi", 52999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.73, "LTPO AMOLED 2K", 120, 50, true, 6100, 120, 16, 512, true],
  ["Xiaomi 17", "Xiaomi", "xiaomi", 42999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.36, "LTPO OLED", 120, 50, true, 5500, 90, 12, 256, true],
  ["Xiaomi 15 Ultra", "Xiaomi", "xiaomi", 59999, "Snapdragon 8 Elite (3nm)", 6.73, "LTPO AMOLED 2K", 120, 200, true, 6000, 90, 16, 512, true],
  ["Xiaomi 15 Pro", "Xiaomi", "xiaomi", 42999, "Snapdragon 8 Elite (3nm)", 6.73, "LTPO OLED 2K", 120, 50, true, 6100, 90, 16, 512, true],
  ["Xiaomi 15", "Xiaomi", "xiaomi", 36999, "Snapdragon 8 Elite (3nm)", 6.36, "LTPO OLED", 120, 50, true, 5400, 90, 12, 256, true],
  ["Xiaomi 14 Ultra", "Xiaomi", "xiaomi", 51999, "Snapdragon 8 Gen 3 (4nm)", 6.73, "LTPO AMOLED 2K", 120, 50, true, 5000, 90, 16, 512, false],
  ["Xiaomi 14 Pro", "Xiaomi", "xiaomi", 39999, "Snapdragon 8 Gen 3 (4nm)", 6.73, "LTPO AMOLED 2K", 120, 50, true, 4880, 120, 12, 256, false],
  ["Xiaomi 14", "Xiaomi", "xiaomi", 31999, "Snapdragon 8 Gen 3 (4nm)", 6.36, "LTPO OLED", 120, 50, true, 4610, 90, 12, 256, false],
  ["Xiaomi 14T Pro", "Xiaomi", "xiaomi", 32999, "MediaTek Dimensity 9300+ (4nm)", 6.67, "AMOLED 1.5K", 144, 50, true, 5000, 120, 12, 512, true],
  ["Xiaomi 14T", "Xiaomi", "xiaomi", 24999, "MediaTek Dimensity 8300 Ultra (4nm)", 6.67, "AMOLED 1.5K", 144, 50, true, 5000, 67, 12, 256, true],
  ["Xiaomi 13 Ultra", "Xiaomi", "xiaomi", 38999, "Snapdragon 8 Gen 2 (4nm)", 6.73, "LTPO AMOLED 2K", 120, 50, true, 5000, 90, 16, 512, false],
  ["Xiaomi 13 Pro", "Xiaomi", "xiaomi", 31999, "Snapdragon 8 Gen 2 (4nm)", 6.73, "LTPO AMOLED 2K", 120, 50, true, 4820, 120, 12, 256, false],
  ["Xiaomi 13", "Xiaomi", "xiaomi", 25999, "Snapdragon 8 Gen 2 (4nm)", 6.36, "AMOLED", 120, 50, true, 4500, 67, 8, 256, false],
  ["Xiaomi 13T Pro", "Xiaomi", "xiaomi", 26999, "MediaTek Dimensity 9200+ (4nm)", 6.67, "AMOLED", 144, 50, true, 5000, 120, 12, 512, false],
  ["Xiaomi 13T", "Xiaomi", "xiaomi", 20999, "MediaTek Dimensity 8200 Ultra (4nm)", 6.67, "AMOLED", 144, 50, true, 5000, 67, 8, 256, false],
  ["Xiaomi 13 Lite", "Xiaomi", "xiaomi", 14999, "Snapdragon 7 Gen 1 (4nm)", 6.55, "AMOLED", 120, 50, false, 4500, 67, 8, 128, false],
  ["Xiaomi MIX Fold 4", "Xiaomi", "xiaomi", 64999, "Snapdragon 8 Gen 3 (4nm)", 7.98, "Foldable LTPO OLED", 120, 50, true, 5100, 67, 16, 512, true],
  ["Xiaomi MIX Flip", "Xiaomi", "xiaomi", 42999, "Snapdragon 8 Gen 3 (4nm)", 6.86, "Foldable LTPO AMOLED", 120, 50, true, 4780, 67, 12, 512, true],
  ["Xiaomi Civi 4 Pro", "Xiaomi", "xiaomi", 24999, "Snapdragon 8s Gen 3 (4nm)", 6.55, "AMOLED 1.5K Leica", 120, 50, true, 4700, 67, 12, 256, true],

  // ═══ 4. REDMI (Note 17, 15, 14, 13, 12, Pro, Pro+, K, A, Number) ═══
  ["Redmi Note 17 Pro+ 5G", "Redmi", "redmi", 21999, "Snapdragon 7+ Gen 4 (4nm)", 6.67, "AMOLED 1.5K", 120, 200, true, 6500, 120, 12, 512, true],
  ["Redmi Note 17 Pro 5G", "Redmi", "redmi", 18499, "MediaTek Dimensity 7400", 6.67, "AMOLED 1.5K", 120, 200, true, 6000, 90, 8, 256, true],
  ["Redmi Note 15 Pro+ 5G", "Redmi", "redmi", 19499, "Snapdragon 7s Gen 3+", 6.67, "AMOLED 1.5K", 120, 200, true, 6200, 120, 12, 512, true],
  ["Redmi Note 15 Pro 5G", "Redmi", "redmi", 16499, "MediaTek Dimensity 7350", 6.67, "AMOLED 1.5K", 120, 200, true, 5800, 67, 8, 256, true],
  ["Redmi Note 14 Pro+", "Redmi", "redmi", 14999, "Snapdragon 7s Gen 3 (4nm)", 6.67, "AMOLED 1.5K", 120, 50, true, 6200, 90, 12, 256, true],
  ["Redmi Note 14 Pro 5G", "Redmi", "redmi", 13499, "MediaTek Dimensity 7300 Ultra (4nm)", 6.67, "AMOLED 1.5K", 120, 50, true, 5500, 45, 8, 256, true],
  ["Redmi Note 14 5G", "Redmi", "redmi", 10999, "MediaTek Dimensity 7025 Ultra (6nm)", 6.67, "AMOLED", 120, 50, true, 5110, 45, 8, 128, true],
  ["Redmi Note 13 Pro+ 5G", "Redmi", "redmi", 16499, "MediaTek Dimensity 7200 Ultra (4nm)", 6.67, "AMOLED 1.5K", 120, 200, true, 5000, 120, 12, 512, false],
  ["Redmi Note 13 Pro 5G", "Redmi", "redmi", 13999, "Snapdragon 7s Gen 2 (4nm)", 6.67, "AMOLED 1.5K", 120, 200, true, 5100, 67, 8, 256, false],
  ["Redmi Note 13 Pro", "Redmi", "redmi", 11999, "MediaTek Helio G99 Ultra (6nm)", 6.67, "AMOLED", 120, 200, true, 5000, 67, 8, 256, false],
  ["Redmi Note 13", "Redmi", "redmi", 8999, "Snapdragon 685 (6nm)", 6.67, "AMOLED", 120, 108, false, 5000, 33, 8, 128, false],
  ["Redmi Note 12 Pro+ 5G", "Redmi", "redmi", 13499, "MediaTek Dimensity 1080 (6nm)", 6.67, "AMOLED", 120, 200, true, 5000, 120, 8, 256, false],
  ["Redmi Note 12 Pro 5G", "Redmi", "redmi", 11499, "MediaTek Dimensity 1080 (6nm)", 6.67, "AMOLED", 120, 50, true, 5000, 67, 8, 256, false],
  ["Redmi Note 12", "Redmi", "redmi", 7999, "Snapdragon 685 (6nm)", 6.67, "AMOLED", 120, 50, false, 5000, 33, 6, 128, false],
  ["Redmi K80 Pro", "Redmi", "redmi", 32999, "Snapdragon 8 Elite (3nm)", 6.67, "2K OLED", 120, 50, true, 6000, 120, 16, 512, true],
  ["Redmi K80", "Redmi", "redmi", 25999, "Snapdragon 8 Gen 3 (4nm)", 6.67, "2K OLED", 120, 50, true, 6550, 90, 12, 256, true],
  ["Redmi K70 Ultra", "Redmi", "redmi", 24999, "MediaTek Dimensity 9300+ (4nm)", 6.67, "AMOLED 1.5K", 144, 50, true, 5500, 120, 12, 256, true],
  ["Redmi K70 Pro", "Redmi", "redmi", 23999, "Snapdragon 8 Gen 3 (4nm)", 6.67, "2K OLED", 120, 50, true, 5000, 120, 12, 256, false],
  ["Redmi 14C", "Redmi", "redmi", 6499, "MediaTek Helio G81 Ultra", 6.88, "IPS LCD", 120, 50, false, 5160, 18, 6, 128, true],
  ["Redmi 13", "Redmi", "redmi", 7499, "MediaTek Helio G91 Ultra", 6.79, "IPS LCD", 90, 108, false, 5030, 33, 8, 128, true],
  ["Redmi 13C", "Redmi", "redmi", 5999, "MediaTek Helio G85", 6.74, "IPS LCD", 90, 50, false, 5000, 18, 6, 128, false],
  ["Redmi A3", "Redmi", "redmi", 4799, "MediaTek Helio G36", 6.71, "IPS LCD", 90, 8, false, 5000, 10, 4, 128, false],

  // ═══ 5. POCO (F7, F6, F5, X7, X6, X5, M7, M6, C) ═══
  ["POCO F7 Ultra", "POCO", "poco", 34999, "Snapdragon 8 Elite (3nm)", 6.67, "2K AMOLED", 120, 50, true, 6000, 120, 16, 512, true],
  ["POCO F7 Pro", "POCO", "poco", 28999, "Snapdragon 8 Gen 3 (4nm)", 6.67, "2K AMOLED", 120, 50, true, 6000, 90, 12, 512, true],
  ["POCO F7", "POCO", "poco", 22999, "Snapdragon 8s Gen 4 (4nm)", 6.67, "AMOLED 1.5K", 120, 50, true, 6000, 90, 12, 256, true],
  ["POCO F6 Pro", "POCO", "poco", 25999, "Snapdragon 8 Gen 2 (4nm)", 6.67, "WQHD+ Flow AMOLED", 120, 50, true, 5000, 120, 12, 512, true],
  ["POCO F6", "POCO", "poco", 19999, "Snapdragon 8s Gen 3 (4nm)", 6.67, "CrystalRes AMOLED", 120, 50, true, 5000, 90, 12, 512, true],
  ["POCO F5 Pro", "POCO", "poco", 21499, "Snapdragon 8+ Gen 1 (4nm)", 6.67, "WQHD+ AMOLED", 120, 64, true, 5160, 67, 12, 256, false],
  ["POCO F5", "POCO", "poco", 17499, "Snapdragon 7+ Gen 2 (4nm)", 6.67, "Flow AMOLED", 120, 64, true, 5000, 67, 12, 256, false],
  ["POCO X7 Pro", "POCO", "poco", 18999, "MediaTek Dimensity 8400 Ultra (4nm)", 6.67, "AMOLED 1.5K", 120, 50, true, 6000, 90, 12, 512, true],
  ["POCO X7", "POCO", "poco", 14499, "MediaTek Dimensity 7300 Ultra (4nm)", 6.67, "AMOLED 1.5K", 120, 50, true, 5110, 45, 8, 256, true],
  ["POCO X6 Pro", "POCO", "poco", 16499, "MediaTek Dimensity 8300 Ultra (4nm)", 6.67, "CrystalRes AMOLED", 120, 64, true, 5000, 67, 12, 512, false],
  ["POCO X6 5G", "POCO", "poco", 12999, "Snapdragon 7s Gen 2 (4nm)", 6.67, "CrystalRes AMOLED", 120, 64, true, 5100, 67, 8, 256, false],
  ["POCO M7 Pro 5G", "POCO", "poco", 10499, "MediaTek Dimensity 7025 Ultra (6nm)", 6.67, "AMOLED", 120, 50, true, 5110, 45, 8, 256, true],
  ["POCO M6 Pro", "POCO", "poco", 9499, "MediaTek Helio G99 Ultra (6nm)", 6.67, "Flow AMOLED", 120, 64, true, 5000, 67, 8, 256, false],
  ["POCO M6", "POCO", "poco", 7499, "MediaTek Helio G91 Ultra", 6.79, "IPS LCD", 90, 108, false, 5030, 33, 8, 256, true],
  ["POCO C75", "POCO", "poco", 5999, "MediaTek Helio G81 Ultra", 6.88, "IPS LCD", 120, 50, false, 5160, 18, 6, 128, true],
  ["POCO C65", "POCO", "poco", 5499, "MediaTek Helio G85 (12nm)", 6.74, "IPS LCD", 90, 50, false, 5000, 18, 6, 128, false],

  // ═══ 6. HONOR (Magic 8, 7, 6, 5, Magic V, Number 300/200/90, X, Play) ═══
  ["HONOR Magic 8 Pro", "HONOR", "honor", 64999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.8, "LTPO Tandem OLED", 120, 200, true, 6000, 100, 16, 512, true],
  ["HONOR Magic 7 Pro", "HONOR", "honor", 54999, "Snapdragon 8 Elite (3nm)", 6.8, "LTPO OLED", 120, 200, true, 5850, 100, 16, 512, true],
  ["HONOR Magic 7", "HONOR", "honor", 44999, "Snapdragon 8 Elite (3nm)", 6.78, "LTPO OLED", 120, 50, true, 5650, 100, 12, 256, true],
  ["HONOR Magic 6 Pro", "HONOR", "honor", 46999, "Snapdragon 8 Gen 3 (4nm)", 6.8, "LTPO OLED", 120, 180, true, 5600, 80, 12, 512, false],
  ["HONOR Magic 5 Pro", "HONOR", "honor", 35999, "Snapdragon 8 Gen 2 (4nm)", 6.81, "LTPO OLED", 120, 50, true, 5100, 66, 12, 512, false],
  ["HONOR Magic V3", "HONOR", "honor", 74999, "Snapdragon 8 Gen 3 (4nm)", 7.92, "Foldable LTPO OLED", 120, 50, true, 5150, 66, 12, 512, true],
  ["HONOR Magic V2", "HONOR", "honor", 57999, "Snapdragon 8 Gen 2 (4nm)", 7.92, "Foldable LTPO OLED", 120, 50, true, 5000, 66, 16, 512, false],
  ["HONOR Magic V Flip", "HONOR", "honor", 39999, "Snapdragon 8+ Gen 1 (4nm)", 6.8, "Foldable LTPO OLED", 120, 50, true, 4800, 66, 12, 256, true],
  ["HONOR 300 Pro", "HONOR", "honor", 28999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "AMOLED Harcourt", 120, 50, true, 5300, 100, 12, 512, true],
  ["HONOR 300", "HONOR", "honor", 22999, "Snapdragon 7 Gen 3 (4nm)", 6.7, "AMOLED", 120, 50, true, 5300, 100, 12, 256, true],
  ["HONOR 200 Pro", "HONOR", "honor", 26999, "Snapdragon 8s Gen 3 (4nm)", 6.78, "OLED Quad-Curved", 120, 50, true, 5200, 100, 12, 512, true],
  ["HONOR 200", "HONOR", "honor", 19999, "Snapdragon 7 Gen 3 (4nm)", 6.7, "OLED", 120, 50, true, 5200, 100, 12, 256, true],
  ["HONOR 200 Lite", "HONOR", "honor", 11999, "MediaTek Dimensity 6080 (6nm)", 6.7, "AMOLED", 90, 108, false, 4500, 35, 8, 256, true],
  ["HONOR 90", "HONOR", "honor", 15999, "Snapdragon 7 Gen 1 AE (4nm)", 6.7, "AMOLED", 120, 200, false, 5000, 66, 12, 512, false],
  ["HONOR X9c 5G", "HONOR", "honor", 15499, "Snapdragon 6 Gen 1 (4nm)", 6.78, "AMOLED Ultra-Bounce", 120, 108, true, 6600, 66, 12, 256, true],
  ["HONOR X9b 5G", "HONOR", "honor", 12999, "Snapdragon 6 Gen 1 (4nm)", 6.78, "AMOLED 1.5K", 120, 108, false, 5800, 35, 12, 256, false],
  ["HONOR X8b", "HONOR", "honor", 9999, "Snapdragon 680 (6nm)", 6.7, "AMOLED", 90, 108, false, 4500, 35, 8, 256, false],
  ["HONOR Play 60 Plus", "HONOR", "honor", 8499, "Snapdragon 4 Gen 2 (4nm)", 6.77, "TFT LCD", 120, 50, false, 6000, 35, 8, 256, true],

  // ═══ 7. HUAWEI (Pura, Mate, Mate X, nova, Enjoy, Pocket) ═══
  ["Huawei Pura 70 Ultra", "Huawei", "huawei", 56999, "Kirin 9010 (7nm)", 6.8, "LTPO OLED", 120, 50, true, 5200, 100, 16, 512, true],
  ["Huawei Pura 70 Pro", "Huawei", "huawei", 44999, "Kirin 9010 (7nm)", 6.8, "LTPO OLED", 120, 50, true, 5050, 100, 12, 512, true],
  ["Huawei Pura 70", "Huawei", "huawei", 34999, "Kirin 9000S1", 6.6, "LTPO OLED", 120, 50, true, 4900, 66, 12, 256, true],
  ["Huawei Mate XT Ultimate", "Huawei", "huawei", 119999, "Kirin 9010 (7nm)", 10.2, "Tri-Fold LTPO OLED", 120, 50, true, 5600, 66, 16, 1024, true],
  ["Huawei Mate 70 Pro+", "Huawei", "huawei", 64999, "Kirin 9100", 6.9, "LTPO OLED", 120, 50, true, 5700, 100, 16, 512, true],
  ["Huawei Mate 60 Pro", "Huawei", "huawei", 48999, "Kirin 9000S (7nm)", 6.82, "LTPO OLED", 120, 50, true, 5000, 88, 12, 512, false],
  ["Huawei Mate X6", "Huawei", "huawei", 79999, "Kirin 9100", 7.93, "Foldable LTPO OLED", 120, 50, true, 5200, 66, 16, 512, true],
  ["Huawei Mate X3", "Huawei", "huawei", 62999, "Snapdragon 8+ Gen 1", 7.85, "Foldable OLED", 120, 50, true, 4800, 66, 12, 512, false],
  ["Huawei Pocket 2", "Huawei", "huawei", 44999, "Kirin 9000S", 6.94, "Foldable LTPO OLED", 120, 50, true, 4520, 66, 12, 512, true],
  ["Huawei nova 13 Pro", "Huawei", "huawei", 26999, "Kirin 8000", 6.76, "LTPO OLED", 120, 50, true, 5000, 100, 12, 512, true],
  ["Huawei nova 12 Pro", "Huawei", "huawei", 21999, "Kirin 8000", 6.76, "LTPO OLED", 120, 50, false, 4600, 100, 12, 256, true],
  ["Huawei nova 12s", "Huawei", "huawei", 16999, "Snapdragon 778G", 6.7, "OLED", 120, 50, false, 4500, 66, 8, 256, false],
  ["Huawei nova 12 SE", "Huawei", "huawei", 13499, "Snapdragon 680", 6.67, "OLED", 90, 108, false, 4500, 66, 8, 256, false],
  ["Huawei Enjoy 70 Pro", "Huawei", "huawei", 9999, "Snapdragon 680", 6.7, "IPS LCD", 90, 108, false, 5000, 40, 8, 256, false],

  // ═══ 8. OPPO (Find X, Find N, Reno 10-15, A, K, F) ═══
  ["OPPO Find X8 Pro", "OPPO", "oppo", 48999, "MediaTek Dimensity 9400 (3nm)", 6.78, "LTPO AMOLED", 120, 50, true, 5910, 80, 16, 512, true],
  ["OPPO Find X8", "OPPO", "oppo", 39999, "MediaTek Dimensity 9400 (3nm)", 6.59, "LTPO AMOLED", 120, 50, true, 5630, 80, 12, 256, true],
  ["OPPO Find X7 Ultra", "OPPO", "oppo", 45999, "Snapdragon 8 Gen 3 (4nm)", 6.82, "LTPO AMOLED 2K", 120, 50, true, 5000, 100, 16, 512, false],
  ["OPPO Find N3", "OPPO", "oppo", 64999, "Snapdragon 8 Gen 2 (4nm)", 7.82, "Foldable LTPO3 OLED", 120, 48, true, 4805, 67, 16, 512, false],
  ["OPPO Find N3 Flip", "OPPO", "oppo", 36999, "MediaTek Dimensity 9200 (4nm)", 6.8, "Foldable LTPO AMOLED", 120, 50, true, 4300, 44, 12, 256, false],
  ["OPPO Reno 15 Pro", "OPPO", "oppo", 29999, "MediaTek Dimensity 8450", 6.83, "AMOLED 1.5K", 120, 50, true, 5800, 80, 12, 512, true],
  ["OPPO Reno 14 Pro", "OPPO", "oppo", 27499, "MediaTek Dimensity 8400", 6.8, "AMOLED 1.5K", 120, 50, true, 5700, 80, 12, 512, true],
  ["OPPO Reno 13 Pro", "OPPO", "oppo", 25999, "MediaTek Dimensity 8350 (4nm)", 6.83, "AMOLED 1.5K", 120, 50, true, 5800, 80, 12, 512, true],
  ["OPPO Reno 13", "OPPO", "oppo", 21499, "MediaTek Dimensity 8350 (4nm)", 6.59, "AMOLED", 120, 50, true, 5600, 80, 12, 256, true],
  ["OPPO Reno 12 Pro 5G", "OPPO", "oppo", 22999, "MediaTek Dimensity 7300 Energy (4nm)", 6.7, "AMOLED", 120, 50, true, 5000, 80, 12, 512, true],
  ["OPPO Reno 12 5G", "OPPO", "oppo", 18499, "MediaTek Dimensity 7300 Energy (4nm)", 6.7, "AMOLED", 120, 50, true, 5000, 80, 12, 256, true],
  ["OPPO Reno 11 F 5G", "OPPO", "oppo", 14499, "MediaTek Dimensity 7050 (6nm)", 6.7, "AMOLED", 120, 64, false, 5000, 67, 8, 256, false],
  ["OPPO Reno 10 Pro 5G", "OPPO", "oppo", 17999, "Snapdragon 778G 5G (6nm)", 6.7, "AMOLED", 120, 50, true, 4600, 80, 12, 256, false],
  ["OPPO A60", "OPPO", "oppo", 8999, "Snapdragon 680 (6nm)", 6.67, "IPS LCD", 90, 50, false, 5000, 45, 8, 256, true],
  ["OPPO A38", "OPPO", "oppo", 6499, "MediaTek Helio G85", 6.56, "IPS LCD", 90, 50, false, 5000, 33, 4, 128, false],
  ["OPPO K12 Plus", "OPPO", "oppo", 13999, "Snapdragon 7 Gen 3 (4nm)", 6.7, "AMOLED", 120, 50, true, 6400, 80, 8, 256, true],
  ["OPPO F27 Pro+ 5G", "OPPO", "oppo", 14999, "MediaTek Dimensity 7050", 6.7, "AMOLED IP69", 120, 64, false, 5000, 67, 8, 256, true],

  // ═══ 9. VIVO (X300, X200, X100, X Fold, V50, V40, V30, Y, T) ═══
  ["vivo X300 Pro", "vivo", "vivo", 59999, "MediaTek Dimensity 9500 (2nm)", 6.8, "LTPO AMOLED ZEISS", 120, 200, true, 6200, 100, 16, 512, true],
  ["vivo X200 Pro", "vivo", "vivo", 51999, "MediaTek Dimensity 9400 (3nm)", 6.78, "LTPO AMOLED", 120, 200, true, 6000, 90, 16, 512, true],
  ["vivo X200 Pro mini", "vivo", "vivo", 41999, "MediaTek Dimensity 9400 (3nm)", 6.31, "LTPO AMOLED", 120, 50, true, 5700, 90, 12, 256, true],
  ["vivo X200", "vivo", "vivo", 38999, "MediaTek Dimensity 9400 (3nm)", 6.67, "AMOLED", 120, 50, true, 5800, 90, 12, 256, true],
  ["vivo X100 Pro", "vivo", "vivo", 44999, "MediaTek Dimensity 9300 (4nm)", 6.78, "LTPO AMOLED", 120, 50, true, 5400, 100, 16, 512, false],
  ["vivo X100", "vivo", "vivo", 34999, "MediaTek Dimensity 9300 (4nm)", 6.78, "LTPO AMOLED", 120, 50, true, 5000, 120, 12, 256, false],
  ["vivo X Fold 3 Pro", "vivo", "vivo", 72999, "Snapdragon 8 Gen 3 (4nm)", 8.03, "Foldable LTPO AMOLED", 120, 50, true, 5700, 100, 16, 512, true],
  ["vivo V50 Pro", "vivo", "vivo", 28999, "MediaTek Dimensity 9200+ (4nm)", 6.78, "AMOLED ZEISS", 120, 50, true, 5700, 80, 12, 512, true],
  ["vivo V40 Pro", "vivo", "vivo", 26999, "MediaTek Dimensity 9200+ (4nm)", 6.78, "AMOLED", 120, 50, true, 5500, 80, 12, 512, true],
  ["vivo V40 5G", "vivo", "vivo", 21999, "Snapdragon 7 Gen 3 (4nm)", 6.78, "AMOLED ZEISS", 120, 50, true, 5500, 80, 12, 256, true],
  ["vivo V30 5G", "vivo", "vivo", 17999, "Snapdragon 7 Gen 3 (4nm)", 6.78, "AMOLED", 120, 50, true, 5000, 80, 12, 256, false],
  ["vivo Y200 5G", "vivo", "vivo", 12999, "Snapdragon 4 Gen 2 (4nm)", 6.67, "AMOLED", 120, 50, false, 5000, 80, 8, 256, true],
  ["vivo Y36", "vivo", "vivo", 8499, "Snapdragon 680 (6nm)", 6.64, "IPS LCD", 90, 50, false, 5000, 44, 8, 256, false],
  ["vivo T3 Ultra", "vivo", "vivo", 19999, "MediaTek Dimensity 9200+ (4nm)", 6.78, "AMOLED 1.5K", 120, 50, true, 5500, 80, 12, 256, true],

  // ═══ 10. IQOO (iQOO, Neo, Z, Number) ═══
  ["iQOO 13 5G", "iQOO", "iqoo", 38999, "Snapdragon 8 Elite (3nm)", 6.82, "2K Q10 AMOLED", 144, 50, true, 6150, 120, 16, 512, true],
  ["iQOO 12 5G", "iQOO", "iqoo", 31999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED", 144, 50, true, 5000, 120, 16, 512, false],
  ["iQOO Neo 10 Pro", "iQOO", "iqoo", 24999, "MediaTek Dimensity 9400 (3nm)", 6.78, "AMOLED 144Hz", 144, 50, true, 6100, 120, 12, 256, true],
  ["iQOO Neo 9S Pro+", "iQOO", "iqoo", 21999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED", 144, 50, true, 5500, 120, 12, 256, true],
  ["iQOO Z9 Turbo+", "iQOO", "iqoo", 17499, "MediaTek Dimensity 9300+ (4nm)", 6.78, "AMOLED", 144, 50, true, 6400, 80, 12, 256, true],

  // ═══ 11. REALME (GT, GT Neo, Number, C, Narzo, P) ═══
  ["realme GT 7 Pro", "realme", "realme", 36999, "Snapdragon 8 Elite (3nm)", 6.78, "Eco2 OLED Plus", 120, 50, true, 6500, 120, 12, 512, true],
  ["realme GT 6", "realme", "realme", 24999, "Snapdragon 8s Gen 3 (4nm)", 6.78, "LTPO AMOLED 6000nit", 120, 50, true, 5500, 120, 12, 256, true],
  ["realme GT 6T", "realme", "realme", 19999, "Snapdragon 7+ Gen 3 (4nm)", 6.78, "LTPO AMOLED", 120, 50, true, 5500, 120, 8, 256, true],
  ["realme GT Neo 6", "realme", "realme", 18999, "Snapdragon 8s Gen 3 (4nm)", 6.78, "LTPO AMOLED", 120, 50, true, 5500, 120, 12, 256, true],
  ["realme 13 Pro+ 5G", "realme", "realme", 18999, "Snapdragon 7s Gen 2 (4nm)", 6.7, "AMOLED", 120, 50, true, 5200, 80, 12, 512, true],
  ["realme 12 Pro+ 5G", "realme", "realme", 16999, "Snapdragon 7s Gen 2 (4nm)", 6.7, "AMOLED", 120, 50, true, 5000, 67, 12, 512, false],
  ["realme 12+ 5G", "realme", "realme", 12999, "MediaTek Dimensity 7050 (6nm)", 6.67, "AMOLED", 120, 50, true, 5000, 67, 8, 256, false],
  ["realme C67", "realme", "realme", 8499, "Snapdragon 685 (6nm)", 6.72, "IPS LCD", 90, 108, false, 5000, 33, 8, 256, false],
  ["realme C65", "realme", "realme", 7499, "MediaTek Helio G85", 6.67, "IPS LCD", 90, 50, false, 5000, 45, 8, 256, true],
  ["realme C55", "realme", "realme", 6999, "MediaTek Helio G88", 6.72, "IPS LCD", 90, 64, false, 5000, 33, 6, 128, false],
  ["realme Narzo 70 Turbo 5G", "realme", "realme", 11499, "MediaTek Dimensity 7300 Energy", 6.67, "OLED", 120, 50, false, 5000, 45, 8, 128, true],
  ["realme P2 Pro 5G", "realme", "realme", 13499, "Snapdragon 7s Gen 2 (4nm)", 6.7, "OLED", 120, 50, true, 5200, 80, 8, 256, true],

  // ═══ 12. ONEPLUS (OnePlus, R, Nord, Open, Ace) ═══
  ["OnePlus 13", "OnePlus", "oneplus", 46999, "Snapdragon 8 Elite (3nm)", 6.82, "2K LTPO AMOLED", 120, 50, true, 6000, 100, 16, 512, true],
  ["OnePlus 12", "OnePlus", "oneplus", 38999, "Snapdragon 8 Gen 3 (4nm)", 6.82, "2K LTPO AMOLED", 120, 50, true, 5400, 100, 16, 512, false],
  ["OnePlus 12R", "OnePlus", "oneplus", 26999, "Snapdragon 8 Gen 2 (4nm)", 6.78, "LTPO4 AMOLED", 120, 50, true, 5500, 100, 16, 256, true],
  ["OnePlus Open", "OnePlus", "oneplus", 66999, "Snapdragon 8 Gen 2 (4nm)", 7.82, "Foldable LTPO3 OLED", 120, 48, true, 4805, 67, 16, 512, false],
  ["OnePlus Nord 4 5G", "OnePlus", "oneplus", 20999, "Snapdragon 7+ Gen 3 (4nm)", 6.74, "Fluid AMOLED", 120, 50, true, 5500, 100, 12, 256, true],
  ["OnePlus Nord CE4", "OnePlus", "oneplus", 15999, "Snapdragon 7 Gen 3 (4nm)", 6.7, "Fluid AMOLED", 120, 50, true, 5500, 100, 8, 256, true],
  ["OnePlus Ace 3 Pro", "OnePlus", "oneplus", 25999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED", 120, 50, true, 6100, 100, 16, 512, true],

  // ═══ 13. MOTOROLA (Edge, Edge Ultra, Razr, Moto G, Moto E) ═══
  ["Motorola Edge 50 Ultra", "Motorola", "motorola", 36999, "Snapdragon 8s Gen 3 (4nm)", 6.7, "P-OLED", 144, 50, true, 4500, 125, 16, 512, true],
  ["Motorola Edge 50 Pro", "Motorola", "motorola", 24999, "Snapdragon 7 Gen 3 (4nm)", 6.7, "P-OLED", 144, 50, true, 4500, 125, 12, 256, true],
  ["Motorola Edge 50 Fusion", "Motorola", "motorola", 16999, "Snapdragon 7s Gen 2 (4nm)", 6.7, "P-OLED", 144, 50, true, 5000, 68, 8, 256, true],
  ["Motorola Razr 50 Ultra", "Motorola", "motorola", 44999, "Snapdragon 8s Gen 3 (4nm)", 6.9, "Foldable LTPO AMOLED", 165, 50, true, 4000, 45, 12, 512, true],
  ["Motorola Razr 50", "Motorola", "motorola", 32999, "MediaTek Dimensity 7300X", 6.9, "Foldable LTPO AMOLED", 120, 50, true, 4200, 30, 8, 256, true],
  ["Motorola Moto G85 5G", "Motorola", "motorola", 12499, "Snapdragon 6s Gen 3 (6nm)", 6.67, "P-OLED", 120, 50, true, 5000, 30, 8, 256, true],
  ["Motorola Moto G54 5G", "Motorola", "motorola", 8999, "MediaTek Dimensity 7020", 6.5, "IPS LCD", 120, 50, true, 6000, 30, 8, 256, false],
  ["Motorola Moto E14", "Motorola", "motorola", 4999, "Unisoc T606", 6.56, "IPS LCD", 90, 13, false, 5000, 15, 4, 64, true],

  // ═══ 14. NOTHING & 15. CMF ═══
  ["Nothing Phone (3) Pro", "Nothing", "nothing", 34999, "Snapdragon 8s Gen 3 (4nm)", 6.7, "LTPO OLED Glyph", 120, 50, true, 5000, 65, 12, 256, true],
  ["Nothing Phone (2)", "Nothing", "nothing", 26999, "Snapdragon 8+ Gen 1 (4nm)", 6.7, "LTPO OLED Glyph", 120, 50, true, 4700, 45, 12, 256, false],
  ["Nothing Phone (2a) Plus", "Nothing", "nothing", 18499, "MediaTek Dimensity 7350 Pro (4nm)", 6.7, "AMOLED Glyph", 120, 50, true, 5000, 50, 12, 256, true],
  ["Nothing Phone (2a)", "Nothing", "nothing", 15999, "MediaTek Dimensity 7200 Pro (4nm)", 6.7, "AMOLED Glyph", 120, 50, true, 5000, 45, 8, 128, true],
  ["Nothing Phone (1)", "Nothing", "nothing", 13999, "Snapdragon 778G+ 5G", 6.55, "OLED Glyph", 120, 50, true, 4500, 33, 8, 128, false],
  ["CMF Phone 2 Pro", "CMF", "cmf", 13499, "MediaTek Dimensity 7350", 6.67, "Super AMOLED", 120, 50, true, 5000, 45, 8, 256, true],
  ["CMF Phone 1", "CMF", "cmf", 10999, "MediaTek Dimensity 7300 (4nm)", 6.67, "Super AMOLED", 120, 50, false, 5000, 33, 8, 128, true],

  // ═══ 16. GOOGLE (Pixel 10, 9, 8, 7, Pro, Fold, A) ═══
  ["Google Pixel 10 Pro XL", "Google", "google", 62999, "Google Tensor G5 (3nm TSMC)", 6.8, "Super Actua LTPO OLED", 120, 50, true, 5200, 45, 16, 256, true],
  ["Google Pixel 9 Pro XL", "Google", "google", 52999, "Google Tensor G4 (4nm)", 6.8, "Super Actua LTPO OLED", 120, 50, true, 5060, 37, 16, 256, true],
  ["Google Pixel 9 Pro", "Google", "google", 46999, "Google Tensor G4 (4nm)", 6.3, "Super Actua LTPO OLED", 120, 50, true, 4700, 27, 16, 128, true],
  ["Google Pixel 9", "Google", "google", 37999, "Google Tensor G4 (4nm)", 6.3, "Actua OLED", 120, 50, true, 4700, 27, 12, 128, true],
  ["Google Pixel 9 Pro Fold", "Google", "google", 74999, "Google Tensor G4 (4nm)", 8.0, "Foldable Super Actua OLED", 120, 48, true, 4650, 21, 16, 256, true],
  ["Google Pixel 8 Pro", "Google", "google", 35999, "Google Tensor G3 (4nm)", 6.7, "LTPO OLED", 120, 50, true, 5050, 30, 12, 128, false],
  ["Google Pixel 8a", "Google", "google", 21999, "Google Tensor G3 (4nm)", 6.1, "OLED", 120, 64, true, 4492, 18, 8, 128, true],
  ["Google Pixel 7 Pro", "Google", "google", 26999, "Google Tensor G2 (5nm)", 6.7, "LTPO AMOLED", 120, 50, true, 5000, 23, 12, 128, false],

  // ═══ 17. SONY (Xperia 1, 5, 10, Ace) ═══
  ["Sony Xperia 1 VI", "Sony", "sony", 54999, "Snapdragon 8 Gen 3 (4nm)", 6.5, "LTPO OLED Bravia", 120, 48, true, 5000, 30, 12, 256, true],
  ["Sony Xperia 5 V", "Sony", "sony", 38999, "Snapdragon 8 Gen 2 (4nm)", 6.1, "OLED HDR", 120, 48, true, 5000, 30, 8, 128, false],
  ["Sony Xperia 10 VI", "Sony", "sony", 18999, "Snapdragon 6 Gen 1 (4nm)", 6.1, "OLED Triluminos", 60, 48, true, 5000, 30, 8, 128, true],
  ["Sony Xperia Ace III", "Sony", "sony", 10999, "Snapdragon 480 5G", 5.5, "IPS LCD", 60, 13, false, 4500, 18, 4, 64, false],

  // ═══ 18. ASUS (ROG Phone, Zenfone) ═══
  ["ASUS ROG Phone 9 Pro", "ASUS", "asus", 58999, "Snapdragon 8 Elite (3nm)", 6.78, "LTPO AMOLED 185Hz", 165, 50, true, 5800, 65, 24, 1024, true],
  ["ASUS ROG Phone 8 Pro", "ASUS", "asus", 49999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED 165Hz", 165, 50, true, 5500, 65, 16, 512, true],
  ["ASUS Zenfone 11 Ultra", "ASUS", "asus", 41999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED", 144, 50, true, 5500, 65, 12, 256, true],
  ["ASUS Zenfone 10", "ASUS", "asus", 31999, "Snapdragon 8 Gen 2 (4nm)", 5.9, "Super AMOLED", 144, 50, true, 4300, 30, 8, 256, false],

  // ═══ 19. LENOVO (Legion, K) ═══
  ["Lenovo Legion Y90", "Lenovo", "lenovo", 27999, "Snapdragon 8 Gen 1 (4nm)", 6.92, "AMOLED 144Hz", 144, 64, false, 5600, 68, 16, 512, false],
  ["Lenovo ThinkPhone 25", "Lenovo", "lenovo", 23999, "MediaTek Dimensity 7300", 6.36, "P-OLED", 120, 50, true, 4310, 68, 8, 256, true],
  ["Lenovo K14 Plus", "Lenovo", "lenovo", 6499, "Unisoc T606", 6.5, "IPS LCD", 90, 48, false, 5000, 20, 4, 64, false],

  // ═══ 20. ZTE, 21. NUBIA & 22. REDMAGIC ═══
  ["ZTE Axon 60 Ultra", "ZTE", "zte", 38999, "Snapdragon 8 Gen 2 (4nm)", 6.78, "AMOLED", 120, 50, true, 6000, 80, 12, 512, true],
  ["ZTE Blade V60 Design", "ZTE", "zte", 7499, "Unisoc T606", 6.6, "IPS LCD", 90, 50, false, 5000, 22, 6, 256, true],
  ["ZTE Nubia Music", "ZTE", "zte", 5999, "Unisoc SC9863A", 6.6, "IPS LCD", 90, 50, false, 5000, 18, 4, 128, true],
  ["Nubia Z70 Ultra", "Nubia", "nubia", 42999, "Snapdragon 8 Elite (3nm)", 6.85, "AMOLED Ekran Altı Kamera", 144, 50, true, 6150, 80, 16, 512, true],
  ["Nubia Z60 Ultra", "Nubia", "nubia", 34999, "Snapdragon 8 Gen 3 (4nm)", 6.8, "AMOLED UDC", 120, 50, true, 6000, 80, 16, 512, true],
  ["Nubia Flip 5G", "Nubia", "nubia", 23999, "Snapdragon 7 Gen 1 (4nm)", 6.9, "Foldable OLED", 120, 50, false, 4310, 33, 8, 256, true],
  ["Nubia Focus Pro 5G", "Nubia", "nubia", 11999, "Unisoc T760 5G", 6.72, "IPS LCD", 120, 108, true, 5000, 33, 8, 256, true],
  ["REDMAGIC 10 Pro+", "REDMAGIC", "redmagic", 48999, "Snapdragon 8 Elite (3nm)", 6.85, "AMOLED 144Hz UDC", 144, 50, true, 7050, 120, 24, 1024, true],
  ["REDMAGIC 9S Pro", "REDMAGIC", "redmagic", 39999, "Snapdragon 8 Gen 3 Leading (4nm)", 6.8, "AMOLED UDC", 120, 50, true, 6500, 80, 16, 512, true],
  ["REDMAGIC 9 Pro", "REDMAGIC", "redmagic", 35999, "Snapdragon 8 Gen 3 (4nm)", 6.8, "AMOLED", 120, 50, true, 6500, 80, 16, 512, false],

  // ═══ 23. TECNO (Phantom, Camon, Pova, Spark, Pop) ═══
  ["Tecno Phantom V Fold 2 5G", "Tecno", "tecno", 49999, "MediaTek Dimensity 9000+ (4nm)", 7.85, "Foldable LTPO AMOLED", 120, 50, true, 5750, 70, 12, 512, true],
  ["Tecno Phantom V Flip 2 5G", "Tecno", "tecno", 29999, "MediaTek Dimensity 8020 (6nm)", 6.9, "Foldable LTPO AMOLED", 120, 50, true, 4720, 70, 8, 256, true],
  ["Tecno Camon 30 Premier 5G", "Tecno", "tecno", 23999, "MediaTek Dimensity 8200 Ultimate", 6.77, "LTPO AMOLED", 120, 50, true, 5000, 70, 12, 512, true],
  ["Tecno Camon 30 Pro 5G", "Tecno", "tecno", 18499, "MediaTek Dimensity 8200 Ultimate", 6.78, "AMOLED", 144, 50, true, 5000, 70, 12, 512, true],
  ["Tecno Pova 6 Pro 5G", "Tecno", "tecno", 13999, "MediaTek Dimensity 6080 (6nm)", 6.78, "AMOLED", 120, 108, false, 6000, 70, 12, 256, true],
  ["Tecno Spark 30 Pro", "Tecno", "tecno", 9499, "MediaTek Helio G100", 6.78, "AMOLED", 120, 108, false, 5000, 33, 8, 256, true],
  ["Tecno Spark 20 Pro+", "Tecno", "tecno", 8999, "MediaTek Helio G99 Ultimate", 6.78, "AMOLED", 120, 108, false, 5000, 33, 8, 256, false],
  ["Tecno Pop 9", "Tecno", "tecno", 4999, "MediaTek Helio G50", 6.67, "IPS LCD", 120, 13, false, 5000, 15, 4, 128, true],

  // ═══ 24. INFINIX (Zero, Note, GT, Hot, Smart) ═══
  ["Infinix Zero 40 5G", "Infinix", "infinix", 18999, "MediaTek Dimensity 8200 Ultimate", 6.78, "AMOLED", 144, 108, true, 5000, 45, 12, 512, true],
  ["Infinix GT 20 Pro 5G", "Infinix", "infinix", 17499, "MediaTek Dimensity 8200 Ultimate", 6.78, "AMOLED Cyber Mecha", 144, 108, true, 5000, 45, 12, 256, true],
  ["Infinix Note 40 Pro+ 5G", "Infinix", "infinix", 15999, "MediaTek Dimensity 7020 (6nm)", 6.78, "AMOLED", 120, 108, true, 4600, 100, 12, 256, true],
  ["Infinix Note 40 Pro", "Infinix", "infinix", 12999, "MediaTek Helio G99 Ultimate", 6.78, "AMOLED", 120, 108, true, 5000, 70, 8, 256, true],
  ["Infinix Hot 50 Pro+", "Infinix", "infinix", 9499, "MediaTek Helio G100", 6.78, "AMOLED 6.8mm İnce", 120, 50, false, 5000, 33, 8, 256, true],
  ["Infinix Smart 9", "Infinix", "infinix", 5299, "MediaTek Helio G81", 6.7, "IPS LCD", 120, 13, false, 5000, 10, 4, 128, true],

  // ═══ 25. TCL, 26. MEIZU, 27. SHARP, 28. FAIRPHONE, 29. HMD, 30. NOKIA ═══
  ["TCL 50 Pro NxtPaper 5G", "TCL", "tcl", 15499, "MediaTek Dimensity 6300", 6.8, "NxtPaper Mat IPS", 120, 108, false, 5010, 33, 8, 512, true],
  ["TCL 40 NxtPaper", "TCL", "tcl", 9499, "MediaTek Helio G88", 6.78, "NxtPaper IPS", 90, 50, false, 5010, 33, 8, 256, false],
  ["TCL 60 R 5G", "TCL", "tcl", 8499, "MediaTek Dimensity 6100+", 6.6, "IPS LCD", 120, 50, false, 5000, 18, 6, 128, true],
  ["Meizu 21 Pro", "Meizu", "meizu", 34999, "Snapdragon 8 Gen 3 (4nm)", 6.79, "LTPO AMOLED 2K", 120, 50, true, 5050, 80, 16, 512, true],
  ["Meizu 21 Note", "Meizu", "meizu", 21999, "Snapdragon 8 Gen 2 (4nm)", 6.78, "LTPO OLED", 144, 50, true, 5500, 66, 16, 256, true],
  ["Meizu Lucky 08", "Meizu", "meizu", 14999, "Snapdragon 7s Gen 2 (4nm)", 6.78, "LTPO AMOLED", 144, 108, false, 6000, 45, 12, 256, true],
  ["Sharp Aquos R9 Pro", "Sharp", "sharp", 42999, "Snapdragon 8s Gen 3 (4nm)", 6.7, "Pro IGZO OLED 240Hz", 144, 50, true, 5000, 36, 12, 512, true],
  ["Sharp Aquos R9", "Sharp", "sharp", 28999, "Snapdragon 7+ Gen 3 (4nm)", 6.5, "Pro IGZO OLED 240Hz", 144, 50, true, 5000, 36, 12, 256, true],
  ["Sharp Aquos Sense 9", "Sharp", "sharp", 16999, "Snapdragon 7s Gen 2", 6.1, "Pro IGZO OLED", 120, 50, true, 5000, 36, 8, 256, true],
  ["Fairphone 5", "Fairphone", "fairphone", 26999, "Qualcomm QCM6490 (6nm)", 6.46, "OLED", 90, 50, true, 4200, 30, 8, 256, true],
  ["Fairphone 4", "Fairphone", "fairphone", 18999, "Snapdragon 750G 5G", 6.3, "IPS LCD", 60, 48, true, 3905, 20, 8, 256, false],
  ["HMD Skyline", "HMD", "hmd", 21999, "Snapdragon 7s Gen 2 (4nm)", 6.55, "pOLED", 144, 108, true, 4600, 33, 12, 256, true],
  ["HMD Fusion", "HMD", "hmd", 12999, "Snapdragon 4 Gen 2 (4nm)", 6.56, "IPS LCD", 90, 108, false, 5000, 33, 8, 256, true],
  ["HMD Pulse Pro", "HMD", "hmd", 7999, "Unisoc T606", 6.56, "IPS LCD", 90, 50, false, 5000, 20, 6, 128, true],
  ["Nokia XR21 5G", "Nokia", "nokia", 21499, "Snapdragon 695 5G (6nm)", 6.49, "IPS LCD Zırhlı", 120, 64, false, 4800, 33, 6, 128, false],
  ["Nokia X30 5G", "Nokia", "nokia", 15999, "Snapdragon 695 5G", 6.43, "AMOLED", 90, 50, true, 4200, 33, 8, 256, false],
  ["Nokia G42 5G", "Nokia", "nokia", 8499, "Snapdragon 480+ 5G", 6.56, "IPS LCD", 90, 50, false, 5000, 20, 6, 128, false],
  ["Nokia C32", "Nokia", "nokia", 5499, "Unisoc SC9863A1", 6.5, "IPS LCD", 60, 50, false, 5000, 10, 4, 128, false],

  // ═══ 31-34. TÜRKİYE YERLİ VE POPÜLER PAZAR MARKALARI (General Mobile, Casper, Reeder, Omix) ═══
  ["General Mobile GM Phoenix 5G", "General Mobile", "general-mobile", 16499, "MediaTek Dimensity 7050 (6nm)", 6.78, "AMOLED", 120, 200, false, 4700, 66, 8, 256, true],
  ["General Mobile GM 24 Pro", "General Mobile", "general-mobile", 11499, "MediaTek Helio G99 (6nm)", 6.7, "AMOLED", 120, 108, false, 5000, 33, 8, 256, false],
  ["General Mobile GM Era 50", "General Mobile", "general-mobile", 8499, "MediaTek Helio G88", 6.78, "IPS LCD", 90, 108, false, 5000, 33, 8, 256, true],
  ["General Mobile GM 23", "General Mobile", "general-mobile", 6499, "MediaTek Helio G37", 6.52, "IPS LCD", 90, 50, false, 5000, 15, 4, 128, false],
  ["Casper VIA X40", "Casper", "casper", 13999, "MediaTek Helio G99 (6nm)", 6.67, "AMOLED", 120, 64, false, 5000, 33, 8, 256, true],
  ["Casper VIA X30 Plus", "Casper", "casper", 9999, "MediaTek Helio G99 (6nm)", 6.5, "IPS LCD", 90, 50, false, 4600, 30, 8, 256, false],
  ["Casper VIA M40", "Casper", "casper", 6999, "MediaTek Helio G36", 6.53, "IPS LCD", 90, 50, false, 5000, 18, 6, 128, true],
  ["Casper VIA F40", "Casper", "casper", 8499, "MediaTek Helio G85", 6.6, "IPS LCD", 90, 50, false, 5000, 20, 8, 256, true],
  ["Casper VIA A40", "Casper", "casper", 7999, "MediaTek Helio G85", 6.6, "IPS LCD", 90, 50, false, 5000, 18, 6, 128, false],
  ["Casper VIA E40", "Casper", "casper", 5499, "MediaTek Helio G36", 6.5, "IPS LCD", 60, 13, false, 5000, 15, 4, 64, false],
  ["Reeder S23 Pro Max", "Reeder", "reeder", 6999, "Unisoc T606", 6.5, "IPS LCD", 60, 48, false, 5000, 18, 8, 256, false],
  ["Reeder S19 Max Pro S", "Reeder", "reeder", 5499, "Unisoc T610", 6.7, "IPS LCD", 60, 48, false, 5000, 18, 8, 128, false],
  ["Reeder S71", "Reeder", "reeder", 7999, "MediaTek Helio G99", 6.6, "AMOLED", 120, 64, false, 5000, 33, 8, 256, true],
  ["Reeder P13 Blue Max", "Reeder", "reeder", 4499, "Unisoc SC9863A", 6.5, "IPS LCD", 60, 13, false, 4500, 10, 4, 64, false],
  ["Omix X700", "Omix", "omix", 8999, "MediaTek Helio G99 (6nm)", 6.43, "AMOLED", 90, 64, true, 5000, 30, 8, 256, false],
  ["Omix X600", "Omix", "omix", 6799, "MediaTek Helio G88", 6.78, "IPS LCD", 90, 50, false, 5000, 18, 6, 128, false],
  ["Omix X5", "Omix", "omix", 5799, "MediaTek Helio G37", 6.56, "IPS LCD", 90, 50, false, 5000, 18, 6, 128, false],
  ["Omix X400", "Omix", "omix", 4999, "Unisoc T610", 6.53, "IPS LCD", 60, 16, false, 5000, 15, 4, 64, false],
  ["General Mobile GM 23 SE", "General Mobile", "general-mobile", 5499, "MediaTek Helio G37", 6.52, "IPS LCD", 60, 32, false, 5000, 15, 4, 64, false],
  ["General Mobile GM 22 Pro", "General Mobile", "general-mobile", 7999, "MediaTek Helio G95", 6.78, "IPS LCD", 60, 108, false, 5000, 18, 8, 128, false],
  ["General Mobile GM Era 30", "General Mobile", "general-mobile", 5999, "MediaTek Helio G36", 6.6, "IPS LCD", 90, 50, false, 5000, 18, 4, 128, true],

  // ═══ EK ALT MODELLER & TÜM NESİLLER (Tam Katalog) ═══
  ["iPhone 12 Pro Max", "Apple", "apple", 36999, "Apple A14 Bionic (5nm)", 6.7, "Super Retina XDR OLED", 60, 12, true, 3687, 20, 6, 128, false],
  ["iPhone 12 Pro", "Apple", "apple", 32999, "Apple A14 Bionic (5nm)", 6.1, "Super Retina XDR OLED", 60, 12, true, 2815, 20, 6, 128, false],
  ["iPhone 12 mini", "Apple", "apple", 20999, "Apple A14 Bionic (5nm)", 5.4, "Super Retina XDR OLED", 60, 12, true, 2227, 20, 4, 64, false],
  ["iPhone 11 Pro Max", "Apple", "apple", 26999, "Apple A13 Bionic (7nm)", 6.5, "Super Retina XDR OLED", 60, 12, true, 3969, 18, 4, 64, false],
  ["Samsung Galaxy S22+", "Samsung", "samsung", 27999, "Snapdragon 8 Gen 1 (4nm)", 6.6, "Dynamic AMOLED 2X", 120, 50, true, 4500, 45, 8, 128, false],
  ["Samsung Galaxy S21 FE 5G", "Samsung", "samsung", 17499, "Snapdragon 888 5G (5nm)", 6.4, "Dynamic AMOLED 2X", 120, 12, true, 4500, 25, 8, 128, false],
  ["Samsung Galaxy Z Fold Special Edition", "Samsung", "samsung", 86999, "Snapdragon 8 Gen 3 (4nm)", 8.0, "Foldable Dynamic AMOLED 2X", 120, 200, true, 4400, 25, 16, 512, true],
  ["Samsung Galaxy Z Flip FE", "Samsung", "samsung", 31999, "Samsung Exynos 2400e (4nm)", 6.7, "Foldable AMOLED", 120, 50, true, 4000, 25, 8, 128, true],
  ["Samsung Galaxy Z Fold 3", "Samsung", "samsung", 34999, "Snapdragon 888 5G (5nm)", 7.6, "Foldable Dynamic AMOLED 2X", 120, 12, true, 4400, 25, 12, 256, false],
  ["Samsung Galaxy Z Flip 3", "Samsung", "samsung", 19999, "Snapdragon 888 5G (5nm)", 6.7, "Foldable Dynamic AMOLED 2X", 120, 12, true, 3300, 15, 8, 128, false],
  ["Samsung Galaxy A73 5G", "Samsung", "samsung", 18499, "Snapdragon 778G 5G (6nm)", 6.7, "Super AMOLED Plus", 120, 108, true, 5000, 25, 8, 128, false],
  ["Samsung Galaxy A53 5G", "Samsung", "samsung", 12999, "Samsung Exynos 1280 (5nm)", 6.5, "Super AMOLED", 120, 64, true, 5000, 25, 8, 128, false],
  ["Samsung Galaxy A33 5G", "Samsung", "samsung", 10499, "Samsung Exynos 1280 (5nm)", 6.4, "Super AMOLED", 90, 48, true, 5000, 25, 6, 128, false],
  ["Samsung Galaxy A23", "Samsung", "samsung", 8299, "Snapdragon 680 (6nm)", 6.6, "PLS LCD", 90, 50, true, 5000, 25, 6, 128, false],
  ["Samsung Galaxy A16", "Samsung", "samsung", 7999, "MediaTek Helio G99 (6nm)", 6.7, "Super AMOLED", 90, 50, false, 5000, 25, 4, 128, true],
  ["Samsung Galaxy A15 5G", "Samsung", "samsung", 8499, "MediaTek Dimensity 6100+ (6nm)", 6.5, "Super AMOLED", 90, 50, false, 5000, 25, 6, 128, false],
  ["Samsung Galaxy A14", "Samsung", "samsung", 6799, "MediaTek Helio G80", 6.6, "PLS LCD", 60, 50, false, 5000, 15, 4, 64, false],
  ["Samsung Galaxy A05s", "Samsung", "samsung", 5799, "Snapdragon 680 (6nm)", 6.7, "PLS LCD", 90, 50, false, 5000, 25, 4, 128, false],
  ["Samsung Galaxy M54 5G", "Samsung", "samsung", 12999, "Samsung Exynos 1380 (5nm)", 6.7, "Super AMOLED Plus", 120, 108, true, 6000, 25, 8, 256, false],
  ["Samsung Galaxy M14 5G", "Samsung", "samsung", 7299, "Samsung Exynos 1330 (5nm)", 6.6, "PLS LCD", 90, 50, false, 6000, 25, 4, 128, false],
  ["Samsung Galaxy F15 5G", "Samsung", "samsung", 7699, "MediaTek Dimensity 6100+ (6nm)", 6.5, "Super AMOLED", 90, 50, false, 6000, 25, 6, 128, false],
  ["Xiaomi 15S Pro", "Xiaomi", "xiaomi", 46999, "Snapdragon 8 Elite (3nm)", 6.73, "LTPO OLED 2K", 120, 50, true, 6100, 120, 16, 512, true],
  ["Xiaomi 14 Civi", "Xiaomi", "xiaomi", 23999, "Snapdragon 8s Gen 3 (4nm)", 6.55, "AMOLED Leica", 120, 50, true, 4700, 67, 12, 256, true],
  ["Xiaomi 12T Pro", "Xiaomi", "xiaomi", 22999, "Snapdragon 8+ Gen 1 (4nm)", 6.67, "CrystalRes AMOLED", 120, 200, true, 5000, 120, 12, 256, false],
  ["Xiaomi 12T", "Xiaomi", "xiaomi", 17999, "MediaTek Dimensity 8100 Ultra (5nm)", 6.67, "CrystalRes AMOLED", 120, 108, true, 5000, 120, 8, 256, false],
  ["Xiaomi 12 Pro", "Xiaomi", "xiaomi", 24999, "Snapdragon 8 Gen 1 (4nm)", 6.73, "LTPO AMOLED 2K", 120, 50, true, 4600, 120, 12, 256, false],
  ["Xiaomi 12", "Xiaomi", "xiaomi", 18999, "Snapdragon 8 Gen 1 (4nm)", 6.28, "AMOLED", 120, 50, true, 4500, 67, 8, 256, false],
  ["Xiaomi MIX Fold 3", "Xiaomi", "xiaomi", 52999, "Snapdragon 8 Gen 2 (4nm)", 8.03, "Foldable LTPO OLED", 120, 50, true, 4800, 67, 16, 512, false],
  ["Xiaomi Civi 3", "Xiaomi", "xiaomi", 18999, "MediaTek Dimensity 8200 Ultra (4nm)", 6.55, "AMOLED", 120, 50, true, 4500, 67, 12, 256, false],
  ["Redmi Note 17", "Redmi", "redmi", 12999, "Snapdragon 6 Gen 3", 6.67, "AMOLED", 120, 108, true, 5500, 45, 8, 256, true],
  ["Redmi Note 15", "Redmi", "redmi", 11999, "MediaTek Dimensity 7050", 6.67, "AMOLED", 120, 108, true, 5300, 45, 8, 256, true],
  ["Redmi Note 14 Pro", "Redmi", "redmi", 11999, "MediaTek Helio G100 Ultra", 6.67, "AMOLED", 120, 200, true, 5500, 45, 8, 256, true],
  ["Redmi Note 14", "Redmi", "redmi", 9499, "MediaTek Helio G99 Ultra", 6.67, "AMOLED", 120, 108, false, 5500, 33, 8, 128, true],
  ["Redmi Note 13 5G", "Redmi", "redmi", 10499, "MediaTek Dimensity 6080 (6nm)", 6.67, "AMOLED", 120, 108, false, 5000, 33, 8, 256, false],
  ["Redmi Note 12 Pro", "Redmi", "redmi", 9999, "Snapdragon 732G (8nm)", 6.67, "AMOLED", 120, 108, false, 5000, 67, 8, 256, false],
  ["Redmi Note 11 Pro+ 5G", "Redmi", "redmi", 11499, "MediaTek Dimensity 920 (6nm)", 6.67, "Super AMOLED", 120, 108, false, 4500, 120, 8, 256, false],
  ["Redmi Note 11 Pro", "Redmi", "redmi", 8999, "MediaTek Helio G96", 6.67, "Super AMOLED", 120, 108, false, 5000, 67, 8, 128, false],
  ["Redmi K70", "Redmi", "redmi", 19999, "Snapdragon 8 Gen 2 (4nm)", 6.67, "2K OLED", 120, 50, true, 5000, 120, 12, 256, false],
  ["Redmi K60 Pro", "Redmi", "redmi", 18999, "Snapdragon 8 Gen 2 (4nm)", 6.67, "2K OLED", 120, 50, true, 5000, 120, 12, 256, false],
  ["Redmi 12", "Redmi", "redmi", 6499, "MediaTek Helio G88", 6.79, "IPS LCD", 90, 50, false, 5000, 18, 8, 128, false],
  ["Redmi A3x", "Redmi", "redmi", 4599, "Unisoc T603", 6.71, "IPS LCD", 90, 8, false, 5000, 10, 4, 64, true],
  ["Redmi A2+", "Redmi", "redmi", 4199, "MediaTek Helio G36", 6.52, "IPS LCD", 60, 8, false, 5000, 10, 3, 64, false],
  ["POCO X5 Pro 5G", "POCO", "poco", 11999, "Snapdragon 778G 5G (6nm)", 6.67, "Flow AMOLED", 120, 108, false, 5000, 67, 8, 256, false],
  ["POCO M7", "POCO", "poco", 8499, "MediaTek Dimensity 6100+", 6.74, "IPS LCD", 120, 50, false, 5160, 33, 6, 128, true],
  ["POCO M5s", "POCO", "poco", 6799, "MediaTek Helio G95", 6.43, "AMOLED", 60, 64, false, 5000, 33, 6, 128, false],
  ["POCO C61", "POCO", "poco", 4899, "MediaTek Helio G36", 6.71, "IPS LCD", 90, 8, false, 5000, 10, 4, 128, true],
  ["HONOR Magic 8", "HONOR", "honor", 52999, "Snapdragon 8 Elite Gen 2 (2nm)", 6.78, "LTPO OLED", 120, 50, true, 5800, 100, 12, 256, true],
  ["HONOR Magic 7 RSR Porsche Design", "HONOR", "honor", 79999, "Snapdragon 8 Elite (3nm)", 6.8, "LTPO Tandem OLED", 120, 200, true, 5850, 100, 24, 1024, true],
  ["HONOR Magic 6", "HONOR", "honor", 36999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO OLED", 120, 50, true, 5450, 66, 12, 256, false],
  ["HONOR Magic 5", "HONOR", "honor", 27999, "Snapdragon 8 Gen 2 (4nm)", 6.73, "OLED", 120, 54, false, 5100, 66, 12, 256, false],
  ["HONOR Magic Vs", "HONOR", "honor", 46999, "Snapdragon 8+ Gen 1 (4nm)", 7.9, "Foldable OLED", 90, 54, false, 5000, 66, 12, 512, false],
  ["HONOR 300 Ultra", "HONOR", "honor", 33999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "AMOLED 1.5K", 120, 50, true, 5300, 100, 16, 512, true],
  ["HONOR 90 Lite", "HONOR", "honor", 9499, "MediaTek Dimensity 6020 (7nm)", 6.7, "IPS LCD", 90, 100, false, 4500, 35, 8, 256, false],
  ["HONOR X9a", "HONOR", "honor", 11499, "Snapdragon 695 5G (6nm)", 6.67, "AMOLED Curved", 120, 64, false, 5100, 40, 8, 256, false],
  ["HONOR X7b", "HONOR", "honor", 8499, "Snapdragon 680 (6nm)", 6.8, "IPS LCD", 90, 108, false, 6000, 35, 8, 256, false],
  ["HONOR X6b", "HONOR", "honor", 6499, "MediaTek Helio G85", 6.56, "TFT LCD", 90, 50, false, 5200, 35, 6, 128, true],
  ["HONOR Play 50 Plus", "HONOR", "honor", 7699, "MediaTek Dimensity 6020", 6.8, "IPS LCD", 90, 50, false, 6000, 35, 8, 256, false],
  ["Huawei Pura 80 Ultra", "Huawei", "huawei", 69999, "Kirin 9200", 6.8, "LTPO Tandem OLED", 120, 50, true, 5500, 100, 16, 512, true],
  ["Huawei Pura 70 Pro+", "Huawei", "huawei", 49999, "Kirin 9010 (7nm)", 6.8, "LTPO OLED", 120, 50, true, 5050, 100, 16, 512, true],
  ["Huawei P60 Pro", "Huawei", "huawei", 37999, "Snapdragon 8+ Gen 1", 6.67, "LTPO OLED", 120, 48, true, 4815, 88, 12, 256, false],
  ["Huawei P50 Pocket", "Huawei", "huawei", 32999, "Snapdragon 888", 6.9, "Foldable OLED", 120, 40, false, 4000, 40, 8, 256, false],
  ["Huawei nova 13", "Huawei", "huawei", 21999, "Kirin 8000", 6.7, "OLED", 120, 50, false, 5000, 100, 12, 256, true],
  ["Huawei nova 12i", "Huawei", "huawei", 10999, "Snapdragon 680", 6.7, "IPS LCD", 90, 108, false, 5000, 40, 8, 128, true],
  ["Huawei nova 11 Pro", "Huawei", "huawei", 18999, "Snapdragon 778G", 6.78, "OLED", 120, 50, false, 4500, 100, 8, 256, false],
  ["Huawei nova Y91", "Huawei", "huawei", 9499, "Snapdragon 680", 6.95, "IPS LCD", 90, 50, false, 7000, 22, 8, 128, false],
  ["Huawei Enjoy 70X", "Huawei", "huawei", 11999, "Kirin 8000A", 6.78, "AMOLED", 120, 50, true, 6100, 40, 8, 256, true],
  ["OPPO Find X8 Ultra", "OPPO", "oppo", 58999, "Snapdragon 8 Elite (3nm)", 6.82, "2K LTPO AMOLED", 120, 50, true, 6000, 100, 16, 512, true],
  ["OPPO Find X6 Pro", "OPPO", "oppo", 38999, "Snapdragon 8 Gen 2 (4nm)", 6.82, "LTPO3 AMOLED", 120, 50, true, 5000, 100, 16, 256, false],
  ["OPPO Find N5", "OPPO", "oppo", 76999, "Snapdragon 8 Elite (3nm)", 8.0, "Foldable LTPO OLED", 120, 50, true, 5600, 80, 16, 512, true],
  ["OPPO Find N2 Flip", "OPPO", "oppo", 28999, "MediaTek Dimensity 9000+ (4nm)", 6.8, "Foldable AMOLED", 120, 50, false, 4300, 44, 8, 256, false],
  ["OPPO Reno 15", "OPPO", "oppo", 24999, "MediaTek Dimensity 8350", 6.7, "AMOLED", 120, 50, true, 5600, 80, 12, 256, true],
  ["OPPO Reno 14", "OPPO", "oppo", 22999, "MediaTek Dimensity 8300", 6.7, "AMOLED", 120, 50, true, 5500, 80, 12, 256, true],
  ["OPPO Reno 12 F", "OPPO", "oppo", 13999, "MediaTek Dimensity 6300", 6.67, "AMOLED", 120, 50, false, 5000, 45, 8, 256, true],
  ["OPPO Reno 11 Pro 5G", "OPPO", "oppo", 20999, "MediaTek Dimensity 8200 (4nm)", 6.7, "AMOLED", 120, 50, true, 4600, 80, 12, 256, false],
  ["OPPO Reno 10 5G", "OPPO", "oppo", 14499, "MediaTek Dimensity 7050 (6nm)", 6.7, "AMOLED", 120, 64, false, 5000, 67, 8, 256, false],
  ["OPPO A80 5G", "OPPO", "oppo", 10999, "MediaTek Dimensity 6300", 6.67, "IPS LCD", 120, 50, false, 5100, 45, 8, 256, true],
  ["OPPO A18", "OPPO", "oppo", 5799, "MediaTek Helio G85", 6.56, "IPS LCD", 90, 8, false, 5000, 10, 4, 128, false],
  ["OPPO K12x", "OPPO", "oppo", 9999, "Snapdragon 695 5G", 6.67, "OLED", 120, 50, false, 5500, 80, 8, 256, true],
  ["vivo X200 Ultra", "vivo", "vivo", 57999, "Snapdragon 8 Elite (3nm)", 6.82, "2K LTPO AMOLED ZEISS", 120, 200, true, 6000, 100, 16, 512, true],
  ["vivo X100 Ultra", "vivo", "vivo", 51999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "2K LTPO AMOLED ZEISS", 120, 200, true, 5500, 80, 16, 512, true],
  ["vivo X Fold 3", "vivo", "vivo", 59999, "Snapdragon 8 Gen 2 (4nm)", 8.03, "Foldable LTPO AMOLED", 120, 50, true, 5500, 80, 12, 256, true],
  ["vivo V50", "vivo", "vivo", 23999, "Snapdragon 7 Gen 3 (4nm)", 6.78, "AMOLED", 120, 50, true, 6000, 80, 12, 256, true],
  ["vivo V40 Lite 5G", "vivo", "vivo", 15999, "Snapdragon 4 Gen 2 (4nm)", 6.67, "AMOLED", 120, 50, false, 5000, 80, 8, 256, true],
  ["vivo V30 Pro", "vivo", "vivo", 23999, "MediaTek Dimensity 8200 (4nm)", 6.78, "AMOLED ZEISS", 120, 50, true, 5000, 80, 12, 512, false],
  ["vivo V30 Lite", "vivo", "vivo", 13999, "Snapdragon 685 (6nm)", 6.67, "AMOLED", 120, 50, false, 5000, 80, 8, 256, false],
  ["vivo V29 5G", "vivo", "vivo", 16499, "Snapdragon 778G 5G (6nm)", 6.78, "AMOLED", 120, 50, true, 4600, 80, 8, 256, false],
  ["vivo Y100 5G", "vivo", "vivo", 11499, "Snapdragon 4 Gen 2 (4nm)", 6.67, "AMOLED", 120, 50, false, 5000, 80, 8, 256, false],
  ["vivo Y28", "vivo", "vivo", 7999, "MediaTek Helio G85", 6.68, "IPS LCD", 90, 50, false, 6000, 44, 8, 128, true],
  ["vivo Y18", "vivo", "vivo", 6299, "MediaTek Helio G85", 6.56, "IPS LCD", 90, 50, false, 5000, 15, 6, 128, true],
  ["vivo T3 Pro 5G", "vivo", "vivo", 15999, "Snapdragon 7 Gen 3 (4nm)", 6.77, "AMOLED", 120, 50, true, 5500, 80, 8, 256, true],
  ["iQOO 12 Pro", "iQOO", "iqoo", 35999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "2K E7 AMOLED", 144, 50, true, 5100, 120, 16, 512, false],
  ["iQOO Neo 9 Pro", "iQOO", "iqoo", 19999, "MediaTek Dimensity 9300 (4nm)", 6.78, "LTPO AMOLED", 144, 50, true, 5160, 120, 12, 256, false],
  ["iQOO Z9x 5G", "iQOO", "iqoo", 9999, "Snapdragon 6 Gen 1 (4nm)", 6.72, "IPS LCD", 120, 50, false, 6000, 44, 8, 128, true],
  ["realme GT 5 Pro", "realme", "realme", 29999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED", 144, 50, true, 5400, 100, 12, 256, false],
  ["realme GT Neo 6 SE", "realme", "realme", 16499, "Snapdragon 7+ Gen 3 (4nm)", 6.78, "LTPO AMOLED", 120, 50, true, 5500, 100, 8, 256, true],
  ["realme 14 Pro+ 5G", "realme", "realme", 20999, "Snapdragon 7s Gen 3 (4nm)", 6.83, "OLED 1.5K", 120, 50, true, 6000, 80, 12, 512, true],
  ["realme 13 Pro 5G", "realme", "realme", 15999, "Snapdragon 7s Gen 2 (4nm)", 6.7, "AMOLED", 120, 50, true, 5200, 45, 8, 256, true],
  ["realme 12 Pro 5G", "realme", "realme", 14499, "Snapdragon 6 Gen 1 (4nm)", 6.7, "AMOLED", 120, 50, true, 5000, 67, 8, 256, false],
  ["realme 11 Pro+ 5G", "realme", "realme", 14999, "MediaTek Dimensity 7050 (6nm)", 6.7, "AMOLED", 120, 200, true, 5000, 100, 12, 512, false],
  ["realme C63", "realme", "realme", 6799, "Unisoc T612", 6.74, "IPS LCD", 90, 50, false, 5000, 45, 6, 128, true],
  ["realme C61", "realme", "realme", 5999, "Unisoc T612", 6.74, "IPS LCD", 90, 50, false, 5000, 15, 6, 128, true],
  ["realme C53", "realme", "realme", 6299, "Unisoc T612", 6.74, "IPS LCD", 90, 50, false, 5000, 33, 6, 128, false],
  ["realme Narzo 70 Pro", "realme", "realme", 11999, "MediaTek Dimensity 7050", 6.67, "AMOLED", 120, 50, true, 5000, 67, 8, 256, true],
  ["OnePlus 13R", "OnePlus", "oneplus", 31999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED", 120, 50, true, 6000, 80, 12, 256, true],
  ["OnePlus 11 5G", "OnePlus", "oneplus", 28999, "Snapdragon 8 Gen 2 (4nm)", 6.7, "LTPO3 Fluid AMOLED", 120, 50, true, 5000, 100, 16, 256, false],
  ["OnePlus Nord CE4 Lite", "OnePlus", "oneplus", 12499, "Snapdragon 695 5G (6nm)", 6.67, "AMOLED", 120, 50, true, 5500, 80, 8, 256, true],
  ["OnePlus Nord 3 5G", "OnePlus", "oneplus", 17499, "MediaTek Dimensity 9000 (4nm)", 6.74, "Fluid AMOLED", 120, 50, true, 5000, 80, 16, 256, false],
  ["OnePlus Ace 5 Pro", "OnePlus", "oneplus", 32999, "Snapdragon 8 Elite (3nm)", 6.78, "LTPO OLED", 120, 50, true, 6100, 100, 16, 512, true],
  ["Motorola Edge 50 Neo", "Motorola", "motorola", 18999, "MediaTek Dimensity 7300 (4nm)", 6.4, "LTPO P-OLED", 120, 50, true, 4310, 68, 8, 256, true],
  ["Motorola Edge 40 Pro", "Motorola", "motorola", 26999, "Snapdragon 8 Gen 2 (4nm)", 6.67, "P-OLED 165Hz", 165, 50, true, 4600, 125, 12, 256, false],
  ["Motorola Razr 40 Ultra", "Motorola", "motorola", 32999, "Snapdragon 8+ Gen 1 (4nm)", 6.9, "Foldable LTPO AMOLED", 165, 12, true, 3800, 30, 8, 256, false],
  ["Motorola Moto G75 5G", "Motorola", "motorola", 11999, "Snapdragon 6 Gen 3 (4nm)", 6.78, "IPS LCD MIL-STD", 120, 50, true, 5000, 30, 8, 256, true],
  ["Motorola Moto G34 5G", "Motorola", "motorola", 7499, "Snapdragon 695 5G (6nm)", 6.5, "IPS LCD", 120, 50, false, 5000, 18, 8, 128, false],
  ["Motorola Moto G24 Power", "Motorola", "motorola", 6999, "MediaTek Helio G85", 6.56, "IPS LCD", 90, 50, false, 6000, 30, 8, 256, true],
  ["Nothing Phone (3)", "Nothing", "nothing", 29999, "Snapdragon 8s Gen 3 (4nm)", 6.7, "LTPO OLED Glyph", 120, 50, true, 5000, 65, 12, 256, true],
  ["Google Pixel 10 Pro", "Google", "google", 54999, "Google Tensor G5 (3nm)", 6.3, "Super Actua LTPO OLED", 120, 50, true, 4800, 45, 16, 256, true],
  ["Google Pixel 10", "Google", "google", 44999, "Google Tensor G5 (3nm)", 6.3, "Actua OLED", 120, 50, true, 4700, 35, 12, 128, true],
  ["Google Pixel 9a", "Google", "google", 25999, "Google Tensor G4 (4nm)", 6.3, "Actua OLED", 120, 48, true, 5100, 23, 8, 128, true],
  ["Google Pixel 8", "Google", "google", 27999, "Google Tensor G3 (4nm)", 6.2, "Actua OLED", 120, 50, true, 4575, 27, 8, 128, false],
  ["Google Pixel Fold", "Google", "google", 54999, "Google Tensor G2 (5nm)", 7.6, "Foldable OLED", 120, 48, true, 4821, 30, 12, 256, false],
  ["Google Pixel 7", "Google", "google", 21499, "Google Tensor G2 (5nm)", 6.3, "AMOLED", 90, 50, true, 4355, 20, 8, 128, false],
  ["Google Pixel 7a", "Google", "google", 17999, "Google Tensor G2 (5nm)", 6.1, "OLED", 90, 64, true, 4385, 18, 8, 128, false],
  ["Sony Xperia 1 V", "Sony", "sony", 44999, "Snapdragon 8 Gen 2 (4nm)", 6.5, "4K HDR OLED", 120, 48, true, 5000, 30, 12, 256, false],
  ["Sony Xperia 10 V", "Sony", "sony", 15999, "Snapdragon 695 5G (6nm)", 6.1, "OLED", 60, 48, true, 5000, 21, 6, 128, false],
  ["ASUS ROG Phone 9", "ASUS", "asus", 48999, "Snapdragon 8 Elite (3nm)", 6.78, "LTPO AMOLED 185Hz", 165, 50, true, 5800, 65, 16, 512, true],
  ["ASUS ROG Phone 8", "ASUS", "asus", 41999, "Snapdragon 8 Gen 3 (4nm)", 6.78, "LTPO AMOLED 165Hz", 165, 50, true, 5500, 65, 12, 256, true],
  ["Lenovo Legion Phone Duel 2", "Lenovo", "lenovo", 22999, "Snapdragon 888 5G (5nm)", 6.92, "AMOLED 144Hz", 144, 64, false, 5500, 90, 12, 256, false],
  ["Lenovo ThinkPhone", "Lenovo", "lenovo", 21999, "Snapdragon 8+ Gen 1 (4nm)", 6.6, "P-OLED 144Hz", 144, 50, true, 5000, 68, 8, 256, false],
  ["ZTE Axon 50 Ultra", "ZTE", "zte", 28999, "Snapdragon 8+ Gen 1 (4nm)", 6.67, "AMOLED", 144, 64, true, 5000, 80, 12, 256, false],
  ["ZTE Blade A75 5G", "ZTE", "zte", 6999, "Unisoc T760 5G", 6.6, "IPS LCD", 120, 50, false, 5000, 18, 4, 128, true],
  ["ZTE Blade A55", "ZTE", "zte", 4699, "Unisoc SC9863A", 6.75, "IPS LCD", 90, 13, false, 5000, 10, 4, 64, true],
  ["Nubia Z60S Pro", "Nubia", "nubia", 27999, "Snapdragon 8 Gen 2 (4nm)", 6.78, "AMOLED", 120, 50, true, 5100, 80, 12, 256, true],
  ["Nubia Focus 5G", "Nubia", "nubia", 9499, "Unisoc T760 5G", 6.6, "IPS LCD", 120, 108, false, 5000, 33, 6, 256, true],
  ["Nubia Neo 2 5G", "Nubia", "nubia", 10999, "Unisoc T820 5G", 6.72, "IPS LCD", 120, 50, false, 6000, 33, 8, 256, true],
  ["REDMAGIC 10 Pro", "REDMAGIC", "redmagic", 42999, "Snapdragon 8 Elite (3nm)", 6.85, "AMOLED 144Hz UDC", 144, 50, true, 6500, 80, 12, 256, true],
  ["REDMAGIC 9S Pro+", "REDMAGIC", "redmagic", 43999, "Snapdragon 8 Gen 3 Leading (4nm)", 6.8, "AMOLED UDC", 120, 50, true, 5500, 165, 16, 512, true],
  ["Tecno Phantom V Fold", "Tecno", "tecno", 38999, "MediaTek Dimensity 9000+ (4nm)", 7.85, "Foldable LTPO AMOLED", 120, 50, false, 5000, 45, 12, 256, false],
  ["Tecno Camon 30 5G", "Tecno", "tecno", 14499, "MediaTek Dimensity 7020 (6nm)", 6.78, "AMOLED", 120, 50, true, 5000, 70, 8, 256, true],
  ["Tecno Camon 20 Pro 5G", "Tecno", "tecno", 11999, "MediaTek Dimensity 8050 (6nm)", 6.67, "AMOLED", 120, 64, true, 5000, 33, 8, 256, false],
  ["Tecno Pova 6", "Tecno", "tecno", 11499, "MediaTek Helio G99 Ultimate", 6.78, "AMOLED", 120, 108, false, 6000, 70, 8, 256, true],
  ["Tecno Pova 6 Neo", "Tecno", "tecno", 9499, "MediaTek Helio G99 Ultimate", 6.78, "IPS LCD", 120, 50, false, 7000, 33, 8, 256, true],
  ["Tecno Spark 20 Pro", "Tecno", "tecno", 7999, "MediaTek Helio G99", 6.78, "IPS LCD", 120, 108, false, 5000, 33, 8, 256, false],
  ["Tecno Spark 20", "Tecno", "tecno", 6499, "MediaTek Helio G85", 6.56, "IPS LCD", 90, 50, false, 5000, 18, 8, 128, false],
  ["Tecno Spark Go 1", "Tecno", "tecno", 4799, "Unisoc T615", 6.67, "IPS LCD", 120, 13, false, 5000, 15, 4, 64, true],
  ["Infinix Zero Flip 5G", "Infinix", "infinix", 29999, "MediaTek Dimensity 8020 (6nm)", 6.9, "Foldable LTPO AMOLED", 120, 50, true, 4720, 70, 8, 512, true],
  ["Infinix Zero 30 5G", "Infinix", "infinix", 14999, "MediaTek Dimensity 8020 (6nm)", 6.78, "AMOLED", 144, 108, true, 5000, 68, 12, 256, false],
  ["Infinix GT 10 Pro", "Infinix", "infinix", 13999, "MediaTek Dimensity 8050 (6nm)", 6.67, "AMOLED", 120, 108, false, 5000, 45, 8, 256, false],
  ["Infinix Note 40", "Infinix", "infinix", 9999, "MediaTek Helio G99 Ultimate", 6.78, "AMOLED", 120, 108, false, 5000, 45, 8, 256, true],
  ["Infinix Note 30 VIP", "Infinix", "infinix", 13499, "MediaTek Dimensity 8050 (6nm)", 6.67, "AMOLED", 120, 108, false, 5000, 68, 12, 256, false],
  ["Infinix Hot 40 Pro", "Infinix", "infinix", 8299, "MediaTek Helio G99", 6.78, "IPS LCD", 120, 108, false, 5000, 33, 8, 256, false],
  ["Infinix Smart 8", "Infinix", "infinix", 4899, "Unisoc T606", 6.6, "IPS LCD", 90, 13, false, 5000, 10, 4, 64, false],
  ["TCL 50 NxtPaper 5G", "TCL", "tcl", 11999, "MediaTek Dimensity 6300", 6.8, "NxtPaper IPS", 120, 108, false, 5010, 33, 8, 256, true],
  ["TCL 50 SE", "TCL", "tcl", 7499, "MediaTek Helio G88", 6.78, "IPS LCD", 90, 50, false, 5010, 33, 6, 128, true],
  ["TCL 40 SE", "TCL", "tcl", 5999, "MediaTek Helio G37", 6.75, "IPS LCD", 90, 50, false, 5010, 18, 4, 128, false],
  ["TCL 30+", "TCL", "tcl", 5499, "MediaTek Helio G37", 6.7, "AMOLED", 60, 50, false, 5010, 18, 4, 128, false],
  ["TCL 20 Pro 5G", "TCL", "tcl", 9999, "Snapdragon 750G 5G", 6.67, "AMOLED", 60, 48, true, 4500, 18, 6, 256, false],
  ["Meizu 22 Pro", "Meizu", "meizu", 44999, "Snapdragon 8 Elite (3nm)", 6.8, "2K LTPO OLED", 120, 50, true, 5600, 80, 16, 512, true],
  ["Meizu 21", "Meizu", "meizu", 27999, "Snapdragon 8 Gen 3 (4nm)", 6.55, "AMOLED", 120, 200, true, 4800, 80, 12, 256, true],
  ["Meizu 20 Infinity", "Meizu", "meizu", 29999, "Snapdragon 8 Gen 2 (4nm)", 6.79, "LTPO OLED", 120, 50, true, 4800, 65, 12, 256, false],
  ["Meizu 20 Pro", "Meizu", "meizu", 25999, "Snapdragon 8 Gen 2 (4nm)", 6.81, "LTPO OLED 2K", 120, 50, true, 5000, 80, 12, 256, false],
  ["Sharp Aquos R8s Pro", "Sharp", "sharp", 24999, "Snapdragon 8 Gen 2 (4nm)", 6.6, "Pro IGZO OLED 240Hz", 144, 47, false, 5000, 27, 12, 256, false],
  ["Sharp Aquos Sense 8", "Sharp", "sharp", 13999, "Snapdragon 6 Gen 1 (4nm)", 6.1, "IGZO OLED", 90, 50, true, 5000, 20, 8, 128, false],
  ["Sharp Aquos Wish 4", "Sharp", "sharp", 8999, "MediaTek Dimensity 700", 6.6, "IPS LCD", 90, 50, false, 5000, 18, 4, 64, true],
  ["Fairphone 3+", "Fairphone", "fairphone", 11999, "Snapdragon 632", 5.65, "IPS LCD", 60, 48, false, 3040, 18, 4, 64, false],
  ["HMD Crest Max 5G", "HMD", "hmd", 9999, "Unisoc T760 5G", 6.67, "OLED", 90, 64, false, 5000, 33, 8, 256, true],
  ["HMD Pulse+", "HMD", "hmd", 6799, "Unisoc T606", 6.56, "IPS LCD", 90, 50, false, 5000, 10, 4, 128, true],
  ["HMD Pulse", "HMD", "hmd", 5799, "Unisoc T606", 6.56, "IPS LCD", 90, 13, false, 5000, 10, 4, 64, true],
  ["Nokia XR20", "Nokia", "nokia", 14999, "Snapdragon 480 5G", 6.67, "IPS LCD MIL-STD", 60, 48, false, 4630, 18, 6, 128, false],
  ["Nokia G60 5G", "Nokia", "nokia", 10499, "Snapdragon 695 5G", 6.58, "IPS LCD", 120, 50, false, 4500, 20, 6, 128, false],
  ["Nokia G22", "Nokia", "nokia", 6999, "Unisoc T606", 6.52, "IPS LCD QuickFix", 90, 50, false, 5050, 20, 4, 128, false],
  ["Nokia C22", "Nokia", "nokia", 4799, "Unisoc SC9863A", 6.5, "IPS LCD", 60, 13, false, 5000, 10, 3, 64, false],
  ["Nokia 8.3 5G", "Nokia", "nokia", 11999, "Snapdragon 765G 5G", 6.81, "IPS LCD ZEISS", 60, 64, false, 4500, 18, 8, 128, false],
  ["Nokia 7.2", "Nokia", "nokia", 6499, "Snapdragon 660", 6.3, "IPS LCD HDR10", 60, 48, false, 3500, 10, 6, 128, false],
  ["Nokia 6.2", "Nokia", "nokia", 5499, "Snapdragon 636", 6.3, "IPS LCD", 60, 16, false, 3500, 10, 4, 64, false],
  ["Nokia 5.4", "Nokia", "nokia", 5199, "Snapdragon 662", 6.39, "IPS LCD", 60, 48, false, 4000, 10, 4, 128, false]
];

const UNIQUE_MODELS = Array.from(new Map(MODELS.map(m => [m[0].toLowerCase(), m])).values());
const phones = UNIQUE_MODELS.map((m, idx) => {
  const [name, brand, brandSlug, price, chipset, size, tech, hz, mp, ois, bat, wire, ram, storage, isNew] = m;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `phone-${String(idx + 1).padStart(3, '0')}`;
  const image = ensurePhoneImage(slug, brand, name, brandSlug);
  const highestPrice = Math.round(price * 1.13);
  const sixMonthLowestPrice = Math.round(price * 0.93);
  const storesPrices = generateStores(price, slug);
  const lowestPrice = storesPrices[0].price;

  return {
    id,
    slug,
    name,
    brand,
    brandSlug,
    image,
    images: [image, image, image],
    lowestPrice,
    highestPrice,
    sixMonthLowestPrice,
    priceStore: storesPrices[0].store,
    priceUrl: storesPrices[0].url,
    releaseDate: isNew ? "2024-11-01T00:00:00Z" : "2023-10-15T00:00:00Z",
    isNew,
    isPriceDropped: idx % 2 === 0 || isNew,
    priceDropPercent: Math.round(((highestPrice - lowestPrice) / highestPrice) * 100),
    rating: Number((8.1 + ((idx * 7) % 16) / 10).toFixed(1)),
    reviewCount: 250 + ((idx * 173) % 3800),
    description: `${name}; ${chipset} işlemcisi, ${size}" ${hz}Hz ${tech} ekranı, ${mp} MP ${ois ? 'OIS destekli ' : ''}kamerası ve ${bat} mAh (${wire}W hızlı şarj) bataryasıyla Türkiye'deki 16 resmi mağazada en uygun fiyatlarla.`,
    tags: [brandSlug, isNew ? "yeni" : "firsat", "5g", ram >= 12 ? "flagship" : "orta-segment"],
    specs: {
      display: {
        size,
        resolution: size >= 6.7 ? "2800 x 1260" : "2400 x 1080",
        technology: tech,
        refreshRate: hz,
        brightness: hz >= 120 ? 2600 : 1200,
        aspectRatio: "20:9",
        protection: "Corning Gorilla Glass Victus",
        hdr: "HDR10+",
        ppi: size >= 6.7 ? 452 : 405
      },
      camera: {
        mainCamera: { megapixels: mp, aperture: "f/1.7", sensorSize: "1/1.4\"", ois, autofocus: "PDAF" },
        ultrawide: { megapixels: 12, aperture: "f/2.2", fov: 120 },
        telephoto: price > 35000 ? { megapixels: 50, aperture: "f/2.4", opticalZoom: 3, maxZoom: 30 } : undefined,
        frontCamera: { megapixels: price > 25000 ? 32 : 16, aperture: "f/2.2", autofocus: true },
        videoCapabilities: ["4K@60fps", "1080p@120fps"],
        features: ["Gece Modu", "Portre Modu", "Yapay Zeka Sahne Tanıma"]
      },
      battery: {
        capacity: bat,
        wiredCharging: wire,
        wirelessCharging: price > 32000 ? 25 : 0,
        reverseWirelessCharging: price > 32000,
        chargingTime: "0'dan %100'e Hızlı Şarj",
        removable: brandSlug === "fairphone"
      },
      performance: {
        chipset,
        cpu: "8 Çekirdekli Yüksek Frekanslı Mimari",
        gpu: "Yeni Nesil Grafik Birimi",
        ram,
        storage,
        storageType: storage >= 256 ? "UFS 4.0" : "UFS 3.1",
        expandableStorage: price < 15000
      },
      connectivity: {
        sim: "Nano-SIM + eSIM",
        nfc: true,
        bluetooth: "5.4",
        wifi: "Wi-Fi 6E / Wi-Fi 7",
        usb: "USB Type-C",
        fiveG: price >= 7500,
        infrared: ["xiaomi", "redmi", "poco"].includes(brandSlug)
      },
      design: {
        width: 75.8,
        height: 161.5,
        thickness: 8.1,
        weight: 196,
        materials: price > 40000 ? "Titanyum / Alüminyum & Cam" : "Polikarbonat & Cam",
        colors: ["Gece Siyahı", "Titanyum Gri", "Buz Mavisi", "Zümrüt Yeşili"],
        waterResistance: price > 20000 ? "IP68" : "IP54",
        fingerprint: "Ekran İçi Parmak İzi",
        faceId: true
      },
      software: {
        os: brandSlug === "apple" ? "iOS 18" : "Android 15",
        updatePolicy: "Resmi Güncelleme Garantili"
      }
    },
    storesPrices
  };
});

const tsContent = `// Auto-generated comprehensive catalog (${phones.length} models across 34 brands)
import type { Phone } from "@/types";

export const phones: Phone[] = ${JSON.stringify(phones, null, 2)};

export const priceDroppingPhones = phones.filter((p) => p.isPriceDropped);
export const cheapestPhones = [...phones].sort((a, b) => a.lowestPrice - b.lowestPrice);
export const newPhones = phones.filter((p) => p.isNew);
export const popularPhones = phones.filter((p) => (p.reviewCount || 0) > 1000);
`;

fs.writeFileSync(path.join(projectDir, 'src', 'data', 'phones.ts'), tsContent, 'utf-8');
console.log(`Generated ${phones.length} phones across 34 brands in src/data/phones.ts`);
