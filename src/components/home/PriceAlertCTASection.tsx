"use client";

import { useState } from "react";
import { Bell, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { getPhones } from "@/lib/data";
import type { Phone } from "@/types";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";

export default function PriceAlertCTASection() {
  const { createAlert } = useApp();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [targetPrice, setTargetPrice] = useState<number>(65000);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getPhones().then((p) => {
      if (p && p.length > 0) {
        setPhones(p);
        setSelectedSlug(p[0].slug);
        setTargetPrice(Math.round(p[0].lowestPrice * 0.9));
      }
    });
  }, []);

  const selectedPhone = phones.find((p) => p.slug === selectedSlug) || phones[0] || null;

  const handlePhoneSelect = (slug: string) => {
    setSelectedSlug(slug);
    const found = phones.find((p) => p.slug === slug);
    if (found) {
      setTargetPrice(Math.round(found.lowestPrice * 0.9));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !targetPrice) return;
    const success = createAlert({
      phone: selectedPhone,
      targetPrice,
      email,
    });
    if (success) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  if (!selectedPhone || phones.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3.5 py-1.5 rounded-full mb-4 border border-amber-400/20 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>%100 Ücretsiz Fiyat Takip Hizmeti</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              İstediğiniz Fiyata Düşünce{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                İlk Sizin Haberiniz Olsun
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              Her gün fiyat kontrolü yapmanıza gerek yok. İstediğiniz modeli ve hedeflediğiniz bütçeyi seçin; Trendyol, Hepsiburada veya Amazon&apos;da o fiyata indiği an size anında e-posta gönderelim.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tek tıkla iptal edilebilir, reklam içermeyen bildirimler</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>20+ güvenilir satıcıda 24 saat kesintisiz fiyat taraması</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Live Alert Form */}
          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
              {submitted ? (
                <div className="text-center py-8 animate-in zoom-in duration-200">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Fiyat Alarmınız Aktif!</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    <strong className="text-white">{selectedPhone.name}</strong> fiyatı{" "}
                    <strong className="text-amber-400">{formatPrice(targetPrice)}</strong> seviyesine indiğinde{" "}
                    <strong className="text-white">{email}</strong> adresinize haber vereceğiz.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs text-sky-400 hover:text-white underline font-bold"
                  >
                    Başka Bir Telefon İçin Alarm Kur
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      Takip Etmek İstediğiniz Model
                    </label>
                    <select
                      value={selectedSlug}
                      onChange={(e) => handlePhoneSelect(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none cursor-pointer focus:border-sky-400 transition-colors"
                    >
                      {phones.map((p) => (
                        <option key={p.slug} value={p.slug} className="text-slate-900 bg-white">
                          {p.name} (Güncel: {formatPrice(p.lowestPrice)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <label className="font-bold text-slate-200">Hedef Fiyat (₺)</label>
                        <span className="text-[11px] text-slate-400">
                          Güncel: {formatPrice(selectedPhone.lowestPrice)}
                        </span>
                      </div>
                      <input
                        type="number"
                        required
                        min={1000}
                        max={selectedPhone.lowestPrice}
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        E-posta Adresiniz
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ornek@eposta.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-sky-400 transition-colors placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Bilgileriniz KVKK uyumlu korunur, üçüncü taraflarla paylaşılmaz.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Ücretsiz Fiyat Alarmını Başlat</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
