
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, AlertTriangle } from 'lucide-react';

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

function HeadcountDialog({ onVerify }: { onVerify: (count: number) => void }) {
    const [headcount, setHeadcount] = useState("");

    const handleVerify = () => {
        const count = parseInt(headcount, 10);
        if (!isNaN(count) && count >= 0) {
            onVerify(count);
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Verify Headcount</DialogTitle>
                <DialogDescription>
                    Enter the number of students physically present in the class.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="headcount">Number of Students Present</Label>
                    <Input
                        id="headcount"
                        type="number"
                        value={headcount}
                        onChange={(e) => setHeadcount(e.target.value)}
                        placeholder="e.g., 15"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button onClick={handleVerify}>Verify</Button>
                </DialogClose>
            </DialogFooter>
        </>
    );
}

export function FacultyAttendanceTable({ subject }: { subject: Subject; }) {
  const { students } = useAppContext();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isHeadcountDialogOpen, setHeadcountDialogOpen] = useState(false);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleVerifyHeadcount = (headcount: number) => {
    const presentCount = Object.values(attendance).filter(s => s === 'present').length;
    if (headcount === presentCount) {
        toast({
            title: "Headcount Matched",
            description: `The headcount of ${headcount} matches the number of students marked present.`,
        });
    } else {
        toast({
            title: "Headcount Mismatch",
            description: `Headcount (${headcount}) does not match marked present (${presentCount}). Please review attendance.`,
            variant: "destructive",
            duration: 5000,
        });
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
                    <Dialog open={isHeadcountDialogOpen} onOpenChange={setHeadcountDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Verify Attendance</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <HeadcountDialog onVerify={handleVerifyHeadcount} />
                        </DialogContent>
                    </Dialog>
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
