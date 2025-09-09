
"use client";

import { useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
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
import { subDays, format, isAfter, startOfDay } from "date-fns";

export function AttendanceByDay() {
  const { attendance, isLoaded } = useAppContext();

  const chartData = useMemo(() => {
    const dailyData: { [key: string]: { date: string, attended: number } } = {};
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

    // Initialize the last 30 days with 0 attendance
    for (let i = 0; i < 30; i++) {
        const date = startOfDay(subDays(new Date(), i));
        const formattedDate = format(date, "MMM d");
        dailyData[formattedDate] = { date: formattedDate, attended: 0 };
    }

    // Populate with actual attendance
    Object.values(attendance).flat().forEach(record => {
        const recordDate = startOfDay(new Date(record.date));
        if (isAfter(recordDate, thirtyDaysAgo)) {
            const formattedDate = format(recordDate, "MMM d");
            if (dailyData[formattedDate]) {
                dailyData[formattedDate].attended += 1;
            }
        }
    });
    
    return Object.values(dailyData).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [attendance]);

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
        <CardTitle>Attendance by Date</CardTitle>
        <CardDescription>
          Number of classes attended over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--foreground))" 
                    tickFormatter={(value, index) => index % 3 === 0 ? value : ''}
                />
                <YAxis 
                    allowDecimals={false}
                    stroke="hsl(var(--foreground))"
                />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        formatter={(value, name, props) => (
                            <div className="flex flex-col">
                                <span className="font-bold">{props.payload.date}</span>
                                <span>{value} {Number(value) === 1 ? 'class' : 'classes'} attended</span>
                            </div>
                        )}
                        indicator="dot"
                    />}
                 />
                <Bar dataKey="attended" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
