"use client";

import { ShieldCheck } from "lucide-react";

import TopbarMenus from "@/components/layout/TopbarMenus";
import type { TopbarNotification } from "@/components/layout/TopbarMenus";

export default function GovernmentTopbar() {
  const notifications: TopbarNotification[] = [
    {
      title: "Fraud cluster baru",
      detail: "3 kasus baru terdeteksi di wilayah Jawa Timur.",
      time: "09:02",
      tone: "critical",
    },
    {
      title: "Quota adjustment siap",
      detail: "Simulasi kebijakan kuota selesai diproses.",
      time: "09:18",
      tone: "warning",
    },
    {
      title: "Distribusi stabil",
      detail: "Monitoring nasional menunjukkan tren stabil.",
      time: "09:30",
      tone: "neutral",
    },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm font-medium text-slate-500">National Oversight</p>
        <h1 className="text-lg font-semibold text-slate-900">Government Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold text-slate-900">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          Command Ready
        </span>
        <TopbarMenus
          userName="Budi Santoso"
          userRole="Admin Pemerintah"
          notifications={notifications}
        />
      </div>
    </header>
  );
}
