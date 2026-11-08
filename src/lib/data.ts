import { backendApi } from "@/lib/api";
import { resolvePhoneSlug } from "@/lib/utils";
import type {
  Phone,
  Brand,
  Guide,
  QAItem,
  FilterOptions,
  PriceHistory,
  StoreInfo,
  StorePrice,
  ProductFilterParams,
} from "@/types";

const DUMMY_CONCEPT_SLUGS = new Set([
  "iphone-17-pro-max",
  "iphone-17-pro",
  "iphone-17-plus",
  "iphone-17",
  "iphone-17-air",
  "iphone-air",
  "samsung-galaxy-s26-ultra",
  "samsung-galaxy-s26",
  "samsung-galaxy-s25-phone-015",
  "redmi-note-13-pro-5g-phone-038",
  "iphone-se-4-nesil",
]);

const SHOWCASE_TOP_SLUGS = [
  "iphone-16-pro-max",
  "samsung-galaxy-s25-ultra",
  "xiaomi-15",
  "honor-magic-v3",
  "poco-f6-pro",
  "iphone-15",
  "samsung-galaxy-s24-fe",
  "vivo-x200-pro",
];

/**
 * Fetch phones catalog exclusively from backend REST API with optional query filters.
 * No fake or mock data fallback.
 */
