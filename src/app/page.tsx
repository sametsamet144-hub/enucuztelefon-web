import StitchMobileHome from "@/components/home/StitchMobileHome";
import StitchDesktopHome from "@/components/home/StitchDesktopHome";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "EnUcuzTelefon.com - Türkiye'nin Akıllı Telefon ve Fiyat Rehberi",
  description:
    "488+ güncel model, 16 resmi yetkili satıcı ve anlık fiyat değişim telemetrisi. Karşılaştır, alarm kur, doğrulanmış en düşük fiyattan sahip ol.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100">
      {/* Mobile Experience: Stitch Mobile Homepage (<lg) */}
      <div className="block lg:hidden">
        <StitchMobileHome />
      </div>

      {/* Desktop Experience: Stitch Desktop Homepage (>=lg) */}
      <div className="hidden lg:block">
        <StitchDesktopHome />
      </div>
    </div>
  );
}
