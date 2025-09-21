"use client";

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Database } from 'lucide-react';
import { Icons } from '@/components/icons';
import type { UserMode } from '@/lib/types';

export default function SelectRolePage() {
    const { setMode } = useAppContext();
    const router = useRouter();

    const handleSelectRole = (mode: UserMode) => {
        setMode(mode);
        router.replace('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-xs w-full">
                <Icons.logo className="h-16 w-16 text-primary" />
                <div className='space-y-2'>
                    <h1 className="text-3xl font-bold">Welcome to NetAttend</h1>
                    <p className="text-muted-foreground">Please select your role to continue.</p>
                </div>
                
                <div className="w-full space-y-4 pt-4">
                    <Button
                        variant="outline"
                        className="w-full h-14 text-lg justify-start"
                        onClick={() => handleSelectRole('student')}
                    >
                        <GraduationCap className="mr-4 h-6 w-6" />
                        Student Login
                    </Button>
                     <Button
                        variant="outline"
                        className="w-full h-14 text-lg justify-start"
                        onClick={() => handleSelectRole('faculty')}
                    >
                         <Briefcase className="mr-4 h-6 w-6" />
                        Faculty Login
                    </Button>
                     <Button
                        variant="outline"
                        className="w-full h-14 text-lg justify-start"
                        onClick={() => handleSelectRole('admin')}
                    >
                         <Database className="mr-4 h-6 w-6" />
                        Admin Login
                    </Button>
                </div>
            </div>
        </div>
    );
}
