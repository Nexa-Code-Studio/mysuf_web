"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Eye, FileText, Plus, Search, ShieldAlert, Truck, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { API_BASE_URL } from "@/lib/api";

type FleetVehicleStatus = "Idle" | "On Route";
type FleetRiskLevel = "Rendah" | "Sedang" | "Tinggi";

type FleetVehicle = {
  id: string;
  plate: string;
  type: string;
  driver: string;
  driver_id: string | null;
  status: string;
  quotaLimit: number;
  quotaUsed: number;
};

type VehicleFormState = {
  plate: string;
};

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

export default function FleetVehiclesPage() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "All">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [pendingDeleteVehicle, setPendingDeleteVehicle] = useState<FleetVehicle | null>(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [newVehicle, setNewVehicle] = useState<VehicleFormState>({
    plate: "",
  });

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/vehicles`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data kendaraan.");
      }

      const data = await res.json();
      setVehicles(data.items);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openModal = () => {
    setNewVehicle({ plate: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          vehicle.plate.toLowerCase().includes(query) ||
          vehicle.driver.toLowerCase().includes(query) ||
          vehicle.type.toLowerCase().includes(query);

        // Map operational status or check match
        const matchesStatus = statusFilter === "All" || vehicle.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter, vehicles],
  );

  const totalVehicles = vehicles.length;
  // Fallback to simulation if status not strictly Idle/On Route
  const onRouteCount = vehicles.filter((v) => v.quotaUsed > 0).length;
  const idleCount = vehicles.filter((v) => v.quotaUsed === 0).length;
  const highRiskCount = vehicles.filter((v) => deriveRiskLevel(v.quotaUsed, v.quotaLimit) === "Tinggi").length;

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / rowsPerPage));
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleAddVehicle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newVehicle.plate.trim()) {
      return;
    }

    try {
      setIsSubmitLoading(true);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          plate: newVehicle.plate,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Gagal mendaftarkan kendaraan.");
      }

      setToast({ show: true, msg: `Armada ${data.plate} berhasil didaftarkan.` });
      closeModal();
      fetchVehicles();
    } catch (err: any) {
      alert(err.message || "Gagal mendaftarkan kendaraan");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const requestDeleteVehicle = (vehicle: FleetVehicle) => {
    setPendingDeleteVehicle(vehicle);
  };

  const confirmDeleteVehicle = async () => {
    if (!pendingDeleteVehicle) {
      return;
    }

    try {
      setIsDeleteLoading(true);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/vehicles/${pendingDeleteVehicle.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus kendaraan.");
      }

      setToast({ show: true, msg: `Unit ${pendingDeleteVehicle.plate} berhasil dihapus.` });
      setPendingDeleteVehicle(null);
      fetchVehicles();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kendaraan");
    } finally {
      setIsDeleteLoading(false);
    }
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
            className="self-start rounded-xl bg-pertamina-red px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95"
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Daftarkan Kendaraan
            </span>
          </button>
        </div>

        {error && (
          <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
            {error}
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Armada</p>
              <p className="text-xl font-bold text-slate-900">{isLoading ? "..." : totalVehicles} Unit</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Aktif (Dipakai)</p>
              <p className="text-xl font-bold text-green-700">{isLoading ? "..." : onRouteCount} Unit</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Belum Terpakai</p>
              <p className="text-xl font-bold text-slate-900">{isLoading ? "..." : idleCount} Unit</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-pertamina-red">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk Tinggi</p>
              <p className="text-xl font-bold text-slate-900">{isLoading ? "..." : highRiskCount} Unit</p>
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
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-700 transition focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          {["All", "Aktif", "Idle"].map((status) => (
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

      <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        )}

        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="font-bold text-slate-900">Daftar Kendaraan</h3>
          <p className="mt-1 text-xs text-slate-500">Pengemudi di sini berarti driver yang sedang ditugaskan saat ini.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left text-sm">
            <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Nomor Plat</th>
                <th className="px-6 py-4">Jenis Kendaraan</th>
                <th className="px-6 py-4">Pengemudi Saat Ini</th>
                <th className="px-6 py-4">Kuota Resmi (Bulanan)</th>
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
                  const displayStatus = vehicle.quotaUsed > 0 ? "Aktif" : "Idle";

                  return (
                    <tr key={vehicle.id} className="transition hover:bg-slate-50/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-block rounded bg-slate-900 px-3 py-1 font-mono text-xs font-bold tracking-wider text-white">
                          {vehicle.plate}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">{vehicle.type}</td>
                      <td className="px-6 py-4 text-slate-600">{vehicle.driver}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">{vehicle.quotaLimit} L</td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-xs space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>{remaining} L</span>
                            <span>{usagePercent}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-pertamina-red transition-all duration-500" style={{ width: `${usagePercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            risk === "Tinggi"
                              ? "border-red-200 bg-red-50 text-pertamina-red"
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
                            displayStatus === "Aktif"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-sky-200 bg-sky-50 text-sky-700"
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setSelectedVehicle(vehicle)} className="p-1 text-slate-400 transition-all hover:text-pertamina-red">
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
                <Truck className="h-5 w-5 text-pertamina-red" /> Daftarkan Kendaraan Baru
              </h3>
              <p className="text-xs text-slate-500">Nomor plat akan diverifikasi dengan Database Kepolisian secara realtime.</p>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nomor Plat</span>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 1234 ABC"
                  value={newVehicle.plate}
                  onChange={(event) => setNewVehicle((current) => ({ ...current, plate: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm uppercase tracking-wider text-slate-800 placeholder:text-slate-400 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </label>


              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Verifikasi Registry Kepolisian</p>
                <p className="mt-1">
                  Sistem akan otomatis mencocokkan plat nomor ini dengan data registrasi kepolisian. Kuota bulanan bersubsidi akan disesuaikan dengan kapasitas mesin dan berat jenis kendaraan terdaftar.
                </p>
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
                  disabled={isSubmitLoading}
                  className="rounded-lg bg-pertamina-red px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitLoading ? "Memproses..." : "Daftarkan Unit"}
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
                <Eye className="h-5 w-5 text-pertamina-red" /> Detail Kendaraan
              </h3>
              <p className="text-xs text-slate-500">Ringkasan unit terdaftar pada sistem.</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Nomor Plat</p>
                <p className="mt-1 font-mono text-sm font-bold text-slate-800">{selectedVehicle.plate}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Jenis Kendaraan</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedVehicle.type}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Pengemudi Saat Ini</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedVehicle.driver}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Status Operasional</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedVehicle.quotaUsed > 0 ? "Aktif" : "Idle"}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Kuota Resmi (Sisa)</span>
                <span>
                  {selectedVehicle.quotaUsed} L / {selectedVehicle.quotaLimit} L
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-pertamina-red"
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
              <p className="mt-1">Jenis: {pendingDeleteVehicle.type}</p>
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
                disabled={isDeleteLoading}
                className="flex-1 rounded-lg bg-pertamina-red px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleteLoading ? "Memproses..." : "Hapus"}
              </button>
            </div>
          </Card>
        </div>
      )}

      <Toast message={toast.msg} isVisible={toast.show} onClose={() => setToast({ show: false, msg: "" })} />
    </div>
  );
}
