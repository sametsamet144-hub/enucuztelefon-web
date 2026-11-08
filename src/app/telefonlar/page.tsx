import type { Metadata } from "next";
import { getPhones, getBrands } from "@/lib/data";
import PhoneCatalogClient from "@/components/phone/PhoneCatalogClient";
import type { ProductFilterParams } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tüm Telefonlar ve En Ucuz Fiyatlar - EnUcuzTelefon.com",
  description:
    "Türkiye'deki tüm akıllı telefon modellerini 29 farklı güvenilir mağazanın canlı fiyatları, teknik özellikleri, kamera puanı ve donanım filtreleriyle karşılaştırın.",
  openGraph: {
    title: "Tüm Telefonlar ve Canlı Fiyat Karşılaştırması | EnUcuzTelefon.com",
    description: "29 mağazada en ucuz telefon fiyatlarını karşılaştırın, anlık indirimleri keşfedin.",
  },
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    ram?: string;
    storage?: string;
    isPriceDropped?: string;
    isNew?: string;
    sortBy?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function PhonesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: ProductFilterParams = {
    search: params.q,
    brand: params.brand,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    ram: params.ram ? Number(params.ram) : undefined,
    storage: params.storage ? Number(params.storage) : undefined,
    isPriceDropped: params.isPriceDropped === "true" ? true : undefined,
    isNew: params.isNew === "true" ? true : undefined,
    sortBy: params.sortBy as any,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 200,
  };

  const [phones, brands] = await Promise.all([
    getPhones(filters),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <PhoneCatalogClient
        initialPhones={phones}
        brands={brands}
        initialBrand={params.brand}
        initialQuery={params.q}
      />
    </div>
  );
}
