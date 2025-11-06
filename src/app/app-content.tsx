"use client";

import type { ReactNode } from "react";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { Icons } from "@/components/icons";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

export function AppContent({ children }: { children: ReactNode }) {
  const { isLoaded, mode } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (mode) {
        // If logged in, and on a non-app page, go to dashboard.
        const isAppPage = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/schools') ||
                          pathname.startsWith('/students') ||
                          pathname.startsWith('/faculty') ||
                          pathname.startsWith('/profile') ||
                          pathname.startsWith('/settings') ||
                          pathname.startsWith('/attendance') ||
                          pathname.startsWith('/attendance-visuals') ||
                          pathname.startsWith('/subjects');

        if (pathname === '/select-role' || pathname === '/') {
            router.replace('/dashboard');
        } else if (mode === 'faculty' && !isAppPage) {
            // This handles cases where a faculty user might land on a student-only URL
            // and avoids a 404 by redirecting them.
            router.replace('/dashboard');
        }

      } else if (pathname !== '/select-role' && pathname !== '/') {
        // If not logged in, and not on the select-role page, redirect there.
        // Added check for '/' to prevent redirect loops on the root page before redirection.
        router.replace('/select-role');
      }
    }
  }, [isLoaded, mode, pathname, router]);

  if (!isLoaded || (!mode && pathname !== '/select-role' && pathname !== '/')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center space-y-2">
            <Icons.logo className="h-16 w-16 text-primary mx-auto animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (pathname === '/select-role') {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
