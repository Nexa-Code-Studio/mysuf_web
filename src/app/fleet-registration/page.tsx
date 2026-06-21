"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, FileText, ShieldCheck, UploadCloud, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { API_BASE_URL } from "@/lib/api";

export default function FleetRegistrationPage() {
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nib: "",
    email: "",
    phone: "",
    fleet_size: "",
    siup_no: "",
    tdp_no: "",
    npwp_no: "",
    notes: "",
  });

  const [siupFile, setSiupFile] = useState<File | null>(null);
  const [tdpFile, setTdpFile] = useState<File | null>(null);
  const [npwpFile, setNpwpFile] = useState<File | null>(null);
  const [nibFile, setNibFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFleetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("nib", formData.nib);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("fleet_size", formData.fleet_size);
      data.append("siup_no", formData.siup_no || "");
      data.append("tdp_no", formData.tdp_no || "");
      data.append("npwp_no", formData.npwp_no || "");
      data.append("notes", formData.notes || "");

      if (siupFile) data.append("siup_file", siupFile);
      if (tdpFile) data.append("tdp_file", tdpFile);
      if (npwpFile) data.append("npwp_file", npwpFile);
      if (nibFile) data.append("nib_file", nibFile);

      const response = await fetch(`${API_BASE_URL}/companies/register`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Gagal mengirim pengajuan." }));
        throw new Error(errorData.detail || "Gagal mengirim pengajuan.");
      }

      setIsToastVisible(true);
      setFormData({
        name: "",
        nib: "",
        email: "",
        phone: "",
        fleet_size: "",
        siup_no: "",
        tdp_no: "",
        npwp_no: "",
        notes: "",
      });
      setSiupFile(null);
      setTdpFile(null);
      setNpwpFile(null);
      setNibFile(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
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
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-(--primary) transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Landing Page
          </Link>
          <div className="grid lg:grid-cols-2 gap-16 items-start mt-6">
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
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="PT Maju Sejahtera"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Nomor Induk Berusaha (NIB)</label>
                    <input
                      type="text"
                      name="nib"
                      value={formData.nib}
                      onChange={handleChange}
                      placeholder="1234567890123"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email Penanggung Jawab</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="direktur@perusahaan.co.id"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">No. Telepon</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08xx-xxxx-xxxx"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Estimasi Jumlah Armada</label>
                    <input
                      type="number"
                      name="fleet_size"
                      value={formData.fleet_size}
                      onChange={handleChange}
                      placeholder="Cth: 12"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">No. SIUP (Opsional)</label>
                    <input
                      type="text"
                      name="siup_no"
                      value={formData.siup_no}
                      onChange={handleChange}
                      placeholder="SIUP-XXX"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">No. TDP (Opsional)</label>
                    <input
                      type="text"
                      name="tdp_no"
                      value={formData.tdp_no}
                      onChange={handleChange}
                      placeholder="TDP-XXX"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">No. NPWP (Opsional)</label>
                    <input
                      type="text"
                      name="npwp_no"
                      value={formData.npwp_no}
                      onChange={handleChange}
                      placeholder="NPWP-XXX"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Keterangan / Notes (Opsional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Masukkan permohonan logistik Anda..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) text-sm"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <UploadCloud className="h-4 w-4" />
                    Dokumen Pendukung
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide">File SIUP</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setSiupFile(e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-900 file:px-2.5 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide">File TDP</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setTdpFile(e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-900 file:px-2.5 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide">File NPWP</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setNpwpFile(e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-900 file:px-2.5 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide">File NIB</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setNibFile(e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-900 file:px-2.5 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:border-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 h-auto text-base bg-(--primary) hover:brightness-95 text-white mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Mengirimkan...
                    </>
                  ) : (
                    <>
                      Kirim Pengajuan Subsidi Fleet <ChevronRight className="w-5 h-5" />
                    </>
                  )}
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
