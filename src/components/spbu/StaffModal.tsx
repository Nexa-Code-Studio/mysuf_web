"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (staff: any) => void;
}

export default function StaffModal({ isOpen, onClose, onAdd }: StaffModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    role: "Cashier Level 1",
    shift: "Morning (06:00 - 14:00)"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: "", nik: "", role: "Cashier Level 1", shift: "Morning (06:00 - 14:00)" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Tambah Petugas Kasir</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nama Lengkap</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Budi Santoso"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-sm" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">NIK (Nomor Induk Kependudukan)</label>
            <input 
              type="text" 
              required
              pattern="\d{16}"
              title="16 digit angka"
              value={formData.nik}
              onChange={e => setFormData({...formData, nik: e.target.value})}
              placeholder="16 digit angka NIK"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-sm" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Role Akses</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-sm bg-white"
              >
                <option>Cashier Level 1</option>
                <option>Cashier Level 2</option>
                <option>Supervisor</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Shift Utama</label>
              <select 
                value={formData.shift}
                onChange={e => setFormData({...formData, shift: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-sm bg-white"
              >
                <option>Morning (06:00 - 14:00)</option>
                <option>Afternoon (14:00 - 22:00)</option>
                <option>Night (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" onClick={onClose} variant="ghost" className="w-full">Batal</Button>
            <Button type="submit" className="w-full bg-[var(--primary)] hover:brightness-95 text-white">Simpan Data</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
