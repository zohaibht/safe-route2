
import { AppState, AdminUser, Driver, Student } from './types';

const DB_KEY = 'saferoute360_db';

const initialData: AppState = {
  admins: [],
  drivers: [],
  students: []
};

export const repository = {
  getData: (): AppState => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : initialData;
  },

  saveData: (data: AppState) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },

  // Admin CRUD
  addAdmin: (admin: Omit<AdminUser, 'id'>) => {
    const data = repository.getData();
    const newAdmin = { ...admin, id: crypto.randomUUID() };
    data.admins.push(newAdmin);
    repository.saveData(data);
    return newAdmin;
  },

  // Driver CRUD
  addDriver: (driver: Omit<Driver, 'id' | 'role'>) => {
    const data = repository.getData();
    const newDriver: Driver = { ...driver, id: crypto.randomUUID(), role: 'DRIVER' };
    data.drivers.push(newDriver);
    repository.saveData(data);
    return newDriver;
  },

  // Student CRUD
  addStudent: (student: Omit<Student, 'id' | 'status'>) => {
    const data = repository.getData();
    const newStudent: Student = { ...student, id: crypto.randomUUID(), status: 'WAITING' };
    data.students.push(newStudent);
    repository.saveData(data);
    return newStudent;
  },

  getStudentsByDriver: (driverId: string) => {
    const data = repository.getData();
    return data.students.filter(s => s.driverId === driverId);
  },

  getDriverById: (driverId: string) => {
    const data = repository.getData();
    return data.drivers.find(d => d.id === driverId);
  }
};
