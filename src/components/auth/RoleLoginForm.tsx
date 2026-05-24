"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ROLE_BASE_PATH, ROLE_LABELS, ROLE_STORAGE_KEY } from "@/lib/roles";
import type { UserRole } from "@/types";

export type RoleLoginFormProps = {
  role: UserRole;
  title: string;
  subtitle: string;
  helper: string;
  dummyAccount: string;
};

export default function RoleLoginForm({
  role,
  title,
  subtitle,
  helper,
  dummyAccount,
}: RoleLoginFormProps) {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    router.push(ROLE_BASE_PATH[role]);
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--primary)] mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </Link>
      
      <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-10)] rounded-bl-full pointer-events-none" />
        
        <div className="mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-20)] bg-[var(--primary-10)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--primary)] mb-4">
            Portal {ROLE_LABELS[role]}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
        </div>

        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Akses</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="nama@mysuf.id"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--primary)] focus:bg-white focus:ring-1 focus:ring-[var(--primary)]"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-semibold text-[var(--primary)] hover:underline">Lupa password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--primary)] focus:bg-white focus:ring-1 focus:ring-[var(--primary)]"
                required
              />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--primary-20)] bg-[var(--primary-10)] p-4 mt-2">
            <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-1">Informasi Login</p>
            <p className="text-sm font-medium text-slate-700 font-mono bg-white px-2 py-1 rounded border border-[var(--primary-20)] inline-block">{dummyAccount}</p>
            <p className="text-[10px] text-slate-500 mt-2">{helper}</p>
          </div>

          <Button type="submit" size="lg" className="w-full h-12 bg-(--primary) hover:brightness-95 text-white text-base shadow-lg shadow-(--primary-20) transition-all hover:shadow-(--primary-20) hover:-translate-y-0.5">
            Masuk ke Dashboard
          </Button>
        </form>
      </div>
      
      <p className="text-center text-xs text-slate-400 mt-8">
        © 2026 MySuF Platform. Akses ilegal dilacak oleh sistem AI.
      </p>
    </div>
  );
}
