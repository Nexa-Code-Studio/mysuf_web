"use client";

import { UserCircle2, Mail, Phone, MapPin, Building, ShieldCheck, FileSpreadsheet } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function FleetProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title="Profil Pengelola Fleet"
        subtitle="Kelola detail identitas pengurus dan berkas legalitas perusahaan logistik Anda."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="p-6 text-center shadow-sm border border-slate-200/60 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-red-50 text-[#e31837] flex items-center justify-center mb-4 shadow-md border-4 border-red-100">
            <UserCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sinta Kartika</h2>
          <p className="text-sm font-medium text-pertamina-red bg-red-50 px-3 py-1 rounded-full mt-2">Admin Perusahaan</p>
          
          <div className="w-full mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>sinta.k@translogistik.co.id</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>+62 813 9876 5432</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Kawasan Industri Pulogadung, JKT</span>
            </div>
          </div>
        </Card>

        <Card className="p-0 shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Detail Perusahaan & Legalitas</h3>
              <p className="text-xs text-slate-500 mt-1">Status kepatuhan badan usaha terverifikasi AI Engine.</p>
            </div>
            <Link href="/fleet/profile/edit" className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              Edit Profil
            </Link>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Nama Perusahaan</p>
                <p className="font-semibold text-slate-900">PT Trans Logistik Nusantara</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">NIB (Nomor Induk Berusaha)</p>
                <p className="font-mono text-slate-700">9120001234567</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tipe Usaha</p>
                <p className="font-semibold text-slate-900">Logistik & Distribusi Barang</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tanggal Registrasi Fleet</p>
                <p className="font-semibold text-slate-900">24 Januari 2024</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Kepatuhan Dokumen Legalitas (Compliance)
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">SIUP</p>
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">Terverifikasi</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">TDP</p>
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">Terverifikasi</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">NPWP Badan</p>
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">Valid & Aktif</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Alokasi Subsidi Armada
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-red-50 text-[#e31837] border border-red-100 rounded-full text-xs font-bold">Skema Per-Armada Aktif</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">212 Unit Terdaftar</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">Kuota Regional: Jawa Barat</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
