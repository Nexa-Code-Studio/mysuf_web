"use client";

import { UserCircle2, Mail, Phone, MapPin, Building, ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title="Profil Pengguna"
        subtitle="Kelola informasi akun dan data diri Anda."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="p-6 text-center shadow-sm border border-slate-200/60 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-red-50 text-[#e31837] flex items-center justify-center mb-4 shadow-md border-4 border-red-100">
            <UserCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Rama Utama</h2>
          <p className="text-sm font-medium text-pertamina-red bg-red-50 px-3 py-1 rounded-full mt-2">Admin SPBU</p>
          
          <div className="w-full mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>rama.utama@spbu-pertamina.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>+62 812 3456 7890</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>SPBU 31.12345, Jakarta Selatan</span>
            </div>
          </div>
        </Card>

        <Card className="p-0 shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Detail Akun</h3>
              <p className="text-xs text-slate-500 mt-1">Informasi identitas resmi dan akses sistem.</p>
            </div>
            <Link href="/spbu/profile/edit" className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              Edit Profil
            </Link>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Nama Lengkap</p>
                <p className="font-semibold text-slate-900">Rama Utama</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Nomor Induk Kependudukan (NIK)</p>
                <p className="font-mono text-slate-700">3174012345678901</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Status Karyawan</p>
                <p className="font-semibold text-slate-900">Karyawan Tetap</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tanggal Bergabung</p>
                <p className="font-semibold text-slate-900">12 Agustus 2021</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" /> Informasi Cabang SPBU
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Kode SPBU</p>
                    <p className="font-semibold text-slate-900 font-mono">31.12345</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Area Operasional</p>
                    <p className="font-semibold text-slate-900">Regional Jawa Bagian Barat</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Hak Akses Sistem
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">Dashboard Analytics</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">Fraud Management</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">Staff Management (Full)</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-bold">System Config (Read-only)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
