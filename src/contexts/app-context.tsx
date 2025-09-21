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
} from "@/lib/types";
import { checkAttendanceAnomaly } from "@/actions/attendance-actions";
import { useRouter } from "next/navigation";
import {
  initialSchools,
  initialProgramsBySchool,
  mockStudents,
} from "@/lib/school-data";

interface AppContextType {
  subjects: Subject[];
  attendance: Record<string, AttendanceRecord[]>;
  wifiZones: WifiZone[];
  activeCheckIn: ActiveCheckIn | null;
  userDetails: UserDetails;
  isLoaded: boolean;
  mode: UserMode | null;
  schools: School[];
  programsBySchool: Record<string, Program[]>;
  students: Student[];
  setMode: (mode: UserMode) => void;
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
  bulkAddStudents: (newStudents: Omit<Student, "id">[]) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  addStudentToClass: (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => void;
  removeStudentFromClass: (schoolId: string, programId: string, departmentId: string, classId: string, studentId: string) => void;
  addFacultyToClass: (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => void;
  removeFacultyFromClass: (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => void;
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

const initialUserDetails: Omit<UserDetails, 'deviceId' | 'avatar' | 'id'> = {
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
  const [userDetails, setUserDetails] = useState<UserDetails>({ ...initialUserDetails, id: 'user1', deviceId: '', avatar: '' });
  const [mode, setModeState] = useState<UserMode | null>(null);
  
  const [schools, setSchools] = useState<School[]>([]);
  const [programsBySchool, setProgramsBySchool] = useState<Record<string, Program[]>>({});
  const [students, setStudents] = useState<Student[]>([]);
  
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
    };
  }, [subjectsState, attendance, wifiZones, activeCheckIn, userDetails, mode, schools, programsBySchool, students]);
  
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
          userDetailsData = { ...initialUserDetails, id: 'user1', deviceId: generateDeviceId(), avatar: `https://picsum.photos/seed/${Math.random()}/200` };
      }
      setUserDetails(userDetailsData);
      
      setSubjectsState(storedSubjects ? JSON.parse(storedSubjects) : initialStudentSubjects);
      setAttendance(storedAttendance ? JSON.parse(storedAttendance) : generateInitialAttendance());
      setWifiZones(storedWifiZones ? JSON.parse(storedWifiZones) : initialWifiZones);
      setActiveCheckIn(storedActiveCheckIn ? JSON.parse(storedActiveCheckIn) : null);
      setModeState(storedMode ? JSON.parse(storedMode) : null);

      setSchools(storedSchools ? JSON.parse(storedSchools) : initialSchools);
      setProgramsBySchool(storedPrograms ? JSON.parse(storedPrograms) : initialProgramsBySchool);
      const allStudents = [
        { ...userDetails, id: 'user1'},
        ...mockStudents
      ];
      setStudents(storedStudents ? JSON.parse(storedStudents) : allStudents);

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      const deviceId = generateDeviceId();
      setUserDetails({ ...initialUserDetails, id: 'user1', deviceId, avatar: `https://picsum.photos/seed/${Math.random()}/200` });
      setSubjectsState(initialStudentSubjects);
      setAttendance(generateInitialAttendance());
      setWifiZones(initialWifiZones);
      setActiveCheckIn(null);
      setModeState(null);
      setSchools(initialSchools);
      setProgramsBySchool(initialProgramsBySchool);
      setStudents([
        { ...userDetails, id: 'user1'},
        ...mockStudents
      ]);
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
    if (newMode === 'student') {
        setSubjectsState(initialStudentSubjects);
        setAttendance(generateInitialAttendance());
    } else {
        setSubjectsState([]);
        setAttendance({});
    }
  };

  const logout = () => {
    setModeState(null);
    localStorage.removeItem("witrack_mode");
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
                // A reasonable default if totalClasses is not a property on Class
                totalClasses: 20, 
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

  const updateUserDetails = (details: Partial<Omit<UserDetails, 'deviceId' | 'id'>>) => {
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
  
  const addStudent = (student: Omit<Student, "id">) => {
    const newStudent = { ...student, id: `stu_${Date.now()}`, deviceId: generateDeviceId() };
    setStudents(prev => [...prev, newStudent]);
    toast({ title: "Student Added" });
  };

  const bulkAddStudents = (newStudents: Omit<Student, "id">[]) => {
    const studentsToAdd = newStudents.map(s => ({
      ...s,
      id: `stu_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      deviceId: generateDeviceId(),
      avatar: `https://picsum.photos/seed/${s.rollNo}/200`
    }));
    setStudents(prev => [...prev, ...studentsToAdd]);
    toast({ title: "Students Imported", description: `${studentsToAdd.length} new students have been imported.` });
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (updatedStudent.id === userDetails.id) {
        setUserDetails(updatedStudent);
    }
    toast({ title: "Student Updated" });
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    // Also remove from all classes
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

  const addFacultyToClass = (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => {
      setProgramsBySchool(prev => {
        const newProgramsBySchool = { ...prev };
        const program = newProgramsBySchool[schoolId]?.find(p => p.id === programId);
        const department = program?.departments.find(d => d.id === departmentId);
        const cls = department?.classes.find(c => c.id === classId);
        if (cls) {
            if (!cls.faculties.includes(facultyName)) {
                cls.faculties.push(facultyName);
                toast({ title: "Faculty Assigned" });
            } else {
                toast({ title: "Faculty already assigned", variant: "destructive" });
            }
        }
        return { ...newProgramsBySchool };
      });
  };

  const removeFacultyFromClass = (schoolId: string, programId: string, departmentId: string, classId: string, facultyName: string) => {
      setProgramsBySchool(prev => ({
        ...prev,
        [schoolId]: prev[schoolId].map(p => p.id === programId ? { ...p, departments: p.departments.map(d => d.id === departmentId ? { ...d, classes: d.classes.map(c => c.id === classId ? { ...c, faculties: c.faculties.filter(f => f !== facultyName) } : c) } : d) } : p),
      }));
      toast({ title: "Faculty Removed", variant: "destructive" });
  };

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
    bulkAddStudents,
    updateStudent,
    deleteStudent,
    addStudentToClass,
    removeStudentFromClass,
    addFacultyToClass,
    removeFacultyFromClass,
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
