import type { ReactNode } from "react";

import GovernmentLayoutClient from "@/components/layout/government/GovernmentLayoutClient";

export default function GovernmentLayout({ children }: { children: ReactNode }) {
  return <GovernmentLayoutClient>{children}</GovernmentLayoutClient>;
}
