"use client";

import type { ReactNode } from "react";

import RoleGate from "@/components/auth/RoleGate";
import GovernmentSidebar from "@/components/layout/government/GovernmentSidebar";
import GovernmentTopbar from "@/components/layout/government/GovernmentTopbar";

export default function GovernmentLayoutClient({ children }: { children: ReactNode }) {
  return (
    <RoleGate expectedRole="GOV_ADMIN">
      <div className="min-h-screen bg-white">
        <GovernmentSidebar />
        <div className="pl-72">
          <GovernmentTopbar />
          <main className="min-h-[calc(100vh-4rem)] bg-white bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_rgba(255,255,255,0))] px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
