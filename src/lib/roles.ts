import type { UserRole } from "@/types";

export const ROLE_STORAGE_KEY = "mysuf-role" as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  SPBU_ADMIN: "Admin SPBU",
  GOV_ADMIN: "Admin Pemerintah",
  COMPANY_ADMIN: "Admin Perusahaan",
};

export const ROLE_BASE_PATH: Record<UserRole, string> = {
  SPBU_ADMIN: "/spbu",
  GOV_ADMIN: "/government",
  COMPANY_ADMIN: "/fleet",
};

export const ROLE_LOGIN_OPTIONS: Array<{ role: UserRole; label: string; hint: string }> = [
  {
    role: "SPBU_ADMIN",
    label: "Login sebagai SPBU",
    hint: "Operasional harian, monitoring realtime, fraud alert.",
  },
  {
    role: "GOV_ADMIN",
    label: "Login sebagai Pemerintah",
    hint: "Kendali subsidi nasional, heatmap distribusi, kontrol kuota.",
  },
  {
    role: "COMPANY_ADMIN",
    label: "Login sebagai Perusahaan",
    hint: "Manajemen armada, driver, dan efisiensi konsumsi.",
  },
];
