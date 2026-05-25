"use client";

import { useState } from "react";
import { BarChart3, Clock, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import AreaChartSimple from "@/components/charts/AreaChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const peakHoursData = [
  { hour: "06:00", volume: 450, queueTime: 8 },
  { hour: "08:00", volume: 850, queueTime: 18 },
  { hour: "10:00", volume: 620, queueTime: 12 },
  { hour: "12:00", volume: 980, queueTime: 22 },
  { hour: "14:00", volume: 550, queueTime: 10 },
  { hour: "16:00", volume: 720, queueTime: 15 },
  { hour: "18:00", volume: 1100, queueTime: 25 },
  { hour: "20:00", volume: 890, queueTime: 19 },
  { hour: "22:00", volume: 400, queueTime: 7 }
];

export default function SpbuPeakHourPage() {
  const [data, setData] = useState(peakHoursData);
  const [selectedHour, setSelectedHour] = useState<any>(peakHoursData[5]);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  const handleApplyOptimization = () => {
    setOptimizationApplied(true);
    setTimeout(() => {
      setOptimizationApplied(false);
      alert("AI Shift Optimization berhasil diterapkan ke jadwal kerja staff!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Peak Hour Analytics"
        subtitle="Analisis waktu tersibuk, tren kepadatan antrean, dan alokasi pompa BBM secara pintar."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard 
          label="Jam Paling Padat" 
          value="18:00 - 19:30" 
          trendSubtext="Volume mencapai 1,100 L/jam" 
          tone="warning" 
        />
        <StatCard 
          label="Rata-rata Waktu Tunggu" 
          value="15.2 Menit" 
          trendSubtext="Selama jam puncak sibuk" 
          tone="primary" 
        />
        <StatCard 
          label="Rekomendasi Penjadwalan" 
          value="+2 Kasir Cadangan" 
          trendSubtext="Diperlukan pada jam 17:00" 
          tone="primary" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6 shadow-sm border border-slate-200/60">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Kurva Distribusi & Waktu Tunggu</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pola volume transaksi (L) dan estimasi antrean per jam.</p>
            </div>
            
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-pertamina-red bg-red-50 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-pertamina-red" /> Volume BBM (L)
              </span>
            </div>
          </div>
          
          <div className="h-70">
            <AreaChartSimple data={data} xKey="hour" yKey="volume" />
          </div>

          <div className="grid grid-cols-9 gap-1 mt-6 text-center border-t border-slate-100 pt-4">
            {data.map((item, index) => (
              <button 
                key={index}
                onClick={() => setSelectedHour(item)}
                className={`p-2 rounded-lg transition-all ${
                  selectedHour.hour === item.hour 
                    ? "bg-red-50 text-pertamina-red border border-red-200 font-bold scale-105" 
                    : "hover:bg-slate-50 text-slate-600 border border-transparent"
                }`}
              >
                <p className="text-xs">{item.hour}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.volume}L</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {/* Detail Rincian Jam Terpilih */}
          <Card className="p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="w-5 h-5 text-pertamina-red" />
                <h3 className="font-bold text-slate-900 text-sm">Rincian Jam {selectedHour.hour}</h3>
              </div>
              
              <div className="py-4 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Volume BBM Tersalurkan</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{selectedHour.volume} Liter</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimasi Waktu Tunggu Antrean</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-xl font-extrabold ${selectedHour.queueTime > 15 ? "text-amber-600" : "text-green-600"}`}>
                      {selectedHour.queueTime} Menit
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedHour.queueTime > 15 
                        ? "bg-amber-50 text-amber-600" 
                        : "bg-green-50 text-green-600"
                    }`}>
                      {selectedHour.queueTime > 15 ? "Padat" : "Lancar"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status Pompa Nozzle</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedHour.volume > 800 ? "Seluruh Pompa (4/4) Terisi Penuh" : "Pompa Parsial (2/4) Aktif"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedHour.queueTime > 15 
                    ? "Waktu tunggu antrean melebihi batas target layanan 10 menit. Kasir cadangan disarankan bersiap." 
                    : "Waktu tunggu berada dalam batas wajar. Operasional berjalan optimal."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
