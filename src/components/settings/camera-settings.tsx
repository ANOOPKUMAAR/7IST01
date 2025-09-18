
"use client";

import { useEffect, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";

export function CameraSettings() {
  const { hasCameraPermission, setHasCameraPermission } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };
    
    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [setHasCameraPermission, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Camera Preview</CardTitle>
        <CardDescription>
          This screen is used to grant camera permissions to the app. The AI headcount feature will activate automatically upon check-in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center border relative overflow-hidden">
            {hasCameraPermission === null && <Skeleton className="h-full w-full" />}
            
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser settings to use this feature. The automatic headcount will not work without it.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
