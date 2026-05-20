"use client";

import { useState } from "react";
import { History, Search, Activity, ShieldAlert, BadgeDollarSign, Cpu, Clock, RefreshCw } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const initialActivities = [
  { time: "12:10", category: "Keamanan", detail: "Fraud alert ditandai untuk Plat D 9012 DEF.", icon: <ShieldAlert className="w-4 h-4" />, color: "text-red-500 bg-red-50 border-red-100" },
  { time: "11:55", category: "Sistem", detail: "Pergantian shift berhasil diverifikasi otomatis oleh AI Engine.", icon: <Cpu className="w-4 h-4" />, color: "text-blue-500 bg-blue-50 border-blue-100" },
  { time: "11:30", category: "Penjualan", detail: "Audit stok tangki solar bawah tanah selesai. Kapasitas: 85%.", icon: <BadgeDollarSign className="w-4 h-4" />, color: "text-green-500 bg-green-50 border-green-100" },
  { time: "10:45", category: "Keamanan", detail: "Tindakan cepat diambil terhadap Plat B 9123 KZ. Kasus diselesaikan.", icon: <ShieldAlert className="w-4 h-4" />, color: "text-red-500 bg-red-50 border-red-100" },
  { time: "09:15", category: "Penjualan", detail: "Penjualan Solar Subsidi mencapai batas kuota harian wilayah (Nozzle 03).", icon: <BadgeDollarSign className="w-4 h-4" />, color: "text-green-500 bg-green-50 border-green-100" },
  { time: "08:00", category: "Sistem", detail: "Sistem MySuF sinkronisasi data dengan server BPH Migas berhasil.", icon: <Cpu className="w-4 h-4" />, color: "text-blue-500 bg-blue-50 border-blue-100" }
];

export default function SpbuActivityPage() {
  const [activities, setActivities] = useState(initialActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const handleRefresh = () => {
    setActivities(initialActivities);
    alert("Log Riwayat berhasil diperbarui!");
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.detail.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          activity.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Riwayat Aktivitas SPBU"
        subtitle="Log kronologis aktivitas penjualan, kejadian keamanan, dan diagnostik sistem."
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci aktivitas..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm bg-white"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["Semua", "Penjualan", "Keamanan", "Sistem"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-[#e31837] text-white" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
            <Button variant="outline" className="p-2.5 h-8 w-8 ml-auto md:ml-0" title="Refresh Log" onClick={handleRefresh}>
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="p-6">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Tidak ada riwayat aktivitas yang cocok dengan kriteria.
            </div>
          ) : (
            <div className="relative border-l border-slate-200 ml-4 space-y-8 py-2">
              {filteredActivities.map((act, i) => (
                <div key={i} className="relative pl-8 group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-4 top-1.5 w-8 h-8 rounded-full border flex items-center justify-center shadow-xs transition group-hover:scale-110 ${act.color}`}>
                    {act.icon}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {act.time}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {act.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed max-w-2xl">
                      {act.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
