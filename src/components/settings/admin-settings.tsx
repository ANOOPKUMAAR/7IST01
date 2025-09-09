
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock } from "lucide-react";

type NewCodeForm = { currentCode: string, newCode: string };

function ChangeCodeDialog() {
    const { adminMode, updateAdminCode } = useAppContext();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewCodeForm>();
    const [isChangeCodeOpen, setChangeCodeOpen] = useState(false);

    const onSubmitNewCode: SubmitHandler<NewCodeForm> = (data) => {
        const success = updateAdminCode(data.currentCode, data.newCode);
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
                        Enter your current and new 4-digit security codes.
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
    )
}

export function AdminSettings() {
  const { adminMode, setAdminMode, adminCode } = useAppContext();
  const { toast } = useToast();
  const [enterCode, setEnterCode] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (enterCode.length === 4) {
        if (enterCode === adminCode) {
            setAdminMode(true);
            toast({ title: "Admin Mode Enabled" });
            setError("");
            setEnterCode("");
        } else {
            setError("Incorrect code. Please try again.");
            setEnterCode("");
        }
    } else if (error && enterCode.length > 0) {
        setError("");
    }
  }, [enterCode, adminCode, setAdminMode, toast, error]);

  const handleLockAdminMode = () => {
    setAdminMode(false);
    toast({ title: "Admin Mode Disabled" });
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Admin Mode</CardTitle>
                <CardDescription>
                {adminMode ? "Admin mode is currently enabled." : "Enter the 4-digit code to enable admin mode."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {adminMode ? (
                    <Button onClick={handleLockAdminMode} variant="destructive">
                        <Lock className="mr-2 h-4 w-4" /> Lock Admin Mode
                    </Button>
                ) : (
                    <div className="max-w-xs space-y-2">
                        <Label htmlFor="admin-code-input">Security Code</Label>
                        <Input
                            id="admin-code-input"
                            type="password"
                            maxLength={4}
                            placeholder="****"
                            value={enterCode}
                            onChange={(e) => setEnterCode(e.target.value)}
                            className={error ? "border-destructive" : ""}
                        />
                         {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Change Security Code</CardTitle>
                <CardDescription>
                Set a new 4-digit security code for admin mode. Default code is 0000.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChangeCodeDialog />
            </CardContent>
        </Card>
    </div>
  );
}
