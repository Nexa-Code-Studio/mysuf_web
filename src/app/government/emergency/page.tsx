"use client";

import { ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function GovernmentEmergencyPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Emergency Control"
        subtitle="Fitur ini belum diaktifkan pada prototype dan tidak disediakan untuk operasional saat ini."
      />

      <Card className="p-6 border border-slate-200/60 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900">Prototype only</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Emergency control dan lockdown tidak diaktifkan pada tahap ini. Fokus prototype adalah
              dashboard regulator, eligibility, quota policy, dan fraud monitoring.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
