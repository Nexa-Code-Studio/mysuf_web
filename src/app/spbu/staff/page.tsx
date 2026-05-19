import { MoreVertical, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";

const staff = [
  {
    name: "Budi Santoso",
    nik: "3174012345678901",
    role: "Cashier Level 1",
    roleTone: "neutral",
    shift: "Morning (06:00 - 14:00)",
    lastActive: "2 hours ago",
    status: true,
  },
  {
    name: "Siti Nurhaliza",
    nik: "3201023456789012",
    role: "Cashier Level 2",
    roleTone: "primary",
    shift: "Afternoon (14:00 - 22:00)",
    lastActive: "Active now",
    status: true,
  },
  {
    name: "Ahmad Wijaya",
    nik: "3275034567890123",
    role: "Supervisor",
    roleTone: "primary",
    shift: "Morning (06:00 - 14:00)",
    lastActive: "1 hour ago",
    status: true,
  },
  {
    name: "Dewi Kusuma",
    nik: "3174045678901234",
    role: "Cashier Level 1",
    roleTone: "neutral",
    shift: "Night (22:00 - 06:00)",
    lastActive: "5 hours ago",
    status: false,
  },
  {
    name: "Rudi Hartono",
    nik: "3201056789012345",
    role: "Cashier Level 1",
    roleTone: "neutral",
    shift: "Afternoon (14:00 - 22:00)",
    lastActive: "30 mins ago",
    status: true,
  },
  {
    name: "Linda Permata",
    nik: "3275067890123456",
    role: "Cashier Level 2",
    roleTone: "primary",
    shift: "Night (22:00 - 06:00)",
    lastActive: "8 hours ago",
    status: true,
  },
];

const initialsFor = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function SpbuStaffPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Petugas SPBU"
        subtitle="Manage cashiers and staff access"
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Tambah Petugas
          </Button>
        }
      />

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" aria-hidden />
            <input
              type="search"
              placeholder="Search by name or NIK..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            defaultValue="all"
          >
            <option value="all">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
          </select>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            defaultValue="status"
          >
            <option value="status">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">NIK</th>
                <th className="px-4 py-3 text-left">Role Access</th>
                <th className="px-4 py-3 text-left">Shift Activity</th>
                <th className="px-4 py-3 text-left">Last Active</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((item) => (
                <tr key={item.nik} className="text-slate-700">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {initialsFor(item.name)}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.nik}</td>
                  <td className="px-4 py-4">
                    <Badge tone={item.roleTone as "primary" | "neutral"}>{item.role}</Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{item.shift}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.lastActive}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.status}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        item.status ? "bg-pertamina-red" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                          item.status ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-1 pt-3 text-xs text-slate-500">
          <span>Showing 6 of 6 staff</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-full bg-pertamina-red px-3 py-1 text-xs font-semibold text-white"
            >
              1
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              2
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
