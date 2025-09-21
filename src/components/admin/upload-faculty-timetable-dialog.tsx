"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { extractClasses } from "@/ai/flows/extract-classes-flow";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { Faculty } from "@/lib/types";

interface UploadFacultyTimetableDialogProps {
  faculty: Faculty;
  onDone: () => void;
}

export function UploadFacultyTimetableDialog({
  faculty,
  onDone,
}: UploadFacultyTimetableDialogProps) {
  const { assignFacultyToClassesFromTimetable } = useAppContext();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const fileDataUri = e.target?.result as string;
      try {
        const result = await extractClasses({ fileDataUri });
        if (result.classes && result.classes.length > 0) {
          assignFacultyToClassesFromTimetable(faculty, result.classes);
          onDone();
        } else {
          toast({
            title: "No classes found",
            description:
              "The AI could not find any classes in the uploaded file.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error extracting classes: ", error);
        toast({
          title: "Error analyzing file",
          description:
            "There was a problem processing your timetable. Please try another file.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Could not read the selected file.",
        variant: "destructive",
      });
      setIsUploading(false);
    };
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="timetable-file">Timetable File</Label>
          <Input
            id="timetable-file"
            type="file"
            accept="image/png, image/jpeg, application/pdf"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">
            Upload an image or PDF of the faculty's schedule. This will replace
            the current timetable. The system will match classes by name, day,
            and time.
          </p>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isUploading}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing &
              Assigning...
            </>
          ) : (
            "Upload and Assign"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
