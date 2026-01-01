
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 200 },
  { name: 'Fri', value: 278 },
  { name: 'Sat', value: 189 },
  { name: 'Sun', value: 239 },
];

const PerformanceAnalytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      <header className="p-6 pt-12 glass-panel flex items-center justify-between sticky top-0 z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="size-10 bg-slate-800 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></button>
        <h1 className="text-lg font-bold">Fuel Efficiency</h1>
        <button className="size-10 bg-slate-800 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">filter_list</span></button>
      </header>

      <main className="flex-1 p-5 space-y-6 overflow-y-auto pb-10">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
           <div className="px-4 py-2 bg-primary rounded-full font-bold text-sm whitespace-nowrap">This Week</div>
           <div className="px-4 py-2 bg-slate-800 rounded-full font-bold text-sm text-slate-400 whitespace-nowrap">Last Month</div>
           <div className="px-4 py-2 bg-slate-800 rounded-full font-bold text-sm text-slate-400 whitespace-nowrap">Route 66</div>
        </div>

        <div className="grid grid-cols-1 gap-4">
           <MetricCard label="Avg Efficiency" value="8.4" unit="MPG" change="+2.1%" icon="local_gas_station" />
           <MetricCard label="Total Fuel Cost" value="$4,203" change="-5.0%" icon="payments" color="text-emerald-400" />
        </div>

        <div className="p-6 bg-slate-800/40 rounded-[2rem] border border-white/10">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Fleet Fuel Usage</p>
                 <p className="text-3xl font-extrabold tracking-tight">1,240 <span className="text-lg text-slate-500">Gallons</span></p>
              </div>
              <div className="flex bg-slate-900 p-1 rounded-lg gap-1 border border-white/5">
                 <div className="px-3 py-1 bg-slate-700 rounded-md text-[10px] font-bold">W</div>
                 <div className="px-3 py-1 text-[10px] font-bold text-slate-500">M</div>
                 <div className="px-3 py-1 text-[10px] font-bold text-slate-500">Y</div>
              </div>
           </div>

           <div className="h-40 w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                 <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#1973f0" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#1973f0" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                 <Area type="monotone" dataKey="value" stroke="#1973f0" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-lg font-bold">Attention Needed</h3>
           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="size-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"><span className="material-symbols-outlined">warning</span></div>
                 <div>
                    <h4 className="font-bold">High Idling Detected</h4>
                    <p className="text-xs text-slate-500">3 Buses exceeded 20min idle time</p>
                 </div>
              </div>
              <span className="material-symbols-outlined text-slate-600">chevron_right</span>
           </div>
        </div>
      </main>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; unit?: string; change: string; icon: string; color?: string }> = ({ label, value, unit, change, icon, color = 'text-primary' }) => (
  <div className="p-5 bg-slate-800/40 rounded-[2rem] border border-white/5 relative overflow-hidden">
     <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-5xl">{icon}</span></div>
     <p className="text-slate-500 font-bold uppercase text-[10px] mb-1">{label}</p>
     <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold">{value}</span>
        {unit && <span className="text-slate-500 font-medium">{unit}</span>}
     </div>
     <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
        <span className="material-symbols-outlined text-xs">trending_up</span> {change}
     </div>
  </div>
);

export default PerformanceAnalytics;
