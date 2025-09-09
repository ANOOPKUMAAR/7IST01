"use client";

import { AttendanceCharts } from "@/components/visuals/attendance-charts";

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">
          Analyze your attendance patterns with these charts.
        </p>
      </div>
      <AttendanceCharts />
    </div>
  );
}
