import RoleLoginForm from "@/components/auth/RoleLoginForm";

export default function FleetLoginPage() {
  return (
    <div className="flex w-full items-center justify-center py-12">
      <RoleLoginForm
        role="COMPANY_ADMIN"
        title="Login Admin Perusahaan"
        subtitle="Kelola armada, driver, dan konsumsi BBM perusahaan."
        helper="Gunakan dummy account untuk masuk."
        dummyAccount="fleet.admin@mysuf.id / mysuf123"
      />
    </div>
  );
}
