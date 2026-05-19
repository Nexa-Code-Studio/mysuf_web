import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";

const blacklist = [
  { plate: "B 9001 ZZ", reason: "Fraud berulang", status: "Blok" },
  { plate: "D 4109 AA", reason: "Pemalsuan data", status: "Blok" },
  { plate: "H 2234 CC", reason: "Akun disuspensi", status: "Review" },
];

export default function GovernmentBlacklistPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Blacklist Kendaraan"
        subtitle="Daftar kendaraan dengan pembatasan subsidi."
      />
      <DataTable
        columns={[
          { key: "plate", label: "Plat" },
          { key: "reason", label: "Alasan" },
          { key: "status", label: "Status" },
        ]}
        rows={blacklist}
      />
    </div>
  );
}
