import AreaChartSimple from "@/components/charts/AreaChartSimple";
import BarChartSimple from "@/components/charts/BarChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import DataTable from "@/components/ui/DataTable";
import NotificationList from "@/components/ui/NotificationList";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { spbuDashboard } from "@/lib/mockData";

export default function SpbuDashboardPage() {
  const notifications = [
    {
      title: "Fraud alert terdeteksi",
      detail: "Pengisian berulang pada kendaraan B 9123 KZ.",
      time: "08:12",
      tone: "critical",
    },
    {
      title: "Queue peak hour",
      detail: "Antrian naik 18% dibanding jam sebelumnya.",
      time: "08:27",
      tone: "warning",
    },
    {
      title: "Stok nozzle aman",
      detail: "Stok nozzle utama masih di atas 65%.",
      time: "08:40",
      tone: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Operasional SPBU Hari Ini"
        subtitle="Pantau transaksi, volume, dan fraud alert secara realtime."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {spbuDashboard.stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            trend={item.trend}
            tone={item.label.includes("Fraud") ? "warning" : "primary"}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ChartCard
          title="Peak Hour Analytics"
          description="Distribusi volume keluar per jam."
        >
          <AreaChartSimple data={spbuDashboard.peakHours} xKey="hour" yKey="volume" />
        </ChartCard>
        <ChartCard title="Transaksi Per Shift" description="Perbandingan per shift hari ini.">
          <BarChartSimple
            data={[
              { shift: "Pagi", value: 420 },
              { shift: "Siang", value: 510 },
              { shift: "Malam", value: 354 },
            ]}
            xKey="shift"
            yKey="value"
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <SectionHeader
            title="Kendaraan Mencurigakan"
            subtitle="Daftar kendaraan yang terdeteksi pola anomali."
          />
          <DataTable
            columns={[
              { key: "plate", label: "Plat" },
              { key: "reason", label: "Indikasi" },
              { key: "risk", label: "Risk" },
            ]}
            rows={spbuDashboard.suspiciousVehicles}
          />
        </div>
        <div className="space-y-3">
          <SectionHeader
            title="Aktivitas Petugas"
            subtitle="Ringkasan shift dan status lapangan."
          />
          <DataTable
            columns={[
              { key: "name", label: "Petugas" },
              { key: "shift", label: "Shift" },
              { key: "status", label: "Status" },
              { key: "last", label: "Update" },
            ]}
            rows={spbuDashboard.staffActivity}
          />
        </div>
      </div>

      <NotificationList title="Notifikasi Operasional" items={notifications} />
    </div>
  );
}
