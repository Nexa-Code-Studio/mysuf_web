"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "@/components/auth/LogoutButton";
import NavIcon from "@/components/layout/NavIcon";
import { spbuNav } from "@/lib/navigation";

export default function SpbuSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6">
      
      {/* Container Utama Header (Logo + Judul) */}
      <div className="flex flex-col gap-5">
        <div>
          <Image
            src="/MySuf-logo.png"
            alt="MySuF"
            width={340}
            height={48}
            className="h-12 w-auto"
          />
          <span className="sr-only">MySuF</span>
        </div>
        
        <div>
          <p className="text-sm font-semibold text-slate-900">SPBU Ops</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Realtime Branch Center</p>
        </div>
      </div>

      {/* Bagian Navigasi Menu SPBU */}
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
                active ? "bg-(--primary) text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <NavIcon name={item.icon} className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bagian Status & Tombol Logout */}
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