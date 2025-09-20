
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/app-context";
import type { Department } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Department name must be at least 2 characters." }),
  hod: z.string().min(2, { message: "HOD name must be at least 2 characters." }),
});

interface DepartmentFormDialogProps {
  schoolId: string;
  programId: string;
  department?: Department;
  onDone: () => void;
}

export function DepartmentFormDialog({ schoolId, programId, department, onDone }: DepartmentFormDialogProps) {
  const { addDepartment, updateDepartment } = useAppContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
      hod: department?.hod || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (department) {
      updateDepartment(schoolId, programId, { ...department, ...values });
    } else {
      addDepartment(schoolId, programId, values);
    }
    onDone();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Undergraduate Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Head of Department (HOD)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. Alan Turing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
