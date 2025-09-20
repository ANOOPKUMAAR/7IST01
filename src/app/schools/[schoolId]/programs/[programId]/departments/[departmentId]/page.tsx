"use client";

import { useParams, notFound } from "next/navigation";
import { schools, programsBySchool } from "@/lib/school-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, BookCopy, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProgramDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const programId = params.programId as string;

  const school = schools.find((s) => s.id === schoolId);
  const program = programsBySchool[schoolId]?.find((p) => p.id === programId);

  if (!school || !program) {
    notFound();
  }

  const departments = program.departments || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href={`/schools/${schoolId}`}>
                <ArrowLeft />
                <span className="sr-only">Back to {school.name}</span>
            </Link>
        </Button>
        <div>
            <h2 className="text-2xl font-bold tracking-tight">{program.name}</h2>
            <p className="text-muted-foreground">
                Departments under this program.
            </p>
        </div>
      </div>
      
      {departments.length > 0 ? (
        <Card>
            <CardContent className="p-4">
                <Accordion type="single" collapsible className="w-full">
                    {departments.map((department) => (
                        <AccordionItem value={department.id} key={department.id}>
                            <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                                <div className="flex items-center gap-4">
                                    <Building2 className="h-8 w-8 text-muted-foreground"/>
                                    <div className="text-left">
                                        <p className="font-semibold">{department.name}</p>
                                        <p className="text-sm text-muted-foreground">HOD: {department.hod}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                                <div className="pl-12 pr-4">
                                    {department.classes && department.classes.length > 0 ? (
                                        <Accordion type="single" collapsible className="w-full">
                                            {department.classes.map((cls) => (
                                                <AccordionItem value={cls.id} key={cls.id}>
                                                    <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                                                         <div className="flex items-center gap-4">
                                                            <BookCopy className="h-6 w-6 text-muted-foreground"/>
                                                            <div className="text-left">
                                                                <p className="font-semibold">{cls.name}</p>
                                                                <p className="text-sm text-muted-foreground">Coordinator: {cls.coordinator}</p>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="pl-10 pr-4 py-2">
                                                            {cls.students && cls.students.length > 0 ? (
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Roll Number</TableHead>
                                                                            <TableHead>Student Name</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {cls.students.map((student) => (
                                                                            <TableRow key={student.id}>
                                                                                <TableCell className="font-mono">{student.rollNo}</TableCell>
                                                                                <TableCell>{student.name}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            ) : (
                                                                <div className="p-4 text-center text-muted-foreground flex flex-col items-center gap-2">
                                                                    <Users className="h-8 w-8" />
                                                                    <p>No students enrolled.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    ) : (
                                        <p className="text-center text-muted-foreground p-4">No classes in this department.</p>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No departments found for this program.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}