"use client";

import LineChartSimple from "@/components/charts/LineChartSimple";
import { Card } from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { fleetDashboard } from "@/lib/mockData";

export default function FleetDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard Armada"
        subtitle="Ringkasan armada dibuat singkat: hanya summary penting dan grafik tren konsumsi BBM."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {fleetDashboard.stats.map((item) => (
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
          <LineChartSimple data={fleetDashboard.fuelConsumptionTrend} xKey="month" yKey="liters" />
        </div>
      </Card>
    </div>
  );
}
