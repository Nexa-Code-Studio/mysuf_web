"use client";

import { useState } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { mysufUsers } from "@/lib/mysufAdminMockData";

const roleLabel: Record<string, string> = {
  SPBU_ADMIN: "Admin SPBU",
  GOV_ADMIN: "Admin Pemerintah",
  COMPANY_ADMIN: "Admin Perusahaan",
};

const roleBadgeStyles: Record<string, string> = {
  SPBU_ADMIN: "bg-slate-100 text-slate-700 border-slate-200",
  GOV_ADMIN: "bg-amber-50 text-amber-700 border-amber-200",
  COMPANY_ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function MySufAdminUsersPage() {
  const [users, setUsers] = useState(mysufUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const toggleStatus = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: !user.status } : user)));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nik.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All Roles" || roleFilter === user.role;

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
          title="Manajemen Pengguna"
          subtitle="Kelola akun lintas peran dan entitas MySuF"
        />
        <Button className="bg-(--primary) text-white hover:brightness-95 whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
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
              placeholder="Search by name, email, or NIK..."
              className="w-full rounded-lg border border-slate-200 px-4 py-2 pl-10 text-sm transition focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
            />
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-(--primary) sm:w-auto"
            >
              <option value="All Roles">All Roles</option>
              <option value="SPBU_ADMIN">SPBU_ADMIN</option>
              <option value="GOV_ADMIN">GOV_ADMIN</option>
              <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-(--primary) sm:w-auto"
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
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Email & NIK</th>
                <th className="px-6 py-4">Role Access</th>
                <th className="px-6 py-4">Entitas Terkait</th>
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
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                          {user.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <p className="font-medium text-slate-700">{user.email}</p>
                      <p className="text-xs text-slate-500 font-mono">{user.nik}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadgeStyles[user.role]}`}
                      >
                        {roleLabel[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.entity}
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
                        <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-slate-100 bg-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                            Edit User
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                            Delete User
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
            <button className="rounded bg-(--primary) px-3 py-1 text-sm font-medium text-white">
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
    </div>
  );
}
