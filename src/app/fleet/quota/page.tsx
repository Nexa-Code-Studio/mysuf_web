import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";

const quotas = [
  { area: "Jabodetabek", limit: "38.000 L", used: "31.200 L" },
  { area: "Jawa Barat", limit: "22.000 L", used: "18.900 L" },
  { area: "Jawa Timur", limit: "18.000 L", used: "14.400 L" },
];

export default function FleetQuotaPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Kuota Perusahaan" subtitle="Monitoring kuota BBM per wilayah." />
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Kuota Tersisa" value="22%" trend="-5%" tone="warning" />
        <StatCard label="Permintaan Pending" value="14" trend="+3" tone="primary" />
        <StatCard label="Kuota Bulanan" value="78.000 L" trend="+2%" tone="neutral" />
      </div>
      <DataTable
        columns={[
          { key: "area", label: "Wilayah" },
          { key: "limit", label: "Limit" },
          { key: "used", label: "Terpakai" },
        ]}
        rows={quotas}
      />
    </div>
  );
}
