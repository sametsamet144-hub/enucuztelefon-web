"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { backendApi } from "@/lib/api";
import type { Phone } from "@/types";

export interface PriceAlert {
  id: string;
  phoneSlug: string;
  phoneName: string;
  phoneImage: string;
  currentPrice: number;
  targetPrice: number;
  email: string;
  createdAt: string;
}

interface ToastInfo {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface AppContextType {
  // Theme (Siyah Mod / Beyaz Mod)
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;

  // Favorites
  favorites: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (phone: Phone) => void;
  favoritesCount: number;

  // Compare
  compareList: Phone[];
  isInCompare: (slug: string) => boolean;
  addToCompare: (phone: Phone) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;

  // Price Alert Modal
  isAlertModalOpen: boolean;
  selectedAlertPhone: Phone | null;
  openAlertModal: (phone?: Phone) => void;
  closeAlertModal: () => void;
  alerts: PriceAlert[];
  createAlert: (data: { phone: Phone; targetPrice: number; email: string }) => boolean;
  removeAlert: (id: string) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Phone[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedAlertPhone, setSelectedAlertPhone] = useState<Phone | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const applyHtmlTheme = (mode: "dark" | "light") => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(mode);
      document.documentElement.setAttribute("data-theme", mode);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("enucuz_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
        applyHtmlTheme(savedTheme);
      } else {
        applyHtmlTheme("dark");
      }

      const savedFavs = localStorage.getItem("enucuz_favorites");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedComp = localStorage.getItem("enucuz_compare");
      if (savedComp) setCompareList(JSON.parse(savedComp));

      const savedAlerts = localStorage.getItem("enucuz_alerts");
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    } catch {
      // localStorage may fail in private mode
      applyHtmlTheme("dark");
    }
  }, []);

  const setTheme = (mode: "dark" | "light") => {
    setThemeState(mode);
    applyHtmlTheme(mode);
    try {
      localStorage.setItem("enucuz_theme", mode);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  // Save changes
  const saveFavs = (favs: string[]) => {
    setFavorites(favs);
    try {
      localStorage.setItem("enucuz_favorites", JSON.stringify(favs));
    } catch {}
  };

  const saveComp = (list: Phone[]) => {
    setCompareList(list);
    try {
      localStorage.setItem("enucuz_compare", JSON.stringify(list));
    } catch {}
  };

  const saveAlerts = (list: PriceAlert[]) => {
    setAlerts(list);
    try {
      localStorage.setItem("enucuz_alerts", JSON.stringify(list));
    } catch {}
  };

  // Toast helpers
  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Favorites logic
  const isFavorite = (slug: string) => favorites.includes(slug);

  const toggleFavorite = (phone: Phone) => {
    if (isFavorite(phone.slug)) {
      const updated = favorites.filter((s) => s !== phone.slug);
      saveFavs(updated);
      showToast(`${phone.name} favorilerden çıkarıldı.`, "info");
    } else {
      const updated = [...favorites, phone.slug];
      saveFavs(updated);
      showToast(`${phone.name} favorilerinize eklendi! ❤️`, "success");
    }
  };

  // Compare logic
  const isInCompare = (slug: string) => compareList.some((p) => p.slug === slug);

  const addToCompare = (phone: Phone) => {
    if (isInCompare(phone.slug)) {
      removeFromCompare(phone.slug);
      return;
    }
    if (compareList.length >= 4) {
      showToast("En fazla 4 telefon aynı anda karşılaştırılabilir.", "warning");
      return;
    }
    const updated = [...compareList, phone];
    saveComp(updated);
    showToast(`${phone.name} karşılaştırma listesine eklendi (${updated.length}/4) ⚖️`, "success");
  };

  const removeFromCompare = (slug: string) => {
    const updated = compareList.filter((p) => p.slug !== slug);
    saveComp(updated);
    showToast("Model karşılaştırmadan çıkarıldı.", "info");
  };

  const clearCompare = () => {
    saveComp([]);
    showToast("Karşılaştırma listesi temizlendi.", "info");
  };

  // Alert modal logic
  const openAlertModal = (phone?: Phone) => {
    if (phone) setSelectedAlertPhone(phone);
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const createAlert = ({
    phone,
    targetPrice,
    email,
  }: {
    phone: Phone;
    targetPrice: number;
    email: string;
  }) => {
    if (!email || !targetPrice) {
      showToast("Lütfen geçerli bir e-posta ve hedef fiyat girin.", "warning");
      return false;
    }
    const newAlert: PriceAlert = {
      id: "alert-" + Date.now(),
      phoneSlug: phone.slug,
      phoneName: phone.name,
      phoneImage: phone.image,
      currentPrice: phone.lowestPrice,
      targetPrice,
      email,
      createdAt: new Date().toISOString(),
    };
    backendApi
      .createPriceAlert({
        phoneSlug: phone.slug,
        targetPrice,
        email,
      })
      .catch(() => {});
    const updated = [...alerts, newAlert];
    saveAlerts(updated);
    setIsAlertModalOpen(false);
    showToast(`🔔 ${phone.name} için ${targetPrice.toLocaleString("tr-TR")} ₺ fiyat alarmı kuruldu!`, "success");
    return true;
  };

  const removeAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    saveAlerts(updated);
    showToast("Fiyat alarmı silindi.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        favorites,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length,
        compareList,
        isInCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isAlertModalOpen,
        selectedAlertPhone,
        openAlertModal,
        closeAlertModal,
        alerts,
        createAlert,
        removeAlert,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
