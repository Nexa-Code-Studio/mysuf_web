"use client";

import { ShieldCheck, FileCheck2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

interface LegalDoc {
  key: string;
  name: string;
  number: string;
  expiry: string;
  verifiedDate: string;
}

const documents: LegalDoc[] = [
  {
    key: "SIUP",
    name: "Surat Izin Usaha Perdagangan",
    number: "SIUP-4421-LOG",
    expiry: "12 Januari 2028",
    verifiedDate: "24 Jan 2024",
  },
  {
    key: "TDP",
    name: "Tanda Daftar Perusahaan",
    number: "TDP-9981-TLN",
    expiry: "28 Maret 2029",
    verifiedDate: "24 Jan 2024",
  },
  {
    key: "NPWP",
    name: "NPWP Badan Usaha",
    number: "01.234.567.8-012.000",
    expiry: "Seumur Hidup",
    verifiedDate: "25 Jan 2024",
  },
  {
    key: "NIB",
    name: "Nomor Induk Berusaha",
    number: "9120001234567",
    expiry: "Berlaku Selamanya",
    verifiedDate: "25 Jan 2024",
  },
];

export default function FleetLegalPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Legalitas Usaha"
        subtitle="Semua perusahaan yang mengakses web ini diasumsikan sudah terverifikasi. Halaman ini hanya menampilkan status dokumen aktif."
      />

      <Card className="border border-slate-200/60 p-5 shadow-sm">
        <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50/50 p-4 text-sm text-green-800">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="font-bold">Semua dokumen valid</p>
            <p className="mt-1 text-xs text-slate-600">
              Tidak ada alur upload, validasi manual, filter status, atau summary tambahan di halaman ini.
            </p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900">
            <FileCheck2 className="text-pertamina-red h-5 w-5" /> Dokumen Usaha Tervalidasi
          </h3>
          <p className="mt-1 text-xs text-slate-500">Daftar berikut menunjukkan dokumen yang sudah disetujui dan aktif.</p>
        </div>

        <div className="divide-y divide-slate-100 bg-white">
          {documents.map((doc) => (
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
                <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                  Terverifikasi
                </span>
                <p className="mt-2 text-[9px] font-semibold text-slate-400">Verifikasi: {doc.verifiedDate}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border border-slate-200/60 p-4 text-xs text-slate-500 shadow-sm">
        Semua dokumen legal perusahaan dianggap valid untuk akses operasional armada.
      </Card>
    </div>
  );
}
