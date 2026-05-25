"use client";

import { useState } from "react";
import { X } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const applicants = [
  {
    id: "WK-001",
    name: "Raka Pratama",
    ktp: "3174012345678901",
    nib: "912000845612",
    stnk: "B 1123 RQ",
    profession: "Ojol",
    submittedAt: "21 Mei 2026",
    notes: "Mengajukan subsidi untuk operasional ojol harian.",
    status: "Belum Verifikasi",
    documents: [
      { label: "Scan KTP", fileName: "KTP_Raka.jpg", url: "/mock/ktp-raka.jpg" },
      { label: "NIB", fileName: "NIB_Raka.pdf", url: "/mock/nib-raka.pdf" },
      { label: "STNK", fileName: "STNK_Raka.pdf", url: "/mock/stnk-raka.pdf" },
    ],
  },
  {
    id: "WK-002",
    name: "Siti Amalia",
    ktp: "3201023456789012",
    nib: "912000112099",
    stnk: "D 8819 XA",
    profession: "UMKM",
    submittedAt: "22 Mei 2026",
    notes: "Validasi data usaha mikro untuk distribusi bahan pokok.",
    status: "Approved",
    documents: [
      { label: "Scan KTP", fileName: "KTP_Siti.jpg", url: "/mock/ktp-siti.jpg" },
      { label: "NIB", fileName: "NIB_Siti.pdf", url: "/mock/nib-siti.pdf" },
      { label: "STNK", fileName: "STNK_Siti.pdf", url: "/mock/stnk-siti.pdf" },
    ],
  },
  {
    id: "WK-003",
    name: "Agus Firmansyah",
    ktp: "3275034567890123",
    nib: "912000777552",
    stnk: "L 2301 VM",
    profession: "Ojol",
    submittedAt: "23 Mei 2026",
    notes: "Pengajuan terlampir untuk kendaraan roda dua aktif harian.",
    status: "Rejected",
    documents: [
      { label: "Scan KTP", fileName: "KTP_Agus.jpg", url: "/mock/ktp-agus.jpg" },
      { label: "NIB", fileName: "NIB_Agus.pdf", url: "/mock/nib-agus.pdf" },
      { label: "STNK", fileName: "STNK_Agus.pdf", url: "/mock/stnk-agus.pdf" },
    ],
  },
];

export default function VerifikasiWargaKomersialPage() {
  const [selected, setSelected] = useState<(typeof applicants)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const statusStyles: Record<string, string> = {
    "Belum Verifikasi": "bg-slate-100 text-slate-700 border-slate-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const filteredApplicants = applicants.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ktp.includes(searchQuery) ||
      item.nib.includes(searchQuery) ||
      item.stnk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.profession.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Verifikasi Warga Komersial"
        subtitle="Validasi KTP, NIB, dan STNK warga berprofesi Ojol atau UMKM."
      />

      <Card className="p-0 overflow-hidden border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama, KTP, NIB, STNK, atau profesi..."
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">KTP</th>
                <th className="px-5 py-3">NIB</th>
                <th className="px-5 py-3">STNK</th>
                <th className="px-5 py-3">Profesi</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.map((item) => (
                <tr key={item.id} className="text-sm text-slate-700">
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">
                    {item.ktp}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">
                    {item.nib}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{item.stnk}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {item.profession}
                    </span>
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>
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

            <div className="space-y-6 px-6 py-5 text-sm text-slate-700">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">KTP</p>
                  <p className="font-mono text-slate-700">{selected.ktp}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">NIB</p>
                  <p className="font-mono text-slate-700">{selected.nib}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">STNK</p>
                  <p className="font-semibold text-slate-900">{selected.stnk}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Profesi</p>
                  <p className="font-semibold text-slate-900">{selected.profession}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tanggal Pengajuan</p>
                  <p className="font-semibold text-slate-900">{selected.submittedAt}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Keterangan</p>
                <p className="mt-2 text-sm text-slate-700">{selected.notes}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dokumen Pendukung</p>
                <div className="mt-3 space-y-2">
                  {selected.documents.map((doc) => (
                    <div key={doc.fileName} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{doc.label}</p>
                        <p className="text-xs text-slate-500">{doc.fileName}</p>
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
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reject
              </button>
              <button
                type="button"
                className="rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
