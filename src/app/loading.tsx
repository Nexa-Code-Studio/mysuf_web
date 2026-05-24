export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm select-none">
      <div className="relative flex flex-col items-center animate-in fade-in duration-300">
        {/* Logo and Spinner Container */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pertamina-red border-r-pertamina-red/30 border-l-pertamina-red/30 animate-spin" />
          
          {/* Inner pulsing logo */}
          <div className="flex items-center gap-1 animate-pulse">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-pertamina-red text-white font-bold text-sm shadow">
              My
            </div>
          </div>
        </div>
        
        {/* Text */}
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Memuat Modul...</h3>
        <p className="text-sm font-medium text-slate-500 mt-2">Menyiapkan data operasional realtime</p>
        
        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-pertamina-red rounded-full animate-[loading_1.5s_ease-in-out_infinite]" 
               style={{ width: '40%', transformOrigin: 'left' }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
}
