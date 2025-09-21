"use client";

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle, StopCircle } from 'lucide-react';
import Link from 'next/link';
import { FacultyAttendanceTable } from '@/components/subjects/faculty-attendance-table';

export default function FacultyClassDetailsPage() {
  const params = useParams();
  const classId = params.classId as string;
  const { facultyClasses } = useAppContext();
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);

  const cls = facultyClasses.find(c => c.id === classId);

  if (!cls) {
    notFound();
  }
  
  const toggleAttendance = () => {
    setIsAttendanceActive(prev => !prev);
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{cls.name}</h2>
            <p className="text-muted-foreground">
              Take and manage attendance for this class.
            </p>
          </div>
        </div>
        <Button onClick={toggleAttendance} variant={isAttendanceActive ? 'destructive' : 'default'}>
            {isAttendanceActive ? <StopCircle /> : <PlayCircle />}
            {isAttendanceActive ? 'End Attendance' : 'Start Attendance'}
        </Button>
      </div>

      <FacultyAttendanceTable subject={cls} isAttendanceActive={isAttendanceActive} />
      
    </div>
  );
}
