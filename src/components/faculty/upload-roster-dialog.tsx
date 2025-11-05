
"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { extractStudents } from "@/ai/flows/extract-students-flow";

interface UploadRosterDialogProps {
  classId: string;
  onDone: () => void;
}

export function UploadRosterDialog({ classId, onDone }: UploadRosterDialogProps) {
  const { enrollStudentsInClass } = useAppContext();
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
        const result = await extractStudents({ fileDataUri });
        if (result.students && result.students.length > 0) {
          enrollStudentsInClass(classId, result.students);
          onDone();
        } else {
          toast({
            title: "No students found",
            description: "The AI could not find any student data in the uploaded file.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error extracting students: ", error);
        toast({
          title: "Error analyzing file",
          description: "There was a problem processing your file. Please check the format and try again.",
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
          <Label htmlFor="roster-file">Student Roster File</Label>
          <Input
            id="roster-file"
            type="file"
            accept=".csv, .txt"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">
            Upload a CSV or TXT file. The file should contain at least a name and roll number for each student.
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            "Upload and Enroll"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

