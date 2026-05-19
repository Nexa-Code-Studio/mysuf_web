import type { ReactNode } from "react";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card className="space-y-4">
      <CardHeader className="mb-0">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <div className="h-56 w-full">{children}</div>
    </Card>
  );
}
