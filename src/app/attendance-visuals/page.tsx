
"use client";

import { AttendanceCharts } from "@/components/visuals/attendance-charts";
import { AttendanceByDay } from "@/components/visuals/attendance-by-day";
import { OverallAttendanceSummary } from "@/components/visuals/overall-attendance-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";

function StudentAttendancePage() {
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

export default function AttendanceVisualsPage() {
  const { mode } = useAppContext();

  if (mode === "student") {
    return <StudentAttendancePage />;
  }

  return (
     <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">This page is only available for students.</p>
    </div>
  );
}
