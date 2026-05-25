"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, Users, Brain } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import { dummyTransactions } from "@/data/dummyTransactions";
import { MAX_NJKB_PER_FAMILY, buildFamilyEligibilitySummaries } from "@/lib/eligibilityEngine";

export default function GovernmentUserEligibilityPage() {
  const [appliedThreshold, setAppliedThreshold] = useState(MAX_NJKB_PER_FAMILY);
  const [draftThreshold, setDraftThreshold] = useState(MAX_NJKB_PER_FAMILY);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const familyEligibility = useMemo(
    () => buildFamilyEligibilitySummaries(dummyTransactions, appliedThreshold),
    [appliedThreshold],
  );

  const eligibleCount = familyEligibility.filter((family) => family.eligible).length;
  const ineligibleCount = familyEligibility.length - eligibleCount;
  const familyRows = familyEligibility.map((family) => ({
    familyId: family.familyId,
    vehicleCount: family.vehicles.length,
    totalNJKB: `Rp ${family.totalNJKB.toLocaleString("id-ID")}`,
    threshold: `Rp ${family.threshold.toLocaleString("id-ID")}`,
    eligible: family.eligible ? "Ya" : "Tidak",
  }));

  const totalPages = Math.max(1, Math.ceil(familyRows.length / rowsPerPage));
  const paginatedFamilyRows = familyRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePreviewChange = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmChange = () => {
    setAppliedThreshold(draftThreshold);
    setIsEditModalOpen(false);
    setIsConfirmationOpen(false);
    setCurrentPage(1);
  };

  const handleCancelChange = () => {
    setDraftThreshold(appliedThreshold);
    setIsEditModalOpen(false);
    setIsConfirmationOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Eligibility Scoring Engine"
          subtitle="Pemerintah menetapkan ambang total NJKB per KK sebagai dasar kelayakan subsidi."
        />
        <button
          type="button"
          onClick={() => {
            setDraftThreshold(appliedThreshold);
            setIsEditModalOpen(true);
            setIsConfirmationOpen(false);
          }}
          className="self-start sm:self-center px-4 py-2.5 bg-pertamina-red hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
        >
          Edit Threshold
        </button>
      </div>

      <div className="space-y-6">
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Parameter Pemerintah
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Ambang NJKB dipakai untuk menilai satu keluarga secara agregat, bukan kendaraan per kendaraan.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Max NJKB per KK</p>
            <p className="text-2xl font-bold text-slate-950">Rp {appliedThreshold.toLocaleString("id-ID")}</p>
            <p className="text-xs text-slate-500">Threshold aktif yang dipakai engine eligibility saat ini.</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Ringkasan Kelayakan</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-green-50 p-3 border border-green-100">
                <p className="text-[10px] font-bold uppercase text-green-700">Layak</p>
                <p className="text-xl font-bold text-green-700">{eligibleCount}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 border border-red-100">
                <p className="font-bold uppercase text-[10px] text-pertamina-red">Tidak Layak</p>
                <p className="text-xl font-bold text-pertamina-red">{ineligibleCount}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 border border-amber-100">
              <Brain className="mt-0.5 w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-900">
                Pemerintah hanya perlu melihat total NJKB keluarga, threshold, dan status layak untuk pengambilan kebijakan.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900">Daftar Kelayakan KK</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Data ini dihasilkan dari total NJKB kendaraan dalam satu keluarga.</p>
          </div>

          <DataTable
            columns={[
              { key: "familyId", label: "KK" },
              { key: "vehicleCount", label: "Jumlah Kendaraan" },
              { key: "totalNJKB", label: "Total NJKB" },
              { key: "threshold", label: "Threshold" },
              { key: "eligible", label: "Status" },
            ]}
            rows={paginatedFamilyRows}
          />

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Menampilkan {Math.min((currentPage - 1) * rowsPerPage + 1, familyRows.length)}-
              {Math.min(currentPage * rowsPerPage, familyRows.length)} dari {familyRows.length} KK
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Threshold Eligibility</h3>
                <p className="text-xs text-slate-500 mt-1">Ajukan perubahan, lalu konfirmasi sebelum dipakai engine.</p>
              </div>
              <button
                type="button"
                onClick={handleCancelChange}
                className="rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="space-y-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Threshold baru
                <input
                  type="number"
                  min={0}
                  step={10_000_000}
                  value={draftThreshold}
                  onChange={(event) => setDraftThreshold(Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                />
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Current active threshold</p>
                <p className="mt-1">Rp {appliedThreshold.toLocaleString("id-ID")}</p>
                <p className="mt-3 text-slate-500">Proses: ajukan perubahan, verifikasi, lalu apply.</p>
              </div>

              {!isConfirmationOpen ? (
                <button
                  type="button"
                  onClick={handlePreviewChange}
                  disabled={draftThreshold === appliedThreshold}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ajukan Perubahan
                </button>
              ) : (
                <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Konfirmasi Perubahan</p>
                  <p className="text-sm text-amber-900">
                    Ubah threshold NJKB dari Rp {appliedThreshold.toLocaleString("id-ID")} menjadi Rp {draftThreshold.toLocaleString("id-ID")}?
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
