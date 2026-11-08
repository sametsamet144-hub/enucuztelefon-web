"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openAlertModal } = useApp();

  const tabs = [
    {
      label: "Ana Sayfa",
      href: "/",
      icon: "home",
      isAction: false,
    },
    {
      label: "Katalog",
      href: "/telefonlar",
      icon: "grid_view",
      isAction: false,
    },
    {
      label: "Karşılaştır",
      href: "/karsilastir",
      icon: "compare_arrows",
      isAction: false,
    },
    {
      label: "Düşenler",
      href: "/telefonlar/fiyati-dusen",
      icon: "trending_down",
      isAction: false,
    },
    {
      label: "Alarmlarım",
      href: "/fiyat-takibi",
      icon: "notification_important",
      isAction: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-4px_24px_rgba(0,0,0,0.5)] lg:hidden">
      <div className="h-16 px-gutter-mobile flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : tab.href === "/telefonlar"
              ? pathname === "/telefonlar" || pathname.startsWith("/telefon/")
              : tab.href === "/telefonlar/fiyati-dusen"
              ? pathname === "/telefonlar/fiyati-dusen"
              : pathname.startsWith(tab.href);

          if (tab.isAction) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => openAlertModal()}
                className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-0.5 active:scale-80 transition-transform duration-200 cursor-pointer ${
                  isActive
                    ? "text-primary-container font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? "drop-shadow-[0_0_8px_rgba(41,151,255,0.5)]" : ""
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="font-label-sm text-[11px]">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-0.5 active:scale-80 transition-transform duration-200 ${
                isActive
                  ? "text-primary-container font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? "drop-shadow-[0_0_8px_rgba(41,151,255,0.5)]" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-[11px]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

