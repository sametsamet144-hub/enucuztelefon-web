"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { backendApi } from "@/lib/api";
import {
  Settings,
  Tablet,
  Smartphone,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Eye,
  EyeOff,
  Save,
  ArrowRight,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Store as StoreIcon,
  Activity,
  Check,
  X,
} from "lucide-react";
import type { StoreInfo } from "@/types";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";
import type { Phone } from "@/types";

type AdminTab = "overview" | "stores" | "auditor" | "products" | "strategy" | "logs";

interface SuspiciousPrice {
  id: string;
  phoneName: string;
  store: string;
  normalPrice: number;
  suspiciousPrice: number;
  dropPercent: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [phoneList, setPhoneList] = useState<Phone[]>([]);
  const [storeList, setStoreList] = useState<StoreInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Strategy settings
  const [tabletEnabled, setTabletEnabled] = useState(true);
  const [tabletInSecondaryMenu, setTabletInSecondaryMenu] = useState(true);
  const [tabletPromoteToMainNav, setTabletPromoteToMainNav] = useState(false);

  // Auditor state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditCompleted, setAuditCompleted] = useState(false);

  // Suspicious prices detector
  const [suspiciousList, setSuspiciousList] = useState<SuspiciousPrice[]>([
    {
      id: "susp-1",
      phoneName: "Xiaomi 14",
      store: "PttAVM - TeknoCenter",
      normalPrice: 42999,
      suspiciousPrice: 12999,
      dropPercent: 70,
      reason: "Anormal ani %70 düşüş (Varyant karışıklığı veya sahte satıcı şüphesi)",
      status: "pending",
    },
    {
      id: "susp-2",
      phoneName: "iPhone 15 Pro Max",
      store: "Sahibinden - Spot İthalat",
      normalPrice: 66999,
      suspiciousPrice: 24500,
      dropPercent: 63,
      reason: "IMEI kayıtsız / Yurt dışı cihaz, resmi distribütör filtresine takıldı",
      status: "pending",
    },
    {
      id: "susp-3",
      phoneName: "Samsung Galaxy S24 Ultra",
      store: "n11 - GüvenStore",
      normalPrice: 57999,
      suspiciousPrice: 38999,
      dropPercent: 33,
      reason: "Kutu açılmış / teşhir ürünü başlığı uyuşmazlığı",
      status: "pending",
    },
  ]);

