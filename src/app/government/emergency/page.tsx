import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function GovernmentEmergencyPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Emergency Control"
        subtitle="Panel kendali darurat untuk distribusi nasional."
      />
      <Card className="space-y-4">
        <p className="text-sm text-slate-600">
          Gunakan panel ini untuk menyalakan mode distribusi darurat. Tindakan akan
          berdampak nasional.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Aktifkan Mode Darurat</Button>
          <Button variant="secondary">Kunci Distribusi Wilayah</Button>
          <Button variant="ghost">Simulasikan Dampak</Button>
        </div>
      </Card>
    </div>
  );
}
