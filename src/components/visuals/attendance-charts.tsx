"use client";

import { useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

export function AttendanceCharts() {
  const { subjects, attendance, isLoaded } = useAppContext();

  const chartData = useMemo(() => {
    return subjects.map((subject) => {
      const subjectAttendance = attendance[subject.id] || [];
      const attendedClasses = subjectAttendance.length;
      const totalClasses = subject.totalClasses > 0 ? subject.totalClasses : 1;
      const percentage = Math.round((attendedClasses / totalClasses) * 100);
      
      let fillClass = "fill-status-green";
      if (percentage < 75) {
        fillClass = "fill-status-red";
      } else if (percentage < 85) {
        fillClass = "fill-status-orange";
      }

      return {
        name: subject.name,
        percentage,
        attended: attendedClasses,
        total: subject.totalClasses,
        fillClass,
      };
    });
  }, [subjects, attendance]);

  if (!isLoaded) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[400px] w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Attendance Overview</CardTitle>
        <CardDescription>
          A bar chart showing your attendance percentage for each subject.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[400px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              stroke="hsl(var(--foreground))"
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent 
                    formatter={(value, name, props) => (
                        <div className="flex flex-col">
                            <span className="font-bold">{props.payload.name}</span>
                            <span>Attendance: {value}%</span>
                            <span className="text-xs text-muted-foreground">{props.payload.attended} / {props.payload.total} classes</span>
                        </div>
                    )}
                />}
             />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <div key={`cell-${index}`} className={entry.fillClass} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
