"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, CreditCard, Fuel, ReceiptText, Truck, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { API_BASE_URL } from "@/lib/api";

type TransactionRecord = {
  id: string;
  date: string;
  driver: string;
  fuelType: string;
  liters: number;
  amount: number;
  station: string;
  status: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function FleetVehicleTransactionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const plate = params?.plate ? decodeURIComponent(params.plate as string) : "";
  const pageParam = searchParams.get("page");
  
  const [records, setRecords] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!plate) return;
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const res = await fetch(`${API_BASE_URL}/fleet/vehicles/${encodeURIComponent(plate)}/transactions`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil riwayat transaksi kendaraan.");
      }

      const data = await res.json();
      setRecords(data.items);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [plate]);

  const rowsPerPage = 5;
  const currentPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(records.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRecords = records.slice((safeCurrentPage - 1) * rowsPerPage, safeCurrentPage * rowsPerPage);
  
  const totalLiters = records.reduce((sum, record) => sum + record.liters, 0);
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
  const latestTransaction = records[0];

  return (
    <div className="space-y-6 relative">
      {isLoading && records.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        </div>
      ) : (
        <>
          <SectionHeader
            title={`Transaksi BBM ${plate}`}
            subtitle="Daftar transaksi pembelian BBM per kendaraan. Halaman ini dipisah karena record bisa sangat banyak."
          />

          {error && (
            <Card className="p-4 border border-red-200 bg-red-50 text-red-900 text-xs font-semibold rounded-xl">
              {error}
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Transaksi</p>
                <p className="text-lg font-bold text-slate-900">{records.length} Item</p>
              </div>
            </Card>

            <Card className="flex items-center gap-3 border border-green-100 bg-green-50 text-green-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-600">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Liter</p>
                <p className="text-lg font-bold text-slate-900">{totalLiters.toLocaleString("id-ID")} L</p>
              </div>
            </Card>

            <Card className="flex items-center gap-3 border border-amber-100 bg-amber-50 text-amber-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Dibayar</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
              </div>
            </Card>
          </div>

          <Card className="flex items-center justify-between gap-4 border border-slate-200/60 p-4 shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ringkasan Kendaraan</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Riwayat transaksi pembelian BBM untuk unit {plate}</p>
              <p className="mt-1 text-xs text-slate-500">
                Terakhir tercatat di {latestTransaction?.station ?? "-"} pada {latestTransaction?.date ?? "-"}
              </p>
            </div>
            <Link
              href="/fleet/vehicles"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Link>
          </Card>

          <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            )}
            <div className="border-b border-slate-100 bg-slate-50/50 p-5">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Truck className="h-5 w-5 text-pertamina-red" /> Daftar Transaksi
              </h3>
              <p className="mt-1 text-xs text-slate-500">Nama pembeli, liter, nominal, waktu, metode bayar, dan nomor transaksi.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full text-left text-sm">
                <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Nomor Transaksi</th>
                    <th className="px-6 py-4">Nama Pembeli (Driver)</th>
                    <th className="px-6 py-4">Total Liter</th>
                    <th className="px-6 py-4">Jumlah Dibayar</th>
                    <th className="px-6 py-4">Tanggal Waktu</th>
                    <th className="px-6 py-4">Tipe BBM</th>
                    <th className="px-6 py-4">SPBU</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                        Belum ada transaksi untuk kendaraan ini.
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition">
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-slate-900">{record.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{record.driver}</td>
                        <td className="px-6 py-4 font-mono text-slate-700">{record.liters} L</td>
                        <td className="px-6 py-4 font-mono text-slate-700">{formatCurrency(record.amount)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-slate-400" />
                            {record.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{record.fuelType}</td>
                        <td className="px-6 py-4 text-slate-600">{record.station}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-bold text-green-700">
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Menampilkan {Math.min((safeCurrentPage - 1) * rowsPerPage + 1, records.length)}-
                {Math.min(safeCurrentPage * rowsPerPage, records.length)} dari {records.length} transaksi
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/fleet/vehicles/${encodeURIComponent(plate)}/transactions?page=${Math.max(1, safeCurrentPage - 1)}`}
                  className={`rounded-lg border px-3 py-1.5 font-semibold transition ${
                    safeCurrentPage === 1
                      ? "pointer-events-none border-slate-200 bg-white text-slate-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Prev
                </Link>
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
                  {safeCurrentPage} / {totalPages}
                </span>
                <Link
                  href={`/fleet/vehicles/${encodeURIComponent(plate)}/transactions?page=${Math.min(totalPages, safeCurrentPage + 1)}`}
                  className={`rounded-lg border px-3 py-1.5 font-semibold transition ${
                    safeCurrentPage === totalPages
                      ? "pointer-events-none border-slate-200 bg-white text-slate-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
