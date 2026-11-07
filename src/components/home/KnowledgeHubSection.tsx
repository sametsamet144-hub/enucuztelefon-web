"use client";

import Link from "next/link";
import { BookOpen, Flame, HelpCircle, Shield, ArrowRight, Cpu, Battery, Wrench } from "lucide-react";

export default function KnowledgeHubSection() {
  const troubleshootingItems = [
    {
      title: "Telefon Neden Çok Isınır?",
      slug: "telefon-neden-isinir",
      desc: "İşlemci yükü, hızlı şarj ve ortam sıcaklığının etkileri ve anında soğutma yöntemleri.",
      tag: "Kronik Sorunlar",
      icon: Flame,
      color: "text-rose-500 bg-rose-50",
    },
    {
      title: "Batarya Neden Hızlı Biter?",
      slug: "batarya-neden-hizli-biter",
      desc: "Arka plan uygulamaları, 120Hz ekran ve 5G sinyal aramasının pil ömrüne etkisi.",
      tag: "Pil Sağlığı",
      icon: Battery,
      color: "text-amber-500 bg-amber-50",
    },
    {
      title: "Telefon Neden Yavaşlar ve Kilitlenir?",
      slug: "telefon-neden-yavaslar",
      desc: "Önbellek şişmesi, yetersiz RAM ve depolama doluluğunda yapılması gereken 5 adım.",
      tag: "Performans",
      icon: Wrench,
      color: "text-sky-500 bg-sky-50",
    },
  ];

  const techDictionary = [
    {
      title: "AMOLED, OLED ve LTPO Farkı",
      slug: "amoled-oled-ve-ltpo-ekran",
      desc: "Ekran yenileme hızını 1Hz'e kadar düşürerek pil tasarrufu sağlayan LTPO teknolojisi.",
    },
    {
      title: "OIS (Optik Görüntü Sabitleme) Nedir?",
      slug: "ois-optik-goruntu-sabitleme",
      desc: "Gece çekimlerinde ve videoda titreşimi engelleyen donanımsal jiroskop mekanizması.",
    },
    {
      title: "Snapdragon vs Apple A18 vs MediaTek",
      slug: "islemciler",
      desc: "3nm üretim teknolojisi, NPU yapay zeka çekirdekleri ve AnTuTu benchmark sıralaması.",
    },
  ];

  return (
    <section className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-3 py-1 rounded-full mb-2 border border-sky-200">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Türkiye Telefon Bilgi Merkezi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Telefon Rehberi & Sorun Çözüm Merkezi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Satın almadan önce bilmeniz gereken donanım terimleri ve telefonunuzdaki kronik sorunların pratik çözümleri
          </p>
        </div>

        {/* 2 Big Blocks: Troubleshooting & Tech Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Left Block: Troubleshooting */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Telefon Sorunları ve Çözümleri
              </h3>
              <Link href="/sorunlar" className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">
                <span>Tüm Sorunlar</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {troubleshootingItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.slug}
                    href={`/sorunlar/${item.slug}`}
                    className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-sky-400 hover:shadow-md transition-all flex items-start gap-4 group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Block: Tech Dictionary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Telefon Teknolojileri Sözlüğü
              </h3>
              <Link href="/teknoloji" className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">
                <span>Sözlük</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              {techDictionary.map((tech) => (
                <Link
                  key={tech.slug}
                  href={`/teknoloji/${tech.slug}`}
                  className="block p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-sky-600">
                      {tech.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tech.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Official Support Bar: BTK IMEI, 2nd hand checklist, warranty */}
        <div className="p-6 bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 text-white rounded-3xl border border-sky-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Resmî BTK IMEI & Garanti Sorgulama Rehberi</h4>
              <p className="text-xs text-sky-200 mt-0.5 max-w-xl leading-relaxed">
                Kayıtsız veya çalıntı telefon mağduru olmayın. Resmi e-Devlet kapısı üzerinden IMEI durumunu ve 2. el kontrol adımlarını inceleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/bilgi/imei-sorgulama"
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              IMEI Sorgulama Adımları
            </Link>
            <Link
              href="/bilgi/ikinci-el-kontrol"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors"
            >
              2. El Kontrol Listesi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
