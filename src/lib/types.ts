
export interface Subject {
  id: string;
  name: string;
  expectedCheckIn: string;
  expectedCheckOut: string;
  totalClasses: number;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  isAnomaly: boolean;
  anomalyReason: string;
}

export interface WifiZone {
  id: string;
  ssid: string;
}

export interface ActiveCheckIn {
  subjectId: string;
  checkInTime: string;
}

export interface UserDetails {
  name: string;
  rollNo: string;
  program: string;
  branch: string;
  department: string;
  section: string;
  phone: string;
  parentName: string;
  address: string;
}

export interface Student {
    id: string;
    name: string;
    rollNo: string;
}

export interface Class {
    id: string;
    name: string;
    coordinator: string;
    students?: Student[];
    day: string;
    startTime: string;
    endTime: string;
    faculties?: string[];
}

export interface Department {
    id: string;
    name: string;
    hod: string;
    classes: Class[];
}

export interface Program {
    id: string;
    name: string;
    description: string;
    departments: Department[];
}

export interface School {
    id: string;
    name: string;
}

export type UserMode = 'student' | 'faculty' | 'admin';
