import { MoreVertical, Search } from "lucide-react";

import ProgressBar from "@/components/company/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const drivers = [
  {
    name: "Ahmad Riyadi",
    initials: "AR",
    nik: "3201234567890001",
    vehicle: "B 9012 CDE",
    vehicleType: "Truk Engkel",
    dailyValue: 45,
    dailyLimit: 100,
    active: true,
  },
  {
    name: "Fajar Pratama",
    initials: "FP",
    nik: "3201234567890002",
    vehicle: "D 4567 FGH",
    vehicleType: "Mobil Pick Up",
    dailyValue: 78,
    dailyLimit: 100,
    active: true,
  },
  {
    name: "Siti Mariani",
    initials: "SM",
    nik: "3201234567890003",
    vehicle: "B 7788 HJK",
    vehicleType: "Truk Tangki",
    dailyValue: 92,
    dailyLimit: 100,
    active: true,
  },
  {
    name: "Rudi Hartono",
    initials: "RH",
    nik: "3201234567890004",
    vehicle: "B 4433 ZZA",
    vehicleType: "Mobil Box",
    dailyValue: 24,
    dailyLimit: 100,
    active: false,
  },
  {
    name: "Nadia Putri",
    initials: "NP",
    nik: "3201234567890005",
    vehicle: "F 1122 QWE",
    vehicleType: "Truk Engkel",
    dailyValue: 60,
    dailyLimit: 100,
    active: true,
  },
];

function StatusToggle({ active }: { active: boolean }) {
  return (
    <div
      className={`relative h-6 w-11 rounded-full transition ${
        active ? "bg-pertamina-red" : "bg-slate-200"
      }`}
      aria-hidden
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          active ? "left-5" : "left-0.5"
        }`}
      />
    </div>
  );
}

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">
          Driver Assignment & Monitoring
        </h1>
        <p className="text-sm text-slate-500">
          Manage drivers and monitor daily fuel consumption
        </p>
      </header>

      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search driver by name or NIK..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 focus:border-pertamina-red focus:outline-none"
          />
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 sm:w-auto">
            <option>All Vehicles</option>
            <option>Truk Engkel</option>
            <option>Mobil Pick Up</option>
            <option>Truk Tangki</option>
          </select>
          <Button variant="secondary" className="w-full sm:w-auto">
            + Assign Driver
          </Button>
        </div>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Driver List</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 pb-3">Driver Name</th>
                <th className="px-4 pb-3">NIK</th>
                <th className="px-4 pb-3">Assigned Vehicle</th>
                <th className="px-4 pb-3">Daily Consumption</th>
                <th className="px-4 pb-3">Status</th>
                <th className="px-4 pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map((driver) => (
                <tr key={driver.nik}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {driver.initials}
                      </div>
                      <p className="font-semibold text-slate-800">
                        {driver.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{driver.nik}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      {driver.vehicle}
                    </p>
                    <p className="text-xs text-slate-500">
                      {driver.vehicleType}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <ProgressBar value={driver.dailyValue} max={driver.dailyLimit} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusToggle active={driver.active} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-100 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center">
          <span>Showing 1 to 5 of 24 entries</span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500">
              Previous
            </button>
            <button className="rounded-lg bg-pertamina-red px-3 py-1.5 font-semibold text-white">
              1
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500">
              2
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500">
              3
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
