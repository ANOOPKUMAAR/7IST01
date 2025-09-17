
"use client";

import { useState } from "react";
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
import { Check, Wifi, Loader2 } from 'lucide-react';
import { getAutomaticHeadcount } from "@/actions/attendance-actions";

type AttendanceStatus = "present" | "absent" | "unmarked";

function StudentAttendanceCard({ student, status, onStatusChange }: { student: Student, status: AttendanceStatus, onStatusChange: (studentId: string, status: AttendanceStatus) => void }) {
    
    const getStatusBadge = () => {
        switch (status) {
            case "present":
                return <Badge variant="secondary" className="bg-white/20 text-primary-foreground">Present</Badge>;
            case "absent":
                return <Badge variant="secondary" className="bg-white/20 text-primary-foreground">Absent</Badge>;
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
                    variant={status !== 'unmarked' ? 'secondary' : 'default'}
                    onClick={() => onStatusChange(student.id, "present")}
                >
                    Present
                </Button>
                <Button 
                    className="w-full"
                    size="sm" 
                    variant={status !== 'unmarked' ? 'secondary' : 'default'}
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

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleGetHeadcount = async () => {
    setIsVerifying(true);
    const presentCount = Object.values(attendance).filter(s => s === 'present').length;
    
    try {
        const result = await getAutomaticHeadcount(subject.id, students.length);
        const autoHeadcount = result.headcount;

        if (autoHeadcount === presentCount) {
            toast({
                title: "Headcount Matched",
                description: `The automatic headcount of ${autoHeadcount} matches the number of students marked present.`,
                variant: "success",
            });
        } else {
            toast({
                title: "Headcount Mismatch",
                description: `Automatic headcount (${autoHeadcount}) does not match marked present (${presentCount}). Please review attendance.`,
                variant: "destructive",
                duration: 8000,
            });
        }
    } catch (error) {
        toast({
            title: "Error Verifying Headcount",
            description: "Could not get automatic headcount. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsVerifying(false);
    }
  };
  
  const handleSaveAttendance = () => {
    // In a real application, you would save this data to a backend.
    toast({
      title: "Attendance Saved",
      description: "The attendance record for today's class has been saved.",
    });
  }

  return (
    <>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Mark Attendance</CardTitle>
                        <CardDescription>Mark attendance for each student for today's class.</CardDescription>
                    </div>
                     <Button variant="outline" onClick={handleGetHeadcount} disabled={isVerifying}>
                        {isVerifying ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wifi className="mr-2"/>
                        )}
                        Get Automatic Headcount
                    </Button>
                </div>
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
                <Button onClick={handleSaveAttendance} className="w-full sm:w-auto ml-auto">
                    <Check className="mr-2"/> Save Attendance
                </Button>
            </CardFooter>
        </Card>
    </>
  );
}
