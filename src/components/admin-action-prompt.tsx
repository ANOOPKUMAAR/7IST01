
"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AdminActionPromptProps {
  children: React.ReactNode;
  onExecute: () => void;
}

export function AdminActionPrompt({ children, onExecute }: AdminActionPromptProps) {
  const { adminMode, adminCode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const { toast } = useToast();

  const handleAction = () => {
    if (!adminMode) {
      setIsOpen(true);
    } else {
      onExecute();
    }
  };

  const handleVerify = () => {
    if (enteredCode === adminCode) {
      setIsOpen(false);
      setEnteredCode("");
      onExecute();
    } else {
      toast({
        title: "Incorrect Security Code",
        variant: "destructive",
      });
      setEnteredCode("");
    }
  };

  return (
    <>
      <div onClick={handleAction}>
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Action Required</DialogTitle>
            <DialogDescription>
              Please enter the 4-digit security code to proceed with this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="security-code">Security Code</Label>
            <Input
              id="security-code"
              type="password"
              maxLength={4}
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleVerify}>Verify and Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
