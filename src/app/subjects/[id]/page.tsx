

"use client";

import { useAppContext } from "@/contexts/app-context";
import { AttendanceTable } from "@/components/subjects/attendance-table";
import { FacultyAttendanceTable } from "@/components/subjects/faculty-attendance-table";
import { notFound, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Play, Pause } from "lucide-react";
import type { Class, Subject } from "@/lib/types";

export default function SubjectDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { subjects, attendance, isLoaded, mode, programsBySchool } = useAppContext();
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  
  const subjectClass = useMemo(() => {
    if (!isLoaded) return undefined;

    let foundClass: Class | undefined;
    const dayMap: { [key: string]: number } = { 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0 };


    for (const schoolId in programsBySchool) {
      for (const program of programsBySchool[schoolId]) {
        for (const department of program.departments) {
          const matchedClass = department.classes.find(c => c.id === id);
          if (matchedClass) {
            foundClass = matchedClass;
            break;
          }
        }
        if (foundClass) break;
      }
      if (foundClass) break;
    }
    
    if (!foundClass && mode === 'student') {
        const manualSubject = subjects.find(s => s.id === id);
        if (manualSubject) {
             // Create a Class-like object from a Subject
             foundClass = {
                id: manualSubject.id,
                name: manualSubject.name,
                startTime: manualSubject.expectedCheckIn,
                endTime: manualSubject.expectedCheckOut,
                day: Object.keys(dayMap).find(key => dayMap[key] === manualSubject.dayOfWeek) || 'Monday',
                coordinator: 'N/A',
                students: [], // Manual subjects don't have a roster
                faculties: []
            };
        }
    }
    
    return foundClass;

  }, [id, isLoaded, programsBySchool, mode, subjects]);


  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }
  
  if (!subjectClass) {
    notFound();
  }
  
  const subjectAttendance = attendance[id] || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{subjectClass.name}</h2>
          <p className="text-muted-foreground">
            {mode === 'faculty' 
              ? `Class attendance for ${new Date().toLocaleDateString()}` 
              : `Detailed attendance log for your enrollment in this class.`
            }
          </p>
        </div>
        {mode === 'faculty' && (
            <Button onClick={() => setIsAttendanceActive(!isAttendanceActive)} variant={isAttendanceActive ? "destructive" : "default"}>
                {isAttendanceActive ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
                {isAttendanceActive ? "Stop Attendance" : "Start Attendance"}
            </Button>
        )}
      </div>

      {mode === 'faculty' ? (
        <FacultyAttendanceTable subject={subjectClass} isAttendanceActive={isAttendanceActive} />
      ) : (
        <AttendanceTable subject={subjectClass} records={subjectAttendance} />
      )}
    </div>
  );
}

    

    