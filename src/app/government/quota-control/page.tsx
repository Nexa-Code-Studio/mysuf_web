"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, SlidersHorizontal } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import { dummyTransactions } from "@/data/dummyTransactions";
import { evaluateTransactions } from "@/lib/fraudDetection";
import { ACTION_BY_RISK_LEVEL, BASE_QUOTA_BY_VEHICLE_TYPE, RISK_MODIFIER_BY_LEVEL } from "@/lib/quotaEngine";

const PERSONAL_VEHICLE_TYPES = new Set(["motorcycle", "passenger_car"]);

const formatVehicleTypeLabel = (vehicleType: string) =>
  vehicleType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function GovernmentQuotaControlPage() {
  const [appliedBaseQuota, setAppliedBaseQuota] = useState(BASE_QUOTA_BY_VEHICLE_TYPE);
  const [draftBaseQuota, setDraftBaseQuota] = useState(BASE_QUOTA_BY_VEHICLE_TYPE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [fraudFilter, setFraudFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const evaluatedTransactions = useMemo(() => evaluateTransactions(dummyTransactions), []);

  const policyRows = Object.entries(appliedBaseQuota).map(([vehicleType, baseQuota]) => ({
    vehicleTypeLabel: formatVehicleTypeLabel(vehicleType),
    vehicleType,
    baseQuota: `${baseQuota} L`,
    safe: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.SAFE)} L`,
    suspicious: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.SUSPICIOUS)} L`,
    highRisk: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.HIGH_RISK)} L`,
    critical: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.CRITICAL)} L`,
  }));

  const personalPolicyRows = policyRows.filter((row) => PERSONAL_VEHICLE_TYPES.has(row.vehicleType));
  const commercialPolicyRows = policyRows.filter((row) => !PERSONAL_VEHICLE_TYPES.has(row.vehicleType));

  const finalQuotaRows = evaluatedTransactions
    .map((transaction) => ({
      transactionId: transaction.transactionId,
      familyId: transaction.familyId,
      vehicleId: transaction.vehicleId,
      vehicleType: transaction.vehicleType,
      riskLevel: transaction.riskLevel,
      fraudSources:
        transaction.detectedFrauds.length > 0
          ? transaction.detectedFrauds.map((fraud) => fraud.type).join(", ")
          : "SAFE",
      fraudReason:
        transaction.detectedFrauds.length > 0
          ? transaction.detectedFrauds.map((fraud) => fraud.reason).join(" | ")
          : "Tidak ada pola fraud yang terdeteksi.",
      action: ACTION_BY_RISK_LEVEL[transaction.riskLevel],
      baseQuota: `${appliedBaseQuota[transaction.vehicleType]} L`,
      riskModifier: transaction.riskModifier.toFixed(1),
      finalQuota: `${Math.round(appliedBaseQuota[transaction.vehicleType] * transaction.riskModifier)} L`,
    }))
    .filter((row) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        row.vehicleId.toLowerCase().includes(query) ||
        row.familyId.toLowerCase().includes(query) ||
        row.vehicleType.toLowerCase().includes(query) ||
        row.riskLevel.toLowerCase().includes(query) ||
        row.fraudSources.toLowerCase().includes(query) ||
        row.fraudReason.toLowerCase().includes(query);

      const matchesRisk = riskFilter === "ALL" || row.riskLevel === riskFilter;
      const matchesFraud =
        fraudFilter === "ALL" ||
        (fraudFilter === "SAFE" ? row.fraudSources === "SAFE" : row.fraudSources.includes(fraudFilter));

      return matchesSearch && matchesRisk && matchesFraud;
    });

  const totalPages = Math.max(1, Math.ceil(finalQuotaRows.length / rowsPerPage));
  const paginatedFinalQuotaRows = finalQuotaRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, riskFilter, fraudFilter]);

  const handlePreviewChange = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmChange = () => {
    setAppliedBaseQuota(draftBaseQuota);
    setIsEditModalOpen(false);
    setIsConfirmationOpen(false);
  };

  const handleCancelChange = () => {
    setDraftBaseQuota(appliedBaseQuota);
    setIsEditModalOpen(false);
    setIsConfirmationOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Dynamic Quota Policy"
          subtitle="Pemerintah menetapkan kuota dasar per kategori kendaraan, lalu engine mengalikannya dengan risk modifier."
        />
        <button
          type="button"
          onClick={() => {
            setDraftBaseQuota(appliedBaseQuota);
            setIsEditModalOpen(true);
            setIsConfirmationOpen(false);
          }}
          className="self-start rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Edit Base Quota
        </button>
      </div>

      <div className="space-y-6">
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" /> Aturan Kuota Pemerintah
          </div>
          <p className="text-xs text-slate-500">
            Kuota final dihitung dengan rumus: FinalQuota = BaseQuota × RiskModifier.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Warga - SAFE</p>
              <p className="text-2xl font-bold text-green-600">{RISK_MODIFIER_BY_LEVEL.SAFE.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Kuota penuh untuk transaksi aman.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Warga - SUSPICIOUS</p>
              <p className="text-2xl font-bold text-amber-600">{RISK_MODIFIER_BY_LEVEL.SUSPICIOUS.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Kuota dipotong karena ada sinyal awal fraud.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Komersial - HIGH_RISK</p>
              <p className="text-2xl font-bold text-pertamina-red">{RISK_MODIFIER_BY_LEVEL.HIGH_RISK.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Kendaraan perusahaan berisiko tinggi masuk freeze.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Komersial - CRITICAL</p>
              <p className="text-2xl font-bold text-slate-900">{RISK_MODIFIER_BY_LEVEL.CRITICAL.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Akses diblok saat fraud sangat kuat.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 p-4">
            <ShieldCheck className="mt-0.5 w-4 h-4 text-green-600" />
            <p className="text-xs text-green-900">
              Pemerintah hanya perlu menetapkan kuota dasar per kategori. Engine akan menurunkannya berdasarkan risiko fraud.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Base Quota Warga</h4>
              <p className="text-xs text-slate-500">Kategori yang dipakai untuk warga/rumah tangga.</p>
            </div>
            <DataTable
              columns={[
                { key: "vehicleTypeLabel", label: "Kategori" },
                { key: "baseQuota", label: "Base Quota", align: "right" },
              ]}
              rows={personalPolicyRows}
            />
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Base Quota Komersial Perusahaan</h4>
              <p className="text-xs text-slate-500">Kategori kendaraan komersial seperti box cargo, tanker, pickup, truk, van, dan tipe lainnya.</p>
            </div>
            <DataTable
              columns={[
                { key: "vehicleTypeLabel", label: "Kategori" },
                { key: "baseQuota", label: "Base Quota", align: "right" },
              ]}
              rows={commercialPolicyRows}
            />
          </div>
        </Card>

        <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900">Final Quota per Transaksi</h3>
              <p className="text-xs text-slate-500 mt-1">
                Data langsung dari engine. Tabel ini bisa difilter dan dipaginasi karena jumlah transaksi bisa banyak.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1 text-xs font-semibold text-slate-600 md:col-span-1">
                Search
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari vehicle, KK, fraud, risk..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                />
              </label>

              <label className="space-y-1 text-xs font-semibold text-slate-600">
                Filter Risk
                <select
                  value={riskFilter}
                  onChange={(event) => setRiskFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                >
                  <option value="ALL">Semua</option>
                  <option value="SAFE">SAFE</option>
                  <option value="SUSPICIOUS">SUSPICIOUS</option>
                  <option value="HIGH_RISK">HIGH_RISK</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </label>

              <label className="space-y-1 text-xs font-semibold text-slate-600">
                Filter Fraud
                <select
                  value={fraudFilter}
                  onChange={(event) => setFraudFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                >
                  <option value="ALL">Semua</option>
                  <option value="SAFE">Tidak Ada Fraud</option>
                  <option value="RAPID_PURCHASE">Rapid Purchase</option>
                  <option value="MULTI_LOCATION_ABUSE">Multi Location Abuse</option>
                  <option value="HOUSEHOLD_ABUSE">Household Abuse</option>
                </select>
              </label>
            </div>
          </div>

          <DataTable
            columns={[
              { key: "vehicleId", label: "Vehicle" },
              { key: "familyId", label: "KK" },
              { key: "vehicleType", label: "Kategori" },
              { key: "riskLevel", label: "Risk" },
              { key: "fraudSources", label: "Fraud Source" },
              { key: "baseQuota", label: "Base" },
              { key: "riskModifier", label: "Modifier" },
              { key: "finalQuota", label: "Final" },
            ]}
            rows={paginatedFinalQuotaRows}
          />

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 space-y-3">
            <p>
              Menampilkan {Math.min((currentPage - 1) * rowsPerPage + 1, finalQuotaRows.length)}-
              {Math.min(currentPage * rowsPerPage, finalQuotaRows.length)} dari {finalQuotaRows.length} transaksi
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-slate-500">Fraud source menunjukkan pola yang terdeteksi pada tiap transaksi, misalnya rapid purchase, multi location abuse, atau household abuse.</p>
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
          </div>
        </Card>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Base Quota</h3>
                <p className="text-xs text-slate-500 mt-1">Ajukan perubahan, lalu konfirmasi sebelum diterapkan ke engine quota.</p>
              </div>
              <button
                type="button"
                onClick={handleCancelChange}
                className="rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(draftBaseQuota).map(([vehicleType, value]) => (
                  <label key={vehicleType} className="space-y-1 text-xs font-semibold text-slate-700">
                    <span className="block uppercase tracking-wider text-slate-500">{vehicleType}</span>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={value}
                      onChange={(event) =>
                        setDraftBaseQuota((current) => ({
                          ...current,
                          [vehicleType]: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                    />
                  </label>
                ))}
              </div>

              {!isConfirmationOpen ? (
                <button
                  type="button"
                  onClick={handlePreviewChange}
                  disabled={JSON.stringify(draftBaseQuota) === JSON.stringify(appliedBaseQuota)}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ajukan Perubahan
                </button>
              ) : (
                <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Konfirmasi Perubahan</p>
                  <p className="text-sm text-amber-900">
                    Terapkan perubahan base quota yang baru ke engine quota?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmChange}
                      className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      Konfirmasi dan Terapkan
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmationOpen(false)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Kembali
                    </button>
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
