"use client";

import { useParams, notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, CalendarClock, Briefcase, PlusCircle, Trash, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/app-context";
import { useState } from "react";
import type { Student } from "@/lib/types";
import { ClassFormDialog } from "@/components/admin/class-form-dialog";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <p className="font-medium text-muted-foreground">{label}</p>
      <div className="font-semibold text-right">{value}</div>
    </div>
  );
}

function AddStudentDialog({ onAdd, availableStudents, onDone }: { onAdd: (studentId: string) => void, availableStudents: Student[], onDone: () => void }) {
    const [selectedStudent, setSelectedStudent] = useState('');

    const handleAdd = () => {
        if(selectedStudent) {
            onAdd(selectedStudent);
            onDone();
        }
    }

    return (
        <>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="student-select">Select Student</Label>
                    <Select onValueChange={setSelectedStudent}>
                        <SelectTrigger id="student-select">
                            <SelectValue placeholder="Select a student to add" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableStudents.map(student => (
                                <SelectItem key={student.id} value={student.id}>{student.name} ({student.rollNo})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAdd} disabled={!selectedStudent}>Add Student</Button>
            </DialogFooter>
        </>
    )
}

function AddFacultyDialog({ onAdd, onDone }: { onAdd: (name: string) => void, onDone: () => void }) {
    const [facultyName, setFacultyName] = useState('');

    const handleAdd = () => {
        if(facultyName.trim()) {
            onAdd(facultyName.trim());
            onDone();
        }
    }
    
    return (
        <>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="faculty-name">Faculty Name</Label>
                    <Input id="faculty-name" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} placeholder="e.g., Dr. Alan Turing" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAdd} disabled={!facultyName.trim()}>Add Faculty</Button>
            </DialogFooter>
        </>
    )
}


export default function ClassDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const programId = params.programId as string;
  const departmentId = params.departmentId as string;
  const classId = params.classId as string;
  const [isAddStudentOpen, setAddStudentOpen] = useState(false);
  const [isAddFacultyOpen, setAddFacultyOpen] = useState(false);
  const [isEditClassOpen, setEditClassOpen] = useState(false);


  const { schools, programsBySchool, mode, students: allStudents, addStudentToClass, removeStudentFromClass, addFacultyToClass, removeFacultyFromClass } = useAppContext();

  const school = schools.find((s) => s.id === schoolId);
  const program = programsBySchool[schoolId]?.find((p) => p.id === programId);
  const department = program?.departments?.find((d) => d.id === departmentId);
  const cls = department?.classes?.find((c) => c.id === classId);

  if (!school || !program || !department || !cls) {
    notFound();
  }

  const students = cls.students || [];
  const faculties = cls.faculties || [];

  const availableStudents = allStudents.filter(s => !students.some(es => es.id === s.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link
            href={`/schools/${schoolId}/programs/${programId}/departments/${departmentId}`}
          >
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
          <CardDescription>Details for this class.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["student-roster"]}
          >
            <AccordionItem value="student-roster">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">
                    Student Roster ({students.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 border-t">
                  {mode === 'admin' && (
                    <div className="flex justify-end mb-4">
                       <Dialog open={isAddStudentOpen} onOpenChange={setAddStudentOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm"><PlusCircle/> Add Student</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Student to Roster</DialogTitle>
                                <DialogDescription>Select a student to add to {cls.name}.</DialogDescription>
                            </DialogHeader>
                            <AddStudentDialog 
                                onAdd={(studentId) => addStudentToClass(schoolId, programId, departmentId, classId, studentId)}
                                availableStudents={availableStudents}
                                onDone={() => setAddStudentOpen(false)}
                            />
                          </DialogContent>
                       </Dialog>
                    </div>
                  )}
                  {students.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Student Name</TableHead>
                          {mode === 'admin' && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-mono">
                              {student.rollNo}
                            </TableCell>
                            <TableCell>{student.name}</TableCell>
                             {mode === 'admin' && (
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeStudentFromClass(schoolId, programId, departmentId, classId, student.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                             )}
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
                </div>
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
                   {mode === 'admin' && (
                      <div className="flex justify-end mb-4">
                        <Dialog open={isEditClassOpen} onOpenChange={setEditClassOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline"><Edit/> Edit Schedule</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Class Schedule</DialogTitle>
                                <DialogDescription>Update the timetable details for {cls.name}.</DialogDescription>
                            </DialogHeader>
                            <ClassFormDialog
                                schoolId={schoolId}
                                programId={programId}
                                departmentId={departmentId}
                                cls={cls}
                                onDone={() => setEditClassOpen(false)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                  )}
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
                  <span className="font-semibold">
                    Faculties ({faculties.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 border-t">
                  {mode === 'admin' && (
                      <div className="flex justify-end mb-4">
                        <Dialog open={isAddFacultyOpen} onOpenChange={setAddFacultyOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm"><PlusCircle/> Add Faculty</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Faculty</DialogTitle>
                                <DialogDescription>Enter the name of the faculty member to assign to {cls.name}.</DialogDescription>
                            </DialogHeader>
                            <AddFacultyDialog onAdd={(name) => addFacultyToClass(schoolId, programId, departmentId, classId, name)} onDone={() => setAddFacultyOpen(false)} />
                          </DialogContent>
                        </Dialog>
                      </div>
                  )}
                  {faculties.length > 0 ? (
                    <div className="space-y-4">
                      {faculties.map((faculty, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{faculty.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <p className="font-semibold">{faculty}</p>
                          </div>
                          {mode === 'admin' && (
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeFacultyFromClass(schoolId, programId, departmentId, classId, faculty)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                      <Briefcase className="h-10 w-10" />
                      <p>No faculties assigned to this class.</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
