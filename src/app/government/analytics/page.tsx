"use client";

import { useState } from "react";
import LineChartSimple from "@/components/charts/LineChartSimple";
import BarChartSimple from "@/components/charts/BarChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Award, ShieldAlert, Compass, Sparkles, Filter, Calendar } from "lucide-react";

export default function GovernmentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"30" | "180" | "365">("180");

  const nationalTrend = [
    { month: "Jan", value: 78 },
    { month: "Feb", value: 82 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 86 },
    { month: "Mei", value: 89 },
    { month: "Jun", value: 84 },
  ];

  const fuelShare = [
    { name: "Pertalite", volume: 5.8 },
    { name: "Biosolar", volume: 3.2 },
    { name: "Pertalite Fleet", volume: 1.4 },
    { name: "Solar Industri", volume: 0.9 },
  ];

  const regionalRisks = [
    { name: "DKI Jakarta & Banten", risk: 88, status: "Tinggi", color: "bg-[#e31837]" },
    { name: "Jawa Barat", risk: 92, status: "Ekstrim", color: "bg-[#e31837]" },
    { name: "Sumatera Utara", risk: 74, status: "Sedang", color: "bg-amber-500" },
    { name: "Jawa Timur", risk: 82, status: "Tinggi", color: "bg-[#e31837]" },
    { name: "Kalimantan Timur", risk: 55, status: "Stabil", color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Analitik Command Center"
          subtitle="Pusat data kecerdasan distribusi energi, prakiraan AI, dan kepatuhan penyaluran subsidi nasional."
        />

        {/* Time Filter Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start sm:self-center">
          {(["30", "180", "365"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {range === "30" ? "30 Hari" : range === "180" ? "6 Bulan" : "1 Tahun"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total Subsidi Disalurkan</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950">Rp 1,24 T</span>
            <span className="text-[10px] font-bold text-green-600 font-mono">+2.4%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Sesuai pagu APBN 2026.</p>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Kebocoran Dicegah (AI)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">Rp 148,5 M</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Hasil block list & OCR nozzle.</p>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tingkat Penyerapan Kuota</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950">82.4%</span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">17.6% Sisa</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Aman hingga akhir kuartal.</p>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ketepatan Sasaran (B2C)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-950">96.8%</span>
            <span className="text-[10px] font-bold text-green-600 font-mono">Optimal</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Peningkatan 12% via AI scoring.</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Trend Indeks Pemanfaatan Subsidi Nasional"
          description="Grafik peningkatan penyaluran subsidi teratur per bulan (Miliar Liter)."
        >
          <div className="h-64 pt-4">
            <LineChartSimple
              data={nationalTrend}
              xKey="month"
              yKey="value"
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Pangsa Penyerapan Berdasarkan Jenis BBM"
          description="Porsi volume BBM bersubsidi yang terserap nasional (Juta KL)."
        >
          <div className="h-64 pt-4">
            <BarChartSimple
              data={fuelShare}
              xKey="name"
              yKey="volume"
            />
          </div>
        </ChartCard>
      </div>

      {/* Risk Grid & AI Forecast */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Risk Grid */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" /> Indeks Risiko Penyelewengan Wilayah
            </h3>
            <p className="text-xs text-slate-500 mt-1">Matrikasi sebaran wilayah dengan probabilitas fraud tertinggi harian.</p>
          </div>

          <div className="space-y-4">
            {regionalRisks.map((region) => (
              <div key={region.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800 font-semibold">{region.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    region.status === "Ekstrim" || region.status === "Tinggi"
                      ? "bg-red-50 text-[#e31837]"
                      : region.status === "Sedang"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-green-50 text-green-700"
                  }`}>
                    {region.risk}% Severity ({region.status})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${region.color}`}
                    style={{ width: `${region.risk}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Forecast */}
        <Card className="p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" /> AI Forecast & Kebijakan Prediktif
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5 leading-relaxed">
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" /> Siklus Musim Panen (Juli - Agustus)
                </p>
                <p className="text-slate-600">
                  AI Model memprediksi peningkatan konsumsi Biosolar subsidi sebesar <span className="font-bold text-[#e31837]">+4.2%</span> di wilayah Jawa Tengah dan Jawa Timur akibat mulainya musim panen komersial pertanian.
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs space-y-1.5 leading-relaxed text-amber-900">
                <p className="font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" /> Rekomendasi Alokasi Kuota
                </p>
                <p className="text-slate-700">
                  Disarankan memindahkan cadangan kuota nasional penyangga sebesar <span className="font-bold text-slate-900">120K KL</span> ke depo-depo di jalur pantai utara (Pantura) sebelum minggu ke-3 untuk mencegah antrean panjang SPBU.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-bold italic text-center pt-4 border-t border-slate-100">
            Prediksi dikomparasi secara real-time dengan data komoditi global Reuters.
          </div>
        </Card>
      </div>
    </div>
  );
}
