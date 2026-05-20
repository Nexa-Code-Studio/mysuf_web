"use client";

import { useRouter } from "next/navigation";

import { ROLE_STORAGE_KEY } from "@/lib/roles";

export default function LogoutButton({ className = "", variant = "solid" }: { className?: string; variant?: "solid" | "outline" }) {
  const router = useRouter();

  const handleLogout = () => {
    window.localStorage.removeItem(ROLE_STORAGE_KEY);
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        variant === "solid"
          ? `flex items-center justify-center rounded-xl bg-[#e31837] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#c4142e] active:scale-[0.98] shadow-sm ${className}`
          : `flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 hover:text-red-700 active:scale-[0.98] ${className}`
      }
    >
      Logout
    </button>
  );
}
