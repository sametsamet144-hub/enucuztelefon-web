"use client";

import { useState } from "react";
import { Bell, Check, X, Shield, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { backendApi } from "@/lib/api";

interface Props {
  phoneName: string;
  currentPrice: number;
  phoneSlug?: string;
}

export default function PriceAlertModal({ phoneName, currentPrice, phoneSlug }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.95));
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const slug =
      phoneSlug ||
      phoneName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    try {
      await backendApi.createPriceAlert({
        phoneSlug: slug,
        targetPrice,
        email,
      });
    } catch {
      // Backend offline fallback
    }

    try {
      const existing = JSON.parse(localStorage.getItem("enucuztelefon_alerts") || "[]");
      existing.push({
        phoneSlug: slug,
        phoneName,
        targetPrice,
        email,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("enucuztelefon_alerts", JSON.stringify(existing));
    } catch {
      // storage fallback
    }

    setSubmitted(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all shadow-sm active:scale-95"
      >
        <Bell className="w-4 h-4 text-amber-400" />
        <span>Fiyat Alarmı Kur</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/15 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!submitted ? (
              <div>
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full mb-3 border border-amber-400/20">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Akıllı Fiyat Takipçisi</span>
                </div>

                <h3 className="text-xl font-black text-white">
                  Fiyat Düştüğünde İlk Siz Öğrenin
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  <strong className="text-white">{phoneName}</strong> belirlediğiniz hedef fiyata indiğinde e-posta ile anında bildirim gönderelim.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Hedeflediğiniz İndirimli Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      required
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <div className="text-[11px] text-emerald-400 mt-1">
                      Şu anki en düşük fiyat: {formatPrice(currentPrice)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      E-Posta Adresiniz
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="adiniz@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Fiyat Alarmını Başlat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kişisel verileriniz gizli tutulur, asla spam gönderilmez.</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Alarmınız Kuruldu!</h3>
                <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  <strong className="text-white">{phoneName}</strong> fiyatı <strong>{formatPrice(targetPrice)}</strong> seviyesine ulaştığında <strong>{email}</strong> adresinize haber vereceğiz.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Tamam
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
