
"use client";

import { useParams, notFound } from "next/navigation";
import { schools, programsBySchool } from "@/lib/school-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookCopy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DepartmentDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const programId = params.programId as string;
  const departmentId = params.departmentId as string;

  const school = schools.find((s) => s.id === schoolId);
  const program = programsBySchool[schoolId]?.find((p) => p.id === programId);
  const department = program?.departments.find((d) => d.id === departmentId);

  if (!school || !program || !department) {
    notFound();
  }

  const classes = department.classes || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href={`/schools/${schoolId}/programs/${programId}`}>
                <ArrowLeft />
                <span className="sr-only">Back to {program.name}</span>
            </Link>
        </Button>
        <div>
            <h2 className="text-2xl font-bold tracking-tight">{department.name}</h2>
            <p className="text-muted-foreground">
                Classes offered by this department.
            </p>
        </div>
      </div>
      
      {classes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Link href={`/schools/${schoolId}/programs/${programId}/departments/${departmentId}/classes/${cls.id}`} key={cls.id}>
              <Card className="hover:bg-accent/50 cursor-pointer transition-colors h-full">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <BookCopy className="h-8 w-8 text-muted-foreground mt-1"/>
                  <div className="space-y-1 flex-1">
                      <CardTitle>{cls.name}</CardTitle>
                      <CardDescription>Coordinator: {cls.coordinator}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No classes found for this department.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
