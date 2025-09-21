
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAppContext } from "@/contexts/app-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Subject, Student, Class } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Check, Wifi, Loader2, Users, AlertTriangle, Camera, UserCheck, UserX, Eye } from 'lucide-react';
import { getCameraHeadcount } from "@/ai/flows/get-camera-headcount-flow";
import { StudentDetailsDialog } from "@/components/admin/student-details-dialog";

type AttendanceStatus = "present" | "absent" | "unmarked";

function StudentAttendanceCard({ student, status, onStatusChange }: { student: Student, status: AttendanceStatus, onStatusChange: (studentId: string, status: AttendanceStatus) => void }) {
    const [isDetailsOpen, setDetailsOpen] = useState(false);
    
    const getStatusBadge = () => {
        switch (status) {
            case "present":
                return <Badge variant="secondary" className="bg-white/20 text-primary-foreground">Present</Badge>;
            case "absent":
                return <Badge variant="destructive" className="bg-white/20 text-primary-foreground">Absent</Badge>;
            default:
                return <Badge variant="outline">Unmarked</Badge>;
        }
    }

    return (
        <Card className={cn(
            "transition-colors",
            status === 'present' && 'bg-status-green text-primary-foreground',
            status === 'absent' && 'bg-status-red text-destructive-foreground',
        )}>
            <CardHeader className={cn(
                "flex flex-row items-center justify-between pb-2",
                 (status === 'present' || status === 'absent') && 'text-primary-foreground'
            )}>
                <div className="flex-1">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription className={cn(
                        status === 'present' && 'text-green-100',
                        status === 'absent' && 'text-red-100'
                    )}>
                        {student.rollNo}
                    </CardDescription>
                </div>
                {getStatusBadge()}
                 <StudentDetailsDialog student={student} open={isDetailsOpen} onOpenChange={setDetailsOpen}>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); setDetailsOpen(true);}}>
                        <Eye className={cn("h-5 w-5", (status === 'present' || status === 'absent') && 'text-primary-foreground')} />
                    </Button>
                </StudentDetailsDialog>
            </CardHeader>
            <CardContent>
               
            </CardContent>
            <CardFooter className="gap-2">
                <Button 
                    className="w-full"
                    size="sm" 
                    variant={'secondary'}
                    onClick={() => onStatusChange(student.id, "present")}
                >
                    Present
                </Button>
                <Button 
                    className="w-full"
                    size="sm" 
                    variant={'secondary'}
                    onClick={() => onStatusChange(student.id, "absent")}
                >
                    Absent
                </Button>
            </CardFooter>
        </Card>
    )
}

