import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const vehicles = [
  {
    plate: "B 9012 CDE",
    stnk: "1234567890",
    type: "Truk Engkel",
    capacity: "4000 L",
    category: "Logistik",
    status: "Active",
  },
  {
    plate: "D 4567 FGH",
    stnk: "0987654321",
    type: "Mobil Pick Up",
    capacity: "800 L",
    category: "Logistik",
    status: "Active",
  },
];

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">
          Fleet Registration
        </h1>
        <p className="text-sm text-slate-500">
          Manage your company profile and registered vehicles
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Profil Perusahaan</CardTitle>
          </CardHeader>
          <div className="space-y-5 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Nama Perusahaan
              </p>
              <p className="mt-2 text-base font-semibold text-slate-800">
                PT Logistik Nusantara Maju
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                NIB / SIUP
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-sm font-medium text-slate-700">
                  1293810293810
                </p>
                <Badge className="bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Verified by Gov
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Alamat
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Jl. Pelabuhan Raya No. 18, Tanjung Priok, Jakarta Utara, DKI
                Jakarta 14330
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Kategori Usaha
              </p>
              <Badge className="mt-2 bg-slate-100 text-slate-600">
                Logistik Sembako
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>Daftar Armada</CardTitle>
              <Button className="w-full md:w-auto">+ Tambah Armada</Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 pb-3">No. Polisi</th>
                  <th className="px-4 pb-3">No. STNK</th>
                  <th className="px-4 pb-3">Jenis Kendaraan</th>
                  <th className="px-4 pb-3">Kapasitas</th>
                  <th className="px-4 pb-3">Kategori</th>
                  <th className="px-4 pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.plate}>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {vehicle.plate}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {vehicle.stnk}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {vehicle.type}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {vehicle.capacity}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-slate-100 text-slate-600">
                        {vehicle.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {vehicle.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
