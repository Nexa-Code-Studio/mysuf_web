"use client";

import { useState } from "react";
import { X } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const registrations = [
  {
    id: "REG-CO-001",
    name: "PT Logistik Nusantara Maju",
    nib: "912000123456",
    fleetTotal: "54 Unit",
    siup: "SIUP-32.01.2026.8892",
    tdp: "TDP-09.12.2026.0144",
    npwp: "02.345.678.9-123.000",
    submittedAt: "20 Mei 2026",
    contact: "operasional@logistikmaju.co.id",
    notes: "Pengajuan armada logistik lintas provinsi untuk distribusi bahan pokok.",
    status: "Belum Verifikasi",
    documents: [
      { label: "File SIUP", fileName: "SIUP_PT_Logistik.pdf", url: "/mock/siup-logistik.pdf" },
      { label: "File TDP", fileName: "TDP_PT_Logistik.pdf", url: "/mock/tdp-logistik.pdf" },
      { label: "File NPWP", fileName: "NPWP_PT_Logistik.pdf", url: "/mock/npwp-logistik.pdf" },
    ],
  },
  {
    id: "REG-CO-002",
    name: "CV Fast Delivery",
    nib: "912000654321",
    fleetTotal: "26 Unit",
    siup: "SIUP-31.11.2026.5532",
    tdp: "TDP-11.08.2026.3311",
    npwp: "01.889.221.4-920.000",
    submittedAt: "22 Mei 2026",
    contact: "admin@fastdelivery.id",
    notes: "Armada komersial untuk last mile delivery area Jabodetabek.",
    status: "Approved",
    documents: [
      { label: "File SIUP", fileName: "SIUP_CV_Fast.pdf", url: "/mock/siup-fast.pdf" },
      { label: "File TDP", fileName: "TDP_CV_Fast.pdf", url: "/mock/tdp-fast.pdf" },
      { label: "File NPWP", fileName: "NPWP_CV_Fast.pdf", url: "/mock/npwp-fast.pdf" },
    ],
  },
  {
    id: "REG-CO-003",
    name: "PT Mitra Distribusi Utama",
    nib: "912000112233",
    fleetTotal: "41 Unit",
    siup: "SIUP-35.05.2026.1121",
    tdp: "TDP-07.12.2026.7789",
    npwp: "03.551.889.1-998.000",
    submittedAt: "24 Mei 2026",
    contact: "legal@mitradistribusi.id",
    notes: "Pengajuan armada distribusi regional dengan rute antar kota.",
    status: "Rejected",
    documents: [
      { label: "File SIUP", fileName: "SIUP_Mitra.pdf", url: "/mock/siup-mitra.pdf" },
      { label: "File TDP", fileName: "TDP_Mitra.pdf", url: "/mock/tdp-mitra.pdf" },
      { label: "File NPWP", fileName: "NPWP_Mitra.pdf", url: "/mock/npwp-mitra.pdf" },
    ],
  },
];

export default function VerifikasiPerusahaanPage() {
  const [selected, setSelected] = useState<(typeof registrations)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const statusStyles: Record<string, string> = {
    "Belum Verifikasi": "bg-slate-100 text-slate-700 border-slate-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const filteredRegistrations = registrations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nib.includes(searchQuery) ||
      item.npwp.includes(searchQuery) ||
      item.siup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tdp.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Verifikasi Perusahaan"
        subtitle="Persetujuan pendaftaran armada logistik dan dokumen legalitas usaha."
      />

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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">NIB</th>
                <th className="px-5 py-3">Total Armada</th>
                <th className="px-5 py-3">Surat Izin Usaha Perdagangan</th>
                <th className="px-5 py-3">Tanda Daftar Perusahaan</th>
                <th className="px-5 py-3">NPWP Badan Usaha</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((item) => (
                <tr key={item.id} className="text-sm text-slate-700">
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">
                    {item.nib}
                  </td>
                  <td className="px-5 py-3">{item.fleetTotal}</td>
                  <td className="px-5 py-3 text-xs text-slate-600">{item.siup}</td>
                  <td className="px-5 py-3 text-xs text-slate-600">{item.tdp}</td>
                  <td className="px-5 py-3 text-xs text-slate-600">{item.npwp}</td>
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
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">NIB</p>
                  <p className="font-mono text-slate-700">{selected.nib}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total Armada</p>
                  <p className="font-semibold text-slate-900">{selected.fleetTotal}</p>
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
