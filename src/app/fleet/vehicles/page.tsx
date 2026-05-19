import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";

const vehicles = [
  { unit: "TR-8821", type: "Tanker", status: "On Route" },
  { unit: "TR-1145", type: "Box", status: "Maintenance" },
  { unit: "TR-4512", type: "Pickup", status: "Idle" },
];

export default function FleetVehiclesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Armada Kendaraan" subtitle="Daftar unit aktif dan status." />
      <DataTable
        columns={[
          { key: "unit", label: "Unit" },
          { key: "type", label: "Tipe" },
          { key: "status", label: "Status" },
        ]}
        rows={vehicles}
      />
    </div>
  );
}
