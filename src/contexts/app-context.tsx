"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  Subject,
  AttendanceRecord,
  WifiZone,
  ActiveCheckIn,
  UserDetails,
  UserMode,
} from "@/lib/types";
import { checkAttendanceAnomaly } from "@/actions/attendance-actions";
import { useRouter } from "next/navigation";

interface AppContextType {
  subjects: Subject[];
  attendance: Record<string, AttendanceRecord[]>;
  wifiZones: WifiZone[];
  activeCheckIn: ActiveCheckIn | null;
  userDetails: UserDetails;
  isLoaded: boolean;
  mode: UserMode | null;
  setMode: (mode: UserMode) => void;
  logout: () => void;
  addSubject: (subject: Omit<Subject, "id">) => void;
  bulkAddSubjects: (newSubjects: Omit<Subject, 'id'>[]) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  addWifiZone: (ssid: string) => void;
  deleteWifiZone: (zoneId: string) => void;
  checkIn: (subjectId: string) => void;
  checkOut: (subjectId: string) => Promise<void>;
  deleteAttendanceRecord: (subjectId: string, recordId: string) => void;
  updateUserDetails: (details: Partial<Omit<UserDetails, 'deviceId'>>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialSubjects: Subject[] = [
    { id: 'math101', name: 'Calculus I', expectedCheckIn: '09:00', expectedCheckOut: '10:30', totalClasses: 20, dayOfWeek: 1 },
    { id: 'phy101', name: 'Physics for Engineers', expectedCheckIn: '11:00', expectedCheckOut: '12:30', totalClasses: 25, dayOfWeek: 1 },
    { id: 'cs101', name: 'Intro to Programming', expectedCheckIn: '14:00', expectedCheckOut: '15:30', totalClasses: 18, dayOfWeek: 2 },
    { id: 'chem101', name: 'General Chemistry', expectedCheckIn: '09:00', expectedCheckOut: '10:30', totalClasses: 22, dayOfWeek: 3 },
    { id: 'eng101', name: 'English Composition', expectedCheckIn: '13:00', expectedCheckOut: '14:30', totalClasses: 15, dayOfWeek: 4 },
];

const generateInitialAttendance = (): Record<string, AttendanceRecord[]> => {
    const attendance: Record<string, AttendanceRecord[]> = {};
    const today = new Date();
    initialSubjects.forEach(subject => {
        attendance[subject.id] = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (i * 7 + (today.getDay() - subject.dayOfWeek + 7) % 7));
            const checkInTime = new Date(date);
            const [startHour, startMinute] = subject.expectedCheckIn.split(':').map(Number);
            checkInTime.setHours(startHour, startMinute, 0, 0);

            const checkOutTime = new Date(date);
            const [endHour, endMinute] = subject.expectedCheckOut.split(':').map(Number);
            checkOutTime.setHours(endHour, endMinute, 0, 0);
            
            attendance[subject.id].push({
                id: `att_${subject.id}_${i}`,
                date: date.toISOString(),
                checkIn: checkInTime.toISOString(),
                checkOut: checkOutTime.toISOString(),
                isAnomaly: false,
                anomalyReason: '',
                studentId: '20221IST0001',
            });
        }
    });
    return attendance;
};

const initialWifiZones: WifiZone[] = [
    { id: 'wifi1', ssid: 'University-Guest' },
    { id: 'wifi2', ssid: 'Library-Wifi' },
];

