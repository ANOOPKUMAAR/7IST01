"use client";

import type { Student } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

function InfoRow({ label, value }: { label: string, value: string | undefined }) {
    return (
        <div className="flex justify-between py-2 border-b">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-right">{value || 'N/A'}</p>
        </div>
    )
}

interface StudentDetailsDialogProps {
  student: Student;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ student, children, open, onOpenChange }: StudentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
            <Avatar className="h-24 w-24 border">
                <AvatarImage src={student.avatar} data-ai-hint="student avatar" />
                <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl pt-2">{student.name}</DialogTitle>
            <DialogDescription>{student.rollNo}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-y-1 gap-x-8 text-sm py-4">
            <InfoRow label="Program" value={student.program} />
            <InfoRow label="Branch" value={student.branch} />
            <InfoRow label="Department" value={student.department} />
            <InfoRow label="Section" value={student.section} />
            <InfoRow label="Phone Number" value={student.phone} />
            <InfoRow label="Parent's Name" value={student.parentName} />
            <div className="md:col-span-2">
                <InfoRow label="Address" value={student.address} />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
