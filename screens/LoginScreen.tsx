
import React, { useState } from 'react';
import { UserRole } from '../types';
import { repository } from '../db';

interface LoginProps {
  role: UserRole;
  onLogin: (user: { id: string; role: UserRole; name: string }) => void;
  onBack: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ role, onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'ADMIN') {
      if (username === 'Admin' && password === '12345') {
        onLogin({ id: 'super-admin', role: 'ADMIN', name: 'Super Admin' });
        return;
      }
    } else if (role === 'DRIVER') {
      const db = repository.getData();
      // Check if driver name and plate number (as password) match any record
      const driver = db.drivers.find(d => d.driverName.toLowerCase() === username.toLowerCase() && d.vanNumberPlate === password);
      if (driver) {
        onLogin({ id: driver.id, role: 'DRIVER', name: driver.driverName });
        return;
      }
      setError('Driver not found or plate number mismatch');
      return;
    } else if (role === 'PARENT') {
      if (username === 'Parent' && password === '12345') {
        onLogin({ id: 'parent-1', role: 'PARENT', name: 'Emma Johnson' });
        return;
      }
    }

    setError('Invalid credentials for ' + role);
  };

  const getRoleTheme = () => {
    switch(role) {
      case 'ADMIN': return 'text-blue-500';
      case 'DRIVER': return 'text-emerald-500';
      case 'PARENT': return 'text-purple-500';
      default: return 'text-primary';
    }
  };

  const getUsernameLabel = () => {
    if (role === 'DRIVER') return 'Driver Name';
    if (role === 'PARENT') return 'Parent Username';
    return 'Admin Username';
  };

  const getPasswordLabel = () => {
    if (role === 'DRIVER') return 'Van Number Plate';
    return 'Password';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-xs mb-8 uppercase tracking-widest hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to roles
        </button>

        <div className="mb-10">
          <h2 className={`text-3xl font-black tracking-tighter mb-2 ${getRoleTheme()}`}>
            {role} Portal
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Please enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">{getUsernameLabel()}</label>
            <input
              type="text"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-primary text-slate-900 dark:text-white transition-all shadow-sm"
              placeholder={role === 'DRIVER' ? "e.g. Mr. Roberts" : "e.g. Admin"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">{getPasswordLabel()}</label>
            <input
              type="password"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-primary text-slate-900 dark:text-white transition-all shadow-sm"
              placeholder={role === 'DRIVER' ? "e.g. V-402" : "••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-xs font-bold animate-shake">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 dark:bg-primary hover:opacity-90 h-14 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Authenticate <span className="material-symbols-outlined">verified_user</span>
          </button>
        </form>

        <div className="mt-12 p-4 bg-slate-200/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Default Credentials</p>
          <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <p>Admin: <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">Admin / 12345</code></p>
            <p>Parent: <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">Parent / 12345</code></p>
            <p>Driver: Register a driver in Admin Portal first. (Login = Name / Plate #)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
