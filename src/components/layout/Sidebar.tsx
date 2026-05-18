"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Cpu,
  FileText,
  Globe2,
  IdCard,
  LayoutGrid,
  ListChecks,
  Route,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { sidebarMenuGroups } from "@/lib/constants";
import type { UserRole } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  "bar-chart": BarChart3,
  shield: ShieldAlert,
  users: Users,
  checklist: ListChecks,
  globe: Globe2,
  "trend-up": TrendingUp,
  sliders: SlidersHorizontal,
  cpu: Cpu,
  sparkles: Sparkles,
  pulse: Activity,
  truck: Truck,
  "file-text": FileText,
  "id-card": IdCard,
  route: Route,
};

export type SidebarProps = {
  currentRole: UserRole;
};

export default function Sidebar({ currentRole }: SidebarProps) {
  const pathname = usePathname();
  const showAll = process.env.NODE_ENV === "development";

  const groups = showAll
    ? sidebarMenuGroups
    : sidebarMenuGroups.filter((group) => group.roles.includes(currentRole));

  const activeHref =
    groups
      .flatMap((group) => group.items)
      .find((item) => item.href === pathname)?.href ??
    groups[0]?.items[0]?.href ??
    "/dashboard";

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-68 border-r border-slate-100 bg-white px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pertamina-red text-white">
          <LayoutGrid className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Distribusi BBM
          </p>
          <p className="text-xs text-slate-500">Enterprise Dashboard</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {groups.map((group) => (
          <div key={group.id} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutGrid;
                const isActive = item.href === activeHref;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-pertamina-red text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
