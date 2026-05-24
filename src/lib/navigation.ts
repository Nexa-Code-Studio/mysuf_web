export type NavItem = {
  label: string;
  href: string;
  icon: string;
  description?: string;
};

export const spbuNav: NavItem[] = [
  { label: "Dashboard", href: "/spbu", icon: "layout" },
  { label: "Transaksi BBM", href: "/spbu/transactions", icon: "fuel" },
  { label: "Fraud Alert", href: "/spbu/fraud-alert", icon: "alert" },
  { label: "Peak Hour Analytics", href: "/spbu/peak-hour", icon: "chart" },
  { label: "Monitoring Kendaraan", href: "/spbu/vehicle-monitoring", icon: "radar" },
  { label: "Petugas SPBU", href: "/spbu/staff", icon: "users" },
  { label: "Riwayat Aktivitas", href: "/spbu/activity", icon: "history" },
];

export const governmentNav: NavItem[] = [
  { label: "National Dashboard", href: "/government", icon: "command" },
  { label: "Heatmap Distribusi", href: "/government/heatmap", icon: "heat" },
  { label: "Fraud Report", href: "/government/fraud-report", icon: "alert" },
  { label: "User Eligibility", href: "/government/user-eligibility", icon: "id" },
  { label: "Dynamic Quota Control", href: "/government/quota-control", icon: "sliders" },
  { label: "Blacklist Kendaraan", href: "/government/blacklist", icon: "ban" },
  { label: "Emergency Control", href: "/government/emergency", icon: "shield" },
  { label: "Analytics Nasional", href: "/government/analytics", icon: "chart" },
];

export const fleetNav: NavItem[] = [
  { label: "Fleet Dashboard", href: "/fleet", icon: "layout" },
  { label: "Armada Kendaraan", href: "/fleet/vehicles", icon: "truck" },
  { label: "Assign Driver", href: "/fleet/assign-driver", icon: "id" },
  { label: "Fuel Consumption", href: "/fleet/fuel-consumption", icon: "fuel" },
  { label: "Kuota Perusahaan", href: "/fleet/quota", icon: "sliders" },
  { label: "Driver Activity", href: "/fleet/driver-activity", icon: "activity" },
  { label: "Legalitas Usaha", href: "/fleet/legal", icon: "file" },
];

export const superAdminNav: NavItem[] = [
  { label: "Manajemen Pengguna", href: "/mysuf-admin/users", icon: "users" },
  { label: "Master SPBU", href: "/mysuf-admin/master-spbu", icon: "fuel" },
  { label: "Master Company", href: "/mysuf-admin/master-company", icon: "truck" },
];
