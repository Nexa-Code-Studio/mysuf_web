"use client";

import { useState } from "react";
import { Compass, Search, Map, AlertTriangle, CheckCircle, TrendingUp, Sliders } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

interface ProvinceHeat {
  id: string;
  province: string;
  island: "Jawa" | "Sumatera" | "Kalimantan" | "Sulawesi" | "Nusa Tenggara" | "Papua";
  volume: number; // Million Liters
  intensity: "Sangat Tinggi" | "Tinggi" | "Sedang" | "Stabil";
  activeSPBU: number;
  fraudScore: number; // 0 - 100
}

export default function GovernmentHeatmapPage() {
  const [activeFuel, setActiveFuel] = useState<"All" | "Pertalite" | "Solar">("All");
  const [islandFilter, setIslandFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [provinces] = useState<ProvinceHeat[]>([
    { id: "1", province: "DKI Jakarta", island: "Jawa", volume: 1840, intensity: "Sangat Tinggi", activeSPBU: 284, fraudScore: 88 },
    { id: "2", province: "Jawa Barat", island: "Jawa", volume: 2450, intensity: "Sangat Tinggi", activeSPBU: 420, fraudScore: 92 },
    { id: "3", province: "Sumatera Utara", island: "Sumatera", volume: 1120, intensity: "Tinggi", activeSPBU: 195, fraudScore: 74 },
    { id: "4", province: "Kalimantan Timur", island: "Kalimantan", volume: 890, intensity: "Sedang", activeSPBU: 88, fraudScore: 61 },
    { id: "5", province: "Sulawesi Selatan", island: "Sulawesi", volume: 720, intensity: "Stabil", activeSPBU: 112, fraudScore: 45 },
    { id: "6", province: "Jawa Timur", island: "Jawa", volume: 1980, intensity: "Tinggi", activeSPBU: 340, fraudScore: 82 },
    { id: "7", province: "Riau", island: "Sumatera", volume: 920, intensity: "Tinggi", activeSPBU: 94, fraudScore: 78 },
    { id: "8", province: "Nusa Tenggara Barat", island: "Nusa Tenggara", volume: 380, intensity: "Stabil", activeSPBU: 45, fraudScore: 30 },
  ]);

  // Filters logic
  const filteredProvinces = provinces.filter((p) => {
    const matchesSearch = p.province.toLowerCase().includes(search.toLowerCase());
    const matchesIsland = islandFilter === "All" || p.island === islandFilter;
    return matchesSearch && matchesIsland;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Peta Densitas Konsumsi (Heatmap)"
          subtitle="Pantau volume penyerapan subsidi BBM dan indeks risiko kecurangan di tingkat provinsi secara berkala."
        />
        
        {/* Fuel filter tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start">
          {(["All", "Pertalite", "Solar"] as const).map((fuel) => (
            <button
              key={fuel}
              onClick={() => setActiveFuel(fuel)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFuel === fuel
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {fuel === "All" ? "Semua BBM" : fuel}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-[#e31837] flex items-center justify-center border border-red-100">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zona Merah (Risiko Ekstrim)</p>
            <p className="text-lg font-bold text-slate-900">2 Provinsi</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Volume Subsidi</p>
            <p className="text-lg font-bold text-slate-950">10.3M KL</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Wilayah Stabil Aman</p>
            <p className="text-lg font-bold text-green-700">3 Provinsi</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SPBU Terdaftar Aktif</p>
            <p className="text-lg font-bold text-slate-900">1,524 Cabang</p>
          </div>
        </Card>
      </div>

      {/* Map visual and Search Filters */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.8fr]">
        {/* Heatmap Geographic Simulator */}
        <Card className="p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <div className="space-y-1 text-left w-full">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Map className="w-4 h-4 text-slate-900" /> Geolocation Command
            </h3>
            <p className="text-[11px] text-slate-500">Visual sebaran geospasial risiko penyelewengan BBM subsidi.</p>
          </div>

          {/* Gorgeous SVG Mock representing Indonesia islands */}
          <div className="w-full aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial-gradient from-slate-100/50 to-transparent pointer-events-none" />
            
            {/* Simulation of Hotspots flashing */}
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-red-500/20 rounded-full animate-ping border border-red-500/30" />
            <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-red-500/20 rounded-full animate-ping border border-red-500/30 delay-500" />
            
            <div className="space-y-3 z-10 w-full">
              <div className="flex justify-around items-center">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600 text-white rounded shadow-sm shadow-red-200">DKI Jakarta: Merah</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600 text-white rounded shadow-sm shadow-red-200">Jawa Barat: Merah</span>
              </div>
              <div className="flex justify-around items-center">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-white rounded shadow-sm">Riau: Orange</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-green-600 text-white rounded shadow-sm">Sulsel: Hijau</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold italic pt-6 leading-relaxed">
                Peta geospasial memindai sensor tera SPBU dan data plat nomor secara berkala dari satelit Pertamina.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 flex-wrap justify-center border-t border-slate-100 pt-4 w-full">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" /> Sangat Tinggi</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Tinggi</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Sedang</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-600" /> Stabil</div>
          </div>
        </Card>

        {/* Detailed Provincial Grid */}
        <Card className="p-0 border border-slate-200/60 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-4 bg-slate-50/50 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900">Breakdown Intensitas Wilayah</h3>
                <p className="text-xs text-slate-500 mt-1">Status volume distribusi per pulau.</p>
              </div>

              {/* Filter by Island */}
              <div className="flex gap-1.5 flex-wrap">
                {["All", "Jawa", "Sumatera", "Kalimantan", "Sulawesi"].map((island) => (
                  <button
                    key={island}
                    onClick={() => setIslandFilter(island)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition ${
                      islandFilter === island
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {island === "All" ? "Semua Pulau" : island}
                  </button>
                ))}
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
                  {filteredProvinces.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-800">{p.province}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{p.island}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-950">{p.volume.toLocaleString()} L</td>
                      <td className="px-6 py-4 font-mono text-slate-600">{p.activeSPBU} Cabang</td>
                      <td className="px-6 py-4 font-mono">
                        <span className={`font-bold ${p.fraudScore >= 80 ? "text-[#e31837]" : p.fraudScore >= 60 ? "text-amber-600" : "text-slate-600"}`}>
                          {p.fraudScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.intensity === "Sangat Tinggi"
                            ? "bg-red-50 text-[#e31837] border border-red-200 animate-pulse"
                            : p.intensity === "Tinggi"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : p.intensity === "Sedang"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}>
                          {p.intensity}
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
    </div>
  );
}
