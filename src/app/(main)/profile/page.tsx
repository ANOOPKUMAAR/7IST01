
"use client";

import { useAppContext } from "@/contexts/app-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { User } from "lucide-react";

function StatCard({ title, value, description }: { title: string, value: string | number, description?: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}

export default function ProfilePage() {
  const { subjects, attendance, isLoaded } = useAppContext();

  const { totalAttendance, overallPercentage, totalPossibleClasses } = useMemo(() => {
    let totalAttendance = 0;
    let totalPossibleClasses = 0;
    
    subjects.forEach(subject => {
        totalAttendance += attendance[subject.id]?.length || 0;
        totalPossibleClasses += subject.totalClasses > 0 ? subject.totalClasses : (attendance[subject.id]?.length || 0);
    });

    const overallPercentage = totalPossibleClasses > 0 
        ? Math.round((totalAttendance / totalPossibleClasses) * 100) 
        : 0;

    return { totalAttendance, overallPercentage, totalPossibleClasses };
  }, [subjects, attendance]);


  if (!isLoaded) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24 border">
            <AvatarImage src="https://picsum.photos/200" data-ai-hint="student avatar" />
            <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-3xl font-bold">Student</h2>
            <p className="text-muted-foreground">Welcome to your profile.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Subjects" value={subjects.length} />
        <StatCard title="Overall Attendance" value={`${overallPercentage}%`} description={`${totalAttendance} / ${totalPossibleClasses} classes attended`} />
        <StatCard title="Records Logged" value={totalAttendance} description="Total check-ins" />
      </div>
    </div>
  );
}
