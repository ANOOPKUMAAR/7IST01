
"use client";

import React, { useState, useEffect } from "react";
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
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoaded) return;

    const today = new Date();
    const newStatusMap: Record<string, string> = {};
    
    subjects.forEach(subject => {
      const subjectAttendance = attendance[subject.id] || [];
      const todayRecord = subjectAttendance.find(rec => new Date(rec.date).toDateString() === today.toDateString());

      if (todayRecord) {
        newStatusMap[subject.id] = todayRecord.isAnomaly ? "bg-status-red/20 border-status-red" : "bg-status-green/20 border-status-green";
      } else {
        const totalAttended = subjectAttendance.length;
        const missedClasses = Math.max(0, subject.totalClasses - totalAttended);
        const requiredAttendance = Math.ceil(0.75 * subject.totalClasses);
        
        if (totalAttended < requiredAttendance && (subject.totalClasses - missedClasses) < requiredAttendance) {
            newStatusMap[subject.id] = "bg-status-red/20 border-status-red";
        } else {
            newStatusMap[subject.id] = 'bg-muted/50';
        }
      }
    });

    setAttendanceStatusMap(newStatusMap);
  }, [subjects, attendance, isLoaded]);

  const getAttendanceStatus = (subjectId: string) => {
    return attendanceStatusMap[subjectId] || 'bg-muted/50';
  };
  
  const grid = useMemo(() => {
    const newGrid = Array(daysOfWeek.length).fill(0).map(() => Array(timeSlots.length - 1).fill(null));

    subjects.forEach(subject => {
        const startHour = parseInt(subject.expectedCheckIn.split(':')[0]);
        const endHour = Math.ceil(parseInt(subject.expectedCheckOut.split(':')[0]) + parseInt(subject.expectedCheckOut.split(':')[1]) / 60);
        
        const dayIndex = subject.dayOfWeek;
        const startIndex = timeSlots.findIndex(slot => parseInt(slot.split(':')[0]) === startHour);

        if (dayIndex >= 0 && dayIndex < daysOfWeek.length && startIndex !== -1) {
            const duration = Math.max(1, endHour - startHour);
            for(let i = 0; i < duration; i++) {
                if (startIndex + i < newGrid[dayIndex].length) {
                    newGrid[dayIndex][startIndex + i] = {
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
        <div className="grid grid-cols-[auto_repeat(10,1fr)] gap-1">
          <div />
          {timeSlots.slice(0, -1).map(time => (
            <div key={time} className="text-center font-bold p-2 text-sm">
              {time}
            </div>
          ))}

          {grid.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="text-right p-2 text-sm font-bold pr-4">{daysOfWeek[rowIndex]}</div>
              {row.map((subject, colIndex) => {
                if (!subject) {
                  return <div key={`${rowIndex}-${colIndex}`} className="border-t border-l min-h-24" />;
                }
                
                if (!subject.isStart) {
                    return null;
                }

                return (
                  <div key={`${rowIndex}-${colIndex}`} className={cn(`border-t border-l p-2 rounded-md`, getAttendanceStatus(subject.id))} style={{ gridColumn: `span ${subject.duration}`}}>
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
