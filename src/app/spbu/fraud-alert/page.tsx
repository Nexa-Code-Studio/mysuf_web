"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  Eye, 
  X, 
  MapPin, 
  Fuel, 
  Clock, 
  User, 
  Activity, 
  Filter, 
  SlidersHorizontal,
  Loader2
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { dummyTransactions } from "@/data/dummyTransactions";
import { evaluateTransactions } from "@/lib/fraudDetection";
import type { TransactionEvaluation } from "@/types";
import { API_BASE_URL } from "@/lib/api";

// High-fidelity license plate mapping for mock vehicle IDs
const VEHICLE_PLATES: Record<string, string> = {
  VH001: "B 9123 KZ",
  VH002: "D 4401 NH",
  VH003: "BG 1184 TR",
  VH004: "B 3456 GHI",
  VH005: "B 1234 XYZ",
  VH006: "D 5678 ABC",
  VH007: "DK 9012 DEF",
  VH008: "B 8821 TR",
  VH009: "L 1145 SH",
  VH010: "B 4512 AG",
  VH011: "F 2026 AB",
  VH012: "H 7788 XY",
  VH013: "B 3322 CD",
  VH014: "AB 5544 EF",
  VH015: "Z 9900 GH",
  VH016: "KB 4433 JK"
};

const SYSTEM_ACTION_BY_LEVEL: Record<string, string> = {
  SAFE: "NORMAL",
  SUSPICIOUS: "WARNING",
  HIGH_RISK: "FREEZE SEMENTARA",
  CRITICAL: "BLOCK AKUN",
};

