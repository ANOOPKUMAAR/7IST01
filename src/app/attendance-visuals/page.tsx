
"use client";

import { AttendanceCharts } from "@/components/visuals/attendance-charts";
import { AttendanceByDay } from "@/components/visuals/attendance-by-day";
import { OverallAttendanceSummary } from "@/components/visuals/overall-attendance-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { Timetable } from "@/components/dashboard/time-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap } from "lucide-react";

function FacultyAttendancePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Faculty Attendance View</CardTitle>
                <CardDescription>
                    This is where you can view and manage attendance for your classes. This feature is coming soon!
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center gap-4 p-8">
                <Briefcase className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">
                   In the future, you will see a list of your subjects here. Clicking on one will show you the attendance records for all students in that class.
                </p>
            </CardContent>
        </Card>
    );
}


export default function AttendanceVisualsPage() {
    const { mode } = useAppContext();

    if (mode === 'faculty') {
        return <FacultyAttendancePage />;
    }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Attendance Visuals
        </h2>
        <p className="text-muted-foreground">
          Explore your attendance data with these charts.
        </p>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">
            <BarChart className="mr-2 h-4 w-4" /> Subject Breakdown
          </TabsTrigger>
          <TabsTrigger value="summary">
            <PieChart className="mr-2 h-4 w-4" /> Overall Summary
          </TabsTrigger>
          <TabsTrigger value="daily">
            <LineChart className="mr-2 h-4 w-4" /> Daily Trend
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-4">
          <AttendanceCharts />
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
            <div className="max-w-md mx-auto">
                <OverallAttendanceSummary />
            </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <AttendanceByDay />
        </TabsContent>
      </Tabs>
    </div>
  );
}
