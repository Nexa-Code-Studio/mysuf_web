"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";

type AuditLogItem = {
  id: string;
  actor_name_snapshot: string;
  actor_role_snapshot: string;
  action: string;
  ip_address: string;
  created_at: string;
};

const formatIndonesianDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};

export default function SuperAdminLogAktivitasPage() {
  const [activities, setActivities] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchActivities = useCallback(async (searchVal = searchQuery) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Sesi login berakhir. Silakan login kembali.");
      }

      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("size", "100");
      if (searchVal.trim()) {
        params.append("search", searchVal.trim());
      }

      const res = await fetch(`${API_BASE_URL}/mysuf-admin/audit-logs?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Anda tidak memiliki akses untuk melihat halaman ini.");
        }
        throw new Error("Gagal mengambil riwayat audit trail.");
      }

      const data = await res.json();
      setActivities(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchActivities(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchActivities]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Audit Trail"
          subtitle="Jejak aktivitas administrator untuk monitoring dan kepatuhan sistem."
        />
        <Button
          variant="ghost"
          onClick={() => fetchActivities(searchQuery)}
          className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200/60 shadow-sm bg-white rounded-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aktor, aksi, atau IP..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm bg-white"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium self-end md:self-center">
            Menampilkan <span className="font-semibold text-slate-800">{activities.length}</span> dari <span className="font-semibold text-slate-800">{total}</span> entri
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          {isLoading && activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[#e31837]" />
              <p className="text-sm font-medium">Memuat riwayat audit...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4 text-red-600 bg-red-50/30">
              <p className="font-semibold">{error}</p>
              <Button onClick={() => fetchActivities(searchQuery)} size="sm" className="mt-4 bg-[#e31837] text-white hover:bg-red-700">
                Coba Lagi
              </Button>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Tidak ada riwayat audit trail yang ditemukan.
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Aktor</th>
                  <th className="px-4 py-3">Aksi</th>
                  <th className="px-4 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((item) => (
                  <tr key={item.id} className="text-xs text-slate-700 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {formatIndonesianDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.actor_name_snapshot} <span className="font-normal text-slate-500">({item.actor_role_snapshot})</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.action}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {item.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
