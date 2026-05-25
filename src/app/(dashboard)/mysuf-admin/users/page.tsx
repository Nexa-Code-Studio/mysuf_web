"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof users[number] | null>(null);
  const [userToDelete, setUserToDelete] = useState<typeof users[number] | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nik.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All Roles" || roleFilter === user.role;

    return matchesSearch && matchesRole;
  });

  const handleAddUser = (payload: {
    name: string;
    email: string;
    nik: string;
    role: "SPBU_ADMIN" | "GOV_ADMIN" | "COMPANY_ADMIN";
    entity: string;
    password: string;
  }) => {
    const nextId = `USR-${String(users.length + 1).padStart(3, "0")}`;
    setUsers([
      {
        id: nextId,
        name: payload.name,
        email: payload.email,
        nik: payload.nik,
        role: payload.role,
        entity: payload.entity,
        status: true,
      },
      ...users,
    ]);
  };

  const handleUpdateUser = (payload: {
    name: string;
    email: string;
    nik: string;
    role: "SPBU_ADMIN" | "GOV_ADMIN" | "COMPANY_ADMIN";
    entity: string;
    password: string;
  }) => {
    if (!selectedUser) return;
    const { password: _password, ...rest } = payload;
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, ...rest }
          : user
      )
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Manajemen Pengguna"
          subtitle="Kelola akun lintas peran dan entitas MySuF"
        />
        <Button
          className="bg-(--primary) text-white hover:brightness-95 whitespace-nowrap"
          onClick={() => setIsAddOpen(true)}
        >
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
                <th className="px-6 py-4 text-center">Aksi</th>
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
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteOpen(true);
                          }}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Hapus
                        </button>
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

      <UserFormModal
        isOpen={isAddOpen}
        title="Tambah Pengguna"
        confirmLabel="Simpan Pengguna"
        isPasswordDisabled={false}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(payload) => {
          handleAddUser(payload);
          setIsAddOpen(false);
        }}
      />

      <UserFormModal
        isOpen={isEditOpen}
        title="Edit Pengguna"
        confirmLabel="Simpan Perubahan"
        isPasswordDisabled
        initialValues={
          selectedUser
            ? {
                name: selectedUser.name,
                email: selectedUser.email,
                nik: selectedUser.nik,
                role: selectedUser.role,
                entity: selectedUser.entity,
                password: "",
              }
            : undefined
        }
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={(payload) => {
          handleUpdateUser(payload);
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        userName={userToDelete?.name ?? ""}
        onClose={() => {
          setIsDeleteOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={() => {
          if (userToDelete) {
            handleDeleteUser(userToDelete.id);
          }
          setIsDeleteOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}

type UserFormValues = {
  name: string;
  email: string;
  nik: string;
  role: "SPBU_ADMIN" | "GOV_ADMIN" | "COMPANY_ADMIN";
  entity: string;
  password: string;
};

function UserFormModal({
  isOpen,
  title,
  confirmLabel,
  isPasswordDisabled,
  initialValues,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  title: string;
  confirmLabel: string;
  isPasswordDisabled: boolean;
  initialValues?: UserFormValues;
  onClose: () => void;
  onSubmit: (payload: UserFormValues) => void;
}) {
  const [formData, setFormData] = useState<UserFormValues>(
    initialValues ?? {
      name: "",
      email: "",
      nik: "",
      role: "SPBU_ADMIN",
      entity: "",
      password: "",
    }
  );

  if (!isOpen) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama pengguna"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@mysuf.id"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isPasswordDisabled ? "Tidak dapat diubah" : "Masukkan password"}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary) disabled:bg-slate-100 disabled:text-slate-500"
              disabled={isPasswordDisabled}
              required={!isPasswordDisabled}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">NIK</label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="16 digit NIK"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Role Akses</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
              >
                <option value="SPBU_ADMIN">SPBU_ADMIN</option>
                <option value="GOV_ADMIN">GOV_ADMIN</option>
                <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Entitas Terkait</label>
              <input
                type="text"
                name="entity"
                value={formData.entity}
                onChange={handleChange}
                placeholder="SPBU / Instansi"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="w-full bg-(--primary) hover:brightness-95 text-white">
              {confirmLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  isOpen,
  userName,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
        </div>
        <div className="space-y-3 px-6 py-5">
          <p className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus akun
            <span className="font-semibold text-slate-900"> {userName}</span>?
          </p>
          <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            className="w-full bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}
