export type MySufUser = {
  id: string;
  name: string;
  email: string;
  nik: string;
  role: "SPBU_ADMIN" | "GOV_ADMIN" | "COMPANY_ADMIN";
  entity: string;
  status: boolean;
};

export type SpbuRegistration = {
  id: string;
  name: string;
  license: string;
  region: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type CompanyDirectoryItem = {
  name: string;
  nib: string;
  fleetTotal: string;
  multiplier: string;
  status: "Active" | "Suspended";
};

export const mysufUsers: MySufUser[] = [
  {
    id: "USR-001",
    name: "Rian Hidayat",
    email: "rian.hidayat@mysuf.id",
    nik: "3174012345678901",
    role: "SPBU_ADMIN",
    entity: "SPBU 31.12345",
    status: true,
  },
  {
    id: "USR-002",
    name: "Siti Aminah",
    email: "siti.aminah@mysuf.id",
    nik: "3201023456789012",
    role: "GOV_ADMIN",
    entity: "Direktorat Subsidi Nasional",
    status: true,
  },
  {
    id: "USR-003",
    name: "Ahmad Santoso",
    email: "ahmad.santoso@mysuf.id",
    nik: "3275034567890123",
    role: "COMPANY_ADMIN",
    entity: "PT Logistik Trans",
    status: false,
  },
  {
    id: "USR-004",
    name: "Nabila Putri",
    email: "nabila.putri@mysuf.id",
    nik: "3174045678901234",
    role: "SPBU_ADMIN",
    entity: "SPBU 31.14201",
    status: true,
  },
  {
    id: "USR-005",
    name: "Dewi Hartono",
    email: "dewi.hartono@mysuf.id",
    nik: "3201056789012345",
    role: "COMPANY_ADMIN",
    entity: "CV Fast Delivery",
    status: true,
  },
];

export const spbuRegistrations: SpbuRegistration[] = [
  {
    id: "REG-2026-001",
    name: "SPBU Pertamina 31.14201 Jakarta",
    license: "12.9301.99.2026",
    region: "DKI Jakarta",
    submittedAt: "12 Mei 2026",
    status: "Pending",
  },
  {
    id: "REG-2026-014",
    name: "SPBU Pertamina 31.14520 Bandung",
    license: "12.9301.88.2026",
    region: "Kota Bandung",
    submittedAt: "17 Mei 2026",
    status: "Approved",
  },
  {
    id: "REG-2026-021",
    name: "SPBU Pertamina 31.14411 Surabaya",
    license: "12.9301.77.2026",
    region: "Surabaya",
    submittedAt: "20 Mei 2026",
    status: "Rejected",
  },
  {
    id: "REG-2026-025",
    name: "SPBU Pertamina 31.14277 Medan",
    license: "12.9301.45.2026",
    region: "Medan",
    submittedAt: "21 Mei 2026",
    status: "Pending",
  },
];

export const companyDirectory: CompanyDirectoryItem[] = [
  {
    name: "PT Logistik Nusantara Maju",
    nib: "912000123456",
    fleetTotal: "42 Truk, 12 Pick-Up",
    multiplier: "x1.5 (Logistik Sembako)",
    status: "Active",
  },
  {
    name: "CV Fast Delivery",
    nib: "912000654321",
    fleetTotal: "18 Truk, 6 Pick-Up",
    multiplier: "x1.0 (Umum)",
    status: "Active",
  },
  {
    name: "PT Mitra Distribusi",
    nib: "912000112233",
    fleetTotal: "25 Truk, 8 Box",
    multiplier: "x1.2 (Distribusi Regional)",
    status: "Suspended",
  },
];
