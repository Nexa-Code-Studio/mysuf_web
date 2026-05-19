import Link from "next/link";
import { Building2, ShieldCheck, Truck } from "lucide-react";

import { Card } from "@/components/ui/Card";

const roleCards = [
  {
    href: "/login/spbu",
    label: "Login Admin SPBU",
    hint: "Operasional harian, monitoring realtime, fraud alert.",
    role: "Admin SPBU",
    icon: Building2,
  },
  {
    href: "/login/government",
    label: "Login Admin Pemerintah",
    hint: "Kendali subsidi nasional, heatmap distribusi, kontrol kuota.",
    role: "Admin Pemerintah",
    icon: ShieldCheck,
  },
  {
    href: "/login/fleet",
    label: "Login Admin Perusahaan",
    hint: "Manajemen armada, driver, dan efisiensi konsumsi.",
    role: "Admin Perusahaan",
    icon: Truck,
  },
];

export default function LoginPage() {
  return (
    <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          MySuF National Fuel Dashboard
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">
          Multi-role dashboard untuk operasional SPBU, pemerintah, dan perusahaan.
        </h1>
        <p className="text-base text-slate-600">
          Pilih peran Anda untuk masuk ke command center sesuai kewenangan.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Status Sistem</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Uptime</p>
              <p className="text-lg font-semibold text-slate-900">99.98%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Node Aktif</p>
              <p className="text-lg font-semibold text-slate-900">128 SPBU</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Incident</p>
              <p className="text-lg font-semibold text-pertamina-red">2 Alert</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {roleCards.map((option) => (
          <Link key={option.href} href={option.href} className="block">
            <Card className="flex items-center justify-between gap-4 transition hover:border-pertamina-red/40">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pertamina-red/10 text-pertamina-red">
                  <option.icon className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-500">{option.hint}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {option.role}
                  </p>
                </div>
              </div>
              <span className="rounded-xl bg-pertamina-red px-4 py-2 text-xs font-semibold text-white">
                Pilih
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
