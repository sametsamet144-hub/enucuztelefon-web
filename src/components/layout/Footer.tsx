import Link from "next/link";

export default function Footer() {
  const stores = [
    "Apple Store",
    "Hepsiburada",
    "Trendyol",
    "Amazon TR",
    "MediaMarkt",
    "Teknosa",
  ];

  return (
    <footer className="bg-[#06080b] border-t border-[#141923] text-slate-400 py-10">
      <div className="max-w-[1280px] mx-auto px-6 space-y-8">
        {/* Top Row: Authorized Network & Store Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-[#131822]">
          <div>
            <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-300">
              YETKİLİ SATIŞ VE ENTEGRASYON AĞI
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sertifikalı pazar yerleri ve yetkili Apple distribütörleri ile
              anlık fiyat senkronizasyonu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {stores.map((store) => (
              <span
                key={store}
                className="px-3 py-1.5 rounded-lg bg-[#0d1118] border border-[#1b2230] text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
              >
                {store}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Row: Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-5 font-medium text-slate-400">
            <Link
              href="/telefonlar"
              className="hover:text-white transition-colors"
            >
              Tüm Modeller
            </Link>
            <Link
              href="/karsilastir"
              className="hover:text-white transition-colors"
            >
              Karşılaştırın
            </Link>
            <Link
              href="/fiyat-takibi"
              className="hover:text-white transition-colors"
            >
              Alarm Bildirimleri
            </Link>
            <Link
              href="/gizlilik-politikasi"
              className="hover:text-white transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/kullanim-kosullari"
              className="hover:text-white transition-colors"
            >
              Kullanım Koşulları
            </Link>
          </div>

          <p className="text-[11px] text-slate-500 text-center md:text-right">
            © 2025 EnUcuzTelefon.com. Tüm hakları saklıdır. Fiyatlar ve stoklar
            mağazalara göre anlık değişebilir.
          </p>
        </div>
      </div>
    </footer>
  );
}
