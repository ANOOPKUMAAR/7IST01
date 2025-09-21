

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
  const { subjects, attendance, isLoaded, mode } = useAppContext();
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  
  const subjectOrClass = useMemo(() => {
    if (!isLoaded) return undefined;
    return subjects.find(s => s.id === id);
  }, [id, isLoaded, subjects]);

  const subjectAsClass = useMemo((): Class | undefined => {
    if (!subjectOrClass) return undefined;
    
    // Check if it's already a Class object (duck typing)
    if ('coordinator' in subjectOrClass && 'students' in subjectOrClass) {
        return subjectOrClass as Class;
    }

    // If it's a simple Subject, convert it to a Class-like object
    const dayMap: { [key: number]: string } = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 0: 'Sunday' };
    return {
        id: subjectOrClass.id,
        name: subjectOrClass.name,
        startTime: subjectOrClass.expectedCheckIn,
        endTime: subjectOrClass.expectedCheckOut,
        day: dayMap[subjectOrClass.dayOfWeek] || 'N/A',
        coordinator: 'N/A',
        students: [], // Manual subjects don't have a roster
        faculties: []
    };
  }, [subjectOrClass]);


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
  
  if (!subjectAsClass) {
    notFound();
  }
  
  const subjectAttendance = attendance[id] || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{subjectAsClass.name}</h2>
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
        <FacultyAttendanceTable subject={subjectAsClass} isAttendanceActive={isAttendanceActive} />
      ) : (
        <AttendanceTable subject={subjectAsClass} records={subjectAttendance} />
      )}
    </div>
  );
}

    

    
