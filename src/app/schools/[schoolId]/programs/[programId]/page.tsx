
"use client";

import { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { AdminActionMenu } from "@/components/admin/admin-action-menu";
import { DepartmentFormDialog } from "@/components/admin/department-form-dialog";
import type { Department } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

function DepartmentCard({ schoolId, programId, department }: { schoolId: string, programId: string, department: Department }) {
    const { mode, deleteDepartment } = useAppContext();
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    return (
        <Card className="relative group">
            <Link href={`/schools/${schoolId}/programs/${programId}/departments/${department.id}`} className="block hover:bg-accent/50 cursor-pointer transition-colors h-full">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="space-y-1 flex-1">
                        <CardTitle>{department.name}</CardTitle>
                        <CardDescription>HOD: {department.hod}</CardDescription>
                    </div>
                    <Building2 className="h-8 w-8 text-muted-foreground"/>
                </CardHeader>
            </Link>
            {mode === 'admin' && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdminActionMenu
                        onEdit={() => setIsEditOpen(true)}
                        onDelete={() => deleteDepartment(schoolId, programId, department.id)}
                        deleteConfirmationMessage={`Are you sure you want to delete the department "${department.name}"?`}
                    />
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Department</DialogTitle>
                                <DialogDescription>Update department details.</DialogDescription>
                            </DialogHeader>
                            <DepartmentFormDialog
                                schoolId={schoolId}
                                programId={programId}
                                department={department}
                                onDone={() => setIsEditOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </Card>
    );
}

export default function ProgramDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const programId = params.programId as string;
  const { schools, programsBySchool, mode } = useAppContext();
  const [isAddOpen, setAddOpen] = useState(false);

  const school = schools.find((s) => s.id === schoolId);
  const program = programsBySchool[schoolId]?.find((p) => p.id === programId);

  if (!school || !program) {
    notFound();
  }

  const departments = program.departments || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
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
        {mode === 'admin' && (
            <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                    <Button><PlusCircle /> Add Department</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                    </DialogHeader>
                    <DepartmentFormDialog schoolId={schoolId} programId={programId} onDone={() => setAddOpen(false)} />
                </DialogContent>
            </Dialog>
        )}
      </div>
      
      {departments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <DepartmentCard key={department.id} schoolId={schoolId} programId={programId} department={department} />
          ))}
        </div>
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
