"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "@/components/auth/LogoutButton";
import NavIcon from "@/components/layout/NavIcon";
import { spbuNav } from "@/lib/navigation";

export default function SpbuSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pertamina-red text-white">
          <NavIcon name="fuel" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">MySuF SPBU Ops</p>
          <p className="text-xs text-slate-500">Realtime Branch Center</p>
        </div>
      </div>

      <nav className="mt-8 flex-1 min-h-0 space-y-1 overflow-y-auto pr-1">
        {spbuNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/spbu" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                active ? "bg-[var(--primary)] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <NavIcon name={item.icon} className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4 pt-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status SPBU
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">Operasional Normal</p>
          <p className="text-xs text-slate-500">Update 5 menit lalu</p>
        </div>
        <LogoutButton className="w-full" />
      </div>
    </aside>
  );
}
