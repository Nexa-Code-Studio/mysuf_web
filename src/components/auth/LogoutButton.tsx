"use client";

import { useRouter } from "next/navigation";

import { ROLE_STORAGE_KEY } from "@/lib/roles";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  const handleLogout = () => {
    window.localStorage.removeItem(ROLE_STORAGE_KEY);
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 ${className}`}
    >
      Logout
    </button>
  );
}
