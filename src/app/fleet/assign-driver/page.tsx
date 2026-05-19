import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";

const assignments = [
  { driver: "Rizal", unit: "TR-8821", shift: "Pagi" },
  { driver: "Sinta", unit: "TR-1145", shift: "Siang" },
  { driver: "Agus", unit: "TR-4512", shift: "Malam" },
];

export default function FleetAssignDriverPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Assign Driver" subtitle="Penjadwalan driver untuk armada." />
      <DataTable
        columns={[
          { key: "driver", label: "Driver" },
          { key: "unit", label: "Unit" },
          { key: "shift", label: "Shift" },
        ]}
        rows={assignments}
      />
    </div>
  );
}
