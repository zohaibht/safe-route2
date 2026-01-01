
import React from 'react';
import { UserRole } from '../types';

interface Props {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelectionScreen: React.FC<Props> = ({ onSelectRole }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="mb-12 text-center">
        <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
          <span className="material-symbols-outlined text-5xl text-white">shield_person</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">SafeRoute 360</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Select your access portal</p>
      </div>

      <div className="w-full space-y-4 max-w-sm">
        <RoleCard 
          icon="admin_panel_settings" 
          title="Administrator" 
          desc="Manage fleet, students & staff" 
          color="bg-blue-600"
          onClick={() => onSelectRole('ADMIN')}
        />
        <RoleCard 
          icon="directions_bus" 
          title="Driver Portal" 
          desc="Route tracking & attendance" 
          color="bg-emerald-600"
          onClick={() => onSelectRole('DRIVER')}
        />
        <RoleCard 
          icon="family_history" 
          title="Parent App" 
          desc="Live tracking & notifications" 
          color="bg-purple-600"
          onClick={() => onSelectRole('PARENT')}
        />
      </div>

      <p className="mt-12 text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest text-center">
        Credential-based access required for all modules
      </p>
    </div>
  );
};

const RoleCard: React.FC<{ icon: string; title: string; desc: string; color: string; onClick: () => void }> = ({ icon, title, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center gap-5 transition-all hover:scale-[1.02] active:scale-95 text-left shadow-sm dark:shadow-none hover:shadow-xl group"
  >
    <div className={`size-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
    <span className="material-symbols-outlined ml-auto text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
  </button>
);

export default RoleSelectionScreen;
