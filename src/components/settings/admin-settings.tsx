
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type NewCodeForm = { currentCode: string, newCode: string };

export function AdminSettings() {
  const { adminMode, setAdminMode, adminCode, updateAdminCode } = useAppContext();
  const { toast } = useToast();
  const [enterCode, setEnterCode] = useState("");
  const [isChangeCodeOpen, setChangeCodeOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewCodeForm>();

  const handleAdminSwitch = (isEnteringAdmin: boolean) => {
    if (isEnteringAdmin) {
        if (enterCode === adminCode) {
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
    if (data.currentCode !== adminCode) {
        toast({ title: "Incorrect Current Code", description: "The current code you entered is wrong.", variant: "destructive"});
        return;
    }
    const success = updateAdminCode(data.newCode);
    if(success) {
        reset();
        setChangeCodeOpen(false);
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
                                value={enterCode}
                                onChange={(e) => setEnterCode(e.target.value)}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setEnterCode("")}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={(e) => {
                                    if (!handleAdminSwitch(true)) {
                                        e.preventDefault(); // Prevent dialog from closing on failure
                                    } else {
                                        setEnterCode("");
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
                <Dialog open={isChangeCodeOpen} onOpenChange={setChangeCodeOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={!adminMode}>
                            {adminMode ? 'Change Code' : 'Unlock to Change'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change Security Code</DialogTitle>
                            <DialogDescription>
                                Enter your current code and a new 4-digit code.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmitNewCode)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentCode">Current Code</Label>
                                <Input 
                                    id="currentCode" 
                                    type="password" 
                                    placeholder="Enter current code"
                                    {...register("currentCode", { required: true, pattern: /^\d{4}$/ })}
                                />
                                {errors.currentCode && <p className="text-sm text-destructive">Current code must be 4 digits.</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newCode">New Code</Label>
                                <Input 
                                    id="newCode" 
                                    type="password" 
                                    placeholder="Enter new 4-digit code"
                                    {...register("newCode", { required: true, pattern: /^\d{4}$/ })}
                                />
                                {errors.newCode && <p className="text-sm text-destructive">New code must be 4 digits.</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Set New Code</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    </div>
  );
}
