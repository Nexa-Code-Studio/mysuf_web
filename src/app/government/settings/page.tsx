"use client";

import { useState } from "react";
import { Shield, Brain, BellRing, Key, Save, AlertOctagon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Toast } from "@/components/ui/Toast";

export default function GovernmentSettingsPage() {
  const [settings, setSettings] = useState({
    nationalAlert: true,
    aiScoringAlert: true,
    mfaRequired: true,
    ipLockout: false,
    alertThreshold: "90", // percent
    weightNJKB: 40,
    weightCC: 40,
    weightTax: 20,
  });

  const [toast, setToast] = useState({ show: false, msg: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleChange = (key: keyof typeof settings, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: checked }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeightChange = (key: "weightNJKB" | "weightCC" | "weightTax", val: number) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: val };
      // Normalizing weights is handled dynamically or warning triggers if sum !== 100
      return updated;
    });
  };

  const handleSave = () => {
    const sum = Number(settings.weightNJKB) + Number(settings.weightCC) + Number(settings.weightTax);
    if (sum !== 100) {
      setToast({ show: true, msg: `Gagal! Total bobot kriteria kelayakan harus tepat 100% (Sekarang ${sum}%).` });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast({ show: true, msg: "Pengaturan Parameter Regulator Berhasil Disimpan!" });
    }, 1000);
  };

  const weightSum = Number(settings.weightNJKB) + Number(settings.weightCC) + Number(settings.weightTax);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SectionHeader
        title="Konfigurasi Parameter Nasional"
        subtitle="Kelola parameter AI scoring engine, bobot kelayakan (eligibility), dan otentikasi BPH Migas."
      />

      <div className="space-y-6">
        {/* National Alert Settings */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-600" /> Alarm Kuota Nasional
            </h3>
            <p className="text-xs text-slate-500 mt-1">Konfigurasi batas kritis konsumsi BBM subsidi harian di tiap wilayah.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Peringatan Kritis Nasional</p>
                <p className="text-xs text-slate-500">Beri sinyal siaga jika konsumsi kuota kumulatif harian melampaui batas.</p>
              </div>
              <Toggle
                checked={settings.nationalAlert}
                onChange={(val) => handleToggleChange("nationalAlert", val)}
              />
            </div>

            {settings.nationalAlert && (
              <div className="pl-6 border-l-2 border-amber-500 flex items-center gap-4 py-1">
                <span className="text-xs font-bold text-slate-600">Batas Siaga Konsumsi:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="alertThreshold"
                    value={settings.alertThreshold}
                    onChange={handleInputChange}
                    min="70"
                    max="95"
                    className="w-16 px-2 py-1 border border-slate-200 rounded-md text-xs font-mono text-center text-slate-800 focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-xs font-bold text-slate-600">% Terpakai</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* AI Scoring Weights for Citizen Eligibility */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-600" /> Bobot Kriteria AI Eligibility (Kelayakan)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Sesuaikan bobot persentase kalkulasi warga penerima hak subsidi BBM.</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              weightSum === 100 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-[#e31837] border-red-200 animate-pulse"
            }`}>
              Total: {weightSum}%
            </span>
          </div>

          <div className="space-y-6">
            {/* Weight 1: NJKB */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>1. Bobot NJKB (Nilai Jual Kendaraan Bermotor)</span>
                <span className="font-mono text-slate-900">{settings.weightNJKB}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={settings.weightNJKB}
                onChange={(e) => handleWeightChange("weightNJKB", Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {/* Weight 2: Engine Size CC */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>2. Bobot CC Kendaraan (Kapasitas Mesin)</span>
                <span className="font-mono text-slate-900">{settings.weightCC}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={settings.weightCC}
                onChange={(e) => handleWeightChange("weightCC", Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {/* Weight 3: Tax compliance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>3. Kepatuhan Pajak Kendaraan</span>
                <span className="font-mono text-slate-900">{settings.weightTax}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={settings.weightTax}
                onChange={(e) => handleWeightChange("weightTax", Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {weightSum !== 100 && (
              <div className="p-3 bg-red-50 text-[#e31837] rounded-xl flex gap-2 items-center text-xs border border-red-100 font-medium">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                Peringatan: Jumlah total persentase bobot harus 100%. Mohon sesuaikan kembali.
              </div>
            )}
          </div>
        </Card>

        {/* Security Parameters */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" /> Keamanan & Otorisasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">Konfigurasikan pembatasan verifikasi khusus tingkat pengawas.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Otentikasi Multi-Faktor (MFA) Wajib</p>
                <p className="text-xs text-slate-500">Mewajibkan verifikasi OTP token fisik bagi administrator Level-5.</p>
              </div>
              <Toggle
                checked={settings.mfaRequired}
                onChange={(val) => handleToggleChange("mfaRequired", val)}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-50">
              <div>
                <p className="text-sm font-semibold text-slate-900">Lockout IP Luar Gedung ESDM</p>
                <p className="text-xs text-slate-500">Mencegah akses konsol command center jika berada di luar intranet dinas.</p>
              </div>
              <Toggle
                checked={settings.ipLockout}
                onChange={(val) => handleToggleChange("ipLockout", val)}
              />
            </div>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition bg-white"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm flex items-center gap-2 shadow-md transition active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Konfigurasi
              </>
            )}
          </button>
        </div>
      </div>

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
