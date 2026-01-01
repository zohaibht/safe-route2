
import React, { useState, useEffect } from 'react';
import { repository } from '../db';
import { Student, Driver } from '../types';
import { useNavigate } from 'react-router-dom';

const DriverHome: React.FC<{ user: { id: string } }> = ({ user }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [driver, setDriver] = useState<Driver | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic data loading simulation
    const data = repository.getData();
    // For simulation, if no specific driver id found, show mock data
    const foundDriver = repository.getDriverById(user.id);
    setDriver(foundDriver || { id: 'd1', driverName: 'Mr. Roberts', phoneNumber: '555-0199', vanNumberPlate: 'V-402', routeName: 'Morning Run - North', role: 'DRIVER' });
    setStudents(repository.getStudentsByDriver(user.id).length ? repository.getStudentsByDriver(user.id) : [
      { id: 's1', studentName: 'Leo M.', classGrade: '2', parentName: 'Emma', parentPhone: '555-123', homeLocation: 'Maple Ave', driverId: user.id, status: 'WAITING' },
      { id: 's2', studentName: 'Sarah K.', classGrade: '4', parentName: 'John', parentPhone: '555-456', homeLocation: 'Oak St', driverId: user.id, status: 'ONBOARD' }
    ]);
  }, [user.id]);

  const onboardCount = students.filter(s => s.status === 'ONBOARD').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white flex flex-col transition-colors">
      <header className="p-6 pt-12 pb-4 glass-panel sticky top-0 z-20 flex justify-between items-center border-b border-slate-200 dark:border-white/5">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Active Duty</p>
          <h1 className="text-xl font-bold">{driver?.routeName}</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-5 space-y-6 overflow-y-auto pb-32">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqUiArioVWYU0bs2w6oZPZ1uANd4W6z33trlcS2TQeJZiMclNj0qwH4o2CsGsV8v9CDlQ6EnaQfVOktwiMMZSayqiINVPsdhZlgx1mbZnKyURfZoDBvQ--VcjG8R6sds8smri9LUu1kR-loLNU2Af_dgrvI5cZmjMm47MZhNod8lmHqd9nLlTfZL-X-ljcCQsVEXc_GpnxzjS5td1wKqwx6YKnwICjtS5qYnkax9mzxCsGmvKRUprePk9DC25cWq2W-EYPW3WNktU" className="w-full h-full object-cover grayscale brightness-90 dark:brightness-50 contrast-125" alt="Map" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-background-dark to-transparent opacity-60"></div>
           <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-bold">NEXT: {students.find(s => s.status === 'WAITING')?.homeLocation || 'Complete'}</span>
           </div>
        </div>

        <div className="px-1 space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-extrabold">{onboardCount}<span className="text-slate-400 text-lg"> / {students.length}</span></p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Students Picked Up</p>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(onboardCount / (students.length || 1)) * 100}%` }}></div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold mb-4 px-1">Pickup Roster</h3>
          <div className="grid grid-cols-2 gap-4">
            {students.map(s => <StudentRosterCard key={s.id} student={s} />)}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-50 dark:from-background-dark via-slate-50 dark:via-background-dark to-transparent pt-12 max-w-[450px] mx-auto z-30">
        <button className="w-full bg-primary h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-glow text-white">
          Depart Current Stop <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

const StudentRosterCard: React.FC<{ student: Student }> = ({ student }) => (
  <div className={`p-4 rounded-3xl flex flex-col gap-3 relative transition-all border ${student.status === 'ONBOARD' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none'}`}>
    {student.status === 'ONBOARD' && (
      <div className="absolute top-3 right-3 size-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
        <span className="material-symbols-outlined text-sm font-bold">check</span>
      </div>
    )}
    <div className="size-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto overflow-hidden border-2 border-white/20">
      <img src={`https://picsum.photos/seed/${student.id}/100`} alt="student" />
    </div>
    <div className="text-center">
      <h4 className="font-bold text-base">{student.studentName}</h4>
      <p className={`text-[10px] font-extrabold uppercase mt-1 ${student.status === 'ONBOARD' ? 'text-emerald-500' : 'text-slate-400'}`}>
        {student.status === 'ONBOARD' ? 'Picked Up' : `Grade ${student.classGrade}`}
      </p>
    </div>
  </div>
);

export default DriverHome;
