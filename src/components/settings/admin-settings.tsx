
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
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
import { Lock, Unlock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type ChangeCodeForm = {
    currentCode: string;
    newCode: string;
};

export function AdminSettings() {
  const { adminMode, setAdminMode, updateAdminCode } = useAppContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangeCodeForm>();
  const { toast } = useToast();

  const onSubmitChangeCode: SubmitHandler<ChangeCodeForm> = (data) => {
    const success = updateAdminCode(data.currentCode, data.newCode);
    if (success) {
      toast({
        title: "Security Code Changed",
        description: "Your new security code has been set.",
      });
      reset();
    } else {
      toast({
        title: "Incorrect Current Code",
        description: "The current security code you entered is incorrect.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Admin Mode Toggle</CardTitle>
                <CardDescription>
                Enable admin mode to make changes to subjects, profiles, and other settings. You will be prompted for the security code when performing admin actions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="admin-mode-switch"
                        checked={adminMode}
                        onCheckedChange={setAdminMode}
                    />
                    <Label htmlFor="admin-mode-switch">{adminMode ? "Admin Mode is ON" : "Admin Mode is OFF"}</Label>
                    {adminMode ? <Unlock className="h-4 w-4 text-status-green" /> : <Lock className="h-4 w-4 text-status-red" />}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Change Security Code</CardTitle>
                <CardDescription>
                Set a new 4-digit security code. The default code is 0000.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmitChangeCode)} className="space-y-4 max-w-sm">
                    <div className="space-y-2">
                        <Label htmlFor="currentCode">Current Code</Label>
                        <Input 
                            id="currentCode" 
                            type="password" 
                            maxLength={4}
                            placeholder="Enter current 4-digit code"
                            {...register("currentCode", { required: "Current code is required.", pattern: { value: /^\d{4}$/, message: "Code must be 4 digits." } })}
                        />
                        {errors.currentCode && <p className="text-sm text-destructive">{errors.currentCode.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newCode">New Code</Label>
                        <Input 
                            id="newCode" 
                            type="password" 
                            maxLength={4}
                            placeholder="Enter new 4-digit code"
                            {...register("newCode", { required: "New code is required.", pattern: { value: /^\d{4}$/, message: "Code must be 4 digits." } })}
                        />
                        {errors.newCode && <p className="text-sm text-destructive">{errors.newCode.message}</p>}
                    </div>
                    <Button type="submit">Set New Code</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
