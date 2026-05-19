import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { governmentDashboard } from "@/lib/mockData";

export default function GovernmentQuotaControlPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dynamic Quota Control"
        subtitle="Penyesuaian kuota berdasarkan kondisi wilayah."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Kuota Nasional" value="82%" trend="-3%" tone="warning" />
        <StatCard label="Area Prioritas" value="12" trend="+2" tone="primary" />
        <StatCard label="Kebijakan Aktif" value="6" trend="+1" tone="neutral" />
      </div>
      <DataTable
        columns={[
          { key: "area", label: "Wilayah" },
          { key: "action", label: "Aksi" },
          { key: "reason", label: "Alasan" },
        ]}
        rows={governmentDashboard.quotaAdjustments}
      />
    </div>
  );
}
