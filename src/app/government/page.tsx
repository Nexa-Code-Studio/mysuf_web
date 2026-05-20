import BarChartSimple from "@/components/charts/BarChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import DataTable from "@/components/ui/DataTable";
import NotificationList, { NotificationItem } from "@/components/ui/NotificationList";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { governmentDashboard } from "@/lib/mockData";

export default function GovernmentDashboardPage() {
  const notifications: NotificationItem[] = [
    {
      title: "Fraud cluster baru",
      detail: "3 kasus baru terdeteksi di wilayah Jawa Timur.",
      time: "09:02",
      tone: "critical",
    },
    {
      title: "Quota adjustment siap",
      detail: "Simulasi kebijakan kuota selesai diproses.",
      time: "09:18",
      tone: "warning",
    },
    {
      title: "Distribusi stabil",
      detail: "Monitoring nasional menunjukkan tren stabil.",
      time: "09:30",
      tone: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="National Command Center"
        subtitle="Kendali distribusi subsidi dan monitoring risiko nasional."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {governmentDashboard.stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            trend={item.trend}
            tone={item.label.includes("Fraud") ? "warning" : "primary"}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Distribusi Subsidi Nasional" description="Distribusi per wilayah utama.">
          <BarChartSimple
            data={[
              { region: "Sumatera", volume: 2.1 },
              { region: "Jawa", volume: 5.8 },
              { region: "Kalimantan", volume: 1.2 },
              { region: "Sulawesi", volume: 1.1 },
            ]}
            xKey="region"
            yKey="volume"
          />
        </ChartCard>
        <ChartCard title="Quota Adjustment" description="Kebijakan kuota aktif minggu ini.">
          <BarChartSimple
            data={[
              { policy: "Jabodetabek", value: 4 },
              { policy: "Kaltim", value: 6 },
              { policy: "Jatim", value: 3 },
            ]}
            xKey="policy"
            yKey="value"
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <SectionHeader
            title="Heatmap Distribusi"
            subtitle="Ringkasan intensitas distribusi per pulau."
          />
          <DataTable
            columns={[
              { key: "region", label: "Wilayah" },
              { key: "intensity", label: "Intensitas" },
              { key: "volume", label: "Volume" },
            ]}
            rows={governmentDashboard.heatmap}
          />
        </div>
        <div className="space-y-3">
          <SectionHeader
            title="Fraud Case Nasional"
            subtitle="Kasus prioritas untuk investigasi."
          />
          <DataTable
            columns={[
              { key: "caseId", label: "Case" },
              { key: "type", label: "Jenis" },
              { key: "status", label: "Status" },
            ]}
            rows={governmentDashboard.fraudCases}
          />
        </div>
      </div>

      <NotificationList title="Notifikasi Command Center" items={notifications} />
    </div>
  );
}
