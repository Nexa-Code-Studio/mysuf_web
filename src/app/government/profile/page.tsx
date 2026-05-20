"use client";

import { UserCircle, Shield, Mail, Phone, MapPin, Award, Lock, Server, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function GovernmentProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title="Profil Pengawas Pemerintah"
        subtitle="Identitas resmi, status clearance keamanan nasional, dan log otorisasi regulator BPH Migas."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Profile Card */}
        <Card className="p-6 text-center shadow-sm border border-slate-200/60 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center mb-4 shadow-md border-4 border-slate-800 relative">
            <UserCircle className="w-14 h-14" />
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">L5</span>
          </div>
          
          <h2 className="text-lg font-bold text-slate-900">Drs. Budi Santoso, M.Si</h2>
          <p className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mt-2 border border-amber-200/50">
            Direktur Pengawasan BPH Migas
          </p>

          <div className="w-full mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>budi.santoso@bphmigas.go.id</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>+62 21 526 8910 (Ext 401)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Gedung ESDM, Menteng, JKT</span>
            </div>
          </div>
        </Card>

        {/* Details Card */}
        <Card className="p-0 shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Detail Jabatan & Otoritas Nasional</h3>
              <p className="text-xs text-slate-500 mt-1">Otoritas kendali distribusi subsidi energi tingkat nasional.</p>
            </div>
            <Link href="/government/profile/edit" className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              Edit Profil
            </Link>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">NIP / Identifikasi</p>
                <p className="font-mono text-xs font-bold text-slate-800">19740825 200003 1 002</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Instansi Pemerintah</p>
                <p className="font-semibold text-slate-900 text-xs">Badan Pengatur Hilir Minyak dan Gas Bumi</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Level Keamanan Clearance</p>
                <span className="inline-flex px-2.5 py-0.5 bg-slate-900 text-amber-400 border border-slate-800 rounded-full text-[10px] font-bold">
                  LEVEL 5 - NATIONAL ADMIN
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Akses Intranet Inti</p>
                <p className="font-mono text-xs text-slate-700 font-bold">10.240.12.89 (VPN Secure)</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" /> Pengawasan Wilayah Subsidi Utama
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold">Jabodetabek</span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold">Jawa Barat</span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold">Jawa Timur</span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold">Sumatera Utara</span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold">Kalimantan Timur</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-500" /> Log Integrasi AI Command
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    AI Fraud Engine V4 API Handshake
                  </span>
                  <span className="font-mono text-[10px] text-green-700 font-bold">SUKSES</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    OSS (One Single Submission) Sync
                  </span>
                  <span className="font-mono text-[10px] text-green-700 font-bold">TERKONEKSI</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    Subsidy Lockdown Bypass Auth Key
                  </span>
                  <span className="font-mono text-[10px] text-amber-700 font-bold">AKTIF</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
