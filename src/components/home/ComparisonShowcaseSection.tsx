"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, ArrowRight, Zap } from "lucide-react";
import { useEffect } from "react";
import { getPhones } from "@/lib/data";
import type { Phone } from "@/types";
import PhoneImage from "@/components/phone/PhoneImage";
import { formatPrice } from "@/lib/utils";

export default function ComparisonShowcaseSection() {
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    getPhones().then((p) => {
      if (p && p.length > 0) {
        setPhones(p);
        setSelectPhone1(p[0].slug);
        setSelectPhone2(p.find((x) => x.slug === "samsung-galaxy-s25-ultra")?.slug || p[1]?.slug || p[0].slug);
      }
    });
  }, []);
  const router = useRouter();
  const [selectPhone1, setSelectPhone1] = useState("");
  const [selectPhone2, setSelectPhone2] = useState("");

  const phoneObj1 = phones.find((p) => p.slug === selectPhone1) || phones[0] || null;
  const phoneObj2 = phones.find((p) => p.slug === selectPhone2) || phones[1] || null;

  const handleCustomCompare = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/karsilastir?phone1=${selectPhone1}&phone2=${selectPhone2}`);
  };

  const featuredPairs = [
    {
      p1: phones.find((p) => p.slug === "iphone-16-pro-max") || phones[0],
      p2: phones.find((p) => p.slug === "samsung-galaxy-s25-ultra") || phones[1],
      title: "Zirve Düellosu: iPhone 16 Pro Max vs S25 Ultra",
      tag: "🔥 En Çok Kıyaslanan",
      bg: "from-sky-950 via-slate-900 to-indigo-950 border-sky-500/30",
    },
    {
      p1: phones.find((p) => p.slug === "xiaomi-15-pro") || phones[2],
      p2: phones.find((p) => p.slug === "vivo-x200-pro") || phones[3],
      title: "Kamera Devleri: Leica 50MP vs ZEISS 200MP",
      tag: "📸 Kamera Savaşı",
      bg: "from-rose-950 via-slate-900 to-amber-950 border-rose-500/30",
    },
    {
      p1: phones.find((p) => p.slug === "poco-x6-pro") || phones[4],
      p2: phones.find((p) => p.slug === "redmi-note-14-pro") || phones[5],
      title: "Fiyat/Performans: POCO X6 Pro vs Redmi Note 14 Pro+",
      tag: "⚡ Orta Segment Kralı",
      bg: "from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/30",
    },
    {
      p1: phones.find((p) => p.slug === "asus-rog-phone-8-pro") || phones[6],
      p2: phones.find((p) => p.slug === "redmagic-9s-pro") || phones[7],
      title: "Oyun Arenası: ROG Phone 8 Pro vs REDMAGIC 9S Pro",
      tag: "🎮 165Hz Gaming",
      bg: "from-purple-950 via-slate-900 to-fuchsia-950 border-purple-500/30",
    },
  ];

  if (phones.length === 0 || !phoneObj1 || !phoneObj2) return null;

  return (
    <section className="py-14 bg-slate-950 text-white border-b border-slate-800">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full mb-2 border border-sky-400/20">
              <Scale className="h-3.5 w-3.5" />
              <span>Görsel VS Karşılaştırma Arenası</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Telefonları Kafa Kafaya Kıyaslayın
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              İki model arasındaki ekran, kamera sensörü, batarya ve 16 mağaza fiyat farklarını görsel olarak inceleyin
            </p>
          </div>

          <Link
            href="/karsilastir"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 border border-white/15 transition-colors shrink-0"
          >
            <span>Karşılaştırma Aracını Aç</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Visual Showdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {featuredPairs.map((pair, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${pair.bg} rounded-3xl border p-5 shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-amber-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                    {pair.tag}
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold">Canlı VS</span>
                </div>
                <h3 className="text-sm font-black text-white mb-4 leading-snug">
                  {pair.title}
                </h3>

                {/* Showdown Visual Stage */}
                <div className="flex items-center justify-between gap-2 mb-5 bg-slate-950/50 rounded-2xl p-3 border border-white/10">
                  {/* Phone 1 */}
                  <div className="flex flex-col items-center text-center flex-1 min-w-0">
                    <div className="h-28 w-full p-1.5 flex items-center justify-center">
                      <PhoneImage src={pair.p1.image} alt={pair.p1.name} />
                    </div>
                    <div className="font-bold text-white text-xs mt-1.5 truncate w-full">
                      {pair.p1.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {pair.p1.specs.camera.mainCamera.megapixels}MP • {pair.p1.specs.battery.capacity}mAh
                    </div>
                    <div className="text-xs font-black text-emerald-400 mt-0.5">
                      {formatPrice(pair.p1.lowestPrice)}
                    </div>
                  </div>

                  {/* VS Badge */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-[11px] flex items-center justify-center shadow-lg shrink-0 border-2 border-slate-900">
                    VS
                  </div>

                  {/* Phone 2 */}
                  <div className="flex flex-col items-center text-center flex-1 min-w-0">
                    <div className="h-28 w-full p-1.5 flex items-center justify-center">
                      <PhoneImage src={pair.p2.image} alt={pair.p2.name} />
                    </div>
                    <div className="font-bold text-white text-xs mt-1.5 truncate w-full">
                      {pair.p2.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {pair.p2.specs.camera.mainCamera.megapixels}MP • {pair.p2.specs.battery.capacity}mAh
                    </div>
                    <div className="text-xs font-black text-sky-400 mt-0.5">
                      {formatPrice(pair.p2.lowestPrice)}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/karsilastir?phone1=${pair.p1.slug}&phone2=${pair.p2.slug}`}
                className="w-full py-2.5 bg-white/10 hover:bg-sky-600 text-white font-bold text-xs text-center rounded-xl transition-all border border-white/15 flex items-center justify-center gap-1.5"
              >
                <span>Karşılaştırma Tablosunu Gör</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Custom Interactive Visual Compare Builder */}
        <div className="bg-gradient-to-r from-sky-900/60 via-indigo-900/60 to-slate-900 rounded-3xl p-6 border border-sky-500/30 shadow-2xl">
          <form
            onSubmit={handleCustomCompare}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/15 px-3 py-1 rounded-full mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Özel Karşılaştırma Oluşturucu</span>
              </div>
              <h3 className="text-xl font-black text-white">
                İstediğiniz 2 Telefonu Seçin
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                97 model arasından dilediğiniz iki telefonu seçip anında yan yana kıyaslayın.
              </p>
            </div>

            {/* Phone 1 Visual Picker */}
            <div className="lg:col-span-3 flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-white/15">
              <div className="w-12 h-14 bg-white/10 rounded-xl p-1 flex items-center justify-center shrink-0">
                <PhoneImage src={phoneObj1.image} alt={phoneObj1.name} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-sky-400 uppercase mb-1">
                  1. Telefonu Seçin
                </label>
                <select
                  value={selectPhone1}
                  onChange={(e) => setSelectPhone1(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs font-bold rounded-lg px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-sky-400"
                >
                  {phones.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.brand} - {p.name} ({formatPrice(p.lowestPrice)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone 2 Visual Picker */}
            <div className="lg:col-span-3 flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-white/15">
              <div className="w-12 h-14 bg-white/10 rounded-xl p-1 flex items-center justify-center shrink-0">
                <PhoneImage src={phoneObj2.image} alt={phoneObj2.name} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">
                  2. Telefonu Seçin
                </label>
                <select
                  value={selectPhone2}
                  onChange={(e) => setSelectPhone2(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs font-bold rounded-lg px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-sky-400"
                >
                  {phones.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.brand} - {p.name} ({formatPrice(p.lowestPrice)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-4 px-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4" />
                <span>Kıyasla</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
