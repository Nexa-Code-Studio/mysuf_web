"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Search, Plus, ShieldCheck, X, AlertTriangle, Eye, Loader2, RefreshCw } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { API_BASE_URL } from "@/lib/api";

interface EnforcementAccount {
  id: string;
  accountId: string;
  holderName: string;
  plate: string;
  type: string;
  reason: string;
  dateAdded: string;
  officer: string;
  status: "FREEZE" | "BLOCKED";
}

export default function GovernmentBlacklistPage() {
  const [blacklist, setBlacklist] = useState<EnforcementAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // Form State
  const [newAccountId, setNewAccountId] = useState("");
  const [newHolderName, setNewHolderName] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newType, setNewType] = useState("Mobil Pribadi (1500cc)");
  const [newReason, setNewReason] = useState("Dugaan penimbunan BBM subsidi jenis Biosolar");
  const [newStatus, setNewStatus] = useState<EnforcementAccount["status"]>("BLOCKED");

  const fetchBlacklist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/government/blacklist`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Akses ditolak. Halaman ini khusus untuk Regulator.");
        }
        throw new Error("Gagal mengambil data blacklist.");
      }

      const data = await res.json();
      setBlacklist(data.items || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewAccountId("");
    setNewHolderName("");
    setNewPlate("");
    setNewType("Mobil Pribadi (1500cc)");
    setNewReason("Dugaan penimbunan BBM subsidi jenis Biosolar");
    setNewStatus("BLOCKED");
  };

  const handleEnforcementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountId.trim() || !newHolderName.trim()) return;

    const normalizedAccountId = newAccountId.toUpperCase().trim();
    const normalizedPlate = newPlate.toUpperCase().trim();

    try {
      setIsLoading(true);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/government/blacklist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: normalizedAccountId,
          holderName: newHolderName.trim(),
          plate: normalizedPlate,
          type: newType,
          status: newStatus,
          reason: newReason
        })
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || "Gagal memasukkan akun ke daftar enforcement. Pastikan NIK terdaftar.");
      }

      handleCloseModal();
      setToast({ show: true, msg: `SUKSES! Akun ${normalizedAccountId} telah dimasukkan ke daftar ${newStatus === "FREEZE" ? "freeze" : "block"}.` });
      await fetchBlacklist();
    } catch (err: any) {
      console.error(err);
      setToast({ show: true, msg: err.message || "Terjadi kesalahan." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async (id: string, accountId: string) => {
    if (confirm(`Apakah Anda yakin ingin memulihkan akun ${accountId}?`)) {
      try {
        setIsLoading(true);
        const token = window.localStorage.getItem("mysuf-token");
        if (!token) {
          throw new Error("Sesi login berakhir. Silakan login kembali.");
        }

        const res = await fetch(`${API_BASE_URL}/government/blacklist/${id}/restore`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Gagal memulihkan akun.");
        }

        setToast({ show: true, msg: `Akun ${accountId} telah diaktifkan kembali.` });
        await fetchBlacklist();
      } catch (err: any) {
        console.error(err);
        setToast({ show: true, msg: err.message || "Gagal memulihkan akun." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter
  const filteredBlacklist = blacklist.filter((b) =>
    b.accountId.toLowerCase().includes(search.toLowerCase()) ||
    b.holderName.toLowerCase().includes(search.toLowerCase()) ||
    b.plate.toLowerCase().includes(search.toLowerCase()) ||
    b.reason.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase()) ||
    b.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Daftar Freeze & Block Akun"
          subtitle="Konsol tindakan regulator untuk akun yang dibekukan sementara atau diblokir permanen, beserta plat terkait dan alasan penindakan."
        />
        <div className="flex gap-2 self-start sm:self-center">
          <button
            onClick={fetchBlacklist}
            disabled={isLoading}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2.5 bg-pertamina-red hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Freeze / Block Akun
          </button>
        </div>
      </div>

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
          {error}
        </Card>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-4 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-pertamina-red animate-spin" />
          </div>
        )}
        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-pertamina-red flex items-center justify-center border border-red-100">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Akun Dalam Enforcement</p>
            <p className="text-lg font-bold text-slate-900">{blacklist.length} Akun</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Akun Freeze</p>
            <p className="text-lg font-bold text-slate-900">{blacklist.filter((item) => item.status === "FREEZE").length} Akun</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-200/60 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Akun Block</p>
            <p className="text-lg font-bold text-slate-900">{blacklist.filter((item) => item.status === "BLOCKED").length} Akun</p>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4 border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari akun, NIK, plat, atau alasan tindakan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold font-mono">Sinkronisasi Nasional: REAL-TIME (ENFORCEMENT ACTIVE)</span>
      </Card>

      {/* Table */}
      <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-pertamina-red animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Akun / NIK</th>
                <th className="px-6 py-4">Nama Pemilik / Entitas</th>
                <th className="px-6 py-4">Plat Terkait</th>
                <th className="px-6 py-4">Spesifikasi Unit</th>
                <th className="px-6 py-4">Alasan Tindakan</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Petugas</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4 text-center">Pulihkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBlacklist.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400 font-medium">
                    Tidak ditemukan akun freeze/block yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredBlacklist.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 text-xs whitespace-nowrap">{item.accountId}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{item.holderName}</td>
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
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          item.status === "FREEZE"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-pertamina-red border-red-200 animate-pulse"
                        }`}
                      >
                        {item.status === "FREEZE" ? "FREEZE" : "BLOCKED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleUnblock(item.id, item.accountId)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Pulihkan Akun">
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
          <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl relative animate-scale-up overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="w-6 h-6 text-pertamina-red animate-spin" />
              </div>
            )}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-pertamina-red" /> Tambah Freeze / Block Akun
            </h3>
            <p className="text-xs text-slate-500 mb-6">Masukkan akun yang harus dibekukan sementara atau diblokir permanen beserta plat terkait dan alasan penindakan.</p>

            <form onSubmit={handleEnforcementSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Akun / NIK</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: NIK 3174xxxxxxxxxxxx"
                  value={newAccountId}
                  onChange={(e) => setNewAccountId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 placeholder:text-slate-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Nama Pemilik / Entitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Sinar Logistik"
                  value={newHolderName}
                  onChange={(e) => setNewHolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Plat Terkait</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 9901 KBA"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 placeholder:text-slate-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Spesifikasi Tipe Unit</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red"
                >
                  <option value="Mobil Pribadi (1500cc)">Mobil Pribadi (1500cc)</option>
                  <option value="Truk Logistik Box">Truk Logistik Box</option>
                  <option value="Truk Tanker Swasta">Truk Tanker Swasta</option>
                  <option value="Kendaraan Umum Angkutan">Kendaraan Umum Angkutan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Status Tindakan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as EnforcementAccount["status"])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red"
                >
                  <option value="FREEZE">FREEZE</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Alasan Tindakan</label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red"
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
                  className="px-5 py-2 bg-pertamina-red hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md shadow-red-200 transition active:scale-95"
                >
                  SIMPAN ENFORCEMENT
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
