
"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  const getSubjectsForDay = (dayIndex: number): Subject[] => {
    return subjects
      .filter(subject => subject.dayOfWeek === dayIndex)
      .sort((a, b) => a.expectedCheckIn.localeCompare(b.expectedCheckIn));
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {daysOfWeek.map((day, index) => {
            const daySubjects = getSubjectsForDay(index);
            const isToday = index === currentDay;

            return (
              <div key={day} className={cn("rounded-lg", isToday ? "bg-secondary border-2 border-primary" : "bg-muted/50")}>
                <h3 className={cn("font-bold text-center p-2 rounded-t-lg", isToday ? "bg-primary/20" : "bg-muted")}>{day}</h3>
                <div className="p-2 space-y-2 min-h-48">
                  {daySubjects.length > 0 ? (
                    daySubjects.map(subject => (
                      <Link href={`/subjects/${subject.id}`} key={subject.id}>
                        <div className="p-2 rounded-md bg-background hover:bg-card-foreground/10 transition-colors shadow-sm border">
                          <p className="font-semibold text-sm">{subject.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{subject.expectedCheckIn} - {subject.expectedCheckOut}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">No classes</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
