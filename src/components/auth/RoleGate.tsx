"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { clearAuthSession } from "@/lib/auth-session";
import { ROLE_BASE_PATH, ROLE_STORAGE_KEY } from "@/lib/roles";
import type { UserRole } from "@/types";

export type RoleGateProps = {
  expectedRole: UserRole;
  children: ReactNode;
};

export default function RoleGate({ expectedRole, children }: RoleGateProps) {
  const router = useRouter();
  const storedRole =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(ROLE_STORAGE_KEY);

  useEffect(() => {
    if (!storedRole || !(storedRole in ROLE_BASE_PATH)) {
      clearAuthSession();
      router.replace("/");
      return;
    }

    if (storedRole !== expectedRole) {
      router.replace(ROLE_BASE_PATH[storedRole as UserRole]);
      return;
    }
  }, [expectedRole, router, storedRole]);

  if (!storedRole || !(storedRole in ROLE_BASE_PATH) || storedRole !== expectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
      </div>
    );
  }

  return <>{children}</>;
}
