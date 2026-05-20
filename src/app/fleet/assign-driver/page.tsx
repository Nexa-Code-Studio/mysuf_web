"use client";

import { useState } from "react";
import { UserCheck, ShieldAlert, CheckCircle, Clock, Trash2, ArrowRight, UserPlus, X } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface Assignment {
  id: string;
  driver: string;
  unit: string;
  shift: "Pagi" | "Siang" | "Malam";
  timeAssigned: string;
  status: "Aktif" | "Off" | "Standby";
}

export default function FleetAssignDriverPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "1", driver: "Rizal Wibowo", unit: "B 8821 TQ", shift: "Pagi", timeAssigned: "06:00 WIB", status: "Aktif" },
    { id: "2", driver: "Sinta Kartika", unit: "B 1145 WX", shift: "Siang", timeAssigned: "14:00 WIB", status: "Standby" },
    { id: "3", driver: "Agus Pratama", unit: "B 4512 PK", shift: "Malam", timeAssigned: "22:00 WIB", status: "Aktif" },
    { id: "4", driver: "Rama Utama", unit: "B 9902 KAA", shift: "Pagi", timeAssigned: "06:00 WIB", status: "Aktif" },
  ]);

  const [availableDrivers] = useState([
    "Dian Prasetyo", "Budi Cahyono", "Eko Prasetya", "Yudi Setiawan", "Andi Prakoso"
  ]);

  const [availableUnits] = useState([
    "B 7731 FA (Truck)", "B 3320 XN (Cargo)", "B 4410 PUA (Pickup)", "D 1088 TTR (Van)"
  ]);

  // Form State
  const [selectedDriver, setSelectedDriver] = useState(availableDrivers[0]);
  const [selectedUnit, setSelectedUnit] = useState(availableUnits[0]);
  const [selectedShift, setSelectedShift] = useState<"Pagi" | "Siang" | "Malam">("Pagi");

  const [toast, setToast] = useState({ show: false, msg: "" });

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if driver or unit is already assigned
    const unitOnly = selectedUnit.split(" ")[0] + " " + selectedUnit.split(" ")[1];
    
    const newAssign: Assignment = {
      id: Date.now().toString(),
      driver: selectedDriver,
      unit: unitOnly,
      shift: selectedShift,
      timeAssigned: selectedShift === "Pagi" ? "06:00 WIB" : selectedShift === "Siang" ? "14:00 WIB" : "22:00 WIB",
      status: "Aktif",
    };

    setAssignments((prev) => [newAssign, ...prev]);
    setToast({ show: true, msg: `Driver ${newAssign.driver} berhasil ditugaskan ke Unit ${newAssign.unit}!` });
  };

  const handleTerminate = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menonaktifkan penugasan driver ${name}?`)) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      setToast({ show: true, msg: `Penugasan driver ${name} dinonaktifkan.` });
    }
  };

  // Stats
  const activeCount = assignments.filter((a) => a.status === "Aktif").length;
  const standbyCount = assignments.filter((a) => a.status === "Standby").length;
  const offCount = availableDrivers.length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Penugasan Pengemudi"
        subtitle="Manajemen penugasan shift kerja harian driver ke unit kendaraan operasional."
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Driver Aktif</p>
            <p className="text-lg font-bold text-slate-900">{activeCount} Orang</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Standby (Siap Tugas)</p>
            <p className="text-lg font-bold text-slate-900">{standbyCount} Orang</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tersedia di Depo</p>
            <p className="text-lg font-bold text-slate-900">{offCount} Orang</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Form Panel */}
        <Card className="p-6 border border-slate-200/60 shadow-sm self-start space-y-6">
          <div>
            <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#e31837]" /> Tugaskan Driver Baru
            </h3>
            <p className="text-xs text-slate-500 mt-1">Isi detail penugasan armada untuk shift aktif berikutnya.</p>
          </div>

          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Pilih Pengemudi</label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837] transition"
              >
                {availableDrivers.map((driver) => (
                  <option key={driver} value={driver}>{driver}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Pilih Unit Kendaraan</label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837] transition"
              >
                {availableUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Shift Penugasan</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Pagi", "Siang", "Malam"] as const).map((shift) => (
                  <button
                    key={shift}
                    type="button"
                    onClick={() => setSelectedShift(shift)}
                    className={`py-2 text-center rounded-lg text-xs font-semibold border transition ${
                      selectedShift === shift
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {shift}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#e31837] hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-red-200 hover:shadow-lg transition-all active:scale-95"
            >
              Tugaskan Sekarang <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </Card>

        {/* Table Panel */}
        <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50/50 border-b border-slate-200/60">
            <h3 className="font-bold text-slate-900">Daftar Aktif Penugasan</h3>
            <p className="text-xs text-slate-500 mt-1">Daftar kendaraan dan pengemudi yang sedang aktif menjalankan tugas hari ini.</p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Driver</th>
                  <th className="px-6 py-4">Unit Penugasan</th>
                  <th className="px-6 py-4">Shift</th>
                  <th className="px-6 py-4">Waktu Mulai</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-red-50 text-[#e31837] flex items-center justify-center font-bold text-xs">
                          {item.driver.substring(0,1)}
                        </div>
                        <span className="font-semibold text-slate-800">{item.driver}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold text-xs rounded border border-slate-200">
                        {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {item.shift}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {item.timeAssigned}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.status === "Aktif"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : item.status === "Standby"
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTerminate(item.id, item.driver)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
