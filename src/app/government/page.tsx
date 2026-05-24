import BarChartSimple from "@/components/charts/BarChartSimple";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { dummyTransactions } from "@/data/dummyTransactions";
import { buildFamilyEligibilitySummaries } from "@/lib/eligibilityEngine";
import { buildGovernmentDashboardSummary, evaluateTransactions } from "@/lib/fraudDetection";
import { BASE_QUOTA_BY_VEHICLE_TYPE, RISK_MODIFIER_BY_LEVEL } from "@/lib/quotaEngine";

const evaluatedTransactions = evaluateTransactions(dummyTransactions);
const familyEligibility = buildFamilyEligibilitySummaries(dummyTransactions);
const governmentSummary = buildGovernmentDashboardSummary(evaluatedTransactions);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

const formatQuota = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

const topRiskStationRows = governmentSummary.stationsWithHighestFraudCount.map((item) => ({
  label: item.label,
  score: item.score,
  transactionCount: item.transactionCount,
  fraudCount: item.fraudCount,
}));

const analyticsSnapshot = [
  { label: "Total Subsidi Disalurkan", value: "Rp 1,24 T", note: "Sesuai pagu APBN 2026" },
  { label: "Kebocoran Dicegah", value: "Rp 148,5 M", note: "Hasil AI fraud alert prioritas" },
  { label: "Penyerapan Kuota", value: "82,4%", note: "Masih aman hingga akhir kuartal" },
  { label: "Ketepatan Sasaran", value: "96,8%", note: "Penerima subsidi terfilter lebih presisi" },
];

const policyRows = Object.entries(BASE_QUOTA_BY_VEHICLE_TYPE).map(([vehicleType, quota]) => ({
  vehicleType,
  baseQuota: `${formatQuota(quota)} L`,
  safe: `${formatQuota(quota * RISK_MODIFIER_BY_LEVEL.SAFE)} L`,
  suspicious: `${formatQuota(quota * RISK_MODIFIER_BY_LEVEL.SUSPICIOUS)} L`,
  highRisk: `${formatQuota(quota * RISK_MODIFIER_BY_LEVEL.HIGH_RISK)} L`,
  critical: `${formatQuota(quota * RISK_MODIFIER_BY_LEVEL.CRITICAL)} L`,
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
      <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Government Dashboard</h3>
          <p className="text-xs text-slate-500 mt-1">Ringkasan regulator: eligibility KK, policy kuota kendaraan, dan alert fraud prioritas.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Transaksi" value={String(governmentSummary.totalTransactions)} trend="LIVE" tone="primary" />
          <StatCard label="KK Layak / Tidak" value={`${eligibleFamilies}/${ineligibleFamilies}`} trend="ELIGIBILITY" tone="primary" />
          <StatCard
            label="Transaksi Risiko Tinggi"
            value={String(governmentSummary.highRiskCount + governmentSummary.criticalCount)}
            trend="BLOCK"
            tone="warning"
          />
          <StatCard label="SPBU Fraud Tertinggi" value={String(fraudStations.length)} trend="ALERT" tone="warning" />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4 overflow-hidden">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Prioritas Alert Fraud</h3>
            <p className="text-xs text-slate-500 mt-1">Stasiun dengan fraud count tertinggi dari AI engine.</p>
          </div>
          <div className="h-80 w-full overflow-hidden">
            <BarChartSimple data={fraudStations} xKey="station" yKey="frauds" />
          </div>
        </Card>

        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Ringkasan Nasional</h3>
            <p className="text-xs text-slate-500 mt-1">Ditaruh di dashboard agar satu layar cukup untuk membaca status pemerintah.</p>
          </div>
          <div className="space-y-3">
            {analyticsSnapshot.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.note}</p>
                </div>
                <p className="text-lg font-bold text-slate-950 whitespace-nowrap">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5 border border-slate-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Kebijakan Eligibility</h3>
            <p className="text-xs text-slate-500 mt-1">Pemerintah menetapkan batas total NJKB per KK.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ambang Batas NJKB</p>
              <p className="text-2xl font-bold text-slate-950">Rp {formatCurrency(familyEligibility[0]?.threshold ?? 300_000_000)}</p>
              <p className="text-xs text-slate-500">Total NJKB seluruh kendaraan dalam satu KK harus di bawah ambang ini.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Aturan Pemerintah</p>
              <p className="text-sm font-semibold text-slate-900">Eligibility dihitung per keluarga, bukan per kendaraan.</p>
              <p className="text-xs text-slate-500">Hasilnya dipakai untuk menentukan siapa yang layak menerima subsidi.</p>
            </div>
          </div>
          <DataTable
            columns={[
              { key: "familyId", label: "KK" },
              { key: "vehicleCount", label: "Jumlah Kendaraan" },
              { key: "totalNJKB", label: "Total NJKB" },
              { key: "eligible", label: "Eligible" },
            ]}
            rows={familyEligibility.map((family) => ({
              familyId: family.familyId,
              vehicleCount: family.vehicles.length,
              totalNJKB: `Rp ${formatCurrency(family.totalNJKB)}`,
              eligible: family.eligible ? "Ya" : "Tidak",
            }))}
          />
        </Card>

        <Card className="p-5 border border-slate-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Kebijakan Kuota Dasar</h3>
            <p className="text-xs text-slate-500 mt-1">Base quota ditetapkan regulator per kategori kendaraan, lalu dikalikan risk modifier.</p>
          </div>
          <DataTable
            columns={[
              { key: "vehicleType", label: "Kategori" },
              { key: "baseQuota", label: "Base Quota" },
              { key: "safe", label: "SAFE" },
              { key: "suspicious", label: "SUSPICIOUS" },
              { key: "highRisk", label: "HIGH_RISK" },
              { key: "critical", label: "CRITICAL" },
            ]}
            rows={policyRows}
          />

          <div className="pt-2">
            <h3 className="font-bold text-slate-900 text-md">Fraud Alert Prioritas</h3>
            <p className="text-xs text-slate-500 mt-1">Daftar stasiun yang paling banyak memunculkan sinyal fraud.</p>
          </div>
          <DataTable
            columns={[
              { key: "label", label: "Station" },
              { key: "fraudCount", label: "Frauds" },
              { key: "score", label: "Risk Score" },
              { key: "transactionCount", label: "Tx" },
            ]}
            rows={topRiskStationRows}
          />
        </Card>
      </div>
    </div>
  );
}
