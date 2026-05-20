"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import StaffModal from "@/components/spbu/StaffModal";
import DeleteConfirmModal from "@/components/spbu/DeleteConfirmModal";

const initialStaff = [
  { id: 1, name: "Budi Santoso", initials: "BS", nik: "3174012345678901", role: "Cashier Level 1", shift: "Morning (06:00 - 14:00)", lastActive: "2 hours ago", status: true },
  { id: 2, name: "Siti Nurhaliza", initials: "SN", nik: "3201023456789012", role: "Cashier Level 2", shift: "Afternoon (14:00 - 22:00)", lastActive: "Active now", status: true },
  { id: 3, name: "Ahmad Wijaya", initials: "AW", nik: "3275034567890123", role: "Supervisor", shift: "Morning (06:00 - 14:00)", lastActive: "1 hour ago", status: true },
  { id: 4, name: "Dewi Kusuma", initials: "DK", nik: "3174045678901234", role: "Cashier Level 1", shift: "Night (22:00 - 06:00)", lastActive: "5 hours ago", status: false },
  { id: 5, name: "Rudi Hartono", initials: "RH", nik: "3201056789012345", role: "Cashier Level 1", shift: "Afternoon (14:00 - 22:00)", lastActive: "30 mins ago", status: true },
  { id: 6, name: "Linda Permata", initials: "LP", nik: "3275067890123456", role: "Cashier Level 2", shift: "Night (22:00 - 06:00)", lastActive: "8 hours ago", status: true },
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const toggleStatus = (id: number) => {
    setStaff(staff.map(s => s.id === id ? { ...s, status: !s.status } : s));
  };

  const handleAdd = (newStaff: any) => {
    const initials = newStaff.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
    setStaff([{ id: Date.now(), ...newStaff, initials, status: true, lastActive: "Just now" }, ...staff]);
  };

  const handleDelete = () => {
    if (selectedStaff) {
      setStaff(staff.filter(s => s.id !== selectedStaff.id));
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.nik.includes(searchQuery);
    
    const matchesShift = shiftFilter === "All Shifts" || 
                         (shiftFilter === "Morning" && member.shift.includes("Morning")) ||
                         (shiftFilter === "Afternoon" && member.shift.includes("Afternoon")) ||
                         (shiftFilter === "Night" && member.shift.includes("Night"));
    
    const matchesStatus = statusFilter === "All Status" || 
                          (statusFilter === "Active" && member.status) ||
                          (statusFilter === "Inactive" && !member.status);

    return matchesSearch && matchesShift && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionHeader
          title="Petugas SPBU"
          subtitle="Manage cashiers and staff access"
        />
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#e31837] hover:bg-[#c4142e] text-white whitespace-nowrap">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or NIK..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#e31837] focus:border-[#e31837] text-sm transition"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select 
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#e31837] text-slate-700 w-full sm:w-auto"
            >
              <option>All Shifts</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Night</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#e31837] text-slate-700 w-full sm:w-auto"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">Role Access</th>
                <th className="px-6 py-4">Shift Activity</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data petugas yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        {member.initials}
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{member.nik}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      member.role.includes("Supervisor") 
                        ? "bg-purple-50 text-purple-700 border-purple-200" 
                        : member.role.includes("Level 2")
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.shift}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{member.lastActive}</td>
                  <td className="px-6 py-4">
                    <Toggle checked={member.status} onChange={() => toggleStatus(member.id)} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative group inline-block">
                      <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                          onClick={() => {
                            setSelectedStaff(member);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
          <p className="text-sm text-slate-500">Showing {filteredStaff.length} of {staff.length} staff</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">Previous</button>
            <button className="px-3 py-1 bg-[#e31837] text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      <StaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAdd} 
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        staffName={selectedStaff?.name}
      />
    </div>
  );
}
