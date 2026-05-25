"use client";

import { Radio } from "lucide-react";
import { usePathname } from "next/navigation";

import TopbarMenus from "@/components/layout/TopbarMenus";
import type { TopbarNotification } from "@/components/layout/TopbarMenus";

export default function SpbuTopbar() {
  const pathname = usePathname();

  const pageMeta = [
    {
      prefix: "/spbu/staff",
      title: "Staff Management",
      subtitle: "Petugas SPBU",
      badge: null,
    },
    {
      prefix: "/spbu/transactions",
      title: "Transaksi BBM",
      subtitle: "Rekap transaksi harian",
      badge: "Realtime Monitoring",
    },
    {
      prefix: "/spbu/fraud-alert",
      title: "Fraud Alert",
      subtitle: "Pantau aktivitas anomali",
      badge: "Realtime Monitoring",
    },
    {
      prefix: "/spbu/activity",
      title: "Riwayat Aktivitas",
      subtitle: "Log operasional harian",
      badge: "Realtime Monitoring",
    },
  ];

  const currentMeta =
    pageMeta.find((meta) => pathname.startsWith(meta.prefix)) ??
    ({
      title: "Dashboard SPBU",
      subtitle: "Operasional Harian",
      badge: "Realtime Monitoring",
    } as const);

  const notifications: TopbarNotification[] = [
    {
      title: "Fraud alert terdeteksi",
      detail: "Pengisian berulang pada kendaraan B 9123 KZ.",
      time: "08:12",
      tone: "critical",
    },
    {
      title: "Queue peak hour",
      detail: "Antrian naik 18% dibanding jam sebelumnya.",
      time: "08:27",
      tone: "warning",
    },
    {
      title: "Stok nozzle aman",
      detail: "Stok nozzle utama masih di atas 65%.",
      time: "08:40",
      tone: "neutral",
    },
  ];

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-8">
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-slate-900">
          {currentMeta.title}
        </h1>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <TopbarMenus
          userName="Rama Utama"
          userRole="Admin SPBU"
          notifications={notifications}
        />
      </div>
    </header>
  );
}
