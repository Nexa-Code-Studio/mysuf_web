export const spbuDashboard = {
  stats: [
    { label: "Total Transaksi Hari Ini", value: "1.284", trend: "+8.2%" },
    { label: "Volume BBM Keluar", value: "42.600 L", trend: "+3.6%" },
    { label: "Fraud Alert Realtime", value: "5", trend: "-2" },
    { label: "Peak Hour Load", value: "87%", trend: "+6%" },
  ],
  peakHours: [
    { hour: "06:00", volume: 120 },
    { hour: "09:00", volume: 210 },
    { hour: "12:00", volume: 320 },
    { hour: "15:00", volume: 260 },
    { hour: "18:00", volume: 410 },
    { hour: "21:00", volume: 190 },
  ],
  suspiciousVehicles: [
    { plate: "B 9123 KZ", reason: "Pengisian berulang < 1 jam", risk: "High" },
    { plate: "BG 1184 TR", reason: "Mismatch kuota harian", risk: "Medium" },
    { plate: "D 4401 NH", reason: "ID petugas tidak valid", risk: "High" },
  ],
  staffActivity: [
    { name: "Rama Utama", shift: "Pagi", status: "Aktif", last: "08:10" },
    { name: "Nia Putri", shift: "Siang", status: "Aktif", last: "13:45" },
    { name: "Andi Prakoso", shift: "Malam", status: "Off", last: "22:30" },
  ],
};

export const governmentDashboard = {
  stats: [
    { label: "Total Subsidi Tersalurkan", value: "Rp 1,24 T", trend: "+2,4%" },
    { label: "Fraud Case Nasional", value: "124", trend: "-6" },
    { label: "Provinsi Rawan", value: "7", trend: "+1" },
    { label: "Kuota Tersisa", value: "18%", trend: "-3%" },
  ],
  heatmap: [
    { region: "Sumatera", intensity: "Tinggi", volume: "2,1M KL" },
    { region: "Jawa", intensity: "Sangat Tinggi", volume: "5,8M KL" },
    { region: "Kalimantan", intensity: "Sedang", volume: "1,2M KL" },
    { region: "Sulawesi", intensity: "Sedang", volume: "1,1M KL" },
  ],
  fraudCases: [
    { caseId: "FR-1023", type: "Kuota ganda", status: "Investigasi" },
    { caseId: "FR-1037", type: "Pola pengisian abnormal", status: "Tindakan" },
    { caseId: "FR-1092", type: "Akun tidak valid", status: "Review" },
  ],
  quotaAdjustments: [
    { area: "Jabodetabek", action: "Turunkan 4%", reason: "Permintaan stabil" },
    { area: "Kaltim", action: "Naikkan 6%", reason: "Proyek strategis" },
  ],
};

export const fleetDashboard = {
  stats: [
    { label: "Total Armada", value: "326", trend: "+12" },
    { label: "Konsumsi Bulanan", value: "98.400 L", trend: "+4,1%" },
    { label: "Driver Aktif", value: "218", trend: "-3" },
    { label: "Kuota Tersisa", value: "22%", trend: "-5%" },
  ],
  fuelEfficiency: [
    { month: "Jan", efficiency: 8.1 },
    { month: "Feb", efficiency: 8.4 },
    { month: "Mar", efficiency: 7.9 },
    { month: "Apr", efficiency: 8.6 },
    { month: "Mei", efficiency: 8.8 },
    { month: "Jun", efficiency: 8.3 },
  ],
  vehicleStatus: [
    { vehicle: "TR-8821", status: "On Route", driver: "Rizal" },
    { vehicle: "TR-1145", status: "Maintenance", driver: "Sinta" },
    { vehicle: "TR-4512", status: "Idle", driver: "Agus" },
  ],
  driverActivity: [
    { name: "Rizal", trips: 12, compliance: "98%" },
    { name: "Sinta", trips: 9, compliance: "95%" },
    { name: "Agus", trips: 7, compliance: "92%" },
  ],
};
