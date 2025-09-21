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
import { Nfc, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NfcSettings() {
  const { subjects, activeCheckIn, checkIn, checkOut, isLoaded } = useAppContext();
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
          Use the simulated NFC scan for quick check-ins and check-outs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-background p-4 space-y-4">
            <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 mt-1 text-primary"/>
                <div>
                    <h3 className="font-semibold">How to Mark Your Attendance Automatically</h3>
                    <p className="text-sm text-muted-foreground">Follow these steps to ensure your attendance is recorded correctly:</p>
                </div>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm pl-2">
                <li>
                    <strong>Navigate here during class time.</strong> This screen will show you which class is currently active.
                </li>
                <li>
                    <strong>Tap the "Simulate NFC Scan" button.</strong> This will check you in for the current subject.
                </li>
                <li>
                    <strong>Tap again to check out.</strong> At the end of the class, return to this screen and tap the button again to check out.
                </li>
            </ol>
            <p className="text-xs text-muted-foreground pl-2">
                <strong>Note:</strong> An administrator must define a Wi-Fi zone in the settings for this feature to work. This simulates being in a specific location like a classroom.
            </p>
        </div>

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
