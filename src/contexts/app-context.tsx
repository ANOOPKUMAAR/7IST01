
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
  Student,
} from "@/lib/types";
import { checkAttendanceAnomaly } from "@/actions/attendance-actions";
import { countPeopleInImage } from "@/ai/flows/count-people-in-image-flow";

type UserMode = 'student' | 'faculty';

interface AppContextType {
  subjects: Subject[];
  attendance: Record<string, AttendanceRecord[]>;
  wifiZones: WifiZone[];
  activeCheckIn: ActiveCheckIn | null;
  userDetails: UserDetails;
  students: Student[];
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
  hasCameraPermission: boolean | null;
  setHasCameraPermission: (hasPermission: boolean | null) => void;
  requestCameraPermission: (showToast?: boolean) => Promise<boolean>;
  videoRef: React.RefObject<HTMLVideoElement>;
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

const initialStudents: Student[] = [
    { id: 's1', name: 'Bob Johnson', rollNo: '20221IST0002' },
    { id: 's2', name: 'Charlie Brown', rollNo: '20221IST0003' },
    { id: 's3', name: 'Diana Prince', rollNo: '20221IST0004' },
    { id: 's4', name: 'Ethan Hunt', rollNo: '20221IST0005' },
    { id: 's5', name: 'Fiona Glenanne', rollNo: '20221IST0006' },
    { id: 's6', name: 'George Costanza', rollNo: '20221IST0007' },
    { id: 's7', name: 'Hannah Montana', rollNo: '20221IST0008' },
    { id: 's8', name: 'Indiana Jones', rollNo: '20221IST0009' },
    { id: 's9', name: 'Jack Sparrow', rollNo: '20221IST0010' },
    { id: 's10', name: 'Lara Croft', rollNo: '20221IST0011' },
    { id: 's11', name: 'Michael Scott', rollNo: '20221IST0012' },
    { id: 's12', name: 'Neo', rollNo: '20221IST0013' },
];


export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord[]>>({});
  const [wifiZones, setWifiZones] = useState<WifiZone[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<ActiveCheckIn | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>(initialUserDetails);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [mode, setModeState] = useState<UserMode>('student');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Ref to hold the latest state to be saved
  const stateToSave = useRef({ subjects, attendance, wifiZones, activeCheckIn, userDetails, students, mode });

  // Update ref whenever state changes
  useEffect(() => {
    stateToSave.current = { subjects, attendance, wifiZones, activeCheckIn, userDetails, students, mode };
  }, [subjects, attendance, wifiZones, activeCheckIn, userDetails, students, mode]);

  const requestCameraPermission = useCallback(async (showToast = true): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description:
            "Please enable camera permissions in your browser settings to use this app.",
        });
      }
      return false;
    }
  }, [toast, videoRef]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem("witrack_subjects");
      const storedAttendance = localStorage.getItem("witrack_attendance");
      const storedWifiZones = localStorage.getItem("witrack_wifiZones");
      const storedActiveCheckIn = localStorage.getItem("witrack_activeCheckIn");
      const storedUserDetails = localStorage.getItem("witrack_userDetails");
      const storedMode = localStorage.getItem("witrack_mode");
      const storedStudents = localStorage.getItem("witrack_students");
      
      setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjects);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : generateInitialAttendance());
      setWifiZones(storedWifiZones ? JSON.parse(storedWifiZones) : initialWifiZones);
      setActiveCheckIn(storedActiveCheckIn ? JSON.parse(storedActiveCheckIn) : null);
      setUserDetails(storedUserDetails ? JSON.parse(storedUserDetails) : initialUserDetails);
      setStudents(storedStudents ? JSON.parse(storedStudents) : initialStudents);
      setModeState(storedMode ? JSON.parse(storedMode) : 'student');
      
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setSubjects(initialSubjects);
      setAttendance(generateInitialAttendance());
      setWifiZones(initialWifiZones);
      setActiveCheckIn(null);
      setUserDetails(initialUserDetails);
      setStudents(initialStudents);
      setModeState('student');
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on unload
  const saveState = useCallback(() => {
      if (!isLoaded) return;
      try {
        const { subjects, attendance, wifiZones, activeCheckIn, userDetails, mode, students } = stateToSave.current;
        localStorage.setItem("witrack_subjects", JSON.stringify(subjects));
        localStorage.setItem("witrack_attendance", JSON.stringify(attendance));
        localStorage.setItem("witrack_wifiZones", JSON.stringify(wifiZones));
        localStorage.setItem("witrack_activeCheckIn", JSON.stringify(activeCheckIn));
        localStorage.setItem("witrack_userDetails", JSON.stringify(userDetails));
        localStorage.setItem("witrack_mode", JSON.stringify(mode));
        localStorage.setItem("witrack_students", JSON.stringify(students));
      } catch (error) {
          console.error("Failed to save data to localStorage", error);
      }
  }, [isLoaded]);

  useEffect(() => {
      window.addEventListener('beforeunload', saveState);
      return () => {
          window.removeEventListener('beforeunload', saveState);
      };
  }, [saveState]);

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

  const handleHeadcount = async () => {
    if (!videoRef.current || hasCameraPermission !== true) {
      toast({
        title: "Camera not ready",
        description: "Camera permission is not granted or the camera is not yet initialized.",
        variant: "destructive",
      });
      return;
    };

    const canvas = document.createElement("canvas");
    // Ensure video is playing and has dimensions
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      toast({
        title: "Camera Error",
        description: "Could not capture image from camera. Please try again.",
        variant: "destructive",
      });
      return;
    }
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");

    if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL("image/jpeg");
        
        try {
            toast({
              title: "Analyzing classroom...",
              description: "The AI is counting the number of students.",
            });
            const result = await countPeopleInImage({ imageDataUri });
            toast({
                title: "AI Headcount Complete",
                description: `The AI detected ${result.count} ${result.count === 1 ? 'person' : 'people'}.`,
                variant: 'success',
            });
        } catch (error) {
            console.error("Error counting people: ", error);
            toast({
                title: "Headcount Failed",
                description: "The AI could not process the image. Please try again.",
                variant: "destructive"
            });
        }
    }
  }

  const checkIn = async (subjectId: string) => {
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
    
    // AI headcount
    await requestCameraPermission(false);
    // Give camera time to initialize
    setTimeout(handleHeadcount, 1000);
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
    students,
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
    hasCameraPermission,
    setHasCameraPermission,
    requestCameraPermission,
    videoRef,
  };

  return <AppContext.Provider value={value}>
      {children}
      {/* Hidden video element for camera access */}
      <video ref={videoRef} className="hidden" autoPlay muted playsInline />
    </AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
