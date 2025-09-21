"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { Faculty } from "@/lib/types";

interface AssignClassDialogProps {
  faculty: Faculty;
  onDone: () => void;
}

export function AssignClassDialog({ faculty, onDone }: AssignClassDialogProps) {
  const { schools, programsBySchool, addFacultyToClassById } = useAppContext();
  const { toast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const allClassOptions = useMemo(() => {
    const options: { label: string; value: string; group: string }[] = [];
    schools.forEach(school => {
        const programs = programsBySchool[school.id] || [];
        programs.forEach(program => {
            program.departments.forEach(department => {
                department.classes.forEach(cls => {
                    options.push({
                        label: `${program.name} > ${department.name} > ${cls.name}`,
                        value: cls.id,
                        group: school.name,
                    });
                });
            });
        });
    });
    
    // Group by school name
    const groupedOptions: Record<string, {label: string, value: string}[]> = {};
    options.forEach(option => {
        if (!groupedOptions[option.group]) {
            groupedOptions[option.group] = [];
        }
        groupedOptions[option.group].push({ label: option.label, value: option.value });
    });

    return groupedOptions;
  }, [schools, programsBySchool]);


  const handleAssign = () => {
    if (!selectedClassId) {
      toast({ title: "No class selected", variant: "destructive" });
      return;
    }
    addFacultyToClassById(selectedClassId, faculty.id);
    onDone();
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
            <Select onValueChange={setSelectedClassId}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a class to assign..." />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(allClassOptions).map(([schoolName, classes]) => (
                        <SelectGroup key={schoolName}>
                            <SelectLabel>{schoolName}</SelectLabel>
                            {classes.map(cls => (
                                <SelectItem key={cls.value} value={cls.value}>
                                    {cls.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleAssign} disabled={!selectedClassId}>
            Assign Class
        </Button>
      </DialogFooter>
    </>
  );
}
