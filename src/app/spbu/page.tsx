"use client";

import { useState, useEffect } from "react";
import { Activity, Droplet, XCircle, Car, AlertTriangle, Loader2 } from "lucide-react";
import AreaChartSimple from "@/components/charts/AreaChartSimple";
import DonutChartSimple from "@/components/charts/DonutChartSimple";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";

export default function SpbuDashboardPage() {
  const [stats, setStats] = useState<any[]>([
    { label: "Total Transactions", value: "0", trend: "0%", trendDirection: "up" as const, trendSubtext: "dari kemarin", icon: <Activity className="w-5 h-5" />, iconBgColor: "bg-blue-50", iconTextColor: "text-blue-500" },
    { label: "Fuel Distributed", value: "0 L", trendSubtext: "Hari ini", icon: <Droplet className="w-5 h-5" />, iconBgColor: "bg-red-50", iconTextColor: "text-red-500" },
    { label: "Rejected Transactions", value: "0", trend: "0", trendDirection: "down" as const, trendSubtext: "dari kemarin", icon: <XCircle className="w-5 h-5" />, iconBgColor: "bg-red-50", iconTextColor: "text-red-500" },
    { label: "High-Risk Vehicles", value: "0", trendSubtext: "Perlu review", icon: <Car className="w-5 h-5" />, iconBgColor: "bg-amber-50", iconTextColor: "text-amber-500" },
  ]);

  const [peakHours, setPeakHours] = useState<any[]>([
    { hour: "00:00", volume: 0 },
    { hour: "03:00", volume: 0 },
    { hour: "06:00", volume: 0 },
    { hour: "09:00", volume: 0 },
    { hour: "12:00", volume: 0 },
    { hour: "15:00", volume: 0 },
    { hour: "18:00", volume: 0 },
    { hour: "21:00", volume: 0 },
  ]);

  const [fuelTypes, setFuelTypes] = useState<any[]>([
    { name: "Subsidi", value: 0, color: "#e31837" },
    { name: "Komersial", value: 0, color: "#64748b" },
  ]);

  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);

  const [dashboardTitle, setDashboardTitle] = useState("Analytics & Fraud");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = window.localStorage.getItem("mysuf-token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/spbu/summary`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardTitle(`Analytics & Fraud - ${data.gas_station_name}`);
          
          const mappedStats = (data.stats || []).map((item: any) => {
            let icon = <Activity className="w-5 h-5" />;
            let iconBgColor = "bg-blue-50";
            let iconTextColor = "text-blue-500";
            
            if (item.label === "Fuel Distributed") {
              icon = <Droplet className="w-5 h-5" />;
              iconBgColor = "bg-red-50";
              iconTextColor = "text-red-500";
            } else if (item.label === "Rejected Transactions") {
              icon = <XCircle className="w-5 h-5" />;
              iconBgColor = "bg-red-50";
              iconTextColor = "text-red-500";
            } else if (item.label === "High-Risk Vehicles") {
              icon = <Car className="w-5 h-5" />;
              iconBgColor = "bg-amber-50";
              iconTextColor = "text-amber-500";
            }

            return {
              ...item,
              icon,
              iconBgColor,
              iconTextColor
            };
          });

          setStats(mappedStats);
          if (data.peakHours && data.peakHours.length > 0) setPeakHours(data.peakHours);
          if (data.fuelTypes && data.fuelTypes.length > 0) setFuelTypes(data.fuelTypes);
          if (data.fraudAlerts) setFraudAlerts(data.fraudAlerts);
        }
      } catch (err) {
        console.error("Gagal memuat ringkasan dashboard SPBU dari server", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const totalFuelVal = fuelTypes.reduce((acc, curr) => acc + curr.value, 0);
  const subPercent = totalFuelVal > 0 ? Math.round((fuelTypes[0].value / totalFuelVal) * 100) : 0;
  const comPercent = totalFuelVal > 0 ? Math.round((fuelTypes[1].value / totalFuelVal) * 100) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={dashboardTitle}
        subtitle={isLoading ? "Menghubungkan ke API Pertamina..." : "Data terverifikasi langsung dari Server SPBU"}
      />

      {isLoading && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-pertamina-red text-xs font-semibold rounded-lg animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Sinkronisasi data transaksi SPBU real-time...</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            trend={item.trend}
            trendDirection={item.trendDirection}
            trendSubtext={item.trendSubtext}
            icon={item.icon}
            iconBgColor={item.iconBgColor}
            iconTextColor={item.iconTextColor}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6 shadow-sm border border-slate-200/60 relative">
          <h3 className="text-base font-bold text-slate-900 mb-6">Konsumsi BBM per Jam</h3>
          <div className="h-75">
            <AreaChartSimple data={peakHours} xKey="hour" yKey="volume" />
          </div>
          <div className="flex justify-center mt-4">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-pertamina-red">
              <span className="w-2 h-2 rounded-full bg-pertamina-red border border-pertamina-red" />
              Liter BBM
            </span>
          </div>
        </Card>
        
        <Card className="p-6 shadow-sm border border-slate-200/60 flex flex-col relative">
          <h3 className="text-base font-bold text-slate-900 mb-2">Subsidi vs Komersial</h3>
          <div className="flex-1 min-h-50 relative mt-4 mb-8">
            <DonutChartSimple data={fuelTypes} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-pertamina-red text-sm font-bold absolute top-4 left-4">Subsidi {subPercent}%</span>
              <span className="text-slate-500 text-sm font-bold absolute bottom-4 right-4">Komersial {comPercent}%</span>
            </div>
          </div>
          <div className="space-y-3 mt-auto">
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-3 h-3 rounded bg-pertamina-red" />
                Subsidi
              </span>
              <span className="text-sm font-bold text-slate-900">{fuelTypes[0].value.toLocaleString("id-ID")} L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-3 h-3 rounded bg-slate-500" />
                Komersial
              </span>
              <span className="text-sm font-bold text-slate-900">{fuelTypes[1].value.toLocaleString("id-ID")} L</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-sm border border-slate-200/60 relative">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-white">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">Real-time Fraud Alerts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">TIME</th>
                <th className="px-6 py-4">VEHICLE</th>
                <th className="px-6 py-4">ACCOUNT</th>
                <th className="px-6 py-4">REASON</th>
                <th className="px-6 py-4 text-right">RISK LEVEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {fraudAlerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                    Tidak ada fraud alert terdeteksi untuk stasiun SPBU ini.
                  </td>
                </tr>
              ) : (
                fraudAlerts.map((alert, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-sm text-slate-600">{alert.time}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{alert.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{alert.account}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{alert.reason}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                        alert.risk === "HIGH RISK" || alert.risk === "CRITICAL"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {alert.risk}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
