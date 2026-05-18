import { Info } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const baseQuota = [
  { type: "Sepeda Motor", value: 60 },
  { type: "Mobil Pribadi < 1500cc", value: 120 },
  { type: "Angkutan Umum", value: 250 },
];

const weightings = [
  { label: "Kapasitas Mesin (CC)", value: 40 },
  { label: "Umur Kendaraan", value: 35 },
  { label: "Status Pajak Kendaraan", value: 25 },
];

const vehicleMultipliers = [
  { label: "Kendaraan ke-1", value: 1.0 },
  { label: "Kendaraan ke-2", value: 0.6 },
  { label: "Kendaraan ke-3", value: 0.4 },
];

const businessMultipliers = [
  { label: "Logistik Sembako", value: 1.5 },
  { label: "Manufaktur", value: 1.0 },
  { label: "Pertanian", value: 1.2 },
];

function SliderRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <input
          type="number"
          defaultValue={value}
          className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm text-slate-700 focus:border-pertamina-red focus:outline-none"
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        defaultValue={value}
        className="w-full accent-pertamina-red"
      />
    </div>
  );
}

export default function QuotaPolicyPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Quota Policy & Eligibility Engine
          </h1>
          <p className="text-sm text-slate-500">
            Atur konfigurasi kuota dasar dan pembobotan eligibility
          </p>
        </div>
        <Button variant="secondary">Save Policy</Button>
      </header>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Base Quota Configuration</CardTitle>
          <CardDescription>Kuota dasar per jenis kendaraan</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 pb-3">Jenis Kendaraan</th>
                <th className="px-4 pb-3">Base Quota (Liter/Bulan)</th>
                <th className="px-4 pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {baseQuota.map((item) => (
                <tr key={item.type}>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {item.type}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={item.value}
                        className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-pertamina-red focus:outline-none"
                      />
                      <span className="text-sm text-slate-500">Liter</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm font-semibold text-pertamina-red hover:underline">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Eligibility Factor Weighting</CardTitle>
          <CardDescription>
            Total bobot harus 100% untuk validasi policy engine
          </CardDescription>
        </CardHeader>
        <div className="grid gap-4 lg:grid-cols-3">
          {weightings.map((item) => (
            <SliderRow key={item.label} {...item} />
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Info className="h-4 w-4" aria-hidden />
            Treshold Score Indicator
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Badge className="bg-emerald-100 text-emerald-700 font-semibold">
              Score &gt; 60: Eligible / Lolos
            </Badge>
            <Badge className="bg-amber-100 text-amber-700 font-semibold">
              Score 30-60: Review / Evaluasi
            </Badge>
            <Badge className="bg-rose-100 text-rose-600 font-semibold">
              Score &lt; 30: Non-Eligible / Tolak
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Adjustment Multipliers</CardTitle>
          <CardDescription>Faktor pengali kuota per kategori</CardDescription>
        </CardHeader>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Kepemilikan Kendaraan per KK
            </p>
            <div className="mt-4 space-y-3">
              {vehicleMultipliers.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <input
                    type="number"
                    step={0.1}
                    defaultValue={item.value}
                    className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm text-slate-700 focus:border-pertamina-red focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Kategori Usaha</p>
            <div className="mt-4 space-y-3">
              {businessMultipliers.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <input
                    type="number"
                    step={0.1}
                    defaultValue={item.value}
                    className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm text-slate-700 focus:border-pertamina-red focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
