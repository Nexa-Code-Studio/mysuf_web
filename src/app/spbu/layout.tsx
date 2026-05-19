import type { ReactNode } from "react";

import SpbuLayoutClient from "@/components/layout/spbu/SpbuLayoutClient";

export default function SpbuLayout({ children }: { children: ReactNode }) {
  return <SpbuLayoutClient>{children}</SpbuLayoutClient>;
}
