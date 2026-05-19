"use client";

import { Bell, ChevronDown, Settings, UserCircle2 } from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";

export type TopbarNotification = {
  title: string;
  detail: string;
  time: string;
  tone?: "neutral" | "warning" | "critical";
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

export default function TopbarMenus({ userName, userRole, notifications }: TopbarMenusProps) {
  const initials = getInitials(userName);

  return (
    <div className="flex items-center gap-3">
      <details className="group relative">
        <summary className="flex list-none cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pertamina-red text-xs font-semibold text-white">
            {initials}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-900">{userName}</p>
            <p className="text-[11px] text-slate-500">{userRole}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </summary>
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <div className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <UserCircle2 className="h-4 w-4" />
              Profil
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              Pengaturan
            </button>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-500">
              <span>Push Notification</span>
              <span className="rounded-full bg-pertamina-red px-2 py-0.5 text-[10px] text-white">
                ON
              </span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <LogoutButton className="w-full" />
          </div>
        </div>
      </details>

      <details className="group relative">
        <summary className="relative flex list-none cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pertamina-red px-1 text-[10px] font-semibold text-white">
            {notifications.length}
          </span>
        </summary>
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Notifikasi</p>
            <span className="text-xs text-slate-400">Realtime</span>
          </div>
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={`${item.title}-${item.time}`} className="flex items-start gap-3">
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                    toneStyles[item.tone ?? "neutral"]
                  }`}
                >
                  {item.time}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
