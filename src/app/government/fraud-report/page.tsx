"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { ShieldAlert, Search, Eye, X, AlertTriangle, ShieldCheck, FileText, RefreshCw, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { API_BASE_URL } from "@/lib/api";

// ─── Types from API ────────────────────────────────────────────────────────────

type RiskLevel = "SAFE" | "SUSPICIOUS" | "HIGH_RISK" | "CRITICAL";

type DetectedFraud = {
  type: string;
  points: number;
  reason: string;
};

type FraudCase = {
  id: string;
  case_id: string;
  gas_station_name: string;
  plate_number_snapshot: string;
  nik_snapshot: string | null;
  buyer_name: string | null;
  risk_score: number;
  risk_level: RiskLevel;
  action_taken: string;
  detected_frauds: DetectedFraud[];
  status: string;
  resolution_notes: string | null;
  resolved_by_name: string | null;
  resolved_at: string | null;
  created_at: string;
};

type ApiStats = {
  total: number;
  suspicious: number;
  high_risk: number;
  critical: number;
};

type ApiResponse = {
  stats: ApiStats;
  items: FraudCase[];
  total_count: number;
};

// ─── Display Mappings ──────────────────────────────────────────────────────────

const RISK_LABEL: Record<RiskLevel, string> = {
  SAFE: "SAFE",
  SUSPICIOUS: "SUSPICIOUS",
  HIGH_RISK: "HIGH RISK",
  CRITICAL: "CRITICAL",
};

const ACTION_LABEL: Record<string, string> = {
  ALLOW_TRANSACTION: "NORMAL",
  WARNING: "WARNING",
  FREEZE_ACCOUNT: "FREEZE SEMENTARA",
  BLOCK_ACCOUNT: "BLOCK AKUN",
};

const FRAUD_TYPE_LABEL: Record<string, string> = {
  RAPID_PURCHASE: "Rapid Purchase",
  MULTI_LOCATION_ABUSE: "Multi Location Abuse",
  HOUSEHOLD_ABUSE: "Household Abuse",
  QUOTA_EXCEEDED: "Quota Exceeded",
  VEHICLE_TELEPORT: "Vehicle Teleport",
};

const RISK_BADGE: Record<RiskLevel, string> = {
  SAFE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  SUSPICIOUS: "bg-amber-50 text-amber-700 border border-amber-200",
  HIGH_RISK: "bg-orange-50 text-orange-700 border border-orange-200",
  CRITICAL: "bg-red-50 text-[var(--primary)] border border-red-200",
};

const ACTION_BADGE: Record<RiskLevel, string> = {
  SAFE: "bg-slate-50 text-slate-700 border border-slate-200",
  SUSPICIOUS: "bg-amber-50 text-amber-700 border border-amber-200",
  HIGH_RISK: "bg-orange-50 text-orange-700 border border-orange-200",
  CRITICAL: "bg-red-50 text-[var(--primary)] border border-red-200",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoString));
}

function getPrimaryFraudLabel(frauds: DetectedFraud[]): string {
  if (!frauds.length) return "No Fraud Detected";
  return FRAUD_TYPE_LABEL[frauds[0].type] ?? frauds[0].type;
}

function buildDetails(frauds: DetectedFraud[]): string {
  if (!frauds.length) return "Tidak ada anomali yang terdeteksi oleh AI fraud engine.";
  return frauds.map((f) => f.reason).join(" ");
}

