import Link from 'next/link';
import {
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
  Mail,
  MapPin,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TELEFON_KATEGORILERI: FooterLinkGroup = {
  title: 'Telefon Kategorileri',
  links: [
    { label: 'Tüm Telefonlar', href: '/telefonlar' },
    { label: 'En Ucuz Telefonlar', href: '/telefonlar/en-ucuz' },
    { label: 'Fiyatı Düşenler', href: '/telefonlar/fiyati-dusen' },
    { label: 'Telefon Karşılaştırma', href: '/karsilastir' },
    { label: 'Apple iPhone', href: '/marka/apple' },
    { label: 'Samsung Galaxy', href: '/marka/samsung' },
    { label: 'Xiaomi', href: '/marka/xiaomi' },
    { label: 'Huawei', href: '/marka/huawei' },
    { label: 'Realme', href: '/marka/realme' },
    { label: 'Tabletler (İkincil)', href: '/tabletler' },
  ],
};

const TELEFON_REHBERI: FooterLinkGroup = {
  title: 'Telefon Bilgi Merkezi',
  links: [
    { label: 'Telefon Rehberi Ana Sayfa', href: '/telefon-rehberi' },
    { label: 'Detaylı İncelemeler', href: '/incelemeler' },
    { label: 'Satın Alma Rehberleri', href: '/rehber' },
    { label: 'Sorunlar ve Çözümler', href: '/sorunlar' },
    { label: 'Teknoloji Rehberi & Sözlük', href: '/teknoloji' },
    { label: 'Bilgi ve Resmi Destek', href: '/bilgi' },
    { label: 'Soru-Cevap Sistemi', href: '/soru-cevap' },
  ],
};

const YARDIM_DESTEK: FooterLinkGroup = {
  title: 'Yardım ve Resmi Destek',
  links: [
    { label: 'Soru-Cevap & SSS', href: '/soru-cevap' },
    { label: 'IMEI Sorgulama (BTK)', href: '/bilgi/imei-sorgulama' },
    { label: 'Garanti Sorgulama', href: '/bilgi/garanti' },
    { label: 'İkinci El Kontrol Rehberi', href: '/bilgi/ikinci-el-kontrol' },
    { label: 'SIM & eSIM Rehberi', href: '/bilgi/sim-ve-esim' },
    { label: 'Fiyat Alarmı Kur', href: '/fiyat-takibi' },
    { label: 'Anlaşmalı Mağazalar', href: '/magazalar' },
    { label: 'Admin Paneli', href: '/admin' },
  ],
};

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Twitter / X', href: 'https://twitter.com', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function LinkColumn({ group }: { group: FooterLinkGroup }) {
  return (
    <div>
      <h3 className="text-white font-semibold text-sm mb-4">{group.title}</h3>
      <ul className="space-y-2">
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              prefetch={false}
              className="text-slate-400 hover:text-sky-400 text-sm transition-colors inline-flex items-center gap-1 group"
            >
              <ArrowRight
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter Strip */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white text-lg">
              Fiyat düşüşlerinden haberdar olun!
            </p>
            <p className="text-sky-200 text-sm mt-0.5">
              Takip ettiğiniz telefonların fiyatı düşünce sizi bilgilendirelim.
            </p>
          </div>
          <Link
            href="/fiyat-takibi"
            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-sky-600 hover:bg-sky-50 font-semibold rounded-xl transition-colors shadow-lg"
          >
            <Mail size={16} />
            Fiyat Alarmı Kur
          </Link>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Brand */}
          <div>
            {/* Logo (Zarif & Tatlı Telefon Emote) */}
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-violet-600 p-0.5 shadow-md group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-[14px] bg-slate-900/40 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="4" width="28" height="40" rx="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.8" />
                    <rect x="12.5" y="6.5" width="23" height="35" rx="5" fill="#f0f9ff" />
                    <rect x="20" y="8.5" width="8" height="2.4" rx="1.2" fill="#0f172a" />
                    <circle cx="18.8" cy="21.5" r="2.4" fill="#0f172a" />
                    <circle cx="18.1" cy="20.7" r="0.9" fill="#ffffff" />
                    <path d="M26.8 21.8C27.5 19.8 30.2 19.8 30.9 21.8" stroke="#0f172a" strokeWidth="2.1" strokeLinecap="round" />
                    <ellipse cx="16.2" cy="24.5" rx="2" ry="1.1" fill="#fb7185" fillOpacity="0.8" />
                    <ellipse cx="31.8" cy="24.5" rx="2" ry="1.1" fill="#fb7185" fillOpacity="0.8" />
                    <path d="M21.2 24.5C22.2 26.8 25.8 26.8 26.8 24.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                    <path d="M24 35.2C24 35.2 21.2 33.6 21.2 32.1C21.2 31.3 21.9 30.8 22.6 30.8C23.2 30.8 23.7 31.1 24 31.6C24.3 31.1 24.8 30.8 25.4 30.8C26.1 30.8 26.8 31.3 26.8 32.1C26.8 33.6 24 35.2 24 35.2Z" fill="#f43f5e" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold text-white">
                  EnUcuzTelefon
                  <span className="text-sky-400">.com</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                  Türkiye Telefon &amp; Fiyat Merkezi
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Türkiye&apos;nin en kapsamlı telefon fiyat karşılaştırma sitesi. En ucuz telefon fiyatlarını, güncel kampanyaları ve detaylı incelemeleri takip edin.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 text-slate-400 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-5 flex items-start gap-2 text-sm text-slate-500">
              <MapPin size={14} className="shrink-0 mt-0.5 text-slate-600" />
              <span>İstanbul, Türkiye</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Mail size={14} className="shrink-0 text-slate-600" />
              <a href="mailto:info@enucuztelefon.com" className="hover:text-sky-400 transition-colors">
                info@enucuztelefon.com
              </a>
            </div>
          </div>

          {/* Column 2: Telefon Kategorileri */}
          <LinkColumn group={TELEFON_KATEGORILERI} />

          {/* Column 3: Telefon Rehberi */}
          <LinkColumn group={TELEFON_REHBERI} />

          {/* Column 4: Yardım ve Destek */}
          <LinkColumn group={YARDIM_DESTEK} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            &copy; {currentYear}{' '}
            <span className="text-slate-400 font-medium">EnUcuzTelefon.com</span>{' '}
            — Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/gizlilik-politikasi" prefetch={false} className="hover:text-slate-300 transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link href="/kullanim-kosullari" prefetch={false} className="hover:text-slate-300 transition-colors">
              Kullanım Koşulları
            </Link>
            <span className="text-slate-700 select-none">|</span>
            <Link href="/cerez-politikasi" prefetch={false} className="hover:text-slate-300 transition-colors">
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
