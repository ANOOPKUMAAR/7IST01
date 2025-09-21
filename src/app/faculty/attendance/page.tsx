"use client";

import { useAppContext } from "@/contexts/app-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookCopy, Home } from "lucide-react";
import { ClassAttendanceDetails } from "@/components/faculty/class-attendance-details";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function FacultyAttendancePage() {
  const { facultyClasses, isLoaded } = useAppContext();

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

      {isLoaded && facultyClasses.length > 0 ? (
        <Accordion type="single" collapsible className="w-full" defaultValue={facultyClasses[0]?.id}>
          {facultyClasses.map((cls) => (
            <AccordionItem value={cls.id} key={cls.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-3 text-lg">
                  <BookCopy className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{cls.name}</span>
                    <span className="text-sm text-muted-foreground">{cls.day} at {cls.startTime}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ClassAttendanceDetails cls={cls} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                    {isLoaded ? "You are not assigned to any classes." : "Loading your classes..."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
