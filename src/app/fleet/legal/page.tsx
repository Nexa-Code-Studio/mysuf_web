import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function FleetLegalPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Legalitas Usaha"
        subtitle="Dokumen compliance dan status legal perusahaan."
      />
      <Card className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">SIUP</span>
          <span className="font-semibold text-slate-900">Aktif - 2027</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">TDP</span>
          <span className="font-semibold text-slate-900">Aktif - 2028</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">NPWP</span>
          <span className="font-semibold text-slate-900">Valid</span>
        </div>
      </Card>
    </div>
  );
}
