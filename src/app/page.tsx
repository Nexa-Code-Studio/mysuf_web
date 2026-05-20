"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, BarChart3, Users, Building, Truck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoginModal } from "@/components/auth/LoginModal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Toast } from "@/components/ui/Toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const scrollRef = useScrollAnimation<HTMLDivElement>();

  const scrollToSection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFleetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsToastVisible(true);
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-white">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <Toast 
        message="Pengajuan Subsidi Fleet Berhasil Dikirim!" 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#e31837] text-white font-bold">
              My
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SuF</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#fitur" onClick={(e) => scrollToSection(e, 'fitur')} className="hover:text-[#e31837] transition">Fitur Utama</a>
            <a href="#ekosistem" onClick={(e) => scrollToSection(e, 'ekosistem')} className="hover:text-[#e31837] transition">Ekosistem</a>
            <a href="#warga" onClick={(e) => scrollToSection(e, 'warga')} className="hover:text-[#e31837] transition">Aplikasi Warga</a>
            <a href="#fleet" onClick={(e) => scrollToSection(e, 'fleet')} className="hover:text-[#e31837] transition">Untuk Bisnis</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sm font-semibold text-slate-700 hover:text-[#e31837] transition"
            >
              Masuk
            </button>
            <Button onClick={(e) => scrollToSection(e, 'fleet')} className="bg-[#e31837] hover:bg-[#c4142e] text-white hidden sm:flex">
              Ajukan Subsidi <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        {/* Background Image with fade to white at bottom */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/image/mysuf.png" 
            alt="SPBU Pertamina" 
            fill 
            className="object-cover object-[70%_center]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent lg:w-3/4" />
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in-right space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e31837]/20 bg-[#e31837]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#e31837]">
              <span className="h-2 w-2 rounded-full bg-[#e31837] animate-pulse" />
              Platform AI Subsidi Nasional
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
              Distribusi BBM Subsidi <span className="text-[#e31837] italic">Tepat Sasaran</span> dengan Teknologi AI
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl">
              MySuF memastikan energi bersubsidi sampai ke tangan yang berhak. Verifikasi Triple-Check AI mencegah kebocoran dan manipulasi secara real-time di seluruh Indonesia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={(e) => scrollToSection(e, 'fleet')} size="lg" className="bg-[#e31837] hover:bg-[#c4142e] text-white w-full sm:w-auto h-12 px-8 text-base">
                Ajukan Subsidi Fleet <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Notice for citizens */}
            <div className="mt-8 flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 max-w-xl">
              <Smartphone className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Untuk Warga Pengguna Pribadi</p>
                <p className="text-sm text-slate-600 mt-1">Cek kuota dan status pendaftaran subsidi Anda dengan mengunduh aplikasi mobile MySuF di App Store atau Google Play. Portal web ini didedikasikan untuk Admin, SPBU, dan Perusahaan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-slate-900 py-12 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e31837]/20 to-transparent opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 scroll-reveal">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800">
            <div className="text-center px-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedNumber value={40} /><span className="text-[#e31837]">%</span></p>
              <p className="text-sm text-slate-300">Pengurangan Kebocoran Subsidi</p>
              <p className="text-xs text-emerald-400 mt-1">↑ dibanding sistem konvensional</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedNumber value={128} /><span className="text-[#e31837]">+</span></p>
              <p className="text-sm text-slate-300">SPBU Aktif Terhubung</p>
              <p className="text-xs text-emerald-400 mt-1">↑ bertambah setiap bulan</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedNumber value={99} /><span className="text-[#e31837]">%</span></p>
              <p className="text-sm text-slate-300">Akurasi Deteksi Fraud</p>
              <p className="text-xs text-emerald-400 mt-1">✓ divalidasi independen</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedNumber value={2} /><span className="text-[#e31837]">s</span></p>
              <p className="text-sm text-slate-300">Rata-rata Waktu Verifikasi</p>
              <p className="text-xs text-emerald-400 mt-1">↓ dari 48 jam manual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama Section */}
      <section id="fitur" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
            <h2 className="text-[#e31837] font-semibold tracking-wider text-sm uppercase mb-3">— FITUR UTAMA</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Teknologi di Balik Ketepatan Distribusi Subsidi
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Triple-Check AI Verification",
                desc: "Sistem memvalidasi NIK, Nopol, dan biometrik dalam 2 detik untuk memastikan BBM disalurkan pada pengguna yang berhak."
              },
              {
                icon: BarChart3,
                title: "Dashboard Monitoring Real-time",
                desc: "Pantau kuota subsidi, anomali transaksi, dan stok nozzle secara live dari pusat komando."
              },
              {
                icon: Users,
                title: "Manajemen Kuota Dinamis",
                desc: "AI memprediksi dan menyesuaikan kuota bulanan berdasarkan profil demografi dan kebutuhan regional."
              }
            ].map((fitur, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition duration-300 scroll-reveal">
                <div className="w-12 h-12 rounded-xl bg-[#e31837]/10 flex items-center justify-center text-[#e31837] mb-6">
                  <fitur.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{fitur.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{fitur.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 max-w-4xl mx-auto scroll-reveal">
            <div className="rounded-2xl bg-slate-900 p-6 shadow-2xl border border-slate-800 backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <p className="text-xs font-bold tracking-widest text-slate-400">REAL-TIME MONITORING</p>
                <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  LIVE
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-3xl font-bold text-white"><AnimatedNumber value={1284} /></p>
                  <p className="text-xs text-slate-400 mt-1">Transaksi Hari Ini</p>
                  <p className="text-[10px] text-emerald-400 mt-1">↑ +12% vs kemarin</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white"><AnimatedNumber value={247} /></p>
                  <p className="text-xs text-slate-400 mt-1">Armada Aktif</p>
                  <p className="text-[10px] text-emerald-400 mt-1">↑ +8 armada baru</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white"><AnimatedNumber value={0} /></p>
                  <p className="text-xs text-slate-400 mt-1">Fraud Lolos</p>
                  <p className="text-[10px] text-emerald-400 mt-1">✓ 100% terdeteksi</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-medium text-slate-200">AI Triple-Check Aktif</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">✓ PASS</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center bg-slate-700 px-2 py-1 rounded text-xs font-mono text-slate-300 border border-slate-600">
                      B 1234 XY
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400">Status Kendaraan</span>
                      <span className="text-xs font-medium text-slate-200">PT Maju Logistik — Terverifikasi</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">✓ LULUS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ekosistem Section */}
      <section id="ekosistem" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-xl">
              <h2 className="text-[#e31837] font-semibold tracking-wider text-sm uppercase mb-3">— UNTUK SIAPA</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Satu Platform,<br/>Tiga Ekosistem
              </h3>
            </div>
            <p className="text-slate-600 max-w-sm text-right hidden md:block">
              Setiap peran mendapatkan akses dan kontrol yang disesuaikan dengan kewenangannya.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-slate-900 p-8 text-white relative overflow-hidden group scroll-reveal">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Building className="w-32 h-32" /></div>
               <div className="relative z-10">
                 <div className="inline-block px-3 py-1 rounded bg-white/10 text-xs font-bold mb-6">ADMIN SPBU</div>
                 <h4 className="text-2xl font-bold mb-4">Operasional SPBU Lebih Cerdas</h4>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                   Monitor transaksi harian, terima fraud alert instan, dan kelola operasional pom bensin Anda dari satu dashboard terpadu.
                 </p>
                 <ul className="space-y-3 mb-8">
                   <li className="flex items-center gap-2 text-sm text-slate-300"><Zap className="w-4 h-4 text-emerald-400"/> Monitoring transaksi real-time</li>
                   <li className="flex items-center gap-2 text-sm text-slate-300"><Zap className="w-4 h-4 text-emerald-400"/> Fraud alert & notifikasi instan</li>
                   <li className="flex items-center gap-2 text-sm text-slate-300"><Zap className="w-4 h-4 text-emerald-400"/> Laporan harian otomatis</li>
                 </ul>
                 <Link href="/login/spbu" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-400 transition">
                   Masuk sebagai SPBU →
                 </Link>
               </div>
            </div>

            <div className="rounded-3xl bg-[#e31837] p-8 text-white relative overflow-hidden group scroll-reveal" style={{ transitionDelay: "100ms" }}>
               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform"><ShieldCheck className="w-32 h-32" /></div>
               <div className="relative z-10">
                 <div className="inline-block px-3 py-1 rounded bg-white/20 text-xs font-bold mb-6">ADMIN PEMERINTAH</div>
                 <h4 className="text-2xl font-bold mb-4">Kendali Subsidi Nasional</h4>
                 <p className="text-white/80 text-sm mb-8 leading-relaxed">
                   Pantau distribusi BBM bersubsidi di seluruh Indonesia. Atur kuota, analisis heatmap, dan pastikan subsidi tepat sasaran.
                 </p>
                 <ul className="space-y-3 mb-8">
                   <li className="flex items-center gap-2 text-sm text-white/90"><Zap className="w-4 h-4 text-white"/> Heatmap distribusi nasional</li>
                   <li className="flex items-center gap-2 text-sm text-white/90"><Zap className="w-4 h-4 text-white"/> Kontrol kuota per wilayah/SPBU</li>
                   <li className="flex items-center gap-2 text-sm text-white/90"><Zap className="w-4 h-4 text-white"/> Ekspor laporan audit siap pakai</li>
                 </ul>
                 <Link href="/login/government" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/80 transition">
                   Masuk sebagai Pemerintah →
                 </Link>
               </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 p-8 relative overflow-hidden group scroll-reveal" style={{ transitionDelay: "200ms" }}>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Truck className="w-32 h-32 text-slate-900" /></div>
               <div className="relative z-10">
                 <div className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold mb-6">ADMIN PERUSAHAAN</div>
                 <h4 className="text-2xl font-bold text-slate-900 mb-4">Efisiensi Armada & Konsumsi</h4>
                 <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                   Daftarkan armada, kelola driver, dan optimalkan konsumsi BBM perusahaan Anda. Hemat biaya operasional dengan data berbasis AI.
                 </p>
                 <ul className="space-y-3 mb-8">
                   <li className="flex items-center gap-2 text-sm text-slate-700"><Zap className="w-4 h-4 text-[#e31837]"/> Manajemen armada multi-unit</li>
                   <li className="flex items-center gap-2 text-sm text-slate-700"><Zap className="w-4 h-4 text-[#e31837]"/> Tracking konsumsi per kendaraan</li>
                   <li className="flex items-center gap-2 text-sm text-slate-700"><Zap className="w-4 h-4 text-[#e31837]"/> Pengajuan subsidi terintegrasi</li>
                 </ul>
                 <Link href="/login/fleet" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#e31837] transition">
                   Masuk sebagai Perusahaan →
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aplikasi Warga Section */}
      <section id="warga" className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="scroll-reveal">
              <h2 className="text-[#e31837] font-semibold tracking-wider text-sm uppercase mb-3">— UNTUK WARGA</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Akses Subsidi Di Genggaman Anda
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-lg">
                Tidak perlu repot membawa kartu fisik. Unduh aplikasi MySuF untuk mendaftar profil subsidi pribadi Anda, memantau kuota harian, dan menghasilkan QR Code untuk pembayaran di SPBU.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                  <span className="text-slate-700">Daftar cukup dengan KTP & Nopol Kendaraan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                  <span className="text-slate-700">Scan QR Code atau e-KTP praktis di SPBU terdekat</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                  <span className="text-slate-700">Notifikasi kuota real-time tiap hari</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl px-6 py-3 hover:bg-slate-800 transition">
                  <span className="text-xl">🍏</span>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] leading-none">Download on the</span>
                    <span className="font-semibold leading-tight">App Store</span>
                  </div>
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl px-6 py-3 hover:bg-slate-800 transition">
                  <span className="text-xl">▶️</span>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] leading-none">GET IT ON</span>
                    <span className="font-semibold leading-tight">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="relative scroll-reveal" style={{ transitionDelay: "200ms" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#e31837]/20 to-blue-500/20 rounded-full blur-3xl opacity-50" />
              {/* Phone Mockup Container */}
              <div className="relative mx-auto w-[280px] h-[580px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 w-32 h-6 bg-slate-900 rounded-b-xl z-20" />
                <Image src="/image/mobile.png" alt="MySuF Mobile App" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Registration Form Section */}
      <section id="fleet" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl scroll-reveal">
              <h2 className="text-[#e31837] font-semibold tracking-wider text-sm uppercase mb-3">— MULAI SEKARANG</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Ajukan Subsidi Fleet Anda Hari Ini
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Punya armada komersial atau kendaraan perusahaan? Daftar sekarang agar supir Anda bisa menggunakan subsidi secara legal dan tercatat di sistem. Proses pengajuan cepat dan transparan.
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-[#e31837]/10 text-[#e31837] font-bold shrink-0">1</div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Isi Formulir Pengajuan</h5>
                    <p className="text-sm text-slate-500 mt-1">Data perusahaan, NIB/SIUP, dan estimasi jumlah armada komersial.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-[#e31837]/10 text-[#e31837] font-bold shrink-0">2</div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Verifikasi AI Otomatis</h5>
                    <p className="text-sm text-slate-500 mt-1">Sistem mencocokkan data NIB Anda dengan database nasional.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-[#e31837]/10 text-[#e31837] font-bold shrink-0">3</div>
                  <div>
                    <h5 className="font-semibold text-slate-900">Invite Driver & Mulai</h5>
                    <p className="text-sm text-slate-500 mt-1">Dapatkan akses dashboard, lalu invite perwakilan driver Anda melalui web.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 scroll-reveal" style={{ transitionDelay: "200ms" }}>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Formulir Fleet Awal</h4>
              <p className="text-sm text-slate-500 mb-8">Isi data perusahaan dan NIB Anda di bawah ini untuk memulai.</p>
              
              <form className="space-y-5" onSubmit={handleFleetSubmit}>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Nama Perusahaan</label>
                    <input type="text" placeholder="PT Maju Sejahtera" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e31837] focus:ring-1 focus:ring-[#e31837]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">NIB / SIUP</label>
                    <input type="text" placeholder="1234567890123" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e31837] focus:ring-1 focus:ring-[#e31837]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email Penanggung Jawab</label>
                  <input type="email" placeholder="direktur@perusahaan.co.id" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e31837] focus:ring-1 focus:ring-[#e31837]" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">No. Telepon</label>
                    <input type="text" placeholder="08xx-xxxx-xxxx" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e31837] focus:ring-1 focus:ring-[#e31837]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Estimasi Jumlah Armada</label>
                    <input type="number" required placeholder="Cth: 12" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#e31837] focus:ring-1 focus:ring-[#e31837]" />
                  </div>
                </div>
                <Button type="submit" className="w-full py-4 h-auto text-base bg-[#e31837] hover:bg-[#c4142e] text-white mt-4">
                  Kirim Pengajuan Subsidi Fleet <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-center text-[10px] text-slate-400 mt-4">Dengan mengirim form, Anda menyetujui syarat & ketentuan program subsidi Pertamina dan ESDM.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
               <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 mb-6 cursor-pointer w-fit">
                 <div className="flex h-8 w-8 items-center justify-center rounded bg-[#e31837] text-white font-bold">
                   My
                 </div>
                 <span className="text-xl font-bold tracking-tight text-white">SuF</span>
               </div>
               <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                 Platform AI untuk distribusi BBM bersubsidi yang tepat sasaran, transparan, dan berbasis data nyata.
               </p>
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#e31837] cursor-pointer transition">in</div>
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#e31837] cursor-pointer transition">tw</div>
               </div>
            </div>
            <div>
              <h6 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">UNTUK</h6>
              <ul className="space-y-3">
                <li><button onClick={() => setIsLoginModalOpen(true)} className="text-slate-400 hover:text-white text-sm transition">Admin SPBU</button></li>
                <li><button onClick={() => setIsLoginModalOpen(true)} className="text-slate-400 hover:text-white text-sm transition">Admin Perusahaan</button></li>
                <li><button onClick={() => setIsLoginModalOpen(true)} className="text-slate-400 hover:text-white text-sm transition">Admin Pemerintah</button></li>
              </ul>
            </div>
            <div>
              <h6 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">PERUSAHAAN</h6>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition">Tentang Kami</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition">Kebijakan Privasi</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition">Syarat & Ketentuan</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition">Kontak Bantuan</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 MySuF — Pertamina Group. Platform Subsidi Fuel Indonesia.
            </p>
            <div className="flex gap-6 text-sm">
              <span className="text-slate-400 flex items-center gap-1">✉ mail@suf.com</span>
              <span className="text-slate-400 flex items-center gap-1">📞 135</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
