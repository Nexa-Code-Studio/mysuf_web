import BarChartSimple from "@/components/charts/BarChartSimple";
import ChartCard from "@/components/ui/ChartCard";
import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { dummyTransactions } from "@/data/dummyTransactions";
import { buildFamilyEligibilitySummaries } from "@/lib/eligibilityEngine";
import { buildGovernmentDashboardSummary, evaluateTransactions } from "@/lib/fraudDetection";

const evaluatedTransactions = evaluateTransactions(dummyTransactions);
const familyEligibility = buildFamilyEligibilitySummaries(dummyTransactions);
const governmentSummary = buildGovernmentDashboardSummary(evaluatedTransactions);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

const formatQuota = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

const evaluatedRows = evaluatedTransactions.slice(0, 10).map((transaction) => ({
  transactionId: transaction.transactionId,
  familyId: transaction.familyId,
  vehicleId: transaction.vehicleId,
  station: transaction.stationName,
  riskLevel: transaction.riskLevel,
  action: transaction.action,
  baseQuota: formatQuota(transaction.baseQuota),
  finalQuota: formatQuota(transaction.finalQuota),
}));

const familyRows = familyEligibility.map((family) => ({
  familyId: family.familyId,
  vehicleCount: family.vehicles.length,
  totalNJKB: `Rp ${formatCurrency(family.totalNJKB)}`,
  threshold: `Rp ${formatCurrency(family.threshold)}`,
  eligible: family.eligible ? "Yes" : "No",
}));

const topRiskUserRows = governmentSummary.topRiskyUsers.map((item) => ({
  label: item.label,
  score: item.score,
  transactionCount: item.transactionCount,
  fraudCount: item.fraudCount,
}));

const topRiskFamilyRows = governmentSummary.topRiskyFamilies.map((item) => ({
  label: item.label,
  score: item.score,
  transactionCount: item.transactionCount,
  fraudCount: item.fraudCount,
}));

const topRiskStationRows = governmentSummary.stationsWithHighestFraudCount.map((item) => ({
  label: item.label,
  score: item.score,
  transactionCount: item.transactionCount,
  fraudCount: item.fraudCount,
}));

export default function GovernmentDashboardPage() {
  const eligibleFamilies = familyEligibility.filter((family) => family.eligible).length;
  const ineligibleFamilies = familyEligibility.length - eligibleFamilies;
  const fraudStations = governmentSummary.stationsWithHighestFraudCount.map((station) => ({
    station: station.label,
    frauds: station.fraudCount,
    riskScore: station.score,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Fraud & Quota Engine"
        subtitle="Eligibility, fraud detection, dan kuota final untuk MySuF berjalan di atas dummy data lokal yang modular."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Total Transactions", value: String(governmentSummary.totalTransactions), trend: "+ live" },
          { label: "Safe Count", value: String(governmentSummary.safeCount), trend: "ALLOW" },
          { label: "Suspicious Count", value: String(governmentSummary.suspiciousCount), trend: "WARN" },
          { label: "High + Critical", value: String(governmentSummary.highRiskCount + governmentSummary.criticalCount), trend: "BLOCK" },
        ].map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            trend={item.trend}
            tone={item.label.includes("Suspicious") || item.label.includes("High") ? "warning" : "primary"}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Critical Count" value={String(governmentSummary.criticalCount)} trend="BLOCK ACCOUNT" tone="warning" />
        <StatCard label="Eligible Families" value={String(eligibleFamilies)} trend="PASS" tone="primary" />
        <StatCard label="Ineligible Families" value={String(ineligibleFamilies)} trend="REJECT" tone="warning" />
        <StatCard label="Fraud Stations" value={String(fraudStations.length)} trend="ALERT" tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ChartCard title="Stations dengan Fraud Tertinggi" description="Jumlah transaksi fraud per stasiun dari data dummy lokal.">
          <BarChartSimple
            data={fraudStations}
            xKey="station"
            yKey="frauds"
          />
        </ChartCard>
        <ChartCard title="Risk Level Snapshot" description="Distribusi risk score berdasarkan hasil engine.">
          <BarChartSimple
            data={[
              { level: "SAFE", value: governmentSummary.safeCount },
              { level: "SUSPICIOUS", value: governmentSummary.suspiciousCount },
              { level: "HIGH_RISK", value: governmentSummary.highRiskCount },
              { level: "CRITICAL", value: governmentSummary.criticalCount },
            ]}
            xKey="level"
            yKey="value"
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          <SectionHeader title="Evaluated Transactions" subtitle="Output per transaksi dari fraud engine dan quota engine." />
          <DataTable
            columns={[
              { key: "transactionId", label: "Transaction" },
              { key: "familyId", label: "Family" },
              { key: "vehicleId", label: "Vehicle" },
              { key: "station", label: "Station" },
              { key: "riskLevel", label: "Risk Level" },
              { key: "action", label: "Action" },
              { key: "baseQuota", label: "Base Quota" },
              { key: "finalQuota", label: "Final Quota" },
            ]}
            rows={evaluatedRows}
          />
        </div>

        <div className="space-y-3">
          <SectionHeader title="Eligibility Summary" subtitle="Kelayakan dihitung dari total NJKB seluruh kendaraan dalam satu KK." />
          <DataTable
            columns={[
              { key: "familyId", label: "Family" },
              { key: "vehicleCount", label: "Vehicles" },
              { key: "totalNJKB", label: "Total NJKB" },
              { key: "eligible", label: "Eligible" },
            ]}
            rows={familyRows}
          />

          <SectionHeader title="Top Risky Users" subtitle="Akumulasi skor risiko per user." />
          <DataTable
            columns={[
              { key: "label", label: "User" },
              { key: "score", label: "Risk" },
              { key: "transactionCount", label: "Tx" },
              { key: "fraudCount", label: "Frauds" },
            ]}
            rows={topRiskUserRows}
          />

          <SectionHeader title="Top Risky Families" subtitle="Akumulasi skor risiko per KK." />
          <DataTable
            columns={[
              { key: "label", label: "Family" },
              { key: "score", label: "Risk" },
              { key: "transactionCount", label: "Tx" },
              { key: "fraudCount", label: "Frauds" },
            ]}
            rows={topRiskFamilyRows}
          />

          <SectionHeader title="Top Fraud Stations" subtitle="Stasiun dengan fraud count tertinggi." />
          <DataTable
            columns={[
              { key: "label", label: "Station" },
              { key: "score", label: "Risk" },
              { key: "transactionCount", label: "Tx" },
              { key: "fraudCount", label: "Frauds" },
            ]}
            rows={topRiskStationRows}
          />
        </div>
      </div>
    </div>
  );
}
