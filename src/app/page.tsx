
"use client";

import { Timetable } from "@/components/dashboard/time-table";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadTimetableDialog } from "@/components/dashboard/upload-timetable-dialog";
import { useState } from "react";

export default function DashboardPage() {
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
      <Timetable />
    </div>
  );
}
