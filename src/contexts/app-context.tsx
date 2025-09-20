

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
  UserMode,
  School,
  Program,
  Class,
  Department,
} from "@/lib/types";
import { checkAttendanceAnomaly } from "@/actions/attendance-actions";
import { getHeadcount } from "@/ai/flows/get-headcount-flow";
import { initialSchools, initialProgramsBySchool, mockStudents } from "@/lib/school-data";

interface AppContextType {
  subjects: Subject[];
  attendance: Record<string, AttendanceRecord[]>;
  wifiZones: WifiZone[];
  activeCheckIn: ActiveCheckIn | null;
  userDetails: UserDetails;
  students: Student[];
  schools: School[];
  programsBySchool: Record<string, Program[]>;
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
  updateUserDetails: (details: Partial<Omit<UserDetails, 'deviceId'>>) => void;
  hasCameraPermission: boolean | null;
  setHasCameraPermission: (hasPermission: boolean | null) => void;
  requestCameraPermission: (videoEl: HTMLVideoElement | null, showToast?: boolean) => Promise<MediaStream | null>;
  stopCameraStream: (stream: MediaStream | null, videoEl: HTMLVideoElement | null) => void;
  // Admin functions
  addSchool: (school: Omit<School, 'id'>) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (schoolId: string) => void;
  addProgram: (schoolId: string, program: Omit<Program, 'id' | 'departments'>) => void;
  updateProgram: (schoolId: string, program: Program) => void;
  deleteProgram: (schoolId: string, programId: string) => void;
  addDepartment: (schoolId: string, programId: string, department: Omit<Department, 'id' | 'classes'>) => void;
  updateDepartment: (schoolId: string, programId: string, department: Department) => void;
  deleteDepartment: (schoolId: string, programId: string, departmentId: string) => void;
  addClass: (schoolId: string, programId: string, departmentId: string, newClass: Omit<Class, 'id'>) => void;
  updateClass: (schoolId: string, programId: string, departmentId: string, updatedClass: Class) => void;
  deleteClass: (schoolId: string, programId: string, departmentId: string, classId: string) => void;
  addStudentToClass: (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => void;
  removeStudentFromClass: (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => void;
  addFacultyToClass: (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => void;
  removeFacultyFromClass: (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => void;
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

// Custom hook for debouncing
function useDebounce(value: any, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

function generateDeviceId() {
    return 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord[]>>({});
  const [wifiZones, setWifiZones] = useState<WifiZone[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<ActiveCheckIn | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({ ...initialUserDetails, deviceId: '', avatar: `https://picsum.photos/seed/${Math.random()}/200` });
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [mode, setModeState] = useState<UserMode>('student');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [programsBySchool, setProgramsBySchool] = useState<Record<string, Program[]>>({});
  
  // Combine all state into one object for easier debouncing
  const appState = {
    subjects,
    attendance,
    wifiZones,
    activeCheckIn,
    userDetails,
    students,
    mode,
    schools,
    programsBySchool,
  };

  const debouncedState = useDebounce(appState, 500);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem("witrack_subjects");
      const storedAttendance = localStorage.getItem("witrack_attendance");
      const storedWifiZones = localStorage.getItem("witrack_wifiZones");
      const storedActiveCheckIn = localStorage.getItem("witrack_activeCheckIn");
      const storedMode = localStorage.getItem("witrack_mode");
      const storedStudents = localStorage.getItem("witrack_students");
      const storedSchools = localStorage.getItem("witrack_schools");
      const storedProgramsBySchool = localStorage.getItem("witrack_programsBySchool");

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
      setStudents(storedStudents ? JSON.parse(storedStudents) : mockStudents);
      setModeState(storedMode ? JSON.parse(storedMode) : 'student');
      setSchools(storedSchools ? JSON.parse(storedSchools) : initialSchools);
      setProgramsBySchool(storedProgramsBySchool ? JSON.parse(storedProgramsBySchool) : initialProgramsBySchool);
      
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      const deviceId = generateDeviceId();
      setUserDetails({ ...initialUserDetails, deviceId, avatar: `https://picsum.photos/seed/${Math.random()}/200` });
      setSubjects(initialSubjects);
      setAttendance(generateInitialAttendance());
      setWifiZones(initialWifiZones);
      setActiveCheckIn(null);
      setStudents(mockStudents);
      setModeState('student');
      setSchools(initialSchools);
      setProgramsBySchool(initialProgramsBySchool);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever debounced state changes
  useEffect(() => {
      if (!isLoaded) return;
      try {
        localStorage.setItem("witrack_subjects", JSON.stringify(debouncedState.subjects));
        localStorage.setItem("witrack_attendance", JSON.stringify(debouncedState.attendance));
        localStorage.setItem("witrack_wifiZones", JSON.stringify(debouncedState.wifiZones));
        localStorage.setItem("witrack_activeCheckIn", JSON.stringify(debouncedState.activeCheckIn));
        localStorage.setItem("witrack_userDetails", JSON.stringify(debouncedState.userDetails));
        localStorage.setItem("witrack_mode", JSON.stringify(debouncedState.mode));
        localStorage.setItem("witrack_students", JSON.stringify(debouncedState.students));
        localStorage.setItem("witrack_schools", JSON.stringify(debouncedState.schools));
        localStorage.setItem("witrack_programsBySchool", JSON.stringify(debouncedState.programsBySchool));
      } catch (error) {
          console.error("Failed to save debounced data to localStorage", error);
      }
  }, [debouncedState, isLoaded]);

  const requestCameraPermission = useCallback(async (videoEl: HTMLVideoElement | null, showToast = true): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);

      if (videoEl) {
        videoEl.srcObject = stream;
      }
      return stream;
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
      return null;
    }
  }, [toast]);

  const stopCameraStream = useCallback((stream: MediaStream | null, videoEl: HTMLVideoElement | null) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoEl) {
      videoEl.srcObject = null;
    }
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    let modeName = "Student";
    if (newMode === 'faculty') modeName = "Faculty";
    if (newMode === 'admin') modeName = "Admin";
    toast({ title: `Switched to ${modeName} Mode`});
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

  const checkIn = async (subjectId: string) => {
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

  const updateUserDetails = (details: Partial<Omit<UserDetails, 'deviceId'>>) => {
    setUserDetails(prev => ({...prev, ...details}));
    toast({ title: "Profile Updated", description: "Your details have been saved." });
  };

  const findClassAndUpdate = (
    schoolId: string,
    programId: string,
    departmentId: string,
    classId: string,
    updateFn: (cls: Class) => Class
  ) => {
    setProgramsBySchool(prev => {
        const schoolPrograms = (prev[schoolId] || []).map(p => {
            if (p.id === programId) {
                const newDepartments = p.departments.map(d => {
                    if (d.id === departmentId) {
                        const newClasses = d.classes.map(c => {
                            if (c.id === classId) {
                                return updateFn(c);
                            }
                            return c;
                        });
                        return { ...d, classes: newClasses };
                    }
                    return d;
                });
                return { ...p, departments: newDepartments };
            }
            return p;
        });
        return { ...prev, [schoolId]: schoolPrograms };
    });
  }

  // Admin functions
  const addSchool = (school: Omit<School, 'id'>) => {
    const newSchool = { ...school, id: `school_${Date.now()}` };
    setSchools(prev => [...prev, newSchool]);
    setProgramsBySchool(prev => ({...prev, [newSchool.id]: []}));
    toast({ title: 'School Added' });
  };

  const updateSchool = (updatedSchool: School) => {
    setSchools(prev => prev.map(s => s.id === updatedSchool.id ? updatedSchool : s));
    toast({ title: 'School Updated' });
  };

  const deleteSchool = (schoolId: string) => {
    setSchools(prev => prev.filter(s => s.id !== schoolId));
    setProgramsBySchool(prev => {
        const newPrograms = {...prev};
        delete newPrograms[schoolId];
        return newPrograms;
    });
    toast({ title: 'School Deleted', variant: 'destructive' });
  };

  const addProgram = (schoolId: string, program: Omit<Program, 'id' | 'departments'>) => {
    const newProgram = { ...program, id: `prog_${Date.now()}`, departments: [] };
    setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: [...(prev[schoolId] || []), newProgram]
    }));
    toast({ title: 'Program Added' });
  };

  const updateProgram = (schoolId: string, updatedProgram: Program) => {
    setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: (prev[schoolId] || []).map(p => p.id === updatedProgram.id ? updatedProgram : p)
    }));
    toast({ title: 'Program Updated' });
  };

  const deleteProgram = (schoolId: string, programId: string) => {
    setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: (prev[schoolId] || []).filter(p => p.id !== programId)
    }));
    toast({ title: 'Program Deleted', variant: 'destructive' });
  };

  const addDepartment = (schoolId: string, programId: string, department: Omit<Department, 'id' | 'classes'>) => {
    const newDepartment = { ...department, id: `dept_${Date.now()}`, classes: [] };
    setProgramsBySchool(prev => {
        const schoolPrograms = (prev[schoolId] || []).map(p => {
            if (p.id === programId) {
                return { ...p, departments: [...(p.departments || []), newDepartment] };
            }
            return p;
        });
        return { ...prev, [schoolId]: schoolPrograms };
    });
    toast({ title: 'Department Added' });
  };

  const updateDepartment = (schoolId: string, programId: string, updatedDepartment: Department) => {
     setProgramsBySchool(prev => {
        const schoolPrograms = (prev[schoolId] || []).map(p => {
            if (p.id === programId) {
                return { ...p, departments: (p.departments || []).map(d => d.id === updatedDepartment.id ? updatedDepartment : d) };
            }
            return p;
        });
        return { ...prev, [schoolId]: schoolPrograms };
    });
    toast({ title: 'Department Updated' });
  };

  const deleteDepartment = (schoolId: string, programId: string, departmentId: string) => {
    setProgramsBySchool(prev => {
        const schoolPrograms = (prev[schoolId] || []).map(p => {
            if (p.id === programId) {
                return { ...p, departments: (p.departments || []).filter(d => d.id !== departmentId) };
            }
            return p;
        });
        return { ...prev, [schoolId]: schoolPrograms };
    });
    toast({ title: 'Department Deleted', variant: 'destructive' });
  };

  const addClass = (schoolId: string, programId: string, departmentId: string, newClass: Omit<Class, 'id'>) => {
    const finalNewClass = { ...newClass, id: `class_${Date.now()}` };
    setProgramsBySchool(prev => {
        const schoolPrograms = (prev[schoolId] || []).map(p => {
            if (p.id === programId) {
                const newDepartments = (p.departments || []).map(d => {
                    if (d.id === departmentId) {
                        return { ...d, classes: [...(d.classes || []), finalNewClass] };
                    }
                    return d;
                });
                return { ...p, departments: newDepartments };
            }
            return p;
        });
        return { ...prev, [schoolId]: schoolPrograms };
    });
    toast({ title: 'Class Added' });
  };
  
  const updateClass = (schoolId: string, programId: string, departmentId: string, updatedClass: Class) => {
    findClassAndUpdate(schoolId, programId, departmentId, updatedClass.id, () => updatedClass);
    toast({ title: 'Class Updated' });
  };

  const deleteClass = (schoolId: string, programId: string, departmentId: string, classId: string) => {
    setProgramsBySchool(prev => {
        const schoolPrograms = (prev[schoolId] || []).map(p => {
            if (p.id === programId) {
                const newDepartments = (p.departments || []).map(d => {
                    if (d.id === departmentId) {
                        return { ...d, classes: (d.classes || []).filter(c => c.id !== classId) };
                    }
                    return d;
                });
                return { ...p, departments: newDepartments };
            }
            return p;
        });
        return { ...prev, [schoolId]: schoolPrograms };
    });
    toast({ title: 'Class Deleted', variant: 'destructive' });
  };

  const addStudentToClass = (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => {
    const studentToAdd = students.find(s => s.id === studentId);
    if (!studentToAdd) return;

    findClassAndUpdate(schoolId, programId, departmentId, classId, (cls) => {
        if (cls.students.some(s => s.id === studentId)) {
            toast({ title: 'Student Already Enrolled', variant: 'destructive' });
            return cls;
        }
        toast({ title: 'Student Added' });
        return { ...cls, students: [...cls.students, studentToAdd] };
    });
  };

  const removeStudentFromClass = (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => {
    findClassAndUpdate(schoolId, programId, departmentId, classId, (cls) => {
        toast({ title: 'Student Removed', variant: 'destructive' });
        return { ...cls, students: cls.students.filter(s => s.id !== studentId) };
    });
  };

  const addFacultyToClass = (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => {
    findClassAndUpdate(schoolId, programId, departmentId, classId, (cls) => {
        if (cls.faculties.includes(facultyName)) {
            toast({ title: 'Faculty Already Assigned', variant: 'destructive' });
            return cls;
        }
        toast({ title: 'Faculty Added' });
        return { ...cls, faculties: [...cls.faculties, facultyName] };
    });
  };

  const removeFacultyFromClass = (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => {
    findClassAndUpdate(schoolId, programId, departmentId, classId, (cls) => {
        toast({ title: 'Faculty Removed', variant: 'destructive' });
        return { ...cls, faculties: cls.faculties.filter(f => f !== facultyName) };
    });
  };

  const value = {
    subjects,
    attendance,
    wifiZones,
    activeCheckIn,
    userDetails,
    students,
    schools,
    programsBySchool,
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
    updateUserDetails: updateUserDetails as (details: UserDetails) => void,
    hasCameraPermission,
    setHasCameraPermission,
    requestCameraPermission,
    stopCameraStream,
    // Admin functions
    addSchool,
    updateSchool,
    deleteSchool,
    addProgram,
    updateProgram,
    deleteProgram,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addClass,
    updateClass,
    deleteClass,
    addStudentToClass,
    removeStudentFromClass,
    addFacultyToClass,
    removeFacultyFromClass,
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
