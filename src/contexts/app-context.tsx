
"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  Subject,
  AttendanceRecord,
  WifiZone,
  ActiveCheckIn,
  UserDetails,
  UserMode,
  School,
  Program,
  Department,
  Class,
  Student,
  Faculty,
} from "@/lib/types";
import { checkAttendanceAnomaly } from "@/actions/attendance-actions";
import { useRouter } from "next/navigation";
import {
  initialSchools,
  initialProgramsBySchool,
  mockStudents,
} from "@/lib/school-data";
import { mockFaculties } from "@/lib/faculty-data";

interface AppContextType {
  subjects: Subject[];
  attendance: Record<string, AttendanceRecord[]>;
  wifiZones: WifiZone[];
  activeCheckIn: ActiveCheckIn | null;
  userDetails: UserDetails & { id: string };
  isLoaded: boolean;
  mode: UserMode | null;
  schools: School[];
  programsBySchool: Record<string, Program[]>;
  students: Student[];
  faculties: Faculty[];
  facultyClasses: Class[];
  login: (role: UserMode) => boolean;
  logout: () => void;
  addSubject: (subject: Omit<Subject, "id">) => void;
  bulkAddSubjects: (newSubjects: Omit<Subject, "id">[]) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  addWifiZone: (ssid: string) => void;
  deleteWifiZone: (zoneId: string) => void;
  checkIn: (subjectId: string) => void;
  checkOut: (subjectId: string) => Promise<void>;
  deleteAttendanceRecord: (subjectId: string, recordId: string) => void;
  updateUserDetails: (details: Partial<Omit<UserDetails, "deviceId">>) => void;
  addSchool: (school: Omit<School, "id">) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (schoolId: string) => void;
  addProgram: (schoolId: string, program: Omit<Program, "id" | "departments">) => void;
  updateProgram: (schoolId: string, program: Program) => void;
  deleteProgram: (schoolId: string, programId: string) => void;
  addDepartment: (schoolId: string, programId: string, department: Omit<Department, "id" | "classes">) => void;
  updateDepartment: (schoolId: string, programId: string, department: Department) => void;
  deleteDepartment: (schoolId: string, programId: string, departmentId: string) => void;
  addClass: (schoolId: string, programId: string, departmentId: string, cls: Omit<Class, "id">) => void;
  updateClass: (schoolId: string, programId: string, departmentId: string, cls: Class) => void;
  deleteClass: (schoolId: string, programId: string, departmentId: string, classId: string) => void;
  addStudent: (student: Omit<Student, "id">) => void;
  bulkAddStudents: (newStudents: Omit<Student, "id" | 'avatar' | 'deviceId'>[]) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  addStudentToClass: (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => void;
  removeStudentFromClass: (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => void;
  addFaculty: (faculty: Omit<Faculty, "id">) => void;
  bulkAddFaculty: (newFaculty: Omit<Faculty, "id" | "avatar">[]) => void;
  updateFaculty: (faculty: Faculty) => void;
  deleteFaculty: (facultyId: string) => void;
  addFacultyToClass: (schoolId: string, programId: string, departmentId: string, classId: string, facultyId: string) => void;
  addFacultyToClassById: (classId: string, facultyId: string) => void;
  removeFacultyFromClass: (schoolId: string, programId: string, departmentId: string, classId: string, facultyId: string) => void;
  assignFacultyToClassesFromTimetable: (faculty: Faculty, classes: Partial<Class>[]) => void;
  recordClassAttendance: (cls: Class, presentStudentIds: string[], absentStudentIds: string[]) => void;
  startClassAttendance: (cls: Class) => void;
  requestCameraPermission: (videoRefCurrent: HTMLVideoElement | null, autoStart?: boolean) => Promise<MediaStream | null>;
  stopCameraStream: (stream: MediaStream | null, videoRefCurrent: HTMLVideoElement | null) => void;
  hasCameraPermission: boolean | null;
  setHasCameraPermission: (hasPermission: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialStudentSubjects: Subject[] = [
    { id: 'math101', name: 'Calculus I', expectedCheckIn: '09:00', expectedCheckOut: '10:30', totalClasses: 20, dayOfWeek: 1 },
    { id: 'phy101', name: 'Physics for Engineers', expectedCheckIn: '11:00', expectedCheckOut: '12:30', totalClasses: 25, dayOfWeek: 1 },
    { id: 'cs101', name: 'Intro to Programming', expectedCheckIn: '14:00', expectedCheckOut: '15:30', totalClasses: 18, dayOfWeek: 2 },
    { id: 'chem101', name: 'General Chemistry', expectedCheckIn: '09:00', expectedCheckOut: '10:30', totalClasses: 22, dayOfWeek: 3 },
    { id: 'eng101', name: 'English Composition', expectedCheckIn: '13:00', expectedCheckOut: '14:30', totalClasses: 15, dayOfWeek: 4 },
];

const generateInitialAttendance = (): Record<string, AttendanceRecord[]> => {
    const attendance: Record<string, AttendanceRecord[]> = {};
    const today = new Date();
    initialStudentSubjects.forEach(subject => {
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

const initialUserDetails: UserDetails = {
    id: "20221IST0001",
    name: "Bob Johnson",
    rollNo: "20221IST0001",
    program: "Bachelor of Technology",
    branch: "Computer Science",
    department: "Engineering",
    section: "A",
    phone: "+1 (123) 456-7890",
    parentName: "John Doe",
    address: "123 University Lane, Tech City, 12345",
    deviceId: '',
    avatar: ''
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
  const [userDetails, setUserDetails] = useState<UserDetails & { id: string }>({ ...initialUserDetails, deviceId: '', avatar: '' });
  const [mode, setModeState] = useState<UserMode | null>(null);
  
  const [schools, setSchools] = useState<School[]>([]);
  const [programsBySchool, setProgramsBySchool] = useState<Record<string, Program[]>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const appStateRef = useRef({
    subjects: subjectsState,
    attendance,
    wifiZones,
    activeCheckIn,
    userDetails,
    mode,
    schools,
    programsBySchool,
    students,
    faculties,
  });

  useEffect(() => {
    appStateRef.current = {
      subjects: subjectsState,
      attendance,
      wifiZones,
      activeCheckIn,
      userDetails,
      mode,
      schools,
      programsBySchool,
      students,
      faculties,
    };
  }, [subjectsState, attendance, wifiZones, activeCheckIn, userDetails, mode, schools, programsBySchool, students, faculties]);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem("witrack_subjects");
      const storedAttendance = localStorage.getItem("witrack_attendance");
      const storedWifiZones = localStorage.getItem("witrack_wifiZones");
      const storedActiveCheckIn = localStorage.getItem("witrack_activeCheckIn");
      const storedMode = localStorage.getItem("witrack_mode");
      
      const storedSchools = localStorage.getItem("witrack_schools");
      const storedPrograms = localStorage.getItem("witrack_programs");
      const storedStudents = localStorage.getItem("witrack_students");
      const storedFaculties = localStorage.getItem("witrack_faculties");

      let storedUserDetails = localStorage.getItem("witrack_userDetails");
      let userDetailsData;

      if (storedUserDetails) {
          userDetailsData = JSON.parse(storedUserDetails);
          if (!userDetailsData.deviceId) {
              userDetailsData.deviceId = generateDeviceId();
          }
          if (!userDetailsData.avatar) {
              userDetailsData.avatar = `https://picsum.photos/seed/${userDetailsData.rollNo || userDetailsData.id}/200`;
          }
           if (!userDetailsData.id) {
              userDetailsData.id = userDetailsData.rollNo;
          }
      } else {
          userDetailsData = { ...initialUserDetails, deviceId: generateDeviceId(), avatar: `https://picsum.photos/seed/${initialUserDetails.rollNo}/200` };
      }
      setUserDetails(userDetailsData);
      
      setSubjectsState(storedSubjects ? JSON.parse(storedSubjects) : initialStudentSubjects);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : generateInitialAttendance());
      setWifiZones(storedWifiZones ? JSON.parse(storedWifiZones) : initialWifiZones);
      setActiveCheckIn(storedActiveCheckIn ? JSON.parse(storedActiveCheckIn) : null);
      setModeState(storedMode ? JSON.parse(storedMode) : null);

      setSchools(storedSchools ? JSON.parse(storedSchools) : initialSchools);
      setProgramsBySchool(storedPrograms ? JSON.parse(storedPrograms) : initialProgramsBySchool);
      const studentList = storedStudents ? JSON.parse(storedStudents) : mockStudents;
      const studentMap = new Map<string, Student>();
      // Ensure current user is in the list
      studentMap.set(userDetailsData.id, userDetailsData);
      studentList.forEach((s: Student) => studentMap.set(s.id, s));
      setStudents(Array.from(studentMap.values()));
      
      setFaculties(storedFaculties ? JSON.parse(storedFaculties) : mockFaculties);

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      const deviceId = generateDeviceId();
      const currentUserDetails = { ...initialUserDetails, id: initialUserDetails.rollNo, deviceId, avatar: `https://picsum.photos/seed/${initialUserDetails.rollNo}/200` };
      
      setUserDetails(currentUserDetails);
      setSubjectsState(initialStudentSubjects);
      setAttendance(generateInitialAttendance());
      setWifiZones(initialWifiZones);
      setActiveCheckIn(null);
      setModeState(null);
      setSchools(initialSchools);
      setProgramsBySchool(initialProgramsBySchool);
      setStudents([currentUserDetails, ...mockStudents]);
      setFaculties(mockFaculties);
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
        localStorage.setItem("witrack_schools", JSON.stringify(stateToSave.schools));
        localStorage.setItem("witrack_programs", JSON.stringify(stateToSave.programsBySchool));
        localStorage.setItem("witrack_students", JSON.stringify(stateToSave.students));
        localStorage.setItem("witrack_faculties", JSON.stringify(stateToSave.faculties));
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

  const login = (role: UserMode): boolean => {
    let userToLogin: (Student | Faculty | { id: string, name: string, rollNo: string, avatar: string, email?: string, designation?: string, department?: string }) | undefined;
    
    if (role === 'admin') {
        userToLogin = {
            id: 'admin',
            name: 'Admin User',
            rollNo: 'admin',
            avatar: `https://picsum.photos/seed/admin/200`
        };
    } else if (role === 'student') {
        userToLogin = students.find(s => s.rollNo === '20221IST0001');
        if (!userToLogin && students.length > 0) userToLogin = students[0];
    } else if (role === 'faculty') {
        userToLogin = faculties.find(f => f.email === 'geoffrey.hinton@example.com');
        if (!userToLogin && faculties.length > 0) userToLogin = faculties[0];
    } else {
        toast({ title: 'Invalid Role', variant: 'destructive' });
        return false;
    }

    if (userToLogin) {
        setModeState(role);
        setUserDetails(userToLogin as any);
        if (role === 'student') {
            setSubjectsState(initialStudentSubjects);
            setAttendance(generateInitialAttendance());
        } else {
            setSubjectsState([]);
            setAttendance({});
        }
        router.push('/dashboard');
        return true;
    }

    toast({ title: 'Default user not found', description: `Could not find the default user for the ${role} role.`, variant: 'destructive' });
    return false;
  }

  const logout = () => {
    setModeState(null);
    router.push('/select-role');
    toast({ title: "Logged Out" });
  };
  
  const subjects = useMemo(() => {
    if (mode === 'student') {
      const studentId = userDetails.id;
      const enrolledClasses: Subject[] = [];

      Object.values(programsBySchool).flat().forEach(program => {
        program.departments?.forEach(department => {
          department.classes?.forEach(cls => {
            if (cls.students?.some(s => s.id === studentId)) {
              enrolledClasses.push({
                id: cls.id,
                name: cls.name,
                expectedCheckIn: cls.startTime,
                expectedCheckOut: cls.endTime,
                totalClasses: cls.totalClasses, 
                dayOfWeek: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(cls.day.toLowerCase()),
              });
            }
          });
        });
      });
      
      const combined = [...subjectsState, ...enrolledClasses];
      const uniqueSubjects = combined.filter((subject, index, self) =>
        index === self.findIndex((s) => (s.id === subject.id))
      );

      return uniqueSubjects;
    }
    return subjectsState;
  }, [mode, userDetails.id, programsBySchool, subjectsState]);
  
  const facultyClasses = useMemo(() => {
    if (mode !== 'faculty' || !userDetails?.id) return [];
    
    const facultyId = userDetails.id;
    const assignedClasses: Class[] = [];

    Object.values(programsBySchool).flat().forEach(program => {
        program.departments?.forEach(department => {
            department.classes?.forEach(cls => {
                if (cls.faculties?.some(f => f.id === facultyId)) {
                    assignedClasses.push(cls);
                }
            })
        })
    });
    return assignedClasses;

  }, [mode, userDetails?.id, programsBySchool]);


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

  const updateUserDetails = (details: Partial<Omit<UserDetails, 'deviceId' | 'id' | 'rollNo'>>) => {
    setUserDetails(prev => ({...prev, ...details}));
    toast({ title: "Profile Updated" });
  };

  // Admin functions
  const addSchool = (school: Omit<School, "id">) => {
    const newSchool = { ...school, id: `sch_${Date.now()}` };
    setSchools((prev) => [...prev, newSchool]);
    setProgramsBySchool(prev => ({ ...prev, [newSchool.id]: [] }));
    toast({ title: "School Added" });
  };

  const updateSchool = (updatedSchool: School) => {
    setSchools((prev) => prev.map((s) => (s.id === updatedSchool.id ? updatedSchool : s)));
    toast({ title: "School Updated" });
  };

  const deleteSchool = (schoolId: string) => {
    setSchools((prev) => prev.filter((s) => s.id !== schoolId));
    setProgramsBySchool(prev => {
        const newState = { ...prev };
        delete newState[schoolId];
        return newState;
    });
    toast({ title: "School Deleted", variant: "destructive" });
  };

  const addProgram = (schoolId: string, program: Omit<Program, "id" | "departments">) => {
    const newProgram = { ...program, id: `prog_${Date.now()}`, departments: [] };
    setProgramsBySchool(prev => ({
      ...prev,
      [schoolId]: [...(prev[schoolId] || []), newProgram],
    }));
    toast({ title: "Program Added" });
  };

  const updateProgram = (schoolId: string, updatedProgram: Program) => {
    setProgramsBySchool(prev => ({
      ...prev,
      [schoolId]: prev[schoolId].map(p => p.id === updatedProgram.id ? updatedProgram : p),
    }));
    toast({ title: "Program Updated" });
  };

  const deleteProgram = (schoolId: string, programId: string) => {
    setProgramsBySchool(prev => ({
      ...prev,
      [schoolId]: prev[schoolId].filter(p => p.id !== programId),
    }));
    toast({ title: "Program Deleted", variant: "destructive" });
  };

  const addDepartment = (schoolId: string, programId: string, department: Omit<Department, "id" | "classes">) => {
    const newDepartment = { ...department, id: `dept_${Date.now()}`, classes: [] };
    setProgramsBySchool(prev => ({
      ...prev,
      [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: [...(p.departments || []), newDepartment] } : p),
    }));
    toast({ title: "Department Added" });
  };

  const updateDepartment = (schoolId: string, programId: string, updatedDepartment: Department) => {
      setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.map(d => d.id === updatedDepartment.id ? updatedDepartment : d) } : p),
      }));
      toast({ title: "Department Updated" });
  };

