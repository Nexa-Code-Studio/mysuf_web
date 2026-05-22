"use client";

import TopbarMenus from "@/components/layout/TopbarMenus";
import type { TopbarNotification } from "@/components/layout/TopbarMenus";

export default function SuperAdminTopbar() {
  const notifications: TopbarNotification[] = [
    {
      title: "User request baru",
      detail: "2 permintaan akses menunggu persetujuan.",
      time: "09:12",
      tone: "warning",
    },
    {
      title: "Audit log selesai",
      detail: "Rekap audit mingguan siap diunduh.",
      time: "09:30",
      tone: "neutral",
    },
    {
      title: "Percobaan akses tidak valid",
      detail: "1 IP diblokir oleh sistem keamanan.",
      time: "09:44",
      tone: "critical",
    },
  ];

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-8">
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-slate-900">
          Super Admin Console
        </h1>
        <p className="text-sm text-slate-500">Control & Governance</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <TopbarMenus
          userName="Rama Utama"
          userRole="Super Admin"
          notifications={notifications}
        />
      </div>
    </header>
  );
}
