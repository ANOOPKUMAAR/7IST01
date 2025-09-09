
"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type AdminCodeForm = { code: string };
type NewCodeForm = { newCode: string };

export function AdminSettings() {
  const { adminMode, setAdminMode, adminCode, updateAdminCode } = useAppContext();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewCodeForm>();

  const handleAdminSwitch = (isEnteringAdmin: boolean) => {
    if (isEnteringAdmin) {
        if (code === adminCode) {
            setAdminMode(true);
            toast({ title: "Admin Mode Enabled" });
            return true; // close dialog
        } else {
            toast({ title: "Incorrect Code", variant: "destructive" });
            return false; // keep dialog open
        }
    } else {
        setAdminMode(false);
        toast({ title: "Admin Mode Disabled" });
    }
  };

  const onSubmitNewCode: SubmitHandler<NewCodeForm> = (data) => {
    const success = updateAdminCode(data.newCode);
    if(success) {
        reset();
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Admin Mode</CardTitle>
                <CardDescription>
                Enable admin mode to modify all data. Default code is 1234.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Switch
                                id="admin-mode"
                                checked={adminMode}
                                // onCheckedChange is handled by the dialog
                                onClick={(e) => {
                                    if (adminMode) {
                                        e.preventDefault();
                                        handleAdminSwitch(false);
                                    }
                                }}
                            />
                        </AlertDialogTrigger>
                        <Label htmlFor="admin-mode">Enable Admin Mode</Label>

                        {!adminMode && (
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Enter Security Code</AlertDialogTitle>
                                <AlertDialogDescription>
                                    To enable admin mode, please enter the 4-digit security code.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Input
                                type="password"
                                maxLength={4}
                                placeholder="****"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setCode("")}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={(e) => {
                                    if (!handleAdminSwitch(true)) {
                                        e.preventDefault(); // Prevent dialog from closing on failure
                                    } else {
                                        setCode("");
                                    }
                                }}>
                                    Unlock
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        )}
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Change Security Code</CardTitle>
                <CardDescription>
                Set a new 4-digit security code for admin mode.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmitNewCode)} className="flex gap-2">
                    <div className="flex-grow space-y-2">
                        <Label htmlFor="newCode" className="sr-only">New Code</Label>
                        <Input 
                            id="newCode" 
                            type="password" 
                            placeholder="Enter new 4-digit code"
                            {...register("newCode", { required: true, pattern: /^\d{4}$/ })}
                        />
                        {errors.newCode && <p className="text-sm text-destructive">Code must be 4 digits.</p>}
                    </div>
                    <Button type="submit" disabled={!adminMode}>
                        {adminMode ? 'Set New Code' : 'Unlock to Change'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
