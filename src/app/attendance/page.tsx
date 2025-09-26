
"use client";

import { useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wifi, WifiOff, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WifiAttendancePage() {
  const { subjects, activeCheckIn, checkIn, checkOut, isLoaded, wifiZones } = useAppContext();
  const { toast } = useToast();

  const currentSubject = (() => {
    if (!isLoaded) return undefined;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    return subjects.find(subject => {
        if (subject.dayOfWeek !== dayOfWeek) return false;

        const [startHour, startMinute] = subject.expectedCheckIn.split(':').map(Number);
        const [endHour, endMinute] = subject.expectedCheckOut.split(':').map(Number);
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);

        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        const nowTime = currentHour * 60 + currentMinute;

        return nowTime >= startTime && nowTime <= endTime;
    });
  })();
  
  // Simulate being in a valid Wi-Fi zone
  const isInZone = wifiZones.length > 0;

  useEffect(() => {
    if (isLoaded && isInZone && currentSubject && !activeCheckIn) {
      checkIn(currentSubject.id);
    }
  }, [isLoaded, isInZone, currentSubject, activeCheckIn, checkIn]);
  
  const handleManualCheckout = () => {
    if (activeCheckIn) {
        checkOut(activeCheckIn.subjectId);
    }
  }

  const getStatusContent = () => {
      if (!isLoaded) {
          return {
              icon: <Wifi className="h-20 w-20 text-muted-foreground animate-pulse" />,
              title: "Initializing...",
              description: "Getting things ready for you.",
          }
      }
      if (!isInZone) {
        return {
            icon: <WifiOff className="h-20 w-20 text-destructive" />,
            title: "Outside Wi-Fi Zone",
            description: "Please connect to a designated campus Wi-Fi network to mark your attendance.",
        }
      }
      if (activeCheckIn && currentSubject) {
        return {
            icon: <CheckCircle2 className="h-20 w-20 text-status-green" />,
            title: "You are Checked In!",
            description: `Your attendance for ${subjects.find(s => s.id === activeCheckIn.subjectId)?.name} is being recorded.`,
        }
      }
      if (currentSubject) {
        return {
            icon: <Wifi className="h-20 w-20 text-primary animate-pulse" />,
            title: "Connecting...",
            description: "You are in a valid Wi-Fi zone. Attempting to check you in automatically.",
        }
      }
      return {
        icon: <XCircle className="h-20 w-20 text-muted-foreground" />,
        title: "No Class Scheduled",
        description: "There are no classes scheduled at this time. Check your timetable for more details.",
      }
  }

  const { icon, title, description } = getStatusContent();


  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Automatic Wi-Fi Attendance</CardTitle>
            <CardDescription>
              Your attendance is automatically recorded when you're connected to a campus Wi-Fi zone during class hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-12 text-center">
                {icon}
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

    