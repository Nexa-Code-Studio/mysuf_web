"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, ShieldAlert, Map as MapIcon, BarChart3 } from "lucide-react";
import type { FeatureCollection, Point } from "geojson";

import SectionHeader from "@/components/ui/SectionHeader";
import NationalHeatmap from "@/components/dashboard/NationalHeatmap";
import { Card } from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeatmapFraudProperties = {
  id: string;
  intensity: number;
  fraud_cases: number;
};

type HeatmapGeoJSON = FeatureCollection<Point, HeatmapFraudProperties>;

type ProvinceHeat = {
  id: string;
  province: string;
  island: string;
  volume: number;
  intensity: "Sangat Tinggi" | "Tinggi" | "Sedang" | "Stabil";
  activeSpbu: number;
  fraudScore: number;
};

// ─── Skeleton Components ───────────────────────────────────────────────────────

function MapSkeleton() {
  return (
    <div className="relative h-130 w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-sm animate-pulse">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <MapIcon className="w-10 h-10 text-slate-300" />
        <p className="text-xs font-medium text-slate-400">Memuat peta...</p>
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded-lg bg-slate-100" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Intensity Badge ───────────────────────────────────────────────────────────

function IntensityBadge({ intensity }: { intensity: ProvinceHeat["intensity"] }) {
  const styles: Record<ProvinceHeat["intensity"], string> = {
    "Sangat Tinggi": "bg-red-50 text-red-700 border border-red-200 animate-pulse",
    Tinggi: "bg-orange-50 text-orange-700 border border-orange-200",
    Sedang: "bg-amber-50 text-amber-700 border border-amber-200",
    Stabil: "bg-green-50 text-green-700 border border-green-200",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[intensity]}`}>
      {intensity}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function GovernmentHeatmapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapData, setMapData] = useState<HeatmapGeoJSON | null>(null);
  const [provinces, setProvinces] = useState<ProvinceHeat[]>([]);

  // Table controls
  const [islandFilter, setIslandFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"volume" | "fraud" | "spbu">("volume");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchHeatmap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir atau tidak valid. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/government/heatmap`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Akses ditolak. Endpoint ini khusus untuk akun Pemerintah/Regulator.");
        }
        throw new Error("Gagal mengambil data heatmap dari server.");
      }

      const data = await res.json();
      setMapData(data.map_data ?? null);
      setProvinces(data.provinces ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  // ── Derived stats from map data ────────────────────────────────────────────

  const totalSpbu = mapData?.features.length ?? 0;
  const totalFraudCases = useMemo(
    () => mapData?.features.reduce((acc, f) => acc + (f.properties.fraud_cases ?? 0), 0) ?? 0,
    [mapData]
  );
  const totalVolume = useMemo(
    () => provinces.reduce((acc, p) => acc + p.volume, 0),
    [provinces]
  );
  const criticalProvinces = useMemo(
    () => provinces.filter((p) => p.intensity === "Sangat Tinggi").length,
    [provinces]
  );

  // ── Filtered & Sorted Province Table ──────────────────────────────────────

  const filteredProvinces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const visible = provinces.filter((item) => {
      const matchesIsland = islandFilter === "All" || item.island === islandFilter;
      const matchesSearch = query.length ? item.province.toLowerCase().includes(query) : true;
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
  }, [provinces, islandFilter, searchQuery, sortBy, sortOrder]);

  // ── Available islands for filter dropdown ─────────────────────────────────

  const availableIslands = useMemo(
    () => ["All", ...Array.from(new Set(provinces.map((p) => p.island))).sort()],
    [provinces]
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top status banner */}
      <div className="flex items-center justify-between gap-3 p-4 bg-teal-50 border border-teal-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-600 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-slate-800">Geospatial Monitoring</h4>
            <p className="text-[10px] text-slate-500">
              Peta kepadatan anomali SPBU dan distribusi subsidi BBM secara nasional.
            </p>
          </div>
        </div>
        <button
          onClick={fetchHeatmap}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 bg-white border border-teal-200/80 rounded-xl hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Sinkronisasi..." : "Refresh"}
        </button>
      </div>

      <SectionHeader
        title="Peta Densitas Konsumsi (Heatmap)"
        subtitle="Pantau anomali distribusi subsidi BBM secara nasional berdasarkan data SPBU real-time."
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total SPBU Terpantau",
            value: isLoading ? "—" : String(totalSpbu),
            icon: <MapIcon className="w-4 h-4 text-teal-600" />,
            tone: "bg-teal-50 border-teal-100",
          },
          {
            label: "Provinsi Kritis",
            value: isLoading ? "—" : String(criticalProvinces),
            icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
            tone: "bg-red-50 border-red-100",
          },
          {
            label: "Total Volume Terdeteksi",
            value: isLoading ? "—" : `${totalVolume.toLocaleString("id-ID", { maximumFractionDigits: 0 })} L`,
            icon: <BarChart3 className="w-4 h-4 text-amber-500" />,
            tone: "bg-amber-50 border-amber-100",
          },
          {
            label: "Total Indikasi Fraud",
            value: isLoading ? "—" : String(totalFraudCases),
            icon: <ShieldAlert className="w-4 h-4 text-orange-500" />,
            tone: "bg-orange-50 border-orange-100",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`p-4 border ${stat.tone} flex items-center gap-3`}
          >
            <div className="flex-shrink-0 p-2 rounded-xl bg-white shadow-sm">{stat.icon}</div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                {stat.label}
              </p>
              <p className={`text-xl font-bold text-slate-900 mt-0.5 ${isLoading ? "animate-pulse" : ""}`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Error State */}
      {error ? (
        <Card className="p-8 border border-red-200 bg-red-50/50 flex flex-col items-center justify-center text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-red-500" />
          <h3 className="text-base font-bold text-red-900">Koneksi Gagal</h3>
          <p className="text-sm text-red-700 max-w-md">{error}</p>
          <button
            onClick={fetchHeatmap}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </Card>
      ) : (
        <>
          {/* Map Section */}
          {isLoading ? (
            <MapSkeleton />
          ) : (
            <NationalHeatmap data={mapData} isLoading={false} />
          )}

          {/* Province Breakdown Table */}
          <Card className="p-0 border border-slate-200/60 shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              {/* Table Header & Controls */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-200/60 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">Breakdown Intensitas Wilayah</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Status volume distribusi per pulau berdasarkan data SPBU real-time.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
                  {/* Search */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari provinsi..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />

                  {/* Island Filter — dynamically populated from API data */}
                  <select
                    value={islandFilter}
                    onChange={(e) => setIslandFilter(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    {availableIslands.map((island) => (
                      <option key={island} value={island}>
                        {island === "All" ? "Semua Pulau" : island}
                      </option>
                    ))}
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "volume" | "fraud" | "spbu")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    <option value="volume">Sort by Volume</option>
                    <option value="fraud">Sort by Fraud Score</option>
                    <option value="spbu">Sort by SPBU Aktif</option>
                  </select>

                  {/* Sort Order */}
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    <option value="desc">Tertinggi</option>
                    <option value="asc">Terendah</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
                    <tr>
                      <th className="px-6 py-4">Provinsi</th>
                      <th className="px-6 py-4">Pulau</th>
                      <th className="px-6 py-4">Volume Penyerapan</th>
                      <th className="px-6 py-4">SPBU Aktif</th>
                      <th className="px-6 py-4">AI Risk Score</th>
                      <th className="px-6 py-4 text-center">Status Beban</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                    ) : filteredProvinces.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                          Tidak ada data provinsi yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredProvinces.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/50 transition"
                        >
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {item.province}
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">{item.island}</td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-950">
                            {item.volume.toLocaleString("id-ID", { maximumFractionDigits: 0 })} L
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
                            <IntensityBadge intensity={item.intensity} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              {!isLoading && filteredProvinces.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400 text-right">
                  Menampilkan {filteredProvinces.length} dari {provinces.length} wilayah
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
