"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import StaffModal from "@/components/spbu/StaffModal";
import DeleteConfirmModal from "@/components/spbu/DeleteConfirmModal";
import { API_BASE_URL } from "@/lib/api";

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/spbu/staff?size=100`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((item: any) => {
          const initials = item.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
          const isStaffAdmin = item.role.includes("SPBU_ADMIN");
          return {
            id: item.id,
            name: item.name,
            email: item.email,
            initials,
            role: isStaffAdmin ? "Admin" : "Cashier",
            shift: item.shift || "Morning (06:00 - 14:00)",
            status: item.is_active,
            lastActive: "Active now"
          };
        });
        setStaff(mapped);
      }
    } catch (err) {
      console.error("Gagal mengambil data staff SPBU:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/spbu/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (res.ok) {
        setStaff(staff.map(s => s.id === id ? { ...s, status: !s.status } : s));
      }
    } catch (err) {
      console.error("Gagal mengubah status staff:", err);
    }
  };

  const handleAdd = async (newStaff: any) => {
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) return;

      const payload = {
        name: newStaff.name,
        email: newStaff.email,
        password: newStaff.password || "mysuf123",
        role: newStaff.role === "Admin" ? ["SPBU_ADMIN"] : ["SALES_OFFICER"],
        shift: newStaff.shift,
        is_active: true
      };

      const res = await fetch(`${API_BASE_URL}/spbu/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchStaff();
      }
    } catch (err) {
      console.error("Gagal menambahkan staff:", err);
    }
  };

  const handleUpdate = async (updatedStaff: any) => {
    if (!selectedStaff) return;
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) return;

      const payload: any = {
        name: updatedStaff.name,
        email: updatedStaff.email,
        role: updatedStaff.role === "Admin" ? ["SPBU_ADMIN"] : ["SALES_OFFICER"],
        shift: updatedStaff.shift
      };

      if (updatedStaff.password) {
        payload.password = updatedStaff.password;
      }

      const res = await fetch(`${API_BASE_URL}/spbu/staff/${selectedStaff.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchStaff();
      }
    } catch (err) {
      console.error("Gagal mengupdate staff:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/spbu/staff/${selectedStaff.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setStaff(staff.filter(s => s.id !== selectedStaff.id));
        setIsDeleteModalOpen(false);
        setSelectedStaff(null);
      }
    } catch (err) {
      console.error("Gagal menghapus staff:", err);
    }
  };

  // Client-side filtering
  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesShift = shiftFilter === "All Shifts" || 
                         (shiftFilter === "Morning" && member.shift.includes("Morning")) ||
                         (shiftFilter === "Afternoon" && member.shift.includes("Afternoon")) ||
                         (shiftFilter === "Night" && member.shift.includes("Night"));
    
    const matchesStatus = statusFilter === "All Status" || 
                          (statusFilter === "Active" && member.status) ||
                          (statusFilter === "Inactive" && !member.status);

    return matchesSearch && matchesShift && matchesStatus;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage) || 1;
  const paginatedStaff = filteredStaff.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionHeader
          title="Petugas SPBU"
          subtitle="Kelola akun kasir dan hak akses administrasi SPBU Anda."
        />
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-pertamina-red hover:bg-[#c4142e] text-white whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Tambah Petugas
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama atau email petugas..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-pertamina-red focus:border-pertamina-red text-sm transition bg-white"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select 
              value={shiftFilter}
              onChange={(e) => {
                setShiftFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-pertamina-red text-slate-700 w-full sm:w-auto"
            >
              <option>All Shifts</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Night</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-pertamina-red text-slate-700 w-full sm:w-auto"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-pertamina-red text-sm font-semibold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memuat data petugas SPBU...</span>
              </div>
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role Access</th>
                <th className="px-6 py-4">Shift Activity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading && paginatedStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data petugas yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        {member.initials}
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      member.role === "Admin" 
                        ? "bg-purple-50 text-purple-700 border-purple-200" 
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.shift}</td>
                  <td className="px-6 py-4">
                    <Toggle checked={member.status} onChange={() => toggleStatus(member.id, member.status)} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsEditModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsDeleteModalOpen(true);
                        }}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
          <p className="text-xs font-semibold text-slate-500">Menampilkan {paginatedStaff.length} dari {filteredStaff.length} petugas</p>
          <div className="flex gap-2">
            <button 
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="inline-flex items-center px-3 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
              Halaman {page} dari {totalPages}
            </span>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <StaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAdd}
        mode="add"
      />

      <StaffModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStaff(null);
        }}
        onSubmit={(payload) => {
          handleUpdate(payload);
          setIsEditModalOpen(false);
          setSelectedStaff(null);
        }}
        mode="edit"
        initialValues={
          selectedStaff
            ? {
                name: selectedStaff.name,
                email: selectedStaff.email,
                role: selectedStaff.role,
                shift: selectedStaff.shift,
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStaff(null);
        }}
        onConfirm={handleDelete}
        staffName={selectedStaff?.name}
      />
    </div>
  );
}
