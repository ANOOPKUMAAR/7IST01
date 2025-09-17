
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  Subject,
  AttendanceRecord,
  WifiZone,
  ActiveCheckIn,
  UserDetails,
} from "@/lib/types";
import { checkAttendanceAnomaly } from "@/actions/attendance-actions";

type UserMode = 'student' | 'faculty';

interface AppContextType {
  subjects: Subject[];
  attendance: Record<string, AttendanceRecord[]>;
  wifiZones: WifiZone[];
  activeCheckIn: ActiveCheckIn | null;
  userDetails: UserDetails;
  isLoaded: boolean;
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  addSubject: (subject: Omit<Subject, "id">) => void;
  bulkAddSubjects: (newSubjects: Omit<Subject, 'id'>[]) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  addWifiZone: (ssid: string) => void;
  deleteWifiZone: (zoneId: string) => void;
  checkIn: (subjectId: string) => void;
  checkOut: (subjectId: string) => Promise<void>;
  deleteAttendanceRecord: (subjectId: string, recordId: string) => void;
  updateUserDetails: (details: UserDetails) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialSubjects: Subject[] = [
    { id: 'cs101', name: 'Intro to CS', expectedCheckIn: '09:00', expectedCheckOut: '10:30', totalClasses: 20, dayOfWeek: 1 },
    { id: 'ma201', name: 'Calculus II', expectedCheckIn: '11:00', expectedCheckOut: '12:30', totalClasses: 24, dayOfWeek: 2 },
];

const generateInitialAttendance = (): Record<string, AttendanceRecord[]> => { return {} };

const initialWifiZones: WifiZone[] = [
    { id: 'wifi1', ssid: 'Campus-WiFi' },
];

const initialUserDetails: UserDetails = {
    name: "Alex Doe",
    rollNo: "20221IST0001",
    program: "Bachelor of Technology",
    branch: "Computer Science",
    department: "Engineering",
    section: "A",
    phone: "+1 (123) 456-7890",
    parentName: "John Doe",
    address: "123 University Lane, Tech City, 12345",
};


export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord[]>>({});
  const [wifiZones, setWifiZones] = useState<WifiZone[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<ActiveCheckIn | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>(initialUserDetails);
  const [mode, setModeState] = useState<UserMode>('student');
  
  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem("witrack_subjects");
      const storedAttendance = localStorage.getItem("witrack_attendance");
      const storedWifiZones = localStorage.getItem("witrack_wifiZones");
      const storedActiveCheckIn = localStorage.getItem("witrack_activeCheckIn");
      const storedUserDetails = localStorage.getItem("witrack_userDetails");
      const storedMode = localStorage.getItem("witrack_mode");
      
      setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjects);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : generateInitialAttendance());
      setWifiZones(storedWifiZones ? JSON.parse(storedWifiZones) : initialWifiZones);
      setActiveCheckIn(storedActiveCheckIn ? JSON.parse(storedActiveCheckIn) : null);
      setUserDetails(storedUserDetails ? JSON.parse(storedUserDetails) : initialUserDetails);
      setModeState(storedMode ? JSON.parse(storedMode) : 'student');
      
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // If loading fails, set default data to prevent crash
      setSubjects(initialSubjects);
      setAttendance(generateInitialAttendance());
      setWifiZones(initialWifiZones);
      setActiveCheckIn(null);
      setUserDetails(initialUserDetails);
      setModeState('student');
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("witrack_subjects", JSON.stringify(subjects));
        localStorage.setItem("witrack_attendance", JSON.stringify(attendance));
        localStorage.setItem("witrack_wifiZones", JSON.stringify(wifiZones));
        localStorage.setItem("witrack_activeCheckIn", JSON.stringify(activeCheckIn));
        localStorage.setItem("witrack_userDetails", JSON.stringify(userDetails));
        localStorage.setItem("witrack_mode", JSON.stringify(mode));
      } catch (error) {
          console.error("Failed to save data to localStorage", error);
      }
    }
  }, [subjects, attendance, wifiZones, activeCheckIn, userDetails, mode, isLoaded]);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    toast({ title: `Switched to ${newMode === 'faculty' ? 'Faculty' : 'Student'} Mode`});
  }

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

  const checkIn = (subjectId: string) => {
    if (activeCheckIn) {
      toast({ title: "Already Checked In", description: "You must check out from your current session first.", variant: "destructive" });
      return;
    }

    // Check for defined Wi-Fi zones.
    if (wifiZones.length === 0) {
      toast({
        title: "Wi-Fi Zone Required",
        description: "Please define at least one Wi-Fi zone in settings to enable check-in.",
        variant: "destructive",
      });
      return;
    }

    // Check connection type using the Network Information API.
    // @ts-ignore - for navigator.connection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection || connection.type !== 'wifi') {
      toast({
        title: "Wi-Fi Connection Required",
        description: "You must be connected to a Wi-Fi network to check in. Cellular data is not permitted.",
        variant: "destructive",
      });
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
      date: new Date().toISOString(),
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

  const deleteAttendanceRecord = (subjectId: string, recordId: string) => {
    setAttendance(prev => ({
        ...prev,
        [subjectId]: prev[subjectId].filter(rec => rec.id !== recordId),
    }));
    toast({ title: "Record Deleted", variant: "destructive" });
  };

  const updateUserDetails = (details: UserDetails) => {
    setUserDetails(details);
    toast({ title: "Profile Updated", description: "Your details have been saved." });
  };

  const value = {
    subjects,
    attendance,
    wifiZones,
    activeCheckIn,
    userDetails,
    isLoaded,
    mode,
    setMode,
    addSubject,
    bulkAddSubjects,
    updateSubject,
    deleteSubject,
    addWifiZone,
    deleteWifiZone,
    checkIn,
    checkOut,
    deleteAttendanceRecord,
    updateUserDetails,
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

    