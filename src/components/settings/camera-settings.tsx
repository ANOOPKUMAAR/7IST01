
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { countPeopleInImage } from "@/ai/flows/count-people-in-image-flow";
import { Camera, Users, Loader2 } from "lucide-react";

export function CameraSettings() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [headcount, setHeadcount] = useState<number | null>(null);

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
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleHeadcount = async () => {
    if (!videoRef.current) return;

    setIsCounting(true);
    setHeadcount(null);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL("image/jpeg");
        
        try {
            const result = await countPeopleInImage({ imageDataUri });
            setHeadcount(result.count);
        } catch (error) {
            console.error("Error counting people: ", error);
            toast({
                title: "Headcount Failed",
                description: "The AI could not process the image. Please try again.",
                variant: "destructive"
            });
        }
    }
    
    setIsCounting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Camera Headcount</CardTitle>
        <CardDescription>
          Use your device's camera for an automatic headcount. Grant permission when prompted.
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
                Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
            </Alert>
        )}

        {headcount !== null && (
            <Alert className="mt-4">
                <Users className="h-4 w-4" />
                <AlertTitle>Headcount Result</AlertTitle>
                <AlertDescription>
                    The AI detected <span className="font-bold">{headcount}</span> {headcount === 1 ? 'person' : 'people'}.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
          <Button onClick={handleHeadcount} disabled={!hasCameraPermission || isCounting} className="w-full">
              {isCounting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Counting...
                </>
              ) : (
                <>
                    <Camera className="mr-2" /> Take Snapshot & Count
                </>
              )}
          </Button>
      </CardFooter>
    </Card>
  );
}
