"use client";

import { useState } from "react";
import { User, ShieldAlert, Award, Compass, Search, Eye, AlertCircle, X, ChevronRight, CheckCircle } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface DriverLog {
  id: string;
  name: string;
  plate: string;
  compliance: number; // percent
  tripsToday: number;
  violations: number;
  status: "Active" | "Rest" | "Off";
  timeline: { time: string; event: string; type: "info" | "success" | "warning" }[];
}

export default function FleetDriverActivityPage() {
  const [drivers, setDrivers] = useState<DriverLog[]>([
    {
      id: "1",
      name: "Rizal Wibowo",
      plate: "B 8821 TQ",
      compliance: 98,
      tripsToday: 3,
      violations: 0,
      status: "Active",
      timeline: [
        { time: "06:00 WIB", event: "Mulai Shift Kerja Pagi", type: "info" },
        { time: "07:30 WIB", event: "Pengisian Solar Subsidi 80L di SPBU 31.124.01", type: "success" },
        { time: "11:45 WIB", event: "Pengantaran Cargo Batch 1 Selesai (Karawang)", type: "success" },
        { time: "13:10 WIB", event: "Kembali ke Depo Pulogadung", type: "info" },
      ],
    },
    {
      id: "2",
      name: "Agus Pratama",
      plate: "B 4512 PK",
      compliance: 92,
      tripsToday: 2,
      violations: 0,
      status: "Rest",
      timeline: [
        { time: "08:15 WIB", event: "Mulai Shift Kerja Pagi", type: "info" },
        { time: "09:40 WIB", event: "Pengisian Biosolar 40L di SPBU 31.109.05", type: "success" },
        { time: "12:00 WIB", event: "Waktu Istirahat Wajib Driver (Mulai)", type: "info" },
      ],
    },
    {
      id: "3",
      name: "Sinta Kartika",
      plate: "B 1145 WX",
      compliance: 75,
      tripsToday: 1,
      violations: 2,
      status: "Active",
      timeline: [
        { time: "07:00 WIB", event: "Mulai Shift Kerja Pagi", type: "info" },
        { time: "08:05 WIB", event: "Mismatch Kuota: Mengisi Solar Subsidi di atas batas harian (Ditolak)", type: "warning" },
        { time: "08:20 WIB", event: "Pencocokan Plat Nomor Manual oleh Petugas SPBU", type: "info" },
        { time: "10:15 WIB", event: "Pola Mengemudi Kasar: Pengereman mendadak terdeteksi AI GPS", type: "warning" },
      ],
    },
    {
      id: "4",
      name: "Rama Utama",
      plate: "B 9902 KAA",
      compliance: 96,
      tripsToday: 4,
      violations: 0,
      status: "Active",
      timeline: [
        { time: "05:45 WIB", event: "Mulai Shift Kerja Pagi", type: "info" },
        { time: "07:00 WIB", event: "Pengisian Solar Subsidi 120L di SPBU Cikampek", type: "success" },
        { time: "10:00 WIB", event: "Pengantaran Logistik Konstruksi Selesai", type: "success" },
        { time: "14:20 WIB", event: "Pengisian Solar Subsidi Ke-2 (Dalam batas aman)", type: "success" },
      ],
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDriver, setSelectedDriver] = useState<DriverLog | null>(null);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const handleFlagDriver = (id: string, name: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, violations: d.violations + 1, compliance: Math.max(50, d.compliance - 8) }
          : d
      )
    );
    setToast({ show: true, msg: `Peringatan kepatuhan berhasil dikirim ke pengemudi ${name}!` });
  };

  // Filter
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.plate.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate General Compliance
  const avgCompliance = Math.round(
    drivers.reduce((sum, d) => sum + d.compliance, 0) / drivers.length
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Aktivitas & Kepatuhan Driver"
        subtitle="Monitor riwayat perjalanan, ketepatan pengisian kuota BBM, dan catatan kepatuhan (compliance)."
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kepatuhan Rata-Rata</p>
            <p className="text-lg font-bold text-slate-900">{avgCompliance}% Score</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-[#e31837] border border-red-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Catatan Pelanggaran</p>
            <p className="text-lg font-bold text-slate-900">
              {drivers.reduce((sum, d) => sum + d.violations, 0)} Kasus
            </p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Trip Hari Ini</p>
            <p className="text-lg font-bold text-slate-900">
              {drivers.reduce((sum, d) => sum + d.tripsToday, 0)} Perjalanan
            </p>
          </div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Driver atau Unit Kendaraan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837] transition"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["All", "Active", "Rest", "Off"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                statusFilter === st
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {st === "All" ? "Semua Driver" : st === "Active" ? "Sedang Bertugas" : st === "Rest" ? "Istirahat" : "Off Duty"}
            </button>
          ))}
        </div>
      </Card>

      {/* Driver Grid Table */}
      <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Nama Pengemudi</th>
                <th className="px-6 py-4">Unit Kendaraan</th>
                <th className="px-6 py-4">Skor Kepatuhan</th>
                <th className="px-6 py-4">Trip Hari Ini</th>
                <th className="px-6 py-4">Jumlah Pelanggaran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                        {driver.name.substring(0,1)}
                      </div>
                      <span className="font-semibold text-slate-800">{driver.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold text-xs rounded border border-slate-200">
                      {driver.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        driver.compliance >= 90
                          ? "text-green-600"
                          : driver.compliance >= 80
                          ? "text-amber-600"
                          : "text-[#e31837]"
                      }`}>
                        {driver.compliance}%
                      </span>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            driver.compliance >= 90 ? "bg-green-500" : driver.compliance >= 80 ? "bg-amber-500" : "bg-[#e31837]"
                          }`}
                          style={{ width: `${driver.compliance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{driver.tripsToday} Trip</td>
                  <td className="px-6 py-4">
                    {driver.violations > 0 ? (
                      <span className="px-2 py-0.5 bg-red-50 text-[#e31837] border border-red-200 rounded font-bold text-xs">
                        {driver.violations} Pelanggaran
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">Clean</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      driver.status === "Active"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : driver.status === "Rest"
                        ? "bg-sky-50 text-sky-700 border border-sky-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {driver.status === "Active" ? "Aktif" : driver.status === "Rest" ? "Istirahat" : "Off Duty"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedDriver(driver)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Timeline
                      </button>
                      <button
                        onClick={() => handleFlagDriver(driver.id, driver.name)}
                        className="px-2.5 py-1 border border-red-200 hover:bg-red-50 text-[#e31837] rounded-lg text-xs font-bold transition"
                      >
                        Flag
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* TIMELINE DETAILS MODAL */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl relative animate-scale-up max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedDriver(null)}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#e31837]" /> Log Perjalanan & Kepatuhan
              </h3>
              <p className="text-xs text-slate-500 mt-1">Timeline aktivitas harian untuk driver {selectedDriver.name} ({selectedDriver.plate}).</p>
            </div>

            {/* Timeline Events list */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-2">
              {selectedDriver.timeline.map((item, index) => (
                <div key={index} className="flex gap-4 relative">
                  {/* Line element */}
                  {index !== selectedDriver.timeline.length - 1 && (
                    <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-100" />
                  )}

                  {/* Icon indicator */}
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    item.type === "success"
                      ? "bg-green-50 text-green-700 border-2 border-green-200"
                      : item.type === "warning"
                      ? "bg-red-50 text-[#e31837] border-2 border-red-200"
                      : "bg-blue-50 text-blue-700 border-2 border-blue-200"
                  }`}>
                    {index + 1}
                  </div>

                  {/* Detail */}
                  <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex-1">
                    <span className="text-[10px] font-bold font-mono text-slate-400 block">{item.time}</span>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setSelectedDriver(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
              >
                Tutup Log
              </button>
            </div>
          </Card>
        </div>
      )}

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
