import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import type { UserRole } from "@/types";

export type DashboardLayoutProps = {
  children: ReactNode;
  currentRole: UserRole;
  userName: string;
  userInitials: string;
  notificationCount?: number;
};

export default function DashboardLayout({
  children,
  currentRole,
  userName,
  userInitials,
  notificationCount,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentRole={currentRole} />
      <div className="ml-68 flex min-h-screen flex-col">
        <Header
          userName={userName}
          userRole={currentRole}
          userInitials={userInitials}
          notificationCount={notificationCount}
        />
        <main className="flex-1 bg-slate-50 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
