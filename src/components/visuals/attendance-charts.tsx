
"use client";

import { useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
      
      let fillClass = "var(--color-status-green)";
      if (percentage < 75) {
        fillClass = "var(--color-status-red)";
      } else if (percentage < 85) {
        fillClass = "var(--color-status-orange)";
      }

      return {
        name: subject.name,
        percentage,
        attended: attendedClasses,
        total: subject.totalClasses,
        fill: fillClass,
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Subject Breakdown</CardTitle>
        <CardDescription>
          Attendance percentage for each subject.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
            'status-green': { color: 'hsl(var(--status-green))' },
            'status-orange': { color: 'hsl(var(--status-orange))' },
            'status-red': { color: 'hsl(var(--status-red))' },
        }} className="h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--foreground))" label={{ value: 'Percentage', position: 'insideBottom', offset: -10 }} />
                <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--foreground))" />
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
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
