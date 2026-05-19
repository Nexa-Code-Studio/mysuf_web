import LineChartSimple from "@/components/charts/LineChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fleetDashboard } from "@/lib/mockData";

export default function FleetFuelConsumptionPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fuel Consumption"
        subtitle="Konsumsi BBM dan efisiensi armada."
      />
      <ChartCard title="Efisiensi Bulanan" description="Kilometer per liter rata-rata.">
        <LineChartSimple
          data={fleetDashboard.fuelEfficiency}
          xKey="month"
          yKey="efficiency"
        />
      </ChartCard>
    </div>
  );
}
