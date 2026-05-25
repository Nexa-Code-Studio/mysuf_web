"use client";

import { useState } from "react";
import { ChevronRight, FileText, ShieldCheck, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export default function FleetRegistrationPage() {
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleFleetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsToastVisible(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Toast
        message="Pengajuan Subsidi Fleet Berhasil Dikirim!"
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Pengajuan Subsidi Perusahaan
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mt-5 mb-6">
                Ajukan Subsidi Fleet Anda Hari Ini
              </h1>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                Lengkapi data perusahaan dan unggah dokumen legalitas untuk proses verifikasi MySuF. Tim kami akan meninjau pengajuan Anda maksimal 2 hari kerja.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary-10) text-(--primary) font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Isi Formulir Pengajuan</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Data perusahaan, kontak penanggung jawab, dan estimasi armada.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary-10) text-(--primary) font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Unggah Dokumen Legalitas</p>
                    <p className="text-sm text-slate-500 mt-1">
                      SIUP, TDP, NPWP Badan Usaha, dan NIB wajib dilampirkan.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary-10) text-(--primary) font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Verifikasi & Aktivasi</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Tim MySuF memverifikasi dokumen dan mengaktifkan akun perusahaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-(--primary-10) text-(--primary) flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Formulir Pengajuan</h2>
                  <p className="text-sm text-slate-500">Lengkapi data dan unggah dokumen pendukung.</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleFleetSubmit}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Nama Perusahaan</label>
                    <input
                      type="text"
                      placeholder="PT Maju Sejahtera"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Nomor Induk Berusaha (NIB)</label>
                    <input
                      type="text"
                      placeholder="1234567890123"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email Penanggung Jawab</label>
                  <input
                    type="email"
                    placeholder="direktur@perusahaan.co.id"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">No. Telepon</label>
                    <input
                      type="text"
                      placeholder="08xx-xxxx-xxxx"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Estimasi Jumlah Armada</label>
                    <input
                      type="number"
                      required
                      placeholder="Cth: 12"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <UploadCloud className="h-4 w-4" />
                    Dokumen Pendukung
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Surat Izin Usaha Perdagangan (SIUP)</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Tanda Daftar Perusahaan (TDP)</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">NPWP Badan Usaha</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Dokumen NIB</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full py-4 h-auto text-base bg-(--primary) hover:brightness-95 text-white mt-4">
                  Kirim Pengajuan Subsidi Fleet <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-center text-[10px] text-slate-400 mt-4">
                  Dengan mengirim form, Anda menyetujui syarat & ketentuan program subsidi Pertamina dan ESDM.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
