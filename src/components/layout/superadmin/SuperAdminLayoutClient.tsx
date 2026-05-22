"use client";

import type { ReactNode } from "react";

import RoleGate from "@/components/auth/RoleGate";
import SuperAdminSidebar from "@/components/layout/superadmin/SuperAdminSidebar";
import SuperAdminTopbar from "@/components/layout/superadmin/SuperAdminTopbar";

export default function SuperAdminLayoutClient({ children }: { children: ReactNode }) {
  return (
    <RoleGate expectedRole="SUPER_ADMIN">
      <div className="min-h-screen bg-white">
        <SuperAdminSidebar />
        <div className="pl-72">
          <SuperAdminTopbar />
          <main className="min-h-[calc(100vh-4rem)] bg-white bg-[radial-gradient(circle_at_top,_rgba(227,24,55,0.08),_rgba(255,255,255,0))] px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
