
"use client";

import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Nfc } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState, useEffect } from "react";
import type { Subject } from "@/lib/types";

export function NfcSettings() {
  const { subjects, activeCheckIn, checkIn, checkOut, isLoaded } = useAppContext();
  const { toast } = useToast();
  const [currentSubject, setCurrentSubject] = useState<Subject | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const subjectForNow = subjects.find(subject => {
        if (subject.dayOfWeek !== dayOfWeek) return false;

        const [startHour, startMinute] = subject.expectedCheckIn.split(':').map(Number);
        const [endHour, endMinute] = subject.expectedCheckOut.split(':').map(Number);
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);

        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        const nowTime = currentHour * 60 + currentMinute;

        return nowTime >= startTime && nowTime <= endTime;
    });

    setCurrentSubject(subjectForNow);
  }, [subjects, isLoaded, activeCheckIn]);

  const handleNfcScan = () => {
    if (activeCheckIn) {
      // If we are checked in for any subject, scan will check out.
      checkOut(activeCheckIn.subjectId);
    } else if (currentSubject) {
      // If we are not checked in, and there's a class now, check in.
      checkIn(currentSubject.id);
    } else {
      // Otherwise, no class is scheduled.
      toast({
        title: "No Class Scheduled",
        description: "There is no class scheduled at the current time.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFC Attendance</CardTitle>
        <CardDescription>
          Use an NFC tag for quick check-ins and check-outs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-12 text-center">
            <Nfc className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">
                {activeCheckIn ? "Tap to Check Out" : (currentSubject ? `Tap to Check In for ${currentSubject.name}`: "No class right now")}
            </p>
            <Button size="lg" onClick={handleNfcScan}>
                Simulate NFC Scan
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
