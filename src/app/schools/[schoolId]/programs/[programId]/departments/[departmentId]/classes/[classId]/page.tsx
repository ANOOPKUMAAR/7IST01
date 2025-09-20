
"use client";

import { useParams, notFound } from "next/navigation";
import { schools, programsBySchool } from "@/lib/school-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ClassDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const programId = params.programId as string;
  const departmentId = params.departmentId as string;
  const classId = params.classId as string;

  const school = schools.find((s) => s.id === schoolId);
  const program = programsBySchool[schoolId]?.find((p) => p.id === programId);
  const department = program?.departments?.find((d) => d.id === departmentId);
  const cls = department?.classes?.find((c) => c.id === classId);

  if (!school || !program || !department || !cls) {
    notFound();
  }

  const students = cls.students || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href={`/schools/${schoolId}/programs/${programId}/departments/${departmentId}`}>
                <ArrowLeft />
                <span className="sr-only">Back to {department.name}</span>
            </Link>
        </Button>
        <div>
            <h2 className="text-2xl font-bold tracking-tight">{cls.name}</h2>
            <p className="text-muted-foreground">
                Enrolled students.
            </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>
                List of all students enrolled in this class.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {students.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Student Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-mono">{student.rollNo}</TableCell>
                                <TableCell>{student.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Users className="h-10 w-10" />
                    <p>No students enrolled in this class.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

