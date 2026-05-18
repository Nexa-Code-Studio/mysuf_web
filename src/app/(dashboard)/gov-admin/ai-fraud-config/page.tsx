import {
  Ban,
  ShieldAlert,
  UserX,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const sensitivityOptions = [
  { label: "Low", description: "Minim false positive" },
  { label: "Medium", description: "Seimbang" },
  { label: "High", description: "Deteksi agresif" },
];

const riskMappings = [
  {
    range: "Score 0-30",
    action: "Aman (x1.0 kuota)",
  },
  {
    range: "Score 31-70",
    action: "Suspicious (Kuota dikurangi 20%)",
  },
  {
    range: "Score >70",
    action: "High Risk (Bekukan Transaksi)",
  },
];

const rules = [
  {
    id: "rapid-purchase",
    text: "Deteksi jika ada",
    first: 3,
    middle: "transaksi dalam rentang waktu",
    second: 2,
    suffix: "jam pada akun/kendaraan yang sama.",
  },
  {
    id: "multi-location",
    text: "Deteksi jika ada transaksi di lokasi berbeda dengan jarak >",
    first: 50,
    middle: "km dalam waktu kurang dari",
    second: 1,
    suffix: "jam.",
  },
  {
    id: "device-anomaly",
    text: "Deteksi jika 1 akun QR Code digunakan di",
    first: 3,
    middle: "perangkat/device berbeda dalam waktu",
    second: 24,
    suffix: "jam.",
  },
];

const emergencyActions = [
  { label: "Freeze Akun Massal", icon: UserX },
  { label: "Blacklist Kendaraan", icon: ShieldAlert },
  { label: "Suspend Kuota Wilayah", icon: Ban },
  { label: "Override Manual Policy", icon: Zap },
];

export default function AiFraudConfigPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">
          AI Fraud & Risk Configuration
        </h1>
        <p className="text-sm text-slate-500">
          Konfigurasi sensitivitas deteksi dan rule engine
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>AI Detection Sensitivity</CardTitle>
            <CardDescription>Pilih tingkat sensitivitas model</CardDescription>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            {sensitivityOptions.map((option) => (
              <label
                key={option.label}
                className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition hover:border-pertamina-red ${
                  option.label === "High"
                    ? "border-pertamina-red bg-rose-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {option.label}
                  </span>
                  <input
                    type="radio"
                    name="ai-sensitivity"
                    defaultChecked={option.label === "High"}
                    className="h-4 w-4 accent-pertamina-red"
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {option.description}
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Risk Score Actions Mapping</CardTitle>
            <CardDescription>Mapping otomatis tindakan fraud</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {riskMappings.map((mapping) => (
              <div
                key={mapping.range}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-slate-700">
                  {mapping.range}
                </span>
                <span className="text-slate-500">{mapping.action}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Rule Engine Management</CardTitle>
          <CardDescription>Kelola parameter aturan fraud</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <span>{rule.text} </span>
              <input
                type="number"
                defaultValue={rule.first}
                className="mx-2 w-14 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center text-sm focus:border-pertamina-red focus:outline-none"
              />
              <span>{rule.middle} </span>
              <input
                type="number"
                defaultValue={rule.second}
                className="mx-2 w-14 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center text-sm focus:border-pertamina-red focus:outline-none"
              />
              <span>{rule.suffix}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-rose-200 bg-rose-50 shadow-sm">
        <CardHeader>
          <CardTitle>Emergency & Manual Control Panel</CardTitle>
          <CardDescription>Aksi darurat dan override manual</CardDescription>
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {emergencyActions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.label}
                className="w-full border border-pertamina-red bg-pertamina-red/10 text-pertamina-red hover:bg-pertamina-red hover:text-white"
                variant="ghost"
              >
                <Icon className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
