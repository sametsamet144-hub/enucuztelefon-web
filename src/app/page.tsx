import HeroSection from "@/components/home/HeroSection";

export const metadata = {
  title: "EnUcuzTelefon.com - Türkiye'nin Akıllı Telefon ve Canlı Fiyat Merkezi",
  description:
    "97+ akıllı telefon modelini 16 resmi mağazada karşılaştırın, fiyatı düşenleri yakalayın ve teknik rehberlere tek ekrandan ulaşın.",
};

export default function HomePage() {
  return (
    <div className="h-full w-full overflow-hidden bg-slate-950">
      <HeroSection />
    </div>
  );
}
