"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Building, ShieldCheck, ArrowLeft, Save } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

export default function FleetProfileEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Sinta Kartika",
    email: "sinta.k@translogistik.co.id",
    phone: "+62 813 9876 5432",
    address: "Kawasan Industri Pulogadung, JKT",
    company: "PT Trans Logistik Nusantara",
    nib: "9120001234567",
    businessType: "Logistik & Distribusi Barang",
  });

  const [toast, setToast] = useState({ show: false, msg: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API saving
    setTimeout(() => {
      setIsSaving(false);
      setToast({ show: true, msg: "Profil Fleet Berhasil Diperbarui!" });
      setTimeout(() => {
        router.push("/fleet/profile");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/fleet/profile")}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <SectionHeader
          title="Edit Profil Fleet"
          subtitle="Sesuaikan informasi pengelola dan detail korporasi perusahaan Anda."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 shadow-sm border border-slate-200/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-pertamina-red" /> Informasi Kontak Pengelola
            </h3>
            <p className="text-xs text-slate-500 mt-1">Kontak utama penanggung jawab armada.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Email Korporat</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Nomor Telepon / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Alamat Kantor / Depo</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-sm border border-slate-200/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-pertamina-red" /> Data Badan Usaha
            </h3>
            <p className="text-xs text-slate-500 mt-1">Informasi legalitas perusahaan logistik Anda.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Nama Resmi Perusahaan (Sesuai NIB)</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">NIB (13 Digit)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="nib"
                  value={formData.nib}
                  onChange={handleChange}
                  required
                  maxLength={13}
                  pattern="[0-9]{13}"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Sektor / Tipe Usaha</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-pertamina-red transition bg-white"
              >
                <option value="Logistik & Distribusi Barang">Logistik & Distribusi Barang</option>
                <option value="Transportasi Umum / Pariwisata">Transportasi Umum / Pariwisata</option>
                <option value="Konstruksi & Alat Berat">Konstruksi & Alat Berat</option>
                <option value="UMKM Pangan & Perikanan">UMKM Pangan & Perikanan</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/fleet/profile")}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-pertamina-red hover:bg-red-700 text-white font-semibold rounded-lg text-sm flex items-center gap-2 shadow-md shadow-red-200 hover:shadow-lg transition-all active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
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
