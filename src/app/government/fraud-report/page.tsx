import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { governmentDashboard } from "@/lib/mockData";

export default function GovernmentFraudReportPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Fraud Report" subtitle="Laporan kasus anomali nasional." />
      <DataTable
        columns={[
          { key: "caseId", label: "Case" },
          { key: "type", label: "Jenis" },
          { key: "status", label: "Status" },
        ]}
        rows={governmentDashboard.fraudCases}
      />
    </div>
  );
}
