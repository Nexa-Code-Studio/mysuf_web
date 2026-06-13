"use client";

import { useEffect, useState } from "react";
import { UserCircle2, Mail, Phone, MapPin, ShieldCheck, FileSpreadsheet, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";

export default function FleetProfilePage() {
  const [admin, setAdmin] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [legal, setLegal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      // 1. Fetch user (admin)
      const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setAdmin(userData.user);
      }

      // 2. Fetch company profile
      const companyRes = await fetch(`${API_BASE_URL}/fleet/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (companyRes.ok) {
        const companyData = await companyRes.json();
        setCompany(companyData);
      }

      // 3. Fetch company legal status
      const legalRes = await fetch(`${API_BASE_URL}/fleet/legal`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (legalRes.ok) {
        const legalData = await legalRes.json();
        setLegal(legalData);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const adminName = admin?.name || "Admin Fleet";
  const adminEmail = admin?.email || "admin@company.id";
  const adminPhone = company?.phone || "+62 813 9876 5432";

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <SectionHeader
        title="Profil Pengelola Fleet"
        subtitle="Identitas pengurus dan informasi legalitas perusahaan logistik Anda."
      />

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
          {error}
        </Card>
      )}

      {isLoading && !company ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          {/* Profile Card */}
          <Card className="p-6 text-center shadow-sm border border-slate-200/60 flex flex-col items-center relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
              </div>
            )}
            <div className="w-24 h-24 rounded-full bg-red-50 text-[#e31837] flex items-center justify-center mb-4 shadow-md border-4 border-red-100">
              <UserCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{adminName}</h2>
            <p className="text-xs font-bold text-pertamina-red bg-red-50 px-3 py-1 rounded-full mt-2">
              Admin Perusahaan
            </p>
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="break-all">{adminEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{adminPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Kawasan Industri Logistik Terpadu</span>
              </div>
            </div>
          </Card>

          {/* Details Card */}
          <Card className="p-0 shadow-sm border border-slate-200/60 overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
              </div>
            )}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">Detail Perusahaan & Legalitas</h3>
                <p className="text-xs text-slate-500 mt-1">Status kepatuhan badan usaha terdaftar.</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Nama Perusahaan</p>
                  <p className="font-semibold text-slate-900 text-xs">{company?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">NIB (Nomor Induk Berusaha)</p>
                  <p className="font-mono text-slate-700 text-xs font-semibold">{legal?.nib || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email Perusahaan</p>
                  <p className="font-semibold text-slate-900 text-xs">{company?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Nomor Telepon</p>
                  <p className="font-semibold text-slate-900 text-xs">{company?.phone || "-"}</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-pertamina-red" /> Kepatuhan Dokumen Legalitas (Compliance)
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">SIUP</p>
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">
                        {legal?.siup_no ? "Valid" : "Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">NIB</p>
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">
                        {legal?.nib ? "Valid" : "Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-1">NPWP</p>
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">
                        {legal?.npwp_no ? "Valid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pertamina-red" /> Alokasi Subsidi Armada
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-red-50 text-[#e31837] border border-red-100 rounded-full text-xs font-bold">Skema Per-Armada Aktif</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">
                    Estimasi Ukuran Fleet: {company?.fleet_size || "0"} Unit
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
