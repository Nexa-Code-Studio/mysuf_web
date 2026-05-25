"use client";

import { useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const initialAlerts = [
  { id: "FR-2201", vehicle: "B 9123 KZ", issue: "Pengisian berulang (3x dalam 1 jam)", severity: "High", time: "10:45", status: "Pending" },
  { id: "FR-2202", vehicle: "D 4401 NH", issue: "Ketidakcocokan kuota NIK vs KK", severity: "Medium", time: "11:20", status: "Pending" },
  { id: "FR-2203", vehicle: "BG 1184 TR", issue: "ID petugas kasir tidak valid", severity: "High", time: "11:35", status: "Pending" },
  { id: "FR-2204", vehicle: "B 3456 GHI", issue: "Upaya melebihi kuota harian", severity: "Medium", time: "12:10", status: "Pending" }
];

export default function SpbuFraudAlertPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "All" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "All" || alert.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fraud Alert Control Center"
        subtitle="Pantau notifikasi kecurangan dari AI Engine secara langsung dan ambil tindakan tegas."
      />

      <Card className="overflow-hidden shadow-sm border border-slate-200/60">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-pertamina-red" /> Log Aliran Fraud Real-time
          </h3>
        </div>

        <div className="p-4 border-b border-slate-200 bg-white flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari ID, plat, atau indikasi..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm"
            />
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#e31837] text-slate-700 w-full sm:w-auto"
            >
              <option value="All">Semua Keparahan</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#e31837] text-slate-700 w-full sm:w-auto"
            >
              <option value="All">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">ID Kasus</th>
                <th className="px-6 py-4">Plat Kendaraan</th>
                <th className="px-6 py-4">Indikasi Kecurangan (Anomali)</th>
                <th className="px-6 py-4">Keparahan</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    Tidak ada fraud alert yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{alert.time}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500 font-mono">{alert.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{alert.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{alert.issue}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        alert.severity === "High"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        alert.status === "Pending"
                          ? "bg-slate-100 text-slate-600"
                          : alert.status === "Flagged"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {alert.status}
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