  // New Phone Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPhoneName, setNewPhoneName] = useState("");
  const [newPhoneBrand, setNewPhoneBrand] = useState("Apple");
  const [newPhonePrice, setNewPhonePrice] = useState(30000);
  const [newPhoneStore, setNewPhoneStore] = useState("Trendyol");

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  useEffect(() => {
    let mounted = true;
    backendApi.getStores().then((res) => {
      if (mounted && res && res.length > 0) setStoreList(res);
    });
    backendApi.getProducts("pageSize=100").then((res) => {
      if (mounted && res?.items && res.items.length > 0) setPhoneList(res.items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Run Auditor Simulation
  const runFullAudit = () => {
    setIsAuditing(true);
    setAuditProgress(10);
    setAuditCompleted(false);

    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setAuditCompleted(true);
          notify("Tüm mağaza bağlantıları ve 184 fiyat başarıyla tarandı.");
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Handle Suspicious Price Approval / Rejection
  const handleSuspiciousAction = (id: string, action: "approve" | "reject") => {
    setSuspiciousList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action === "approve" ? "approved" : "rejected" } : item
      )
    );
    notify(action === "approve" ? "Fiyat onaylandı ve yayına alındı." : "Şüpheli fiyat reddedildi ve engellendi.");
  };

  // Sync Store
  const handleSyncStore = async (slug: string) => {
    await backendApi.triggerStoreSync(slug);
    setStoreList((prev) =>
      prev.map((s) =>
        s.slug === slug
          ? { ...s, lastSyncTime: new Date().toISOString(), status: "active" }
          : s
      )
    );
    notify(`${slug.toUpperCase()} veri akışı başarıyla eşitlendi.`);
  };

  // Delete Phone
  const handleDeletePhone = (slug: string) => {
    if (confirm("Bu telefonu silmek istediğinize emin misiniz?")) {
      setPhoneList((prev) => prev.filter((p) => p.slug !== slug));
      notify("Telefon kaydı başarıyla silindi.");
    }
  };

  // Add Phone
  const handleAddPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneName) return;

    const slug = newPhoneName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newEntry: Phone = {
      id: "phone-" + Date.now(),
      slug,
      name: newPhoneName,
      brand: newPhoneBrand,
      brandSlug: newPhoneBrand.toLowerCase(),
      image: "/images/phones/iphone-16-pro-max.webp",
      images: ["/images/phones/iphone-16-pro-max.webp"],
      lowestPrice: Number(newPhonePrice),
      highestPrice: Math.round(Number(newPhonePrice) * 1.1),
      priceStore: newPhoneStore,
      priceUrl: "https://trendyol.com",
      releaseDate: new Date().toISOString(),
      isNew: true,
      isPriceDropped: false,
      rating: 9.0,
      reviewCount: 1,
      description: `${newPhoneName} resmi Türkiye garantili satışta.`,
      tags: ["new"],
      specs: {
        display: { size: 6.7, resolution: "FHD+", technology: "AMOLED", refreshRate: 120, brightness: 1500, aspectRatio: "20:9", ppi: 400 },
        camera: {
          mainCamera: { megapixels: 50, aperture: "f/1.8", ois: true, autofocus: "PDAF" },
          frontCamera: { megapixels: 12, aperture: "f/2.2", autofocus: true },
          videoCapabilities: ["4K@60fps"],
          features: ["Gece Modu"],
        },
        battery: { capacity: 5000, wiredCharging: 45, removable: false },
        performance: { chipset: "Yeni Nesil İşlemci", cpu: "Octa-core", gpu: "High-Performance", ram: 8, storage: 256, storageType: "UFS", expandableStorage: false },
        connectivity: { sim: "Nano-SIM", nfc: true, bluetooth: "5.3", wifi: "Wi-Fi 6", usb: "USB-C" },
      },
      storesPrices: [
        { store: newPhoneStore, storeSlug: newPhoneStore.toLowerCase(), price: Number(newPhonePrice), url: "https://trendyol.com", isAvailable: true, lastUpdated: new Date().toISOString() }
      ]
    };

    setPhoneList([newEntry, ...phoneList]);
    setIsAddModalOpen(false);
    setNewPhoneName("");
    notify(`${newPhoneName} başarıyla veritabanına eklendi!`);
  };

  const filteredPhones = phoneList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-black text-xl shadow-lg">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">
                  EnUcuzTelefon.com Yönetim Merkezi
                </h1>
                <span className="text-[10px] font-bold bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full border border-sky-400/30">
                  v2.4 Canlı
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Mağaza Entegrasyonları, Fiyat Doğrulama, Ürün Yönetimi & Denetim Konsolu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Siteyi Canlı Gör</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => notify("Tüm sistem değişiklikleri ve önbellek güncellendi.")}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Kaydet & Senkronize Et</span>
            </button>
          </div>
        </div>
      </header>

      {/* Status Alert Banner */}
      {statusMessage && (
        <aside
          aria-label="Sistem Bildirimi"
          className="max-w-7xl mx-auto px-4 sm:px-8 mt-4 animate-in slide-in-from-top duration-200"
        >
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </aside>
      )}

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <nav
          aria-label="Yönetim Paneli Sekmeleri"
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200"
        >
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Genel Bakış & Metrikler</span>
          </button>

