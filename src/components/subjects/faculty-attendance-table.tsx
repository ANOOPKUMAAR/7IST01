
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import type { Subject, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Check, Wifi, Loader2, Users, AlertTriangle, Camera } from 'lucide-react';
import { getAutomaticHeadcount } from "@/actions/attendance-actions";
import { getCameraHeadcount } from "@/ai/flows/get-camera-headcount-flow";

type AttendanceStatus = "present" | "absent" | "unmarked";

function StudentAttendanceCard({ student, status, onStatusChange }: { student: Student, status: AttendanceStatus, onStatusChange: (studentId: string, status: AttendanceStatus) => void }) {
    
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
            </CardHeader>
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

export function FacultyAttendanceTable({ subject, isAttendanceActive }: { subject: Subject; isAttendanceActive: boolean }) {
  const { students, videoRef, requestCameraPermission, hasCameraPermission } = useAppContext();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isVerifyingWifi, setIsVerifyingWifi] = useState(false);
  const [isVerifyingCamera, setIsVerifyingCamera] = useState(false);
  const [wifiHeadcount, setWifiHeadcount] = useState<number | null>(null);
  const [cameraHeadcount, setCameraHeadcount] = useState<number | null>(null);

  const presentCount = useMemo(() => {
    return Object.values(attendance).filter(s => s === 'present').length;
  }, [attendance]);
  
  const isMismatch = (wifiHeadcount !== null && wifiHeadcount !== presentCount) || (cameraHeadcount !== null && cameraHeadcount !== presentCount);

  const fetchWifiHeadcount = useCallback(async (isInitialCall = false) => {
    if (!isInitialCall) {
        setIsVerifyingWifi(true);
    }
    try {
        const result = await getAutomaticHeadcount(subject.id, students.length);
        setWifiHeadcount(result.headcount);
    } catch (error) {
        console.error("Error getting Wi-Fi headcount:", error);
        if (isInitialCall) {
             toast({
                title: "Error Getting Wi-Fi Headcount",
                description: "Could not get simulated Wi-Fi headcount. Please try again.",
                variant: "destructive",
            });
        }
        setWifiHeadcount(null);
    } finally {
        if (!isInitialCall) {
            setIsVerifyingWifi(false);
        }
    }
  }, [subject.id, students.length, toast]);

  const fetchCameraHeadcount = useCallback(async () => {
    await requestCameraPermission(false);
    if (!videoRef.current || hasCameraPermission === false) {
      toast({
        title: "Camera not ready",
        description: "Camera permission is not granted or the camera is not yet initialized.",
        variant: "destructive",
      });
      return;
    };
    
    setIsVerifyingCamera(true);

    // Give camera time to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = document.createElement("canvas");
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      toast({
        title: "Camera Error",
        description: "Could not capture image from camera. Please try again.",
        variant: "destructive",
      });
      setIsVerifyingCamera(false);
      return;
    }
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
        setIsVerifyingCamera(false);
    }
  }, [hasCameraPermission, requestCameraPermission, toast, videoRef]);

  useEffect(() => {
    let wifiInterval: NodeJS.Timeout;
    if (isAttendanceActive) {
        fetchWifiHeadcount(true); 
        fetchCameraHeadcount();
        wifiInterval = setInterval(() => fetchWifiHeadcount(false), 10000); 
    } else {
        setWifiHeadcount(null);
        setCameraHeadcount(null);
    }

    return () => {
        if(wifiInterval) clearInterval(wifiInterval)
    };
  }, [isAttendanceActive, fetchWifiHeadcount, fetchCameraHeadcount]);


  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const handleSaveAttendance = () => {
    if (isMismatch) {
        toast({
            title: "Headcount Mismatch",
            description: `One of the automated headcounts does not match the number of students marked as present. Please review attendance before saving.`,
            variant: "destructive",
            duration: 8000,
        });
        return;
    }

    toast({
      title: "Attendance Saved",
      description: "The attendance record for today's class has been saved.",
      action: (isMismatch || wifiHeadcount === null) ? undefined : (
        <div className="flex items-center text-primary-foreground">
          <Check className="mr-2"/>
          <span>Verified</span>
        </div>
      ),
      variant: (wifiHeadcount !== null && wifiHeadcount === presentCount) ? "success" : "default"
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
        <Card className={cn(isMismatch && "border-destructive")}>
            <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <CardTitle>Attendance Verification</CardTitle>
                        <CardDescription>Compare automated headcounts with your manual count.</CardDescription>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={() => fetchWifiHeadcount(true)} disabled={isVerifyingWifi}>
                            {isVerifyingWifi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wifi className="mr-2"/>}
                            Refresh Wi-Fi
                        </Button>
                         <Button variant="outline" onClick={fetchCameraHeadcount} disabled={isVerifyingCamera}>
                            {isVerifyingCamera ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2"/>}
                            Refresh Camera
                        </Button>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg bg-muted p-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold flex items-center justify-center gap-2">
                           <Wifi/> {wifiHeadcount ?? '-'}
                        </p>
                        <p className="text-sm text-muted-foreground">Simulated Wi-Fi Headcount</p>
                    </div>
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
                       <p>Headcount does not match. Please review.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Class Roster</CardTitle>
                <CardDescription>Mark attendance for each student below.</CardDescription>
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
                <Button onClick={handleSaveAttendance} className="w-full sm:w-auto ml-auto" disabled={isVerifyingWifi || isVerifyingCamera}>
                    <Check className="mr-2"/> Save Attendance
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
