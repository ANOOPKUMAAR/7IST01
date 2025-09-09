
"use client";

import React from "react";
import { useAppContext } from "@/contexts/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useMemo } from "react";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export function Timetable() {
  const { subjects, attendance, isLoaded } = useAppContext();

  const getAttendanceStatus = (subjectId: string) => {
    const today = new Date();
    const subjectAttendance = attendance[subjectId] || [];
    const todayRecord = subjectAttendance.find(rec => new Date(rec.date).toDateString() === today.toDateString());

    if (todayRecord) {
        return todayRecord.isAnomaly ? "bg-status-red/20 border-status-red" : "bg-status-green/20 border-status-green";
    }

    const totalAttended = subjectAttendance.length;
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return 'bg-muted/50';

    const missedClasses = Math.max(0, subject.totalClasses - totalAttended);
    const requiredAttendance = Math.ceil(0.75 * subject.totalClasses);
    
    if (totalAttended < requiredAttendance && (subject.totalClasses - missedClasses) < requiredAttendance) {
        return "bg-status-red/20 border-status-red";
    }

    return 'bg-muted/50';
  };
  
  const grid = useMemo(() => {
    const newGrid = Array(timeSlots.length - 1).fill(0).map(() => Array(daysOfWeek.length).fill(null));
    subjects.forEach(subject => {
      const startHour = parseInt(subject.expectedCheckIn.split(':')[0]);
      const endHour = Math.ceil(parseInt(subject.expectedCheckOut.split(':')[0]) + parseInt(subject.expectedCheckOut.split(':')[1]) / 60);
      
      const startIndex = timeSlots.findIndex(slot => parseInt(slot.split(':')[0]) === startHour);

      if (startIndex !== -1) {
        const duration = Math.max(1, endHour - startHour);
        for(let i = 0; i < duration; i++) {
            if (startIndex + i < newGrid.length) {
                newGrid[startIndex + i][subject.dayOfWeek] = {
                    ...subject,
                    isStart: i === 0,
                    duration: duration,
                };
            }
        }
      }
    });
    return newGrid;
  }, [subjects]);


  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
        <CardDescription>Your class schedule for the week. Click on a subject to view details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1">
          <div />
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-bold p-2 text-sm">
              {day}
            </div>
          ))}

          {grid.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="text-right p-2 text-xs text-muted-foreground pr-4">{timeSlots[rowIndex]} - {timeSlots[rowIndex+1]}</div>
              {row.map((subject, colIndex) => {
                if (!subject) {
                  return <div key={`${rowIndex}-${colIndex}`} className="border-t border-l" />;
                }
                
                if (!subject.isStart) {
                    return null;
                }

                return (
                  <div key={`${rowIndex}-${colIndex}`} className={cn(`border-t border-l p-2 rounded-md`, getAttendanceStatus(subject.id))} style={{ gridRow: `span ${subject.duration}`}}>
                    <Link href={`/subjects/${subject.id}`} className="flex flex-col h-full">
                        <p className="font-semibold text-sm">{subject.name}</p>
                        <p className="text-xs text-muted-foreground mt-auto">{subject.expectedCheckIn} - {subject.expectedCheckOut}</p>
                    </Link>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
