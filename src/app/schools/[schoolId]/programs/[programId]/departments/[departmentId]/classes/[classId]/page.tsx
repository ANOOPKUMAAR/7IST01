
"use client";

import { useParams, notFound } from "next/navigation";
import { schools, programsBySchool } from "@/lib/school-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Users, CalendarClock, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function InfoRow({ label, value }: { label: string, value: string | React.ReactNode }) {
    return (
        <div className="flex justify-between py-2 border-b last:border-b-0">
            <p className="font-medium text-muted-foreground">{label}</p>
            <div className="font-semibold text-right">{value}</div>
        </div>
    )
}

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
  const faculties = cls.faculties || [];

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
                Class details, schedule, and student roster.
            </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>
                Details for this class.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue="student-roster">
                <AccordionItem value="student-roster">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                           <Users className="h-5 w-5" />
                           <span className="font-semibold">Student Roster ({students.length})</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        {students.length > 0 ? (
                            <div className="pt-4 border-t">
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
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                <Users className="h-10 w-10" />
                                <p>No students enrolled in this class.</p>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="timetable">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                           <CalendarClock className="h-5 w-5" />
                           <span className="font-semibold">Time Table</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pt-4 border-t space-y-2">
                           <InfoRow label="Day" value={cls.day} />
                           <InfoRow label="Start Time" value={cls.startTime} />
                           <InfoRow label="End Time" value={cls.endTime} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="faculties">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                           <Briefcase className="h-5 w-5" />
                           <span className="font-semibold">Faculties ({faculties.length})</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                         {faculties.length > 0 ? (
                            <div className="pt-4 border-t space-y-4">
                               {faculties.map((faculty, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback>{faculty.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold">{faculty}</p>
                                    </div>
                               ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                <Briefcase className="h-10 w-10" />
                                <p>No faculties assigned to this class.</p>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
