"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Eye, FileText, Plus, Search, ShieldAlert, Truck, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { BASE_QUOTA_BY_VEHICLE_TYPE } from "@/lib/quotaEngine";
import type { VehicleType } from "@/types";

type FleetVehicleStatus = "Idle" | "On Route";
type FleetRiskLevel = "Rendah" | "Sedang" | "Tinggi";

type FleetVehicle = {
  id: string;
  plate: string;
  type: VehicleType;
  driver: string;
  status: FleetVehicleStatus;
  quotaLimit: number;
  quotaUsed: number;
};

type VehicleFormState = {
  plate: string;
  type: VehicleType;
};

const vehicleTypeOptions: Array<{ value: VehicleType; label: string }> = [
  { value: "motorcycle", label: "Motorcycle" },
  { value: "passenger_car", label: "Passenger Car" },
  { value: "pickup", label: "Pickup" },
  { value: "truck", label: "Truck" },
  { value: "box_cargo", label: "Box Cargo" },
  { value: "tanker", label: "Tanker" },
  { value: "van", label: "Van" },
];

const statusOptions: FleetVehicleStatus[] = ["Idle", "On Route"];

const formatVehicleTypeLabel = (value: VehicleType) => vehicleTypeOptions.find((option) => option.value === value)?.label ?? value;

const deriveRiskLevel = (quotaUsed: number, quotaLimit: number): FleetRiskLevel => {
  if (quotaLimit === 0) {
    return "Rendah";
  }

  const usageRatio = quotaUsed / quotaLimit;

  if (usageRatio >= 0.85) {
    return "Tinggi";
  }

  if (usageRatio >= 0.6) {
    return "Sedang";
  }

  return "Rendah";
};

const createVehicle = (
  id: string,
  plate: string,
  type: VehicleType,
  driver: string,
  status: FleetVehicleStatus,
  quotaUsed: number,
): FleetVehicle => ({
  id,
  plate,
  type,
  driver,
  status,
  quotaLimit: BASE_QUOTA_BY_VEHICLE_TYPE[type] ?? 0,
  quotaUsed,
});

