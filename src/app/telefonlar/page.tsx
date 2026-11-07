import type { Metadata } from "next";
import { getPhones, getBrands } from "@/lib/data";
import PhoneCatalogClient from "@/components/phone/PhoneCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tüm Telefonlar ve En Ucuz Fiyatlar - EnUcuzTelefon.com",
  description:
    "Türkiye'deki tüm akıllı telefon modellerini 16 farklı güvenilir mağazanın canlı fiyatları, teknik özellikleri, kamera puanı ve donanım filtreleriyle karşılaştırın.",
  openGraph: {
    title: "Tüm Telefonlar ve Canlı Fiyat Karşılaştırması | EnUcuzTelefon.com",
    description: "50+ mağazada en ucuz telefon fiyatlarını karşılaştırın, anlık indirimleri keşfedin.",
  },
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    brand?: string;
  }>;
}

export default async function PhonesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [phones, brands] = await Promise.all([
    getPhones(),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen pb-20 transition-colors duration-200">
      <PhoneCatalogClient
        initialPhones={phones}
        brands={brands}
        initialBrand={params.brand}
        initialQuery={params.q}
      />
    </div>
  );
}
