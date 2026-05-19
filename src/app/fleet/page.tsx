import LineChartSimple from "@/components/charts/LineChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import DataTable from "@/components/ui/DataTable";
import NotificationList from "@/components/ui/NotificationList";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { fleetDashboard } from "@/lib/mockData";

export default function FleetDashboardPage() {
  const notifications = [
    {
      title: "Unit TR-1145 maintenance",
      detail: "Jadwal maintenance diperpanjang 2 jam.",
      time: "07:40",
      tone: "warning",
    },
    {
      title: "Driver compliance",
      detail: "2 driver belum submit laporan harian.",
      time: "08:05",
      tone: "critical",
    },
    {
      title: "Konsumsi BBM stabil",
      detail: "Konsumsi mingguan sesuai target efisiensi.",
      time: "08:25",
      tone: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fleet Dashboard"
        subtitle="Pantau armada, driver, dan efisiensi BBM perusahaan."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {fleetDashboard.stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            trend={item.trend}
            tone={item.label.includes("Kuota") ? "warning" : "primary"}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Fuel Efficiency" description="Efisiensi BBM per bulan.">
          <LineChartSimple
            data={fleetDashboard.fuelEfficiency}
            xKey="month"
            yKey="efficiency"
          />
        </ChartCard>
        <div className="space-y-3">
          <SectionHeader
            title="Vehicle Status"
            subtitle="Status armada prioritas hari ini."
          />
          <DataTable
            columns={[
              { key: "vehicle", label: "Unit" },
              { key: "status", label: "Status" },
              { key: "driver", label: "Driver" },
            ]}
            rows={fleetDashboard.vehicleStatus}
          />
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Driver Activity" subtitle="Aktivitas driver terbaru." />
        <DataTable
          columns={[
            { key: "name", label: "Driver" },
            { key: "trips", label: "Trip" },
            { key: "compliance", label: "Compliance" },
          ]}
          rows={fleetDashboard.driverActivity}
        />
      </div>

      <NotificationList title="Notifikasi Fleet" items={notifications} />
    </div>
  );
}
