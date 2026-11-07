'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Smartphone, TrendingDown, ArrowRight, Tablet } from 'lucide-react';
import { useState, useRef } from 'react';
import clsx from 'clsx';
import { useApp } from '@/context/AppContext';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
  megaMenu?: MegaMenuConfig;
}

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  subItems?: { label: string; href: string }[];
}

interface MegaMenuConfig {
  columns: MegaMenuColumn[];
}

interface MegaMenuColumn {
  title: string;
  items: { label: string; href: string; description?: string }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TELEFONLAR_DROPDOWN: DropdownItem[] = [
  { label: 'Tüm Telefonlar', href: '/telefonlar', icon: <Smartphone size={15} /> },
  { label: 'En Ucuz Telefonlar', href: '/telefonlar/en-ucuz', icon: <TrendingDown size={15} /> },
  { label: 'Fiyatı Düşenler', href: '/telefonlar/fiyati-dusen', icon: <TrendingDown size={15} /> },
  { label: 'Yeni Çıkanlar', href: '/telefonlar?filtre=yeni', icon: <ArrowRight size={15} /> },
  { label: 'Kampanyalar', href: '/fiyat-takibi', icon: <ArrowRight size={15} /> },
  {
    label: 'Markaya Göre',
    href: '/markalar',
    subItems: [
      { label: 'Apple', href: '/marka/apple' },
      { label: 'Samsung', href: '/marka/samsung' },
      { label: 'Xiaomi', href: '/marka/xiaomi' },
      { label: 'Huawei', href: '/marka/huawei' },
      { label: 'OPPO', href: '/marka/oppo' },
      { label: 'OnePlus', href: '/marka/oneplus' },
    ],
  },
];

const REHBER_MEGA_MENU: MegaMenuConfig = {
  columns: [
    {
      title: 'Fiyatlar & İncelemeler',
      items: [
        { label: 'Telefon Karşılaştırma', href: '/karsilastir', description: '2 veya 4 telefonu yan yana kıyaslayın' },
        { label: 'Detaylı İncelemeler', href: '/incelemeler', description: 'Uzman testleri, artılar ve eksiler' },
        { label: 'Satın Alma Rehberleri', href: '/rehber', description: 'Bütçeye ve ihtiyaca en uygun telefonlar' },
      ],
    },
    {
      title: 'Sorun Çözümleri & Rehber',
      items: [
        { label: 'Sorunlar ve Çözümler', href: '/sorunlar', description: 'Isınma, yavaşlama ve şarj sorunları' },
        { label: 'Teknoloji Rehberi', href: '/teknoloji', description: 'AMOLED, OIS, 5G ve işlemci mimarileri' },
        { label: 'Bilgi ve Resmi Destek', href: '/bilgi', description: 'IMEI sorgulama, garanti ve e-Devlet' },
        { label: 'Soru-Cevap Sistemi', href: '/soru-cevap', description: 'En çok sorulan sorular ve hazır cevaplar' },
      ],
    },
  ],
};

const DIGER_DROPDOWN: DropdownItem[] = [
  { label: 'Anlaşmalı Mağazalar', href: '/magazalar', icon: <ArrowRight size={15} /> },
  { label: 'Tabletler', href: '/tabletler', icon: <Tablet size={15} /> },
];

const NAV_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Telefonlar', href: '/telefonlar', dropdown: TELEFONLAR_DROPDOWN },
  { label: 'Markalar', href: '/markalar' },
  { label: 'Karşılaştır', href: '/karsilastir' },
  { label: 'Telefon Rehberi', href: '/telefon-rehberi', megaMenu: REHBER_MEGA_MENU },
  { label: 'Fiyat Takibi', href: '/fiyat-takibi' },
  { label: 'Diğer', dropdown: DIGER_DROPDOWN },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function DropdownMenu({ items, isDark }: { items: DropdownItem[]; isDark: boolean }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className={clsx(
        'absolute top-full left-0 mt-1 min-w-56 rounded-xl shadow-xl border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150',
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      )}
    >
      {items.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link
            href={item.href}
            prefetch={false}
            className={clsx(
              'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors group',
              isDark
                ? 'text-slate-200 hover:text-sky-400 hover:bg-slate-800/80'
                : 'text-slate-700 hover:text-sky-600 hover:bg-sky-50'
            )}
          >
            {item.icon && (
              <span className="text-slate-400 group-hover:text-sky-500 transition-colors">
                {item.icon}
              </span>
            )}
            <span className="flex-1">{item.label}</span>
            {item.subItems && (
              <ChevronDown size={14} className="text-slate-400 -rotate-90" />
            )}
          </Link>
          {/* Sub-menu */}
          {item.subItems && hoveredItem === item.label && (
            <div
              className={clsx(
                'absolute left-full top-0 min-w-44 rounded-xl shadow-xl border py-2 z-50 ml-1',
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              )}
            >
              {item.subItems.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  prefetch={false}
                  className={clsx(
                    'block px-4 py-2 text-sm transition-colors',
                    isDark
                      ? 'text-slate-200 hover:text-sky-400 hover:bg-slate-800/80'
                      : 'text-slate-700 hover:text-sky-600 hover:bg-sky-50'
                  )}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MegaMenu({ config, isDark }: { config: MegaMenuConfig; isDark: boolean }) {
  return (
    <div
      className={clsx(
        'absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[520px] rounded-xl shadow-xl border p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150',
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      )}
    >
      <div className="grid grid-cols-2 gap-6">
        {config.columns.map((col) => (
          <div key={col.title}>
            <h3
              className={clsx(
                'text-xs font-semibold text-sky-500 uppercase tracking-wider mb-3 pb-2 border-b',
                isDark ? 'border-slate-800' : 'border-slate-100'
              )}
            >
              {col.title}
            </h3>
            <ul className="space-y-1">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={clsx(
                      'group block px-2 py-2 rounded-lg transition-colors',
                      isDark ? 'hover:bg-slate-800/80' : 'hover:bg-sky-50'
                    )}
                  >
                    <span
                      className={clsx(
                        'block text-sm font-medium transition-colors',
                        isDark
                          ? 'text-slate-200 group-hover:text-sky-400'
                          : 'text-slate-700 group-hover:text-sky-600'
                      )}
                    >
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="block text-xs text-slate-400 mt-0.5">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={clsx('mt-4 pt-4 border-t', isDark ? 'border-slate-800' : 'border-slate-100')}>
        <Link
          href="/telefon-rehberi"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors"
        >
          Tüm Rehberleri Görüntüle
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Navigation() {
  const pathname = usePathname();
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const isActive = (item: NavItem) => {
    if (!item.href) return false;
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const hasMenu = item.dropdown || item.megaMenu;
        const active = isActive(item);

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => hasMenu && handleMouseEnter(item.label)}
            onMouseLeave={() => hasMenu && handleMouseLeave()}
          >
            {item.href && !hasMenu ? (
              <Link
                href={item.href}
                prefetch={false}
                className={clsx(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? isDark
                      ? 'text-sky-400 bg-sky-500/15'
                      : 'text-sky-600 bg-sky-50'
                    : isDark
                      ? 'text-slate-200 hover:text-sky-400 hover:bg-slate-800'
                      : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                )}
              >
                {item.label}
              </Link>
            ) : (
              <button
                className={clsx(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  active || openMenu === item.label
                    ? isDark
                      ? 'text-sky-400 bg-sky-500/15'
                      : 'text-sky-600 bg-sky-50'
                    : isDark
                      ? 'text-slate-200 hover:text-sky-400 hover:bg-slate-800'
                      : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                )}
              >
                {item.label}
                {hasMenu && (
                  <ChevronDown
                    size={14}
                    className={clsx(
                      'transition-transform duration-200',
                      openMenu === item.label && 'rotate-180'
                    )}
                  />
                )}
              </button>
            )}

            {/* Dropdown */}
            {item.dropdown && openMenu === item.label && (
              <DropdownMenu items={item.dropdown} isDark={isDark} />
            )}

            {/* Mega Menu */}
            {item.megaMenu && openMenu === item.label && (
              <MegaMenu config={item.megaMenu} isDark={isDark} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
