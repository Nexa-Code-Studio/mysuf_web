import type { ReactNode } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockNotificationCount, mockUser } from "@/lib/mockData";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      currentRole={mockUser.role}
      userName={mockUser.name}
      userInitials={mockUser.initials}
      notificationCount={mockNotificationCount}
    >
      {children}
    </DashboardLayout>
  );
}
