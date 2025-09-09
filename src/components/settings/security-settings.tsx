
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const securitySchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newUserId: z.string().min(4, "User ID must be at least 4 characters."),
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
});

type SecurityFormInputs = z.infer<typeof securitySchema>;

export function SecuritySettings() {
  const { userCredentials, updateUserCredentials } = useAppContext();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SecurityFormInputs>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
        currentPassword: "",
        newUserId: userCredentials.userId,
        newPassword: "",
    }
  });

  const onSubmit: SubmitHandler<SecurityFormInputs> = (data) => {
    if (data.currentPassword !== userCredentials.password) {
        toast({
            title: "Incorrect Password",
            description: "The current password you entered is incorrect.",
            variant: "destructive",
        });
        return;
    }

    const success = updateUserCredentials({
        userId: data.newUserId,
        password: data.newPassword,
    });
    
    if (success) {
        reset({
            currentPassword: "",
            newUserId: data.newUserId,
            newPassword: "",
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Update your User ID and password here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Developer Note</AlertTitle>
          <AlertDescription>
            This is a prototype. User credentials are saved in your browser's local storage and are not managed by a backend authentication server.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="newUserId">User ID</Label>
                <Input id="newUserId" {...register("newUserId")} />
                {errors.newUserId && <p className="text-sm text-destructive">{errors.newUserId.message}</p>}
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
                <Button type="submit">Update Credentials</Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
