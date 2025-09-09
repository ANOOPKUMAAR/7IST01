"use client";

import { useAppContext } from "@/contexts/app-context";
import { AttendanceTable } from "@/components/subjects/attendance-table";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectDetailsPage({ params }: { params: { id: string } }) {
  const { subjects, attendance, isLoaded } = useAppContext();
  
  if (!isLoaded) {
    return <Skeleton className="h-[400px] w-full" />
  }
  
  const subject = subjects.find(s => s.id === params.id);
  const subjectAttendance = attendance[params.id] || [];

  if (!subject) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{subject.name}</h2>
        <p className="text-muted-foreground">
          Detailed attendance log. Total classes: {subject.totalClasses}.
        </p>
      </div>
      <AttendanceTable subject={subject} records={subjectAttendance} />
    </div>
  );
}
