"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Zap, TrendingDown } from "lucide-react";
import { getPriceDroppedPhones, getPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneCard from "@/components/phone/PhoneCard";

export default function DailyDealsSection() {
  const [dealList, setDealList] = useState<Phone[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getPriceDroppedPhones(12).then((d) => {
      if (d && d.length > 0) setDealList(d);
      else getPhones().then((p) => setDealList(p.slice(0, 12)));
    });
  }, []);

  const formatDigit = (n: number) => n.toString().padStart(2, "0");

  // dealList loaded dynamically

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Header with live timer */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-2 border border-rose-200">
              <Zap className="h-3.5 w-3.5 fill-rose-600 text-rose-600 animate-bounce" />
              <span>Günün Doğrulanmış Mağaza İndirimleri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Fiyatı En Çok Düşen Telefonlar</span>
              <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full">
                Canlı Fiyat Takibi
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Son 6 ayın en düşük seviyesine yaklaşan ve 16 resmi mağazada indirimi doğrulanan popüler modeller
            </p>
          </div>

          {/* Countdown & Action */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-md border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs font-medium text-slate-300">
                Fırsat Sayacı:{" "}
                <span className="font-mono font-black text-amber-400 text-sm">
                  {formatDigit(timeLeft.hours)}:{formatDigit(timeLeft.minutes)}:
                  {formatDigit(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <Link
              href="/telefonlar/fiyati-dusen"
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <TrendingDown className="h-4 w-4" />
              <span>Tüm İndirimleri Gör</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* High-Density Visual Grid (12 Phones - 6 per row on wide desktop) */}
        <div
          className="grid gap-3.5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
            gap: "14px",
          }}
        >
          {dealList.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      </div>
    </section>
  );
}
