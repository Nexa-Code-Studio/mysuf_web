"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";

export type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: {
    name: string;
    nik: string;
    role: string;
    unit: string;
    email: string;
  }) => void;
};

export default function UserModal({ isOpen, onClose, onAdd }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    role: "Admin SPBU",
    unit: "SPBU Jakarta",
    email: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd(formData);
    setFormData({ name: "", nik: "", role: "Admin SPBU", unit: "SPBU Jakarta", email: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">Tambah Pengguna</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="e.g. Rama Utama"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
              Email Akses
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              placeholder="nama@mysuf.id"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
              NIK
            </label>
            <input
              type="text"
              required
              pattern="\d{16}"
              title="16 digit angka"
              value={formData.nik}
              onChange={(event) =>
                setFormData({ ...formData, nik: event.target.value })
              }
              placeholder="16 digit angka NIK"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Role Akses
              </label>
              <select
                value={formData.role}
                onChange={(event) =>
                  setFormData({ ...formData, role: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option>Admin SPBU</option>
                <option>Admin Pemerintah</option>
                <option>Admin Perusahaan</option>
                <option>Super Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Unit / Instansi
              </label>
              <select
                value={formData.unit}
                onChange={(event) =>
                  setFormData({ ...formData, unit: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option>SPBU Jakarta</option>
                <option>Direktorat Subsidi</option>
                <option>Fleet Logistics HQ</option>
                <option>MySuF HQ</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="w-full bg-(--primary) hover:brightness-95 text-white">
              Simpan Pengguna
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
