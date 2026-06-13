"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, FileCheck2, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";

interface LegalDoc {
  key: string;
  name: string;
  number: string;
  expiry: string;
  verifiedDate: string;
}

export default function FleetLegalPage() {
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [status, setStatus] = useState("Belum Verifikasi");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLegal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/legal`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data legalitas usaha.");
      }

      const data = await res.json();
      setStatus(data.status);

      const items: LegalDoc[] = [
        {
          key: "SIUP",
          name: "Surat Izin Usaha Perdagangan",
          number: data.siup_no || "Tidak ada nomor SIUP terdaftar",
          expiry: "12 Januari 2028",
          verifiedDate: "24 Jan 2024",
        },
        {
          key: "NPWP",
          name: "NPWP Badan Usaha",
          number: data.npwp_no || "Tidak ada nomor NPWP terdaftar",
          expiry: "Seumur Hidup",
          verifiedDate: "25 Jan 2024",
        },
        {
          key: "NIB",
          name: "Nomor Induk Berusaha",
          number: data.nib || "Tidak ada nomor NIB terdaftar",
          expiry: "Berlaku Selamanya",
          verifiedDate: "25 Jan 2024",
        },
      ];
      setDocs(items);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLegal();
  }, []);

  const isVerified = status === "Approved" || status === "Verified" || status === "Sudah Verifikasi";

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Legalitas Usaha"
        subtitle="Dokumen perizinan usaha dan status verifikasi legalitas perusahaan."
      />

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
          {error}
        </Card>
      )}

      {isLoading && docs.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        </div>
      ) : (
        <>
          <Card className="border border-slate-200/60 p-5 shadow-sm">
            <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
              isVerified 
                ? "border-green-100 bg-green-50/50 text-green-800" 
                : "border-amber-100 bg-amber-50/50 text-amber-800"
            }`}>
              <ShieldCheck className={`mt-0.5 h-5 w-5 shrink-0 ${isVerified ? "text-green-600" : "text-amber-600"}`} />
              <div>
                <p className="font-bold">{isVerified ? "Perusahaan Terverifikasi" : "Status Verifikasi: " + status}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {isVerified 
                    ? "Semua dokumen legalitas usaha telah diverifikasi dan disetujui oleh regulator BPH Migas." 
                    : "Dokumen legalitas usaha Anda sedang berada dalam tahap peninjauan oleh regulator."}
                </p>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            )}
            <div className="border-b border-slate-100 bg-slate-50/50 p-5">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <FileCheck2 className="text-pertamina-red h-5 w-5" /> Dokumen Usaha Tervalidasi
              </h3>
              <p className="mt-1 text-xs text-slate-500">Daftar berikut menunjukkan dokumen yang sudah terverifikasi.</p>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              {docs.map((doc) => (
                <div key={doc.key} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                        {doc.key}
                      </span>
                      <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500">No: {doc.number}</p>
                    <p className="text-[10px] font-semibold text-slate-400">Masa berlaku: {doc.expiry}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                      isVerified
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}>
                      {isVerified ? "Terverifikasi" : status}
                    </span>
                    <p className="mt-2 text-[9px] font-semibold text-slate-400">Verifikasi: {doc.verifiedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
