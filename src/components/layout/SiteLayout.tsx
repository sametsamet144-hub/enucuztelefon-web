"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
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
  const isHomePage = pathname === "/";
  const isDark = theme === "dark";

  return (
    <div
      className={
        isHomePage
          ? `flex flex-col h-screen max-h-screen overflow-hidden relative selection:bg-sky-500 selection:text-white transition-colors duration-200 ${
              isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
            }`
          : `flex flex-col min-h-screen relative selection:bg-sky-500 selection:text-white transition-colors duration-200 ${
              isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
            }`
      }
    >
      <Header />
      <main className={isHomePage ? "flex-1 w-full overflow-hidden" : "flex-1 w-full"}>
        {children}
      </main>
      {!isHomePage && <Footer />}

      {/* Global Interactive Tooling */}
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