function buildTimeline(frauds: DetectedFraud[]): { seq: string; activity: string }[] {
  if (!frauds.length) return [{ seq: "—", activity: "Tidak ada pola fraud yang terdeteksi." }];
  return frauds.map((f, i) => ({
    seq: `Anomali #${i + 1}`,
    activity: `[${FRAUD_TYPE_LABEL[f.type] ?? f.type}] ${f.reason}`,
  }));
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded bg-slate-100" style={{ width: `${50 + i * 5}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 8;

export default function GovernmentFraudReportPage() {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [stats, setStats] = useState<ApiStats>({ total: 0, suspicious: 0, high_risk: 0, critical: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFraudLogs = useCallback(async (page: number, searchQuery: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Sesi login berakhir. Silakan login kembali.");

      const offset = (page - 1) * ROWS_PER_PAGE;
      const params = new URLSearchParams({
        limit: String(ROWS_PER_PAGE),
        offset: String(offset),
      });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`${API_BASE_URL}/fraud-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error("Akses ditolak. Endpoint ini khusus untuk akun Pemerintah/Regulator.");
        throw new Error("Gagal mengambil data fraud dari server.");
      }

      const data: ApiResponse = await res.json();
      setCases(data.items);
      setStats(data.stats);
      setTotalCount(data.total_count);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFraudLogs(currentPage, search);
  }, [currentPage, fetchFraudLogs]);

  // Debounce search — re-fetch from page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchFraudLogs(1, search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, fetchFraudLogs]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));
  const activeCasesCount = stats.suspicious + stats.high_risk + stats.critical;
  const avgRiskScore = useMemo(
    () => (cases.length ? Math.round(cases.reduce((s, c) => s + c.risk_score, 0) / cases.length) : 0),
    [cases]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-slate-800">AI Fraud Detection Engine</h4>
            <p className="text-[10px] text-slate-500">Data fraud real-time dari engine deteksi anomali nasional.</p>
          </div>
        </div>
        <button
          onClick={() => fetchFraudLogs(currentPage, search)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-white border border-red-200/80 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      <SectionHeader
        title="Fraud Investigation Center"
        subtitle="Status: SAFE, SUSPICIOUS, HIGH RISK, CRITICAL. Risk index dari AI engine. Kolom tindakan menunjukkan respons otomatis sistem."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-[var(--primary)] flex items-center justify-center border border-red-100 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kasus Aktif (Siaga)</p>
            <p className={`text-lg font-bold text-slate-900 ${isLoading ? "animate-pulse" : ""}`}>
              {isLoading ? "—" : `${activeCasesCount} Investigasi`}
            </p>
          </div>
        </Card>
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kasus SAFE</p>
            <p className={`text-lg font-bold text-slate-900 ${isLoading ? "animate-pulse" : ""}`}>
              {isLoading ? "—" : `${stats.total - activeCasesCount} Kasus`}
            </p>
          </div>
        </Card>
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Risk Index</p>
            <p className={`text-lg font-bold text-slate-900 ${isLoading ? "animate-pulse" : ""}`}>
              {isLoading ? "—" : `${avgRiskScore}% Severity`}
            </p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID Kasus, Plat, NIK, Nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--primary)] transition"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold font-mono">
          {totalCount} TOTAL KASUS TERDETEKSI
        </span>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-8 border border-red-200 bg-red-50/50 flex flex-col items-center gap-3 text-center">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <p className="text-sm font-bold text-red-900">{error}</p>
          <button
            onClick={() => fetchFraudLogs(currentPage, search)}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </Card>
      )}

      {/* Table */}
      {!error && (
        <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">ID Kasus</th>
                  <th className="px-6 py-4">Lokasi SPBU</th>
                  <th className="px-6 py-4">Vehicle ID</th>
                  <th className="px-6 py-4">Jenis Kecurangan</th>
                  <th className="px-6 py-4">Risk Index</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tindakan Sistem</th>
                  <th className="px-6 py-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  Array.from({ length: ROWS_PER_PAGE }).map((_, i) => <RowSkeleton key={i} />)
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-sm text-slate-400">
                      Tidak ada kasus fraud yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-xs">{c.case_id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700 text-xs max-w-[160px] truncate">{c.gas_station_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-white font-mono font-bold rounded text-xs tracking-wider">
                          {c.plate_number_snapshot}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-semibold text-xs">
                        {getPrimaryFraudLabel(c.detected_frauds)}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <span className={`font-bold ${c.risk_score >= 90 ? "text-[var(--primary)]" : c.risk_score >= 60 ? "text-amber-600" : "text-slate-600"}`}>
                          {c.risk_score}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {formatTime(c.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${RISK_BADGE[c.risk_level]}`}>
                          {RISK_LABEL[c.risk_level]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${ACTION_BADGE[c.risk_level]}`}>
                          {ACTION_LABEL[c.action_taken] ?? c.action_taken}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCase(c)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Berkas
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {isLoading ? "Memuat..." : `Halaman ${currentPage} dari ${totalPages} — ${totalCount} total kasus`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Prev
              </button>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl relative animate-scale-up border-t-4 border-[var(--primary)] max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-start pr-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[var(--primary)]" /> Berkas Investigasi AI
                </h3>
                <p className="text-xs text-slate-500 mt-1">Review detail kecurangan yang terdeteksi sensor nasional.</p>
              </div>
              <span className="px-2 py-0.5 bg-red-50 text-[var(--primary)] font-mono font-bold text-xs rounded border border-red-100">
                Risk Index {selectedCase.risk_score}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">ID Kasus / Plat</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {selectedCase.case_id} ({selectedCase.plate_number_snapshot})
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Lokasi SPBU</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedCase.gas_station_name}</p>
                </div>
                {selectedCase.buyer_name && (
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Nama Pembeli</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedCase.buyer_name}</p>
                  </div>
                )}
                {selectedCase.nik_snapshot && (
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">NIK</p>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {selectedCase.nik_snapshot.slice(0, 4)}****{selectedCase.nik_snapshot.slice(-4)}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Deskripsi Kejadian</p>
                  <p className="text-slate-600 leading-relaxed mt-1">
                    {buildDetails(selectedCase.detected_frauds)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">AI Risk Reasoning</p>
                  <div className="mt-1 space-y-1">
                    {selectedCase.detected_frauds.length > 0 ? (
                      selectedCase.detected_frauds.map((f, i) => (
                        <p key={i} className="font-medium text-slate-600">
                          <span className="font-bold text-slate-800">
                            {FRAUD_TYPE_LABEL[f.type] ?? f.type}
                          </span>
                          {" (+"}
                          {f.points}
                          {"pts): "}
                          {f.reason}
                        </p>
                      ))
                    ) : (
                      <p className="font-medium text-slate-500">Tidak ada fraud yang terdeteksi oleh AI engine.</p>
                    )}
                  </div>
                </div>
                {selectedCase.status === "RESOLVED" && selectedCase.resolution_notes && (
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Catatan Resolusi</p>
                    <p className="text-slate-600 leading-relaxed mt-1">{selectedCase.resolution_notes}</p>
                    {selectedCase.resolved_by_name && (
                      <p className="text-[10px] text-slate-400 mt-1">Diselesaikan oleh: {selectedCase.resolved_by_name}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Timeline Anomali Terdeteksi</p>
                <div className="space-y-3 pl-2">
                  {buildTimeline(selectedCase.detected_frauds).map((item, index, arr) => (
                    <div key={index} className="flex gap-3 text-xs relative">
                      {index !== arr.length - 1 && (
                        <div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-slate-100" />
                      )}
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 mt-0.5 border-2 border-white shadow shadow-red-200" />
                      <div className="flex-1">
                        <span className="font-mono text-[10px] font-bold text-slate-400 block">{item.seq}</span>
                        <p className="text-slate-600 leading-relaxed font-semibold">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
