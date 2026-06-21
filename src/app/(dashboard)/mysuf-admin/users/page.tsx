"use client";

import { useState, useEffect } from "react";
import { Plus, Search, X, Loader2, RefreshCw } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  SPBU_ADMIN: "Admin SPBU",
  GOV_ADMIN: "Admin Pemerintah",
  COMPANY_ADMIN: "Admin Perusahaan",
};

const roleBadgeStyles: Record<string, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-700 border-red-200",
  SPBU_ADMIN: "bg-slate-100 text-slate-700 border-slate-200",
  GOV_ADMIN: "bg-amber-50 text-amber-700 border-amber-200",
  COMPANY_ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
};

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "SPBU_ADMIN" | "GOV_ADMIN" | "COMPANY_ADMIN";
  entity: string;
  status: boolean;
  gas_station_id?: string;
  company_id?: string;
  employee_id?: string;
};

type OptionItem = {
  id: string;
  name: string;
};

export default function MySufAdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  // Fetch all backend data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      // 1. Fetch Users
      const usersRes = await fetch(`${API_BASE_URL}/users/?page=1&page_size=100`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!usersRes.ok) throw new Error("Gagal mengambil data pengguna.");
      const usersData = await usersRes.json();

      // 2. Fetch Gas Stations Options (For pre-mapping initial user entities if available)
      const gsRes = await fetch(`${API_BASE_URL}/users/gas-stations/options?page=1&page_size=100`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      let gsOptions: OptionItem[] = [];
      if (gsRes.ok) {
        const gsData = await gsRes.json();
        gsOptions = gsData.items || [];
      }

      // 3. Fetch Companies Options (For pre-mapping initial user entities if available)
      const coRes = await fetch(`${API_BASE_URL}/users/companies/options?page=1&page_size=100`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      let coOptions: OptionItem[] = [];
      if (coRes.ok) {
        const coData = await coRes.json();
        coOptions = coData.items || [];
      }

      // Filter and map users (Exclude BUYER and SALES_OFFICER as requested)
      const filteredItems = (usersData.items || []).filter((u: any) => {
        const uRoles = u.role || [];
        return !uRoles.includes("SALES_OFFICER") && !uRoles.includes("BUYER");
      });

      const mappedUsers = filteredItems.map((u: any) => {
        const primaryRole = u.role[0] || "COMPANY_ADMIN";
        
        // Match entity names from options lists
        let entityName = "-";
        if (primaryRole === "SPBU_ADMIN") {
          const matchedGs = gsOptions.find((g) => g.id === u.gas_station_id);
          entityName = matchedGs ? matchedGs.name : "SPBU (Belum Dikaitkan)";
        } else if (primaryRole === "COMPANY_ADMIN") {
          const matchedCo = coOptions.find((c) => c.id === u.company_id);
          entityName = matchedCo ? matchedCo.name : "Perusahaan (Belum Dikaitkan)";
        } else if (primaryRole === "GOV_ADMIN") {
          entityName = "Pemerintah Nasional";
        } else if (primaryRole === "SUPER_ADMIN") {
          entityName = "Platform Administrator";
        }

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: primaryRole,
          entity: entityName,
          status: u.is_active,
          gas_station_id: u.gas_station_id || undefined,
          company_id: u.company_id || undefined,
          employee_id: u.employee_id || undefined,
        };
      });

      setUsers(mappedUsers);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUserSubmit = async (payload: any) => {
    setIsLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: [payload.role],
          is_active: true,
          employee_id: payload.employee_id || null,
          gas_station_id: payload.role === "SPBU_ADMIN" && payload.gas_station_id ? payload.gas_station_id : null,
          company_id: payload.role === "COMPANY_ADMIN" && payload.company_id ? payload.company_id : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Gagal membuat pengguna." }));
        throw new Error(errorData.detail || "Gagal membuat pengguna.");
      }

      await fetchData();
      setIsAddOpen(false);
    } catch (err: any) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  const handleUpdateUserSubmit = async (payload: any) => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const bodyPayload: any = {
        name: payload.name,
        email: payload.email,
        role: [payload.role],
        employee_id: payload.employee_id || null,
        gas_station_id: payload.role === "SPBU_ADMIN" && payload.gas_station_id ? payload.gas_station_id : null,
        company_id: payload.role === "COMPANY_ADMIN" && payload.company_id ? payload.company_id : null,
      };

      if (payload.password) {
        bodyPayload.password = payload.password;
      }

      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Gagal mengupdate pengguna." }));
        throw new Error(errorData.detail || "Gagal mengupdate pengguna.");
      }

      await fetchData();
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      if (!token) throw new Error("Silakan login kembali.");

      const response = await fetch(`${API_BASE_URL}/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Gagal menghapus pengguna." }));
        throw new Error(errorData.detail || "Gagal menghapus pengguna.");
      }

      await fetchData();
      setIsDeleteOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  // Filter client-side
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.entity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All Roles" || roleFilter === user.role;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Manajemen Pengguna"
          subtitle="Kelola akun lintas peran administratif dan entitas MySuF"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={fetchData}
            className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            className="bg-(--primary) text-white hover:brightness-95 whitespace-nowrap"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/50 p-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, email, or entity..."
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
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="SPBU_ADMIN">SPBU_ADMIN</option>
              <option value="GOV_ADMIN">GOV_ADMIN</option>
              <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
            </select>
          </div>
        </div>

        {isLoading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-(--primary)" />
            <p className="text-sm font-medium">Memuat data pengguna dari backend...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50/30">
            <p className="font-semibold">{error}</p>
            <Button onClick={fetchData} size="sm" className="mt-4 bg-red-600 text-white hover:bg-red-700">
              Coba Lagi
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Email Akses</th>
                  <th className="px-6 py-4">Role Access</th>
                  <th className="px-6 py-4">Entitas Terkait</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Tidak ada data pengguna administratif yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-xs font-mono font-semibold text-slate-500">
                        {user.id.slice(0, 8)}...
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
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadgeStyles[user.role]}`}
                        >
                          {roleLabel[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
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
        )}

        <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna portal
          </p>
          <div className="flex gap-1">
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded bg-(--primary) px-3 py-1 text-sm font-medium text-white">
              1
            </button>
            <button className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <UserFormModal
        isOpen={isAddOpen}
        title="Tambah Pengguna Portal"
        confirmLabel="Simpan Pengguna"
        isPasswordDisabled={false}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddUserSubmit}
      />

      <UserFormModal
        isOpen={isEditOpen}
        title="Edit Pengguna Portal"
        confirmLabel="Simpan Perubahan"
        isPasswordDisabled={true}
        initialValues={
          selectedUser
            ? {
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role,
                gas_station_id: selectedUser.gas_station_id ?? "",
                company_id: selectedUser.company_id ?? "",
                employee_id: selectedUser.employee_id ?? "",
                password: "",
              }
            : undefined
        }
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUserSubmit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        userName={userToDelete?.name ?? ""}
        onClose={() => {
          setIsDeleteOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUserConfirm}
      />
    </div>
  );
}

