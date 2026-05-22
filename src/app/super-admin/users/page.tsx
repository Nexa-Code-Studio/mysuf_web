"use client";

import { useState } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import UserModal from "@/components/superadmin/UserModal";
import DeleteUserModal from "@/components/superadmin/DeleteUserModal";

const initialUsers = [
  {
    id: 1,
    name: "Rama Utama",
    initials: "RU",
    nik: "3174012345678901",
    role: "Super Admin",
    unit: "MySuF HQ",
    lastActive: "Active now",
    status: true,
  },
  {
    id: 2,
    name: "Budi Santoso",
    initials: "BS",
    nik: "3201023456789012",
    role: "Admin SPBU",
    unit: "SPBU Jakarta",
    lastActive: "2 hours ago",
    status: true,
  },
  {
    id: 3,
    name: "Siti Nurhaliza",
    initials: "SN",
    nik: "3275034567890123",
    role: "Admin Pemerintah",
    unit: "Direktorat Subsidi",
    lastActive: "1 hour ago",
    status: true,
  },
  {
    id: 4,
    name: "Dewi Kusuma",
    initials: "DK",
    nik: "3174045678901234",
    role: "Admin Perusahaan",
    unit: "Fleet Logistics HQ",
    lastActive: "5 hours ago",
    status: false,
  },
  {
    id: 5,
    name: "Rudi Hartono",
    initials: "RH",
    nik: "3201056789012345",
    role: "Admin SPBU",
    unit: "SPBU Bandung",
    lastActive: "30 mins ago",
    status: true,
  },
  {
    id: 6,
    name: "Linda Permata",
    initials: "LP",
    nik: "3275067890123456",
    role: "Admin Perusahaan",
    unit: "Fleet Logistics HQ",
    lastActive: "8 hours ago",
    status: true,
  },
];

const roleBadgeStyles: Record<string, string> = {
  "Super Admin": "bg-purple-50 text-purple-700 border-purple-200",
  "Admin Pemerintah": "bg-amber-50 text-amber-700 border-amber-200",
  "Admin Perusahaan": "bg-blue-50 text-blue-700 border-blue-200",
  "Admin SPBU": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof initialUsers[number] | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const toggleStatus = (id: number) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: !u.status } : u)));
  };

  const handleAdd = (newUser: { name: string; nik: string; role: string; unit: string; email: string }) => {
    const initials = newUser.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    setUsers([
      {
        id: Date.now(),
        name: newUser.name,
        initials,
        nik: newUser.nik,
        role: newUser.role,
        unit: newUser.unit,
        lastActive: "Just now",
        status: true,
      },
      ...users,
    ]);
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nik.includes(searchQuery);

    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && user.status) ||
      (statusFilter === "Inactive" && !user.status);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="User Management"
          subtitle="Kelola akses pengguna untuk seluruh sistem"
        />
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#e31837] text-white hover:bg-[#c4142e] whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah User
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/50 p-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or NIK..."
              className="w-full rounded-lg border border-slate-200 px-4 py-2 pl-10 text-sm transition focus:border-[#e31837] focus:outline-none focus:ring-1 focus:ring-[#e31837]"
            />
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#e31837] sm:w-auto"
            >
              <option>All Roles</option>
              <option>Admin SPBU</option>
              <option>Admin Pemerintah</option>
              <option>Admin Perusahaan</option>
              <option>Super Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#e31837] sm:w-auto"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">Role Access</th>
                <th className="px-6 py-4">Unit Access</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data pengguna yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                          {user.initials}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">
                      {user.nik}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadgeStyles[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4">
                      <Toggle
                        checked={user.status}
                        onChange={() => toggleStatus(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="relative inline-block group">
                        <button className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-slate-100 bg-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                            Edit
                          </button>
                          <button
                            className="w-full rounded-b-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-1">
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded bg-[#e31837] px-3 py-1 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        userName={selectedUser?.name}
      />
    </div>
  );
}
