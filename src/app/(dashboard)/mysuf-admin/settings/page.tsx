"use client";

import { useState } from "react";
import { Bell, Lock, Shield, Smartphone, Mail, AlertTriangle } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";

export default function MySufAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title="Pengaturan Super Admin"
        subtitle="Kelola preferensi notifikasi, keamanan, dan kebijakan privasi MySuF."
      />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === "notifications"
                  ? "bg-(--primary-10) text-(--primary)"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Bell className="w-4 h-4" /> Notifikasi
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === "security"
                  ? "bg-(--primary-10) text-(--primary)"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Lock className="w-4 h-4" /> Keamanan & Password
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === "privacy"
                  ? "bg-(--primary-10) text-(--primary)"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Shield className="w-4 h-4" /> Privasi Data
            </button>
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "notifications" && (
            <Card className="p-0 shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Preferensi Notifikasi</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih notifikasi penting untuk monitoring sistem nasional.
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Global Security Alerts</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Notifikasi real-time untuk akses admin dan anomali sistem.
                    </p>
                  </div>
                  <Toggle initialChecked={true} />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Ringkasan Operasional Harian</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Dapatkan rekap aktivitas lintas SPBU dan perusahaan.
                    </p>
                  </div>
                  <Toggle initialChecked={true} />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Peringatan Audit Kepatuhan</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Pantau anomali data dan pelanggaran kebijakan distribusi.
                    </p>
                  </div>
                  <Toggle initialChecked={false} />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-slate-500">
                  Metode Pengiriman
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Push Notification (App)</p>
                        <p className="text-xs text-slate-500">Update langsung di Command Center.</p>
                      </div>
                    </div>
                    <Toggle initialChecked={true} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Email Laporan</p>
                        <p className="text-xs text-slate-500">Dikirim ke admin.super@mysuf.id</p>
                      </div>
                    </div>
                    <Toggle initialChecked={true} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="p-0 shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Keamanan & Password</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Proteksi akses super admin dan pengaturan kredensial kritis.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Ubah Password</h4>
                  <div className="space-y-3 max-w-sm">
                    <input
                      type="password"
                      placeholder="Password saat ini"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-(--primary) focus:border-(--primary)"
                    />
                    <input
                      type="password"
                      placeholder="Password baru"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-(--primary) focus:border-(--primary)"
                    />
                    <input
                      type="password"
                      placeholder="Ulangi password baru"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-(--primary) focus:border-(--primary)"
                    />
                    <Button className="w-full bg-(--primary) hover:brightness-95 text-white mt-2">
                      Perbarui Password
                    </Button>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Autentikasi Multi-Faktor (MFA)</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Wajibkan verifikasi OTP untuk seluruh aksi administratif kritis.
                  </p>
                  <Button variant="outline" className="border-(--primary) text-(--primary) hover:bg-(--primary-10)">
                    Aktifkan MFA Sekarang
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card className="p-6 shadow-sm border border-slate-200/60">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Area Terbatas</h3>
                <p className="text-slate-500 max-w-sm mt-2 mb-6">
                  Kebijakan privasi dikelola oleh Command Center dan memerlukan otorisasi Level-5.
                </p>
                <Button variant="outline" disabled>
                  Hubungi Command Center
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
