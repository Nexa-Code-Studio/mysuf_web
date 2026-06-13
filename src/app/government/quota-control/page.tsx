"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Loader2, RefreshCw } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import { API_BASE_URL } from "@/lib/api";

type QuotaPolicies = {
  warga: number;
  motor_komersial: number;
  mobil_komersial: number;
  truk_komersial: number;
};

export default function GovernmentQuotaControlPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedPolicies, setAppliedPolicies] = useState<QuotaPolicies>({
    warga: 250,
    motor_komersial: 100,
    mobil_komersial: 250,
    truk_komersial: 500,
  });
  const [draftPolicies, setDraftPolicies] = useState<QuotaPolicies>({
    warga: 250,
    motor_komersial: 100,
    mobil_komersial: 250,
    truk_komersial: 500,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [quotaTxItems, setQuotaTxItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      // Fetch Quota Policies
      const policiesRes = await fetch(`${API_BASE_URL}/government/quota-policies`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!policiesRes.ok) {
        throw new Error("Gagal mengambil data aturan kuota.");
      }
      const policiesData = await policiesRes.json();
      const loadedPolicies = {
        warga: Number(policiesData.warga),
        motor_komersial: Number(policiesData.motor_komersial),
        mobil_komersial: Number(policiesData.mobil_komersial),
        truk_komersial: Number(policiesData.truk_komersial),
      };
      setAppliedPolicies(loadedPolicies);
      setDraftPolicies(loadedPolicies);

      // Fetch Quota Transactions
      const txRes = await fetch(`${API_BASE_URL}/government/quota-transactions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!txRes.ok) {
        throw new Error("Gagal mengambil data transaksi kuota.");
      }
      const txData = await txRes.json();
      setQuotaTxItems(txData.items || []);
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

  const policyRows = [
    {
      category: "Warga / Personal",
      baseQuota: `${appliedPolicies.warga} L`,
      safe: `${Math.round(appliedPolicies.warga * 1.0)} L`,
      suspicious: `${Math.round(appliedPolicies.warga * 0.8)} L`,
      highRisk: `${Math.round(appliedPolicies.warga * 0.5)} L`,
      critical: "0 L",
    },
    {
      category: "Motor Komersial",
      baseQuota: `${appliedPolicies.motor_komersial} L`,
      safe: `${Math.round(appliedPolicies.motor_komersial * 1.0)} L`,
      suspicious: `${Math.round(appliedPolicies.motor_komersial * 0.8)} L`,
      highRisk: `${Math.round(appliedPolicies.motor_komersial * 0.5)} L`,
      critical: "0 L",
    },
    {
      category: "Mobil Komersial",
      baseQuota: `${appliedPolicies.mobil_komersial} L`,
      safe: `${Math.round(appliedPolicies.mobil_komersial * 1.0)} L`,
      suspicious: `${Math.round(appliedPolicies.mobil_komersial * 0.8)} L`,
      highRisk: `${Math.round(appliedPolicies.mobil_komersial * 0.5)} L`,
      critical: "0 L",
    },
    {
      category: "Truk Komersial",
      baseQuota: `${appliedPolicies.truk_komersial} L`,
      safe: `${Math.round(appliedPolicies.truk_komersial * 1.0)} L`,
      suspicious: `${Math.round(appliedPolicies.truk_komersial * 0.8)} L`,
      highRisk: `${Math.round(appliedPolicies.truk_komersial * 0.5)} L`,
      critical: "0 L",
    },
  ];

  const filteredQuotaTx = quotaTxItems.filter((row) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      row.nikSensor.toLowerCase().includes(query) ||
      row.nama.toLowerCase().includes(query);

    const modifierVal = parseFloat(row.modifier);
    let riskLevel = "SAFE";
    if (modifierVal === 0.8) riskLevel = "SUSPICIOUS";
    else if (modifierVal === 0.5) riskLevel = "HIGH_RISK";
    else if (modifierVal === 0.0) riskLevel = "CRITICAL";

    const matchesRisk = riskFilter === "ALL" || riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuotaTx.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedQuotaTx = filteredQuotaTx.slice(
    (safeCurrentPage - 1) * rowsPerPage,
    safeCurrentPage * rowsPerPage
  );

  const handlePreviewChange = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmChange = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/government/quota-policies`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          warga: draftPolicies.warga,
          motor_komersial: draftPolicies.motor_komersial,
          mobil_komersial: draftPolicies.mobil_komersial,
          truk_komersial: draftPolicies.truk_komersial
        })
      });

      if (!res.ok) {
        throw new Error("Gagal memperbarui aturan kuota.");
      }

      await fetchData();
      setIsEditModalOpen(false);
      setIsConfirmationOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelChange = () => {
    setDraftPolicies({ ...appliedPolicies });
    setIsEditModalOpen(false);
    setIsConfirmationOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Dynamic Quota Policy"
          subtitle="Atur parameter kuota bahan bakar berdasarkan kategori kendaraan dan risiko pengguna."
        />
        <div className="flex gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftPolicies({ ...appliedPolicies });
              setIsEditModalOpen(true);
              setIsConfirmationOpen(false);
            }}
            className="px-4 py-2.5 bg-pertamina-red hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
          >
            Edit Base Quota
          </button>
        </div>
      </div>

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
          {error}
        </Card>
      )}

      <div className="space-y-6">
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" /> Aturan Kuota Pemerintah
          </div>
          <p className="text-xs text-slate-500">Kuota final dihitung dengan rumus: FinalQuota = BaseQuota sesuai kategori kendaraan × RiskModifier.</p>
          
          <div className="space-y-3">
            <DataTable
              columns={[
                { key: "category", label: "Kategori Kebijakan" },
                { key: "baseQuota", label: "Base Quota", align: "right" },
                { key: "safe", label: "SAFE (1.0)", align: "right" },
                { key: "suspicious", label: "SUSPICIOUS (0.8)", align: "right" },
                { key: "highRisk", label: "HIGH RISK (0.5)", align: "right" },
                { key: "critical", label: "CRITICAL (0.0)", align: "right" },
              ]}
              rows={policyRows}
            />
          </div>
        </Card>

        <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
          )}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900">Final Quota per Transaksi</h3>
              <p className="text-xs text-slate-500 mt-1">Data kuota real-time per NIK setelah digabungkan dengan kendaraan yang terdaftar dan dikalikan risk modifier.</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold text-slate-600">
                Search
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari NIK / akun, nama..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold text-slate-600">
                Filter Risk Level
                <select
                  value={riskFilter}
                  onChange={(event) => setRiskFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                >
                  <option value="ALL">Semua</option>
                  <option value="SAFE">SAFE (1.0)</option>
                  <option value="SUSPICIOUS">SUSPICIOUS (0.8)</option>
                  <option value="HIGH_RISK">HIGH RISK (0.5)</option>
                  <option value="CRITICAL">CRITICAL (0.0)</option>
                </select>
              </label>
            </div>
          </div>

          <DataTable
            columns={[
              { key: "nikSensor", label: "NIK (Sensor)" },
              { key: "nama", label: "Nama" },
              { key: "baseQuota1", label: "Quota Personal", align: "right" },
              { key: "baseQuota2", label: "Quota Komersial (1)", align: "right" },
              { key: "baseQuota3", label: "Quota Komersial (2)", align: "right" },
              { key: "riskIndex", label: "Risk Index", align: "right" },
              { key: "modifier", label: "Modifier", align: "right" },
              { key: "finalQuota", label: "Final Quota", align: "right" },
            ]}
            rows={paginatedQuotaTx}
          />

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 space-y-3">
            <p>Menampilkan {filteredQuotaTx.length > 0 ? (safeCurrentPage - 1) * rowsPerPage + 1 : 0}-{Math.min(safeCurrentPage * rowsPerPage, filteredQuotaTx.length)} dari {filteredQuotaTx.length} transaksi</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-slate-500">Komersial (1) mewakili kendaraan komersial motor/mobil. Komersial (2) mewakili kendaraan truk.</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentPage((value) => Math.max(1, value - 1))} disabled={safeCurrentPage === 1} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">{safeCurrentPage} / {totalPages}</span>
                <button type="button" onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))} disabled={safeCurrentPage === totalPages} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 animate-fade-in">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            )}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Base Quota Pemerintah</h3>
                <p className="text-xs text-slate-500 mt-1">Sesuaikan nilai dasar (liter) per kategori kebijakan.</p>
              </div>
              <button type="button" onClick={handleCancelChange} className="rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">×</button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-3">
                <label className="space-y-1 block text-xs font-semibold text-slate-700">
                  <span className="block uppercase tracking-wider text-slate-500">Warga / Personal (L)</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={draftPolicies.warga}
                    onChange={(event) => setDraftPolicies((current) => ({ ...current, warga: Number(event.target.value) }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                  />
                </label>

                <label className="space-y-1 block text-xs font-semibold text-slate-700">
                  <span className="block uppercase tracking-wider text-slate-500">Motor Komersial (L)</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={draftPolicies.motor_komersial}
                    onChange={(event) => setDraftPolicies((current) => ({ ...current, motor_komersial: Number(event.target.value) }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                  />
                </label>

                <label className="space-y-1 block text-xs font-semibold text-slate-700">
                  <span className="block uppercase tracking-wider text-slate-500">Mobil Komersial (L)</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={draftPolicies.mobil_komersial}
                    onChange={(event) => setDraftPolicies((current) => ({ ...current, mobil_komersial: Number(event.target.value) }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                  />
                </label>

                <label className="space-y-1 block text-xs font-semibold text-slate-700">
                  <span className="block uppercase tracking-wider text-slate-500">Truk Komersial (L)</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={draftPolicies.truk_komersial}
                    onChange={(event) => setDraftPolicies((current) => ({ ...current, truk_komersial: Number(event.target.value) }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                  />
                </label>
              </div>

              {!isConfirmationOpen ? (
                <button
                  type="button"
                  onClick={handlePreviewChange}
                  disabled={JSON.stringify(draftPolicies) === JSON.stringify(appliedPolicies)}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ajukan Perubahan
                </button>
              ) : (
                <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Konfirmasi Perubahan</p>
                  <p className="text-sm text-amber-900">Terapkan 4 base quota baru ini ke engine quota?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleConfirmChange} className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700">Konfirmasi dan Terapkan</button>
                    <button type="button" onClick={() => setIsConfirmationOpen(false)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Kembali</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
