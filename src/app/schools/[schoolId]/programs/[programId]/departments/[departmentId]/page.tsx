"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookCopy, PlusCircle, FileUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { AdminActionMenu } from "@/components/admin/admin-action-menu";
import { ClassFormDialog } from "@/components/admin/class-form-dialog";
import type { Class } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadClassTimetableDialog } from "@/components/admin/upload-class-timetable-dialog";
import { Header } from "@/components/header";

function ClassCard({ schoolId, programId, departmentId, cls }: { schoolId: string, programId: string, departmentId: string, cls: Class }) {
    const { mode, deleteClass } = useAppContext();
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    return (
        <Card className="relative group">
            <Link href={`/schools/${schoolId}/programs/${programId}/departments/${departmentId}/classes/${cls.id}`} className="block hover:bg-accent/50 cursor-pointer transition-colors h-full">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="space-y-1 flex-1">
                        <CardTitle>{cls.name}</CardTitle>
                        <CardDescription>Coordinator: {cls.coordinator}</CardDescription>
                    </div>
                    <BookCopy className="h-8 w-8 text-muted-foreground"/>
                </CardHeader>
            </Link>
             {mode === 'admin' && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdminActionMenu
                        onEdit={() => setIsEditOpen(true)}
                        onDelete={() => deleteClass(schoolId, programId, departmentId, cls.id)}
                        deleteConfirmationMessage={`Are you sure you want to delete the class "${cls.name}"?`}
                    />
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Class</DialogTitle>
                            </DialogHeader>
                            <ClassFormDialog
                                schoolId={schoolId}
                                programId={programId}
                                departmentId={departmentId}
                                cls={cls}
                                onDone={() => setIsEditOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </Card>
    );
}

export default function DepartmentDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const programId = params.programId as string;
  const departmentId = params.departmentId as string;
  const { schools, programsBySchool, mode } = useAppContext();
  const [isAddOpen, setAddOpen] = useState(false);
  const [isUploadOpen, setUploadOpen] = useState(false);


  const school = schools.find((s) => s.id === schoolId);
  const program = programsBySchool[schoolId]?.find((p) => p.id === programId);
  const department = program?.departments?.find((d) => d.id === departmentId);

  if (!school || !program || !department) {
    notFound();
  }

  const classes = department.classes || [];

  return (
    <>
      <Header />
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                  <Link href={`/schools/${schoolId}/programs/${programId}`}>
                      <ArrowLeft />
                      <span className="sr-only">Back to {program.name}</span>
                  </Link>
              </Button>
              <div>
                  <h2 className="text-2xl font-bold tracking-tight">{department.name}</h2>
                  <p className="text-muted-foreground">
                      Classes in this department.
                  </p>
              </div>
          </div>
          {mode === 'admin' && (
              <div className="flex gap-2">
                  <Dialog open={isUploadOpen} onOpenChange={setUploadOpen}>
                      <DialogTrigger asChild>
                          <Button variant="outline"><FileUp/> Upload Timetable</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Upload Class Timetable</DialogTitle>
                              <DialogDescription>Upload an image or PDF to bulk-create classes for this department.</DialogDescription>
                          </DialogHeader>
                          <UploadClassTimetableDialog
                              schoolId={schoolId}
                              programId={programId}
                              departmentId={departmentId}
                              onDone={() => setUploadOpen(false)}
                          />
                      </DialogContent>
                  </Dialog>
                  <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                      <DialogTrigger asChild>
                          <Button><PlusCircle /> Add Class</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Add New Class</DialogTitle>
                          </DialogHeader>
                          <ClassFormDialog
                              schoolId={schoolId}
                              programId={programId}
                              departmentId={departmentId}
                              onDone={() => setAddOpen(false)}
                          />
                      </DialogContent>
                  </Dialog>
              </div>
          )}
        </div>
        
        {classes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <ClassCard key={cls.id} schoolId={schoolId} programId={programId} departmentId={departmentId} cls={cls} />
            ))}
          </div>
        ) : (
          <Card>
              <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No classes found for this department.</p>
              </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
