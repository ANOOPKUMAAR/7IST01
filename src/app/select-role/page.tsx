"use client";

import { useState } from 'react';
import type { UserMode } from '@/lib/types';
import { Icons } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Briefcase, Database, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/app-context';


export default function SelectRolePage() {
    const { login } = useAppContext();
    const [isLoading, setIsLoading] = useState<UserMode | null>(null);

    const handleLogin = (role: UserMode) => {
        setIsLoading(role);
        // Simulate a short delay to show loading state
        setTimeout(() => {
            const success = login(role);
            if (!success) {
                setIsLoading(null);
            }
        }, 500);
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
                        <Button size="lg" onClick={() => handleLogin('student')} disabled={!!isLoading}>
                            {isLoading === 'student' ? <Loader2 className="animate-spin" /> : <GraduationCap className="mr-2"/>}
                             Student
                        </Button>
                        <Button size="lg" variant="secondary" onClick={() => handleLogin('faculty')} disabled={!!isLoading}>
                            {isLoading === 'faculty' ? <Loader2 className="animate-spin" /> : <Briefcase className="mr-2"/>}
                            Faculty
                        </Button>
                         <Button size="lg" variant="secondary" onClick={() => handleLogin('admin')} disabled={!!isLoading}>
                            {isLoading === 'admin' ? <Loader2 className="animate-spin" /> : <Database className="mr-2"/>}
                            Admin
                         </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
