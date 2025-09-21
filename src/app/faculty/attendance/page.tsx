"use client";

import { useAppContext } from "@/contexts/app-context";
import { BookCopy, Home } from "lucide-react";
import { ClassAttendanceDetails } from "@/components/faculty/class-attendance-details";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function FacultyAttendancePage() {
  const { facultyClasses, isLoaded } = useAppContext();

  const istClass = facultyClasses.find(cls => cls.name === "7IST01");

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <Home />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Class Attendance
            </h2>
            <p className="text-muted-foreground">
              Review attendance records for the classes you teach.
            </p>
          </div>
        </div>
      </div>

      {isLoaded && istClass ? (
        <ClassAttendanceDetails cls={istClass} />
      ) : (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                    {isLoaded ? "The '7IST01' class is not assigned to you." : "Loading your classes..."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
