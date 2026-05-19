import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/Card";

export type StatCardProps = {
  label: string;
  value: string;
  trend?: string;
  tone?: "primary" | "neutral" | "warning";
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "text-pertamina-red",
  neutral: "text-slate-600",
  warning: "text-amber-600",
};

export default function StatCard({ label, value, trend, tone = "neutral" }: StatCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {trend ? (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${toneStyles[tone]}`}>
            <ArrowUpRight className="h-4 w-4" aria-hidden />
            {trend}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
