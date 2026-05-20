"use client";

import { useState, useEffect } from "react";
import { Camera, Radio, Search, Play, PlayCircle, RefreshCw, Layers, CheckCircle } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const initialVehicles = [
  { plate: "B 2190 TZ", status: "Filling", nozzle: "Nozzle 01 (Pertalite)", progress: 65, wait: "4 Menit", fraudRisk: "Safe" },
  { plate: "D 4419 LK", status: "Queue", nozzle: "Nozzle 02 (Pertalite)", progress: 0, wait: "8 Menit", fraudRisk: "Safe" },
  { plate: "F 8312 GR", status: "Exit", nozzle: "Nozzle 03 (Solar)", progress: 100, wait: "12 Menit", fraudRisk: "Safe" },
  { plate: "B 1234 XYZ", status: "Filling", nozzle: "Nozzle 04 (Pertamax)", progress: 20, wait: "2 Menit", fraudRisk: "Safe" },
  { plate: "D 9012 DEF", status: "Queue", nozzle: "Nozzle 03 (Solar)", progress: 0, wait: "14 Menit", fraudRisk: "Review" }
];

export default function SpbuVehicleMonitoringPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("CAM-01 (Pompa Depan)");
  const [simulatedNozzleFill, setSimulatedNozzleFill] = useState(65);

  // Simulate active progress changes
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedNozzleFill(prev => {
        if (prev >= 100) return 0;
        return prev + 5;
      });
      setVehicles(prevVehicles => 
        prevVehicles.map(v => 
          v.status === "Filling" 
            ? { ...v, progress: v.progress >= 100 ? 0 : v.progress + 5 }
            : v
        )
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Monitoring Kendaraan"
        subtitle="Monitor plat nomor kendaraan di dispenser pengisian BBM secara real-time terintegrasi sensor AI."
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        
        {/* CCTV Mockup Viewport */}
        <Card className="overflow-hidden border border-slate-900 bg-slate-950 text-slate-100 flex flex-col p-0 shadow-2xl">
          <div className="px-5 py-4 bg-slate-900 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2 text-red-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-red-500" /> LIVE CAMERA MOCKUP
              </span>
            </div>
            
            <select 
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option>CAM-01 (Pompa Depan)</option>
              <option>CAM-02 (Dispenser Solar)</option>
              <option>CAM-03 (Pintu Masuk)</option>
            </select>
          </div>

          {/* Interactive CCTV Stream Display Container */}
          <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
            {/* Simulated overlay grid */}
            <div className="absolute inset-0 border-2 border-slate-800 pointer-events-none opacity-40 z-10" />
            <div className="absolute top-4 left-4 text-xs font-mono text-green-400 bg-black/60 px-2 py-1 rounded">
              {selectedCamera}
            </div>
            <div className="absolute top-4 right-4 text-xs font-mono text-green-400 bg-black/60 px-2 py-1 rounded">
              2026-05-20 12:08:45 UTC
            </div>

            {/* CCTV Animated graphics */}
            <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
              <div className="w-80 border border-green-500/30 bg-green-500/5 p-4 rounded-xl text-center space-y-4 backdrop-blur-xs relative">
                {/* Target Reticle */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-green-400" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-green-400" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-green-400" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-green-400" />

                <p className="text-xs font-bold text-green-400 tracking-wider">AI VEHICLE PLATE RECOGNITION</p>
                <div className="bg-black/80 py-2.5 rounded-lg border border-green-500/50">
                  <span className="text-2xl font-black tracking-widest text-green-400 font-mono">B 2190 TZ</span>
                </div>
                <div className="space-y-1.5 text-left text-[11px] text-green-300 font-mono">
                  <div className="flex justify-between">
                    <span>STATUS:</span>
                    <span className="font-bold text-green-400">FILLING ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DISPENSER:</span>
                    <span>NOZZLE 01 (PERTALITE)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NJKB CLASS:</span>
                    <span className="font-bold text-green-400">PASSENGER SUV</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI RISK SCORE:</span>
                    <span className="font-bold text-green-400">0.05 (SAFE)</span>
                  </div>
                </div>
                
                {/* Filling progress bar in CCTV */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between text-[10px] text-green-300">
                    <span>PUMP PROGRESS</span>
                    <span className="font-bold">{simulatedNozzleFill}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${simulatedNozzleFill}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual scanlines overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] pointer-events-none opacity-40" />
          </div>

          <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>BITRATE: 4.8 Mbps</span>
            <span>FPS: 30.00</span>
            <span className="text-green-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> AI ENGINE READY
            </span>
          </div>
        </Card>

        {/* Live Queue Table */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Plat..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-xs bg-white"
              />
            </div>
            <Button variant="outline" className="p-2.5 h-9" title="Segarkan Data" onClick={() => setVehicles(initialVehicles)}>
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </Button>
          </div>

          <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden flex-1">
            <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-xs text-slate-900">Kendaraan di Area SPBU</h3>
              <span className="text-[10px] font-bold text-[#e31837] bg-red-50 px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
              {filteredVehicles.map((vehicle, i) => (
                <div key={i} className="p-4 flex flex-col gap-2 hover:bg-slate-50/50 transition">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-sm text-slate-950 bg-slate-100 px-2 py-0.5 border border-slate-200 rounded">
                      {vehicle.plate}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      vehicle.status === "Filling" 
                        ? "bg-blue-50 text-blue-700" 
                        : vehicle.status === "Exit"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{vehicle.nozzle}</span>
                    <span className="font-mono text-slate-700 font-medium">Wait: {vehicle.wait}</span>
                  </div>

                  {/* Progress bar for filling vehicle */}
                  {vehicle.status === "Filling" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500">
                        <span>Filling progress...</span>
                        <span>{vehicle.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div className="bg-[#e31837] h-1 rounded-full transition-all duration-500" style={{ width: `${vehicle.progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  {vehicle.status === "Exit" && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Pengisian Selesai & Berhasil diverifikasi
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
