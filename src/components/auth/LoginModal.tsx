"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Crown, ShieldCheck, Truck, X } from "lucide-react";
import { Card } from "@/components/ui/Card";

const roleCards = [
  {
    href: "/login/super-admin",
    label: "Login Super Admin",
    hint: "Kontrol penuh user & konfigurasi sistem.",
    role: "Super Admin",
    icon: Crown,
    roleValue: "SUPER_ADMIN",
  },
  {
    href: "/login/spbu",
    label: "Login Admin SPBU",
    hint: "Operasional harian, monitoring realtime.",
    role: "Admin SPBU",
    icon: Building2,
    roleValue: "SPBU_ADMIN",
  },
  {
    href: "/login/government",
    label: "Login Admin Pemerintah",
    hint: "Kendali subsidi nasional, heatmap, kuota.",
    role: "Admin Pemerintah",
    icon: ShieldCheck,
    roleValue: "GOV_ADMIN",
  },
  {
    href: "/login/fleet",
    label: "Login Admin Perusahaan",
    hint: "Manajemen armada komersial.",
    role: "Admin Perusahaan",
    icon: Truck,
    roleValue: "COMPANY_ADMIN",
  },
];

export function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-[1fr_1fr] h-full max-h-[85vh] overflow-y-auto">
          {/* Left Side */}
          <div className="bg-slate-50 p-8 sm:p-12 border-r border-slate-100">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-6">
              MySuF Login
            </div>
            <h2 className="text-3xl font-bold leading-tight text-slate-900 mb-4">
              Masuk ke Dashboard Sesuai Otoritas Anda
            </h2>
            <p className="text-slate-600 mb-8">
              Pilih peran Anda untuk masuk ke command center. Untuk warga yang ingin mendaftar subsidi pribadi, silakan download aplikasi MySuF di App Store atau Google Play.
            </p>
            
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900 mb-3">Status Sistem</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Uptime</p>
                  <p className="font-semibold text-slate-900">99.98%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Node Aktif</p>
                  <p className="font-semibold text-slate-900">128+ SPBU</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-4">
            <h3 className="font-semibold text-slate-900 mb-2">Pilih Peran Anda</h3>
            {roleCards.map((option) => (
              <button
                key={option.href}
                onClick={() => {
                  localStorage.setItem("mysuf-role", option.roleValue);
                  router.push(option.href);
                }}
                className="block w-full text-left"
              >
                <Card className="flex items-center justify-between gap-4 transition hover:border-[var(--primary)] group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-10)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                      <option.icon className="h-6 w-6" aria-hidden />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{option.label}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{option.hint}</p>
                    </div>
                  </div>
                </Card>
              </button>
            ))}

            <div className="mt-8 text-center bg-[#e31837]/5 rounded-xl p-4 border border-[#e31837]/10">
               <p className="text-sm text-slate-700">Warga / Pengguna Pribadi?</p>
               <p className="text-xs text-slate-500 mt-1">Gunakan aplikasi mobile MySuF untuk mendaftar dan cek kuota subsidi. Aplikasi tersedia untuk iOS dan Android.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}