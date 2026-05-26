"use client";

import { useState, useEffect } from "react";
import { Search, Fuel, Calendar, User, Eye, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { formatShortMoney, formatIDR } from "@/lib/format";

export default function SpbuTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [selectedTrx, setSelectedTrx] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [stats, setStats] = useState({
    totalActiveTransactions: 0,
    totalVolume: 0,
    totalRevenue: 0
  });

  // Fetch transactions dynamically on filter or page changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const token = window.localStorage.getItem("mysuf-token");
        if (!token) return;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          size: "10"
        });

        if (selectedFuel !== "Semua") queryParams.append("fuel_type", selectedFuel);
        if (selectedStatus !== "Semua") queryParams.append("status", selectedStatus);
        if (searchQuery.trim() !== "") queryParams.append("search", searchQuery.trim());

        const res = await fetch(`${API_BASE_URL}/spbu/transactions?${queryParams.toString()}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setTransactions(data.items || []);
          setTotalPages(data.pages || 1);
          setTotalItems(data.total || 0);
          setStats({
            totalActiveTransactions: data.summary?.total_active_transactions || 0,
            totalVolume: data.summary?.total_volume || 0,
            totalRevenue: data.summary?.total_revenue || 0
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data transaksi SPBU dari server", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, searchQuery, selectedFuel, selectedStatus]);

  // Reset to first page when search or filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFuelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFuel(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Transaksi BBM"
        subtitle="Monitor, filter, dan telusuri rincian transaksi BBM harian."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard 
          label="Total Transaksi Aktif" 
          value={`${stats.totalActiveTransactions} TRX`} 
          trendSubtext="Berdasarkan filter saat ini" 
          tone="primary" 
        />
        <StatCard 
          label="Volume Terdistribusi" 
          value={`${stats.totalVolume.toLocaleString("id-ID", { maximumFractionDigits: 1 })} Liter`} 
          trendSubtext="BBM tersalurkan (filter saat ini)" 
          tone="neutral" 
        />
        <StatCard 
          label="Total Pendapatan" 
          value={formatShortMoney(stats.totalRevenue)} 
          trendSubtext="Total transaksi sukses di SPBU" 
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
              onChange={handleSearchChange}
              placeholder="Cari ID, Plat, atau Kasir..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-pertamina-red focus:border-pertamina-red text-sm bg-white"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={selectedFuel}
              onChange={handleFuelChange}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-pertamina-red focus:border-pertamina-red text-slate-700 w-full sm:w-auto"
            >
              <option value="Semua">Semua Bahan Bakar</option>
              <option value="Pertalite">Pertalite</option>
              <option value="Pertamax">Pertamax</option>
              <option value="Solar">Solar (Subsidi)</option>
            </select>
            
            <select 
              value={selectedStatus}
              onChange={handleStatusChange}
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
        <div className="overflow-x-auto relative min-h-[250px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-pertamina-red text-sm font-semibold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sinkronisasi data transaksi SPBU...</span>
              </div>
            </div>
          )}
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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada transaksi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 font-mono text-ellipsis overflow-hidden max-w-[150px]" title={trx.id}>
                      {trx.id.substring(0, 8)}...
                    </td>
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
                      {formatIDR(trx.price)}
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

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-semibold text-slate-500">
            Menampilkan {transactions.length} dari {totalItems} transaksi
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-xs rounded-lg border-slate-200 text-slate-600 font-semibold"
            >
              Sebelumnya
            </Button>
            <span className="inline-flex items-center px-3 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
              Halaman {page} dari {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 text-xs rounded-lg border-slate-200 text-slate-600 font-semibold"
            >
              Selanjutnya
            </Button>
          </div>
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
                  {formatIDR(selectedTrx.price)}
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
                className="w-full bg-pertamina-red hover:bg-pertamina-dark text-white font-semibold"
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
