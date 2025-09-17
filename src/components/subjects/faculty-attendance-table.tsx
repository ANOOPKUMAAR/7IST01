
"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Subject, Student } from "@/lib/types";

type AttendanceStatus = "present" | "absent" | "unmarked";

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
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => {
                    const status = attendance[student.id] || "unmarked";
                    return (
                        <TableRow key={student.id}>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                                {status === "present" && <Badge variant="secondary" className="bg-status-green text-primary-foreground">Present</Badge>}
                                {status === "absent" && <Badge variant="destructive">Absent</Badge>}
                                {status === "unmarked" && <Badge variant="outline">Unmarked</Badge>}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button size="sm" variant={status === 'present' ? 'default' : 'outline'} onClick={() => handleStatusChange(student.id, "present")}>Present</Button>
                                <Button size="sm" variant={status === 'absent' ? 'destructive' : 'outline'} onClick={() => handleStatusChange(student.id, "absent")}>Absent</Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
