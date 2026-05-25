"use client";

import { ShieldCheck, Mail, Phone, MapPin, Building, KeyRound, UserCircle2 } from "lucide-react";
import Link from "next/link";

import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function MySufAdminProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title="Profil Super Admin"
        subtitle="Kelola identitas utama dan akses kontrol sistem MySuF."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="p-6 text-center shadow-sm border border-slate-200/60 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-(--primary-10) text-(--primary) flex items-center justify-center mb-4 shadow-md border-4 border-red-100">
            <UserCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Rama Utama</h2>
          <p className="text-sm font-medium text-(--primary) bg-(--primary-10) px-3 py-1 rounded-full mt-2">
            Super Admin MySuF
          </p>

          <div className="w-full mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>rama.utama@mysuf.id</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>+62 21 7400 8899</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>MySuF HQ, Jakarta Selatan</span>
            </div>
          </div>
        </Card>

        <Card className="p-0 shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Detail Akses & Otoritas</h3>
              <p className="text-xs text-slate-500 mt-1">
                Informasi identitas resmi dan hak kontrol sistem.
              </p>
            </div>
            <Link
              href="/mysuf-admin/profile/edit"
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Edit Profil
            </Link>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Nama Lengkap
                </p>
                <p className="font-semibold text-slate-900">Rama Utama</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  NIK
                </p>
                <p className="font-mono text-slate-700">3174012345678901</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Unit / Instansi
                </p>
                <p className="font-semibold text-slate-900">MySuF Command Center</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Role Sistem
                </p>
                <p className="font-semibold text-slate-900">Super Admin</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" /> Lingkup Kontrol Nasional
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Cluster Operasional</p>
                    <p className="font-semibold text-slate-900">Nasional</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status Keamanan</p>
                    <p className="font-semibold text-slate-900">Validated</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Hak Akses Utama
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-red-50 text-(--primary) border border-red-100 rounded-full text-xs font-bold">
                  Global User Control
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">
                  Audit & Compliance
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">
                  Master SPBU & Company
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> Kredensial Keamanan
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600">
                Akses super admin tervalidasi melalui multi-factor security dan audit log aktif.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
