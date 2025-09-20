
"use client";

import { useParams, notFound } from "next/navigation";
import { schools, programsBySchool, type Program, type Department } from "@/lib/school-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProgramDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const programId = params.programId as string;

  const school = schools.find((s) => s.id === schoolId);
  const program = programsBySchool[schoolId]?.find((p) => p.id === programId);

  if (!school || !program) {
    notFound();
  }

  const departments = program.departments || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href={`/schools/${schoolId}`}>
                <ArrowLeft />
                <span className="sr-only">Back to {school.name}</span>
            </Link>
        </Button>
        <div>
            <h2 className="text-2xl font-bold tracking-tight">{program.name}</h2>
            <p className="text-muted-foreground">
                Departments under this program.
            </p>
        </div>
      </div>
      
      {departments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Card key={department.id}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Building2 className="h-8 w-8 text-muted-foreground mt-1"/>
                <div className="space-y-1 flex-1">
                    <CardTitle>{department.name}</CardTitle>
                    <CardDescription>HOD: {department.hod}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No departments found for this program.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
