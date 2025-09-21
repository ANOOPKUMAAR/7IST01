"use client";

import type { Faculty, Student } from "@/lib/types";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, User, Users } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function InfoRow({ label, value }: { label: string, value: string | undefined }) {
    return (
        <div className="flex justify-between py-2 border-b">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-right">{value || 'N/A'}</p>
        </div>
    )
}

interface FacultyDetailsDialogProps {
  faculty: Faculty;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacultyDetailsDialog({ faculty, children, open, onOpenChange }: FacultyDetailsDialogProps) {
  const { programsBySchool } = useAppContext();

  const assignedStudents = useMemo(() => {
    const studentMap = new Map<string, Student>();
    
    Object.values(programsBySchool).flat().forEach(program => {
        program.departments.forEach(department => {
            department.classes.forEach(cls => {
                if (cls.faculties.some(f => f.id === faculty.id)) {
                    cls.students.forEach(student => {
                        studentMap.set(student.id, student);
                    });
                }
            });
        });
    });

    return Array.from(studentMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [faculty.id, programsBySchool]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
            <Avatar className="h-24 w-24 border">
                <AvatarImage src={faculty.avatar} data-ai-hint="faculty avatar" />
                <AvatarFallback>
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl pt-2">{faculty.name}</DialogTitle>
            <DialogDescription>{faculty.designation}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-y-1 gap-x-8 text-sm py-4">
            <InfoRow label="Department" value={faculty.department} />
            <InfoRow label="Email" value={faculty.email} />
            <InfoRow label="Phone Number" value={faculty.phone} />
        </div>

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="assigned-students">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5"/>
                        <span>Assigned Students ({assignedStudents.length})</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="max-h-60 overflow-y-auto pr-2">
                        {assignedStudents.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Roll No</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignedStudents.map(student => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.rollNo}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No students assigned to this faculty member.</p>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
