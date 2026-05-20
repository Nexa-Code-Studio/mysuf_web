"use client";

import { useState } from "react";
import { Leaf, Award, Compass, TrendingDown, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import ChartCard from "@/components/ui/ChartCard";

interface VehicleConsumption {
  plate: string;
  type: string;
  driver: string;
  distance: number; // km
  fuelUsed: number; // Liters
  efficiency: number; // km/L
  rank: "Optimal" | "Average" | "Needs Service";
}

export default function FleetFuelConsumptionPage() {
  const [activeTab, setActiveTab] = useState<"Monthly" | "Weekly" | "Daily">("Monthly");
  
  const [vehiclesData] = useState<VehicleConsumption[]>([
    { plate: "B 8821 TQ", type: "Tanker 10KL", driver: "Rizal Wibowo", distance: 1820, fuelUsed: 210, efficiency: 8.7, rank: "Optimal" },
    { plate: "B 9902 KAA", type: "Tanker 16KL", driver: "Rama Utama", distance: 2450, fuelUsed: 310, efficiency: 7.9, rank: "Average" },
    { plate: "B 1145 WX", type: "Box Cargo Medium", driver: "Sinta Kartika", distance: 1200, fuelUsed: 180, efficiency: 6.7, rank: "Needs Service" },
    { plate: "B 4512 PK", type: "Pickup L300", driver: "Agus Pratama", distance: 1450, fuelUsed: 130, efficiency: 11.2, rank: "Optimal" },
    { plate: "D 2219 BZ", type: "Box Cargo Medium", driver: "Nia Putri", allocatedLimit: 120, distance: 980, fuelUsed: 115, efficiency: 8.5, rank: "Optimal" } as any,
  ]);

  // Overall Stats
  const avgEfficiency = (vehiclesData.reduce((sum, v) => sum + v.efficiency, 0) / vehiclesData.length).toFixed(1);
  const totalDistance = vehiclesData.reduce((sum, v) => sum + v.distance, 0);
  const totalFuel = vehiclesData.reduce((sum, v) => sum + v.fuelUsed, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Analisis Konsumsi BBM"
          subtitle="Monitoring komprehensif efisiensi kilometer per liter dan jejak karbon armada."
        />
        
        {/* Toggle View */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center border border-slate-200/50">
          {(["Monthly", "Weekly", "Daily"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab === "Monthly" ? "Bulanan" : tab === "Weekly" ? "Mingguan" : "Harian"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Efisiensi Rata-Rata</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950">{avgEfficiency} km/L</span>
            <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2.4%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Menghemat ±120 L bulan ini.</p>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total BBM Dikonsumsi</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950">{totalFuel} L</span>
            <span className="text-xs font-bold text-red-500 flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> -4.1%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Lebih hemat dari batas kuota.</p>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Jarak Tempuh Armada</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950">{totalDistance.toLocaleString()} km</span>
            <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +10.2%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Logistik rute luar kota lancar.</p>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Karbon Tereduksi</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600 flex items-center gap-1.5">
              <Leaf className="w-5 h-5 shrink-0" /> -12.4%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Setara dengan 34 bibit pohon.</p>
        </Card>
      </div>

      {/* Visual Mileage Comparison (Bar Chart Mock) */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ChartCard
          title="Efisiensi Tiap Armada (km/L)"
          description="Komparasi liter per kilometer armada. Standar industri logistik adalah > 7.0 km/L."
        >
          <div className="space-y-5 pt-4">
            {vehiclesData.map((v) => (
              <div key={v.plate} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-950 text-white font-mono rounded text-[10px] tracking-wider">
                      {v.plate}
                    </span>
                    <span className="text-slate-600 font-medium">{v.driver}</span>
                  </div>
                  <span className={`font-mono font-bold ${
                    v.efficiency >= 8.5 ? "text-green-600" : v.efficiency >= 7.0 ? "text-slate-700" : "text-[#e31837]"
                  }`}>
                    {v.efficiency} km/L
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      v.efficiency >= 8.5
                        ? "bg-green-500"
                        : v.efficiency >= 7.0
                        ? "bg-slate-800"
                        : "bg-[#e31837]"
                    }`}
                    style={{ width: `${(v.efficiency / 12) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono pt-2 border-t border-slate-100">
              <span>0 km/L</span>
              <span>4 km/L</span>
              <span>8 km/L</span>
              <span>12 km/L (Optimal)</span>
            </div>
          </div>
        </ChartCard>

        {/* Insight List */}
        <Card className="p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-md flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#e31837]" /> Evaluasi & Rekomendasi AI
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#e31837] flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 shrink-0" /> Unit B 1145 WX Tidak Efisien
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Konsumsi BBM berada di bawah batas wajar (6.7 km/L). Terdeteksi pola idle mesin terlalu lama di depo Pulogadung. Direkomendasikan melakukan pemeriksaan injektor bahan bakar dan filter udara.
                </p>
              </div>

              <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-green-700 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 shrink-0" /> Performa Rizal Wibowo Optimal
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Mencapai efisiensi 8.7 km/L pada truk besar kelas 10KL. Direkomendasikan mendapatkan insentif BBM hijau minggu ini atas penerapan eco-driving terarah.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold italic text-center pt-6">
            AI Engine memperbarui metrik efisiensi setiap 12 jam sekali.
          </div>
        </Card>
      </div>

      {/* Consumption Breakdown Table */}
      <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Rincian Konsumsi Detail per Armada</h3>
          <p className="text-xs text-slate-500 mt-1">Daftar lengkap konsumsi volume BBM subsidi vs jarak tempuh operasional.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Nomor Plat</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Tipe Kendaraan</th>
                <th className="px-6 py-4">Jarak Tempuh</th>
                <th className="px-6 py-4">Volume BBM</th>
                <th className="px-6 py-4">Rasio Efisiensi</th>
                <th className="px-6 py-4">Kategori Kinerja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {vehiclesData.map((v) => (
                <tr key={v.plate} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold rounded text-xs tracking-wider border-y-2 border-slate-700">
                      {v.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{v.driver}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{v.type}</td>
                  <td className="px-6 py-4 font-mono text-slate-950 font-semibold">{v.distance} km</td>
                  <td className="px-6 py-4 font-mono text-slate-700">{v.fuelUsed} L</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-950">{v.efficiency} km/L</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      v.rank === "Optimal"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : v.rank === "Average"
                        ? "bg-slate-100 text-slate-600 border border-slate-200"
                        : "bg-red-50 text-[#e31837] border border-red-200"
                    }`}>
                      {v.rank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
