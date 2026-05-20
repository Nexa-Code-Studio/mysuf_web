"use client";

import { useState } from "react";
import { FileCheck2, FileCode, UploadCloud, ShieldCheck, AlertCircle, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

interface LegalDoc {
  key: string;
  name: string;
  number: string;
  expiry: string;
  status: "Terverifikasi" | "Pending" | "Ditolak";
  verifiedDate: string;
}

export default function FleetLegalPage() {
  const [documents, setDocuments] = useState<LegalDoc[]>([
    { key: "SIUP", name: "Surat Izin Usaha Perdagangan", number: "SIUP-4421-LOG", expiry: "12 Januari 2028", status: "Terverifikasi", verifiedDate: "24 Jan 2024" },
    { key: "TDP", name: "Tanda Daftar Perusahaan", number: "TDP-9981-TLN", expiry: "28 Maret 2029", status: "Terverifikasi", verifiedDate: "24 Jan 2024" },
    { key: "NPWP", name: "NPWP Badan Usaha", number: "01.234.567.8-012.000", expiry: "Seumur Hidup", status: "Terverifikasi", verifiedDate: "25 Jan 2024" },
    { key: "NIB", name: "Nomor Induk Berusaha", number: "9120001234567", expiry: "Berlaku Selamanya", status: "Pending", verifiedDate: "-" },
  ]);

  const [toast, setToast] = useState({ show: false, msg: "" });

  // Simulator State
  const [selectedDocType, setSelectedDocType] = useState("NIB");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<"idle" | "uploading" | "parsing" | "validating" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [simFileName, setSimFileName] = useState("");

  const startSimulation = (fileName: string) => {
    setSimFileName(fileName);
    setIsSimulating(true);
    setSimStep("uploading");
    setProgress(0);

    // Step 1: Uploading progress (0-100%)
    let currentProgress = 0;
    const uploadInterval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(uploadInterval);
        
        // Step 2: AI Parsing (OCR)
        setSimStep("parsing");
        setTimeout(() => {
          
          // Step 3: Registry database lookup
          setSimStep("validating");
          setTimeout(() => {
            
            // Step 4: Done & Success
            setSimStep("done");
            setTimeout(() => {
              // Update state
              setDocuments((prev) =>
                prev.map((doc) =>
                  doc.key === selectedDocType
                    ? { ...doc, status: "Terverifikasi", verifiedDate: "Hari Ini", number: doc.key === "NIB" ? "9120001234567" : `REG-${Math.floor(1000 + Math.random() * 9000)}` }
                    : doc
                )
              );
              setIsSimulating(false);
              setSimStep("idle");
              setToast({ show: true, msg: `Dokumen ${selectedDocType} Berhasil Diverifikasi AI Engine!` });
            }, 1000);

          }, 1500);

        }, 1500);
      }
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startSimulation(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    startSimulation(`${selectedDocType}_scanned_document.pdf`);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Verifikasi Legalitas Usaha"
        subtitle="Portal kelola dan verifikasi berkas hukum perusahaan logistik terintegrasi AI Engine."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: Document List */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#e31837]" /> Status Kepatuhan Dokumen
              </h3>
              <p className="text-xs text-slate-500 mt-1">Daftar berkas hukum wajib yang dipantau oleh BPH Migas & Regulator.</p>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.key}
                  className={`p-4 rounded-xl border flex justify-between items-center transition ${
                    doc.status === "Terverifikasi"
                      ? "border-green-100 bg-green-50/20"
                      : "border-amber-100 bg-amber-50/20"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        doc.status === "Terverifikasi" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800 animate-pulse"
                      }`}>
                        {doc.key}
                      </span>
                      <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500">No: {doc.number}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Masa Berlaku: {doc.expiry}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      doc.status === "Terverifikasi"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {doc.status}
                    </span>
                    <p className="text-[9px] text-slate-400 font-semibold">Verifikasi: {doc.verifiedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            Seluruh berkas diproteksi enkripsi RSA-2048 dan aman di server Pertamina.
          </div>
        </Card>

        {/* Right: Upload Simulator */}
        <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-md flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#e31837]" /> Upload & Validasi AI
              </h3>
              <p className="text-xs text-slate-500 mt-1">Unggah berkas pembaharuan SIUP/NIB Anda untuk diproses OCR instan.</p>
            </div>

            {/* Select Document Type to simulate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Tipe Dokumen Yang Diunggah</label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                disabled={isSimulating}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-[#e31837] disabled:opacity-50"
              >
                <option value="NIB">NIB (Nomor Induk Berusaha)</option>
                <option value="SIUP">SIUP (Surat Izin Usaha Perdagangan)</option>
                <option value="TDP">TDP (Tanda Daftar Perusahaan)</option>
                <option value="NPWP">NPWP Badan Usaha</option>
              </select>
            </div>

            {/* Drag & Drop Zone */}
            {!isSimulating ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-200 hover:border-[#e31837] bg-slate-50/50 hover:bg-red-50/10 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group relative overflow-hidden"
              >
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white text-slate-400 group-hover:text-[#e31837] flex items-center justify-center shadow-md border border-slate-100 group-hover:border-red-100 transition-all">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Tarik berkas PDF/PNG ke sini</p>
                    <p className="text-[10px] text-slate-400 mt-1">atau klik untuk menelusuri komputer Anda</p>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400">Maks. Kapasitas 10MB</span>
                </div>
              </div>
            ) : (
              /* Simulation Progress Display */
              <div className="border border-slate-200 bg-slate-900 text-white rounded-2xl p-6 space-y-6 animate-pulse">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold font-mono text-red-400 flex items-center gap-2">
                    <FileCode className="w-4 h-4 shrink-0" /> AI OCR ENGINE V4
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {simFileName.substring(0, 20)}...
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Step Indicators */}
                  <div className="space-y-2.5 text-xs font-semibold">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        simStep === "uploading" ? "bg-red-500 animate-ping" : "bg-green-500"
                      }`} />
                      <span className={simStep === "uploading" ? "text-white" : "text-slate-400"}>Mengunggah berkas... {progress}%</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        simStep === "parsing" ? "bg-red-500 animate-ping" : simStep === "uploading" ? "bg-slate-700" : "bg-green-500"
                      }`} />
                      <span className={simStep === "parsing" ? "text-white" : "text-slate-500"}>AI OCR Parsing & Ekstraksi Data Teks...</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        simStep === "validating" ? "bg-red-500 animate-ping" : simStep === "done" ? "bg-green-500" : "bg-slate-700"
                      }`} />
                      <span className={simStep === "validating" ? "text-white" : "text-slate-500"}>Validasi NIB via Database Nasional...</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#e31837] h-full rounded-full transition-all duration-300"
                      style={{
                        width: simStep === "uploading"
                          ? `${progress}%`
                          : simStep === "parsing"
                          ? "50%"
                          : simStep === "validating"
                          ? "85%"
                          : "100%"
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono">
                  <span>STATUS: {simStep.toUpperCase()}</span>
                  <span>ESTIMASI: ~4s</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border border-amber-100 bg-amber-50/30 text-amber-800 rounded-xl flex gap-2 items-start text-xs leading-relaxed">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Perhatian:</span> Pastikan dokumen yang diunggah terbaca jelas, tidak terpotong, dan merupakan berkas resmi yang berstempel basah / bertanda tangan QR Code OSS.
            </div>
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