export default function SpbuFraudAlertPage() {
  // 1. Evaluate all dummy transactions using the central AI Fraud Engine
  const evaluatedTransactions = useMemo(() => {
    const evaluated = evaluateTransactions(dummyTransactions);
    // Keep only suspicious, high risk, or critical items (riskScore > 30)
    return evaluated.filter((t) => t.riskLevel !== "SAFE");
  }, []);

  // 2. Local interactive state for case statuses and user UI
  const [alerts, setAlerts] = useState(() => 
    evaluatedTransactions.map((t) => ({
      ...t,
      status: "Pending" as "Pending" | "Flagged" | "Resolved"
    }))
  );
  
  const [backendAlerts, setBackendAlerts] = useState<any[]>([]);
  const [isBackendLoading, setIsBackendLoading] = useState(false);

  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stationFilter, setStationFilter] = useState("All");

  // Toast notifications
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  // Fetch from real backend
  const fetchBackendAlerts = async () => {
    setIsBackendLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        setIsBackendLoading(false);
        return;
      }

      const url = new URL(`${API_BASE_URL}/fraud-logs`);
      if (severityFilter !== "All") url.searchParams.append("risk_level", severityFilter);
      if (statusFilter !== "All") url.searchParams.append("status", statusFilter.toUpperCase());
      if (searchQuery) url.searchParams.append("search", searchQuery);

      const res = await fetch(url.toString(), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.items || []).map((log: any) => ({
          transactionId: log.id,
          caseId: log.case_id,
          vehicleId: log.vehicle_ownership_id || "Mock",
          vehicleType: "Pribadi",
          stationName: log.gas_station_name,
          liters: 25,
          riskScore: log.risk_score,
          riskLevel: log.risk_level,
          reasons: log.detected_frauds?.map((f: any) => f.reason) || ["Analisis perilaku anomali."],
          status: log.status.charAt(0) + log.status.slice(1).toLowerCase(),
          timestamp: log.created_at,
          plate: log.plate_number_snapshot
        }));
        setBackendAlerts(mapped);
      }
    } catch (err) {
      console.error("Gagal mengambil data fraud logs dari backend", err);
    } finally {
      setIsBackendLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendAlerts();
  }, [severityFilter, statusFilter, searchQuery]);

  // Compile unique stations available for filtering
  const stations = useMemo(() => {
    const all = alerts.map((a) => a.stationName);
    return ["All", ...Array.from(new Set(all))];
  }, [alerts]);

  // Handle changing case status
  const handleStatusChange = async (id: string, newStatus: "Pending" | "Flagged" | "Resolved") => {
    const isBackend = backendAlerts.some(a => a.transactionId === id);
    if (isBackend) {
      try {
        const token = window.localStorage.getItem("mysuf-token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/fraud-logs/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            status: newStatus.toUpperCase(),
            resolution_notes: `Tindakan manual dari SPBU Dashboard (${newStatus})`
          })
        });
        if (res.ok) {
          showToast(`Status kasus berhasil diperbarui di server menjadi ${newStatus}`);
          await fetchBackendAlerts();
        } else {
          showToast("Gagal memperbarui status kasus di server.");
        }
      } catch (err) {
        showToast("Terjadi kesalahan koneksi.");
      }
    } else {
      setAlerts((prev) => 
        prev.map((a) => (a.transactionId === id ? { ...a, status: newStatus } : a))
      );
      if (selectedAlert?.transactionId === id) {
        setSelectedAlert((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`Status kasus AI-${id} berhasil diubah menjadi ${newStatus}`);
    }
  };

  // Filtered alerts logic (Local fallback)
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const plate = VEHICLE_PLATES[alert.vehicleId] || alert.vehicleId;
      const matchesSearch =
        alert.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.reasons.join(" ").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = severityFilter === "All" || alert.riskLevel === severityFilter;
      const matchesStatus = statusFilter === "All" || alert.status === statusFilter;
      const matchesStation = stationFilter === "All" || alert.stationName === stationFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesStation;
    });
  }, [alerts, searchQuery, severityFilter, statusFilter, stationFilter]);

  const displayAlerts = useMemo(() => {
    return backendAlerts.length > 0 ? backendAlerts : filteredAlerts;
  }, [backendAlerts, filteredAlerts]);

  // Statistics summaries
  const statsSummary = useMemo(() => {
    const items = displayAlerts;
    const total = items.length;
    const suspicious = items.filter(a => a.riskLevel === "SUSPICIOUS").length;
    const highRisk = items.filter(a => a.riskLevel === "HIGH_RISK").length;
    const critical = items.filter(a => a.riskLevel === "CRITICAL").length;
    return { total, suspicious, highRisk, critical };
  }, [displayAlerts]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fraud Alert Control Center"
        subtitle="Pantau notifikasi kecurangan dari AI Engine secara langsung dan ambil tindakan tegas."
      />

      {/* Stats Dashboard */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Kasus AI</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{statsSummary.total}</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-slate-700">
            <Activity className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Suspicious (Peringatan)</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{statsSummary.suspicious}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">High Risk (Freeze Akun)</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-1">{statsSummary.highRisk}</h3>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Critical (Block Akun)</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">{statsSummary.critical}</h3>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Panel */}
      <Card className="overflow-hidden shadow-sm border border-slate-200/60 bg-white">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-pertamina-red" /> Log Aliran Fraud Real-time
          </h3>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID transaksi, plat nomor..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* SPBU filter */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 w-full sm:w-auto">
              <MapPin className="w-3.5 h-3.5" />
              <select
                value={stationFilter}
                onChange={(e) => setStationFilter(e.target.value)}
                className="bg-transparent focus:outline-none font-medium text-slate-700 w-full sm:w-auto"
              >
                <option value="All">Semua SPBU</option>
                {stations.filter((s) => s !== "All").map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Severity filter */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent focus:outline-none font-medium text-slate-700 w-full sm:w-auto"
              >
                <option value="All">Semua Keparahan</option>
                <option value="SUSPICIOUS">Suspicious</option>
                <option value="HIGH_RISK">High Risk</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent focus:outline-none font-medium text-slate-700 w-full sm:w-auto"
              >
                <option value="All">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Flagged">Flagged</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Waktu & Tanggal</th>
                <th className="px-6 py-4">ID Kasus</th>
                <th className="px-6 py-4">Plat Kendaraan</th>
                <th className="px-6 py-4">SPBU</th>
                <th className="px-6 py-4">Skor Risiko</th>
                <th className="px-6 py-4">Keparahan</th>
                <th className="px-6 py-4">Aksi Sistem</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isBackendLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-pertamina-red" />
                      <span>Memuat data fraud log langsung dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : displayAlerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-slate-500">
                    Tidak ada fraud alert yang terdeteksi dengan kriteria filter saat ini.
                  </td>
                </tr>
              ) : (
                displayAlerts.map((alert) => {
                  const plate = alert.plate || VEHICLE_PLATES[alert.vehicleId] || alert.vehicleId;
                  const dateObj = new Date(alert.timestamp);
                  const formattedTime = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                  const formattedDate = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

                  return (
                    <tr key={alert.transactionId} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        <div>{formattedTime}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{formattedDate}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500 font-mono">
                        {alert.caseId || `AI-${alert.transactionId}`}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {plate}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {alert.stationName}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            alert.riskScore >= 70 ? "bg-red-500" : "bg-amber-500"
                          }`} />
                          <span className="font-mono text-slate-800">{alert.riskScore} pts</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          alert.riskLevel === "CRITICAL"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : alert.riskLevel === "HIGH_RISK"
                            ? "bg-orange-100 text-orange-800 border border-orange-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {alert.riskLevel.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {SYSTEM_ACTION_BY_LEVEL[alert.riskLevel] || alert.riskLevel}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={alert.status}
                          onChange={(e) => handleStatusChange(alert.transactionId, e.target.value as any)}
                          className={`text-xs font-bold px-2 py-1 rounded-md border ${
                            alert.status === "Pending"
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : alert.status === "Flagged"
                              ? "bg-red-50 text-red-700 border-red-300"
                              : "bg-emerald-50 text-emerald-700 border-emerald-300"
                          } focus:outline-none focus:ring-1 focus:ring-slate-400`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Flagged">Flagged</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          title="Inspeksi Kasus"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Case Details Inspector Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg overflow-hidden border border-slate-200 bg-white shadow-2xl relative animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                  <ShieldAlert className="w-5 h-5 text-pertamina-red" /> Inspeksi Kasus {selectedAlert.caseId || `AI-${selectedAlert.transactionId}`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Rincian analisis anomali dari AI Fraud Engine</p>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Kendaraan</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                    <Fuel className="w-4 h-4 text-slate-500" /> 
                    {selectedAlert.plate || VEHICLE_PLATES[selectedAlert.vehicleId] || selectedAlert.vehicleId} ({selectedAlert.vehicleType})
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Stasiun Pompa</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {selectedAlert.stationName}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Jumlah Pembelian</span>
                  <span className="text-sm font-bold text-slate-900 block mt-1">
                    {selectedAlert.liters} Liter BBM Subsidi
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Skor Risiko & Keparahan</span>
                  <span className="text-sm font-bold text-slate-900 block mt-1">
                    {selectedAlert.riskScore} pts ({selectedAlert.riskLevel.replace("_", " ")})
                  </span>
                </div>
              </div>

              {/* Anomaly Reason list */}
              <div className="border border-slate-200 rounded-lg p-4 bg-amber-50/30">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Indikasi Kecurangan Terdeteksi:
                </h4>
                <ul className="space-y-2">
                  {selectedAlert.reasons.map((reason: string, idx: number) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action and status control */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Rekomendasi Tindakan</span>
                  <span className="text-sm font-bold text-pertamina-red uppercase">
                    {SYSTEM_ACTION_BY_LEVEL[selectedAlert.riskLevel]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Status Tindak Lanjut:</span>
                  <select
                    value={selectedAlert.status}
                    onChange={(e) => handleStatusChange(selectedAlert.transactionId, e.target.value as any)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-md border ${
                      selectedAlert.status === "Pending"
                        ? "bg-slate-100 text-slate-700 border-slate-300"
                        : selectedAlert.status === "Flagged"
                        ? "bg-red-50 text-red-700 border-red-300"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300"
                    } focus:outline-none focus:ring-1 focus:ring-slate-400`}
                  >
                    <option value="Pending">Pending (Menunggu)</option>
                    <option value="Flagged">Flagged (Ditandai)</option>
                    <option value="Resolved">Resolved (Tuntas)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-semibold transition"
              >
                Tutup
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Toast Alert */}
      <Toast 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />
    </div>
  );
}
