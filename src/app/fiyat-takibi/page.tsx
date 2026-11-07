"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  TrendingDown,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Heart,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { getPhones, getPriceDroppedPhones } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import PhoneImage from "@/components/phone/PhoneImage";
import PhoneCard from "@/components/phone/PhoneCard";
import { useApp } from "@/context/AppContext";
import type { Phone } from "@/types";

export default function PriceTrackingPage() {
  const { alerts, removeAlert, favorites, createAlert } = useApp();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [priceDroppingPhones, setPriceDroppingPhones] = useState<Phone[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState(65000);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getPhones().then((res) => {
      if (res && res.length > 0) {
        setPhones(res);
        setSelectedSlug(res[0].slug);
        setTargetPrice(Math.round(res[0].lowestPrice * 0.9));
      }
    });

    getPriceDroppedPhones(4).then((res) => {
      if (res && res.length > 0) {
        setPriceDroppingPhones(res);
      }
    });
  }, []);

  const activePhone = phones.find((p) => p.slug === selectedSlug) || phones[0] || null;

  const handlePhoneSelect = (slug: string) => {
    setSelectedSlug(slug);
    const found = phones.find((p) => p.slug === slug);
    if (found) {
      setTargetPrice(Math.round(found.lowestPrice * 0.9));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhone) return;
    createAlert({
      phone: activePhone,
      targetPrice,
      email,
    });
  };

  // Favorited phone objects
  const favoritePhoneObjects = phones.filter((p) => favorites.includes(p.slug));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/30 text-sky-300 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
            <Bell className="w-4 h-4 text-amber-400" />
            Otomatik Fiyat Takip ve Alarm Sistemi
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Telefon Fiyatını Takip Et, İndirimi Kaçırma
          </h1>
          <p className="text-sky-200 text-sm md:text-base max-w-2xl mx-auto mb-8">
            İlgilendiğiniz model hedeflediğiniz bütçeye indiğinde e-posta ile anında haberdar olun. Sahte indirimleri değil, gerçek piyasa düşüşlerini yakalayın.
          </p>

          {/* Quick Alarm Setup Card */}
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 shadow-2xl text-left border border-slate-100">
            <h2 className="text-slate-900 font-bold text-base mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              Hemen Ücretsiz Fiyat Alarmı Oluşturun
            </h2>

            {activePhone ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Modeli</label>
                  <select
                    value={selectedSlug}
                    onChange={(e) => handlePhoneSelect(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none cursor-pointer focus:border-sky-500"
                  >
                    {phones.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} — Güncel: {formatPrice(p.lowestPrice)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <label className="font-bold text-slate-700">Hedef Fiyat (₺)</label>
                      <span className="text-[10px] text-slate-400">
                        Güncel: {formatPrice(activePhone.lowestPrice)}
                      </span>
                    </div>
                    <input
                      type="number"
                      required
                      min={1000}
                      max={activePhone.lowestPrice}
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz</label>
                    <input
                      type="email"
                      required
                      placeholder="ornek@posta.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>Alarmı Kur ve Takibe Al</span>
                </button>
              </form>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Telefon listesi yükleniyor...
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verileriniz korunur. İstediğiniz zaman takibi tek tıkla silebilirsiniz.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-12">
        {/* Active Alerts List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-600" />
              <span>Aktif Fiyat Alarmlarınız ({alerts.length})</span>
            </h2>
          </div>

          {alerts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl p-1 border border-slate-100 flex items-center justify-center shrink-0">
                      <PhoneImage src={alert.phoneImage} alt={alert.phoneName} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs truncate max-w-[150px]">
                        {alert.phoneName}
                      </h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Hedef: <strong className="text-emerald-600">{formatPrice(alert.targetPrice)}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400">{alert.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Alarmı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Henüz kurulmuş aktif bir fiyat alarmınız yok. Yukarıdaki formdan veya herhangi bir telefon kartından alarm kurabilirsiniz.
            </div>
          )}
        </div>

        {/* User's Favorited Phones */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Favori Telefonlarınız ({favoritePhoneObjects.length})</span>
            </h2>
          </div>

          {favoritePhoneObjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoritePhoneObjects.map((phone) => (
                <PhoneCard key={phone.id} phone={phone} />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Henüz favorilere eklediğiniz bir telefon yok. Telefon kartlarındaki kalp simgesine basarak favorilerinize ekleyebilirsiniz.
            </div>
          )}
        </div>

        {/* Currently Dropping Phones Showcase */}
        {priceDroppingPhones.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <TrendingDown className="w-4 h-4" />
                  Sıcak Fırsatlar
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Şu Anda Fiyatı Düşen Telefonlar</h2>
              </div>
              <Link
                href="/telefonlar/fiyati-dusen"
                className="text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>Tüm İndirimleri Gör</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {priceDroppingPhones.slice(0, 4).map((phone) => (
                <PhoneCard key={phone.id} phone={phone} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
