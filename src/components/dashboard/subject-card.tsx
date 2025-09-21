"use client";

import Link from "next/link";
import type { Subject } from "@/lib/types";
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
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const { attendance, activeCheckIn } = useAppContext();
  const subjectAttendance = attendance[subject.id] || [];
  const attendedClasses = subjectAttendance.length;

  const attendancePercentage = useMemo(() => {
    if (subject.totalClasses === 0) return 0;
    return Math.round((attendedClasses / subject.totalClasses) * 100);
  }, [attendedClasses, subject.totalClasses]);

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
          Expected: {subject.expectedCheckIn} - {subject.expectedCheckOut}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Attendance</span>
            <span>{attendedClasses} / {subject.totalClasses} classes</span>
          </div>
          <Progress value={attendancePercentage} indicatorClassName={getProgressColor()} />
          <p className="text-right text-lg font-bold">{attendancePercentage}%</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" asChild className="w-full">
            <Link href={`/subjects/${subject.id}`}>
                View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
