"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/types";

interface Props {
  currentSort: SortOption;
}

export default function PhoneSortSelect({ currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "En Yeni Çıkanlar" },
    { value: "price-asc", label: "Fiyat: En Düşükten Yükseğe" },
    { value: "price-desc", label: "Fiyat: En Yüksekten Düşüğe" },
    { value: "rating", label: "En Yüksek Puanlılar" },
    { value: "price-drop", label: "Fiyatı En Çok Düşenler" },
  ];

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 py-2 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 shadow-sm"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
