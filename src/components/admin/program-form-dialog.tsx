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
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/app-context";
import type { Program } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Program name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

interface ProgramFormDialogProps {
  schoolId: string;
  program?: Program;
  onDone: () => void;
}

export function ProgramFormDialog({ schoolId, program, onDone }: ProgramFormDialogProps) {
  const { addProgram, updateProgram } = useAppContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: program?.name || "",
      description: program?.description || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (program) {
      updateProgram(schoolId, { ...program, ...values });
    } else {
      addProgram(schoolId, values);
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
              <FormLabel>Program Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., B.Tech in Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a brief description of the program." {...field} />
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
