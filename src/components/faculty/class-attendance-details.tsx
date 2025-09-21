"use client";

import { useMemo } from 'react';
import type { Class } from '@/lib/types';
import { useAppContext } from '@/contexts/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Download } from 'lucide-react';
import { Button } from '../ui/button';

export function ClassAttendanceDetails({ cls }: { cls: Class }) {
  const { attendance, subjects } = useAppContext();

  const classSubject = subjects.find(s => s.id === cls.id);
  const totalClasses = classSubject?.totalClasses || 20; // Default if not found

  const studentAttendanceData = useMemo(() => {
    const classAttendanceRecords = attendance[cls.id] || [];
    
    return cls.students.map(student => {
      const attendedCount = classAttendanceRecords.filter(rec => rec.studentId === student.id).length;
      const attendancePercentage = totalClasses > 0 ? Math.round((attendedCount / totalClasses) * 100) : 0;
      
      let progressColor = "bg-status-green";
      if (attendancePercentage < 75) progressColor = "bg-status-red";
      else if (attendancePercentage < 85) progressColor = "bg-status-orange";
      
      return {
        ...student,
        attendedCount,
        attendancePercentage,
        progressColor
      };
    });
  }, [cls, attendance, totalClasses]);
  
  const overallAttendance = useMemo(() => {
    if (studentAttendanceData.length === 0) return 0;
    const total = studentAttendanceData.reduce((acc, student) => acc + student.attendancePercentage, 0);
    return Math.round(total / studentAttendanceData.length);
  }, [studentAttendanceData]);

  const handleDownload = () => {
    const headers = ["Student Name", "Roll Number", "Attended Classes", "Total Classes", "Attendance Percentage"];
    const csvRows = [headers.join(',')];

    studentAttendanceData.forEach(student => {
        const row = [
            `"${student.name}"`,
            `"${student.rollNo}"`,
            student.attendedCount,
            totalClasses,
            `${student.attendancePercentage}%`
        ];
        csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${cls.name}_Attendance_Report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/20">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Attendance Overview for {cls.name}</CardTitle>
              <CardDescription>
                Overall class attendance is approximately {overallAttendance}%.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead className="w-[200px]">Attendance</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentAttendanceData.length > 0 ? studentAttendanceData.map(student => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.attendancePercentage} indicatorClassName={student.progressColor} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">{student.attendedCount}/{totalClasses}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{student.attendancePercentage}%</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No students are enrolled in this class.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
