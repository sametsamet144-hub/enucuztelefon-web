"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check, ShieldCheck, Tag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getPhones } from "@/lib/data";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";
import type { Phone } from "@/types";

export default function PriceAlertModal() {
  const { isAlertModalOpen, closeAlertModal, selectedAlertPhone, createAlert } = useApp();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [activePhone, setActivePhone] = useState<Phone | null>(null);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(10);

  useEffect(() => {
    getPhones().then((res) => {
      if (res && res.length > 0) {
        setPhones(res);
      }
    });
  }, []);

  useEffect(() => {
    const current = selectedAlertPhone || phones[0] || null;
    if (current) {
      setActivePhone(current);
      const calculatedTarget = Math.round((current.lowestPrice * (100 - discountPercent)) / 100);
      setTargetPrice(calculatedTarget);
    }
  }, [selectedAlertPhone, isAlertModalOpen, phones]);

  const handlePhoneChange = (slug: string) => {
    const found = phones.find((p) => p.slug === slug);
    if (found) {
      setActivePhone(found);
      setTargetPrice(Math.round((found.lowestPrice * (100 - discountPercent)) / 100));
    }
  };

  const applyDiscount = (percent: number) => {
    if (!activePhone) return;
    setDiscountPercent(percent);
    setTargetPrice(Math.round((activePhone.lowestPrice * (100 - percent)) / 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhone) return;
    createAlert({
      phone: activePhone,
      targetPrice,
      email,
    });
  };

  if (!isAlertModalOpen || !activePhone) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 id="alert-modal-title" className="text-lg font-extrabold text-white">
                  Ücretsiz Fiyat Alarmı Kur
                </h3>
                <p className="text-xs text-sky-300">Fiyat düştüğünde anında haberdar olun</p>
              </div>
            </div>
            <button
              onClick={closeAlertModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Selected Phone Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Takip Edilecek Telefon Modeli
            </label>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-sm shrink-0 flex items-center justify-center">
                <PhoneImage src={activePhone.image} alt={activePhone.name} />
              </div>
              <div className="flex-1">
                <select
                  value={activePhone.slug}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none cursor-pointer"
                >
                  {phones.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — Güncel: {formatPrice(p.lowestPrice)}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-500 mt-0.5">
                  En ucuz satıcı: <strong className="text-sky-600">{activePhone.priceStore}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Target Price */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Hedef Fiyatınız (₺)</label>
              <span className="text-xs text-slate-400">
                Güncel: <strong className="text-slate-800">{formatPrice(activePhone.lowestPrice)}</strong>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                required
                min={1000}
                max={activePhone.lowestPrice}
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-black text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
              />
              <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">TL</span>
            </div>

            {/* Quick Percent Pills */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-medium text-slate-400">Hızlı Seçim:</span>
              {[5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyDiscount(pct)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all ${
                    discountPercent === pct
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  -%{pct} ({formatPrice(Math.round((activePhone.lowestPrice * (100 - pct)) / 100))})
                </button>
              ))}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Bildirim Gönderilecek E-posta Adresi
            </label>
            <input
              type="email"
              required
              placeholder="ornek@eposta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Trust note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Spam yok. Yalnızca telefon belirlediğiniz fiyata indiğinde 1 kez bildirim alırsınız.</span>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeAlertModal}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span>Alarmı Başlat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
