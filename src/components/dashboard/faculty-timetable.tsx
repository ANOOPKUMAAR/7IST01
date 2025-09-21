"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { Class } from "@/lib/types";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayNameToIndex: { [key: string]: number } = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
};


export function FacultyTimetable() {
  const { facultyClasses, isLoaded } = useAppContext();
  const [currentDay, setCurrentDay] = useState<number>(-1);

  useEffect(() => {
    setCurrentDay(new Date().getDay());
  }, []);

  const { timeSlots, classesByTimeAndDay } = useMemo(() => {
    const allTimes = new Set<string>();
    facultyClasses.forEach(cls => allTimes.add(cls.startTime));
    const timeSlots = Array.from(allTimes).sort();

    const classesByTimeAndDay: { [time: string]: { [day: number]: Class[] } } = {};
    timeSlots.forEach(time => {
        classesByTimeAndDay[time] = {};
        for (let i = 0; i < 7; i++) {
            classesByTimeAndDay[time][i] = [];
        }
    });

    facultyClasses.forEach(cls => {
        const dayIndex = dayNameToIndex[cls.day.toLowerCase()];
        if (classesByTimeAndDay[cls.startTime] && dayIndex !== undefined) {
            classesByTimeAndDay[cls.startTime][dayIndex].push(cls);
        }
    });

    return { timeSlots, classesByTimeAndDay };
  }, [facultyClasses]);

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
        <CardTitle>Timetable</CardTitle>
        <CardDescription>Your class schedule for the week. Click on a class to manage attendance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-24 font-bold text-center border-r">Time</TableHead>
                        {daysOfWeek.map((day, index) => (
                            <TableHead key={day} className={cn("text-center font-bold", index === currentDay && "text-primary bg-muted/30")}>{day}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {timeSlots.length > 0 ? timeSlots.map(time => (
                        <TableRow key={time}>
                            <TableCell className="font-semibold text-center align-middle border-r">{time}</TableCell>
                            {daysOfWeek.map((_, index) => {
                               const dayClasses = classesByTimeAndDay[time]?.[index] || [];
                               return (
                                    <TableCell key={`${time}-${index}`} className={cn("h-24 align-top p-1", index === currentDay && "bg-muted/30")}>
                                        <div className="space-y-1">
                                            {dayClasses.map(cls => (
                                                <Link href={`/faculty/classes/${cls.id}`} key={cls.id} className="block">
                                                    <div className="p-2 rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm border">
                                                        <p className="font-semibold text-sm leading-tight">{cls.name}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{cls.startTime} - {cls.endTime}</p>
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
                                No classes are assigned to you in the timetable.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
