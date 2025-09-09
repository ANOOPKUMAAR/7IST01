
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { UserCredentials } from "@/lib/types";

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  rollNo: z.string().min(1, "Roll number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Inputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { registerUser } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    const success = registerUser(data);
    if (success) {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      });
      router.push('/login');
    } else {
      toast({
        title: "Registration Failed",
        description: "A user with this roll number already exists.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to get started.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll Number</Label>
            <Input id="rollNo" {...register("rollNo")} />
            {errors.rollNo && <p className="text-sm text-destructive">{errors.rollNo.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 animate-spin" />}
            Register
          </Button>
           <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
