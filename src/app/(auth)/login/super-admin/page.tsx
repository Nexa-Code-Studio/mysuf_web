import RoleLoginForm from "@/components/auth/RoleLoginForm";

export default function SuperAdminLoginPage() {
  return (
    <div className="flex w-full items-center justify-center py-12">
      <RoleLoginForm
        role="SUPER_ADMIN"
        title="Login Super Admin"
        subtitle="Akses penuh ke kontrol pengguna dan konfigurasi sistem." 
        helper="Gunakan dummy account untuk masuk."
        dummyAccount="super.admin@mysuf.id / mysuf123"
      />
    </div>
  );
}
