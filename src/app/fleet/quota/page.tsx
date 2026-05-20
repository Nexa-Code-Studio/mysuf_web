"use client";

import { useState } from "react";
import { ShieldCheck, Info, RefreshCw, AlertTriangle, Coins, Lock, Unlock } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface QuotaVehicle {
  id: string;
  plate: string;
  type: string;
  driver: string;
  allocatedLimit: number;
  usedVolume: number;
  isFrozen: boolean;
}

export default function FleetQuotaPage() {
  const [vehicles, setVehicles] = useState<QuotaVehicle[]>([
    { id: "1", plate: "B 8821 TQ", type: "Tanker 10KL", driver: "Rizal", allocatedLimit: 250, usedVolume: 180, isFrozen: false },
    { id: "2", plate: "B 1145 WX", type: "Box Cargo Medium", driver: "Sinta", allocatedLimit: 150, usedVolume: 80, isFrozen: false },
    { id: "3", plate: "B 4512 PK", type: "Pickup L300", driver: "Agus", allocatedLimit: 100, usedVolume: 15, isFrozen: false },
    { id: "4", plate: "B 9902 KAA", type: "Tanker 16KL", driver: "Rama Utama", allocatedLimit: 300, usedVolume: 220, isFrozen: false },
    { id: "5", plate: "D 2219 BZ", type: "Box Cargo Medium", driver: "Nia Putri", allocatedLimit: 120, usedVolume: 35, isFrozen: true },
  ]);

  const [toast, setToast] = useState({ show: false, msg: "" });

  const TOTAL_CORPORATE_MAX_DAILY = 1200; // 1,200 Liters daily pool limit

  // Calculations
  const totalAllocated = vehicles.reduce((sum, v) => sum + (v.isFrozen ? 0 : v.allocatedLimit), 0);
  const totalUsed = vehicles.reduce((sum, v) => sum + v.usedVolume, 0);
  const unallocatedPool = TOTAL_CORPORATE_MAX_DAILY - totalAllocated;

  const handleSliderChange = (id: string, newValue: number) => {
    // Check if new allocation exceeds daily pool limit
    const targetVehicle = vehicles.find((v) => v.id === id);
    if (!targetVehicle) return;

    const diff = newValue - targetVehicle.allocatedLimit;
    if (unallocatedPool - diff < 0) {
      setToast({ show: true, msg: "Alokasi gagal! Melampaui limit kuota harian perusahaan." });
      return;
    }

    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, allocatedLimit: newValue } : v))
    );
  };

  const handleToggleFreeze = (id: string, plate: string, currentState: boolean) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFrozen: !currentState } : v))
    );
    setToast({
      show: true,
      msg: currentState 
        ? `Kuota Unit ${plate} Berhasil Diaktifkan Kembali.` 
        : `Kuota Unit ${plate} Ditangguhkan Sementara.`,
    });
  };

  const handleResetAll = () => {
    setVehicles((prev) =>
      prev.map((v) => ({ ...v, allocatedLimit: 150, isFrozen: false }))
    );
    setToast({ show: true, msg: "Semua alokasi armada dikembalikan ke standar harian (150 L)." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Kuota Per-Armada"
          subtitle="Skema alokasi subsidi BBM produktif per unit kendaraan komersial aktif."
        />
        <button
          onClick={handleResetAll}
          className="self-start sm:self-center px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition active:scale-95 bg-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset ke Standar (150L)
        </button>
      </div>

      {/* Quota Allocations Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Kuota Korporasi</span>
            <Coins className="w-4 h-4 text-[#e31837]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{TOTAL_CORPORATE_MAX_DAILY} L <span className="text-xs text-slate-400 font-medium">/ Hari</span></p>
            <p className="text-xs text-slate-500 mt-1">Pool limit yang disetujui BPH Migas.</p>
          </div>
        </Card>

        <Card className="p-5 border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ter-Alokasi Harian</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalAllocated} L</p>
            <p className="text-xs text-slate-500 mt-1">{Math.round((totalAllocated / TOTAL_CORPORATE_MAX_DAILY) * 100)}% dari total kapasitas harian.</p>
          </div>
        </Card>

        <Card className="p-5 border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tersedia di Pool (Sisa)</span>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
              unallocatedPool < 150 ? "bg-red-50 text-[#e31837]" : "bg-green-50 text-green-700"
            }`}>
              {unallocatedPool} L Sisa
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{unallocatedPool} L</p>
            <p className="text-xs text-slate-500 mt-1">Dapat dibagikan ke armada baru / tambahan.</p>
          </div>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="p-4 border border-blue-100 bg-blue-50/40 text-blue-800 flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Skema Subsidi Per-Armada / Kendaraan Produktif</p>
          <p className="text-slate-600 leading-relaxed">
            Berbeda dengan alokasi B2C yang membatasi per KK (Kartu Keluarga) secara kolektif, Fleet Dashboard mengakomodasi batasan BBM Subsidi proporsional per unit terdaftar. Anda dapat secara dinamis mentransfer liter kuota BBM dari unit yang jarang beroperasi ke unit yang sedang bertugas intensif demi kelancaran operasional logistik Anda.
          </p>
        </div>
      </Card>

      {/* Allocation List Panel */}
      <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-900">Alokasi & Manajemen Kuota Unit</h3>
            <p className="text-xs text-slate-500 mt-1">Gunakan slider untuk menambah/mengurangi jatah liter harian unit aktif Anda.</p>
          </div>
          {unallocatedPool < 100 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Jatah kuota tersisa kritis!
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-100 bg-white">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition ${
                vehicle.isFrozen ? "bg-slate-50/70 opacity-75" : ""
              }`}
            >
              {/* Unit info */}
              <div className="w-full lg:w-1/4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold rounded text-xs tracking-wider">
                    {vehicle.plate}
                  </span>
                  {vehicle.isFrozen && (
                    <span className="px-2 py-0.5 bg-red-50 text-[#e31837] border border-red-200 text-[10px] font-bold rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> BEKU
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{vehicle.type}</p>
                  <p className="text-xs text-slate-500 font-medium">Driver Utama: {vehicle.driver}</p>
                </div>
              </div>

              {/* Slider Allocation controls */}
              <div className="w-full lg:w-2/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    Jatah Harian: 
                    <span className={`font-mono text-sm font-bold ${vehicle.isFrozen ? "text-slate-400" : "text-[#e31837]"}`}>
                      {vehicle.isFrozen ? "0" : vehicle.allocatedLimit} L
                    </span>
                  </span>
                  <span className="font-mono text-slate-400">Min 50L - Max 500L</span>
                </div>
                
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  disabled={vehicle.isFrozen}
                  value={vehicle.allocatedLimit}
                  onChange={(e) => handleSliderChange(vehicle.id, Number(e.target.value))}
                  className={`w-full accent-[#e31837] ${
                    vehicle.isFrozen ? "cursor-not-allowed opacity-50 bg-slate-200" : "cursor-pointer"
                  }`}
                />

                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Konsumsi Hari Ini: {vehicle.usedVolume} L</span>
                  <span>Sisa: {vehicle.isFrozen ? 0 : Math.max(0, vehicle.allocatedLimit - vehicle.usedVolume)} L</span>
                </div>
              </div>

              {/* Progress visual */}
              <div className="w-full lg:w-1/5 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Pemakaian Hari Ini</span>
                  <span>{vehicle.isFrozen ? 0 : Math.round((vehicle.usedVolume / vehicle.allocatedLimit) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      vehicle.isFrozen ? "bg-slate-300" : "bg-[#e31837]"
                    }`}
                    style={{ width: `${vehicle.isFrozen ? 0 : Math.min(100, (vehicle.usedVolume / vehicle.allocatedLimit) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              <div className="w-full lg:w-auto flex justify-end">
                <button
                  onClick={() => handleToggleFreeze(vehicle.id, vehicle.plate, vehicle.isFrozen)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                    vehicle.isFrozen
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-red-200 text-[#e31837] hover:bg-red-50"
                  }`}
                >
                  {vehicle.isFrozen ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      Aktifkan
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Bekukan Kuota
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
