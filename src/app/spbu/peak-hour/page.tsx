import AreaChartSimple from "@/components/charts/AreaChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { spbuDashboard } from "@/lib/mockData";

export default function SpbuPeakHourPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Peak Hour Analytics"
        subtitle="Distribusi volume keluar dan kepadatan antrian."
      />
      <ChartCard title="Volume Keluar" description="Pola transaksi per jam.">
        <AreaChartSimple data={spbuDashboard.peakHours} xKey="hour" yKey="volume" />
      </ChartCard>
    </div>
  );
}
