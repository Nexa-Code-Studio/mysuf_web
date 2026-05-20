"use client";

import { useState } from "react";
import { ArrowLeft, Save, UserCircle2 } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: "Rama Utama",
    email: "rama.utama@spbu-pertamina.com",
    phone: "+62 812 3456 7890",
    nik: "3174012345678901"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/spbu/profile" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Profil
      </Link>
      
      <SectionHeader
        title="Edit Profil"
        subtitle="Perbarui informasi personal akun Anda."
      />

      <Card className="p-6 md:p-8 shadow-sm border border-slate-200/60">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-red-50 text-[#e31837] flex items-center justify-center shadow-md border-4 border-red-100">
              <UserCircle2 className="w-10 h-10" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-2">Foto Profil</p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="text-sm h-9">Ubah Foto</Button>
                <Button type="button" variant="ghost" className="text-sm h-9 text-red-600 hover:text-red-700 hover:bg-red-50">Hapus</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nomor Induk Kependudukan (NIK)</label>
              <input 
                type="text" 
                value={formData.nik}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed" 
                title="NIK tidak dapat diubah, hubungi Admin Pusat."
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nomor Telepon</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/spbu/profile">
              <Button type="button" variant="outline">Batal</Button>
            </Link>
            <Button type="submit" className="bg-[#e31837] hover:bg-[#c4142e] text-white">
              <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
