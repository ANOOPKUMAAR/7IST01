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
import type { Class } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Class name is required." }),
  coordinator: z.string().min(2, { message: "Coordinator name is required." }),
  day: z.string().min(1, "Day is required."),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
});

interface ClassFormDialogProps {
  schoolId: string;
  programId: string;
  departmentId: string;
  cls?: Class;
  onDone: () => void;
}

export function ClassFormDialog({ schoolId, programId, departmentId, cls, onDone }: ClassFormDialogProps) {
  const { addClass, updateClass } = useAppContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cls?.name || "",
      coordinator: cls?.coordinator || "",
      day: cls?.day || "Monday",
      startTime: cls?.startTime || "09:00",
      endTime: cls?.endTime || "10:00",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (cls) {
      updateClass(schoolId, programId, departmentId, { ...cls, ...values });
    } else {
      addClass(schoolId, programId, departmentId, values);
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
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Programming" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coordinator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordinator</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Prof. Ada Lovelace" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Day</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Monday" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
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
