"use client";

import { useState } from "react";
import { ShieldAlert, Search, Plus, Trash2, ShieldCheck, X, AlertTriangle, Eye } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface BlacklistedVehicle {
  id: string;
  plate: string;
  type: string;
  reason: string;
  dateAdded: string;
  officer: string;
  status: "BLOCKED";
}

export default function GovernmentBlacklistPage() {
  const [blacklist, setBlacklist] = useState<BlacklistedVehicle[]>([
    { id: "1", plate: "B 9123 KZ", type: "Mobil Pribadi (1500cc)", reason: "Pengisian berulang di 3 cabang berbeda < 1 jam", dateAdded: "19 Mei 2026", officer: "Dian S.", status: "BLOCKED" },
    { id: "2", plate: "BG 1184 TR", type: "Truk Logistik Box", reason: "Pemalsuan berkas legalitas NIB perusahaan", dateAdded: "18 Mei 2026", officer: "BPH Migas AI", status: "BLOCKED" },
    { id: "3", plate: "D 4401 NH", type: "Truk Tanker Swasta", reason: "Dugaan penimbunan BBM subsidi jenis Biosolar", dateAdded: "15 Mei 2026", officer: "Sila Utama", status: "BLOCKED" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // Form State
  const [newPlate, setNewPlate] = useState("");
  const [newType, setNewType] = useState("Mobil Pribadi (1500cc)");
  const [newReason, setNewReason] = useState("Dugaan penimbunan BBM subsidi jenis Biosolar");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPlate("");
    setNewType("Mobil Pribadi (1500cc)");
    setNewReason("Dugaan penimbunan BBM subsidi jenis Biosolar");
  };

  const handleBlockPlate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    // Check if plate already blacklisted
    if (blacklist.some((b) => b.plate.toUpperCase() === newPlate.toUpperCase().trim())) {
      setToast({ show: true, msg: `Gagal! Plat nomor ${newPlate.toUpperCase()} sudah berada dalam daftar blacklist.` });
      return;
    }

    const itemToAdd: BlacklistedVehicle = {
      id: Date.now().toString(),
      plate: newPlate.toUpperCase().trim(),
      type: newType,
      reason: newReason,
      dateAdded: "Hari Ini",
      officer: "Drs. Budi Santoso",
      status: "BLOCKED",
    };

    setBlacklist((prev) => [itemToAdd, ...prev]);
    handleCloseModal();
    setToast({ show: true, msg: `SUKSES! Plat nomor ${itemToAdd.plate} telah diblokir secara nasional!` });
  };

  const handleUnblock = (id: string, plate: string) => {
    if (confirm(`Apakah Anda yakin ingin memulihkan hak subsidi kendaraan ${plate}?`)) {
      setBlacklist((prev) => prev.filter((b) => b.id !== id));
      setToast({ show: true, msg: `Akses subsidi untuk unit ${plate} telah diaktifkan kembali.` });
    }
  };

  // Filter
  const filteredBlacklist = blacklist.filter((b) =>
    b.plate.toLowerCase().includes(search.toLowerCase()) ||
    b.reason.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Daftar Hitam Kendaraan"
          subtitle="Konsol pemblokiran plat nomor kendaraan nasional secara instan untuk kasus penimbunan BBM."
        />
        <button
          onClick={handleOpenModal}
          className="self-start sm:self-center px-4 py-2.5 bg-[#e31837] hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Blokir Kendaraan Baru
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-[#e31837] flex items-center justify-center border border-red-100">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Kendaraan Diblokir</p>
            <p className="text-lg font-bold text-slate-900">{blacklist.length} Plat</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pencegahan Fraud Hari Ini</p>
            <p className="text-lg font-bold text-slate-900">Rp 14.8M subsidi</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tingkat Akurasi AI</p>
            <p className="text-lg font-bold text-slate-900">99.8% Accuracy</p>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4 border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Plat Terblokir / Alasan Tindakan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837] transition"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold font-mono">Sinkronisasi Nasional: REAL-TIME (ACTIVE)</span>
      </Card>

      {/* Table */}
      <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Nomor Plat Polisi</th>
                <th className="px-6 py-4">Spesifikasi Unit</th>
                <th className="px-6 py-4">Alasan Pemblokiran (Berdasarkan Investigasi)</th>
                <th className="px-6 py-4">Tanggal Blokir</th>
                <th className="px-6 py-4">Petugas Penindak</th>
                <th className="px-6 py-4">Status Hak</th>
                <th className="px-6 py-4 text-center">Pulihkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBlacklist.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 font-medium">
                    Tidak ditemukan plat terblokir yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredBlacklist.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 bg-red-950 text-red-300 font-mono font-bold rounded text-xs tracking-wider border-y-2 border-red-700">
                        {item.plate}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.type}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs leading-relaxed max-w-xs">{item.reason}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.dateAdded}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{item.officer}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#e31837] border border-red-200 animate-pulse">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleUnblock(item.id, item.plate)}
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Pulihkan Akses Subsidi"
                      >
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL BLOKIR KENDARAAN */}
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
              <ShieldAlert className="w-5 h-5 text-[#e31837]" /> Tindakan Pemblokiran Plat Nomor
            </h3>
            <p className="text-xs text-slate-500 mb-6">Membekukan hak alokasi subsidi BBM unit kendaraan di seluruh SPBU Pertamina.</p>

            <form onSubmit={handleBlockPlate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Masukkan Nomor Plat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 9901 KBA"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 placeholder:text-slate-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Spesifikasi Tipe Unit</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837]"
                >
                  <option value="Mobil Pribadi (1500cc)">Mobil Pribadi (1500cc)</option>
                  <option value="Truk Logistik Box">Truk Logistik Box</option>
                  <option value="Truk Tanker Swasta">Truk Tanker Swasta</option>
                  <option value="Kendaraan Umum Angkutan">Kendaraan Umum Angkutan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Alasan Penindakan Blokir</label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e31837]"
                >
                  <option value="Dugaan penimbunan BBM subsidi jenis Biosolar">Dugaan penimbunan BBM subsidi jenis Biosolar</option>
                  <option value="Pengisian berulang di 3 cabang berbeda < 1 jam">Pengisian berulang di beberapa cabang dalam durasi singkat</option>
                  <option value="Pemalsuan berkas legalitas NIB perusahaan">Pemalsuan berkas legalitas NIB perusahaan</option>
                  <option value="Plate mismatch: Deteksi plat palsu di nozzle sensor">Plate mismatch: Deteksi plat palsu di nozzle sensor</option>
                </select>
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
                  BLOKIR SEKARANG
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
