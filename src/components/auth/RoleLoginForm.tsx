"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <Card className="w-full max-w-lg space-y-6 border-slate-200 bg-white text-slate-900">
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-xs font-semibold text-slate-600">
          Email
          <input
            type="email"
            placeholder="nama@mysuf.id"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[var(--primary)]"
          />
        </label>
        <label className="block text-xs font-semibold text-slate-600">
          Password
          <input
            type="password"
            placeholder="********"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[var(--primary)]"
          />
        </label>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-900">Dummy Login</p>
          <p>{dummyAccount}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">{helper}</span>
          <Button type="submit">Masuk sebagai {ROLE_LABELS[role]}</Button>
        </div>
      </form>
    </Card>
  );
}
