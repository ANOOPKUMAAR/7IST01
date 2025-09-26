"use client";

import { useState } from 'react';
import type { UserMode } from '@/lib/types';
import { Icons } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Briefcase, Database, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/login-form';


export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState<UserMode | null>(null);

    if (selectedRole) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                <div className="w-full max-w-sm space-y-6">
                    <Button variant="ghost" onClick={() => setSelectedRole(null)} className="absolute top-4 left-4">
                        <ArrowLeft className="mr-2"/> Back to role selection
                    </Button>
                    <LoginForm role={selectedRole} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                     <Icons.logo className="h-16 w-16 text-primary mx-auto" />
                    <h1 className="text-3xl font-bold">Welcome to NetAttend</h1>
                    <p className="text-muted-foreground">Please select your role to continue.</p>
                </div>
                 <Card>
                    <CardContent className="p-6 flex flex-col gap-4">
                        <Button size="lg" onClick={() => setSelectedRole('student')}>
                            <GraduationCap className="mr-2"/> Student
                        </Button>
                        <Button size="lg" variant="secondary" onClick={() => setSelectedRole('faculty')}>
                            <Briefcase className="mr-2"/> Faculty
                        </Button>
                         <Button size="lg" variant="secondary" onClick={() => setSelectedRole('admin')}>
                            <Database className="mr-2"/> Admin
                         </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
