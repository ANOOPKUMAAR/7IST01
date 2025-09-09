
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';
import { Icons } from '@/components/icons';

export default function HomePage() {
  const { isLoaded, isLoggedIn } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isLoggedIn) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoaded, isLoggedIn, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <Icons.logo className="h-24 w-24 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
