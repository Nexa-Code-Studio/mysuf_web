"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Search, ShieldAlert, Truck, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";

interface DriverActivityRow {
  id: string;
  name: string;
  plate: string;
  vehicleType: string;
  quotaLimit: number;
  quotaUsed: number;
  riskLevel: "Rendah" | "Sedang" | "Tinggi";
  driverStatus: "Aktif" | "Istirahat" | "Nonaktif";
  note: string;
}

const deriveRiskLevel = (quotaUsed: number, quotaLimit: number): "Rendah" | "Sedang" | "Tinggi" => {
  if (quotaLimit === 0) return "Rendah";
  const ratio = quotaUsed / quotaLimit;
  if (ratio >= 0.85) return "Tinggi";
  if (ratio >= 0.6) return "Sedang";
  return "Rendah";
};

export default function FleetDriverActivityPage() {
  const [rows, setRows] = useState<DriverActivityRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | "Rendah" | "Sedang" | "Tinggi">("All");

  const fetchActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/vehicles`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data aktivitas driver.");
      }

      const data = await res.json();
      
      // Filter to vehicles that actually have a driver assigned
      const assignedVehicles = data.items.filter((v: any) => v.driver_id !== null);
      
      const mapped: DriverActivityRow[] = assignedVehicles.map((v: any) => {
        const risk = deriveRiskLevel(v.quotaUsed, v.quotaLimit);
        const driverStatus = v.quotaUsed > 0 ? "Aktif" : "Istirahat";
        
        let note = "Unit aktif di jalur distribusi utama dengan pemakaian kuota masih aman.";
        if (risk === "Tinggi") {
          note = "Perlu pantauan karena utilisasi hampir penuh dan status risiko meningkat.";
        } else if (risk === "Sedang") {
          note = "Pemakaian mendekati batas pengawasan karena pola perjalanan cukup rapat.";
        }

        return {
          id: v.id,
          name: v.driver,
          plate: v.plate,
          vehicleType: v.type,
          quotaLimit: v.quotaLimit,
          quotaUsed: v.quotaUsed,
          riskLevel: risk,
          driverStatus,
          note,
        };
      });

      setRows(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        row.name.toLowerCase().includes(query) ||
        row.plate.toLowerCase().includes(query) ||
        row.vehicleType.toLowerCase().includes(query);

      const matchesRisk = riskFilter === "All" || row.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [rows, riskFilter, search]);

  const averageUsage = rows.length > 0
    ? Math.round(rows.reduce((total, row) => total + (row.quotaLimit > 0 ? (row.quotaUsed / row.quotaLimit) * 100 : 0), 0) / rows.length)
    : 0;
  const highRiskCount = rows.filter((row) => row.riskLevel === "Tinggi").length;
  const activeCount = rows.filter((row) => row.driverStatus === "Aktif").length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Ringkasan Aktivitas Driver"
        subtitle="Halaman ini menampilkan pasangan driver-unit aktif, sisa kuota, dan status pemakaian realtime."
      />

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
          {error}
        </Card>
      )}

      {isLoading && rows.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Driver Aktif (Bekerja)</p>
                <p className="text-lg font-bold text-slate-900">{activeCount} Orang</p>
              </div>
            </Card>

            <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Unit Risiko Tinggi</p>
                <p className="text-lg font-bold text-slate-900">{highRiskCount} Unit</p>
              </div>
            </Card>

            <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rata-Rata Pemakaian</p>
                <p className="text-lg font-bold text-slate-900">{averageUsage}% Kuota</p>
              </div>
            </Card>
          </div>

          <Card className="flex flex-col gap-4 border border-slate-200/60 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari driver, plat, atau jenis kendaraan..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-700 transition-colors focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="flex w-full gap-2 md:w-auto">
              {(["All", "Rendah", "Sedang", "Tinggi"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRiskFilter(option)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-xs font-semibold transition md:flex-initial ${
                    riskFilter === option
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option === "All" ? "Semua Risiko" : option}
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            )}
            <div className="border-b border-slate-100 bg-slate-50/50 p-5">
              <h3 className="font-bold text-slate-900">Driver, Unit, dan Risiko</h3>
              <p className="mt-1 text-xs text-slate-500">Menampilkan status pemakaian bahan bakar per driver-unit terhubung.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Unit</th>
                    <th className="px-6 py-4">Kuota Resmi</th>
                    <th className="px-6 py-4">Pemakaian</th>
                    <th className="px-6 py-4">Risiko</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Catatan Singkat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                        Tidak ada aktivitas driver yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => {
                      const utilization = row.quotaLimit > 0 ? Math.min(100, Math.round((row.quotaUsed / row.quotaLimit) * 100)) : 0;

                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition">
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                                {row.name.substring(0, 1)}
                              </div>
                              <div>
                                <p>{row.name}</p>
                                <p className="text-[11px] text-slate-400">{row.vehicleType}</p>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-800">
                              {row.plate}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-600">{row.quotaLimit} L/bulan</td>
                          <td className="px-6 py-4">
                            <div className="w-full max-w-xs space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                <span>{row.quotaUsed} L</span>
                                <span>{utilization}%</span>
                              </div>
                              <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-pertamina-red transition-all duration-500" style={{ width: `${utilization}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                                row.riskLevel === "Tinggi"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : row.riskLevel === "Sedang"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : "border-green-200 bg-green-50 text-green-700"
                              }`}
                            >
                              {row.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                                row.driverStatus === "Aktif"
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : "border-sky-200 bg-sky-50 text-sky-700"
                              }`}
                            >
                              {row.driverStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">{row.note}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
