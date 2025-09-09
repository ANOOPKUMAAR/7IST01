export interface Subject {
  id: string;
  name: string;
  expectedCheckIn: string;
  expectedCheckOut: string;
  totalClasses: number;
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
