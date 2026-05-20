"use client";

import { useState } from "react";
import { Coins, Settings, TrendingUp, TrendingDown, RefreshCw, AlertCircle, Award, Compass, BarChart } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface RegionQuota {
  name: string;
  originalQuota: number; // in Million KL
  simulatedQuota: number;
  direction: "up" | "down" | "flat";
  percentageDiff: number;
}

export default function GovernmentQuotaControlPage() {
  const [crudePrice, setCrudePrice] = useState(78); // USD/barrel
  const [inflationIndex, setInflationIndex] = useState(3.2); // percent
  const [nationalBudget, setNationalBudget] = useState(124); // Trillion IDR

  const [regions, setRegions] = useState<RegionQuota[]>([
    { name: "Jawa", originalQuota: 5.8, simulatedQuota: 5.8, direction: "flat", percentageDiff: 0 },
    { name: "Sumatera", originalQuota: 2.1, simulatedQuota: 2.1, direction: "flat", percentageDiff: 0 },
    { name: "Kalimantan", originalQuota: 1.2, simulatedQuota: 1.2, direction: "flat", percentageDiff: 0 },
    { name: "Sulawesi", originalQuota: 1.1, simulatedQuota: 1.1, direction: "flat", percentageDiff: 0 },
    { name: "Papua & Maluku", originalQuota: 0.6, simulatedQuota: 0.6, direction: "flat", percentageDiff: 0 },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const runSimulation = () => {
    setIsSimulating(true);

    // Dynamic quota engine logic
    setTimeout(() => {
      // If crude price is high, we must decrease quota to protect budget, or increase budget
      // We calculate a multiplier based on parameters
      const budgetFactor = nationalBudget / 124; // baseline 124T
      const crudeFactor = 75 / crudePrice; // baseline $75
      const inflationFactor = 3.0 / inflationIndex; // baseline 3%

      const quotaMultiplier = budgetFactor * crudeFactor * inflationFactor;

      setRegions((prev) =>
        prev.map((r) => {
          const simValue = Number((r.originalQuota * quotaMultiplier).toFixed(2));
          const diff = simValue - r.originalQuota;
          const pct = Math.round((diff / r.originalQuota) * 100);
          
          return {
            ...r,
            simulatedQuota: simValue,
            direction: diff > 0.02 ? "up" : diff < -0.02 ? "down" : "flat",
            percentageDiff: Math.abs(pct),
          };
        })
      );

      setIsSimulating(false);
      setToast({ show: true, msg: "Dynamic Quota Engine: Kebijakan Kuota Wilayah Berhasil Dikalkulasi!" });
    }, 1200);
  };

  const handleApplyQuota = () => {
    setToast({ show: true, msg: "Sukses! Kebijakan Kuota Baru Telah Diterapkan Nasional." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Dynamic Quota Control"
          subtitle="Formulasikan batasan kuota BBM nasional berdasarkan fluktuasi ekonomi makro global."
        />
        <div className="flex gap-2">
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            Jalankan Simulasi
          </button>
          <button
            onClick={handleApplyQuota}
            disabled={isSimulating}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition active:scale-95"
          >
            Terapkan Kuota Baru
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
        {/* Parameters Sliders */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6 self-start">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-600" /> Parameter Makroekonomi
            </h3>
            <p className="text-xs text-slate-500 mt-1">Ubah indeks berikut untuk mensimulasikan beban anggaran subsidi.</p>
          </div>

          <div className="space-y-5">
            {/* Price slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Indeks Minyak Mentah (Crude Oil)</span>
                <span className="font-mono text-slate-900">${crudePrice} / Barrel</span>
              </div>
              <input
                type="range"
                min="50"
                max="120"
                step="2"
                disabled={isSimulating}
                value={crudePrice}
                onChange={(e) => setCrudePrice(Number(e.target.value))}
                className="w-full accent-slate-950 cursor-pointer disabled:opacity-50"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                <span>$50</span>
                <span>$120 (Kritis)</span>
              </div>
            </div>

            {/* Inflation slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Indeks Inflasi Domestik</span>
                <span className="font-mono text-slate-900">{inflationIndex}%</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="8.0"
                step="0.1"
                disabled={isSimulating}
                value={inflationIndex}
                onChange={(e) => setInflationIndex(Number(e.target.value))}
                className="w-full accent-slate-950 cursor-pointer disabled:opacity-50"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                <span>1.5%</span>
                <span>8.0%</span>
              </div>
            </div>

            {/* Budget slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Anggaran Subsidi Energi</span>
                <span className="font-mono text-slate-900">Rp {nationalBudget} Triliun</span>
              </div>
              <input
                type="range"
                min="90"
                max="180"
                step="5"
                disabled={isSimulating}
                value={nationalBudget}
                onChange={(e) => setNationalBudget(Number(e.target.value))}
                className="w-full accent-slate-950 cursor-pointer disabled:opacity-50"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                <span>Rp 90T</span>
                <span>Rp 180T (Maks)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Outputs Visualization Table */}
        <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden relative">
          {isSimulating && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-900">AI Dynamic Quota Model Menghitung Kurva Distribusi...</p>
            </div>
          )}

          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Simulasi Alokasi Subsidi Wilayah</h3>
              <p className="text-xs text-slate-500 mt-1">Perbandingan kuota orisinal vs simulasi makroekonomi.</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono">Satuan: Juta Kilo Liter (KL)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Wilayah Pulau</th>
                  <th className="px-6 py-4">Kuota Orisinal</th>
                  <th className="px-6 py-4">Kuota Simulasi</th>
                  <th className="px-6 py-4">Visual Perubahan</th>
                  <th className="px-6 py-4 text-center">Selisih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {regions.map((region) => (
                  <tr key={region.name} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">{region.name}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-500">{region.originalQuota}M KL</td>
                    <td className="px-6 py-4 font-mono font-extrabold text-slate-900">{region.simulatedQuota}M KL</td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-slate-300 h-full"
                          style={{ width: `${(region.originalQuota / 6) * 100}%` }}
                        />
                        <div
                          className={`h-full ${
                            region.direction === "up" ? "bg-green-500" : region.direction === "down" ? "bg-[#e31837]" : "bg-transparent"
                          }`}
                          style={{
                            width: `${(Math.abs(region.simulatedQuota - region.originalQuota) / 6) * 100}%`
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {region.direction === "up" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-bold font-mono">
                          <TrendingUp className="w-3.5 h-3.5" /> +{region.percentageDiff}%
                        </span>
                      ) : region.direction === "down" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-[#e31837] border border-red-200 rounded text-xs font-bold font-mono">
                          <TrendingDown className="w-3.5 h-3.5" /> -{region.percentageDiff}%
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs font-semibold">Flat (0%)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 font-semibold italic text-center">
            Peta jalan makro disinkronkan dengan Kementerian Keuangan RI.
          </div>
        </Card>
      </div>

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
