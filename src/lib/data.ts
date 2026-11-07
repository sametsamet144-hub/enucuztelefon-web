import { backendApi } from "@/lib/api";
import { resolvePhoneSlug } from "@/lib/utils";
import type { Phone, Brand, Guide, QAItem, FilterOptions, PriceHistory, StoreInfo } from "@/types";

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
  let result = apiResponse?.items ? [...apiResponse.items] : [];

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

  return apiPhone || null;
}

export async function getBrands(): Promise<Brand[]> {
  const apiBrands = await backendApi.getBrands();
  return apiBrands || [];
}

export async function getBrand(slug: string): Promise<Brand | null> {
  const apiBrand = await backendApi.getBrandBySlug(slug);
  return apiBrand || null;
}

export async function getPhonesByBrand(brandSlug: string): Promise<Phone[]> {
  const apiResult = await backendApi.getBrandPhones(brandSlug);
  return apiResult?.items || [];
}

export async function getStores(): Promise<StoreInfo[]> {
  const apiStores = await backendApi.getStores();
  return apiStores || [];
}

export async function getGuides(category?: string): Promise<Guide[]> {
  const apiGuides = await backendApi.getArticles();
  const source = apiGuides || [];

  if (category) {
    return source.filter((g) =>
      g.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  return source;
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const apiGuide = await backendApi.getArticleBySlug(slug);
  return apiGuide || null;
}

export async function getQAItems(category?: string): Promise<QAItem[]> {
  const apiQA = await backendApi.getQAItems();
  const source = apiQA || [];

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
  const item = items.find((q) => q.slug === slug);
  return item || null;
}

export async function searchPhones(query: string): Promise<Phone[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const apiResults = await backendApi.searchPhones(q);
  return apiResults || [];
}

export async function getRelatedPhones(phoneId: string, limit = 4): Promise<Phone[]> {
  const apiRelated = await backendApi.getProductAlternatives(phoneId);
  if (apiRelated && apiRelated.length > 0) return apiRelated.slice(0, limit);
  return [];
}

export async function getPriceHistory(phoneId: string): Promise<PriceHistory[]> {
  const apiHistory = await backendApi.getProductPriceHistory(phoneId);
  return apiHistory || [];
}

export async function getCheapestPhones(limit = 6): Promise<Phone[]> {
  const apiCheapest = await backendApi.getCheapest(limit);
  return apiCheapest || [];
}

export async function getPriceDroppedPhones(limit = 6): Promise<Phone[]> {
  const apiDeals = await backendApi.getDeals(limit);
  return apiDeals || [];
}

export async function getNewPhones(limit = 6): Promise<Phone[]> {
  const apiNew = await backendApi.getNewReleases(limit);
  return apiNew || [];
}
