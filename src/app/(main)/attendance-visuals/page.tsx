
"use client";

import { AttendanceCharts } from "@/components/visuals/attendance-charts";
import { OverallAttendanceSummary } from "@/components/visuals/overall-attendance-summary";
import { AttendanceByDay } from "@/components/visuals/attendance-by-day";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, CalendarDays } from "lucide-react";

export default function AttendanceVisualsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Attendance Visuals</h2>
        <p className="text-muted-foreground">
          Analyze your attendance patterns with these charts.
        </p>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall">
            <PieChart className="mr-2 h-4 w-4" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="subject">
            <BarChart className="mr-2 h-4 w-4" />
            Subject Breakdown
          </TabsTrigger>
          <TabsTrigger value="day">
            <CalendarDays className="mr-2 h-4 w-4" />
            By Day
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overall" className="mt-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <OverallAttendanceSummary />
            </div>
            <div className="md:col-span-2">
                <p className="p-4 text-center text-muted-foreground h-full flex items-center justify-center">
                    Select a tab to view detailed charts. This view shows the overall summary.
                </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="subject" className="mt-4">
          <AttendanceCharts />
        </TabsContent>
        <TabsContent value="day" className="mt-4">
          <AttendanceByDay />
        </TabsContent>
      </Tabs>
    </div>
  );
}
