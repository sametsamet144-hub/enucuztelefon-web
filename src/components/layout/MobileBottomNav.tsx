"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openAlertModal } = useApp();

  const tabs = [
    {
      id: "ana-sayfa",
      label: "Ana Sayfa",
      href: "/",
      isAction: false,
      iconSvg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      id: "katalog",
      label: "Katalog",
      href: "/telefonlar",
      isAction: false,
      iconSvg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z" />
        </svg>
      ),
    },
    {
      id: "karsilastir",
      label: "Karşılaştır",
      href: "/karsilastir",
      isAction: false,
      iconSvg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z" />
        </svg>
      ),
    },
    {
      id: "dusenler",
      label: "Düşenler",
      href: "/telefonlar/fiyati-dusen",
      isAction: false,
      iconSvg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
        </svg>
      ),
    },
    {
      id: "alarmlarim",
      label: "Alarmlarım",
      href: "/fiyat-takibi",
      isAction: true,
      iconSvg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#131315]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-4px_24px_rgba(0,0,0,0.5)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="h-16 px-1 flex items-center justify-between max-w-md mx-auto w-full">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : tab.href === "/telefonlar"
              ? pathname === "/telefonlar" || pathname.startsWith("/telefon/")
              : tab.href === "/telefonlar/fiyati-dusen"
              ? pathname === "/telefonlar/fiyati-dusen"
              : pathname.startsWith(tab.href);

          const activeStyle = isActive
            ? { color: "#2997ff" }
            : { color: "#8a919e" };

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => openAlertModal()}
                style={activeStyle}
                className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 text-center active:scale-90 transition-transform duration-200 cursor-pointer"
              >
                <div className={`flex items-center justify-center ${isActive ? "drop-shadow-[0_0_8px_rgba(41,151,255,0.6)]" : ""}`}>
                  {tab.iconSvg}
                </div>
                <span className="text-[10px] leading-tight font-medium truncate w-full text-center block mt-1 tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              style={activeStyle}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 text-center active:scale-90 transition-transform duration-200"
            >
              <div className={`flex items-center justify-center ${isActive ? "drop-shadow-[0_0_8px_rgba(41,151,255,0.6)]" : ""}`}>
                {tab.iconSvg}
              </div>
              <span className="text-[10px] leading-tight font-medium truncate w-full text-center block mt-1 tracking-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
