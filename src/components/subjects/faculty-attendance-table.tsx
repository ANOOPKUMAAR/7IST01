
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
                    variant={status !== 'unmarked' ? 'secondary' : 'outline'} 
                    onClick={() => onStatusChange(student.id, "present")}
                >
                    Present
                </Button>
                <Button 
                    className="w-full"
                    size="sm" 
                    variant={status !== 'unmarked' ? 'secondary' : 'outline'}
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
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Mark Attendance</CardTitle>
                    <CardDescription>Mark attendance for each student for today's class.</CardDescription>
                </div>
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
    </Card>
  );
}




