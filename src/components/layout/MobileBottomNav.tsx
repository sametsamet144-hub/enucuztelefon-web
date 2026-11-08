"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openAlertModal } = useApp();

  const tabs = [
    {
      label: "Modeller",
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
      icon: "notifications_active",
      isAction: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#131315]/85 backdrop-blur-xl border-t border-white/[0.08] shadow-[0_-2px_16px_rgba(0,0,0,0.45)] lg:hidden">
      <div className="h-16 px-3 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/telefonlar"
              ? pathname === "/telefonlar" || pathname.startsWith("/telefon/") || pathname === "/"
              : tab.href === "/telefonlar/fiyati-dusen"
              ? pathname === "/telefonlar/fiyati-dusen"
              : pathname.startsWith(tab.href);

          if (tab.isAction) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => openAlertModal()}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 active:scale-90 transition-transform duration-200 cursor-pointer ${
                  isActive
                    ? "text-[#2997ff] font-semibold"
                    : "text-[#c0c7d5] hover:text-[#e5e1e4]"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? "drop-shadow-[0_0_8px_rgba(41,151,255,0.5)]" : ""
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="text-[11px] tracking-tight">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 active:scale-90 transition-transform duration-200 ${
                isActive
                  ? "text-[#2997ff] font-semibold"
                  : "text-[#c0c7d5] hover:text-[#e5e1e4]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? "drop-shadow-[0_0_8px_rgba(41,151,255,0.5)]" : ""
                }`}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

