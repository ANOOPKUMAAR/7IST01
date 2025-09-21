
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
  const { attendance, isLoaded, mode, programsBySchool, subjects: contextSubjects, students, userDetails } = useAppContext();
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  
  const subjectClass = useMemo(() => {
    if (!isLoaded) return undefined;

    let foundClass: Class | undefined;

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
    
    if (foundClass) {
      return foundClass;
    }

    // Fallback for manually added student subjects
    if (mode === 'student') {
        const manualSubject = contextSubjects.find(s => s.id === id);
        if(manualSubject) {
            // Convert a Subject to a Class-like object for compatibility
            const studentDetails = students.find(s => s.rollNo === userDetails.rollNo);
            return {
                id: manualSubject.id,
                name: manualSubject.name,
                coordinator: 'N/A',
                students: studentDetails ? [studentDetails] : [],
                day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][manualSubject.dayOfWeek],
                startTime: manualSubject.expectedCheckIn,
                endTime: manualSubject.expectedCheckOut,
                faculties: [],
            };
        }
    }

    return undefined;

  }, [id, isLoaded, programsBySchool, mode, contextSubjects, students, userDetails]);


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

    