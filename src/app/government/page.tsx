"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw, ShieldAlert, TrendingUp } from "lucide-react";
import LineChartSimple from "@/components/charts/LineChartSimple";
import { Card } from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { API_BASE_URL } from "@/lib/api";

export default function GovernmentDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>({
    totalTransactions: 0,
    highRiskCount: 0,
    criticalCount: 0,
    totalLiters: 0,
    averageLiters: 0,
    fuelTrendData: [],
    stationsWithHighestFraudCount: []
  });

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir atau tidak valid. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/government/summary`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Akses ditolak. Endpoint ini khusus untuk akun Pemerintah/Regulator.");
        }
        throw new Error("Gagal mengambil data dari server.");
      }

      const data = await res.json();
      setSummary(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const fraudStations = (summary.stationsWithHighestFraudCount || []).slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Warning or Status banner */}
      <div className="flex items-center justify-between gap-3 p-4 bg-teal-50 border border-teal-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-600 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-slate-800">Regulatory Command Center</h4>
            <p className="text-[10px] text-slate-500">Sinkronisasi data pengawasan kuota subsidi nasional real-time.</p>
          </div>
        </div>
        <button
          onClick={fetchSummary}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 bg-white border border-teal-200/80 rounded-xl hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Sinkronisasi..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <Card className="p-8 border border-red-200 bg-red-50/50 flex flex-col items-center justify-center text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-red-500" />
          <h3 className="text-base font-bold text-red-900">Koneksi Gagal</h3>
          <p className="text-sm text-red-700 max-w-md">{error}</p>
          <button
            onClick={fetchSummary}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </Card>
      ) : (
        <>
          <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4 relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/30">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 animate-fade-in">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-slate-900">Government Dashboard</h3>
              <p className="text-xs text-slate-500 mt-1">Ringkasan regulator yang fokus ke transaksi, risiko, dan tren konsumsi BBM.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Transaksi" value={String(summary.totalTransactions)} trend="LIVE" tone="primary" />
              <StatCard label="Transaksi Risiko Tinggi" value={String(summary.highRiskCount + summary.criticalCount)} trend="BLOCK" tone="warning" />
              <StatCard label="Total Liter Terdeteksi" value={`${summary.totalLiters.toLocaleString("id-ID")} L`} trend="TREND" tone="primary" />
              <StatCard label="Rata-Rata Liter/Transaksi" value={`${summary.averageLiters.toLocaleString("id-ID")} L`} trend="INSIGHT" tone="primary" />
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4 overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  Fuel Consumption Trend
                </h3>
                <p className="text-xs text-slate-500 mt-1">Grafik tren konsumsi BBM dari transaksi yang terdeteksi oleh engine.</p>
              </div>
              <div className="h-80 w-full overflow-hidden">
                {summary.fuelTrendData && summary.fuelTrendData.length > 0 ? (
                  <LineChartSimple data={summary.fuelTrendData} xKey="period" yKey="liters" />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Tidak ada data tren konsumsi terdeteksi hari ini.
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 text-md">Fraud Stations</h3>
                <p className="text-xs text-slate-500 mt-1">Stasiun dengan sinyal fraud tertinggi.</p>
              </div>
              <div className="space-y-3 min-h-[320px]">
                {fraudStations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-slate-400">
                    Sistem aman. Belum ada sinyal fraud terdeteksi pada stasiun SPBU.
                  </div>
                ) : (
                  fraudStations.map((station: any) => (
                    <div key={station.label} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 p-4 hover:shadow-sm transition-all duration-300">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{station.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{station.transactionCount} transaksi, {station.fraudCount} fraud.</p>
                      </div>
                      <p className="text-lg font-bold text-slate-950 whitespace-nowrap">{station.score}%</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
