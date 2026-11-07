"use client";

import Link from "next/link";
import { Sparkles, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { getNewPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneCard from "@/components/phone/PhoneCard";

export default function NewReleasesSection() {
  const [newPhones, setNewPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getNewPhones(12).then((p) => { if (p) setNewPhones(p); });
  }, []);

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>2025 / 2026 Lansmanları</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Piyasaya Yeni Çıkan Telefonlar (12 Yeni Model)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              En güncel işlemci, yapay zeka ve kamera teknolojileriyle donatılmış en yeni modeller
            </p>
          </div>

          <Link
            href="/telefonlar?sort=newest"
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
          >
            <span>Tüm Yeni Modelleri Gör</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 12 Cards Grid (6 per row on wide screen) */}
        <div
          className="grid gap-3.5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
            gap: "14px",
          }}
        >
          {newPhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      </div>
    </section>
  );
}
