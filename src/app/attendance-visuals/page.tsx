"use client";

import { AttendanceCharts } from "@/components/visuals/attendance-charts";
import { AttendanceByDay } from "@/components/visuals/attendance-by-day";
import { OverallAttendanceSummary } from "@/components/visuals/overall-attendance-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart, Briefcase, GraduationCap, UserCheck } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import type { Class, Department, Program, Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FacultyClassInfo {
  class: Class;
  department: Department;
  program: Program;
}

function FacultyAttendancePage() {
  const { programsBySchool, isLoaded } = useAppContext();
  const facultyName = "Prof. Ada Lovelace"; // Simulating the current faculty user

  const facultyClasses = useMemo(() => {
    if (!isLoaded) return [];
    const classes: FacultyClassInfo[] = [];
    Object.values(programsBySchool).flat().forEach(program => {
        program.departments.forEach(department => {
            department.classes.forEach(cls => {
                if (cls.faculties.includes(facultyName)) {
                    classes.push({ class: cls, department, program });
                }
            });
        });
    });
    return classes;
  }, [programsBySchool, isLoaded, facultyName]);

  const taughtCount = useMemo(() => {
      const counts: Record<string, number> = {};
      facultyClasses.forEach(info => {
          counts[info.class.id] = Math.floor(Math.random() * 5 + 12); // Simulate 12-16 classes taught
      });
      return counts;
  }, [facultyClasses]);

  const uniqueStudents = useMemo(() => {
    const studentMap = new Map<string, Student>();
    facultyClasses.forEach(info => {
      info.class.students.forEach(student => {
        studentMap.set(student.id, student);
      });
    });
    return Array.from(studentMap.values());
  }, [facultyClasses]);
  
  const studentAttendancePercentages = useMemo(() => {
    const percentages: Record<string, number> = {};
    uniqueStudents.forEach(student => {
        // Simulate a realistic attendance percentage between 65% and 98%
        percentages[student.id] = Math.floor(Math.random() * (98 - 65 + 1) + 65);
    });
    return percentages;
  }, [uniqueStudents]);

  const getProgressColor = (percentage: number) => {
    if (percentage < 75) return "bg-status-red";
    if (percentage < 85) return "bg-status-orange";
    return "bg-status-green";
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-primary"/>
                    <div>
                        <CardTitle>My Taught Classes</CardTitle>
                        <CardDescription>
                        Summary of classes taught this semester for {facultyName}.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {facultyClasses.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Classes Taught</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {facultyClasses.map((info) => (
                        <TableRow key={info.class.id}>
                        <TableCell className="font-medium">{info.class.name}</TableCell>
                        <TableCell>{info.program.name}</TableCell>
                        <TableCell>{info.department.name}</TableCell>
                        <TableCell className="text-right font-mono">{taughtCount[info.class.id] || 0}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                ) : (
                <div className="flex flex-col items-center text-center gap-4 p-8">
                    <Briefcase className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground">
                    You are not assigned to any classes yet.
                    </p>
                </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <GraduationCap className="h-8 w-8 text-primary"/>
                    <div>
                        <CardTitle>Student Attendance Summary</CardTitle>
                        <CardDescription>
                            Overall attendance for all students in your classes.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {uniqueStudents.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Roll Number</TableHead>
                                <TableHead className="w-[200px]">Attendance %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uniqueStudents.map(student => {
                                const percentage = studentAttendancePercentages[student.id] || 0;
                                return (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell className="font-mono text-xs">{student.rollNo}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={percentage} indicatorClassName={getProgressColor(percentage)} className="h-2"/>
                                            <span className="font-mono text-xs w-10 text-right">{percentage}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center text-center gap-4 p-8">
                        <UserCheck className="h-16 w-16 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No students are enrolled in your classes yet.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

export default function AttendanceVisualsPage() {
  const { mode } = useAppContext();

  if (mode === "faculty") {
    return <FacultyAttendancePage />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Attendance Visuals
        </h2>
        <p className="text-muted-foreground">
          Explore your attendance data with these charts.
        </p>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">
            <BarChart className="mr-2 h-4 w-4" /> Subject Breakdown
          </TabsTrigger>
          <TabsTrigger value="summary">
            <PieChart className="mr-2 h-4 w-4" /> Overall Summary
          </TabsTrigger>
          <TabsTrigger value="daily">
            <LineChart className="mr-2 h-4 w-4" /> Daily Trend
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-4">
          <AttendanceCharts />
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <div className="max-w-md mx-auto">
            <OverallAttendanceSummary />
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <AttendanceByDay />
        </TabsContent>
      </Tabs>
    </div>
  );
}
