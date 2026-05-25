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
  { label: "Petugas SPBU", href: "/spbu/staff", icon: "users" },
  { label: "Riwayat Aktivitas", href: "/spbu/activity", icon: "history" },
];

export const governmentNav: NavItem[] = [
  { label: "Dashboard", href: "/government", icon: "command" },
  { label: "Heatmap Distribusi", href: "/government/heatmap", icon: "heat" },
  { label: "Fraud Report", href: "/government/fraud-report", icon: "alert" },
  { label: "User Eligibility", href: "/government/user-eligibility", icon: "id" },
  { label: "Dynamic Quota Control", href: "/government/quota-control", icon: "sliders" },
  { label: "Freeze & Block Akun", href: "/government/blacklist", icon: "ban" },
];

export const fleetNav: NavItem[] = [
  { label: "Dashboard Armada", href: "/fleet", icon: "layout" },
  { label: "Daftar Kendaraan", href: "/fleet/vehicles", icon: "truck" },
  { label: "Daftar Driver", href: "/fleet/assign-driver", icon: "id" },
  { label: "Legalitas Usaha", href: "/fleet/legal", icon: "file" },
];

export const superAdminNav: NavItem[] = [
  { label: "Manajemen Pengguna", href: "/mysuf-admin/users", icon: "users" },
  { label: "Verifikasi Perusahaan", href: "/mysuf-admin/verifikasi-perusahaan", icon: "file" },
  { label: "Verifikasi Warga Komersial", href: "/mysuf-admin/verifikasi-warga-komersial", icon: "id" },
  { label: "Log Aktivitas", href: "/mysuf-admin/log-aktivitas", icon: "activity" },
];
