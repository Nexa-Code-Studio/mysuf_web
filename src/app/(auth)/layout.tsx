import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(227,24,55,0.12),_rgba(255,255,255,0))]" />
        {children}
      </div>
    </div>
  );
}
