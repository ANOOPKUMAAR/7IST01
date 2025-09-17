
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

export function CameraSettings() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description:
            "Please enable camera permissions in your browser settings to use this app.",
        });
      }
    };

    getCameraPermission();
    
    // Cleanup function to stop the video stream when the component unmounts
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Camera Access</CardTitle>
        <CardDescription>
          Preview and test your device's camera. Grant permission when prompted by your browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center border">
            {hasCameraPermission === null && <Skeleton className="h-full w-full" />}
            
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
        </div>

        {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
