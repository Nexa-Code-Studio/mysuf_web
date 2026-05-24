import Link from "next/link";
import { ArrowLeft, CalendarClock, CreditCard, Fuel, ReceiptText, Truck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

type TransactionRecord = {
  transactionId: string;
  buyerName: string;
  liters: number;
  amount: number;
  timestamp: string;
  paymentMethod: string;
  stationName: string;
};

const transactionHistoryByPlate: Record<string, TransactionRecord[]> = {
  "B 8821 TQ": [
    {
      transactionId: "TRX-8821-001",
      buyerName: "Rizal Wibowo",
      liters: 140,
      amount: 1470000,
      timestamp: "2026-05-24 07:15",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Pulogadung",
    },
    {
      transactionId: "TRX-8821-002",
      buyerName: "Rizal Wibowo",
      liters: 120,
      amount: 1260000,
      timestamp: "2026-05-23 18:20",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Rawamangun",
    },
    {
      transactionId: "TRX-8821-003",
      buyerName: "Rizal Wibowo",
      liters: 110,
      amount: 1155000,
      timestamp: "2026-05-22 09:05",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Cakung",
    },
  ],
  "B 1145 WX": [
    {
      transactionId: "TRX-1145-001",
      buyerName: "Sinta Kartika",
      liters: 80,
      amount: 840000,
      timestamp: "2026-05-24 08:40",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Tebet",
    },
    {
      transactionId: "TRX-1145-002",
      buyerName: "Sinta Kartika",
      liters: 75,
      amount: 787500,
      timestamp: "2026-05-23 13:10",
      paymentMethod: "Kartu Armada",
      stationName: "SPBU Kramat Jati",
    },
    {
      transactionId: "TRX-1145-003",
      buyerName: "Sinta Kartika",
      liters: 70,
      amount: 735000,
      timestamp: "2026-05-21 19:55",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Rawamangun",
    },
  ],
  "B 4512 PK": [
    {
      transactionId: "TRX-4512-001",
      buyerName: "Agus Pratama",
      liters: 30,
      amount: 315000,
      timestamp: "2026-05-24 10:00",
      paymentMethod: "Debit Armada",
      stationName: "SPBU Bekasi Barat",
    },
    {
      transactionId: "TRX-4512-002",
      buyerName: "Agus Pratama",
      liters: 28,
      amount: 294000,
      timestamp: "2026-05-23 15:30",
      paymentMethod: "Debit Armada",
      stationName: "SPBU Cawang",
    },
    {
      transactionId: "TRX-4512-003",
      buyerName: "Agus Pratama",
      liters: 26,
      amount: 273000,
      timestamp: "2026-05-22 08:25",
      paymentMethod: "Debit Armada",
      stationName: "SPBU Jatiwaringin",
    },
  ],
  "B 9902 KAA": [
    {
      transactionId: "TRX-9902-001",
      buyerName: "Rama Utama",
      liters: 210,
      amount: 2205000,
      timestamp: "2026-05-24 06:50",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Cikampek",
    },
    {
      transactionId: "TRX-9902-002",
      buyerName: "Rama Utama",
      liters: 200,
      amount: 2100000,
      timestamp: "2026-05-23 17:05",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Karawang",
    },
    {
      transactionId: "TRX-9902-003",
      buyerName: "Rama Utama",
      liters: 190,
      amount: 1995000,
      timestamp: "2026-05-22 09:35",
      paymentMethod: "Subsidi Fleet",
      stationName: "SPBU Subang",
    },
  ],
  "D 2219 BZ": [
    {
      transactionId: "TRX-2219-001",
      buyerName: "Nia Putri",
      liters: 35,
      amount: 367500,
      timestamp: "2026-05-24 11:40",
      paymentMethod: "QR Armada",
      stationName: "SPBU Semarang Selatan",
    },
    {
      transactionId: "TRX-2219-002",
      buyerName: "Nia Putri",
      liters: 32,
      amount: 336000,
      timestamp: "2026-05-23 14:15",
      paymentMethod: "QR Armada",
      stationName: "SPBU Semarang Barat",
    },
  ],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default async function FleetVehicleTransactionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ plate: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { plate } = await params;
  const records = transactionHistoryByPlate[plate] ?? [];
  const resolvedSearchParams = (await searchParams) ?? {};
  const rowsPerPage = 2;
  const currentPage = Math.max(1, Number.parseInt(resolvedSearchParams.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(records.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRecords = records.slice((safeCurrentPage - 1) * rowsPerPage, safeCurrentPage * rowsPerPage);
  const totalLiters = records.reduce((sum, record) => sum + record.liters, 0);
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
  const latestTransaction = records[0];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Transaksi BBM ${plate}`}
        subtitle="Daftar transaksi pembelian BBM per kendaraan. Halaman ini dipisah karena record bisa sangat banyak."
      />

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

        <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-600">
            <Fuel className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Liter</p>
            <p className="text-lg font-bold text-slate-900">{totalLiters} L</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 border border-slate-200/60 p-4 shadow-sm">
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
          <p className="mt-1 text-xs text-slate-500">Terakhir tercatat di {latestTransaction?.stationName ?? "-"} pada {latestTransaction?.timestamp ?? "-"}</p>
        </div>
        <Link
          href="/fleet/vehicles"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </Card>

      <Card className="overflow-hidden border border-slate-200/60 p-0 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900">
            <Truck className="h-5 w-5 text-[#e31837]" /> Daftar Transaksi
          </h3>
          <p className="mt-1 text-xs text-slate-500">Nama pembeli, liter, nominal, waktu, metode bayar, dan nomor transaksi.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full text-left text-sm">
            <thead className="border-b border-slate-200/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Nomor Transaksi</th>
                <th className="px-6 py-4">Nama Pembeli</th>
                <th className="px-6 py-4">Total Liter</th>
                <th className="px-6 py-4">Jumlah Dibayar</th>
                <th className="px-6 py-4">Tanggal Waktu</th>
                <th className="px-6 py-4">Pembayaran</th>
                <th className="px-6 py-4">SPBU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    Belum ada transaksi untuk kendaraan ini.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr key={record.transactionId} className="hover:bg-slate-50/50 transition">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-slate-900">{record.transactionId}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{record.buyerName}</td>
                    <td className="px-6 py-4 font-mono text-slate-700">{record.liters} L</td>
                    <td className="px-6 py-4 font-mono text-slate-700">{formatCurrency(record.amount)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-slate-400" />
                        {record.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{record.paymentMethod}</td>
                    <td className="px-6 py-4 text-slate-600">{record.stationName}</td>
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
    </div>
  );
}