export default function FleetVehiclesPage() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([
    createVehicle("1", "B 8821 TQ", "tanker", "Rizal Wibowo", "On Route", 140),
    createVehicle("2", "B 1145 WX", "box_cargo", "Belum Ditugaskan", "Idle", 80),
    createVehicle("3", "B 4512 PK", "pickup", "Agus Pratama", "On Route", 15),
    createVehicle("4", "B 9902 KAA", "tanker", "Rama Utama", "Idle", 210),
    createVehicle("5", "D 2219 BZ", "van", "Belum Ditugaskan", "Idle", 30),
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FleetVehicleStatus | "All">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [pendingDeleteVehicle, setPendingDeleteVehicle] = useState<FleetVehicle | null>(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [newVehicle, setNewVehicle] = useState<VehicleFormState>({
    plate: "",
    type: "box_cargo",
  });

  const openModal = () => {
    setNewVehicle({ plate: "", type: "box_cargo" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const quotaPreview = BASE_QUOTA_BY_VEHICLE_TYPE[newVehicle.type] ?? 0;

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          vehicle.plate.toLowerCase().includes(query) ||
          vehicle.driver.toLowerCase().includes(query) ||
          formatVehicleTypeLabel(vehicle.type).toLowerCase().includes(query);

        const matchesStatus = statusFilter === "All" || vehicle.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter, vehicles],
  );

  const totalVehicles = vehicles.length;
  const onRouteCount = vehicles.filter((vehicle) => vehicle.status === "On Route").length;
  const idleCount = vehicles.filter((vehicle) => vehicle.status === "Idle").length;
  const highRiskCount = vehicles.filter((vehicle) => deriveRiskLevel(vehicle.quotaUsed, vehicle.quotaLimit) === "Tinggi").length;

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / rowsPerPage));
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleAddVehicle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newVehicle.plate.trim()) {
      return;
    }

    const vehicleToAdd = createVehicle(
      Date.now().toString(),
      newVehicle.plate.toUpperCase(),
      newVehicle.type,
      "Belum Ditugaskan",
      "Idle",
      0,
    );

    setVehicles((prev) => [vehicleToAdd, ...prev]);
    setCurrentPage(1);
    closeModal();
    setToast({ show: true, msg: `Armada ${vehicleToAdd.plate} berhasil didaftarkan.` });
  };

  const requestDeleteVehicle = (vehicle: FleetVehicle) => {
    setPendingDeleteVehicle(vehicle);
  };

  const confirmDeleteVehicle = () => {
    if (!pendingDeleteVehicle) {
      return;
    }

    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== pendingDeleteVehicle.id));
    setToast({ show: true, msg: `Unit ${pendingDeleteVehicle.plate} berhasil dihapus.` });
    setPendingDeleteVehicle(null);
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 border border-slate-200/60 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Daftar Kendaraan</h1>
            <p className="mt-1 text-xs text-slate-500">
              Perusahaan hanya mendaftarkan kendaraan. Status awal otomatis Idle, lalu kuota dan risiko mengikuti kategori kendaraan.
            </p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="self-start rounded-xl bg-[#e31837] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95"
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Daftarkan Kendaraan
            </span>
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Armada</p>
              <p className="text-xl font-bold text-slate-900">{totalVehicles} Unit</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">On Route</p>
              <p className="text-xl font-bold text-green-700">{onRouteCount} Unit</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Idle</p>
              <p className="text-xl font-bold text-slate-900">{idleCount} Unit</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-[#e31837]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk Tinggi</p>
              <p className="text-xl font-bold text-slate-900">{highRiskCount} Unit</p>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 border border-slate-200/60 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari plat, tipe, atau driver..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-700 transition focus:border-[#e31837] focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          {(["All", ...statusOptions] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`flex-1 rounded-lg border px-4 py-2 text-xs font-semibold transition md:flex-initial ${
                statusFilter === status
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status === "All" ? "Semua Status" : status}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="font-bold text-slate-900">Daftar Kendaraan</h3>
          <p className="mt-1 text-xs text-slate-500">Pengemudi di sini berarti driver yang sedang ditugaskan saat ini.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left text-sm">
            <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Nomor Plat</th>
                <th className="px-6 py-4">Jenis Kendaraan</th>
                <th className="px-6 py-4">Pengemudi Saat Ini</th>
                <th className="px-6 py-4">Kuota Resmi</th>
                <th className="px-6 py-4">Sisa Kuota</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                    Tidak ada kendaraan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedVehicles.map((vehicle) => {
                  const remaining = Math.max(0, vehicle.quotaLimit - vehicle.quotaUsed);
                  const usagePercent = vehicle.quotaLimit > 0 ? Math.min(100, Math.round((vehicle.quotaUsed / vehicle.quotaLimit) * 100)) : 0;
                  const risk = deriveRiskLevel(vehicle.quotaUsed, vehicle.quotaLimit);

                  return (
                    <tr key={vehicle.id} className="transition hover:bg-slate-50/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-block rounded bg-slate-900 px-3 py-1 font-mono text-xs font-bold tracking-wider text-white">
                          {vehicle.plate}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">{formatVehicleTypeLabel(vehicle.type)}</td>
                      <td className="px-6 py-4 text-slate-600">{vehicle.driver}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">{vehicle.quotaLimit} L</td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-xs space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>{remaining} L</span>
                            <span>{usagePercent}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-[#e31837] transition-all duration-500" style={{ width: `${usagePercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            risk === "Tinggi"
                              ? "border-red-200 bg-red-50 text-[#e31837]"
                              : risk === "Sedang"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-green-200 bg-green-50 text-green-700"
                          }`}
                        >
                          {risk}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            vehicle.status === "On Route"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-sky-200 bg-sky-50 text-sky-700"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setSelectedVehicle(vehicle)} className="p-1 text-slate-400 transition-all hover:text-[#e31837]">
                            <Eye className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/fleet/vehicles/${encodeURIComponent(vehicle.plate)}/transactions`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                          >
                            <FileText className="h-3.5 w-3.5" /> Transaksi
                          </Link>
                          <button type="button" onClick={() => requestDeleteVehicle(vehicle)} className="p-1 text-slate-400 transition-all hover:text-red-600">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
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
            {Math.min(currentPage * rowsPerPage, filteredVehicles.length)} dari {filteredVehicles.length} kendaraan
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 space-y-1">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Truck className="h-5 w-5 text-[#e31837]" /> Daftarkan Kendaraan Baru
              </h3>
              <p className="text-xs text-slate-500">Status awal otomatis Idle, kuota mengikuti kategori kendaraan, dan risk dihitung dari pemakaian.</p>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nomor Plat</span>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 1234 CDG"
                  value={newVehicle.plate}
                  onChange={(event) => setNewVehicle((current) => ({ ...current, plate: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm uppercase tracking-wider text-slate-800 placeholder:text-slate-400 focus:border-[#e31837] focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Jenis Kendaraan</span>
                <select
                  value={newVehicle.type}
                  onChange={(event) => setNewVehicle((current) => ({ ...current, type: event.target.value as VehicleType }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#e31837] focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  {vehicleTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {BASE_QUOTA_BY_VEHICLE_TYPE[option.value]} L
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Kuota Resmi Otomatis</p>
                <p className="mt-1">
                  {formatVehicleTypeLabel(newVehicle.type)} mendapat kuota {quotaPreview} liter per hari sesuai kebijakan pemerintah.
                </p>
                <p className="mt-2 text-slate-500">Status awal kendaraan akan langsung Idle dan pengemudi bisa ditugaskan lewat menu Daftar Driver.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#e31837] px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95"
                >
                  Daftarkan Unit
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedVehicle(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Eye className="h-5 w-5 text-[#e31837]" /> Detail Kendaraan
              </h3>
              <p className="text-xs text-slate-500">Ringkasan unit tanpa mengubah alur daftar kendaraan.</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Nomor Plat</p>
                <p className="mt-1 font-mono text-sm font-bold text-slate-800">{selectedVehicle.plate}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Jenis Kendaraan</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{formatVehicleTypeLabel(selectedVehicle.type)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Pengemudi Saat Ini</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedVehicle.driver}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Status Operasional</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedVehicle.status}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Kuota Resmi</span>
                <span>
                  {selectedVehicle.quotaUsed} L / {selectedVehicle.quotaLimit} L
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#e31837]"
                  style={{
                    width: `${selectedVehicle.quotaLimit > 0 ? Math.min(100, Math.round((selectedVehicle.quotaUsed / selectedVehicle.quotaLimit) * 100)) : 0}%`,
                  }}
                />
              </div>
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Risk: <span className="font-semibold text-slate-900">{deriveRiskLevel(selectedVehicle.quotaUsed, selectedVehicle.quotaLimit)}</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">Kuota kendaraan mengikuti kebijakan pemerintah dan tidak dapat diubah manual dari sisi perusahaan.</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </Card>
        </div>
      )}

      {pendingDeleteVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setPendingDeleteVehicle(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Kendaraan</h3>
              <p className="text-xs text-slate-500">
                Unit {pendingDeleteVehicle.plate} akan dihapus dari daftar armada perusahaan.
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Detail Unit</p>
              <p className="mt-1">Plat: {pendingDeleteVehicle.plate}</p>
              <p className="mt-1">Jenis: {formatVehicleTypeLabel(pendingDeleteVehicle.type)}</p>
              <p className="mt-1">Driver: {pendingDeleteVehicle.driver}</p>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteVehicle(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteVehicle}
                className="flex-1 rounded-lg bg-[#e31837] px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </Card>
        </div>
      )}

      <Toast message={toast.msg} isVisible={toast.show} onClose={() => setToast({ show: false, msg: "" })} />
    </div>
  );
}
