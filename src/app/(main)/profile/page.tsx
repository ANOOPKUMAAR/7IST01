
"use client";

import { useAppContext } from "@/contexts/app-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { UserDetails } from "@/lib/types";
import { User, Edit } from "lucide-react";

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

function EditProfileDialog({ onDone }: { onDone: () => void }) {
    const { userDetails, updateUserDetails } = useAppContext();
    const { register, handleSubmit } = useForm<UserDetails>({
        defaultValues: userDetails
    });

    const onSubmit: SubmitHandler<UserDetails> = (data) => {
        updateUserDetails(data);
        onDone();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="rollNo">Roll No.</Label>
                    <Input id="rollNo" {...register("rollNo")} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="program">Program</Label>
                    <Input id="program" {...register("program")} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" {...register("branch")} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" {...register("department")} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="section">Section</Label>
                    <Input id="section" {...register("section")} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="parentName">Parent's Name</Label>
                    <Input id="parentName" {...register("parentName")} />
                </div>
                <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address")} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
        </form>
    )
}


export default function ProfilePage() {
  const { subjects, attendance, isLoaded, userDetails, adminMode } = useAppContext();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const { totalAttendance, overallPercentage, totalPossibleClasses } = useMemo(() => {
    let totalAttendance = 0;
    let totalPossibleClasses = 0;
    
    subjects.forEach(subject => {
        const attended = attendance[subject.id]?.length || 0;
        totalAttendance += attended;
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
      <div className="flex items-center justify-between">
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
        {adminMode && (
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline"><Edit className="mr-2"/> Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Update the student's information. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <EditProfileDialog onDone={() => setEditDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        )}
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
