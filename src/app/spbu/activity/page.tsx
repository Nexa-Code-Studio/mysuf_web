"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, BadgeDollarSign, Cpu, Clock, RefreshCw, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";

type ActivityItem = {
  id: string;
  category: "Sistem" | "Penjualan" | "Keamanan";
  detail: string;
  created_at: string;
};

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "Keamanan":
      return {
        icon: <ShieldAlert className="w-4 h-4" />,
        color: "text-red-500 bg-red-50 border-red-100"
      };
    case "Penjualan":
      return {
        icon: <BadgeDollarSign className="w-4 h-4" />,
        color: "text-green-500 bg-green-50 border-green-100"
      };
    case "Sistem":
    default:
      return {
        icon: <Cpu className="w-4 h-4" />,
        color: "text-blue-500 bg-blue-50 border-blue-100"
      };
  }
};

const formatTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "--:--";
  }
};

export default function SpbuActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const queryParams = new URLSearchParams();
      if (selectedCategory !== "Semua") {
        queryParams.append("category", selectedCategory);
      }
      
      const res = await fetch(`${API_BASE_URL}/spbu/activity?page=1&size=100&${queryParams.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil riwayat aktivitas.");
      }

      const data = await res.json();
      setActivities(data.items || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedCategory]);

  const filteredActivities = activities.filter(activity => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return activity.detail.toLowerCase().includes(query) || 
           activity.category.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Riwayat Aktivitas SPBU"
          subtitle="Log kronologis aktivitas penjualan, kejadian keamanan, dan diagnostik sistem."
        />
        <Button
          variant="ghost"
          onClick={fetchActivities}
          className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

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
          </div>
        </div>

        {/* Timeline Log */}
        <div className="p-6">
          {isLoading && activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[#e31837]" />
              <p className="text-sm font-medium">Memuat riwayat aktivitas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600 bg-red-50/30 rounded-xl border border-red-200/50">
              <p className="font-semibold">{error}</p>
              <Button onClick={fetchActivities} size="sm" className="mt-4 bg-[#e31837] text-white hover:bg-red-700">
                Coba Lagi
              </Button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Tidak ada riwayat aktivitas yang cocok dengan kriteria.
            </div>
          ) : (
            <div className="relative border-l border-slate-200 ml-4 space-y-8 py-2">
              {filteredActivities.map((act) => {
                const { icon, color } = getCategoryStyle(act.category);
                return (
                  <div key={act.id} className="relative pl-8 group">
                    {/* Timeline dot */}
                    <div className={`absolute -left-4 top-1.5 w-8 h-8 rounded-full border flex items-center justify-center shadow-xs transition group-hover:scale-110 ${color}`}>
                      {icon}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Clock className="w-3.5 h-3.5" /> {formatTime(act.created_at)}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