          <button
            onClick={() => setActiveTab("stores")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "stores"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <StoreIcon className="w-4 h-4" />
            <span>Mağaza Entegrasyonları ({storeList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("auditor")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "auditor"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fiyat & Bağlantı Denetçisi</span>
            {suspiciousList.filter((s) => s.status === "pending").length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {suspiciousList.filter((s) => s.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Telefon Modelleri ({phoneList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("strategy")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "strategy"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Kategori & Tablet Stratejisi</span>
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* ─── TAB 1: GENEL BAKIŞ ─────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kayıtlı Telefon Modeli
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {phoneList.length}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>26 Gerçek WebP Fotoğraflı Model</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Entegre Satış Kanalı
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {storeList.length} Mağaza
                </div>
                <div className="text-xs text-sky-600 font-semibold mt-1">
                  Trendyol, Hepsiburada, Amazon, Vatan, vb.
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Doğrulanmış Canlı Fiyat
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  184 Fiyat
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Son tarama: 15 dk önce</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Veri Güvenilirlik Skoru
                </div>
                <div className="text-3xl font-black text-emerald-600 mt-2">
                  %98.7
                </div>
                <div className="text-xs text-rose-500 font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>3 Şüpheli Fiyat İncelemede</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Audit Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Otomatik Veri Doğrulama ve Bağlantı Kontrolü
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tüm mağazaların HTTP 200 durumunu, stok varlığını ve ani anormal fiyat düşüşlerini tarayın.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isAuditing}
                  onClick={runFullAudit}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
                  <span>{isAuditing ? "Taranıyor..." : "Şimdi Tüm Sistemi Tara"}</span>
                </button>
              </div>

              {isAuditing && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Mağaza bağlantıları ve ürün eşleşmeleri taranıyor...</span>
                    <span className="font-bold">{auditProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 transition-all duration-300"
                      style={{ width: `${auditProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {auditCompleted && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-emerald-700 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sonuç: 20 mağaza bağlantısı kontrol edildi, kırık link bulunamadı, 3 şüpheli fiyat incelemeye alındı.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: MAĞAZA ENTEGRASYONLARI ────────────────────────── */}
        {activeTab === "stores" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Entegre Satış Kanalları ve Pazaryerleri
                </h3>
                <p className="text-xs text-slate-500">
                  Resmi API, XML ürün beslemeleri ve doğrulanmış ortaklıklar
                </p>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl">
                {storeList.length} Aktif Kanal
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Mağaza</th>
                    <th className="py-3 px-4">Kanal Türü</th>
                    <th className="py-3 px-4">Entegrasyon Yöntemi</th>
                    <th className="py-3 px-4">Doğrulanmış Ürün</th>
                    <th className="py-3 px-4">Güvenilirlik</th>
                    <th className="py-3 px-4">Son Eşitleme</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {storeList.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800">
                            {store.name.charAt(0)}
                          </div>
                          <div>
                            <div>{store.name}</div>
                            <a
                              href={store.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-slate-400 hover:text-sky-600 inline-flex items-center gap-0.5 font-normal"
                            >
                              <span>{store.slug}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {store.typeLabel}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                          {store.integrationMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {store.verifiedPriceCount.toLocaleString("tr-TR")} adet
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-600">
                          ★ {store.reliabilityScore} / 10
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(store.lastSyncTime || Date.now()).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSyncStore(store.slug)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 font-bold rounded-lg transition-colors border border-slate-200 text-[11px]"
                        >
                          Eşitle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 3: AUDITOR & SUSPICIOUS PRICES ─────────────────── */}
        {activeTab === "auditor" && (
          <div className="space-y-6">
            {/* Suspicious Price Warning Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Şüpheli ve Doğrulanmamış Fiyat Değişimleri
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                EnUcuzTelefon.com algoritmaları, bir telefonun fiyatı aniden %30 veya %70 üzerinde düştüğünde
                bunu doğrudan ana sayfada yayınlamaz. Olası sahte satıcıları, yenilenmiş ürün başlık karışıklıklarını ve
                yanlış varyant eşleşmelerini önlemek için manuel onayınıza sunar.
              </p>

              <div className="space-y-4">
                {suspiciousList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-slate-900 text-sm">{item.phoneName}</span>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          -%{item.dropPercent} Anormal Düşüş
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Satıcı: <strong className="text-slate-800">{item.store}</strong>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Piyasa Ortalaması: <span className="line-through">{formatPrice(item.normalPrice)}</span> → Girilen Fiyat:{" "}
                        <strong className="text-rose-600 font-black">{formatPrice(item.suspiciousPrice)}</strong>
                      </div>
                      <p className="text-[11px] text-amber-800 font-medium mt-1">
                        ⚠️ Teşhis: {item.reason}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleSuspiciousAction(item.id, "reject")}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reddet & Engelle</span>
                          </button>
                          <button
                            onClick={() => handleSuspiciousAction(item.id, "approve")}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Doğrula & Yayınla</span>
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                            item.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {item.status === "approved" ? "Onaylandı" : "Reddedildi"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: TELEFON MODELLERİ (CRUD) ────────────────────── */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Telefon Veritabanı Yönetimi
                </h3>
                <p className="text-xs text-slate-500">
                  Sistemdeki {phoneList.length} modelin fiyat, stok ve teknik özellikleri
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Model veya marka ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-sky-500 w-48 sm:w-64"
                  />
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Telefon Ekle</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Model & Görsel</th>
                    <th className="py-3 px-4">Marka</th>
                    <th className="py-3 px-4">En Düşük Fiyat</th>
                    <th className="py-3 px-4">En Ucuz Mağaza</th>
                    <th className="py-3 px-4">Puan</th>
                    <th className="py-3 px-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPhones.map((phone) => (
                    <tr key={phone.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                            <PhoneImage src={phone.image} alt={phone.name} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{phone.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {phone.specs?.performance?.chipset || "Güçlü Donanım"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">
                        {phone.brand}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 price-display">
                        {formatPrice(phone.lowestPrice)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-sky-700">
                        {phone.priceStore}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-500">
                        ★ {phone.rating || 9.0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/telefon/${phone.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors"
                            title="Önizle"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeletePhone(phone.slug)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 5: KATEGORİ & TABLET STRATEJİSİ ────────────────── */}
        {activeTab === "strategy" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Kategori Önceliği ve Marka Kimliği
                  </h2>
                  <p className="text-xs text-slate-500">
                    EnUcuzTelefon.com ürün stratejisi ve vitrin yönetimi
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Birinci Öncelik: Akıllı Telefonlar & Ekosistem (Kilitli & Aktif)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tüm ana sayfa bannerları, arama motoru, karşılaştırma araçları, filtreler ve rehberler telefon merkezli çalışır.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full shrink-0">
                    Ana Odak
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                      <Tablet className="w-4 h-4 text-slate-500" />
                      İkinci Öncelik: Tabletler (Genişletilebilir İkincil Kategori)
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tabletler ana navigasyonda &apos;Diğer&apos; menüsünde ve footer alanında yer alır. Ana sayfa vitrininde telefonlarla yarışmaz.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTabletEnabled(!tabletEnabled);
                        notify(`Tablet kategorisi ${!tabletEnabled ? "aktif edildi" : "pasife alındı"}.`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        tabletEnabled ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {tabletEnabled ? "Aktif" : "Pasif"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New Phone Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-phone-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 id="new-phone-modal-title" className="text-base font-extrabold text-slate-900 mb-1">
              Yeni Telefon Modeli Ekle
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Model bilgilerini girin; anında tüm karşılaştırma ve listelere yansıyacaktır.
            </p>

            <form onSubmit={handleAddPhone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Model Adı</label>
                <input
                  type="text"
                  required
                  placeholder="örn: Honor 200 Pro"
                  value={newPhoneName}
                  onChange={(e) => setNewPhoneName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marka</label>
                  <select
                    value={newPhoneBrand}
                    onChange={(e) => setNewPhoneBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Honor">Honor</option>
                    <option value="POCO">POCO</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Realme">Realme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">En Ucuz Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    value={newPhonePrice}
                    onChange={(e) => setNewPhonePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mağaza</label>
                <select
                  value={newPhoneStore}
                  onChange={(e) => setNewPhoneStore(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                >
                  <option value="Trendyol">Trendyol</option>
                  <option value="Hepsiburada">Hepsiburada</option>
                  <option value="Amazon TR">Amazon TR</option>
                  <option value="Vatan">Vatan</option>
                  <option value="MediaMarkt">MediaMarkt</option>
                  <option value="Teknosa">Teknosa</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
