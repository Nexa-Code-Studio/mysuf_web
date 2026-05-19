import LineChartSimple from "@/components/charts/LineChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import SectionHeader from "@/components/ui/SectionHeader";

const nationalTrend = [
  { month: "Jan", value: 78 },
  { month: "Feb", value: 82 },
  { month: "Mar", value: 80 },
  { month: "Apr", value: 86 },
  { month: "Mei", value: 89 },
  { month: "Jun", value: 84 },
];

export default function GovernmentAnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics Nasional"
        subtitle="Trend pemanfaatan subsidi dan efektivitas kebijakan."
      />
      <ChartCard title="Trend Subsidi" description="Indeks pemanfaatan subsidi nasional.">
        <LineChartSimple data={nationalTrend} xKey="month" yKey="value" />
      </ChartCard>
    </div>
  );
}
