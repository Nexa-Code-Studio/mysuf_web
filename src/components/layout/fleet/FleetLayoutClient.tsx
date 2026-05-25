"use client";

import type { ReactNode } from "react";

import RoleGate from "@/components/auth/RoleGate";
import FleetSidebar from "@/components/layout/fleet/FleetSidebar";
import FleetTopbar from "@/components/layout/fleet/FleetTopbar";

export default function FleetLayoutClient({ children }: { children: ReactNode }) {
  return (
    <RoleGate expectedRole="COMPANY_ADMIN">
      <div className="min-h-screen bg-white">
        <FleetSidebar />
        <div className="pl-72">
          <FleetTopbar />
          <main className="min-h-[calc(100vh-4rem)] bg-white bg-[radial-gradient(circle_at_top,rgba(227,24,55,0.06),rgba(255,255,255,0))] px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
