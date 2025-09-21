"use client";

import { useParams, notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, BookOpen, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { AdminActionMenu } from "@/components/admin/admin-action-menu";
import { ProgramFormDialog } from "@/components/admin/program-form-dialog";
import { useState } from "react";
import type { Program } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";

function ProgramCard({ schoolId, program }: { schoolId: string, program: Program }) {
  const { mode, deleteProgram } = useAppContext();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Card className="relative group">
      <Link href={`/schools/${schoolId}/programs/${program.id}`} className="block hover:bg-accent/50 cursor-pointer transition-colors h-full">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="space-y-1 flex-1">
            <CardTitle>{program.name}</CardTitle>
            <CardDescription>{program.description}</CardDescription>
          </div>
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
      </Link>
      {mode === "admin" && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <AdminActionMenu
            onEdit={() => setIsEditOpen(true)}
            onDelete={() => deleteProgram(schoolId, program.id)}
            deleteConfirmationMessage={`Are you sure you want to delete the program "${program.name}"?`}
          />
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Program</DialogTitle>
                <DialogDescription>Update program details.</DialogDescription>
              </DialogHeader>
              <ProgramFormDialog
                schoolId={schoolId}
                program={program}
                onDone={() => setIsEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Card>
  );
}


export default function SchoolDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const { schools, programsBySchool, mode } = useAppContext();
  const [isAddOpen, setAddOpen] = useState(false);

  const school = schools.find((s) => s.id === schoolId);
  const programs = programsBySchool[schoolId] || [];

  if (!school) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft />
                    <span className="sr-only">Back to Dashboard</span>
                </Link>
            </Button>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{school.name}</h2>
                <p className="text-muted-foreground">
                    Programs offered by this school.
                </p>
            </div>
        </div>
        {mode === 'admin' && (
            <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                    <Button><PlusCircle /> Add Program</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Program</DialogTitle>
                        <DialogDescription>Enter details for the new program.</DialogDescription>
                    </DialogHeader>
                    <ProgramFormDialog schoolId={schoolId} onDone={() => setAddOpen(false)} />
                </DialogContent>
            </Dialog>
        )}
      </div>
      
      {programs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} schoolId={schoolId} program={program} />
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No programs found for this school.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
