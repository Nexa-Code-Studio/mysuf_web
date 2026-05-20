"use client";

import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_rgba(227,24,55,0.05),_rgba(255,255,255,0))]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-pertamina-red/10 rounded-full animate-ping opacity-75"></div>
          <AlertTriangle className="w-12 h-12 text-[#e31837]" />
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
          Sistem tidak dapat menemukan rute yang Anda minta. Halaman mungkin telah dihapus, dipindahkan, atau Anda tidak memiliki akses ke fitur ini.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Link href="/">
            <Button className="w-full bg-[#e31837] hover:bg-[#c4142e] text-white py-6 rounded-xl text-base font-bold transition-all shadow-md hover:shadow-lg shadow-red-500/20">
              <Home className="w-5 h-5 mr-2" /> Kembali ke Dasbor
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full py-6 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50 border-slate-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Halaman Sebelumnya
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#e31837] text-white font-bold text-sm shadow">
            My
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SuF</span>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">Sistem Pemantauan Subsidi Terintegrasi</p>
      </div>
    </div>
  );
}
