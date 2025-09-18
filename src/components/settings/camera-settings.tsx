
"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";
import { useAppContext } from "@/contexts/app-context";

export function CameraSettings() {
  const { hasCameraPermission, requestCameraPermission, videoRef } = useAppContext();

  useEffect(() => {
    if (hasCameraPermission === null) {
      requestCameraPermission();
    }
  }, [hasCameraPermission, requestCameraPermission]);
  
  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [videoRef]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Camera Preview</CardTitle>
        <CardDescription>
          This screen is used to grant camera permissions to the app. The AI headcount feature will activate automatically upon check-in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center border relative">
            {hasCameraPermission === null && <Skeleton className="h-full w-full" />}
            
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
        </div>

        {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                Please allow camera access in your browser settings to use this feature. The automatic headcount will not work without it.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}

    