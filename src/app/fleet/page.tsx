"use client";

import { useEffect, useState } from "react";
import LineChartSimple from "@/components/charts/LineChartSimple";
import { Card } from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { API_BASE_URL } from "@/lib/api";
import { Loader2, RefreshCw } from "lucide-react";

export default function FleetDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/summary`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data ringkasan armada.");
      }

      const summaryData = await res.json();
      setData(summaryData);
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

  const stats = data ? [
    { label: "Total Armada", value: `${data.totalVehicles} Unit`, trend: "Terdaftar" },
    { label: "Konsumsi Bulanan", value: `${data.monthlyConsumption.toLocaleString("id-ID")} L`, trend: "Bulan ini" },
    { label: "Driver Aktif", value: `${data.activeDrivers} Pengemudi`, trend: "Tingkat BUYER" },
    { label: "Kuota Tersisa", value: `${data.remainingQuotaPercent}%`, trend: "BBM Bersubsidi" },
  ] : [
    { label: "Total Armada", value: "-", trend: "-" },
    { label: "Konsumsi Bulanan", value: "-", trend: "-" },
    { label: "Driver Aktif", value: "-", trend: "-" },
    { label: "Kuota Tersisa", value: "-", trend: "-" },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Dashboard Armada"
          subtitle="Ringkasan armada dibuat singkat: hanya summary penting dan grafik tren konsumsi BBM."
        />
        <button
          onClick={fetchSummary}
          disabled={isLoading}
          className="self-start sm:self-center px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
          {error}
        </Card>
      )}

      {isLoading && !data ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                trend={item.trend}
                tone={item.label.includes("Kuota") ? "warning" : "primary"}
              />
            ))}
          </div>

          <Card className="overflow-hidden border border-slate-200/60 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-md">Fuel Consumption Trend</h3>
              <p className="mt-1 text-xs text-slate-500">Grafik tren konsumsi BBM armada dari waktu ke waktu.</p>
            </div>
            <div className="h-80 w-full overflow-hidden">
              {data?.fuelConsumptionTrend && (
                <LineChartSimple data={data.fuelConsumptionTrend} xKey="month" yKey="liters" />
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
