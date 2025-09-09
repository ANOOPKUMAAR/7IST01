
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
                <CardTitle as="h3" className="text-xl">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between py-2 border-b">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-right">{value}</p>
        </div>
    )
}

const userDetails = {
    name: "Alex Doe",
    rollNo: "ST2024001",
    program: "Bachelor of Technology",
    branch: "Computer Science",
    department: "Engineering",
    section: "A",
    phone: "+1 (123) 456-7890",
    parentName: "John Doe",
    address: "123 University Lane, Tech City, 12345",
}

export default function ProfilePage() {
  const { subjects, attendance, isLoaded } = useAppContext();

  const { totalAttendance, overallPercentage, totalPossibleClasses } = useMemo(() => {
    let totalAttendance = 0;
    let totalPossibleClasses = 0;
    
    subjects.forEach(subject => {
        const attended = attendance[subject.id]?.length || 0;
        totalAttendance += attended;
        // If total classes is not set, consider attended classes as total to avoid skewed percentages for new subjects.
        totalPossibleClasses += subject.totalClasses > 0 ? subject.totalClasses : attended;
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
            <Skeleton className="h-96 w-full" />
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
            <h2 className="text-3xl font-bold">{userDetails.name}</h2>
            <p className="text-muted-foreground">Roll No: {userDetails.rollNo}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Subjects" value={subjects.length} />
        <StatCard title="Overall Attendance" value={`${overallPercentage}%`} description={`${totalAttendance} / ${totalPossibleClasses} classes attended`} />
        <StatCard title="Records Logged" value={totalAttendance} description="Total check-ins" />
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Detailed student profile as per records.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-y-2 gap-x-8 md:grid-cols-2">
                <InfoRow label="Program" value={userDetails.program} />
                <InfoRow label="Branch" value={userDetails.branch} />
                <InfoRow label="Department" value={userDetails.department} />
                <InfoRow label="Section" value={userDetails.section} />
                <InfoRow label="Phone Number" value={userDetails.phone} />
                <InfoRow label="Parent's Name" value={userDetails.parentName} />
                <div className="md:col-span-2">
                    <InfoRow label="Address" value={userDetails.address} />
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
