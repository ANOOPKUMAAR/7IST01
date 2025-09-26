"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppContext } from '@/contexts/app-context';
import type { UserMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { capitalize } from '@/lib/utils';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormInputs = z.infer<typeof formSchema>;

interface LoginFormProps {
  role: UserMode;
}

export function LoginForm({ role }: LoginFormProps) {
  const { login } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const getUsernameLabel = () => {
    switch (role) {
      case 'student':
        return 'Roll Number';
      case 'faculty':
        return 'Email';
      case 'admin':
        return 'Admin Username';
      default:
        return 'Username';
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    setIsLoading(true);
    const success = login(role, data.username, data.password);
    if (!success) {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{capitalize(role)} Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{getUsernameLabel()}</Label>
            <Input
              id="username"
              placeholder={
                role === 'student'
                  ? 'e.g., 20221IST0001'
                  : role === 'faculty'
                  ? 'e.g., ada.lovelace@example.com'
                  : 'admin'
              }
              {...register('username')}
              autoComplete="username"
            />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              autoComplete="current-password"
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
             <p className="text-xs text-muted-foreground pt-1">
                Hint: Use 'password' for any student/faculty, and 'admin'/'admin' for the admin.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : `Login as ${capitalize(role)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
