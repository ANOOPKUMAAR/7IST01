
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppContext } from "@/contexts/app-context";
import type { Subject } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Trash, Edit, PlusCircle, FileUp } from "lucide-react";
import { Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

type Inputs = {
  name: string;
  expectedCheckIn: string;
  expectedCheckOut: string;
  totalClasses: number;
  dayOfWeek: string;
};

const daysOfWeek = [
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
    { value: "0", label: "Sunday" },
];

function SubjectForm({ subject, onSave, onDone }: { subject?: Subject, onSave: (data: any) => void, onDone: () => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      name: subject?.name || "",
      expectedCheckIn: subject?.expectedCheckIn || "09:00",
      expectedCheckOut: subject?.expectedCheckOut || "17:00",
      totalClasses: subject?.totalClasses || 20,
      dayOfWeek: subject?.dayOfWeek?.toString() || "1",
    }
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onSave({ ...subject, ...data, totalClasses: Number(data.totalClasses), dayOfWeek: Number(data.dayOfWeek) });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Subject Name</Label>
        <Input id="name" {...register("name", { required: "Subject name is required" })} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="expectedCheckIn">Expected Check-in</Label>
            <Input id="expectedCheckIn" type="time" {...register("expectedCheckIn", { required: true })} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="expectedCheckOut">Expected Check-out</Label>
            <Input id="expectedCheckOut" type="time" {...register("expectedCheckOut", { required: true })} />
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="dayOfWeek">Day of Week</Label>
        <Controller
            name="dayOfWeek"
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                        {daysOfWeek.map(day => (
                            <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="totalClasses">Total Classes</Label>
        <Input id="totalClasses" type="number" {...register("totalClasses", { required: "Total classes is required", min: 1 })} />
        {errors.totalClasses && <p className="text-sm text-destructive">{errors.totalClasses.message}</p>}
      </div>
      <DialogFooter>
        <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  )
}

function UploadDialog({ onDone }: { onDone: () => void }) {
    const { bulkAddSubjects } = useAppContext();
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) {
            toast({ title: "No file selected", variant: "destructive" });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split('\n').filter(line => line.trim() !== '');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const requiredHeaders = ['name', 'checkIn', 'checkOut', 'totalClasses', 'dayOfWeek'];
                
                if(!requiredHeaders.every(h => headers.includes(h))) {
                    toast({ title: "Invalid CSV format", description: `File must have headers: ${requiredHeaders.join(', ')}`, variant: "destructive"});
                    return;
                }
                
                const newSubjects: Omit<Subject, 'id'>[] = [];
                for(let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    const day = daysOfWeek.find(d => d.label.toLowerCase() === values[4].toLowerCase());
                    
                    if(!day) {
                        toast({ title: "Invalid Day", description: `Day "${values[4]}" on line ${i+1} is not valid.`, variant: "destructive" });
                        continue;
                    }

                    newSubjects.push({
                        name: values[0],
                        expectedCheckIn: values[1],
                        expectedCheckOut: values[2],
                        totalClasses: parseInt(values[3]),
                        dayOfWeek: parseInt(day.value)
                    });
                }
                bulkAddSubjects(newSubjects);
                onDone();
            } catch (error) {
                console.error("Error parsing CSV: ", error);
                toast({ title: "Error parsing file", description: "Please check the file format and content.", variant: "destructive" });
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="timetable-file">Upload CSV File</Label>
                    <Input id="timetable-file" type="file" accept=".csv" onChange={handleFileChange} />
                    <p className="text-xs text-muted-foreground">
                        CSV headers: name,checkIn,checkOut,totalClasses,dayOfWeek
                    </p>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleUpload}>Upload and Save</Button>
            </DialogFooter>
        </>
    );
}

export function SubjectsSettings() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppContext();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<string | null>(null);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Manage Subjects</CardTitle>
                <CardDescription>Add, edit, or remove your subjects.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><FileUp className="mr-2 h-4 w-4"/> Upload Timetable</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Timetable from CSV</DialogTitle>
                            <DialogDescription>Select a CSV file to bulk-import subjects. The file should contain specific headers.</DialogDescription>
                        </DialogHeader>
                        <UploadDialog onDone={() => setUploadDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
                <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Subject</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Subject</DialogTitle>
                            <DialogDescription>Enter the details for your new subject.</DialogDescription>
                        </DialogHeader>
                        <SubjectForm onSave={addSubject} onDone={() => setAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold">{subject.name}</p>
                <p className="text-sm text-muted-foreground">
                  {daysOfWeek.find(d => d.value === subject.dayOfWeek?.toString())?.label || 'No day set'} | {subject.expectedCheckIn} - {subject.expectedCheckOut} | {subject.totalClasses} classes
                </p>
              </div>
              <div className="flex gap-2">
              <Dialog open={isEditDialogOpen === subject.id} onOpenChange={(isOpen) => setEditDialogOpen(isOpen ? subject.id : null)}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Subject</DialogTitle>
                        <DialogDescription>Update the details for {subject.name}.</DialogDescription>
                    </DialogHeader>
                    <SubjectForm subject={subject} onSave={updateSubject} onDone={() => setEditDialogOpen(null)} />
                </DialogContent>
              </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the subject &quot;{subject.name}&quot; and all its attendance records. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteSubject(subject.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No subjects added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
