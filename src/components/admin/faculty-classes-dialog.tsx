
"use client";

import type { Faculty, Class } from "@/lib/types";
import { useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Users, BookOpen } from "lucide-react";

interface FacultyClassesDialogProps {
  faculty: Faculty;
}

export function FacultyClassesDialog({ faculty }: FacultyClassesDialogProps) {
  const { programsBySchool } = useAppContext();

  const assignedClasses = useMemo(() => {
    const classes: Class[] = [];
    Object.values(programsBySchool).flat().forEach(program => {
        program.departments.forEach(department => {
            department.classes.forEach(cls => {
                if (cls.faculties.some(f => f.id === faculty.id)) {
                    classes.push(cls);
                }
            });
        });
    });
    return classes.sort((a, b) => a.name.localeCompare(b.name));
  }, [faculty.id, programsBySchool]);


  return (
    <div className="py-4">
        {assignedClasses.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
                {assignedClasses.map(cls => (
                    <AccordionItem value={cls.id} key={cls.id}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5" />
                                <div className="text-left">
                                    <p className="font-semibold">{cls.name}</p>
                                    <p className="text-sm text-muted-foreground">{cls.day} from {cls.startTime} to {cls.endTime}</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                             <div className="max-h-60 overflow-y-auto pr-2 border-t mt-2 pt-2">
                                {cls.students.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Roll Number</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cls.students.map(student => (
                                                <TableRow key={student.id}>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.rollNo}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">No students enrolled in this class.</p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        ) : (
            <div className="h-24 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
                <Users className="h-8 w-8" />
                <p>This faculty member is not assigned to any classes.</p>
            </div>
        )}
    </div>
  );
}
