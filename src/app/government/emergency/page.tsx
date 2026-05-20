"use client";

import { useState } from "react";
import { ShieldAlert, AlertOctagon, Key, Power, Play, Lock, Unlock, Siren, RefreshCw, X } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

export default function GovernmentEmergencyPage() {
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authKey, setAuthKey] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  const handleOpenLockdownModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAuthKey("");
  };

  const executeLockdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authKey.trim()) return;

    // Simulate Lockdown Activation
    setToast({ show: true, msg: "Memproses Otorisasi Tingkat Tinggi..." });
    setTimeout(() => {
      setIsLockedDown(true);
      handleCloseModal();
      setToast({ show: true, msg: "SUBSIDI BBM DIBEKUKAN NASIONAL!" });
    }, 1500);
  };

  const executeUnlock = () => {
    setToast({ show: true, msg: "Memulihkan Distribusi Subsidi BBM..." });
    setTimeout(() => {
      setIsLockedDown(false);
      setToast({ show: true, msg: "Distribusi Subsidi BBM Berhasil Dipulihkan." });
    }, 1500);
  };

  return (
    <div className={`space-y-6 transition-all duration-500 p-4 rounded-2xl ${
      isLockedDown ? "bg-red-950/20 border-2 border-red-500/50 animate-pulse" : ""
    }`}>
      <SectionHeader
        title="Emergency Control Room"
        subtitle="Konsol penghentian darurat distribusi subsidi BBM bersubsidi dalam skala nasional."
      />

      {isLockedDown && (
        <div className="bg-red-600 text-white font-bold p-4 rounded-xl flex items-center gap-3 border-2 border-red-400 shadow-lg shadow-red-500/30 animate-bounce">
          <Siren className="w-6 h-6 shrink-0 animate-spin" />
          <div>
            <p className="text-sm uppercase tracking-widest">SIAGA SATU - LOCKDOWN SUBSIDI AKTIF</p>
            <p className="text-xs font-semibold text-red-100">Seluruh Nozzle BBM Bersubsidi Di Seluruh SPBU Non-Aktif Otomatis.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Control Desk */}
        <Card className="p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between items-center text-center space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-md flex items-center justify-center gap-2">
              <AlertOctagon className="w-5 h-5 text-[#e31837]" /> Kendali Darurat Nasional
            </h3>
            <p className="text-xs text-slate-500">
              Tombol ini melompati semua protokol regional dan secara paksa membekukan seluruh alokasi BBM bersubsidi.
            </p>
          </div>

          {/* MASSIVE BUTTON */}
          {!isLockedDown ? (
            <button
              onClick={handleOpenLockdownModal}
              className="w-48 h-48 rounded-full bg-[#e31837] hover:bg-red-700 text-white font-extrabold text-xs flex flex-col items-center justify-center gap-2 border-8 border-red-100 hover:border-red-200 shadow-2xl shadow-red-200 hover:shadow-red-300 transition-all duration-300 active:scale-95 group"
            >
              <Power className="w-12 h-12 group-hover:scale-110 transition" />
              <span>LOCKDOWN</span>
              <span className="text-[9px] text-red-200 uppercase tracking-widest">SUBSIDI</span>
            </button>
          ) : (
            <button
              onClick={executeUnlock}
              className="w-48 h-48 rounded-full bg-slate-900 hover:bg-slate-800 text-green-400 font-extrabold text-xs flex flex-col items-center justify-center gap-2 border-8 border-slate-800 hover:border-slate-700 shadow-2xl transition-all duration-300 active:scale-95 group"
            >
              <RefreshCw className="w-12 h-12 text-green-500 group-hover:animate-spin" />
              <span>PULIHKAN</span>
              <span className="text-[9px] text-green-400 uppercase tracking-widest">SISTEM</span>
            </button>
          )}

          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Clearance Level: L5 National Security Key Required
          </div>
        </Card>

        {/* System Status Indicators */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900">Status Sistem Terdistribusi</h3>
            <p className="text-xs text-slate-500 mt-1">Status konektivitas pipa distribusi Pertamina Integrated Command Center.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-700">Database Transaksi BPH Migas</span>
              <span className={`font-mono font-bold ${isLockedDown ? "text-red-500 animate-pulse" : "text-green-600"}`}>
                {isLockedDown ? "SUSPENDED (OFFLINE)" : "CONNECTED (ONLINE)"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-700">Nozzle Sensor SPBU (Nasional)</span>
              <span className={`font-mono font-bold ${isLockedDown ? "text-red-500 animate-pulse" : "text-green-600"}`}>
                {isLockedDown ? "BLOCKED (OFFLINE)" : "ACTIVE (ONLINE)"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-700">AI Fraud Engine Scanner</span>
              <span className={`font-mono font-bold ${isLockedDown ? "text-red-500" : "text-green-600"}`}>
                {isLockedDown ? "STANDBY" : "ACTIVE (ONLINE)"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 text-xs">
              <span className="font-bold text-slate-700">Peta Krisis Wilayah</span>
              <span className={`font-mono font-bold ${isLockedDown ? "text-red-500" : "text-slate-400"}`}>
                {isLockedDown ? "WAR ZONE (ALERT)" : "Aman & Terkendali"}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 flex gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-700">Protokol Keamanan ESDM</p>
              <p className="text-[11px] leading-relaxed">
                Tindakan pembekuan darurat ini dilindungi oleh UU Ketahanan Energi Nasional Pasal 44 Ayat 2. Semua peristiwa dicatat pada immutable blockchain log BPH Migas.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* LOCKDOWN SECURITY AUTHORIZATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl relative animate-scale-up border-2 border-red-500">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#e31837] flex items-center justify-center mx-auto border-2 border-red-100">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-md font-extrabold text-red-700 uppercase tracking-wide">
                KONFIRMASI LOCKDOWN NASIONAL
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PERINGATAN! Tindakan ini akan menghentikan seluruh transaksi BBM subsidi di seluruh SPBU Pertamina secara nasional. Masukkan kunci otorisasi Level-5 untuk memvalidasi.
              </p>
            </div>

            <form onSubmit={executeLockdown} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Kunci Keamanan Level-5</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Contoh: BPH-LOCKDOWN-2026"
                    value={authKey}
                    onChange={(e) => setAuthKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837]"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold">Masukkan kata sandi pengawas Anda untuk memicu bypass.</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  BATALKAN
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#e31837] hover:bg-red-700 text-white font-extrabold rounded-lg text-xs shadow-md shadow-red-200 transition active:scale-95"
                >
                  PROSES LOCKDOWN
                </button>
              </div>
            </form>
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
