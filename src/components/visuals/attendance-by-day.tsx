
"use client";

import { useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
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

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AttendanceByDay() {
  const { subjects, attendance, isLoaded } = useAppContext();

  const chartData = useMemo(() => {
    const dailyData: { [key: number]: { attended: number, total: number } } = {
        0: { attended: 0, total: 0 },
        1: { attended: 0, total: 0 },
        2: { attended: 0, total: 0 },
        3: { attended: 0, total: 0 },
        4: { attended: 0, total: 0 },
        5: { attended: 0, total: 0 },
        6: { attended: 0, total: 0 },
    };

    subjects.forEach(subject => {
        const attendedCount = attendance[subject.id]?.length || 0;
        if(dailyData[subject.dayOfWeek]) {
            dailyData[subject.dayOfWeek].total += subject.totalClasses;
            dailyData[subject.dayOfWeek].attended += attendedCount;
        }
    });
    
    return Object.keys(dailyData).map(dayKey => {
        const dayIndex = parseInt(dayKey);
        const { attended, total } = dailyData[dayIndex];
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
        
        let fillClass = "var(--color-status-green)";
        if (percentage < 75) {
          fillClass = "var(--color-status-red)";
        } else if (percentage < 85) {
          fillClass = "var(--color-status-orange)";
        }

        return {
            name: daysOfWeek[dayIndex],
            percentage,
            attended,
            total,
            fill: fillClass,
        }
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
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance by Day</CardTitle>
        <CardDescription>
          Your attendance percentage for each day of the week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
            'status-green': { color: 'hsl(var(--status-green))' },
            'status-orange': { color: 'hsl(var(--status-orange))' },
            'status-red': { color: 'hsl(var(--status-red))' },
        }} className="h-[250px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis type="number" domain={[0, 100]} stroke="hsl(var(--foreground))" />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        formatter={(value, name, props) => (
                            <div className="flex flex-col">
                                <span className="font-bold">{props.payload.name}</span>
                                <span>Attendance: {value}%</span>
                                <span className="text-xs text-muted-foreground">{props.payload.attended} / {props.payload.total} classes</span>
                            </div>
                        )}
                        indicator="dot"
                    />}
                 />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
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
