import type { ReactNode } from "react";

import SuperAdminLayoutClient from "@/components/layout/superadmin/SuperAdminLayoutClient";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <SuperAdminLayoutClient>{children}</SuperAdminLayoutClient>;
}
