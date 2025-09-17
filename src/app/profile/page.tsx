
"use client";

import { useAppContext } from "@/contexts/app-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { User, Edit, Briefcase, GraduationCap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { subjects, attendance, isLoaded, userDetails, mode, setMode } = useAppContext();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

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
        <div className="space-y-6">
             <Skeleton className="h-40 w-full" />
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle>User Mode</CardTitle>
                <CardDescription>Switch between student and faculty views.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                        <GraduationCap />
                        <Label htmlFor="mode-switch">Student</Label>
                    </div>
                    <Switch 
                        id="mode-switch"
                        checked={mode === 'faculty'}
                        onCheckedChange={(checked) => setMode(checked ? 'faculty' : 'student')}
                    />
                    <div className="flex items-center space-x-2">
                        <Briefcase />
                        <Label htmlFor="mode-switch">Faculty</Label>
                    </div>
                </div>
            </CardContent>
        </Card>

      {mode === 'student' ? (
        <>
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
            
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>A visual summary of your attendance.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <div className="h-64 w-full max-w-sm">
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
                    <div className="mt-4 flex gap-x-6 text-center">
                        <div>
                            <p className="text-2xl font-bold text-status-green">{totalAttended}</p>
                            <p className="text-sm text-muted-foreground">Classes Attended</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-status-red">{totalMissed}</p>
                            <p className="text-sm text-muted-foreground">Classes Missed</p>
                        </div>
                    </div>

                    <Tabs defaultValue="breakdown" className="w-full mt-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="breakdown">Course Breakdown</TabsTrigger>
                            <TabsTrigger value="day-hour">Day/Hour View</TabsTrigger>
                        </TabsList>
                        <TabsContent value="breakdown">
                            <p className="p-4 text-center text-muted-foreground">Course breakdown visuals will be shown here.</p>
                        </TabsContent>
                        <TabsContent value="day-hour">
                            <p className="p-4 text-center text-muted-foreground">Day and hour attendance patterns will be shown here.</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
      ) : (
        <Card>
            <CardHeader className="items-center text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-2"/>
                <CardTitle>Faculty Mode</CardTitle>
                <CardDescription>This is the faculty dashboard view. More features coming soon!</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-center text-muted-foreground">You can manage your courses and view student attendance from the main dashboard.</p>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
