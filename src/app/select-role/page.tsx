"use client";

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GraduationCap, Briefcase, Database } from 'lucide-react';
import { Icons } from '@/components/icons';
import type { UserMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SelectRolePage() {
    const { mode, setMode } = useAppContext();
    const router = useRouter();

    const handleSelectRole = (newMode: UserMode) => {
        setMode(newMode);
        router.replace('/dashboard');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                     <Icons.logo className="h-16 w-16 text-primary mx-auto" />
                    <h1 className="text-3xl font-bold">Welcome to NetAttend</h1>
                    <p className="text-muted-foreground">Please select your role to continue.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>User Mode</CardTitle>
                        <CardDescription>Switch between student, faculty, and admin views.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup 
                            value={mode || ''} 
                            onValueChange={(value) => handleSelectRole(value as UserMode)} 
                            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                        >
                            <Label className="flex flex-col items-center justify-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 [&:has([data-state=checked])]:bg-accent">
                                <RadioGroupItem value="student" id="student-mode" className="sr-only" />
                                <GraduationCap className="h-8 w-8 mb-2" />
                                <span>Student</span>
                            </Label>
                            <Label className="flex flex-col items-center justify-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 [&:has([data-state=checked])]:bg-accent">
                                <RadioGroupItem value="faculty" id="faculty-mode" className="sr-only" />
                                <Briefcase className="h-8 w-8 mb-2" />
                                <span>Faculty</span>
                            </Label>
                            <Label className="flex flex-col items-center justify-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 [&:has([data-state=checked])]:bg-accent">
                                <RadioGroupItem value="admin" id="admin-mode" className="sr-only" />
                                <Database className="h-8 w-8 mb-2" />
                                <span>Admin</span>
                            </Label>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
