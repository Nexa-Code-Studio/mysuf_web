import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";

const alerts = [
  { id: "FR-2201", vehicle: "B 9123 KZ", issue: "Pengisian berulang", severity: "High" },
  { id: "FR-2202", vehicle: "D 4401 NH", issue: "Mismatch kuota", severity: "Medium" },
  { id: "FR-2203", vehicle: "BG 1184 TR", issue: "ID petugas tidak valid", severity: "High" },
];

export default function SpbuFraudAlertPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Fraud Alert"
        subtitle="Pantau notifikasi fraud dan tindak cepat." 
      />
      <DataTable
        columns={[
          { key: "id", label: "Case" },
          { key: "vehicle", label: "Kendaraan" },
          { key: "issue", label: "Indikasi" },
          { key: "severity", label: "Severity" },
        ]}
        rows={alerts}
      />
    </div>
  );
}
