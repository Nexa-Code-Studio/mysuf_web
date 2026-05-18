"use client";

import {
  Activity,
  CalendarDays,
  MapPinned,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const metrics = [
  {
    label: "Total Subsidy Distributed",
    value: "Rp 4.2 Triliun",
    meta: "+5% MoM",
    icon: Activity,
    iconClass: "bg-rose-100 text-rose-600",
  },
  {
    label: "Active Subsidy Recipients",
    value: "18.4 Juta KK",
    meta: "Penerima aktif nasional",
    icon: Users,
    iconClass: "bg-sky-100 text-sky-600",
  },
  {
    label: "National Fraud Risk Level",
    value: "MEDIUM",
    meta: "1.2% dari total transaksi",
    icon: ShieldAlert,
    iconClass: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    label: "Pending Sync SPBU",
    value: "23 Cabang",
    meta: "Perlu sinkronisasi",
    icon: MapPinned,
    iconClass: "bg-slate-100 text-slate-600",
  },
];

const regionData = [
  { name: "Jawa Barat", value: 78 },
  { name: "DKI Jakarta", value: 64 },
  { name: "Jawa Timur", value: 82 },
  { name: "Sumatera Utara", value: 51 },
];

const consumptionBreakdown = [
  { name: "Pertalite", value: 62, color: "#E31837" },
  { name: "Bio Solar", value: 38, color: "#CBD5F5" },
];

const fraudHotspots = [
  { city: "Jakarta", cases: 450 },
  { city: "Surabaya", cases: 320 },
  { city: "Medan", cases: 150 },
];

function MetricCard({
  label,
  value,
  meta,
  icon: Icon,
  iconClass,
  badge,
}: {
  label: string;
  value: string;
  meta: string;
  icon: typeof Activity;
  iconClass: string;
  badge?: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <div className="mt-2 flex items-center gap-2">
            {badge ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
              >
                {value}
              </span>
            ) : (
              <p className="text-2xl font-semibold text-slate-800">{value}</p>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-500">{meta}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </Card>
  );
}

export default function NationalAnalyticsPage() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            National Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Overview performa subsidi nasional
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4" aria-hidden />
          <span>Updated: {today}</span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Subsidy Heatmap & Distribution by Region</CardTitle>
            <CardDescription>Ringkasan distribusi per wilayah utama</CardDescription>
          </CardHeader>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {regionData.map((region) => (
                  <div
                    key={region.name}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      {region.name}
                    </p>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-pertamina-red"
                        style={{ width: `${region.value}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {region.value}% konsumsi nasional
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {regionData.map((region) => (
                <div key={region.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {region.name}
                    </span>
                    <span className="text-slate-500">{region.value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-pertamina-red"
                      style={{ width: `${region.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Fuel Consumption Breakdown</CardTitle>
              <CardDescription>Perbandingan jenis BBM nasional</CardDescription>
            </CardHeader>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consumptionBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {consumptionBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "#E2E8F0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {consumptionBreakdown.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Regional Fraud Hotspots</CardTitle>
              <CardDescription>Kasus fraud tertinggi</CardDescription>
            </CardHeader>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fraudHotspots} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="city" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "#E2E8F0",
                    }}
                  />
                  <Bar dataKey="cases" fill="#E31837" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