const initialUserDetails: Omit<UserDetails, 'deviceId' | 'avatar'> = {
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

function generateDeviceId() {
    return 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord[]>>({});
  const [wifiZones, setWifiZones] = useState<WifiZone[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<ActiveCheckIn | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({ ...initialUserDetails, deviceId: '', avatar: '' });
  const [mode, setModeState] = useState<UserMode | null>(null);
  
  const appStateRef = useRef({
    subjects,
    attendance,
    wifiZones,
    activeCheckIn,
    userDetails,
    mode
  });

  useEffect(() => {
    appStateRef.current = {
      subjects,
      attendance,
      wifiZones,
      activeCheckIn,
      userDetails,
      mode
    };
  }, [subjects, attendance, wifiZones, activeCheckIn, userDetails, mode]);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem("witrack_subjects");
      const storedAttendance = localStorage.getItem("witrack_attendance");
      const storedWifiZones = localStorage.getItem("witrack_wifiZones");
      const storedActiveCheckIn = localStorage.getItem("witrack_activeCheckIn");
      const storedMode = localStorage.getItem("witrack_mode");

      let storedUserDetails = localStorage.getItem("witrack_userDetails");
      let userDetailsData;

      if (storedUserDetails) {
          userDetailsData = JSON.parse(storedUserDetails);
          if (!userDetailsData.deviceId) {
              userDetailsData.deviceId = generateDeviceId();
          }
          if (!userDetailsData.avatar) {
              userDetailsData.avatar = `https://picsum.photos/seed/${Math.random()}/200`;
          }
      } else {
          userDetailsData = { ...initialUserDetails, deviceId: generateDeviceId(), avatar: `https://picsum.photos/seed/${Math.random()}/200` };
      }
      setUserDetails(userDetailsData);
      
      setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjects);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : generateInitialAttendance());
      setWifiZones(storedWifiZones ? JSON.parse(storedWifiZones) : initialWifiZones);
      setActiveCheckIn(storedActiveCheckIn ? JSON.parse(storedActiveCheckIn) : null);
      setModeState(storedMode ? JSON.parse(storedMode) : null);
      
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      const deviceId = generateDeviceId();
      setUserDetails({ ...initialUserDetails, deviceId, avatar: `https://picsum.photos/seed/${Math.random()}/200` });
      setSubjects(initialSubjects);
      setAttendance(generateInitialAttendance());
      setWifiZones(initialWifiZones);
      setActiveCheckIn(null);
      setModeState(null);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when the user is about to leave the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const stateToSave = appStateRef.current;
        localStorage.setItem("witrack_subjects", JSON.stringify(stateToSave.subjects));
        localStorage.setItem("witrack_attendance", JSON.stringify(stateToSave.attendance));
        localStorage.setItem("witrack_wifiZones", JSON.stringify(stateToSave.wifiZones));
        localStorage.setItem("witrack_activeCheckIn", JSON.stringify(stateToSave.activeCheckIn));
        localStorage.setItem("witrack_userDetails", JSON.stringify(stateToSave.userDetails));
        if (stateToSave.mode) {
            localStorage.setItem("witrack_mode", JSON.stringify(stateToSave.mode));
        } else {
            localStorage.removeItem("witrack_mode");
        }
      } catch (error) {
        console.error("Failed to save data to localStorage on unload", error);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    // Reset to default data when switching modes
    setSubjects(initialSubjects);
    setAttendance(generateInitialAttendance());
    if(newMode !== 'student') {
        setSubjects([]);
        setAttendance({});
    }
  };

  const logout = () => {
    setModeState(null);
    localStorage.removeItem("witrack_mode");
    router.push('/select-role');
    toast({ title: "Logged Out" });
  };

  const addSubject = (subject: Omit<Subject, "id">) => {
    const newSubject = { ...subject, id: `subj_${Date.now()}` };
    setSubjects((prev) => [...prev, newSubject]);
    toast({ title: "Subject Added", description: `${subject.name} has been added.` });
  };

  const bulkAddSubjects = (newSubjects: Omit<Subject, 'id'>[]) => {
    const subjectsToAdd = newSubjects.map(s => ({ ...s, id: `subj_${Date.now()}_${Math.random()}` }));
    setSubjects(subjectsToAdd);
    setAttendance({}); // Clear old attendance records
    toast({ title: "Timetable Replaced", description: `${subjectsToAdd.length} new subjects have been imported.` });
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
    
    if (wifiZones.length === 0) {
      toast({
        title: "Wi-Fi Zone Required",
        description: "An administrator must define at least one Wi-Fi zone in settings to enable check-in.",
        variant: "destructive",
      });
      return;
    }
        
    const newActiveCheckIn: ActiveCheckIn = {
      subjectId,
      checkInTime: new Date().toISOString(),
      deviceId: userDetails.deviceId,
    };
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
    const newRecord: Omit<AttendanceRecord, 'isAnomaly' | 'anomalyReason' | 'studentId'> = {
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

    const finalRecord: AttendanceRecord = { ...newRecord, ...anomalyResult, studentId: userDetails.rollNo };
  
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

  const updateUserDetails = (details: Partial<Omit<UserDetails, 'deviceId'>>) => {
    setUserDetails(prev => ({...prev, ...details}));
    toast({ title: "Profile Updated" });
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
    logout,
    addSubject,
    bulkAddSubjects,
    updateSubject,
    deleteSubject,
    addWifiZone,
    deleteWifiZone,
    checkIn,
    checkOut,
    deleteAttendanceRecord,
    updateUserDetails: updateUserDetails as (details: Partial<Omit<UserDetails, 'deviceId'>>) => void,
  };

  return <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
