import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { fleetDashboard } from "@/lib/mockData";

export default function FleetDriverActivityPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Driver Activity"
        subtitle="Aktivitas perjalanan dan compliance driver."
      />
      <DataTable
        columns={[
          { key: "name", label: "Driver" },
          { key: "trips", label: "Trip" },
          { key: "compliance", label: "Compliance" },
        ]}
        rows={fleetDashboard.driverActivity}
      />
    </div>
  );
}
