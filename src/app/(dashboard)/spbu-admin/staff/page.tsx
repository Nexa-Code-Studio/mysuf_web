import { MoreVertical, Search } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const staffMembers = [
  {
    name: "Budi Santoso",
    initials: "BS",
    nik: "3174 0012 3301",
    role: "Cashier Level 1",
    shift: "Morning",
    lastActive: "Today, 08:12",
    status: true,
  },
  {
    name: "Ayu Lestari",
    initials: "AL",
    nik: "3174 1209 4021",
    role: "Cashier Level 2",
    shift: "Afternoon",
    lastActive: "Today, 12:30",
    status: true,
  },
  {
    name: "Rahmat Hidayat",
    initials: "RH",
    nik: "3174 2211 1120",
    role: "Supervisor",
    shift: "Full Day",
    lastActive: "Today, 09:45",
    status: true,
  },
  {
    name: "Siti Nurhaliza",
    initials: "SN",
    nik: "3174 0821 5532",
    role: "Cashier Level 1",
    shift: "Morning",
    lastActive: "Yesterday, 17:20",
    status: false,
  },
  {
    name: "Dimas Pratama",
    initials: "DP",
    nik: "3174 0907 3345",
    role: "Cashier Level 2",
    shift: "Evening",
    lastActive: "Today, 18:05",
    status: true,
  },
  {
    name: "Rani Saputri",
    initials: "RS",
    nik: "3174 1101 7789",
    role: "Cashier Level 1",
    shift: "Evening",
    lastActive: "Today, 19:00",
    status: false,
  },
];

const roleTone: Record<string, { label: string; className: string }> = {
  "Cashier Level 1": {
    label: "Cashier Level 1",
    className: "bg-slate-100 text-slate-600",
  },
  "Cashier Level 2": {
    label: "Cashier Level 2",
    className: "bg-sky-100 text-sky-700",
  },
  Supervisor: {
    label: "Supervisor",
    className: "bg-purple-100 text-purple-700",
  },
};

function StatusToggle({ active }: { active: boolean }) {
  return (
    <div
      className={`relative h-6 w-11 rounded-full transition ${
        active ? "bg-pertamina-red" : "bg-slate-200"
      }`}
      aria-hidden
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          active ? "left-5" : "left-0.5"
        }`}
      />
    </div>
  );
}

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Staff Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage cashiers and staff access
          </p>
        </div>
        <Button className="w-full md:w-auto">+ Tambah Petugas</Button>
      </header>

      <Card className="border-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or NIK..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 focus:border-pertamina-red focus:outline-none"
            />
          </div>
          <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600">
            <option>All Shifts</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
          <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 pb-3">Name</th>
                <th className="px-4 pb-3">NIK</th>
                <th className="px-4 pb-3">Role Access</th>
                <th className="px-4 pb-3">Shift Activity</th>
                <th className="px-4 pb-3">Last Active</th>
                <th className="px-4 pb-3">Status</th>
                <th className="px-4 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((member) => (
                <tr key={member.nik}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {member.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-500">SPBU 34.147.02</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{member.nik}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`${roleTone[member.role].className} font-semibold`}
                    >
                      {roleTone[member.role].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{member.shift}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {member.lastActive}
                  </td>
                  <td className="px-4 py-3">
                    <StatusToggle active={member.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-100 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center">
          <span>Showing 6 of 6 staff</span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500">
              Previous
            </button>
            <button className="rounded-lg bg-pertamina-red px-3 py-1.5 font-semibold text-white">
              1
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500">
              2
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
