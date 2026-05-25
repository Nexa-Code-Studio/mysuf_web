"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const auditTrail = [
  {
    id: "LOG-0001",
    timestamp: "25 Mei 2026 08:14",
    actor: "Rama Utama (Super Admin)",
    action: "Approve perusahaan: PT Logistik Nusantara Maju",
    ip: "103.24.118.12",
  },
  {
    id: "LOG-0002",
    timestamp: "25 Mei 2026 08:02",
    actor: "Sari Widodo (Admin Pemerintah)",
    action: "Update bobot kelayakan: NJKB 40%",
    ip: "180.252.91.44",
  },
  {
    id: "LOG-0003",
    timestamp: "24 Mei 2026 21:45",
    actor: "Rama Utama (Super Admin)",
    action: "Reject warga komersial: KTP 3174012345678901",
    ip: "103.24.118.12",
  },
  {
    id: "LOG-0004",
    timestamp: "24 Mei 2026 19:10",
    actor: "Dewi Kusuma (Admin Perusahaan)",
    action: "Reset MFA akun perusahaan",
    ip: "36.85.101.77",
  },
  {
    id: "LOG-0005",
    timestamp: "24 Mei 2026 18:30",
    actor: "Rama Utama (Super Admin)",
    action: "Tambah user baru: Admin SPBU Bandung",
    ip: "103.24.118.12",
  },
];

export default function SuperAdminLogAktivitasPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Audit Trail"
        subtitle="Jejak aktivitas administrator untuk monitoring dan kepatuhan sistem."
      />

      <Card className="p-0 overflow-hidden border border-slate-200/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2">Timestamp</th>
                <th className="px-4 py-2">Aktor</th>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditTrail.map((item) => (
                <tr key={item.id} className="text-xs text-slate-700">
                  <td className="px-4 py-2 font-mono text-slate-600">
                    {item.timestamp}
                  </td>
                  <td className="px-4 py-2 font-semibold text-slate-900">
                    {item.actor}
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {item.action}
                  </td>
                  <td className="px-4 py-2 font-mono text-slate-500">
                    {item.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
