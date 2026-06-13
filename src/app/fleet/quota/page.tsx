"use client";

import { useEffect, useMemo, useState } from "react";
import { Coins, Info, Search, Sliders, Truck, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";

type FleetQuotaStatus = "Normal" | "High Usage" | "Watchlist";

type FleetQuotaUnit = {
  id: string;
  plate: string;
  type: string;
  driver: string;
  officialQuota: number;
  usedVolume: number;
  status: FleetQuotaStatus;
};

export default function FleetQuotaPage() {
  const [vehicles, setVehicles] = useState<FleetQuotaUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchQuotas = async () => {
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
        throw new Error("Gagal mengambil data kuota armada.");
      }

      const data = await res.json();
      
      const mapped: FleetQuotaUnit[] = data.items.map((v: any) => {
        const ratio = v.quotaLimit > 0 ? v.quotaUsed / v.quotaLimit : 0;
        let status: FleetQuotaStatus = "Normal";
        if (ratio >= 0.85) status = "Watchlist";
        else if (ratio >= 0.6) status = "High Usage";

        return {
          id: v.id,
          plate: v.plate,
          type: v.type,
          driver: v.driver,
          officialQuota: v.quotaLimit,
          usedVolume: v.quotaUsed,
          status,
        };
      });

      setVehicles(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotas();
  }, []);

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          vehicle.plate.toLowerCase().includes(query) ||
          vehicle.driver.toLowerCase().includes(query) ||
          vehicle.type.toLowerCase().includes(query);

        const matchesType = typeFilter === "All" || vehicle.type.toLowerCase().includes(typeFilter.toLowerCase());
        return matchesSearch && matchesType;
      }),
    [search, typeFilter, vehicles],
  );

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / rowsPerPage));
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalOfficialQuota = vehicles.reduce((sum, vehicle) => sum + vehicle.officialQuota, 0);
  const totalUsed = vehicles.reduce((sum, vehicle) => sum + vehicle.usedVolume, 0);
  const vehicleTypesInFleet = new Set(vehicles.map((vehicle) => vehicle.type)).size;

  return (
    <div className="space-y-6">
      <Card className="space-y-4 border border-slate-200/60 p-6 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Kuota Armada Otomatis</h1>
          <p className="mt-1 text-xs text-slate-500">
            Kuota BBM armada ditentukan pemerintah per jenis kendaraan. Perusahaan hanya memantau, tidak mengubah kuota manual.
          </p>
        </div>

        {error && (
          <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
            {error}
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-500">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Kuota Resmi (Bulan Ini)</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "..." : totalOfficialQuota} L</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-100 bg-green-50 text-green-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Terdaftar</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "..." : vehicles.length} Unit</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-600">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Variasi Model</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "..." : vehicleTypesInFleet} Jenis</p>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="flex items-start gap-3 border border-blue-100 bg-blue-50/40 p-4 text-blue-800 shadow-sm">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div className="space-y-1 text-xs">
          <p className="font-bold">Skema Kuota Armada Mengikuti Pemerintah</p>
          <p className="leading-relaxed text-slate-600">
            Kuota resmi per kendaraan mengikuti kategori kebijakan nasional (COMMERCIAL_CAR, COMMERCIAL_TRUCK). Hal ini menjaga konsistensi alokasi, tanpa input angka kuota manual dari perusahaan.
          </p>
        </div>
      </Card>

      <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        )}
        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="font-bold text-slate-900">Rincian Kuota per Unit</h3>
          <p className="mt-1 text-xs text-slate-500">Daftar unit berikut menampilkan kuota resmi, pemakaian, dan sisa kuota.</p>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari plat, driver, atau tipe..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 pl-9 text-sm text-slate-800 transition-colors focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Nomor Plat</th>
                <th className="px-6 py-4">Tipe Kendaraan</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Kuota Resmi</th>
                <th className="px-6 py-4">Pemakaian</th>
                <th className="px-6 py-4">Sisa</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    Tidak ada unit yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedVehicles.map((vehicle) => {
                  const remaining = Math.max(0, vehicle.officialQuota - vehicle.usedVolume);
                  const usagePercent = vehicle.officialQuota > 0 ? Math.min(100, Math.round((vehicle.usedVolume / vehicle.officialQuota) * 100)) : 0;

                  return (
                    <tr key={vehicle.id} className="transition hover:bg-slate-50/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-block rounded bg-slate-900 px-3 py-1 font-mono text-xs font-bold tracking-wider text-white">
                          {vehicle.plate}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">{vehicle.type}</td>
                      <td className="px-6 py-4 text-slate-600">{vehicle.driver}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">{vehicle.officialQuota} L</td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-xs space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>{vehicle.usedVolume} L</span>
                            <span>{usagePercent}%</span>
                          </div>
                          <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-pertamina-red transition-all duration-500" style={{ width: `${usagePercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">{remaining} L</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                          vehicle.status === "Normal"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : vehicle.status === "High Usage"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-red-200 bg-red-50 text-pertamina-red"
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {Math.min((currentPage - 1) * rowsPerPage + 1, filteredVehicles.length)}-
            {Math.min(currentPage * rowsPerPage, filteredVehicles.length)} dari {filteredVehicles.length} unit
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}