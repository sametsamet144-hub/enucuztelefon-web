import Link from "next/link";
import { Smartphone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07090d] border-t border-[#151b27] text-slate-300 pt-12 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Column 1: Brand Info */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#1d8cf8] flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <Smartphone className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
                EnUcuzTelefon
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-1">
              16+ yetkili mağazayı anlık tarayan tarafsız telefon fiyat karşılaştırma ve kampanya takip platformu.
            </p>
          </div>

          {/* Column 2: Popüler Karşılaştırmalar */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              POPÜLER KARŞILAŞTIRMALAR
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/karsilastir"
                  className="hover:text-white transition-colors"
                >
                  iPhone 16 Pro Max vs Galaxy S25 Ultra
                </Link>
              </li>
              <li>
                <Link
                  href="/karsilastir"
                  className="hover:text-white transition-colors"
                >
                  Xiaomi 15 Ultra vs Huawei Pura 70 Ultra
                </Link>
              </li>
              <li>
                <Link
                  href="/karsilastir"
                  className="hover:text-white transition-colors"
                >
                  POCO F6 Pro vs Galaxy S24 FE
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hızlı Bağlantılar */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              HIZLI BAĞLANTILAR
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/fiyat-takibi"
                  className="hover:text-white transition-colors"
                >
                  Fiyat Alarmı Nasıl Kurulur?
                </Link>
              </li>
              <li>
                <Link
                  href="/telefonlar"
                  className="hover:text-white transition-colors"
                >
                  Peşin Fiyatına Taksitli Modeller
                </Link>
              </li>
              <li>
                <Link
                  href="/bilgi/garanti"
                  className="hover:text-white transition-colors"
                >
                  Doğrulanmış Mağaza Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Anlık Taranan Mağazalar */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              ANLIK TARANAN MAĞAZALAR
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-[#11141b] border border-[#1e2433] hover:text-white transition-colors">
                Amazon TR
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#11141b] border border-[#1e2433] hover:text-white transition-colors">
                Trendyol
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#11141b] border border-[#1e2433] hover:text-white transition-colors">
                Hepsiburada
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#11141b] border border-[#1e2433] hover:text-white transition-colors">
                Teknosa
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#11141b] border border-[#1e2433] hover:text-white transition-colors">
                Vatan
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-[#151b27] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2025 EnUcuzTelefon.com - Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/kullanim-kosullari"
              className="hover:text-slate-300 transition-colors"
            >
              Kullanım Şartları
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/gizlilik-politikasi"
              className="hover:text-slate-300 transition-colors"
            >
              Gizlilik
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/bilgi"
              className="hover:text-slate-300 transition-colors"
            >
              İletişim &amp; API
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