  const deleteDepartment = (schoolId: string, programId: string, departmentId: string) => {
      setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.filter(d => d.id !== departmentId) } : p),
      }));
      toast({ title: "Department Deleted", variant: "destructive" });
  };

  const addClass = (schoolId: string, programId: string, departmentId: string, cls: Omit<Class, "id">) => {
      const newClass = { ...cls, id: `cls_${Date.now()}` };
      setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.map(d => d.id === departmentId ? { ...d, classes: [...(d.classes || []), newClass] } : d) } : p),
      }));
      toast({ title: "Class Added" });
  };
  
  const updateClass = (schoolId: string, programId: string, departmentId: string, updatedClass: Class) => {
    setProgramsBySchool(prev => ({
      ...prev,
      [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.map(d => d.id === departmentId ? { ...d, classes: d.classes.map(c => c.id === updatedClass.id ? updatedClass : c) } : d) } : p),
    }));
    toast({ title: "Class Updated" });
  };

  const deleteClass = (schoolId: string, programId: string, departmentId: string, classId: string) => {
    setProgramsBySchool(prev => ({
      ...prev,
      [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.map(d => d.id === departmentId ? { ...d, classes: d.classes.filter(c => c.id !== classId) } : d) } : p),
    }));
    toast({ title: "Class Deleted", variant: "destructive" });
  };
  
  const addStudent = (studentData: Omit<Student, "id">) => {
    if (students.some(s => s.rollNo === studentData.rollNo)) {
        toast({ title: "Student Exists", description: "A student with this roll number already exists.", variant: "destructive" });
        return;
    }
    const newStudent: Student = { ...studentData, id: studentData.rollNo, deviceId: generateDeviceId(), avatar: `https://picsum.photos/seed/${studentData.rollNo}/200` };
    setStudents(prev => [...prev, newStudent]);
    toast({ title: "Student Added" });
  };

  const bulkAddStudents = (newStudents: Omit<Student, "id" | 'avatar' | 'deviceId'>[]) => {
    const studentMap = new Map<string, Student>();
    
    students.forEach(s => {
      studentMap.set(s.rollNo, s);
    });
    
    newStudents.forEach(s => {
      studentMap.set(s.rollNo, {
          ...s,
          id: s.rollNo,
          deviceId: generateDeviceId(),
          avatar: `https://picsum.photos/seed/${s.rollNo}/200`
      });
    });

    const studentsToSet = Array.from(studentMap.values());
    setStudents(studentsToSet);

    toast({
      title: "Student List Updated",
      description: `${newStudents.length} students were added or updated.`,
    });
  };

  const updateStudent = (updatedStudent: Student) => {
    if (updatedStudent.id !== updatedStudent.rollNo) {
        toast({ title: "Update Failed", description: "Roll No cannot be changed as it is the primary key.", variant: "destructive" });
        setStudents(prev => [...prev]);
        return;
    }

    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));

    if (updatedStudent.id === userDetails.id) {
        setUserDetails(updatedStudent);
    }
    toast({ title: "Student Updated" });
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setProgramsBySchool(prev => {
        const newProgramsBySchool = { ...prev };
        for (const schoolId in newProgramsBySchool) {
            newProgramsBySchool[schoolId] = newProgramsBySchool[schoolId].map(program => ({
                ...program,
                departments: program.departments.map(department => ({
                    ...department,
                    classes: department.classes.map(cls => ({
                        ...cls,
                        students: cls.students.filter(s => s.id !== studentId),
                    })),
                })),
            }));
        }
        return newProgramsBySchool;
    });
    toast({ title: "Student Deleted", variant: "destructive" });
  };

  const addStudentToClass = (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      setProgramsBySchool(prev => {
          const newProgramsBySchool = { ...prev };
          const school = newProgramsBySchool[schoolId];
          if (!school) return prev;
          
          const program = school.find(p => p.id === programId);
          if (!program) return prev;

          const department = program.departments.find(d => d.id === departmentId);
          if (!department) return prev;

          const cls = department.classes.find(c => c.id === classId);
          if (!cls) return prev;

          if (cls.students.some(s => s.id === studentId)) {
              toast({ title: "Student already enrolled", variant: "destructive" });
              return prev;
          }

          cls.students.push(student);
          toast({ title: "Student Added to Class" });
          return { ...newProgramsBySchool };
      });
  };

  const removeStudentFromClass = (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => {
      setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.map(d => d.id === departmentId ? { ...d, classes: d.classes.map(c => c.id === classId ? { ...c, students: c.students.filter(s => s.id !== studentId) } : c) } : d) } : p),
      }));
      toast({ title: "Student Removed from Class", variant: "destructive" });
  };
  
  const addFaculty = (facultyData: Omit<Faculty, 'id'>) => {
      if (faculties.some(f => f.email.toLowerCase() === facultyData.email.toLowerCase())) {
          toast({ title: "Faculty Exists", description: "A faculty member with this email already exists.", variant: "destructive" });
          return;
      }
      const newFaculty: Faculty = { ...facultyData, id: `faculty_${Date.now()}` };
      setFaculties(prev => [...prev, newFaculty]);
      toast({ title: "Faculty Member Added" });
  };
  
  const bulkAddFaculty = (newFaculty: Omit<Faculty, "id" | "avatar">[]) => {
    const facultyMap = new Map<string, Faculty>();
    faculties.forEach(f => facultyMap.set(f.email.toLowerCase(), f));

    newFaculty.forEach(f => {
        facultyMap.set(f.email.toLowerCase(), {
            ...f,
            id: `faculty_${Date.now()}_${Math.random()}`,
            avatar: `https://picsum.photos/seed/${f.email}/200`
        });
    });

    setFaculties(Array.from(facultyMap.values()));
    toast({
      title: "Faculty List Updated",
      description: `${newFaculty.length} faculty members were added or updated.`,
    });
  };

  const updateFaculty = (updatedFaculty: Faculty) => {
      setFaculties(prev => prev.map(f => f.id === updatedFaculty.id ? updatedFaculty : f));
      toast({ title: "Faculty Member Updated" });
  };
  
  const deleteFaculty = (facultyId: string) => {
      setFaculties(prev => prev.filter(f => f.id !== facultyId));
      setProgramsBySchool(prev => {
          const newProgramsBySchool = { ...prev };
          for (const schoolId in newProgramsBySchool) {
              newProgramsBySchool[schoolId] = newProgramsBySchool[schoolId].map(program => ({
                  ...program,
                  departments: program.departments.map(department => ({
                      ...department,
                      classes: department.classes.map(cls => ({
                          ...cls,
                          faculties: cls.faculties.filter(f => f.id !== facultyId),
                      })),
                  })),
              }));
          }
          return newProgramsBySchool;
      });
      toast({ title: "Faculty Member Deleted", variant: "destructive" });
  };
  
  const addFacultyToClass = (schoolId: string, programId: string, departmentId: string, classId: string, facultyId: string) => {
    const faculty = faculties.find(f => f.id === facultyId);
    if (!faculty) return;

    setProgramsBySchool(prev => {
        const newPrograms = {...prev};
        const program = newPrograms[schoolId]?.find(p => p.id === programId);
        const department = program?.departments.find(d => d.id === departmentId);
        const cls = department?.classes.find(c => c.id === classId);

        if (cls) {
            if (cls.faculties.some(f => f.id === facultyId)) {
                setTimeout(() => toast({ title: "Faculty already assigned", variant: "destructive" }), 0);
                return prev;
            }
            cls.faculties.push(faculty);
            setTimeout(() => toast({ title: "Faculty Assigned to Class" }), 0);
        }
        return newPrograms;
    });
  };

  const addFacultyToClassById = (classId: string, facultyId: string) => {
    const faculty = faculties.find(f => f.id === facultyId);
    if (!faculty) return;

    setProgramsBySchool(prev => {
        const newState = { ...prev };
        let classFound = false;

        for (const schoolId in newState) {
            if(classFound) break;
            for (const program of newState[schoolId]) {
                if(classFound) break;
                for (const department of program.departments) {
                    if(classFound) break;
                    const cls = department.classes.find(c => c.id === classId);
                    if (cls) {
                        if (cls.faculties.some(f => f.id === facultyId)) {
                            setTimeout(() => {
                                toast({ title: "Faculty already assigned to this class.", variant: "destructive" });
                            }, 0);
                        } else {
                            cls.faculties.push(faculty);
                            setTimeout(() => {
                                toast({ title: "Faculty Assigned", description: `${faculty.name} assigned to ${cls.name}.` });
                            }, 0);
                        }
                        classFound = true;
                        break;
                    }
                }
            }
        }
        return newState;
    });
  };

  const removeFacultyFromClass = (schoolId: string, programId: string, departmentId: string, classId: string, facultyId: string) => {
      setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.map(d => d.id === departmentId ? { ...d, classes: d.classes.map(c => c.id === classId ? { ...c, faculties: c.faculties.filter(f => f.id !== facultyId) } : c) } : d) } : p),
      }));
      toast({ title: "Faculty Removed from Class", variant: "destructive" });
  };

  const assignFacultyToClassesFromTimetable = (
    faculty: Faculty,
    classes: Partial<Class>[]
  ) => {
    let assignedCount = 0;
    let createdCount = 0;
  
    setProgramsBySchool((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
  
      for (const schoolId in newState) {
        newState[schoolId].forEach((program: Program) => {
          program.departments.forEach(department => {
            department.classes.forEach(cls => {
              cls.faculties = cls.faculties.filter(
                (f: Faculty) => f.id !== faculty.id
              );
            });
          });
        });
      }
  
      for (const newClassData of classes) {
        let classAssigned = false;
        for (const schoolId in newState) {
          if (classAssigned) break;
          for (const program of newState[schoolId]) {
            if (classAssigned) break;
            for (const department of program.departments) {
              if (classAssigned) break;
              for (const cls of department.classes) {
                if (
                  cls.name.toLowerCase() === newClassData.name?.toLowerCase() &&
                  cls.day.toLowerCase() === newClassData.day?.toLowerCase() &&
                  cls.startTime === newClassData.startTime
                ) {
                  if (!cls.faculties.some((f: Faculty) => f.id === faculty.id)) {
                    cls.faculties.push(faculty);
                    assignedCount++;
                  }
                  classAssigned = true;
                  break;
                }
              }
            }
          }
        }
  
        if (!classAssigned && newClassData.name && newClassData.day && newClassData.startTime && newClassData.endTime) {
          let targetDepartment: Department | undefined;
          let targetSchoolId: string | undefined;
          let targetProgramId: string | undefined;

          for (const schoolId in newState) {
             for (const program of newState[schoolId]) {
                const dept = program.departments.find(d => d.name.toLowerCase() === faculty.department.toLowerCase());
                if (dept) {
                    targetDepartment = dept;
                    targetSchoolId = schoolId;
                    targetProgramId = program.id;
                    break;
                }
             }
             if (targetDepartment) break;
          }
          
          if(targetDepartment && targetSchoolId && targetProgramId) {
             const newClass: Class = {
                id: `cls_${Date.now()}_${Math.random()}`,
                name: newClassData.name,
                coordinator: newClassData.coordinator || 'N/A',
                day: newClassData.day,
                startTime: newClassData.startTime,
                endTime: newClassData.endTime,
                totalClasses: newClassData.totalClasses || 20,
                students: [],
                faculties: [faculty],
            };
            
            const programIndex = newState[targetSchoolId].findIndex((p: Program) => p.id === targetProgramId);
            if(programIndex !== -1) {
                const deptIndex = newState[targetSchoolId][programIndex].departments.findIndex((d: Department) => d.id === targetDepartment!.id);
                if(deptIndex !== -1) {
                     newState[targetSchoolId][programIndex].departments[deptIndex].classes.push(newClass);
                     createdCount++;
                     assignedCount++;
                }
            }
          }
        }
      }
  
      setTimeout(() => {
        if (assignedCount > 0) {
          toast({
            title: "Timetable Processed",
            description: `${faculty.name} was assigned to ${assignedCount} class(es). ${createdCount} new class(es) were created.`,
          });
        } else {
          toast({
            title: "No Classes Updated",
            description: `Could not find any matching or new classes for ${faculty.name}. Ensure the faculty's department exists.`,
            variant: "destructive",
          });
        }
      }, 0);
  
      return newState;
    });
  };
  
  const recordClassAttendance = (cls: Class, presentStudentIds: string[], absentStudentIds: string[]) => {
      const today = new Date().toISOString();
      setAttendance(prev => {
        const newAttendance = { ...prev };

        if (!newAttendance[cls.id]) {
            newAttendance[cls.id] = [];
        }
        
        const otherDaysRecords = newAttendance[cls.id].filter(rec => new Date(rec.date).toDateString() !== new Date(today).toDateString());
        const todayRecords: AttendanceRecord[] = [];

        presentStudentIds.forEach(studentId => {
            const checkInTime = new Date();
            const [startHour, startMinute] = cls.startTime.split(':').map(Number);
            checkInTime.setHours(startHour, startMinute, 0, 0);

            const checkOutTime = new Date();
            const [endHour, endMinute] = cls.endTime.split(':').map(Number);
            checkOutTime.setHours(endHour, endMinute, 0, 0);

            todayRecords.push({
                id: `att_${studentId}_${Date.now()}`,
                date: today,
                checkIn: checkInTime.toISOString(),
                checkOut: checkOutTime.toISOString(),
                isAnomaly: false,
                anomalyReason: '',
                studentId: studentId,
            });
        });
        
        newAttendance[cls.id] = [...otherDaysRecords, ...todayRecords];
        return newAttendance;
      });
  }

  const startClassAttendance = (cls: Class) => {
    toast({
      title: "Attendance Session Started",
      description: `You can now mark attendance for ${cls.name}.`,
    });
  };
  
  const requestCameraPermission = async (videoRefCurrent: HTMLVideoElement | null, autoStart = false) => {
    let stream: MediaStream | null = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (autoStart && videoRefCurrent) {
            videoRefCurrent.srcObject = stream;
        }
        return stream;
    } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings.",
        });
        return null;
    }
  };

  const stopCameraStream = (stream: MediaStream | null, videoRefCurrent: HTMLVideoElement | null) => {
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
      }
      if (videoRefCurrent) {
          videoRefCurrent.srcObject = null;
      }
  }


  const value: AppContextType = {
    subjects,
    attendance,
    wifiZones,
    activeCheckIn,
    userDetails,
    isLoaded,
    mode,
    schools,
    programsBySchool,
    students,
    faculties,
    facultyClasses,
    login,
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
    updateUserDetails: updateUserDetails as any,
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
    addStudent,
    bulkAddStudents: bulkAddStudents as any,
    updateStudent,
    deleteStudent,
    addStudentToClass,
    removeStudentFromClass,
    addFaculty,
    bulkAddFaculty: bulkAddFaculty as any,
    updateFaculty,
    deleteFaculty,
    addFacultyToClass,
    addFacultyToClassById,
    removeFacultyFromClass,
    assignFacultyToClassesFromTimetable,
    recordClassAttendance,
    startClassAttendance,
    requestCameraPermission,
    stopCameraStream,
    hasCameraPermission,
    setHasCameraPermission
  };

  return <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

    