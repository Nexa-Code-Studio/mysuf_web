import type { ReactNode } from "react";

import SuperAdminLayoutClient from "@/components/layout/superadmin/SuperAdminLayoutClient";

export default function MySufAdminLayout({ children }: { children: ReactNode }) {
  return <SuperAdminLayoutClient>{children}</SuperAdminLayoutClient>;
}
