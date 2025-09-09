
"use client";

import { AttendanceCharts } from "@/components/visuals/attendance-charts";
import { OverallAttendanceSummary } from "@/components/visuals/overall-attendance-summary";
import { AttendanceByDay } from "@/components/visuals/attendance-by-day";

export default function AttendanceVisualsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Attendance Visuals</h2>
        <p className="text-muted-foreground">
          Analyze your attendance patterns with these charts.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <OverallAttendanceSummary />
        </div>
        <div className="lg:col-span-2">
           <AttendanceCharts />
        </div>
      </div>
      <AttendanceByDay />
    </div>
  );
}
