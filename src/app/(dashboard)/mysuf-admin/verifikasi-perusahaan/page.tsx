"use client";

import { useState, useEffect } from "react";
import { X, Loader2, RefreshCw } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, BACKEND_URL } from "@/lib/api";
import { parseBackendDate } from "@/lib/format";

type CompanyData = {
  id: string;
  name: string;
  nib: string;
  fleet_size: number;
  siup_no: string;
  tdp_no: string;
  npwp_no: string;
  notes: string;
  status: string;
  submittedAt: string;
  contact: string;
  siup_doc?: string;
  tdp_doc?: string;
  npwp_doc?: string;
  nib_doc?: string;
};

export default function VerifikasiPerusahaanPage() {
  const [registrations, setRegistrations] = useState<CompanyData[]>([]);
  const [selected, setSelected] = useState<CompanyData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusStyles: Record<string, string> = {
    "Belum Verifikasi": "bg-slate-100 text-slate-700 border-slate-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const response = await fetch(`${API_BASE_URL}/companies/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data pengajuan perusahaan.");
      
      const data = await response.json();
      const mapped = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        nib: item.nib || "-",
        fleet_size: item.fleet_size || 0,
        siup_no: item.siup_no || "-",
        tdp_no: item.tdp_no || "-",
        npwp_no: item.npwp_no || "-",
        notes: item.notes || "-",
        status: item.status,
        submittedAt: parseBackendDate(item.timestamp).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        contact: item.email || "-",
        siup_doc: item.siup_doc,
        tdp_doc: item.tdp_doc,
        npwp_doc: item.npwp_doc,
        nib_doc: item.nib_doc,
      }));

      setRegistrations(mapped);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (companyId: string, status: "Approved" | "Rejected") => {
    setActionLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Gagal memproses verifikasi.");

      await fetchRegistrations();
      setSelected(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nib.includes(searchQuery) ||
      item.npwp_no.includes(searchQuery) ||
      item.siup_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tdp_no.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getDocuments = (item: CompanyData) => {
    const list = [];
    if (item.siup_doc) {
      list.push({ label: "File SIUP", fileName: item.siup_doc.split("/").pop() || "siup.pdf", url: `${BACKEND_URL}${item.siup_doc}` });
    }
    if (item.tdp_doc) {
      list.push({ label: "File TDP", fileName: item.tdp_doc.split("/").pop() || "tdp.pdf", url: `${BACKEND_URL}${item.tdp_doc}` });
    }
    if (item.npwp_doc) {
      list.push({ label: "File NPWP", fileName: item.npwp_doc.split("/").pop() || "npwp.pdf", url: `${BACKEND_URL}${item.npwp_doc}` });
    }
    if (item.nib_doc) {
      list.push({ label: "File NIB", fileName: item.nib_doc.split("/").pop() || "nib.pdf", url: `${BACKEND_URL}${item.nib_doc}` });
    }
    return list;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Verifikasi Perusahaan"
          subtitle="Persetujuan pendaftaran armada logistik dan dokumen legalitas usaha."
        />
        <Button
          variant="ghost"
          onClick={fetchRegistrations}
          className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama, NIB, SIUP, TDP, atau NPWP..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-(--primary) sm:w-52"
          >
            <option>Semua</option>
            <option>Belum Verifikasi</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-(--primary)" />
            <p className="text-sm font-medium">Memuat berkas pengajuan perusahaan...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50/30">
            <p className="font-semibold">{error}</p>
            <Button onClick={fetchRegistrations} size="sm" className="mt-4 bg-red-600 text-white hover:bg-red-700">
              Coba Lagi
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">NIB</th>
                  <th className="px-5 py-3">Total Armada</th>
                  <th className="px-5 py-3">No. SIUP</th>
                  <th className="px-5 py-3">No. TDP</th>
                  <th className="px-5 py-3">No. NPWP</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                      Tidak ada pengajuan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((item) => (
                    <tr key={item.id} className="text-sm text-slate-700 transition hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-600">
                        {item.nib}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-900">{item.fleet_size} Armada</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{item.siup_no}</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{item.tdp_no}</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{item.npwp_no}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setSelected(item)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Detail
                          </button>
                        </div>
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detail Pengajuan</p>
                <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-5 text-sm text-slate-700 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">NIB</p>
                  <p className="font-mono text-slate-700">{selected.nib}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total Armada</p>
                  <p className="font-semibold text-slate-900">{selected.fleet_size} Armada</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tanggal Pengajuan</p>
                  <p className="font-semibold text-slate-900">{selected.submittedAt}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email Kontak</p>
                  <p className="text-slate-700">{selected.contact}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Keterangan / Notes</p>
                <p className="mt-2 text-sm text-slate-700">{selected.notes}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dokumen Pendukung</p>
                {getDocuments(selected).length === 0 ? (
                  <p className="text-xs text-slate-400 mt-2">Tidak ada berkas yang diunggah.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {getDocuments(selected).map((doc) => (
                      <div key={doc.url} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{doc.label}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[250px]">{doc.fileName}</p>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-(--primary) hover:underline"
                        >
                          Lihat Dokumen
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              {selected.status === "Belum Verifikasi" && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={actionLoading}
                    className="rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 text-sm font-semibold"
                    onClick={() => handleVerify(selected.id, "Rejected")}
                  >
                    {actionLoading ? "Loading..." : "Reject"}
                  </Button>
                  <Button
                    type="button"
                    disabled={actionLoading}
                    className="rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                    onClick={() => handleVerify(selected.id, "Approved")}
                  >
                    {actionLoading ? "Loading..." : "Approve"}
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
