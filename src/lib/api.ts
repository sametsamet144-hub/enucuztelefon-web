import type { Phone, Brand, Guide, QAItem, PriceHistory, StoreInfo } from "@/types";

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

export interface PagedApiResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreatePriceAlertRequest {
  phoneSlug: string;
  targetPrice: number;
  email: string;
}

export interface PriceAlertResponse {
  id: string;
  phoneSlug: string;
  phoneName: string;
  targetPrice: number;
  currentPrice: number;
  email: string;
  isTriggered: boolean;
  createdAt: string;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  // Set reasonable 15-second timeout
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.warn(`[API] ${init?.method || "GET"} ${path} returned status ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn(`[API] Request to ${path} timed out after 15s`);
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

export const backendApi = {
  getProducts: (query = "") =>
    fetchApi<PagedApiResult<Phone>>(`/products${query ? `?${query}` : ""}`),
  getProductBySlug: (slug: string) =>
    fetchApi<Phone>(`/products/${encodeURIComponent(slug)}`),
  getProductPriceHistory: (slug: string) =>
    fetchApi<PriceHistory[]>(`/products/${encodeURIComponent(slug)}/price-history`),
  getProductAlternatives: (slug: string) =>
    fetchApi<Phone[]>(`/products/${encodeURIComponent(slug)}/alternatives`),
  getDeals: (limit = 6) =>
    fetchApi<Phone[]>(`/products/deals?limit=${limit}`),
  getCheapest: (limit = 6) =>
    fetchApi<Phone[]>(`/products/cheapest?limit=${limit}`),
  getNewReleases: (limit = 6) =>
    fetchApi<Phone[]>(`/products/new-releases?limit=${limit}`),
  getBrands: () => fetchApi<Brand[]>("/brands"),
  getBrandBySlug: (slug: string) =>
    fetchApi<Brand>(`/brands/${encodeURIComponent(slug)}`),
  getBrandPhones: (slug: string) =>
    fetchApi<PagedApiResult<Phone>>(`/brands/${encodeURIComponent(slug)}/phones`),
  getStores: () => fetchApi<StoreInfo[]>("/stores"),
  getArticles: () => fetchApi<Guide[]>("/content/articles"),
  getArticleBySlug: (slug: string) =>
    fetchApi<Guide>(`/content/articles/${encodeURIComponent(slug)}`),
  getQAItems: () => fetchApi<QAItem[]>("/content/qa"),
  searchPhones: (q: string) =>
    fetchApi<Phone[]>(`/search?q=${encodeURIComponent(q)}`),
  comparePhones: (slugs: string[]) =>
    fetchApi<Phone[]>(`/compare?slugs=${encodeURIComponent(slugs.join(","))}`),
  getAdminDashboard: () => fetchApi<AdminDashboardStatsDto>("/admin/dashboard"),
  triggerStoreSync: (slug: string) =>
    fetchApi<{ success: boolean }>(`/admin/stores/${encodeURIComponent(slug)}/sync`, {
      method: "POST",
    }),
  createPriceAlert: (payload: CreatePriceAlertRequest) =>
    fetchApi<PriceAlertResponse>("/price-alerts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
