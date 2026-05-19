import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const activities = [
  { time: "08:10", detail: "Audit stok nozzle selesai." },
  { time: "08:24", detail: "Fraud alert ditandai untuk inspeksi." },
  { time: "08:45", detail: "Shift siang mulai bertugas." },
];

export default function SpbuActivityPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Riwayat Aktivitas"
        subtitle="Jejak aktivitas operasional SPBU hari ini."
      />
      <Card className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.time} className="flex items-center gap-4">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {activity.time}
            </span>
            <p className="text-sm text-slate-700">{activity.detail}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
