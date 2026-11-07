import { backendApi } from "@/lib/api";
import { resolvePhoneSlug } from "@/lib/utils";
import { brands as fallbackBrands } from "@/data/brands";
import { guides as fallbackGuides } from "@/data/guides";
import { stores as fallbackStores } from "@/data/stores";
import { qaItems as fallbackQAItems } from "@/data/qaItems";
import type { Phone, Brand, Guide, QAItem, FilterOptions, PriceHistory, StoreInfo } from "@/types";

// Helper to lazily load the large phones dataset only if the API is offline
async function getFallbackPhones(): Promise<Phone[]> {
  try {
    const { phones } = await import("@/data/phones");
    return phones || [];
  } catch {
    return [];
  }
}

export async function getPhones(filters?: Partial<FilterOptions>): Promise<Phone[]> {
  const params = new URLSearchParams();
  if (filters?.brands?.length === 1) params.set("brand", filters.brands[0]);
  if (filters?.priceRange) {
    params.set("minPrice", String(filters.priceRange[0]));
    params.set("maxPrice", String(filters.priceRange[1]));
  }
  if (filters?.ram?.length === 1) params.set("ram", String(filters.ram[0]));
  if (filters?.storage?.length === 1) params.set("storage", String(filters.storage[0]));
  if (filters?.os?.length === 1) params.set("os", filters.os[0]);
  params.set("pageSize", "100");

  const apiResponse = await backendApi.getProducts(params.toString());
  let result = apiResponse?.items && apiResponse.items.length > 0 ? [...apiResponse.items] : [];

  // Fallback to local dataset if backend API is not available
  if (result.length === 0) {
    const fallback = await getFallbackPhones();
    result = [...fallback];
  }

  if (!filters || result.length === 0) return result;

  if (filters.brands && filters.brands.length > 0) {
    result = result.filter(
      (p) =>
        filters.brands!.includes(p.brand.toLowerCase()) ||
        filters.brands!.includes(p.brandSlug)
    );
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter((p) => p.lowestPrice >= min && p.lowestPrice <= max);
  }

  if (filters.ram && filters.ram.length > 0) {
    result = result.filter(
      (p) => p.specs?.performance?.ram && filters.ram!.includes(p.specs.performance.ram)
    );
  }

  if (filters.storage && filters.storage.length > 0) {
    result = result.filter(
      (p) =>
        p.specs?.performance?.storage &&
        filters.storage!.includes(p.specs.performance.storage)
    );
  }

  if (filters.os && filters.os.length > 0) {
    result = result.filter((p) => {
      const osName = p.specs?.software?.os?.toLowerCase() || "";
      return filters.os!.some((o) => osName.includes(o.toLowerCase()));
    });
  }

  return result;
}

export async function getPhone(slug: string): Promise<Phone | null> {
  const canonicalSlug = resolvePhoneSlug(slug);
  const apiPhone =
    (await backendApi.getProductBySlug(canonicalSlug)) ||
    (canonicalSlug !== slug ? await backendApi.getProductBySlug(slug) : null);

  if (apiPhone) return apiPhone;

  // Fallback to local catalog
  const fallback = await getFallbackPhones();
  return (
    fallback.find((p) => p.slug === slug || p.slug === canonicalSlug) || null
  );
}

export async function getBrands(): Promise<Brand[]> {
  const apiBrands = await backendApi.getBrands();
  if (apiBrands && apiBrands.length > 0) return apiBrands;
  return fallbackBrands;
}

export async function getBrand(slug: string): Promise<Brand | null> {
  const apiBrand = await backendApi.getBrandBySlug(slug);
  if (apiBrand) return apiBrand;
  return fallbackBrands.find((b) => b.slug === slug) || null;
}

export async function getPhonesByBrand(brandSlug: string): Promise<Phone[]> {
  const apiResult = await backendApi.getBrandPhones(brandSlug);
  if (apiResult?.items && apiResult.items.length > 0) return apiResult.items;

  const fallback = await getFallbackPhones();
  return fallback.filter(
    (p) =>
      p.brandSlug.toLowerCase() === brandSlug.toLowerCase() ||
      p.brand.toLowerCase() === brandSlug.toLowerCase()
  );
}

export async function getStores(): Promise<StoreInfo[]> {
  const apiStores = await backendApi.getStores();
  if (apiStores && apiStores.length > 0) return apiStores;
  return fallbackStores;
}

export async function getGuides(category?: string): Promise<Guide[]> {
  const apiGuides = await backendApi.getArticles();
  const source = apiGuides && apiGuides.length > 0 ? apiGuides : fallbackGuides;

  if (category) {
    return source.filter((g) =>
      g.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  return source;
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const apiGuide = await backendApi.getArticleBySlug(slug);
  if (apiGuide) return apiGuide;
  return fallbackGuides.find((g) => g.slug === slug) || null;
}

export async function getQAItems(category?: string): Promise<QAItem[]> {
  const apiQA = await backendApi.getQAItems();
  const source = apiQA && apiQA.length > 0 ? apiQA : fallbackQAItems;

  if (category) {
    return source.filter(
      (q) =>
        q.category.toLowerCase().includes(category.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase() === category.toLowerCase())
    );
  }
  return source;
}

export async function getQAItem(slug: string): Promise<QAItem | null> {
  const items = await getQAItems();
  return items.find((q) => q.slug === slug) || null;
}

export async function searchPhones(query: string): Promise<Phone[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const apiResults = await backendApi.searchPhones(q);
  if (apiResults && apiResults.length > 0) return apiResults;

  const fallback = await getFallbackPhones();
  return fallback.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

export async function getRelatedPhones(phoneId: string, limit = 4): Promise<Phone[]> {
  const apiRelated = await backendApi.getProductAlternatives(phoneId);
  if (apiRelated && apiRelated.length > 0) return apiRelated.slice(0, limit);

  const fallback = await getFallbackPhones();
  const current = fallback.find((p) => p.id === phoneId || p.slug === phoneId);
  if (!current) return fallback.slice(0, limit);

  return fallback
    .filter((p) => p.id !== current.id && p.brandSlug === current.brandSlug)
    .slice(0, limit);
}

export async function getPriceHistory(phoneId: string): Promise<PriceHistory[]> {
  const apiHistory = await backendApi.getProductPriceHistory(phoneId);
  return apiHistory || [];
}

export async function getCheapestPhones(limit = 6): Promise<Phone[]> {
  const apiCheapest = await backendApi.getCheapest(limit);
  if (apiCheapest && apiCheapest.length > 0) return apiCheapest;

  const fallback = await getFallbackPhones();
  return [...fallback]
    .sort((a, b) => a.lowestPrice - b.lowestPrice)
    .slice(0, limit);
}

export async function getPriceDroppedPhones(limit = 6): Promise<Phone[]> {
  const apiDeals = await backendApi.getDeals(limit);
  if (apiDeals && apiDeals.length > 0) return apiDeals;

  const fallback = await getFallbackPhones();
  return fallback.filter((p) => p.isPriceDropped).slice(0, limit);
}

export async function getNewPhones(limit = 6): Promise<Phone[]> {
  const apiNew = await backendApi.getNewReleases(limit);
  if (apiNew && apiNew.length > 0) return apiNew;

  const fallback = await getFallbackPhones();
  return fallback.filter((p) => p.isNew).slice(0, limit);
}
