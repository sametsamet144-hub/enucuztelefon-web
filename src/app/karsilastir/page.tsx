import { Suspense } from "react";
import ComparisonCockpit from "@/components/compare/ComparisonCockpit";

export const metadata = {
  title: "4'lü Tepe Amiral Gemisi Donanım & Fiyat Düellosu | EnUcuzTelefon",
  description:
    "Apple iPhone 16 Pro Max, Samsung Galaxy S25 Ultra, Xiaomi 15 Pro ve Google Pixel 9 Pro XL donanım matrisi, AnTuTu performansı, DXOMARK kamera skorları ve anlık piyasa arbitrajı.",
};

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#2997ff] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-white/50 tracking-wider">
              Amiral Gemisi Karşılaştırma Matrisi Yükleniyor...
            </p>
          </div>
        </div>
      }
    >
      <ComparisonCockpit />
    </Suspense>
  );
}
