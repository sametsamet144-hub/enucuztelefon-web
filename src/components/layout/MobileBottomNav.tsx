"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Scale,
  TrendingDown,
  Bell,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openAlertModal } = useApp();

  const tabs = [
    { label: "Ana Sayfa", href: "/", icon: Home, isAction: false },
    { label: "Katalog", href: "/telefonlar", icon: LayoutGrid, isAction: false },
    { label: "Karşılaştır", href: "/karsilastir", icon: Scale, isAction: false },
    { label: "Düşenler", href: "/telefonlar/fiyati-dusen", icon: TrendingDown, isAction: false },
    { label: "Alarmlarım", href: "/fiyat-takibi", icon: Bell, isAction: true },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#090b0e]/95 backdrop-blur-md border-t border-[#181d27] py-1.5 px-3">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => openAlertModal()}
                className={`flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-medium transition-colors ${
                  isActive ? "text-[#38bdf8] font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#38bdf8]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-[#38bdf8] font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#38bdf8]" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
