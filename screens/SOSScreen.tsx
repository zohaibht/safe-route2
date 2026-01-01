
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SOSScreen: React.FC = () => {
  const navigate = useNavigate();
  const [holding, setHolding] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-900/10 blur-[120px] pointer-events-none"></div>

      <header className="p-6 pt-12 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)} className="size-10 bg-slate-900 rounded-full flex items-center justify-center border border-white/5">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold">Emergency Assistance</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-5 flex flex-col items-center justify-center space-y-12">
        <div className="w-full bg-slate-900/60 p-4 rounded-3xl border border-white/10 glass-panel">
           <div className="h-28 rounded-2xl overflow-hidden relative mb-4 opacity-50 grayscale brightness-50">
              <img src="https://picsum.photos/seed/map-emergency/400/200" className="w-full h-full object-cover" alt="Map" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="size-4 bg-alert-red rounded-full animate-ping"></div>
              </div>
           </div>
           <div className="flex justify-between items-center px-1">
              <div>
                 <div className="flex items-center gap-1.5 text-primary uppercase font-bold text-[10px] mb-1">
                    <span className="material-symbols-outlined text-sm">near_me</span> Current Location
                 </div>
                 <p className="text-sm font-bold">124 Main St, Springfield, IL</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[9px]">
                 <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
              </div>
           </div>
        </div>

        <div className="text-center">
           <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">Press and hold for 3 seconds</h2>
           <div className="relative group cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-alert-red/10 animate-[ping_2s_infinite]"></div>
              <div className="absolute -inset-8 border border-alert-red/10 rounded-full scale-125"></div>
              
              <button 
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                className={`relative size-52 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-glow-red border-[6px] border-red-400/50 flex flex-col items-center justify-center transition-transform active:scale-95 z-20 overflow-hidden`}
              >
                <div className={`absolute bottom-0 left-0 w-full bg-black/30 transition-all duration-[3000ms] ${holding ? 'h-full' : 'h-0'}`}></div>
                <span className="material-symbols-outlined text-[80px] drop-shadow-lg z-10">sos</span>
                <span className="text-2xl font-black tracking-widest z-10 drop-shadow-lg">ALERT</span>
              </button>
           </div>
           <button className="mt-12 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Test Alarm Mode</button>
        </div>
      </main>

      <footer className="p-6 pt-12 space-y-4">
         <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-1">Select Emergency Type</p>
         <div className="grid grid-cols-3 gap-3">
            <EmergencyType icon="car_repair" label="Breakdown" />
            <EmergencyType icon="car_crash" label="Accident" />
            <EmergencyType icon="cardiology" label="Medical" />
         </div>
      </main>
    </div>
  );
};

const EmergencyType: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="h-28 rounded-3xl bg-slate-900 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
     <span className="material-symbols-outlined text-slate-500 text-3xl">{icon}</span>
     <span className="text-[10px] font-bold uppercase text-slate-500">{label}</span>
  </button>
);

export default SOSScreen;
