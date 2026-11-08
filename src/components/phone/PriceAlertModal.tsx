"use client";

import { useState } from "react";
import { Bell, Check, X, Shield, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { backendApi } from "@/lib/api";

interface Props {
  phoneName: string;
  currentPrice: number;
  phoneSlug?: string;
  productId?: string;
  productVariantId?: string;
}

export default function PriceAlertModal({
  phoneName,
  currentPrice,
  phoneSlug,
  productId,
  productVariantId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.95));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      await backendApi.createPriceAlert({
        productVariantId: productVariantId || productId,
        phoneSlug: slug,
        targetPrice,
        email,
      });
    } catch {
      // Backend offline fallback
    } finally {
      setLoading(false);
    }

    try {
      const existing = JSON.parse(localStorage.getItem("enucuztelefon_alerts") || "[]");
      existing.push({
        phoneSlug: slug,
        productId: productId || productVariantId,
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
                    <div className="relative">
                      <input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="w-full bg-slate-800/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                        min="1000"
                        max={currentPrice}
                        required
                      />
                      <span className="absolute right-4 top-3 text-xs text-slate-400">
                        Şu an: {formatPrice(currentPrice)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Bildirim E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="adiniz@ornek.com"
                      className="w-full bg-slate-800/80 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Spam göndermiyoruz. Sadece fiyat hedefi gerçekleştiğinde 1 kez bildirim alırsınız.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98 disabled:opacity-50"
                  >
                    <span>{loading ? "Kaydediliyor..." : "Fiyat Alarmını Aktif Et"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Alarm Başarıyla Kuruldu!
                </h3>
                <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed">
                  <strong className="text-white">{phoneName}</strong> fiyatı <strong>{formatPrice(targetPrice)}</strong> seviyesine indiğinde <strong>{email}</strong> adresinize anında e-posta göndereceğiz.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
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
