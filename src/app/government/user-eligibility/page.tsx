import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";

const eligibility = [
  { name: "Warga A", status: "Valid", quota: "120 L" },
  { name: "Warga B", status: "Review", quota: "80 L" },
  { name: "Warga C", status: "Invalid", quota: "0 L" },
];

export default function GovernmentEligibilityPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="User Eligibility"
        subtitle="Validasi kelayakan subsidi dan status akun."
      />
      <DataTable
        columns={[
          { key: "name", label: "Akun" },
          { key: "status", label: "Status" },
          { key: "quota", label: "Kuota" },
        ]}
        rows={eligibility}
      />
    </div>
  );
}
