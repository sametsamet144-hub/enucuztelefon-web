import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-gutter pt-margin pb-space-xl flex flex-col gap-space-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Yetkili Satıcı ve Entegrasyon Ağı
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Sertifikalı pazar yerleri ve yetkili Apple distribütörlerinin
              anlık fiyat telemetrisi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-md opacity-75">
            <div className="px-space-sm py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              Apple Store
            </div>
            <div className="px-space-sm py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              Hepsiburada
            </div>
            <div className="px-space-sm py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              Trendyol
            </div>
            <div className="px-space-sm py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              Amazon TR
            </div>
            <div className="px-space-sm py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              MediaMarkt
            </div>
            <div className="px-space-sm py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              Teknosa
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex flex-wrap items-center gap-space-md">
            <Link
              className="hover:text-on-surface transition-colors font-body-sm text-body-sm text-on-surface-variant"
              href="/telefonlar"
            >
              Tüm Modeller
            </Link>
            <Link
              className="hover:text-on-surface transition-colors font-body-sm text-body-sm text-on-surface-variant"
              href="/karsilastir"
            >
              Karşılaştırma
            </Link>
            <Link
              className="hover:text-on-surface transition-colors font-body-sm text-body-sm text-on-surface-variant"
              href="/fiyat-takibi"
            >
              Alarm Bildirimleri
            </Link>
            <Link
              className="hover:text-on-surface transition-colors font-body-sm text-body-sm text-on-surface-variant"
              href="/gizlilik-politikasi"
            >
              Gizlilik Politikası
            </Link>
            <Link
              className="hover:text-on-surface transition-colors font-body-sm text-body-sm text-on-surface-variant"
              href="/kullanim-kosullari"
            >
              Kullanım Koşulları
            </Link>
          </div>
          <p className="font-label-sm text-label-sm text-outline">
            © 2025 EnUcuzTelefon.com. Tüm hakları saklıdır. Cupertino esintili
            bağımsız fiyat takip platformu.
          </p>
        </div>
      </div>
    </footer>
  );
}
