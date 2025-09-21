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
import type { School } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "School name must be at least 2 characters." }),
});

interface SchoolFormDialogProps {
  school?: School;
  onDone: () => void;
}

export function SchoolFormDialog({ school, onDone }: SchoolFormDialogProps) {
  const { addSchool, updateSchool } = useAppContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: school?.name || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (school) {
      updateSchool({ ...school, ...values });
    } else {
      addSchool(values);
    }
    onDone();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., School of Engineering" {...field} />
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
