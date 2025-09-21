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
        if (pathname === '/select-role' || pathname === '/') {
            router.replace('/dashboard');
        }
      } else if (pathname !== '/select-role') {
          router.replace('/select-role');
      }
    }
  }, [isLoaded, mode, pathname, router]);

  if (!isLoaded || (!mode && pathname !== '/select-role')) {
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
