"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle, Clock, FileUp, Search, Truck, UserCheck, UserPlus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

type DriverStatus = "Aktif" | "Standby" | "Nonaktif";

type AvailableUnit = {
  plate: string;
  type: string;
};

type DriverRegistry = {
  id: string;
  name: string;
  nik: string;
  phone: string;
  licenseNumber: string;
  ktpFileName: string;
  assignedUnit: string | null;
  vehicleType: string | null;
  status: DriverStatus;
};

const availableUnits: AvailableUnit[] = [
  { plate: "B 7731 FA", type: "Truck" },
  { plate: "B 3320 XN", type: "Box Cargo" },
  { plate: "B 4410 PUA", type: "Pickup" },
  { plate: "D 1088 TTR", type: "Van" },
  { plate: "B 9911 KQ", type: "Tanker" },
];

export default function FleetAssignDriverPage() {
  const [drivers, setDrivers] = useState<DriverRegistry[]>([
    {
      id: "1",
      name: "Rizal Wibowo",
      nik: "3175xxxxxxxxxxxx",
      phone: "0812-1111-2222",
      licenseNumber: "SIM B 1109 2026",
      ktpFileName: "rizal-ktp.pdf",
      assignedUnit: "B 8821 TQ",
      vehicleType: "Tanker",
      status: "Aktif",
    },
    {
      id: "2",
      name: "Sinta Kartika",
      nik: "3175xxxxxxxxxxxx",
      phone: "0812-3333-4444",
      licenseNumber: "SIM B 2210 2026",
      ktpFileName: "sinta-ktp.jpg",
      assignedUnit: null,
      vehicleType: null,
      status: "Standby",
    },
    {
      id: "3",
      name: "Agus Pratama",
      nik: "3175xxxxxxxxxxxx",
      phone: "0812-5555-6666",
      licenseNumber: "SIM B 3201 2025",
      ktpFileName: "agus-ktp.png",
      assignedUnit: "B 4512 PK",
      vehicleType: "Pickup",
      status: "Aktif",
    },
    {
      id: "4",
      name: "Rama Utama",
      nik: "3175xxxxxxxxxxxx",
      phone: "0812-7777-8888",
      licenseNumber: "SIM B 4408 2026",
      ktpFileName: "rama-ktp.pdf",
      assignedUnit: null,
      vehicleType: null,
      status: "Standby",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "All">("All");
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [pendingAssignmentDriver, setPendingAssignmentDriver] = useState<DriverRegistry | null>(null);
  const [pendingUnassignDriver, setPendingUnassignDriver] = useState<DriverRegistry | null>(null);
  const [pendingDeactivateDriver, setPendingDeactivateDriver] = useState<DriverRegistry | null>(null);
  const [ktpFileName, setKtpFileName] = useState("Belum diunggah");
  const [selectedUnitPlate, setSelectedUnitPlate] = useState(availableUnits[0].plate);
  const rowsPerPage = 5;

  const [newDriver, setNewDriver] = useState({
    name: "",
    nik: "",
    phone: "",
    licenseNumber: "",
  });

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
          driver.nik.toLowerCase().includes(query) ||
          (driver.assignedUnit?.toLowerCase().includes(query) ?? false) ||
          driver.licenseNumber.toLowerCase().includes(query);

        const matchesStatus = statusFilter === "All" || driver.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [drivers, search, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / rowsPerPage));
  const paginatedDrivers = filteredDrivers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const usedUnits = drivers.filter((driver) => driver.assignedUnit).map((driver) => driver.assignedUnit);
  const unassignedUnits = availableUnits.filter((unit) => !usedUnits.includes(unit.plate));

  const openRegisterModal = () => {
    setNewDriver({ name: "", nik: "", phone: "", licenseNumber: "" });
    setKtpFileName("Belum diunggah");
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterDriver = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newDriver.name.trim() || !newDriver.nik.trim()) {
      return;
    }

    const nextDriver: DriverRegistry = {
      id: Date.now().toString(),
      name: newDriver.name.trim(),
      nik: newDriver.nik.trim(),
      phone: newDriver.phone.trim(),
      licenseNumber: newDriver.licenseNumber.trim(),
      ktpFileName,
      assignedUnit: null,
      vehicleType: null,
      status: "Standby",
    };

    setDrivers((prev) => [nextDriver, ...prev]);
    setCurrentPage(1);
    setIsRegisterModalOpen(false);
    setToast({ show: true, msg: `Driver ${nextDriver.name} berhasil ditambahkan.` });
  };

  const openAssignmentModal = (driver: DriverRegistry) => {
    setPendingAssignmentDriver(driver);
    setSelectedUnitPlate(unassignedUnits[0]?.plate ?? "");
  };

  const confirmAssignment = () => {
    if (!pendingAssignmentDriver || !selectedUnitPlate) {
      return;
    }

    const selectedUnit = availableUnits.find((unit) => unit.plate === selectedUnitPlate);
    if (!selectedUnit) {
      return;
    }

    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === pendingAssignmentDriver.id
          ? {
              ...driver,
              assignedUnit: selectedUnit.plate,
              vehicleType: selectedUnit.type,
              status: "Aktif",
            }
          : driver,
      ),
    );

    setToast({ show: true, msg: `Driver ${pendingAssignmentDriver.name} ditugaskan ke ${selectedUnit.plate}.` });
    setPendingAssignmentDriver(null);
  };

  const confirmUnassign = () => {
    if (!pendingUnassignDriver) {
      return;
    }

    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === pendingUnassignDriver.id
          ? {
              ...driver,
              assignedUnit: null,
              vehicleType: null,
              status: "Standby",
            }
          : driver,
      ),
    );

    setToast({ show: true, msg: `Tugas driver ${pendingUnassignDriver.name} dibatalkan.` });
    setPendingUnassignDriver(null);
  };

  const openDeactivateModal = (driver: DriverRegistry) => {
    setPendingDeactivateDriver(driver);
  };

  const confirmDeactivate = () => {
    if (!pendingDeactivateDriver) {
      return;
    }

    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === pendingDeactivateDriver.id
          ? {
              ...driver,
              assignedUnit: null,
              vehicleType: null,
              status: "Nonaktif",
            }
          : driver,
      ),
    );

    setToast({ show: true, msg: `Driver ${pendingDeactivateDriver.name} berhasil dinonaktifkan.` });
    setPendingDeactivateDriver(null);
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

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-100 bg-green-50 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Driver Aktif</p>
              <p className="text-lg font-bold text-slate-900">{activeCount} Orang</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Standby</p>
              <p className="text-lg font-bold text-slate-900">{standbyCount} Orang</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-500">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sedang Ditugaskan</p>
              <p className="text-lg font-bold text-slate-900">{assignedCount} Orang</p>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="font-bold text-slate-900">Daftar Driver</h3>
          <p className="mt-1 text-xs text-slate-500">Tugaskan atau batalkan tugas driver dari aksi tabel. Tidak ada shift penugasan di halaman ini.</p>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari driver, NIK, SIM, atau unit..."
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
            {(["All", "Aktif", "Standby", "Nonaktif"] as const).map((status) => (
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
          <table className="min-w-280 w-full text-left text-sm">
            <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">SIM</th>
                <th className="px-6 py-4">Unit Saat Ini</th>
                <th className="px-6 py-4">KTP</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
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
                          <p className="text-[11px] text-slate-400">{driver.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{driver.nik}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{driver.licenseNumber}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-800">
                        {driver.assignedUnit ? `${driver.assignedUnit} (${driver.vehicleType})` : "Belum ditugaskan"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{driver.ktpFileName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        driver.status === "Aktif"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : driver.status === "Standby"
                          ? "border-sky-200 bg-sky-50 text-sky-700"
                          : "border-slate-200 bg-slate-100 text-slate-500"
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
                          {driver.assignedUnit ? "Batalkan Tugas" : "Tugaskan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeactivateModal(driver)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-pertamina-red transition hover:bg-red-100"
                        >
                          <X className="h-3.5 w-3.5" />
                          Nonaktifkan Driver
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
          <Card className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeRegisterModal}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 space-y-1">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <UserPlus className="h-5 w-5 text-pertamina-red" /> Tambah Driver
              </h3>
              <p className="text-xs text-slate-500">Form ini hanya menambah data driver. Penugasan kendaraan dilakukan dari aksi tabel.</p>
            </div>

            <form onSubmit={handleRegisterDriver} className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1 sm:col-span-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nama Driver</span>
                <input
                  type="text"
                  required
                  value={newDriver.name}
                  onChange={(event) => setNewDriver((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                  placeholder="Nama sesuai KTP"
                />
              </label>

              <label className="block space-y-1 sm:col-span-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">NIK</span>
                <input
                  type="text"
                  required
                  value={newDriver.nik}
                  onChange={(event) => setNewDriver((current) => ({ ...current, nik: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                  placeholder="16 digit NIK"
                />
              </label>

              <label className="block space-y-1 sm:col-span-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nomor HP</span>
                <input
                  type="text"
                  value={newDriver.phone}
                  onChange={(event) => setNewDriver((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                  placeholder="08xxxxxxxxxx"
                />
              </label>

              <label className="block space-y-1 sm:col-span-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nomor SIM</span>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={(event) => setNewDriver((current) => ({ ...current, licenseNumber: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
                  placeholder="SIM B / SIM C"
                />
              </label>

              <label className="block space-y-1 sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Upload KTP</span>
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                  <FileUp className="h-4 w-4 text-slate-400" />
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(event) => setKtpFileName(event.target.files?.[0]?.name ?? "Belum diunggah")}
                    className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400">File aktif: {ktpFileName}</p>
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 sm:col-span-2">
                <p className="font-semibold text-slate-900">Catatan</p>
                <p className="mt-1">Driver akan tersimpan sebagai Standby sampai dipasangkan ke kendaraan kosong dari tabel utama.</p>
              </div>

              <div className="flex gap-2 pt-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeRegisterModal}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-pertamina-red px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95"
                >
                  Simpan Driver <ArrowRight className="h-4 w-4" />
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
              <p className="text-xs text-slate-500">Pilih kendaraan yang masih kosong dari driver. Tidak ada shift di proses ini.</p>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Driver</p>
              <p className="mt-1">{pendingAssignmentDriver.name}</p>
              <p className="mt-1">NIK: {pendingAssignmentDriver.nik}</p>
            </div>

            <label className="mt-4 block space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pilih Kendaraan Kosong</span>
              <select
                value={selectedUnitPlate}
                onChange={(event) => setSelectedUnitPlate(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-pertamina-red focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                {unassignedUnits.length === 0 ? (
                  <option value="">Tidak ada kendaraan kosong</option>
                ) : (
                  unassignedUnits.map((unit) => (
                    <option key={unit.plate} value={unit.plate}>
                      {unit.plate} - {unit.type}
                    </option>
                  ))
                )}
              </select>
            </label>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
              Penugasan ini hanya akan mengisi unit yang belum memiliki driver aktif.
            </div>

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
              <p className="text-xs text-slate-500">Driver akan dikembalikan ke status standby dan unit kembali kosong.</p>
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

      {pendingDeactivateDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setPendingDeactivateDriver(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Nonaktifkan Driver</h3>
              <p className="text-xs text-slate-500">Aksi ini berbeda dari batalkan tugas. Status driver akan menjadi Nonaktif.</p>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Detail Driver</p>
              <p className="mt-1">Driver: {pendingDeactivateDriver.name}</p>
              <p className="mt-1">Status saat ini: {pendingDeactivateDriver.status}</p>
              <p className="mt-1">Unit saat ini: {pendingDeactivateDriver.assignedUnit ?? "Tidak ada"}</p>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setPendingDeactivateDriver(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeactivate}
                className="flex-1 rounded-lg bg-pertamina-red px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700"
              >
                Nonaktifkan
              </button>
            </div>
          </Card>
        </div>
      )}

      <Toast message={toast.msg} isVisible={toast.show} onClose={() => setToast({ show: false, msg: "" })} />
    </div>
  );
}
