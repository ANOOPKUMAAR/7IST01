"use client";

import type { Faculty } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase } from "lucide-react";

function InfoRow({ label, value }: { label: string, value: string | undefined }) {
    return (
        <div className="flex justify-between py-2 border-b">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-right">{value || 'N/A'}</p>
        </div>
    )
}

interface FacultyDetailsDialogProps {
  faculty: Faculty;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacultyDetailsDialog({ faculty, children, open, onOpenChange }: FacultyDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
            <Avatar className="h-24 w-24 border">
                <AvatarImage src={faculty.avatar} data-ai-hint="faculty avatar" />
                <AvatarFallback>
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl pt-2">{faculty.name}</DialogTitle>
            <DialogDescription>{faculty.designation}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-y-1 gap-x-8 text-sm py-4">
            <InfoRow label="Department" value={faculty.department} />
            <InfoRow label="Email" value={faculty.email} />
            <InfoRow label="Phone Number" value={faculty.phone} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
