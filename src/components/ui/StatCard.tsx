import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";

export type StatCardProps = {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  tone?: "primary" | "neutral" | "warning";
  icon?: ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  trendSubtext?: string;
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "text-[#e31837]",
  neutral: "text-slate-600",
  warning: "text-amber-600",
};

export default function StatCard({ 
  label, 
  value, 
  trend, 
  trendDirection = "up",
  tone = "neutral",
  icon,
  iconBgColor = "bg-slate-100",
  iconTextColor = "text-slate-600",
  trendSubtext
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1 shadow-sm border border-slate-200/60 hover:shadow-md transition duration-200">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor} ${iconTextColor}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-3 mb-1">
        <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-sm font-semibold mb-1 ${trendDirection === 'down' ? 'text-red-500' : 'text-emerald-500'}`}>
            {trendDirection === 'up' ? <TrendingUp className="h-4 w-4" /> : trendDirection === 'down' ? <TrendingDown className="h-4 w-4" /> : null}
          </span>
        )}
      </div>
      
      {(trend || trendSubtext) && (
        <p className={`text-xs ${trendDirection === 'down' ? 'text-red-500' : trendDirection === 'up' ? 'text-emerald-600' : 'text-slate-500'}`}>
          {trend} {trendSubtext}
        </p>
      )}
    </Card>
  );
}
