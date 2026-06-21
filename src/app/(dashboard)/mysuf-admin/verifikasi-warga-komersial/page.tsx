"use client";

import { useState, useEffect } from "react";
import { X, Loader2, RefreshCw, Eye, Download, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { parseBackendDate } from "@/lib/format";

type VehicleDocument = {
  id: string;
  document_type: "STNK_PHOTO" | "VEHICLE_PHOTO" | "PRODUCTIVE_BUSINESS_PROOF";
  storage_key: string;
  original_filename: string;
};

type VehicleRequest = {
  id: string;
  buyer_profile_id: string;
  buyer_name: string;
  buyer_nik: string;
  vehicle_id: string;
  ownership_status: string;
  usage_type: "PERSONAL" | "COMMERCIAL_MOTORCYCLE" | "COMMERCIAL_CAR" | "COMMERCIAL_TRUCK";
  quota_mode: string;
  plate_number_snapshot: string;
  ktp_nfc_id_snapshot: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  review_note: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  documents: VehicleDocument[];
};

export default function VerifikasiWargaKomersialPage() {
  const [requests, setRequests] = useState<VehicleRequest[]>([]);
  const [selected, setSelected] = useState<VehicleRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const response = await fetch(`${API_BASE_URL}/vehicle-ownerships/admin/requests`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data pengajuan verifikasi.");

      const data = await response.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocumentBlob = async (requestId: string, docId: string, filename: string, autoOpen = true) => {
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const response = await fetch(
        `${API_BASE_URL}/vehicle-ownerships/admin/submissions/${requestId}/documents/${docId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengunduh berkas.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setPreviewUrls((prev) => ({ ...prev, [docId]: url }));

      if (autoOpen) {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerify = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const response = await fetch(`${API_BASE_URL}/vehicle-ownerships/admin/requests/${requestId}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status, review_note: reviewNote }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Gagal memproses verifikasi.");
      }

      await fetchRequests();
      setSelected(null);
      setReviewNote("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((item) => {
    const matchesSearch =
      item.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyer_nik.includes(searchQuery) ||
      item.plate_number_snapshot.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;

    // Filter only commercial requests (COMMERCIAL_MOTORCYCLE, COMMERCIAL_CAR, COMMERCIAL_TRUCK)
    const isCommercial =
      item.usage_type === "COMMERCIAL_MOTORCYCLE" ||
      item.usage_type === "COMMERCIAL_CAR" ||
      item.usage_type === "COMMERCIAL_TRUCK";

    return matchesSearch && matchesStatus && isCommercial;
  });

  const getDocLabel = (type: string) => {
    if (type === "STNK_PHOTO") return "Foto STNK";
    if (type === "VEHICLE_PHOTO") return "Foto Kendaraan";
    if (type === "PRODUCTIVE_BUSINESS_PROOF") return "Bukti Usaha Produktif";
    return "Dokumen Pendukung";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Verifikasi Warga Komersial"
          subtitle="Persetujuan pendaftaran kendaraan niaga (Motor, Mobil, & Truk) berdasarkan kecocokan kelas Samsat."
        />
        <Button
          variant="ghost"
          onClick={fetchRequests}
          className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-300"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama warga, NIK, atau nomor plat..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary) transition-all duration-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-(--primary) sm:w-52 transition-all duration-200"
          >
            <option value="Semua">Semua Status</option>
            <option value="PENDING">Menunggu Verifikasi</option>
            <option value="APPROVED">Disetujui</option>
            <option value="REJECTED">Ditolak</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-(--primary)" />
            <p className="text-sm font-medium">Memuat berkas pengajuan warga...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50/30">
            <p className="font-semibold">{error}</p>
            <Button onClick={fetchRequests} size="sm" className="mt-4 bg-red-600 text-white hover:bg-red-700">
              Coba Lagi
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Nama Warga</th>
                  <th className="px-5 py-3">NIK</th>
                  <th className="px-5 py-3">Nomor Plat</th>
                  <th className="px-5 py-3">Tipe Penggunaan</th>
                  <th className="px-5 py-3">Tanggal Pengajuan</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                      Tidak ada pengajuan komersial yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((item) => (
                    <tr key={item.id} className="text-sm text-slate-700 transition hover:bg-slate-50/40">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {item.buyer_name}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                        {item.buyer_nik}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {item.plate_number_snapshot}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          item.usage_type === "COMMERCIAL_MOTORCYCLE" 
                            ? "bg-sky-50 text-sky-700 ring-sky-600/20" 
                            : item.usage_type === "COMMERCIAL_CAR"
                            ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                            : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}>
                          {item.usage_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {parseBackendDate(item.submitted_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.status]}`}>
                          {item.status === "PENDING" ? "Menunggu" : item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(item);
                            setReviewNote(item.review_note || "");
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                        >
                          Detail & Verifikasi
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-(--primary)">Verifikasi Registrasi Kendaraan</p>
                <h3 className="text-lg font-bold text-slate-900">Pengajuan: {selected.buyer_name}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">Data Warga & Kendaraan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Nama Warga</p>
                      <p className="font-semibold text-slate-900">{selected.buyer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">NIK</p>
                      <p className="font-mono text-slate-700">{selected.buyer_nik}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Nomor Plat</p>
                      <p className="font-bold text-slate-900 text-base">{selected.plate_number_snapshot}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tipe Penggunaan</p>
                      <p className="font-semibold text-slate-900">{selected.usage_type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mode Kuota</p>
                      <p className="text-slate-700">{selected.quota_mode}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tanggal Pengajuan</p>
                      <p className="text-slate-700">
                        {parseBackendDate(selected.submitted_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex gap-3 text-xs text-blue-800">
                    <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold block">Pedoman Kebijakan Kelas Samsat MySuf:</span>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li><strong>COMMERCIAL_MOTORCYCLE</strong>: Harus terdaftar sebagai kelas <strong>Sepeda Motor (MOTORCYCLE)</strong> di data Samsat.</li>
                        <li><strong>COMMERCIAL_CAR</strong>: Harus terdaftar sebagai kelas <strong>Mobil (CAR)</strong> di data Samsat.</li>
                        <li><strong>COMMERCIAL_TRUCK</strong>: Harus terdaftar sebagai kelas <strong>Truk (TRUCK)</strong> di data Samsat.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">Dokumen Lampiran</h4>
                  {selected.documents.length === 0 ? (
                    <p className="text-xs text-slate-400">Tidak ada berkas yang dilampirkan.</p>
                  ) : (
                    <div className="space-y-3">
                      {selected.documents.map((doc) => (
                        <div key={doc.id} className="flex flex-col rounded-xl border border-slate-200 overflow-hidden bg-slate-50/30">
                          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 bg-slate-50">
                            <div>
                              <p className="text-xs font-bold text-slate-900">{getDocLabel(doc.document_type)}</p>
                              <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                                {doc.original_filename}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => loadDocumentBlob(selected.id, doc.id, doc.original_filename, false)}
                                className="rounded-lg p-1 hover:bg-slate-200 text-slate-600 transition"
                                title="Pratinjau"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => loadDocumentBlob(selected.id, doc.id, doc.original_filename, true)}
                                className="rounded-lg p-1 hover:bg-slate-200 text-slate-600 transition"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="p-3 flex justify-center items-center min-h-[140px] bg-slate-100/50">
                            {previewUrls[doc.id] ? (
                              doc.original_filename.toLowerCase().endsWith(".pdf") ? (
                                <div className="flex flex-col items-center text-slate-500 gap-2">
                                  <FileText className="h-10 w-10 text-slate-400" />
                                  <span className="text-xs">Dokumen PDF (Silakan unduh untuk membaca)</span>
                                </div>
                              ) : (
                                <img
                                  src={previewUrls[doc.id]}
                                  alt={doc.original_filename}
                                  className="max-h-[220px] max-w-full rounded border object-contain shadow-sm"
                                />
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={() => loadDocumentBlob(selected.id, doc.id, doc.original_filename, false)}
                                className="text-xs font-semibold text-(--primary) hover:underline flex items-center gap-1.5"
                              >
                                <Eye className="h-4 w-4" /> Tampilkan Pratinjau
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selected.status === "PENDING" ? (
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Catatan Verifikasi / Alasan Penolakan
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Tuliskan catatan verifikasi (wajib jika menolak)..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary) transition"
                  />
                </div>
              ) : (
                selected.review_note && (
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Catatan Reviewer</p>
                    <p className="mt-2 text-sm text-slate-700 italic">"{selected.review_note}"</p>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition duration-200"
              >
                Tutup
              </button>
              {selected.status === "PENDING" && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={actionLoading}
                    className="rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 px-5 py-2 text-sm font-bold transition-all duration-200"
                    onClick={() => handleVerify(selected.id, "REJECTED")}
                  >
                    {actionLoading ? "Memproses..." : "Tolak Pengajuan"}
                  </Button>
                  <Button
                    type="button"
                    disabled={actionLoading}
                    className="rounded-lg bg-(--primary) px-5 py-2 text-sm font-bold text-white hover:brightness-95 transition-all duration-200 flex items-center gap-1.5"
                    onClick={() => handleVerify(selected.id, "APPROVED")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {actionLoading ? "Memproses..." : "Setujui & Aktifkan"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
