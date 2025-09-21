"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppContext } from "@/contexts/app-context";
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
import { useToast } from "@/hooks/use-toast";

const securitySchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
});

type SecurityFormInputs = z.infer<typeof securitySchema>;

export function SecuritySettings() {
  const { userDetails } = useAppContext();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SecurityFormInputs>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
    }
  });

  const onSubmit: SubmitHandler<SecurityFormInputs> = (data) => {
    // This is a placeholder for password change logic.
    // In a real app, you would integrate with an authentication service.
    toast({
        title: "Password Updated (Simulated)",
        description: "Your password has been changed.",
    });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Update your password here. Your User ID is your roll number and cannot be changed here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="userId">User ID (Roll Number)</Label>
                <Input id="userId" value={userDetails.rollNo} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" {...register("currentPassword")} placeholder="Enter your current password to make changes"/>
                {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
            </div>
            
            <div className="flex justify-end">
                <Button type="submit">Update Password</Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
