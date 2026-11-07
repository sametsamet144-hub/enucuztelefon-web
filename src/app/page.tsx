import { getPhones, getBrands } from "@/lib/data";
import PhoneCatalogClient from "@/components/phone/PhoneCatalogClient";
import StitchMobileHome from "@/components/home/StitchMobileHome";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "EnUcuzTelefon.com - Türkiye'nin Akıllı Telefon ve Canlı Fiyat Merkezi",
  description:
    "97+ akıllı telefon modelini 16 resmi mağazada karşılaştırın, fiyatı düşenleri yakalayın ve teknik özellikleriyle inceleyin.",
};

export default async function HomePage() {
  const [phones, brands] = await Promise.all([getPhones(), getBrands()]);

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100">
      {/* Mobile Experience: Stitch Mobile Homepage (<lg) */}
      <div className="block lg:hidden">
        <StitchMobileHome />
      </div>

      {/* Desktop Experience: Stitch Desktop Catalog (>=lg) */}
      <div className="hidden lg:block">
        <PhoneCatalogClient initialPhones={phones} brands={brands} />
      </div>
    </div>
  );
}
