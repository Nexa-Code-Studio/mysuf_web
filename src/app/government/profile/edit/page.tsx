"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Building, ShieldCheck, ArrowLeft, Save } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

export default function GovernmentProfileEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Drs. Budi Santoso, M.Si",
    email: "budi.santoso@bphmigas.go.id",
    phone: "+62 21 526 8910 (Ext 401)",
    address: "Gedung ESDM, Menteng, JKT",
    agency: "Badan Pengatur Hilir Minyak dan Gas Bumi",
    nip: "19740825 200003 1 002",
    ipAccess: "10.240.12.89",
  });

  const [toast, setToast] = useState({ show: false, msg: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API saving
    setTimeout(() => {
      setIsSaving(false);
      setToast({ show: true, msg: "Profil Regulator Berhasil Diperbarui!" });
      setTimeout(() => {
        router.push("/government/profile");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/government/profile")}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <SectionHeader
          title="Edit Profil Pengawas"
          subtitle="Sesuaikan detail identitas dinas dan kredensial akses pengawasan BPH Migas."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 shadow-sm border border-slate-200/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-slate-900" /> Informasi Identitas Resmi
            </h3>
            <p className="text-xs text-slate-500 mt-1">Nama dan kontak kedinasan yang terdaftar pada sistem nasional.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Nama Lengkap & Gelar</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Email Dinas (.go.id)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Nomor Telepon Kantor</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Lokasi Gedung / Kantor</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-sm border border-slate-200/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-slate-900" /> Instansi & Akses Keamanan
            </h3>
            <p className="text-xs text-slate-500 mt-1">Kredensial kedinasan yang membatasi hak akses konsol Anda.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Nama Instansi Kementerian</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="agency"
                  value={formData.agency}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Nomor NIP</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">IP Akses Intranet VPN</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="ipAccess"
                  value={formData.ipAccess}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 transition"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/government/profile")}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm flex items-center gap-2 shadow-md shadow-slate-200 hover:shadow-lg transition-all active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
