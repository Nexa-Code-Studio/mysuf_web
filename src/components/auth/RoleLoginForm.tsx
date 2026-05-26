"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { persistAuthSession, WEB_CLIENT_TYPE } from "@/lib/auth-session";
import { ROLE_BASE_PATH, ROLE_LABELS } from "@/lib/roles";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          client_type: WEB_CLIENT_TYPE,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: "Login gagal. Periksa kembali email dan password Anda." }));
        throw new Error(errData.detail || "Email atau password salah.");
      }

      const data = await response.json();
      
      // Response contains: { access_token, refresh_token, user: { id, name, email, roles: [...] } }
      const userRoles = data.user?.roles || [];
      if (!userRoles.includes(role)) {
        throw new Error(`Akses Ditolak. Akun Anda tidak memiliki hak akses sebagai ${ROLE_LABELS[role]}.`);
      }

      persistAuthSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        user: data.user,
        role,
        clientType: WEB_CLIENT_TYPE,
      });

      // Successfully authenticated, navigate to base portal dashboard
      router.push(ROLE_BASE_PATH[role]);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal menghubungi server. Pastikan koneksi internet aktif.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-(--primary) mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </Link>
      
      <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-(--primary-10) rounded-bl-full pointer-events-none" />
        
        <div className="mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-(--primary-20) bg-(--primary-10) px-3 py-1 text-xs font-bold uppercase tracking-wide text-(--primary) mb-4">
            Portal {ROLE_LABELS[role]}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-600 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Akses</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@mysuf.id"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--primary) focus:bg-white focus:ring-1 focus:ring-(--primary)"
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-semibold text-(--primary) hover:underline">Lupa password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-(--primary) focus:bg-white focus:ring-1 focus:ring-(--primary)"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="rounded-xl border border-(--primary-20) bg-(--primary-10) p-4 mt-2">
            <p className="text-xs font-bold text-(--primary) uppercase tracking-wider mb-1">Informasi Login</p>
            <p className="text-sm font-medium text-slate-700 font-mono bg-white px-2 py-1 rounded border border-(--primary-20) inline-block">{dummyAccount}</p>
            <p className="text-[10px] text-slate-500 mt-2">{helper}</p>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 bg-(--primary) hover:brightness-95 text-white text-base shadow-lg transition-all hover:shadow-(--primary-20) hover:-translate-y-0.5 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sedang Masuk...
              </>
            ) : (
              "Masuk ke Dashboard"
            )}
          </Button>
        </form>
      </div>
      
      <p className="text-center text-xs text-slate-400 mt-8">
        © 2026 MySuF Platform. Akses ilegal dilacak oleh sistem AI.
      </p>
    </div>
  );
}
