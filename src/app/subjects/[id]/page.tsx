"use client";

import { useAppContext } from "@/contexts/app-context";
import { AttendanceTable } from "@/components/subjects/attendance-table";
import { FacultyAttendanceTable } from "@/components/subjects/faculty-attendance-table";
import { notFound, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function SubjectDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { subjects, attendance, isLoaded, mode } = useAppContext();
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  
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
  
  const subject = subjects.find(s => s.id === id);
  
  if (!subject) {
    notFound();
  }
  
  const subjectAttendance = attendance[id] || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{subject.name}</h2>
          <p className="text-muted-foreground">
            {mode === 'faculty' 
              ? `Class attendance for ${new Date().toLocaleDateString()}` 
              : `Detailed attendance log. Total classes: ${subject.totalClasses}.`
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
        <FacultyAttendanceTable subject={subject} isAttendanceActive={isAttendanceActive} />
      ) : (
        <AttendanceTable subject={subject} records={subjectAttendance} />
      )}
    </div>
  );
}
