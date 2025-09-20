
"use client";

import { useParams, notFound } from "next/navigation";
import { schools, programsBySchool } from "@/lib/school-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SchoolDetailsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;

  const school = schools.find((s) => s.id === schoolId);
  const programs = programsBySchool[schoolId] || [];

  if (!school) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/">
                <ArrowLeft />
                <span className="sr-only">Back to Dashboard</span>
            </Link>
        </Button>
        <div>
            <h2 className="text-2xl font-bold tracking-tight">{school.name}</h2>
            <p className="text-muted-foreground">
                Programs offered by this school.
            </p>
        </div>
      </div>
      
      {programs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="space-y-1 flex-1">
                    <CardTitle>{program.name}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                </div>
                <BookOpen className="h-8 w-8 text-muted-foreground"/>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No programs found for this school.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
