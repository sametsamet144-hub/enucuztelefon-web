'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  ChevronDown,
  Smartphone,
  TrendingDown,
  ArrowRight,
  Tablet,
  Home,
  BarChart2,
  Bell,
  BookOpen,
} from 'lucide-react';
import clsx from 'clsx';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionSection {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  items?: { label: string; href: string; icon?: React.ReactNode }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const MOBILE_NAV_SECTIONS: AccordionSection[] = [
  {
    id: 'anasayfa',
    label: 'Ana Sayfa',
    href: '/',
    icon: <Home size={18} />,
  },
  {
    id: 'telefonlar',
    label: 'Telefonlar',
    icon: <Smartphone size={18} />,
    items: [
      { label: 'Tüm Telefonlar', href: '/telefonlar', icon: <Smartphone size={15} /> },
      { label: 'En Ucuz Telefonlar', href: '/telefonlar/en-ucuz', icon: <TrendingDown size={15} /> },
      { label: 'Fiyatı Düşenler', href: '/telefonlar/fiyati-dusen', icon: <TrendingDown size={15} /> },
      { label: 'Yeni Çıkanlar', href: '/telefonlar?filtre=yeni', icon: <ArrowRight size={15} /> },
      { label: 'Apple', href: '/marka/apple' },
      { label: 'Samsung', href: '/marka/samsung' },
      { label: 'Xiaomi', href: '/marka/xiaomi' },
      { label: 'Huawei', href: '/marka/huawei' },
    ],
  },
  {
    id: 'markalar',
    label: 'Markalar',
    href: '/markalar',
    icon: <BarChart2 size={18} />,
  },
  {
    id: 'karsilastir',
    label: 'Karşılaştır',
    href: '/karsilastir',
    icon: <BarChart2 size={18} />,
  },
  {
    id: 'rehber',
    label: 'Telefon Rehberi',
    icon: <BookOpen size={18} />,
    items: [
      { label: 'Rehber Ana Sayfa', href: '/telefon-rehberi' },
      { label: 'Telefon Karşılaştırma', href: '/karsilastir' },
      { label: 'Detaylı İncelemeler', href: '/incelemeler' },
      { label: 'Satın Alma Rehberleri', href: '/rehber' },
      { label: 'Sorunlar ve Çözümler', href: '/sorunlar' },
      { label: 'Teknoloji Rehberi', href: '/teknoloji' },
      { label: 'Bilgi ve Resmi Destek', href: '/bilgi' },
      { label: 'Soru-Cevap Sistemi', href: '/soru-cevap' },
    ],
  },
  {
    id: 'fiyat-takibi',
    label: 'Fiyat Takibi',
    href: '/fiyat-takibi',
    icon: <Bell size={18} />,
  },
  {
    id: 'diger',
    label: 'Diğer',
    icon: <Tablet size={18} />,
    items: [
      { label: 'Tabletler', href: '/tabletler', icon: <Tablet size={15} /> },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden',
          'flex flex-col shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Mobil Navigasyon"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-sky-500 to-sky-600">
          <div className="flex items-center gap-2">
            <Smartphone size={22} className="text-white" />
            <span className="font-bold text-white text-lg">
              EnUcuzTelefon
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Menüyü kapat"
          >
            <X size={22} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 p-4 border-b border-slate-100 bg-slate-50">
          <Link
            href="/telefonlar/fiyati-dusen"
            prefetch={false}
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-sky-300 hover:text-sky-600 transition-colors"
          >
            <TrendingDown size={16} className="text-sky-500" />
            Fiyatı Düşenler
          </Link>
          <Link
            href="/karsilastir"
            prefetch={false}
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-sky-300 hover:text-sky-600 transition-colors"
          >
            <BarChart2 size={16} className="text-orange-500" />
            Karşılaştır
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {MOBILE_NAV_SECTIONS.map((section) => {
            const hasItems = section.items && section.items.length > 0;
            const isExpanded = openSections.has(section.id);
            const active = isActive(section.href);

            return (
              <div key={section.id}>
                {/* Section Header */}
                {section.href && !hasItems ? (
                  <Link
                    href={section.href}
                    prefetch={false}
                    onClick={onClose}
                    className={clsx(
                      'flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors',
                      active
                        ? 'text-sky-600 bg-sky-50 border-r-2 border-sky-500'
                        : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                    )}
                  >
                    <span className={clsx('shrink-0', active ? 'text-sky-500' : 'text-slate-400')}>
                      {section.icon}
                    </span>
                    {section.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => hasItems && toggleSection(section.id)}
                    className={clsx(
                      'flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium transition-colors',
                      isExpanded
                        ? 'text-sky-600 bg-sky-50'
                        : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                    )}
                  >
                    <span className={clsx('shrink-0', isExpanded ? 'text-sky-500' : 'text-slate-400')}>
                      {section.icon}
                    </span>
                    <span className="flex-1 text-left">{section.label}</span>
                    {hasItems && (
                      <ChevronDown
                        size={16}
                        className={clsx(
                          'text-slate-400 transition-transform duration-200 shrink-0',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </button>
                )}

                {/* Accordion Content */}
                {hasItems && (
                  <div
                    className={clsx(
                      'overflow-hidden transition-all duration-200 ease-in-out',
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    <ul className="bg-slate-50 border-y border-slate-100">
                      {section.items!.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            prefetch={false}
                            onClick={onClose}
                            className={clsx(
                              'flex items-center gap-2.5 pl-14 pr-5 py-2.5 text-sm transition-colors',
                              isActive(item.href)
                                ? 'text-sky-600 font-medium'
                                : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/50'
                            )}
                          >
                            {item.icon && (
                              <span className="text-slate-400">{item.icon}</span>
                            )}
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <Link
            href="/fiyat-takibi"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-xl text-sm hover:from-sky-600 hover:to-sky-700 transition-all shadow-sm"
          >
            <Bell size={16} />
            Fiyat Alarmı Kur
          </Link>
        </div>
      </aside>
    </>
  );
}
