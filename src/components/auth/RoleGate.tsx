"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ROLE_BASE_PATH, ROLE_STORAGE_KEY } from "@/lib/roles";
import type { UserRole } from "@/types";

export type RoleGateProps = {
  expectedRole: UserRole;
  children: ReactNode;
};

export default function RoleGate({ expectedRole, children }: RoleGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);

    if (!storedRole || !(storedRole in ROLE_BASE_PATH)) {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
      router.replace("/login");
      return;
    }

    if (storedRole !== expectedRole) {
      router.replace(ROLE_BASE_PATH[storedRole as UserRole]);
      return;
    }

    setReady(true);
  }, [expectedRole, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
      </div>
    );
  }

  return <>{children}</>;
}
