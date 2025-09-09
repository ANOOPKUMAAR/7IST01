
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';
import { Icons } from '@/components/icons';

export default function HomePage() {
  const { isLoaded } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // Wait until the app context is loaded before redirecting.
    if (isLoaded) {
      router.replace('/dashboard');
    }
  }, [isLoaded, router]);

  // Show a loading indicator while the context is loading and we're waiting to redirect.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <Icons.logo className="h-24 w-24 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