type UserFormValues = {
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "SPBU_ADMIN" | "GOV_ADMIN" | "COMPANY_ADMIN";
  gas_station_id: string;
  company_id: string;
  employee_id: string;
  password?: string;
};

// Searchable Paginated Dropdown Component
type SearchableSelectProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  fetchUrl: string;
};

function SearchableSelect({ label, placeholder, value, onChange, fetchUrl }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<OptionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  const pageSize = 5; // Perfect list count for dropdown height

  const fetchOptions = async (queryStr: string, pageNum: number) => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem("mysuf-token");
      const res = await fetch(`${fetchUrl}?query=${encodeURIComponent(queryStr)}&page=${pageNum}&page_size=${pageSize}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOptions(search, page);
    }
  }, [search, page, isOpen]);

  // Load single display name if initial value is provided
  useEffect(() => {
    const fetchSingle = async () => {
      if (!value) {
        setSelectedName("");
        return;
      }
      try {
        const token = window.localStorage.getItem("mysuf-token");
        const res = await fetch(`${fetchUrl}?query=&page=1&page_size=100`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const matched = (data.items || []).find((i: any) => i.id === value);
          if (matched) {
            setSelectedName(matched.name);
          } else {
            setSelectedName("Item Terpilih");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSingle();
  }, [value, fetchUrl]);

  return (
    <div className="space-y-1.5 relative">
      <label className="text-xs font-bold uppercase tracking-wide text-slate-700">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-(--primary) focus:ring-1 focus:ring-(--primary) flex justify-between items-center"
        >
          <span className={selectedName ? "text-slate-900" : "text-slate-400"}>
            {selectedName || placeholder}
          </span>
          <span className="text-slate-400 text-xs">▼</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1.5 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl flex flex-col gap-2 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari entitas..."
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
                autoFocus
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-4 text-slate-400 text-xs gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-(--primary)" />
                <span>Mencari...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">Tidak ada data ditemukan</div>
            ) : (
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setSelectedName(item.name);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition ${item.id === value ? "bg-(--primary-10) text-(--primary)" : "text-slate-700"}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}

            {total > pageSize && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 px-1">
                <span className="text-[10px] text-slate-500 font-semibold">Hal {page} dari {Math.ceil(total / pageSize)}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={page >= Math.ceil(total / pageSize)}
                    onClick={() => setPage(page + 1)}
                    className="rounded border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
      role: "SPBU_ADMIN",
      gas_station_id: "",
      company_id: "",
      employee_id: "",
      password: "",
    }
  );

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      setFormData({
        name: "",
        email: "",
        role: "SPBU_ADMIN",
        gas_station_id: "",
        company_id: "",
        employee_id: "",
        password: "",
      });
    }
  }, [isOpen, initialValues]);

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
        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Email Akses</label>
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isPasswordDisabled ? "Biarkan kosong untuk mempertahankan password lama" : "Masukkan password akses"}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
              required={!isPasswordDisabled}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">Role Akses Portal</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="SPBU_ADMIN">SPBU_ADMIN</option>
              <option value="GOV_ADMIN">GOV_ADMIN</option>
              <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">ID Pegawai (Opsional)</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="EMP-XXX"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none focus:ring-1 focus:ring-(--primary)"
            />
          </div>

          {formData.role === "SPBU_ADMIN" && (
            <div className="animate-fade-in-up">
              <SearchableSelect
                label="Pilih Gas Station (SPBU)"
                placeholder="-- Cari & Pilih SPBU --"
                value={formData.gas_station_id}
                onChange={(val) => setFormData((prev) => ({ ...prev, gas_station_id: val }))}
                fetchUrl={`${API_BASE_URL}/users/gas-stations/options`}
              />
            </div>
          )}

          {formData.role === "COMPANY_ADMIN" && (
            <div className="animate-fade-in-up">
              <SearchableSelect
                label="Pilih Perusahaan (Fleet)"
                placeholder="-- Cari & Pilih Perusahaan --"
                value={formData.company_id}
                onChange={(val) => setFormData((prev) => ({ ...prev, company_id: val }))}
                fetchUrl={`${API_BASE_URL}/users/companies/options`}
              />
            </div>
          )}

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
            Apakah Anda yakin ingin menghapus akun portal
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
