"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileUp,
  List,
  LayoutGrid,
  Building,
  GraduationCap,
  BookOpen,
  Building2,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { UploadTimetableDialog } from "@/components/dashboard/upload-timetable-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timetable } from "@/components/dashboard/time-table";
import { SubjectCardsView } from "@/components/dashboard/subject-cards-view";
import { useAppContext } from "@/contexts/app-context";
import Link from "next/link";
import { FacultyTimetable } from "@/components/dashboard/faculty-timetable";

function StudentDashboard() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
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
            <TabsTrigger value="table">
              <List className="mr-2" /> Table View
            </TabsTrigger>
            <TabsTrigger value="cards">
              <LayoutGrid className="mr-2" /> Card View
            </TabsTrigger>
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

function AdminDashboard() {
  const { schools, programsBySchool, students } = useAppContext();

  const totalPrograms = Object.values(programsBySchool).flat().length;
  const totalDepartments = Object.values(programsBySchool)
    .flat()
    .reduce((acc, prog) => acc + (prog.departments?.length || 0), 0);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of the application data and quick actions.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schools.length}</div>
            <p className="text-xs text-muted-foreground">Total schools</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/schools">
                Manage Schools <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrograms}</div>
            <p className="text-xs text-muted-foreground">Total programs</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/schools">
                Manage Programs <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Total departments</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/schools">
                Manage Departments <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Total students</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/students">
                Manage Students <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function FacultyDashboard() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Faculty Dashboard</h2>
        <p className="text-muted-foreground">
          Here is your weekly class schedule. Click on a class to manage attendance.
        </p>
      </div>
      <FacultyTimetable />
    </div>
  );
}


export default function DashboardPage() {
  const { mode } = useAppContext();

  if (mode === "student") {
    return <StudentDashboard />;
  }

  if (mode === "admin") {
    return <AdminDashboard />;
  }

  if (mode === "faculty") {
    return <FacultyDashboard />;
  }

  return (
    <div className="flex items-center justify-center h-full p-4 sm:p-6">
      <p className="text-muted-foreground">
        Dashboard not available for this role yet.
      </p>
    </div>
  );
}
