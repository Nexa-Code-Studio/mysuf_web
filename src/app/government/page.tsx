import LineChartSimple from "@/components/charts/LineChartSimple";
import { Card } from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { dummyTransactions } from "@/data/dummyTransactions";
import { buildGovernmentDashboardSummary, evaluateTransactions } from "@/lib/fraudDetection";

const evaluatedTransactions = evaluateTransactions(dummyTransactions);
const governmentSummary = buildGovernmentDashboardSummary(evaluatedTransactions);

const fuelTrendData = Object.values(
  dummyTransactions
    .slice()
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    .reduce<Record<string, { period: string; liters: number }>>((accumulator, transaction) => {
      const date = new Date(transaction.timestamp);
      const period = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
      if (!accumulator[period]) {
        accumulator[period] = { period, liters: 0 };
      }

      accumulator[period].liters += transaction.liters;
      return accumulator;
    }, {}),
);

export default function GovernmentDashboardPage() {
  const fraudStations = governmentSummary.stationsWithHighestFraudCount.slice(0, 4);
  const averageLiters = Math.round(
    dummyTransactions.reduce((sum, transaction) => sum + transaction.liters, 0) / Math.max(dummyTransactions.length, 1),
  );
  const totalLiters = dummyTransactions.reduce((sum, transaction) => sum + transaction.liters, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Government Dashboard</h3>
          <p className="text-xs text-slate-500 mt-1">Ringkasan regulator yang fokus ke transaksi, risiko, dan tren konsumsi BBM.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Transaksi" value={String(governmentSummary.totalTransactions)} trend="LIVE" tone="primary" />
          <StatCard label="Transaksi Risiko Tinggi" value={String(governmentSummary.highRiskCount + governmentSummary.criticalCount)} trend="BLOCK" tone="warning" />
          <StatCard label="Total Liter Terdeteksi" value={`${totalLiters} L`} trend="TREND" tone="primary" />
          <StatCard label="Rata-Rata Liter/Transaksi" value={`${averageLiters} L`} trend="INSIGHT" tone="primary" />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4 overflow-hidden">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Fuel Consumption Trend</h3>
            <p className="text-xs text-slate-500 mt-1">Grafik tren konsumsi BBM dari transaksi yang terdeteksi oleh engine.</p>
          </div>
          <div className="h-80 w-full overflow-hidden">
            <LineChartSimple data={fuelTrendData} xKey="period" yKey="liters" />
          </div>
        </Card>

        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-md">Fraud Stations</h3>
            <p className="text-xs text-slate-500 mt-1">Stasiun dengan sinyal fraud tertinggi.</p>
          </div>
          <div className="space-y-3">
            {fraudStations.map((station) => (
              <div key={station.label} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{station.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{station.transactionCount} transaksi, {station.fraudCount} fraud.</p>
                </div>
                <p className="text-lg font-bold text-slate-950 whitespace-nowrap">{station.score}%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
