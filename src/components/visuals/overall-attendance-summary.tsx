"use client";

import { useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverallAttendanceSummary() {
    const { subjects, attendance, isLoaded } = useAppContext();
  
    const { totalAttended, totalMissed, pieData } = useMemo(() => {
        let totalAttended = 0;
        let totalPossible = 0;
        
        subjects.forEach(subject => {
            totalAttended += attendance[subject.id]?.length || 0;
            totalPossible += subject.totalClasses > 0 ? subject.totalClasses : (attendance[subject.id]?.length || 0);
        });
    
        const totalMissed = Math.max(0, totalPossible - totalAttended);
    
        const pieData = [
            { name: 'Attended', value: totalAttended, color: 'hsl(var(--status-green))' },
            { name: 'Missed', value: totalMissed, color: 'hsl(var(--status-red))' },
        ];
    
        return { totalAttended, totalMissed, pieData };
      }, [subjects, attendance]);

    if (!isLoaded) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
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
            <CardTitle>Overall Summary</CardTitle>
            <CardDescription>Total classes attended vs. missed.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} classes`, name]}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-around text-center">
                <div>
                    <p className="text-2xl font-bold text-status-green">{totalAttended}</p>
                    <p className="text-sm text-muted-foreground">Attended</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-status-red">{totalMissed}</p>
                    <p className="text-sm text-muted-foreground">Missed</p>
                </div>
            </div>
        </CardContent>
      </Card>
    );
  }
  
