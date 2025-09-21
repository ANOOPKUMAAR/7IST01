"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { extractFaculty } from "@/ai/flows/extract-faculty-flow";

interface UploadFacultyListDialogProps {
  onDone: () => void;
}

export function UploadFacultyListDialog({ onDone }: UploadFacultyListDialogProps) {
  const { bulkAddFaculty } = useAppContext();
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
        const result = await extractFaculty({ fileDataUri });
        if (result.faculty && result.faculty.length > 0) {
          bulkAddFaculty(result.faculty);
          toast({
            title: "Faculty Imported",
            description: `${result.faculty.length} new faculty members have been added.`,
          });
          onDone();
        } else {
          toast({
            title: "No faculty found",
            description: "The AI could not find any faculty data in the uploaded file.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error extracting faculty: ", error);
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
          <Label htmlFor="faculty-list-file">Faculty List File</Label>
          <Input
            id="faculty-list-file"
            type="file"
            accept=".csv, .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">
            Upload a CSV, TXT, or XLSX file. The file should contain at least name, email, department, and designation.
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
            "Upload and Import"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
