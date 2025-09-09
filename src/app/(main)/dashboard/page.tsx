"use client";

import { SubjectCard } from "@/components/dashboard/subject-card";
import { useAppContext } from "@/contexts/app-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { subjects, isLoaded } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome to NetAttend!</h2>
        <p className="text-muted-foreground">
          Here is an overview of your subjects and attendance.
        </p>
      </div>

      {!isLoaded && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      )}

      {isLoaded && subjects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}

      {isLoaded && subjects.length === 0 && (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
            <h3 className="text-xl font-semibold">No Subjects Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please add a subject in the Settings page to get started.
            </p>
        </div>
      )}
    </div>
  );
}
