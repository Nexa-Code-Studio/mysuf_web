import type { ReactNode } from "react";

import FleetLayoutClient from "@/components/layout/fleet/FleetLayoutClient";

export default function FleetLayout({ children }: { children: ReactNode }) {
  return <FleetLayoutClient>{children}</FleetLayoutClient>;
}
