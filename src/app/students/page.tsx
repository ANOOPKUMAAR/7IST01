
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, Trash, Edit, MoreVertical, FileUp, Users } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { StudentFormDialog } from "@/components/admin/student-form-dialog";
import { StudentDetailsDialog } from "@/components/admin/student-details-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { Student } from "@/lib/types";
import { UploadStudentListDialog } from "@/components/admin/upload-student-list-dialog";

function StudentRow({ student }: { student: Student }) {
  const { mode, deleteStudent } = useAppContext();
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <button
          className="font-medium text-primary hover:underline"
          onClick={() => setDetailsOpen(true)}
        >
          {student.name}
        </button>
        <StudentDetailsDialog
          student={student}
          open={isDetailsOpen}
          onOpenChange={setDetailsOpen}
        >
          <span />
        </StudentDetailsDialog>
      </TableCell>
      <TableCell>{student.rollNo}</TableCell>
      <TableCell>{student.program}</TableCell>
      <TableCell>{student.branch}</TableCell>
      <TableCell className="text-right">
        {mode === 'admin' && (
          <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Edit className="mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteStudent(student.id)}
                >
                  <Trash className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>
                  Update the student's information.
                </DialogDescription>
              </DialogHeader>
              <StudentFormDialog
                student={student}
                onDone={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function StudentsPage() {
  const { students, mode } = useAppContext();
  const [isAddOpen, setAddOpen] = useState(false);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const groupedStudents = useMemo(() => {
    const groups: Record<string, Record<string, Student[]>> = {};

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.forEach(student => {
      try {
        const batchYear = student.rollNo.substring(0, 5);
        const departmentCode = student.rollNo.substring(5, 8);

        if (!groups[batchYear]) {
          groups[batchYear] = {};
        }
        if (!groups[batchYear][departmentCode]) {
          groups[batchYear][departmentCode] = [];
        }
        groups[batchYear][departmentCode].push(student);
      } catch (e) {
        // Ignore students with invalid roll numbers
      }
    });

    return groups;
  }, [students, searchTerm]);


  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard">
                    <Home />
                    <span className="sr-only">Back to Dashboard</span>
                </Link>
            </Button>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Manage Students</h2>
                <p className="text-muted-foreground">
                    A list of all students in the system.
                </p>
            </div>
        </div>
        {mode === 'admin' && (
          <div className="flex gap-2">
            <Dialog open={isUploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileUp /> Upload List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Student List</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or text file to bulk-import students.
                  </DialogDescription>
                </DialogHeader>
                <UploadStudentListDialog onDone={() => setUploadOpen(false)} />
              </DialogContent>
            </Dialog>
            <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                    <Button>
                    <PlusCircle /> Add Student
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Enter the student's details.
                    </DialogDescription>
                    </DialogHeader>
                    <StudentFormDialog onDone={() => setAddOpen(false)} />
                </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            A list of all students currently in the system, organized by batch and department.
          </CardDescription>
          <div className="pt-2">
            <Input
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedStudents).length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedStudents).sort(([a], [b]) => b.localeCompare(a)).map(([batchYear, departments]) => (
                <AccordionItem value={batchYear} key={batchYear}>
                  <AccordionTrigger className="text-lg font-semibold">
                    Batch {batchYear}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="multiple" className="w-full pl-4">
                      {Object.entries(departments).sort(([a], [b]) => a.localeCompare(b)).map(([deptCode, deptStudents]) => (
                        <AccordionItem value={`${batchYear}-${deptCode}`} key={`${batchYear}-${deptCode}`}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <span>Department: {deptCode} ({deptStudents.length} students)</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Roll No.</TableHead>
                                  <TableHead>Program</TableHead>
                                  <TableHead>Branch</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {deptStudents.map((student) => (
                                  <StudentRow key={student.id} student={student} />
                                ))}
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="h-24 text-center flex items-center justify-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No students found." : "No students in the system."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
