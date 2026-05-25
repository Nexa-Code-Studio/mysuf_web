  "use client";

  import { useEffect, useState, useTransition } from "react";
  import { Building2, SlidersHorizontal, Truck, Users } from "lucide-react";
  import SectionHeader from "@/components/ui/SectionHeader";
  import { Card } from "@/components/ui/Card";
  import DataTable from "@/components/ui/DataTable";
  import { RISK_MODIFIER_BY_LEVEL } from "@/lib/quotaEngine";

  type VehicleType = "motorcycle" | "passenger_car" | "pickup" | "truck" | "box_cargo" | "tanker" | "van";

  

  type CommercialQuotaMap = Partial<Record<VehicleType, number>>;

  type BaseQuotaConfig = {
    warga: number;
    komersialWarga: CommercialQuotaMap;
    komersialPerusahaan: CommercialQuotaMap;
  };

  type PolicyRow = {
    vehicleTypeLabel: string;
    baseQuota: string;
    safe: string;
    suspicious: string;
    highRisk: string;
    critical: string;
  };

  type FinalQuotaDummyRow = {
    nikSensor: string;
    nama: string;
    baseQuota1: string;
    baseQuota2: string;
    baseQuota3: string;
    riskIndex: number;
    modifier: string;
    finalQuota: string;
    riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK" | "CRITICAL";
    fraudSources: string;
  };

  const COMMERCIAL_WARGA_VEHICLES: Array<{
    vehicleType: VehicleType;
    label: string;
  }> = [
    { vehicleType: "motorcycle", label: "Motor komersial" },
    { vehicleType: "passenger_car", label: "Mobil komersial" },
    { vehicleType: "van", label: "Van niaga" },
    { vehicleType: "pickup", label: "Pickup ringan" },
  ];

  const COMMERCIAL_PERUSAHAAN_VEHICLES: Array<{
    vehicleType: VehicleType;
    label: string;
  }> = [
    { vehicleType: "pickup", label: "Pickup perusahaan" },
    { vehicleType: "truck", label: "Truck perusahaan" },
    { vehicleType: "box_cargo", label: "Box cargo perusahaan" },
    { vehicleType: "tanker", label: "Tanker perusahaan" },
  ];

  const createDefaultBaseQuota = (): BaseQuotaConfig => ({
    warga: 80,
    komersialWarga: {
      motorcycle: 45,
      passenger_car: 70,
      van: 90,
      pickup: 110,
    },
    komersialPerusahaan: {
      pickup: 180,
      truck: 300,
      box_cargo: 260,
      tanker: 400,
    },
  });

  const cloneBaseQuotaConfig = (config: BaseQuotaConfig): BaseQuotaConfig => ({
    warga: config.warga,
    komersialWarga: { ...config.komersialWarga },
    komersialPerusahaan: { ...config.komersialPerusahaan },
  });

  

  const FINAL_QUOTA_DUMMY_ROWS: FinalQuotaDummyRow[] = [
    { nikSensor: "3174********8901", nama: "Rian Hidayat", baseQuota1: "80 L", baseQuota2: "0 L", baseQuota3: "0 L", riskIndex: 0, modifier: "1.0", finalQuota: "80 L", riskLevel: "SAFE", fraudSources: "SAFE" },
    { nikSensor: "3201********9012", nama: "Siti Aminah", baseQuota1: "80 L", baseQuota2: "70 L", baseQuota3: "0 L", riskIndex: 34, modifier: "0.8", finalQuota: "120 L", riskLevel: "SUSPICIOUS", fraudSources: "RAPID_PURCHASE" },
    { nikSensor: "3275********0123", nama: "Ahmad Santoso", baseQuota1: "80 L", baseQuota2: "0 L", baseQuota3: "560 L", riskIndex: 72, modifier: "0.5", finalQuota: "320 L", riskLevel: "HIGH_RISK", fraudSources: "MULTI_LOCATION_ABUSE" },
    { nikSensor: "3174********1234", nama: "Nabila Putri", baseQuota1: "80 L", baseQuota2: "45 L", baseQuota3: "0 L", riskIndex: 58, modifier: "0.8", finalQuota: "100 L", riskLevel: "SUSPICIOUS", fraudSources: "HOUSEHOLD_ABUSE" },
    { nikSensor: "3201********2345", nama: "Dewi Hartono", baseQuota1: "80 L", baseQuota2: "0 L", baseQuota3: "0 L", riskIndex: 108, modifier: "0.0", finalQuota: "0 L", riskLevel: "CRITICAL", fraudSources: "RAPID_PURCHASE, MULTI_LOCATION_ABUSE" },
  ];

  export default function GovernmentQuotaControlPage() {
    const [appliedBaseQuota, setAppliedBaseQuota] = useState<BaseQuotaConfig>(createDefaultBaseQuota);
    const [draftBaseQuota, setDraftBaseQuota] = useState<BaseQuotaConfig>(createDefaultBaseQuota);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState("ALL");
    const [fraudFilter, setFraudFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const wargaPolicyRows: PolicyRow[] = [
      {
        vehicleTypeLabel: "Semua kendaraan",
        baseQuota: `${appliedBaseQuota.warga} L`,
        safe: `${Math.round(appliedBaseQuota.warga * RISK_MODIFIER_BY_LEVEL.SAFE)} L`,
        suspicious: `${Math.round(appliedBaseQuota.warga * RISK_MODIFIER_BY_LEVEL.SUSPICIOUS)} L`,
        highRisk: `${Math.round(appliedBaseQuota.warga * RISK_MODIFIER_BY_LEVEL.HIGH_RISK)} L`,
        critical: `${Math.round(appliedBaseQuota.warga * RISK_MODIFIER_BY_LEVEL.CRITICAL)} L`,
      },
    ];

    const komersialWargaRows: PolicyRow[] = COMMERCIAL_WARGA_VEHICLES.map((item) => {
      const baseQuota = appliedBaseQuota.komersialWarga[item.vehicleType] ?? 0;

      return {
        vehicleTypeLabel: item.label,
        baseQuota: `${baseQuota} L`,
        safe: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.SAFE)} L`,
        suspicious: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.SUSPICIOUS)} L`,
        highRisk: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.HIGH_RISK)} L`,
        critical: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.CRITICAL)} L`,
      };
    });

    const komersialPerusahaanRows: PolicyRow[] = COMMERCIAL_PERUSAHAAN_VEHICLES.map((item) => {
      const baseQuota = appliedBaseQuota.komersialPerusahaan[item.vehicleType] ?? 0;

      return {
        vehicleTypeLabel: item.label,
        baseQuota: `${baseQuota} L`,
        safe: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.SAFE)} L`,
        suspicious: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.SUSPICIOUS)} L`,
        highRisk: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.HIGH_RISK)} L`,
        critical: `${Math.round(baseQuota * RISK_MODIFIER_BY_LEVEL.CRITICAL)} L`,
      };
    });

    const finalQuotaRows = FINAL_QUOTA_DUMMY_ROWS.filter((row) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query.length === 0 || row.nikSensor.toLowerCase().includes(query) || row.nama.toLowerCase().includes(query);
      const matchesRisk = riskFilter === "ALL" || row.riskLevel === riskFilter;
      const matchesFraud = fraudFilter === "ALL" || (fraudFilter === "SAFE" ? row.fraudSources === "SAFE" : row.fraudSources.includes(fraudFilter));

      return matchesSearch && matchesRisk && matchesFraud;
    });

    const totalPages = Math.max(1, Math.ceil(finalQuotaRows.length / rowsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedFinalQuotaRows = finalQuotaRows.slice((safeCurrentPage - 1) * rowsPerPage, safeCurrentPage * rowsPerPage);

    const [, startTransition] = useTransition();

    useEffect(() => {
      startTransition(() => {
        setCurrentPage(1);
      });
    }, [searchQuery, riskFilter, fraudFilter, appliedBaseQuota, startTransition]);

    const handlePreviewChange = () => {
      setIsConfirmationOpen(true);
    };

    const handleConfirmChange = () => {
      setAppliedBaseQuota(cloneBaseQuotaConfig(draftBaseQuota));
      setIsEditModalOpen(false);
      setIsConfirmationOpen(false);
    };

    const handleCancelChange = () => {
      setDraftBaseQuota(cloneBaseQuotaConfig(appliedBaseQuota));
      setIsEditModalOpen(false);
      setIsConfirmationOpen(false);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader
            title="Dynamic Quota Policy"
            subtitle=""
          />
          <button
            type="button"
            onClick={() => {
              setDraftBaseQuota(appliedBaseQuota);
              setIsEditModalOpen(true);
              setIsConfirmationOpen(false);
            }}
            className="self-start sm:self-center px-4 py-2.5 bg-pertamina-red hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-200 transition active:scale-95"
          >
            Edit Base Quota
          </button>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" /> Aturan Kuota Pemerintah
            </div>
            <p className="text-xs text-slate-500">Kuota final dihitung dengan rumus: FinalQuota = BaseQuota sesuai kategori akun dan jenis kendaraan × RiskModifier.</p>
            

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Base Quota Warga</h4>
              </div>
              <DataTable
                columns={[
                  { key: "vehicleTypeLabel", label: "Jenis Kendaraan" },
                  { key: "baseQuota", label: "Base Quota", align: "right" },
                  { key: "safe", label: "SAFE", align: "right" },
                  { key: "suspicious", label: "SUSPICIOUS", align: "right" },
                  { key: "highRisk", label: "HIGH RISK", align: "right" },
                  { key: "critical", label: "CRITICAL", align: "right" },
                ]}
                rows={wargaPolicyRows}
              />
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Base Quota Komersial Warga</h4>
                <p className="text-xs text-slate-500">Quota ini dipisah per jenis kendaraan komersial warga agar motor, mobil, van, dan pickup bisa punya angka berbeda.</p>
              </div>
              <DataTable
                columns={[
                  { key: "vehicleTypeLabel", label: "Jenis Kendaraan" },
                  { key: "baseQuota", label: "Base Quota", align: "right" },
                  { key: "safe", label: "SAFE", align: "right" },
                  { key: "suspicious", label: "SUSPICIOUS", align: "right" },
                  { key: "highRisk", label: "HIGH RISK", align: "right" },
                  { key: "critical", label: "CRITICAL", align: "right" },
                ]}
                rows={komersialWargaRows}
              />
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Base Quota Komersial Perusahaan</h4>
                <p className="text-xs text-slate-500">Quota ini dipisah per jenis kendaraan perusahaan agar pickup, truck, box cargo, dan tanker bisa punya angka berbeda.</p>
              </div>
              <DataTable
                columns={[
                  { key: "vehicleTypeLabel", label: "Jenis Kendaraan" },
                  { key: "baseQuota", label: "Base Quota", align: "right" },
                  { key: "safe", label: "SAFE", align: "right" },
                  { key: "suspicious", label: "SUSPICIOUS", align: "right" },
                  { key: "highRisk", label: "HIGH RISK", align: "right" },
                  { key: "critical", label: "CRITICAL", align: "right" },
                ]}
                rows={komersialPerusahaanRows}
              />
            </div>
          </Card>

          <Card className="p-0 border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900">Final Quota per Transaksi</h3>
                <p className="text-xs text-slate-500 mt-1">Data dummy per NIK untuk menunjukkan base quota 1, 2, dan 3 yang digabung sebelum risk modifier dihitung.</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="space-y-1 text-xs font-semibold text-slate-600 md:col-span-1">
                  Search
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari NIK / akun, nama, atau risiko..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                  />
                </label>

                <label className="space-y-1 text-xs font-semibold text-slate-600">
                  Filter Risk
                  <select
                    value={riskFilter}
                    onChange={(event) => setRiskFilter(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                  >
                    <option value="ALL">Semua</option>
                    <option value="SAFE">SAFE</option>
                    <option value="SUSPICIOUS">SUSPICIOUS</option>
                    <option value="HIGH_RISK">HIGH_RISK</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </label>

                <label className="space-y-1 text-xs font-semibold text-slate-600">
                  Filter Fraud
                  <select
                    value={fraudFilter}
                    onChange={(event) => setFraudFilter(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500"
                  >
                    <option value="ALL">Semua</option>
                    <option value="SAFE">Tidak Ada Fraud</option>
                    <option value="RAPID_PURCHASE">Rapid Purchase</option>
                    <option value="MULTI_LOCATION_ABUSE">Multi Location Abuse</option>
                    <option value="HOUSEHOLD_ABUSE">Household Abuse</option>
                  </select>
                </label>
              </div>
            </div>

            <DataTable
              columns={[
                { key: "nikSensor", label: "NIK (Sensor)" },
                { key: "nama", label: "Nama" },
                { key: "baseQuota1", label: "Base Quota 1", align: "right" },
                { key: "baseQuota2", label: "Base Quota 2", align: "right" },
                { key: "baseQuota3", label: "Base Quota 3", align: "right" },
                { key: "riskIndex", label: "Risk Index", align: "right" },
                { key: "modifier", label: "Modifier", align: "right" },
                { key: "finalQuota", label: "Final Quota", align: "right" },
              ]}
              rows={paginatedFinalQuotaRows}
            />

            <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 space-y-3">
              <p>Menampilkan {Math.min((safeCurrentPage - 1) * rowsPerPage + 1, finalQuotaRows.length)}-{Math.min(safeCurrentPage * rowsPerPage, finalQuotaRows.length)} dari {finalQuotaRows.length} transaksi</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-slate-500">Base quota 1 dipakai untuk warga. Base quota 2 dan 3 ditambahkan jika NIK punya kendaraan komersial warga atau kendaraan perusahaan, lalu risiko mengalikan totalnya.</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setCurrentPage((value) => Math.max(1, value - 1))} disabled={safeCurrentPage === 1} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">{safeCurrentPage} / {totalPages}</span>
                  <button type="button" onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))} disabled={safeCurrentPage === totalPages} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Base Quota Pemerintah</h3>
                  <p className="text-xs text-slate-500 mt-1">Warga tetap 1 angka, sedangkan komersial warga dan komersial perusahaan dipecah per jenis kendaraan supaya quota dasarnya lebih informatif.</p>
                </div>
                <button type="button" onClick={handleCancelChange} className="rounded-full px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">×</button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Users className="h-4 w-4 text-slate-500" /> Base Quota Warga</div>
                  <p className="text-xs text-slate-500">1 angka untuk semua kendaraan di akun warga. Tidak dibedakan berdasarkan tipe kendaraan.</p>
                  <label className="space-y-1 text-xs font-semibold text-slate-700 max-w-xs">
                    <span className="block uppercase tracking-wider text-slate-500">Quota Warga</span>
                    <input type="number" min={0} step={10} value={draftBaseQuota.warga} onChange={(event) => setDraftBaseQuota((current) => ({ ...current, warga: Number(event.target.value) }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500" />
                  </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Building2 className="h-4 w-4 text-slate-500" /> Base Quota Komersial Warga</div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {COMMERCIAL_WARGA_VEHICLES.map((item) => (
                        <label key={item.vehicleType} className="space-y-1 text-xs font-semibold text-slate-700">
                          <span className="block text-[11px] uppercase tracking-wider text-slate-500">{item.label}</span>
                          <input type="number" min={0} step={10} value={draftBaseQuota.komersialWarga[item.vehicleType] ?? 0} onChange={(event) => setDraftBaseQuota((current) => ({ ...current, komersialWarga: { ...current.komersialWarga, [item.vehicleType]: Number(event.target.value) } }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500" />
                          
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Truck className="h-4 w-4 text-slate-500" /> Base Quota Komersial Perusahaan</div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {COMMERCIAL_PERUSAHAAN_VEHICLES.map((item) => (
                        <label key={item.vehicleType} className="space-y-1 text-xs font-semibold text-slate-700">
                          <span className="block text-[11px] uppercase tracking-wider text-slate-500">{item.label}</span>
                          <input type="number" min={0} step={10} value={draftBaseQuota.komersialPerusahaan[item.vehicleType] ?? 0} onChange={(event) => setDraftBaseQuota((current) => ({ ...current, komersialPerusahaan: { ...current.komersialPerusahaan, [item.vehicleType]: Number(event.target.value) } }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500" />
                          
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {!isConfirmationOpen ? (
                  <button type="button" onClick={handlePreviewChange} disabled={JSON.stringify(draftBaseQuota) === JSON.stringify(appliedBaseQuota)} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Ajukan Perubahan</button>
                ) : (
                  <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Konfirmasi Perubahan</p>
                    <p className="text-sm text-amber-900">Terapkan 3 base quota baru ini ke engine quota dan semua perhitungan final quota per transaksi?</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleConfirmChange} className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700">Konfirmasi dan Terapkan</button>
                      <button type="button" onClick={() => setIsConfirmationOpen(false)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Kembali</button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }
