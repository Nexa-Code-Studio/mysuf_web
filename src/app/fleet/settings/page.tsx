"use client";

import { useState } from "react";
import { Bell, ShieldAlert, Key, Smartphone, HelpCircle, Save } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Toast } from "@/components/ui/Toast";

export default function FleetSettingsPage() {
  const [settings, setSettings] = useState({
    quotaAlert: true,
    driverComplianceAlert: true,
    weeklyReportEmail: false,
    mfaEnabled: false,
    alertThreshold: "15", // percent
    maxRefuelingInterval: "30", // minutes
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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast({ show: true, msg: "Pengaturan Fleet Berhasil Disimpan!" });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SectionHeader
        title="Pengaturan Fleet"
        subtitle="Konfigurasikan ambang batas kepatuhan pengemudi, keamanan akun, dan alarm kuota."
      />

      <div className="space-y-6">
        {/* Notifikasi & Alarm Kuota */}
        <Card className="p-6 shadow-sm border border-slate-200/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#e31837]" /> Alarm & Notifikasi Sistem
            </h3>
            <p className="text-xs text-slate-500 mt-1">Sesuaikan peringatan otomatis untuk operasional harian.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Peringatan Sisa Kuota Harian</p>
                <p className="text-xs text-slate-500">Berikan notifikasi jika sisa kuota armada di bawah ambang batas.</p>
              </div>
              <Toggle
                checked={settings.quotaAlert}
                onChange={(val) => handleToggleChange("quotaAlert", val)}
              />
            </div>

            {settings.quotaAlert && (
              <div className="pl-6 border-l-2 border-red-100 flex items-center gap-4 py-1">
                <span className="text-xs font-bold text-slate-600">Ambang Batas Kuota Kritis:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="alertThreshold"
                    value={settings.alertThreshold}
                    onChange={handleInputChange}
                    min="5"
                    max="50"
                    className="w-16 px-2 py-1 border border-slate-200 rounded-md text-xs font-mono text-center text-slate-800 focus:outline-none focus:border-[#e31837]"
                  />
                  <span className="text-xs font-bold text-slate-600">%</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between py-2 border-t border-slate-50">
              <div>
                <p className="text-sm font-semibold text-slate-900">Peringatan Kepatuhan Driver (Compliance)</p>
                <p className="text-xs text-slate-500">Kirim notifikasi langsung jika driver melewatkan pengisian log harian.</p>
              </div>
              <Toggle
                checked={settings.driverComplianceAlert}
                onChange={(val) => handleToggleChange("driverComplianceAlert", val)}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-50">
              <div>
                <p className="text-sm font-semibold text-slate-900">Laporan Mingguan via Email</p>
                <p className="text-xs text-slate-500">Kirimkan ringkasan efisiensi liter per kilometer armada tiap hari Senin.</p>
              </div>
              <Toggle
                checked={settings.weeklyReportEmail}
                onChange={(val) => handleToggleChange("weeklyReportEmail", val)}
              />
            </div>
          </div>
        </Card>

        {/* Keamanan & Kebijakan Distribusi */}
        <Card className="p-6 shadow-sm border border-slate-200/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#e31837]" /> Keamanan & Kebijakan Distribusi
            </h3>
            <p className="text-xs text-slate-500 mt-1">Konfigurasikan pembatasan pengisian bahan bakar armada.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Otentikasi Dua Faktor (MFA) Akun Admin</p>
                <p className="text-xs text-slate-500">Wajibkan token OTP seluler saat memproses perubahan data NIB/SIUP.</p>
              </div>
              <Toggle
                checked={settings.mfaEnabled}
                onChange={(val) => handleToggleChange("mfaEnabled", val)}
              />
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Interval Minimal Pengisian Ulang Armada</p>
                  <p className="text-xs text-slate-500">Mencegah pengisian berulang (double tapping) pada kendaraan yang sama.</p>
                </div>
                <select
                  name="maxRefuelingInterval"
                  value={settings.maxRefuelingInterval}
                  onChange={handleInputChange}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#e31837]"
                >
                  <option value="15">Minimal 15 Menit</option>
                  <option value="30">Minimal 30 Menit</option>
                  <option value="60">Minimal 60 Menit</option>
                  <option value="120">Minimal 2 Jam</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Reset Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#e31837] hover:bg-red-700 text-white font-semibold rounded-lg text-sm flex items-center gap-2 shadow-md shadow-red-200 hover:shadow-lg transition-all active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Pengaturan
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
