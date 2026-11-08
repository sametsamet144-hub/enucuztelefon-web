import type {
  Phone,
  Brand,
  Guide,
  QAItem,
  PriceHistory,
  StoreInfo,
  StorePrice,
  ProductFilterParams,
  PagedApiResult,
  CreatePriceAlertRequest,
  PriceAlertResponse,
  StoreRedirectParams,
  StoreRedirectResponse,
  ProductPricesResponse,
} from "@/types";
import { normalizePhone, normalizePriceHistory, isRealDirectStoreOffer } from "./normalizers";

const DEFAULT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://enucuztelefon-backend.onrender.com/api/v1"
    : "http://localhost:5000/api/v1";

export const API_BASE_URL =
  (typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) || DEFAULT_API_URL;

export interface AdminDashboardStatsDto {
  totalPhones: number;
  totalVariants: number;
  totalBrands: number;
  totalStores: number;
  activeIntegrations: number;
  totalOffers: number;
  verifiedPricesCount: number;
  priceDropCount: number;
  suspiciousPricesCount: number;
  pendingMatchesCount: number;
  lastUpdated: string;
}

export type { PagedApiResult, CreatePriceAlertRequest, PriceAlertResponse };

/**
 * Low-level API caller with timeout and safety fallbacks
 */
async function fetchApi<T>(path: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[API] ${init?.method || "GET"} ${path} returned status ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn(`[API] Request to ${path} timed out after 12s`);
    } else if (err.code === "ECONNREFUSED" || err?.cause?.code === "ECONNREFUSED") {
      console.warn(`[API] Backend service offline or unreachable at ${API_BASE_URL} (${path}).`);
    } else {
      console.warn(`[API] Request failed for ${path}:`, err?.message || err);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Builds standard query string from ProductFilterParams
 */
function buildProductQueryParams(params?: ProductFilterParams | string): string {
  if (!params) return "";
  if (typeof params === "string") return params.startsWith("?") ? params.slice(1) : params;

  const q = new URLSearchParams();
  if (params.brand) q.set("brand", params.brand);
  if (params.search) q.set("search", params.search);
  if (params.minPrice !== undefined && params.minPrice !== null) q.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined && params.maxPrice !== null) q.set("maxPrice", String(params.maxPrice));
  if (params.ram !== undefined && params.ram !== null) q.set("ram", String(params.ram));
  if (params.storage !== undefined && params.storage !== null) q.set("storage", String(params.storage));
  if (params.isPriceDropped !== undefined) q.set("isPriceDropped", String(params.isPriceDropped));
  if (params.isNew !== undefined) q.set("isNew", String(params.isNew));
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));

  return q.toString();
}

