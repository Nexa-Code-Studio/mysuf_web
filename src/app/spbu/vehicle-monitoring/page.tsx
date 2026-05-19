import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";

const vehicles = [
  { plate: "B 2190 TZ", status: "On Site", last: "08:12" },
  { plate: "D 4419 LK", status: "Queue", last: "08:21" },
  { plate: "F 8312 GR", status: "Exit", last: "08:33" },
];

export default function SpbuVehicleMonitoringPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Monitoring Kendaraan"
        subtitle="Status kendaraan di area SPBU."
      />
      <DataTable
        columns={[
          { key: "plate", label: "Plat" },
          { key: "status", label: "Status" },
          { key: "last", label: "Update" },
        ]}
        rows={vehicles}
      />
    </div>
  );
}
