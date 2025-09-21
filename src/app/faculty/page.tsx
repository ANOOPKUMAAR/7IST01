
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
import { Home, PlusCircle, Trash, Edit, MoreVertical, FileUp, Briefcase } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { FacultyFormDialog } from "@/components/admin/faculty-form-dialog";
import { FacultyDetailsDialog } from "@/components/admin/faculty-details-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { Faculty } from "@/lib/types";
import { UploadFacultyListDialog } from "@/components/admin/upload-faculty-list-dialog";

function FacultyRow({ faculty }: { faculty: Faculty }) {
  const { mode, deleteFaculty } = useAppContext();
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <button
          className="font-medium text-primary hover:underline"
          onClick={() => setDetailsOpen(true)}
        >
          {faculty.name}
        </button>
        <FacultyDetailsDialog
          faculty={faculty}
          open={isDetailsOpen}
          onOpenChange={setDetailsOpen}
        >
          <span />
        </FacultyDetailsDialog>
      </TableCell>
      <TableCell>{faculty.designation}</TableCell>
      <TableCell>{faculty.email}</TableCell>
      <TableCell>{faculty.phone}</TableCell>
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
                  onClick={() => deleteFaculty(faculty.id)}
                >
                  <Trash className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Faculty</DialogTitle>
                <DialogDescription>
                  Update the faculty member's information.
                </DialogDescription>
              </DialogHeader>
              <FacultyFormDialog
                faculty={faculty}
                onDone={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function FacultyPage() {
  const { faculties, mode } = useAppContext();
  const [isAddOpen, setAddOpen] = useState(false);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const groupedFaculties = useMemo(() => {
    const groups: Record<string, Faculty[]> = {};

    const filtered = faculties.filter(
      (faculty) =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.forEach(faculty => {
        const department = faculty.department || 'Unassigned';
        if (!groups[department]) {
            groups[department] = [];
        }
        groups[department].push(faculty);
    });

    return groups;
  }, [faculties, searchTerm]);


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
                <h2 className="text-2xl font-bold tracking-tight">Manage Faculty</h2>
                <p className="text-muted-foreground">
                    A list of all faculty members in the system.
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
                  <DialogTitle>Upload Faculty List</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or text file to bulk-import faculty members.
                  </DialogDescription>
                </DialogHeader>
                <UploadFacultyListDialog onDone={() => setUploadOpen(false)} />
              </DialogContent>
            </Dialog>
            <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                    <Button>
                    <PlusCircle /> Add Faculty
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Add New Faculty Member</DialogTitle>
                    <DialogDescription>
                        Enter the faculty member's details.
                    </DialogDescription>
                    </DialogHeader>
                    <FacultyFormDialog onDone={() => setAddOpen(false)} />
                </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Faculty List</CardTitle>
          <CardDescription>
            A list of all faculty members currently in the system, organized by department.
          </CardDescription>
          <div className="pt-2">
            <Input
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedFaculties).length > 0 ? (
            <Accordion type="multiple" className="w-full" defaultValue={Object.keys(groupedFaculties)}>
                {Object.entries(groupedFaculties).sort(([a], [b]) => a.localeCompare(b)).map(([department, deptFaculties]) => (
                    <AccordionItem value={department} key={department}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                <span>{department} ({deptFaculties.length} members)</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                             <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {deptFaculties.map((faculty) => (
                                    <FacultyRow key={faculty.id} faculty={faculty} />
                                ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          ) : (
            <div className="h-24 text-center flex items-center justify-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No faculty found." : "No faculty in the system."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
