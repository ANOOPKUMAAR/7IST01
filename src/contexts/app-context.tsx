
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  Subject,
  AttendanceRecord,
  WifiZone,
  ActiveCheckIn,
} from "@/lib/types";
import { checkAttendanceAnomaly } from "@/actions/attendance-actions";

interface AppContextType {
  subjects: Subject[];
  attendance: Record<string, AttendanceRecord[]>;
  wifiZones: WifiZone[];
  adminMode: boolean;
  adminCode: string;
  activeCheckIn: ActiveCheckIn | null;
  isLoaded: boolean;
  addSubject: (subject: Omit<Subject, "id">) => void;
  bulkAddSubjects: (newSubjects: Omit<Subject, 'id'>[]) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  addWifiZone: (ssid: string) => void;
  deleteWifiZone: (zoneId: string) => void;
  setAdminMode: (isAdmin: boolean) => void;
  updateAdminCode: (code: string) => boolean;
  checkIn: (subjectId: string) => void;
  checkOut: (subjectId: string) => Promise<void>;
  addManualEntry: (subjectId: string, entry: Omit<AttendanceRecord, "id" | 'isAnomaly' | 'anomalyReason' >) => void;
  deleteAttendanceRecord: (subjectId: string, recordId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialSubjects: Subject[] = [
    { id: 'cs101', name: 'Intro to Computer Science', expectedCheckIn: '09:00', expectedCheckOut: '10:30', totalClasses: 20, dayOfWeek: 1 },
    { id: 'ma201', name: 'Calculus II', expectedCheckIn: '11:00', expectedCheckOut: '12:30', totalClasses: 24, dayOfWeek: 2 },
    { id: 'py101', name: 'Physics I', expectedCheckIn: '09:00', expectedCheckOut: '10:30', totalClasses: 20, dayOfWeek: 3 },
    { id: 'ch101', name: 'Chemistry I', expectedCheckIn: '11:00', expectedCheckOut: '12:30', totalClasses: 24, dayOfWeek: 4 },
    { id: 'en101', name: 'English 101', expectedCheckIn: '13:00', expectedCheckOut: '14:30', totalClasses: 20, dayOfWeek: 5 },
];

const initialWifiZones: WifiZone[] = [
    { id: 'wifi1', ssid: 'Campus-WiFi' },
];


export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord[]>>({});
  const [wifiZones, setWifiZones] = useState<WifiZone[]>([]);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [adminCode, setAdminCode] = useState<string>("1234");
  const [activeCheckIn, setActiveCheckIn] = useState<ActiveCheckIn | null>(null);

  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem("witrack_subjects");
      const storedAttendance = localStorage.getItem("witrack_attendance");
      const storedWifiZones = localStorage.getItem("witrack_wifiZones");
      const storedAdminCode = localStorage.getItem("witrack_adminCode");
      const storedActiveCheckIn = localStorage.getItem("witrack_activeCheckIn");

      setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjects);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : {});
      setWifiZones(storedWifiZones ? JSON.parse(storedWifiZones) : initialWifiZones);
      setAdminCode(storedAdminCode || "1234");
      setActiveCheckIn(storedActiveCheckIn ? JSON.parse(storedActiveCheckIn) : null);
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setSubjects(initialSubjects);
      setWifiZones(initialWifiZones);
    }
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("witrack_subjects", JSON.stringify(subjects));
      localStorage.setItem("witrack_attendance", JSON.stringify(attendance));
      localStorage.setItem("witrack_wifiZones", JSON.stringify(wifiZones));
      localStorage.setItem("witrack_adminCode", adminCode);
      localStorage.setItem("witrack_activeCheckIn", JSON.stringify(activeCheckIn));
    }
  }, [subjects, attendance, wifiZones, adminCode, activeCheckIn, isLoaded]);

  const addSubject = (subject: Omit<Subject, "id">) => {
    const newSubject = { ...subject, id: `subj_${Date.now()}` };
    setSubjects((prev) => [...prev, newSubject]);
    toast({ title: "Subject Added", description: `${subject.name} has been added.` });
  };

  const bulkAddSubjects = (newSubjects: Omit<Subject, 'id'>[]) => {
    const subjectsToAdd = newSubjects.map(s => ({ ...s, id: `subj_${Date.now()}_${Math.random()}` }));
    setSubjects(prev => [...prev, ...subjectsToAdd]);
    toast({ title: "Subjects Imported", description: `${subjectsToAdd.length} new subjects have been added from the file.` });
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));
    toast({ title: "Subject Updated", description: `${updatedSubject.name} has been updated.` });
  };
  
  const deleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setAttendance(prev => {
        const newAttendance = {...prev};
        delete newAttendance[subjectId];
        return newAttendance;
    });
    toast({ title: "Subject Deleted", variant: "destructive" });
  };

  const addWifiZone = (ssid: string) => {
    if (wifiZones.some(zone => zone.ssid.toLowerCase() === ssid.toLowerCase())) {
        toast({ title: "Duplicate Wi-Fi Zone", description: "This SSID already exists.", variant: "destructive" });
        return;
    }
    const newZone = { id: `wifi_${Date.now()}`, ssid };
    setWifiZones(prev => [...prev, newZone]);
    toast({ title: "Wi-Fi Zone Added", description: `${ssid} has been added.` });
  };

  const deleteWifiZone = (zoneId: string) => {
    setWifiZones(prev => prev.filter(z => z.id !== zoneId));
    toast({ title: "Wi-Fi Zone Removed", variant: "destructive" });
  };

  const updateAdminCode = (code: string) => {
    if (/^\d{4}$/.test(code)) {
        setAdminCode(code);
        toast({ title: "Admin Code Updated", description: "Your security code has been changed." });
        return true;
    }
    toast({ title: "Invalid Code", description: "Admin code must be 4 digits.", variant: "destructive" });
    return false;
  };

  const checkIn = (subjectId: string) => {
    if (activeCheckIn) {
      toast({ title: "Already Checked In", description: "You must check out from your current session first.", variant: "destructive" });
      return;
    }
    const newActiveCheckIn = { subjectId, checkInTime: new Date().toISOString() };
    setActiveCheckIn(newActiveCheckIn);
    const subject = subjects.find(s => s.id === subjectId);
    toast({ title: "Checked In", description: `You have checked in for ${subject?.name}.` });
  };

  const checkOut = async (subjectId: string) => {
    if (!activeCheckIn || activeCheckIn.subjectId !== subjectId) {
      toast({ title: "Check-out Failed", description: "You are not checked in for this subject.", variant: "destructive" });
      return;
    }
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
  
    const checkOutTime = new Date().toISOString();
    const newRecord: Omit<AttendanceRecord, 'isAnomaly' | 'anomalyReason'> = {
      id: `att_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      checkIn: activeCheckIn.checkInTime,
      checkOut: checkOutTime,
    };
  
    const anomalyResult = await checkAttendanceAnomaly({
        checkInTime: newRecord.checkIn,
        checkOutTime: newRecord.checkOut!,
        subject: subject,
        history: attendance[subjectId] || [],
    });

    const finalRecord = { ...newRecord, ...anomalyResult };
  
    setAttendance(prev => ({
      ...prev,
      [subjectId]: [...(prev[subjectId] || []), finalRecord],
    }));
  
    setActiveCheckIn(null);
    toast({ title: "Checked Out", description: `You have checked out from ${subject.name}.` });
    if(finalRecord.isAnomaly){
        toast({ title: "Attendance Anomaly Detected", description: finalRecord.anomalyReason, variant: "destructive" });
    }
  };

  const addManualEntry = (subjectId: string, entry: Omit<AttendanceRecord, "id" | 'isAnomaly' | 'anomalyReason'>) => {
    const newRecord: AttendanceRecord = {
        ...entry,
        id: `att_manual_${Date.now()}`,
        isAnomaly: false,
        anomalyReason: "Manual Entry",
    };
    setAttendance(prev => ({
        ...prev,
        [subjectId]: [...(prev[subjectId] || []), newRecord].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }));
    toast({ title: "Manual Entry Added" });
  };

  const deleteAttendanceRecord = (subjectId: string, recordId: string) => {
    setAttendance(prev => ({
        ...prev,
        [subjectId]: prev[subjectId].filter(rec => rec.id !== recordId),
    }));
    toast({ title: "Record Deleted", variant: "destructive" });
  };

  const value = {
    subjects,
    attendance,
    wifiZones,
    adminMode,
    adminCode,
    activeCheckIn,
    isLoaded,
    addSubject,
    bulkAddSubjects,
    updateSubject,
    deleteSubject,
    addWifiZone,
    deleteWifiZone,
    setAdminMode,
    updateAdminCode,
    checkIn,
    checkOut,
    addManualEntry,
    deleteAttendanceRecord,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
