"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { Header } from "@/components/header";
import { Icons } from "@/components/icons";
import { BottomNav } from "@/components/bottom-nav";

export function AppContent({ children }: { children: ReactNode }) {
  const { isLoaded, mode } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && mode) {
        if (pathname === '/select-role' || pathname === '/') {
            router.replace('/dashboard');
        }
    }
  }, [isLoaded, mode, pathname, router]);

  if (!isLoaded && pathname !== '/select-role') {
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
  
  if (!mode) return null;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 mb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
