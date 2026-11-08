"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import { AppProvider, useApp } from "@/context/AppContext";
import CompareFloatingBar from "@/components/common/CompareFloatingBar";
import PriceAlertModal from "@/components/common/PriceAlertModal";
import ToastContainer from "@/components/common/ToastContainer";

interface SiteLayoutProps {
  children: React.ReactNode;
}

function SiteLayoutInner({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const { theme } = useApp();
  const isDark = theme === "dark";
  const isHomePage = pathname === "/";

  return (
    <div
      className={`flex flex-col min-h-screen relative selection:bg-blue-500 selection:text-white transition-colors duration-200 pb-16 lg:pb-0 ${
        isDark ? "bg-[#080a0f] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <div className={isHomePage ? "hidden lg:block" : ""}>
        <Footer />
      </div>

      {/* Global Interactive Tooling */}
      <MobileBottomNav />
      <CompareFloatingBar />
      <PriceAlertModal />
      <ToastContainer />
    </div>
  );
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <AppProvider>
      <SiteLayoutInner>{children}</SiteLayoutInner>
    </AppProvider>
  );
}
