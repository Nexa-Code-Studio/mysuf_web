import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import AuthFetchInterceptor from "@/components/auth/AuthFetchInterceptor";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MySuF Dashboard",
  description: "Multi-role dashboard for national fuel distribution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-slate-900">
        <AuthFetchInterceptor />
        {children}
      </body>
    </html>
  );
}
