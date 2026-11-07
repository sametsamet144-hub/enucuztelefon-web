"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Smartphone,
  BookOpen,
  Filter,
  CheckCircle2
} from "lucide-react";
import { getQAItems } from "@/lib/data";
import type { QAItem } from "@/types";

const CATEGORIES = [
  "Tümü",
  "Satın Alma Soruları",
  "Teknik Sorunlar",
  "Batarya ve Şarj",
  "Kamera ve Fotoğraf",
  "Yazılım ve Güncelleme",
];

export default function QAHubPage() {
  const [items, setItems] = useState<QAItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    getQAItems().then((res) => {
      if (res && res.length > 0) {
        setItems(res);
      }
    });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat =
        selectedCategory === "Tümü" ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleVote = (id: string, currentHelpful: number) => {
    if (votedIds.includes(id)) return;
    setVotes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentHelpful) + 1,
    }));
    setVotedIds((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sky-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/telefon-rehberi" className="hover:text-white transition-colors">Telefon Rehberi</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Soru & Cevap</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Telefon Soru & Cevap Merkezi
          </h1>
          <p className="text-sky-200 text-base max-w-2xl">
            Akıllı telefon seçimi, batarya sağlığı, garanti süreçleri ve teknik konularda en sık sorulan sorular ve uzman yanıtları.
          </p>

          {/* Search Box */}
          <div className="mt-6 max-w-xl relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sorunuzu arayın (örn. IMEI, Pil sağlığı, AMOLED...)"
              className="w-full bg-white text-slate-900 pl-12 pr-4 py-3 rounded-2xl text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const currentVotes = votes[item.id] ?? (item.helpful ?? 0);
              const hasVoted = votedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                        {item.question}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {item.answer}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(item.id, (item.helpful ?? 0))}
                      disabled={hasVoted}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                        hasVoted
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 mb-1 ${hasVoted ? "fill-emerald-500" : ""}`} />
                      <span>{currentVotes}</span>
                      <span className="text-[10px] text-slate-400">Yararlı</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Aradığınız kriterlere uygun soru bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
