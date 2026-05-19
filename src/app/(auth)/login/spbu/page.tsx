import RoleLoginForm from "@/components/auth/RoleLoginForm";

export default function SpbuLoginPage() {
  return (
    <div className="flex w-full items-center justify-center py-12">
      <RoleLoginForm
        role="SPBU_ADMIN"
        title="Login Admin SPBU"
        subtitle="Akses operasional harian SPBU dan fraud monitoring."
        helper="Gunakan dummy account untuk masuk."
        dummyAccount="spbu.admin@mysuf.id / mysuf123"
      />
    </div>
  );
}
