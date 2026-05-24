"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, BarChart3, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function GovernmentAnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analitik Nasional"
        subtitle="Sudah digabung ke dashboard utama pemerintah supaya tidak ada duplikasi tampilan."
      />

      <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900">Pusat analitik dipindahkan ke dashboard</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ringkasan subsidi, kebocoran dicegah, tingkat penyerapan, dan ketepatan sasaran sekarang tampil di dashboard pemerintah.
            </p>
            <p className="text-xs text-slate-500">
              Untuk fraud alert dan kebijakan operasional, gunakan menu Dashboard, User Eligibility, dan Dynamic Quota Control.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <ShieldAlert className="mt-0.5 w-4 h-4 text-amber-600" />
          <p className="text-xs text-amber-900">
            Menu ini dipertahankan hanya sebagai penunjuk agar pengguna lama tahu bahwa analitik nasional sudah diringkas di dashboard.
          </p>
        </div>

        <Link href="/government" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
      </Card>
    </div>
  );
}
