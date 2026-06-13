"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle, Clock, Search, Truck, UserCheck, UserPlus, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { API_BASE_URL } from "@/lib/api";

type DriverStatus = "Aktif" | "Standby" | "Nonaktif";

type DriverRegistry = {
  id: string;
  name: string;
  email: string;
  assignedUnit: string | null;
  vehicleType: string | null;
  vehicleOwnershipId: string | null;
  status: DriverStatus;
};

type VehicleItem = {
  id: string;
  plate: string;
  type: string;
  driver: string;
  driver_id: string | null;
};

export default function FleetAssignDriverPage() {
  const [drivers, setDrivers] = useState<DriverRegistry[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "All">("All");
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [pendingAssignmentDriver, setPendingAssignmentDriver] = useState<DriverRegistry | null>(null);
  const [pendingUnassignDriver, setPendingUnassignDriver] = useState<DriverRegistry | null>(null);
  const [selectedUnitPlate, setSelectedUnitPlate] = useState("");
  const rowsPerPage = 5;

  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    password: "mysuf123", // default password
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      // 1. Fetch vehicles
      const vehiclesRes = await fetch(`${API_BASE_URL}/fleet/vehicles`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!vehiclesRes.ok) throw new Error("Gagal mengambil data kendaraan.");
      const vehiclesData = await vehiclesRes.json();
      setVehicles(vehiclesData.items);

      // 2. Fetch drivers
      const driversRes = await fetch(`${API_BASE_URL}/fleet/drivers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!driversRes.ok) throw new Error("Gagal mengambil data driver.");
      const driversData = await driversRes.json();

      // Combine drivers with their assigned vehicle status
      const mappedDrivers: DriverRegistry[] = driversData.map((d: any) => {
        const assignedVehicle = vehiclesData.items.find((v: any) => v.driver_id === d.id);
        return {
          id: d.id,
          name: d.name,
          email: d.email,
          assignedUnit: assignedVehicle ? assignedVehicle.plate : null,
          vehicleType: assignedVehicle ? assignedVehicle.type : null,
          vehicleOwnershipId: assignedVehicle ? assignedVehicle.id : null,
          status: assignedVehicle ? "Aktif" : "Standby",
        };
      });

      setDrivers(mappedDrivers);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeCount = drivers.filter((driver) => driver.status === "Aktif").length;
  const standbyCount = drivers.filter((driver) => driver.status === "Standby").length;
  const assignedCount = drivers.filter((driver) => driver.assignedUnit).length;

  const filteredDrivers = useMemo(
    () =>
      drivers.filter((driver) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          driver.name.toLowerCase().includes(query) ||
          driver.email.toLowerCase().includes(query) ||
          (driver.assignedUnit?.toLowerCase().includes(query) ?? false);

        const matchesStatus = statusFilter === "All" || driver.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [drivers, search, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / rowsPerPage));
  const paginatedDrivers = filteredDrivers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
  // List of vehicles that don't have driver assigned
  const unassignedVehicles = useMemo(
    () => vehicles.filter((v) => !v.driver_id || v.driver === "Belum Ditugaskan"),
    [vehicles]
  );

  const openRegisterModal = () => {
    setNewDriver({ name: "", email: "", password: "mysuf123" });
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterDriver = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newDriver.name.trim() || !newDriver.email.trim()) {
      return;
    }

    try {
      setIsSubmitLoading(true);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      // Create new buyer/driver account
      const res = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newDriver.name,
          email: newDriver.email,
          password: newDriver.password,
          role: ["BUYER"]
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Gagal menyimpan driver.");
      }

      setToast({ show: true, msg: `Driver ${newDriver.name} berhasil ditambahkan.` });
      setIsRegisterModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan driver");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const openAssignmentModal = (driver: DriverRegistry) => {
    setPendingAssignmentDriver(driver);
    setSelectedUnitPlate(unassignedVehicles[0]?.id ?? "");
  };

  const confirmAssignment = async () => {
    if (!pendingAssignmentDriver || !selectedUnitPlate) {
      return;
    }

    try {
      setIsLoading(true);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/vehicles/${selectedUnitPlate}/assign-driver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          driver_id: pendingAssignmentDriver.id
        })
      });

      if (!res.ok) {
        throw new Error("Gagal menetapkan driver.");
      }

      setToast({ show: true, msg: `Driver ${pendingAssignmentDriver.name} ditugaskan ke kendaraan.` });
      setPendingAssignmentDriver(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Gagal menugaskan driver");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmUnassign = async () => {
    if (!pendingUnassignDriver || !pendingUnassignDriver.vehicleOwnershipId) {
      return;
    }

    try {
      setIsLoading(true);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/vehicles/${pendingUnassignDriver.vehicleOwnershipId}/assign-driver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          driver_id: null
        })
      });

      if (!res.ok) {
        throw new Error("Gagal membatalkan tugas driver.");
      }

      setToast({ show: true, msg: `Tugas driver ${pendingUnassignDriver.name} dibatalkan.` });
      setPendingUnassignDriver(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan tugas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 border border-slate-200/60 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Daftar Driver</h1>
            <p className="mt-1 text-xs text-slate-500">
              Driver ditambahkan dulu sebagai data personal, lalu penugasan ke kendaraan kosong dilakukan dari aksi tabel.
            </p>
          </div>
          <button
            type="button"
            onClick={openRegisterModal}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-pertamina-red px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95"
          >
            <UserPlus className="h-4 w-4" /> Tambah Driver
          </button>
        </div>

        {error && (
          <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
            {error}
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-100 bg-green-50 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Driver Aktif (Ditugaskan)</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "..." : activeCount} Orang</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Standby (Bebas)</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "..." : standbyCount} Orang</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-500">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Kendaraan Terikat</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "..." : assignedCount} Armada</p>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        )}

        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="font-bold text-slate-900">Daftar Driver</h3>
          <p className="mt-1 text-xs text-slate-500">Tugaskan atau batalkan tugas driver dari aksi tabel. Tidak ada shift penugasan di halaman ini.</p>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari driver, email, atau unit..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 pl-9 text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="flex w-full gap-2 md:w-auto">
            {(["All", "Aktif", "Standby"] as const).map((status) => (
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
                {status === "All" ? "Semua Driver" : status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left text-sm">
            <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Email / Login</th>
                <th className="px-6 py-4">Unit Saat Ini</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedDrivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    Tidak ada driver yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedDrivers.map((driver) => (
                  <tr key={driver.id} className="transition hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                          {driver.name.substring(0, 1)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{driver.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{driver.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-800">
                        {driver.assignedUnit ? `${driver.assignedUnit} (${driver.vehicleType})` : "Belum ditugaskan"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        driver.status === "Aktif"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-sky-200 bg-sky-50 text-sky-700"
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => (driver.assignedUnit ? setPendingUnassignDriver(driver) : openAssignmentModal(driver))}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                        >
                          {driver.assignedUnit ? <ArrowRight className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                          {driver.assignedUnit ? "Batalkan Tugas" : "Tugaskan ke Unit"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {Math.min((currentPage - 1) * rowsPerPage + 1, filteredDrivers.length)}-
            {Math.min(currentPage * rowsPerPage, filteredDrivers.length)} dari {filteredDrivers.length} driver
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

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeRegisterModal}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 space-y-1">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <UserPlus className="h-5 w-5 text-pertamina-red" /> Tambah Akun Driver
              </h3>
              <p className="text-xs text-slate-500">Mendaftarkan akun karyawan baru (BUYER) yang dapat ditugaskan ke armada.</p>
            </div>

            <form onSubmit={handleRegisterDriver} className="space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nama Driver</span>
                <input
                  type="text"
                  required
                  value={newDriver.name}
                  onChange={(event) => setNewDriver((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                  placeholder="Nama Lengkap"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Email Login</span>
                <input
                  type="email"
                  required
                  value={newDriver.email}
                  onChange={(event) => setNewDriver((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                  placeholder="Contoh: driver@company.id"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Password Awal</span>
                <input
                  type="password"
                  required
                  value={newDriver.password}
                  onChange={(event) => setNewDriver((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Kredensial Driver</p>
                <p className="mt-1">Akun driver yang dibuat akan langsung memiliki peran pembeli BBM bersubsidi (BUYER) terikat dengan perusahaan Anda.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeRegisterModal}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-pertamina-red px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitLoading ? "Memproses..." : "Simpan Driver"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {pendingAssignmentDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setPendingAssignmentDriver(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Tugaskan Driver</h3>
              <p className="text-xs text-slate-500">Pilih kendaraan kosong untuk dipasangkan ke driver.</p>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Driver</p>
              <p className="mt-1">{pendingAssignmentDriver.name}</p>
              <p className="mt-1">Email: {pendingAssignmentDriver.email}</p>
            </div>

            <label className="mt-4 block space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pilih Kendaraan Kosong</span>
              <select
                value={selectedUnitPlate}
                onChange={(event) => setSelectedUnitPlate(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                <option value="">-- Pilih Kendaraan --</option>
                {unassignedVehicles.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.plate} - {unit.type}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setPendingAssignmentDriver(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmAssignment}
                disabled={!selectedUnitPlate}
                className="flex-1 rounded-lg bg-pertamina-red px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tetapkan
              </button>
            </div>
          </Card>
        </div>
      )}

      {pendingUnassignDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setPendingUnassignDriver(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Batalkan Tugas</h3>
              <p className="text-xs text-slate-500">Driver akan kembali standby dan kendaraan menjadi kosong.</p>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Detail Penugasan</p>
              <p className="mt-1">Driver: {pendingUnassignDriver.name}</p>
              <p className="mt-1">Unit: {pendingUnassignDriver.assignedUnit}</p>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setPendingUnassignDriver(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmUnassign}
                className="flex-1 rounded-lg bg-pertamina-red px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700"
              >
                Batalkan Tugas
              </button>
            </div>
          </Card>
        </div>
      )}

      <Toast message={toast.msg} isVisible={toast.show} onClose={() => setToast({ show: false, msg: "" })} />
    </div>
  );
}
