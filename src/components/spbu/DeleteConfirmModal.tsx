"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staffName?: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, staffName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Akun Petugas?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Anda yakin ingin menghapus akses <span className="font-semibold text-slate-700">{staffName}</span>? Tindakan ini tidak dapat dibatalkan dan akun tidak bisa lagi digunakan untuk login POS.
          </p>
          <div className="flex gap-3 w-full">
            <Button onClick={onClose} variant="ghost" className="w-full text-slate-600">Batal</Button>
            <Button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white border-0">Hapus Permanen</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
