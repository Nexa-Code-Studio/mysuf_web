"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";

export type DeleteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
};

export default function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: DeleteUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900">Hapus Akun Pengguna?</h3>
          <p className="mb-6 text-sm text-slate-500">
            Anda yakin ingin menghapus akses <span className="font-semibold text-slate-700">{userName}</span>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex w-full gap-3">
            <Button variant="ghost" className="w-full text-slate-600" onClick={onClose}>
              Batal
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
              Hapus Permanen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
