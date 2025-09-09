
"use client";

import { AttendanceCharts } from "@/components/visuals/attendance-charts";
import { AttendanceByDay } from "@/components/visuals/attendance-by-day";
import { OverallAttendanceSummary } from "@/components/visuals/overall-attendance-summary";

export default function AttendanceVisualsPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h2 className="text-2xl font-bold tracking-tight">Attendance Visuals</h2>
        <p className="text-muted-foreground">
          Explore your attendance data with these charts.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <AttendanceCharts />
        </div>
        <div className="lg:col-span-1">
            <OverallAttendanceSummary />
        </div>
      </div>
      <div>
        <AttendanceByDay />
      </div>
    </div>
  );
}
