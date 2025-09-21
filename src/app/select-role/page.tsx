"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/app-context';
import type { UserMode } from '@/lib/types';
import { Icons } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Briefcase, Database } from 'lucide-react';

export default function SelectRolePage() {
    const { setMode } = useAppContext();
    const router = useRouter();

    const handleSelectRole = (mode: UserMode) => {
        setMode(mode);
        router.push('/dashboard');
    };

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
                        <Button size="lg" onClick={() => handleSelectRole('student')}>
                            <GraduationCap className="mr-2"/> Student Login
                        </Button>
                        <Button size="lg" variant="secondary" onClick={() => handleSelectRole('faculty')}>
                            <Briefcase className="mr-2"/> Faculty Login
                        </Button>
                         <Button size="lg" variant="secondary" onClick={() => handleSelectRole('admin')}>
                            <Database className="mr-2"/> Admin Login
                         </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
