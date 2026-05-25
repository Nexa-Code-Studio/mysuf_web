"use client";

import { Activity, Droplet, XCircle, Car, AlertTriangle } from "lucide-react";
import AreaChartSimple from "@/components/charts/AreaChartSimple";
import DonutChartSimple from "@/components/charts/DonutChartSimple";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";

export default function SpbuDashboardPage() {
  const stats = [
    { label: "Total Transactions", value: "1,247", trend: "+12%", trendDirection: "up" as const, trendSubtext: "dari kemarin", icon: <Activity className="w-5 h-5" />, iconBgColor: "bg-blue-50", iconTextColor: "text-blue-500" },
    { label: "Fuel Distributed", value: "10,024 L", trendSubtext: "Hari ini", icon: <Droplet className="w-5 h-5" />, iconBgColor: "bg-red-50", iconTextColor: "text-red-500" },
    { label: "Rejected Transactions", value: "47", trend: "+8", trendDirection: "down" as const, trendSubtext: "dari kemarin", icon: <XCircle className="w-5 h-5" />, iconBgColor: "bg-red-50", iconTextColor: "text-red-500" },
    { label: "High-Risk Vehicles", value: "12", trendSubtext: "Perlu review", icon: <Car className="w-5 h-5" />, iconBgColor: "bg-amber-50", iconTextColor: "text-amber-500" },
  ];

  const peakHours = [
    { hour: "00:00", volume: 150 },
    { hour: "03:00", volume: 100 },
    { hour: "06:00", volume: 450 },
    { hour: "09:00", volume: 650 },
    { hour: "12:00", volume: 900 },
    { hour: "15:00", volume: 750 },
    { hour: "18:00", volume: 1100 },
    { hour: "21:00", volume: 550 },
  ];

  const fuelTypes = [
    { name: "Subsidi", value: 6800, color: "#e31837" },
    { name: "Komersial", value: 3200, color: "#64748b" },
  ];

  const fraudAlerts = [
    { time: "10:45", vehicle: "B 1234 XYZ", account: "NIK 3174...", reason: "Rapid Purchase (3x dalam 1 jam)", risk: "HIGH RISK" },
    { time: "11:20", vehicle: "B 5678 ABC", account: "NIK 3201...", reason: "Multi-location anomaly", risk: "MEDIUM" },
    { time: "11:35", vehicle: "D 9012 DEF", account: "NIK 3275...", reason: "Device switch detected", risk: "HIGH RISK" },
    { time: "12:10", vehicle: "B 3456 GHI", account: "NIK 3174...", reason: "Quota exceeded attempt", risk: "MEDIUM" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics & Fraud"
        subtitle=""
      />

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
        <Card className="p-6 shadow-sm border border-slate-200/60">
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
        
        <Card className="p-6 shadow-sm border border-slate-200/60 flex flex-col">
          <h3 className="text-base font-bold text-slate-900 mb-2">Subsidi vs Komersial</h3>
          <div className="flex-1 min-h-50 relative mt-4 mb-8">
            <DonutChartSimple data={fuelTypes} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-pertamina-red text-sm font-medium absolute top-4 left-4">Subsidi 68%</span>
              <span className="text-slate-500 text-sm font-medium absolute bottom-4 right-4">Komersial 32%</span>
            </div>
          </div>
          <div className="space-y-3 mt-auto">
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-3 h-3 rounded bg-pertamina-red" />
                Subsidi
              </span>
              <span className="text-sm font-bold text-slate-900">6,800 L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-3 h-3 rounded bg-slate-500" />
                Komersial
              </span>
              <span className="text-sm font-bold text-slate-900">3,200 L</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-sm border border-slate-200/60">
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
              {fraudAlerts.map((alert, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-sm text-slate-600">{alert.time}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{alert.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{alert.account}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{alert.reason}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                      alert.risk === "HIGH RISK" 
                        ? "bg-red-50 text-red-600" 
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      {alert.risk}
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
