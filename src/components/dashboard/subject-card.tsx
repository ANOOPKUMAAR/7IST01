"use client";

import Link from "next/link";
import type { Subject, Class } from "@/lib/types";
import { useAppContext } from "@/contexts/app-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, ArrowRight } from "lucide-react";
import { useMemo } from "react";

interface SubjectCardProps {
  subject: Subject | Class;
}

function getSubjectProps(subject: Subject | Class) {
    if ('coordinator' in subject) { // It's a Class
        return {
            checkIn: subject.startTime,
            checkOut: subject.endTime,
            totalClasses: 20, // Placeholder
        };
    }
    // It's a Subject
    return {
        checkIn: subject.expectedCheckIn,
        checkOut: subject.expectedCheckOut,
        totalClasses: subject.totalClasses,
    };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const { attendance, activeCheckIn, checkIn, checkOut } = useAppContext();
  const subjectAttendance = attendance[subject.id] || [];
  const attendedClasses = subjectAttendance.length;

  const { checkIn: expectedCheckIn, checkOut: expectedCheckOut, totalClasses } = getSubjectProps(subject);
  const finalTotalClasses = totalClasses > 0 ? totalClasses : attendedClasses || 1;
  
  const attendancePercentage = useMemo(() => {
    if (finalTotalClasses === 0) return 0;
    return Math.round((attendedClasses / finalTotalClasses) * 100);
  }, [attendedClasses, finalTotalClasses]);

  const isCurrentlyCheckedIn = activeCheckIn?.subjectId === subject.id;
  
  const getProgressColor = () => {
    if (attendancePercentage < 75) return "bg-status-red";
    if (attendancePercentage >= 75 && attendancePercentage < 85) return "bg-status-orange";
    return "bg-status-green";
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{subject.name}</CardTitle>
            {isCurrentlyCheckedIn && <Badge variant="default">Checked In</Badge>}
        </div>
        <CardDescription>
          Expected: {expectedCheckIn} - {expectedCheckOut}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Attendance</span>
            <span>{attendedClasses} / {totalClasses} classes</span>
          </div>
          <Progress value={attendancePercentage} indicatorClassName={getProgressColor()} />
          <p className="text-right text-lg font-bold">{attendancePercentage}%</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isCurrentlyCheckedIn ? (
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => checkOut(subject.id)}
          >
            <LogOut className="mr-2 h-4 w-4" /> Check Out
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => checkIn(subject.id)}
            disabled={!!activeCheckIn}
          >
            <LogIn className="mr-2 h-4 w-4" /> Check In
          </Button>
        )}
        <Button variant="outline" asChild>
            <Link href={`/subjects/${subject.id}`}>
                Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
