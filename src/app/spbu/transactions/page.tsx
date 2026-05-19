import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";

const transactions = [
  { id: "TRX-2401", fuel: "Pertalite", volume: "38 L", time: "08:15" },
  { id: "TRX-2402", fuel: "Pertamax", volume: "25 L", time: "08:21" },
  { id: "TRX-2403", fuel: "Solar", volume: "90 L", time: "08:33" },
  { id: "TRX-2404", fuel: "Pertalite", volume: "41 L", time: "08:45" },
];

export default function SpbuTransactionsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Transaksi BBM"
        subtitle="Ringkasan transaksi hari ini di titik layanan."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Total Transaksi" value="1.284" trend="+8.2%" tone="primary" />
        <StatCard label="Rata-rata Volume" value="33 L" trend="+1.1%" tone="neutral" />
        <StatCard label="Anomali" value="5" trend="-2" tone="warning" />
      </div>

      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "fuel", label: "Jenis BBM" },
          { key: "volume", label: "Volume" },
          { key: "time", label: "Waktu" },
        ]}
        rows={transactions}
      />
    </div>
  );
}
