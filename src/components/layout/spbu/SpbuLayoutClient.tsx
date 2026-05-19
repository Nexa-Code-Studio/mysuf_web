"use client";

import type { ReactNode } from "react";

import RoleGate from "@/components/auth/RoleGate";
import SpbuSidebar from "@/components/layout/spbu/SpbuSidebar";
import SpbuTopbar from "@/components/layout/spbu/SpbuTopbar";

export default function SpbuLayoutClient({ children }: { children: ReactNode }) {
  return (
    <RoleGate expectedRole="SPBU_ADMIN">
      <div className="min-h-screen bg-white">
        <SpbuSidebar />
        <div className="pl-72">
          <SpbuTopbar />
          <main className="min-h-[calc(100vh-4rem)] bg-white bg-[radial-gradient(circle_at_top,_rgba(227,24,55,0.08),_rgba(255,255,255,0))] px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
