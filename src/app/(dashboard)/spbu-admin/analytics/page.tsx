"use client";

import {
  AlertTriangle,
  BarChart3,
  Car,
  Droplet,
  XCircle,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const stats = [
  {
    label: "Total Transactions",
    value: "1,247",
    delta: "+12% dari kemarin",
    deltaClass: "text-emerald-600",
    icon: BarChart3,
    iconClass: "bg-sky-100 text-sky-600",
  },
  {
    label: "Fuel Distributed",
    value: "10,024 L",
    delta: "Hari ini",
    deltaClass: "text-slate-500",
    icon: Droplet,
    iconClass: "bg-rose-100 text-rose-600",
  },
  {
    label: "Rejected Transactions",
    value: "47",
    delta: "+8 dari kemarin",
    deltaClass: "text-red-600",
    icon: XCircle,
    iconClass: "bg-red-100 text-red-600",
  },
  {
    label: "High-Risk Vehicles",
    value: "12",
    delta: "Perlu review",
    deltaClass: "text-amber-600",
    icon: Car,
    iconClass: "bg-amber-100 text-amber-600",
  },
];

const hourlyData = [
  { time: "00:00", liters: 120 },
  { time: "03:00", liters: 260 },
  { time: "06:00", liters: 420 },
  { time: "09:00", liters: 680 },
  { time: "12:00", liters: 980 },
  { time: "15:00", liters: 820 },
  { time: "18:00", liters: 690 },
  { time: "21:00", liters: 540 },
];

const subsidyData = [
  { name: "Subsidi", value: 6800, color: "#E31837" },
  { name: "Komersial", value: 3200, color: "#CBD5F5" },
];

const fraudAlerts = [
  {
    time: "10:45",
    vehicle: "B 1234 XYZ",
    account: "NIK 3174...",
    reason: "Rapid Purchase (3x dalam 1 jam)",
    risk: "HIGH RISK",
    riskClass: "bg-red-100 text-red-600",
  },
  {
    time: "11:20",
    vehicle: "B 5678 ABC",
    account: "NIK 3201...",
    reason: "Multi-location anomaly",
    risk: "MEDIUM",
    riskClass: "bg-amber-100 text-amber-700",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">
          Analytics & Fraud
        </h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">
                    {stat.value}
                  </p>
                  <p className={`mt-1 text-sm ${stat.deltaClass}`}>
                    {stat.delta}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Konsumsi BBM per Jam</CardTitle>
            <CardDescription>Ringkasan distribusi harian SPBU</CardDescription>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" domain={[0, 1200]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#E2E8F0",
                  }}
                  labelStyle={{ color: "#475569" }}
                />
                <Line
                  type="monotone"
                  dataKey="liters"
                  stroke="#E31837"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#E31837" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Subsidi vs Komersial</CardTitle>
            <CardDescription>Total distribusi hari ini</CardDescription>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subsidyData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {subsidyData.map((entry) => (
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
          <div className="mt-4 space-y-3">
            {subsidyData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {entry.value.toLocaleString("id-ID")} L
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <CardTitle>Real-time Fraud Alerts</CardTitle>
              <CardDescription>Monitoring aktivitas berisiko tinggi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 pb-3">Time</th>
                <th className="px-4 pb-3">Vehicle</th>
                <th className="px-4 pb-3">Account</th>
                <th className="px-4 pb-3">Reason</th>
                <th className="px-4 pb-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fraudAlerts.map((alert) => (
                <tr key={`${alert.time}-${alert.vehicle}`}>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {alert.time}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{alert.vehicle}</td>
                  <td className="px-4 py-3 text-slate-600">{alert.account}</td>
                  <td className="px-4 py-3 text-slate-600">{alert.reason}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${alert.riskClass}`}
                    >
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
