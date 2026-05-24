"use client";

import { useMemo, useState } from "react";
import { ShieldAlert, Search, Eye, X, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { dummyTransactions } from "@/data/dummyTransactions";
import { evaluateTransactions } from "@/lib/fraudDetection";
import type { TransactionEvaluation } from "@/types";

interface FraudCase {
  id: string;
  caseId: string;
  spbu: string;
  plate: string;
  type: string;
  riskScore: number;
  time: string;
  status: "Investigasi" | "Review" | "Tindakan" | "Selesai";
  details: string;
  timeline: { time: string; activity: string }[];
  transaction: TransactionEvaluation;
}

const evaluatedTransactions = evaluateTransactions(dummyTransactions);

const fraudCases: FraudCase[] = evaluatedTransactions
  .filter((transaction) => transaction.riskLevel !== "SAFE")
  .map((transaction) => {
    const status: FraudCase["status"] =
      transaction.riskLevel === "SUSPICIOUS"
        ? "Review"
        : transaction.riskLevel === "HIGH_RISK"
        ? "Tindakan"
        : "Investigasi";

    const primaryFraud = transaction.detectedFrauds[0];
    const fraudLabel =
      primaryFraud?.type === "RAPID_PURCHASE"
        ? "Rapid Purchase"
        : primaryFraud?.type === "MULTI_LOCATION_ABUSE"
        ? "Multi Location Abuse"
        : primaryFraud?.type === "HOUSEHOLD_ABUSE"
        ? "Household Abuse"
        : "No Fraud Detected";

    return {
      id: transaction.transactionId,
      caseId: `AI-${transaction.transactionId}`,
      spbu: `${transaction.stationName} (${transaction.stationId})`,
      plate: transaction.vehicleId,
      type: fraudLabel,
      riskScore: transaction.riskScore,
      time: new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(transaction.timestamp)),
      status,
      details:
        transaction.reasons.join(" ") ||
        "Tidak ada anomali yang terdeteksi oleh AI fraud engine.",
      timeline: transaction.detectedFrauds.length
        ? transaction.detectedFrauds.map((fraud, fraudIndex) => ({
            time: `${String(fraudIndex + 1).padStart(2, "0")}:00`,
            activity: fraud.reason,
          }))
        : [
            {
              time: "00:00",
              activity: "Tidak ada pola fraud yang terdeteksi.",
            },
          ],
      transaction,
    };
  });

