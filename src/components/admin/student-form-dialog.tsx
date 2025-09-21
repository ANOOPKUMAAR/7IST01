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
import type { Student } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  rollNo: z.string().min(2, "Roll number is required."),
  program: z.string().min(2, "Program is required."),
  branch: z.string().min(2, "Branch is required."),
  department: z.string().min(2, "Department is required."),
  section: z.string().min(1, "Section is required."),
  phone: z.string().optional(),
  parentName: z.string().optional(),
  address: z.string().optional(),
});

interface StudentFormDialogProps {
  student?: Student;
  onDone: () => void;
}

export function StudentFormDialog({
  student,
  onDone,
}: StudentFormDialogProps) {
  const { addStudent, updateStudent } = useAppContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student?.name || "",
      rollNo: student?.rollNo || "",
      program: student?.program || "Bachelor of Technology",
      branch: student?.branch || "Computer Science",
      department: student?.department || "Engineering",
      section: student?.section || "A",
      phone: student?.phone || "",
      parentName: student?.parentName || "",
      address: student?.address || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dataWithAvatar = {
        ...values,
        avatar: `https://picsum.photos/seed/${values.rollNo}/200`,
        deviceId: student?.deviceId || ''
    };

    if (student) {
      updateStudent({ ...student, ...dataWithAvatar });
    } else {
      addStudent(dataWithAvatar);
    }
    onDone();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rollNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2023CS001" {...field} disabled={!!student} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bachelor of Technology" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
