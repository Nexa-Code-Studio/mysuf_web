import { Card } from "@/components/ui/Card";

export type NotificationItem = {
  title: string;
  detail: string;
  time: string;
  tone?: "neutral" | "warning" | "critical";
};

const toneStyles: Record<NonNullable<NotificationItem["tone"]>, string> = {
  neutral: "bg-slate-100 text-slate-600",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-pertamina-red/15 text-pertamina-red",
};

export default function NotificationList({
  title,
  items,
}: {
  title: string;
  items: NotificationItem[];
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <span className="text-xs font-semibold text-slate-400">Realtime</span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.title}-${item.time}`} className="flex items-start gap-3">
            <span
              className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                toneStyles[item.tone ?? "neutral"]
              }`}
            >
              {item.time}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