export default function GovernmentFraudReportPage() {
  const [cases, setCases] = useState<FraudCase[]>(fraudCases);

  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const handleAction = (id: string, actionType: "Block" | "Dismiss" | "Escalate") => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: actionType === "Dismiss" ? "Selesai" : "Tindakan",
          };
        }
        return c;
      })
    );

    setSelectedCase(null);

    const msgMap = {
      Block: "SUKSES! Kendaraan telah masuk daftar hitam dan kuota dihentikan.",
      Dismiss: "Kasus ditutup. Transaksi ditandai aman & bersih.",
      Escalate: "Kasus dieskalasi ke Komisi Penindakan Hukum ESDM.",
    };

    setToast({ show: true, msg: msgMap[actionType] });
  };

  // Filter
  const filteredCases = useMemo(
    () =>
      cases.filter(
        (c) =>
          c.caseId.toLowerCase().includes(search.toLowerCase()) ||
          c.plate.toLowerCase().includes(search.toLowerCase()) ||
          c.type.toLowerCase().includes(search.toLowerCase()) ||
          c.spbu.toLowerCase().includes(search.toLowerCase()),
      ),
    [cases, search],
  );

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCases = filteredCases.slice((safeCurrentPage - 1) * rowsPerPage, safeCurrentPage * rowsPerPage);

  const activeCases = cases.filter((c) => c.status !== "Selesai");
  const averageRiskScore = Math.round(
    cases.reduce((sum, c) => sum + c.riskScore, 0) / Math.max(cases.length, 1)
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fraud Investigation Center"
        subtitle="Seluruh kasus, detail, dan risk score di sini diturunkan langsung dari AI fraud engine." 
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-pertamina-red flex items-center justify-center border border-red-100">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kasus Aktif (Siaga)</p>
            <p className="text-lg font-bold text-slate-900">
              {activeCases.length} Investigasi
            </p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Terselesaikan Hari Ini</p>
            <p className="text-lg font-bold text-slate-900">
              {cases.filter((c) => c.status === "Selesai").length} Kasus
            </p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Risk Index</p>
            <p className="text-lg font-bold text-slate-900">{averageRiskScore}% Severity</p>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4 border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID Kasus, Plat, Lokasi SPBU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold font-mono">DIPERBARUI TIAP 30 DETIK (LIVE)</span>
      </Card>

      {/* Table */}
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
                <th className="px-6 py-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{c.caseId}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{c.spbu}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-white font-mono font-bold rounded text-xs tracking-wider">
                      {c.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-semibold text-xs">{c.type}</td>
                  <td className="px-6 py-4 font-mono">
                    <span className={`font-bold ${c.riskScore >= 90 ? "text-pertamina-red" : "text-amber-600"}`}>
                      {c.riskScore}% Risk
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{c.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      c.status === "Investigasi"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : c.status === "Review"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : c.status === "Tindakan"
                        ? "bg-red-50 text-pertamina-red border border-red-200 animate-pulse"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCase(c)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> Berkas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {Math.min((safeCurrentPage - 1) * rowsPerPage + 1, filteredCases.length)}-
            {Math.min(safeCurrentPage * rowsPerPage, filteredCases.length)} dari {filteredCases.length} kasus
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
              disabled={safeCurrentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
              {safeCurrentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
              disabled={safeCurrentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* DETAILED BERKAS MODAL */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl relative animate-scale-up border-t-4 border-pertamina-red max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-start pr-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-pertamina-red" /> Berkas Investigasi AI
                </h3>
                <p className="text-xs text-slate-500 mt-1">Review detail kecurangan yang terdeteksi sensor nasional.</p>
              </div>
              <span className="px-2 py-0.5 bg-red-50 text-pertamina-red font-mono font-bold text-xs rounded border border-red-100">
                {selectedCase.riskScore}% Risk
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">ID Kasus / Unit</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedCase.caseId} ({selectedCase.plate})</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Lokasi Penandaan</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedCase.spbu}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Deskripsi Kejadian</p>
                  <p className="text-slate-600 leading-relaxed mt-1 text-xs">{selectedCase.details}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">AI Risk Reasoning</p>
                  <div className="mt-1 space-y-1 text-xs text-slate-600">
                    {selectedCase.transaction.detectedFrauds.length > 0 ? (
                      selectedCase.transaction.detectedFrauds.map((fraud) => (
                        <p key={fraud.type + fraud.reason} className="font-medium">
                          {fraud.type}: {fraud.reason}
                        </p>
                      ))
                    ) : (
                      <p className="font-medium">Tidak ada fraud yang terdeteksi oleh AI engine.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline events */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Timeline Anomali Terdeteksi</p>
                <div className="space-y-3 pl-2">
                  {selectedCase.timeline.map((item, index) => (
                    <div key={index} className="flex gap-3 text-xs relative">
                      {index !== selectedCase.timeline.length - 1 && (
                        <div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-slate-100" />
                      )}
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 mt-0.5 border-2 border-white shadow shadow-red-200" />
                      <div className="flex-1">
                        <span className="font-mono text-[10px] font-bold text-slate-400 block">{item.time}</span>
                        <p className="text-slate-600 leading-relaxed font-semibold">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Tindakan Keputusan Pengawas</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAction(selectedCase.id, "Block")}
                  className="py-2.5 bg-pertamina-red hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow transition active:scale-95"
                >
                  Blokir Vehicle
                </button>
                <button
                  onClick={() => handleAction(selectedCase.id, "Escalate")}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow transition active:scale-95"
                >
                  Eskalasi ESDM
                </button>
                <button
                  onClick={() => handleAction(selectedCase.id, "Dismiss")}
                  className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition active:scale-95 bg-white"
                >
                  Dismiss (Aman)
                </button>
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
