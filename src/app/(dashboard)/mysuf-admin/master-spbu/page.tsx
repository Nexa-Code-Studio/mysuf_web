"use client";

import { useMemo, useState } from "react";
import { Check, Eye, X } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { spbuRegistrations } from "@/lib/mysufAdminMockData";

const statusTabs = ["Pending", "Approved", "Rejected"] as const;

type StatusTab = (typeof statusTabs)[number];

export default function MasterSpbuPage() {
  const [activeStatus, setActiveStatus] = useState<StatusTab>("Pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredRows = useMemo(
    () => spbuRegistrations.filter((row) => row.status === activeStatus),
    [activeStatus]
  );

  const selectedItem = spbuRegistrations.find((row) => row.id === selectedId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Verifikasi SPBU Baru"
        subtitle="Kelola pendaftaran SPBU skala nasional"
      />

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatus(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeStatus === tab
                ? "bg-(--primary) text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">ID Registrasi</th>
                <th className="px-6 py-4">Nama SPBU</th>
                <th className="px-6 py-4">Nomor Izin</th>
                <th className="px-6 py-4">Wilayah</th>
                <th className="px-6 py-4">Tanggal Pengajuan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data untuk status ini.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {row.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {row.license}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {row.region}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {row.submittedAt}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          row.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : row.status === "Rejected"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100">
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100">
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedId(row.id)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Showing {filteredRows.length} of {spbuRegistrations.length} registrations
          </p>
          <div className="flex gap-1">
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded bg-(--primary) px-3 py-1 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          />
          <Card className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedId(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Detail Berkas Izin
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-slate-500">
                  Registrasi {selectedItem.id}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Nomor Izin</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedItem.license}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Wilayah</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedItem.region}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Tanggal Pengajuan</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedItem.submittedAt}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedItem.status}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-(--primary-20) bg-(--primary-10) p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-(--primary)">
                  Catatan
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Dokumen izin operasional terlampir lengkap dan sedang diverifikasi oleh tim pusat.
                </p>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
