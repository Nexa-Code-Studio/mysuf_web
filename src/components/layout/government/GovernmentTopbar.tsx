"use client";

import { ShieldCheck } from "lucide-react";

import TopbarMenus from "@/components/layout/TopbarMenus";
import type { TopbarNotification } from "@/components/layout/TopbarMenus";

export default function GovernmentTopbar() {
  const notifications: TopbarNotification[] = [
    {
      title: "Fraud alert prioritas",
      detail: "Kasus berisiko tinggi dari AI engine sudah diprioritaskan.",
      time: "09:02",
      tone: "critical",
    },
    {
      title: "Policy quota siap",
      detail: "Base quota dan risk modifier sudah tersedia untuk regulator.",
      time: "09:18",
      tone: "warning",
    },
    {
      title: "Dashboard ringkas",
      detail: "Tampilan pemerintah difokuskan pada ringkasan kebijakan dan alert.",
      time: "09:30",
      tone: "neutral",
    },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm font-medium text-slate-500">Government Oversight</p>
        <h1 className="text-lg font-semibold text-slate-900">Dashboard Regulator</h1>
      </div>
      <div className="flex items-center gap-3">
        <TopbarMenus
          userName="Budi Santoso"
          userRole="Admin Pemerintah"
          notifications={notifications}
        />
      </div>
    </header>
  );
}
