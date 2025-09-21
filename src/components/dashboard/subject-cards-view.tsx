"use client";

import { useAppContext } from "@/contexts/app-context";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SubjectCardsView() {
  const { subjects, isLoaded } = useAppContext();

  if (!isLoaded) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      {subjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>No Subjects</CardTitle>
                <CardDescription>You have not added any subjects yet.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">
                    Please add subjects via the settings page to see them here.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