export function FacultyAttendanceTable({ subject, isAttendanceActive }: { subject: Class; isAttendanceActive: boolean }) {
  const { requestCameraPermission, hasCameraPermission, stopCameraStream, recordClassAttendance } = useAppContext();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isVerifyingCamera, setIsVerifyingCamera] = useState(false);
  const [isSyncingWifi, setIsSyncingWifi] = useState(false);
  const [cameraHeadcount, setCameraHeadcount] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const students = subject.students || [];

  const presentCount = useMemo(() => {
    return Object.values(attendance).filter(s => s === 'present').length;
  }, [attendance]);
  
  const isMismatch = cameraHeadcount !== null && cameraHeadcount !== presentCount;

  const handleWifiSync = async () => {
    if (cameraHeadcount === null) {
        toast({
            title: "Camera Headcount Not Available",
            description: "Please use the 'Refresh Camera' button to get a headcount before syncing.",
            variant: "destructive"
        });
        return;
    }

    setIsSyncingWifi(true);
    toast({
        title: "Syncing with Camera Headcount...",
        description: `Marking ${cameraHeadcount} students as present based on the camera's count.`
    });

    try {
        const newAttendance: Record<string, AttendanceStatus> = {};
        const shuffledStudents = [...students].sort(() => 0.5 - Math.random());
        
        shuffledStudents.forEach((student, index) => {
            if(index < cameraHeadcount) {
                newAttendance[student.id] = 'present';
            } else {
                newAttendance[student.id] = 'unmarked';
            }
        });

        setAttendance(newAttendance);
        toast({
            title: "Sync Complete",
            description: `Attendance roster updated based on the camera's headcount of ${cameraHeadcount}.`,
            variant: "success"
        });

    } catch (error) {
        console.error("Error with camera headcount sync:", error);
        toast({
            title: "Sync Failed",
            description: "An unexpected error occurred while updating the roster.",
            variant: "destructive"
        });
    } finally {
        setIsSyncingWifi(false);
    }
  }

  const fetchCameraHeadcount = useCallback(async () => {
    if (!videoRef.current) {
      toast({
        title: "Camera not ready",
        description: "The camera element is not yet available.",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifyingCamera(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      toast({
        title: "Camera Error",
        description: "Could not capture image from camera. The video stream may not be ready. Please try again.",
        variant: "destructive",
      });
      setIsVerifyingCamera(false);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");

    if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL("image/jpeg");
        
        try {
            const result = await getCameraHeadcount({ imageDataUri });
            setCameraHeadcount(result.count);
        } catch (error) {
            console.error("Error counting people: ", error);
            toast({
                title: "AI Headcount Failed",
                description: "The AI could not process the image. Please try again.",
                variant: "destructive"
            });
            setCameraHeadcount(null);
        } finally {
            setIsVerifyingCamera(false);
        }
    } else {
        toast({
            title: "Canvas Error",
            description: "Could not process the camera image. Your browser may not support this feature.",
            variant: "destructive"
        });
        setIsVerifyingCamera(false);
    }
  }, [toast]);

  useEffect(() => {
    
    const startAttendanceSystems = async () => {
      streamRef.current = await requestCameraPermission(videoRef.current, true);
      if(streamRef.current){
        fetchCameraHeadcount();
      }
    };
    
    if (isAttendanceActive) {
      startAttendanceSystems();
    } else {
      setCameraHeadcount(null);
      stopCameraStream(streamRef.current, videoRef.current);
      streamRef.current = null;
    }

    return () => {
      stopCameraStream(streamRef.current, videoRef.current);
      streamRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAttendanceActive]);


  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: "present" | "absent") => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };
  
  const handleSaveAttendance = () => {
    if (isMismatch) {
        toast({
            title: "Headcount Mismatch",
            description: `The AI camera headcount does not match the number of students marked as present. Please review attendance before saving.`,
            variant: "destructive",
            duration: 8000,
        });
        return;
    }

    const presentStudentIds = Object.entries(attendance)
      .filter(([, status]) => status === 'present')
      .map(([studentId]) => studentId);

    const absentStudentIds = Object.entries(attendance)
      .filter(([, status]) => status === 'absent')
      .map(([studentId]) => studentId);
      
    recordClassAttendance(subject, presentStudentIds, absentStudentIds);

    toast({
      title: "Attendance Saved",
      description: "The attendance record for today's class has been saved.",
      action: (isMismatch || cameraHeadcount === null) ? undefined : (
        <div className="flex items-center text-primary-foreground">
          <Check className="mr-2"/>
          <span>Verified by AI Camera</span>
        </div>
      ),
      variant: (cameraHeadcount !== null && cameraHeadcount === presentCount) ? "success" : "default"
    });
  }

  if (!isAttendanceActive) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Not Started</CardTitle>
                <CardDescription>Click the "Start Attendance" button to begin the session.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center gap-4 p-12">
                <Users className="h-24 w-24 text-muted-foreground" />
                <p className="text-muted-foreground">The attendance roster will appear here once the session starts.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
        <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />

        <Card className={cn(isMismatch && "border-destructive")}>
            <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <CardTitle>Attendance Verification</CardTitle>
                        <CardDescription>Compare automated headcounts with your manual count.</CardDescription>
                    </div>
                     <div className="flex gap-2">
                         <Button variant="outline" onClick={handleWifiSync} disabled={isSyncingWifi}>
                            {isSyncingWifi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wifi className="mr-2"/>}
                            Sync with Camera
                        </Button>
                         <Button variant="outline" onClick={fetchCameraHeadcount} disabled={isVerifyingCamera}>
                            {isVerifyingCamera ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2"/>}
                            Refresh Camera
                        </Button>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                     <div className="text-center">
                        <p className="text-3xl font-bold flex items-center justify-center gap-2">
                           <Camera/> {cameraHeadcount ?? '-'}
                        </p>
                        <p className="text-sm text-muted-foreground">AI Camera Headcount</p>
                    </div>
                     <div className="text-center">
                        <p className="text-3xl font-bold flex items-center justify-center gap-2">
                           <Check/> {presentCount}
                        </p>
                        <p className="text-sm text-muted-foreground">Marked as Present</p>
                    </div>
                </div>
                {isMismatch && (
                    <div className="mt-4 text-center text-destructive flex items-center justify-center gap-2">
                       <AlertTriangle className="h-4 w-4" />
                       <p>Camera headcount does not match. Please review.</p>
                    </div>
                )}
                 {hasCameraPermission === false && (
                    <div className="mt-4 text-center text-destructive flex items-center justify-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <p>Camera permission denied. Camera headcount is unavailable.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Class Roster</CardTitle>
                        <CardDescription>Mark attendance for each student below.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')}>
                            <UserCheck className="mr-2 h-4 w-4" /> Mark All Present
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')}>
                            <UserX className="mr-2 h-4 w-4" /> Mark All Absent
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {students.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {students.map((student) => (
                            <StudentAttendanceCard
                                key={student.id}
                                student={student}
                                status={attendance[student.id] || "unmarked"}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-12">
                        No students have been added to this class yet.
                    </p>
                )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveAttendance} className="w-full sm:w-auto ml-auto" disabled={isVerifyingCamera}>
                    <Check className="mr-2"/> Save Attendance
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}

    