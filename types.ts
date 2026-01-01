
export type UserRole = 'ADMIN' | 'DRIVER' | 'PARENT';

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  role: 'ADMIN';
}

export interface Driver {
  id: string;
  driverName: string;
  phoneNumber: string;
  vanNumberPlate: string;
  routeName: string;
  password?: string; // Simulated for login
  role: 'DRIVER';
}

export interface Student {
  id: string;
  studentName: string;
  classGrade: string;
  parentName: string;
  parentPhone: string;
  homeLocation: string; // Address or Lat/Lng string
  driverId: string; // Link to Driver
  status: 'WAITING' | 'ONBOARD' | 'ARRIVED' | 'ABSENT';
}

export interface AppState {
  admins: AdminUser[];
  drivers: Driver[];
  students: Student[];
}
