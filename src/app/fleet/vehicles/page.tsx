"use client";

import { useState } from "react";
import { Truck, Search, Plus, X, Eye, FileText, CheckCircle, ShieldAlert, Sliders } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  driver: string;
  status: "On Route" | "Maintenance" | "Idle";
  quotaLimit: number;
  quotaUsed: number;
}

export default function FleetVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: "1", plate: "B 8821 TQ", type: "Tanker 10KL", driver: "Rizal", status: "On Route", quotaLimit: 200, quotaUsed: 140 },
    { id: "2", plate: "B 1145 WX", type: "Box Cargo Medium", driver: "Sinta", status: "Maintenance", quotaLimit: 150, quotaUsed: 80 },
    { id: "3", plate: "B 4512 PK", type: "Pickup L300", driver: "Agus", status: "Idle", quotaLimit: 100, quotaUsed: 15 },
    { id: "4", plate: "B 9902 KAA", type: "Tanker 16KL", driver: "Rama Utama", status: "On Route", quotaLimit: 300, quotaUsed: 210 },
    { id: "5", plate: "D 2219 BZ", type: "Box Cargo Medium", driver: "Nia Putri", status: "Idle", quotaLimit: 150, quotaUsed: 30 },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // Form State
  const [newVehicle, setNewVehicle] = useState<{
    plate: string;
    type: string;
    driver: string;
    status: "On Route" | "Maintenance" | "Idle";
    quotaLimit: number;
  }>({
    plate: "",
    type: "Box Cargo Medium",
    driver: "Agus",
    status: "Idle",
    quotaLimit: 150,
  });


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewVehicle({
      plate: "",
      type: "Box Cargo Medium",
      driver: "Agus",
      status: "Idle",
      quotaLimit: 150,
    });
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.plate.trim()) return;

    const vehicleToAdd: Vehicle = {
      id: Date.now().toString(),
      plate: newVehicle.plate.toUpperCase(),
      type: newVehicle.type,
      driver: newVehicle.driver,
      status: newVehicle.status,
      quotaLimit: Number(newVehicle.quotaLimit),
      quotaUsed: 0,
    };

    setVehicles((prev) => [vehicleToAdd, ...prev]);
    handleCloseModal();
    setToast({ show: true, msg: `Armada Baru ${vehicleToAdd.plate} Berhasil Didaftarkan!` });
  };

  const handleDeleteVehicle = (id: string, plate: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus unit ${plate} dari armada?`)) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setToast({ show: true, msg: `Unit ${plate} Berhasil Dihapus.` });
    }
  };

  // Filter Logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.plate.toLowerCase().includes(search.toLowerCase()) || 
                          v.driver.toLowerCase().includes(search.toLowerCase()) ||
                          v.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalVehicles = vehicles.length;
  const onRouteCount = vehicles.filter((v) => v.status === "On Route").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "Maintenance").length;
  const idleCount = vehicles.filter((v) => v.status === "Idle").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Armada Kendaraan"
          subtitle="Manajemen registrasi, status pengoperasian, dan alokasi unit logistik."
        />
        <button
          onClick={handleOpenModal}
          className="self-start sm:self-center px-4 py-2.5 bg-[#e31837] hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md shadow-red-200 hover:shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4.5 h-4.5" />
          Registrasi Armada
        </button>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Armada</p>
            <p className="text-xl font-bold text-slate-900">{totalVehicles} Unit</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">On Route</p>
            <p className="text-xl font-bold text-green-700">{onRouteCount} Unit</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Maintenance</p>
            <p className="text-xl font-bold text-amber-700">{maintenanceCount} Unit</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Idle</p>
            <p className="text-xl font-bold text-sky-700">{idleCount} Unit</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Plat, Tipe, Driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837] transition"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["All", "On Route", "Maintenance", "Idle"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                statusFilter === status
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status === "All" ? "Semua Status" : status}
            </button>
          ))}
        </div>
      </Card>

      {/* Fleet Table */}
      <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Nomor Plat</th>
                <th className="px-6 py-4">Jenis Kendaraan</th>
                <th className="px-6 py-4">Pengemudi</th>
                <th className="px-6 py-4">Alokasi Subsidi (Harian)</th>
                <th className="px-6 py-4">Status Pengoperasian</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                    Tidak ditemukan data armada yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold rounded text-xs tracking-wider border-y-2 border-slate-700">
                        {vehicle.plate}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {vehicle.type}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                          {vehicle.driver.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700">{vehicle.driver}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-xs space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>{vehicle.quotaUsed} L / {vehicle.quotaLimit} L</span>
                          <span>{Math.round((vehicle.quotaUsed / vehicle.quotaLimit) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                          <div
                            className="bg-[#e31837] h-full rounded-full transition-all duration-500"
                            style={{ width: `${(vehicle.quotaUsed / vehicle.quotaLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        vehicle.status === "On Route"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : vehicle.status === "Maintenance"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 text-slate-400 hover:text-[#e31837] transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id, vehicle.plate)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* TAMBAH ARMADA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl relative animate-scale-up">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-[#e31837]" /> Registrasi Unit Armada Baru
            </h3>
            <p className="text-xs text-slate-500 mb-6">Mendaftarkan unit kendaraan komersial untuk alokasi subsidi khusus.</p>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Nomor Plat Polisi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 1234 CDG"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle((p) => ({ ...p, plate: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 placeholder:text-slate-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Tipe & Jenis Armada</label>
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837]"
                >
                  <option value="Box Cargo Medium">Box Cargo Medium</option>
                  <option value="Tanker 10KL">Tanker 10KL</option>
                  <option value="Tanker 16KL">Tanker 16KL</option>
                  <option value="Pickup L300">Pickup L300</option>
                  <option value="Truk Wingbox Heavy">Truk Wingbox Heavy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Penugasan Pengemudi</label>
                <select
                  value={newVehicle.driver}
                  onChange={(e) => setNewVehicle((p) => ({ ...p, driver: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837]"
                >
                  <option value="Agus">Agus</option>
                  <option value="Rizal">Rizal</option>
                  <option value="Sinta">Sinta</option>
                  <option value="Nia Putri">Nia Putri</option>
                  <option value="Rama Utama">Rama Utama</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase">Kuota BBM Harian</label>
                  <span className="text-xs font-bold text-[#e31837] font-mono">{newVehicle.quotaLimit} Liter</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={newVehicle.quotaLimit}
                  onChange={(e) => setNewVehicle((p) => ({ ...p, quotaLimit: Number(e.target.value) }))}
                  className="w-full accent-[#e31837] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-mono">
                  <span>50 L</span>
                  <span>500 L</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Status Awal</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewVehicle((p) => ({ ...p, status: "Idle" }))}
                    className={`py-2 text-center rounded-lg text-xs font-semibold border transition ${
                      newVehicle.status === "Idle"
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Idle
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewVehicle((p) => ({ ...p, status: "On Route" }))}
                    className={`py-2 text-center rounded-lg text-xs font-semibold border transition ${
                      newVehicle.status === "On Route"
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    On Route
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e31837] hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md shadow-red-200 transition active:scale-95"
                >
                  Daftarkan Unit
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
