"use client";

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Database, ChevronRight } from 'lucide-react';
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
            <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md w-full">
                <Icons.logo className="h-16 w-16 text-primary" />
                <div className='space-y-2'>
                    <h1 className="text-3xl font-bold">Welcome to NetAttend</h1>
                    <p className="text-muted-foreground">Please select your role to continue.</p>
                </div>
                
                <div className="w-full space-y-4">
                    <Card
                        className="text-left hover:bg-accent hover:border-primary cursor-pointer transition-all"
                        onClick={() => handleSelectRole('student')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                           <div className='flex items-center gap-4'>
                             <GraduationCap className="h-10 w-10 text-primary" />
                             <div>
                                 <CardTitle>Student</CardTitle>
                                 <CardDescription>Mark attendance and track your progress.</CardDescription>
                             </div>
                           </div>
                           <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                    </Card>

                     <Card
                        className="text-left hover:bg-accent hover:border-primary cursor-pointer transition-all"
                        onClick={() => handleSelectRole('faculty')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                           <div className='flex items-center gap-4'>
                             <Briefcase className="h-10 w-10 text-primary" />
                             <div>
                                 <CardTitle>Faculty</CardTitle>
                                 <CardDescription>Manage classes and take attendance.</CardDescription>
                             </div>
                           </div>
                           <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                    </Card>

                     <Card
                        className="text-left hover:bg-accent hover:border-primary cursor-pointer transition-all"
                        onClick={() => handleSelectRole('admin')}
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                           <div className='flex items-center gap-4'>
                             <Database className="h-10 w-10 text-primary" />
                             <div>
                                 <CardTitle>Admin</CardTitle>
                                 <CardDescription>Manage all university data and settings.</CardDescription>
                             </div>
                           </div>
                           <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}