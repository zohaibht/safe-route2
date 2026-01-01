
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ParentHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white flex flex-col transition-colors">
      <header className="p-6 pt-12 flex justify-between items-center glass-panel z-10 sticky top-0 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">family_history</span>
          </div>
          <h1 className="text-xl font-bold">SafeRoute 360</h1>
        </div>
        <div className="w-10 h-10"></div> {/* Space for global buttons */}
      </header>

      <main className="flex-1 p-5 space-y-6 overflow-y-auto pb-24">
        {/* Status Card */}
        <div className="p-6 bg-white dark:bg-slate-800/40 rounded-[2rem] border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none"></div>
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Tracking
            </div>
            <h2 className="text-6xl font-extrabold tabular-nums tracking-tighter text-slate-900 dark:text-white">7:42<span className="text-2xl text-slate-400 align-top mt-2 inline-block ml-1">AM</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">Arriving in <span className="text-primary font-bold">4 mins</span></p>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
               <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">directions_bus</span> Bus #42</div>
               <div className="flex items-center gap-2">Home <span className="material-symbols-outlined text-sm text-primary">location_on</span></div>
             </div>
             <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
               <div className="h-full bg-primary shadow-glow" style={{ width: '85%' }}></div>
             </div>
             <p className="text-center text-[10px] font-bold text-slate-400">0.8 MILES AWAY</p>
          </div>
        </div>

        {/* Map Widget */}
        <div className="h-48 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 relative shadow-xl">
           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQn2vuNHbMPVeRgJBf4NZ4WNs-IexNMeXzG1i8GGjzrKZDFuhNYIUYAeo339ol_l2dH8zLA_GM1XNHAoHvFC5mQp-dR4vTu0N0O1WsQMCHC63o9NbnGC_eYk8_A-F8vuBuhpz8bkRn6IRnVfdn54AmR1JJeHpLSxqdBUTstSo8qjVnc3Kx7AxQGr-yK24frDiRAhO6WoAxuRAc8yjzSSdM0UIYmz0dlfSUbBpmDnZzDRn8AuVkc1gG4aLXGCqR--FvvSO7vBqjpGg" className="w-full h-full object-cover grayscale brightness-90 dark:brightness-50" alt="Map" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                 <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                 <div className="size-12 bg-primary rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-white">directions_bus</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Child Status */}
        <div 
          onClick={() => navigate('/attendance')}
          className="p-4 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors cursor-pointer shadow-sm"
        >
           <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold">L</div>
              <div>
                 <h3 className="text-sm font-bold">Leo's Status</h3>
                 <p className="text-xs text-slate-500">Waiting at stop</p>
              </div>
           </div>
           <div className="flex items-center gap-1 text-slate-400">
              <span className="text-xs font-bold">History</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
           <button onClick={() => navigate('/attendance')} className="bg-white dark:bg-white/5 h-14 rounded-2xl flex items-center justify-center gap-2 font-bold border border-slate-200 dark:border-white/5 text-slate-700 dark:text-white shadow-sm">
              <span className="material-symbols-outlined text-slate-400">history</span> View Full History
           </button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-background-dark/90 glass-panel border-t border-slate-200 dark:border-white/5 flex justify-around items-center px-6 pb-4 max-w-[450px] mx-auto z-20">
         <NavItem icon="map" label="Live Map" active />
         <NavItem icon="history" label="History" onClick={() => navigate('/attendance')} />
         <NavItem icon="settings" label="Settings" />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
     <span className="material-symbols-outlined text-2xl">{icon}</span>
     <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default ParentHome;
