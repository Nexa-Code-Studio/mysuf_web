"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Settings, UserCircle2, Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export type TopbarNotification = {
  id?: string;
  title: string;
  detail: string;
  time: string;
  tone?: "neutral" | "warning" | "critical";
  read?: boolean;
};

export type TopbarMenusProps = {
  userName: string;
  userRole: string;
  notifications: TopbarNotification[];
};

const toneStyles: Record<NonNullable<TopbarNotification["tone"]>, string> = {
  neutral: "bg-slate-100 text-slate-600",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-pertamina-red/15 text-pertamina-red",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TopbarMenus({ userName, userRole, notifications: initialNotifications }: TopbarMenusProps) {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/mysuf-admin")
    ? "/mysuf-admin"
    : pathname.startsWith("/super-admin")
    ? "/super-admin"
    : pathname.startsWith("/fleet")
    ? "/fleet"
    : pathname.startsWith("/government")
    ? "/government"
    : "/spbu";

  const initials = getInitials(userName);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    initialNotifications.map((n, i) => ({ ...n, id: n.id || `notif-${i}`, read: false }))
  );

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="relative flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-50 transition"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-pertamina-red border-2 border-white"></span>
          )}
        </button>
        
        {isNotifOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">Notifikasi</p>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-semibold text-pertamina-red hover:text-red-700 transition flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Tandai semua dibaca
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {notifications.length === 0 ? (
                <div className="text-center p-4 text-sm text-slate-500">Tidak ada notifikasi</div>
              ) : (
                notifications.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => markAsRead(item.id!)}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${item.read ? 'opacity-60 hover:bg-slate-50' : 'bg-red-50/30 hover:bg-red-50/50 relative'}`}
                  >
                    {!item.read && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-pertamina-red rounded-full"></div>}
                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${
                        toneStyles[item.tone ?? "neutral"]
                      }`}
                    >
                      {item.time}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 rounded-full border border-transparent hover:border-slate-200 bg-transparent hover:bg-slate-50 px-2 py-1.5 text-left transition"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-900">{userName}</p>
            <p className="text-[11px] font-medium text-slate-500">{userRole}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--primary-20)] bg-[var(--primary-10)] text-[var(--primary)] shadow-sm transition hover:bg-[var(--primary-20)]">
            <UserCircle2 className="h-5 w-5" />
          </div>
        </button>
        
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 mb-2 border-b border-slate-100 sm:hidden block">
              <p className="text-sm font-bold text-slate-900">{userName}</p>
              <p className="text-[11px] font-medium text-slate-500">{userRole}</p>
            </div>
            <div className="space-y-1">
              <Link
                href={`${basePath}/profile`}
                onClick={() => setIsProfileOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-pertamina-red transition"
              >
                <UserCircle2 className="h-4 w-4" />
                Profil Pengguna
              </Link>
              <Link
                href={`${basePath}/settings`}
                onClick={() => setIsProfileOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-pertamina-red transition"
              >
                <Settings className="h-4 w-4" />
                Pengaturan
              </Link>
            </div>
            <div className="mt-2 border-t border-slate-100 pt-2">
              <LogoutButton className="w-full justify-start" variant="outline" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
