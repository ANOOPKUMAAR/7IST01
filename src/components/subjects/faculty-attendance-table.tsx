
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Subject, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Check, Wifi, Loader2, Users, AlertTriangle } from 'lucide-react';
import { getAutomaticHeadcount } from "@/actions/attendance-actions";

type AttendanceStatus = "present" | "absent" | "unmarked";

function StudentAttendanceCard({ student, status, onStatusChange }: { student: Student, status: AttendanceStatus, onStatusChange: (studentId: string, status: AttendanceStatus) => void }) {
    
    const getStatusBadge = () => {
        switch (status) {
            case "present":
                return <Badge variant="secondary" className="bg-white/20 text-primary-foreground">Present</Badge>;
            case "absent":
                return <Badge variant="destructive" className="bg-white/20 text-primary-foreground">Absent</Badge>;
            default:
                return <Badge variant="outline">Unmarked</Badge>;
        }
    }

    return (
        <Card className={cn(
            "transition-colors",
            status === 'present' && 'bg-status-green text-primary-foreground',
            status === 'absent' && 'bg-status-red text-destructive-foreground',
        )}>
            <CardHeader className={cn(
                "flex flex-row items-center justify-between pb-2",
                 (status === 'present' || status === 'absent') && 'text-primary-foreground'
            )}>
                <div className="flex-1">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription className={cn(
                        status === 'present' && 'text-green-100',
                        status === 'absent' && 'text-red-100'
                    )}>
                        {student.rollNo}
                    </CardDescription>
                </div>
                {getStatusBadge()}
            </CardHeader>
            <CardFooter className="gap-2">
                <Button 
                    className="w-full"
                    size="sm" 
                    variant={'secondary'}
                    onClick={() => onStatusChange(student.id, "present")}
                >
                    Present
                </Button>
                <Button 
                    className="w-full"
                    size="sm" 
                    variant={'secondary'}
                    onClick={() => onStatusChange(student.id, "absent")}
                >
                    Absent
                </Button>
            </CardFooter>
        </Card>
    )
}

export function FacultyAttendanceTable({ subject }: { subject: Subject; }) {
  const { students } = useAppContext();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [autoHeadcount, setAutoHeadcount] = useState<number | null>(null);

  const presentCount = useMemo(() => {
    return Object.values(attendance).filter(s => s === 'present').length;
  }, [attendance]);
  
  const isMismatch = autoHeadcount !== null && autoHeadcount !== presentCount;

  const fetchHeadcount = async () => {
    setIsVerifying(true);
    try {
        const result = await getAutomaticHeadcount(subject.id, students.length);
        setAutoHeadcount(result.headcount);
    } catch (error) {
        toast({
            title: "Error Getting Headcount",
            description: "Could not get automatic headcount. Please try again.",
            variant: "destructive",
        });
        setAutoHeadcount(null);
    } finally {
        setIsVerifying(false);
    }
  };

  useEffect(() => {
    fetchHeadcount();
  }, []);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const handleSaveAttendance = () => {
    if (isMismatch) {
        toast({
            title: "Headcount Mismatch",
            description: `Automatic headcount (${autoHeadcount}) does not match marked present (${presentCount}). Please review attendance before saving.`,
            variant: "destructive",
            duration: 8000,
        });
        return;
    }

    toast({
      title: "Attendance Saved",
      description: "The attendance record for today's class has been saved.",
      action: (isMismatch || autoHeadcount === null) ? undefined : (
        <div className="flex items-center text-primary-foreground">
          <Check className="mr-2"/>
          <span>Verified</span>
        </div>
      ),
      variant: (autoHeadcount !== null && autoHeadcount === presentCount) ? "success" : "default"
    });
  }

  return (
    <div className="space-y-6">
        <Card className={cn(isMismatch && "border-destructive")}>
            <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <CardTitle>Attendance Verification</CardTitle>
                        <CardDescription>Compare the simulated Wi-Fi headcount with your manual count.</CardDescription>
                    </div>
                     <Button variant="outline" onClick={fetchHeadcount} disabled={isVerifying}>
                        {isVerifying ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wifi className="mr-2"/>
                        )}
                        Refresh Wi-Fi Count
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-around gap-4 rounded-lg bg-muted p-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold flex items-center gap-2">
                           <Users/> {isVerifying ? <Loader2 className="h-8 w-8 animate-spin"/> : autoHeadcount ?? '-'}
                        </p>
                        <p className="text-sm text-muted-foreground">Simulated Wi-Fi Headcount</p>
                    </div>
                     <div className="text-center">
                        <p className="text-3xl font-bold flex items-center gap-2">
                           <Check/> {presentCount}
                        </p>
                        <p className="text-sm text-muted-foreground">Marked as Present</p>
                    </div>
                </div>
                {isMismatch && (
                    <div className="mt-4 text-center text-destructive flex items-center justify-center gap-2">
                       <AlertTriangle className="h-4 w-4" />
                       <p>Headcount does not match. Please review.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Class Roster</CardTitle>
                <CardDescription>Mark attendance for each student below.</CardDescription>
            </CardHeader>
            <CardContent>
                {students.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {students.map((student) => (
                            <StudentAttendanceCard
                                key={student.id}
                                student={student}
                                status={attendance[student.id] || "unmarked"}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-12">
                        No students have been added to this class yet.
                    </p>
                )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveAttendance} className="w-full sm:w-auto ml-auto" disabled={isVerifying}>
                    <Check className="mr-2"/> Save Attendance
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
