"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { FileUp, List, LayoutGrid, School, PlusCircle, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadTimetableDialog } from "@/components/dashboard/upload-timetable-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timetable } from "@/components/dashboard/time-table";
import { SubjectCardsView } from "@/components/dashboard/subject-cards-view";
import { useAppContext } from "@/contexts/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminActionMenu } from "@/components/admin/admin-action-menu";
import { SchoolFormDialog } from "@/components/admin/school-form-dialog";
import type { School as SchoolType } from "@/lib/types";

function AdminDashboard() {
  const { schools, mode } = useAppContext();
  const [isAddSchoolOpen, setAddSchoolOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            University Overview
          </h2>
          <p className="text-muted-foreground">
            Select a school to view its details.
          </p>
        </div>
        {mode === 'admin' && (
           <Dialog open={isAddSchoolOpen} onOpenChange={setAddSchoolOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle /> Add School</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
                <DialogDescription>Enter the name of the new school.</DialogDescription>
              </DialogHeader>
              <SchoolFormDialog onDone={() => setAddSchoolOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </div>
    </div>
  )
}

function SchoolCard({ school }: { school: SchoolType }) {
  const { mode, deleteSchool } = useAppContext();
  const [isEditSchoolOpen, setEditSchoolOpen] = useState(false);

  return (
    <Card className="relative group">
      <Link href={`/schools/${school.id}`} className="block hover:bg-accent/50 cursor-pointer transition-colors h-full">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <School className="h-10 w-10 text-primary" />
          <CardTitle className="text-xl">{school.name}</CardTitle>
        </CardHeader>
      </Link>
      {mode === 'admin' && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <AdminActionMenu
            onEdit={() => setEditSchoolOpen(true)}
            onDelete={() => deleteSchool(school.id)}
            deleteConfirmationMessage={`Are you sure you want to delete the school "${school.name}"? This will delete all associated programs, departments, and classes.`}
          />
          <Dialog open={isEditSchoolOpen} onOpenChange={setEditSchoolOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit School</DialogTitle>
                <DialogDescription>Update the school's name.</DialogDescription>
              </DialogHeader>
              <SchoolFormDialog school={school} onDone={() => setEditSchoolOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Card>
  )
}


function FacultyDashboard() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Faculty Timetable
                </h2>
                <p className="text-muted-foreground">
                    Here is your teaching schedule for the week.
                </p>
                </div>
            </div>
            <Timetable />
        </div>
    )
}

function StudentDashboard() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome to WiTrack!
          </h2>
          <p className="text-muted-foreground">
            Here is an overview of your subjects and attendance.
          </p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileUp className="mr-2 h-4 w-4" /> Upload Timetable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Timetable</DialogTitle>
              <DialogDescription>
                Select an image or PDF file to bulk-import subjects using AI.
              </DialogDescription>
            </DialogHeader>
            <UploadTimetableDialog onDone={() => setUploadDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <div className="flex justify-end">
            <TabsList>
                <TabsTrigger value="table"><List className="mr-2"/> Table View</TabsTrigger>
                <TabsTrigger value="cards"><LayoutGrid className="mr-2"/> Card View</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="table" className="mt-4">
          <Timetable />
        </TabsContent>
        <TabsContent value="cards" className="mt-4">
            <SubjectCardsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function DashboardPage() {
    const { mode, isLoaded } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !mode) {
            router.replace('/select-role');
        }
    }, [isLoaded, mode, router]);


    if (!isLoaded || !mode) return null; // Or a loading skeleton

    if (mode === 'admin') {
        return <AdminDashboard />;
    }
    if (mode === 'faculty') {
        return <FacultyDashboard />;
    }

    return <StudentDashboard />;
}
