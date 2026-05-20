import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-white shadow-xl animate-fade-in-up">
      <CheckCircle className="h-5 w-5 text-emerald-400" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
