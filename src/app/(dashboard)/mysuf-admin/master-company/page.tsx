"use client";

import { MoreVertical } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { companyDirectory } from "@/lib/mysufAdminMockData";

const statusBadge: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Suspended: "bg-red-50 text-red-600 border-red-200",
};

export default function MasterCompanyPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Direktori Perusahaan B2B"
        subtitle="Kontrol perusahaan logistik/industri dan kebijakan kuota"
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Nama Perusahaan</th>
                <th className="px-6 py-4">NIB/SIUP</th>
                <th className="px-6 py-4">Total Armada</th>
                <th className="px-6 py-4">Kuota Multiplier</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyDirectory.map((company) => (
                <tr key={company.nib} className="transition hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {company.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {company.nib}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {company.fleetTotal}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {company.multiplier}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge[company.status]}`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-block group">
                      <button className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-slate-100 bg-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                          Edit Multiplier
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50">
                          Suspend Perusahaan
                        </button>
                        <button className="w-full rounded-b-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Showing 1 to 3 of 3 entries</p>
          <div className="flex gap-1">
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded bg-[var(--primary)] px-3 py-1 text-sm font-medium text-white">
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
    </div>
  );
}
