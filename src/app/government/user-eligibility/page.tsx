"use client";

import { useState } from "react";
import { Brain, Sliders, ShieldCheck, HelpCircle, RefreshCw, X, Award, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface Citizen {
  id: string;
  name: string;
  nik: string;
  plate: string;
  njkbValue: number; // in Millions IDR
  engineCC: number;
  taxCompliant: boolean;
  baseScore: number; // starting raw score
  score: number;
  isEligible: boolean;
}

export default function GovernmentUserEligibilityPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([
    { id: "1", name: "Ahmad Subarjo", nik: "3171020304050001", plate: "B 1289 PQA", njkbValue: 120, engineCC: 1300, taxCompliant: true, baseScore: 85, score: 85, isEligible: true },
    { id: "2", name: "Rina Wijaya", nik: "3171050607080002", plate: "B 2011 CXZ", njkbValue: 340, engineCC: 2000, taxCompliant: true, baseScore: 45, score: 45, isEligible: false },
    { id: "3", name: "Dedi Setiadi", nik: "3204091011120003", plate: "D 4452 YH", njkbValue: 95, engineCC: 1000, taxCompliant: false, baseScore: 60, score: 60, isEligible: true },
    { id: "4", name: "Siti Rahma", nik: "1271010203040004", plate: "BK 9912 TR", njkbValue: 180, engineCC: 1500, taxCompliant: true, baseScore: 78, score: 78, isEligible: true },
    { id: "5", name: "Hendri Santoso", nik: "3578010203040005", plate: "L 7780 BA", njkbValue: 450, engineCC: 2500, taxCompliant: false, baseScore: 20, score: 20, isEligible: false },
  ]);

  // Parameters
  const [weightNJKB, setWeightNJKB] = useState(40);
  const [weightCC, setWeightCC] = useState(40);
  const [weightTax, setWeightTax] = useState(20);

  const [isCalculating, setIsCalculating] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const handleRecalculate = () => {
    const totalWeight = weightNJKB + weightCC + weightTax;
    if (totalWeight !== 100) {
      setToast({ show: true, msg: `Gagal! Total bobot kriteria harus tepat 100% (Sekarang ${totalWeight}%).` });
      return;
    }

    setIsCalculating(true);

    // Simulate AI Model score recalculation
    setTimeout(() => {
      setCitizens((prev) =>
        prev.map((c) => {
          // Calculate score based on weights
          // Lower NJKB = better score
          const njkbFactor = c.njkbValue < 150 ? 100 : c.njkbValue < 250 ? 70 : 40;
          // Lower CC = better score
          const ccFactor = c.engineCC <= 1500 ? 100 : c.engineCC <= 2000 ? 60 : 30;
          // Tax compliant = 100 else 40
          const taxFactor = c.taxCompliant ? 100 : 40;

          const calculatedScore = Math.round(
            (njkbFactor * weightNJKB + ccFactor * weightCC + taxFactor * weightTax) / 100
          );

          // Threshold for eligibility is 70
          const eligible = calculatedScore >= 70;

          return {
            ...c,
            score: calculatedScore,
            isEligible: eligible,
          };
        })
      );
      setIsCalculating(false);
      setToast({ show: true, msg: "AI Scoring Engine: Kelayakan Warga Berhasil Dikalkulasi Ulang!" });
    }, 1200);
  };

  const totalWeightSum = weightNJKB + weightCC + weightTax;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Sandbox Kelayakan Subsidi"
          subtitle="Simulasikan dan uji regulasi kriteria penerima subsidi BBM bersubsidi berbasis AI Engine."
        />
        <button
          onClick={handleRecalculate}
          disabled={isCalculating}
          className="self-start sm:self-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? "animate-spin" : ""}`} />
          Kalkulasi Ulang AI
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
        {/* Left Parameter Tuning Panel */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6 self-start">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" /> Parameter Sandbox
              </h3>
              <p className="text-xs text-slate-500 mt-1">Sesuaikan bobot persentase hukum kriteria.</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              totalWeightSum === 100 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-[#e31837] border-red-200 animate-pulse"
            }`}>
              Total: {totalWeightSum}%
            </span>
          </div>

          <div className="space-y-5">
            {/* Slide 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Nilai NJKB Kendaraan</span>
                <span className="font-mono text-slate-900">{weightNJKB}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                disabled={isCalculating}
                value={weightNJKB}
                onChange={(e) => setWeightNJKB(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer disabled:opacity-50"
              />
              <p className="text-[10px] text-slate-400 font-semibold">Membatasi subsidi untuk mobil mewah harga tinggi.</p>
            </div>

            {/* Slide 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Volume CC Silinder Mesin</span>
                <span className="font-mono text-slate-900">{weightCC}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                disabled={isCalculating}
                value={weightCC}
                onChange={(e) => setWeightCC(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer disabled:opacity-50"
              />
              <p className="text-[10px] text-slate-400 font-semibold">Membatasi kendaraan berkapasitas mesin besar ({`>`}1500cc).</p>
            </div>

            {/* Slide 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Kepatuhan Pajak Wilayah</span>
                <span className="font-mono text-slate-900">{weightTax}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                disabled={isCalculating}
                value={weightTax}
                onChange={(e) => setWeightTax(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer disabled:opacity-50"
              />
              <p className="text-[10px] text-slate-400 font-semibold">Mendorong pembayaran pajak kendaraan tahunan tepat waktu.</p>
            </div>
          </div>
        </Card>

        {/* Right Citizen Grid Table */}
        <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between relative">
          {/* Overlay loading */}
          {isCalculating && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-900">AI Scoring Engine Menghitung Ulang Kelayakan Warga...</p>
            </div>
          )}

          <div>
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Kalkulasi Hak Penerima Subsidi</h3>
              <p className="text-xs text-slate-500 mt-1">Daftar simulasi warga dan skor kelayakan penerima BBM bersubsidi.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200/60">
                  <tr>
                    <th className="px-6 py-4">Warga / NIK</th>
                    <th className="px-6 py-4">Spesifikasi Kendaraan</th>
                    <th className="px-6 py-4">Pajak</th>
                    <th className="px-6 py-4">AI Score</th>
                    <th className="px-6 py-4 text-center">Status Kelayakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {citizens.map((citizen) => (
                    <tr key={citizen.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{citizen.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">NIK: {citizen.nik}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-slate-900 text-white font-mono font-bold rounded text-[10px] tracking-wider">
                            {citizen.plate}
                          </span>
                          <p className="text-[10px] text-slate-500 font-semibold">{citizen.njkbValue}jt NJKB | {citizen.engineCC} CC</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          citizen.taxCompliant
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-[#e31837] border border-red-200"
                        }`}>
                          {citizen.taxCompliant ? "Lunas Pajak" : "Mati Pajak"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-mono font-bold ${
                          citizen.score >= 70 ? "text-green-600 font-extrabold" : "text-[#e31837]"
                        }`}>
                          {citizen.score} / 100
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          citizen.isEligible
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-[#e31837] border border-red-200"
                        }`}>
                          {citizen.isEligible ? "LAYAK PENERIMA" : "TIDAK LAYAK"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 font-semibold italic text-center">
            Ambang batas kelayakan nasional ditetapkan secara hukum minimal 70 poin.
          </div>
        </Card>
      </div>

      <Toast
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
