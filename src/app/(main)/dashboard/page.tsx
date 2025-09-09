
"use client";

import { Timetable } from "@/components/dashboard/time-table";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome to WiTrack!</h2>
        <p className="text-muted-foreground">
          Here is an overview of your subjects and attendance.
        </p>
      </div>
      <Timetable />
    </div>
  );
}