export const backendApi = {
  // ─── 1. Ürün & Fiyat Endpoint'leri (Ana Akış) ─────────────
  /**
   * GET /api/v1/products
   * Katalogdaki tüm telefonları filtreleme, sıralama ve sayfalama ile listeler.
   */
  getProducts: async (params?: ProductFilterParams | string): Promise<PagedApiResult<Phone> | null> => {
    const queryString = buildProductQueryParams(params);
    const path = `/products${queryString ? `?${queryString}` : ""}`;
    const raw = await fetchApi<PagedApiResult<any>>(path);
    if (!raw || !Array.isArray(raw.items)) return null;

    return {
      ...raw,
      items: raw.items.map(normalizePhone),
    };
  },

  /**
   * GET /api/v1/products/{slug}
   * Bir telefonun tüm detaylarını, teknik özelliklerini ve 29 mağazadaki güncel tekliflerini getirir.
   */
  getProductBySlug: async (slug: string): Promise<Phone | null> => {
    const raw = await fetchApi<any>(`/products/${encodeURIComponent(slug)}`);
    if (!raw) return null;
    return normalizePhone(raw);
  },

  /**
   * GET /api/v1/products/{slug}/offers
   * Seçilen telefona ait mağaza tekliflerinin filtrelenmiş ve sıralanmış listesini döner.
   */
  getProductOffers: async (slug: string): Promise<StorePrice[] | null> => {
    const raw = await fetchApi<StorePrice[]>(`/products/${encodeURIComponent(slug)}/offers`);
    if (!raw || !Array.isArray(raw)) return null;
    return raw.filter(isRealDirectStoreOffer);
  },

  /**
   * GET /api/v1/products/{id}/prices
   * Route alias: GET /api/v1/phones/{id}/prices
   * Query param: GET /api/v1/products/prices?phoneId={id}
   * URL yolundaki (route) telefon ID'sine göre tüm mağaza fiyat ve linklerini getirir.
   */
  getProductPrices: async (
    idOrSlug: string,
    options?: { useQueryParam?: boolean; useAlias?: boolean }
  ): Promise<ProductPricesResponse | null> => {
    if (!idOrSlug) return null;

    const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let targetId = idOrSlug;

    if (!isGuid) {
      // Slug gönderilmişse ilgili telefonun verisinden asıl GUID ID'yi al
      const phone = await backendApi.getProductBySlug(idOrSlug);
      if (phone?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(phone.id)) {
        targetId = phone.id;
      }
    }

    let path = `/products/${encodeURIComponent(targetId)}/prices`;
    if (options?.useQueryParam) {
      path = `/products/prices?phoneId=${encodeURIComponent(targetId)}`;
    } else if (options?.useAlias) {
      path = `/phones/${encodeURIComponent(targetId)}/prices`;
    }

    const raw = await fetchApi<ProductPricesResponse>(path);
    if (!raw || !Array.isArray(raw.storePrices)) return null;

    const mappedOffers: StorePrice[] = raw.storePrices
      .filter(isRealDirectStoreOffer)
      .map((sp: any) => ({
        store: sp.store || "Mağaza",
        storeSlug: sp.storeSlug || (sp.store || "").toLowerCase().replace(/[^a-z0-9]/g, ""),
        storeLogoUrl: sp.storeLogoUrl || null,
        sellerName: sp.sellerName || sp.store,
        sellerRating: sp.sellerRating ?? 9.5,
        price: Number(sp.price) || 0,
        originalPrice: sp.originalPrice ? Number(sp.originalPrice) : null,
        url: sp.url || "",
        isAvailable: sp.isAvailable ?? true,
        variant: sp.variant || null,
        storageGb: sp.storageGb !== undefined ? sp.storageGb : null,
        color: sp.color || null,
        shippingText: sp.shippingText || "Ücretsiz Kargo",
        guaranteeText: sp.guaranteeText || "2 Yıl Resmi Distribütör Garantili",
        installmentText: sp.installmentText || "Peşin Fiyatına 3 Taksit",
        isOfficial: sp.isOfficial ?? false,
        lastUpdated: sp.lastCheckedAt || sp.lastUpdated || new Date().toISOString(),
        lastCheckedAt: sp.lastCheckedAt || sp.lastUpdated,
      }))
      .sort((a, b) => a.price - b.price);

    const lowest = mappedOffers.length > 0 ? mappedOffers[0].price : Number(raw.lowestPrice) || 0;
    const highest =
      mappedOffers.length > 0
        ? mappedOffers[mappedOffers.length - 1].price
        : Number(raw.highestPrice) || lowest;

    return {
      phoneId: raw.phoneId || targetId,
      phoneName: raw.phoneName,
      slug: raw.slug,
      brand: raw.brand,
      brandSlug: raw.brandSlug,
      imageUrl: raw.imageUrl,
      lowestPrice: lowest,
      highestPrice: highest,
      totalStores: raw.totalStores || mappedOffers.length,
      totalOffers: raw.totalOffers || mappedOffers.length,
      storePrices: mappedOffers,
    };
  },

  /**
   * GET /api/v1/products/{slug}/price-history
   * Fiyat değişim grafiği çizdirmek için geçmiş fiyat kayıtlarını döner.
   */
  getProductPriceHistory: async (slug: string): Promise<PriceHistory[] | null> => {
    const raw = await fetchApi<any[]>(`/products/${encodeURIComponent(slug)}/price-history`);
    if (!raw) return null;
    return normalizePriceHistory(raw);
  },

  /**
   * GET /api/v1/products/{slug}/alternatives
   * Benzer / alternatif telefonlar
   */
  getProductAlternatives: async (slug: string): Promise<Phone[] | null> => {
    const raw = await fetchApi<any[]>(`/products/${encodeURIComponent(slug)}/alternatives`);
    if (!raw || !Array.isArray(raw)) return null;
    return raw.map(normalizePhone);
  },

  /**
   * GET /api/v1/products/deals?limit=6
   * Fiyatı Düşenler (Günün Fırsatları)
   */
  getDeals: async (limit = 6): Promise<Phone[] | null> => {
    const raw = await fetchApi<any[]>(`/products/deals?limit=${limit}`);
    if (!raw || !Array.isArray(raw)) return null;
    return raw.map(normalizePhone);
  },

  /**
   * GET /api/v1/products/cheapest?limit=6
   * En Ucuz Telefonlar (Bütçe Dostu)
   */
  getCheapest: async (limit = 6): Promise<Phone[] | null> => {
    const raw = await fetchApi<any[]>(`/products/cheapest?limit=${limit}`);
    if (!raw || !Array.isArray(raw)) return null;
    return raw.map(normalizePhone);
  },

  /**
   * GET /api/v1/products/new-releases?limit=6
   * Yeni Çıkan Modeller
   */
  getNewReleases: async (limit = 6): Promise<Phone[] | null> => {
    const raw = await fetchApi<any[]>(`/products/new-releases?limit=${limit}`);
    if (!raw || !Array.isArray(raw)) return null;
    return raw.map(normalizePhone);
  },

  /**
   * GET /api/v1/products/popular?limit=6
   * En Popüler Telefonlar
   */
  getPopular: async (limit = 6): Promise<Phone[] | null> => {
    const raw = await fetchApi<any[]>(`/products/popular?limit=${limit}`);
    if (!raw || !Array.isArray(raw)) return null;
    return raw.map(normalizePhone);
  },

  // ─── 2. Canlı Arama Endpoint'i ────────────────────────────
  /**
   * GET /api/v1/search?q={query}&limit=10
   * Arama çubuğunda anlık tamamlama ve arama sonuçlarını getirir.
   */
  searchPhones: async (q: string, limit = 10): Promise<Phone[] | null> => {
    if (!q || !q.trim()) return [];
    const raw = await fetchApi<any[]>(
      `/search?q=${encodeURIComponent(q.trim())}&limit=${limit}`
    );
    if (!raw || !Array.isArray(raw)) return null;
    return raw.map(normalizePhone);
  },

  // ─── 3. Mağazaya Yönlendirme (Satın Al / Güvenli Yönlendirme) ─
  /**
   * Builds the backend redirect URL for outbound clicks.
   * Logs telemetry and redirects with 302 to the retailer safely.
   */
  getStoreRedirectUrl: (params: StoreRedirectParams): string => {
    const q = new URLSearchParams();
    if (params.store) q.set("store", params.store);
    if (params.product) q.set("product", params.product);
    if (params.url) q.set("url", params.url);
    if (params.mode) q.set("mode", params.mode);
    return `${API_BASE_URL}/redirect?${q.toString()}`;
  },

  /**
   * GET /api/v1/redirect?mode=json
   * JSON modunda yönlendirme bilgisini sorgular.
   */
  fetchRedirectJson: (params: StoreRedirectParams): Promise<StoreRedirectResponse | null> => {
    const q = new URLSearchParams();
    q.set("store", params.store);
    q.set("product", params.product);
    if (params.url) q.set("url", params.url);
    q.set("mode", "json");
    return fetchApi<StoreRedirectResponse>(`/redirect?${q.toString()}`);
  },

  // ─── 4. Karşılaştırma Endpoint'i ──────────────────────────
  /**
   * GET /api/v1/compare?slugs={slug1},{slug2}
   * Yan yana telefon karşılaştırma tablosu için 2 ila 4 telefonu aynı anda çeker.
   */
  comparePhones: async (slugs: string[]): Promise<Phone[] | null> => {
    if (!slugs || slugs.length === 0) return [];
    const raw = await fetchApi<any[]>(
      `/compare?slugs=${encodeURIComponent(slugs.join(","))}`
    );
    if (!raw || !Array.isArray(raw)) return null;
    return raw.map(normalizePhone);
  },

  // ─── 5. Mağazalar ve Markalar ─────────────────────────────
  /**
   * GET /api/v1/stores
   * Desteklenen 29 Mağazanın Listesi
   */
  getStores: (): Promise<StoreInfo[] | null> => fetchApi<StoreInfo[]>("/stores"),

  /**
   * GET /api/v1/stores/{slug}
   * Tek Mağaza Detayı (örn: /api/v1/stores/teknosa)
   */
  getStoreBySlug: (slug: string): Promise<StoreInfo | null> =>
    fetchApi<StoreInfo>(`/stores/${encodeURIComponent(slug)}`),

  /**
   * GET /api/v1/brands
   * Tüm Markalar (30 Marka)
   */
  getBrands: (): Promise<Brand[] | null> => fetchApi<Brand[]>("/brands"),

  /**
   * GET /api/v1/brands/{slug}/products?page=1&pageSize=20
   * Bir Markanın Telefonları
   */
  getBrandProducts: async (
    slug: string,
    page = 1,
    pageSize = 20
  ): Promise<PagedApiResult<Phone> | null> => {
    const raw = await fetchApi<PagedApiResult<any>>(
      `/brands/${encodeURIComponent(slug)}/products?page=${page}&pageSize=${pageSize}`
    );
    if (!raw || !Array.isArray(raw.items)) return null;

    return {
      ...raw,
      items: raw.items.map(normalizePhone),
    };
  },

  // Alias for backward compatibility
  getBrandPhones: async (slug: string): Promise<PagedApiResult<Phone> | null> => {
    return backendApi.getBrandProducts(slug, 1, 20);
  },

  // ─── 6. Fiyat Alarmı ──────────────────────────────────────
  /**
   * POST /api/v1/price-alerts
   * Kullanıcı belirli bir fiyatın altına düştüğünde bildirim almak isterse
   */
  createPriceAlert: (payload: CreatePriceAlertRequest): Promise<PriceAlertResponse | null> => {
    return fetchApi<PriceAlertResponse>("/price-alerts", {
      method: "POST",
      body: JSON.stringify({
        productVariantId: payload.productVariantId || payload.productId,
        phoneSlug: payload.phoneSlug,
        targetPrice: payload.targetPrice,
        email: payload.email,
      }),
    });
  },

  // ─── Ekstra İçerik ve Admin Endpoint'leri ──────────────────
  getArticles: (): Promise<Guide[] | null> => fetchApi<Guide[]>("/content/articles"),
  getArticleBySlug: (slug: string): Promise<Guide | null> =>
    fetchApi<Guide>(`/content/articles/${encodeURIComponent(slug)}`),
  getQAItems: (): Promise<QAItem[] | null> => fetchApi<QAItem[]>("/content/qa"),
  getAdminDashboard: (): Promise<AdminDashboardStatsDto | null> =>
    fetchApi<AdminDashboardStatsDto>("/admin/dashboard"),
  triggerStoreSync: (slug: string): Promise<{ success: boolean } | null> =>
    fetchApi<{ success: boolean }>(`/admin/stores/${encodeURIComponent(slug)}/sync`, {
      method: "POST",
    }),
};
