
"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { extractTimetable } from "@/ai/flows/extract-timetable-flow";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

export function UploadTimetableDialog({ onDone }: { onDone: () => void }) {
  const { bulkAddSubjects } = useAppContext();
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
        const result = await extractTimetable({ fileDataUri });
        if (result.subjects && result.subjects.length > 0) {
          bulkAddSubjects(result.subjects);
          onDone();
        } else {
          toast({
            title: "No subjects found",
            description:
              "The AI could not find any subjects in the uploaded file.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error extracting timetable: ", error);
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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timetable-file">Upload Timetable File</Label>
          <Input
            id="timetable-file"
            type="file"
            accept="image/png, image/jpeg, application/pdf"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">
            Uploading a new file will replace your current timetable.
          </p>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isUploading}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            "Upload and Replace"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
