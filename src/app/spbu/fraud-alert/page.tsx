"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck, XCircle, Search, Ban, Lock, Check, Eye } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const initialAlerts = [
  { id: "FR-2201", vehicle: "B 9123 KZ", issue: "Pengisian berulang (3x dalam 1 jam)", severity: "High", time: "10:45", status: "Pending" },
  { id: "FR-2202", vehicle: "D 4401 NH", issue: "Ketidakcocokan kuota NIK vs KK", severity: "Medium", time: "11:20", status: "Pending" },
  { id: "FR-2203", vehicle: "BG 1184 TR", issue: "ID petugas kasir tidak valid", severity: "High", time: "11:35", status: "Pending" },
  { id: "FR-2204", vehicle: "B 3456 GHI", issue: "Upaya melebihi kuota harian", severity: "Medium", time: "12:10", status: "Pending" }
];

export default function SpbuFraudAlertPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (alertId: string, actionType: "block" | "freeze" | "dismiss") => {
    let actionLabel = "";
    if (actionType === "block") actionLabel = "Plat Nomor diblokir nasional!";
    if (actionType === "freeze") actionLabel = "Kuota NIK dibekukan sementara!";
    if (actionType === "dismiss") actionLabel = "Kasus diabaikan (Tandai Aman).";

    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: actionType === "dismiss" ? "Resolved" : "Flagged" } : a));
    setSelectedAlert(null);
    setToastMessage(actionLabel);
    
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const highAlerts = alerts.filter(a => a.severity === "High" && a.status === "Pending").length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fraud Alert Control Center"
        subtitle="Pantau notifikasi kecurangan dari AI Engine secara langsung dan ambil tindakan tegas."
      />

      {toastMessage && (
        <div className="fixed top-4 right-4 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2.5 z-50 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-red-50/50 rounded-xl p-5 border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Kasus Kritis Aktif</p>
            <h3 className="text-2xl font-black text-red-700 mt-2">{highAlerts} Kasus</h3>
          </div>
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Perlu Penanganan</p>
            <h3 className="text-2xl font-black text-amber-700 mt-2">
              {alerts.filter(a => a.status === "Pending").length} Kasus
            </h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-green-50/50 rounded-xl p-5 border border-green-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Berhasil Diselesaikan</p>
            <h3 className="text-2xl font-black text-green-700 mt-2">
              {alerts.filter(a => a.status !== "Pending").length} Kasus
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm border border-slate-200/60">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#e31837]" /> Log Aliran Fraud Real-time
          </h3>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">AI Scanned Live</span>
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
                <th className="px-6 py-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {alerts.map((alert) => (
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
                  <td className="px-6 py-4 text-center">
                    {alert.status === "Pending" ? (
                      <Button 
                        onClick={() => setSelectedAlert(alert)}
                        className="bg-[#e31837] hover:bg-[#c4142e] text-white text-xs px-3 h-8 rounded-lg font-bold"
                      >
                        Tindak Cepat
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">Diselesaikan</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Decision Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 relative mx-4">
            <button 
              onClick={() => setSelectedAlert(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              &times;
            </button>
            
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Keputusan Aksi Cepat</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tindakan langsung terhadap plat kendaraan <strong className="text-slate-900">{selectedAlert.vehicle}</strong>
              </p>
            </div>

            <div className="py-6 space-y-3">
              <button 
                onClick={() => handleAction(selectedAlert.id, "block")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-left transition"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Ban className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800">Blokir Plat Nasional (Blacklist)</p>
                  <p className="text-xs text-red-600 mt-0.5">Blokir plat ini dari semua nozzle SPBU se-Indonesia.</p>
                </div>
              </button>

              <button 
                onClick={() => handleAction(selectedAlert.id, "freeze")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">Bekukan Kuota Subsidi NIK</p>
                  <p className="text-xs text-amber-600 mt-0.5">Kunci sisa kuota subsidi NIK pemilik kendaraan ini.</p>
                </div>
              </button>

              <button 
                onClick={() => handleAction(selectedAlert.id, "dismiss")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Abaikan Kasus (Mark as Safe)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tandai transaksi aman dan tutup notifikasi fraud ini.</p>
                </div>
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                onClick={() => setSelectedAlert(null)}
                variant="outline"
                className="w-full"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
