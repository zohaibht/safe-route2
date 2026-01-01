
import React, { useState, useEffect } from 'react';
import { repository } from '../db';
import { AdminUser, Driver, Student, AppState } from '../types';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FLEET' | 'STUDENTS' | 'SYSTEM'>('FLEET');
  const [db, setDb] = useState<AppState>(repository.getData());
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const refreshDb = () => {
    setDb(repository.getData());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col transition-colors duration-300">
      <header className="p-6 pt-12 border-b border-slate-200 dark:border-white/5 glass-panel sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Portal</h1>
            <p className="text-xs font-medium text-slate-500">Fleet & Student Management</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all active:scale-90 ${showAddForm ? 'bg-slate-400' : 'bg-primary'}`}
          >
            <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
          </button>
        </div>
        
        <div className="flex bg-slate-200 dark:bg-slate-800/50 p-1 rounded-2xl gap-1">
          {(['FLEET', 'STUDENTS', 'SYSTEM'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setShowAddForm(false); refreshDb(); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24">
        {showAddForm ? (
          <AddEntityForm 
            type={activeTab} 
            drivers={db.drivers} 
            onSuccess={() => { setShowAddForm(false); refreshDb(); }} 
          />
        ) : (
          <div className="space-y-4">
            {activeTab === 'FLEET' && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                   <button onClick={() => navigate('/analytics')} className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary flex flex-col gap-2">
                      <span className="material-symbols-outlined">analytics</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Analytics</span>
                   </button>
                   <button onClick={() => navigate('/sos')} className="p-4 bg-alert-red/10 rounded-2xl border border-alert-red/20 text-alert-red flex flex-col gap-2">
                      <span className="material-symbols-outlined">sos</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">SOS Center</span>
                   </button>
                </div>
                {db.drivers.length === 0 ? (
                  <EmptyState icon="local_taxi" message="No drivers registered yet." />
                ) : db.drivers.map(driver => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </>
            )}
            {activeTab === 'STUDENTS' && (
              db.students.length === 0 ? (
                <EmptyState icon="school" message="No students registered yet." />
              ) : db.students.map(student => (
                <StudentCard key={student.id} student={student} driver={db.drivers.find(d => d.id === student.driverId)} />
              ))
            )}
            {activeTab === 'SYSTEM' && (
              <div className="space-y-4">
                <div className="p-6 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-white/5 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">account_tree</span>
                  <h3 className="font-bold mb-2">Hierarchy Management</h3>
                  <p className="text-xs text-slate-500">Configure sub-admins and region permissions.</p>
                  <button className="mt-4 px-6 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-xs font-bold">Manage Roles</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const AddEntityForm: React.FC<{ type: string; drivers: Driver[]; onSuccess: () => void }> = ({ type, drivers, onSuccess }) => {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'FLEET') {
      repository.addDriver({
        driverName: formData.driverName,
        phoneNumber: formData.phoneNumber,
        vanNumberPlate: formData.vanPlate,
        routeName: formData.route
      });
    } else if (type === 'STUDENTS') {
      repository.addStudent({
        studentName: formData.studentName,
        classGrade: formData.grade,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        homeLocation: formData.location,
        driverId: formData.driverId
      });
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Register New {type === 'FLEET' ? 'Driver' : 'Student'}</h2>
      {type === 'FLEET' ? (
        <>
          <InputField label="Driver Name" onChange={v => setFormData({ ...formData, driverName: v })} />
          <InputField label="Phone Number" onChange={v => setFormData({ ...formData, phoneNumber: v })} />
          <InputField label="Van Plate #" onChange={v => setFormData({ ...formData, vanPlate: v })} />
          <InputField label="Route Name" onChange={v => setFormData({ ...formData, route: v })} />
        </>
      ) : (
        <>
          <InputField label="Student Name" onChange={v => setFormData({ ...formData, studentName: v })} />
          <InputField label="Class / Grade" onChange={v => setFormData({ ...formData, grade: v })} />
          <InputField label="Parent Name" onChange={v => setFormData({ ...formData, parentName: v })} />
          <InputField label="Parent Phone" onChange={v => setFormData({ ...formData, parentPhone: v })} />
          <InputField label="Home Location" onChange={v => setFormData({ ...formData, location: v })} />
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Assign Driver</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-2 ring-primary transition-all"
              onChange={e => setFormData({ ...formData, driverId: e.target.value })}
              required
            >
              <option value="">Select a Driver</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.driverName} - {d.routeName}</option>)}
            </select>
          </div>
        </>
      )}
      <button className="w-full bg-primary h-14 rounded-2xl font-bold text-white shadow-lg shadow-primary/20 active:scale-95 transition-transform">Save Record</button>
    </form>
  );
};

const InputField: React.FC<{ label: string; onChange: (v: string) => void }> = ({ label, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">{label}</label>
    <input 
      required
      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 ring-primary transition-all"
      placeholder={`Enter ${label.toLowerCase()}...`}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const DriverCard: React.FC<{ driver: Driver }> = ({ driver }) => (
  <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 flex items-center gap-4 shadow-sm">
    <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
      <span className="material-symbols-outlined text-3xl">local_taxi</span>
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{driver.driverName}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{driver.vanNumberPlate} • {driver.routeName}</p>
    </div>
    <div className="text-right">
       <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">chevron_right</span>
    </div>
  </div>
);

const StudentCard: React.FC<{ student: Student; driver?: Driver }> = ({ student, driver }) => (
  <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 flex items-center gap-4 shadow-sm">
    <div className="size-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
      <span className="material-symbols-outlined text-3xl">school</span>
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{student.studentName}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Grade {student.classGrade} • {driver?.driverName || 'Unassigned'}</p>
    </div>
    <div className="bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-500 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
      {student.status}
    </div>
  </div>
);

const EmptyState: React.FC<{ icon: string; message: string }> = ({ icon, message }) => (
  <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-4">
    <div className="size-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
      <span className="material-symbols-outlined text-4xl">{icon}</span>
    </div>
    <p className="font-medium">{message}</p>
  </div>
);

export default AdminDashboard;
