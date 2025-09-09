
"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldQuestion } from "lucide-react";
import type { OtpData } from "@/lib/types";

type NewCodeForm = { currentCode: string, newCode: string, otp: string };

function ChangeCodeDialog() {
    const { adminMode, adminCode, updateAdminCode, requestOtp, otpData, clearOtp } = useAppContext();
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewCodeForm>();
    const [isChangeCodeOpen, setChangeCodeOpen] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!otpData) {
            setTimeLeft(0);
            return;
        }

        const expiryTime = new Date(otpData.expiry).getTime();
        const now = new Date().getTime();
        const remaining = Math.round((expiryTime - now) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);

        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => {
            clearInterval(timer);
        };

    }, [otpData]);
    
    useEffect(() => {
        if (!isChangeCodeOpen) {
            // Cleanup when dialog closes
            clearOtp();
            reset();
            setIsRequestingOtp(false);
        }
    }, [isChangeCodeOpen, clearOtp, reset]);

    const handleRequestOtp = async () => {
        setIsRequestingOtp(true);
        try {
            await requestOtp();
        } catch (error) {
            toast({ title: "OTP Request Failed", description: "Could not generate an OTP. Please try again.", variant: "destructive" });
        } finally {
            setIsRequestingOtp(false);
        }
    };

    const onSubmitNewCode: SubmitHandler<NewCodeForm> = (data) => {
        if (data.currentCode !== adminCode) {
            toast({ title: "Incorrect Current Code", description: "The current code you entered is wrong.", variant: "destructive"});
            return;
        }
        const success = updateAdminCode(data.newCode, data.otp);
        if(success) {
            reset();
            setChangeCodeOpen(false);
        }
    };

    return (
        <Dialog open={isChangeCodeOpen} onOpenChange={setChangeCodeOpen}>
            <DialogTrigger asChild>
                <Button disabled={!adminMode}>
                    {adminMode ? 'Change Code' : 'Unlock to Change'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Security Code</DialogTitle>
                    <DialogDescription>
                        For security, please verify your identity with an OTP.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitNewCode)} className="space-y-4">
                    {!otpData ? (
                        <Button onClick={handleRequestOtp} disabled={isRequestingOtp} className="w-full">
                            {isRequestingOtp ? <Loader2 className="animate-spin" /> : "Send OTP"}
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <Alert>
                                <ShieldQuestion className="h-4 w-4" />
                                <AlertTitle>OTP Sent (Simulated)</AlertTitle>
                                <AlertDescription>
                                    <p className="font-mono text-sm">{otpData.message}</p>
                                    {timeLeft > 0 ? (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Expires in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-status-red mt-2">OTP has expired. Please request a new one.</p>
                                    )}
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="6-digit code"
                                    {...register("otp", { required: true, pattern: /^\d{6}$/ })}
                                />
                                {errors.otp && <p className="text-sm text-destructive">OTP must be 6 digits.</p>}
                            </div>

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
                        </div>
                    )}
                    
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={!otpData || timeLeft <= 0}>Set New Code</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function AdminSettings() {
  const { adminMode, setAdminMode, adminCode } = useAppContext();
  const { toast } = useToast();
  const [enterCode, setEnterCode] = useState("");
  
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

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Admin Mode</CardTitle>
                <CardDescription>
                Enable admin mode to modify all data. Default code is 0000.
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
                Set a new 4-digit security code for admin mode after OTP verification.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChangeCodeDialog />
            </CardContent>
        </Card>
    </div>
  );
}

    
