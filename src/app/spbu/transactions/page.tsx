"use client";

import { useState } from "react";
import { Search, Fuel, Calendar, User, Eye, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const initialTransactions = [
  { id: "TRX-8821", plate: "B 1234 XYZ", fuel: "Pertalite", volume: 38, price: 380000, time: "12:15:30", status: "Success", cashier: "Budi Santoso", date: "2026-05-20" },
  { id: "TRX-8822", plate: "B 5678 ABC", fuel: "Pertamax", volume: 25, price: 325000, time: "12:18:12", status: "Success", cashier: "Siti Nurhaliza", date: "2026-05-20" },
  { id: "TRX-8823", plate: "D 9012 DEF", fuel: "Solar (Subsidi)", volume: 90, price: 612000, time: "12:21:45", status: "Review", cashier: "Ahmad Wijaya", date: "2026-05-20" },
  { id: "TRX-8824", plate: "B 3456 GHI", fuel: "Pertalite", volume: 41, price: 410000, time: "12:25:01", status: "Success", cashier: "Budi Santoso", date: "2026-05-20" },
  { id: "TRX-8825", plate: "F 8901 JKL", fuel: "Solar (Subsidi)", volume: 120, price: 816000, time: "12:28:18", status: "Rejected", cashier: "Siti Nurhaliza", date: "2026-05-20" },
  { id: "TRX-8826", plate: "B 7788 MNO", fuel: "Pertamax", volume: 15, price: 195000, time: "12:30:55", status: "Success", cashier: "Rudi Hartono", date: "2026-05-20" },
  { id: "TRX-8827", plate: "B 4432 ZZZ", fuel: "Pertalite", volume: 28, price: 280000, time: "12:35:10", status: "Success", cashier: "Rudi Hartono", date: "2026-05-20" },
  { id: "TRX-8828", plate: "D 1102 KKK", fuel: "Solar (Subsidi)", volume: 85, price: 578000, time: "12:39:40", status: "Review", cashier: "Linda Permata", date: "2026-05-20" }
];

export default function SpbuTransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [selectedTrx, setSelectedTrx] = useState<any>(null);

  // Filter logic
  const filteredTrx = transactions.filter((trx) => {
    const matchesSearch = 
      trx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      trx.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.cashier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFuel = selectedFuel === "Semua" || trx.fuel.includes(selectedFuel);
    const matchesStatus = selectedStatus === "Semua" || trx.status === selectedStatus;
    
    return matchesSearch && matchesFuel && matchesStatus;
  });

  // Calculate dynamic stats
  const totalVolume = filteredTrx.reduce((sum, item) => sum + item.volume, 0);
  const totalSales = filteredTrx.reduce((sum, item) => sum + item.price, 0);
  const reviewCount = filteredTrx.filter(t => t.status === "Review").length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Transaksi BBM"
        subtitle="Monitor, filter, dan telusuri rincian transaksi BBM harian."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard 
          label="Total Transaksi Aktif" 
          value={`${filteredTrx.length} TRX`} 
          trendSubtext="Berdasarkan filter saat ini" 
          tone="primary" 
        />
        <StatCard 
          label="Volume Terdistribusi" 
          value={`${totalVolume} Liter`} 
          trendSubtext="Total BBM disalurkan" 
          tone="neutral" 
        />
        <StatCard 
          label="Perlu Review" 
          value={`${reviewCount} Kasus`} 
          trendSubtext="Butuh keputusan segera" 
          tone="warning" 
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID, Plat, atau Kasir..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-pertamina-red focus:border-pertamina-red text-sm bg-white"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-pertamina-red focus:border-pertamina-red text-slate-700 w-full sm:w-auto"
            >
              <option value="Semua">Semua Bahan Bakar</option>
              <option value="Pertalite">Pertalite</option>
              <option value="Pertamax">Pertamax</option>
              <option value="Solar">Solar (Subsidi)</option>
            </select>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-pertamina-red focus:border-pertamina-red text-slate-700 w-full sm:w-auto"
            >
              <option value="Semua">Semua Status</option>
              <option value="Success">Success</option>
              <option value="Review">Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Nomor Plat</th>
                <th className="px-6 py-4">Jenis BBM</th>
                <th className="px-6 py-4">Volume</th>
                <th className="px-6 py-4">Total Biaya</th>
                <th className="px-6 py-4">Petugas</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrx.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada transaksi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredTrx.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 font-mono">{trx.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{trx.plate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        trx.fuel.includes("Solar") 
                          ? "bg-amber-50 text-amber-700" 
                          : trx.fuel.includes("Pertamax")
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-pertamina-red"
                      }`}>
                        <Fuel className="w-3.5 h-3.5" /> {trx.fuel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{trx.volume} L</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(trx.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{trx.cashier}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{trx.time}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        trx.status === "Success"
                          ? "bg-green-50 text-green-700"
                          : trx.status === "Review"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-pertamina-red"
                      }`}>
                        {trx.status === "Success" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {trx.status === "Review" && <AlertCircle className="w-3.5 h-3.5" />}
                        {trx.status === "Rejected" && <XCircle className="w-3.5 h-3.5" />}
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTrx(trx)}
                        className="inline-flex items-center gap-2 rounded-lg border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTrx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 relative mx-4">
            <button 
              onClick={() => setSelectedTrx(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              &times;
            </button>
            
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-red-50 text-pertamina-red rounded-full flex items-center justify-center mx-auto mb-3">
                <Fuel className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Resi Transaksi MySuF</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">ID: {selectedTrx.id}</p>
            </div>

            <div className="py-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Nomor Kendaraan (Plat)</span>
                <span className="font-bold text-slate-800">{selectedTrx.plate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Bahan Bakar</span>
                <span className="font-semibold text-slate-900">{selectedTrx.fuel}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Volume Pembelian</span>
                <span className="font-bold text-pertamina-red">{selectedTrx.volume} Liter</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Pembayaran</span>
                <span className="font-extrabold text-slate-900 text-base">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedTrx.price)}
                </span>
              </div>
              
              <hr className="border-dashed border-slate-200" />
              
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Tanggal</span>
                <span className="font-medium">{selectedTrx.date} {selectedTrx.time}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Kasir</span>
                <span className="font-medium">{selectedTrx.cashier}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => setSelectedTrx(null)}
                className="w-full bg-pertamina-red hover:bg-pertamina-dark text-white"
              >
                Tutup Resi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
