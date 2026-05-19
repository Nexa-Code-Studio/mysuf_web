import RoleLoginForm from "@/components/auth/RoleLoginForm";

export default function GovernmentLoginPage() {
  return (
    <div className="flex w-full items-center justify-center py-12">
      <RoleLoginForm
        role="GOV_ADMIN"
        title="Login Admin Pemerintah"
        subtitle="Command center nasional untuk distribusi subsidi."
        helper="Gunakan dummy account untuk masuk."
        dummyAccount="gov.admin@mysuf.id / mysuf123"
      />
    </div>
  );
}
