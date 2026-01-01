
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceLog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      <header className="p-6 pt-12 glass-panel border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="size-10 bg-slate-800 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Attendance Log</h1>
        <button className="size-10 bg-slate-800 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">calendar_month</span>
        </button>
      </header>

      <main className="flex-1 p-5 space-y-8 overflow-y-auto pb-10">
        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
           <div className="relative">
              <img src="https://picsum.photos/seed/leo/100" className="size-16 rounded-full border-2 border-primary" alt="leo" />
              <div className="absolute bottom-0 right-0 size-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] font-bold">check</span>
              </div>
           </div>
           <div>
              <h2 className="text-xl font-bold">Leo M.</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold">GRADE 2</span>
                 <span className="text-slate-400 text-xs">Bus #42</span>
              </div>
           </div>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              Today <span className="text-slate-500 font-medium text-xs">Wed, Oct 24</span>
           </h3>
           <div className="relative pl-10 space-y-12">
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-700"></div>

              <TimelineItem 
                icon="home_pin" 
                title="Arrived Home" 
                time="3:45 PM" 
                location="123 Maple Street, Springfield" 
                status="Safe"
                active
              />
              <TimelineItem 
                icon="route" 
                title="Bus Route Progress" 
                time="Tracking active" 
                location="Passing Main St Bridge"
                inactive
              />
              <TimelineItem 
                icon="directions_bus" 
                title="Boarded Bus #42" 
                time="7:30 AM" 
                location="123 Maple Street (Home Stop)" 
              />
           </div>
        </div>

        <div className="opacity-50">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              Yesterday <span className="text-slate-500 font-medium text-xs">Tue, Oct 23</span>
           </h3>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <span className="material-symbols-outlined text-slate-500">history</span>
                 <span className="font-bold text-sm">View full history for Oct 23</span>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
           </div>
        </div>
      </main>
    </div>
  );
};

const TimelineItem: React.FC<{ 
  icon: string; 
  title: string; 
  time: string; 
  location: string; 
  status?: string; 
  active?: boolean;
  inactive?: boolean;
}> = ({ icon, title, time, location, status, active, inactive }) => (
  <div className={`relative ${inactive ? 'opacity-60' : ''}`}>
    <div className={`absolute -left-10 size-10 rounded-full flex items-center justify-center ring-4 ring-background-dark z-10 ${active ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
       <span className="material-symbols-outlined text-lg">{icon}</span>
    </div>
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
       <div className="flex justify-between items-start">
          <h4 className="font-bold">{title}</h4>
          {status && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-500/20">{status}</span>}
       </div>
       <p className="text-xs text-slate-400">{time}</p>
       <div className="flex items-center gap-2 mt-2 text-slate-500">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <p className="text-[11px] font-medium">{location}</p>
       </div>
    </div>
  </div>
);

export default AttendanceLog;
