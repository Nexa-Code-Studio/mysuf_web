import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { governmentDashboard } from "@/lib/mockData";

export default function GovernmentHeatmapPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Heatmap Distribusi"
        subtitle="Sebaran intensitas distribusi subsidi nasional."
      />
      <DataTable
        columns={[
          { key: "region", label: "Wilayah" },
          { key: "intensity", label: "Intensitas" },
          { key: "volume", label: "Volume" },
        ]}
        rows={governmentDashboard.heatmap}
      />
    </div>
  );
}
