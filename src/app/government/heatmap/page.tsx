"use client";

import { useMemo, useState } from "react";

import SectionHeader from "@/components/ui/SectionHeader";
import NationalHeatmap from "@/components/dashboard/NationalHeatmap";
import { Card } from "@/components/ui/Card";

type ProvinceHeat = {
  id: string;
  province: string;
  island: "Jawa" | "Sumatera" | "Kalimantan" | "Sulawesi" | "Nusa Tenggara" | "Papua";
  volume: number;
  intensity: "Sangat Tinggi" | "Tinggi" | "Sedang" | "Stabil";
  activeSpbu: number;
  fraudScore: number;
};

const provinces: ProvinceHeat[] = [
  {
    id: "1",
    province: "DKI Jakarta",
    island: "Jawa",
    volume: 1840,
    intensity: "Sangat Tinggi",
    activeSpbu: 284,
    fraudScore: 88,
  },
  {
    id: "2",
    province: "Jawa Barat",
    island: "Jawa",
    volume: 2450,
    intensity: "Sangat Tinggi",
    activeSpbu: 420,
    fraudScore: 92,
  },
  {
    id: "3",
    province: "Sumatera Utara",
    island: "Sumatera",
    volume: 1120,
    intensity: "Tinggi",
    activeSpbu: 195,
    fraudScore: 74,
  },
  {
    id: "4",
    province: "Kalimantan Timur",
    island: "Kalimantan",
    volume: 890,
    intensity: "Sedang",
    activeSpbu: 88,
    fraudScore: 61,
  },
  {
    id: "5",
    province: "Sulawesi Selatan",
    island: "Sulawesi",
    volume: 720,
    intensity: "Stabil",
    activeSpbu: 112,
    fraudScore: 45,
  },
  {
    id: "6",
    province: "Jawa Timur",
    island: "Jawa",
    volume: 1980,
    intensity: "Tinggi",
    activeSpbu: 340,
    fraudScore: 82,
  },
  {
    id: "7",
    province: "Riau",
    island: "Sumatera",
    volume: 920,
    intensity: "Tinggi",
    activeSpbu: 94,
    fraudScore: 78,
  },
  {
    id: "8",
    province: "Nusa Tenggara Barat",
    island: "Nusa Tenggara",
    volume: 380,
    intensity: "Stabil",
    activeSpbu: 45,
    fraudScore: 30,
  },
];

export default function GovernmentHeatmapPage() {
  const [islandFilter, setIslandFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"volume" | "fraud" | "spbu">("volume");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const filteredProvinces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const visible = provinces.filter((item) => {
      const matchesIsland = islandFilter === "All" || item.island === islandFilter;
      const matchesSearch = query.length
        ? item.province.toLowerCase().includes(query)
        : true;
      return matchesIsland && matchesSearch;
    });

    const getSortValue = (item: ProvinceHeat) => {
      if (sortBy === "fraud") return item.fraudScore;
      if (sortBy === "spbu") return item.activeSpbu;
      return item.volume;
    };

    return [...visible].sort((a, b) => {
      const diff = getSortValue(a) - getSortValue(b);
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [islandFilter, searchQuery, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Peta Densitas Konsumsi (Heatmap)"
        subtitle="Pantau anomali distribusi subsidi BBM secara nasional."
      />

      <NationalHeatmap />

      <Card className="p-0 border border-slate-200/60 shadow-sm flex flex-col justify-between overflow-hidden">
        <div>
          <div className="p-4 bg-slate-50/50 border-b border-slate-200/60 flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-slate-900">Breakdown Intensitas Wilayah</h3>
              <p className="text-xs text-slate-500 mt-1">Status volume distribusi per pulau.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search provinsi..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
              <select
                value={islandFilter}
                onChange={(event) => setIslandFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option value="All">Semua Pulau</option>
                <option value="Jawa">Jawa</option>
                <option value="Sumatera">Sumatera</option>
                <option value="Kalimantan">Kalimantan</option>
                <option value="Sulawesi">Sulawesi</option>
              </select>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "volume" | "fraud" | "spbu")
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option value="volume">Sort by Volume</option>
                <option value="fraud">Sort by Fraud Score</option>
                <option value="spbu">Sort by SPBU Aktif</option>
              </select>
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as "asc" | "desc")
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option value="desc">Order Desc</option>
                <option value="asc">Order Asc</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Provinsi</th>
                  <th className="px-6 py-4">Wilayah Pulau</th>
                  <th className="px-6 py-4">Volume Penyerapan</th>
                  <th className="px-6 py-4">SPBU Aktif</th>
                  <th className="px-6 py-4">AI Risk Score</th>
                  <th className="px-6 py-4 text-center">Status Beban</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProvinces.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.province}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {item.island}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-950">
                      {item.volume.toLocaleString()} L
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {item.activeSpbu} Cabang
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span
                        className={`font-bold ${
                          item.fraudScore >= 80
                            ? "text-[var(--primary)]"
                            : item.fraudScore >= 60
                            ? "text-amber-600"
                            : "text-slate-600"
                        }`}
                      >
                        {item.fraudScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.intensity === "Sangat Tinggi"
                            ? "bg-red-50 text-[var(--primary)] border border-red-200 animate-pulse"
                            : item.intensity === "Tinggi"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : item.intensity === "Sedang"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {item.intensity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
