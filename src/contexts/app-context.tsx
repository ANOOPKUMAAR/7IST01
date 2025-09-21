

"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
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
import { useRouter } from "next/navigation";

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
  recordClassAttendance: (subject: Class, presentStudentIds: string[], absentStudentIds: string[]) => void;
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

const initialSubjects: Subject[] = [];

const generateInitialAttendance = (): Record<string, AttendanceRecord[]> => { return {} };

const initialWifiZones: WifiZone[] = [
    { id: 'wifi1', ssid: 'TP-Link_92EC_5G' },
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
  const [subjectsState, setSubjectsState] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord[]>>({});
  const [wifiZones, setWifiZones] = useState<WifiZone[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<ActiveCheckIn | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({ ...initialUserDetails, deviceId: '', avatar: '' });
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [mode, setModeState] = useState<UserMode | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [programsBySchool, setProgramsBySchool] = useState<Record<string, Program[]>>({});
  
  const appStateRef = useRef({
    subjectsState,
    attendance,
    wifiZones,
    activeCheckIn,
    userDetails,
    students,
    mode,
    schools,
    programsBySchool,
  });

  useEffect(() => {
    appStateRef.current = {
      subjectsState,
      attendance,
      wifiZones,
      activeCheckIn,
      userDetails,
      students,
      mode,
      schools,
      programsBySchool,
    };
  }, [subjectsState, attendance, wifiZones, activeCheckIn, userDetails, students, mode, schools, programsBySchool]);
  
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
      
      setSubjectsState(storedSubjects ? JSON.parse(storedSubjects) : initialSubjects);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : generateInitialAttendance());
      setWifiZones(storedWifiZones ? JSON.parse(storedWifiZones) : initialWifiZones);
      setActiveCheckIn(storedActiveCheckIn ? JSON.parse(storedActiveCheckIn) : null);
      setStudents(storedStudents ? JSON.parse(storedStudents) : mockStudents);
      setModeState(storedMode ? JSON.parse(storedMode) : null);
      setSchools(storedSchools ? JSON.parse(storedSchools) : initialSchools);
      setProgramsBySchool(storedProgramsBySchool ? JSON.parse(storedProgramsBySchool) : initialProgramsBySchool);
      
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      const deviceId = generateDeviceId();
      setUserDetails({ ...initialUserDetails, deviceId, avatar: `https://picsum.photos/seed/${Math.random()}/200` });
      setSubjectsState(initialSubjects);
      setAttendance(generateInitialAttendance());
      setWifiZones(initialWifiZones);
      setActiveCheckIn(null);
      setStudents(mockStudents);
      setModeState(null);
      setSchools(initialSchools);
      setProgramsBySchool(initialProgramsBySchool);
    }
    setIsLoaded(true);
  }, []);

  const subjects = useMemo(() => {
    if (!isLoaded || !mode) return [];

    const dayMap: { [key: string]: number } = { 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0 };

    if (mode === 'faculty') {
        const facultyName = "Prof. Ada Lovelace"; // Simulating logged-in faculty
        const facultyClasses: Subject[] = [];
        Object.values(programsBySchool).flat().forEach(program => {
            program.departments.forEach(department => {
                department.classes.forEach(cls => {
                    if (cls.faculties.includes(facultyName)) {
                        facultyClasses.push({
                            id: cls.id,
                            name: cls.name,
                            expectedCheckIn: cls.startTime,
                            expectedCheckOut: cls.endTime,
                            dayOfWeek: dayMap[cls.day.toLowerCase()] ?? 1,
                            totalClasses: 20 // Placeholder
                        });
                    }
                });
            });
        });
        return facultyClasses;
    } 
    
    if (mode === 'student') {
        const enrolledSubjects: Subject[] = [];
        Object.values(programsBySchool).flat().forEach(program => {
            program.departments.forEach(department => {
                department.classes.forEach(cls => {
                    if (cls.students.some(s => s.rollNo === userDetails.rollNo)) {
                        enrolledSubjects.push({
                            id: cls.id,
                            name: cls.name,
                            expectedCheckIn: cls.startTime,
                            expectedCheckOut: cls.endTime,
                            dayOfWeek: dayMap[cls.day.toLowerCase()] ?? 1,
                            totalClasses: 20 // Placeholder, can be improved
                        });
                    }
                });
            });
        });
        // This is where manually-added subjects would be combined, if desired.
        // For now, it only returns subjects the student is officially enrolled in.
        return enrolledSubjects;
    }

    return [];
  }, [mode, isLoaded, programsBySchool, userDetails.rollNo]);

  // Save to localStorage when the user is about to leave the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const stateToSave = appStateRef.current;
        localStorage.setItem("witrack_subjects", JSON.stringify(stateToSave.subjectsState));
        localStorage.setItem("witrack_attendance", JSON.stringify(stateToSave.attendance));
        localStorage.setItem("witrack_wifiZones", JSON.stringify(stateToSave.wifiZones));
        localStorage.setItem("witrack_activeCheckIn", JSON.stringify(stateToSave.activeCheckIn));
        localStorage.setItem("witrack_userDetails", JSON.stringify(stateToSave.userDetails));
        if (stateToSave.mode) {
            localStorage.setItem("witrack_mode", JSON.stringify(stateToSave.mode));
        } else {
            localStorage.removeItem("witrack_mode");
        }
        localStorage.setItem("witrack_students", JSON.stringify(stateToSave.students));
        localStorage.setItem("witrack_schools", JSON.stringify(stateToSave.schools));
        localStorage.setItem("witrack_programsBySchool", JSON.stringify(stateToSave.programsBySchool));
      } catch (error) {
        console.error("Failed to save data to localStorage on unload", error);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

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
    if (newMode === 'student') {
        // We shouldn't clear subjectsState on mode switch, 
        // as it holds the student's manually added timetable.
        // setSubjectsState(initialSubjects); 
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
    setSubjectsState((prev) => [...prev, newSubject]);
    toast({ title: "Subject Added", description: `${subject.name} has been added.` });
  };

  const bulkAddSubjects = (newSubjects: Omit<Subject, 'id'>[]) => {
    const subjectsToAdd = newSubjects.map(s => ({ ...s, id: `subj_${Date.now()}_${Math.random()}` }));
    setSubjectsState(subjectsToAdd);
    setAttendance({}); // Clear old attendance records
    toast({ title: "Timetable Replaced", description: `${subjectsToAdd.length} new subjects have been imported.` });
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjectsState((prev) => prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));
    toast({ title: "Subject Updated", description: `${updatedSubject.name} has been updated.` });
  };
  
  const deleteSubject = (subjectId: string) => {
    setSubjectsState((prev) => prev.filter((s) => s.id !== subjectId));
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
    const updatedUserDetails = { ...userDetails, ...details };
    setUserDetails(updatedUserDetails);

    setStudents(prevStudents => 
        prevStudents.map(student => {
            if (student.rollNo === userDetails.rollNo) {
                return { 
                    ...student,
                    name: updatedUserDetails.name,
                    deviceId: updatedUserDetails.deviceId, // Ensure deviceId is also updated in the master list
                };
            }
            return student;
        })
    );
    
    toast({ title: "Profile Updated", description: "Your details have been saved across the app." });
  };
  
  const recordClassAttendance = (subject: Class, presentStudentIds: string[], absentStudentIds: string[]) => {
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(Number(subject.startTime.split(':')[0]), Number(subject.startTime.split(':')[1]), 0, 0);

    const endTime = new Date(now);
    endTime.setHours(Number(subject.endTime.split(':')[0]), Number(subject.endTime.split(':')[1]), 0, 0);

    const newAttendanceRecords: Record<string, AttendanceRecord[]> = {};

    presentStudentIds.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const presentRecord: AttendanceRecord = {
            id: `att_${Date.now()}_${studentId}`,
            date: now.toISOString(),
            checkIn: startTime.toISOString(),
            checkOut: endTime.toISOString(),
            isAnomaly: false,
            anomalyReason: '',
            studentId: student.rollNo,
        };
        
        if (!newAttendanceRecords[subject.id]) {
            newAttendanceRecords[subject.id] = [];
        }
        newAttendanceRecords[subject.id].push(presentRecord);
    });
    
    setAttendance(prev => {
        const updatedAttendance = { ...prev };
        Object.keys(newAttendanceRecords).forEach(subjectId => {
            // Filter out any existing records for these students on this day to avoid duplicates
            const existingRecords = updatedAttendance[subjectId] || [];
            const otherStudentRecords = existingRecords.filter(rec => {
                const recDate = new Date(rec.date).toDateString();
                const isToday = recDate === now.toDateString();
                const isAffectedStudent = presentStudentIds.some(sid => students.find(s=>s.id===sid)?.rollNo === rec.studentId) || 
                                      absentStudentIds.some(sid => students.find(s=>s.id===sid)?.rollNo === rec.studentId);
                return !(isToday && isAffectedStudent);
            });
            updatedAttendance[subjectId] = [...otherStudentRecords, ...newAttendanceRecords[subjectId]];
        });
        return updatedAttendance;
    });

    toast({
        title: "Attendance Recorded",
        description: `Marked ${presentStudentIds.length} present and ${absentStudentIds.length} absent for ${subject.name}.`
    });
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
                        // Ensure students and faculties are arrays
                        const classToAdd: Class = {
                            ...finalNewClass,
                            students: finalNewClass.students || [],
                            faculties: finalNewClass.faculties || [],
                        };
                        return { ...d, classes: [...(d.classes || []), classToAdd] };
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
    recordClassAttendance,
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

    

    