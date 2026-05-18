import { Bell, ChevronDown } from "lucide-react";

import type { UserRole } from "@/types";

export type HeaderProps = {
  userName: string;
  userRole: UserRole;
  userInitials: string;
  notificationCount?: number;
};

export default function Header({
  userName,
  userRole,
  userInitials,
  notificationCount = 0,
}: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-8">
      <div>
        <p className="text-sm font-medium text-slate-500">Welcome back,</p>
        <h1 className="text-lg font-semibold text-slate-800">{userName}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 ? (
            <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pertamina-red px-1 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          ) : null}
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50 px-3 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pertamina-red text-sm font-semibold text-white">
            {userInitials}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">{userRole}</p>
            <p className="text-xs text-slate-500">{userName}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
