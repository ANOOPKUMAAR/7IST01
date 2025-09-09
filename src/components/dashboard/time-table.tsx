
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { Subject } from "@/lib/types";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function Timetable() {
  const { subjects, isLoaded } = useAppContext();
  const [currentDay, setCurrentDay] = useState<number>(-1);

  useEffect(() => {
    setCurrentDay(new Date().getDay());
  }, []);

  const { timeSlots, subjectsByTimeAndDay } = useMemo(() => {
    if (!subjects) return { timeSlots: [], subjectsByTimeAndDay: {} };
    
    const allTimes = new Set<string>();
    subjects.forEach(subject => {
        allTimes.add(subject.expectedCheckIn);
    });

    const timeSlots = Array.from(allTimes).sort();

    const subjectsByTimeAndDay: { [time: string]: { [day: number]: Subject[] } } = {};

    timeSlots.forEach(time => {
        subjectsByTimeAndDay[time] = {};
        for (let i = 0; i < 7; i++) {
            subjectsByTimeAndDay[time][i] = [];
        }
    });

    subjects.forEach(subject => {
        if (subjectsByTimeAndDay[subject.expectedCheckIn]) {
            if(subjectsByTimeAndDay[subject.expectedCheckIn][subject.dayOfWeek]){
                subjectsByTimeAndDay[subject.expectedCheckIn][subject.dayOfWeek].push(subject);
            }
        }
    });

    return { timeSlots, subjectsByTimeAndDay };
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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-24 font-bold text-center">Time</TableHead>
                    {daysOfWeek.map((day, index) => (
                        <TableHead key={day} className={cn("text-center font-bold", index === currentDay && "text-primary")}>{day}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {timeSlots.length > 0 ? timeSlots.map(time => (
                    <TableRow key={time}>
                        <TableCell className="font-semibold text-center">{time}</TableCell>
                        {daysOfWeek.map((day, index) => {
                           const daySubjects = subjectsByTimeAndDay[time]?.[index] || [];
                           return (
                                <TableCell key={`${time}-${day}`} className={cn("h-24 align-top", index === currentDay && "bg-muted/50")}>
                                    <div className="space-y-1">
                                        {daySubjects.map(subject => (
                                            <Link href={`/subjects/${subject.id}`} key={subject.id}>
                                                <div className="p-2 rounded-md bg-background hover:bg-card-foreground/10 transition-colors shadow-sm border">
                                                    <p className="font-semibold text-sm">{subject.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{subject.expectedCheckIn} - {subject.expectedCheckOut}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </TableCell>
                           )
                        })}
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                            No subjects scheduled in your timetable. Add some in the settings.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