export async function getPhones(
  filters?: Partial<FilterOptions> & ProductFilterParams
): Promise<Phone[]> {
  const params: ProductFilterParams = {};

  if (filters?.brand) {
    params.brand = filters.brand;
  } else if (filters?.brands && filters.brands.length === 1) {
    params.brand = filters.brands[0];
  }

  if (filters?.search) {
    params.search = filters.search;
  }

  if (filters?.minPrice !== undefined) {
    params.minPrice = filters.minPrice;
  } else if (filters?.priceRange) {
    params.minPrice = filters.priceRange[0];
    params.maxPrice = filters.priceRange[1];
  }

  if (filters?.maxPrice !== undefined) {
    params.maxPrice = filters.maxPrice;
  }

  if (filters?.ram !== undefined) {
    params.ram = typeof filters.ram === "number" ? filters.ram : filters.ram[0];
  }

  if (filters?.storage !== undefined) {
    params.storage = typeof filters.storage === "number" ? filters.storage : filters.storage[0];
  }

  if (filters?.isPriceDropped !== undefined) params.isPriceDropped = filters.isPriceDropped;
  if (filters?.isNew !== undefined) params.isNew = filters.isNew;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.page) params.page = filters.page;
  if (filters?.pageSize) params.pageSize = filters.pageSize;
  else params.pageSize = 200;

  const apiResponse = await backendApi.getProducts(params);
  let result = apiResponse?.items && Array.isArray(apiResponse.items) ? [...apiResponse.items] : [];

  // Sort Stitch showcase flagship items to the top and concept items to the bottom for default popular view
  if (
    (!filters?.sortBy || filters.sortBy === "popular") &&
    !filters?.brand &&
    !filters?.brands?.length &&
    !filters?.search
  ) {
    const topItems: Phone[] = [];
    const middleItems: Phone[] = [];
    const bottomItems: Phone[] = [];

    for (const slug of SHOWCASE_TOP_SLUGS) {
      const found = result.find((p) => p.slug === slug);
      if (found) topItems.push(found);
    }

    for (const p of result) {
      if (!SHOWCASE_TOP_SLUGS.includes(p.slug)) {
        if (DUMMY_CONCEPT_SLUGS.has(p.slug)) {
          bottomItems.push(p);
        } else {
          middleItems.push(p);
        }
      }
    }

    result = [...topItems, ...middleItems, ...bottomItems];
  }

  if (!filters || result.length === 0) return result;

  // Additional in-memory filter guards for multi-select frontend UI filters
  if (filters.brands && filters.brands.length > 1) {
    const brandLower = filters.brands.map((b) => b.toLowerCase());
    result = result.filter(
      (p) =>
        brandLower.includes(p.brand.toLowerCase()) ||
        brandLower.includes(p.brandSlug.toLowerCase())
    );
  }

  if (filters.ram !== undefined && Array.isArray(filters.ram) && filters.ram.length > 1) {
    result = result.filter(
      (p) => p.specs?.performance?.ram && (filters.ram as number[]).includes(p.specs.performance.ram)
    );
  }

  if (filters.storage !== undefined && Array.isArray(filters.storage) && filters.storage.length > 1) {
    result = result.filter(
      (p) =>
        p.specs?.performance?.storage &&
        (filters.storage as number[]).includes(p.specs.performance.storage)
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

/**
 * Fetch a single phone's full details and specs by slug from backend REST API.
 */
export async function getPhone(slug: string): Promise<Phone | null> {
  const canonicalSlug = resolvePhoneSlug(slug);
  const apiPhone =
    (await backendApi.getProductBySlug(canonicalSlug)) ||
    (canonicalSlug !== slug ? await backendApi.getProductBySlug(slug) : null);

  return apiPhone || null;
}

/**
 * Fetch offers across stores exclusively from backend REST API.
 */
export async function getPhoneOffers(slug: string): Promise<StorePrice[]> {
  const canonicalSlug = resolvePhoneSlug(slug);
  const apiOffers = await backendApi.getProductOffers(canonicalSlug);
  if (apiOffers && apiOffers.length > 0) return apiOffers;

  const phone = await getPhone(slug);
  return phone?.storesPrices || [];
}

/**
 * Fetch all supported brands from backend REST API.
 */
export async function getBrands(): Promise<Brand[]> {
  const apiBrands = await backendApi.getBrands();
  return apiBrands || [];
}

/**
 * Fetch single brand details from backend REST API.
 */
export async function getBrand(slug: string): Promise<Brand | null> {
  const apiBrands = await backendApi.getBrands();
  const brand = apiBrands?.find(
    (b) => b.slug.toLowerCase() === slug.toLowerCase() || b.name.toLowerCase() === slug.toLowerCase()
  );
  return brand || null;
}

/**
 * Fetch phones belonging to a specific brand from backend REST API.
 */
export async function getPhonesByBrand(
  brandSlug: string,
  page = 1,
  pageSize = 20
): Promise<Phone[]> {
  const apiResult = await backendApi.getBrandProducts(brandSlug, page, pageSize);
  return apiResult?.items || [];
}

/**
 * Fetch all supported 29 stores from backend REST API.
 */
export async function getStores(): Promise<StoreInfo[]> {
  const apiStores = await backendApi.getStores();
  return apiStores || [];
}

/**
 * Fetch single store details by slug from backend REST API.
 */
export async function getStore(slug: string): Promise<StoreInfo | null> {
  const apiStore = await backendApi.getStoreBySlug(slug);
  if (apiStore) return apiStore;

  const stores = await getStores();
  return stores.find((s) => s.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Fetch editorial guide articles from backend.
 */
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

/**
 * Fetch QA items from backend.
 */
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
  return items.find((q) => q.slug === slug) || null;
}

/**
 * Live search phones exclusively against backend live search endpoint.
 */
export async function searchPhones(query: string, limit = 10): Promise<Phone[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const apiResults = await backendApi.searchPhones(q, limit);
  return apiResults || [];
}

/**
 * Fetch alternative/similar phones from backend.
 */
export async function getRelatedPhones(phoneId: string, limit = 4): Promise<Phone[]> {
  const apiRelated = await backendApi.getProductAlternatives(phoneId);
  return apiRelated ? apiRelated.slice(0, limit) : [];
}

/**
 * Fetch price history telemetries from backend.
 */
export async function getPriceHistory(phoneSlug: string): Promise<PriceHistory[]> {
  const apiHistory = await backendApi.getProductPriceHistory(phoneSlug);
  return apiHistory || [];
}

/**
 * Special Collections: Cheapest phones from backend.
 */
export async function getCheapestPhones(limit = 6): Promise<Phone[]> {
  const apiCheapest = await backendApi.getCheapest(limit);
  return apiCheapest || [];
}

/**
 * Special Collections: Deals / price-dropped phones from backend.
 */
export async function getPriceDroppedPhones(limit = 6): Promise<Phone[]> {
  const apiDeals = await backendApi.getDeals(limit);
  return apiDeals || [];
}

/**
 * Special Collections: New releases from backend.
 */
export async function getNewPhones(limit = 6): Promise<Phone[]> {
  const apiNew = await backendApi.getNewReleases(limit);
  return apiNew || [];
}

/**
 * Special Collections: Popular phones from backend.
 */
export async function getPopularPhones(limit = 6): Promise<Phone[]> {
  const apiPopular = await backendApi.getPopular(limit);
  return apiPopular || [];
}

/**
 * Comparison: Fetch 2 to 4 phones by slugs from backend.
 */
export async function comparePhones(slugs: string[]): Promise<Phone[]> {
  if (!slugs || slugs.length === 0) return [];
  const apiCompared = await backendApi.comparePhones(slugs);
  return apiCompared || [];
}
