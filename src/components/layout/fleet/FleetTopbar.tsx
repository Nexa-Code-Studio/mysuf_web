"use client";

import { ClipboardCheck } from "lucide-react";

import TopbarMenus from "@/components/layout/TopbarMenus";
import type { TopbarNotification } from "@/components/layout/TopbarMenus";

export default function FleetTopbar() {
  const notifications: TopbarNotification[] = [
    {
      title: "Unit TR-1145 maintenance",
      detail: "Jadwal maintenance diperpanjang 2 jam.",
      time: "07:40",
      tone: "warning",
    },
    {
      title: "Driver compliance",
      detail: "2 driver belum submit laporan harian.",
      time: "08:05",
      tone: "critical",
    },
    {
      title: "Konsumsi BBM stabil",
      detail: "Konsumsi mingguan sesuai target efisiensi.",
      time: "08:25",
      tone: "neutral",
    },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm font-medium text-slate-500">Fleet Management</p>
        <h1 className="text-lg font-semibold text-slate-900">Corporate Logistics</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-pertamina-red/10 px-3 py-1 text-xs font-semibold text-pertamina-red">
          <ClipboardCheck className="h-4 w-4" aria-hidden />
          Compliance Ready
        </span>
        <TopbarMenus
          userName="Sinta Kartika"
          userRole="Admin Perusahaan"
          notifications={notifications}
        />
      </div>
    </header>
  );
}
