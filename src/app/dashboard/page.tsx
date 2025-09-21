"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, List, LayoutGrid } from "lucide-react";
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
import { Header } from "@/components/header";

function StudentDashboard() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <>
      <Header />
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
    </>
  );
}


export default function DashboardPage() {
    const { mode } = useAppContext();

    if (mode === 'student') {
        return <StudentDashboard />;
    }

    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-full p-4 sm:p-6">
            <p className="text-muted-foreground">Dashboard not available for this role yet.</p>
        </div>
      </>
    );
}
